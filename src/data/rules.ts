// MLS Roster Rules Data - Shared between MCP server and web app

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
  TAM: { annual: number; maxPerPlayer: number };
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

// 2026 MLS Rules
export const salaryCapRules: SalaryCapRules = {
  salaryBudget: 5270000,
  maxSeniorRoster: 20,
  maxSupplementalRoster: 10,
  totalRosterLimit: 30,
  minimumBudgetCharge: 67360,
  maxBudgetCharge: 683750,
};

export const dpRules: DPRules = {
  maxSlots: 3,
  budgetCharge: 683750,
  youngDPMaxAge: 23,
  youngDPCharge: 150000,
};

export const allocationMoney: AllocationMoney = {
  TAM: { annual: 2800000, maxPerPlayer: 1612500 },
  GAM: { annual: 1725000 },
};

export const u22Rules: U22Rules = {
  maxSlots: 3,
  budgetCharge: 200000,
  maxSalary: 612500,
};

export const internationalSlots = {
  default: 8,
  tradeable: true,
};

// Austin FC compliance status
export const austinFCCompliance: RosterCompliance = {
  seniorRoster: { current: 18, max: 20, available: 2 },
  supplementalRoster: { current: 8, max: 10, available: 2 },
  dpSlots: { used: 1, max: 3, players: ['Sebastián Driussi'], available: 2 },
  u22Slots: { used: 2, max: 3, players: ['Guilherme Biro', 'Damian Las'], available: 1 },
  internationalSlots: { used: 6, max: 8, available: 2 },
  salaryCapStatus: {
    budget: 5270000,
    currentSpend: 4870000,
    available: 400000,
    tamAvailable: 450000,
    gamAvailable: 1200000,
  },
  homegrownPlayers: ['Owen Wolff'],
};

// Helper functions
export function canSignPlayer(params: {
  salary: number;
  isInternational?: boolean;
  age?: number;
  designation?: 'DP' | 'TAM' | 'U22' | 'Senior';
}): { canSign: boolean; issues: string[]; recommendations: string[] } {
  const { salary, isInternational = false, age = 25, designation = 'Senior' } = params;
  const c = austinFCCompliance;
  const issues: string[] = [];
  const recommendations: string[] = [];
  let canSign = true;

  // Check roster spots
  if (c.seniorRoster.available === 0 && c.supplementalRoster.available === 0) {
    issues.push('No roster spots available');
    canSign = false;
  }

  // Check international slot
  if (isInternational && c.internationalSlots.available === 0) {
    issues.push('No international slots available');
    recommendations.push('Trade for international slot or target domestic player');
    canSign = false;
  }

  // Check designation-specific rules
  if (designation === 'DP') {
    if (c.dpSlots.available === 0) {
      issues.push('No DP slots available');
      canSign = false;
    } else {
      recommendations.push(`DP slot available - $${dpRules.budgetCharge.toLocaleString()} cap hit`);
    }
  } else if (designation === 'U22') {
    if (age >= 22) {
      issues.push('Player too old for U22 Initiative');
      canSign = false;
    } else if (c.u22Slots.available === 0) {
      issues.push('No U22 slots available');
      canSign = false;
    } else if (salary > u22Rules.maxSalary) {
      issues.push(`Salary exceeds U22 maximum ($${u22Rules.maxSalary.toLocaleString()})`);
      canSign = false;
    } else {
      recommendations.push(`U22 eligible - $${u22Rules.budgetCharge.toLocaleString()} cap hit`);
    }
  } else {
    const maxCharge = salaryCapRules.maxBudgetCharge;
    if (salary > maxCharge) {
      const buydownNeeded = salary - maxCharge;
      const availableAllocation = c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable;
      if (buydownNeeded > availableAllocation) {
        issues.push(`Cannot buy down salary - need $${buydownNeeded.toLocaleString()}, have $${availableAllocation.toLocaleString()}`);
        recommendations.push('Consider using DP slot instead');
        canSign = false;
      } else {
        recommendations.push(`Can buy down with TAM/GAM - need $${buydownNeeded.toLocaleString()}`);
      }
    }
  }

  return { canSign, issues, recommendations };
}

export function formatBudget(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function getCapSpaceWithAllocation(): number {
  const c = austinFCCompliance.salaryCapStatus;
  return c.available + c.tamAvailable + c.gamAvailable;
}

