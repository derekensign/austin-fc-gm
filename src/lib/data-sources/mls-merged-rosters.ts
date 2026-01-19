/**
 * MLS Merged Roster Data
 * 
 * Combines two data sources:
 * 1. Current rosters from mlssoccer.com (scraped) - WHO is on each team
 * 2. MLSPA salary data - HOW MUCH each player makes
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

// ============================================================================
// MLSPA SALARY DATA TYPES
// ============================================================================

export interface MLSPASalaryEntry {
  club: string; // Team abbreviation (ATX, LAG, etc.)
  firstName: string;
  lastName: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
  releaseDate: string; // e.g., "2025-10-01" for October 2025 MLSPA release
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
// This is populated from MLSPA Salary Guide releases.
// Source: https://mlsplayers.org/resources/salary-guide
// 
// Note: This data needs to be updated when new MLSPA releases come out.
// The MLSPA typically releases salary data twice per year.
// ============================================================================

const MLSPA_SALARIES: MLSPASalaryEntry[] = [
  // =========================================================================
  // AUSTIN FC (ATX) - October 2025 MLSPA Release + North End Podcast updates
  // =========================================================================
  { club: 'ATX', firstName: 'Sebastián', lastName: 'Driussi', position: 'M', baseSalary: 3200000, guaranteedCompensation: 3551778, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Emiliano', lastName: 'Rigoni', position: 'M-F', baseSalary: 1520000, guaranteedCompensation: 2225000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Myrto', lastName: 'Uzuni', position: 'F', baseSalary: 600000, guaranteedCompensation: 600000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Brandon', lastName: 'Vázquez', position: 'F', baseSalary: 495000, guaranteedCompensation: 505401, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Dani', lastName: 'Pereira', position: 'M', baseSalary: 575000, guaranteedCompensation: 633333, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Julio', lastName: 'Cascante', position: 'D', baseSalary: 375000, guaranteedCompensation: 375000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Jader', lastName: 'Obrian', position: 'F', baseSalary: 550000, guaranteedCompensation: 550000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Brad', lastName: 'Stuver', position: 'GK', baseSalary: 484500, guaranteedCompensation: 507313, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Leo', lastName: 'Väisänen', position: 'D', baseSalary: 360000, guaranteedCompensation: 414000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Hector', lastName: 'Jimenez', position: 'D', baseSalary: 325000, guaranteedCompensation: 325000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Owen', lastName: 'Wolff', position: 'M', baseSalary: 275000, guaranteedCompensation: 297986, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Guilherme', lastName: 'Biro', position: 'D', baseSalary: 550000, guaranteedCompensation: 550000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Damian', lastName: 'Las', position: 'GK', baseSalary: 113400, guaranteedCompensation: 115000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Osman', lastName: 'Bukari', position: 'F', baseSalary: 500000, guaranteedCompensation: 505000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Matt', lastName: 'Bersano', position: 'GK', baseSalary: 125000, guaranteedCompensation: 125000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Kipp', lastName: 'Keller', position: 'D', baseSalary: 350000, guaranteedCompensation: 350000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Diego', lastName: 'Rubio', position: 'F', baseSalary: 337500, guaranteedCompensation: 347500, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Mikkel', lastName: 'Desler', position: 'D', baseSalary: 275000, guaranteedCompensation: 275000, releaseDate: '2025-10-01' },
  { club: 'ATX', firstName: 'Milos', lastName: 'Djordjevic', position: 'M', baseSalary: 475000, guaranteedCompensation: 514375, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // INTER MIAMI (MIA) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'MIA', firstName: 'Lionel', lastName: 'Messi', position: 'F', baseSalary: 20446667, guaranteedCompensation: 20446667, releaseDate: '2025-10-01' },
  { club: 'MIA', firstName: 'Luis', lastName: 'Suárez', position: 'F', baseSalary: 3500000, guaranteedCompensation: 4250000, releaseDate: '2025-10-01' },
  { club: 'MIA', firstName: 'Jordi', lastName: 'Alba', position: 'D', baseSalary: 4500000, guaranteedCompensation: 5300000, releaseDate: '2025-10-01' },
  { club: 'MIA', firstName: 'Sergio', lastName: 'Busquets', position: 'M', baseSalary: 4500000, guaranteedCompensation: 5200000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // LA GALAXY (LAG) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'LAG', firstName: 'Riqui', lastName: 'Puig', position: 'M', baseSalary: 3200000, guaranteedCompensation: 3850000, releaseDate: '2025-10-01' },
  { club: 'LAG', firstName: 'Marco', lastName: 'Reus', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3300000, releaseDate: '2025-10-01' },
  { club: 'LAG', firstName: 'Maya', lastName: 'Yoshida', position: 'D', baseSalary: 1600000, guaranteedCompensation: 1850000, releaseDate: '2025-10-01' },
  { club: 'LAG', firstName: 'Dejan', lastName: 'Joveljić', position: 'F', baseSalary: 1100000, guaranteedCompensation: 1350000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // ATLANTA UNITED (ATL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'ATL', firstName: 'Miguel', lastName: 'Almirón', position: 'M', baseSalary: 4500000, guaranteedCompensation: 5200000, releaseDate: '2025-10-01' },
  { club: 'ATL', firstName: 'Aleksey', lastName: 'Miranchuk', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000, releaseDate: '2025-10-01' },
  { club: 'ATL', firstName: 'Emmanuel', lastName: 'Latte Lath', position: 'F', baseSalary: 2200000, guaranteedCompensation: 2600000, releaseDate: '2025-10-01' },
  { club: 'ATL', firstName: 'Saba', lastName: 'Lobjanidze', position: 'M', baseSalary: 1200000, guaranteedCompensation: 1450000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // SEATTLE SOUNDERS (SEA) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'SEA', firstName: 'Albert', lastName: 'Rusnák', position: 'M', baseSalary: 2600000, guaranteedCompensation: 3100000, releaseDate: '2025-10-01' },
  { club: 'SEA', firstName: 'Jordan', lastName: 'Morris', position: 'F', baseSalary: 2200000, guaranteedCompensation: 2650000, releaseDate: '2025-10-01' },
  { club: 'SEA', firstName: 'Pedro', lastName: 'de la Vega', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // FC CINCINNATI (CIN) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'CIN', firstName: 'Luciano', lastName: 'Acosta', position: 'M', baseSalary: 3000000, guaranteedCompensation: 3500000, releaseDate: '2025-10-01' },
  { club: 'CIN', firstName: 'Brenner', lastName: 'Brenner', position: 'F', baseSalary: 2100000, guaranteedCompensation: 2450000, releaseDate: '2025-10-01' },
  { club: 'CIN', firstName: 'Kevin', lastName: 'Denkey', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2350000, releaseDate: '2025-10-01' },
  { club: 'CIN', firstName: 'Evander', lastName: 'Evander', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // COLUMBUS CREW (CLB) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'CLB', firstName: 'Cucho', lastName: 'Hernández', position: 'F', baseSalary: 3000000, guaranteedCompensation: 3600000, releaseDate: '2025-10-01' },
  { club: 'CLB', firstName: 'Diego', lastName: 'Rossi', position: 'F', baseSalary: 2500000, guaranteedCompensation: 2900000, releaseDate: '2025-10-01' },
  { club: 'CLB', firstName: 'Daniel', lastName: 'Gazdag', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // LAFC (LAFC) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'LAFC', firstName: 'Denis', lastName: 'Bouanga', position: 'F', baseSalary: 2800000, guaranteedCompensation: 3300000, releaseDate: '2025-10-01' },
  { club: 'LAFC', firstName: 'Olivier', lastName: 'Giroud', position: 'F', baseSalary: 2500000, guaranteedCompensation: 3000000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // NASHVILLE SC (NSH) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'NSH', firstName: 'Hany', lastName: 'Mukhtar', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000, releaseDate: '2025-10-01' },
  { club: 'NSH', firstName: 'Sam', lastName: 'Surridge', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // ORLANDO CITY (ORL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'ORL', firstName: 'Martín', lastName: 'Ojeda', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000, releaseDate: '2025-10-01' },
  { club: 'ORL', firstName: 'Luis', lastName: 'Muriel', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000, releaseDate: '2025-10-01' },
  { club: 'ORL', firstName: 'Mario', lastName: 'Pašalić', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // CHARLOTTE FC (CLT) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'CLT', firstName: 'Liel', lastName: 'Abada', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000, releaseDate: '2025-10-01' },
  { club: 'CLT', firstName: 'Wilfried', lastName: 'Zaha', position: 'F', baseSalary: 3500000, guaranteedCompensation: 4100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // TORONTO FC (TOR) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'TOR', firstName: 'Djordje', lastName: 'Mihailovic', position: 'M', baseSalary: 2000000, guaranteedCompensation: 2350000, releaseDate: '2025-10-01' },
  { club: 'TOR', firstName: 'Jonathan', lastName: 'Osorio', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // NEW ENGLAND REVOLUTION (NE) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'NE', firstName: 'Carles', lastName: 'Gil', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // CHICAGO FIRE (CHI) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'CHI', firstName: 'Hugo', lastName: 'Cuypers', position: 'F', baseSalary: 2100000, guaranteedCompensation: 2500000, releaseDate: '2025-10-01' },
  { club: 'CHI', firstName: 'Jhon', lastName: 'Bamba', position: 'F', baseSalary: 1600000, guaranteedCompensation: 1900000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // VANCOUVER WHITECAPS (VAN) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'VAN', firstName: 'Ryan', lastName: 'Gauld', position: 'M', baseSalary: 2400000, guaranteedCompensation: 2800000, releaseDate: '2025-10-01' },
  { club: 'VAN', firstName: 'Andrés', lastName: 'Cubas', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // SPORTING KANSAS CITY (SKC) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'SKC', firstName: 'Erik', lastName: 'Thommy', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  { club: 'SKC', firstName: 'Daniel', lastName: 'Sallói', position: 'F', baseSalary: 1200000, guaranteedCompensation: 1450000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // ST. LOUIS CITY SC (STL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'STL', firstName: 'Marcel', lastName: 'Hartel', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000, releaseDate: '2025-10-01' },
  { club: 'STL', firstName: 'João', lastName: 'Klauss', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  { club: 'STL', firstName: 'Eduard', lastName: 'Löwen', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // REAL SALT LAKE (RSL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'RSL', firstName: 'Roberto', lastName: 'Cruz', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // PORTLAND TIMBERS (POR) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'POR', firstName: 'James', lastName: 'Rodríguez', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // CF MONTREAL (MTL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'MTL', firstName: 'Iker', lastName: 'Jaime', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // PHILADELPHIA UNION (PHI) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'PHI', firstName: 'Mikael', lastName: 'Uhre', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // COLORADO RAPIDS (COL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'COL', firstName: 'Rafael', lastName: 'Navarro', position: 'F', baseSalary: 2400000, guaranteedCompensation: 2800000, releaseDate: '2025-10-01' },
  { club: 'COL', firstName: 'Paxten', lastName: 'Aaronson', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // FC DALLAS (DAL) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'DAL', firstName: 'Paul', lastName: 'Musa', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000, releaseDate: '2025-10-01' },
  
  // =========================================================================
  // SAN JOSE EARTHQUAKES (SJ) - Key Players (October 2025 MLSPA)
  // =========================================================================
  { club: 'SJ', firstName: 'Cristian', lastName: 'Arango', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000, releaseDate: '2025-10-01' },
];

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
  
  // Merge with MLSPA salary data
  const mergedTeams = rosters.teams.map(team => 
    mergeTeamRoster(team, MLSPA_SALARIES)
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
  return MLSPA_SALARIES;
}

/**
 * Get MLSPA salaries for a specific team
 */
export function getTeamMLSPASalaries(abbreviation: string): MLSPASalaryEntry[] {
  return MLSPA_SALARIES.filter(s => s.club === abbreviation);
}

