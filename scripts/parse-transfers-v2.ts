/**
 * Parse Transfermarkt snapshots to extract transfers WITH country data from flags
 * The country is in the img element's name attribute inside the source club cell
 */

import * as fs from 'fs';
import * as path from 'path';

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  destinationClub: string;
  sourceCountry: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free';
  season: string;
  year: number;
}

const SNAPSHOTS = [
  { file: 'snapshot-2026-01-19T20-23-19-861Z.log', season: '24/25', year: 2024 },
  { file: 'snapshot-2026-01-19T19-56-29-873Z.log', season: '23/24', year: 2023 },
  { file: 'snapshot-2026-01-19T19-56-50-831Z.log', season: '22/23', year: 2022 },
  { file: 'snapshot-2026-01-19T19-57-05-205Z.log', season: '21/22', year: 2021 },
  { file: 'snapshot-2026-01-19T19-57-16-844Z.log', season: '20/21', year: 2020 },
];

const BROWSER_LOGS_DIR = '/Users/derekensing/.cursor/browser-logs';

function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || valueStr.toLowerCase().includes('loan')) {
    return 0;
  }
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  if (cleaned.includes('m')) return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  if (cleaned.includes('k') || cleaned.includes('th')) return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Fix encoding issues where 's' gets dropped
function fixEncoding(str: string): string {
  return str
    .replace(/Au tin FC/g, 'Austin FC')
    .replace(/Columbu Crew/g, 'Columbus Crew')
    .replace(/Dalla FC/g, 'FC Dallas')
    .replace(/Hou ton Dynamo/g, 'Houston Dynamo FC')
    .replace(/Kan a City/g, 'Sporting Kansas City')
    .replace(/Minne ota United/g, 'Minnesota United FC')
    .replace(/Na hville SC/g, 'Nashville SC')
    .replace(/Lo Angele FC/g, 'Los Angeles FC')
    .replace(/Lo Angele Galaxy/g, 'Los Angeles Galaxy')
    .replace(/Tran fer/g, 'Transfer')
    .replace(/ eattle/gi, 'Seattle')
    .replace(/ porting/gi, 'Sporting')
    .replace(/ t\. Loui /gi, 'St. Louis ')
    .replace(/Wa hington/gi, 'Washington')
    .replace(/Port mou h/gi, 'Portsmouth')
    .replace(/Porto/gi, 'Porto')
    .replace(/Pari /gi, 'Paris ')
    .replace(/Atla /gi, 'Atlas ')
    .replace(/Deport /gi, 'Deport')
    .replace(/Inter /gi, 'Inter ')
    .replace(/Ju tu /gi, 'Justus');
}

interface SnapshotNode {
  role?: string;
  name?: string;
  children?: SnapshotNode[];
}

function parseSnapshot(content: string): SnapshotNode {
  // Simple YAML-like parser for snapshot format
  const lines = content.split('\n');
  const root: SnapshotNode = { children: [] };
  const stack: { node: SnapshotNode; indent: number }[] = [{ node: root, indent: -2 }];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const indent = line.search(/\S/);
    const trimmed = line.trim();
    
    if (trimmed.startsWith('- role:')) {
      const role = trimmed.replace('- role:', '').trim();
      const newNode: SnapshotNode = { role, children: [] };
      
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1].node;
      if (!parent.children) parent.children = [];
      parent.children.push(newNode);
      stack.push({ node: newNode, indent });
    } else if (trimmed.startsWith('name:')) {
      const name = trimmed.replace('name:', '').trim();
      if (stack.length > 0) {
        stack[stack.length - 1].node.name = name;
      }
    }
  }
  
  return root;
}

function findRows(node: SnapshotNode, rows: SnapshotNode[] = []): SnapshotNode[] {
  if (node.role === 'row' && node.name) {
    rows.push(node);
  }
  if (node.children) {
    for (const child of node.children) {
      findRows(child, rows);
    }
  }
  return rows;
}

