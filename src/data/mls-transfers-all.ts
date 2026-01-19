// Comprehensive MLS Transfer Data from Transfermarkt (2020-2024)
// Scraped from all 5 seasons of transfer activity
// Values are in EUR - convert to USD at display time

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
  sourceCountry?: string;
}

// EUR to USD conversion rate
const EUR_TO_USD = 1.10;

// All transfers from the scraped data
export const ALL_TRANSFERS: TransferRecord[] = (transferData.transfers as TransferRecord[]).map(t => ({
  ...t,
  // Convert fee and marketValue to USD
  fee: Math.round(t.fee * EUR_TO_USD),
  marketValue: Math.round(t.marketValue * EUR_TO_USD),
}));

// Get transfer stats
export function getTransferStats() {
  const arrivals = ALL_TRANSFERS.filter(t => t.direction === 'arrival');
  const departures = ALL_TRANSFERS.filter(t => t.direction === 'departure');
  
  return {
    totalTransfers: ALL_TRANSFERS.length,
    arrivals: arrivals.length,
    departures: departures.length,
    totalSpend: arrivals.reduce((sum, t) => sum + t.fee, 0),
    totalIncome: departures.reduce((sum, t) => sum + t.fee, 0),
    paidTransfers: arrivals.filter(t => t.fee > 0).length,
    freeTransfers: arrivals.filter(t => t.fee === 0).length,
  };
}

// Get unique MLS teams from the data
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

