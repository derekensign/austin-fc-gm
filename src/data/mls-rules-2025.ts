/**
 * MLS ROSTER RULES & CBA PROVISIONS (2025-2026)
 * 
 * PRIMARY SOURCES:
 * 1. MLS-MLSPA Collective Bargaining Agreement (2020-2028)
 *    Full PDF: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
 *    Duration: February 1, 2020 – January 31, 2028
 * 
 * 2. MLS Official Roster Rules (updated annually)
 *    https://www.mlssoccer.com/about/roster-rules-and-regulations
 * 
 * 3. MLS 2025 GAM Publication
 *    https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
 * 
 * 4. Armchair Analyst GAM Tracking (Matthew Doyle)
 *    https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam
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
   * Source: https://www.mlssoccer.com/about/roster-rules-and-regulations
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
   * 2025: $104,000 (updated from official MLS rules Feb 2025)
   */
  seniorMinimumSalary: 104_000,

  /**
   * RESERVE MINIMUM SALARY
   * Minimum salary for reserve/supplemental players (slots 25-30)
   * Must be 24 years or younger during the League Year
   * 2025: $80,622 (updated from official MLS rules Feb 2025)
   */
  reserveMinimumSalary: 80_622,
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
    annualAllocation2025: 2_225_000, // Updated per North End data
    /**
     * TAM SALARY PARAMETERS (2025)
     * Source: https://www.mlssoccer.com/about/roster-rules-and-regulations
     * - Player must earn > $743,750 to qualify for TAM
     * - Compensation ceiling for TAM-eligible players: $1,743,750
     * - Cannot buy down below $150,000 using TAM
     */
    minSalaryToQualify: 743_750,
    maxCompensationCeiling: 1_743_750,
    minBuydownFloor: 150_000,
    canBuyDownDP: true,
    tradeable: false, // TAM cannot be traded per official rules
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
// OUTGOING TRANSFER FEE → GAM CONVERSION
// Source: MLS Roster Rules - "Allocation Money from Permanent Transfers Abroad"
// ============================================================================

export const outgoingTransferGAMRules = {
  /**
   * WHEN A PLAYER IS SOLD ABROAD (International Transfer Out)
   * MLS clubs can convert a portion of the net transfer fee into GAM!
   * This is a major source of GAM for clubs with valuable players.
   */
  
  /**
   * BASIC RULE (2025)
   * Clubs receive GAM equal to a percentage of the "Net Transfer Revenue"
   * Net Transfer Revenue = Gross Fee - Agent Fees - Solidarity/Training Comp - MLS Fees
   */
  netTransferRevenue: {
    description: 'Gross fee minus agent fees, solidarity/training compensation, and MLS administrative fees',
    mlsAdminFee: 0.05, // MLS typically takes ~5% admin fee
  },

  /**
   * GAM CONVERSION FORMULA (2024-2025)
   * Clubs receive GAM based on tiers:
   * 
   * Tier 1: First $1M of net revenue → 50% converted to GAM
   * Tier 2: $1M-$3M of net revenue → 40% converted to GAM
   * Tier 3: $3M+ of net revenue → 25% converted to GAM
   * 
   * Example: $5M net transfer fee
   * - First $1M: $500K GAM (50%)
   * - Next $2M: $800K GAM (40%)
   * - Final $2M: $500K GAM (25%)
   * - Total: $1.8M GAM
   */
  conversionTiers2025: [
    { upTo: 1_000_000, percentage: 0.50, description: 'First $1M → 50% to GAM' },
    { upTo: 3_000_000, percentage: 0.40, description: '$1M-$3M → 40% to GAM' },
    { upTo: Infinity, percentage: 0.25, description: '$3M+ → 25% to GAM' },
  ],

  /**
   * HOMEGROWN PLAYER BONUS
   * If the sold player was a Homegrown Player, club receives ADDITIONAL GAM
   * Typically 10-25% bonus on top of standard conversion
   */
  homegrownBonus: {
    applicable: true,
    bonusPercentage: 0.15, // ~15% additional GAM for homegrown sales
    description: 'Additional GAM bonus for selling homegrown players abroad',
  },

  /**
   * YOUNG PLAYER BONUS
   * Additional GAM for selling players under 23 (promotes development)
   */
  youngPlayerBonus: {
    maxAge: 23,
    bonusPercentage: 0.10, // ~10% additional for young player sales
  },

  /**
   * CAPS AND LIMITS
   * Source: https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
   */
  caps: {
    maxGAMPerSale: 3_000_000, // Max GAM from eligible transfer revenue (per MLS 2025 publication)
    minFeeForConversion: 100_000, // Minimum fee to qualify for GAM conversion
    conditionalGAM: true, // Sell-on clauses and add-ons can generate additional GAM later
  },

  /**
   * TIMING
   * GAM is credited when the transfer is finalized and registered
   * Conditional/add-on GAM credited when conditions are met
   */
  timing: {
    immediate: 'GAM credited upon transfer registration',
    conditional: 'Add-on GAM credited when performance conditions met',
  },

  /**
   * EXAMPLE: Osman Bukari Sale (2025)
   * Transfermarkt: €5.50M (~$6.4M) to Widzew Lodz
   * 
   * Estimated GAM calculation:
   * - Gross: ~$6,400,000
   * - Less MLS fee (~5%): -$320,000
   * - Less agent/misc (~10%): -$640,000
   * - Net revenue: ~$5,440,000
   * 
   * GAM Conversion:
   * - First $1M: $500,000 (50%)
   * - $1M-$3M: $800,000 (40%)
   * - $3M-$5.44M: $610,000 (25%)
   * - Total GAM: ~$1,910,000
   * 
   * This is SIGNIFICANT and should be tracked!
   */
};

/**
 * Calculate estimated GAM from an outgoing international transfer
 * @param grossFee - The gross transfer fee in USD
 * @param isHomegrown - Whether the player was a homegrown
 * @param age - Player's age at time of transfer
 * @returns Estimated GAM amount
 * 
 * Source: MLS rules on "eligible transfer revenue converted to GAM"
 * Max: $3,000,000 per MLS 2025 publication
 */
export function calculateOutgoingTransferGAM(
  grossFee: number,
  isHomegrown: boolean = false,
  age: number = 25
): { netRevenue: number; baseGAM: number; bonusGAM: number; totalGAM: number } {
  // Calculate net revenue
  const mlsFee = grossFee * 0.05;
  const agentFee = grossFee * 0.10;
  const netRevenue = grossFee - mlsFee - agentFee;
  
  // Calculate base GAM using tiers
  let baseGAM = 0;
  let remaining = netRevenue;
  
  // Tier 1: First $1M at 50%
  const tier1 = Math.min(remaining, 1_000_000);
  baseGAM += tier1 * 0.50;
  remaining -= tier1;
  
  // Tier 2: $1M-$3M at 40%
  const tier2 = Math.min(remaining, 2_000_000);
  baseGAM += tier2 * 0.40;
  remaining -= tier2;
  
  // Tier 3: $3M+ at 25%
  baseGAM += remaining * 0.25;
  
  // Calculate bonuses
  let bonusGAM = 0;
  if (isHomegrown) {
    bonusGAM += baseGAM * 0.15;
  }
  if (age < 23) {
    bonusGAM += baseGAM * 0.10;
  }
  
  // Apply cap - $3M max per MLS 2025 publication
  const totalGAM = Math.min(baseGAM + bonusGAM, 3_000_000);
  
  return { netRevenue, baseGAM, bonusGAM, totalGAM };
}

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
// FREE AGENCY (CBA Article 29, Section 29.4-29.6)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const freeAgencyRules = {
  /**
   * FREE AGENCY ELIGIBILITY (CBA Section 29.4)
   * Players who meet requirements can negotiate with any MLS club
   */
  cbaReference: 'Article 29, Section 29.4',
  
  /**
   * CURRENT RULES (2025+)
   * Per CBA: "24 years old and has completed at least 4 MLS seasons"
   */
  currentRules: {
    minAge: 24,
    minServiceYears: 4,  // Reduced from 5 in 2023 CBA amendment
  },

  /**
   * FREE AGENCY SALARY BUDGET CHARGE (FASBC)
   * Per CBA Section 29.4(iii): Used to determine compensation limits
   * 
   * FASBC includes:
   * 1. Annualized base salary from prior season
   * 2. Housing and car allowance
   * 3. Additional compensation (signing bonus, loyalty bonus, roster bonus)
   * 4. Marketing bonus (footwear/gloves)
   * 5. Agent fees
   */
  fasbcComponents: [
    'Annualized base salary',
    'Housing and car allowance',
    'Signing/loyalty/roster bonuses',
    'Marketing bonuses',
    'Agent fees',
  ],

  /**
   * CONTRACT TERMS FOR FREE AGENTS (CBA Section 29.5(iv))
   * Allowed contract structures:
   */
  allowedContractTerms: [
    '1 year guaranteed + 1 option year',
    '1 year guaranteed + 2 option years',
    '2 years guaranteed + 1 option year',
    '2 years guaranteed + 2 option years',
    '3 years guaranteed + 1 option year',
    '3 years guaranteed + 2 option years',
    '2 years guaranteed, no options (if player is 30+)',
  ],

  /**
   * COMPENSATORY ALLOCATION (CBA Section 29.5(ii))
   * Teams losing players to free agency receive compensation
   */
  compensatoryAllocation: {
    amountPerNetPlayerLoss: 50_000,
    condition: 'Team must have made bona fide offer (≥105% of prior salary)',
    timing: 'Paid at end of subsequent season',
  },

  /**
   * LIMITATIONS (CBA Section 29.5)
   */
  limitations: {
    noLimitOnSignings: true,  // No cap on how many FAs a team can sign
    noRenegotiationUntil: 'After subsequent Roster Freeze Date',
    noTradeUntil: 'After subsequent League Season (if re-signed above FA limit)',
  },

  /**
   * RE-ENTRY DRAFT (CBA Exhibit 13)
   * For out-of-contract players not eligible for free agency
   */
  reEntryDraft: {
    cbaReference: 'Exhibit 13',
    stage1: 'Original club has exclusive negotiating rights',
    stage2: 'Other clubs can select and negotiate',
    timingVsMLS: 'Completed ≤12 days after MLS Cup',
  },
};

