const fs = require('fs');
const path = require('path');

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  destinationClub: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free';
  season: string;
  year: number;
  sourceCountry?: string;
}

// Snapshot files for each season
const SNAPSHOTS = [
  { file: 'snapshot-2026-01-20T02-18-14-311Z.log', season: '25/26', year: 2025 },
  { file: 'snapshot-2026-01-19T18-55-42-879Z.log', season: '24/25', year: 2024 },
  { file: 'snapshot-2026-01-19T19-56-29-873Z.log', season: '23/24', year: 2023 },
  { file: 'snapshot-2026-01-19T19-56-50-831Z.log', season: '22/23', year: 2022 },
  { file: 'snapshot-2026-01-19T19-57-05-205Z.log', season: '21/22', year: 2021 },
  { file: 'snapshot-2026-01-19T19-57-16-844Z.log', season: '20/21', year: 2020 },
];

const BROWSER_LOGS_DIR = '/Users/derekensing/.cursor/browser-logs';

// Parse currency value
function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || valueStr.toLowerCase().includes('loan')) {
    return 0;
  }
  
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  
  if (cleaned.includes('m')) {
    return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  } else if (cleaned.includes('k') || cleaned.includes('th')) {
    return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Parse player row name - handles format like:
// "Myrto Uzuni M. Uzuni 29 LW €5.00m Granada CF Spain €12.00m"
// "Sebastián Driussi S. Driussi 28 CF €6.00m River Plate Argentina €9.75m"
function parsePlayerRow(rowName: string, mlsTeam: string, direction: 'arrival' | 'departure', season: string, year: number): TransferRecord | null {
  if (!rowName || !rowName.includes('€')) return null;
  
  // Skip header rows
  if (rowName.includes('Player') || rowName.includes('Market value') || rowName.includes('Fee') || rowName.includes('name')) return null;
  
  // Find all euro values
  const euroMatches = rowName.match(/€[\d.,]+[mkMK]?/g);
  if (!euroMatches || euroMatches.length < 1) return null;
  
  const positions = ['GK', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'CF', 'SS', 'SW', 'LM', 'RM'];
  
  // Find position
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
  
  if (!position) return null;
  
  // Extract age (number before position)
  const beforePosition = rowName.substring(0, positionIndex);
  const parts = beforePosition.split(/\s+/);
  let age = 0;
  let ageIndex = -1;
  
  for (let i = parts.length - 1; i >= 0; i--) {
    const num = parseInt(parts[i]);
    if (!isNaN(num) && num >= 15 && num <= 50) {
      age = num;
      ageIndex = i;
      break;
    }
  }
  
  if (age === 0) return null;
  
  // Player name is everything before age, but need to strip short name
  const nameParts = parts.slice(0, ageIndex);
  let playerName = '';
  
  // Find where short name starts (usually has a period like "M." or "S.")
  for (let i = nameParts.length - 1; i >= 1; i--) {
    if (nameParts[i].length <= 3 && nameParts[i].includes('.')) {
      playerName = nameParts.slice(0, i).join(' ');
      break;
    }
  }
  
  if (!playerName) {
    playerName = nameParts.join(' ');
  }
  
  // Market value and fee
  const marketValue = euroMatches.length >= 1 ? parseValue(euroMatches[0]) : 0;
  const fee = euroMatches.length >= 2 ? parseValue(euroMatches[euroMatches.length - 1]) : 0;
  const feeDisplay = euroMatches.length >= 2 ? euroMatches[euroMatches.length - 1] : '€0';
  
  // Source/destination club - between market value and fee
  const marketValueIdx = rowName.indexOf(euroMatches[0]);
  const feeIdx = euroMatches.length >= 2 ? rowName.lastIndexOf(euroMatches[euroMatches.length - 1]) : rowName.length;
  
  let clubInfo = rowName.substring(marketValueIdx + euroMatches[0].length, feeIdx).trim();
  
  // Try to extract country from the end (often looks like "Granada CF Spain" or "River Plate Argentina")
  const countries = ['Spain', 'England', 'Germany', 'France', 'Italy', 'Brazil', 'Argentina', 'Mexico', 'Portugal', 
    'Belgium', 'Netherlands', 'Serbia', 'Ukraine', 'Denmark', 'Sweden', 'Norway', 'Croatia', 'Greece', 'Poland',
    'Czech Republic', 'Scotland', 'Turkey', 'Austria', 'Switzerland', 'Colombia', 'Uruguay', 'Chile', 'Paraguay',
    'Slovenia', 'Finland', 'Hungary', 'Israel', 'Bulgaria', 'South Korea', 'Japan', 'Australia', 'New Zealand',
    'Cyprus', 'Saudi Arabia', 'Canada', 'USA', 'Russia'];
  
  let sourceCountry = '';
  for (const country of countries) {
    if (clubInfo.endsWith(country)) {
      sourceCountry = country;
      clubInfo = clubInfo.substring(0, clubInfo.length - country.length).trim();
      break;
    }
  }
  
  // Determine transfer type
  let transferType: 'permanent' | 'loan' | 'free' = 'permanent';
  if (rowName.toLowerCase().includes('loan')) {
    transferType = 'loan';
  } else if (fee === 0) {
    transferType = 'free';
  }
  
  return {
    playerName: playerName.trim(),
    age,
    position,
    marketValue,
    sourceClub: direction === 'arrival' ? clubInfo.trim() : mlsTeam,
    destinationClub: direction === 'arrival' ? mlsTeam : clubInfo.trim(),
    fee,
    feeDisplay,
    mlsTeam,
    direction,
    transferType,
    season,
    year,
    sourceCountry,
  };
}

// Parse a snapshot file
function parseSnapshot(filePath: string, season: string, year: number): TransferRecord[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const transfers: TransferRecord[] = [];
  let currentTeam = '';
  let currentDirection: 'arrival' | 'departure' = 'arrival';
  let tableCountForTeam = 0;  // Track which table we're in for current team
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for headings that contain team names
    // Each team header resets the table counter
    if (line.includes('role: heading')) {
      // Check next few lines for team name
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nameLine = lines[j];
        if (nameLine.includes('name:')) {
          const match = nameLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (match) {
            const possibleTeam = match[1].trim();
            // Check if it looks like an MLS team
            if (possibleTeam.match(/(?:FC|CF|SC|United|City|Sounders|Timbers|Galaxy|Revolution|Dynamo|Whitecaps|Rapids|Fire|Crew|Union|Real Salt Lake|Inter Miami|Austin|Nashville|Charlotte|Cincinnati|Montréal|Toronto|Seattle|Portland|Houston|Dallas|San Jose|San Diego|Minnesota|Los Angeles|New York|New England|Philadelphia|Atlanta|Orlando|Columbus|D\.?C\.?|Colorado|Sporting|Vancouver)/i)) {
              currentTeam = possibleTeam;
              tableCountForTeam = 0;  // Reset table counter for new team
              currentDirection = 'arrival';  // First table will be arrivals
            }
          }
          break;
        }
      }
    }
    
    // Track when we enter a new table
    // Each team section has 2 tables: 1st = Arrivals (In), 2nd = Departures (Out)
    if (line.includes('role: table')) {
      tableCountForTeam++;
      if (tableCountForTeam === 1) {
        currentDirection = 'arrival';  // First table = arrivals
      } else if (tableCountForTeam === 2) {
        currentDirection = 'departure';  // Second table = departures
      }
    }
    
    // Look for row data - ONLY process arrivals (first table)
    if (line.includes('role: row') && currentDirection === 'arrival') {
      // Get the name attribute and look for country flag
      let rowName = '';
      let sourceCountry = '';
      
      // Look through next ~100 lines for row content and country flag
      // The source club's country flag can be 60+ lines from the row start
      for (let j = i + 1; j < Math.min(i + 100, lines.length); j++) {
        const checkLine = lines[j];
        
        // Stop if we hit another row
        if (checkLine.includes('role: row')) break;
        
        // Get main row name (contains player + fee data)
        if (!rowName && checkLine.includes('name:') && checkLine.includes('€')) {
          const match = checkLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (match) {
            rowName = match[1];
          }
        }
        
        // Look for country flag image - appears as role: img with country name
        // The source club's country flag comes AFTER the club logo
        // We want the LAST valid country flag (not player nationality which comes first)
        if (checkLine.includes('role: img')) {
          // Name can be on same line OR next line
          let imgName = '';
          
          // Check same line first
          const sameLineMatch = checkLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (sameLineMatch) {
            imgName = sameLineMatch[1].trim();
          } else if (j + 1 < lines.length) {
            // Check next line
            const nextLine = lines[j + 1];
            const nextLineMatch = nextLine.match(/name:\s*(.+?)(?:\s*$)/);
            if (nextLineMatch) {
              imgName = nextLineMatch[1].trim();
            }
          }
          
          if (imgName) {
            // List of valid countries (not team logos or player names)
            const validCountries = [
              'Spain', 'England', 'Germany', 'France', 'Italy', 'Brazil', 'Argentina', 
              'Mexico', 'Portugal', 'Belgium', 'Netherlands', 'Serbia', 'Ukraine', 
              'Denmark', 'Sweden', 'Norway', 'Croatia', 'Greece', 'Poland', 'Albania',
              'Czech Republic', 'Scotland', 'Turkey', 'Austria', 'Switzerland', 
              'Colombia', 'Uruguay', 'Chile', 'Paraguay', 'Ecuador', 'Peru', 'Venezuela',
              'Slovenia', 'Finland', 'Hungary', 'Israel', 'Bulgaria', 'South Korea', 
              'Japan', 'Australia', 'New Zealand', 'Cyprus', 'Saudi Arabia', 'Canada',
              'United States', 'USA', 'Russia', 'Ghana', 'Nigeria', 'Cameroon', 'Senegal',
              'Ivory Coast', 'South Africa', 'Morocco', 'Egypt', 'Tunisia', 'Algeria',
              'Jamaica', 'Honduras', 'Costa Rica', 'Panama', 'El Salvador', 'Guatemala',
              'Romania', 'Slovakia', 'Ireland', 'Wales', 'Northern Ireland', 'Iceland',
              'Bosnia-Herzegovina', 'Montenegro', 'North Macedonia', 'Kosovo', 'Georgia',
              'Armenia', 'Azerbaijan', 'Belarus', 'Moldova', 'Lithuania', 'Latvia', 'Estonia',
              'China', 'India', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore',
              'UAE', 'Qatar', 'Bahrain', 'Kuwait', 'Oman', 'Iran'
            ];
            // Keep overwriting - we want the LAST country flag (source club country, not player nationality)
            if (validCountries.includes(imgName)) {
              sourceCountry = imgName;
            }
          }
        }
      }
      
      if (rowName && currentTeam) {
        const transfer = parsePlayerRow(rowName, currentTeam, 'arrival', season, year);
        if (transfer) {
          // Use extracted country if we found one, otherwise keep what parsePlayerRow found
          if (sourceCountry) {
            transfer.sourceCountry = sourceCountry;
          }
          transfers.push(transfer);
        }
      }
    }
  }
  
  return transfers;
}

