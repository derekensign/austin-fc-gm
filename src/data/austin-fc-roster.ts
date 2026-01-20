/**
 * Austin FC Roster Data (2026 Season)
 * 
 * DATA SOURCES:
 * - Salaries: MLSPA Salary Guide (mlsplayers.org/resources/salary-guide) - SOURCE OF TRUTH
 * - Roster/Designations: https://www.austinfc.com/roster/
 * - Cap Hit Calculations: The North End Podcast Spreadsheet (HIGH CONFIDENCE)
 * - Transactions: Official Austin FC press releases
 * 
 * Last Updated: January 2026
 * 
 * 2026 SALARY CAP:
 * - Salary Budget: $6,425,000 (up from $5.95M in 2025)
 * - Max Cap Hit: $803,125 (DP charge)
 * - TAM: $2,125,000 | GAM: $3,280,000
 * - Senior Min: $113,400 | Reserve Min: $88,025
 * 
 * SALARY CAP EXPLANATION:
 * - Guaranteed Compensation = Actual salary (from MLSPA)
 * - Budget Charge = What counts against the $6.425M salary cap
 * - TAM/GAM = Allocation money used to "buy down" budget charges
 * 
 * Example: Player earns $1.2M, team applies $500K TAM → Budget charge = $700K
 * The player still gets paid $1.2M, but only $700K counts against the cap.
 * 
 * ⚠️ TRANSFER FEE WARNING (MLSPA DATA LIMITATION):
 * Transfer fees are AMORTIZED over contract years and ADD to budget charge!
 * Formula: Annual Budget Charge = Base Salary + (Transfer Fee ÷ Contract Years)
 * 
 * MLSPA reports ONLY salaries, NOT transfer fees. So MLSPA data alone 
 * UNDERSTATES true budget charges for players acquired via transfer.
 * 
 * EXEMPTIONS (where fees DON'T add to cap):
 * - DP: Budget charge capped at $803,125 regardless of fee
 * - U22: Budget charge fixed at $150K-$200K regardless of fee
 * 
 * For non-exempt players, GAM/TAM must buy down BOTH salary AND amortized fee!
 */

// Country code to flag emoji mapping
export const countryFlags: Record<string, string> = {
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'Argentina': '🇦🇷',
  'Brazil': '🇧🇷',
  'Canada': '🇨🇦',
  'Colombia': '🇨🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Ghana': '🇬🇭',
  'Honduras': '🇭🇳',
  'Ireland': '🇮🇪',
  'Poland': '🇵🇱',
  'Serbia': '🇷🇸',
  'Slovenia': '🇸🇮',
  'Spain': '🇪🇸',
  'Sweden': '🇸🇪',
  'Ukraine': '🇺🇦',
  'Venezuela': '🇻🇪',
  'Albania': '🇦🇱',
  'Mexico': '🇲🇽',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Netherlands': '🇳🇱',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Jamaica': '🇯🇲',
  'Ecuador': '🇪🇨',
  'Peru': '🇵🇪',
  'Chile': '🇨🇱',
  'Uruguay': '🇺🇾',
  'Paraguay': '🇵🇾',
};

export type PlayerDesignation = 'DP' | 'TAM' | 'U22' | 'Senior' | 'Supplemental' | 'Homegrown' | 'GA';
export type RosterSlotType = 'Senior' | 'Supplemental';
export type PositionGroup = 'GK' | 'DEF' | 'MID' | 'FWD';

// Helper to build player image URL from asset ID
// Using Cloudinary face-detection thumb crop - z_1.5 zooms in tighter on face
const playerImg = (id: string) => `https://images.mlssoccer.com/image/private/c_thumb,g_face,w_100,h_100,z_1.3,q_auto:best/mls-atx/${id}.jpg`;

export interface AustinFCPlayer {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  number: number | null;
  position: string;
  positionGroup: PositionGroup;
  age: number;
  nationality: string;
  countryCode: string;
  photo: string;
  
