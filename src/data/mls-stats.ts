// MLS Stats Data - Shared between MCP server and web app

export interface Team {
  id: string;
  name: string;
  conference: 'Western' | 'Eastern';
  founded: number;
  stadium: string;
  capacity: number;
  colors: string[];
}

export interface StandingsEntry {
  rank: number;
  team: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
}

export interface PlayerStats {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  minutes: number;
  appearances: number;
  yellowCards: number;
  redCards: number;
  saves?: number;
  cleanSheets?: number;
}

export const teams: Record<string, Team> = {
  'austin-fc': {
    id: 'austin-fc',
    name: 'Austin FC',
    conference: 'Western',
    founded: 2021,
    stadium: 'Q2 Stadium',
    capacity: 20738,
    colors: ['Verde (#00B140)', 'Black'],
  },
  'la-galaxy': {
    id: 'la-galaxy',
    name: 'LA Galaxy',
    conference: 'Western',
    founded: 1996,
    stadium: 'Dignity Health Sports Park',
    capacity: 27000,
    colors: ['Navy', 'Gold'],
  },
  'lafc': {
    id: 'lafc',
    name: 'Los Angeles FC',
    conference: 'Western',
    founded: 2018,
    stadium: 'BMO Stadium',
    capacity: 22000,
    colors: ['Black', 'Gold'],
  },
  'inter-miami': {
    id: 'inter-miami',
    name: 'Inter Miami',
    conference: 'Eastern',
    founded: 2020,
    stadium: 'Chase Stadium',
    capacity: 21550,
    colors: ['Pink', 'Black'],
  },
};

export const standings: Record<string, StandingsEntry[]> = {
  western: [
    { rank: 1, team: 'LAFC', points: 67, wins: 21, draws: 4, losses: 9, gf: 65, ga: 38, gd: 27 },
    { rank: 2, team: 'LA Galaxy', points: 58, wins: 17, draws: 7, losses: 10, gf: 62, ga: 52, gd: 10 },
    { rank: 3, team: 'Real Salt Lake', points: 55, wins: 15, draws: 10, losses: 9, gf: 55, ga: 45, gd: 10 },
    { rank: 4, team: 'Seattle Sounders', points: 52, wins: 14, draws: 10, losses: 10, gf: 48, ga: 42, gd: 6 },
    { rank: 5, team: 'Colorado Rapids', points: 50, wins: 14, draws: 8, losses: 12, gf: 52, ga: 51, gd: 1 },
    { rank: 6, team: 'Houston Dynamo', points: 49, wins: 13, draws: 10, losses: 11, gf: 50, ga: 48, gd: 2 },
    { rank: 7, team: 'Minnesota United', points: 48, wins: 13, draws: 9, losses: 12, gf: 49, ga: 50, gd: -1 },
    { rank: 8, team: 'Austin FC', points: 45, wins: 12, draws: 9, losses: 13, gf: 48, ga: 52, gd: -4 },
    { rank: 9, team: 'Portland Timbers', points: 44, wins: 12, draws: 8, losses: 14, gf: 45, ga: 50, gd: -5 },
    { rank: 10, team: 'FC Dallas', points: 42, wins: 11, draws: 9, losses: 14, gf: 40, ga: 48, gd: -8 },
    { rank: 11, team: 'Vancouver Whitecaps', points: 40, wins: 10, draws: 10, losses: 14, gf: 42, ga: 52, gd: -10 },
    { rank: 12, team: 'Sporting KC', points: 38, wins: 10, draws: 8, losses: 16, gf: 38, ga: 55, gd: -17 },
    { rank: 13, team: 'San Jose Earthquakes', points: 32, wins: 8, draws: 8, losses: 18, gf: 35, ga: 58, gd: -23 },
  ],
  eastern: [
    { rank: 1, team: 'Inter Miami', points: 74, wins: 22, draws: 8, losses: 4, gf: 72, ga: 42, gd: 30 },
    { rank: 2, team: 'Columbus Crew', points: 62, wins: 18, draws: 8, losses: 8, gf: 58, ga: 40, gd: 18 },
    { rank: 3, team: 'FC Cincinnati', points: 58, wins: 17, draws: 7, losses: 10, gf: 55, ga: 45, gd: 10 },
    { rank: 4, team: 'Orlando City', points: 54, wins: 15, draws: 9, losses: 10, gf: 50, ga: 42, gd: 8 },
    { rank: 5, team: 'Charlotte FC', points: 52, wins: 14, draws: 10, losses: 10, gf: 48, ga: 45, gd: 3 },
    { rank: 6, team: 'New York Red Bulls', points: 50, wins: 14, draws: 8, losses: 12, gf: 45, ga: 42, gd: 3 },
    { rank: 7, team: 'NYCFC', points: 48, wins: 13, draws: 9, losses: 12, gf: 52, ga: 50, gd: 2 },
    { rank: 8, team: 'Philadelphia Union', points: 46, wins: 12, draws: 10, losses: 12, gf: 44, ga: 45, gd: -1 },
    { rank: 9, team: 'Atlanta United', points: 44, wins: 12, draws: 8, losses: 14, gf: 48, ga: 52, gd: -4 },
  ],
};

