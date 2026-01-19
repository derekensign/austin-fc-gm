/**
 * MLS Merged Roster Data
 * 
 * Combines two data sources:
 * 1. Current rosters from mlssoccer.com (scraped) - WHO is on each team
 * 2. MLSPA salary data (scraped from mlsplayers.org) - HOW MUCH each player makes
 * 
 * Why merge?
 * - MLSPA salary data is the most accurate source for salaries
 * - But MLSPA data may be outdated for current team assignments (transfers happen)
 * - mlssoccer.com has current rosters but not detailed salary info
 * 
 * This module merges both to get the best of both worlds.
 */

import { getCached, setCache } from '../cache/file-cache';
import { 
  MLSLeagueRosters, 
  MLSTeamRoster, 
  MLSRosterPlayer,
  scrapeAllMLSRosters,
  MLS_TEAMS 
} from './mls-rosters';
import { MLSPA_SALARIES, MLSPASalaryEntry as ImportedMLSPASalaryEntry } from '@/data/mlspa-salaries-scraped';

// ============================================================================
// TEAM NAME TO ABBREVIATION MAPPING
// ============================================================================

const TEAM_NAME_TO_ABBREVIATION: Record<string, string> = {
  'Atlanta United': 'ATL',
  'Austin FC': 'ATX',
  'Charlotte FC': 'CLT',
  'Chicago Fire': 'CHI',
  'FC Cincinnati': 'CIN',
  'Colorado Rapids': 'COL',
  'Columbus Crew': 'CLB',
  'FC Dallas': 'DAL',
  'DC United': 'DC',
  'Houston Dynamo': 'HOU',
  'Inter Miami': 'MIA',
  'LA Galaxy': 'LAG',
  'LAFC': 'LAFC',
  'Minnesota United': 'MIN',
  'Nashville SC': 'NSH',
  'New England Revolution': 'NE',
  'New York City FC': 'NYCFC',
  'New York Red Bulls': 'NYRB',
  'Orlando City SC': 'ORL',
  'Philadelphia Union': 'PHI',
  'Portland Timbers': 'POR',
  'Real Salt Lake': 'RSL',
  'San Jose Earthquakes': 'SJ',
  'San Diego FC': 'SD',
  'Seattle Sounders FC': 'SEA',
  'Sporting Kansas City': 'SKC',
  'St. Louis City SC': 'STL',
  'Toronto FC': 'TOR',
  'Vancouver Whitecaps': 'VAN',
  'CF Montreal': 'MTL',
  'MLS Pool': 'MLS_POOL',
  'Retired': 'RETIRED',
  'Without a Club': 'FREE',
};

/**
 * Convert full team name to abbreviation
 */
function normalizeTeamToAbbreviation(teamName: string): string {
  return TEAM_NAME_TO_ABBREVIATION[teamName] || teamName;
}

// ============================================================================
// MLSPA SALARY DATA TYPES
// ============================================================================

export interface MLSPASalaryEntry extends ImportedMLSPASalaryEntry {
  releaseDate?: string; // e.g., "2025-10-01" for October 2025 MLSPA release
}

// ============================================================================
// MERGED PLAYER TYPE (Roster + Salary)
// ============================================================================

export interface MergedMLSPlayer {
  // From mlssoccer.com scrape
  name: string;
  jerseyNumber: number | null;
  position: string;
  rosterCategory: MLSRosterPlayer['rosterCategory'];
  categories: MLSRosterPlayer['categories'];
  playerUrl: string;
  
  // From MLSPA salary data (may be null if no match)
  salary: {
    baseSalary: number | null;
    guaranteedCompensation: number | null;
    mlspaReleaseDate: string | null;
    matched: boolean;
  };
  
  // Computed fields
  team: {
    name: string;
    abbreviation: string;
    slug: string;
  };
}

export interface MergedTeamRoster {
  team: {
    name: string;
    abbreviation: string;
    slug: string;
  };
  players: MergedMLSPlayer[];
  stats: {
    totalPlayers: number;
    playersWithSalary: number;
    totalBaseSalary: number;
    totalGuaranteedComp: number;
    dpCount: number;
    u22Count: number;
    internationalCount: number;
    homegrownCount: number;
  };
  lastUpdated: string;
}

