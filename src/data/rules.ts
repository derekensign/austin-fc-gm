// MLS Roster Rules Data - 2026 Season
// Synced with austin-fc-roster.ts and austin-fc-allocation-money.ts

import { 
  MLS_2026_RULES, 
  calculateRosterCapSummary, 
  getDPs,
  getU22Players,
  getInternationalPlayers,
  getHomegrownPlayers,
  getSeniorRoster,
  getSupplementalRoster,
  formatSalary
} from './austin-fc-roster';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from './austin-fc-allocation-money';

export interface SalaryCapRules {
  salaryBudget: number;
  maxSeniorRoster: number;
  maxSupplementalRoster: number;
  totalRosterLimit: number;
  minimumBudgetCharge: number;
  maxBudgetCharge: number;
}

export interface DPRules {
  maxSlots: number;
  budgetCharge: number;
  youngDPMaxAge: number;
  youngDPCharge: number;
}

export interface AllocationMoney {
  TAM: { annual: number; maxPerPlayer: number; maxBuydownPerPlayer: number };
  GAM: { annual: number };
}

export interface U22Rules {
  maxSlots: number;
  budgetCharge: number;
  maxSalary: number;
}

export interface RosterCompliance {
  seniorRoster: { current: number; max: number; available: number };
  supplementalRoster: { current: number; max: number; available: number };
  dpSlots: { used: number; max: number; players: string[]; available: number };
  u22Slots: { used: number; max: number; players: string[]; available: number };
  internationalSlots: { used: number; max: number; available: number };
  salaryCapStatus: {
    budget: number;
    currentSpend: number;
    available: number;
    tamAvailable: number;
    gamAvailable: number;
  };
  homegrownPlayers: string[];
}

// 2026 MLS Rules - synced with MLS_2026_RULES
export const salaryCapRules: SalaryCapRules = {
  salaryBudget: MLS_2026_RULES.salaryBudget,           // $6,425,000
  maxSeniorRoster: MLS_2026_RULES.maxSeniorRoster,     // 20
  maxSupplementalRoster: MLS_2026_RULES.maxSupplementalRoster, // 10
  totalRosterLimit: 30,
  minimumBudgetCharge: MLS_2026_RULES.seniorMinSalary, // $113,400
  maxBudgetCharge: MLS_2026_RULES.maxBudgetCharge,     // $803,125
};

export const dpRules: DPRules = {
  maxSlots: 3,
  budgetCharge: MLS_2026_RULES.dpBudgetCharge,         // $803,125
  youngDPMaxAge: 23,
  youngDPCharge: MLS_2026_RULES.youngDPBudgetCharge,   // $200,000
};

export const allocationMoney: AllocationMoney = {
  TAM: { 
    annual: MLS_2026_RULES.tamAnnual,     // $2,125,000
    maxPerPlayer: 1_612_500,               // Max TAM per player
    maxBuydownPerPlayer: 1_612_500,        // Max buydown per player
  },
  GAM: { 
    annual: MLS_2026_RULES.gamAnnual,     // $3,280,000
  },
};

export const u22Rules: U22Rules = {
  maxSlots: 3,
  budgetCharge: MLS_2026_RULES.u22BudgetCharge,  // $200,000
  maxSalary: 612_500,
};

export const internationalSlots = {
  default: MLS_2026_RULES.maxInternationalSlots,  // 8
  tradeable: true,
};

// Get live Austin FC compliance from actual roster data
export function getAustinFCCompliance(): RosterCompliance {
  const cap = calculateRosterCapSummary();
  const dps = getDPs();
  const u22s = getU22Players();
  const senior = getSeniorRoster();
  const supplemental = getSupplementalRoster();
  const intl = getInternationalPlayers();
  const homegrown = getHomegrownPlayers();
  const allocPosition = AUSTIN_FC_2026_ALLOCATION_POSITION;
  
  return {
    seniorRoster: { 
      current: senior.length, 
      max: MLS_2026_RULES.maxSeniorRoster, 
      available: cap.seniorSlotsAvailable 
    },
    supplementalRoster: { 
      current: supplemental.length, 
      max: MLS_2026_RULES.maxSupplementalRoster, 
      available: cap.supplementalSlotsAvailable 
    },
    dpSlots: { 
      used: dps.length, 
      max: 3, 
      players: dps.map(p => p.name), 
      available: cap.dpSlotsAvailable 
    },
    u22Slots: { 
      used: u22s.length, 
      max: 3, 
      players: u22s.map(p => p.name), 
      available: cap.u22SlotsAvailable 
    },
    internationalSlots: { 
      used: intl.length, 
      max: MLS_2026_RULES.maxInternationalSlots, 
      available: cap.internationalSlotsAvailable 
    },
    salaryCapStatus: {
      budget: MLS_2026_RULES.salaryBudget,
      currentSpend: cap.totalBudgetCharge,
      available: cap.capSpaceRemaining,
      tamAvailable: allocPosition.tam.available,
      gamAvailable: allocPosition.gam.freeGAM,
    },
    homegrownPlayers: homegrown.map(p => p.name),
  };
}