  // Salary (from MLSPA)
  baseSalary: number;
  guaranteedCompensation: number;  // What player actually earns
  
  // Cap Mechanisms
  tamApplied: number;              // TAM used to buy down
  gamApplied: number;              // GAM used to buy down
  budgetCharge: number;            // What counts against cap (calculated)
  
  contractEnd: string;
  
  // MLS Designations (from austinfc.com)
  designation: PlayerDesignation;
  rosterSlot: RosterSlotType;
  isInternational: boolean;
  isHomegrown: boolean;
  isU22: boolean;
  isDP: boolean;
  isGenerationAdidas: boolean;
  
  // Market Value (estimated)
  marketValue: number;
  
  // Acquisition info
  acquisitionDate?: string;
  previousClub?: string;
  
  // Transfer Fee / Acquisition Cost (CRITICAL for cap calculation!)
  // ⚠️ IMPORTANT DISTINCTION:
  // - CASH transfer fees: Get amortized over contract, ADD to budget charge
  // - GAM transfer fees: Do NOT affect budget charge (one-time GAM pool expenditure)
  // 
  // For non-DP/non-U22 players, amortized CASH fee ADDS to budget charge
  // Formula: Annual Acquisition Cost = transferFee / contractYearsGuaranteed
  transferFee?: number;              // CASH fee paid (gets amortized, adds to cap)
  gamTransferFee?: number;           // GAM fee paid (does NOT affect budget charge!)
  contractYearsGuaranteed?: number;  // Years to amortize CASH fee over
  amortizedAnnualFee?: number;       // Calculated: CASH transferFee / years (adds to cap for non-exempt)
  
  // True budget charge before TAM/GAM buydowns (for analytics)
  trueBudgetCharge?: number;         // Salary + amortized fee (what it would cost without buydowns)
}

// MLS 2026 Constants (from CBA via North End Podcast)
export const MLS_2026_RULES = {
  salaryBudget: 6_425_000,        // Up from $5.95M in 2025
  maxBudgetCharge: 803_125,       // Above this = DP or needs TAM
  dpBudgetCharge: 803_125,        // What DPs count as
  youngDPBudgetCharge: 200_000,   // Young DP (≤23) charge
  u22BudgetCharge: 200_000,       // U22 Initiative charge
  seniorMinSalary: 113_400,       // Up from $104K in 2025
  reserveMinSalary: 88_025,       // Up from $80,622 in 2025
  maxSeniorRoster: 20,
  maxSupplementalRoster: 10,
  maxInternationalSlots: 8,
  tamAnnual: 2_125_000,           // Down from $2.225M in 2025
  gamAnnual: 3_280_000,           // Up from $2.93M in 2025
  maxBuyoutsPerYear: 2,           // Contract buyouts allowed per year
  maxCashTransfersPerWindow: 2,   // Cash transfers per trade window
};

// Austin FC 2026 Transaction Usage Tracking
export const AUSTIN_FC_2026_TRANSACTIONS = {
  buyoutsUsed: 0,                 // No buyouts used yet in 2026
  buyoutsAvailable: 2,
  cashTransfersUsed: 1,           // Rosales ($1.5M cash from Minnesota)
  cashTransfersAvailable: 1,
  notes: [
    'Joseph Rosales acquired via $1.5M cash transfer (Dec 2025)',
  ],
};

/**
 * AUSTIN FC 2026 ROSTER
 * Source: https://www.austinfc.com/roster/
 * Images scraped from official roster page
 */
