/**
 * Final parser to extract transfer data with countries from snapshots
 * Uses the cell structure: img[country] + link[club] to get source country
 */

import * as fs from 'fs';
import * as path from 'path';

interface TransferRecord {
  playerName: string;
  age: number;
  nationality: string;
  position: string;
  marketValue: number;
  sourceClub: string;
  sourceCountry: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free' | 'end_of_loan';
  season: string;
  year: number;
}

// Use the most recent snapshot for each season
const SNAPSHOTS = [
  { file: 'snapshot-2026-01-20T00-50-08-834Z.log', season: '24/25', year: 2024 },
  { file: 'snapshot-2026-01-19T19-56-29-873Z.log', season: '23/24', year: 2023 },
  { file: 'snapshot-2026-01-19T19-56-50-831Z.log', season: '22/23', year: 2022 },
  { file: 'snapshot-2026-01-19T19-57-05-205Z.log', season: '21/22', year: 2021 },
  { file: 'snapshot-2026-01-19T19-57-16-844Z.log', season: '20/21', year: 2020 },
];

const BROWSER_LOGS_DIR = '/Users/derekensing/.cursor/browser-logs';

// MLS Teams to identify team sections
const MLS_TEAMS = [
  'Atlanta United', 'Austin FC', 'Charlotte FC', 'Chicago Fire', 'FC Cincinnati',
  'Colorado Rapids', 'Columbus Crew', 'D.C. United', 'FC Dallas', 'Houston Dynamo',
  'Inter Miami', 'LA Galaxy', 'Los Angeles FC', 'LAFC', 'Los Angeles Galaxy',
  'Minnesota United', 'CF Montréal', 'Montreal', 'Nashville SC', 'New England Revolution',
  'New York Red Bulls', 'New York City FC', 'NYCFC', 'Orlando City', 'Philadelphia Union',
  'Portland Timbers', 'Real Salt Lake', 'San Jose Earthquakes', 'San Diego FC',
  'Seattle Sounders', 'Sporting Kansas City', 'St. Louis CITY', 'Toronto FC',
  'Vancouver Whitecaps'
];

// Known countries - to distinguish from club names in img elements
const KNOWN_COUNTRIES = [
  'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Benin', 'Bolivia', 'Bosnia-Herzegovina',
  'Brazil', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cameroon', 'Canada', 'Cape Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Czechia',
  'DR Congo', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'England',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Faroe Islands', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Grenada',
  'Guadeloupe', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Latvia', 'Lebanon', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius',
  'Mexico', 'Moldova', 'Monaco', 'Montenegro', 'Morocco', 'Mozambique', 'Namibia', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Northern Ireland', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Samoa', 'Saudi Arabia', 'Scotland', 'Senegal', 'Serbia',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tahiti', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Türkiye',
  'Turkmenistan', 'UAE', 'Uganda', 'Ukraine', 'United States', 'Uruguay', 'USA', 'Uzbekistan',
  'Venezuela', 'Vietnam', 'Wales', 'Yemen', 'Zambia', 'Zimbabwe'
];

function isCountry(name: string): boolean {
  return KNOWN_COUNTRIES.some(c => 
    c.toLowerCase() === name.toLowerCase() || 
    name.toLowerCase().includes(c.toLowerCase())
  );
}

function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || 
      valueStr.toLowerCase().includes('loan') || valueStr === '?') {
    return 0;
  }
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  if (cleaned.includes('m')) return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  if (cleaned.includes('k') || cleaned.includes('th')) return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Fix encoding issues
function fixEncoding(str: string): string {
  return str
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
    .replace(/ {2,}/g, ' ')
    .trim();
}

function isMlsTeam(name: string): boolean {
  const fixed = fixEncoding(name);
  return MLS_TEAMS.some(team => fixed.includes(team) || team.includes(fixed));
}

interface RowData {
  rowName: string;
  cells: CellData[];
}

interface CellData {
  name: string;
  imgs: string[];  // img names within this cell
  links: string[]; // link names within this cell
}

