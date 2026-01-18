/**
 * Austin FC Salary Cap & Roster Data
 * 
 * SOURCE: The North End Podcast Spreadsheet
 * https://docs.google.com/spreadsheets/d/1YTpiweEHfmkVnxa3ilVW1CXaiKCADVcdbt9wqMNLmt4/
 * 
 * SALARY SOURCE: MLSPA Salary Guide (mlsplayers.org/resources/salary-guide)
 * 
 * Last Updated: January 2026
 */

// ============================================================================
// MLS CBA SALARY CAP PROGRESSION (2021-2027)
// From: Salary Cap & Free Agency Cliffnotes
// CBA Period: February 8, 2021 - January 31, 2028
// ============================================================================

export const MLS_CAP_BY_YEAR = {
  2021: {
    salaryBudget: 4_900_000,
    gam: 1_525_000,
    tam: 2_800_000,
    totalBudget: 9_225_000,
    maxCapHit: 612_500,
    seniorMinimum: 81_375,
    reserveMinimum: 63_547,
  },
  2022: {
    salaryBudget: 4_900_000,
    gam: 1_625_000,
    tam: 2_800_000,
    totalBudget: 9_325_000,
    maxCapHit: 612_500,
    seniorMinimum: 84_000,
    reserveMinimum: 65_500,
  },
  2023: {
    salaryBudget: 5_210_000,
    gam: 1_900_000,
    tam: 2_720_000,
    totalBudget: 9_830_000,
    maxCapHit: 651_250,
    seniorMinimum: 85_444,
    reserveMinimum: 67_360,
  },
  2024: {
    salaryBudget: 5_470_000,
    gam: 2_585_000,
    tam: 2_400_000,
    totalBudget: 10_455_000,
    maxCapHit: 683_750,
    seniorMinimum: 89_716,
    reserveMinimum: 71_401,
  },
  2025: {
    salaryBudget: 5_950_000,
    gam: 2_930_000,
    tam: 2_225_000,
    totalBudget: 11_105_000,
    maxCapHit: 743_750,
    seniorMinimum: 104_000,
    reserveMinimum: 80_622,
  },
  2026: {
    salaryBudget: 6_425_000,
    gam: 3_280_000,
    tam: 2_125_000,
    totalBudget: 11_830_000,
    maxCapHit: 803_125,
    seniorMinimum: 113_400,
    reserveMinimum: 88_025,
  },
  2027: {
    salaryBudget: 7_068_000,
    gam: 3_921_000,
    tam: 2_025_000,
    totalBudget: 13_014_000,
    maxCapHit: 883_438,
    seniorMinimum: 125_875,
    reserveMinimum: 97_700,
  },
};

// ============================================================================
// AUSTIN FC CAP STATUS BY YEAR
// ============================================================================

export const AUSTIN_FC_CAP_STATUS = {
  2024: {
    capSpace: 5_470_000,
    gamAvailable: 2_585_000,
    tamAvailable: 2_400_000,
    totalBudget: 10_455_000,
    budgetSpaceUsed: 9_388_483,
    budgetSpaceAvailable: 1_066_517,
    u22InitiativeGAM: 1_000_000, // Declared U22 Initiative Model in Aug 2024
    lastUpdated: '10/22/24',
  },
  2025: {
    capSpace: 5_950_000,
    gamAvailable: 2_930_000,
    tamAvailable: 2_225_000,
    disclosedGAM: 232_071, // First time MLS disclosed GAM totals (12/19/24)
    totalBudget: 11_337_071,
    budgetSpaceUsed: 9_020_256,
    budgetSpaceAvailable: 2_316_815,
    lastUpdated: '10/29/25',
  },
  2026: {
    capSpace: 6_425_000,
    gamAvailable: 3_280_000,
    tamAvailable: 2_125_000,
    disclosedGAM: 44_636, // Updated Sept 2025
    totalBudget: 11_874_636,
    budgetSpaceUsed: 8_310_672,
    budgetSpaceAvailable: 3_563_964,
    lastUpdated: '1/14/26',
  },
};

// ============================================================================
// 2026 AUSTIN FC ROSTER (Current Season)
// Source: North End Podcast + MLSPA
// ============================================================================

export interface NorthEndPlayer {
  name: string;
  rosterDesignation: string[];
  averageBaseSalary: number | 'Coming April \'26';
  guaranteedCompensation: number | 'Coming April \'26';
  capHit: number | 'Coming April \'26';
  knownGAMTAMUsed: number;
  contractExpiration: string;
  options: string | null;
  notes?: string;
}

