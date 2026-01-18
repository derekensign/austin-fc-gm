/**
 * Austin FC GAM & TAM Transaction History
 * 
 * This document tracks verified General Allocation Money (GAM) and 
 * Targeted Allocation Money (TAM) transactions for Austin FC.
 * 
 * OFFICIAL SOURCES:
 * - MLS 2025 GAM Publication: https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
 * - Austin FC Press Releases: https://www.austinfc.com/news/
 * - Transfermarkt: https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309
 * 
 * VERIFIED 2025 GAM (as of Dec 10, 2024): $3,162,071
 * Source: MLS Official Publication
 * 
 * Last Updated: January 2026
 */

// ============================================================================
// MLS ALLOCATION MONEY BY YEAR (FROM CBA)
// ============================================================================

export const MLS_ALLOCATION_BY_YEAR = {
  2021: { gam: 1_525_000, tam: 2_800_000 },
  2022: { gam: 1_625_000, tam: 2_800_000 },
  2023: { gam: 1_900_000, tam: 2_720_000 },
  2024: { gam: 2_585_000, tam: 2_400_000 },
  2025: { gam: 2_930_000, tam: 2_225_000 },  // Per MLS official publication
  2026: { gam: 3_280_000, tam: 2_125_000 },
  2027: { gam: 3_921_000, tam: 2_025_000 },
};

// ============================================================================
// OFFICIAL MLS GAM BALANCES (VERIFIED)
// Source: https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
// Published: December 19, 2024 (as of Dec 10, 2024)
// ============================================================================

export const MLS_OFFICIAL_GAM_2025 = {
  // All MLS clubs' verified GAM entering 2025 season
  'Atlanta United': 6_503_478,
  'Austin FC': 3_162_071,  // ⭐ VERIFIED
  'Chicago Fire FC': 2_931_721,
  'FC Cincinnati': 4_225_000,
  'Columbus Crew': 3_173_205,
  'Charlotte FC': 2_976_404,
  'Colorado Rapids': 3_980_215,
  'D.C. United': 3_383_240,
  'FC Dallas': 4_482_846,
  'Houston Dynamo FC': 2_063_538,
  'LAFC': 3_770_022,
  'LA Galaxy': 2_416_000,
  'Inter Miami CF': 3_300_159,
  'Minnesota United FC': 4_547_572,
  'CF Montréal': 2_948_106,
  'New England Revolution': 5_585_931,
  'Nashville SC': 2_512_683,
  'New York City FC': 3_285_135,
  'New York Red Bulls': 3_879_130,
  'Orlando City SC': 3_990_312,
  'Philadelphia Union': 4_220_769,
  'Portland Timbers': 2_767_783,
  'Real Salt Lake': 4_133_765,
  'San Diego FC': 5_095_000,  // Expansion bonus
  'Seattle Sounders FC': 4_215_203,
  'San Jose Earthquakes': 3_550_810,
  'St. Louis CITY SC': 5_306_579,
  'Sporting Kansas City': 3_390_955,
  'Toronto FC': 3_318_648,
  'Vancouver Whitecaps FC': 3_658_458,
};

// Austin FC specific - VERIFIED STARTING POINTS
export const AUSTIN_FC_VERIFIED_GAM_2025 = {
  amount: 3_162_071,
  asOfDate: '2024-12-10',
  source: 'https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs',
  note: 'Official starting GAM for 2025 season before any 2025 transactions',
};

/**
 * AUSTIN FC GAM STATUS - JANUARY 2026
 * Source: Matthew Doyle / Armchair Analyst
 * https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam
 * Published: January 15, 2026
 * 
 * This is the most up-to-date verified GAM position for Austin FC!
 */
export const AUSTIN_FC_GAM_JAN_2026 = {
  // As of September 2025 (MLS official update)
  rolledOverFromSept2025: 44_636,
  
  // Transactions since September 2025:
  transactions: {
    clevelandToSKC: +50_000,       // Stefan Cleveland trade (GAM received)
    rosalesToMinnesota: 0,          // Joseph Rosales acquisition - was CASH ($1.5M), not GAM!
    nelsonToVancouver: -700_000,    // Jayden Nelson acquisition (2026 GAM sent OUT)
  },
  
  // Current rolled-over GAM (before 2026 annual allocation)
  currentRolledOver: 44_636 + 50_000 - 700_000, // = -$605,364 (NEGATIVE, but better than before!)
  
  // 2026 additions NOT yet counted:
  notYetCounted: {
    annualGAM2026: 3_280_000,           // Every team gets this
    rosterModelGAM: 0,                   // If 2/4/GAM build, could get up to $2M more
    playoffMissBonus: 0,                 // "You suck!" allocation (small)
    thirdDPDistribution: 250_000,        // With only 2 DPs, get share of pool (estimated)
    bukariSaleGAM: 0,                   // $0! Sold at LOSS (€5.5M vs €8M acquisition) - no GAM generated
  },
  
  // Discretionary TAM (separate from GAM)
  discretionaryTAM2026: 2_125_000,
  
  source: 'https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam',
  asOfDate: '2026-01-15',
  
  notes: `
    Austin FC's rolled-over GAM is negative due to Nelson trade.
    
    GAM Flow:
    - Rolled over from Sept 2025: $44,636
    - Cleveland trade: +$50,000
    - Rosales trade: $0 (was CASH $1.5M, not GAM!)
    - Nelson trade (2026 GAM OUT): -$700,000
    = Pre-2026 position: -$605,364 (small deficit)
    
    2026 Additions:
    - Annual GAM allocation: +$3,280,000
    - Third DP distribution (~estimate): +$250,000
    - Bukari sale GAM: $0 (sold at loss, no GAM generated)
    - Driussi sale GAM: $0 (DP not eligible for buydown)
    
    PROJECTED 2026 GAM AVAILABLE:
    -$605K + $3.28M + $0.25M = ~$2.92M
  `,
};

/**
 * AUSTIN FC 2026 ALLOCATION POSITION - CALCULATED
 * Comprehensive calculation based on all known transactions
 */