export const austinFCRoster: AustinFCPlayer[] = [
  // ============ GOALKEEPERS ============
  {
    id: 1,
    name: 'Brad Stuver',
    firstName: 'Brad',
    lastName: 'Stuver',
    number: 1,
    position: 'GK',
    positionGroup: 'GK',
    age: 34,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('htazouqbrahn1btwxytc'),
    baseSalary: 484_500,  // MLSPA Oct 2025
    guaranteedCompensation: 507_313,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 507_313,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 800_000,
  },
  {
    id: 2,
    name: 'Damian Las',
    firstName: 'Damian',
    lastName: 'Las',
    number: null,
    position: 'GK',
    positionGroup: 'GK',
    age: 21,
    nationality: 'Poland',
    countryCode: 'PL',
    photo: playerImg('m9kffz475citj1yzsqr1'),
    baseSalary: 125_000,  // MLSPA via North End
    guaranteedCompensation: 125_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 0, // Supplemental / On Loan
    contractEnd: 'Dec 2027',
    designation: 'Homegrown',
    rosterSlot: 'Supplemental',
    isInternational: false,
    isHomegrown: true,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 300_000,
  },

  // ============ DEFENDERS ============
  {
    id: 3,
    name: 'Riley Thomas',
    firstName: 'Riley',
    lastName: 'Thomas',
    number: 2,
    position: 'DEF',
    positionGroup: 'DEF',
    age: 23,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('fnz65tyhquzanjitftaw'),
    baseSalary: 88_025,  // Reserve minimum per North End
    guaranteedCompensation: 88_025,  // Reserve minimum per North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 0, // Supplemental
    contractEnd: 'Dec 2026',
    designation: 'Supplemental',
    rosterSlot: 'Supplemental',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 150_000,
  },
  {
    id: 4,
    name: 'Mikkel Desler',
    firstName: 'Mikkel',
    lastName: 'Desler',
    number: 3,
    position: 'RB',
    positionGroup: 'DEF',
    age: 29,
    nationality: 'Denmark',
    countryCode: 'DK',
    photo: playerImg('jlfqjgtcodltisx5ko80'),
    baseSalary: 550_000,  // MLSPA Oct 2025
    guaranteedCompensation: 550_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 550_000,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 600_000,
  },
  {
    id: 5,
    name: 'Brendan Hines-Ike',
    firstName: 'Brendan',
    lastName: 'Hines-Ike',
    number: 4,
    position: 'CB',
    positionGroup: 'DEF',
    age: 27,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('a7vpviy1afjhefsebkgt'),
    baseSalary: 325_000,  // MLSPA Oct 2025
    guaranteedCompensation: 325_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 325_000,
    contractEnd: 'Dec 2025',  // Option for 2026
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 500_000,
  },
  {
    id: 6,
    name: 'Oleksandr Svatok',
    firstName: 'Oleksandr',
    lastName: 'Svatok',
    number: 5,
    position: 'CB',
    positionGroup: 'DEF',
    age: 26,
    nationality: 'Ukraine',
    countryCode: 'UA',
    photo: playerImg('bmblirlojdy29w37g2ds'),
    baseSalary: 500_000,  // MLSPA Oct 2025
    guaranteedCompensation: 505_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 505_000,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 350_000,
  },
  {
    id: 7,
    name: 'Jon Gallagher',
    firstName: 'Jon',
    lastName: 'Gallagher',
    number: 17,
    position: 'CB',
    positionGroup: 'DEF',
    age: 29,
    nationality: 'Ireland',
    countryCode: 'IE',
    photo: playerImg('rp2bhpb3l6uigvbhkc8s'),
    baseSalary: 375_000,  // MLSPA Oct 2025
    guaranteedCompensation: 375_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 375_000,
    contractEnd: 'Dec 2028',  // Extended Jan 2026
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 500_000,
  },
  {
    id: 8,
    name: 'Žan Kolmanič',
    firstName: 'Žan',
    lastName: 'Kolmanič',
    number: 23,
    position: 'LB',
    positionGroup: 'DEF',
    age: 26,
    nationality: 'Slovenia',
    countryCode: 'SI',
    photo: playerImg('yovynwnhcuvmsy9oatdt'),
    baseSalary: 350_000,  // MLSPA Oct 2025
    guaranteedCompensation: 350_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 350_000,
    contractEnd: 'Dec 2026',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 800_000,
  },
  {
    id: 9,
    name: 'Guilherme Biro',
    firstName: 'Guilherme',
    lastName: 'Biro',
    number: 29,
    position: 'LB',
    positionGroup: 'DEF',
    age: 22,
    nationality: 'Brazil',
    countryCode: 'BR',
    photo: playerImg('t9exssoo29m90jp8wupe'),
    baseSalary: 275_000,  // MLSPA Oct 2025
    guaranteedCompensation: 275_000,  // MLSPA Oct 2025
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 275_000,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 2_000_000,
  },
  {
    id: 10,
    name: 'Mateja Djordjević',
    firstName: 'Mateja',
    lastName: 'Djordjević',
    number: 35,
    position: 'CB',
    positionGroup: 'DEF',
    age: 21,
    nationality: 'Serbia',
    countryCode: 'RS',
    photo: playerImg('nop1fj45vlhsw1djft3g'),
    baseSalary: 337_500,  // MLSPA via North End
    guaranteedCompensation: 347_500,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 200_000, // U22 fixed charge
    contractEnd: 'Dec 2028',
    designation: 'U22',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: true,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 1_500_000,
  },
  {
    id: 11,
    name: 'Jon Bell',
    firstName: 'Jon',
    lastName: 'Bell',
    number: null,
    position: 'CB',
    positionGroup: 'DEF',
    age: 26,
    nationality: 'United States',
    countryCode: 'US',
    photo: '', // New acquisition - no ATX photo yet
    baseSalary: 150_000,
    guaranteedCompensation: 175_000,
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 175_000,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 400_000,
    acquisitionDate: 'Dec 16, 2025',
    previousClub: 'Seattle Sounders FC',
  },

  // ============ MIDFIELDERS ============
  {
    id: 12,
    name: 'Ilie Sánchez',
    firstName: 'Ilie',
    lastName: 'Sánchez',
    number: 6,
    position: 'CDM',
    positionGroup: 'MID',
    age: 35,
    nationality: 'Spain',
    countryCode: 'ES',
    photo: playerImg('y0z46cqdtbzt3ivjnv3h'),
    baseSalary: 600_000,  // New contract Nov 2025, salary from 2025 pending new MLSPA
    guaranteedCompensation: 600_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 600_000,
    contractEnd: 'Dec 2026',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 400_000,
  },
  {
    id: 13,
    name: 'Dani Pereira',
    firstName: 'Dani',
    lastName: 'Pereira',
    number: 8,
    position: 'CM',
    positionGroup: 'MID',
    age: 27,
    nationality: 'Venezuela',
    countryCode: 'VE',
    photo: playerImg('wc90b7unzzmn05n6elja'),
    baseSalary: 475_000,  // MLSPA via North End
    guaranteedCompensation: 514_375,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 514_375,
    contractEnd: 'June 2028',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 1_500_000,
  },
  {
    id: 14,
    name: 'Besard Sabovic',
    firstName: 'Besard',
    lastName: 'Sabovic',
    number: 14,
    position: 'CM',
    positionGroup: 'MID',
    age: 28,
    nationality: 'Sweden',
    countryCode: 'SE',
    photo: playerImg('veltppjtysozeshww4mq'),
    baseSalary: 550_000,  // MLSPA via North End
    guaranteedCompensation: 550_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 550_000,
    contractEnd: 'Dec 2027',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 600_000,
  },
  {
    id: 15,
    name: 'Robert Taylor',
    firstName: 'Robert',
    lastName: 'Taylor',
    number: 16,
    position: 'LW',
    positionGroup: 'FWD',
    age: 30,
    nationality: 'Finland',
    countryCode: 'FI',
    photo: playerImg('ps03xx7stokprxdka5e4'),
    baseSalary: 575_000,  // MLSPA via North End
    guaranteedCompensation: 633_333,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 633_333,
    contractEnd: 'Dec 2026',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: false, // Green card
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 600_000,
  },
  {
    id: 16,
    name: 'Nicolás Dubersarsky',
    firstName: 'Nicolás',
    lastName: 'Dubersarsky',
    number: 20,
    position: 'CM',
    positionGroup: 'MID',
    age: 22,
    nationality: 'Argentina',
    countryCode: 'AR',
    photo: playerImg('aeyqqn5vq9jmtgzkahkn'),
    baseSalary: 275_000,  // MLSPA via North End
    guaranteedCompensation: 297_986,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 200_000, // U22 fixed charge
    contractEnd: 'Dec 2029',
    designation: 'U22',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: true,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 2_000_000,
  },
  {
    id: 17,
    name: 'Micah Burton',
    firstName: 'Micah',
    lastName: 'Burton',
    number: 32,
    position: 'MID',
    positionGroup: 'MID',
    age: 19,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('xp6vxrlv18czxbfigg9c'),
    baseSalary: 113_400,  // MLSPA via North End (senior min)
    guaranteedCompensation: 115_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 0, // Supplemental
    contractEnd: 'Dec 2027',
    designation: 'Homegrown',
    rosterSlot: 'Supplemental',
    isInternational: false,
    isHomegrown: true,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 200_000,
  },
  {
    id: 18,
    name: 'Owen Wolff',
    firstName: 'Owen',
    lastName: 'Wolff',
    number: 33,
    position: 'CAM',
    positionGroup: 'MID',
    age: 20,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('a1blbto0oeg5vub4pe0n'),
    baseSalary: 275_000,
    guaranteedCompensation: 350_000,
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 200_000, // U22 fixed charge
    contractEnd: 'Dec 2028',
    designation: 'U22',
    rosterSlot: 'Senior',
    isInternational: false,
    isHomegrown: false,
    isU22: true,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 3_000_000,
  },
  {
    id: 19,
    name: 'Ervin Torres',
    firstName: 'Ervin',
    lastName: 'Torres',
    number: null,
    position: 'MID',
    positionGroup: 'MID',
    age: 23,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('kysdrfbe7fubwjfhonja'),
    baseSalary: 88_025,  // Reserve minimum per North End
    guaranteedCompensation: 88_025,  // Reserve minimum per North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 0, // Supplemental
    contractEnd: 'Dec 2028',
    designation: 'Homegrown',
    rosterSlot: 'Supplemental',
    isInternational: false,
    isHomegrown: true,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 100_000,
  },
  {
    id: 20,
    name: 'Joseph Rosales',
    firstName: 'Joseph',
    lastName: 'Rosales',
    number: null,
    position: 'LB',
    positionGroup: 'DEF',
    age: 25,
    nationality: 'Honduras',
    countryCode: 'HN',
    photo: '', // New acquisition - no ATX photo yet
    baseSalary: 325_000,
    guaranteedCompensation: 375_000,
    // ⚠️ CRITICAL: Cash trade fee IS amortized and added to budget charge per 2025 MLS rules!
    // $1.5M cash / 3.5 years guaranteed = ~$428K/year amortized
    tamApplied: 428_000,  // TAM needed to buy down amortized acquisition cost
    gamApplied: 0,
    budgetCharge: 375_000, // After TAM buydown - salary only hits cap
    trueBudgetCharge: 803_000, // $375K salary + $428K amortized = $803K (at max!)
    contractEnd: 'Dec 2029',
    designation: 'Senior',  // Salary alone ($375K) is senior-level; TAM offsets acquisition cost only
    rosterSlot: 'Senior',
    isInternational: false, // Green card per official roster
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 1_200_000,
    acquisitionDate: 'Dec 23, 2025',
    previousClub: 'Minnesota United FC',
    // Transfer fee info - CRITICAL for true cap calculation
    transferFee: 1_500_000,           // $1.5M cash per Austin FC press release
    contractYearsGuaranteed: 3.5,     // 3.5 years through June 2029
    amortizedAnnualFee: 428_000,      // $1.5M / 3.5 years = ~$428K/year adds to cap charge
    // Note: Cash trade - fee amortized over contract, needs TAM buydown
  },
  {
    id: 21,
    name: 'Jayden Nelson',
    firstName: 'Jayden',
    lastName: 'Nelson',
    number: null,
    position: 'RW',
    positionGroup: 'FWD',
    age: 22,
    nationality: 'Canada',
    countryCode: 'CA',
    photo: '', // New acquisition - no ATX photo yet
    baseSalary: 360_000,  // MLSPA via North End
    guaranteedCompensation: 414_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    // ⚠️ NOTE: If transfer fee is amortized, true budget charge is HIGHER
    // He's 22 - if placed in U22 slot, fee doesn't add to cap
    budgetCharge: 414_000, // Salary only - may need U22 slot or TAM for amortized fee
    contractEnd: 'Dec 2028',
    designation: 'Senior', // ⚠️ Should verify if he's using a U22 slot (would exempt fee)
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false, // ⚠️ If true, his $416K amortized fee wouldn't count against cap!
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 1_500_000,
    acquisitionDate: 'Dec 18, 2025',
    previousClub: 'Vancouver Whitecaps FC',
    // Transfer fee info - PAID IN GAM, NOT CASH
    // ⚠️ CRITICAL: GAM used as transfer fee does NOT count against budget charge!
    // The $700K 2026 GAM + $550K 2027 GAM comes out of the GAM pool, not the cap
    transferFee: 0,                   // $0 CASH fee - all paid in GAM
    gamTransferFee: 1_250_000,        // $700K 2026 GAM + $550K 2027 GAM (already in GAM tracking)
    contractYearsGuaranteed: 3,       // Through Dec 2028 (3 full years)
    amortizedAnnualFee: 0,            // $0 - GAM fees don't get amortized to budget charge!
  },

  // ============ FORWARDS ============
  {
    id: 22,
    name: 'Jáder Obrian',
    firstName: 'Jáder',
    lastName: 'Obrian',
    number: 7,
    position: 'RW',
    positionGroup: 'FWD',
    age: 29,
    nationality: 'Colombia',
    countryCode: 'CO',
    photo: playerImg('wcrxs6k1dohrn07bcjyu'),
    baseSalary: 495_000,  // MLSPA via North End
    guaranteedCompensation: 505_401,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 505_401,
    contractEnd: 'Dec 2026',
    designation: 'Senior',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: false,
    marketValue: 900_000,
  },
  {
    id: 23,
    name: 'Brandon Vazquez',
    firstName: 'Brandon',
    lastName: 'Vazquez',
    number: 9,
    position: 'ST',
    positionGroup: 'FWD',
    age: 26,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('s6umv5k9pbdvwirq4kaq'),
    baseSalary: 3_200_000,  // MLSPA via North End
    guaranteedCompensation: 3_551_778,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 803_125, // 2026 DP max cap charge
    contractEnd: 'Dec 2028',
    designation: 'DP',
    rosterSlot: 'Senior',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: true,
    isGenerationAdidas: false,
    marketValue: 6_000_000,
  },
  {
    id: 24,
    name: 'Myrto Uzuni',
    firstName: 'Myrto',
    lastName: 'Uzuni',
    number: 10,
    position: 'ST',
    positionGroup: 'FWD',
    age: 29,
    nationality: 'Albania',
    countryCode: 'AL',
    photo: playerImg('ix7d845kt7g6mme8t8ix'),
    baseSalary: 1_520_000,  // MLSPA via North End
    guaranteedCompensation: 2_225_000,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 803_125, // 2026 DP max cap charge
    contractEnd: 'Dec 2027',
    designation: 'DP',
    rosterSlot: 'Senior',
    isInternational: true,
    isHomegrown: false,
    isU22: false,
    isDP: true,
    isGenerationAdidas: false,
    marketValue: 5_000_000,
  },
  {
    id: 25,
    name: 'CJ Fodrey',
    firstName: 'CJ',
    lastName: 'Fodrey',
    number: 19,
    position: 'FW',
    positionGroup: 'FWD',
    age: 22,
    nationality: 'United States',
    countryCode: 'US',
    photo: playerImg('mqa9ymj7msgph4hauilf'),
    baseSalary: 113_400,  // MLSPA via North End (senior min)
    guaranteedCompensation: 113_400,  // MLSPA via North End
    tamApplied: 0,
    gamApplied: 0,
    budgetCharge: 0, // Supplemental / GA
    contractEnd: 'Dec 2027',
    designation: 'GA',
    rosterSlot: 'Supplemental',
    isInternational: false,
    isHomegrown: false,
    isU22: false,
    isDP: false,
    isGenerationAdidas: true,
    marketValue: 300_000,
  },
];

