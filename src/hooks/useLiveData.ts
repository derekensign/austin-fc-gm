'use client';

import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const clientCache: Record<string, CacheEntry<unknown>> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes for client-side cache

async function fetchWithCache<T>(source: string): Promise<T | null> {
  const cacheKey = `live-${source}`;
  const cached = clientCache[cacheKey];
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const response = await fetch(`/api/data/refresh?source=${source}`);
    const json = await response.json();
    
    if (json.success && json.data) {
      clientCache[cacheKey] = { data: json.data, timestamp: Date.now() };
      return json.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${source}:`, error);
    return null;
  }
}

// ============ STANDINGS ============

export interface Standing {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export function useStandings() {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithCache<Standing[]>('standings')
      .then(data => {
        setStandings(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Find Austin's position
  const austinStanding = standings?.find(s => 
    s.team.name.toLowerCase().includes('austin')
  );

  return { standings, austinStanding, loading, error };
}

// ============ SQUAD ============

export interface Player {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface Squad {
  team: { id: number; name: string; logo: string };
  players: Player[];
}

export function useSquad() {
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithCache<Squad>('squad')
      .then(data => {
        setSquad(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { squad, loading, error };
}

// ============ VALUATIONS ============

export interface PlayerValuation {
  name: string;
  position: string;
  age: number;
  nationality: string;
  marketValue: number;
  marketValueFormatted: string;
  profileUrl: string;
  photoUrl: string;
}

export function useValuations() {
  const [valuations, setValuations] = useState<PlayerValuation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithCache<PlayerValuation[]>('valuations')
      .then(data => {
        setValuations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalValue = valuations?.reduce((sum, p) => sum + p.marketValue, 0) || 0;
  const averageValue = valuations?.length ? totalValue / valuations.length : 0;

  return { valuations, totalValue, averageValue, loading, error };
}

// ============ SALARIES ============

export interface SalaryEntry {
  club: string;
  lastName: string;
  firstName: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

export function useSalaries() {
  const [salaries, setSalaries] = useState<SalaryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithCache<SalaryEntry[]>('salaries')
      .then(data => {
        setSalaries(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalSalary = salaries?.reduce((sum, p) => sum + p.guaranteedCompensation, 0) || 0;
  const averageAge = 0; // Would need age data

  return { salaries, totalSalary, averageAge, loading, error };
}

// ============ CAP STATUS ============

export interface CapStatus {
  totalBaseSalary: number;
  totalGuaranteedComp: number;
  seniorRosterCount: number;
  dpCount: number;
  tamPlayerCount: number;
  u22Count: number;
  estimatedBudgetCharge: number;
}

export function useCapStatus() {
  const [capStatus, setCapStatus] = useState<CapStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithCache<CapStatus>('capstatus')
      .then(data => {
        setCapStatus(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { capStatus, loading, error };
}

// ============ COMBINED ROSTER DATA ============

export interface CombinedPlayer {
  id: number;
  name: string;
  number: number | null;
  position: string;
  positionGroup: 'GK' | 'DEF' | 'MID' | 'FWD';
  age: number;
  photo: string;
  nationality: string;
  salary: number;
  salaryFormatted: string;
  marketValue: number;
  marketValueFormatted: string;
}

export function useCombinedRoster() {
  const { squad, loading: squadLoading } = useSquad();
  const { valuations, loading: valuationsLoading } = useValuations();
  const { salaries, loading: salariesLoading } = useSalaries();

  const loading = squadLoading || valuationsLoading || salariesLoading;

  // Combine data from all sources
  const roster: CombinedPlayer[] = [];

  if (squad?.players) {
    for (const player of squad.players) {
      // Find matching valuation
      const valuation = valuations?.find(v => 
        v.name.toLowerCase().includes(player.name.split(' ').pop()?.toLowerCase() || '') ||
        player.name.toLowerCase().includes(v.name.split(' ').pop()?.toLowerCase() || '')
      );

      // Find matching salary
      const nameParts = player.name.split(' ');
      const lastName = nameParts[nameParts.length - 1];
      const salary = salaries?.find(s => 
        s.lastName.toLowerCase() === lastName.toLowerCase()
      );

      // Determine position group
      let positionGroup: 'GK' | 'DEF' | 'MID' | 'FWD' = 'MID';
      const pos = player.position.toLowerCase();
      if (pos.includes('goal')) positionGroup = 'GK';
      else if (pos.includes('def') || pos.includes('back')) positionGroup = 'DEF';
      else if (pos.includes('mid')) positionGroup = 'MID';
      else if (pos.includes('att') || pos.includes('forward') || pos.includes('striker')) positionGroup = 'FWD';

      roster.push({
        id: player.id,
        name: player.name,
        number: player.number,
        position: player.position,
        positionGroup,
        age: valuation?.age || player.age || 0,
        photo: valuation?.photoUrl || player.photo,
        nationality: valuation?.nationality || 'Unknown',
        salary: salary?.guaranteedCompensation || 0,
        salaryFormatted: salary ? `$${(salary.guaranteedCompensation / 1000).toFixed(0)}K` : '-',
        marketValue: valuation?.marketValue || 0,
        marketValueFormatted: valuation?.marketValueFormatted || '-',
      });
    }
  }

  // Group by position
  const getPlayersByPosition = (group: 'GK' | 'DEF' | 'MID' | 'FWD') => 
    roster.filter(p => p.positionGroup === group);

  return { 
    roster, 
    getPlayersByPosition,
    loading,
    totalPlayers: roster.length,
  };
}