// Legacy export for backward compatibility
export const austinFCCompliance = getAustinFCCompliance();

// Helper functions
export function canSignPlayer(params: {
  salary: number;
  transferFee?: number;
  contractYears?: number;
  isInternational?: boolean;
  age?: number;
  designation?: 'DP' | 'TAM' | 'U22' | 'Senior';
}): { 
  canSign: boolean; 
  issues: string[]; 
  recommendations: string[]; 
  budgetImpact: number;
  salaryComponent: number;
  amortizedFee: number;
  buydownNeeded: number;
  buydownUsed: { tam: number; gam: number };
} {
  const { 
    salary, 
    transferFee = 0, 
    contractYears = 1,
    isInternational = false, 
    age = 25, 
    designation = 'Senior' 
  } = params;
  
  const c = getAustinFCCompliance();
  const issues: string[] = [];
  const recommendations: string[] = [];
  let canSign = true;
  
  // Calculate amortized transfer fee (spread over contract years)
  const amortizedFee = contractYears > 0 ? Math.round(transferFee / contractYears) : 0;
  
  // Total annual cost = salary + amortized fee
  const totalAnnualCost = salary + amortizedFee;
  
  // Calculate budget impact based on designation
  let salaryComponent = salary;
  let budgetImpact = totalAnnualCost;
  let buydownNeeded = 0;
  const buydownUsed = { tam: 0, gam: 0 };
  
  // Available flexibility
  const totalFlexibility = c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable;

  // Check roster spots
  if (c.seniorRoster.available === 0 && c.supplementalRoster.available === 0) {
    issues.push('No roster spots available');
    canSign = false;
  }

  // Check international slot
  if (isInternational && c.internationalSlots.available === 0) {
    issues.push('No international slots available (8/8 used)');
    recommendations.push('Trade for international slot or target domestic player');
    canSign = false;
  }

  // Check designation-specific rules
  if (designation === 'DP') {
    if (c.dpSlots.available === 0) {
      issues.push(`No DP slots available (${c.dpSlots.players.join(', ')} using all 3)`);
      canSign = false;
    } else {
      // DPs have capped budget charge regardless of salary/fees
      if (age <= dpRules.youngDPMaxAge) {
        budgetImpact = dpRules.youngDPCharge;
        salaryComponent = dpRules.youngDPCharge;
        recommendations.push(`Young DP (≤${dpRules.youngDPMaxAge}) - only ${formatBudget(dpRules.youngDPCharge)} cap hit!`);
      } else {
        budgetImpact = dpRules.budgetCharge;
        salaryComponent = dpRules.budgetCharge;
        recommendations.push(`DP slot - ${formatBudget(dpRules.budgetCharge)} cap hit regardless of ${formatBudget(totalAnnualCost)} actual cost`);
      }
    }
  } else if (designation === 'U22') {
    if (age >= 22) {
      issues.push(`Player too old for U22 Initiative (must be under 22, player is ${age})`);
      canSign = false;
    } else if (c.u22Slots.available === 0) {
      issues.push(`No U22 slots available (${c.u22Slots.players.join(', ')} using all 3)`);
      canSign = false;
    } else if (salary > u22Rules.maxSalary) {
      issues.push(`Salary exceeds U22 maximum (${formatBudget(salary)} > ${formatBudget(u22Rules.maxSalary)})`);
      canSign = false;
    } else {
      budgetImpact = u22Rules.budgetCharge;
      salaryComponent = u22Rules.budgetCharge;
      recommendations.push(`U22 eligible - only ${formatBudget(u22Rules.budgetCharge)} cap hit!`);
    }
  } else {
    // TAM or Senior roster - need to check buydowns
    // Both TAM and GAM can be used for salary buydowns
    // Teams typically use TAM first (use-it-or-lose-it), then GAM
    const maxCharge = salaryCapRules.maxBudgetCharge;
    
    if (totalAnnualCost <= maxCharge) {
      // Under max charge - no buydown needed
      budgetImpact = totalAnnualCost;
      salaryComponent = salary;
      if (amortizedFee > 0) {
        recommendations.push(`Total cost ${formatBudget(totalAnnualCost)} (${formatBudget(salary)} salary + ${formatBudget(amortizedFee)} amortized fee) under max charge`);
      }
    } else {
      // Needs buydown - can use TAM or GAM
      buydownNeeded = totalAnnualCost - maxCharge;
      
      if (buydownNeeded > totalFlexibility) {
        issues.push(`Not enough allocation money (need ${formatBudget(buydownNeeded)}, have ${formatBudget(totalFlexibility)} TAM+GAM)`);
        recommendations.push('Consider using DP slot instead');
        canSign = false;
      } else {
        // Use TAM first (use-it-or-lose-it), then GAM
        buydownUsed.tam = Math.min(buydownNeeded, c.salaryCapStatus.tamAvailable);
        buydownUsed.gam = buydownNeeded - buydownUsed.tam;
        budgetImpact = maxCharge;
        salaryComponent = maxCharge;
        
        if (buydownUsed.gam > 0) {
          recommendations.push(`Buydown: ${formatBudget(buydownUsed.tam)} TAM + ${formatBudget(buydownUsed.gam)} GAM → ${formatBudget(maxCharge)} cap hit`);
          recommendations.push(`Note: Using GAM for buydowns preserves rollover flexibility`);
        } else {
          recommendations.push(`TAM buydown: ${formatBudget(buydownUsed.tam)} → ${formatBudget(maxCharge)} cap hit`);
        }
      }
    }
  }

  // Add transfer fee breakdown if applicable
  if (amortizedFee > 0 && canSign) {
    recommendations.push(`Transfer fee ${formatBudget(transferFee)} ÷ ${contractYears} years = ${formatBudget(amortizedFee)}/year amortized`);
  }

  return { 
    canSign, 
    issues, 
    recommendations, 
    budgetImpact,
    salaryComponent,
    amortizedFee,
    buydownNeeded,
    buydownUsed
  };
}