// Find elements that could be team headers (headings with MLS team names)
function findTeamHeaders(node: SnapshotNode, headers: SnapshotNode[] = []): SnapshotNode[] {
  if ((node.role === 'heading' || node.role === 'link') && node.name) {
    const name = fixEncoding(node.name);
    if (MLS_TEAMS.some(team => name.includes(team) || team.includes(name)) && !name.includes('€')) {
      headers.push(node);
    }
  }
  if (node.children) {
    for (const child of node.children) {
      findTeamHeaders(child, headers);
    }
  }
  return headers;
}

// Find all elements with their structure for better team tracking
interface ParsedElement {
  role: string;
  name: string;
  isTeamHeader: boolean;
  isRow: boolean;
}

function findAllElements(node: SnapshotNode, elements: ParsedElement[] = []): ParsedElement[] {
  if (node.name) {
    const name = fixEncoding(node.name);
    const isTeamHeader = (node.role === 'heading' || node.role === 'link') && 
                         MLS_TEAMS.some(team => name === team || name.includes(team + ' ')) && 
                         !name.includes('€') && !name.includes('II') && !name.includes('Academy');
    const isRow = node.role === 'row';
    
    if (isTeamHeader || isRow) {
      elements.push({
        role: node.role || '',
        name: node.name,
        isTeamHeader,
        isRow,
      });
    }
  }
  if (node.children) {
    for (const child of node.children) {
      findAllElements(child, elements);
    }
  }
  return elements;
}

function findCells(node: SnapshotNode): SnapshotNode[] {
  const cells: SnapshotNode[] = [];
  if (node.children) {
    for (const child of node.children) {
      if (child.role === 'cell') {
        cells.push(child);
      }
    }
  }
  return cells;
}

function findImgInCell(cell: SnapshotNode): string | null {
  // Club/team name patterns to exclude (these are logos, not country flags)
  const CLUB_PATTERNS = [
    'FC', 'CF', 'SC', 'United', 'City', 'Galaxy', 'Crew', 'Rapids', 'Timbers',
    'Revolution', 'Earthquakes', 'Whitecaps', 'Sounders', 'Real Salt', 'Red Bulls',
    'Union', 'Fire', 'Dynamo', 'Inter Miami', 'Battery', 'Rowdies', 'Legion',
    'Eleven', 'Phoenix', 'Rising', 'Louisville', 'Switchbacks', 'Lights', 'Light',
    'Locomotive', 'Republic', 'Roots', 'Loyal', 'Tacoma', 'Defiance', 'Toros',
    'Bold', 'Monarchs', 'Real', 'Sporting', 'Atlanta', 'Austin', 'Charlotte',
    'Chicago', 'Cincinnati', 'Colorado', 'Columbus', 'Dallas', 'Houston', 'LAFC',
    'Los Angeles', 'Minnesota', 'Montreal', 'Nashville', 'New England', 'New York',
    'Orlando', 'Philadelphia', 'Portland', 'San Jose', 'San Diego', 'Seattle',
    'St. Louis', 'Toronto', 'Vancouver', 'Memphis', 'Pittsburgh', 'Birmingham',
    'Charleston', 'Tulsa', 'El Paso', 'Hartford', 'Detroit', 'Tampa Bay', 'Oakland',
    'Sacramento', 'Indy', 'Loudoun', 'North Texas', 'Crown Legacy', 'Rochester',
    'Huntsville', 'Forward Madison', 'Rhode Island', 'Carolina', 'Lexington',
    'Reno', 'Monterey Bay', 'Ventura', 'Rio Grande', 'RGV', 'The Town', 'LV'
  ];
  
  // Look for img elements that could be country flags
  if (cell.children) {
    for (const child of cell.children) {
      if (child.role === 'img' && child.name) {
        // Skip if it matches any club pattern
        const isClubLogo = CLUB_PATTERNS.some(pattern => child.name!.includes(pattern));
        if (!isClubLogo && child.name.length > 2 && child.name.length < 30) {
          return child.name;
        }
      }
      // Recurse into children
      const found = findImgInCell(child);
      if (found) return found;
    }
  }
  return null;
}