// ============================================================================
// CBA KEY DEFINITIONS (Article 2)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const cbaDefinitions = {
  /**
   * DESIGNATED PLAYER (CBA Section 2(q))
   * A player whose:
   * (i) unadjusted Salary Budget Charge is above the Maximum Salary Budget Charge
   * (ii) occupies or should occupy a Designated Player slot
   * (iii) player expenditure is not funded by Salary Budget or GAM/TAM
   *       and is reimbursed to the League by an MLS Team Operator
   */
  designatedPlayer: {
    definition: 'Player whose unadjusted Salary Budget Charge exceeds Maximum Salary Budget Charge',
    slotRequired: true,
    expenditureReimbursedByOwner: true,
    cbaReference: 'Article 2(q)',
  },

  /**
   * AFFILIATE (CBA Section 2(b))
   * (i) USL teams with MLS-recognized affiliation
   * (ii) Teams in MLS-affiliated professional leagues (including MLS NEXT Pro)
   */
  affiliate: {
    types: ['USL affiliate teams', 'MLS NEXT Pro teams'],
    cbaReference: 'Article 2(b)',
  },

  /**
   * CONTRACT GUARANTEE DATE (CBA Section 2(o))
   * Date on or after which a Semi-Guaranteed Contract may not be terminated
   * Default: July 1st
   * Can be extended up to 7 days after secondary transfer window close
   */
  contractGuaranteeDate: {
    default: 'July 1st',
    maxExtension: '7 days after secondary transfer window close',
    noticeRequired: '5 days prior to Contract Guarantee Date',
    cbaReference: 'Article 2(o)',
  },

  /**
   * 22+1 PLAYER (CBA Section 29.2-29.3)
   * Reference to U22 Initiative players
   */
  u22Player: {
    cbaReference: 'Article 29.2-29.3',
  },
};

// ============================================================================
// CBA CONTRACT PROVISIONS (Article 18)
// ============================================================================

