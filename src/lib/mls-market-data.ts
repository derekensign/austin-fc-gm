/**
 * MLS Market Data Processing
 * Combines MLSPA salary data with transfer fee data to analyze market values by position
 */

import { MLSPA_SALARIES, MLSPASalaryEntry } from '@/data/mlspa-salaries-scraped';
import { ALL_TRANSFERS } from '@/data/mls-transfers-all';
import { SCRAPED_TRANSFERS } from '@/data/mls-transfers-scraped';
import { leaguePlayerStats } from '@/data/mls-stats';

// Position normalization map - converts MLSPA verbose positions to standard codes
const POSITION_MAP: Record<string, string> = {
  // Goalkeepers
  'Goalkeeper': 'GK',

  // Defenders
  'Center-back': 'CB',
  'Centre-Back': 'CB',
  'Left-back': 'LB',
  'Right-back': 'RB',
  'Defender': 'DEF',

  // Midfielders
  'Defensive Midfield': 'CDM',
  'Central Midfield': 'CM',
  'Attacking Midfield': 'CAM',
  'Left Midfield': 'LM',
  'Right Midfield': 'RM',
  'Midfielder': 'MID',

  // Wingers
  'Left Wing': 'LW',
  'Right Wing': 'RW',

  // Forwards
  'Center Forward': 'ST',
  'Centre-Forward': 'ST',
  'Forward': 'FW',
  'Striker': 'ST',

  // From transfer data
  'GK': 'GK',
  'CB': 'CB',
  'LB': 'LB',
  'RB': 'RB',
  'DEF': 'DEF',
  'CDM': 'CDM',
  'DM': 'CDM',
  'CM': 'CM',
  'CAM': 'CAM',
  'AM': 'CAM',
  'LM': 'LM',
  'RM': 'RM',
  'LW': 'LW',
  'RW': 'RW',
  'ST': 'ST',
  'CF': 'ST',
  'FW': 'FW',
};

// Position groupings for analysis
export const POSITION_GROUPS: Record<string, string[]> = {
  'GK': ['GK'],
  'DEF': ['CB', 'LB', 'RB', 'DEF'],
  'MID': ['CDM', 'CM', 'CAM', 'LM', 'RM', 'MID'],
  'FWD': ['LW', 'RW', 'ST', 'FW'],
};

export const POSITION_LABELS: Record<string, string> = {
  'GK': 'Goalkeeper',
  'CB': 'Center Back',
  'LB': 'Left Back',
  'RB': 'Right Back',
  'DEF': 'Defender',
  'CDM': 'Defensive Mid',
  'CM': 'Central Mid',
  'CAM': 'Attacking Mid',
  'LM': 'Left Mid',
  'RM': 'Right Mid',
  'MID': 'Midfielder',
  'LW': 'Left Wing',
  'RW': 'Right Wing',
  'ST': 'Striker',
  'FW': 'Forward',
};

// Player acquisition types
export type AcquisitionType =
  | 'homegrown'      // Academy signing
  | 'college'        // College draft/signing
  | 'mls-trade'      // Trade from another MLS team
  | 'international'  // International transfer
  | 'usl'            // USL/lower division signing
  | 'mls-next-pro'   // MLS Next Pro / reserve team promotion
  | 'free-agent'     // Free agent / without club
  | 'unknown';       // Cannot determine

export interface MLSPlayerMarketData {
  firstName: string;
  lastName: string;
  fullName: string;
  club: string;
  position: string;
  positionNormalized: string;
  baseSalary: number;
  guaranteedCompensation: number;
  transferFee?: number;
  marketValue?: number;
  sourceClub?: string;
  sourceCountry?: string;
  transferYear?: number;
  acquisitionType?: AcquisitionType;

  // Performance stats (2025 season)
  goals?: number;
  assists?: number;
  minutes?: number;
  appearances?: number;
}

export interface PositionMarketStats {
  position: string;
  positionLabel: string;
  playerCount: number;

  // Salary stats
  avgSalary: number;
  medianSalary: number;
  minSalary: number;
  maxSalary: number;

  // Transfer fee stats (only players with transfers)
  transferCount: number;
  avgTransferFee: number;
  medianTransferFee: number;
  minTransferFee: number;
  maxTransferFee: number;

  // Market value stats
  marketValueCount: number;
  avgMarketValue: number;
  medianMarketValue: number;
  minMarketValue: number;
  maxMarketValue: number;

  // Top players
  topEarners: MLSPlayerMarketData[];
  topTransfers: MLSPlayerMarketData[];
}