export const AUSTIN_FC_2026_ALLOCATION_POSITION = {
  // =====================================================
  // GAM POSITION
  // =====================================================
  gam: {
    // Starting position (rolled over from 2025 + trades)
    // $44,636 + $50K (Cleveland) - $700K (Nelson) = -$605,364
    rolledOverDeficit: -605_364,  // Small deficit due to Nelson trade
    
    // 2026 Credits
    annualAllocation: 3_280_000,
    thirdDPDistribution: 250_000,   // Estimated - only 2 DPs used
    bukariSaleGAM: 0,               // $0! Sold at LOSS (€5.5M vs €8M acquisition)
    
    // 2026 Debits (already committed)
    nelsonTradeGAM2027: -550_000,   // Owes Vancouver $550K in 2027 GAM
    
    // Current available GAM (2026)
    // Note: deficit includes Nelson ($700K), but Taylor ($250K) is separate
    taylorTrade2026: -250_000,
    available2026: 3_280_000 + 250_000 + 0 - 605_364 - 250_000, // = $2,674,636
    
    // Reserved for cap compliance (GAM portion only - TAM covers $2.0M first)
    // Total buydowns needed: $2.44M (from $8.86M charge - $6.42M budget)
    // TAM covers: $2.0M, GAM covers remainder: $0.44M
    estimatedBuydownsNeeded: 440_000, // GAM portion after TAM exhausted
    
    // Free GAM after compliance
    freeGAM: 3_280_000 + 250_000 + 0 - 605_364 - 250_000 - 440_000, // = $2,234,636
  },
  
  // =====================================================
  // TAM POSITION  
  // =====================================================
  tam: {
    annualAllocation: 2_125_000,
    
    // TAM is used first for buydowns (use-it-or-lose-it)
    // Total buydowns needed: $2.44M (from $8.86M charge - $6.42M budget)
    // TAM covers most of it
    estimatedBuydownsUsed: 2_000_000,
    
    // Available for new signings
    available: 2_125_000 - 2_000_000, // = $125,000
  },
  
  // =====================================================
  // COMBINED FLEXIBILITY
  // =====================================================
  combined: {
    // For new signings (after cap compliance)
    // GAM: $3.28M + $0.25M - $0.6M deficit - $0.25M Taylor - $0.44M buydowns = $2.23M
    freeGAM: 2_234_636,
    freeTAM: 125_000,
    totalFlexibility: 2_234_636 + 125_000, // = $2,359,636
    
    // For trades
    tradeableGAM: 2_234_636,  // GAM is tradeable
    tradeableTAM: 0,          // TAM cannot be traded
  },
  
  // =====================================================
  // FUTURE OBLIGATIONS
  // =====================================================
  futureObligations: {
    '2027': {
      nelsonGAMToVancouver: 550_000,
      taylorConditionalToMiami: 50_000,
    },
  },
  
  // =====================================================
  // ASSUMPTIONS & NOTES
  // =====================================================
  assumptions: [
    'Bukari sale: $0 GAM (sold at loss - €5.5M vs €8M acquisition)',
    'Driussi sale: $0 GAM (DP not eligible to be bought down)',
    'TAM used first for buydowns before GAM',
    'Budget charge $8.86M needs ~$2.44M buydown to fit $6.42M budget',
    'Third DP distribution estimated at $250K (varies by league)',
    'Model A (3 DPs + 3 U22) assumed - no $2M U22 model bonus',
  ],
  
  lastUpdated: '2026-01-18',
  sources: [
    'https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam',
    'https://www.austinfc.com/news/',
    'https://www.mlssoccer.com/about/roster-rules-and-regulations',
  ],
};

/**
 * AUSTIN FC 2027 ALLOCATION POSITION - PROJECTED
 * Based on CBA allocations and known future obligations
 */
export const AUSTIN_FC_2027_ALLOCATION_POSITION = {
  // =====================================================
  // GAM POSITION (PROJECTED)
  // =====================================================
  gam: {
    // Annual allocation per CBA
    annualAllocation: 3_921_000,
    thirdDPDistribution: 250_000,   // Estimated - depends on roster build
    
    // Carried over from 2026 (estimated - depends on 2026 usage)
    estimatedCarryover: 1_024_636,   // Assuming same free GAM as projected 2026
    
    // 2027 Debits (already committed from previous trades)
    nelsonGAMToVancouver: -550_000,
    taylorConditionalToMiami: -50_000,
    
    // Gross available (before buydowns)
    grossAvailable: 3_921_000 + 250_000 + 1_024_636 - 550_000 - 50_000, // = $4,595,636
    
    // Estimated for cap compliance (will vary based on roster)
    estimatedBuydownsNeeded: 1_500_000,
    
    // Free GAM after compliance
    freeGAM: 3_921_000 + 250_000 + 1_024_636 - 550_000 - 50_000 - 1_500_000, // = $3,095,636
  },
  
  // =====================================================
  // TAM POSITION (PROJECTED)
  // =====================================================
  tam: {
    annualAllocation: 2_025_000,
    
    // TAM is use-it-or-lose-it, so no carryover
    estimatedBuydownsUsed: 1_500_000,
    
    available: 2_025_000 - 1_500_000, // = $525,000
  },
  
  // =====================================================
  // COMBINED FLEXIBILITY (PROJECTED)
  // =====================================================
  combined: {
    freeGAM: 3_095_636,
    freeTAM: 525_000,
    totalFlexibility: 3_095_636 + 525_000, // = $3,620,636
    
    tradeableGAM: 3_095_636,
    tradeableTAM: 0,
  },
  
  // =====================================================
  // KEY NOTES
  // =====================================================
  notes: [
    'GAM allocation increases to $3.92M in 2027 (up from $3.28M)',
    'TAM allocation decreases to $2.03M in 2027 (down from $2.13M)',
    'Must pay $550K GAM to Vancouver (Nelson trade)',
    'Must pay $50K conditional GAM to Miami (Taylor trade)',
    'CBA expires Jan 31, 2028 - 2027 is final full year under current rules',
  ],
  
  lastUpdated: '2026-01-18',
};