export interface MergedLeagueRosters {
  teams: MergedTeamRoster[];
  lastUpdated: string;
  sources: {
    rosters: string;
    salaries: string;
  };
}

// ============================================================================
// MLSPA SALARY DATA
// 
// Comprehensive salary data imported from @/data/mlspa-salaries-2025.ts
// Source: https://mlsplayers.org/resources/salary-guide
// Release Date: October 2025
// ============================================================================

// Use the comprehensive scraped salary data (944 players from mlsplayers.org)
// Note: The scraped data uses full team names, so we normalize them to abbreviations
const MLSPA_SALARIES_NORMALIZED: MLSPASalaryEntry[] = MLSPA_SALARIES.map(s => ({
  ...s,
  club: normalizeTeamToAbbreviation(s.club),
}));

// ============================================================================
// NAME MATCHING UTILITIES
// ============================================================================

/**
 * Normalize a name for matching (remove accents, lowercase, etc.)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z\s]/g, '') // Remove non-letters
    .trim();
}

/**
 * Check if two names match (fuzzy matching)
 */
function namesMatch(name1: string, name2: string): boolean {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);
  
  // Exact match
  if (n1 === n2) return true;
  
  // Check if one contains the other
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Check if last names match (for "FirstName LastName" vs "LastName")
  const parts1 = n1.split(' ');
  const parts2 = n2.split(' ');
  
  // Compare last parts (likely last names)
  const last1 = parts1[parts1.length - 1];
  const last2 = parts2[parts2.length - 1];
  
  if (last1 === last2 && last1.length > 2) return true;
  
  return false;
}

/**
 * Find MLSPA salary data for a player
 */
function findSalaryMatch(
  playerName: string,
  teamAbbreviation: string,
  salaries: MLSPASalaryEntry[]
): MLSPASalaryEntry | null {
  // First, try to find exact team + name match
  const teamSalaries = salaries.filter(s => s.club === teamAbbreviation);
  
  for (const salary of teamSalaries) {
    const fullName = `${salary.firstName} ${salary.lastName}`;
    if (namesMatch(playerName, fullName)) {
      return salary;
    }
    // Also try just last name
    if (namesMatch(playerName, salary.lastName)) {
      return salary;
    }
  }
  
  // Try all salaries (player may have transferred)
  for (const salary of salaries) {
    const fullName = `${salary.firstName} ${salary.lastName}`;
    if (namesMatch(playerName, fullName)) {
      return salary;
    }
  }
  
  return null;
}

// ============================================================================
// MERGE FUNCTIONS
// ============================================================================

/**
 * Merge a single team's roster with MLSPA salary data
 */
function mergeTeamRoster(
  roster: MLSTeamRoster,
  salaries: MLSPASalaryEntry[]
): MergedTeamRoster {
  let totalBaseSalary = 0;
  let totalGuaranteedComp = 0;
  let playersWithSalary = 0;
  
  const mergedPlayers: MergedMLSPlayer[] = roster.players.map(player => {
    const salaryMatch = findSalaryMatch(
      player.name,
      roster.team.abbreviation,
      salaries
    );
    
    if (salaryMatch) {
      playersWithSalary++;
      totalBaseSalary += salaryMatch.baseSalary;
      totalGuaranteedComp += salaryMatch.guaranteedCompensation;
    }
    
    return {
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      position: player.position,
      rosterCategory: player.rosterCategory,
      categories: player.categories,
      playerUrl: player.playerUrl,
      salary: {
        baseSalary: salaryMatch?.baseSalary || null,
        guaranteedCompensation: salaryMatch?.guaranteedCompensation || null,
        mlspaReleaseDate: salaryMatch?.releaseDate || null,
        matched: !!salaryMatch,
      },
      team: roster.team,
    };
  });
  
  return {
    team: roster.team,
    players: mergedPlayers,
    stats: {
      totalPlayers: roster.players.length,
      playersWithSalary,
      totalBaseSalary,
      totalGuaranteedComp,
      dpCount: roster.players.filter(p => p.categories.isDP).length,
      u22Count: roster.players.filter(p => p.categories.isU22).length,
      internationalCount: roster.players.filter(p => p.categories.isInternational).length,
      homegrownCount: roster.players.filter(p => p.categories.isHomegrown).length,
    },
    lastUpdated: roster.lastUpdated,
  };
}

