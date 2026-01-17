/**
 * Data Refresh API
 * 
 * Endpoints to manually refresh cached data from external sources
 */

import { NextResponse } from 'next/server';
import {
  getMLSStandings,
  getTeamSquad,
  getMLSTopScorers,
  getTeamFixtures,
  AUSTIN_FC_ID,
} from '@/lib/data-sources/api-football';
import {
  getTeamValuations,
  getTeamMarketValue,
} from '@/lib/data-sources/transfermarkt';
import {
  getTeamSalaries,
  calculateTeamCapStatus,
} from '@/lib/data-sources/mls-salaries';
import { clearCache, getCacheInfo } from '@/lib/cache/file-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    switch (source) {
      case 'standings':
        const standings = await getMLSStandings(forceRefresh);
        return NextResponse.json({ success: true, data: standings, source: 'api-football' });

      case 'squad':
        const squad = await getTeamSquad(AUSTIN_FC_ID, forceRefresh);
        return NextResponse.json({ success: true, data: squad, source: 'api-football' });

      case 'fixtures':
        const fixtures = await getTeamFixtures(AUSTIN_FC_ID, forceRefresh);
        return NextResponse.json({ success: true, data: fixtures, source: 'api-football' });

      case 'topscorers':
        const scorers = await getMLSTopScorers(forceRefresh);
        return NextResponse.json({ success: true, data: scorers, source: 'api-football' });

      case 'valuations':
        const valuations = await getTeamValuations(undefined, forceRefresh);
        return NextResponse.json({ success: true, data: valuations, source: 'transfermarkt' });

      case 'marketvalue':
        const marketValue = await getTeamMarketValue(undefined, forceRefresh);
        return NextResponse.json({ success: true, data: marketValue, source: 'transfermarkt' });

      case 'salaries':
        const salaries = await getTeamSalaries('ATX');
        return NextResponse.json({ success: true, data: salaries, source: 'mlspa' });

      case 'capstatus':
        const capStatus = await calculateTeamCapStatus('ATX');
        return NextResponse.json({ success: true, data: capStatus, source: 'mlspa' });

      case 'cache':
        const cacheInfo = await getCacheInfo();
        return NextResponse.json({ success: true, data: cacheInfo });

      case 'clear':
        await clearCache();
        return NextResponse.json({ success: true, message: 'Cache cleared' });

      default:
        return NextResponse.json({
          success: true,
          availableSources: [
            'standings - MLS standings from API-Football',
            'squad - Austin FC squad from API-Football',
            'fixtures - Austin FC fixtures from API-Football',
            'topscorers - MLS top scorers from API-Football',
            'valuations - Player valuations from Transfermarkt',
            'marketvalue - Team market value from Transfermarkt',
            'salaries - Player salaries from MLSPA',
            'capstatus - Salary cap calculations',
            'cache - View cache status',
            'clear - Clear all cached data',
          ],
          usage: '/api/data/refresh?source=standings&refresh=true',
        });
    }
  } catch (error) {
    console.error('Data refresh error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST endpoint to refresh all data
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';

  const results: Record<string, { success: boolean; source: string; error?: string }> = {};

  // Refresh API-Football data
  try {
    await getMLSStandings(forceRefresh);
    results.standings = { success: true, source: 'api-football' };
  } catch (e) {
    results.standings = { success: false, source: 'api-football', error: String(e) };
  }

  try {
    await getTeamSquad(AUSTIN_FC_ID, forceRefresh);
    results.squad = { success: true, source: 'api-football' };
  } catch (e) {
    results.squad = { success: false, source: 'api-football', error: String(e) };
  }

  try {
    await getMLSTopScorers(forceRefresh);
    results.topscorers = { success: true, source: 'api-football' };
  } catch (e) {
    results.topscorers = { success: false, source: 'api-football', error: String(e) };
  }

  // Refresh Transfermarkt data (be careful with rate limits)
  try {
    await getTeamValuations(undefined, forceRefresh);
    results.valuations = { success: true, source: 'transfermarkt' };
  } catch (e) {
    results.valuations = { success: false, source: 'transfermarkt', error: String(e) };
  }

  // Salary data (static, always succeeds)
  try {
    await getTeamSalaries('ATX');
    results.salaries = { success: true, source: 'mlspa' };
  } catch (e) {
    results.salaries = { success: false, source: 'mlspa', error: String(e) };
  }

  return NextResponse.json({
    success: true,
    results,
    timestamp: new Date().toISOString(),
  });
}