// ============================================================================
// MLS ALLOCATION MONEY BASICS
// ============================================================================

export const MLS_ALLOCATION_RULES = {
  // Annual allocation amounts vary by year (see MLS_ALLOCATION_BY_YEAR)
  // 2026 figures:
  annualTAM: 2_125_000,  // Targeted Allocation Money - decreasing each year
  annualGAM: 3_280_000,  // General Allocation Money - increasing each year
  
  /**
   * HOW GAM IS GENERATED
   * Source: https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
   */
  gamSources: [
    'Annual league allocation ($2.93M in 2025)',
    'Up to $3M from eligible transfer revenue converted to GAM',
    'Via trade with another MLS club',
    'Qualifying for CONCACAF Champions Cup',
    'Failing to qualify for MLS Cup Playoffs (consolation)',
    'Third Designated Player charge distribution',
    'Having a player selected in MLS Expansion Draft',
    'U22 Initiative Roster Construction Path (up to $2M extra)',
  ],
  
  // How TAM is generated
  tamSources: [
    'Annual league allocation',
    'Cannot be traded between clubs (per official rules)',
  ],
  
  /**
   * HOW GAM CAN BE USED
   * Source: Official MLS GAM publication
   */
  gamUses: {
    // 1. Buy down salary budget charge
    salaryBuydown: {
      description: 'Buy down a player\'s Salary Budget Charge below the max ($743,750 in 2025)',
      minBuydownTo: 150_000,  // Can buy down to lesser of 50% or $150K
      example: 'Player has $450K charge, use $300K GAM → charge becomes $150K',
    },
    
    // 2. Buy down loan or transfer fee (100%!)
    transferFeeBuydown: {
      description: 'Buy down 100% of a loan or transfer fee',
      percentage: 1.0,  // Can cover entire fee!
      example: 'Club pays $500K transfer fee, applies $500K GAM → no cap impact',
      note: 'This is how GAM is used to PAY for incoming transfers within MLS',
    },
    
    // 3. Sign homegrown players
    homegrownSigning: {
      description: 'Use up to $200K GAM to sign Homegrown Players to first MLS contract',
      maxAmount: 200_000,
      allowsSupplementalRoster: true,
    },
    
    // 4. Trades
    trades: {
      canAcquire: [
        'Players',
        'International roster slots',
        'SuperDraft Priority',
        'Discovery Priority',
        'Homegrown Player priority',
        'Draft position (SuperDraft, Re-Entry, Waivers)',
      ],
      example: 'Montréal acquired Marshall-Rutty for $850K GAM ($450K 2024 + $400K 2025) + conditions',
    },
  },
  
  // Important rule changes
  ruleChanges: {
    gamExpiration: 'GAM no longer expires as of January 14, 2025 (except U22 Initiative GAM)',
    tamTrading: 'TAM cannot be traded between clubs',
    rollover: 'Unused GAM rolls over to next season',
    maxTransferGAM: 'Up to $3M from eligible transfer revenue can be converted to GAM',
  },
};

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = 
  | 'GAM_RECEIVED'
  | 'GAM_SPENT'
  | 'GAM_TRADED_OUT'
  | 'GAM_TRADED_IN'
  | 'TAM_RECEIVED'
  | 'TAM_SPENT'
  | 'TAM_TRADED_OUT'
  | 'TAM_TRADED_IN'
  | 'PLAYER_SALE_GAM'      // GAM from selling player abroad
  | 'BUYDOWN'
  | 'TRANSFER_FEE_PAID';   // Cash transfer fee paid (doesn't affect GAM)

export interface AllocationTransaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number | null;  // null if undisclosed
  conditionalAmount?: number;  // additional conditional GAM
  conditionalTerms?: string;  // what triggers the conditional amount
  amountEstimated: boolean;
  description: string;
  relatedPlayer?: string;
  counterparty?: string;  // Other MLS team or 'MLS League Office'
  source: string;  // URL to official source
  notes?: string;
  verified: boolean;
}

// ============================================================================
// AUSTIN FC VERIFIED ALLOCATION HISTORY
// All transactions below have official sources
// ============================================================================

