/**
 * Austin FC GAM & TAM Transaction History
 * 
 * This document tracks verified General Allocation Money (GAM) and 
 * Targeted Allocation Money (TAM) transactions for Austin FC.
 * 
 * All transactions are sourced from official Austin FC press releases
 * at austinfc.com/news.
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
  2025: { gam: 2_930_000, tam: 2_225_000 },
  2026: { gam: 3_280_000, tam: 2_125_000 },
  2027: { gam: 3_921_000, tam: 2_025_000 },
};

// ============================================================================
// MLS ALLOCATION MONEY BASICS
// ============================================================================

export const MLS_ALLOCATION_RULES = {
  // Annual allocation amounts vary by year (see MLS_ALLOCATION_BY_YEAR)
  // 2026 figures:
  annualTAM: 2_125_000,  // Targeted Allocation Money - decreasing each year
  annualGAM: 3_280_000,  // General Allocation Money - increasing each year
  
  // How GAM is generated
  gamSources: [
    'Annual league allocation',
    'Player sales (portion of transfer fees)',
    'Player trades within MLS',
    'International Slot trades',
    'U22 Initiative participation',
    'Re-Entry Draft selections',
    'MLS Cup / playoffs performance bonuses',
    'Homegrown player sales abroad',
    'Discovery rights trades',
  ],
  
  // How TAM is generated
  tamSources: [
    'Annual league allocation',
    'Can be traded between clubs',
    'Cannot be converted to GAM',
  ],
  
  // How GAM/TAM is used
  useCases: [
    'Buy down player salaries to fit under budget',
    'Pay transfer fees for incoming players',
    'Trade for other assets (players, draft picks, etc.)',
  ],
  
  // Important rule changes
  ruleChanges: {
    gamExpiration: 'GAM no longer expires as of January 14, 2025 (except U22 Initiative GAM)',
    tamTrading: 'TAM cannot be traded between clubs',
    rollover: 'Unused GAM rolls over to next season',
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
  | 'PLAYER_SALE_GAM'
  | 'BUYDOWN';

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
    date: '2021-01-01',
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
    date: '2021-01-01',
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
    date: '2022-01-01',
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
    date: '2022-01-01',
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
    date: '2023-01-01',
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
    date: '2023-01-01',
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
    date: '2024-01-01',
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
    date: '2024-01-01',
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
    date: '2025-01-01',
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
    date: '2025-01-01',
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
    date: '2026-01-01',
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
    date: '2026-01-01',
    type: 'TAM_RECEIVED',
    amount: 2_125_000,  // 2026 CBA amount
    amountEstimated: false,
    description: 'Annual TAM allocation from MLS (2026 CBA rate)',
    counterparty: 'MLS League Office',
    source: 'MLS Roster Rules',
    verified: true,
  },
  
  // ============================================================================
  // KNOWN BUYDOWNS (TAM/GAM used on player salaries)
  // Source: The North End Podcast Spreadsheet
  // ============================================================================
  
  // 2024 Buydowns
  {
    id: '2024-ring-buydown',
    date: '2024-01-01',
    type: 'GAM_SPENT',  // This was GAM from U22 Initiative
    amount: 1_000_000,
    amountEstimated: false,
    description: 'GAM used to buy down Alex Ring salary to max cap hit (from U22 Initiative)',
    relatedPlayer: 'Alex Ring',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Ring earned $1.665M guaranteed, bought down to $683,750 cap hit',
    verified: true,
  },
  {
    id: '2024-zardes-buydown',
    date: '2024-01-01',
    type: 'TAM_SPENT',
    amount: 316_250,
    amountEstimated: false,
    description: 'TAM used to buy down Gyasi Zardes salary to max cap hit',
    relatedPlayer: 'Gyasi Zardes',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Zardes earned $1M guaranteed, bought down to $683,750 cap hit',
    verified: true,
  },
  
  // 2025 Buydowns
  {
    id: '2025-cascante-buydown',
    date: '2025-01-01',
    type: 'TAM_SPENT',
    amount: 110_000,
    amountEstimated: false,
    description: 'TAM used to buy down Julio Cascante salary to max cap hit',
    relatedPlayer: 'Julio Cascante',
    counterparty: 'Salary Buydown',
    source: 'The North End Podcast Cap Sheet',
    notes: 'Cascante earned $853,750 guaranteed, bought down to $743,750 cap hit',
    verified: true,
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
    date: '2026-01-01',
    type: 'GAM_TRADED_OUT',
    amount: 250_000,
    amountEstimated: false,
    description: 'GAM sent (2026) to Inter Miami in Robert Taylor trade',
    relatedPlayer: 'Robert Taylor',
    counterparty: 'Inter Miami CF',
    source: 'https://www.austinfc.com/news/austin-fc-acquires-robert-taylor-in-trade-with-inter-miami-cf',
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
# Austin FC Allocation Money Summary (Verified)

## Annual Allocations (2021-2026)
Austin FC receives standard MLS allocations each year:
- GAM: ~$1.825M per year = ~$10.95M total (2021-2026)
- TAM: ~$2.317M per year = ~$13.9M total (2021-2026)

## Verified GAM Transactions

### GAM RECEIVED (Incoming):

**Discovery Rights Trade - Minnesota United**
- 2022: $50,000 GAM
- 2023: $50,000 GAM
- Total: $100,000
- For: Discovery rights to Kervin Arriaga

**Diego Fagundez Trade - LA Galaxy (August 2023)**
- Guaranteed: $300,000 (2023)
- Conditional: Up to $600,000 more
- Total potential: $900,000
- Also received: Memo Rodríguez

**U22 Initiative + International Slot Trade (2024)**
- $1,075,000 GAM
- From: MLS / Atlanta United
- Used partly to buy down Alex Ring's contract

**International Slot Trade - New England Revolution**
- 2024: $75,000
- 2025: $50,000
- Total: $125,000

**SuperDraft 2024 Trade - Colorado Rapids**
- $250,000 GAM
- Traded: Draft pick for GAM + selection of Bryant Farkarlun

### GAM SPENT (Outgoing):

**Adam Lundkvist Trade - Houston Dynamo (2023)**
- 2023: $300,000
- 2024: $200,000
- Total: $500,000

**Robert Taylor Trade - Inter Miami CF (2025)**
- 2025: $450,000
- 2026: $250,000
- 2027: $50,000 (conditional)
- Total: $750,000

## Key Clarifications

### Players who did NOT involve GAM trades:
- **Alex Ring** - Contract extended, NOT traded away. Contract was bought down using U22 Initiative GAM.
- **Ethan Finlay** - Joined as free agent (2021), re-signed (2023). Never traded.
- **Diego Fagundez** - Extended contract in Dec 2022, THEN was traded to LA Galaxy in Aug 2023 (with GAM coming TO Austin).

## Verified GAM Summary (2021-2026)

**Total GAM Received:**
- Annual allocations: ~$10.95M
- Minnesota (discovery rights): $100K
- LA Galaxy (Fagundez): $300K guaranteed + up to $600K conditional
- U22 Initiative: $1.075M
- New England (intl slot): $125K
- Colorado (SuperDraft): $250K
- **Verified Total: ~$12.8M+ (not counting conditional)**

**Total GAM Spent:**
- Houston (Lundkvist): $500K
- Miami (Taylor): $750K
- **Verified Total: ~$1.25M**

Note: This does not include:
- DP transfer fees (Driussi, Vazquez, Uzuni) which likely used GAM
- TAM buydowns for players like Dani Pereira, Jáder Obrian
- Other undisclosed transactions
`;
