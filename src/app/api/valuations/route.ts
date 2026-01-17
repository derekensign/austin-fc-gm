import { NextResponse } from 'next/server';
import { 
  playerValuations, 
  recentTransfers,
  getPlayerValuation, 
  getTeamValuations, 
  getTotalSquadValue,
  getMostValuablePlayers 
} from '@/data/valuations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const team = searchParams.get('team');
  const player = searchParams.get('player');
  const position = searchParams.get('position') || undefined;
  const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : undefined;
  const limit = parseInt(searchParams.get('limit') || '10');

  if (type === 'player' && player) {
    const valuation = getPlayerValuation(player);
    if (!valuation) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    return NextResponse.json(valuation);
  }

  if (type === 'team' && team) {
    const valuations = getTeamValuations(team);
    const totalValue = getTotalSquadValue(team);
    return NextResponse.json({ 
      team, 
      totalValue, 
      players: valuations 
    });
  }

  if (type === 'top') {
    return NextResponse.json(getMostValuablePlayers(limit, position, maxAge));
  }

  if (type === 'transfers') {
    return NextResponse.json(recentTransfers.slice(0, limit));
  }

  if (type === 'all') {
    return NextResponse.json(playerValuations);
  }

  return NextResponse.json({
    endpoints: [
      '/api/valuations?type=player&player=Driussi',
      '/api/valuations?type=team&team=Austin FC',
      '/api/valuations?type=top&limit=10',
      '/api/valuations?type=top&position=ST&maxAge=25',
      '/api/valuations?type=transfers',
      '/api/valuations?type=all',
    ],
  });
}