export const cbaContractProvisions = {
  /**
   * STANDARD PLAYER AGREEMENT (SPA)
   * All MLS player contracts must use the league-approved SPA template
   */
  standardPlayerAgreement: {
    required: true,
    cbaReference: 'Article 18, Exhibit 1',
  },

  /**
   * SEMI-GUARANTEED CONTRACTS (CBA Section 18.7)
   * May be terminated before Contract Guarantee Date under certain conditions
   */
  semiGuaranteedContracts: {
    canTerminateBefore: 'Contract Guarantee Date',
    cbaReference: 'Article 18.7',
  },

  /**
   * CONTRACT TERMS - STANDARD OPTIONS
   * Maximum contract length and option structures
   */
  contractOptions: {
    maxGuaranteedYears: 5,
    maxOptionYears: 2,
    optionMustBeExercisedBy: 'November 30',
    cbaReference: 'Article 18',
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
// TRANSFER FEES & ACQUISITION COSTS
// ============================================================================

export const transferFeeRules = {
  /**
   * CRITICAL: Transfer fees DO count against salary budget!
   * But ONLY as AMORTIZED annual acquisition costs.
   * 
   * Formula: Annual Budget Charge = Base Salary + Amortized Transfer Fee + Bonuses
   * Amortization: Transfer Fee ÷ Guaranteed Contract Years
   * 
   * Example:
   * - Transfer fee: $4,000,000
   * - Contract: 4 years guaranteed
   * - Amortized annual fee: $1,000,000
   * - If salary is $600K → Budget charge is $1.6M (before buydowns)
   */
  countsAgainstSalaryCap: true, // YES - as amortized cost!
  amortizationMethod: 'Transfer Fee ÷ Guaranteed Contract Years',

  /**
   * EXEMPTIONS - Where transfer fees DON'T add to cap
   */
  exemptions: {
    /**
     * DESIGNATED PLAYERS
     * Transfer fee is COMPLETELY IGNORED for cap math.
     * Budget charge is capped at ~$743,750 (2025) regardless of fee.
     */
    designatedPlayers: {
      transferFeeCountsAgainstCap: false,
      budgetChargeCapped: true,
      reason: 'DP status shields any transfer fee from cap calculation',
    },

    /**
     * U22 INITIATIVE PLAYERS
     * Transfer fees can be massive but budget charge is FIXED at $150K-$200K.
     * This is why U22 slots are incredibly valuable.
     */
    u22Initiative: {
      transferFeeCountsAgainstCap: false,
      budgetChargeFixed: true,
      fixedCharge: { min: 150_000, max: 200_000 },
      reason: 'U22 status provides fixed low budget charge regardless of acquisition cost',
    },
  },

  /**
   * NON-EXEMPT PLAYERS (The Danger Zone!)
   * For senior roster players who are NOT DP and NOT U22:
   * - Salary + Amortized Transfer Fee MUST be ≤ max budget charge
   * - OR must be bought down with GAM/TAM
   * 
   * This is how teams accidentally blow up their cap!
   */
  nonExemptPlayers: {
    transferFeeCountsAgainstCap: true,
    mustBeBoughtDown: true,
    formula: 'Base Salary + (Transfer Fee ÷ Contract Years) = Budget Charge',
    gamTamCanBuyDown: true,
    note: 'GAM/TAM can buy down EITHER salary OR amortized fee - MLS treats it all as budget charge',
  },

  /**
   * MLSPA DATA LIMITATION
   * MLSPA reports: Base Salary, Guaranteed Compensation
   * MLSPA does NOT include: Transfer fees, Loan fees, Signing bonus amortization
   * 
   * Therefore: MLSPA salaries alone UNDERSTATE true budget charges
   * unless you manually add acquisition amortization!
   */
  mlspaDataLimitation: {
    includesSalary: true,
    includesGuaranteedComp: true,
    includesTransferFees: false,
    includesLoanFees: false,
    includesSigningBonusAmortization: false,
    warning: 'MLSPA data alone will UNDERSTATE true budget charges for players with transfer fees',
  },

  /**
   * PAYMENT METHODS (How fees are paid, not how they count)
   */
  paymentMethods: {
    cash: {
      description: 'Direct cash payment to selling club',
      example: 'Austin FC paid $1.5M cash to Minnesota for Rosales',
    },
    gam: {
      description: 'General Allocation Money to another MLS club',
      example: 'Austin FC paid $700K 2026 GAM + $550K 2027 GAM to Vancouver for Nelson',
      note: 'GAM used to PAY for player is different from GAM used to BUY DOWN cap charge',
    },
    combination: {
      description: 'Mix of cash, GAM, players, draft picks, and/or future considerations',
    },
  },

  /**
   * INTERNATIONAL TRANSFER FEES
   * Additional fees may apply for international transfers
   */
  internationalTransfers: {
    solidarityPayments: 'May be required for players developed at other clubs',
    trainingCompensation: 'May be required for young players',
    mlsHandlesDistribution: true,
    note: 'These fees are also amortized and count against cap for non-exempt players',
  },
};

// ============================================================================
// TRANSFER WINDOWS (2025)
// Source: https://www.mlssoccer.com/about/roster-rules-and-regulations
// ============================================================================

export const transferWindows2025 = {
  /**
   * PRIMARY TRANSFER WINDOW
   * Main window for international transfers and MLS trades
   */
  primary: {
    start: '2025-01-31',
    end: '2025-04-23',
    description: 'Main window for international signings and MLS trades',
  },

  /**
   * SECONDARY TRANSFER WINDOW
   * Mid-season window with limited activity
   */
  secondary: {
    start: '2025-07-24',
    end: '2025-08-21',
    description: 'Mid-season window for roster adjustments',
  },

  /**
   * ROSTER COMPLIANCE DATE
   * Deadline for clubs to be budget and roster compliant
   */
  rosterComplianceDate: {
    date: '2025-02-21',
    time: '8:00 PM ET',
    description: 'Clubs must be roster and budget compliant',
  },

  /**
   * ROSTER FREEZE DATE
   * Final roster submission deadline
   */
  rosterFreezeDate: {
    date: '2025-09-12',
    description: 'Final 30-man roster submitted, no changes until after MLS Cup',
  },
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
// LOAN RULES (CBA Article 15, Exhibit 11)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const loanRules = {
  cbaReference: 'Article 15, Exhibit 11',
  
  /**
   * SHORT-TERM LOANS (Within MLS season)
   * Source: CBA Exhibit 11
   */
  shortTermLoans: {
    /**
     * INTRA-MLS LOANS
     * Between two MLS clubs during the season
     */
    intraMLS: {
      minDuration: 14, // days
      maxDuration: 'Through trade deadline (roster freeze)',
      maxPlayersPerClub: 4, // At any one time per club
      salaryResponsibility: 'Can be split between clubs (negotiated)',
      budgetChargeRules: {
        sendingClub: 'Player counts against budget unless buying down',
        receivingClub: 'Loan fee can be bought down 100% with GAM',
        note: 'Clubs often negotiate salary splits in loan deals',
      },
      internationalSlot: 'Required at receiving club if player is international',
      rosterSlot: 'Required at receiving club',
      canRecall: true,
      recallTerms: 'As negotiated between clubs',
    },
    
    /**
     * LOANS TO AFFILIATES (USL/MLS NEXT Pro)
     * For player development
     */
    toAffiliate: {
      description: 'Loan to USL or MLS NEXT Pro affiliate team',
      maxPlayers: 'No limit',
      salaryPaidBy: 'MLS club (usually)',
      budgetCharge: 'Still counts against MLS club budget',
      canRecall: true,
      recallNotice: '24-48 hours typical',
      noLoanFee: true,
      playerAgreementRequired: true,
    },
  },
  
  /**
   * SEASON-LONG LOANS (Full MLS Season)
   */
  seasonLongLoans: {
    duration: 'Full MLS season',
    salaryOptions: [
      'Sending club pays full salary',
      'Receiving club pays full salary', 
      'Split between clubs',
    ],
    budgetCharge: 'Charged to club paying salary',
    internationalLoan: {
      toMLS: 'International slot required at receiving MLS club',
      fromMLS: 'No international slot freed (player still on MLS roster)',
      fifaRules: 'Must comply with FIFA loan regulations',
    },
  },
  
  /**
   * INTERNATIONAL LOANS (To/From non-MLS clubs)
   * Source: CBA Article 15 + FIFA Regulations
   */
  internationalLoans: {
    /**
     * LOANS FROM MLS TO FOREIGN CLUBS
     */
    outgoingInternational: {
      allowed: true,
      transferWindowRequired: true, // Must be during MLS transfer window
      fifaITC: true, // International Transfer Certificate required
      salaryOptions: [
        'MLS club continues paying',
        'Foreign club pays salary',
        'Split salary',
      ],
      budgetRelief: 'If foreign club pays 100% salary, MLS club gets budget relief',
      recallRights: 'Can be negotiated (buyout clause typical)',
      loanFee: 'Can be received from foreign club',
      developmentBenefit: 'Common for young players to get playing time abroad',
    },
    
    /**
     * LOANS TO MLS FROM FOREIGN CLUBS
     */
    incomingInternational: {
      allowed: true,
      transferWindowRequired: true,
      fifaITC: true,
      internationalSlot: 'Required unless player has green card/citizenship',
      budgetCharge: {
        loanFee: 'Amortized over loan duration, counts against budget',
        salary: 'Full salary counts against budget (unless DP/U22)',
        buydownWithGAM: 'Loan fee can be bought down 100% with GAM',
      },
      commonStructure: 'Loan with option to buy',
      optionToBuy: {
        allowed: true,
        structure: 'Typically a fixed fee at end of loan',
        obligationToBuy: 'Also possible (higher loan fee usually)',
      },
    },
  },
  
  /**
   * MLS NEXT PRO ROSTER RULES (2025+)
   * Source: MLS NEXT Pro Competition Rules
   */
  mlsNextPro: {
    eligibility: {
      anyMLSRosterPlayer: true, // Any player on 30-man roster can play
      ageLimits: 'None for MLS players',
      matchdayRoster: 20, // Max for MLS NEXT Pro matches
      startersMax: 11,
    },
    seniorMinutesRule: {
      description: 'U22 and development players may have minimum MLS NEXT Pro minutes',
      purpose: 'Ensure young players get playing time',
    },
    competitionSchedule: {
      parallelToMLS: true,
      midweekMatches: 'Common',
      noFIFAWindows: 'Continues during international breaks',
    },
    pathwayToFirstTeam: {
      description: 'Players can be called up at any time',
      noTransferRequired: true,
      sameClubSystem: true,
    },
  },
  
  /**
   * LOAN ARMY TRACKING
   * Players loaned out from Austin FC
   */
  loanConsiderations: {
    developmentBenefit: 'Young players get consistent minutes',
    salaryCapBenefit: 'Can get budget relief if foreign club pays salary',
    riskFactors: [
      'Injury risk while on loan',
      'Player form may change',
      'May not want to return',
    ],
    commonScenarios: [
      'Young HG to MLS NEXT Pro for development',
      'Fringe senior player to USL for minutes',
      'International prospect to foreign club before full commitment',
    ],
  },
};

// ============================================================================
// CONTRACT BUYOUTS & WAIVERS (CBA Article 18.4, 18.8)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const contractBuyoutRules = {
  cbaReference: 'Article 18.4, 18.8',
  
  /**
   * CONTRACT BUYOUT (2025+ Rule Change)
   * Clubs may now buy out guaranteed contracts
   */
  buyouts: {
    maxPerYear: 2, // Per club, per year
    eligibleContracts: [
      'Guaranteed contracts',
      'Semi-guaranteed contracts (after guarantee date)',
      'Designated Player contracts',
      'TAM player contracts',
    ],
    buyoutAmount: {
      calculation: 'Remaining guaranteed compensation',
      includes: [
        'Base salary for remaining years',
        'Guaranteed bonuses',
        'Housing/car allowances',
      ],
      excludes: [
        'Performance bonuses (unearned)',
        'Option years',
      ],
    },
    capImplications: {
      budgetRelief: 'Immediate - player no longer counts against cap',
      gamTamRelief: 'Any GAM/TAM spent on player is "lost"',
      dpSlotFreed: 'If buying out DP, slot becomes available',
    },
    playerStatus: {
      becomesUnattached: true,
      canSignElsewhere: true,
      mlsRestrictions: 'May have waiver claim period before re-signing in MLS',
    },
    timing: {
      anytime: true,
      commonWindows: [
        'End of season (roster cleanup)',
        'Before roster compliance date',
        'During transfer windows',
      ],
    },
    example: `
      Austin FC wants to buyout a player earning $1.2M with 2 years left.
      Buyout cost: ~$2.4M (paid by club, not against cap)
      Cap benefit: Immediately frees $700K+ in budget charge
      Best used for: High-salary underperformers or players wanting out
    `,
  },
  
  /**
   * WAIVERS (CBA Article 18.8)
   * Releasing players with waiver claim period
   */
  waivers: {
    definition: 'Process to release a player, giving other MLS clubs first rights',
    waiverPeriod: 48, // hours typically
    claimPriority: 'Worst record first (inverse standings order)',
    claimResponsibility: {
      salary: 'Claiming club assumes remaining contract',
      budgetCharge: 'Claiming club takes on budget charge',
      gamTamBuydown: 'Claiming club can apply own GAM/TAM',
    },
    ifUnclaimed: {
      playerBecomes: 'Out of contract / unattached',
      canSignAnywhere: true,
      mlsFreeAgent: 'Not true free agency - subject to allocation order if MLS',
    },
    cannotWaive: [
      'DP contracts (must buyout instead)',
      'Players within certain protected periods',
    ],
  },
  
  /**
   * SEMI-GUARANTEED CONTRACT TERMINATION
   * Before Contract Guarantee Date
   */
  semiGuaranteedTermination: {
    contractGuaranteeDate: 'July 1 (default) or later if specified',
    terminationBefore: {
      allowed: true,
      compensation: 'Only salary earned through termination date',
      noticeRequired: '5 days before Contract Guarantee Date',
    },
    terminationAfter: {
      allowed: false, // Contract becomes fully guaranteed
      mustBuyout: true,
    },
    commonUse: 'Preseason signings that don\'t work out',
  },
  
  /**
   * MUTUAL CONTRACT TERMINATION
   */
  mutualTermination: {
    description: 'Player and club agree to end contract early',
    requirements: [
      'Written agreement',
      'League approval',
      'Settlement of any owed compensation',
    ],
    playerBenefit: 'Can sign elsewhere immediately',
    clubBenefit: 'May negotiate reduced buyout amount',
    capImplication: 'Immediate budget relief upon termination',
  },
};

// ============================================================================
// DISCOVERY PLAYERS & PRIORITY (CBA Exhibit 9)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const discoveryPlayerRules = {
  cbaReference: 'Exhibit 9',
  
  /**
   * DISCOVERY PLAYER DEFINITION
   * Players identified and "discovered" by MLS clubs from outside the league
   */
  definition: {
    who: 'Any player not currently under MLS contract and not in allocation order',
    includes: [
      'Foreign players',
      'US players playing abroad',
      'Players whose MLS rights expired',
    ],
    excludes: [
      'Players in MLS allocation pools',
      'SuperDraft eligible players',
      'Homegrown territory players',
    ],
  },
  
  /**
   * DISCOVERY PRIORITY MECHANISM
   */
  discoveryPriority: {
    howItWorks: {
      step1: 'Club identifies target player and files Discovery claim with MLS',
      step2: 'MLS checks if player is already claimed by another club',
      step3: 'If unclaimed, club has exclusive negotiating rights (limited time)',
      step4: 'If claimed, clubs can trade for Discovery rights',
    },
    claimDuration: '30 days (typically, can vary)',
    maxClaimsPerClub: 7, // Active Discovery claims at any time
    exclusiveNegotiation: 'Only claiming club can negotiate with player during claim period',
  },
  
  /**
   * DISCOVERY PRIORITY TRADING
   */
  discoveryTrades: {
    canTrade: true,
    consideration: [
      'GAM',
      'Future Draft picks',
      'Other Discovery rights',
      'Cash (limited)',
    ],
    example: {
      description: 'Austin FC traded Discovery rights to Minnesota for GAM',
      player: 'Kervin Arriaga',
      received: '$50K GAM (2022) + $50K GAM (2023)',
    },
    strategicValue: 'Can file claims on players you don\'t intend to sign to trade rights',
  },
  
  /**
   * DISCOVERY LIST
   */
  discoveryList: {
    maintained: 'By MLS League Office',
    public: false, // Confidential to clubs
    updates: 'Real-time as claims filed/expired',
    disputes: 'League resolves conflicting claims',
  },
};

