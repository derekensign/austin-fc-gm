/**
 * MLS ROSTER RULES & CBA PROVISIONS (2025-2026)
 * 
 * Sources:
 * - MLS Official Roster Rules: https://www.mlssoccer.com/league-reports/roster-rules/
 * - MLS-MLSPA Collective Bargaining Agreement (2020-2028): https://mlsplayers.org/resources/cba
 * - MLS 2025 Roster Rules Announcement: https://www.mlssoccer.com/news/mls-announces-2025-roster-rules-changes
 * 
 * Last Updated: January 2026
 * Applicable Seasons: 2025, 2026
 */

// ============================================================================
// ROSTER COMPOSITION
// ============================================================================

export const rosterComposition = {
  /**
   * MAXIMUM ROSTER SIZE
   * Each MLS club may have up to 30 players on its active roster.
   * All 30 players are eligible for matchday selection in MLS regular season and playoffs.
   */
  maxRosterSize: 30,

  /**
   * SENIOR ROSTER (Slots 1-20)
   * Players in slots 1-20 count against the Salary Budget.
   * If a club has fewer than 18 senior roster players, minimum budget charges are imputed.
   */
  seniorRoster: {
    slots: [1, 20],
    maxPlayers: 20,
    minPlayers: 18, // Below this, minimum budget charges are imputed
    countsAgainstBudget: true,
  },

  /**
   * SUPPLEMENTAL ROSTER (Slots 21-30)
   * Players in slots 21-30 do NOT count against the Salary Budget.
   * Specific eligibility requirements apply for each slot range.
   */
  supplementalRoster: {
    slots: [21, 30],
    maxPlayers: 10,
    countsAgainstBudget: false,
    slotRequirements: {
      /**
       * Slots 21-24: Senior Minimum Salary or higher
       * Eligible: Homegrown Players, Generation adidas, draft-eligible players
       */
      '21-24': {
        minSalary: 'seniorMinimum',
        eligibleCategories: ['Homegrown', 'Generation adidas', 'Draft-eligible'],
      },
      /**
       * Slots 25-30: Reserve Minimum Salary
       * Must be 24 years old or younger during the League Year
       * Eligible: Generation adidas, Homegrown Players
       */
      '25-30': {
        minSalary: 'reserveMinimum',
        maxAge: 24,
        eligibleCategories: ['Generation adidas', 'Homegrown'],
      },
    },
  },
};

// ============================================================================
// SALARY BUDGET & CHARGES (2025 FIGURES)
// ============================================================================

export const salaryBudget2025 = {
  /**
   * SALARY BUDGET
   * The total amount clubs can spend on senior roster players (slots 1-20)
   * 2025: $5,950,000
   */
  totalBudget: 5_950_000,

  /**
   * MAXIMUM SALARY BUDGET CHARGE
   * The highest amount any single player can count against the budget
   * Players earning above this become Designated Players (DPs)
   * 2025: $743,750
   * 2026 (projected): $803,125
   */
  maxBudgetCharge: {
    2025: 743_750,
    2026: 803_125,
  },

  /**
   * SENIOR MINIMUM SALARY
   * Minimum salary for senior roster players (slots 1-24)
   * 2025: $71,750
   */
  seniorMinimumSalary: 71_750,

  /**
   * RESERVE MINIMUM SALARY
   * Minimum salary for reserve/supplemental players (slots 25-30)
   * 2025: $67,360
   */
  reserveMinimumSalary: 67_360,
};

// ============================================================================
// ROSTER CONSTRUCTION MODELS (2025+)
// ============================================================================

