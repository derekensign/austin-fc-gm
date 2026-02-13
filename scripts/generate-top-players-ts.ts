/**
 * Generate TypeScript export for top MLS players
 * Includes top 50 goal scorers + top 50 assist providers (deduplicated)
 */

import * as fs from 'fs';
import * as path from 'path';

interface PlayerStats {
  playerName: string;
  team: string;
  gamesPlayed: number;
  gamesStarted: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  xG?: number;
}

// Team abbreviation to full name mapping
const teamMap: Record<string, string> = {
  'MIA': 'Inter Miami',
  'LAFC': 'LAFC',
  'LA': 'LA Galaxy',
  'NSH': 'Nashville SC',
  'SD': 'San Diego FC',
  'CIN': 'FC Cincinnati',
  'SKC': 'Sporting Kansas City',
  'DAL': 'FC Dallas',
  'NYC': 'New York City FC',
  'RBNY': 'New York Red Bulls',
  'CHI': 'Chicago Fire',
  'VAN': 'Vancouver Whitecaps',
  'ORL': 'Orlando City SC',
  'CLB': 'Columbus Crew',
  'PHI': 'Philadelphia Union',
  'SEA': 'Seattle Sounders',
  'SJ': 'San Jose Earthquakes',
  'MTL': 'CF Montréal',
  'COL': 'Colorado Rapids',
  'CLT': 'Charlotte FC',
  'NE': 'New England Revolution',
  'HOU': 'Houston Dynamo',
  'ATL': 'Atlanta United',
  'POR': 'Portland Timbers',
  'MIN': 'Minnesota United',
  'TOR': 'Toronto FC',
  'RSL': 'Real Salt Lake',
  'STL': 'St. Louis CITY SC',
  'AUS': 'Austin FC',
};

// Read all players
const statsFile = path.join(__dirname, '../data/mls-player-stats-2025.json');
const allPlayers: PlayerStats[] = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));

console.log(`📊 Loaded ${allPlayers.length} total players\n`);

// Get top 50 goal scorers
const topScorers = [...allPlayers]
  .sort((a, b) => b.goals - a.goals)
  .slice(0, 50);

// Get top 50 assist providers
const topAssisters = [...allPlayers]
  .sort((a, b) => b.assists - a.assists)
  .slice(0, 50);

// Merge and deduplicate
const topPlayersSet = new Map<string, PlayerStats>();
[...topScorers, ...topAssisters].forEach(player => {
  const key = `${player.playerName}_${player.team}`;
  if (!topPlayersSet.has(key)) {
    topPlayersSet.set(key, player);
  }
});

const topPlayers = Array.from(topPlayersSet.values())
  .sort((a, b) => b.goals - a.goals); // Sort by goals

console.log(`✅ Selected ${topPlayers.length} unique top players\n`);

// Generate TypeScript code
const tsCode = topPlayers.map(p => {
  const team = teamMap[p.team] || p.team;
  return `  { name: '${p.playerName}', team: '${team}', position: 'MID', goals: ${p.goals}, assists: ${p.assists}, minutes: ${p.minutesPlayed}, appearances: ${p.gamesPlayed}, yellowCards: 0, redCards: 0 },`;
}).join('\n');

const output = `// Top ${topPlayers.length} MLS players by goals and assists (2025 season)
// Auto-generated from scraped MLSSoccer.com data
export const leaguePlayerStats: PlayerStats[] = [
${tsCode}
];`;

console.log('🔄 Generated TypeScript code\n');
console.log('📋 Top 10 Goal Scorers:');
topPlayers.slice(0, 10).forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.playerName} (${p.team}): ${p.goals}G ${p.assists}A - ${p.gamesPlayed} GP`);
});

console.log('\n📋 Top 10 Assist Providers:');
[...topPlayers].sort((a, b) => b.assists - a.assists).slice(0, 10).forEach((p, i) => {
  console.log(`   ${i + 1}. ${p.playerName} (${p.team}): ${p.assists}A ${p.goals}G - ${p.gamesPlayed} GP`);
});

// Save to file
const outputPath = path.join(__dirname, '../data/top-players-2025.ts');
fs.writeFileSync(outputPath, output);

console.log(`\n💾 Saved to: ${outputPath}`);
console.log(`\n✅ Ready to copy into mls-stats.ts (lines 109-139)`);
