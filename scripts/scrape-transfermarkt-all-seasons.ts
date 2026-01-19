import * as fs from 'fs';
import * as path from 'path';

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  sourceCountry: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  transferType: 'permanent' | 'loan' | 'free';
  season: string; // e.g., "24/25"
  year: number; // e.g., 2024
}

interface SeasonData {
  season: string;
  year: number;
  transfers: TransferRecord[];
  totalSpend: number;
  totalIncome: number;
  arrivalCount: number;
  departureCount: number;
}

// Parse currency value from string like "€12.00m", "€850k", "free transfer", "-"
function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || valueStr.toLowerCase().includes('loan')) {
    return 0;
  }
  
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  
  if (cleaned.includes('m')) {
    return parseFloat(cleaned.replace('m', '')) * 1000000;
  } else if (cleaned.includes('k')) {
    return parseFloat(cleaned.replace('k', '')) * 1000;
  } else if (cleaned.includes('th')) {
    return parseFloat(cleaned.replace('th', '')) * 1000;
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Parse a row name string like: "Myrto Uzuni M. Uzuni 29 LW €5.00m Granada CF €12.00m"
function parseRowName(rowName: string, mlsTeam: string, season: string, year: number): TransferRecord | null {
  // Skip rows that don't look like transfer rows
  if (!rowName || !rowName.includes('€') || rowName.includes('Market value')) {
    return null;
  }

  // Pattern: Full Name Short Name Age Position MarketValue SourceClub Fee
  // Example: "Myrto Uzuni M. Uzuni 29 LW €5.00m Granada CF €12.00m"
  // Example: "Djé D'Avilla D. D'Avilla 21 DM €500k Leiria €4.00m"
  
  // Find all €values in the string
  const euroMatches = rowName.match(/€[\d.]+[mkMK]?/g);
  if (!euroMatches || euroMatches.length < 2) {
    return null;
  }
  
  const marketValueStr = euroMatches[0];
  const feeStr = euroMatches[euroMatches.length - 1];
  
  // Find position (common positions)
  const positions = ['GK', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'CF', 'SS', 'SW', 'LM', 'RM'];
  let position = '';
  let positionIndex = -1;
  
  for (const pos of positions) {
    const idx = rowName.indexOf(` ${pos} `);
    if (idx !== -1) {
      position = pos;
      positionIndex = idx;
      break;
    }
  }
  
  if (!position) {
    // Try to find position at end of name section before market value
    const marketValueIndex = rowName.indexOf(marketValueStr);
    const beforeMarketValue = rowName.substring(0, marketValueIndex).trim();
    const parts = beforeMarketValue.split(' ');
    for (let i = parts.length - 1; i >= 0; i--) {
      if (positions.includes(parts[i])) {
        position = parts[i];
        positionIndex = rowName.lastIndexOf(` ${parts[i]} `);
        break;
      }
    }
  }
  
  if (!position) {
    return null;
  }
  
  // Find age (number before position)
  const beforePosition = rowName.substring(0, positionIndex).trim();
  const ageParts = beforePosition.split(' ');
  let age = 0;
  let ageIndex = -1;
  
  for (let i = ageParts.length - 1; i >= 0; i--) {
    const num = parseInt(ageParts[i]);
    if (!isNaN(num) && num >= 15 && num <= 45) {
      age = num;
      ageIndex = i;
      break;
    }
  }
  
  if (age === 0) {
    return null;
  }
  
  // Player name is everything before age
  const nameParts = ageParts.slice(0, ageIndex);
  // The full name is typically followed by a short name - we want the full name
  // Pattern is usually: "Full Name F. Name" - find where short name starts
  let playerName = nameParts.join(' ');
  
  // Try to find a pattern like "FirstName LastName F. LastName"
  for (let i = nameParts.length - 1; i >= 1; i--) {
    if (nameParts[i].length <= 3 && nameParts[i].includes('.')) {
      // This looks like the start of the short name
      playerName = nameParts.slice(0, i).join(' ');
      break;
    }
  }
  
  // Source club is between market value and fee
  const marketValueIndex = rowName.indexOf(marketValueStr);
  const feeIndex = rowName.lastIndexOf(feeStr);
  
  let sourceClub = rowName.substring(marketValueIndex + marketValueStr.length, feeIndex).trim();
  
  // Determine transfer type
  let transferType: 'permanent' | 'loan' | 'free' = 'permanent';
  if (feeStr.toLowerCase().includes('loan') || rowName.toLowerCase().includes('loan')) {
    transferType = 'loan';
  } else if (parseValue(feeStr) === 0) {
    transferType = 'free';
  }
  
  return {
    playerName: playerName.trim(),
    age,
    position,
    marketValue: parseValue(marketValueStr),
    sourceClub: sourceClub.trim(),
    sourceCountry: '', // Will need to be filled in separately
    fee: parseValue(feeStr),
    feeDisplay: feeStr,
    mlsTeam: mlsTeam,
    transferType,
    season,
    year
  };
}

// This function will be called by the browser scraper
async function parseSnapshotFile(snapshotPath: string, season: string, year: number): Promise<TransferRecord[]> {
  const content = fs.readFileSync(snapshotPath, 'utf-8');
  const lines = content.split('\n');
  
  const transfers: TransferRecord[] = [];
  let currentTeam = '';
  
  // Track team headers - looking for patterns like "Arrivals Chicago Fire FC"
  const teamPattern = /Arrival .*?(?:FC|CF|SC|United|City|Sounders|Timbers|Galaxy|Revolution|Dynamo|Whitecaps|Rapids|Fire|Crew|Union|Real Salt Lake)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for team header
    if (line.includes('Arrival')) {
      const teamMatch = line.match(/Arrival\s+([^$]+?)(?:\s+Total|$)/i);
      if (teamMatch) {
        currentTeam = teamMatch[1].trim();
      }
    }
    
    // Check for heading with team name
    if (line.includes('role: heading') && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (nextLine.includes('name:')) {
        const teamMatch = nextLine.match(/name:\s*(.+?)(?:\s*$)/);
        if (teamMatch) {
          const possibleTeam = teamMatch[1].trim();
          // Check if it's an MLS team name
          if (possibleTeam.match(/(?:FC|CF|SC|United|City|Sounders|Timbers|Galaxy|Revolution|Dynamo|Whitecaps|Rapids|Fire|Crew|Union|Real Salt Lake|Inter Miami|Austin|Nashville|Charlotte|Cincinnati|Montreal|Toronto|Seattle|Portland|Houston|Dallas|San Jose|San Diego|Minnesota|Los Angeles|New York|New England|Philadelphia|Atlanta|Orlando|Columbus|DC|Colorado|Sporting Kansas|Vancouver)/i)) {
            currentTeam = possibleTeam;
          }
        }
      }
    }
    
    // Check for player row
    if (line.includes('role: row')) {
      // Look at next line for name
      if (i + 1 < lines.length) {
        const nameLine = lines[i + 1];
        if (nameLine.includes('name:') && nameLine.includes('€')) {
          const nameMatch = nameLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (nameMatch) {
            const rowName = nameMatch[1];
            const transfer = parseRowName(rowName, currentTeam, season, year);
            if (transfer) {
              transfers.push(transfer);
            }
          }
        }
      }
    }
  }
  
  console.log(`Parsed ${transfers.length} transfers for season ${season}`);
  return transfers;
}

