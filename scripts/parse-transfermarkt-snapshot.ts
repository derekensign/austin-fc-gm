/**
 * Parse Transfermarkt Snapshot
 * 
 * Extracts all transfer records from the browser accessibility snapshot
 */

import { promises as fs } from 'fs';

interface ParsedTransfer {
  playerName: string;
  age: number;
  position: string;
  marketValue: string;
  sourceClub: string;
  sourceCountry: string;
  fee: string;
  feeNumeric: number;
  type: 'permanent' | 'loan' | 'free' | 'unknown';
}

// Position abbreviations
const POSITIONS = ['GK', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'CF', 'ST', 'LM', 'RM', 'SS', 'SW'];

function parseTransferFee(feeStr: string): { numeric: number; type: ParsedTransfer['type'] } {
  const cleaned = feeStr.toLowerCase().trim();
  
  if (cleaned.includes('loan') || cleaned.includes('end of loan')) {
    return { numeric: 0, type: 'loan' };
  }
  if (cleaned.includes('free') || cleaned === '-') {
    return { numeric: 0, type: 'free' };
  }
  if (cleaned === '?' || cleaned === '') {
    return { numeric: 0, type: 'unknown' };
  }
  
  // Parse values like "€5.00m", "$500k"
  const numMatch = cleaned.match(/€?([\d.,]+)\s*(m|k)?/);
  if (numMatch) {
    let value = parseFloat(numMatch[1].replace(',', '.'));
    if (numMatch[2] === 'm') value *= 1_000_000;
    else if (numMatch[2] === 'k') value *= 1_000;
    return { numeric: value, type: 'permanent' };
  }
  
  return { numeric: 0, type: 'unknown' };
}

