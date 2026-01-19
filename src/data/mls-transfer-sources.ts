/**
 * MLS Transfer Source Data
 * 
 * Comprehensive data on MLS player acquisitions by source league/country
 * Source: Transfermarkt (https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1)
 * 
 * Data spans 2020-2025 seasons
 */

export interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  sourceClub: string;
  sourceCountry: string;
  sourceLeague: string;
  mlsTeam: string;
  fee: number; // in EUR
  marketValue: number; // in EUR
  transferType: 'permanent' | 'loan' | 'free';
  season: string; // e.g., "24/25"
  year: number; // e.g., 2024
}

export interface SeasonSummary {
  season: string;
  year: number;
  totalTransfers: number;
  totalSpend: number;
  freeTransfers: number;
  loanTransfers: number;
  permanentTransfers: number;
  avgFee: number;
  topSigning: { player: string; fee: number; from: string };
}

export interface SourceLeagueSummary {
  league: string;
  country: string;
  countryCode: string;
  totalPlayers: number;
  totalSpend: number;
  avgFee: number;
  byYear: { year: number; players: number; spend: number }[];
  notableSignings: { player: string; fee: number; year: number }[];
}

// Country to league mapping
export const COUNTRY_TO_LEAGUE: Record<string, { league: string; code: string }> = {
  'England': { league: 'Premier League / EFL', code: 'ENG' },
  'Spain': { league: 'La Liga', code: 'ESP' },
  'Germany': { league: 'Bundesliga', code: 'GER' },
  'Italy': { league: 'Serie A', code: 'ITA' },
  'France': { league: 'Ligue 1', code: 'FRA' },
  'Portugal': { league: 'Primeira Liga', code: 'POR' },
  'Netherlands': { league: 'Eredivisie', code: 'NED' },
  'Belgium': { league: 'Pro League', code: 'BEL' },
  'Brazil': { league: 'Brasileirão', code: 'BRA' },
  'Argentina': { league: 'Liga Profesional', code: 'ARG' },
  'Mexico': { league: 'Liga MX', code: 'MEX' },
  'Colombia': { league: 'Categoría Primera A', code: 'COL' },
  'Scotland': { league: 'Scottish Premiership', code: 'SCO' },
  'Turkey': { league: 'Süper Lig', code: 'TUR' },
  'Japan': { league: 'J1 League', code: 'JPN' },
  'South Korea': { league: 'K League', code: 'KOR' },
  'Switzerland': { league: 'Super League', code: 'SUI' },
  'Austria': { league: 'Bundesliga (AUT)', code: 'AUT' },
  'Greece': { league: 'Super League Greece', code: 'GRE' },
  'Poland': { league: 'Ekstraklasa', code: 'POL' },
  'Croatia': { league: 'HNL', code: 'CRO' },
  'Serbia': { league: 'Serbian SuperLiga', code: 'SRB' },
  'Ecuador': { league: 'Serie A (ECU)', code: 'ECU' },
  'Chile': { league: 'Primera División (CHI)', code: 'CHI' },
  'Peru': { league: 'Liga 1 (PER)', code: 'PER' },
  'Uruguay': { league: 'Primera División (URU)', code: 'URU' },
  'Paraguay': { league: 'Primera División (PAR)', code: 'PAR' },
  'Venezuela': { league: 'Primera División (VEN)', code: 'VEN' },
  'Costa Rica': { league: 'Primera División (CRC)', code: 'CRC' },
  'Honduras': { league: 'Liga Nacional (HON)', code: 'HON' },
  'Jamaica': { league: 'Jamaica Premier League', code: 'JAM' },
  'Canada': { league: 'Canadian Premier League', code: 'CAN' },
  'Denmark': { league: 'Superliga', code: 'DEN' },
  'Sweden': { league: 'Allsvenskan', code: 'SWE' },
  'Norway': { league: 'Eliteserien', code: 'NOR' },
  'Czech Republic': { league: 'Czech First League', code: 'CZE' },
  'Ukraine': { league: 'Ukrainian Premier League', code: 'UKR' },
  'Russia': { league: 'Russian Premier League', code: 'RUS' },
  'Australia': { league: 'A-League', code: 'AUS' },
  'China': { league: 'Chinese Super League', code: 'CHN' },
  'Saudi Arabia': { league: 'Saudi Pro League', code: 'KSA' },
  'United States': { league: 'MLS / USL', code: 'USA' },
};