// ============ HELPER FUNCTIONS ============

export function getPlayersByPosition(positionGroup: PositionGroup): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.positionGroup === positionGroup);
}

export function getPlayersByDesignation(designation: PlayerDesignation): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.designation === designation);
}

export function getInternationalPlayers(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.isInternational);
}

export function getHomegrownPlayers(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.isHomegrown);
}

export function getU22Players(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.isU22);
}

export function getDPs(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.isDP);
}

export function getSeniorRoster(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.rosterSlot === 'Senior');
}

export function getSupplementalRoster(): AustinFCPlayer[] {
  return austinFCRoster.filter(p => p.rosterSlot === 'Supplemental');
}

// ============ CAP CALCULATIONS ============

export interface RosterCapSummary {
  // Counts
  totalPlayers: number;
  seniorRosterCount: number;
  supplementalRosterCount: number;
  dpCount: number;
  tamCount: number;
  u22Count: number;
  internationalCount: number;
  homegrownCount: number;
  generationAdidasCount: number;
  
  // Salary/Budget
  totalGuaranteedComp: number;  // What players actually earn
  totalBudgetCharge: number;   // What counts against cap
  capSpaceRemaining: number;
  capUsagePercent: number;
  
  // Breakdown of cap savings by mechanism
  dpSavings: number;           // DP salaries - DP cap charges ($803K each)
  u22Savings: number;          // U22 salaries - U22 cap charges ($200K each)
  supplementalSavings: number; // Supplemental roster salaries (don't count)
  tamGamBuydowns: number;      // Actual TAM/GAM applied
  