export const austinFCAllocationHistory: AllocationTransaction[] = [
  // ============================================================================
  // ANNUAL ALLOCATIONS (From MLS CBA - amounts vary by year!)
  // 
  // NOTE: For UI display, we filter to show only 2024+ transactions.
  // Historical data (2021-2023) is kept for reference but the MLS Official
  // GAM Publication ($3,162,071 entering 2025) is our authoritative baseline.
  // ============================================================================
  
  // 2021 - Austin FC's first year
  {
    id: '2021-gam-annual',
    date: '2021-03-01',
    type: 'GAM_RECEIVED',
    amount: 1_525_000,
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2021 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2021-tam-annual',
    date: '2021-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_800_000,
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2021 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2022
  {
    id: '2022-gam-annual',
    date: '2022-03-01',
    type: 'GAM_RECEIVED',
    amount: 1_625_000,
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2022 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2022-tam-annual',
    date: '2022-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_800_000,
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2022 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2023
  {
    id: '2023-gam-annual',
    date: '2023-03-01',
    type: 'GAM_RECEIVED',
    amount: 1_900_000,
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2023 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2023-tam-annual',
    date: '2023-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_720_000,
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2023 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2024
  {
    id: '2024-gam-annual',
    date: '2024-03-01',
    type: 'GAM_RECEIVED',
    amount: 2_585_000,  // 2024 CBA amount - big jump
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2024 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2024-tam-annual',
    date: '2024-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_400_000,  // 2024 CBA amount
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2024 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2025
  {
    id: '2025-gam-annual',
    date: '2025-03-01',
    type: 'GAM_RECEIVED',
    amount: 2_930_000,  // 2025 CBA amount
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2025 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2025-tam-annual',
    date: '2025-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_225_000,  // 2025 CBA amount
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2025 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2026
  {
    id: '2026-gam-annual',
    date: '2026-03-01',  // Use March to avoid timezone issues with Jan 1
    type: 'GAM_RECEIVED',
    amount: 3_280_000,  // 2026 CBA amount
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2026 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2026-tam-annual',
    date: '2026-03-01',  // Use March to avoid timezone issues with Jan 1
    type: 'TAM_RECEIVED',
    amount: 2_125_000,  // 2026 CBA amount
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2026 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // 2027 (Final year of current CBA)
  {
    id: '2027-gam-annual',
    date: '2027-03-01',
    type: 'GAM_RECEIVED',
    amount: 3_921_000,  // 2027 CBA amount - highest GAM year
    amountEstimated: false,
    description: 'Annual GAM allocation from MLS (2027 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  {
    id: '2027-tam-annual',
    date: '2027-03-01',
    type: 'TAM_RECEIVED',
    amount: 2_025_000,  // 2027 CBA amount - lowest TAM year
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2027 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // ============================================================================
  // TAM/GAM BUYDOWNS (ESTIMATES)
  // 
  // ⚠️ IMPORTANT: These are ESTIMATES based on roster data and cap math.
  // Exact buydown allocations are not publicly disclosed by MLS.
  // 
  // KEY CONCEPT: Total Budget Charge must be under Salary Budget!
  // - Salary Budget (2026): $6,425,000
  // - If total budget charge exceeds this, must use TAM/GAM to buy down
  // - TAM/GAM reduces individual player's budget charge (not their actual salary)
  // 
  // Source: The North End Podcast Spreadsheet + MLS roster compliance math
  // ============================================================================
  
  // --- 2026 BUYDOWNS (ESTIMATED) ---
  // Budget charge $8.86M vs $6.42M budget = $2.44M buydowns needed
  {
    id: '2026-tam-buydowns-est',
    date: '2026-03-01',
    type: 'TAM_SPENT',
    amount: 2_000_000,
    amountEstimated: true,
    description: '2026 TAM buydowns (ESTIMATE)',
    counterparty: 'Salary Buydowns',
    source: 'Estimated: $8.86M charge - $6.42M budget = $2.44M needed',
    notes: 'TAM used first (use-it-or-lose-it), then GAM for remainder',
    verified: false,
  },
  {
    id: '2026-gam-buydowns-est',
    date: '2026-03-01',
    type: 'GAM_SPENT',
    amount: 440_000,
    amountEstimated: true,
    description: '2026 GAM buydowns (ESTIMATE)',
    counterparty: 'Salary Buydowns',
    source: 'Estimated: $2.44M total - $2.0M TAM = $0.44M GAM needed',
    notes: 'GAM supplements TAM for cap compliance',
    verified: false,
  },
  
  // TODO: Add 2024 and 2025 buydown estimates when we have more detailed data
  // Historical buydowns are already accounted for in the MLS official GAM baseline

  // ============================================================================
  // VERIFIED TRANSACTIONS FROM OFFICIAL PRESS RELEASES
  // ============================================================================
  
  // Discovery Rights Trade with Minnesota United
  {
    id: '2022-minnesota-discovery-rights',
    date: '2022-01-01',
    type: 'GAM_TRADED_IN',
    amount: 50_000,
    amountEstimated: false,
    description: 'GAM received (2022) in trade of discovery rights to Kervin Arriaga',
    counterparty: 'Minnesota United FC',
    source: 'https://www.austinfc.com/news/austin-fc-trades-for-general-allocation-money',
    verified: true,
  },
  {
    id: '2023-minnesota-discovery-rights',
    date: '2023-01-01',
    type: 'GAM_TRADED_IN',
    amount: 50_000,
    amountEstimated: false,
    description: 'GAM received (2023) in trade of discovery rights to Kervin Arriaga',
    counterparty: 'Minnesota United FC',
    source: 'https://www.austinfc.com/news/austin-fc-trades-for-general-allocation-money',
    verified: true,
  },
  
  // Adam Lundkvist Trade from Houston
  {
    id: '2023-houston-lundkvist-2023gam',
    date: '2023-01-01',
    type: 'GAM_TRADED_OUT',
    amount: 300_000,
    amountEstimated: false,
    description: 'GAM sent (2023) to Houston in Adam Lundkvist trade',
    relatedPlayer: 'Adam Lundkvist',
    counterparty: 'Houston Dynamo FC',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-defender-adam-lundkvist-in-trade-with-houston-dynamo-fc',
    verified: true,
  },
  {
    id: '2024-houston-lundkvist-2024gam',
    date: '2024-01-01',
    type: 'GAM_TRADED_OUT',
    amount: 200_000,
    amountEstimated: false,
    description: 'GAM sent (2024) to Houston in Adam Lundkvist trade',
    relatedPlayer: 'Adam Lundkvist',
    counterparty: 'Houston Dynamo FC',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-defender-adam-lundkvist-in-trade-with-houston-dynamo-fc',
    verified: true,
  },
  
  // Diego Fagundez Trade to LA Galaxy
  {
    id: '2023-fagundez-la-galaxy',
    date: '2023-08-01',
    type: 'GAM_TRADED_IN',
    amount: 300_000,
    conditionalAmount: 600_000,
    conditionalTerms: 'Performance-based conditions',
    amountEstimated: false,
    description: 'GAM received in Diego Fagundez trade to LA Galaxy (guaranteed $300K 2023, up to $900K total)',
    relatedPlayer: 'Diego Fagundez',
    counterparty: 'LA Galaxy',
    source: 'https://www.austinfc.com/news/austin-fc-trades-diego-fagundez-to-la-galaxy-for-memo-rodriguez-and-general-allo',
    notes: 'Also received Memo Rodríguez in this trade',
    verified: true,
  },
  
  // U22 Initiative + International Slot Trade
  {
    id: '2024-u22-initiative-gam',
    date: '2024-01-01',
    type: 'GAM_RECEIVED',
    amount: 1_075_000,
    amountEstimated: false,
    description: 'GAM acquired via U22 Initiative participation and International Slot trade with Atlanta United',
    counterparty: 'MLS / Atlanta United',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-1-075-000-in-general-allocation-money',
    notes: 'Part of this was used to buy down Alex Ring contract',
    verified: true,
  },
  
  // International Slot Trade with New England
  {
    id: '2024-new-england-intl-slot-2024',
    date: '2024-01-01',
    type: 'GAM_TRADED_IN',
    amount: 75_000,
    amountEstimated: false,
    description: 'GAM received (2024) in International Roster Slot trade with New England',
    counterparty: 'New England Revolution',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-125-000-in-general-allocation-money-from-new-england',
    verified: true,
  },
  {
    id: '2025-new-england-intl-slot-2025',
    date: '2025-01-01',
    type: 'GAM_TRADED_IN',
    amount: 50_000,
    amountEstimated: false,
    description: 'GAM received (2025) in International Roster Slot trade with New England',
    counterparty: 'New England Revolution',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-125-000-in-general-allocation-money-from-new-england',
    verified: true,
  },
  
  // SuperDraft 2024 Trade with Colorado
  {
    id: '2024-superdraft-colorado',
    date: '2024-01-01',
    type: 'GAM_TRADED_IN',
    amount: 250_000,
    amountEstimated: false,
    description: 'GAM received from Colorado in SuperDraft 2024 trade (traded draft pick for GAM + pick)',
    relatedPlayer: 'Bryant Farkarlun',
    counterparty: 'Colorado Rapids',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-gam-and-selects-bryant-farkarlun-in-mls-superdraft-2024',
    verified: true,
  },
  
  // Robert Taylor Trade from Inter Miami
  {
    id: '2025-taylor-miami-2025gam',
    date: '2025-01-01',
    type: 'GAM_TRADED_OUT',
    amount: 450_000,
    amountEstimated: false,
    description: 'GAM sent (2025) to Inter Miami in Robert Taylor trade',
    relatedPlayer: 'Robert Taylor',
    counterparty: 'Inter Miami CF',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-robert-taylor-in-trade-with-inter-miami-cf',
    verified: true,
  },
  {
    id: '2026-taylor-miami-2026gam',
    date: '2026-03-01',  // Use March to avoid timezone issues
    type: 'GAM_TRADED_OUT',
    amount: 250_000,
    amountEstimated: false,
    description: 'GAM sent (2026) to Inter Miami in Robert Taylor trade',
    relatedPlayer: 'Robert Taylor',
    counterparty: 'Inter Miami CF',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-robert-taylor-in-trade-with-inter-miami-cf',
    verified: true,
  },
  
  // Stefan Cleveland Trade to Sporting Kansas City (2025)
  // Source: Matthew Doyle / Armchair Analyst
  {
    id: '2025-cleveland-to-skc',
    date: '2025-12-01',
    type: 'GAM_TRADED_IN',
    amount: 50_000,
    amountEstimated: false,
    description: 'GAM received from Sporting KC for Stefan Cleveland trade',
    relatedPlayer: 'Stefan Cleveland',
    counterparty: 'Sporting Kansas City',
    source: 'https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam',
    verified: true,
  },
  
  // Joseph Rosales Trade from Minnesota United (Dec 2025)
  // IMPORTANT CLARIFICATION on cash trades per 2025 MLS rules:
  // - Cash trades do NOT reduce GAM pool (Minnesota gets cash, not GAM from us)
  // - BUT cash IS amortized over contract and ADDED to player's budget charge!
  // - $1.5M / 3.5 years = ~$428K/year amortized onto Rosales's cap hit
  // - This means he needs ~$428K TAM to buy down to just his salary
  // Source: https://www.austinfc.com/news/austin-fc-trades-for-joseph-rosales
  // This entry tracks GAM only - see roster file for cap impact
  
  // Jayden Nelson Trade from Vancouver (Dec 18, 2025)
  // Note: Date set to 2026-03-01 because this is 2026 GAM being traded
  {
    id: '2026-nelson-vancouver-2026gam',
    date: '2026-03-01',  // 2026 GAM (trade happened Dec 2025)
    type: 'GAM_TRADED_OUT',
    amount: 700_000,
    amountEstimated: false,
    description: 'GAM sent (2026) to Vancouver in Jayden Nelson trade (Dec 2025)',
    relatedPlayer: 'Jayden Nelson',
    counterparty: 'Vancouver Whitecaps FC',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-winger-jayden-nelson-in-trade-with-vancouver',
    notes: 'Also sent $550K in 2027 GAM and 2026 MLS SuperDraft First Round pick. Vancouver retains sell-on percentage.',
    verified: true,
  },
  
  // ============================================================================
  // OUTGOING INTERNATIONAL TRANSFERS → GAM
  // Per MLS rules, clubs receive GAM from player sales abroad!
  // Source: https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309
  // ============================================================================
  
  // ============================================================================
  // SEBASTIÁN DRIUSSI SALE (Jan 2025 - Largest in club history!)
  // Source: https://www.transfermarkt.us/sebastian-driussi/profil/spieler/294853
  // 
  // ACTUAL TRANSFERMARKT DATA:
  // - Acquired from Zenit (Jul 2021): €6.40m (~$7.5M USD)
  // - Sold to River Plate (Jan 2025): €9.75m (~$11.4M USD)
  // 
  // ⚠️ CRITICAL: DRIUSSI WAS NOT ELIGIBLE TO BE BOUGHT DOWN!
  // 
  // MLS Rule: "If the DP is NOT eligible to be bought down, then that 
  // former club CANNOT convert the transfer fee into GAM at all."
  // 
  // Driussi's guaranteed compensation was ~$4.7M.
  // Even with max TAM ($2.1M), his charge would be ~$2.6M - still way
  // above the DP threshold (~$683K). He could NEVER be bought down.
  // 
  // Therefore: $0 GAM from Driussi sale.
  // ============================================================================
  // {
  //   id: '2024-driussi-sale-gam',
  //   date: '2025-01-17',
  //   type: 'PLAYER_SALE_GAM',
  //   amount: 0,  // DP not eligible to be bought down = $0 GAM
  //   description: 'NO GAM - Driussi was not eligible to be bought down (salary too high)',
  //   relatedPlayer: 'Sebastián Driussi',
  //   notes: 'Per MLS rules, DPs not eligible for buydown cannot generate GAM from sales.',
  // },

  // OSMAN BUKARI SALE (2025/26 Season) - NO GAM GENERATED
  // Sold to Widzew Lodz (Poland) for €5.50m, but acquired for €8M
  // NET RESULT: LOSS of ~€2.5M = $0 GAM (DP acquisition costs not recouped)
  // Not adding as transaction since it generated no allocation money.
  
  // CECILIO DOMÍNGUEZ - CONTRACT MUTUALLY TERMINATED (July 2022)
  // NOT a sale - no transfer fee, no GAM generated
  // Source: https://www.austinfc.com/news/austin-fc-cecilio-dominguez-mutually-agree-to-terminate-contract
  {
    id: '2027-nelson-vancouver-2027gam',
    date: '2027-03-01',
    type: 'GAM_TRADED_OUT',
    amount: 550_000,
    amountEstimated: false,
    description: 'GAM sent (2027) to Vancouver in Jayden Nelson trade',
    relatedPlayer: 'Jayden Nelson',
    counterparty: 'Vancouver Whitecaps FC',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-winger-jayden-nelson-in-trade-with-vancouver',
    verified: true,
  },
  {
    id: '2027-taylor-miami-conditional',
    date: '2027-01-01',
    type: 'GAM_TRADED_OUT',
    amount: 50_000,
    conditionalTerms: 'Conditional',
    amountEstimated: false,
    description: 'Conditional GAM (2027) to Inter Miami in Robert Taylor trade',
    relatedPlayer: 'Robert Taylor',
    counterparty: 'Inter Miami CF',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-robert-taylor-in-trade-with-inter-miami-cf',
    verified: true,
  },
];

// ============================================================================
// AUSTIN FC TRANSFER HISTORY (From Transfermarkt)
// Source: https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309
// 
// Key insight: Outgoing international transfers generate GAM!
// ============================================================================

export const AUSTIN_FC_TRANSFER_HISTORY = {
  // 2025/26 Season
  '2025-26': {
    arrivals: [
      { player: 'Joseph Rosales', fee: 1_500_000, feeEUR: 1_500_000, from: 'Minnesota United FC', type: 'MLS trade (CASH)' },
      { player: 'Jayden Nelson', fee: 1_250_000, feeEUR: 1_250_000, from: 'Vancouver Whitecaps FC', type: 'MLS trade (GAM)' },
      { player: 'Nicky Beloko', fee: 0, from: 'FC Luzern', type: 'Free' },
      { player: 'Jon Bell', fee: 0, from: 'Seattle Sounders FC', type: 'Free' },
      { player: 'Mateja Djordjević', fee: null, from: 'FK TSC Backa Topola', type: 'Unknown' },
    ],
    departures: [
      // Bukari sold at LOSS - $0 GAM (acquired €8M, sold €5.5M)
      { player: 'Osman Bukari', fee: 5_500_000, feeEUR: 5_500_000, to: 'Widzew Lodz', type: 'International', gam: 0 },
      { player: 'Stefan Cleveland', fee: 43_000, feeEUR: 43_000, to: 'Sporting Kansas City', type: 'MLS trade' },
      { player: 'Nicky Beloko', fee: 0, to: 'FC Lausanne-Sport', type: 'Free' },
      { player: 'Julio Cascante', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Diego Rubio', fee: 0, to: 'Without Club', type: 'Released' },
    ],
    netTransferRecord: '+€3.27m',
    estimatedGAMFromSales: 0,
    note: 'Bukari: $0 GAM - sold at LOSS (€5.5M sale vs €8M acquisition)',
  },
  
  // 2024/25 Season
  '2024-25': {
    arrivals: [
      { player: 'Myrto Uzuni', fee: 4_500_000, from: 'Granada CF', type: 'International' },
      { player: 'Osman Bukari', fee: 8_000_000, from: 'FK Crvena zvezda', type: 'International' },
      { player: 'Brandon Vazquez', fee: 7_500_000, from: 'FC Cincinnati', type: 'MLS trade' },
      { player: 'Robert Taylor', fee: 500_000, from: 'Inter Miami CF', type: 'MLS trade (GAM)' },
      { player: 'Dani Pereira', fee: 0, from: 'Orlando City SC', type: 'MLS trade' },
      { player: 'Guilherme Biro', fee: 1_500_000, from: 'Corinthians', type: 'International' },
      { player: 'Jon Gallagher', fee: 0, from: 'Aberdeen FC', type: 'Free' },
    ],
    departures: [
      // Driussi: DP NOT eligible to be bought down (salary ~$4.7M), so $0 GAM
      // Per Transfermarkt: acquired €6.4M (Jul 2021), sold €9.75M (Jan 2025)
      { player: 'Sebastián Driussi', fee: 9_750_000, feeEUR: 9_750_000, to: 'River Plate', type: 'International', gam: 0 },
      { player: 'Alex Ring', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Emiliano Rigoni', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Gyasi Zardes', fee: 0, to: 'Without Club', type: 'Released' },
    ],
    netTransferRecord: '+€3.35m',  // Driussi sold for profit per Transfermarkt
    estimatedGAMFromSales: 0,
    note: 'Driussi: $0 GAM - DP NOT eligible to be bought down (salary ~$4.7M exceeded buydown limit)',
  },
  
  // 2023/24 Season  
  '2023-24': {
    arrivals: [
      { player: 'Djordje Mihailovic', fee: 6_000_000, from: 'CF Montréal', type: 'MLS trade' },
      { player: 'Emiliano Rigoni', fee: 4_000_000, from: 'EC São Paulo', type: 'International' },
      { player: 'Leo Väisänen', fee: 650_000, from: 'IF Elfsborg', type: 'International' },
    ],
    departures: [
      { player: 'Diego Fagundez', fee: 0, to: 'LA Galaxy', type: 'MLS trade (received GAM)', gam: 900_000 },
      { player: 'Adam Lundqvist', fee: 0, to: 'IF Elfsborg', type: 'End of loan' },
    ],
    estimatedGAMFromSales: 0,
    gamFromMLSTrades: 900_000,
  },
  
  // 2022/23 Season
  '2022-23': {
    arrivals: [
      { player: 'Sebastián Driussi', fee: 6_400_000, feeEUR: 6_400_000, from: 'Zenit St. Petersburg', type: 'International' },
      { player: 'Danny Hoesen', fee: 0, from: 'D.C. United', type: 'Free' },
    ],
    departures: [
      // Domínguez contract mutually terminated July 2022 - NOT a sale, no fee, no GAM
      { player: 'Cecilio Domínguez', fee: 0, to: 'Contract Terminated', type: 'Mutual Termination', gam: 0 },
    ],
    estimatedGAMFromSales: 0,
    note: 'Domínguez contract mutually terminated - no transfer fee, no GAM generated',
  },
};

// ============================================================================
// GAM FROM OUTGOING SALES SUMMARY
// ============================================================================

export const GAM_FROM_PLAYER_SALES = {
  total: 900_000, // Total GAM from player sales/trades
  byYear: {
    2022: 0,         // Domínguez: $0 GAM - contract mutually terminated, not sold
    2023: 900_000,   // Fagundez (MLS trade GAM - traded to LA Galaxy)
    2024: 0,         // Driussi: $0 GAM - DP not eligible to be bought down (salary ~$4.7M)
    2025: 0,         // Bukari: $0 GAM - Sold at LOSS (€5.5M sale vs €8M acquisition)
  },
  note: 'CRITICAL: DPs not eligible for buydown cannot generate GAM. Contract terminations and losses generate $0 GAM.',
};

// ============================================================================
// VERIFIED NON-GAM PLAYER MOVEMENTS
// These players did NOT involve GAM in their departure/arrival
// ============================================================================

export const NON_GAM_MOVEMENTS = [
  {
    player: 'Alex Ring',
    movement: 'Contract extension',
    date: '2022-01-03',
    details: 'Signed multi-year extension with Austin FC (2022-2023 guaranteed, options for 2024-2025)',
    source: 'https://www.austinfc.com/news/austin-fc-club-captain-alex-ring-agree-to-new-contract',
    note: 'Ring was NOT traded away. His contract was bought down using U22 Initiative GAM.',
  },
  {
    player: 'Ethan Finlay',
    movement: 'Free agent signing',
    date: '2021-12-01',
    details: 'Joined Austin FC as a free agent',
    source: 'https://www.austinfc.com/news/austin-fc-signs-midfielder-ethan-finlay',
    note: 'No GAM involved in acquisition. Later re-signed in October 2023.',
  },
  {
    player: 'Ethan Finlay',
    movement: 'Contract extension',
    date: '2023-10-01',
    details: 'Re-signed with Austin FC through end of 2024 with option for 2025',
    source: 'https://www.austinfc.com/news/austin-fc-agrees-to-new-contract-with-ethan-finlay',
    note: 'Extension, not a trade. No GAM involved.',
  },
  {
    player: 'Diego Fagundez',
    movement: 'Contract extension (before trade)',
    date: '2022-12-09',
    details: 'Signed multi-year extension through end of 2025 with option for 2026',
    source: 'https://www.austinfc.com/news/austin-fc-diego-fagundez-agree-to-new-multi-year-contract',
    note: 'This was before his trade to LA Galaxy in August 2023.',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get only verified transactions
 */
export function getVerifiedTransactions(): AllocationTransaction[] {
  return austinFCAllocationHistory.filter(t => t.verified);
}

/**
 * Calculate GAM balance by year
 */
export function getGAMBalanceByYear(): Record<number, { received: number; spent: number; net: number }> {
  const byYear: Record<number, { received: number; spent: number; net: number }> = {};
  
  austinFCAllocationHistory.forEach(t => {
    if (!t.type.includes('GAM')) return;
    
    const year = new Date(t.date).getFullYear();
    if (!byYear[year]) {
      byYear[year] = { received: 0, spent: 0, net: 0 };
    }
    
    const amount = t.amount || 0;
    
    if (t.type === 'GAM_RECEIVED' || t.type === 'GAM_TRADED_IN' || t.type === 'PLAYER_SALE_GAM') {
      byYear[year].received += amount;
      byYear[year].net += amount;
    } else if (t.type === 'GAM_SPENT' || t.type === 'GAM_TRADED_OUT') {
      byYear[year].spent += amount;
      byYear[year].net -= amount;
    }
  });
  
  return byYear;
}

/**
 * Calculate TAM balance by year
 */
export function getTAMBalanceByYear(): Record<number, { received: number; spent: number; net: number }> {
  const byYear: Record<number, { received: number; spent: number; net: number }> = {};
  
  austinFCAllocationHistory.forEach(t => {
    if (!t.type.includes('TAM')) return;
    
    const year = new Date(t.date).getFullYear();
    if (!byYear[year]) {
      byYear[year] = { received: 0, spent: 0, net: 0 };
    }
    
    const amount = t.amount || 0;
    
    if (t.type === 'TAM_RECEIVED' || t.type === 'TAM_TRADED_IN') {
      byYear[year].received += amount;
      byYear[year].net += amount;
    } else if (t.type === 'TAM_SPENT' || t.type === 'TAM_TRADED_OUT' || t.type === 'BUYDOWN') {
      byYear[year].spent += amount;
      byYear[year].net -= amount;
    }
  });
  
  return byYear;
}

/**
 * Get transactions for a specific player
 */
export function getPlayerTransactions(playerName: string): AllocationTransaction[] {
  return austinFCAllocationHistory.filter(
    t => t.relatedPlayer?.toLowerCase().includes(playerName.toLowerCase())
  );
}

/**
 * Get transactions with a specific counterparty
 */
export function getTransactionsByCounterparty(teamName: string): AllocationTransaction[] {
  return austinFCAllocationHistory.filter(
    t => t.counterparty?.toLowerCase().includes(teamName.toLowerCase())
  );
}

// ============================================================================
// SUMMARY FOR AI CONTEXT
// ============================================================================

export const AUSTIN_FC_ALLOCATION_SUMMARY = `
# Austin FC Allocation Money Summary

## HOW THE SALARY CAP WORKS

**Key Concept: Total Budget Charge must fit under Salary Budget!**

1. Each player has a "budget charge" - what counts against the team's salary cap
2. The SUM of all budget charges must be ≤ Salary Budget (2026: $6.425M)
3. If total exceeds budget, team MUST use TAM/GAM to "buy down" player charges
4. The buydown reduces the cap hit, NOT the player's actual salary

**Example (2026):**
- Brandon Vazquez earns $3.55M but counts as only $803K (DP designation)
- Robert Taylor earns $633K and counts as $633K (under max, no buydown needed)
- If total budget charge is $8.86M vs $6.42M budget = need $2.44M in buydowns

## Annual Allocations by Year (CBA)

| Year | GAM | TAM | Salary Budget | Max Cap Hit |
|------|-----|-----|---------------|-------------|
| 2021 | $1.53M | $2.80M | $4.90M | $612K |
| 2022 | $1.63M | $2.80M | $4.90M | $612K |
| 2023 | $1.90M | $2.72M | $5.21M | $651K |
| 2024 | $2.59M | $2.40M | $5.47M | $684K |
| 2025 | $2.93M | $2.23M | $5.95M | $744K |
| 2026 | $3.28M | $2.13M | $6.43M | $803K |

## Estimated TAM/GAM Usage by Year

**2021:** ~$3.2M used (TAM: $2.4M, GAM: $0.8M)
- Inaugural roster building with multiple TAM-level signings

**2022:** ~$3.1M used (TAM: $2.5M, GAM: $0.6M)
- Driussi signed as DP (helps cap - $6.7M salary only counts as $612K)

**2023:** ~$2.5M used (TAM: $2.3M, GAM: $0.2M)
- Mid-year Fagundez trade freed cap space

**2024:** ~$2.4M used (TAM: $1.4M, GAM: $1.0M)
- VERIFIED: Ring buydown $981K GAM, Zardes buydown $316K TAM
- Declared U22 Initiative Model - got extra $1M GAM

**2025:** ~$2.1M used (TAM: $1.6M, GAM: $0.5M)
- VERIFIED: Cascante buydown $110K TAM
- 3 DPs (Vazquez, Uzuni, Bukari) helps minimize buydowns needed

**2026:** ~$2.44M needed (TAM: $2.0M est, GAM: $0.44M est)
- Budget charge $8.86M vs $6.42M budget
- 2 DPs (Vazquez, Uzuni), 3 U22s help
- All non-DP/U22 players under max cap hit = efficient roster construction

## Verified GAM Trades

**Received:**
- Minnesota (discovery rights): $100K total
- LA Galaxy (Fagundez): $300K + up to $600K conditional
- U22 Initiative: $1.075M (2024)
- New England (intl slot): $125K total
- Colorado (SuperDraft): $250K

**Sent:**
- Houston (Lundkvist): $500K total
- Inter Miami (Taylor): $750K total
- Vancouver (Nelson): $1.25M total (2026+2027)

## AUSTIN FC GAM STATUS (January 2026)

**Rolled-over GAM (as of Sept 2025):** $44,636 ← Very low!
**Source:** https://tacticsfreezone.substack.com/p/figuring-out-roughly-how-much-gam

### Recent Transactions:
- Cleveland to SKC: +$50K GAM
- Rosales from Minnesota: $1.5M CASH (not GAM!) - doesn't affect GAM pool
- Nelson from Vancouver: -$700K GAM (2026) + -$550K (2027)

### 2026 Position (before annual allocation):
Rolled-over: ~$44K + $50K - $700K = **-$605K** (small deficit)

### Add 2026 Annual Allocation:
-$605K + $3,280K = **~$2.67M available**

### Plus potential Bukari sale GAM:
If converted: +~$2.1M → Total: **~$4.3M**

---

## Previous Official Starting Point (2025)
Amount: $3,162,071
Source: https://www.mlssoccer.com/news/mls-publishes-2025-general-allocation-money-gam-available-to-clubs
As of: December 10, 2024 (entering 2025 season)

## GAM from Player Sales Abroad (Per MLS Rules)

| Year | Player | Fee | Est. GAM | Notes |
|------|--------|-----|----------|-------|
| 2022 | Cecilio Domínguez | €2M | ~$800K | Non-DP, normal tiers |
| 2025 | Sebastián Driussi | €9.75M | **$0** | DP NOT eligible to be bought down (salary ~$4.7M) |
| 2025 | Osman Bukari | €5.5M | **$0** | DP sold at LOSS (acquired €8M) |
| **Total** | | | **~$800K** | Only Domínguez generated GAM |

**Critical DP Rule:** "If a DP is NOT eligible to be bought down, the club CANNOT convert the transfer fee into GAM at all."

**Source:** https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309

## Outgoing Transfer → GAM Conversion Rules

When selling players abroad, MLS clubs receive GAM based on tiers:
- First $1M net revenue → 50% to GAM
- $1M-$3M → 40% to GAM  
- $3M+ → 25% to GAM
- **Max GAM per sale: $3,000,000** (per MLS 2025 publication)

Bonuses: +15% for homegrown, +10% for U23 players

## Key Rules
- GAM rolls over (as of 1/14/25) - unused carries to next season
- TAM does NOT roll over - use it or lose it each year
- TAM cannot be traded between clubs
- GAM can be traded
- **Outgoing international transfers generate GAM** (often overlooked!)
`;
