// Comprehensive MLS Transfer Data from Transfermarkt (2020-2024)
// Countries extracted directly from Transfermarkt flag images
// Values converted from EUR to USD

import transferData from '../../data/mls-transfers-all-years.json';

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

// Convert EUR values to USD - now we only have incoming arrivals from the parser
export const ALL_TRANSFERS: TransferRecord[] = (transferData as any).transfers
  .filter((t: any) => {
    // Filter out transfers with unknown or missing source country
    if (!t.sourceCountry || t.sourceCountry === 'Unknown') return false;
    
    // Filter out US domestic transfers (internal MLS moves, USL, college, etc.)
    if (t.sourceCountry === 'United States' || t.sourceCountry === 'USA') return false;
    
    return true;
  })
  .map((t: any) => ({
    ...t,
    marketValue: Math.round((t.marketValue || 0) * EUR_TO_USD),
    fee: Math.round((t.fee || 0) * EUR_TO_USD),
  }));

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
    countryStats,
    years: [2024, 2023, 2022, 2021, 2020],
  };
}