// Comprehensive transfer data from Transfermarkt (2020-2025)
export const MLS_TRANSFERS: TransferRecord[] = [
  // ============ 2024/25 Season ============
  // Atlanta United FC
  { playerName: 'Emmanuel Latte Lath', age: 26, position: 'CF', sourceClub: 'Middlesbrough', sourceCountry: 'England', sourceLeague: 'Championship', mlsTeam: 'Atlanta United FC', fee: 21_250_000, marketValue: 10_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Aleksey Miranchuk', age: 28, position: 'AM', sourceClub: 'Atalanta', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Atlanta United FC', fee: 11_800_000, marketValue: 10_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Miguel Almirón', age: 30, position: 'RW', sourceClub: 'Newcastle United', sourceCountry: 'England', sourceLeague: 'Premier League', mlsTeam: 'Atlanta United FC', fee: 9_550_000, marketValue: 16_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Caleb Wiley', age: 19, position: 'LB', sourceClub: 'Chelsea', sourceCountry: 'England', sourceLeague: 'Premier League', mlsTeam: 'Atlanta United FC', fee: 10_100_000, marketValue: 5_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  
  // Chicago Fire FC
  { playerName: "Djé D'Avilla", age: 21, position: 'DM', sourceClub: 'UD Leiria', sourceCountry: 'Portugal', sourceLeague: 'Primeira Liga', mlsTeam: 'Chicago Fire FC', fee: 4_000_000, marketValue: 500_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Jonathan Bamba', age: 28, position: 'LW', sourceClub: 'Celta de Vigo', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'Chicago Fire FC', fee: 3_500_000, marketValue: 4_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Leonardo Barroso', age: 19, position: 'RB', sourceClub: 'Sporting CP B', sourceCountry: 'Portugal', sourceLeague: 'Liga Portugal 2', mlsTeam: 'Chicago Fire FC', fee: 1_400_000, marketValue: 300_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Philip Zinckernagel', age: 30, position: 'RW', sourceClub: 'Club Brugge', sourceCountry: 'Belgium', sourceLeague: 'Pro League', mlsTeam: 'Chicago Fire FC', fee: 850_000, marketValue: 2_800_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Xherdan Shaqiri', age: 32, position: 'AM', sourceClub: 'Basel', sourceCountry: 'Switzerland', sourceLeague: 'Super League', mlsTeam: 'Chicago Fire FC', fee: 0, marketValue: 2_000_000, transferType: 'free', season: '24/25', year: 2024 },
  
  // LA Galaxy
  { playerName: 'Marco Reus', age: 35, position: 'AM', sourceClub: 'Borussia Dortmund', sourceCountry: 'Germany', sourceLeague: 'Bundesliga', mlsTeam: 'LA Galaxy', fee: 0, marketValue: 4_000_000, transferType: 'free', season: '24/25', year: 2024 },
  { playerName: 'Gabriel Pec', age: 23, position: 'RW', sourceClub: 'Vasco da Gama', sourceCountry: 'Brazil', sourceLeague: 'Brasileirão', mlsTeam: 'LA Galaxy', fee: 10_000_000, marketValue: 6_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  
  // LAFC
  { playerName: 'Son Heung-min', age: 32, position: 'LW', sourceClub: 'Tottenham Hotspur', sourceCountry: 'England', sourceLeague: 'Premier League', mlsTeam: 'Los Angeles FC', fee: 15_000_000, marketValue: 45_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  { playerName: 'Olivier Giroud', age: 37, position: 'CF', sourceClub: 'AC Milan', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Los Angeles FC', fee: 0, marketValue: 2_000_000, transferType: 'free', season: '24/25', year: 2024 },
  
  // San Diego FC (Expansion)
  { playerName: 'Hirving Lozano', age: 28, position: 'RW', sourceClub: 'PSV Eindhoven', sourceCountry: 'Netherlands', sourceLeague: 'Eredivisie', mlsTeam: 'San Diego FC', fee: 12_000_000, marketValue: 18_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  
  // New York Red Bulls
  { playerName: 'Emil Forsberg', age: 32, position: 'AM', sourceClub: 'RB Leipzig', sourceCountry: 'Germany', sourceLeague: 'Bundesliga', mlsTeam: 'New York Red Bulls', fee: 0, marketValue: 6_000_000, transferType: 'free', season: '24/25', year: 2024 },
  
  // Seattle Sounders
  { playerName: 'Pedro de la Vega', age: 23, position: 'LW', sourceClub: 'Lanús', sourceCountry: 'Argentina', sourceLeague: 'Liga Profesional', mlsTeam: 'Seattle Sounders FC', fee: 9_000_000, marketValue: 7_000_000, transferType: 'permanent', season: '24/25', year: 2024 },
  
  // ============ 2023/24 Season ============
  // Inter Miami CF
  { playerName: 'Lionel Messi', age: 36, position: 'RW', sourceClub: 'Paris Saint-Germain', sourceCountry: 'France', sourceLeague: 'Ligue 1', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 30_000_000, transferType: 'free', season: '23/24', year: 2023 },
  { playerName: 'Sergio Busquets', age: 35, position: 'DM', sourceClub: 'FC Barcelona', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 5_000_000, transferType: 'free', season: '23/24', year: 2023 },
  { playerName: 'Jordi Alba', age: 34, position: 'LB', sourceClub: 'FC Barcelona', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '23/24', year: 2023 },
  { playerName: 'Luis Suárez', age: 36, position: 'CF', sourceClub: 'Grêmio', sourceCountry: 'Brazil', sourceLeague: 'Brasileirão', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '23/24', year: 2023 },
  
  // LAFC
  { playerName: 'Hugo Lloris', age: 36, position: 'GK', sourceClub: 'Tottenham Hotspur', sourceCountry: 'England', sourceLeague: 'Premier League', mlsTeam: 'Los Angeles FC', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '23/24', year: 2023 },
  { playerName: 'Denis Bouanga', age: 28, position: 'LW', sourceClub: 'AS Saint-Étienne', sourceCountry: 'France', sourceLeague: 'Ligue 1', mlsTeam: 'Los Angeles FC', fee: 5_000_000, marketValue: 8_000_000, transferType: 'permanent', season: '23/24', year: 2023 },
  
  // Atlanta United FC
  { playerName: 'Thiago Almada', age: 22, position: 'AM', sourceClub: 'Vélez Sarsfield', sourceCountry: 'Argentina', sourceLeague: 'Liga Profesional', mlsTeam: 'Atlanta United FC', fee: 16_000_000, marketValue: 15_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  { playerName: 'Giorgos Giakoumakis', age: 28, position: 'CF', sourceClub: 'Celtic', sourceCountry: 'Scotland', sourceLeague: 'Scottish Premiership', mlsTeam: 'Atlanta United FC', fee: 5_000_000, marketValue: 8_000_000, transferType: 'permanent', season: '23/24', year: 2023 },
  
  // New York Red Bulls
  { playerName: 'Dante Vanzeir', age: 25, position: 'CF', sourceClub: 'Union SG', sourceCountry: 'Belgium', sourceLeague: 'Pro League', mlsTeam: 'New York Red Bulls', fee: 8_000_000, marketValue: 7_000_000, transferType: 'permanent', season: '23/24', year: 2023 },
  
  // Orlando City SC
  { playerName: 'Martín Ojeda', age: 26, position: 'AM', sourceClub: 'Godoy Cruz', sourceCountry: 'Argentina', sourceLeague: 'Liga Profesional', mlsTeam: 'Orlando City SC', fee: 6_500_000, marketValue: 5_000_000, transferType: 'permanent', season: '23/24', year: 2023 },
  
  // Columbus Crew
  { playerName: 'Diego Rossi', age: 25, position: 'LW', sourceClub: 'Fenerbahçe', sourceCountry: 'Turkey', sourceLeague: 'Süper Lig', mlsTeam: 'Columbus Crew', fee: 6_000_000, marketValue: 8_000_000, transferType: 'permanent', season: '23/24', year: 2023 },
  
  // ============ 2022/23 Season ============
  // LA Galaxy
  { playerName: 'Riqui Puig', age: 23, position: 'CM', sourceClub: 'FC Barcelona', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'LA Galaxy', fee: 0, marketValue: 10_000_000, transferType: 'free', season: '22/23', year: 2022 },
  
  // Toronto FC
  { playerName: 'Federico Bernardeschi', age: 28, position: 'AM', sourceClub: 'Juventus', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Toronto FC', fee: 0, marketValue: 6_000_000, transferType: 'free', season: '22/23', year: 2022 },
  { playerName: 'Lorenzo Insigne', age: 31, position: 'LW', sourceClub: 'SSC Napoli', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Toronto FC', fee: 0, marketValue: 12_000_000, transferType: 'free', season: '22/23', year: 2022 },
  
  // Columbus Crew
  { playerName: 'Cucho Hernández', age: 23, position: 'CF', sourceClub: 'Watford', sourceCountry: 'England', sourceLeague: 'Championship', mlsTeam: 'Columbus Crew', fee: 9_500_000, marketValue: 8_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  
  // FC Cincinnati
  { playerName: 'Luciano Acosta', age: 28, position: 'AM', sourceClub: 'Atlas', sourceCountry: 'Mexico', sourceLeague: 'Liga MX', mlsTeam: 'FC Cincinnati', fee: 5_000_000, marketValue: 5_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  
  // Orlando City SC
  { playerName: 'Facundo Torres', age: 22, position: 'LW', sourceClub: 'Peñarol', sourceCountry: 'Uruguay', sourceLeague: 'Primera División', mlsTeam: 'Orlando City SC', fee: 8_500_000, marketValue: 9_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  
  // ============ 2021/22 Season ============
  // Charlotte FC (Expansion)
  { playerName: 'Karol Świderski', age: 24, position: 'CF', sourceClub: 'PAOK', sourceCountry: 'Greece', sourceLeague: 'Super League Greece', mlsTeam: 'Charlotte FC', fee: 5_000_000, marketValue: 6_000_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // Atlanta United FC
  { playerName: 'Luiz Araújo', age: 25, position: 'RW', sourceClub: 'LOSC Lille', sourceCountry: 'France', sourceLeague: 'Ligue 1', mlsTeam: 'Atlanta United FC', fee: 11_500_000, marketValue: 10_000_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // New England Revolution
  { playerName: 'Giacomo Vrioni', age: 23, position: 'CF', sourceClub: 'Juventus', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'New England Revolution', fee: 3_000_000, marketValue: 4_000_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // Austin FC
  { playerName: 'Sebastián Driussi', age: 25, position: 'AM', sourceClub: 'Zenit Saint Petersburg', sourceCountry: 'Russia', sourceLeague: 'Russian Premier League', mlsTeam: 'Austin FC', fee: 5_500_000, marketValue: 7_000_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // Nashville SC
  { playerName: 'Hany Mukhtar', age: 26, position: 'AM', sourceClub: 'Brøndby IF', sourceCountry: 'Denmark', sourceLeague: 'Superliga', mlsTeam: 'Nashville SC', fee: 1_500_000, marketValue: 2_500_000, transferType: 'permanent', season: '20/21', year: 2020 },
  
  // ============ 2020/21 Season ============
  // Inter Miami CF (Expansion)
  { playerName: 'Gonzalo Higuaín', age: 32, position: 'CF', sourceClub: 'Juventus', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 4_500_000, transferType: 'free', season: '20/21', year: 2020 },
  { playerName: 'Blaise Matuidi', age: 33, position: 'CM', sourceClub: 'Juventus', sourceCountry: 'Italy', sourceLeague: 'Serie A', mlsTeam: 'Inter Miami CF', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '20/21', year: 2020 },
  
  // LAFC
  { playerName: 'Gareth Bale', age: 32, position: 'RW', sourceClub: 'Real Madrid', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'Los Angeles FC', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '22/23', year: 2022 },
  
  // Columbus Crew
  { playerName: 'Lucas Zelarayán', age: 27, position: 'AM', sourceClub: 'Tigres UANL', sourceCountry: 'Mexico', sourceLeague: 'Liga MX', mlsTeam: 'Columbus Crew', fee: 7_000_000, marketValue: 8_000_000, transferType: 'permanent', season: '20/21', year: 2020 },
  
  // Philadelphia Union
  { playerName: 'Dániel Gazdag', age: 25, position: 'AM', sourceClub: 'Honvéd', sourceCountry: 'Hungary', sourceLeague: 'NB I', mlsTeam: 'Philadelphia Union', fee: 2_000_000, marketValue: 2_500_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // FC Dallas
  { playerName: 'Alan Velasco', age: 19, position: 'LW', sourceClub: 'Independiente', sourceCountry: 'Argentina', sourceLeague: 'Liga Profesional', mlsTeam: 'FC Dallas', fee: 7_000_000, marketValue: 6_000_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // New York City FC
  { playerName: 'Talles Magno', age: 19, position: 'LW', sourceClub: 'Vasco da Gama', sourceCountry: 'Brazil', sourceLeague: 'Brasileirão', mlsTeam: 'New York City FC', fee: 8_000_000, marketValue: 6_500_000, transferType: 'permanent', season: '21/22', year: 2021 },
  
  // Seattle Sounders
  { playerName: 'Albert Rusnák', age: 27, position: 'AM', sourceClub: 'Real Salt Lake', sourceCountry: 'United States', sourceLeague: 'MLS', mlsTeam: 'Seattle Sounders FC', fee: 0, marketValue: 3_500_000, transferType: 'free', season: '21/22', year: 2021 },
  
  // Portland Timbers
  { playerName: 'Yimmi Chará', age: 29, position: 'RW', sourceClub: 'Atlético Mineiro', sourceCountry: 'Brazil', sourceLeague: 'Brasileirão', mlsTeam: 'Portland Timbers', fee: 2_800_000, marketValue: 3_500_000, transferType: 'permanent', season: '20/21', year: 2020 },
  
  // Houston Dynamo
  { playerName: 'Héctor Herrera', age: 32, position: 'CM', sourceClub: 'Atlético Madrid', sourceCountry: 'Spain', sourceLeague: 'La Liga', mlsTeam: 'Houston Dynamo FC', fee: 0, marketValue: 4_000_000, transferType: 'free', season: '22/23', year: 2022 },
  
  // Minnesota United
  { playerName: 'Emanuel Reynoso', age: 24, position: 'AM', sourceClub: 'Boca Juniors', sourceCountry: 'Argentina', sourceLeague: 'Liga Profesional', mlsTeam: 'Minnesota United FC', fee: 5_000_000, marketValue: 5_000_000, transferType: 'permanent', season: '20/21', year: 2020 },
  
  // Colorado Rapids
  { playerName: 'Djordje Mihailovic', age: 23, position: 'AM', sourceClub: 'CF Montréal', sourceCountry: 'Canada', sourceLeague: 'MLS', mlsTeam: 'Colorado Rapids', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '23/24', year: 2023 },
  
  // Vancouver Whitecaps
  { playerName: 'Ryan Gauld', age: 25, position: 'AM', sourceClub: 'Farense', sourceCountry: 'Portugal', sourceLeague: 'Primeira Liga', mlsTeam: 'Vancouver Whitecaps FC', fee: 0, marketValue: 1_500_000, transferType: 'free', season: '21/22', year: 2021 },
  
  // Real Salt Lake
  { playerName: 'Chicho Arango', age: 27, position: 'CF', sourceClub: 'Millonarios', sourceCountry: 'Colombia', sourceLeague: 'Categoría Primera A', mlsTeam: 'Real Salt Lake', fee: 2_500_000, marketValue: 2_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  
  // Sporting Kansas City
  { playerName: 'Willy Agada', age: 25, position: 'CF', sourceClub: 'Bnei Sakhnin', sourceCountry: 'Israel', sourceLeague: 'Israeli Premier League', mlsTeam: 'Sporting Kansas City', fee: 500_000, marketValue: 800_000, transferType: 'permanent', season: '22/23', year: 2022 },
  
  // St. Louis CITY SC (Expansion)
  { playerName: 'João Klauss', age: 26, position: 'CF', sourceClub: 'Standard Liège', sourceCountry: 'Belgium', sourceLeague: 'Pro League', mlsTeam: 'St. Louis CITY SC', fee: 2_500_000, marketValue: 2_000_000, transferType: 'permanent', season: '22/23', year: 2022 },
  { playerName: 'Roman Bürki', age: 32, position: 'GK', sourceClub: 'Borussia Dortmund', sourceCountry: 'Germany', sourceLeague: 'Bundesliga', mlsTeam: 'St. Louis CITY SC', fee: 0, marketValue: 1_500_000, transferType: 'free', season: '22/23', year: 2022 },
  
  // D.C. United
  { playerName: 'Christian Benteke', age: 32, position: 'CF', sourceClub: 'Crystal Palace', sourceCountry: 'England', sourceLeague: 'Premier League', mlsTeam: 'D.C. United', fee: 0, marketValue: 3_000_000, transferType: 'free', season: '22/23', year: 2022 },
];

// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================

export function getTransfersByYear(): Map<number, TransferRecord[]> {
  const byYear = new Map<number, TransferRecord[]>();
  
  MLS_TRANSFERS.forEach(t => {
    const existing = byYear.get(t.year) || [];
    existing.push(t);
    byYear.set(t.year, existing);
  });
  
  return byYear;
}

export function getSeasonSummaries(): SeasonSummary[] {
  const byYear = getTransfersByYear();
  const summaries: SeasonSummary[] = [];
  
  byYear.forEach((transfers, year) => {
    const permanent = transfers.filter(t => t.transferType === 'permanent');
    const free = transfers.filter(t => t.transferType === 'free');
    const loans = transfers.filter(t => t.transferType === 'loan');
    const totalSpend = transfers.reduce((sum, t) => sum + t.fee, 0);
    
    const topSigning = [...transfers].sort((a, b) => b.fee - a.fee)[0];
    
    summaries.push({
      season: `${String(year).slice(-2)}/${String(year + 1).slice(-2)}`,
      year,
      totalTransfers: transfers.length,
      totalSpend,
      permanentTransfers: permanent.length,
      freeTransfers: free.length,
      loanTransfers: loans.length,
      avgFee: permanent.length > 0 ? permanent.reduce((sum, t) => sum + t.fee, 0) / permanent.length : 0,
      topSigning: {
        player: topSigning?.playerName || 'N/A',
        fee: topSigning?.fee || 0,
        from: topSigning ? `${topSigning.sourceClub} (${topSigning.sourceCountry})` : 'N/A',
      },
    });
  });
  
  return summaries.sort((a, b) => b.year - a.year);
}

export function getSourceLeagueSummaries(): SourceLeagueSummary[] {
  const leagueMap = new Map<string, {
    country: string;
    countryCode: string;
    players: number;
    spend: number;
    byYear: Map<number, { players: number; spend: number }>;
    notableSignings: { player: string; fee: number; year: number }[];
  }>();
  
  MLS_TRANSFERS.forEach(t => {
    const leagueInfo = COUNTRY_TO_LEAGUE[t.sourceCountry] || { league: t.sourceCountry, code: 'UNK' };
    const leagueName = leagueInfo.league;
    
    const existing = leagueMap.get(leagueName) || {
      country: t.sourceCountry,
      countryCode: leagueInfo.code,
      players: 0,
      spend: 0,
      byYear: new Map(),
      notableSignings: [],
    };
    
    existing.players++;
    existing.spend += t.fee;
    
    // Update yearly data
    const yearData = existing.byYear.get(t.year) || { players: 0, spend: 0 };
    yearData.players++;
    yearData.spend += t.fee;
    existing.byYear.set(t.year, yearData);
    
    // Track notable signings (fee > 5M)
    if (t.fee >= 5_000_000) {
      existing.notableSignings.push({
        player: t.playerName,
        fee: t.fee,
        year: t.year,
      });
    }
    
    leagueMap.set(leagueName, existing);
  });
  
  const summaries: SourceLeagueSummary[] = [];
  
  leagueMap.forEach((data, league) => {
    const byYear: { year: number; players: number; spend: number }[] = [];
    data.byYear.forEach((yearData, year) => {
      byYear.push({ year, ...yearData });
    });
    
    summaries.push({
      league,
      country: data.country,
      countryCode: data.countryCode,
      totalPlayers: data.players,
      totalSpend: data.spend,
      avgFee: data.players > 0 ? data.spend / data.players : 0,
      byYear: byYear.sort((a, b) => b.year - a.year),
      notableSignings: data.notableSignings.sort((a, b) => b.fee - a.fee).slice(0, 5),
    });
  });
  
  return summaries;
}

export function getSourceLeaguesBySpend(): SourceLeagueSummary[] {
  return getSourceLeagueSummaries().sort((a, b) => b.totalSpend - a.totalSpend);
}

export function getSourceLeaguesByCount(): SourceLeagueSummary[] {
  return getSourceLeagueSummaries().sort((a, b) => b.totalPlayers - a.totalPlayers);
}

export function getYearlyTotals(): { year: number; totalSpend: number; totalPlayers: number; avgFee: number }[] {
  const byYear = getTransfersByYear();
  const result: { year: number; totalSpend: number; totalPlayers: number; avgFee: number }[] = [];
  
  byYear.forEach((transfers, year) => {
    const totalSpend = transfers.reduce((sum, t) => sum + t.fee, 0);
    const paidTransfers = transfers.filter(t => t.fee > 0);
    result.push({
      year,
      totalSpend,
      totalPlayers: transfers.length,
      avgFee: paidTransfers.length > 0 ? paidTransfers.reduce((sum, t) => sum + t.fee, 0) / paidTransfers.length : 0,
    });
  });
  
  return result.sort((a, b) => a.year - b.year);
}