async function main() {
  const snapshotPath = '/Users/derekensing/.cursor/browser-logs/snapshot-2026-01-19T18-18-43-084Z.log';
  const content = await fs.readFile(snapshotPath, 'utf-8');
  const lines = content.split('\n');
  
  const transfers: ParsedTransfer[] = [];
  const countryStats = new Map<string, { count: number; spend: number }>();
  
  // Find all row entries with player data
  // Format: "name: PlayerName ... age position marketValue sourceClub fee"
  const rowPattern = /name:\s*(.+?)\s+(\d{1,2})\s+(GK|CB|RB|LB|DM|CM|AM|LW|RW|CF|ST|LM|RM|SS|SW)\s+([€\-\d.,kmKM]+)\s+(.+?)\s+(€[\d.,]+[mkMK]|free|loan|End of loan|Free tran fer|\?|-)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for row entries that contain player transfer info
    if (line.includes('role: row') && line.includes('name:')) {
      const nameMatch = line.match(/name:\s*"?([^"]+)"?\s*$/);
      if (nameMatch) {
        const rowContent = nameMatch[1];
        
        // Parse the row content
        // Example: "Djé D'Avilla D. D'Avilla 21 DM €500k Leiria €4.00m"
        const parts = rowContent.split(/\s+/);
        
        // Find position index
        let posIndex = -1;
        for (let j = 0; j < parts.length; j++) {
          if (POSITIONS.includes(parts[j].toUpperCase())) {
            posIndex = j;
            break;
          }
        }
        
        if (posIndex > 1) {
          // Age should be right before position
          const age = parseInt(parts[posIndex - 1]);
          
          if (age >= 15 && age <= 45) {
            // Player name is everything before age
            const playerName = parts.slice(0, posIndex - 1).join(' ');
            const position = parts[posIndex];
            
            // Market value is after position
            const marketValue = parts[posIndex + 1] || '-';
            
            // Source club and fee are remaining parts
            const remaining = parts.slice(posIndex + 2);
            
            // Last part should be fee
            const fee = remaining.pop() || '-';
            const sourceClub = remaining.join(' ');
            
            // Try to extract country from nearby lines
            let sourceCountry = 'Unknown';
            for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
              const countryMatch = lines[j].match(/name:\s*(Portugal|Spain|England|Brazil|Argentina|Mexico|France|Germany|Italy|Netherlands|Belgium|Colombia|Switzerland|Austria|Greece|Poland|Serbia|Croatia|Japan|South Korea|Australia|Sweden|Denmark|Norway|Finland|Scotland|Ireland|Czech Republic|Ukraine|Russia|Turkey|United States|Canada|Chile|Peru|Ecuador|Uruguay|Paraguay|Venezuela|Costa Rica|Honduras|Jamaica|El Salvador|Guatemala|Panama|Bolivia|Cote d'Ivoire|Ivory Coast|Ghana|Nigeria|Cameroon|Senegal|DR Congo|South Africa|Morocco|Egypt|Tunisia|Algeria|Israel|Hungary|Romania|Slovenia|Slovakia|Cyprus|Malta|New Zealand|China|Saudi Arabia|Qatar|UAE)/i);
              if (countryMatch) {
                sourceCountry = countryMatch[1];
                break;
              }
            }
            
            const { numeric, type } = parseTransferFee(fee);
            
            // Skip if looks like duplicate name entry
            if (playerName.length > 2 && !playerName.includes('name:')) {
              transfers.push({
                playerName: playerName.replace(/\s+[A-Z]\.\s+[A-Z]\..*$/, '').trim(), // Remove abbreviated names
                age,
                position,
                marketValue,
                sourceClub,
                sourceCountry,
                fee,
                feeNumeric: numeric,
                type,
              });
              
              // Update country stats
              const existing = countryStats.get(sourceCountry) || { count: 0, spend: 0 };
              existing.count++;
              existing.spend += numeric;
              countryStats.set(sourceCountry, existing);
            }
          }
        }
      }
    }
  }
  
  console.log(`\nParsed ${transfers.length} transfers from snapshot\n`);
  
  // Print country stats sorted by count
  const sortedByCount = Array.from(countryStats.entries())
    .sort((a, b) => b[1].count - a[1].count);
  
  console.log('='.repeat(80));
  console.log('TOP SOURCE COUNTRIES BY NUMBER OF TRANSFERS (24/25 Season)');
  console.log('='.repeat(80));
  console.log('Rank | Country              | Transfers | Total Spend');
  console.log('-'.repeat(60));
  
  sortedByCount.slice(0, 25).forEach(([country, data], i) => {
    const spend = data.spend > 0 ? `€${(data.spend / 1_000_000).toFixed(2)}M` : 'Free/Loan';
    console.log(`${String(i + 1).padStart(4)} | ${country.padEnd(20)} | ${String(data.count).padStart(9)} | ${spend.padStart(12)}`);
  });
  
  // Print country stats sorted by spend
  const sortedBySpend = Array.from(countryStats.entries())
    .sort((a, b) => b[1].spend - a[1].spend);
  
  console.log('\n' + '='.repeat(80));
  console.log('TOP SOURCE COUNTRIES BY TOTAL SPEND (24/25 Season)');
  console.log('='.repeat(80));
  console.log('Rank | Country              | Total Spend  | Transfers');
  console.log('-'.repeat(60));
  
  sortedBySpend.slice(0, 25).forEach(([country, data], i) => {
    const spend = data.spend > 0 ? `€${(data.spend / 1_000_000).toFixed(2)}M` : 'Free/Loan';
    console.log(`${String(i + 1).padStart(4)} | ${country.padEnd(20)} | ${spend.padStart(12)} | ${String(data.count).padStart(9)}`);
  });
  
  // Summary stats
  const totalSpend = transfers.reduce((sum, t) => sum + t.feeNumeric, 0);
  const paidTransfers = transfers.filter(t => t.feeNumeric > 0);
  
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Transfers: ${transfers.length}`);
  console.log(`Total Spend: €${(totalSpend / 1_000_000).toFixed(2)}M`);
  console.log(`Paid Transfers: ${paidTransfers.length}`);
  console.log(`Free/Loan Transfers: ${transfers.length - paidTransfers.length}`);
  console.log(`Average Fee (paid): €${paidTransfers.length > 0 ? ((totalSpend / paidTransfers.length) / 1000).toFixed(0) : 0}K`);
  
  // Save to JSON
  const output = {
    season: '24/25',
    totalTransfers: transfers.length,
    totalSpend,
    byCountry: sortedByCount.map(([country, data]) => ({ country, ...data })),
    bySpend: sortedBySpend.map(([country, data]) => ({ country, ...data })),
    transfers: transfers.slice(0, 100), // Sample of transfers
    parsedAt: new Date().toISOString(),
  };
  
  await fs.writeFile('data/transfermarkt-24-25-parsed.json', JSON.stringify(output, null, 2));
  console.log('\nData saved to data/transfermarkt-24-25-parsed.json');
}

main().catch(console.error);