/**
 * Normalize position string to standard code
 */
export function normalizePosition(position: string): string {
  return POSITION_MAP[position] || position;
}

// MLS team names for identifying MLS-to-MLS transfers
const MLS_TEAM_KEYWORDS = [
  'atlanta', 'austin', 'charlotte', 'chicago', 'cincinnati', 'colorado', 'columbus',
  'dc united', 'd.c.', 'dallas', 'houston', 'galaxy', 'la galaxy', 'lafc', 'los angeles',
  'miami', 'inter miami', 'minnesota', 'montreal', 'montréal', 'nashville', 'new england',
  'revolution', 'nycfc', 'new york city', 'red bulls', 'new york red', 'orlando', 'philadelphia',
  'union', 'portland', 'timbers', 'salt lake', 'rsl', 'san diego', 'san jose', 'earthquakes',
  'seattle', 'sounders', 'sporting kc', 'kansas city', 'st. louis', 'stl', 'toronto', 'vancouver',
  'whitecaps',
];

/**
 * Determine the acquisition type based on source club and country
 */
export function getAcquisitionType(sourceClub: string | undefined, sourceCountry: string | undefined): AcquisitionType {
  if (!sourceClub) return 'unknown';

  const src = sourceClub.toLowerCase();

  // Academy/Homegrown patterns
  const academyPatterns = ['academy', 'acad.', 'acad', 'youth', 'u-17', 'u-19', 'u17', 'u19'];
  if (academyPatterns.some(p => src.includes(p))) {
    return 'homegrown';
  }

  // MLS Next Pro / Reserve team patterns (must be after team name)
  // E.g., "ATL UTD 2", "LAFC 2", "Portland 2", "Inter Miami II"
  const nextProPatterns = [' ii', 'utd 2', 'fc 2', ' 2', 'next pro'];
  if (nextProPatterns.some(p => src.endsWith(p) || src.includes('next pro'))) {
    return 'mls-next-pro';
  }

  // Check if it's an MLS team (MLS-to-MLS trade)
  if (MLS_TEAM_KEYWORDS.some(kw => src.includes(kw))) {
    return 'mls-trade';
  }

  // Free agent / without club
  if (src.includes('without') || src.includes('free agent') || src.includes('unattached')) {
    return 'free-agent';
  }

  // USL / lower division US patterns - check BEFORE college to catch "Louisville City" before "Louisville"
  const uslPatterns = [
    'louisville city', 'real monarchs', 'tacoma defiance', 'switchbacks', 'loudoun united',
    'north texas sc', 'rgv toros', 'bethlehem steel', 'richmond kickers', 'charleston battery',
    'indy eleven', 'phoenix rising', 'san antonio fc', 'el paso locomotive', 'fc tulsa',
    'okc energy', 'birmingham legion', 'tampa bay rowdies', 'hartford athletic',
    'sacramento republic', 'las vegas lights', 'oakland roots', 'orange county sc',
    'new mexico united', 'rio grande valley', 'reno 1868', 'memphis 901',
    'charlotte independence', 'forward madison', 'detroit city', 'pittsburgh riverhounds',
    'north carolina fc', 'chattanooga', 'lexington sc', 'austin bold',
  ];
  if (uslPatterns.some(p => src.includes(p))) {
    return 'usl';
  }

  // College patterns (US colleges and universities)
  const collegePatterns = [
    'hoosier', 'bruins', 'cardinal', 'bluejays', 'billikens', 'stags', 'pioneers',
    'camels', 'hurricane', 'crimson', 'big red', 'tar heels', 'wolfpack', 'wildcats',
    'bulldogs', 'tigers', 'trojans', 'buckeyes', 'spartans', 'wolverines', 'badgers',
    'hawkeyes', 'fighting', 'terrapins', 'cavaliers', 'demon deacons',
    'aggies', 'sooners', 'longhorns', 'jayhawks', 'boilermakers', 'vaqueros',
    'ucla', 'usc', 'stanford', 'duke', 'wake forest', 'georgetown', 'notre dame',
    'virginia tech', 'maryland terps', 'ohio state', 'penn state', 'syracuse', 'clemson',
    'boston college', 'smu mustangs', 'cu bluejays', 'slu billikens', 'denver pioneers',
    'fairfield stags', 'st. john', 'creighton', 'villanova', 'xavier',
    'college', 'university',
  ];
  if (collegePatterns.some(p => src.includes(p))) {
    return 'college';
  }

  // If source country is not US/Canada, it's international
  if (sourceCountry && sourceCountry !== 'United States' && sourceCountry !== 'USA' && sourceCountry !== 'Canada') {
    return 'international';
  }

  // Default to unknown for US players from unrecognized sources
  return 'unknown';
}

