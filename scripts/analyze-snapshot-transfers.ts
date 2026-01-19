/**
 * Analyze Transfer Snapshot Data
 * 
 * Parses transfer data from Transfermarkt snapshot and analyzes source countries/leagues
 */

import { promises as fs } from 'fs';

interface TransferRow {
  raw: string;
  playerName: string;
  age: number;
  position: string;
  marketValue: string;
  sourceInfo: string;
  fee: string;
  feeNumeric: number;
  transferType: 'permanent' | 'loan' | 'free' | 'unknown';
}

interface CountryData {
  count: number;
  totalSpend: number;
  players: string[];
}

// Known country patterns in the source club names
const COUNTRY_PATTERNS: Record<string, string[]> = {
  'England': ['Premier League', 'Championship', 'League One', 'League Two', 'Newcastle', 'Chelsea', 'Middlesbrough', 'Watford', 'Crystal Palace', 'Tottenham', 'Liverpool', 'Arsenal', 'Man United', 'Man City', 'West Ham', 'Aston Villa', 'Everton', 'Southampton', 'Brighton', 'Brentford', 'Fulham', 'Nottingham', 'Leicester', 'Wolves', 'Bournemouth', 'Leeds', 'Burnley', 'Luton', 'Sheffield', 'Ipswich', 'Sunderland', 'Stoke', 'Norwich', 'Bristol', 'Millwall', 'QPR', 'Coventry', 'Blackburn', 'Hull', 'Plymouth', 'Preston', 'Swansea', 'Cardiff', 'Birmingham'],
  'Spain': ['La Liga', 'Celta', 'Sevilla', 'Valencia', 'Villarreal', 'Betis', 'Atletico', 'Real Madrid', 'Barcelona', 'Athletic', 'Sociedad', 'Girona', 'Getafe', 'Osasuna', 'Rayo', 'Mallorca', 'Alaves', 'Cadiz', 'Las Palmas', 'Granada', 'Leganes', 'Espanyol', 'Sporting Gijon', 'Zaragoza', 'Oviedo', 'Levante', 'Tenerife'],
  'Germany': ['Bundesliga', 'Dortmund', 'Bayern', 'Leipzig', 'Leverkusen', 'Frankfurt', 'Stuttgart', 'Freiburg', 'Hoffenheim', 'Wolfsburg', 'Bremen', 'Augsburg', 'Mainz', 'Koln', 'Union Berlin', 'Gladbach', 'Hertha', 'Schalke', 'Hamburg', 'Hannover', 'Nurnberg', 'Fortuna', 'St. Pauli', 'Kaiserslautern', 'Paderborn', 'Darmstadt', 'Heidenheim'],
  'Italy': ['Serie A', 'Serie B', 'Juventus', 'Milan', 'Inter', 'Roma', 'Lazio', 'Napoli', 'Atalanta', 'Fiorentina', 'Bologna', 'Torino', 'Genoa', 'Sampdoria', 'Udinese', 'Sassuolo', 'Verona', 'Empoli', 'Lecce', 'Cagliari', 'Monza', 'Frosinone', 'Salernitana', 'Cremonese', 'Parma', 'Venezia', 'Como', 'Palermo', 'Catanzaro', 'Bari'],
  'France': ['Ligue 1', 'Ligue 2', 'Paris', 'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Rennes', 'Nice', 'Lens', 'Nantes', 'Strasbourg', 'Reims', 'Toulouse', 'Montpellier', 'Brest', 'Lorient', 'Clermont', 'Metz', 'Troyes', 'Auxerre', 'Angers', 'Saint-Etienne', 'Ajaccio', 'Bordeaux', 'Le Havre'],
  'Portugal': ['Primeira Liga', 'Porto', 'Benfica', 'Sporting', 'Braga', 'Guimaraes', 'Famalicao', 'Casa Pia', 'Estoril', 'Arouca', 'Boavista', 'Moreirense', 'Farense', 'Vizela', 'Gil Vicente', 'Rio Ave', 'Chaves', 'Santa Clara', 'Leiria', 'Tondela'],
  'Netherlands': ['Eredivisie', 'Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'Twente', 'Utrecht', 'Groningen', 'Heerenveen', 'Vitesse', 'NEC', 'Sparta Rotterdam', 'Go Ahead', 'Fortuna Sittard', 'Volendam', 'Excelsior', 'Emmen', 'Waalwijk', 'Cambuur', 'Almere'],
  'Belgium': ['Pro League', 'Club Brugge', 'Anderlecht', 'Union SG', 'Gent', 'Antwerp', 'Genk', 'Standard', 'Mechelen', 'Charleroi', 'Cercle Brugge', 'Westerlo', 'St. Truiden', 'Kortrijk', 'Eupen', 'Oostende', 'Zulte', 'Mouscron'],
  'Brazil': ['Brasileirao', 'Flamengo', 'Palmeiras', 'Gremio', 'Internacional', 'Santos', 'Corinthians', 'Sao Paulo', 'Fluminense', 'Botafogo', 'Vasco', 'Cruzeiro', 'Atletico Mineiro', 'Bahia', 'Fortaleza', 'Ceara', 'Cuiaba', 'Goias', 'Coritiba', 'America MG', 'Athletico', 'Red Bull Bragantino'],
  'Argentina': ['Liga Profesional', 'Boca', 'River', 'Racing', 'Independiente', 'San Lorenzo', 'Velez', 'Rosario', 'Lanus', 'Estudiantes', 'Talleres', 'Godoy Cruz', 'Defensa', 'Belgrano', 'Banfield', 'Huracan', 'Newells', 'Union Santa Fe', 'Argentinos', 'Gimnasia', 'Colon', 'Central Cordoba', 'Platense', 'Tigre', 'Barracas'],
  'Mexico': ['Liga MX', 'America', 'Monterrey', 'Tigres', 'Cruz Azul', 'Guadalajara', 'Chivas', 'Pumas', 'Leon', 'Toluca', 'Santos Laguna', 'Pachuca', 'Atlas', 'Necaxa', 'Queretaro', 'Puebla', 'Tijuana', 'Mazatlan', 'San Luis', 'Juarez'],
  'Scotland': ['Scottish', 'Celtic', 'Rangers', 'Hearts', 'Hibs', 'Aberdeen', 'Dundee', 'St. Mirren', 'Motherwell', 'Kilmarnock', 'Ross County', 'Livingston', 'St. Johnstone'],
  'Turkey': ['Super Lig', 'Galatasaray', 'Fenerbahce', 'Besiktas', 'Trabzonspor', 'Basaksehir', 'Antalyaspor', 'Konyaspor', 'Alanyaspor', 'Kasimpasa', 'Rizespor', 'Adana', 'Gaziantep', 'Sivasspor', 'Kayserispor', 'Hatayspor', 'Samsunspor', 'Pendikspor'],
  'Switzerland': ['Super League', 'Basel', 'Young Boys', 'Zurich', 'Lugano', 'Servette', 'St. Gallen', 'Lausanne', 'Sion', 'Luzern', 'Grasshoppers', 'Winterthur'],
  'Austria': ['Bundesliga', 'Salzburg', 'Sturm Graz', 'Rapid Wien', 'Austria Wien', 'LASK', 'Wolfsberger', 'Hartberg', 'Altach', 'Klagenfurt', 'Tirol'],
  'Denmark': ['Superliga', 'Copenhagen', 'Midtjylland', 'Brondby', 'Nordsjaelland', 'Silkeborg', 'Viborg', 'Randers', 'Odense', 'AaB', 'AGF Aarhus'],
  'Sweden': ['Allsvenskan', 'Malmo', 'AIK', 'Djurgarden', 'Hammarby', 'BK Hacken', 'IF Elfsborg', 'IFK Goteborg', 'IFK Norrkoping', 'Kalmar', 'Mjallby', 'Sirius', 'Varberg', 'Degerfors'],
  'Norway': ['Eliteserien', 'Bodo Glimt', 'Molde', 'Rosenborg', 'Lillestrom', 'Viking', 'Brann', 'Stromsgodset', 'Sandefjord', 'Haugesund', 'Odd', 'Tromso', 'Sarpsborg', 'Kristiansund'],
  'Japan': ['J1 League', 'J-League', 'Vissel Kobe', 'Yokohama', 'Urawa', 'Kashima', 'Kawasaki', 'Gamba', 'Cerezo', 'Nagoya', 'Sapporo', 'Sanfrecce', 'FC Tokyo', 'Kashiwa'],
  'South Korea': ['K League', 'Jeonbuk', 'Ulsan', 'Pohang', 'Suwon', 'Seoul', 'Daegu', 'Incheon', 'Gwangju', 'Gangwon', 'Seongnam'],
  'Colombia': ['Primera A', 'Atletico Nacional', 'Millonarios', 'Junior', 'Cali', 'Santa Fe', 'America de Cali', 'Medellin', 'Once Caldas', 'Tolima', 'Pasto'],
  'Uruguay': ['Primera Division', 'Penarol', 'Nacional', 'Liverpool', 'Wanderers', 'Cerro', 'Defensor', 'Danubio', 'River Plate'],
  'Chile': ['Primera Division', 'Colo-Colo', 'Universidad', 'Catolica', 'O\'Higgins', 'Palestino', 'La Serena', 'Huachipato', 'Union Espanola'],
  'Paraguay': ['Primera Division', 'Olimpia', 'Cerro Porteno', 'Libertad', 'Guarani', 'Nacional'],
  'Peru': ['Liga 1', 'Alianza Lima', 'Universitario', 'Sporting Cristal', 'Cienciano', 'Melgar'],
  'Ecuador': ['Serie A', 'LDU Quito', 'Barcelona SC', 'Emelec', 'Independiente del Valle', 'Aucas'],
  'Greece': ['Super League', 'Olympiacos', 'Panathinaikos', 'AEK Athens', 'PAOK', 'Aris'],
  'Croatia': ['HNL', 'Dinamo Zagreb', 'Hajduk Split', 'Rijeka', 'Osijek', 'Lokomotiva'],
  'Serbia': ['SuperLiga', 'Red Star', 'Partizan', 'Cukaricki', 'Vojvodina', 'Mladost'],
  'Czech Republic': ['First League', 'Sparta Prague', 'Slavia Prague', 'Plzen', 'Ostrava', 'Liberec'],
  'Poland': ['Ekstraklasa', 'Legia Warsaw', 'Lech Poznan', 'Rakow', 'Jagiellonia', 'Slask'],
  'Hungary': ['NB I', 'Ferencvaros', 'Puskas', 'Honved', 'Ujpest', 'Debrecen'],
  'Russia': ['Premier League', 'Zenit', 'CSKA Moscow', 'Spartak', 'Lokomotiv', 'Krasnodar'],
  'Ukraine': ['Premier League', 'Shakhtar', 'Dynamo Kyiv', 'Dnipro', 'Zorya', 'Vorskla'],
  'Israel': ['Premier League', 'Maccabi Tel Aviv', 'Maccabi Haifa', 'Hapoel', 'Beitar', 'Bnei Sakhnin'],
  'Australia': ['A-League', 'Melbourne Victory', 'Sydney FC', 'Western Sydney', 'Melbourne City', 'Brisbane Roar', 'Central Coast', 'Adelaide United', 'Perth Glory', 'Wellington Phoenix', 'Macarthur'],
  'Canada': ['Canadian Premier', 'CPL', 'Montreal', 'Toronto', 'Vancouver', 'Forge', 'Cavalry', 'Pacific'],
  'United States': ['MLS', 'USL', 'NWSL', 'Pool', 'LA Galaxy', 'LAFC', 'Seattle', 'Atlanta', 'Miami', 'Cincinnati', 'Columbus', 'Philadelphia', 'New York', 'Chicago', 'Dallas', 'Houston', 'Portland', 'Denver', 'Salt Lake', 'Kansas City', 'Minnesota', 'Nashville', 'Charlotte', 'Austin', 'St. Louis', 'San Jose', 'Colorado', 'New England', 'Orlando', 'DC United', 'San Diego'],
};

function detectCountry(sourceInfo: string): string {
  const upperSource = sourceInfo.toUpperCase();
  
  for (const [country, patterns] of Object.entries(COUNTRY_PATTERNS)) {
    for (const pattern of patterns) {
      if (upperSource.includes(pattern.toUpperCase())) {
        return country;
      }
    }
  }
  
  return 'Other';
}

function parseFee(text: string): { numeric: number; type: TransferRow['transferType'] } {
  const lower = text.toLowerCase();
  
  if (lower.includes('loan') || lower.includes('end of loan')) {
    return { numeric: 0, type: 'loan' };
  }
  if (lower.includes('free') || lower.includes('draft')) {
    return { numeric: 0, type: 'free' };
  }
  if (lower === '?' || lower === '-') {
    return { numeric: 0, type: 'unknown' };
  }
  
  const match = text.match(/€([\d.,]+)(m|k)?/i);
  if (match) {
    let val = parseFloat(match[1].replace(',', '.'));
    if (match[2]?.toLowerCase() === 'm') val *= 1_000_000;
    else if (match[2]?.toLowerCase() === 'k') val *= 1_000;
    return { numeric: val, type: 'permanent' };
  }
  
  return { numeric: 0, type: 'unknown' };
}

async function main() {
  // Read the extracted transfer lines
  const content = await fs.readFile('/tmp/transfers.txt', 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  
  const transfers: TransferRow[] = [];
  const byCountry = new Map<string, CountryData>();
  
  for (const line of lines) {
    // Extract the name field content
    const nameMatch = line.match(/name:\s*(.+)$/);
    if (!nameMatch) continue;
    
    const raw = nameMatch[1].trim();
    
    // Parse: "PlayerName AbbrevName Age Position MarketValue SourceClub Fee"
    // Example: "Djé D'Avilla D. D'Avilla 21 DM €500k Leiria €4.00m"
    
    // Find position (2-3 letter code)
    const posMatch = raw.match(/\s(\d{1,2})\s+(GK|CB|RB|LB|DM|CM|AM|LW|RW|CF|ST|LM|RM)\s+/);
    if (!posMatch) continue;
    
    const age = parseInt(posMatch[1]);
    const position = posMatch[2];
    const posIndex = raw.indexOf(posMatch[0]);
    
    // Player name is before position (take first part before the abbrev name duplicate)
    let playerName = raw.substring(0, posIndex).trim();
    // Remove abbreviated duplicate name like "D. D'Avilla"
    playerName = playerName.replace(/\s+[A-Z]\.\s+[A-Z]?\.?[A-Za-z']+$/, '').trim();
    
    // Everything after position
    const afterPos = raw.substring(posIndex + posMatch[0].length).trim();
    
    // Market value is first, then source info, then fee
    const parts = afterPos.split(/\s+/);
    const marketValue = parts[0] || '-';
    
    // Fee is typically the last part with € or special keywords
    let fee = '-';
    let sourceInfo = '';
    
    for (let i = parts.length - 1; i >= 1; i--) {
      const part = parts[i];
      if (part.includes('€') || part.toLowerCase().includes('free') || 
          part.toLowerCase().includes('loan') || part.toLowerCase().includes('draft') ||
          part === '?' || part === '-') {
        fee = parts.slice(i).join(' ');
        sourceInfo = parts.slice(1, i).join(' ');
        break;
      }
    }
    
    if (!sourceInfo) {
      sourceInfo = parts.slice(1).join(' ');
    }
    
    const { numeric, type } = parseFee(fee);
    const country = detectCountry(sourceInfo);
    
    const transfer: TransferRow = {
      raw,
      playerName,
      age,
      position,
      marketValue,
      sourceInfo,
      fee,
      feeNumeric: numeric,
      transferType: type,
    };
    
    transfers.push(transfer);
    
    // Update country stats
    const countryData = byCountry.get(country) || { count: 0, totalSpend: 0, players: [] };
    countryData.count++;
    countryData.totalSpend += numeric;
    if (numeric >= 5_000_000) {
      countryData.players.push(`${playerName} (€${(numeric / 1_000_000).toFixed(1)}M)`);
    }
    byCountry.set(country, countryData);
  }
  
  console.log(`\nParsed ${transfers.length} transfers from snapshot\n`);
  
  // Summary stats
  const totalSpend = transfers.reduce((sum, t) => sum + t.feeNumeric, 0);
  const paidTransfers = transfers.filter(t => t.feeNumeric > 0);
  const freeTransfers = transfers.filter(t => t.transferType === 'free');
  const loanTransfers = transfers.filter(t => t.transferType === 'loan');
  
  console.log('='.repeat(85));
  console.log('MLS INCOMING TRANSFERS 24/25 SEASON - SOURCE ANALYSIS');
  console.log('Source: Transfermarkt (https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1)');
  console.log('='.repeat(85));
  console.log(`Total Incoming Transfers: ${transfers.length}`);
  console.log(`Total Spend: €${(totalSpend / 1_000_000).toFixed(2)}M`);
  console.log(`Paid Transfers: ${paidTransfers.length} (€${(paidTransfers.reduce((s,t) => s + t.feeNumeric, 0) / 1_000_000).toFixed(2)}M)`);
  console.log(`Free Transfers: ${freeTransfers.length}`);
  console.log(`Loan Transfers: ${loanTransfers.length}`);
  console.log(`Average Fee (paid only): €${paidTransfers.length > 0 ? ((totalSpend / paidTransfers.length) / 1_000).toFixed(0) : 0}K`);
  
  // Sorted by count
  const sortedByCount = Array.from(byCountry.entries())
    .filter(([c]) => c !== 'United States') // Exclude internal MLS transfers
    .sort((a, b) => b[1].count - a[1].count);
  
  console.log('\n' + '='.repeat(85));
  console.log('TOP 25 SOURCE COUNTRIES BY NUMBER OF INCOMING TRANSFERS');
  console.log('='.repeat(85));
  console.log('Rank | Country              | Transfers | Total Spend   | Notable Signings');
  console.log('-'.repeat(85));
  
  sortedByCount.slice(0, 25).forEach(([country, data], i) => {
    const spend = data.totalSpend > 0 ? `€${(data.totalSpend / 1_000_000).toFixed(2)}M` : 'Free/Loan';
    const notable = data.players.slice(0, 2).join(', ') || '-';
    console.log(`${String(i + 1).padStart(4)} | ${country.padEnd(20)} | ${String(data.count).padStart(9)} | ${spend.padStart(13)} | ${notable}`);
  });
  
  // Sorted by spend
  const sortedBySpend = Array.from(byCountry.entries())
    .filter(([c]) => c !== 'United States')
    .sort((a, b) => b[1].totalSpend - a[1].totalSpend);
  
  console.log('\n' + '='.repeat(85));
  console.log('TOP 25 SOURCE COUNTRIES BY TOTAL SPEND');
  console.log('='.repeat(85));
  console.log('Rank | Country              | Total Spend   | Transfers | Avg Fee');
  console.log('-'.repeat(85));
  
  sortedBySpend.slice(0, 25).forEach(([country, data], i) => {
    const spend = data.totalSpend > 0 ? `€${(data.totalSpend / 1_000_000).toFixed(2)}M` : 'Free/Loan';
    const avgFee = data.count > 0 && data.totalSpend > 0 
      ? `€${((data.totalSpend / data.count) / 1_000).toFixed(0)}K` 
      : '-';
    console.log(`${String(i + 1).padStart(4)} | ${country.padEnd(20)} | ${spend.padStart(13)} | ${String(data.count).padStart(9)} | ${avgFee.padStart(10)}`);
  });
  
  // Save data
  const output = {
    season: '24/25',
    summary: {
      totalTransfers: transfers.length,
      totalSpend,
      paidTransfers: paidTransfers.length,
      freeTransfers: freeTransfers.length,
      loanTransfers: loanTransfers.length,
      avgFee: paidTransfers.length > 0 ? totalSpend / paidTransfers.length : 0,
    },
    byCountryCount: sortedByCount.map(([country, data]) => ({
      country,
      transfers: data.count,
      totalSpend: data.totalSpend,
      notableSignings: data.players,
    })),
    byCountrySpend: sortedBySpend.map(([country, data]) => ({
      country,
      transfers: data.count,
      totalSpend: data.totalSpend,
      notableSignings: data.players,
    })),
    sampleTransfers: transfers.slice(0, 50),
    source: 'Transfermarkt',
    parsedAt: new Date().toISOString(),
  };
  
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile('data/mls-transfers-24-25.json', JSON.stringify(output, null, 2));
  console.log('\nData saved to data/mls-transfers-24-25.json');
}

main().catch(console.error);