export const rosterConstructionModels = {
  /**
   * ROSTER CONSTRUCTION MODEL CHOICE
   * Starting 2025, clubs must choose ONE of two models at the start of each season.
   * The choice must be declared by the Roster Compliance Date (e.g., February 21, 2025).
   * Clubs may adjust their choice mid-season (July 1 - August 21) under certain conditions.
   */
  
  /**
   * MODEL A: DESIGNATED PLAYER MODEL
   * - Up to 3 Designated Players
   * - Up to 3 U22 Initiative Players
   * Best for: Clubs wanting maximum star power
   */
  modelA: {
    name: 'Designated Player Model',
    designatedPlayers: { max: 3 },
    u22Initiative: { max: 3 },
    additionalGAM: 0,
    bestFor: 'Clubs prioritizing marquee signings and star power',
  },

  /**
   * MODEL B: U22 INITIATIVE MODEL
   * - Up to 2 Designated Players
   * - Up to 4 U22 Initiative Players
   * - Additional $2,000,000 in General Allocation Money (GAM)
   * Best for: Clubs focusing on young talent development
   */
  modelB: {
    name: 'U22 Initiative Model',
    designatedPlayers: { max: 2 },
    u22Initiative: { max: 4 },
    additionalGAM: 2_000_000,
    bestFor: 'Clubs prioritizing youth development and flexibility',
  },

  /**
   * KEY DATES
   */
  declarationDeadline: 'Roster Compliance Date (typically late February)',
  midseasonAdjustmentWindow: 'July 1 - Secondary Transfer Window close (typically August 21)',
};

// ============================================================================
// DESIGNATED PLAYERS (DPs)
// ============================================================================

export const designatedPlayerRules = {
  /**
   * DEFINITION
   * A Designated Player is any player whose total compensation and/or acquisition cost
   * exceeds the Maximum Salary Budget Charge.
   * The club pays the excess above the maximum charge out-of-pocket.
   */
  definition: 'Player whose compensation exceeds the Maximum Salary Budget Charge',

  /**
   * BUDGET CHARGE
   * DPs count against the salary budget at the Maximum Salary Budget Charge,
   * NOT their actual salary.
   */
  budgetCharge: 743_750, // 2025

  /**
   * YOUNG DESIGNATED PLAYER
   * Players 23 and under at time of signing may qualify for reduced budget charge
   * Young DP Charge: Approximately $200,000 (varies by year)
   */
  youngDP: {
    maxAge: 23,
    reducedBudgetCharge: 200_000,
  },

  /**
   * DP BUYOUT RULE (2025+)
   * Clubs may waive (buyout) up to TWO guaranteed contracts per year,
   * including Designated Player contracts.
   */
  maxBuyoutsPerYear: 2,
};

// ============================================================================
// U22 INITIATIVE
// ============================================================================

export const u22InitiativeRules = {
  /**
   * DEFINITION
   * U22 Initiative slots are for young players (22 or younger at signing)
   * who can remain in the program through age 25 under certain conditions.
   */
  maxAgeAtSigning: 22,
  maxAgeToRemain: 25,

  /**
   * BUDGET CHARGE
   * U22 players count at a reduced budget charge compared to regular senior players
   * Typically around $200,000-$250,000 depending on salary tier
   */
  budgetCharge: {
    tier1: 200_000, // Lower salary U22 players
    tier2: 250_000, // Higher salary U22 players
  },

  /**
   * SALARY LIMITS
   * U22 players must earn below certain thresholds to qualify
   * Cannot exceed DP threshold
   */
  maxSalary: 612_500, // Below DP threshold

  /**
   * HOMEGROWN U22
   * Homegrown players may have extended eligibility in U22 slots
   */
  homegrownExtendedEligibility: true,
};

// ============================================================================
// ALLOCATION MONEY
// ============================================================================

