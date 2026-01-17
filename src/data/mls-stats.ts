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

export const leaguePlayerStats: PlayerStats[] = [
  // Austin FC players
  { name: 'Sebastián Driussi', team: 'Austin FC', position: 'CAM', goals: 14, assists: 8, minutes: 2700, appearances: 30, yellowCards: 4, redCards: 0 },
  { name: 'Maxi Urruti', team: 'Austin FC', position: 'ST', goals: 9, assists: 4, minutes: 2070, appearances: 23, yellowCards: 3, redCards: 0 },
  { name: 'Emiliano Rigoni', team: 'Austin FC', position: 'RM', goals: 7, assists: 6, minutes: 2160, appearances: 24, yellowCards: 5, redCards: 0 },
  { name: 'Gyasi Zardes', team: 'Austin FC', position: 'ST', goals: 5, assists: 2, minutes: 1260, appearances: 14, yellowCards: 1, redCards: 0 },
  { name: 'Owen Wolff', team: 'Austin FC', position: 'CM', goals: 3, assists: 5, minutes: 1890, appearances: 21, yellowCards: 2, redCards: 0 },
  { name: 'Jader Obrian', team: 'Austin FC', position: 'LW', goals: 4, assists: 7, minutes: 1800, appearances: 20, yellowCards: 3, redCards: 0 },
  { name: 'Brad Stuver', team: 'Austin FC', position: 'GK', goals: 0, assists: 0, minutes: 2790, appearances: 31, yellowCards: 1, redCards: 0, saves: 98, cleanSheets: 8 },
  // Top MLS scorers
  { name: 'Lionel Messi', team: 'Inter Miami', position: 'RW', goals: 20, assists: 16, minutes: 2520, appearances: 28, yellowCards: 2, redCards: 0 },
  { name: 'Christian Benteke', team: 'DC United', position: 'ST', goals: 18, assists: 4, minutes: 2880, appearances: 32, yellowCards: 6, redCards: 1 },
  { name: 'Denis Bouanga', team: 'LAFC', position: 'LW', goals: 17, assists: 9, minutes: 2700, appearances: 30, yellowCards: 3, redCards: 0 },
  { name: 'Cucho Hernández', team: 'Columbus Crew', position: 'ST', goals: 16, assists: 7, minutes: 2520, appearances: 28, yellowCards: 4, redCards: 0 },
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