// Parse a row to extract transfer data
function parseRow(row: SnapshotNode, mlsTeam: string, direction: 'arrival' | 'departure', season: string, year: number): TransferRecord | null {
  const rowName = row.name || '';
  if (!rowName || !rowName.includes('€')) return null;
  
  // Skip header rows
  if (rowName.toLowerCase().includes('player') || rowName.toLowerCase().includes('fee') && rowName.toLowerCase().includes('market')) return null;
  
  const cells = findCells(row);
  if (cells.length < 6) return null;
  
  // Extract data from row name (format: "Player Name P. Name Age Pos €Value Club €Fee")
  const euroMatches = rowName.match(/€[\d.,]+[mkMK]?/g);
  if (!euroMatches || euroMatches.length < 1) return null;
  
  const marketValue = parseValue(euroMatches[0]);
  const fee = euroMatches.length > 1 ? parseValue(euroMatches[1]) : 0;
  const feeDisplay = euroMatches.length > 1 ? euroMatches[1] : 'free transfer';
  
  // Find position
  const positions = ['GK', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'CF', 'SS', 'SW', 'LM', 'RM'];
  let position = '';
  for (const pos of positions) {
    if (rowName.includes(` ${pos} `)) {
      position = pos;
      break;
    }
  }
  
  // Find player name (first cell usually has it)
  let playerName = '';
  if (cells[0]?.name) {
    // Take just the first part before any abbreviation
    const nameParts = cells[0].name.split(/\s+[A-Z]\.\s+/);
    playerName = nameParts[0].trim();
  }
  
  // Find age
  let age = 0;
  for (const cell of cells) {
    if (cell.name && /^\d{2}$/.test(cell.name)) {
      age = parseInt(cell.name);
      break;
    }
  }
  
  // Find source club - look for cell with club name after the value
  let sourceClub = '';
  let sourceCountry = '';
  
  // Non-club values to skip
  const NOT_CLUBS = [
    'free', 'loan', 'draft', 'end of loan', 'tran fer', 'transfer',
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    '2020', '2021', '2022', '2023', '2024', '2025'
  ];
  
  const isNotClub = (name: string) => {
    const lower = name.toLowerCase();
    return NOT_CLUBS.some(nc => lower.includes(nc)) || /^\d+,?\s*\d*$/.test(name);
  };
  
  // Cells are roughly: [name, age, nationality, position, position-abbrev, value, club-logo, club+flag, fee]
  // The club+flag cell has an img with country name and a link with club name
  for (let i = 5; i < cells.length; i++) {
    const cell = cells[i];
    
    // Look for img that's a country flag (not a club logo)
    const countryFromFlag = findImgInCell(cell);
    if (countryFromFlag && !isNotClub(countryFromFlag)) {
      sourceCountry = countryFromFlag;
    }
    
    // Look for the club name in cell name
    if (cell.name && !cell.name.startsWith('€') && cell.name.length > 2) {
      // Skip if it's just a position or number or transfer type
      if (!positions.includes(cell.name) && !/^\d+$/.test(cell.name) && !isNotClub(cell.name)) {
        // This might be the club name - it often has the country flag img as child
        if (cell.children) {
          for (const child of cell.children) {
            if (child.role === 'link' && child.name && !child.name.startsWith('€') && !isNotClub(child.name)) {
              sourceClub = child.name;
              break;
            }
          }
        }
        if (!sourceClub) {
          sourceClub = cell.name;
        }
      }
    }
  }
  
  // Clean up source club - remove country name if it was concatenated
  if (sourceCountry && sourceClub.includes(sourceCountry)) {
    sourceClub = sourceClub.replace(sourceCountry, '').trim();
  }
  
  // If source club is an MLS team, set country to USA
  const MLS_CLUB_NAMES = [
    'Atlanta', 'Au tin', 'Austin', 'Charlotte', 'Chicago', 'Cincinnati',
    'Colorado', 'Columbu', 'Columbus', 'D.C.', 'DC United', 'Dalla', 'Dallas',
    'Hou ton', 'Houston', 'Miami', 'LA Galaxy', 'LAFC', 'Los Angeles',
    'Minne ota', 'Minnesota', 'Montréal', 'Montreal', 'Na hville', 'Nashville',
    'New England', 'Revolution', 'Red Bull', 'NYCFC', 'NYC FC', 'New York',
    'Orlando', 'Philadelphia', 'Portland', 'Timber', 'Real Salt', 'Salt Lake',
    'San Jo e', 'San Jose', 'Earthquake', 'San Diego', 'Seattle', 'Sounder',
    'Sporting KC', 'Sporting Kan a', 'Kansas City', 'St. Loui', 'St. Louis', 'CITY SC',
    'Toronto', 'Vancouver', 'Whitecap'
  ];
  
  if (MLS_CLUB_NAMES.some(mls => sourceClub.includes(mls) || fixEncoding(sourceClub).includes(mls))) {
    sourceCountry = 'USA';
  }
  
  // If source club is a USL/lower division team (including encoding variants)
  const USL_CLUBS = [
    'Rowdie', 'Indy Eleven', 'Loui ville', 'Louisville', 'San Antonio', 'Orange County',
    'Phoenix Ri ing', 'Phoenix Rising', 'Sacramento', 'Oakland', 'Birmingham', 'Tampa Bay',
    'Memphi  901', 'Memphis 901', 'Pitt burgh', 'Pittsburgh', 'Tul a', 'Tulsa',
    'El Pa o', 'El Paso', 'New Mexico', 'Colorado Springs', 'Switchback', 'LV Light',
    'Las Vegas Light', 'Rio Grande', 'RGV FC', 'Hartford', 'Detroit City', 'Charleston',
    'Miami FC', 'Loudoun United', 'Legion FC', 'Rhode I land', 'Rhode Island',
    'Fort Lauderdale', 'The Town FC', 'Bold FC', 'Lexington SC', 'North Carolina',
    'Reno FC', 'Carolina Core', 'Forward Madi on', 'Forward Madison', 'Union Omaha',
    'Ventura County', 'Monterey Bay', 'San Diego Loyal', 'Oakland Root', 'New York RB II',
    'Tormenta'
  ];
  
  if (USL_CLUBS.some(usl => sourceClub.includes(usl))) {
    sourceCountry = 'USA';
  }
  
  // MLS Next Pro / Academy (including encoding variants)
  const MLS_NEXT_PRO = [
    'II', ' 2', 'Tacoma', 'North Texa', 'North Texas', 'Galaxy II', 'LA Galaxy 2', 'LAFC 2',
    'Hunt ville', 'Huntsville', 'Crown Legacy', 'Rochester', 'St Louis 2', 'Kan a  City',
    'Chicago Fire II', 'Atlanta United 2', 'Orlando City B', 'Inter Miami II', 'Portland T2',
    'Real Monarch', 'NYRB Academy', 'RSL Academy', 'Ph. Union Acad', 'Charle ton', 'Oklahoma City',
    'Spokane', 'Tacoma Defiance'
  ];
  
  if (MLS_NEXT_PRO.some(np => sourceClub.includes(np))) {
    sourceCountry = 'USA';
  }
  
  // US College teams
  const US_COLLEGES = [
    'Blue Devil', 'Duke', 'Wake Fore t', 'Wake Forest', 'Georgetown', 'Penn State',
    'Dayton Flyer', 'Dayton', 'Syracu e', 'Syracuse', 'Stanford', 'UCLA', 'Virginia',
    'Maryland', 'Akron', 'Indiana', 'Clemson', 'North Carolina', 'Kentucky', 'Louisville'
  ];
  
  if (US_COLLEGES.some(col => sourceClub.includes(col))) {
    sourceCountry = 'USA';
  }
  
  // Danish clubs (including encoding variants)
  const DANISH_CLUBS = ['Nord jaelland', 'Nordsjælland', 'Midtjylland', 'Copenhagen', 'Brøndby', 'Silkeborg', 'Lyngby', 'Oden e', 'Odense', 'Rander', 'Randers'];
  if (DANISH_CLUBS.some(dk => sourceClub.includes(dk))) {
    sourceCountry = 'Denmark';
  }
  
  // Czech clubs
  const CZECH_CLUBS = ['Plzeň', 'Zlin', 'Slavia', 'Sparta Praha', 'Baník', 'Liberec', 'Olomouc'];
  if (CZECH_CLUBS.some(cz => sourceClub.includes(cz))) {
    sourceCountry = 'Czech Republic';
  }
  
  // UAE clubs  
  const UAE_CLUBS = ['Al-Wa l', 'Al-Wasl', 'Kalba', 'Al-Ain', 'Al-Jazira', 'Shabab'];
  if (UAE_CLUBS.some(uae => sourceClub.includes(uae))) {
    sourceCountry = 'UAE';
  }
  
  // Determine transfer type
  let transferType: 'permanent' | 'loan' | 'free' = 'permanent';
  if (feeDisplay.toLowerCase().includes('loan')) transferType = 'loan';
  else if (fee === 0) transferType = 'free';
  
  if (!playerName || !sourceClub) return null;
  
  return {
    playerName: fixEncoding(playerName),
    age,
    position,
    marketValue,
    sourceClub: fixEncoding(sourceClub),
    destinationClub: direction === 'arrival' ? mlsTeam : sourceClub,
    sourceCountry: fixEncoding(sourceCountry),
    fee,
    feeDisplay,
    mlsTeam: fixEncoding(mlsTeam),
    direction,
    transferType,
    season,
    year,
  };
}

