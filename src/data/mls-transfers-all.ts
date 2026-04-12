// Comprehensive MLS Transfer Data from Transfermarkt (2015-2026)
// Countries extracted directly from Transfermarkt flag images
// Values converted from EUR to USD
// Includes historical supplement for pre-2021 high-profile transfers

import transferData from '../../data/mls-transfers-all-years.json';
import historicalSupplement from '../../data/mls-transfers-historical-supplement.json';

export interface TransferRecord {
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
  sourceCountry: string;
}

// EUR to USD conversion rate
const EUR_TO_USD = 1.10;

// Clubs/leagues that typically BUY players FROM MLS (departure destinations)
// If sourceClub matches AND fee is significant, this is a DEPARTURE, not arrival
const DEPARTURE_DESTINATIONS: Record<string, string[]> = {
  // Top 5 European leagues - MLS sells TO these, rarely buys FROM them for big fees
  'England': [
    'Aston Villa', 'A ton Villa', 'Chelsea', 'Chel ea', 'Manchester United', 'Manchester City',
    'Liverpool', 'Arsenal', 'Tottenham', 'Newcastle', 'West Ham', 'Brighton', 'Brentford',
    'Fulham', 'Crystal Palace', 'Wolves', 'Everton', 'Nottingham Forest', 'Bournemouth',
    'Leicester', 'Leeds', 'Southampton', 'Watford', 'Burnley', 'Sheffield', 'Ipswich',
    'Middlesbrough', 'Middle brough', 'Luton', 'Norwich', 'Sunderland',
  ],
  'Spain': [
    'Real Madrid', 'Barcelona', 'Atletico', 'Sevilla', 'Real Sociedad', 'Villarreal',
    'Athletic Bilbao', 'Real Betis', 'Valencia', 'Girona', 'Celta', 'Getafe', 'Osasuna',
    'Granada', 'Almeria', 'Cadiz', 'Mallorca', 'Rayo', 'Elche',
  ],
  'Germany': [
    'Bayern', 'Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'Union Berlin', 'Freiburg',
    'Eintracht', 'Wolfsburg', 'Mainz', 'Hoffenheim', 'Borussia', 'Stuttgart', 'Augsburg',
    'Aug burg', 'Werder Bremen', 'Cologne', 'Schalke', 'Hertha', 'Gladbach',
  ],
  'Italy': [
    'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino', 'Monza', 'Udinese', 'Sassuolo', 'Empoli', 'Verona', 'Lecce',
    'Genoa', 'Cagliari', 'Parma', 'Como', 'Venezia',
  ],
  'France': [
    'PSG', 'Paris Saint-Germain', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Lens',
    'Rennes', 'Strasbourg', 'Montpellier', 'Toulouse', 'Nantes', 'Reims', 'Brest',
  ],
  // South American clubs - MLS often sells players BACK to SA
  'Argentina': [
    'River Plate', 'Boca Juniors', 'Racing', 'Independiente', 'San Lorenzo', 'Velez',
    'Estudiantes', 'Lanus', 'Talleres', 'Defensa', 'Argentinos', 'Banfield', 'Rosario',
    'Newells', 'Colon', 'Union', 'Godoy Cruz', 'Tigre',
  ],
  'Brazil': [
    'Flamengo', 'Palmeiras', 'Corinthians', 'Sao Paulo', 'Santos', 'Gremio', 'Internacional',
    'Fluminense', 'Atletico Mineiro', 'Cruzeiro', 'Botafogo', 'Vasco', 'Bahia', 'Fortaleza',
  ],
  // Other common departure destinations
  'Belgium': ['Club Brugge', 'Anderlecht', 'Genk', 'Standard', 'Gent', 'Union SG'],
  'Netherlands': ['Ajax', 'PSV', 'Feyenoord', 'AZ', 'Twente'],
  'Portugal': ['Porto', 'Benfica', 'Sporting', 'Braga'],
  'Saudi Arabia': ['Al-Nassr', 'Al-Hilal', 'Al-Ittihad', 'Al-Ahli', 'Al-Shabab'],
  'Turkey': ['Galatasaray', 'Galata aray', 'Fenerbahce', 'Besiktas', 'Trabzonspor'],
  'Greece': ['Olympiacos', 'Panathinaikos', 'AEK Athens', 'PAOK'],
  'Mexico': ['Club America', 'Chivas', 'Tigres', 'Monterrey', 'Cruz Azul', 'Pumas', 'Leon', 'Toluca', 'Santos Laguna', 'Pachuca'],
};

