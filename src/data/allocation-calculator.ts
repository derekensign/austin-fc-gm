/**
 * GAM/TAM Allocation Calculator
 * 
 * Shared calculation logic for team-wide cap compliance buydowns.
 * Used by both RosterOverview and SalaryCapCard for consistent numbers.
 */

import { austinFCRoster, MLS_2026_RULES, type AustinFCPlayer } from './austin-fc-roster';
import { AUSTIN_FC_2026_ALLOCATION_POSITION } from './austin-fc-allocation-money';
import { allocationMoney } from './mls-rules-2025';

// ============================================================================
// TYPES
// ============================================================================

export interface PlayerAllocation {
  playerId: number;
  tamApplied: number;
  gamApplied: number;
}

export interface AllocationState {
  allocations: Map<number, PlayerAllocation>;
  tamRemaining: number;
  gamRemaining: number;
  tamUsed: number;
  gamUsed: number;
  totalBuydownNeeded: number;
  totalBuydownApplied: number;
  isCompliant: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get true budget charge for a player (what they'd cost without buydowns)
export function getTrueBudgetCharge(player: AustinFCPlayer): number {
  // DPs have fixed charge regardless of salary
  if (player.isDP) return MLS_2026_RULES.dpBudgetCharge;
  // U22s have fixed charge regardless of salary/fees
  if (player.isU22) return MLS_2026_RULES.u22BudgetCharge;
  // Supplemental don't count against cap
  if (player.rosterSlot === 'Supplemental') return 0;
  
  // For senior roster: salary + amortized fee
  const salary = player.guaranteedCompensation;
  const amortizedFee = player.amortizedAnnualFee || 0;
  return salary + amortizedFee;
}

// Check if player is TAM-eligible ($803K-$1.8M budget charge)
export function isTAMEligible(player: AustinFCPlayer): boolean {
  const trueCharge = getTrueBudgetCharge(player);
  
  // Supplemental players can't use TAM
  if (player.rosterSlot === 'Supplemental') return false;
  
  // U22s have fixed $200K charge, no TAM needed
  if (player.isU22) return false;
  
  // DPs: TAM could help if their true salary could be bought down
  if (player.isDP) {
    const salary = player.guaranteedCompensation;
    const amortizedFee = player.amortizedAnnualFee || 0;
    const totalToPayDown = salary + amortizedFee;
    return totalToPayDown <= allocationMoney.TAM.maxBudgetChargeCeiling;
  }
  
  // For non-DP/U22/Supplemental: TAM eligible if charge is in range
  return trueCharge > allocationMoney.TAM.minBudgetChargeToQualify && 
         trueCharge <= allocationMoney.TAM.maxBudgetChargeCeiling;
}

// Calculate how much buydown a player needs to get under max budget charge
export function getBuydownNeeded(player: AustinFCPlayer): number {
  // DPs and U22s have fixed charges, no buydown needed for cap compliance
  if (player.isDP || player.isU22) return 0;
  // Supplemental don't count against cap
  if (player.rosterSlot === 'Supplemental') return 0;
  // Senior roster players with charge above max need buydown
  const trueCharge = getTrueBudgetCharge(player);
  return Math.max(0, trueCharge - MLS_2026_RULES.maxBudgetCharge);
}

// ============================================================================
// MAIN CALCULATION
// ============================================================================

/**
 * Calculate automatic allocation (TAM first where eligible, then GAM)
 * This function buys down to achieve TEAM cap compliance, not just individual player compliance
 */
export function calculateAutoAllocation(): AllocationState {
  let tamRemaining = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  let gamRemaining = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  
  const allocations = new Map<number, PlayerAllocation>();
  
  // Initialize all allocations
  austinFCRoster.forEach(player => {
    allocations.set(player.id, { playerId: player.id, tamApplied: 0, gamApplied: 0 });
  });
  
  // Calculate total budget charge before buydowns
  const totalBudgetChargeBefore = austinFCRoster
    .filter(p => p.rosterSlot !== 'Supplemental')
    .reduce((sum, p) => sum + getTrueBudgetCharge(p), 0);
  
  // The salary cap/budget we need to fit under
  const salaryBudget = MLS_2026_RULES.salaryBudget;
  
  // Calculate how much total buydown is needed for team compliance
  const teamBuydownNeeded = Math.max(0, totalBudgetChargeBefore - salaryBudget);
  
  if (teamBuydownNeeded === 0) {
    return { 
      allocations, 
      tamRemaining, 
      gamRemaining,
      tamUsed: 0,
      gamUsed: 0,
      totalBuydownNeeded: 0,
      totalBuydownApplied: 0,
      isCompliant: true,
    };
  }
  
  let remainingTeamBuydown = teamBuydownNeeded;
  
  // Get all non-supplemental players sorted by charge (highest first)
  const buydownCandidates = austinFCRoster
    .filter(p => p.rosterSlot !== 'Supplemental')
    .sort((a, b) => getTrueBudgetCharge(b) - getTrueBudgetCharge(a));
  
  // PHASE 1: Apply TAM to TAM-eligible players first (use-it-or-lose-it)
  // Strategy: MAX OUT TAM on eligible players (buy down to $150K minimum)
  const tamMinimum = 150_000; // MLS TAM minimum after buydown

  for (const player of buydownCandidates) {
    if (remainingTeamBuydown <= 0 || tamRemaining <= 0) break;

    if (isTAMEligible(player)) {
      const trueCharge = getTrueBudgetCharge(player);

      // MAX OUT TAM: Buy down to $150K minimum (not just to max budget charge)
      const maxTamForPlayer = Math.min(
        trueCharge - tamMinimum, // Buy down to $150K minimum
        allocationMoney.TAM.maxBuydownPerPlayer,
        tamRemaining,
        remainingTeamBuydown
      );

      if (maxTamForPlayer > 0) {
        const alloc = allocations.get(player.id)!;
        alloc.tamApplied = Math.max(0, maxTamForPlayer);
        tamRemaining -= alloc.tamApplied;
        remainingTeamBuydown -= alloc.tamApplied;
      }
    }
  }
  
  // PHASE 2: Apply GAM to remaining buydown needs (any non-supplemental player)
  // Start with highest-charge players who haven't had TAM applied
  for (const player of buydownCandidates) {
    if (remainingTeamBuydown <= 0 || gamRemaining <= 0) break;
    
    const alloc = allocations.get(player.id)!;
    
    // Skip if already has TAM applied (no co-mingling)
    if (alloc.tamApplied > 0) continue;
    
    const trueCharge = getTrueBudgetCharge(player);
    // For GAM, we can buy down to $0 technically
    const maxGamForPlayer = Math.min(
      trueCharge, // Can buy down entire charge
      gamRemaining,
      remainingTeamBuydown
    );
    
    if (maxGamForPlayer > 0) {
      alloc.gamApplied = maxGamForPlayer;
      gamRemaining -= alloc.gamApplied;
      remainingTeamBuydown -= alloc.gamApplied;
    }
  }
  
  // Calculate totals
  const tamUsed = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation - tamRemaining;
  const gamUsed = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026 - gamRemaining;
  const totalBuydownApplied = tamUsed + gamUsed;
  
  return { 
    allocations, 
    tamRemaining, 
    gamRemaining,
    tamUsed,
    gamUsed,
    totalBuydownNeeded: teamBuydownNeeded,
    totalBuydownApplied,
    isCompliant: totalBuydownApplied >= teamBuydownNeeded,
  };
}

// ============================================================================
// CONVENIENCE GETTERS
// ============================================================================

/**
 * Get a summary of the current allocation for display
 */
export function getAllocationSummary() {
  const allocation = calculateAutoAllocation();
  const totalTAM = AUSTIN_FC_2026_ALLOCATION_POSITION.tam.annualAllocation;
  const totalGAM = AUSTIN_FC_2026_ALLOCATION_POSITION.gam.available2026;
  
  return {
    tam: {
      total: totalTAM,
      used: allocation.tamUsed,
      remaining: allocation.tamRemaining,
    },
    gam: {
      total: totalGAM,
      used: allocation.gamUsed,
      remaining: allocation.gamRemaining,
    },
    buydown: {
      needed: allocation.totalBuydownNeeded,
      applied: allocation.totalBuydownApplied,
      shortfall: Math.max(0, allocation.totalBuydownNeeded - allocation.totalBuydownApplied),
    },
    isCompliant: allocation.isCompliant,
  };
}