function parseSnapshot(filePath: string, season: string, year: number): TransferRecord[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const transfers: TransferRecord[] = [];
  
  let currentTeam = '';
  let currentDirection: 'arrival' | 'departure' = 'arrival';
  let inRow = false;
  let currentRow: RowData | null = null;
  let currentCell: CellData | null = null;
  let cellDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Track MLS team headers
    if (trimmed.startsWith('- role: heading') || trimmed.startsWith('- role: link')) {
      // Check next lines for team name
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nameLine = lines[j];
        if (nameLine.includes('name:')) {
          const match = nameLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (match) {
            const name = fixEncoding(match[1]);
            if (isMlsTeam(name) && !name.includes('€')) {
              currentTeam = name;
              currentDirection = 'arrival';
            }
          }
          break;
        }
      }
    }
    
    // Detect arrivals/departures headers
    if (trimmed.includes('name:')) {
      const text = trimmed.toLowerCase();
      if (text.includes('arrival') || text.includes(' in') || text.includes('zugang')) {
        currentDirection = 'arrival';
      } else if (text.includes('departure') || text.includes(' out') || text.includes('abgang')) {
        currentDirection = 'departure';
      }
    }
    
    // Start of a transfer row
    if (trimmed.startsWith('- role: row') && currentTeam) {
      // Look for the row name in next lines
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nameLine = lines[j];
        if (nameLine.includes('name:') && nameLine.includes('€')) {
          const match = nameLine.match(/name:\s*(.+?)(?:\s*$)/);
          if (match) {
            inRow = true;
            currentRow = {
              rowName: match[1],
              cells: []
            };
          }
          break;
        }
      }
    }
    
    // Collect cells within a row
    if (inRow && currentRow) {
      if (trimmed.startsWith('- role: cell')) {
        // Start a new cell
        currentCell = { name: '', imgs: [], links: [] };
        cellDepth = line.search(/\S/);  // Track indentation level
        
        // Look for cell name
        for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
          if (lines[j].includes('name:')) {
            const match = lines[j].match(/name:\s*(.+?)(?:\s*$)/);
            if (match) {
              currentCell.name = match[1];
            }
            break;
          }
        }
      }
      
      // Collect imgs and links within current cell
      if (currentCell) {
        if (trimmed.startsWith('- role: img') && trimmed.includes('name:')) {
          // Img with inline name
          const match = trimmed.match(/name:\s*(.+?)(?:\s*$)/);
          if (match) currentCell.imgs.push(match[1]);
        } else if (trimmed.startsWith('- role: img')) {
          // Look for name on next line
          if (i + 1 < lines.length && lines[i + 1].includes('name:')) {
            const match = lines[i + 1].match(/name:\s*(.+?)(?:\s*$)/);
            if (match) currentCell.imgs.push(match[1]);
          }
        }
        
        if (trimmed.startsWith('- role: link')) {
          // Look for name
          for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
            if (lines[j].includes('name:')) {
              const match = lines[j].match(/name:\s*(.+?)(?:\s*$)/);
              if (match) {
                currentCell.links.push(match[1]);
              }
              break;
            }
          }
        }
      }
      
      // End of cell - add to row when we see next cell or row ends
      if (currentCell && (trimmed.startsWith('- role: cell') || trimmed.startsWith('- role: row'))) {
        if (currentRow.cells.length > 0 || currentCell.name || currentCell.imgs.length > 0) {
          currentRow.cells.push(currentCell);
        }
        if (trimmed.startsWith('- role: row')) {
          currentCell = null;
        }
      }
      
      // Check if row is ending (next row starting or significant dedent)
      if (trimmed.startsWith('- role: row') && currentRow.cells.length > 0) {
        // Parse the collected row data
        const transfer = parseRowData(currentRow, currentTeam, currentDirection, season, year);
        if (transfer) {
          transfers.push(transfer);
        }
        
        // Reset for next row
        inRow = false;
        currentRow = null;
        currentCell = null;
        
        // Restart processing for the new row
        i--;
        continue;
      }
    }
  }
  
  return transfers;
}