/**
 * Normalize name for fuzzy matching (remove accents, lowercase, trim)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim();
}

/**
 * Normalize club name for matching - handles all MLS team variations
 */
function normalizeClub(club: string): string {
  const normalized = club.toLowerCase().trim()
    .replace(/\s+fc$|^fc\s+/, '') // Remove FC prefix/suffix
    .replace(/\s+sc$/, '') // Remove SC suffix
    .replace(/\s+united$/, '') // Remove United suffix
    .replace(/\s+cf$|^cf\s+/, '') // Remove CF prefix/suffix
    .replace(/\bcf\b/, '') // Remove standalone CF
    .replace(/\./g, '') // Remove periods
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Map variations to canonical names
  const clubMap: Record<string, string> = {
    'atlanta': 'atlanta',
    'austin': 'austin',
    'charlotte': 'charlotte',
    'chicago fire': 'chicago',
    'chicago': 'chicago',
    'cincinnati': 'cincinnati',
    'colorado rapids': 'colorado',
    'colorado': 'colorado',
    'columbus crew': 'columbus',
    'columbus': 'columbus',
    'dc': 'dc',
    'd c': 'dc',
    'dallas': 'dallas',
    'houston dynamo': 'houston',
    'houston': 'houston',
    'la galaxy': 'galaxy',
    'galaxy': 'galaxy',
    'los angeles galaxy': 'galaxy',
    'lafc': 'lafc',
    'los angeles': 'lafc', // Default to LAFC
    'inter miami': 'miami',
    'miami': 'miami',
    'minnesota': 'minnesota',
    'montréal': 'montreal',
    'montreal': 'montreal',
    'montreal impact': 'montreal',
    'cf montreal': 'montreal',
    'nashville': 'nashville',
    'new england revolution': 'newengland',
    'new england': 'newengland',
    'new york city': 'nycfc',
    'nycfc': 'nycfc',
    'new york red bulls': 'redbulls',
    'new york': 'redbulls', // Default to Red Bulls
    'red bulls': 'redbulls',
    'orlando city': 'orlando',
    'orlando': 'orlando',
    'philadelphia union': 'philadelphia',
    'philadelphia': 'philadelphia',
    'portland timbers': 'portland',
    'portland': 'portland',
    'real salt lake': 'saltlake',
    'real salt lake city': 'saltlake',
    'salt lake': 'saltlake',
    'salt lake city': 'saltlake',
    'rsl': 'saltlake',
    'san diego': 'sandiego',
    'san jose earthquakes': 'sanjose',
    'san jose': 'sanjose',
    'sj earthquakes': 'sanjose',
    'earthquakes': 'sanjose',
    'seattle sounders': 'seattle',
    'seattle': 'seattle',
    'sporting kansas city': 'sportingkc',
    'sporting kc': 'sportingkc',
    'sporting': 'sportingkc',
    'skc': 'sportingkc',
    'st louis city': 'stlouis',
    'st louis': 'stlouis',
    'stl': 'stlouis',
    'toronto': 'toronto',
    'vancouver whitecaps': 'vancouver',
    'vancouver': 'vancouver',
    'whitecaps': 'vancouver',
  };

  return clubMap[normalized] || normalized;
}

/**
 * Find best transfer match for a player
 */