// Fix encoding issues (some characters get converted to weird unicode)
function fixEncoding(str: string): string {
  // The snapshot sometimes loses 's' characters - this is a known issue
  // We'll clean up common patterns
  return str
    // Team names
    .replace(/Au tin/g, 'Austin')
    .replace(/Lo  Angele /g, 'Los Angeles')
    .replace(/Minne ota/g, 'Minnesota')
    .replace(/Na hville/g, 'Nashville')
    .replace(/Kan a /g, 'Kansas')
    .replace(/Sounder /g, 'Sounders')
    .replace(/Whitecap /g, 'Whitecaps')
    .replace(/Rapid /g, 'Rapids')
    .replace(/Timber /g, 'Timbers')
    .replace(/Hou ton/g, 'Houston')
    .replace(/Columbu /g, 'Columbus')
    .replace(/St\. Loui /g, 'St. Louis ')
    .replace(/FC Dalla/g, 'FC Dallas')
    .replace(/Portland Timber$/g, 'Portland Timbers')
    .replace(/Colorado Rapid$/g, 'Colorado Rapids')
    .replace(/New York Red Bull$/g, 'New York Red Bulls')
    // Player names
    .replace(/O man/g, 'Osman')
    .replace(/Nicolá /g, 'Nicolás')
    .replace(/Duber ar ky/g, 'Dubersarsky')
    .replace(/Sebasti án/g, 'Sebastián')
    .replace(/Seba tián/g, 'Sebastián')
    .replace(/In tituto/g, 'Instituto')
    .replace(/Olek andr/g, 'Oleksandr')
    .replace(/Salt Lake City/g, 'Salt Lake')
    // Generic 's' fixes
    .replace(/ {2,}/g, ' ')
    .trim();
}

