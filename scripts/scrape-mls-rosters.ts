/**
 * Script to scrape all MLS rosters locally
 * 
 * Run with: npx tsx scripts/scrape-mls-rosters.ts
 * 
 * This will scrape rosters from mlssoccer.com for all 30 teams
 * and cache the results locally.
 */

import { scrapeAllMLSRosters, generateRosterSummaryForAI } from '../src/lib/data-sources/mls-rosters';

async function main() {
  console.log('Starting MLS roster scrape...');
  console.log('This may take 2-3 minutes to scrape all 30 teams.\n');

  const rosters = await scrapeAllMLSRosters(true); // Force refresh

  if (!rosters) {
    console.error('Failed to scrape rosters');
    process.exit(1);
  }

  console.log('\n=== SCRAPE COMPLETE ===\n');
  console.log(`Scraped ${rosters.teams.length} teams`);
  
  // Print summary stats
  rosters.teams.forEach(team => {
    const dps = team.players.filter(p => p.categories.isDP);
    console.log(`${team.team.abbreviation}: ${team.players.length} players, DPs: ${dps.map(p => p.name).join(', ') || 'None'}`);
  });

  // Save a summary to a file for reference
  const summary = generateRosterSummaryForAI(rosters);
  const fs = await import('fs/promises');
  await fs.writeFile('data/mls-rosters-summary.txt', summary);
  console.log('\nSummary saved to data/mls-rosters-summary.txt');
}

main().catch(console.error);