function findTransferMatch(
  firstName: string,
  lastName: string,
  club: string
): { fee?: number; marketValue?: number; sourceClub?: string; year?: number } | null {
  const fullName = `${firstName} ${lastName}`;
  const normalizedName = normalizeName(fullName);
  const normalizedClub = normalizeClub(club);

  // Try exact match first from both sources
  const exactKey = `${fullName.toLowerCase()}_${normalizedClub}`;

  // Check ALL_TRANSFERS (comprehensive historical data)
  for (const transfer of ALL_TRANSFERS) {
    const transferKey = `${transfer.playerName.toLowerCase()}_${normalizeClub(transfer.mlsTeam)}`;
    if (transferKey === exactKey) {
      return {
        fee: transfer.fee,
        marketValue: transfer.marketValue,
        sourceClub: transfer.sourceClub || transfer.destinationClub,
        year: transfer.year,
      };
    }
  }

  // Check SCRAPED_TRANSFERS (scraped recent data)
  for (const transfer of SCRAPED_TRANSFERS) {
    const transferKey = `${transfer.playerName.toLowerCase()}_${normalizeClub(transfer.mlsTeam)}`;
    if (transferKey === exactKey) {
      return {
        fee: transfer.fee,
        marketValue: transfer.marketValue,
        sourceClub: transfer.sourceClub,
        year: transfer.year,
      };
    }
  }

  // Try fuzzy match by last name + club (for players with different first names like "Alex" vs "Alejandro")
  const normalizedLastName = normalizeName(lastName);

  // Try ALL_TRANSFERS
  for (const transfer of ALL_TRANSFERS) {
    const transferLastName = normalizeName(transfer.playerName.split(' ').slice(-1)[0]);
    const transferClub = normalizeClub(transfer.mlsTeam);

    if (transferLastName === normalizedLastName && transferClub === normalizedClub) {
      return {
        fee: transfer.fee,
        marketValue: transfer.marketValue,
        sourceClub: transfer.sourceClub || transfer.destinationClub,
        year: transfer.year,
      };
    }
  }

  // Try SCRAPED_TRANSFERS
  for (const transfer of SCRAPED_TRANSFERS) {
    const transferLastName = normalizeName(transfer.playerName.split(' ').slice(-1)[0]);
    const transferClub = normalizeClub(transfer.mlsTeam);

    if (transferLastName === normalizedLastName && transferClub === normalizedClub) {
      return {
        fee: transfer.fee,
        marketValue: transfer.marketValue,
        sourceClub: transfer.sourceClub,
        year: transfer.year,
      };
    }
  }

  return null;
}

/**
 * Find stats match for a player (2025 season)
 *
 * NOTE: Current stats data is limited. For complete 2025 season stats, scrape from:
 * - FBref (https://fbref.com/en/comps/22/Major-League-Soccer-Stats) for xG/xA
 * - American Soccer Analysis (https://www.americansocceranalysis.com/mls/) for advanced metrics
 * - MLS official stats API
 */
function findStatsMatch(
  firstName: string,
  lastName: string,
  club: string
): { goals?: number; assists?: number; minutes?: number; appearances?: number } | null {
  const fullName = `${firstName} ${lastName}`;
  const normalizedName = normalizeName(fullName);
  const normalizedClub = normalizeClub(club);

  // Try exact match
  for (const stats of leaguePlayerStats) {
    const statsName = normalizeName(stats.name);
    const statsClub = normalizeClub(stats.team);

    if (statsName === normalizedName && statsClub === normalizedClub) {
      return {
        goals: stats.goals,
        assists: stats.assists,
        minutes: stats.minutes,
        appearances: stats.appearances,
      };
    }
  }

  // Try fuzzy match by last name
  const normalizedLastName = normalizeName(lastName);
  for (const stats of leaguePlayerStats) {
    const statsLastName = normalizeName(stats.name.split(' ').slice(-1)[0]);
    const statsClub = normalizeClub(stats.team);

    if (statsLastName === normalizedLastName && statsClub === normalizedClub) {
      return {
        goals: stats.goals,
        assists: stats.assists,
        minutes: stats.minutes,
        appearances: stats.appearances,
      };
    }
  }

  // Try matching by first initial + last name (handles "L. Messi" vs "Lionel Messi")
  const firstInitial = firstName.charAt(0).toLowerCase();
  for (const stats of leaguePlayerStats) {
    const statsParts = stats.name.split(' ');
    const statsFirstInitial = statsParts[0].charAt(0).toLowerCase();
    const statsLastName = normalizeName(statsParts.slice(-1)[0]);
    const statsClub = normalizeClub(stats.team);

    // Match if: first initial matches AND last name matches AND club matches
    if (statsFirstInitial === firstInitial && statsLastName === normalizedLastName && statsClub === normalizedClub) {
      return {
        goals: stats.goals,
        assists: stats.assists,
        minutes: stats.minutes,
        appearances: stats.appearances,
      };
    }
  }

  return null;
}

// Cache for processed player data (cleared on module reload)
// Set to null initially to force rebuild after adding historical data
// IMPORTANT: Clear this (set to null) when updating stats data
let cachedPlayers: MLSPlayerMarketData[] | null = null;

/**
 * Clear the player data cache (useful for development/testing)
 */
export function clearPlayerCache() {
  cachedPlayers = null;
}

/**
 * Get all MLS players with combined salary and transfer data (cached)
 */