// ============================================================================
// RE-ENTRY DRAFT (CBA Exhibit 13)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const reEntryDraftRules = {
  cbaReference: 'Exhibit 13',
  
  /**
   * OVERVIEW
   * Mechanism for out-of-contract players who don't qualify for Free Agency
   */
  purpose: 'Allow clubs to acquire players whose contracts expired but who don\'t qualify for unrestricted free agency',
  
  timing: {
    when: 'Within 12 days after MLS Cup',
    year2025Example: 'Approximately December 18-19, 2025',
    format: 'Two stages over consecutive days',
  },
  
  /**
   * ELIGIBLE PLAYERS
   */
  eligibility: {
    mustMeet: [
      'Out of contract (option declined or expired)',
      'NOT eligible for Free Agency',
      'Not on Generation adidas or other special status',
    ],
    freeAgencyThreshold: {
      age: 24,
      serviceYears: 4, // As of 2026
      note: 'Players meeting both become Free Agents instead',
    },
  },
  
  /**
   * STAGE 1 - Original Club Rights
   */
  stage1: {
    description: 'Original club has first right to re-sign player',
    duration: '24 hours after stage opens',
    options: [
      'Re-sign player to new contract',
      'Decline rights (player moves to Stage 2)',
    ],
    salaryRules: {
      minimum: 'Must offer at least prior year salary',
      maximum: 'No maximum - club discretion',
    },
    ifSelected: 'Club and player have exclusive negotiating window',
    ifNotSelected: 'Player automatically enters Stage 2',
  },
  
  /**
   * STAGE 2 - Open Selection
   */
  stage2: {
    description: 'All clubs can select from remaining players',
    selectionOrder: 'Inverse order of previous season standings',
    rights: 'Selecting club gets exclusive negotiating rights',
    negotiationWindow: '7 days typically',
    salaryRules: {
      minimum: 'Prior year salary',
      maximum: 'No maximum',
    },
    ifNoAgreement: 'Player becomes unattached (can sign anywhere)',
  },
  
  /**
   * STRATEGIC CONSIDERATIONS
   */
  strategy: {
    forClubs: [
      'Can find value players on below-market deals',
      'Use to fill roster spots cheaply',
      'Target specific positions of need',
    ],
    forPlayers: [
      'May accept below-market to stay in MLS',
      'Alternative: sign abroad without MLS restrictions',
      'Can negotiate with selecting club terms',
    ],
    austinFCHistory: {
      acquired: ['Various depth signings'],
      lost: ['Players whose options declined'],
    },
  },
};

// ============================================================================
// EXPANSION DRAFT (CBA Exhibit 14)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const expansionDraftRules = {
  cbaReference: 'Exhibit 14',
  
  /**
   * OVERVIEW
   * When new MLS teams join, they can draft players from existing clubs
   */
  purpose: 'Allow expansion franchises to build initial roster from existing MLS players',
  
  timing: {
    when: 'After MLS Cup, before SuperDraft',
    frequency: 'Only when new teams join MLS',
    recent: [
      'San Diego FC (2025 season)',
      'St. Louis CITY SC (2023 season)',
      'Charlotte FC (2022 season)',
    ],
  },
  
  /**
   * PROTECTION RULES
   * Existing clubs protect players from selection
   */
  protections: {
    protectedListSize: 12, // Players protected from selection
    automaticallyProtected: [
      'Homegrown Players',
      'Generation adidas players (current year)',
      'Players on season-ending injury list',
      'Players loaned out with mandatory buyback',
    ],
    cannotProtect: [
      'Players in final option year (if option declined)',
    ],
    submissionDeadline: '24-48 hours before draft',
  },
  
  /**
   * SELECTION RULES
   */
  selectionRules: {
    selectionsPerExpansionTeam: 5, // Typically
    maxFromOneClub: 1, // Per existing club
    compensationToLosingClub: {
      gamAmount: 50_000, // For each player selected
      additionalConsideration: 'May receive future draft picks',
    },
    selectedPlayerContract: 'Expansion team assumes existing contract',
  },
  
  /**
   * SALARY & CAP IMPLICATIONS
   */
  capImplications: {
    expansionTeam: {
      assumesContract: true,
      budgetCharge: 'Full contract value counts',
      canUseGAMTAM: 'To buy down immediately',
    },
    losingClub: {
      capRelief: 'Immediate - player removed from roster',
      gamCompensation: 'Received from league',
    },
  },
  
  /**
   * AUSTIN FC HISTORY
   * Austin FC joined MLS in 2021
   */
  austinFCExpansionDraft: {
    year: 2020, // Draft held in December 2020
    playersSelected: [
      'Kekuta Manneh',
      'Jhohan Romaña',
      'Ben Sweat',
      'Ulises Segura',
      'Joe Corona',
    ],
    strategy: 'Mix of experience and potential',
    outcome: 'Most didn\'t make long-term roster impact',
  },
};

