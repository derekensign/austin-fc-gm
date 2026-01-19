// Comprehensive MLS Transfer Data from Transfermarkt (2020-2024)
// Scraped from all 5 seasons of transfer activity
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

// Infer country from club name
function inferCountryFromClub(club: string): string {
  if (!club || club.trim() === '') return 'Unknown';
  
  // Remove common suffixes before matching
  let c = club.toLowerCase()
    .replace(/\s*(free\s*)?tran\s*fer$/i, '')  // "free transfer" or "tran fer" with encoding issues
    .replace(/\s*loan\s*(tran\s*fer)?$/i, '')  // "loan" or "loan transfer"
    .replace(/\s*end\s*of\s*loan.*$/i, '')     // "end of loan..."
    .replace(/\s*draft$/i, '')                  // "draft"
    .replace(/\s*-\s*$/g, '')                  // trailing " -"
    .trim();

  // Handle "Without Club" and "Retired" - these are free agents
  if (c.includes('without club') || c.includes('retired') || c === '') return 'Free Agent';
  
  // MLS teams (including partial names and encoding issues)
  const mlsTeams = [
    'atlanta united', 'austin', 'charlotte fc', 'chicago fire', 'fc cincinnati',
    'colorado rapids', 'columbus crew', 'columbu', 'd.c. united', 'fc dallas',
    'houston dynamo', 'houston', 'inter miami', 'la galaxy', 'los angeles fc', 
    'lafc', 'los angeles galaxy', 'minnesota united', 'minne ota', 'cf montréal', 
    'montréal', 'nashville sc', 'nashville', 'new england revolution', 'new england',
    'new york red bulls', 'new york city fc', 'nycfc', 'orlando city', 'philadelphia union',
    'portland timbers', 'portland', 'real salt lake', 'salt lake', 'san jose earthquakes', 
    'sj earthquake', 'san jose', 'san diego fc', 'seattle sounders', 'seattle',
    'sporting kansas city', 'sporting kc', 'kansas city', 'st. louis city', 'st. loui',
    'toronto fc', 'toronto', 'vancouver whitecaps', 'vancouver', 'atlanta', 'charlotte',
    'chicago', 'cincinnati', 'colorado', 'miami', 'orlando', 'philadelphia',
    'revolution', 'timbers', 'sounders', 'galaxy', 'rapids', 'crew', 'dynamo', 
    'fire', 'union', 'red bulls', 'whitecaps', 'dallas', 'dalla'
  ];
  if (mlsTeams.some(t => c.includes(t) || c === t)) return 'USA';

  // MLS Next Pro / Academy
  const mlsNextPro = [
    'ii', ' 2', 'tacoma', 'north texas', 'galaxy ii', 'la galaxy 2', 'lafc 2',
    'huntsville', 'crown legacy', 'rochester', 'st louis 2', 'atlanta united 2',
    'orlando city b', 'inter miami ii', 'portland t2', 'real monarchs', 'austin fc ii',
    'nycfc ii', 'chicago fire ii', 'fc cincinnati 2', 'columbus crew 2', 'colorado rapids 2',
    'fc dallas 2', 'houston dynamo 2', 'minnesota united 2', 'nashville sc ii',
    'new england revolution ii', 'new york city fc ii', 'new york red bulls ii',
    'philadelphia union ii', 'portland timbers 2', 'real salt lake 2',
    'san jose earthquakes ii', 'seattle sounders 2', 'sporting kc ii', 'toronto fc ii',
    'vancouver whitecaps 2', 'academy', 'homegrown'
  ];
  if (mlsNextPro.some(t => c.includes(t))) return 'USA';

  // USL teams
  const uslTeams = [
    'birmingham legion', 'charleston battery', 'colorado springs', 'detroit city',
    'el paso locomotive', 'fc tulsa', 'hartford athletic', 'indy eleven', 'las vegas lights',
    'louisville city', 'memphis 901', 'miami fc', 'monterey bay', 'new mexico united',
    'oakland roots', 'pittsburgh riverhounds', 'rio grande valley', 'sacramento republic',
    'tampa bay rowdies', 'phoenix rising', 'orange county', 'loudoun united', 'san antonio fc',
    'switchbacks', 'lv lights', 'legion fc', 'rowdies', 'tormenta', 'forward madison',
    'union omaha', 'ventura county', 'san diego loyal', 'rhode island', 'reno fc',
    'carolina core', 'lexington', 'tulsa', 'birmingham', 'charleston', 'pittsburgh',
    'louisville', 'memphis', 'el paso', 'phoenix', 'loudoun', 'sacramento'
  ];
  if (uslTeams.some(t => c.includes(t))) return 'USA';

  // US Colleges
  const usColleges = [
    'duke', 'wake forest', 'georgetown', 'penn state', 'stanford', 'ucla', 'virginia',
    'maryland', 'akron', 'indiana', 'clemson', 'north carolina', 'kentucky', 'syracuse',
    'blue devils', 'tar heels', 'hoosiers', 'cardinals', 'demon deacons', 'cavaliers',
    'nittany lions', 'buckeyes', 'zips', 'wildcats', 'tigers', 'seminoles', 'hokies',
    'huskies', 'bruins', 'trojans', 'rams', 'aggies', 'bulldogs', 'gators', 'hurricanes'
  ];
  if (usColleges.some(t => c.includes(t))) return 'USA';

  // Draft / MLS Pool / Free Agent
  if (c.includes('draft') || c.includes('mls pool') || c.includes('superdraft') ||
      c.includes('free agent') || c.includes('generation adidas') ||
      c.includes('homegrown signing') || c === 'new' || c === 'ne' || c === '') return 'USA';

  // Canadian teams
  const canadianTeams = [
    'toronto', 'vancouver', 'montreal', 'montréal', 'cf montréal', 'valour', 'forge',
    'cavalry', 'pacific fc', 'york united', 'atletico ottawa', 'hfx wanderers',
    'fc edmonton', 'vancouver whitecaps'
  ];
  if (canadianTeams.some(t => c.includes(t))) return 'Canada';

  // England
  const englishClubs = [
    'arsenal', 'chelsea', 'liverpool', 'manchester', 'tottenham', 'west ham', 'everton',
    'newcastle', 'aston villa', 'leicester', 'brighton', 'crystal palace', 'wolves',
    'wolverhampton', 'burnley', 'norwich', 'watford', 'southampton', 'leeds', 'fulham',
    'brentford', 'nottingham', 'bournemouth', 'sheffield', 'luton', 'ipswich',
    'championship', 'premier league', 'england', 'blackburn', 'blackpool', 'bolton',
    'bristol', 'cardiff', 'charlton', 'coventry', 'derby', 'huddersfield', 'hull',
    'middlesbrough', 'millwall', 'plymouth', 'portsmouth', 'qpr', 'reading', 'rotherham',
    'stoke', 'sunderland', 'swansea', 'west brom', 'wigan', 'birmingham city', 'oxford'
  ];
  if (englishClubs.some(t => c.includes(t))) return 'England';

  // Germany
  const germanClubs = [
    'bayern', 'dortmund', 'leipzig', 'leverkusen', 'frankfurt', 'wolfsburg', 'gladbach',
    'hoffenheim', 'freiburg', 'stuttgart', 'mainz', 'augsburg', 'hertha', 'schalke',
    'köln', 'union berlin', 'werder', 'hamburg', 'hannover', 'nürnberg', 'bundesliga',
    'germany', 'dusseldorf', 'düsseldorf', 'kaiserslautern', 'st. pauli', 'greuther fürth'
  ];
  if (germanClubs.some(t => c.includes(t))) return 'Germany';

  // Spain
  const spanishClubs = [
    'barcelona', 'real madrid', 'atletico madrid', 'sevilla', 'valencia', 'villarreal',
    'athletic bilbao', 'real sociedad', 'betis', 'celta vigo', 'espanyol', 'getafe',
    'granada', 'levante', 'mallorca', 'osasuna', 'rayo vallecano', 'alaves', 'cadiz',
    'elche', 'girona', 'la liga', 'spain', 'almería', 'las palmas', 'valladolid',
    'sporting gijon', 'tenerife', 'zaragoza', 'deportivo', 'malaga', 'huesca', 'leganes'
  ];
  if (spanishClubs.some(t => c.includes(t))) return 'Spain';

  // Italy
  const italianClubs = [
    'juventus', 'inter milan', 'ac milan', 'roma', 'napoli', 'lazio', 'fiorentina',
    'atalanta', 'torino', 'bologna', 'sassuolo', 'verona', 'udinese', 'sampdoria',
    'genoa', 'spezia', 'empoli', 'salernitana', 'monza', 'lecce', 'cremonese', 'serie a',
    'italy', 'parma', 'cagliari', 'palermo', 'bari', 'brescia', 'perugia', 'venezia',
    'como', 'frosinone', 'cesena'
  ];
  if (italianClubs.some(t => c.includes(t))) return 'Italy';

  // France
  const frenchClubs = [
    'psg', 'paris saint', 'marseille', 'lyon', 'monaco', 'lille', 'nice', 'rennes',
    'lens', 'montpellier', 'nantes', 'strasbourg', 'toulouse', 'lorient', 'reims',
    'angers', 'troyes', 'ajaccio', 'auxerre', 'brest', 'clermont', 'ligue 1', 'france',
    'bordeaux', 'saint-etienne', 'metz', 'dijon', 'guingamp', 'amiens', 'caen', 'le havre'
  ];
  if (frenchClubs.some(t => c.includes(t))) return 'France';

  // Netherlands
  const dutchClubs = [
    'ajax', 'psv', 'feyenoord', 'az alkmaar', 'twente', 'utrecht', 'vitesse', 'heerenveen',
    'groningen', 'heracles', 'willem ii', 'sparta rotterdam', 'nec', 'cambuur', 'volendam',
    'excelsior', 'rkc', 'fortuna sittard', 'go ahead eagles', 'emmen', 'almere',
    'eredivisie', 'netherlands', 'holland', 'dutch'
  ];
  if (dutchClubs.some(t => c.includes(t))) return 'Netherlands';

  // Belgium
  const belgianClubs = [
    'club brugge', 'anderlecht', 'genk', 'antwerp', 'standard liege', 'gent', 'union sg',
    'mechelen', 'charleroi', 'cercle brugge', 'westerlo', 'oud-heverlee', 'oostende',
    'kortrijk', 'sint-truiden', 'eupen', 'jupiler', 'belgium', 'belgian'
  ];
  if (belgianClubs.some(t => c.includes(t))) return 'Belgium';

  // Portugal
  const portugueseClubs = [
    'benfica', 'porto', 'sporting cp', 'sporting lisbon', 'braga', 'vitoria guimaraes',
    'boavista', 'maritimo', 'famalicao', 'pacos ferreira', 'gil vicente', 'estoril',
    'rio ave', 'arouca', 'casa pia', 'chaves', 'farense', 'portimonense', 'santa clara',
    'vizela', 'leiria', 'primeira liga', 'portugal', 'portuguese'
  ];
  if (portugueseClubs.some(t => c.includes(t))) return 'Portugal';

  // Brazil
  const brazilianClubs = [
    'flamengo', 'palmeiras', 'corinthians', 'sao paulo', 'santos', 'gremio', 'internacional',
    'atletico mineiro', 'fluminense', 'botafogo', 'cruzeiro', 'vasco', 'athletico paranaense',
    'bahia', 'fortaleza', 'ceara', 'goias', 'coritiba', 'cuiaba', 'america mineiro',
    'bragantino', 'serie a', 'brazil', 'brazilian', 'brasileirao'
  ];
  if (brazilianClubs.some(t => c.includes(t))) return 'Brazil';

  // Argentina
  const argentineClubs = [
    'boca juniors', 'river plate', 'racing club', 'independiente', 'san lorenzo',
    'estudiantes', 'velez sarsfield', 'lanus', 'talleres', 'defensa y justicia',
    'banfield', 'argentinos juniors', 'colon', 'union santa fe', 'godoy cruz',
    'central cordoba', 'patronato', 'sarmiento', 'platense', 'barracas', 'tigre',
    'arsenal sarandi', 'newell', 'rosario central', 'belgrano', 'instituto',
    'superliga', 'argentina', 'argentine'
  ];
  if (argentineClubs.some(t => c.includes(t))) return 'Argentina';

  // Mexico
  const mexicanClubs = [
    'club america', 'guadalajara', 'chivas', 'cruz azul', 'pumas unam', 'tigres',
    'monterrey', 'santos laguna', 'toluca', 'pachuca', 'leon', 'atlas', 'necaxa',
    'queretaro', 'puebla', 'mazatlan', 'juarez', 'san luis', 'tijuana', 'liga mx',
    'mexico', 'mexican'
  ];
  if (mexicanClubs.some(t => c.includes(t))) return 'Mexico';

  // Colombia
  const colombianClubs = [
    'atletico nacional', 'millonarios', 'america de cali', 'independiente medellin',
    'junior barranquilla', 'santa fe', 'deportivo cali', 'once caldas', 'tolima',
    'envigado', 'pereira', 'bucaramanga', 'colombia', 'colombian'
  ];
  if (colombianClubs.some(t => c.includes(t))) return 'Colombia';

  // Denmark
  const danishClubs = [
    'copenhagen', 'midtjylland', 'nordsjaelland', 'brondby', 'aarhus', 'aalborg',
    'randers', 'odense', 'silkeborg', 'viborg', 'superliga', 'denmark', 'danish', 'lyngby'
  ];
  if (danishClubs.some(t => c.includes(t))) return 'Denmark';

  // Sweden
  const swedishClubs = [
    'malmo', 'djurgarden', 'aik', 'hammarby', 'goteborg', 'elfsborg', 'norrkoping',
    'hacken', 'kalmar', 'helsingborg', 'orebro', 'allsvenskan', 'sweden', 'swedish'
  ];
  if (swedishClubs.some(t => c.includes(t))) return 'Sweden';

  // Norway
  const norwegianClubs = [
    'molde', 'rosenborg', 'bodo/glimt', 'brann', 'viking', 'lillestrom', 'valerenga',
    'stromsgodset', 'sarpsborg', 'odd', 'eliteserien', 'norway', 'norwegian'
  ];
  if (norwegianClubs.some(t => c.includes(t))) return 'Norway';

  // Scotland
  const scottishClubs = [
    'celtic', 'rangers', 'aberdeen', 'hearts', 'hibernian', 'dundee', 'motherwell',
    'st mirren', 'livingston', 'ross county', 'kilmarnock', 'st johnstone',
    'premiership', 'scotland', 'scottish'
  ];
  if (scottishClubs.some(t => c.includes(t))) return 'Scotland';

  // Poland
  const polishClubs = [
    'legia warsaw', 'lech poznan', 'rakow', 'pogon szczecin', 'slask wroclaw',
    'zaglebie', 'gornik zabrze', 'wisla krakow', 'jagiellonia', 'piast gliwice',
    'cracovia', 'ekstraklasa', 'poland', 'polish'
  ];
  if (polishClubs.some(t => c.includes(t))) return 'Poland';

  // Austria
  const austrianClubs = [
    'salzburg', 'rapid vienna', 'sturm graz', 'lask', 'austria vienna', 'wolfsberger',
    'hartberg', 'ried', 'altach', 'tirol', 'bundesliga', 'austria', 'austrian'
  ];
  if (austrianClubs.some(t => c.includes(t))) return 'Austria';

  // Switzerland
  const swissClubs = [
    'young boys', 'basel', 'zurich', 'servette', 'st gallen', 'lugano', 'grasshoppers',
    'lausanne', 'sion', 'luzern', 'super league', 'switzerland', 'swiss'
  ];
  if (swissClubs.some(t => c.includes(t))) return 'Switzerland';

  // Turkey
  const turkishClubs = [
    'galatasaray', 'fenerbahce', 'besiktas', 'trabzonspor', 'basaksehir', 'konyaspor',
    'antalyaspor', 'kasimpasa', 'sivasspor', 'alanyaspor', 'gaziantep', 'hatayspor',
    'kayserispor', 'adana demirspor', 'super lig', 'turkey', 'turkish', 'turkiye',
    'bandirma'
  ];
  if (turkishClubs.some(t => c.includes(t))) return 'Türkiye';

  // Greece
  const greekClubs = [
    'olympiacos', 'panathinaikos', 'aek athens', 'paok', 'aris', 'asteras tripolis',
    'volos', 'ionikos', 'lamia', 'super league', 'greece', 'greek'
  ];
  if (greekClubs.some(t => c.includes(t))) return 'Greece';

  // Czech Republic
  const czechClubs = [
    'sparta prague', 'slavia prague', 'plzen', 'viktoria plzen', 'bohemians',
    'slovacko', 'jablonec', 'liberec', 'mlada boleslav', 'zlin', 'czech', 'czechoslovak'
  ];
  if (czechClubs.some(t => c.includes(t))) return 'Czech Republic';

  // Croatia
  const croatianClubs = [
    'dinamo zagreb', 'hajduk split', 'rijeka', 'osijek', 'lokomotiva', 'gorica',
    'croatia', 'croatian'
  ];
  if (croatianClubs.some(t => c.includes(t))) return 'Croatia';

  // Serbia
  const serbianClubs = [
    'red star', 'partizan', 'vojvodina', 'cukaricki', 'tsc', 'serbia', 'serbian'
  ];
  if (serbianClubs.some(t => c.includes(t))) return 'Serbia';

  // Ukraine
  const ukrainianClubs = [
    'shakhtar', 'dynamo kyiv', 'dnipro', 'zorya', 'kolos kovalivka', 'chornomorets',
    'ukraine', 'ukrainian'
  ];
  if (ukrainianClubs.some(t => c.includes(t))) return 'Ukraine';

  // Russia
  const russianClubs = [
    'zenit', 'spartak moscow', 'cska moscow', 'lokomotiv moscow', 'dynamo moscow',
    'krasnodar', 'rostov', 'rubin kazan', 'sochi', 'russia', 'russian'
  ];
  if (russianClubs.some(t => c.includes(t))) return 'Russia';

  // Japan
  const japaneseClubs = [
    'kawasaki', 'yokohama', 'vissel kobe', 'kashima', 'urawa', 'gamba osaka',
    'cerezo osaka', 'fc tokyo', 'nagoya', 'j league', 'japan', 'japanese'
  ];
  if (japaneseClubs.some(t => c.includes(t))) return 'Japan';

  // South Korea
  const koreanClubs = [
    'jeonbuk', 'ulsan', 'seoul', 'suwon', 'pohang', 'daegu', 'k league',
    'korea', 'korean'
  ];
  if (koreanClubs.some(t => c.includes(t))) return 'South Korea';

  // Ecuador
  const ecuadorianClubs = [
    'barcelona sc', 'emelec', 'liga de quito', 'independiente del valle', 'aucas',
    'delfin', 'ecuador', 'ecuadorian'
  ];
  if (ecuadorianClubs.some(t => c.includes(t))) return 'Ecuador';

  // Paraguay
  const paraguayanClubs = [
    'olimpia', 'cerro porteno', 'libertad', 'guarani', 'nacional asuncion',
    'paraguay', 'paraguayan'
  ];
  if (paraguayanClubs.some(t => c.includes(t))) return 'Paraguay';

  // Uruguay
  const uruguayanClubs = [
    'penarol', 'nacional', 'defensor sporting', 'liverpool montevideo', 'river plate',
    'danubio', 'uruguay', 'uruguayan'
  ];
  if (uruguayanClubs.some(t => c.includes(t))) return 'Uruguay';

  // Chile
  const chileanClubs = [
    'colo colo', 'universidad de chile', 'universidad catolica', 'union espanola',
    'palestino', 'audax italiano', 'chile', 'chilean'
  ];
  if (chileanClubs.some(t => c.includes(t))) return 'Chile';

  // Peru
  const peruvianClubs = [
    'alianza lima', 'universitario', 'sporting cristal', 'melgar', 'cienciano',
    'peru', 'peruvian'
  ];
  if (peruvianClubs.some(t => c.includes(t))) return 'Peru';

  // Venezuela
  const venezuelanClubs = [
    'deportivo tachira', 'caracas fc', 'zamora fc', 'venezuela', 'venezuelan'
  ];
  if (venezuelanClubs.some(t => c.includes(t))) return 'Venezuela';

  // Costa Rica
  const costaRicanClubs = [
    'saprissa', 'alajuelense', 'herediano', 'san carlos', 'costa rica', 'costa rican'
  ];
  if (costaRicanClubs.some(t => c.includes(t))) return 'Costa Rica';

  // Jamaica
  if (c.includes('jamaica') || c.includes('jamaican') || c.includes('harbour view') || 
      c.includes('portmore')) return 'Jamaica';

  // Honduras
  if (c.includes('honduras') || c.includes('honduran') || c.includes('motagua') || 
      c.includes('olimpia') && c.includes('honduras')) return 'Honduras';

  // Israel
  const israeliClubs = [
    'maccabi tel aviv', 'maccabi haifa', 'hapoel', 'beitar jerusalem', 'bnei sakhnin',
    'israel', 'israeli'
  ];
  if (israeliClubs.some(t => c.includes(t))) return 'Israel';

  // Australia
  const australianClubs = [
    'melbourne victory', 'sydney fc', 'melbourne city', 'western sydney', 'brisbane roar',
    'central coast', 'wellington phoenix', 'a-league', 'australia', 'australian'
  ];
  if (australianClubs.some(t => c.includes(t))) return 'Australia';

  // UAE
  if (c.includes('al-') && (c.includes('wasl') || c.includes('ain') || c.includes('jazira') || 
      c.includes('nasr') || c.includes('wahda'))) return 'UAE';
  if (c.includes('uae') || c.includes('emirates')) return 'UAE';

  // Saudi Arabia
  if (c.includes('al-') && (c.includes('hilal') || c.includes('ahli') || c.includes('nassr') || 
      c.includes('ittihad') || c.includes('shabab'))) return 'Saudi Arabia';
  if (c.includes('saudi') || c.includes('arabia')) return 'Saudi Arabia';

  // Qatar
  if (c.includes('qatar') || c.includes('al duhail') || c.includes('al sadd') || 
      c.includes('al rayyan') || c.includes('al gharafa')) return 'Qatar';

  return 'International';
}

// Convert EUR values to USD and add inferred country
export const ALL_TRANSFERS: TransferRecord[] = (transferData as any).transfers.map((t: any) => ({
  ...t,
  marketValue: Math.round((t.marketValue || 0) * EUR_TO_USD),
  fee: Math.round((t.fee || 0) * EUR_TO_USD),
  sourceCountry: t.sourceCountry || inferCountryFromClub(t.sourceClub),
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