export function getAllMLSPlayers(): MLSPlayerMarketData[] {
  // Return cached data if available
  if (cachedPlayers) {
    return cachedPlayers;
  }

  // Build transfer lookup maps for O(1) access
  // We'll index by multiple keys for better matching
  const transferMap = new Map<string, { fee: number; marketValue: number; sourceClub?: string; sourceCountry?: string; year: number }>();

  // Helper to extract first name from full name
  const getFirstName = (name: string) => normalizeName(name.split(' ')[0]);
  const getLastName = (name: string) => {
    const parts = name.split(' ');
    return normalizeName(parts[parts.length - 1]);
  };
  // Get everything after first word (for multi-part last names like "De Paul", "Abou Ali")
  const getRestOfName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length <= 1) return '';
    return normalizeName(parts.slice(1).join(' '));
  };
  // Remove Jr./Sr./III suffixes for matching
  const removeSuffix = (name: string) => {
    return name.replace(/\s+(jr\.?|sr\.?|iii?|iv)$/i, '').trim();
  };

  // Index ALL_TRANSFERS with multiple key strategies
  for (const transfer of ALL_TRANSFERS) {
    const normalizedClub = normalizeClub(transfer.mlsTeam);
    const transferData = {
      fee: transfer.fee,
      marketValue: transfer.marketValue,
      sourceClub: transfer.sourceClub || transfer.destinationClub,
      sourceCountry: transfer.sourceCountry,
      year: transfer.year,
    };

    // Strategy 1: Full name + club
    const fullKey = `${normalizeName(transfer.playerName)}_${normalizedClub}`;
    if (!transferMap.has(fullKey)) {
      transferMap.set(fullKey, transferData);
    }

    // Strategy 2: First name + last name + club (handles "Evander Evander" vs "Evander da Silva")
    const firstName = getFirstName(transfer.playerName);
    const lastName = getLastName(transfer.playerName);
    const nameKey = `${firstName}_${lastName}_${normalizedClub}`;
    if (!transferMap.has(nameKey)) {
      transferMap.set(nameKey, transferData);
    }

    // Strategy 3: First name + club only (for mononyms like "Evander")
    const firstNameKey = `${firstName}_${normalizedClub}`;
    if (!transferMap.has(firstNameKey)) {
      transferMap.set(firstNameKey, transferData);
    }

    // Strategy 4: Last name + club only (for abbreviated names like "M. Reus")
    const lastNameKey = `_lastname_${lastName}_${normalizedClub}`;
    if (!transferMap.has(lastNameKey)) {
      transferMap.set(lastNameKey, transferData);
    }

    // Strategy 5: First initial + last name + club (handles "M. Reus" -> "Marco Reus")
    const firstInitial = firstName.charAt(0);
    if (firstInitial) {
      const initialKey = `_initial_${firstInitial}_${lastName}_${normalizedClub}`;
      if (!transferMap.has(initialKey)) {
        transferMap.set(initialKey, transferData);
      }
    }

    // Strategy 6: First initial + rest of name + club (handles "R. De Paul" -> "Rodrigo De Paul")
    const restOfName = getRestOfName(transfer.playerName);
    if (firstInitial && restOfName) {
      const restKey = `_rest_${firstInitial}_${restOfName}_${normalizedClub}`;
      if (!transferMap.has(restKey)) {
        transferMap.set(restKey, transferData);
      }
    }

    // Strategy 7: Rest of name only + club (handles multi-part last names)
    if (restOfName) {
      const restOnlyKey = `_restonly_${restOfName}_${normalizedClub}`;
      if (!transferMap.has(restOnlyKey)) {
        transferMap.set(restOnlyKey, transferData);
      }
    }

    // Strategy 8: Name without suffix + club (handles "Jr.", "Sr.")
    const nameNoSuffix = removeSuffix(transfer.playerName);
    if (nameNoSuffix !== transfer.playerName) {
      const noSuffixKey = `${normalizeName(nameNoSuffix)}_${normalizedClub}`;
      if (!transferMap.has(noSuffixKey)) {
        transferMap.set(noSuffixKey, transferData);
      }
    }
  }

  // Index SCRAPED_TRANSFERS with same strategies
  for (const transfer of SCRAPED_TRANSFERS) {
    const normalizedClub = normalizeClub(transfer.mlsTeam);
    const transferData = {
      fee: transfer.fee,
      marketValue: transfer.marketValue,
      sourceClub: transfer.sourceClub,
      sourceCountry: transfer.sourceCountry,
      year: transfer.year,
    };

    const fullKey = `${normalizeName(transfer.playerName)}_${normalizedClub}`;
    if (!transferMap.has(fullKey)) {
      transferMap.set(fullKey, transferData);
    }

    const firstName = getFirstName(transfer.playerName);
    const lastName = getLastName(transfer.playerName);
    const nameKey = `${firstName}_${lastName}_${normalizedClub}`;
    if (!transferMap.has(nameKey)) {
      transferMap.set(nameKey, transferData);
    }

    const firstNameKey = `${firstName}_${normalizedClub}`;
    if (!transferMap.has(firstNameKey)) {
      transferMap.set(firstNameKey, transferData);
    }

    // Strategy 4: Last name + club only (for abbreviated names like "M. Reus")
    const lastNameKey = `_lastname_${lastName}_${normalizedClub}`;
    if (!transferMap.has(lastNameKey)) {
      transferMap.set(lastNameKey, transferData);
    }

    // Strategy 5: First initial + last name + club (handles "M. Reus" -> "Marco Reus")
    const firstInitial = firstName.charAt(0);
    if (firstInitial) {
      const initialKey = `_initial_${firstInitial}_${lastName}_${normalizedClub}`;
      if (!transferMap.has(initialKey)) {
        transferMap.set(initialKey, transferData);
      }
    }

    // Strategy 6: First initial + rest of name + club (handles "R. De Paul" -> "Rodrigo De Paul")
    const restOfName = getRestOfName(transfer.playerName);
    if (firstInitial && restOfName) {
      const restKey = `_rest_${firstInitial}_${restOfName}_${normalizedClub}`;
      if (!transferMap.has(restKey)) {
        transferMap.set(restKey, transferData);
      }
    }

    // Strategy 7: Rest of name only + club (handles multi-part last names)
    if (restOfName) {
      const restOnlyKey = `_restonly_${restOfName}_${normalizedClub}`;
      if (!transferMap.has(restOnlyKey)) {
        transferMap.set(restOnlyKey, transferData);
      }
    }

    // Strategy 8: Name without suffix + club (handles "Jr.", "Sr.")
    const nameNoSuffix = removeSuffix(transfer.playerName);
    if (nameNoSuffix !== transfer.playerName) {
      const noSuffixKey = `${normalizeName(nameNoSuffix)}_${normalizedClub}`;
      if (!transferMap.has(noSuffixKey)) {
        transferMap.set(noSuffixKey, transferData);
      }
    }
  }

  // Build stats lookup map with multiple key strategies for better matching
  const statsMap = new Map<string, { goals: number; assists: number; minutes: number; appearances: number }>();

  for (const stats of leaguePlayerStats) {
    const normalizedClub = normalizeClub(stats.team);
    const statsData = {
      goals: stats.goals,
      assists: stats.assists,
      minutes: stats.minutes,
      appearances: stats.appearances,
    };

    // Strategy 1: Full name + club
    const key = `${normalizeName(stats.name)}_${normalizedClub}`;
    statsMap.set(key, statsData);

    // Strategy 2: First initial + last name + club (for "L. Messi" matching "Lionel Messi")
    const nameParts = stats.name.split(' ');
    if (nameParts.length >= 2) {
      const firstInitial = nameParts[0].charAt(0).toLowerCase();
      const lastName = normalizeName(nameParts.slice(-1)[0]);
      const initialKey = `${firstInitial}_${lastName}_${normalizedClub}`;
      if (!statsMap.has(initialKey)) {
        statsMap.set(initialKey, statsData);
      }
    }
  }

  // Process all MLSPA players with O(1) lookups using multiple key strategies
  cachedPlayers = MLSPA_SALARIES.map(player => {
    const fullName = `${player.firstName} ${player.lastName}`;
    const normalizedClub = normalizeClub(player.club);
    const firstName = normalizeName(player.firstName);
    const lastName = normalizeName(player.lastName);
    const firstInitial = firstName.charAt(0);
    // For multi-part last names like "De Paul", use the full lastName field
    const restOfNameFromLastName = normalizeName(player.lastName);

    // Extract first word only (for multi-word firstNames like "Rwan Philipe")
    const firstNameWord = getFirstName(player.firstName);
    // Extract last word of firstName (for mononyms like "José Artur" -> "Artur")
    const lastOfFirstName = getLastName(player.firstName);
    // Extract last word of lastName (for multi-part like "Rodrigues de Souza Cruz" -> "cruz")
    const lastNameWord = getLastName(player.lastName);
    // Extract first word of lastName (for cases like "Puig Martí" where "Puig" is the actual surname)
    const firstOfLastName = getFirstName(player.lastName);

    // Try multiple matching strategies
    const fullKey = `${normalizeName(fullName)}_${normalizedClub}`;
    const nameKey = `${firstName}_${lastName}_${normalizedClub}`;
    const firstNameKey = `${firstName}_${normalizedClub}`;
    const lastNameKey = `_lastname_${lastName}_${normalizedClub}`;
    const initialKey = firstInitial ? `_initial_${firstInitial}_${lastName}_${normalizedClub}` : '';
    // Strategy 6: For multi-part last names (MLSPA "Rodrigo De Paul" -> transfer "R. De Paul")
    const restKey = firstInitial ? `_rest_${firstInitial}_${restOfNameFromLastName}_${normalizedClub}` : '';
    // Strategy 7: Just the multi-part last name
    const restOnlyKey = `_restonly_${restOfNameFromLastName}_${normalizedClub}`;
    // Strategy 8: Full name without suffix
    const fullNameNoSuffix = removeSuffix(fullName);
    const noSuffixKey = fullNameNoSuffix !== fullName ? `${normalizeName(fullNameNoSuffix)}_${normalizedClub}` : '';
    // Strategy 9: First word of firstName + last word of lastName (for "Rwan Philipe" + "Cruz")
    const firstLastWordKey = `${firstNameWord}_${lastNameWord}_${normalizedClub}`;
    // Strategy 10: Last word of lastName only (more fuzzy match)
    const lastWordKey = `_lastname_${lastNameWord}_${normalizedClub}`;
    // Strategy 11: First initial of firstName + last word of lastName
    const initialLastWordKey = firstNameWord.charAt(0) ? `_initial_${firstNameWord.charAt(0)}_${lastNameWord}_${normalizedClub}` : '';
    // Strategy 12: First word of lastName + club (for "Puig Martí" -> "Puig")
    const firstOfLastKey = `_lastname_${firstOfLastName}_${normalizedClub}`;
    // Strategy 13: Last word of firstName + club (for mononyms like "José Artur" -> "Artur")
    const lastOfFirstKey = `${lastOfFirstName}_${normalizedClub}`;

    // Try keys in order of specificity
    let transferData = transferMap.get(fullKey)
      || transferMap.get(nameKey)
      || transferMap.get(firstNameKey)
      || (initialKey ? transferMap.get(initialKey) : undefined)
      || transferMap.get(lastNameKey)
      || (restKey ? transferMap.get(restKey) : undefined)
      || transferMap.get(restOnlyKey)
      || (noSuffixKey ? transferMap.get(noSuffixKey) : undefined)
      || transferMap.get(firstLastWordKey)
      || transferMap.get(lastWordKey)
      || (initialLastWordKey ? transferMap.get(initialLastWordKey) : undefined)
      || transferMap.get(firstOfLastKey)
      || transferMap.get(lastOfFirstKey);

    // Special handling for players in "MLS Pool", "Retired", or "Without a Club"
    // These players don't have a current team, so try matching by name only across all clubs
    if (!transferData && ['mls pool', 'retired', 'without a club'].includes(player.club.toLowerCase())) {
      // Search through all transfers for name match (get most recent)
      const nameMatches = [...ALL_TRANSFERS, ...SCRAPED_TRANSFERS].filter(t => {
        const tNameNorm = normalizeName(t.playerName);
        const tLastWord = getLastName(t.playerName);
        const tFirstInitial = getFirstName(t.playerName).charAt(0);
        // Match by: last name + first initial
        return tLastWord === lastNameWord && tFirstInitial === firstNameWord.charAt(0);
      });
      if (nameMatches.length > 0) {
        // Get most recent transfer
        const mostRecent = nameMatches.sort((a, b) => b.year - a.year)[0];
        transferData = {
          fee: mostRecent.fee,
          marketValue: mostRecent.marketValue,
          sourceClub: mostRecent.sourceClub,
          sourceCountry: mostRecent.sourceCountry,
          year: mostRecent.year,
        };
      }
    }

    // Try to get stats with multiple matching strategies
    let statsData = statsMap.get(fullKey);

    // If no exact match, try first initial + last name
    if (!statsData) {
      const firstInitial = firstName.charAt(0).toLowerCase();
      const initialKey = `${firstInitial}_${normalizeName(player.lastName)}_${normalizedClub}`;
      statsData = statsMap.get(initialKey);
    }

    // Determine acquisition type
    const acquisitionType = getAcquisitionType(transferData?.sourceClub, transferData?.sourceCountry);

    return {
      firstName: player.firstName,
      lastName: player.lastName,
      fullName,
      club: player.club,
      position: player.position,
      positionNormalized: normalizePosition(player.position),
      baseSalary: player.baseSalary,
      guaranteedCompensation: player.guaranteedCompensation,
      transferFee: transferData?.fee,
      marketValue: transferData?.marketValue,
      sourceClub: transferData?.sourceClub,
      sourceCountry: transferData?.sourceCountry,
      transferYear: transferData?.year,
      acquisitionType,
      goals: statsData?.goals,
      assists: statsData?.assists,
      minutes: statsData?.minutes,
      appearances: statsData?.appearances,
    };
  });

  return cachedPlayers;
}