// Main function
async function main() {
  console.log('=== Parsing All MLS Transfer Snapshots ===\n');
  
  const allTransfers: TransferRecord[] = [];
  
  for (const snapshot of SNAPSHOTS) {
    const filePath = path.join(BROWSER_LOGS_DIR, snapshot.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Missing snapshot: ${snapshot.file}`);
      continue;
    }
    
    console.log(`📊 Parsing ${snapshot.season} season (${snapshot.file})...`);
    const transfers = parseSnapshot(filePath, snapshot.season, snapshot.year);
    
    const arrivals = transfers.filter(t => t.direction === 'arrival');
    const departures = transfers.filter(t => t.direction === 'departure');
    
    console.log(`   ✅ Found ${arrivals.length} arrivals, ${departures.length} departures`);
    
    // Fix encoding issues for each transfer
    transfers.forEach(t => {
      t.playerName = fixEncoding(t.playerName);
      t.sourceClub = fixEncoding(t.sourceClub);
      t.destinationClub = fixEncoding(t.destinationClub);
      t.mlsTeam = fixEncoding(t.mlsTeam);
    });
    
    allTransfers.push(...transfers);
  }
  
  // Summarize
  console.log('\n=== Summary ===');
  console.log(`Total transfers: ${allTransfers.length}`);
  
  const arrivals = allTransfers.filter(t => t.direction === 'arrival');
  const departures = allTransfers.filter(t => t.direction === 'departure');
  
  console.log(`  Arrivals (incoming): ${arrivals.length}`);
  console.log(`  Departures (outgoing): ${departures.length}`);
  
  // By year
  console.log('\nBy Year:');
  for (const snapshot of SNAPSHOTS) {
    const yearArrivals = arrivals.filter(t => t.year === snapshot.year);
    const yearDepartures = departures.filter(t => t.year === snapshot.year);
    const yearSpend = yearArrivals.reduce((sum, t) => sum + t.fee, 0);
    const yearIncome = yearDepartures.reduce((sum, t) => sum + t.fee, 0);
    
    console.log(`  ${snapshot.season}: ${yearArrivals.length} arrivals (€${(yearSpend / 1_000_000).toFixed(1)}M), ${yearDepartures.length} departures (€${(yearIncome / 1_000_000).toFixed(1)}M)`);
  }
  
  // Save to file
  const outputDir = '/Users/derekensing/projects/austin-fc-gm/data';
  const output = {
    scrapedAt: new Date().toISOString(),
    summary: {
      totalTransfers: allTransfers.length,
      arrivals: arrivals.length,
      departures: departures.length,
      totalSpend: arrivals.reduce((sum, t) => sum + t.fee, 0),
      totalIncome: departures.reduce((sum, t) => sum + t.fee, 0),
    },
    transfers: allTransfers,
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'mls-transfers-all-years.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log(`\n✅ Saved to data/mls-transfers-all-years.json`);
}

main().catch(console.error);