// Main function - will process existing snapshot files
async function main() {
  const browserLogsDir = '/Users/derekensing/.cursor/browser-logs';
  const outputDir = '/Users/derekensing/projects/austin-fc-gm/data';
  
  // For now, process the latest snapshot we have
  const latestSnapshot = path.join(browserLogsDir, 'snapshot-2026-01-19T18-55-42-879Z.log');
  
  if (fs.existsSync(latestSnapshot)) {
    console.log('Processing snapshot:', latestSnapshot);
    const transfers = await parseSnapshotFile(latestSnapshot, '24/25', 2024);
    
    // Save results
    const output = {
      scrapedAt: new Date().toISOString(),
      season: '24/25',
      year: 2024,
      totalTransfers: transfers.length,
      totalSpend: transfers.reduce((sum, t) => sum + t.fee, 0),
      transfers
    };
    
    fs.writeFileSync(
      path.join(outputDir, 'mls-transfers-2024.json'),
      JSON.stringify(output, null, 2)
    );
    
    console.log('\n=== Summary ===');
    console.log(`Total transfers parsed: ${transfers.length}`);
    console.log(`Total spend: €${(output.totalSpend / 1000000).toFixed(2)}M`);
    
    // Show by team
    const byTeam = new Map<string, number>();
    transfers.forEach(t => {
      const current = byTeam.get(t.mlsTeam) || 0;
      byTeam.set(t.mlsTeam, current + 1);
    });
    
    console.log('\nBy MLS Team:');
    [...byTeam.entries()].sort((a, b) => b[1] - a[1]).forEach(([team, count]) => {
      console.log(`  ${team}: ${count} transfers`);
    });
    
  } else {
    console.log('No snapshot file found. Need to scrape from browser first.');
  }
}

main().catch(console.error);