// Check if this transfer looks like a DEPARTURE (MLS selling TO this club)
function isLikelyDeparture(sourceClub: string, sourceCountry: string, fee: number): boolean {
  if (!sourceClub || !sourceCountry) return false;
  
  const clubLower = sourceClub.toLowerCase();
  
  // Check if the club is a known departure destination for that country
  const destClubs = DEPARTURE_DESTINATIONS[sourceCountry];
  if (!destClubs) return false;
  
  const isKnownDestination = destClubs.some(club => 
    clubLower.includes(club.toLowerCase())
  );
  
  // If it's a known destination club, it's likely a departure
  // Use lower threshold since these are sales, not purchases
  if (isKnownDestination) {
    return true;  // Any transfer to a known destination is suspect
  }
  
  return false;
}

// List of MLS teams to identify internal transfers
const MLS_TEAMS = [
  'Atlanta United', 'Austin FC', 'Charlotte FC', 'Chicago Fire', 'FC Cincinnati',
  'Colorado Rapids', 'Columbus Crew', 'D.C. United', 'FC Dallas', 'Houston Dynamo',
  'LA Galaxy', 'LAFC', 'Inter Miami', 'Minnesota United', 'CF Montréal', 'Nashville SC',
  'New England Revolution', 'New York City FC', 'New York Red Bulls', 'Orlando City',
  'Philadelphia Union', 'Portland Timbers', 'Real Salt Lake', 'San Jose Earthquakes',
  'Seattle Sounders', 'Sporting Kansas City', 'St. Louis CITY', 'Toronto FC', 'Vancouver Whitecaps',
  'San Diego FC', // 2025 expansion
];

// Check if a club name matches any MLS team
function isMLSTeam(clubName: string): boolean {
  const normalized = clubName.toLowerCase().trim();
  return MLS_TEAMS.some(team =>
    normalized.includes(team.toLowerCase()) ||
    team.toLowerCase().includes(normalized)
  );
}

// Known European/international professional clubs (partial matches)
const PROFESSIONAL_CLUB_KEYWORDS = [
  // Top 5 leagues
  'chelsea', 'liverpool', 'arsenal', 'manchester', 'tottenham', 'newcastle', 'fulham', 'brighton',
  'barcelona', 'real madrid', 'atletico', 'sevilla', 'valencia', 'celta', 'villarreal',
  'bayern', 'dortmund', 'leverkusen', 'leipzig', 'frankfurt', 'freiburg', 'wolfsburg', 'fürth', 'fortuna',
  'juventus', 'inter', 'milan', 'napoli', 'roma', 'lazio', 'atalanta', 'fiorentina', 'bologna',
  'psg', 'marseille', 'lyon', 'monaco', 'lille', 'nice', 'rennes', 'strasbourg', 'montpellier', 'metz',
  // Other European
  'ajax', 'psv', 'feyenoord', 'brugge', 'anderlecht', 'benfica', 'porto', 'sporting',
  'celtic', 'rangers', 'antwerp', 'lokeren', 'swansea', 'derby', 'middlesbrough',
  // South American
  'boca', 'river', 'palmeiras', 'flamengo', 'corinthians', 'santos', 'gremio', 'botafogo',
  // Mexican
  'tigres', 'monterrey', 'america', 'chivas', 'cruz azul', 'pachuca', 'leon', 'toluca', 'tijuana', 'atlas',
];