/**
 * Calculate statistics for an array of numbers
 */
function calculateStats(values: number[]): { avg: number; median: number; min: number; max: number } {
  if (values.length === 0) {
    return { avg: 0, median: 0, min: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const avg = sum / sorted.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  return {
    avg,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

/**
 * Get market statistics by position
 */
export function getPositionMarketStats(position: string): PositionMarketStats {
  const allPlayers = getAllMLSPlayers();
  const positionPlayers = allPlayers.filter(p => p.positionNormalized === position);

  // Salary stats
  const salaries = positionPlayers.map(p => p.guaranteedCompensation);
  const salaryStats = calculateStats(salaries);

  // Transfer fee stats (only players with transfers)
  const playersWithTransfers = positionPlayers.filter(p => p.transferFee && p.transferFee > 0);
  const transferFees = playersWithTransfers.map(p => p.transferFee!);
  const transferStats = calculateStats(transferFees);

  // Market value stats
  const playersWithMarketValue = positionPlayers.filter(p => p.marketValue && p.marketValue > 0);
  const marketValues = playersWithMarketValue.map(p => p.marketValue!);
  const marketValueStats = calculateStats(marketValues);

  // Top earners
  const topEarners = [...positionPlayers]
    .sort((a, b) => b.guaranteedCompensation - a.guaranteedCompensation)
    .slice(0, 10);

  // Top transfers
  const topTransfers = [...playersWithTransfers]
    .sort((a, b) => (b.transferFee || 0) - (a.transferFee || 0))
    .slice(0, 10);

  return {
    position,
    positionLabel: POSITION_LABELS[position] || position,
    playerCount: positionPlayers.length,

    avgSalary: salaryStats.avg,
    medianSalary: salaryStats.median,
    minSalary: salaryStats.min,
    maxSalary: salaryStats.max,

    transferCount: playersWithTransfers.length,
    avgTransferFee: transferStats.avg,
    medianTransferFee: transferStats.median,
    minTransferFee: transferStats.min,
    maxTransferFee: transferStats.max,

    marketValueCount: playersWithMarketValue.length,
    avgMarketValue: marketValueStats.avg,
    medianMarketValue: marketValueStats.median,
    minMarketValue: marketValueStats.min,
    maxMarketValue: marketValueStats.max,

    topEarners,
    topTransfers,
  };
}

/**
 * Get all unique positions in the dataset
 */
export function getAllPositions(): string[] {
  const positions = new Set<string>();
  MLSPA_SALARIES.forEach(player => {
    positions.add(normalizePosition(player.position));
  });
  return Array.from(positions).sort();
}

/**
 * Get market stats for all positions
 */
export function getAllPositionStats(): Record<string, PositionMarketStats> {
  const positions = getAllPositions();
  const stats: Record<string, PositionMarketStats> = {};

  positions.forEach(position => {
    stats[position] = getPositionMarketStats(position);
  });

  return stats;
}

/**
 * Calculate value score - how good a deal is the player?
 * Compares player's salary to position average
 * > 1.0 = overpaid relative to position
 * < 1.0 = underpaid relative to position
 */
export function calculateValueScore(player: MLSPlayerMarketData, positionStats: PositionMarketStats): number {
  if (positionStats.avgSalary === 0) return 1;
  return player.guaranteedCompensation / positionStats.avgSalary;
}

/**
 * Get value ranking (percentile) within position
 */
export function getValuePercentile(player: MLSPlayerMarketData): number {
  const allPlayers = getAllMLSPlayers();
  const positionPlayers = allPlayers
    .filter(p => p.positionNormalized === player.positionNormalized)
    .sort((a, b) => a.guaranteedCompensation - b.guaranteedCompensation);

  const playerIndex = positionPlayers.findIndex(
    p => p.fullName === player.fullName && p.club === player.club
  );

  if (playerIndex === -1) return 50;
  return (playerIndex / positionPlayers.length) * 100;
}