// MLS Teams to identify sections
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

function isMlsTeam(name: string): boolean {
  const fixed = fixEncoding(name);
  return MLS_TEAMS.some(team => fixed.includes(team) || team.includes(fixed));
}

async function main() {
  const allTransfers: TransferRecord[] = [];
  
  for (const snapshot of SNAPSHOTS) {
    console.log(`\n📊 Processing ${snapshot.season}...`);
    
    const filePath = path.join(BROWSER_LOGS_DIR, snapshot.file);
    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️ File not found: ${snapshot.file}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all rows in the snapshot
    const root = parseSnapshot(content);
    const rows = findRows(root);
    
    console.log(`   Found ${rows.length} total rows`);
    
    // Process rows - need to track which MLS team we're under
    let currentTeam = '';
    let currentDirection: 'arrival' | 'departure' = 'arrival';
    
    for (const row of rows) {
      const rowName = row.name || '';
      
      // Check if this is a team header
      if (isMlsTeam(rowName) && !rowName.includes('€')) {
        currentTeam = fixEncoding(rowName);
        currentDirection = 'arrival'; // Reset to arrivals for new team
        continue;
      }
      
      // Check for Arrivals/Departures section headers
      if (rowName.toLowerCase().includes('arrival') || rowName.toLowerCase().includes('in:')) {
        currentDirection = 'arrival';
        continue;
      }
      if (rowName.toLowerCase().includes('departure') || rowName.toLowerCase().includes('out:')) {
        currentDirection = 'departure';
        continue;
      }
      
      // Try to parse as transfer
      if (currentTeam && rowName.includes('€')) {
        const transfer = parseRow(row, currentTeam, currentDirection, snapshot.season, snapshot.year);
        if (transfer) {
          allTransfers.push(transfer);
        }
      }
    }
    
    const seasonTransfers = allTransfers.filter(t => t.year === snapshot.year);
    console.log(`   Extracted ${seasonTransfers.length} transfers for ${snapshot.season}`);
  }
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    summary: {
      totalTransfers: allTransfers.length,
      arrivals: allTransfers.filter(t => t.direction === 'arrival').length,
      departures: allTransfers.filter(t => t.direction === 'departure').length,
      withCountry: allTransfers.filter(t => t.sourceCountry).length,
    },
    transfers: allTransfers,
  };
  
  const outputPath = path.join(__dirname, '../data/mls-transfers-v2.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Saved ${allTransfers.length} transfers`);
  console.log(`   - Arrivals: ${output.summary.arrivals}`);
  console.log(`   - Departures: ${output.summary.departures}`);
  console.log(`   - With country data: ${output.summary.withCountry}`);
  
  // Show country distribution
  const countryCount: Record<string, number> = {};
  allTransfers.forEach(t => {
    const country = t.sourceCountry || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\nTop source countries (from flags):');
  Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .forEach(([country, count]) => console.log(`  ${country}: ${count}`));
}

main().catch(console.error);

