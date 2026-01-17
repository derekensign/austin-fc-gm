export interface Player {
  id: string;
  name: string;
  position: string;
  positionGroup: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  nationality: string;
  age: number;
  salary: number;
  salaryFormatted: string;
  designation?: 'DP' | 'TAM' | 'U22' | 'GA' | 'HG';
  stats: {
    goals: number;
    assists: number;
    minutes: number;
    appearances: number;
  };
  contractEnd: number;
  marketValue?: number;
}

export const roster: Player[] = [
  // Goalkeepers
  {
    id: 'gk-1',
    name: 'Brad Stuver',
    position: 'GK',
    positionGroup: 'GK',
    number: 1,
    nationality: '🇺🇸 USA',
    age: 34,
    salary: 450000,
    salaryFormatted: '$450K',
    stats: { goals: 0, assists: 0, minutes: 2790, appearances: 31 },
    contractEnd: 2026,
  },
  {
    id: 'gk-2',
    name: 'Damian Las',
    position: 'GK',
    positionGroup: 'GK',
    number: 31,
    nationality: '🇵🇱 Poland',
    age: 21,
    salary: 85000,
    salaryFormatted: '$85K',
    designation: 'U22',
    stats: { goals: 0, assists: 0, minutes: 270, appearances: 3 },
    contractEnd: 2027,
  },
  // Defenders
  {
    id: 'def-1',
    name: 'Julio Cascante',
    position: 'CB',
    positionGroup: 'DEF',
    number: 4,
    nationality: '🇨🇷 Costa Rica',
    age: 31,
    salary: 550000,
    salaryFormatted: '$550K',
    stats: { goals: 2, assists: 1, minutes: 2160, appearances: 24 },
    contractEnd: 2026,
  },
  {
    id: 'def-2',
    name: 'Leo Väisänen',
    position: 'CB',
    positionGroup: 'DEF',
    number: 22,
    nationality: '🇫🇮 Finland',
    age: 28,
    salary: 400000,
    salaryFormatted: '$400K',
    stats: { goals: 1, assists: 0, minutes: 1980, appearances: 22 },
    contractEnd: 2027,
  },
  {
    id: 'def-3',
    name: 'Guilherme Biro',
    position: 'LB',
    positionGroup: 'DEF',
    number: 2,
    nationality: '🇧🇷 Brazil',
    age: 22,
    salary: 175000,
    salaryFormatted: '$175K',
    designation: 'U22',
    stats: { goals: 1, assists: 4, minutes: 2430, appearances: 27 },
    contractEnd: 2028,
    marketValue: 2500000,
  },
  {
    id: 'def-4',
    name: 'Hector Jimenez',
    position: 'RB',
    positionGroup: 'DEF',
    number: 16,
    nationality: '🇺🇸 USA',
    age: 36,
    salary: 325000,
    salaryFormatted: '$325K',
    stats: { goals: 0, assists: 2, minutes: 1350, appearances: 15 },
    contractEnd: 2026,
  },
  // Midfielders
  {
    id: 'mid-1',
    name: 'Sebastián Driussi',
    position: 'CAM',
    positionGroup: 'MID',
    number: 10,
    nationality: '🇦🇷 Argentina',
    age: 28,
    salary: 3500000,
    salaryFormatted: '$3.5M',
    designation: 'DP',
    stats: { goals: 14, assists: 8, minutes: 2700, appearances: 30 },
    contractEnd: 2027,
    marketValue: 12000000,
  },
  {
    id: 'mid-2',
    name: 'Owen Wolff',
    position: 'CM',
    positionGroup: 'MID',
    number: 8,
    nationality: '🇺🇸 USA',
    age: 19,
    salary: 200000,
    salaryFormatted: '$200K',
    designation: 'HG',
    stats: { goals: 3, assists: 5, minutes: 1890, appearances: 21 },
    contractEnd: 2028,
    marketValue: 3000000,
  },
  {
    id: 'mid-3',
    name: 'Dani Pereira',
    position: 'CDM',
    positionGroup: 'MID',
    number: 6,
    nationality: '🇻🇪 Venezuela',
    age: 26,
    salary: 650000,
    salaryFormatted: '$650K',
    designation: 'TAM',
    stats: { goals: 1, assists: 3, minutes: 2520, appearances: 28 },
    contractEnd: 2026,
  },
  {
    id: 'mid-4',
    name: 'Emiliano Rigoni',
    position: 'RM',
    positionGroup: 'MID',
    number: 11,
    nationality: '🇦🇷 Argentina',
    age: 31,
    salary: 1800000,
    salaryFormatted: '$1.8M',
    designation: 'TAM',
    stats: { goals: 7, assists: 6, minutes: 2160, appearances: 24 },
    contractEnd: 2026,
    marketValue: 4000000,
  },
  // Forwards
  {
    id: 'fwd-1',
    name: 'Maxi Urruti',
    position: 'ST',
    positionGroup: 'FWD',
    number: 9,
    nationality: '🇦🇷 Argentina',
    age: 33,
    salary: 900000,
    salaryFormatted: '$900K',
    designation: 'TAM',
    stats: { goals: 9, assists: 4, minutes: 2070, appearances: 23 },
    contractEnd: 2026,
  },
  {
    id: 'fwd-2',
    name: 'Gyasi Zardes',
    position: 'ST',
    positionGroup: 'FWD',
    number: 7,
    nationality: '🇺🇸 USA',
    age: 33,
    salary: 800000,
    salaryFormatted: '$800K',
    stats: { goals: 5, assists: 2, minutes: 1260, appearances: 14 },
    contractEnd: 2026,
  },
  {
    id: 'fwd-3',
    name: 'Jader Obrian',
    position: 'LW',
    positionGroup: 'FWD',
    number: 17,
    nationality: '🇨🇴 Colombia',
    age: 27,
    salary: 500000,
    salaryFormatted: '$500K',
    stats: { goals: 4, assists: 7, minutes: 1800, appearances: 20 },
    contractEnd: 2027,
  },
];

