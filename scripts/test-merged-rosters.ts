/**
 * Script to test merged rosters (mlssoccer.com rosters + MLSPA salaries)
 * 
 * Run with: npx tsx scripts/test-merged-rosters.ts
 */

import { getMergedRosters, generateMergedRosterSummaryForAI } from '../src/lib/data-sources/mls-merged-rosters';

async function main() {
  console.log('Testing merged rosters...\n');

  const rosters = await getMergedRosters(true); // Force refresh

  if (!rosters) {
    console.error('Failed to get merged rosters');
    process.exit(1);
  }

  console.log('=== MERGE COMPLETE ===\n');
  console.log(`Merged ${rosters.teams.length} teams`);
  console.log(`Sources:`);
  console.log(`  - Rosters: ${rosters.sources.rosters}`);
  console.log(`  - Salaries: ${rosters.sources.salaries}\n`);

  // Print summary stats for each team
  rosters.teams.forEach(team => {
    const formatSalary = (amount: number) => {
      if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
      return `$${(amount / 1_000).toFixed(0)}K`;
    };

    const dps = team.players.filter(p => p.categories.isDP);
    const withSalary = team.players.filter(p => p.salary.matched);

    console.log(`${team.team.abbreviation}: ${team.stats.totalPlayers} players, ${team.stats.playersWithSalary} with salary data`);
    console.log(`  Total Guaranteed: ${formatSalary(team.stats.totalGuaranteedComp)}`);
    console.log(`  DPs: ${dps.map(p => `${p.name} (${p.salary.guaranteedCompensation ? formatSalary(p.salary.guaranteedCompensation) : 'N/A'})`).join(', ') || 'None'}`);
    
    // Show top 3 salaries
    const topSalaries = withSalary
      .sort((a, b) => (b.salary.guaranteedCompensation || 0) - (a.salary.guaranteedCompensation || 0))
      .slice(0, 3);
    if (topSalaries.length > 0) {
      console.log(`  Top Salaries: ${topSalaries.map(p => `${p.name} ${formatSalary(p.salary.guaranteedCompensation!)}`).join(', ')}`);
    }
    console.log('');
  });

  // Save a summary
  const summary = generateMergedRosterSummaryForAI(rosters);
  const fs = await import('fs/promises');
  await fs.writeFile('data/mls-merged-rosters-summary.txt', summary);
  console.log('\nSummary saved to data/mls-merged-rosters-summary.txt');
}

main().catch(console.error);