function parseRowData(row: RowData, mlsTeam: string, direction: 'arrival' | 'departure', season: string, year: number): TransferRecord | null {
  const rowName = row.rowName;
  
  // Parse from row name: "Player Name P. Name Age Pos €Value Club €Fee"
  const euroMatches = rowName.match(/€[\d.,]+[mkMK]?/g);
  if (!euroMatches || euroMatches.length === 0) return null;
  
  const marketValue = parseValue(euroMatches[0]);
  const fee = euroMatches.length > 1 ? parseValue(euroMatches[1]) : 0;
  const feeDisplay = euroMatches.length > 1 ? euroMatches[1] : 'free transfer';
  
  // Find player name (first cell)
  let playerName = '';
  if (row.cells.length > 0 && row.cells[0].name) {
    const nameParts = row.cells[0].name.split(/\s+[A-Z]\.\s+/);
    playerName = fixEncoding(nameParts[0].trim());
  }
  
  // Find age (cell with just 2 digits)
  let age = 0;
  for (const cell of row.cells) {
    if (/^\d{2}$/.test(cell.name)) {
      age = parseInt(cell.name);
      break;
    }
  }
  
  // Find nationality (img that is a country name, usually in cell 3)
  let nationality = '';
  for (const cell of row.cells) {
    for (const img of cell.imgs) {
      if (isCountry(img)) {
        nationality = img;
        break;
      }
    }
    if (nationality) break;
  }
  
  // Find position
  let position = '';
  const positions = ['GK', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'CF', 'SS', 'LM', 'RM'];
  for (const cell of row.cells) {
    for (const pos of positions) {
      if (cell.name === pos) {
        position = pos;
        break;
      }
    }
    if (position) break;
  }
  
  // Find source club and country
  // The cell with the source country flag will have:
  // - An img that is a country name
  // - A link that is the club name
  let sourceClub = '';
  let sourceCountry = '';
  
  for (const cell of row.cells) {
    // Skip player name cell
    if (cell === row.cells[0]) continue;
    
    // Look for a cell with both a country img and a club link
    const countryImg = cell.imgs.find(img => isCountry(img));
    const clubLink = cell.links.find(link => !isCountry(link) && link.length > 2);
    
    if (countryImg && clubLink) {
      sourceCountry = countryImg;
      sourceClub = fixEncoding(clubLink);
      break;
    }
  }
  
  // Fallback: if no source country found, try to get club from row name
  if (!sourceClub) {
    // Extract club name from between euro values
    const match = rowName.match(/€[\d.,]+[mkMK]?\s+(.+?)\s+€[\d.,]+[mkMK]?/);
    if (match) {
      sourceClub = fixEncoding(match[1].trim());
    }
  }
  
  // Determine transfer type
  let transferType: 'permanent' | 'loan' | 'free' | 'end_of_loan' = 'permanent';
  const feeTextLower = feeDisplay.toLowerCase();
  if (feeTextLower.includes('end of loan')) {
    transferType = 'end_of_loan';
  } else if (feeTextLower.includes('loan')) {
    transferType = 'loan';
  } else if (feeTextLower.includes('free') || fee === 0) {
    transferType = 'free';
  }
  
  if (!playerName) return null;
  
  return {
    playerName,
    age,
    nationality,
    position,
    marketValue,
    sourceClub: sourceClub || 'Unknown',
    sourceCountry: sourceCountry || 'Unknown',
    fee,
    feeDisplay,
    mlsTeam: fixEncoding(mlsTeam),
    direction,
    transferType,
    season,
    year,
  };
}

async function main() {
  console.log('=== Parsing Transfer Snapshots for Country Data ===\n');
  
  const allTransfers: TransferRecord[] = [];
  
  for (const snapshot of SNAPSHOTS) {
    const filePath = path.join(BROWSER_LOGS_DIR, snapshot.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Missing snapshot: ${snapshot.file}`);
      continue;
    }
    
    console.log(`📊 Parsing ${snapshot.season} season...`);
    const transfers = parseSnapshot(filePath, snapshot.season, snapshot.year);
    
    const withCountry = transfers.filter(t => t.sourceCountry && t.sourceCountry !== 'Unknown');
    console.log(`   ✅ Found ${transfers.length} transfers, ${withCountry.length} with country`);
    
    allTransfers.push(...transfers);
  }
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    summary: {
      totalTransfers: allTransfers.length,
      arrivals: allTransfers.filter(t => t.direction === 'arrival').length,
      departures: allTransfers.filter(t => t.direction === 'departure').length,
      withCountry: allTransfers.filter(t => t.sourceCountry && t.sourceCountry !== 'Unknown').length,
    },
    transfers: allTransfers,
  };
  
  const outputPath = path.join(__dirname, '../data/mls-transfers-final.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Saved ${allTransfers.length} transfers to data/mls-transfers-final.json`);
  console.log(`   - With country data: ${output.summary.withCountry} (${Math.round(output.summary.withCountry / allTransfers.length * 100)}%)`);
  
  // Show country distribution
  const countryCount: Record<string, number> = {};
  allTransfers.forEach(t => {
    const country = t.sourceCountry;
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\nTop 25 source countries (from flags):');
  Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .forEach(([country, count]) => console.log(`  ${country}: ${count}`));
}

main().catch(console.error);