export const allocationMoney = {
  /**
   * TARGETED ALLOCATION MONEY (TAM)
   * Used to sign players who would otherwise be Designated Players
   * Can "buy down" a player's budget charge to keep them off DP slot
   */
  TAM: {
    annualAllocation2025: 2_317_500,
    maxBuydownPerPlayer: 1_612_500, // Max TAM that can be applied to one player
    canBuyDownDP: true,
    tradeable: true,
    description: 'Used to sign or retain players who earn above max budget charge without using DP slot',
  },

  /**
   * GENERAL ALLOCATION MONEY (GAM)
   * More flexible than TAM, can be used for various roster moves
   * Base allocation plus potential bonus from Model B choice
   */
  GAM: {
    annualAllocation2025: 1_825_000,
    additionalFromModelB: 2_000_000,
    tradeable: true,
    description: 'Flexible allocation money for roster building, trades, and salary buydowns',
  },
};

// ============================================================================
// INTERNATIONAL PLAYERS
// ============================================================================

export const internationalSlots = {
  /**
   * DEFAULT INTERNATIONAL SLOTS
   * Each club starts with 8 international roster slots
   * Slots are TRADEABLE between clubs
   */
  defaultSlots: 8,
  tradeable: true,

  /**
   * DOMESTIC PLAYER DEFINITION (US-based clubs)
   * - U.S. citizens
   * - Permanent residents (green card holders)
   * - Refugees/asylees meeting requirements
   * - Players qualifying under Homegrown International Rule
   *   (academy players who arrived in US before age 18 and trained for required period)
   */
  domesticDefinition: [
    'U.S. citizen',
    'Permanent resident (green card)',
    'Refugee/asylee meeting requirements',
    'Homegrown International Rule qualifier',
  ],

  /**
   * HOMEGROWN INTERNATIONAL RULE
   * A player can be considered domestic if:
   * - Arrived in the U.S. before age 18
   * - Trained in club's academy for required period (typically 2+ years)
   */
  homegrownInternationalRule: {
    maxAgeAtArrival: 18,
    minAcademyYears: 2,
  },
};

// ============================================================================
// HOMEGROWN PLAYERS
// ============================================================================

export const homegrownRules = {
  /**
   * HOMEGROWN PLAYER
   * Player who developed in the club's youth development system
   * Special roster and salary cap treatment
   */
  definition: 'Player developed in club youth academy system',

  /**
   * OFF-ROSTER HOMEGROWN PLAYERS (2025 rules)
   * - Must be 21 years old or younger during the calendar year
   * - May appear in up to 6 MLS regular season matches via Short-Term Agreement
   * - Unlimited appearances in Cup/Leagues Cup/CCL competitions
   * - Once promoted to senior roster, CANNOT return to off-roster status
   */
  offRoster: {
    maxAge: 21,
    maxLeagueMatches: 6,
    cupMatchesUnlimited: true,
    canRevertToOffRoster: false,
  },

  /**
   * BENEFITS
   * - Do not count against international slots
   * - Reduced budget charges in some cases
   * - Extended U22 eligibility
   */
  benefits: [
    'No international slot required',
    'Potential reduced budget charges',
    'Extended U22 initiative eligibility',
  ],
};

// ============================================================================
// FREE AGENCY
// ============================================================================

export const freeAgencyRules = {
  /**
   * FREE AGENCY ELIGIBILITY
   * Players who meet requirements can negotiate with any MLS club
   */

  /**
   * PRIOR RULES (through 2025)
   * - 24 years old
   * - 5+ years of MLS service
   */
  priorRules: {
    minAge: 24,
    minServiceYears: 5,
  },

  /**
   * NEW RULES (starting 2026)
   * - 24 years old
   * - 4+ years of MLS service (reduced from 5)
   */
  newRules2026: {
    minAge: 24,
    minServiceYears: 4,
    effectiveDate: 'January 1, 2026',
  },

  /**
   * RE-ENTRY DRAFT
   * Players not meeting free agency requirements but out of contract
   * go through Re-Entry Draft process
   */
  reEntryDraft: {
    stage1: 'Original club has exclusive negotiating rights',
    stage2: 'Other clubs can select and negotiate',
  },
};

// ============================================================================
// TRADES & TRANSFERS
// ============================================================================

