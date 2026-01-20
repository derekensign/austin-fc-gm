// Comprehensive MLS Transfer Data from Transfermarkt (2020-2024)
// Countries extracted directly from Transfermarkt flag images
// Values converted from EUR to USD

import transferData from '../../data/mls-transfers-all-years.json';

export interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  destinationClub: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free';
  season: string;
  year: number;
  sourceCountry: string;
}

// EUR to USD conversion rate
const EUR_TO_USD = 1.10;

// Convert EUR values to USD
export const ALL_TRANSFERS: TransferRecord[] = (transferData as any).transfers
  .filter((t: any) => t.sourceCountry && t.sourceCountry !== 'Unknown') // Filter out unknown countries
  .map((t: any) => ({
    ...t,
    marketValue: Math.round((t.marketValue || 0) * EUR_TO_USD),
    fee: Math.round((t.fee || 0) * EUR_TO_USD),
  }));

// Get unique list of MLS teams from the data
export function getMLSTeams(): string[] {
  const teams = new Set<string>();
  ALL_TRANSFERS.forEach(t => teams.add(t.mlsTeam));
  return Array.from(teams).sort();
}

// Get transfers by year
export function getTransfersByYear(year: number): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.year === year);
}

// Get transfers by team
export function getTransfersByTeam(team: string): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.mlsTeam === team);
}

// Get transfers by direction
export function getTransfersByDirection(direction: 'arrival' | 'departure'): TransferRecord[] {
  return ALL_TRANSFERS.filter(t => t.direction === direction);
}

// Get aggregate stats
export function getTransferStats() {
  const arrivals = ALL_TRANSFERS.filter(t => t.direction === 'arrival');
  const departures = ALL_TRANSFERS.filter(t => t.direction === 'departure');
  
  const totalSpend = arrivals.reduce((sum, t) => sum + t.fee, 0);
  const totalIncome = departures.reduce((sum, t) => sum + t.fee, 0);
  
  // Country breakdown (for arrivals - where players come from)
  const countryStats: Record<string, { count: number; spend: number }> = {};
  arrivals.forEach(t => {
    const country = t.sourceCountry;
    if (!countryStats[country]) {
      countryStats[country] = { count: 0, spend: 0 };
    }
    countryStats[country].count++;
    countryStats[country].spend += t.fee;
  });
  
  return {
    totalTransfers: ALL_TRANSFERS.length,
    arrivals: arrivals.length,
    departures: departures.length,
    totalSpend,
    totalIncome,
    netSpend: totalSpend - totalIncome,
    countryStats,
    years: [2024, 2023, 2022, 2021, 2020],
  };
}
