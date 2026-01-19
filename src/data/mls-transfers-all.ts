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

// Infer source country from club name - MUST be defined before ALL_TRANSFERS
export function inferCountryFromClub(club: string): string {
  if (!club || club.trim() === '') return 'Free Agent';
  
  const clubLower = club.toLowerCase();
  
  // Handle special domestic cases FIRST
  if (clubLower.includes('without club') || clubLower.includes('retired') || 
      clubLower.includes('free agent') || clubLower.includes('unattached')) {
    return 'Free Agent';
  }
  
  if (clubLower.includes('mls pool') || clubLower.includes('superdraft') ||
      clubLower.includes('homegrown') || clubLower.includes('generation adidas')) {
    return 'USA (Draft/Pool)';
  }
  
  // MLS Next Pro teams (all USA-based development teams, including encoded versions)
  const mlsNextProTeams = [
    'switchback', 'lv light', 'las vegas', 'san antonio fc', 'phoenix rising', 'phoenix ri ing',
    'orange county', 'loudoun united', 'loudoun', 'north texas', 'north texa', 'revolution ii', 
    'san diego loyal', 'tacoma defiance', 'tacoma', 'huntsville city', 'carolina core',
    'crown legacy', 'atlanta united 2', 'atl utd 2', 'atl utd', 'chicago fire ii', 'fc cincinnati 2',
    'columbus crew 2', 'colorado rapids 2', 'fc dallas 2', 'houston dynamo 2',
    'inter miami ii', 'lafc 2', 'la galaxy ii', 'minnesota united 2',
    'nashville sc ii', 'new england revolution ii', 'new york city fc ii',
    'new york red bulls ii', 'ny red bull ii', 'ny red bulls ii', 'rbny ii',
    'orlando city b', 'philadelphia union ii',
    'portland timbers 2', 'real monarchs', 'real monarch', 'real salt lake 2', 
    'san jose earthquakes ii', 'sj earthquake',
    'seattle sounders 2', 'sporting kc ii', 'st louis city 2', 'toronto fc ii',
    'vancouver whitecaps 2', 'austin fc ii', 'nycfc ii'
  ];
  
  for (const team of mlsNextProTeams) {
    if (clubLower.includes(team)) {
      return 'USA (MLS Next Pro)';
    }
  }
  
  // USL Championship teams (including encoded versions with missing 's')
  const uslTeams = [
    'birmingham legion', 'legion fc', 'charleston battery', 'charle ton', 'colorado springs', 
    'detroit city', 'el paso', 'el pa o', 'fc tulsa', 'tul a', 'tulsa', 'hartford athletic', 'hartford',
    'indy eleven', 'las vegas lights', 'louisville city', 'loui ville', 'memphis 901', 'memphi',
    'miami fc', 'monterey bay', 'new mexico united', 'oakland roots', 'pittsburgh', 'pitt burgh',
    'rio grande valley', 'rgv', 'sacramento republic', 'tampa bay rowdies', 'tb rowdie',
    'tulsa roughnecks', 'birmingham', 'the town fc'
  ];
  
  for (const team of uslTeams) {
    if (clubLower.includes(team)) {
      return 'USA (USL)';
    }
  }
  
  // Canadian Premier League
  const cplTeams = [
    'valour fc', 'valour', 'forge fc', 'forge', 'cavalry fc', 'cavalry',
    'pacific fc', 'york united', 'atletico ottawa', 'atl. ottawa', 'atl ottawa',
    'hfx wanderers', 'halifax', 'fc edmonton', 'edmonton'
  ];
  
  for (const team of cplTeams) {
    if (clubLower.includes(team)) {
      return 'Canada (CPL)';
    }
  }
  
  // Check for MLS internal transfers (partial team names)
  // These show up as just "New York", "Colorado", "Miami", etc.
  // Including encoded versions with missing 's' characters
  const mlsPartialNames = [
    'lafc', 'la galaxy', 'galaxy', 'inter miami', 'miami', 'atlanta united', 'atl utd', 'atlanta',
    'seattle', 'portland', 'austin', 'nashville', 'na hville', 'cincinnati', 'columbus', 'columbu',
    'new york city', 'nyc', 'nycfc', 'red bull', 'rbny', 'orlando', 'orlando city',
    'philadelphia', 'union', 'new england', 'revolution', 'chicago', 'fire',
    'minnesota', 'minne ota', 'loon', 'houston', 'hou ton', 'dynamo', 'dallas', 'dalla', 'fc dallas',
    'colorado', 'rapid', 'salt lake', 'real salt', 'rsl', 'san jose', 'earthquake', 'sj earthquake',
    'vancouver', 'whitecap', 'charlotte', 'st. louis', 'st louis', 'st. loui', 
    'stl city', 'san diego fc', 'd.c.', 'dc united', 'sporting k', 'kansas city', 'skc',
    'toronto', 'tfc', 'montreal', 'montréal', 'cf montreal'
  ];
  
  for (const team of mlsPartialNames) {
    if (clubLower.includes(team)) {
      return 'USA (MLS)';
    }
  }
  
  // Check for "draft" or specific MLS acquisition types
  if (clubLower.includes('draft') || clubLower.includes('?')) {
    return 'USA (MLS)';
  }
  
  const clubToCountry: Record<string, string> = {
    // Major European leagues - England
    'Middlesbrough': 'England', 'Newcastle': 'England', 'Chelsea': 'England',
    'Watford': 'England', 'Crystal Palace': 'England', 'Bournemouth': 'England',
    'Brighton': 'England', 'Tottenham': 'England', 'Sheffield': 'England',
    'Manchester': 'England', 'Liverpool': 'England', 'Arsenal': 'England',
    'Fulham': 'England', 'Everton': 'England', 'West Ham': 'England',
    'Leeds': 'England', 'Southampton': 'England', 'Leicester': 'England',
    'Wolverhampton': 'England', 'Nottingham': 'England', 'Brentford': 'England',
    'Reading': 'England', 'Ipswich': 'England', 'QPR': 'England',
    'Aston Villa': 'England', 'Luton': 'England', 'Burnley': 'England',
    'Sunderland': 'England', 'Stoke': 'England', 'Derby': 'England',
    
    // Spain
    'Granada': 'Spain', 'Celta': 'Spain', 'Valladolid': 'Spain',
    'Betis': 'Spain', 'Barcelona': 'Spain', 'Real Madrid': 'Spain',
    'Atlético': 'Spain', 'Sevilla': 'Spain', 'Valencia': 'Spain',
    'Villarreal': 'Spain', 'Athletic': 'Spain', 'Sociedad': 'Spain',
    'Almería': 'Spain', 'Cádiz': 'Spain', 'Getafe': 'Spain',
    'Girona': 'Spain', 'Las Palmas': 'Spain', 'Osasuna': 'Spain',
    'Mallorca': 'Spain', 'Leganés': 'Spain', 'Rayo': 'Spain',
    'Espanyol': 'Spain', 'Elche': 'Spain',
    
    // Italy
    'Atalanta': 'Italy', 'Genoa': 'Italy', 'Milan': 'Italy',
    'Juventus': 'Italy', 'Napoli': 'Italy', 'Roma': 'Italy',
    'Inter': 'Italy', 'Lazio': 'Italy', 'Fiorentina': 'Italy',
    'Torino': 'Italy', 'Bologna': 'Italy', 'Sassuolo': 'Italy',
    'Udinese': 'Italy', 'Empoli': 'Italy', 'Lecce': 'Italy',
    'Monza': 'Italy', 'Verona': 'Italy', 'Salernitana': 'Italy',
    'Sampdoria': 'Italy', 'Venezia': 'Italy', 'Cagliari': 'Italy',
    
    // Germany
    'Dortmund': 'Germany', 'Leipzig': 'Germany', 'Bayern': 'Germany',
    'Wolfsburg': 'Germany', 'Leverkusen': 'Germany', 'Frankfurt': 'Germany',
    'Hoffenheim': 'Germany', 'Freiburg': 'Germany', 'Köln': 'Germany',
    'Gladbach': 'Germany', 'Bremen': 'Germany', 'Schalke': 'Germany',
    'Hamburg': 'Germany', 'Stuttgart': 'Germany', 'Union Berlin': 'Germany',
    'Augsburg': 'Germany', 'Mainz': 'Germany', 'Bochum': 'Germany',
    'Hertha': 'Germany', 'Düsseldorf': 'Germany', 'Nürnberg': 'Germany',
    'Hannover': 'Germany', 'Greuther': 'Germany', 'St. Pauli': 'Germany',
    
    // France
    'PSG': 'France', 'Nice': 'France', 'Saint-Étienne': 'France',
    'Lens': 'France', 'Amiens': 'France', 'Metz': 'France',
    'Le Havre': 'France', 'Rennes': 'France', 'Lyon': 'France',
    'Monaco': 'France', 'Marseille': 'France', 'Lille': 'France',
    'Montpellier': 'France', 'Nantes': 'France', 'Toulouse': 'France',
    'Reims': 'France', 'Strasbourg': 'France', 'Brest': 'France',
    'Lorient': 'France', 'Angers': 'France', 'Auxerre': 'France',
    'Bordeaux': 'France', 'Clermont': 'France', 'Troyes': 'France',
    
    // Belgium
    'Club Brugge': 'Belgium', 'Cercle Brugge': 'Belgium', 'Standard': 'Belgium',
    'Union': 'Belgium', 'Gent': 'Belgium', 'Antwerp': 'Belgium',
    'Anderlecht': 'Belgium', 'Genk': 'Belgium', 'Mechelen': 'Belgium',
    'Charleroi': 'Belgium', 'Westerlo': 'Belgium', 'Kortrijk': 'Belgium',
    
    // Netherlands
    'PSV': 'Netherlands', 'Ajax': 'Netherlands', 'Feyenoord': 'Netherlands',
    'Twente': 'Netherlands', 'Utrecht': 'Netherlands', 'Vitesse': 'Netherlands',
    'AZ': 'Netherlands', 'Groningen': 'Netherlands', 'Heerenveen': 'Netherlands',
    
    // Portugal
    'Sporting': 'Portugal', 'Benfica': 'Portugal', 'Porto': 'Portugal',
    'Braga': 'Portugal', 'Famalicão': 'Portugal', 'Vitória': 'Portugal',
    'Gil Vicente': 'Portugal', 'Guimarães': 'Portugal', 'Leiria': 'Portugal',
    
    // South America - Brazil (including encoded versions)
    'Botafogo': 'Brazil', 'Vasco': 'Brazil', 'Palmeiras': 'Brazil', 'Palmeira': 'Brazil',
    'Corinthians': 'Brazil', 'Corinthian': 'Brazil', 'Bahia': 'Brazil', 'Fortaleza': 'Brazil',
    'Grêmio': 'Brazil', 'Gremio': 'Brazil', 'Atlético Mineiro': 'Brazil', 'Flamengo': 'Brazil',
    'Santos': 'Brazil', 'Internacional': 'Brazil', 'Fluminense': 'Brazil', 'Fluminen e': 'Brazil',
    'São Paulo': 'Brazil', 'Sao Paulo': 'Brazil', 'Cruzeiro': 'Brazil', 'Cuiabá': 'Brazil',
    'Red Bull Bragantino': 'Brazil', 'Bragantino': 'Brazil', 'Athletico': 'Brazil', 
    'Goiás': 'Brazil', 'Goia': 'Brazil', 'Ceará': 'Brazil', 'Coritiba': 'Brazil',
    'America MG': 'Brazil', 'Sport Recife': 'Brazil', 'Vitória': 'Brazil',
    
    // Argentina (including encoded versions)
    'Racing': 'Argentina', 'Racing Club': 'Argentina', 'Boca': 'Argentina', 'River': 'Argentina',
    'Vélez': 'Argentina', 'Velez': 'Argentina', 'Independiente': 'Argentina', 'Godoy Cruz': 'Argentina',
    'Estudiantes': 'Argentina', 'E tudiante': 'Argentina', 'San Lorenzo': 'Argentina', 
    'Lanús': 'Argentina', 'Lanu': 'Argentina', 'Tucumán': 'Argentina', 'Instituto': 'Argentina', 
    'Talleres': 'Argentina', 'Tallere': 'Argentina', 'Newell': 'Argentina', 'Rosario': 'Argentina', 
    'Colón': 'Argentina', 'Platense': 'Argentina', 'Platen e': 'Argentina', 
    'Argentinos': 'Argentina', 'Argentino': 'Argentina', 'Gimnasia': 'Argentina', 'Gimna ia': 'Argentina',
    'Huracán': 'Argentina', 'Huracan': 'Argentina', 'Defensa': 'Argentina', 'Defen a': 'Argentina', 
    'Tigre': 'Argentina', 'Banfield': 'Argentina', 'Central Córdoba': 'Argentina',
    'Unión': 'Argentina', 'Union Santa Fe': 'Argentina', 'Belgrano': 'Argentina',
    
    // Mexico (including encoded versions)
    'Monterrey': 'Mexico', 'Cruz Azul': 'Mexico', 'Tigres': 'Mexico', 'Tigre UANL': 'Mexico',
    'Atlas': 'Mexico', 'Chivas': 'Mexico', 'Chiva': 'Mexico', 'Guadalajara': 'Mexico',
    'Pumas': 'Mexico', 'Puma': 'Mexico', 'UNAM': 'Mexico',
    'Toluca': 'Mexico', 'América': 'Mexico', 'America': 'Mexico', 'Club America': 'Mexico',
    'Pachuca': 'Mexico', 'Santos Laguna': 'Mexico', 'Santo Laguna': 'Mexico',
    'León': 'Mexico', 'Leon': 'Mexico', 'Querétaro': 'Mexico', 'Queretaro': 'Mexico',
    'Necaxa': 'Mexico', 'Tijuana': 'Mexico', 'Xolo': 'Mexico', 'Mazatlán': 'Mexico', 'Mazatlan': 'Mexico',
    'San Luis': 'Mexico', 'Puebla': 'Mexico', 'Juárez': 'Mexico', 'Juarez': 'Mexico',
    
    // Colombia
    'Millonarios': 'Colombia', 'Nacional': 'Colombia', 'Junior': 'Colombia',
    'Medellín': 'Colombia', 'América de Cali': 'Colombia', 'Cali': 'Colombia',
    'Deportivo Cali': 'Colombia', 'Santa Fe': 'Colombia', 'Once Caldas': 'Colombia',
    'Envigado': 'Colombia', 'Bucaramanga': 'Colombia', 'Tolima': 'Colombia',
    
    // Other South America
    'Peñarol': 'Uruguay', 'Nacional Montevideo': 'Uruguay', 'Defensor': 'Uruguay',
    'Colo-Colo': 'Chile', 'Universidad': 'Chile', 'Católica': 'Chile',
    'Olimpia': 'Paraguay', 'Libertad': 'Paraguay', 'Cerro Porteño': 'Paraguay',
    'Guaraní': 'Paraguay', 'Nacional Asunción': 'Paraguay',
    'Bolívar': 'Bolivia', 'The Strongest': 'Bolivia',
    'Alianza Lima': 'Peru', 'Sporting Cristal': 'Peru', 'Universitario': 'Peru',
    'Caracas': 'Venezuela', 'Deportivo Táchira': 'Venezuela',
    'Barcelona SC': 'Ecuador', 'LDU Quito': 'Ecuador', 'Emelec': 'Ecuador',
    
    // Eastern Europe
    'Red Star': 'Serbia', 'Partizan': 'Serbia', 'Čukarički': 'Serbia',
    'Dnipro': 'Ukraine', 'Dynamo Kyiv': 'Ukraine', 'Shakhtar': 'Ukraine',
    'Polissya': 'Ukraine', 'Metalist': 'Ukraine', 'Zorya': 'Ukraine',
    'Zenit': 'Russia', 'CSKA Moscow': 'Russia', 'Spartak Moscow': 'Russia',
    'Lokomotiv': 'Russia', 'Krasnodar': 'Russia',
    'Dinamo Zagreb': 'Croatia', 'Hajduk': 'Croatia', 'Rijeka': 'Croatia',
    'Slovan': 'Slovakia', 'Ferencváros': 'Hungary', 'Ludogorets': 'Bulgaria',
    'CSKA Sofia': 'Bulgaria', 'Steaua': 'Romania', 'CFR Cluj': 'Romania',
    
    // Scandinavia
    'Copenhagen': 'Denmark', 'Nordsjaelland': 'Denmark', 'Brøndby': 'Denmark',
    'Randers': 'Denmark', 'Midtjylland': 'Denmark', 'Silkeborg': 'Denmark',
    'Häcken': 'Sweden', 'AIK': 'Sweden', 'Malmö': 'Sweden',
    'Djurgården': 'Sweden', 'Elfsborg': 'Sweden', 'Gothenburg': 'Sweden',
    'Hammarby': 'Sweden', 'Norrköping': 'Sweden',
    'Lillestrom': 'Norway', 'Rosenborg': 'Norway', 'Viking': 'Norway',
    'Molde': 'Norway', 'Bodø': 'Norway', 'Brann': 'Norway',
    'HJK': 'Finland', 'KuPS': 'Finland',
    
    // Other European
    'Celtic': 'Scotland', 'Rangers': 'Scotland', 'Hearts': 'Scotland',
    'Aberdeen': 'Scotland', 'Hibernian': 'Scotland',
    'Fenerbahçe': 'Turkey', 'Galatasaray': 'Turkey', 'Besiktas': 'Turkey',
    'Trabzonspor': 'Turkey', 'Basaksehir': 'Turkey',
    'PAOK': 'Greece', 'Panathinaikos': 'Greece', 'AEK': 'Greece', 'Olympiacos': 'Greece',
    'Slavia': 'Czech Republic', 'Sparta': 'Czech Republic', 'Viktoria': 'Czech Republic',
    'Legia': 'Poland', 'Lech': 'Poland', 'Jagiellonia': 'Poland',
    'Cracovia': 'Poland', 'Raków': 'Poland',
    'Salzburg': 'Austria', 'Sturm Graz': 'Austria', 'Rapid Wien': 'Austria',
    'Basel': 'Switzerland', 'Young Boys': 'Switzerland', 'Servette': 'Switzerland',
    'Maccabi': 'Israel', 'Hapoel': 'Israel',
    'Dinamo Tbilisi': 'Georgia', 'Shakhter Karagandy': 'Kazakhstan',
    'Sheriff': 'Moldova',
    
    // Asia
    'Al-Hilal': 'Saudi Arabia', 'Al-Nassr': 'Saudi Arabia', 'Al-Ittihad': 'Saudi Arabia',
    'Al-Ahli': 'Saudi Arabia',
    'Kashima': 'Japan', 'Urawa': 'Japan', 'Kawasaki': 'Japan',
    'Vissel': 'Japan', 'Yokohama': 'Japan', 'FC Tokyo': 'Japan',
    'Jeonbuk': 'South Korea', 'Ulsan': 'South Korea', 'Seoul': 'South Korea',
    'Guangzhou': 'China', 'Shanghai': 'China', 'Beijing': 'China',
    'Melbourne': 'Australia', 'Sydney': 'Australia', 'Western United': 'Australia',
    
    // Central America & Caribbean
    'Saprissa': 'Costa Rica', 'Alajuelense': 'Costa Rica',
    'Comunicaciones': 'Guatemala', 'Motagua': 'Honduras', 'Olimpia Honduras': 'Honduras',
    'FAS': 'El Salvador', 'Alianza FC': 'El Salvador',
    'Portmore': 'Jamaica', 'Arnett Gardens': 'Jamaica',
    
    // MLS teams (for internal transfers)
    'Los Angeles FC': 'USA (MLS)', 'Los Angeles Galaxy': 'USA (MLS)', 
    'Inter Miami': 'USA (MLS)', 'Atlanta United': 'USA (MLS)',
    'Seattle Sounders': 'USA (MLS)', 'Portland Timbers': 'USA (MLS)',
    'Austin FC': 'USA (MLS)', 'Nashville': 'USA (MLS)',
    'Cincinnati': 'USA (MLS)', 'Columbus': 'USA (MLS)',
    'Toronto': 'Canada (MLS)', 'Montréal': 'Canada (MLS)',
    'New York': 'USA (MLS)', 'Philadelphia': 'USA (MLS)',
    'New England': 'USA (MLS)', 'Chicago': 'USA (MLS)',
    'Minnesota': 'USA (MLS)', 'Houston': 'USA (MLS)',
    'Dallas': 'USA (MLS)', 'Colorado': 'USA (MLS)',
    'Salt Lake': 'USA (MLS)', 'San Jose': 'USA (MLS)',
    'Vancouver': 'Canada (MLS)', 'Charlotte': 'USA (MLS)',
    'St. Louis': 'USA (MLS)', 'San Diego': 'USA (MLS)',
    'D.C. United': 'USA (MLS)', 'Sporting Kansas': 'USA (MLS)',
    'Orlando': 'USA (MLS)', 'LAFC': 'USA (MLS)', 'Galaxy': 'USA (MLS)',
    'NYC': 'USA (MLS)', 'RBNY': 'USA (MLS)', 'NYCFC': 'USA (MLS)',
    'Miami': 'USA (MLS)',
  };
  
  // Check for partial matches (case-insensitive) using clubToCountry map
  for (const [key, country] of Object.entries(clubToCountry)) {
    if (clubLower.includes(key.toLowerCase())) {
      return country;
    }
  }
  
  return 'International';
}

// All transfers from the scraped data, with inferred source countries
export const ALL_TRANSFERS: TransferRecord[] = (transferData.transfers as TransferRecord[]).map(t => ({
  ...t,
  // Convert fee and marketValue to USD
  fee: Math.round(t.fee * EUR_TO_USD),
  marketValue: Math.round(t.marketValue * EUR_TO_USD),
  // Fill in missing source countries based on club name
  sourceCountry: t.sourceCountry || inferCountryFromClub(t.sourceClub),
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
