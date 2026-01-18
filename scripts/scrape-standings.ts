/**
 * Script to scrape MLS 2025 standings
 * Run with: npx tsx scripts/scrape-standings.ts
 */

import { scrapeMLSStandings } from '../src/lib/data-sources/mls-scraper';

async function main() {
  console.log('🏟️  Scraping MLS 2025 standings from mlssoccer.com...\n');
  
  const standings = await scrapeMLSStandings(true); // Force refresh
  
  if (!standings) {
    console.error('❌ Failed to scrape standings');
    process.exit(1);
  }
  
  console.log(`✅ Eastern Conference: ${standings.eastern.length} teams`);
  console.log(`✅ Western Conference: ${standings.western.length} teams`);
  console.log(`📅 Last Updated: ${standings.lastUpdated}`);
  console.log(`🗓️  Season: ${standings.season}\n`);
  
  // Find Austin FC
  const austin = standings.western.find(t => 
    t.team.name.toLowerCase().includes('austin')
  );
  
  if (austin) {
    console.log('⚽ AUSTIN FC STANDING:');
    console.log('─'.repeat(40));
    console.log(`   Rank: ${austin.rank} in Western Conference`);
    console.log(`   Points: ${austin.points}`);
    console.log(`   Record: ${austin.wins}W - ${austin.draws}D - ${austin.losses}L`);
    console.log(`   Games Played: ${austin.gamesPlayed}`);
    console.log(`   Goals: ${austin.goalsFor} GF / ${austin.goalsAgainst} GA (${austin.goalDiff >= 0 ? '+' : ''}${austin.goalDiff})`);
  }
  
  console.log('\n📊 WESTERN CONFERENCE STANDINGS:');
  console.log('─'.repeat(60));
  console.log('Rank | Team                    | Pts | W  | D  | L  | GD');
  console.log('─'.repeat(60));
  
  standings.western.forEach(team => {
    const name = team.team.name.padEnd(23);
    const pts = String(team.points).padStart(3);
    const w = String(team.wins).padStart(2);
    const d = String(team.draws).padStart(2);
    const l = String(team.losses).padStart(2);
    const gd = (team.goalDiff >= 0 ? '+' : '') + team.goalDiff;
    const isAustin = team.team.name.toLowerCase().includes('austin') ? ' ⬅️' : '';
    console.log(`  ${team.rank.toString().padStart(2)} | ${name} | ${pts} | ${w} | ${d} | ${l} | ${gd.padStart(3)}${isAustin}`);
  });
  
  console.log('\n✨ Standings cached for 1 hour');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

