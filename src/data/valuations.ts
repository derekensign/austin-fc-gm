// Player Valuations Data - Shared between MCP server and web app

export interface PlayerValuation {
  name: string;
  team: string;
  position: string;
  age: number;
  marketValue: number;
  peakValue: number;
  contract: string;
  nationality: string;
  foot: 'Left' | 'Right' | 'Both';
  isHomegrown?: boolean;
}

export interface Transfer {
  player: string;
  from: string;
  to: string;
  fee: number;
  type: 'Transfer' | 'Free Transfer' | 'Loan';
  date: string;
}

export interface PositionMarketRate {
  min: number;
  avg: number;
  max: number;
}

export const playerValuations: PlayerValuation[] = [
  // Austin FC
  { name: 'Sebastián Driussi', team: 'Austin FC', position: 'CAM', age: 28, marketValue: 12000000, peakValue: 15000000, contract: '2027', nationality: 'Argentina', foot: 'Right' },
  { name: 'Owen Wolff', team: 'Austin FC', position: 'CM', age: 19, marketValue: 3000000, peakValue: 3000000, contract: '2028', nationality: 'USA', foot: 'Left', isHomegrown: true },
  { name: 'Guilherme Biro', team: 'Austin FC', position: 'LB', age: 22, marketValue: 2500000, peakValue: 2500000, contract: '2028', nationality: 'Brazil', foot: 'Left' },
  { name: 'Emiliano Rigoni', team: 'Austin FC', position: 'RM', age: 31, marketValue: 4000000, peakValue: 8000000, contract: '2026', nationality: 'Argentina', foot: 'Left' },
  { name: 'Maxi Urruti', team: 'Austin FC', position: 'ST', age: 33, marketValue: 1500000, peakValue: 5000000, contract: '2026', nationality: 'Argentina', foot: 'Right' },
  { name: 'Dani Pereira', team: 'Austin FC', position: 'CDM', age: 26, marketValue: 2000000, peakValue: 2500000, contract: '2026', nationality: 'Venezuela', foot: 'Right' },
  { name: 'Brad Stuver', team: 'Austin FC', position: 'GK', age: 34, marketValue: 800000, peakValue: 1200000, contract: '2026', nationality: 'USA', foot: 'Right' },
  { name: 'Gyasi Zardes', team: 'Austin FC', position: 'ST', age: 33, marketValue: 1000000, peakValue: 4000000, contract: '2026', nationality: 'USA', foot: 'Right' },
  { name: 'Julio Cascante', team: 'Austin FC', position: 'CB', age: 31, marketValue: 1200000, peakValue: 2000000, contract: '2026', nationality: 'Costa Rica', foot: 'Left' },
  { name: 'Leo Väisänen', team: 'Austin FC', position: 'CB', age: 28, marketValue: 900000, peakValue: 1500000, contract: '2027', nationality: 'Finland', foot: 'Right' },
  { name: 'Hector Jimenez', team: 'Austin FC', position: 'RB', age: 36, marketValue: 400000, peakValue: 1500000, contract: '2026', nationality: 'USA', foot: 'Right' },
  { name: 'Damian Las', team: 'Austin FC', position: 'GK', age: 21, marketValue: 500000, peakValue: 500000, contract: '2027', nationality: 'Poland', foot: 'Right' },
  { name: 'Jader Obrian', team: 'Austin FC', position: 'LW', age: 27, marketValue: 1800000, peakValue: 2500000, contract: '2027', nationality: 'Colombia', foot: 'Right' },
  
  // High-value MLS players
  { name: 'Lionel Messi', team: 'Inter Miami', position: 'RW', age: 37, marketValue: 35000000, peakValue: 180000000, contract: '2025', nationality: 'Argentina', foot: 'Left' },
  { name: 'Riqui Puig', team: 'LA Galaxy', position: 'CM', age: 25, marketValue: 12000000, peakValue: 12000000, contract: '2027', nationality: 'Spain', foot: 'Right' },
  { name: 'Cucho Hernández', team: 'Columbus Crew', position: 'ST', age: 25, marketValue: 14000000, peakValue: 14000000, contract: '2027', nationality: 'Colombia', foot: 'Right' },
  { name: 'Denis Bouanga', team: 'LAFC', position: 'LW', age: 29, marketValue: 10000000, peakValue: 12000000, contract: '2026', nationality: 'Gabon', foot: 'Right' },
];

export const recentTransfers: Transfer[] = [
  { player: 'Lionel Messi', from: 'PSG', to: 'Inter Miami', fee: 0, type: 'Free Transfer', date: '2023-07-15' },
  { player: 'Lorenzo Insigne', from: 'Napoli', to: 'Toronto FC', fee: 0, type: 'Free Transfer', date: '2022-07-01' },
  { player: 'Cucho Hernández', from: 'Watford', to: 'Columbus Crew', fee: 10000000, type: 'Transfer', date: '2022-07-07' },
  { player: 'Thiago Almada', from: 'Vélez Sarsfield', to: 'Atlanta United', fee: 16000000, type: 'Transfer', date: '2022-02-01' },
  { player: 'Sebastián Driussi', from: 'Zenit', to: 'Austin FC', fee: 7500000, type: 'Transfer', date: '2021-07-22' },
];

export const positionMarketRates: Record<string, PositionMarketRate> = {
  GK: { min: 200000, avg: 800000, max: 5000000 },
  CB: { min: 300000, avg: 1500000, max: 12000000 },
  LB: { min: 300000, avg: 1200000, max: 8000000 },
  RB: { min: 300000, avg: 1200000, max: 8000000 },
  CDM: { min: 400000, avg: 2000000, max: 15000000 },
  CM: { min: 500000, avg: 2500000, max: 20000000 },
  CAM: { min: 600000, avg: 4000000, max: 35000000 },
  LW: { min: 500000, avg: 3000000, max: 25000000 },
  RW: { min: 500000, avg: 3000000, max: 35000000 },
  ST: { min: 500000, avg: 3500000, max: 30000000 },
};

// Helper functions
export function getPlayerValuation(name: string) {
  return playerValuations.find(p => 
    p.name.toLowerCase().includes(name.toLowerCase())
  );
}

export function getTeamValuations(team: string) {
  return playerValuations
    .filter(p => p.team.toLowerCase().includes(team.toLowerCase()))
    .sort((a, b) => b.marketValue - a.marketValue);
}

export function getTotalSquadValue(team: string) {
  return getTeamValuations(team).reduce((sum, p) => sum + p.marketValue, 0);
}

export function getMostValuablePlayers(limit = 10, position?: string, maxAge?: number) {
  let players = [...playerValuations];
  
  if (position) {
    players = players.filter(p => p.position.toLowerCase() === position.toLowerCase());
  }
  if (maxAge) {
    players = players.filter(p => p.age <= maxAge);
  }
  
  return players.sort((a, b) => b.marketValue - a.marketValue).slice(0, limit);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}



