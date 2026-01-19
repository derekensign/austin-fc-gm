/**
 * Script to scrape MLSPA salary guide and generate a data file
 * 
 * Run with: npx tsx scripts/scrape-mlspa-salaries.ts
 * 
 * This will scrape the complete MLSPA salary guide from mlsplayers.org
 * and save it to src/data/mlspa-salaries-scraped.ts
 */

import { scrapeMLSPASalaryGuide, generateSalaryDataFile } from '../src/lib/data-sources/mlspa-scraper';
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  console.log('Scraping MLSPA Salary Guide...\n');

  const guide = await scrapeMLSPASalaryGuide(true); // Force refresh

  if (!guide) {
    console.error('Failed to scrape MLSPA salary guide');
    process.exit(1);
  }

  console.log('\n=== SCRAPE COMPLETE ===\n');
  console.log(`Total Players: ${guide.totalPlayers}`);
  console.log(`Release Date: ${guide.releaseDate}`);
  console.log(`Source: ${guide.source}`);

  // Count by team
  const teamCounts = new Map<string, number>();
  guide.players.forEach(p => {
    teamCounts.set(p.club, (teamCounts.get(p.club) || 0) + 1);
  });

  console.log('\nPlayers by Team:');
  const sortedTeams = Array.from(teamCounts.entries()).sort((a, b) => b[1] - a[1]);
  for (const [team, count] of sortedTeams) {
    console.log(`  ${team}: ${count} players`);
  }

  // Top 10 salaries
  const topSalaries = [...guide.players]
    .sort((a, b) => b.guaranteedCompensation - a.guaranteedCompensation)
    .slice(0, 10);

  console.log('\nTop 10 Salaries:');
  topSalaries.forEach((p, i) => {
    const salary = (p.guaranteedCompensation / 1_000_000).toFixed(2);
    console.log(`  ${i + 1}. ${p.firstName} ${p.lastName} (${p.club}): $${salary}M`);
  });

  // Generate the TypeScript data file
  const dataFile = generateSalaryDataFile(guide);
  const outputPath = path.join(process.cwd(), 'src/data/mlspa-salaries-scraped.ts');
  
  await fs.writeFile(outputPath, dataFile);
  console.log(`\nSaved to: ${outputPath}`);

  // Also save raw JSON for reference
  const jsonPath = path.join(process.cwd(), 'data/mlspa-salaries-raw.json');
  await fs.writeFile(jsonPath, JSON.stringify(guide, null, 2));
  console.log(`Raw JSON saved to: ${jsonPath}`);
}

main().catch(console.error);