export const northEndRoster2026: NorthEndPlayer[] = [
  // Designated Players
  {
    name: 'Brandon Vazquez',
    rosterDesignation: ['Designated Player'],
    averageBaseSalary: 3_200_000,
    guaranteedCompensation: 3_551_778,
    capHit: 803_125,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2028',
    options: 'Dec 2029',
  },
  {
    name: 'Myrto Uzuni',
    rosterDesignation: ['Designated Player', 'International'],
    averageBaseSalary: 1_520_000,
    guaranteedCompensation: 2_225_000,
    capHit: 803_125,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  
  // Senior Roster Players
  {
    name: 'Robert Taylor',
    rosterDesignation: [],
    averageBaseSalary: 575_000,
    guaranteedCompensation: 633_333,
    capHit: 633_333,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027 & Dec 2027',
  },
  {
    name: 'Mikkel Desler',
    rosterDesignation: [],
    averageBaseSalary: 550_000,
    guaranteedCompensation: 550_000,
    capHit: 550_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Besard Sabovic',
    rosterDesignation: ['International'],
    averageBaseSalary: 550_000,
    guaranteedCompensation: 550_000,
    capHit: 550_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Brad Stuver',
    rosterDesignation: [],
    averageBaseSalary: 484_500,
    guaranteedCompensation: 507_313,
    capHit: 507_313,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Jáder Obrian',
    rosterDesignation: ['International'],
    averageBaseSalary: 495_000,
    guaranteedCompensation: 505_401,
    capHit: 505_401,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027 & Dec 2027',
  },
  {
    name: 'Oleksandr Svatok',
    rosterDesignation: ['International'],
    averageBaseSalary: 500_000,
    guaranteedCompensation: 505_000,
    capHit: 505_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Ilie Sanchez',
    rosterDesignation: [],
    averageBaseSalary: 600_000,  // From 2025 - new contract Nov 2025
    guaranteedCompensation: 600_000,
    capHit: 600_000,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027 & Dec 2027',
    notes: 'Signed new contract Nov 2025, salary pending next MLSPA release',
  },
  {
    name: 'Dani Pereira',
    rosterDesignation: [],
    averageBaseSalary: 475_000,
    guaranteedCompensation: 514_375,
    capHit: 514_375,
    knownGAMTAMUsed: 0,
    contractExpiration: 'June 2028',
    options: 'June 2029',
  },
  {
    name: 'Jon Gallagher',
    rosterDesignation: [],
    averageBaseSalary: 375_000,
    guaranteedCompensation: 375_000,
    capHit: 375_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'June 2028',
    options: 'June 2029',
  },
  {
    name: 'Žan Kolmanič',
    rosterDesignation: [],
    averageBaseSalary: 350_000,
    guaranteedCompensation: 350_000,
    capHit: 350_000,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027 & Dec 2027',
  },
  {
    name: 'Brendan Hines-Ike',
    rosterDesignation: [],
    averageBaseSalary: 325_000,
    guaranteedCompensation: 325_000,
    capHit: 325_000,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: null,
  },
  {
    name: 'Guilherme Biro',
    rosterDesignation: ['International'],
    averageBaseSalary: 275_000,
    guaranteedCompensation: 275_000,
    capHit: 275_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Jayden Nelson',
    rosterDesignation: ['International'],
    averageBaseSalary: 360_000,
    guaranteedCompensation: 414_000,
    capHit: 414_000,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2028',
    options: 'Dec 2029',
  },
  
  // U22 Initiative Players
  {
    name: 'Nicolás Dubersarsky',
    rosterDesignation: ['U22 Initiative', 'International'],
    averageBaseSalary: 275_000,
    guaranteedCompensation: 297_986,
    capHit: 200_000,  // U22 reduced cap hit
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2029',
    options: 'Dec 2030',
  },
  {
    name: 'Mateja Djordjevic',
    rosterDesignation: ['U22 Initiative', 'International'],
    averageBaseSalary: 337_500,
    guaranteedCompensation: 347_500,
    capHit: 200_000,  // U22 reduced cap hit
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2028',
    options: 'Dec 2029',
  },
  {
    name: 'Owen Wolff',
    rosterDesignation: ['U22 Initiative'],
    averageBaseSalary: 'Coming April \'26',
    guaranteedCompensation: 'Coming April \'26',
    capHit: 200_000,  // U22 reduced cap hit
    knownGAMTAMUsed: 0,
    contractExpiration: 'June 2030',
    options: null,
    notes: 'New U22 contract signed Jan 2026',
  },
  
  // Pending MLSPA Release
  {
    name: 'Jon Bell',
    rosterDesignation: [],
    averageBaseSalary: 'Coming April \'26',
    guaranteedCompensation: 'Coming April \'26',
    capHit: 'Coming April \'26',
    knownGAMTAMUsed: 0,
    contractExpiration: 'June 2028',
    options: 'June 2029',
  },
  {
    name: 'Joseph Rosales',
    rosterDesignation: [],
    averageBaseSalary: 'Coming April \'26',
    guaranteedCompensation: 'Coming April \'26',
    capHit: 'Coming April \'26',
    knownGAMTAMUsed: 0,
    contractExpiration: 'June 2029',
    options: 'June 2030',
  },
  
  // Supplemental Roster / Homegrown
  {
    name: 'Damian Las',
    rosterDesignation: ['Homegrown', 'On Loan'],
    averageBaseSalary: 125_000,
    guaranteedCompensation: 125_000,
    capHit: 0,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'Micah Burton',
    rosterDesignation: ['Homegrown'],
    averageBaseSalary: 113_400,
    guaranteedCompensation: 115_000,
    capHit: 0,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028',
  },
  {
    name: 'CJ Fodrey',
    rosterDesignation: ['Generation Adidas'],
    averageBaseSalary: 113_400,
    guaranteedCompensation: 113_400,
    capHit: 0,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2027',
    options: 'Dec 2028 & Dec 2029',
  },
  {
    name: 'Ervin Torres',
    rosterDesignation: ['Homegrown'],
    averageBaseSalary: 88_025,  // Reserve minimum estimate
    guaranteedCompensation: 88_025,
    capHit: 0,
    knownGAMTAMUsed: 0,
    contractExpiration: 'Dec 2028',
    options: 'Dec 2029 & Dec 2030',
  },
  {
    name: 'Riley Thomas',
    rosterDesignation: [],
    averageBaseSalary: 88_025,  // Reserve minimum estimate
    guaranteedCompensation: 88_025,
    capHit: 0,
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027 & Dec 2027',
  },
];

// ============================================================================
// HISTORICAL 2025 ROSTER (For Reference)
// ============================================================================

export const northEndRoster2025: NorthEndPlayer[] = [
  {
    name: 'Brandon Vazquez',
    rosterDesignation: ['Designated Player'],
    averageBaseSalary: 3_200_000,
    guaranteedCompensation: 3_551_778,
    capHit: 743_750,
    knownGAMTAMUsed: 0,
    contractExpiration: '2028',
    options: '2029',
  },
  {
    name: 'Myrto Uzuni',
    rosterDesignation: ['Designated Player', 'International'],
    averageBaseSalary: 1_520_000,
    guaranteedCompensation: 2_225_000,
    capHit: 743_750,
    knownGAMTAMUsed: 0,
    contractExpiration: '2027',
    options: '2028',
  },
  {
    name: 'Osman Bukari',
    rosterDesignation: ['Designated Player', 'International'],
    averageBaseSalary: 1_500_000,
    guaranteedCompensation: 1_500_000,
    capHit: 743_750,
    knownGAMTAMUsed: 0,
    contractExpiration: '2027',
    options: '2028',
    notes: 'Transferred to Widzew Łódź Dec 2025',
  },
  {
    name: 'Julio Cascante',
    rosterDesignation: ['TAM Player'],
    averageBaseSalary: 780_000,
    guaranteedCompensation: 853_750,
    capHit: 743_750,
    knownGAMTAMUsed: 110_000,
    contractExpiration: '2025',
    options: '2026',
  },
  {
    name: 'Robert Taylor',
    rosterDesignation: [],
    averageBaseSalary: 575_000,
    guaranteedCompensation: 633_333,
    capHit: 150_000,  // Bought down by Inter Miami before trade
    knownGAMTAMUsed: 0,
    contractExpiration: '2026',
    options: '2027',
    notes: 'Cap hit was bought down with GAM to $150k by Inter Miami before trading to Austin',
  },
  // ... more 2025 players in original file
];

// ============================================================================
// HISTORICAL 2024 ROSTER (For Reference)
// ============================================================================

export const northEndRoster2024Summary = {
  totalGuaranteedComp: 17_578_236,
  totalCapHit: 8_982_233,
  totalGAMTAMUsed: 1_406_250,
  budgetSpaceUsed: 9_388_483,
  budgetSpaceAvailable: 1_066_517,
  u22InitiativeGAM: 1_000_000,
  
  keyPlayers: [
    { name: 'Sebastián Driussi', designation: 'DP', guaranteed: 6_722_500, capHit: 683_750 },
    { name: 'Osman Bukari', designation: 'DP + International', guaranteed: 1_000_000, capHit: 683_750 },
    { name: 'Alexander Ring', designation: 'TAM buydown', guaranteed: 1_665_000, capHit: 683_750, gamTamUsed: 1_000_000 },
    { name: 'Gyasi Zardes', designation: 'TAM Player', guaranteed: 1_000_000, capHit: 683_750, gamTamUsed: 316_250 },
  ],
};

// ============================================================================
// MLS RULES SUMMARY (From Cliffnotes)
// ============================================================================

export const MLS_RULES_SUMMARY = {
  // Allocation Money
  allocationMoney: {
    gam: {
      description: 'General Allocation Money',
      sources: [
        'Annual allotment from MLS',
        'Failure to qualify for playoffs',
        'Transferring player to non-MLS club',
        'Expansion teams being added',
        'DP charge distribution',
        'Qualifying for Concacaf Champions Cup',
      ],
      usage: [
        'Buy down player Salary Budget Charge',
        'Can be traded between clubs',
      ],
      expiration: 'No longer expires as of 1/14/25 (except U22 Initiative GAM)',
    },
    tam: {
      description: 'Targeted Allocation Money',
      usage: [
        'Sign new player earning > max cap hit',
        'Re-sign existing player earning > max cap hit',
        'Convert DP to non-DP (must simultaneously sign new DP or U22)',
        'Up to $200k for first MLS contract of Homegrown players',
      ],
      expiration: 'Cannot be traded',
    },
  },
  
  // Roster Construction Models (as of Aug 2024)
  rosterModels: {
    dpModel: {
      name: 'Designated Player Model',
      dpSlots: 3,
      u22Slots: 3,
    },
    u22Model: {
      name: 'U22 Initiative Player Model',
      dpSlots: 2,
      u22Slots: 4,
      bonusGAM: 2_000_000,
      gamExpiration: 'End of season received',
    },
    midseasonSwitch: {
      available: true,
      window: 'July 1 - Aug 21',
      dpToU22Requirements: 'No more than 2 DPs, can only invest up to $1M additional GAM',
      u22ToDPRequirements: 'Used $1M or less of additional GAM, no more than 3 U22 players',
    },
  },
  
  // New Rules (as of 1/14/25)
  newRules2025: [
    'GAM no longer expires (except U22 Initiative GAM)',
    'Unlimited out-of-pocket cash for player trades (max 2 players in/out per year)',
    'Can buy out 2 guaranteed contracts per year (including DP)',
    'Cash spent on trade acquisitions applied to player Salary Budget charge',
  ],
  
  // Designated Player
  dp: {
    maxSlots: 3,
    capCharge: 'Max cap hit (2026: $803,125)',
    youngDP: {
      ageRequirement: '23 years old or younger',
      capCharge: 200_000,
    },
    tradeable: false,
  },
  
  // U22 Initiative
  u22: {
    standardSlots: 3,
    bonusSlot: 'Available if declaring U22 Initiative Model',
    capCharge: 200_000,
    tradeable: false,
    occupies: 'Senior Roster spot',
  },
  
  // International Slots
  international: {
    perTeam: 8,
    tradeable: true,
    tradeIncrement: 'Full season',
    maxAcquirable: 'No limit',
  },
  
  // Free Agency (changes in 2026)
  freeAgency: {
    requirements: {
      age: 24,
      yearsOfService: 4, // Drops from 5 to 4 in 2026
    },
    compensation2026: {
      underMaxCapHit: 'Initial salary of $25k above max cap hit or 20% above prior salary (whichever greater)',
      aboveMaxCapHit: '20% above prior salary up to $500k above max, then 15% up to max TAM amount',
    },
  },
};

// ============================================================================
// YEAR-BY-YEAR CAP COMMITMENTS
// ============================================================================

export const AUSTIN_FC_CAP_COMMITMENTS = {
  2026: {
    goalkeepers: {
      'Brad Stuver': 507_313,
      'Damian Las': 0,
    },
    centerbacks: {
      'Brendan Hines-Ike': 325_000,
      'Oleksandr Svatok': 505_000,
      'Mateja Djordjevic': 200_000,
      'Jon Bell': 'Coming April \'26',
    },
    fullbacks: {
      'Mikkel Desler': 550_000,
      'Jon Gallagher': 375_000,
      'Žan Kolmanič': 350_000,
      'Guilherme Biro': 275_000,
      'Joseph Rosales': 'Coming April \'26',
      'Riley Thomas': 0,
    },
    midfielders: {
      'Dani Pereira': 514_375,
      'Nicolás Dubersarsky': 200_000,
      'Owen Wolff': 200_000,
      'Ilie Sanchez': 600_000,
      'Micah Burton': 0,
      'Besard Sabovic': 550_000,
      'Ervin Torres': 0,
    },
    wingers: {
      'Jayden Nelson': 414_000,
      'Jáder Obrian': 505_401,
      'Robert Taylor': 633_333,
      'CJ Fodrey': 0,
    },
    forwards: {
      'Brandon Vázquez': 803_125,
      'Myrto Uzuni': 803_125,
    },
    totalCommitted: 8_310_672,
  },
  
  // Future year commitments
  futureCommitments: {
    2027: 6_057_564,
    '2027-2028': 2_786_813,
    '2028-2029': 400_000,
    '2029-2030': 200_000,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getCurrentCapStatus() {
  return AUSTIN_FC_CAP_STATUS[2026];
}

export function getMLSRulesForYear(year: number) {
  return MLS_CAP_BY_YEAR[year as keyof typeof MLS_CAP_BY_YEAR];
}

export function calculateTotalCapHit2026(): number {
  return northEndRoster2026
    .filter(p => typeof p.capHit === 'number')
    .reduce((sum, p) => sum + (p.capHit as number), 0);
}

export function getInternationalPlayers2026() {
  return northEndRoster2026.filter(p => 
    p.rosterDesignation.includes('International')
  );
}

export function getU22Players2026() {
  return northEndRoster2026.filter(p => 
    p.rosterDesignation.includes('U22 Initiative')
  );
}

export function getDPs2026() {
  return northEndRoster2026.filter(p => 
    p.rosterDesignation.includes('Designated Player')
  );
}

// ============================================================================
// AI CONTEXT SUMMARY
// ============================================================================

export const NORTH_END_AI_SUMMARY = `
# Austin FC Cap & Roster Summary (January 2026)

## Current Season (2026) Status
- **Salary Budget:** $6,425,000
- **GAM Available:** $3,280,000
- **TAM Available:** $2,125,000
- **Disclosed GAM:** $44,636
- **Total Budget:** $11,874,636
- **Budget Used:** $8,310,672
- **Budget Available:** $3,563,964

## Key Salary Rules (2026)
- **Max Cap Hit:** $803,125 (DP charge)
- **Young DP/U22 Charge:** $200,000
- **Senior Minimum:** $113,400
- **Reserve Minimum:** $88,025

## Roster Construction
Austin FC has:
- **2 Designated Players:** Brandon Vazquez, Myrto Uzuni
- **3 U22 Initiative:** Nicolás Dubersarsky, Mateja Djordjevic, Owen Wolff
- **8 International Slots Used:** Uzuni, Sabovic, Svatok, Obrian, Biro, Dubersarsky, Djordjevic, Nelson

## Highest Paid Players (2026 Guaranteed)
1. Brandon Vazquez - $3,551,778 (DP)
2. Myrto Uzuni - $2,225,000 (DP)
3. Robert Taylor - $633,333
4. Ilie Sanchez - $600,000
5. Mikkel Desler - $550,000
6. Besard Sabovic - $550,000

## Recent Key Moves
- Osman Bukari transferred to Widzew Łódź (Dec 2025) - freed up DP slot
- Jon Gallagher extended through June 2028
- Dani Pereira extended through June 2028
- Owen Wolff signed to U22 Initiative contract
- Acquired: Jon Bell, Jayden Nelson, Joseph Rosales, Ervin Torres

## Cap Considerations
- Only $44,636 in disclosed GAM remaining (spent significantly in 2025)
- $3.56M in budget space available
- Calendar change in 2027 will affect contract end dates
- Several players on options that expire end of 2026
`;