export const tradeRules = {
  /**
   * CASH FOR PLAYER TRADES (2025+)
   * New rule allowing pure cash transactions
   */
  cashForPlayer: {
    maxPlayersAcquired: 2, // Per season
    maxPlayersTraded: 2, // Per season
    cashAmountUnlimited: true,
    description: 'Clubs may use unlimited out-of-pocket cash for up to 2 player acquisitions and 2 trades per season',
  },

  /**
   * ALLOCATION MONEY TRADES
   * TAM and GAM can be traded between clubs
   */
  allocationMoneyTradeable: true,

  /**
   * INTERNATIONAL SLOT TRADES
   * International roster slots can be traded between clubs
   */
  internationalSlotsTradeable: true,
};

// ============================================================================
// KEY DATES (2025 SEASON EXAMPLE)
// ============================================================================

export const keyDates2025 = {
  rosterComplianceDate: '2025-02-21',
  primaryTransferWindowOpen: '2025-02-14',
  primaryTransferWindowClose: '2025-05-07',
  secondaryTransferWindowOpen: '2025-07-07',
  secondaryTransferWindowClose: '2025-08-06',
  tradeDeadline: '2025-08-06',
  rosterFreezeDate: '2025-09-12',
  midseasonModelSwitchWindow: {
    start: '2025-07-01',
    end: '2025-08-21',
  },
};

// ============================================================================
// INJURED LIST & ROSTER RELIEF
// ============================================================================

export const injuredListRules = {
  /**
   * SEASON-ENDING INJURY LIST
   * Players out 6+ league games can be placed on Injured List
   */
  minGamesOut: 6,

  /**
   * ROSTER RELIEF
   * Club gets the roster slot back (can sign replacement)
   * BUT: No salary budget relief (injured player still counts against cap)
   */
  rosterSlotRelief: true,
  salaryBudgetRelief: false,

  /**
   * EXTREME HARDSHIP
   * In exceptional cases, league may grant salary budget relief
   */
  extremeHardshipException: true,
};

// ============================================================================
// GENERATION ADIDAS
// ============================================================================

export const generationAdidasRules = {
  /**
   * GENERATION ADIDAS PROGRAM
   * MLS signs young college players to league contracts
   * Special roster and salary treatment
   */
  definition: 'Young players signed directly by MLS from college or abroad',
  
  /**
   * ROSTER BENEFITS
   * - Do not count against senior roster slots
   * - Can occupy supplemental roster slots
   * - Reduced or waived budget charges (typically 2-4 years)
   */
  rosterBenefits: [
    'Do not count against senior roster (slots 1-20)',
    'Can occupy supplemental roster slots',
    'Budget charge often waived or reduced',
  ],
};

// ============================================================================
// SUMMARY: AUSTIN FC 2025 RULES QUICK REFERENCE
// ============================================================================

export const austinFC2025QuickReference = {
  salaryBudget: '$5,950,000',
  maxBudgetCharge: '$743,750 (becomes DP above this)',
  dpSlots: '3 max (Model A) or 2 max (Model B)',
  u22Slots: '3 max (Model A) or 4 max (Model B)',
  maxRoster: '30 players total',
  seniorRoster: '20 players max (count against budget)',
  supplementalRoster: '10 players max (do NOT count against budget)',
  internationalSlots: '8 default (tradeable)',
  TAM: '$2,317,500 annually',
  GAM: '$1,825,000 base + $2M if Model B',
  freeAgency2026: '24 years old + 4 years service',
};

// ============================================================================
// HELPER FUNCTIONS FOR AI TOOLS
// ============================================================================

/**
 * Check if a player qualifies as a Designated Player
 */
export function isDesignatedPlayer(salary: number, year: 2025 | 2026 = 2025): boolean {
  const maxCharge = salaryBudget2025.maxBudgetCharge[year];
  return salary > maxCharge;
}

/**
 * Calculate budget charge for a player
 */