  // TAM/GAM Usage
  tamUsed: number;
  tamAvailable: number;
  gamUsed: number;
  gamAvailable: number;
  
  // Slots
  dpSlotsUsed: number;
  dpSlotsAvailable: number;
  u22SlotsUsed: number;
  u22SlotsAvailable: number;
  internationalSlotsUsed: number;
  internationalSlotsAvailable: number;
  seniorSlotsAvailable: number;
  supplementalSlotsAvailable: number;
}

export function calculateRosterCapSummary(): RosterCapSummary {
  const senior = getSeniorRoster();
  const supplemental = getSupplementalRoster();
  const dps = getDPs();
  const tams = getPlayersByDesignation('TAM');
  const u22s = getU22Players();
  const intl = getInternationalPlayers();
  const homegrown = getHomegrownPlayers();
  const ga = austinFCRoster.filter(p => p.isGenerationAdidas);
  
  const totalGuaranteedComp = austinFCRoster.reduce((sum, p) => sum + p.guaranteedCompensation, 0);
  const totalBudgetCharge = austinFCRoster.reduce((sum, p) => sum + p.budgetCharge, 0);
  const capSpaceRemaining = MLS_2026_RULES.salaryBudget - totalBudgetCharge;
  
  // Calculate savings by mechanism
  // DP Savings: Their actual salary minus their capped charge ($803,125)
  const dpSavings = dps.reduce((sum, p) => {
    return sum + (p.guaranteedCompensation - MLS_2026_RULES.dpBudgetCharge);
  }, 0);
  
  // U22 Savings: Their actual salary minus their capped charge ($200,000)
  const u22Savings = u22s.reduce((sum, p) => {
    return sum + (p.guaranteedCompensation - MLS_2026_RULES.u22BudgetCharge);
  }, 0);
  
  // Supplemental Savings: Their entire salary (they don't count against cap)
  const supplementalSavings = supplemental.reduce((sum, p) => sum + p.guaranteedCompensation, 0);
  
  // TAM/GAM usage (explicit buydowns tracked on players)
  const tamUsed = austinFCRoster.reduce((sum, p) => sum + p.tamApplied, 0);
  const gamUsed = austinFCRoster.reduce((sum, p) => sum + p.gamApplied, 0);
  const tamGamBuydowns = tamUsed + gamUsed;
  
  return {
    totalPlayers: austinFCRoster.length,
    seniorRosterCount: senior.length,
    supplementalRosterCount: supplemental.length,
    dpCount: dps.length,
    tamCount: tams.length,
    u22Count: u22s.length,
    internationalCount: intl.length,
    homegrownCount: homegrown.length,
    generationAdidasCount: ga.length,
    
    totalGuaranteedComp,
    totalBudgetCharge,
    capSpaceRemaining,
    capUsagePercent: Math.round((totalBudgetCharge / MLS_2026_RULES.salaryBudget) * 100),
    
    // Savings breakdown
    dpSavings,
    u22Savings,
    supplementalSavings,
    tamGamBuydowns,
    
    tamUsed,
    tamAvailable: MLS_2026_RULES.tamAnnual - tamUsed,
    gamUsed,
    gamAvailable: MLS_2026_RULES.gamAnnual - gamUsed,
    
    dpSlotsUsed: dps.length,
    dpSlotsAvailable: 3 - dps.length,
    u22SlotsUsed: u22s.length,
    u22SlotsAvailable: 3 - u22s.length,
    internationalSlotsUsed: intl.length,
    internationalSlotsAvailable: MLS_2026_RULES.maxInternationalSlots - intl.length,
    seniorSlotsAvailable: MLS_2026_RULES.maxSeniorRoster - senior.length,
    supplementalSlotsAvailable: MLS_2026_RULES.maxSupplementalRoster - supplemental.length,
  };
}

export function formatSalary(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-' : '';
  
  if (absAmount >= 1_000_000) {
    return `${prefix}$${(absAmount / 1_000_000).toFixed(2)}M`;
  } else if (absAmount >= 1_000) {
    return `${prefix}$${Math.round(absAmount / 1_000)}K`;
  }
  return `${prefix}$${absAmount.toLocaleString()}`;
}

export function getFlag(nationality: string): string {
  return countryFlags[nationality] || '🏳️';
}

export function getDesignationBadge(player: AustinFCPlayer): { label: string; color: string; bgColor: string } {
  if (player.isDP) {
    return { label: 'DP', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
  }
  if (player.designation === 'TAM') {
    return { label: 'TAM', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
  }
  if (player.isU22) {
    return { label: 'U22', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
  }
  if (player.isHomegrown) {
    return { label: 'HG', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  }
  if (player.isGenerationAdidas) {
    return { label: 'GA', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' };
  }
  if (player.rosterSlot === 'Supplemental') {
    return { label: 'SUP', color: 'text-pink-400', bgColor: 'bg-pink-500/20' };
  }
  return { label: 'SR', color: 'text-slate-300', bgColor: 'bg-slate-500/20' };
}