// Infer source country from club name
export function inferCountryFromClub(club: string): string {
  const clubToCountry: Record<string, string> = {
    // Major European leagues
    'Middlesbrough': 'England', 'Newcastle': 'England', 'Chelsea': 'England',
    'Watford': 'England', 'Crystal Palace': 'England', 'Bournemouth': 'England',
    'Brighton': 'England', 'Tottenham': 'England', 'Sheffield Wed': 'England',
    'Manchester': 'England', 'Liverpool': 'England', 'Arsenal': 'England',
    'Fulham': 'England', 'Everton': 'England', 'West Ham': 'England',
    'Leeds': 'England', 'Southampton': 'England', 'Leicester': 'England',
    'Wolverhampton': 'England', 'Nottingham': 'England', 'Brentford': 'England',
    
    'Granada': 'Spain', 'Celta': 'Spain', 'Valladolid': 'Spain',
    'Betis': 'Spain', 'Barcelona': 'Spain', 'Real Madrid': 'Spain',
    'Atlético': 'Spain', 'Sevilla': 'Spain', 'Valencia': 'Spain',
    'Villarreal': 'Spain', 'Athletic': 'Spain', 'Sociedad': 'Spain',
    
    'Atalanta': 'Italy', 'Genoa': 'Italy', 'Milan': 'Italy',
    'Juventus': 'Italy', 'Napoli': 'Italy', 'Roma': 'Italy',
    'Inter': 'Italy', 'Lazio': 'Italy', 'Fiorentina': 'Italy',
    'Torino': 'Italy', 'Bologna': 'Italy', 'Sassuolo': 'Italy',
    
    'Dortmund': 'Germany', 'Leipzig': 'Germany', 'Bayern': 'Germany',
    'Wolfsburg': 'Germany', 'Leverkusen': 'Germany', 'Frankfurt': 'Germany',
    'Hoffenheim': 'Germany', 'Freiburg': 'Germany', 'Köln': 'Germany',
    'Gladbach': 'Germany', 'Bremen': 'Germany', 'Schalke': 'Germany',
    'Hamburg': 'Germany', 'Stuttgart': 'Germany', 'Union Berlin': 'Germany',
    
    'PSG': 'France', 'Nice': 'France', 'Saint-Étienne': 'France',
    'Lens': 'France', 'Amiens': 'France', 'Metz': 'France',
    'Le Havre': 'France', 'Rennes': 'France', 'Lyon': 'France',
    'Monaco': 'France', 'Marseille': 'France', 'Lille': 'France',
    'Montpellier': 'France', 'Nantes': 'France', 'Toulouse': 'France',
    
    // Belgium
    'Club Brugge': 'Belgium', 'Cercle Brugge': 'Belgium', 'Standard': 'Belgium',
    'Union': 'Belgium', 'Gent': 'Belgium', 'Antwerp': 'Belgium',
    'Anderlecht': 'Belgium', 'Genk': 'Belgium',
    
    // Netherlands
    'PSV': 'Netherlands', 'Ajax': 'Netherlands', 'Feyenoord': 'Netherlands',
    'Twente': 'Netherlands', 'Utrecht': 'Netherlands', 'Vitesse': 'Netherlands',
    
    // Portugal
    'Sporting': 'Portugal', 'Benfica': 'Portugal', 'Porto': 'Portugal',
    'Braga': 'Portugal', 'Famalicão': 'Portugal',
    
    // South America
    'Botafogo': 'Brazil', 'Vasco': 'Brazil', 'Palmeiras': 'Brazil',
    'Corinthians': 'Brazil', 'Bahia': 'Brazil', 'Fortaleza': 'Brazil',
    'Grêmio': 'Brazil', 'Atlético Mineiro': 'Brazil', 'Flamengo': 'Brazil',
    'Santos': 'Brazil', 'Internacional': 'Brazil', 'Fluminense': 'Brazil',
    
    'Racing': 'Argentina', 'Boca': 'Argentina', 'River': 'Argentina',
    'Vélez': 'Argentina', 'Independiente': 'Argentina', 'Godoy Cruz': 'Argentina',
    'Estudiantes': 'Argentina', 'San Lorenzo': 'Argentina', 'Lanús': 'Argentina',
    'Tucumán': 'Argentina', 'Instituto': 'Argentina', 'Talleres': 'Argentina',
    
    'Monterrey': 'Mexico', 'Cruz Azul': 'Mexico', 'Tigres': 'Mexico',
    'Atlas': 'Mexico', 'Chivas': 'Mexico', 'Pumas': 'Mexico',
    'Toluca': 'Mexico', 'América': 'Mexico', 'Pachuca': 'Mexico',
    
    // Eastern Europe
    'Red Star': 'Serbia', 'Partizan': 'Serbia', 'Spartak': 'Serbia',
    'Dnipro': 'Ukraine', 'Dynamo Kyiv': 'Ukraine', 'Shakhtar': 'Ukraine',
    'Polissya': 'Ukraine', 'Metalist': 'Ukraine',
    'Zenit': 'Russia',
    
    // Scandinavia
    'Copenhagen': 'Denmark', 'Nordsjaelland': 'Denmark', 'Brøndby': 'Denmark',
    'Randers': 'Denmark', 'Midtjylland': 'Denmark',
    'Häcken': 'Sweden', 'AIK': 'Sweden', 'Malmö': 'Sweden',
    'Djurgården': 'Sweden', 'Elfsborg': 'Sweden', 'Gothenburg': 'Sweden',
    'Lillestrom': 'Norway', 'Rosenborg': 'Norway', 'Viking': 'Norway',
    'Molde': 'Norway', 'Bodø': 'Norway',
    
    // Other
    'Celtic': 'Scotland', 'Rangers': 'Scotland', 'Hearts': 'Scotland',
    'Aberdeen': 'Scotland',
    'Fenerbahçe': 'Turkey', 'Galatasaray': 'Turkey', 'Besiktas': 'Turkey',
    'Trabzonspor': 'Turkey',
    'PAOK': 'Greece', 'Panathinaikos': 'Greece', 'AEK': 'Greece', 'Olympiacos': 'Greece',
    'Slavia': 'Czech Republic', 'Sparta': 'Czech Republic',
    'Legia': 'Poland', 'Lech': 'Poland', 'Jagiellonia': 'Poland',
    
    // MLS teams (for internal transfers)
    'Los Angeles FC': 'USA (MLS)', 'Los Angeles Galaxy': 'USA (MLS)', 
    'Inter Miami': 'USA (MLS)', 'Atlanta United': 'USA (MLS)',
    'Seattle Sounders': 'USA (MLS)', 'Portland Timbers': 'USA (MLS)',
    'Austin FC': 'USA (MLS)', 'Nashville': 'USA (MLS)',
    'Cincinnati': 'USA (MLS)', 'Columbus': 'USA (MLS)',
    'Toronto': 'USA (MLS)', 'Montréal': 'USA (MLS)',
    'New York': 'USA (MLS)', 'Philadelphia': 'USA (MLS)',
    'New England': 'USA (MLS)', 'Chicago': 'USA (MLS)',
    'Minnesota': 'USA (MLS)', 'Houston': 'USA (MLS)',
    'Dallas': 'USA (MLS)', 'Colorado': 'USA (MLS)',
    'Salt Lake': 'USA (MLS)', 'San Jose': 'USA (MLS)',
    'Vancouver': 'USA (MLS)', 'Charlotte': 'USA (MLS)',
    'St. Louis': 'USA (MLS)', 'San Diego': 'USA (MLS)',
    'D.C. United': 'USA (MLS)', 'Sporting Kansas': 'USA (MLS)',
    'Orlando': 'USA (MLS)',
  };
  
  // Check for partial matches
  for (const [key, country] of Object.entries(clubToCountry)) {
    if (club.toLowerCase().includes(key.toLowerCase())) {
      return country;
    }
  }
  
  return 'International';
}

