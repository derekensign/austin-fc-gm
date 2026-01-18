import { austinFCRoster, calculateRosterCapSummary, MLS_2026_RULES } from './austin-fc-roster';
import { formatSalary } from './austin-fc-roster';

export interface Player {
  id: string;
  name: string;
  position: string;
  positionGroup: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number | null;
  nationality: string;
  countryCode: string;
  age: number;
  salary: number;
  salaryFormatted: string;
  budgetCharge: number;
  budgetChargeFormatted: string;
  designation?: 'DP' | 'TAM' | 'U22' | 'GA' | 'HG' | 'Senior' | 'Supplemental';
  stats: {
    goals: number;
    assists: number;
    minutes: number;
    appearances: number;
  };
  contractEnd: string;
  marketValue: number;
  isInternational: boolean;
  photo?: string;
}

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  PL: '🇵🇱',
  DK: '🇩🇰',
  UA: '🇺🇦',
  IE: '🇮🇪',
  SI: '🇸🇮',
  BR: '🇧🇷',
  RS: '🇷🇸',
  ES: '🇪🇸',
  VE: '🇻🇪',
  SE: '🇸🇪',
  FI: '🇫🇮',
  AR: '🇦🇷',
  HN: '🇭🇳',
  CA: '🇨🇦',
  CO: '🇨🇴',
  AL: '🇦🇱',
};

// Map designation for display
function getDisplayDesignation(player: typeof austinFCRoster[0]): Player['designation'] {
  if (player.isDP) return 'DP';
  if (player.isU22) return 'U22';
  if (player.isGenerationAdidas) return 'GA';
  if (player.isHomegrown) return 'HG';
  if (player.designation === 'TAM') return 'TAM';
  if (player.designation === 'Supplemental') return 'Supplemental';
  return 'Senior';
}

// Transform austinFCRoster to the simpler Player format
export const roster: Player[] = austinFCRoster.map((p) => ({
  id: `player-${p.id}`,
  name: p.name,
  position: p.position,
  positionGroup: p.positionGroup,
  number: p.number,
  nationality: `${countryFlags[p.countryCode] || '🏳️'} ${p.nationality}`,
  countryCode: p.countryCode,
  age: p.age,
  salary: p.guaranteedCompensation,
  salaryFormatted: formatSalary(p.guaranteedCompensation),
  budgetCharge: p.budgetCharge,
  budgetChargeFormatted: formatSalary(p.budgetCharge),
  designation: getDisplayDesignation(p),
  stats: {
    // 2025 season stats - to be updated with actual 2026 data
    goals: 0,
    assists: 0,
    minutes: 0,
    appearances: 0,
  },
  contractEnd: p.contractEnd,
  marketValue: p.marketValue,
  isInternational: p.isInternational,
  photo: p.photo,
}));

// Team Stats Summary - 2026 Season
export const teamStats = {
  season: 2026,
  position: null, // Season not started
  conference: 'Western',
  points: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  homeRecord: '0-0-0',
  awayRecord: '0-0-0',
  form: [] as string[],
  nextMatch: {
    opponent: 'TBD',
    date: '2026-02-22', // MLS 2026 season start
    venue: 'Q2 Stadium',
    isHome: true,
  },
};

// Get salary cap info from the comprehensive calculation
const capSummary = calculateRosterCapSummary();

export const salaryCap = {
  totalBudget: MLS_2026_RULES.salaryBudget,
  spent: capSummary.totalBudgetCharge,
  capHits: {
    senior: capSummary.totalBudgetCharge - (capSummary.dpCount * MLS_2026_RULES.dpBudgetCharge) - (capSummary.u22Count * MLS_2026_RULES.u22BudgetCharge),
    tam: capSummary.tamUsed, // TAM buydowns
    dp: capSummary.dpCount * MLS_2026_RULES.dpBudgetCharge, // DP charges
    u22: capSummary.u22Count * MLS_2026_RULES.u22BudgetCharge, // U22 fixed charges
  },
  capSpaceRemaining: capSummary.capSpaceRemaining,
  dpSlots: { used: capSummary.dpCount, total: 3 },
  u22Slots: { used: capSummary.u22Count, total: 4 }, // U22 model has 4 slots
  seniorRosterSpots: { used: capSummary.seniorRosterCount, total: MLS_2026_RULES.maxSeniorRoster },
  supplementalSpots: { used: capSummary.supplementalRosterCount, total: MLS_2026_RULES.maxSupplementalRoster },
  internationalSlots: { used: capSummary.internationalCount, total: MLS_2026_RULES.maxInternationalSlots },
};

// Helper functions
export function getPlayersByPosition(positionGroup: Player['positionGroup']) {
  return roster.filter((p) => p.positionGroup === positionGroup);
}

export function getTotalSalary() {
  return roster.reduce((sum, p) => sum + p.salary, 0);
}

export function getTotalBudgetCharge() {
  return roster.reduce((sum, p) => sum + p.budgetCharge, 0);
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

export function getDPs() {
  return roster.filter((p) => p.designation === 'DP');
}

export function getU22Players() {
  return roster.filter((p) => p.designation === 'U22');
}

export function getHomegrowns() {
  return roster.filter((p) => p.designation === 'HG');
}

export function getInternationalPlayers() {
  return roster.filter((p) => p.isInternational);
}