export function calculateBudgetCharge(
  salary: number,
  designation: 'DP' | 'YoungDP' | 'U22' | 'TAM' | 'Senior',
  year: 2025 | 2026 = 2025
): number {
  const maxCharge = salaryBudget2025.maxBudgetCharge[year];

  switch (designation) {
    case 'DP':
      return maxCharge;
    case 'YoungDP':
      return designatedPlayerRules.youngDP.reducedBudgetCharge;
    case 'U22':
      return u22InitiativeRules.budgetCharge.tier1;
    case 'TAM':
      // TAM player: salary minus TAM applied, capped at max charge
      return Math.min(salary, maxCharge);
    case 'Senior':
    default:
      return Math.min(salary, maxCharge);
  }
}

/**
 * Check if player is eligible for U22 Initiative
 */
export function isU22Eligible(age: number, salary: number): { eligible: boolean; reason: string } {
  if (age > u22InitiativeRules.maxAgeAtSigning) {
    return { eligible: false, reason: `Player is ${age}, must be ${u22InitiativeRules.maxAgeAtSigning} or younger at signing` };
  }
  if (salary > u22InitiativeRules.maxSalary) {
    return { eligible: false, reason: `Salary $${salary.toLocaleString()} exceeds U22 max of $${u22InitiativeRules.maxSalary.toLocaleString()}` };
  }
  return { eligible: true, reason: 'Player qualifies for U22 Initiative' };
}

/**
 * Check free agency eligibility
 */
export function checkFreeAgencyEligibility(
  age: number,
  yearsOfService: number,
  year: 2025 | 2026 = 2025
): { eligible: boolean; reason: string } {
  const rules = year >= 2026 ? freeAgencyRules.newRules2026 : freeAgencyRules.priorRules;
  
  if (age < rules.minAge) {
    return { eligible: false, reason: `Player is ${age}, must be ${rules.minAge} or older` };
  }
  if (yearsOfService < rules.minServiceYears) {
    return { eligible: false, reason: `Player has ${yearsOfService} years service, needs ${rules.minServiceYears}` };
  }
  return { eligible: true, reason: 'Player qualifies for MLS Free Agency' };
}

/**
 * Get all rules as a formatted string for AI context
 */
export function getRulesContext(): string {
  return `
MLS ROSTER RULES (2025-2026 Season)

SALARY BUDGET: $5,950,000 (2025)
Maximum Budget Charge: $743,750 (2025), $803,125 (2026)
Players earning above max charge = Designated Player

ROSTER COMPOSITION:
- Maximum 30 players total
- Senior Roster (slots 1-20): Count against salary budget
- Supplemental Roster (slots 21-30): Do NOT count against budget

ROSTER CONSTRUCTION MODELS (choose one):
Model A: 3 DPs + 3 U22 Initiative
Model B: 2 DPs + 4 U22 Initiative + $2M extra GAM

DESIGNATED PLAYERS:
- Salary exceeds $743,750 = DP
- Count at max budget charge ($743,750)
- Young DP (≤23): Reduced charge ~$200,000
- Max buyouts: 2 per year

U22 INITIATIVE:
- Must be 22 or younger at signing
- Can stay through age 25
- Budget charge: $200,000-$250,000
- Max salary: $612,500

ALLOCATION MONEY:
TAM: $2,317,500 annually (buy down salaries)
GAM: $1,825,000 base (+$2M if Model B)
Both are tradeable

INTERNATIONAL SLOTS:
- 8 default per club
- Tradeable between clubs

FREE AGENCY (2026+):
- Age 24+ with 4+ years MLS service
- (Changed from 5 years to 4 years in 2026)

HOMEGROWN PLAYERS:
- No international slot required
- Off-roster homegrowns (≤21): Up to 6 league matches

CASH FOR PLAYER TRADES (2025+):
- Max 2 players acquired via cash per season
- Max 2 players traded via cash per season
`.trim();
}

