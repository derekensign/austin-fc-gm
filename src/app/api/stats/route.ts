import { NextResponse } from 'next/server';
import { standings, leaguePlayerStats, getTopScorers, getPlayerStatsByTeam } from '@/data/mls-stats';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const team = searchParams.get('team');
  const conference = searchParams.get('conference');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (type === 'standings') {
    if (conference === 'western' || conference === 'eastern') {
      return NextResponse.json(standings[conference]);
    }
    return NextResponse.json(standings);
  }

  if (type === 'scorers') {
    return NextResponse.json(getTopScorers(limit));
  }

  if (type === 'players') {
    if (team) {
      return NextResponse.json(getPlayerStatsByTeam(team));
    }
    return NextResponse.json(leaguePlayerStats);
  }

  return NextResponse.json({
    endpoints: [
      '/api/stats?type=standings&conference=western',
      '/api/stats?type=standings&conference=eastern',
      '/api/stats?type=scorers&limit=10',
      '/api/stats?type=players&team=Austin FC',
    ],
  });
}



