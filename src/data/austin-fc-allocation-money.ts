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
    bukariSaleGAM: 1_900_000,           // Estimated from €5.5M sale (if converted)
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
    - Bukari sale GAM (if converted): +$1,900,000
    
    PROJECTED 2026 GAM AVAILABLE:
    -$605K + $3.28M + $0.25M + $1.9M = ~$4.82M
    
    Without Bukari conversion: ~$2.92M available
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
    available2026: 3_280_000 + 250_000 + 0 - 605_364, // = $2,924,636
    
    // Reserved for cap compliance
    estimatedBuydownsNeeded: 1_900_000, // To bring $8.31M charge under $6.43M budget
    
    // Free GAM after compliance
    freeGAM: 3_280_000 + 250_000 + 0 - 605_364 - 1_900_000, // = $1,024,636
  },
  
  // =====================================================
  // TAM POSITION  
  // =====================================================
  tam: {
    annualAllocation: 2_125_000,
    
    // TAM is used first for buydowns (use-it-or-lose-it)
    estimatedBuydownsUsed: 1_500_000,
    
    // Available for new signings
    available: 2_125_000 - 1_500_000, // = $625,000
  },
  
  // =====================================================
  // COMBINED FLEXIBILITY
  // =====================================================
  combined: {
    // For new signings (after cap compliance)
    freeGAM: 1_024_636,       // Much lower without Bukari GAM!
    freeTAM: 625_000,
    totalFlexibility: 1_024_636 + 625_000, // = $1,649,636
    
    // For trades
    tradeableGAM: 1_024_636,  // GAM is tradeable
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
    'Bukari sale GAM converted at ~$1.9M (€5.5M × tier conversion)',
    'TAM used first for buydowns before GAM',
    'Budget charge ~$8.31M needs ~$1.9M buydown to fit $6.43M budget',
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
  // ============================================================================
  
  // 2021 - Austin FC's first year
  {
    id: '2021-gam-annual',
    date: '2021-03-01',  // Use March to avoid timezone issues
    type: 'GAM_RECEIVED',
    amount: 1_525_000,  // 2021 CBA amount
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
    amount: 2_800_000,  // 2021 CBA amount
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
    amount: 1_625_000,  // 2022 CBA amount
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
    amount: 2_800_000,  // 2022 CBA amount
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
    amount: 1_900_000,  // 2023 CBA amount
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
    amount: 2_720_000,  // 2023 CBA amount - TAM starts decreasing
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
  
  // ============================================================================
  // TAM/GAM BUYDOWNS BY YEAR
  // 
  // KEY CONCEPT: Total Budget Charge must be under Salary Budget!
  // - Salary Budget (2026): $6,425,000
  // - If total budget charge exceeds this, must use TAM/GAM to buy down
  // - TAM/GAM reduces individual player's budget charge (not their actual salary)
  // 
  // Source: The North End Podcast Spreadsheet + MLS roster compliance
  // ============================================================================
  
  // --- 2021 BUYDOWNS ---
  // Austin FC's inaugural season
  // Salary Budget: $4.9M | Total payroll much higher
  // Key players needing buydowns: Cecilio Domínguez (DP), Tomás Pochettino, etc.
  {
    id: '2021-tam-buydowns',
    date: '2021-03-01',
    type: 'TAM_SPENT',
    amount: 2_400_000,
    amountEstimated: true,
    description: '2021 TAM used for salary buydowns to fit under $4.9M budget',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'Inaugural roster: Domínguez (DP), Pochettino, Ring, Cascante, etc. all needed buydowns',
    verified: false,
  },
  {
    id: '2021-gam-buydowns',
    date: '2021-03-01',
    type: 'GAM_SPENT',
    amount: 800_000,
    amountEstimated: true,
    description: '2021 GAM used for additional salary buydowns',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'GAM used alongside TAM to get total budget charge under $4.9M',
    verified: false,
  },
  
  // --- 2022 BUYDOWNS ---
  // Salary Budget: $4.9M | Driussi signed as DP
  // Key additions: Sebastián Driussi (DP - $6.7M salary!)
  {
    id: '2022-tam-buydowns',
    date: '2022-03-01',
    type: 'TAM_SPENT',
    amount: 2_500_000,
    amountEstimated: true,
    description: '2022 TAM used for salary buydowns (Ring, Cascante, Urruti, etc.)',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'Driussi as DP helped - his $6.7M only counts as $612K against cap',
    verified: false,
  },
  {
    id: '2022-gam-buydowns',
    date: '2022-03-01',
    type: 'GAM_SPENT',
    amount: 600_000,
    amountEstimated: true,
    description: '2022 GAM used for additional salary buydowns',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'GAM supplements TAM for cap compliance',
    verified: false,
  },
  
  // --- 2023 BUYDOWNS ---
  // Salary Budget: $5.21M | Driussi still DP, Ring extended
  // Mid-season: Fagundez traded to LA Galaxy
  {
    id: '2023-tam-buydowns',
    date: '2023-03-01',
    type: 'TAM_SPENT',
    amount: 2_300_000,
    amountEstimated: true,
    description: '2023 TAM used for salary buydowns (Ring $1.6M, Cascante $800K, etc.)',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'Ring earning $1.6M+ needed significant buydown to fit under max cap hit',
    verified: false,
  },
  {
    id: '2023-gam-buydowns',
    date: '2023-03-01',
    type: 'GAM_SPENT',
    amount: 200_000,
    amountEstimated: true,
    description: '2023 GAM used for additional salary buydowns',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster construction',
    notes: 'Less GAM needed due to Fagundez trade freeing cap space',
    verified: false,
  },
  
  // --- 2024 BUYDOWNS (VERIFIED from North End) ---
  // Salary Budget: $5.47M | Max Cap Hit: $683,750
  // Total GAM/TAM used: $1,406,250 per North End
  // Key: Declared U22 Initiative Model - received $1M extra GAM
  {
    id: '2024-ring-buydown',
    date: '2024-03-01',
    type: 'GAM_SPENT',
    amount: 981_250,
    amountEstimated: false,
    description: 'GAM buydown: Alex Ring ($1.665M → $683,750 cap hit)',
    relatedPlayer: 'Alex Ring',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Used U22 Initiative GAM. Ring: $1,665,000 - $683,750 = $981,250 buydown',
    verified: true,
  },
  {
    id: '2024-zardes-buydown',
    date: '2024-03-01',
    type: 'TAM_SPENT',
    amount: 316_250,
    amountEstimated: false,
    description: 'TAM buydown: Gyasi Zardes ($1M → $683,750 cap hit)',
    relatedPlayer: 'Gyasi Zardes',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Zardes: $1,000,000 - $683,750 = $316,250 buydown needed',
    verified: true,
  },
  {
    id: '2024-cascante-buydown-tam',
    date: '2024-03-01',
    type: 'TAM_SPENT',
    amount: 170_000,
    amountEstimated: true,
    description: 'TAM buydown: Julio Cascante ($853K → $683,750 cap hit)',
    relatedPlayer: 'Julio Cascante',
    counterparty: 'Salary Buydown',
    source: 'Estimated based on salary data',
    notes: 'Cascante: $853,750 - $683,750 = $170,000 buydown needed',
    verified: false,
  },
  {
    id: '2024-other-tam-buydowns',
    date: '2024-03-01',
    type: 'TAM_SPENT',
    amount: 913_750,
    amountEstimated: true,
    description: 'TAM buydowns: Other players above max cap hit (Urruti, Lima, etc.)',
    counterparty: 'Salary Buydowns',
    source: 'Estimated to reach North End total of $1.4M GAM/TAM',
    notes: 'Total 2024 GAM/TAM per North End: $1,406,250',
    verified: false,
  },
  
  // --- 2025 BUYDOWNS ---
  // Salary Budget: $5.95M | Max Cap Hit: $743,750
  // 3 DPs: Vazquez, Uzuni, Bukari (each count as $743,750)
  // Total roster payroll: ~$17M+ | Must fit under $5.95M budget!
  {
    id: '2025-cascante-buydown',
    date: '2025-03-01',
    type: 'TAM_SPENT',
    amount: 110_000,
    amountEstimated: false,
    description: 'TAM buydown: Julio Cascante ($853,750 → $743,750 cap hit)',
    relatedPlayer: 'Julio Cascante',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Cascante: $853,750 - $743,750 = $110,000 buydown',
    verified: true,
  },
  {
    id: '2025-taylor-buydown',
    date: '2025-03-01',
    type: 'GAM_SPENT',
    amount: 483_333,
    amountEstimated: true,
    description: 'Robert Taylor arrived with cap hit pre-bought down by Miami',
    relatedPlayer: 'Robert Taylor',
    counterparty: 'Trade - Inter Miami',
    source: 'North End notes - Miami bought down before trade',
    notes: 'Taylor: $633K salary but traded with $150K cap hit (Miami used their GAM)',
    verified: false,
  },
  {
    id: '2025-other-tam-buydowns',
    date: '2025-03-01',
    type: 'TAM_SPENT',
    amount: 1_500_000,
    amountEstimated: true,
    description: 'TAM buydowns: Senior roster players above max cap hit',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster salaries vs budget',
    notes: 'Multiple players in $500K-$750K range needed partial buydowns',
    verified: false,
  },
  
  // --- 2026 BUYDOWNS ---
  // Salary Budget: $6,425,000 | Max Cap Hit: $803,125
  // 2 DPs: Vazquez ($3.55M), Uzuni ($2.23M) - each count as $803,125
  // 3 U22: Dubersarsky, Djordjevic, Wolff - each count as $200,000
  // 
  // MUST use TAM/GAM to get total budget charge under $6.425M!
  // Current total budget charge: ~$8.31M (per North End)
  // Budget needed: $8.31M - $6.425M = ~$1.89M in buydowns
  {
    id: '2026-tam-buydowns',
    date: '2026-03-01',  // Use March to avoid timezone issues
    type: 'TAM_SPENT',
    amount: 1_500_000,
    amountEstimated: true,
    description: '2026 TAM used for salary buydowns to fit under $6.425M budget',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on roster total of $8.31M charge vs $6.425M budget',
    notes: 'Total charge ~$8.31M, budget $6.425M = ~$1.89M buydowns needed. TAM covers most.',
    verified: false,
  },
  {
    id: '2026-gam-buydowns',
    date: '2026-03-01',  // Use March to avoid timezone issues
    type: 'GAM_SPENT',
    amount: 400_000,
    amountEstimated: true,
    description: '2026 GAM used for additional buydowns beyond TAM',
    counterparty: 'Salary Buydowns',
    source: 'Estimated based on remaining buydown needs',
    notes: 'GAM supplements TAM to achieve full cap compliance',
    verified: false,
  },

  // ============================================================================
  // VERIFIED TRANSACTIONS FROM OFFICIAL PRESS RELEASES
  // ============================================================================
  
  // Discovery Rights Trade with Minnesota United
  {
    id: '2022-minnesota-discovery-rights',
    date: '2022-01-01', // Exact date TBD
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
    conditionalAmount: 600_000,  // Up to $900K total
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

  // OSMAN BUKARI SALE (2025/26 Season)
  // Sold to Widzew Lodz (Poland) for €5.50m (~$6.4M USD)
  // 
  // CRITICAL: Bukari was a DP! Acquisition costs must be recouped first.
  // Bukari acquired for €8M (~$8.5M) from Red Star Belgrade in 2024
  // Sale price: €5.5M (~$6.4M)
  // NET RESULT: LOSS of ~€2.5M
  // 
  // Because Austin FC LOST money on Bukari, there is NO net revenue
  // eligible for GAM conversion. GAM = $0
  {
    id: '2025-bukari-sale-gam',
    date: '2025-12-19',
    type: 'PLAYER_SALE_GAM',
    amount: 0,  // $0 - Sold at a loss, acquisition costs not recouped
    amountEstimated: false,
    description: 'Bukari sale - NO GAM (sold at loss: €5.5M sale vs €8M acquisition)',
    relatedPlayer: 'Osman Bukari',
    counterparty: 'Widzew Lodz (Poland)',
    source: 'https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309',
    notes: 'DP acquisition costs must be recouped before GAM is generated. Austin lost ~€2.5M on this transfer.',
    verified: true,  // Rule is clear: no profit = no GAM
  },
  
  // CECILIO DOMÍNGUEZ SALE (2022)
  // Sold to Club Guaraní (Paraguay) for €2m (~$2.3M USD)
  {
    id: '2022-dominguez-sale-gam',
    date: '2022-06-01',
    type: 'PLAYER_SALE_GAM',
    amount: 800_000,
    amountEstimated: true,
    description: 'GAM from Cecilio Domínguez sale to Club Guaraní (€2m / ~$2.3M)',
    relatedPlayer: 'Cecilio Domínguez',
    counterparty: 'Club Guaraní (Paraguay)',
    source: 'https://www.transfermarkt.us/austin-fc/alletransfers/verein/72309',
    notes: 'Net ~$2M × tiered rates = ~$800K GAM',
    verified: false,
  },
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
      // THIS IS THE BIG ONE - Generates ~$1.9M GAM!
      { player: 'Osman Bukari', fee: 5_500_000, feeEUR: 5_500_000, to: 'Widzew Lodz', type: 'International', gam: 1_900_000 },
      { player: 'Stefan Cleveland', fee: 43_000, feeEUR: 43_000, to: 'Sporting Kansas City', type: 'MLS trade' },
      { player: 'Nicky Beloko', fee: 0, to: 'FC Lausanne-Sport', type: 'Free' },
      { player: 'Julio Cascante', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Diego Rubio', fee: 0, to: 'Without Club', type: 'Released' },
    ],
    netTransferRecord: '+€3.27m',
    estimatedGAMFromSales: 1_900_000,
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
      { player: 'Sebastián Driussi', fee: 14_000_000, to: 'River Plate', type: 'International', gam: 2_750_000 },
      { player: 'Alex Ring', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Emiliano Rigoni', fee: 0, to: 'Without Club', type: 'Released' },
      { player: 'Gyasi Zardes', fee: 0, to: 'Without Club', type: 'Released' },
    ],
    netTransferRecord: '+€3.35m',  // Driussi sold for profit per Transfermarkt
    estimatedGAMFromSales: 0,
    note: 'Driussi sale €9.75m → $0 GAM (DP not eligible to be bought down, salary too high)',
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
      { player: 'Sebastián Driussi', fee: 9_000_000, from: 'Zenit St. Petersburg', type: 'International' },
      { player: 'Danny Hoesen', fee: 0, from: 'D.C. United', type: 'Free' },
    ],
    departures: [
      { player: 'Cecilio Domínguez', fee: 2_000_000, to: 'Club Guaraní', type: 'International', gam: 800_000 },
    ],
    estimatedGAMFromSales: 800_000,
  },
};

// ============================================================================
// GAM FROM OUTGOING SALES SUMMARY
// ============================================================================

export const GAM_FROM_PLAYER_SALES = {
  total: 8_350_000, // Approximate total GAM from all player sales
  byYear: {
    2022: 800_000,   // Cecilio Domínguez
    2023: 900_000,   // Fagundez (MLS trade GAM)
    2024: 2_750_000, // Driussi (max GAM cap)
    2025: 1_900_000, // Bukari
  },
  note: 'Player sales abroad are a MAJOR source of GAM that offset acquisitions!',
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
- If total budget charge is $8.31M vs $6.425M budget = need $1.89M in buydowns

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

**2026:** ~$1.9M needed (TAM: $1.5M est, GAM: $0.4M est)
- Budget charge ~$8.31M vs $6.425M budget
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
If converted: +~$1.9M → Total: **~$4.6M**

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