export function formatBudget(amount: number): string {
  return formatSalary(amount);
}

export function getCapSpaceWithAllocation(): number {
  const c = getAustinFCCompliance();
  return c.salaryCapStatus.available + c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable;
}

// ============================================================================
// SALE GAM CALCULATOR - Comprehensive MLS Rules
// ============================================================================

/**
 * MLS GAM Conversion Rules for Outgoing Player Sales (2026)
 * 
 * Key Rules:
 * 1. Acquisition costs must be recouped before any GAM conversion
 * 2. DPs NOT eligible for buydown (salary > TAM ceiling) CANNOT convert to GAM
 * 3. Tiered conversion: 50% (first $1M), 40% ($1M-$3M), 25% ($3M+)
 * 4. Homegrown bonus: +15%
 * 5. Young player bonus (U23): +10%
 * 6. Max GAM per sale: $3M
 */

export interface SaleGAMParams {
  saleFee: number;
  acquisitionCost: number;
  playerDesignation: 'DP' | 'U22' | 'Homegrown' | 'GA' | 'Senior';
  playerSalary: number;
  playerAge: number;
  isHomegrown: boolean;
}

export interface SaleGAMResult {
  gamGenerated: number;
  netProfit: number;
  eligibleRevenue: number;
  baseGAM: number;
  homegrownBonus: number;
  youngPlayerBonus: number;
  explanation: string;
  breakdown: string[];
  warnings: string[];
}

// TAM Ceiling - players above this are NOT eligible for buydown, thus no GAM from sale
const TAM_CEILING_2026 = 1_612_500; // Approx: max budget charge ($803K) + max TAM per player (~$809K)

// GAM Conversion Tiers
const GAM_TIERS = [
  { upTo: 1_000_000, rate: 0.50, label: 'First $1M @ 50%' },
  { upTo: 3_000_000, rate: 0.40, label: '$1M-$3M @ 40%' },
  { upTo: Infinity, rate: 0.25, label: '$3M+ @ 25%' },
];