// ============================================================================
// INJURED LIST & ROSTER RELIEF
// Source: CBA Article 19.6-19.8
// ============================================================================

export const injuredListRules = {
  cbaReference: 'Article 19.6-19.8',
  
  /**
   * SEASON-ENDING INJURY LIST (SEI)
   * Players out with long-term injuries
   */
  seasonEndingInjury: {
    definition: 'Player expected to miss remainder of MLS season due to injury/illness',
    minGamesOut: 6, // Must miss minimum 6 MLS league games
    placement: {
      clubInitiated: true,
      leagueApproval: 'Required - MLS verifies injury',
      medicalDocumentation: 'Must be submitted to league',
    },
    
    /**
     * ROSTER RELIEF
     */
    rosterRelief: {
      slotFreed: true, // Roster spot opens for replacement
      budgetRelief: false, // Salary still counts against cap!
      note: 'This is ONLY roster spot relief, NOT salary cap relief',
    },
    
    /**
     * REPLACEMENT PLAYER
     */
    replacementRules: {
      canSignReplacement: true,
      replacementSalary: 'Must fit within remaining cap space',
      seiPlayerReturns: 'Cannot return until following season',
    },
    
    timing: {
      canPlaceAnytime: true,
      mustRemainOnSEI: 'Through end of MLS season',
      returnEligibility: 'Following MLS season',
    },
  },
  
  /**
   * EXTREME HARDSHIP (CBA Article 19.8)
   * Exceptional circumstances allowing additional roster/budget relief
   */
  extremeHardship: {
    definition: 'Multiple significant injuries to key players',
    
    application: {
      clubMustApply: true,
      submittedTo: 'MLS League Office',
      documentation: [
        'Medical reports for all injured players',
        'Roster impact analysis',
        'Requested relief amount',
      ],
    },
    
    leagueDecision: {
      discretionary: true,
      factors: [
        'Number of injured players',
        'Severity/duration of injuries',
        'Position concentration',
        'Season timing',
        'Club\'s existing cap situation',
      ],
    },
    
    possibleRelief: {
      additionalGAM: 'League may provide emergency GAM',
      budgetRelief: 'May reduce injured player cap charges temporarily',
      rosterSpots: 'May grant additional roster spots',
      amount: 'Determined case-by-case',
    },
    
    limitations: {
      notGuaranteed: true,
      onlyForInjuries: 'Not for poor roster management',
      mustDemonstrateNeed: true,
    },
    
    example: `
      If Austin FC loses 3+ key players to ACL injuries mid-season:
      1. Place all on SEI → Frees 3 roster spots (but NOT cap)
      2. Apply for Extreme Hardship
      3. If approved, may receive $200K-$500K in emergency relief
      4. Use to sign replacement players
    `,
  },
  
  /**
   * SHORT-TERM INJURY
   * Not season-ending but significant
   */
  shortTermAbsence: {
    definition: 'Injury keeping player out 2-8 weeks',
    rosterRelief: false, // No roster spot relief
    budgetRelief: false, // No cap relief
    signingReplacement: 'Must have open roster spot and cap space',
    shortTermAgreement: 'Can sign Short-Term Agreement player (see below)',
  },
};

// ============================================================================
// SHORT-TERM AGREEMENTS (CBA Exhibit 10)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const shortTermAgreementRules = {
  cbaReference: 'Exhibit 10',
  
  /**
   * OVERVIEW
   * Temporary contracts for emergency roster needs
   */
  purpose: 'Allow clubs to sign players on short-term basis for injury/international duty coverage',
  
  /**
   * ELIGIBILITY TO SIGN
   */
  eligibility: {
    circumstances: [
      'Multiple players injured',
      'Players on international duty',
      'Emergency goalkeeper rule',
      'Extreme roster shortage',
    ],
    leagueApproval: 'Required before signing',
    documentation: 'Must demonstrate need (injury reports, call-up letters)',
  },
  
  /**
   * CONTRACT TERMS
   */
  contractTerms: {
    maxDuration: '4 weeks', // Can be extended with approval
    salary: {
      minimum: 'Reserve minimum ($88,025 in 2026 prorated)',
      maximum: 'No maximum but typically low',
    },
    budgetCharge: 'Prorated based on duration',
    rosterSlot: {
      option1: 'Uses supplemental roster spot if available',
      option2: 'Can exceed normal roster limits with league approval',
    },
  },
  
  /**
   * PLAYER SOURCES
   */
  playerSources: [
    'Free agents',
    'MLS NEXT Pro players (not on MLS roster)',
    'USL players',
    'Trialists',
    'Released players',
  ],
  
  /**
   * TERMINATION
   */
  termination: {
    automaticEnd: 'At contract duration end',
    earlyTermination: 'By mutual agreement',
    conversionToFull: 'Can sign player to full MLS contract during/after',
    note: 'If converting, follows normal signing rules',
  },
  
  /**
   * EMERGENCY GOALKEEPER RULE
   * Special case for goalkeeper shortages
   */
  emergencyGoalkeeper: {
    trigger: 'Both rostered GKs unavailable (injury/suspension)',
    canSign: 'Any goalkeeper on emergency basis',
    approvalProcess: 'Expedited league approval',
    commonScenario: 'Sign MLS NEXT Pro or USL keeper for one match',
  },
};

// ============================================================================
// MLS SUPERDRAFT (CBA Exhibit 7)
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const superDraftRules = {
  cbaReference: 'Exhibit 7',
  
  /**
   * OVERVIEW
   * Annual draft of college and international players
   */
  purpose: 'Primary mechanism for MLS clubs to acquire college players',
  
  timing: {
    when: 'January (before MLS preseason)',
    year2026Example: 'January 17, 2026',
    rounds: 2, // Reduced from 4 in recent years
    format: 'Virtual/televised event',
  },
  
  /**
   * ELIGIBILITY
   */
  eligibility: {
    collegePlayers: {
      mustRegister: true,
      deadline: 'Typically early January',
      collegeEligibility: 'May forfeit remaining college eligibility',
    },
    internationalPlayers: {
      canEnter: true,
      requirements: 'Not currently under contract with a club',
    },
    excludedFrom: [
      'Players with Homegrown rights at an MLS club',
      'Generation adidas signees',
      'Players already under MLS contract',
    ],
  },
  
  /**
   * DRAFT ORDER
   */
  draftOrder: {
    determination: 'Based on previous season standings',
    worstRecordFirst: true,
    playoffTeams: 'Draft after non-playoff teams',
    tradeable: true,
    canTrade: [
      'Draft pick positions',
      'Future draft picks',
      'Draft pick for GAM',
      'Draft pick for player',
    ],
  },
  
  /**
   * GENERATION ADIDAS (GA)
   * Special pre-draft signings
   */
  generationAdidas: {
    definition: 'MLS signs top prospects directly before draft',
    benefit: 'Don\'t count against senior roster (supplemental)',
    budgetCharge: 'Reduced or waived first 2-4 years',
    draftImpact: 'GA players removed from draft pool',
    clubAssignment: {
      allocated: 'Via allocation order or negotiation',
      notDrafted: 'Not part of SuperDraft itself',
    },
  },
  
  /**
   * POST-DRAFT
   */
  postDraft: {
    signingPeriod: 'Club has exclusive rights to sign',
    ifNotSigned: 'Player can re-enter draft next year or sign elsewhere',
    contractTerms: {
      typical: '1-2 year contracts with options',
      salary: 'Often senior or reserve minimum',
    },
  },
  
  /**
   * DRAFT PRIORITY TRADING
   */
  tradingPicks: {
    canTradeFor: [
      'GAM (common)',
      'Players',
      'International slots',
      'Other draft picks',
    ],
    example: {
      description: 'Austin FC traded 2024 1st round pick to Colorado',
      received: '$250K GAM',
      context: 'Used GAM for roster building instead of draft pick',
    },
  },
  
  /**
   * RECENT TRENDS
   */
  trends: {
    reducedRounds: 'Down from 4 to 2 rounds',
    fewerPicks: 'Clubs prefer GAM or international signings',
    homegrownPathway: 'More players signed via academy instead',
    generationAdidasDecline: 'Program has fewer signees each year',
    stillValuable: 'Top picks can be immediate contributors',
  },
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
  
  /**
   * SALARY STRUCTURE
   */
  salaryStructure: {
    paidByMLS: true, // League funds GA contracts initially
    typicalSalary: 'Senior minimum to ~$150K',
    progression: 'Can negotiate raises after GA period',
    budgetChargeDuration: '2-4 years of reduced charge',
  },
  
  /**
   * TRANSITION TO REGULAR CONTRACT
   */
  transition: {
    afterGAPeriod: 'Player counts normally against budget',
    negotiation: 'Club and player negotiate new terms',
    budgetImpact: 'Full salary counts against cap',
    rosterSlot: 'Moves to senior roster (slots 1-20)',
  },
};