// Team Stats Summary
export const teamStats = {
  season: 2025,
  position: 8,
  conference: 'Western',
  points: 45,
  wins: 12,
  draws: 9,
  losses: 13,
  goalsFor: 48,
  goalsAgainst: 52,
  goalDifference: -4,
  homeRecord: '8-3-6',
  awayRecord: '4-6-7',
  form: ['W', 'D', 'L', 'W', 'W'],
  nextMatch: {
    opponent: 'LA Galaxy',
    date: '2026-03-01',
    venue: 'Q2 Stadium',
    isHome: true,
  },
};

// Salary Cap Info
export const salaryCap = {
  totalBudget: 5270000,
  spent: 10135000,
  capHits: {
    senior: 4870000,
    tam: 2800000,
    dp: 2065000, // DP charge
    u22: 460000,
  },
  availableTAM: 450000,
  availableGAM: 1200000,
  dpSlots: { used: 1, total: 3 },
  u22Slots: { used: 2, total: 3 },
  seniorRosterSpots: { used: 18, total: 20 },
  supplementalSpots: { used: 8, total: 10 },
};

// Helper functions
export function getPlayersByPosition(positionGroup: Player['positionGroup']) {
  return roster.filter((p) => p.positionGroup === positionGroup);
}

export function getTotalSalary() {
  return roster.reduce((sum, p) => sum + p.salary, 0);
}

export function getAverageAge() {
  return (roster.reduce((sum, p) => sum + p.age, 0) / roster.length).toFixed(1);
}

export function getTopScorers(limit = 5) {
  return [...roster].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, limit);
}

export function getTopAssists(limit = 5) {
  return [...roster].sort((a, b) => b.stats.assists - a.stats.assists).slice(0, limit);
}

