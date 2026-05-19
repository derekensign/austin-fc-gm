/**
 * Historical MLSPA salary data, parsed from Wayback Machine snapshots
 * (2018-2026). Each calendar year has a "definitive" release we use for
 * year-over-year comparisons:
 *   - Fall release if available
 *   - Otherwise the most recent earlier release in that year (typically spring)
 *
 * The full set of all 14 releases is still archived at
 * data/mlspa-historical/{label}.json — we just import the definitive ones
 * here for the dashboard. Use loadAllReleases() to access them all.
 */

import release2018 from '../../data/mlspa-historical/2018-09-15.json';
import release2019 from '../../data/mlspa-historical/2019-09-13.json';
import release2021 from '../../data/mlspa-historical/2021-09-30.json';
import release2022 from '../../data/mlspa-historical/2022-09-02.json';
import release2023 from '../../data/mlspa-historical/2023-09-15.json';
import release2024 from '../../data/mlspa-historical/2024-09-13.json';
import release2025 from '../../data/mlspa-historical/2025-10-01.json';
import release2026 from '../../data/mlspa-historical/2026-04-16.json';

export interface MLSPAHistoricalPlayer {
  firstName: string;
  lastName: string;
  club: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

export interface MLSPAHistoricalRelease {
  label: string;
  caption: string;
  releaseDate: string;
  releaseYear: number;
  releaseSeason: 'spring' | 'fall';
  totalPlayers: number;
  players: MLSPAHistoricalPlayer[];
  source: string;
}

// One release per year (the canonical "season-end" snapshot when available).
// Years that fall outside this range have no salary spend data attached.
export const DEFINITIVE_RELEASES: Record<number, MLSPAHistoricalRelease> = {
  2018: release2018 as MLSPAHistoricalRelease,
  2019: release2019 as MLSPAHistoricalRelease,
  2021: release2021 as MLSPAHistoricalRelease,
  2022: release2022 as MLSPAHistoricalRelease,
  2023: release2023 as MLSPAHistoricalRelease,
  2024: release2024 as MLSPAHistoricalRelease,
  2025: release2025 as MLSPAHistoricalRelease,
  2026: release2026 as MLSPAHistoricalRelease,
};

export const SALARY_YEARS = Object.keys(DEFINITIVE_RELEASES)
  .map(Number)
  .sort((a, b) => a - b);

// Map historical team-name variants to canonical names that match the
// dataset used by /club-spending (so salary totals join cleanly with
// transfer totals).
const SALARY_TEAM_OVERRIDES: Record<string, string> = {
  // Pre-2022 Montréal naming variants
  'Montreal Impact': 'CF Montréal',
  'CF Montreal': 'CF Montréal',
  'Montreal': 'CF Montréal',
  // 2022/2023 St. Louis naming variants
  'St. Louis SC': 'St. Louis CITY SC',
  'St. Louis City SC': 'St. Louis CITY SC',
  // Match the canonical names already used in club-spending/page.tsx
  'Chicago Fire': 'Chicago Fire FC',
  'Houston Dynamo': 'Houston Dynamo FC',
  'Vancouver Whitecaps': 'Vancouver Whitecaps FC',
  'Minnesota United': 'Minnesota United FC',
  'Inter Miami': 'Inter Miami CF',
  'LAFC': 'Los Angeles FC',
  'DC United': 'D.C. United',
};

// Buckets that aren't real MLS clubs and shouldn't roll into team totals.
const EXCLUDED_TEAMS = new Set([
  '',
  'MLS Pool',
  'Major League Soccer',
  'Retired',
  'Without a Club',
]);

export function canonicalSalaryTeam(team: string): string | null {
  if (EXCLUDED_TEAMS.has(team)) return null;
  return SALARY_TEAM_OVERRIDES[team] || team;
}

/**
 * Get total guaranteed compensation per club for a given year. Returns null
 * for years outside the range we have releases for.
 */
export function getSalaryTotalsByClub(year: number): Map<string, { totalGC: number; totalBase: number; players: number }> | null {
  const release = DEFINITIVE_RELEASES[year];
  if (!release) return null;
  const map = new Map<string, { totalGC: number; totalBase: number; players: number }>();
  for (const p of release.players) {
    const team = canonicalSalaryTeam(p.club);
    if (!team) continue;
    const existing = map.get(team) || { totalGC: 0, totalBase: 0, players: 0 };
    existing.totalGC += p.guaranteedCompensation;
    existing.totalBase += p.baseSalary;
    existing.players += 1;
    map.set(team, existing);
  }
  return map;
}

/**
 * Get league-wide salary spend (sum of guaranteed comp across all real
 * MLS clubs) for a year.
 */
export function getLeagueSalary(year: number): number {
  const totals = getSalaryTotalsByClub(year);
  if (!totals) return 0;
  let sum = 0;
  for (const t of totals.values()) sum += t.totalGC;
  return sum;
}