// Top 84 MLS players by goals and assists (2025 season)
// Auto-generated from scraped MLSSoccer.com data (1011 total players scraped)
// Last updated: Feb 2026 (CORRECTED column mapping)
export const leaguePlayerStats: PlayerStats[] = [
  { name: 'L. Messi', team: 'Inter Miami', position: 'MID', goals: 29, assists: 19, minutes: 2420, appearances: 28, yellowCards: 0, redCards: 0 },
  { name: 'D. Bouanga', team: 'LAFC', position: 'MID', goals: 24, assists: 9, minutes: 2657, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'S. Surridge', team: 'Nashville SC', position: 'MID', goals: 24, assists: 5, minutes: 2940, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'A. Dreyer', team: 'San Diego FC', position: 'MID', goals: 19, assists: 19, minutes: 3022, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'E. Da Silva Ferreira', team: 'FC Cincinnati', position: 'MID', goals: 18, assists: 15, minutes: 2744, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'D. Joveljić', team: 'Sporting Kansas City', position: 'MID', goals: 18, assists: 2, minutes: 2767, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'P. Musa', team: 'FC Dallas', position: 'MID', goals: 18, assists: 6, minutes: 2297, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'A. Martínez', team: 'New York City FC', position: 'MID', goals: 17, assists: 2, minutes: 2503, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'E. Choupo-Moting', team: 'New York Red Bulls', position: 'MID', goals: 17, assists: 5, minutes: 2758, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'H. Cuypers', team: 'Chicago Fire', position: 'MID', goals: 17, assists: 3, minutes: 2810, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'B. White', team: 'Vancouver Whitecaps', position: 'MID', goals: 16, assists: 1, minutes: 1672, appearances: 21, yellowCards: 0, redCards: 0 },
  { name: 'H. Mukhtar', team: 'Nashville SC', position: 'MID', goals: 16, assists: 12, minutes: 3005, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'M. Ojeda', team: 'Orlando City SC', position: 'MID', goals: 16, assists: 15, minutes: 2687, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'D. Rossi', team: 'Columbus Crew', position: 'MID', goals: 16, assists: 4, minutes: 2504, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'T. Baribo', team: 'Philadelphia Union', position: 'MID', goals: 16, assists: 3, minutes: 1876, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'P. Zinckernagel', team: 'Chicago Fire', position: 'MID', goals: 15, assists: 15, minutes: 2532, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'K. Denkey', team: 'FC Cincinnati', position: 'MID', goals: 15, assists: 2, minutes: 2282, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'D. Musovski', team: 'Seattle Sounders', position: 'MID', goals: 14, assists: 4, minutes: 1559, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'J. Martínez', team: 'San Jose Earthquakes', position: 'MID', goals: 14, assists: 2, minutes: 1874, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'C. Arango', team: 'San Jose Earthquakes', position: 'MID', goals: 13, assists: 7, minutes: 2562, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'P. Owusu', team: 'CF Montréal', position: 'MID', goals: 13, assists: 5, minutes: 2825, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'R. Navarro', team: 'Colorado Rapids', position: 'MID', goals: 12, assists: 5, minutes: 2663, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'M. Pašalić', team: 'Orlando City SC', position: 'MID', goals: 12, assists: 5, minutes: 2593, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'A. Rusnák', team: 'Seattle Sounders', position: 'MID', goals: 11, assists: 10, minutes: 2150, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'E. Forsberg', team: 'New York Red Bulls', position: 'MID', goals: 11, assists: 11, minutes: 2875, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'H. Wolf', team: 'New York City FC', position: 'MID', goals: 11, assists: 7, minutes: 2644, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'I. Toklomati', team: 'Charlotte FC', position: 'MID', goals: 11, assists: 4, minutes: 1807, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'T. Allende', team: 'Inter Miami', position: 'MID', goals: 11, assists: 1, minutes: 2167, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'E. Ponce', team: 'Houston Dynamo', position: 'MID', goals: 10, assists: 1, minutes: 2681, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'J. Paintsil', team: 'LA Galaxy', position: 'MID', goals: 10, assists: 5, minutes: 1978, appearances: 25, yellowCards: 0, redCards: 0 },
  { name: 'T. Oluwaseyi', team: 'Minnesota United', position: 'MID', goals: 10, assists: 8, minutes: 1861, appearances: 24, yellowCards: 0, redCards: 0 },
  { name: 'C. Gil', team: 'New England Revolution', position: 'MID', goals: 10, assists: 14, minutes: 3056, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'W. Zaha', team: 'Charlotte FC', position: 'MID', goals: 10, assists: 10, minutes: 2740, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'P. Biel', team: 'Charlotte FC', position: 'MID', goals: 10, assists: 12, minutes: 2018, appearances: 26, yellowCards: 0, redCards: 0 },
  { name: 'J. Klauss', team: 'St. Louis CITY SC', position: 'MID', goals: 10, assists: 3, minutes: 2423, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'M. Iloski', team: 'San Diego FC', position: 'MID', goals: 10, assists: 1, minutes: 471, appearances: 14, yellowCards: 0, redCards: 0 },
  { name: 'L. Suárez', team: 'Inter Miami', position: 'MID', goals: 10, assists: 10, minutes: 2291, appearances: 28, yellowCards: 0, redCards: 0 },
  { name: 'B. Gutiérrez', team: 'Chicago Fire', position: 'MID', goals: 9, assists: 6, minutes: 2050, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'D. Luna', team: 'Real Salt Lake', position: 'MID', goals: 9, assists: 7, minutes: 2277, appearances: 27, yellowCards: 0, redCards: 0 },
  { name: 'H. Lozano', team: 'San Diego FC', position: 'MID', goals: 9, assists: 10, minutes: 1833, appearances: 27, yellowCards: 0, redCards: 0 },
  { name: 'S. Heung-Min', team: 'LAFC', position: 'MID', goals: 9, assists: 3, minutes: 806, appearances: 10, yellowCards: 0, redCards: 0 },
  { name: 'D. Sealy', team: 'CF Montréal', position: 'MID', goals: 9, assists: 2, minutes: 2426, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'C. Benteke', team: 'DC', position: 'MID', goals: 9, assists: 3, minutes: 1883, appearances: 25, yellowCards: 0, redCards: 0 },
  { name: 'A. Markanich', team: 'Minnesota United', position: 'MID', goals: 9, assists: 1, minutes: 1902, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'M. Hartel', team: 'St. Louis CITY SC', position: 'MID', goals: 9, assists: 6, minutes: 3027, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'K. Yeboah', team: 'Minnesota United', position: 'MID', goals: 9, assists: 3, minutes: 2045, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'D. Mihailovic', team: 'Colorado Rapids', position: 'MID', goals: 9, assists: 7, minutes: 2060, appearances: 24, yellowCards: 0, redCards: 0 },
  { name: 'L. Muriel', team: 'Orlando City SC', position: 'MID', goals: 9, assists: 9, minutes: 2114, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'R. Enrique', team: 'Orlando City SC', position: 'MID', goals: 8, assists: 2, minutes: 931, appearances: 24, yellowCards: 0, redCards: 0 },
  { name: 'D. Yapi', team: 'Colorado Rapids', position: 'MID', goals: 8, assists: 2, minutes: 1433, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'O. Wolff', team: 'Austin FC', position: 'MID', goals: 7, assists: 8, minutes: 2596, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'A. Alves Santos', team: 'Portland Timbers', position: 'MID', goals: 7, assists: 7, minutes: 2211, appearances: 28, yellowCards: 0, redCards: 0 },
  { name: 'J. Alba', team: 'Inter Miami', position: 'MID', goals: 6, assists: 15, minutes: 2565, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'J. Pereyra', team: 'Minnesota United', position: 'MID', goals: 6, assists: 11, minutes: 2567, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'G. Pec', team: 'LA Galaxy', position: 'MID', goals: 6, assists: 9, minutes: 2473, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'J. McGlynn', team: 'Houston Dynamo', position: 'MID', goals: 6, assists: 8, minutes: 2312, appearances: 26, yellowCards: 0, redCards: 0 },
  { name: 'M. Almirón', team: 'Atlanta United', position: 'MID', goals: 6, assists: 7, minutes: 2713, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'J. Bamba', team: 'Chicago Fire', position: 'MID', goals: 5, assists: 10, minutes: 2467, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'M. Reus', team: 'LA Galaxy', position: 'MID', goals: 5, assists: 9, minutes: 1487, appearances: 21, yellowCards: 0, redCards: 0 },
  { name: 'C. Espinoza', team: 'San Jose Earthquakes', position: 'MID', goals: 4, assists: 12, minutes: 2692, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'S. Berhalter', team: 'Vancouver Whitecaps', position: 'MID', goals: 4, assists: 11, minutes: 2296, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'O. Valakari', team: 'San Diego FC', position: 'MID', goals: 4, assists: 11, minutes: 2443, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'D. Da Costa', team: 'Portland Timbers', position: 'MID', goals: 4, assists: 8, minutes: 2523, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'M. Arfsten', team: 'Columbus Crew', position: 'MID', goals: 4, assists: 8, minutes: 2566, appearances: 29, yellowCards: 0, redCards: 0 },
  { name: 'P. Rothrock', team: 'Seattle Sounders', position: 'MID', goals: 4, assists: 7, minutes: 2174, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'J. Ferreira', team: 'Seattle Sounders', position: 'MID', goals: 4, assists: 7, minutes: 2189, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'A. Gutman', team: 'Chicago Fire', position: 'MID', goals: 3, assists: 10, minutes: 2869, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'M. Delgado', team: 'LAFC', position: 'MID', goals: 3, assists: 9, minutes: 2583, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'O. Bukari', team: 'Austin FC', position: 'MID', goals: 3, assists: 7, minutes: 2329, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'J. Tverskov', team: 'San Diego FC', position: 'MID', goals: 2, assists: 13, minutes: 2931, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'K. Wagner', team: 'Philadelphia Union', position: 'MID', goals: 2, assists: 11, minutes: 2769, appearances: 32, yellowCards: 0, redCards: 0 },
  { name: 'M. Moralez', team: 'New York City FC', position: 'MID', goals: 2, assists: 11, minutes: 2758, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'A. Nájar', team: 'Nashville SC', position: 'MID', goals: 2, assists: 10, minutes: 2548, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'Q. Sullivan', team: 'Philadelphia Union', position: 'MID', goals: 2, assists: 9, minutes: 1967, appearances: 28, yellowCards: 0, redCards: 0 },
  { name: 'M. García', team: 'Sporting Kansas City', position: 'MID', goals: 2, assists: 9, minutes: 2096, appearances: 27, yellowCards: 0, redCards: 0 },
  { name: 'M. Haile-Selassie', team: 'Chicago Fire', position: 'MID', goals: 2, assists: 8, minutes: 916, appearances: 30, yellowCards: 0, redCards: 0 },
  { name: 'C. Roldán', team: 'Seattle Sounders', position: 'MID', goals: 1, assists: 9, minutes: 2633, appearances: 31, yellowCards: 0, redCards: 0 },
  { name: 'D. Chambost', team: 'Columbus Crew', position: 'MID', goals: 1, assists: 8, minutes: 2632, appearances: 34, yellowCards: 0, redCards: 0 },
  { name: 'S. Busquets', team: 'Inter Miami', position: 'MID', goals: 0, assists: 9, minutes: 2870, appearances: 33, yellowCards: 0, redCards: 0 },
  { name: 'A. Ahmed', team: 'Vancouver Whitecaps', position: 'MID', goals: 0, assists: 8, minutes: 1287, appearances: 22, yellowCards: 0, redCards: 0 },
];

// Helper functions
export function getStandings(conference: 'western' | 'eastern') {
  return standings[conference] || [];
}

export function getTeamStanding(teamName: string) {
  const allStandings = [...standings.western, ...standings.eastern];
  return allStandings.find(t => t.team.toLowerCase().includes(teamName.toLowerCase()));
}

export function getTopScorers(limit = 10) {
  return [...leaguePlayerStats]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export function getPlayerStatsByTeam(team: string) {
  return leaguePlayerStats.filter(p => 
    p.team.toLowerCase().includes(team.toLowerCase())
  );
}