// ============================================================================
// CBA ARTICLE 10: COMPENSATION, EXPENSES & LEAGUE PLAYER EXPENDITURES
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const cbaArticle10Compensation = {
  cbaReference: 'Article 10',
  
  /**
   * SALARY BUDGET (Section 10.10)
   * The amount teams can spend on senior roster players
   */
  salaryBudget: {
    description: 'Total amount clubs can spend on Senior Roster (slots 1-20)',
    note: 'Amounts adjusted annually per CBA schedule',
  },

  /**
   * SALARY BUDGET CHARGE CALCULATION (Section 10.10(vi))
   * How player compensation counts against the budget:
   * 
   * Base salary × 1.04 (multiplier) + Guaranteed compensation components
   */
  salaryBudgetChargeFormula: {
    baseSalaryMultiplier: 1.04,
    includes: [
      'Annualized base salary × 1.04',
      'Signing bonuses (amortized)',
      'Roster bonuses',
      'Housing allowance',
      'Car allowance',
      'Agent fees',
      'Transfer fee amortization (for non-DP/U22)',
    ],
    excludes: [
      'Performance bonuses (until earned)',
      'Marketing bonuses',
    ],
  },

  /**
   * DESIGNATED PLAYER CHARGE (Section 10.10(viii-ix))
   */
  designatedPlayerCharge: {
    fullSeason: 'Maximum Salary Budget Charge',
    midSeason: 'Half of Maximum Salary Budget Charge',
    youngDP: {
      age20OrUnder: 150_000,
      age21to23: 200_000,
    },
  },

  /**
   * MAXIMUM SALARY BUDGET CHARGE (Section 10.10)
   * The cap on any single player's budget charge
   */
  maxSalaryBudgetCharge: {
    year2025: 743_750,
    year2026: 803_125,
    note: 'Players earning above this become DPs or need TAM buydown',
  },

  /**
   * MINIMUM SALARIES
   */
  minimumSalaries: {
    seniorMinimum2025: 104_000,  // For slots 1-24
    reserveMinimum2025: 80_622,   // For slots 25-30, must be ≤24 years old
  },
};

// ============================================================================
// CBA ARTICLE 19: ROSTERS
// Source: https://s3.amazonaws.com/mlspa/2020-2028-CBA-Long-Form_FINAL.pdf
// ============================================================================

export const cbaArticle19Rosters = {
  cbaReference: 'Article 19',

  /**
   * ACTIVE ROSTER (Section 19.1)
   * Maximum 30 players per club
   */
  activeRoster: {
    maxPlayers: 30,
    allEligibleForMatchday: true,
  },

  /**
   * SENIOR ROSTER (Slots 1-20)
   * Players who count against the Salary Budget
   */
  seniorRoster: {
    slots: '1-20',
    maxPlayers: 20,
    countsAgainstBudget: true,
    minPlayersRequired: 18,  // Below this, minimum charges imputed
  },

  /**
   * SUPPLEMENTAL ROSTER (Slots 21-30)
   * Players who do NOT count against Salary Budget
   */
  supplementalRoster: {
    slots: '21-30',
    maxPlayers: 10,
    countsAgainstBudget: false,
    slotRequirements: {
      slots21to24: {
        minSalary: 'Senior Minimum ($104,000)',
        eligible: ['Homegrown Players', 'Generation adidas', 'SuperDraft players'],
      },
      slots25to30: {
        minSalary: 'Reserve Minimum ($80,622)',
        maxAge: 24,
        eligible: ['Homegrown Players', 'Generation adidas'],
      },
    },
  },

  /**
   * ROSTER COMPLIANCE DATE
   * Deadline for teams to be roster and budget compliant
   */
  rosterComplianceDate: {
    timing: 'Late February (varies by year)',
    year2025: 'February 21, 2025 at 8:00 PM ET',
    requirement: 'Must be roster and budget compliant by this date',
  },

  /**
   * ROSTER FREEZE DATE
   * Final roster submission deadline
   */
  rosterFreezeDate: {
    year2025: 'September 12, 2025',
    requirement: 'Final 30-man roster submitted, no changes until after MLS Cup',
  },
};

// ============================================================================
// CBA ARTICLE 15: LOANS AND TRANSFERS
// ============================================================================