// Max GAM per sale
const MAX_GAM_PER_SALE = 3_000_000;
const MIN_FEE_FOR_CONVERSION = 100_000;
const HOMEGROWN_BONUS_RATE = 0.15;
const YOUNG_PLAYER_BONUS_RATE = 0.10;
const YOUNG_PLAYER_AGE_THRESHOLD = 23;

export function calculateTransferGAM(params: SaleGAMParams): SaleGAMResult {
  const {
    saleFee,
    acquisitionCost,
    playerDesignation,
    playerSalary,
    playerAge,
    isHomegrown
  } = params;
  
  const breakdown: string[] = [];
  const warnings: string[] = [];
  
  // Check minimum fee
  if (saleFee < MIN_FEE_FOR_CONVERSION) {
    return {
      gamGenerated: 0,
      netProfit: saleFee - acquisitionCost,
      eligibleRevenue: 0,
      baseGAM: 0,
      homegrownBonus: 0,
      youngPlayerBonus: 0,
      explanation: `Sale fee below minimum threshold (${formatBudget(MIN_FEE_FOR_CONVERSION)})`,
      breakdown: [`Sale: ${formatBudget(saleFee)} < Min: ${formatBudget(MIN_FEE_FOR_CONVERSION)}`],
      warnings: ['Fee too low for GAM conversion']
    };
  }
  
  // RULE 1: Check DP eligibility for GAM conversion
  // DPs whose salary exceeded the TAM ceiling (not eligible for buydown) CANNOT convert to GAM
  if (playerDesignation === 'DP') {
    if (playerSalary > TAM_CEILING_2026) {
      return {
        gamGenerated: 0,
        netProfit: saleFee - acquisitionCost,
        eligibleRevenue: 0,
        baseGAM: 0,
        homegrownBonus: 0,
        youngPlayerBonus: 0,
        explanation: 'DP not eligible for TAM buydown - cannot convert transfer fee to GAM',
        breakdown: [
          `Player salary: ${formatBudget(playerSalary)}`,
          `TAM ceiling: ${formatBudget(TAM_CEILING_2026)}`,
          'Salary exceeds TAM ceiling → not buydown-eligible → no GAM from sale'
        ],
        warnings: [
          'Per MLS rules, DPs not eligible for buydown cannot convert transfer proceeds to GAM',
          'This applies even if sold at a profit'
        ]
      };
    }
    breakdown.push(`DP was buydown-eligible (salary ${formatBudget(playerSalary)} ≤ TAM ceiling ${formatBudget(TAM_CEILING_2026)})`);
  }
  
  // RULE 2: Must recoup acquisition costs first
  const netProfit = saleFee - acquisitionCost;
  breakdown.push(`Sale fee: ${formatBudget(saleFee)}`);
  breakdown.push(`Acquisition cost: ${formatBudget(acquisitionCost)}`);
  breakdown.push(`Net profit: ${formatBudget(netProfit)}`);
  
  if (netProfit <= 0) {
    const reason = netProfit === 0 ? 'Break-even sale' : 'Sold at a loss';
    return {
      gamGenerated: 0,
      netProfit,
      eligibleRevenue: 0,
      baseGAM: 0,
      homegrownBonus: 0,
      youngPlayerBonus: 0,
      explanation: `${reason} - acquisition costs must be recouped before GAM conversion`,
      breakdown,
      warnings: netProfit < 0 
        ? [`Loss of ${formatBudget(Math.abs(netProfit))} - no GAM impact`]
        : ['No profit = no GAM generated']
    };
  }
  
  // Calculate eligible revenue (after recouping acquisition + estimated fees)
  // Note: MLS takes ~5% fee, agent fees ~10% - these reduce eligible revenue
  const mlsFee = saleFee * 0.05;
  const agentFee = saleFee * 0.10;
  const eligibleRevenue = Math.max(0, netProfit - mlsFee - agentFee);
  
  breakdown.push(`Less MLS fee (~5%): -${formatBudget(mlsFee)}`);
  breakdown.push(`Less agent/misc (~10%): -${formatBudget(agentFee)}`);
  breakdown.push(`Eligible revenue: ${formatBudget(eligibleRevenue)}`);
  
  if (eligibleRevenue <= 0) {
    return {
      gamGenerated: 0,
      netProfit,
      eligibleRevenue: 0,
      baseGAM: 0,
      homegrownBonus: 0,
      youngPlayerBonus: 0,
      explanation: 'Fees exceeded profit - no GAM generated',
      breakdown,
      warnings: ['MLS and agent fees consumed all profit']
    };
  }
  
  // RULE 3: Calculate base GAM using tiered system
  let baseGAM = 0;
  let remaining = eligibleRevenue;
  let prevTier = 0;
  
  breakdown.push('--- GAM Conversion Tiers ---');
  for (const tier of GAM_TIERS) {
    if (remaining <= 0) break;
    
    const tierAmount = Math.min(remaining, tier.upTo - prevTier);
    const tierGAM = tierAmount * tier.rate;
    baseGAM += tierGAM;
    
    if (tierAmount > 0) {
      breakdown.push(`${tier.label}: ${formatBudget(tierAmount)} × ${tier.rate * 100}% = ${formatBudget(tierGAM)}`);
    }
    
    remaining -= tierAmount;
    prevTier = tier.upTo;
  }
  
  breakdown.push(`Base GAM: ${formatBudget(baseGAM)}`);
  
  // RULE 4 & 5: Calculate bonuses
  let homegrownBonus = 0;
  let youngPlayerBonus = 0;
  
  if (isHomegrown || playerDesignation === 'Homegrown') {
    homegrownBonus = baseGAM * HOMEGROWN_BONUS_RATE;
    breakdown.push(`Homegrown bonus (+${HOMEGROWN_BONUS_RATE * 100}%): +${formatBudget(homegrownBonus)}`);
  }
  
  if (playerAge < YOUNG_PLAYER_AGE_THRESHOLD) {
    youngPlayerBonus = baseGAM * YOUNG_PLAYER_BONUS_RATE;
    breakdown.push(`Young player bonus (U${YOUNG_PLAYER_AGE_THRESHOLD}, +${YOUNG_PLAYER_BONUS_RATE * 100}%): +${formatBudget(youngPlayerBonus)}`);
  }
  
  // Calculate total before cap
  const totalBeforeCap = baseGAM + homegrownBonus + youngPlayerBonus;
  
  // RULE 6: Apply cap
  const gamGenerated = Math.min(totalBeforeCap, MAX_GAM_PER_SALE);
  
  if (totalBeforeCap > MAX_GAM_PER_SALE) {
    warnings.push(`GAM capped at ${formatBudget(MAX_GAM_PER_SALE)} (was ${formatBudget(totalBeforeCap)})`);
    breakdown.push(`Total before cap: ${formatBudget(totalBeforeCap)}`);
    breakdown.push(`Cap applied: ${formatBudget(MAX_GAM_PER_SALE)}`);
  }
  
  breakdown.push(`--- TOTAL GAM: ${formatBudget(gamGenerated)} ---`);
  
  // Generate explanation
  let explanation = `${formatBudget(gamGenerated)} GAM from ${formatBudget(saleFee)} sale`;
  if (isHomegrown || playerDesignation === 'Homegrown') {
    explanation += ' (includes Homegrown bonus)';
  }
  if (playerAge < YOUNG_PLAYER_AGE_THRESHOLD) {
    explanation += ' (includes U23 bonus)';
  }
  
  return {
    gamGenerated,
    netProfit,
    eligibleRevenue,
    baseGAM,
    homegrownBonus,
    youngPlayerBonus,
    explanation,
    breakdown,
    warnings
  };
}

// Simplified version for backward compatibility
export function calculateTransferGAMSimple(params: {
  saleFee: number;
  acquisitionCost: number;
  isDP: boolean;
  wasEligibleForBuydown: boolean;
}): { gamGenerated: number; explanation: string } {
  const result = calculateTransferGAM({
    saleFee: params.saleFee,
    acquisitionCost: params.acquisitionCost,
    playerDesignation: params.isDP ? 'DP' : 'Senior',
    playerSalary: params.wasEligibleForBuydown ? TAM_CEILING_2026 - 1 : TAM_CEILING_2026 + 1,
    playerAge: 25,
    isHomegrown: false
  });
  
  return {
    gamGenerated: result.gamGenerated,
    explanation: result.explanation
  };
}

