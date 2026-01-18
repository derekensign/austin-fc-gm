/**
 * API-Football Integration
 * https://www.api-football.com/ (via RapidAPI)
 * 
 * Free tier: 100 requests/day
 * Covers MLS standings, fixtures, player stats
 */

import { getCached, setCache } from '../cache/file-cache';

const API_KEY = process.env.API_FOOTBALL_KEY || '';

// Support both direct API-Football and RapidAPI
// Direct: https://v3.football.api-sports.io
// RapidAPI: https://api-football-v1.p.rapidapi.com/v3
const USE_RAPIDAPI = API_KEY.length > 40; // RapidAPI keys are longer
const BASE_URL = USE_RAPIDAPI 
  ? 'https://api-football-v1.p.rapidapi.com/v3'
  : 'https://v3.football.api-sports.io';
const API_HOST = 'api-football-v1.p.rapidapi.com';

// MLS League ID in API-Football
const MLS_LEAGUE_ID = 253;
// Note: Free API-Football plan only has 2022-2024 data
// Change to 2025 when you upgrade or when season data becomes available
const CURRENT_SEASON = 2024;

interface ApiResponse<T> {
  response: T;
  errors: Record<string, string> | string[];
}

async function fetchFromApi<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T | null> {
  if (!API_KEY) {
    console.warn('API_FOOTBALL_KEY not set - using mock data');
    return null;
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  // Set headers based on API type
  const headers: Record<string, string> = USE_RAPIDAPI
    ? {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      }
    : {
        'x-apisports-key': API_KEY,
      };

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      console.error(`API-Football error: ${response.status}`);
      return null;
    }

    const data: ApiResponse<T> = await response.json();
    
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API-Football errors:', data.errors);
      return null;
    }

    return data.response;
  } catch (error) {
    console.error('API-Football fetch error:', error);
    return null;
  }
}

// ============ STANDINGS ============

export interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
  form: string;
}

export async function getMLSStandings(forceRefresh = false): Promise<Standing[] | null> {
  const cacheKey = `mls-standings-${CURRENT_SEASON}`;
  
  if (!forceRefresh) {
    const cached = await getCached<Standing[]>(cacheKey);
    if (cached) return cached;
  }

  const data = await fetchFromApi<{ league: { standings: Standing[][] } }[]>('/standings', {
    league: MLS_LEAGUE_ID,
    season: CURRENT_SEASON,
  });

  if (data && data[0]?.league?.standings) {
    // MLS has conferences, flatten or return first group
    const standings = data[0].league.standings.flat();
    await setCache(cacheKey, standings, 4 * 60 * 60 * 1000); // 4 hour TTL
    return standings;
  }

  return null;
}

// ============ FIXTURES ============

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    venue: { name: string; city: string };
    status: { short: string; elapsed: number | null };
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
}

export async function getTeamFixtures(teamId: number, forceRefresh = false): Promise<Fixture[] | null> {
  const cacheKey = `fixtures-${teamId}-${CURRENT_SEASON}`;
  
  if (!forceRefresh) {
    const cached = await getCached<Fixture[]>(cacheKey);
    if (cached) return cached;
  }

  const data = await fetchFromApi<Fixture[]>('/fixtures', {
    team: teamId,
    season: CURRENT_SEASON,
    league: MLS_LEAGUE_ID,
  });

  if (data) {
    await setCache(cacheKey, data, 2 * 60 * 60 * 1000); // 2 hour TTL
    return data;
  }

  return null;
}

// ============ TEAM INFO ============

export interface TeamInfo {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    logo: string;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    capacity: number;
    image: string;
  };
}

// Austin FC team ID in API-Football (Q2 Stadium, founded 2021)
export const AUSTIN_FC_ID = 16489;

export async function getTeamInfo(teamId: number = AUSTIN_FC_ID): Promise<TeamInfo | null> {
  const cacheKey = `team-info-${teamId}`;
  
  const cached = await getCached<TeamInfo>(cacheKey);
  if (cached) return cached;

  const data = await fetchFromApi<TeamInfo[]>('/teams', { id: teamId });

  if (data && data[0]) {
    await setCache(cacheKey, data[0], 24 * 60 * 60 * 1000); // 24 hour TTL
    return data[0];
  }

  return null;
}

// ============ SQUAD/PLAYERS ============

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

export async function getTeamSquad(teamId: number = AUSTIN_FC_ID, forceRefresh = false): Promise<Squad | null> {
  const cacheKey = `squad-${teamId}`;
  
  if (!forceRefresh) {
    const cached = await getCached<Squad>(cacheKey);
    if (cached) return cached;
  }

  const data = await fetchFromApi<Squad[]>('/players/squads', { team: teamId });

  if (data && data[0]) {
    await setCache(cacheKey, data[0], 24 * 60 * 60 * 1000); // 24 hour TTL
    return data[0];
  }

  return null;
}

// ============ PLAYER STATISTICS ============

export interface PlayerStats {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    nationality: string;
    photo: string;
  };
  statistics: Array<{
    team: { id: number; name: string };
    league: { id: number; name: string; season: number };
    games: { appearences: number; minutes: number; position: string; rating: string };
    goals: { total: number; assists: number };
    shots: { total: number; on: number };
    passes: { total: number; accuracy: number };
    cards: { yellow: number; red: number };
  }>;
}

export async function getPlayerStats(playerId: number, forceRefresh = false): Promise<PlayerStats | null> {
  const cacheKey = `player-stats-${playerId}-${CURRENT_SEASON}`;
  
  if (!forceRefresh) {
    const cached = await getCached<PlayerStats>(cacheKey);
    if (cached) return cached;
  }

  const data = await fetchFromApi<PlayerStats[]>('/players', {
    id: playerId,
    season: CURRENT_SEASON,
  });

  if (data && data[0]) {
    await setCache(cacheKey, data[0], 12 * 60 * 60 * 1000); // 12 hour TTL
    return data[0];
  }

  return null;
}

// ============ TOP SCORERS ============

export async function getMLSTopScorers(forceRefresh = false): Promise<PlayerStats[] | null> {
  const cacheKey = `mls-top-scorers-${CURRENT_SEASON}`;
  
  if (!forceRefresh) {
    const cached = await getCached<PlayerStats[]>(cacheKey);
    if (cached) return cached;
  }

  const data = await fetchFromApi<PlayerStats[]>('/players/topscorers', {
    league: MLS_LEAGUE_ID,
    season: CURRENT_SEASON,
  });

  if (data) {
    await setCache(cacheKey, data, 4 * 60 * 60 * 1000); // 4 hour TTL
    return data;
  }

  return null;
}

// ============ LIVE FIXTURES ============

export async function getLiveFixtures(): Promise<Fixture[] | null> {
  // Don't cache live data
  return fetchFromApi<Fixture[]>('/fixtures', {
    live: 'all',
    league: MLS_LEAGUE_ID,
  });
}