// US non-professional sources to exclude (colleges, academies, USL2, amateur)
const EXCLUDE_SOURCES = [
  'academy', 'acad.', 'acad', 'hoosier', 'bruins', 'cardinal', 'bluejays', 'billikens', 'stags',
  'pioneers', 'camels', 'hurricane', 'crimson', 'big red', 'tar heels', 'wolfpack', 'wildcats',
  'bulldogs', 'tigers', 'trojans', 'buckeyes', 'spartans', 'wolverines', 'badgers', 'hawkeyes',
  'fighting', 'golden', 'st.', 'college', 'university', 'u-', 'ii', ' b', 'b ', '2 ', ' 2',
  'without club', 'unattached', 'free agent',
];

function isProfessionalSource(sourceClub: string): boolean {
  if (!sourceClub) return false;
  const clubLower = sourceClub.toLowerCase();

  // Check if it's a known professional club
  if (PROFESSIONAL_CLUB_KEYWORDS.some(kw => clubLower.includes(kw))) {
    return true;
  }

  // Check if it's an MLS team
  if (isMLSTeam(sourceClub)) {
    return true;
  }

  // Exclude known non-professional sources
  if (EXCLUDE_SOURCES.some(exc => clubLower.includes(exc))) {
    return false;
  }

  // Default: keep if it doesn't match exclusion patterns
  // This catches European clubs not in our keyword list
  return true;
}

// Convert EUR values to USD - now includes MLS-to-MLS transfers + historical supplement
const mainTransfers = (transferData as any).transfers
  .filter((t: any) => {
    // Filter out transfers with unknown or missing source country
    if (!t.sourceCountry || t.sourceCountry === 'Unknown') return false;

    // Keep all international transfers (non-US nationality)
    if (t.sourceCountry !== 'United States' && t.sourceCountry !== 'USA') return true;

    // For US players, check if source club is professional
    // This keeps returns from Europe (e.g., Turner from Lyon, Steffen from Man City)
    return isProfessionalSource(t.sourceClub);
  })
  .map((t: any) => ({
    ...t,
    marketValue: Math.round((t.marketValue || 0) * EUR_TO_USD),
    fee: Math.round((t.fee || 0) * EUR_TO_USD),
  }));

// Add historical supplement transfers (already in USD)
const supplementalTransfers = (historicalSupplement as any).transfers;

// Merge all transfers
export const ALL_TRANSFERS: TransferRecord[] = [
  ...supplementalTransfers,
  ...mainTransfers
];

// Get unique list of MLS teams from the data
export function getMLSTeams(): string[] {
  const teams = new Set<string>();
  ALL_TRANSFERS.forEach(t => teams.add(t.mlsTeam));
  return Array.from(teams).sort();
}

// Get transfers by year
export function getTransfersByYear(year: number): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.year === year);
}

// Get transfers by team
export function getTransfersByTeam(team: string): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.mlsTeam === team);
}

// Get transfers by direction
export function getTransfersByDirection(direction: 'arrival' | 'departure'): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.direction === direction);
}

// Get aggregate stats
export function getTransferStats() {
  const arrivals = ALL_TRANSFERS.filter(t => t.direction === 'arrival');
  const departures = ALL_TRANSFERS.filter(t => t.direction === 'departure');
  
  const totalSpend = arrivals.reduce((sum, t) => sum + t.fee, 0);
  const totalIncome = departures.reduce((sum, t) => sum + t.fee, 0);
  
  // Paid vs free transfers
  const paidTransfers = arrivals.filter(t => t.fee > 0).length;
  const freeTransfers = arrivals.filter(t => t.fee === 0).length;
  const avgFee = paidTransfers > 0 ? totalSpend / paidTransfers : 0;
  
  // Country breakdown (for arrivals - where players come from)
  const countryStats: Record<string, { count: number; spend: number }> = {};
  arrivals.forEach(t => {
    const country = t.sourceCountry;
    if (!countryStats[country]) {
      countryStats[country] = { count: 0, spend: 0 };
    }
    countryStats[country].count++;
    countryStats[country].spend += t.fee;
  });
  
  return {
    totalTransfers: ALL_TRANSFERS.length,
    arrivals: arrivals.length,
    departures: departures.length,
    totalSpend,
    totalIncome,
    netSpend: totalSpend - totalIncome,
    paidTransfers,
    freeTransfers,
    avgFee,
    countryStats,
    years: [2026, 2025, 2024, 2023, 2022, 2021],
  };
}