export const cbaArticle15LoansTransfers = {
  cbaReference: 'Article 15',

  /**
   * LOAN RULES
   */
  loans: {
    domesticLoans: 'To USL or MLS NEXT Pro affiliates',
    internationalLoans: 'Must comply with FIFA regulations',
    loanBuydown: 'Loan fees can be bought down with GAM (100%)',
  },

  /**
   * TRANSFER WINDOWS
   */
  transferWindows: {
    primary: 'January-April (varies by year)',
    secondary: 'July-August (mid-season)',
    note: 'International transfer certificates can only be requested during windows',
  },

  /**
   * INTRA-LEAGUE TRANSFERS (MLS-to-MLS trades)
   */
  intraleagueTransfers: {
    noWindowRequired: true,  // Can trade within MLS anytime (except roster freeze)
    gamCanBeUsed: true,
    cashCanBeUsed: true,
    combinationsAllowed: true,
  },
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

// ============================================================================
// ADVANCED SIGNING SCENARIO CALCULATOR
// Practical tools for evaluating potential player acquisitions
// ============================================================================

export interface SigningScenario {
  // Player info
  playerName: string;
  age: number;
  nationality: 'domestic' | 'international';
  
  // Contract terms
  baseSalary: number;
  guaranteedYears: number;
  optionYears?: number;
  
  // Acquisition cost
  transferFee?: number;
  loanFee?: number;
  
  // Proposed designation
  proposedDesignation: 'DP' | 'YoungDP' | 'U22' | 'TAM' | 'Senior' | 'Supplemental';
}

export interface SigningAnalysis {
  canSign: boolean;
  issues: string[];
  recommendations: string[];
  
  // Cap calculations
  annualBudgetCharge: number;
  amortizedTransferFee: number;
  totalBudgetImpact: number;
  
  // Resource requirements
  gamRequired: number;
  tamRequired: number;
  dpSlotRequired: boolean;
  u22SlotRequired: boolean;
  internationalSlotRequired: boolean;
  
  // Designation analysis
  optimalDesignation: string;
  designationOptions: {
    designation: string;
    budgetCharge: number;
    feasible: boolean;
    reason: string;
  }[];
}

/**
 * Analyze a potential signing scenario
 * Returns detailed breakdown of cap implications and recommendations
 */
export function analyzeSigningScenario(
  scenario: SigningScenario,
  currentRosterState: {
    dpSlotsUsed: number;
    u22SlotsUsed: number;
    internationalSlotsUsed: number;
    seniorRosterCount: number;
    currentBudgetCharge: number;
    gamAvailable: number;
    tamAvailable: number;
  },
  year: 2025 | 2026 = 2026
): SigningAnalysis {
  const rules = year === 2026 ? {
    maxBudgetCharge: 803_125,
    salaryBudget: 6_425_000,
    dpCharge: 803_125,
    youngDPCharge: 200_000,
    u22Charge: 200_000,
    u22MaxSalary: 612_500,
    maxDPSlots: 3,
    maxU22Slots: 3,
    maxInternationalSlots: 8,
    maxSeniorRoster: 20,
  } : {
    maxBudgetCharge: 743_750,
    salaryBudget: 5_950_000,
    dpCharge: 743_750,
    youngDPCharge: 200_000,
    u22Charge: 200_000,
    u22MaxSalary: 612_500,
    maxDPSlots: 3,
    maxU22Slots: 3,
    maxInternationalSlots: 8,
    maxSeniorRoster: 20,
  };
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Calculate amortized transfer fee
  const amortizedTransferFee = scenario.transferFee 
    ? scenario.transferFee / scenario.guaranteedYears 
    : 0;
  
  // Calculate base budget charge (before designation discounts)
  const rawBudgetCharge = scenario.baseSalary + amortizedTransferFee;
  
  // Analyze each possible designation
  const designationOptions: SigningAnalysis['designationOptions'] = [];
  
  // DP Analysis
  const dpFeasible = currentRosterState.dpSlotsUsed < rules.maxDPSlots;
  designationOptions.push({
    designation: 'DP',
    budgetCharge: rules.dpCharge,
    feasible: dpFeasible,
    reason: dpFeasible 
      ? `DP slot available. Charge: $${rules.dpCharge.toLocaleString()} regardless of salary/fee`
      : 'No DP slots available',
  });
  
  // Young DP Analysis (23 or under)
  const youngDPFeasible = scenario.age <= 23 && currentRosterState.dpSlotsUsed < rules.maxDPSlots;
  designationOptions.push({
    designation: 'YoungDP',
    budgetCharge: rules.youngDPCharge,
    feasible: youngDPFeasible,
    reason: youngDPFeasible 
      ? `Young DP eligible (age ${scenario.age}). Reduced charge: $${rules.youngDPCharge.toLocaleString()}`
      : scenario.age > 23 ? `Player too old (${scenario.age}) for Young DP` : 'No DP slots available',
  });
  
  // U22 Analysis
  const u22Feasible = scenario.age <= 22 
    && scenario.baseSalary <= rules.u22MaxSalary 
    && currentRosterState.u22SlotsUsed < rules.maxU22Slots;
  designationOptions.push({
    designation: 'U22',
    budgetCharge: rules.u22Charge,
    feasible: u22Feasible,
    reason: u22Feasible 
      ? `U22 eligible. Fixed charge: $${rules.u22Charge.toLocaleString()} (transfer fee exempt!)`
      : scenario.age > 22 ? `Player too old (${scenario.age}) for U22`
        : scenario.baseSalary > rules.u22MaxSalary ? `Salary exceeds U22 max ($${rules.u22MaxSalary.toLocaleString()})`
        : 'No U22 slots available',
  });
  
  // TAM Analysis
  const tamBuydownNeeded = Math.max(0, rawBudgetCharge - rules.maxBudgetCharge);
  const tamFeasible = tamBuydownNeeded <= currentRosterState.tamAvailable + currentRosterState.gamAvailable
    && rawBudgetCharge > rules.maxBudgetCharge;
  designationOptions.push({
    designation: 'TAM',
    budgetCharge: Math.min(rawBudgetCharge, rules.maxBudgetCharge),
    feasible: tamFeasible || rawBudgetCharge <= rules.maxBudgetCharge,
    reason: rawBudgetCharge <= rules.maxBudgetCharge 
      ? 'Under max charge - no TAM needed'
      : tamFeasible 
        ? `Need $${tamBuydownNeeded.toLocaleString()} TAM/GAM to buy down`
        : `Insufficient TAM/GAM for buydown (need $${tamBuydownNeeded.toLocaleString()})`,
  });
  
  // Senior (no special designation)
  const seniorFeasible = rawBudgetCharge <= rules.maxBudgetCharge 
    && currentRosterState.seniorRosterCount < rules.maxSeniorRoster;
  designationOptions.push({
    designation: 'Senior',
    budgetCharge: rawBudgetCharge,
    feasible: seniorFeasible,
    reason: seniorFeasible 
      ? `Fits under max budget charge as senior roster player`
      : rawBudgetCharge > rules.maxBudgetCharge 
        ? `Exceeds max charge - needs DP, U22, or TAM buydown`
        : 'No senior roster spots available',
  });
  
  // Determine optimal designation
  let optimalDesignation = scenario.proposedDesignation;
  let finalBudgetCharge = rawBudgetCharge;
  let dpSlotRequired = false;
  let u22SlotRequired = false;
  let gamRequired = 0;
  let tamRequired = 0;
  
  // Priority: U22 > YoungDP > TAM > DP > Senior
  if (u22Feasible) {
    optimalDesignation = 'U22';
    finalBudgetCharge = rules.u22Charge;
    u22SlotRequired = true;
    recommendations.push(`✨ Recommend U22 designation - only $${rules.u22Charge.toLocaleString()} cap hit and transfer fee exempt!`);
  } else if (youngDPFeasible && rawBudgetCharge > rules.maxBudgetCharge) {
    optimalDesignation = 'YoungDP';
    finalBudgetCharge = rules.youngDPCharge;
    dpSlotRequired = true;
    recommendations.push(`✨ Young DP available - $${rules.youngDPCharge.toLocaleString()} cap hit`);
  } else if (seniorFeasible) {
    optimalDesignation = 'Senior';
    finalBudgetCharge = rawBudgetCharge;
    recommendations.push(`✅ Fits as senior roster player under max charge`);
  } else if (tamFeasible) {
    optimalDesignation = 'TAM';
    finalBudgetCharge = rules.maxBudgetCharge;
    tamRequired = tamBuydownNeeded;
    recommendations.push(`💰 TAM buydown required: $${tamBuydownNeeded.toLocaleString()}`);
  } else if (dpFeasible) {
    optimalDesignation = 'DP';
    finalBudgetCharge = rules.dpCharge;
    dpSlotRequired = true;
    recommendations.push(`⭐ DP slot available for high-value signing`);
  }
  
  // Check international slot
  const internationalSlotRequired = scenario.nationality === 'international';
  if (internationalSlotRequired) {
    if (currentRosterState.internationalSlotsUsed >= rules.maxInternationalSlots) {
      issues.push(`❌ No international slots available (${currentRosterState.internationalSlotsUsed}/${rules.maxInternationalSlots})`);
      recommendations.push(`→ Trade for international slot or target domestic player`);
    }
  }
  
  // Check if signing is possible
  const capSpaceAfter = rules.salaryBudget - currentRosterState.currentBudgetCharge - finalBudgetCharge;
  if (capSpaceAfter < 0) {
    issues.push(`❌ Would exceed salary budget by $${Math.abs(capSpaceAfter).toLocaleString()}`);
  }
  
  const canSign = issues.length === 0 && designationOptions.some(d => 
    d.designation === optimalDesignation && d.feasible
  );
  
  return {
    canSign,
    issues,
    recommendations,
    annualBudgetCharge: finalBudgetCharge,
    amortizedTransferFee,
    totalBudgetImpact: finalBudgetCharge,
    gamRequired,
    tamRequired,
    dpSlotRequired,
    u22SlotRequired,
    internationalSlotRequired,
    optimalDesignation,
    designationOptions,
  };
}

/**
 * Calculate GAM from selling a player abroad
 * Uses MLS tiered conversion system with $3M cap
 */
export function calculateSaleGAM(
  grossFee: number,
  options: {
    isHomegrown?: boolean;
    playerAge?: number;
    agentFeePercent?: number;
    mlsFeePercent?: number;
  } = {}
): {
  grossFee: number;
  netRevenue: number;
  baseGAM: number;
  homegrownBonus: number;
  youngPlayerBonus: number;
  totalGAM: number;
  cappedAt: number | null;
  breakdown: string;
} {
  const {
    isHomegrown = false,
    playerAge = 25,
    agentFeePercent = 0.10,
    mlsFeePercent = 0.05,
  } = options;
  
  // Calculate net revenue
  const mlsFee = grossFee * mlsFeePercent;
  const agentFee = grossFee * agentFeePercent;
  const netRevenue = grossFee - mlsFee - agentFee;
  
  // Calculate base GAM using tiers
  let baseGAM = 0;
  let remaining = netRevenue;
  const breakdownParts: string[] = [];
  
  // Tier 1: First $1M at 50%
  const tier1Amount = Math.min(remaining, 1_000_000);
  const tier1GAM = tier1Amount * 0.50;
  baseGAM += tier1GAM;
  remaining -= tier1Amount;
  if (tier1Amount > 0) {
    breakdownParts.push(`Tier 1 ($0-$1M): $${tier1Amount.toLocaleString()} × 50% = $${tier1GAM.toLocaleString()}`);
  }
  
  // Tier 2: $1M-$3M at 40%
  const tier2Amount = Math.min(remaining, 2_000_000);
  const tier2GAM = tier2Amount * 0.40;
  baseGAM += tier2GAM;
  remaining -= tier2Amount;
  if (tier2Amount > 0) {
    breakdownParts.push(`Tier 2 ($1M-$3M): $${tier2Amount.toLocaleString()} × 40% = $${tier2GAM.toLocaleString()}`);
  }
  
  // Tier 3: $3M+ at 25%
  const tier3GAM = remaining * 0.25;
  baseGAM += tier3GAM;
  if (remaining > 0) {
    breakdownParts.push(`Tier 3 ($3M+): $${remaining.toLocaleString()} × 25% = $${tier3GAM.toLocaleString()}`);
  }
  
  // Calculate bonuses
  const homegrownBonus = isHomegrown ? baseGAM * 0.15 : 0;
  const youngPlayerBonus = playerAge < 23 ? baseGAM * 0.10 : 0;
  
  // Apply $3M cap
  const uncappedTotal = baseGAM + homegrownBonus + youngPlayerBonus;
  const totalGAM = Math.min(uncappedTotal, 3_000_000);
  const cappedAt = uncappedTotal > 3_000_000 ? 3_000_000 : null;
  
  // Build breakdown string
  let breakdown = `
Gross Fee: $${grossFee.toLocaleString()}
- MLS Admin Fee (${(mlsFeePercent * 100).toFixed(0)}%): -$${mlsFee.toLocaleString()}
- Agent Fee (${(agentFeePercent * 100).toFixed(0)}%): -$${agentFee.toLocaleString()}
= Net Revenue: $${netRevenue.toLocaleString()}

GAM Calculation:
${breakdownParts.join('\n')}
= Base GAM: $${baseGAM.toLocaleString()}
${isHomegrown ? `+ Homegrown Bonus (15%): +$${homegrownBonus.toLocaleString()}` : ''}
${playerAge < 23 ? `+ Young Player Bonus (10%): +$${youngPlayerBonus.toLocaleString()}` : ''}
${cappedAt ? `\n⚠️ CAPPED at $3,000,000 (would have been $${uncappedTotal.toLocaleString()})` : ''}
= TOTAL GAM: $${totalGAM.toLocaleString()}
  `.trim();
  
  return {
    grossFee,
    netRevenue,
    baseGAM,
    homegrownBonus,
    youngPlayerBonus,
    totalGAM,
    cappedAt,
    breakdown,
  };
}

/**
 * Calculate roster compliance status
 */
export function calculateRosterCompliance(
  players: {
    budgetCharge: number;
    isDP: boolean;
    isU22: boolean;
    isInternational: boolean;
    isHomegrown: boolean;
    rosterSlot: 'Senior' | 'Supplemental';
  }[],
  year: 2025 | 2026 = 2026
): {
  compliant: boolean;
  budgetUsed: number;
  budgetRemaining: number;
  budgetPercent: number;
  dpCount: number;
  u22Count: number;
  internationalCount: number;
  seniorCount: number;
  supplementalCount: number;
  issues: string[];
} {
  const rules = year === 2026 ? {
    salaryBudget: 6_425_000,
    maxDPs: 3,
    maxU22: 3,
    maxInternational: 8,
    maxSenior: 20,
    maxSupplemental: 10,
  } : {
    salaryBudget: 5_950_000,
    maxDPs: 3,
    maxU22: 3,
    maxInternational: 8,
    maxSenior: 20,
    maxSupplemental: 10,
  };
  
  const budgetUsed = players.reduce((sum, p) => sum + p.budgetCharge, 0);
  const dpCount = players.filter(p => p.isDP).length;
  const u22Count = players.filter(p => p.isU22).length;
  const internationalCount = players.filter(p => p.isInternational).length;
  const seniorCount = players.filter(p => p.rosterSlot === 'Senior').length;
  const supplementalCount = players.filter(p => p.rosterSlot === 'Supplemental').length;
  
  const issues: string[] = [];
  
  if (budgetUsed > rules.salaryBudget) {
    issues.push(`❌ Over salary budget by $${(budgetUsed - rules.salaryBudget).toLocaleString()}`);
  }
  if (dpCount > rules.maxDPs) {
    issues.push(`❌ Too many DPs: ${dpCount}/${rules.maxDPs}`);
  }
  if (u22Count > rules.maxU22) {
    issues.push(`❌ Too many U22 players: ${u22Count}/${rules.maxU22}`);
  }
  if (internationalCount > rules.maxInternational) {
    issues.push(`❌ Too many internationals: ${internationalCount}/${rules.maxInternational}`);
  }
  if (seniorCount > rules.maxSenior) {
    issues.push(`❌ Too many senior roster players: ${seniorCount}/${rules.maxSenior}`);
  }
  if (supplementalCount > rules.maxSupplemental) {
    issues.push(`❌ Too many supplemental players: ${supplementalCount}/${rules.maxSupplemental}`);
  }
  
  return {
    compliant: issues.length === 0,
    budgetUsed,
    budgetRemaining: rules.salaryBudget - budgetUsed,
    budgetPercent: Math.round((budgetUsed / rules.salaryBudget) * 100),
    dpCount,
    u22Count,
    internationalCount,
    seniorCount,
    supplementalCount,
    issues,
  };
}

/**
 * Get all rules as a formatted string for AI context
 */
export function getRulesContext(): string {
  return `
MLS ROSTER RULES (2025-2026 Season)

SALARY BUDGET: $5,950,000 (2025), $6,425,000 (2026)
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
- Salary exceeds max budget charge = DP
- Count at max budget charge ($803,125 in 2026)
- Young DP (≤23): Reduced charge ~$200,000
- Max buyouts: 2 per year

U22 INITIATIVE:
- Must be 22 or younger at signing
- Can stay through age 25
- Budget charge: $200,000 (fixed!)
- Max salary: $612,500
- Transfer fees EXEMPT from cap (huge benefit!)

ALLOCATION MONEY:
TAM: $2,125,000 annually (2026) - buy down salaries
GAM: $3,280,000 annually (2026) - flexible use
GAM tradeable, TAM is NOT

INTERNATIONAL SLOTS:
- 8 default per club
- Tradeable between clubs

FREE AGENCY (2026+):
- Age 24+ with 4+ years MLS service
- (Changed from 5 years to 4 years in 2026)

HOMEGROWN PLAYERS:
- No international slot required
- Off-roster homegrowns (≤21): Up to 6 league matches
- Extended U22 Initiative eligibility

⚠️ TRANSFER FEES (CRITICAL - Commonly Misunderstood!):
- Transfer fees DO count against salary budget as AMORTIZED annual costs
- Formula: Annual Budget Charge = Base Salary + (Transfer Fee ÷ Contract Years) + Bonuses

EXEMPTIONS (fees DON'T add to cap):
- DPs: Budget charge capped at ~$803K regardless of any transfer fee
- U22: Budget charge fixed at $200K regardless of any transfer fee

NON-EXEMPT PLAYERS (fees DO add to cap!):
- Senior roster players who are NOT DP and NOT U22
- Amortized fee IS added to salary for budget charge
- Must be ≤ max budget charge OR bought down with GAM/TAM

LOAN RULES:
- Intra-MLS: Up to 4 players at a time, 14+ days
- To Affiliate: Unlimited, for development
- International: FIFA rules apply, window required
- Loan fees can be 100% bought down with GAM

CONTRACT BUYOUTS (2025+):
- Max 2 guaranteed contracts bought out per year
- Includes DP contracts
- Immediate cap relief

RE-ENTRY DRAFT:
- For out-of-contract players not FA eligible
- Stage 1: Original club rights
- Stage 2: Open selection (inverse standings)

SHORT-TERM AGREEMENTS:
- Up to 4 weeks for emergency coverage
- Requires league approval
- Common for injury/international duty gaps

⚠️ MLSPA DATA WARNING:
- MLSPA reports salary + guaranteed comp ONLY
- Does NOT include: transfer fees, loan fees, signing bonus amortization
- MLSPA data alone UNDERSTATES true budget charges!

TRANSFER WINDOWS (2025):
- Primary Window: Jan 31 - Apr 23, 2025
- Secondary Window: Jul 24 - Aug 21, 2025
- Roster Compliance Date: Feb 21, 2025 (8pm ET)
- Roster Freeze Date: Sep 12, 2025
`.trim();
}

