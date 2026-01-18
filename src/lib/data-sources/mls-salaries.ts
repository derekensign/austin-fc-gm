/**
 * MLS Salary Data
 * 
 * The MLS Players Association releases salary data twice per year.
 * This module provides functions to load and query that data.
 * 
 * Data source: https://mlsplayers.org/resources/salary-guide
 * 
 * For now, we include hardcoded 2025 data that can be updated
 * when new data is released.
 */

import { getCached, setCache } from '../cache/file-cache';

export interface MLSSalaryEntry {
  club: string;
  lastName: string;
  firstName: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

// Austin FC 2025 Salary Data (MLSPA Release - April 2025)
// Note: This is sample data - update with real MLSPA data when available
const AUSTIN_FC_SALARIES_2025: MLSSalaryEntry[] = [
  { club: 'ATX', lastName: 'Driussi', firstName: 'Sebastián', position: 'M', baseSalary: 3500000, guaranteedCompensation: 4200000 },
  { club: 'ATX', lastName: 'Rigoni', firstName: 'Emiliano', position: 'M-F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'ATX', lastName: 'Urruti', firstName: 'Maxi', position: 'F', baseSalary: 900000, guaranteedCompensation: 1050000 },
  { club: 'ATX', lastName: 'Zardes', firstName: 'Gyasi', position: 'F', baseSalary: 800000, guaranteedCompensation: 950000 },
  { club: 'ATX', lastName: 'Pereira', firstName: 'Dani', position: 'M', baseSalary: 650000, guaranteedCompensation: 750000 },
  { club: 'ATX', lastName: 'Cascante', firstName: 'Julio', position: 'D', baseSalary: 550000, guaranteedCompensation: 625000 },
  { club: 'ATX', lastName: 'Obrian', firstName: 'Jader', position: 'F', baseSalary: 500000, guaranteedCompensation: 575000 },
  { club: 'ATX', lastName: 'Stuver', firstName: 'Brad', position: 'GK', baseSalary: 450000, guaranteedCompensation: 525000 },
  { club: 'ATX', lastName: 'Väisänen', firstName: 'Leo', position: 'D', baseSalary: 400000, guaranteedCompensation: 450000 },
  { club: 'ATX', lastName: 'Jimenez', firstName: 'Hector', position: 'D', baseSalary: 325000, guaranteedCompensation: 375000 },
  { club: 'ATX', lastName: 'Wolff', firstName: 'Owen', position: 'M', baseSalary: 200000, guaranteedCompensation: 250000 },
  { club: 'ATX', lastName: 'Biro', firstName: 'Guilherme', position: 'D', baseSalary: 175000, guaranteedCompensation: 200000 },
  { club: 'ATX', lastName: 'Las', firstName: 'Damian', position: 'GK', baseSalary: 85000, guaranteedCompensation: 100000 },
];

// Full MLS salary data would go here
// For demo purposes, just Austin FC data
const ALL_MLS_SALARIES_2025: MLSSalaryEntry[] = [
  ...AUSTIN_FC_SALARIES_2025,
  // Other teams would be added here...
];

export async function getTeamSalaries(teamCode: string = 'ATX'): Promise<MLSSalaryEntry[]> {
  const cacheKey = `mls-salaries-${teamCode}`;
  
  const cached = await getCached<MLSSalaryEntry[]>(cacheKey);
  if (cached) return cached;

  const salaries = ALL_MLS_SALARIES_2025.filter(s => s.club === teamCode);
  
  // Cache for 7 days (salary data doesn't change often)
  await setCache(cacheKey, salaries, 7 * 24 * 60 * 60 * 1000);
  
  return salaries;
}

export async function getPlayerSalary(firstName: string, lastName: string): Promise<MLSSalaryEntry | null> {
  const all = ALL_MLS_SALARIES_2025;
  
  return all.find(s => 
    s.firstName.toLowerCase() === firstName.toLowerCase() &&
    s.lastName.toLowerCase() === lastName.toLowerCase()
  ) || null;
}

export async function getTopSalaries(limit: number = 20): Promise<MLSSalaryEntry[]> {
  return ALL_MLS_SALARIES_2025
    .sort((a, b) => b.guaranteedCompensation - a.guaranteedCompensation)
    .slice(0, limit);
}

export function formatSalary(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-' : '';
  
  if (absAmount >= 1_000_000) {
    return `${prefix}$${(absAmount / 1_000_000).toFixed(2)}M`;
  } else if (absAmount >= 1_000) {
    return `${prefix}$${(absAmount / 1_000).toFixed(0)}K`;
  }
  return `${prefix}$${absAmount.toLocaleString()}`;
}

// ============ SALARY CAP CALCULATIONS ============

export interface TeamSalaryCapStatus {
  totalBaseSalary: number;
  totalGuaranteedComp: number;
  seniorRosterCount: number;
  dpCount: number;
  tamPlayerCount: number;
  u22Count: number;
  estimatedBudgetCharge: number;
}

const MLS_MAX_BUDGET_CHARGE = 683750; // 2025 max budget charge
const MLS_DP_BUDGET_CHARGE = 683750; // DP charges max budget
const MLS_SALARY_BUDGET = 5270000; // 2025 salary budget

export async function calculateTeamCapStatus(teamCode: string = 'ATX'): Promise<TeamSalaryCapStatus> {
  const salaries = await getTeamSalaries(teamCode);
  
  let dpCount = 0;
  let tamPlayerCount = 0;
  let u22Count = 0;
  let estimatedBudgetCharge = 0;
  
  for (const player of salaries) {
    const salary = player.guaranteedCompensation;
    
    if (salary > 1_600_000) {
      // Likely a DP
      dpCount++;
      estimatedBudgetCharge += MLS_DP_BUDGET_CHARGE;
    } else if (salary > MLS_MAX_BUDGET_CHARGE) {
      // TAM player
      tamPlayerCount++;
      estimatedBudgetCharge += MLS_MAX_BUDGET_CHARGE;
    } else {
      estimatedBudgetCharge += salary;
    }
  }
  
  return {
    totalBaseSalary: salaries.reduce((sum, p) => sum + p.baseSalary, 0),
    totalGuaranteedComp: salaries.reduce((sum, p) => sum + p.guaranteedCompensation, 0),
    seniorRosterCount: salaries.length,
    dpCount,
    tamPlayerCount,
    u22Count, // Would need age data to calculate
    estimatedBudgetCharge,
  };
}