/**
 * Get merged rosters (rosters from mlssoccer.com + MLSPA salaries)
 */
export async function getMergedRosters(forceRefresh = false): Promise<MergedLeagueRosters | null> {
  const CACHE_KEY = 'mls-merged-rosters-2026';
  
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCached<MergedLeagueRosters>(CACHE_KEY);
    if (cached) {
      console.log('Using cached merged rosters');
      return cached;
    }
  }
  
  // Get scraped rosters
  const rosters = await scrapeAllMLSRosters(false); // Don't force refresh scrape
  if (!rosters) {
    console.error('Failed to get scraped rosters');
    return null;
  }
  
  // Merge with MLSPA salary data (using normalized team abbreviations)
  const mergedTeams = rosters.teams.map(team => 
    mergeTeamRoster(team, MLSPA_SALARIES_NORMALIZED)
  );
  
  const result: MergedLeagueRosters = {
    teams: mergedTeams,
    lastUpdated: new Date().toISOString(),
    sources: {
      rosters: rosters.source,
      salaries: 'MLSPA Salary Guide (October 2025)',
    },
  };
  
  // Cache for 24 hours
  await setCache(CACHE_KEY, result, 24 * 60 * 60 * 1000);
  
  return result;
}

/**
 * Get a single team's merged roster
 */
export async function getTeamMergedRoster(
  abbreviation: string,
  forceRefresh = false
): Promise<MergedTeamRoster | null> {
  const allRosters = await getMergedRosters(forceRefresh);
  if (!allRosters) return null;
  
  return allRosters.teams.find(t => t.team.abbreviation === abbreviation) || null;
}

/**
 * Generate a summary for AI context
 */
export function generateMergedRosterSummaryForAI(rosters: MergedLeagueRosters): string {
  const summaries: string[] = [];
  
  // Sort by total guaranteed comp (most expensive teams first)
  const sortedTeams = [...rosters.teams].sort(
    (a, b) => b.stats.totalGuaranteedComp - a.stats.totalGuaranteedComp
  );
  
  for (const team of sortedTeams) {
    const dps = team.players.filter(p => p.categories.isDP);
    const highestPaid = [...team.players]
      .filter(p => p.salary.matched)
      .sort((a, b) => (b.salary.guaranteedCompensation || 0) - (a.salary.guaranteedCompensation || 0))
      .slice(0, 5);
    
    const formatSalary = (amount: number | null) => {
      if (!amount) return 'N/A';
      if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
      return `$${(amount / 1_000).toFixed(0)}K`;
    };
    
    summaries.push(`
**${team.team.name} (${team.team.abbreviation})**
- Roster: ${team.stats.totalPlayers} players (${team.stats.playersWithSalary} with salary data)
- Total Guaranteed Comp: ${formatSalary(team.stats.totalGuaranteedComp)}
- DPs (${team.stats.dpCount}/3): ${dps.map(p => `${p.name} (${formatSalary(p.salary.guaranteedCompensation)})`).join(', ') || 'None'}
- Top 5 Salaries: ${highestPaid.map(p => `${p.name} ${formatSalary(p.salary.guaranteedCompensation)}`).join(', ') || 'N/A'}
- U22: ${team.stats.u22Count}, International: ${team.stats.internationalCount}/8, Homegrown: ${team.stats.homegrownCount}
`);
  }
  
  return `
==============================================================================
MLS MERGED ROSTERS (Current Rosters + MLSPA Salary Data)
Sources: 
- Current Rosters: ${rosters.sources.rosters}
- Salary Data: ${rosters.sources.salaries}
Last Updated: ${rosters.lastUpdated}
==============================================================================

${summaries.join('\n')}
`;
}

/**
 * Export the raw MLSPA salary data for direct access
 */
export function getMLSPASalaries(): MLSPASalaryEntry[] {
  return MLSPA_SALARIES_NORMALIZED;
}

/**
 * Get MLSPA salaries for a specific team
 */
export function getTeamMLSPASalaries(abbreviation: string): MLSPASalaryEntry[] {
  return MLSPA_SALARIES_NORMALIZED.filter(s => s.club === abbreviation);
}

/**
 * Get total players in MLSPA salary data
 */
export function getMLSPASalariesCount(): number {
  return MLSPA_SALARIES_NORMALIZED.length;
}

