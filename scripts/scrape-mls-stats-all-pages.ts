/**
 * Scrape ALL 2025 MLS Stats with pagination
 *
 * Column order: GP, GS, Mins, Sub, G, Pass%, A, Conv%, SOT, KP, xG, F, FS, OFF, YC, RC
 */

import { chromium } from 'playwright';
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

async function scrapeAllPages(): Promise<PlayerStats[]> {
  console.log('🚀 Scraping ALL MLS 2025 Stats with pagination\n');

  const browser = await chromium.launch({ headless: false }); // Use headless: false to debug
  const page = await browser.newPage();
  const allPlayers: PlayerStats[] = [];

  try {
    const url = 'https://www.mlssoccer.com/stats/players/#season=2025&competition=mls-regular-season&club=all&statType=general&position=all';

    console.log('📊 Loading page...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('table tbody tr', { timeout: 15000 });
    await page.waitForTimeout(3000);

    let pageNum = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      console.log(`\n📋 Scraping page ${pageNum}...`);

      // Extract players from current page
      const players = await page.evaluate(() => {
        const table = document.querySelector('table');
        if (!table) return [];

        const rows = Array.from(table.querySelectorAll('tbody tr'));

        return rows.map((row) => {
          try {
            const cells = Array.from(row.querySelectorAll('td'));
            const cellTexts = cells.map(c => c.textContent?.trim() || '');

            // Get player name from link
            let playerName = '';
            for (let i = 0; i < 3; i++) {
              const link = cells[i]?.querySelector('a');
              if (link && link.textContent && link.textContent.trim().length > 3) {
                playerName = link.textContent.trim();
                break;
              }
            }

            // Find team abbreviation
            let team = '';
            for (const text of cellTexts) {
              if (text && /^[A-Z]{2,4}$/.test(text) && text.length <= 4) {
                team = text;
                break;
              }
            }

            // Extract ALL numbers (integers and decimals)
            const numbers = cellTexts
              .filter(t => t && /^\d+(\.\d+)?$/.test(t.replace(/,/g, '')))
              .map(t => parseFloat(t.replace(/,/g, '')));

            // Column order: GP, GS, Mins, Sub, G, Pass%, A, Conv%, SOT, KP, xG, F, FS, OFF, YC, RC
            const gp = Math.floor(numbers[0] || 0);
            const gs = Math.floor(numbers[1] || 0);
            const mins = Math.floor(numbers[2] || 0);
            const goals = Math.floor(numbers[4] || 0);      // Index 4 = Goals
            const assists = Math.floor(numbers[6] || 0);    // Index 6 = Assists
            const xG = numbers[10];                         // Index 10 = xG (decimal)

            return {
              playerName,
              team,
              gamesPlayed: gp,
              gamesStarted: gs,
              minutesPlayed: mins,
              goals,
              assists,
              xG,
            };
          } catch (e) {
            return null;
          }
        }).filter(p => p !== null && p.playerName && p.playerName.length > 3);
      });

      const newPlayers = players.filter(p =>
        !allPlayers.some(existing =>
          existing.playerName === p.playerName && existing.team === p.team
        )
      );

      allPlayers.push(...newPlayers);
      console.log(`   ✅ Extracted ${newPlayers.length} players (${allPlayers.length} total)`);

      // Try to find and click the next button using the exact aria-label
      const nextButton = page.locator('button[aria-label="Next results"]');

      // Check if next button exists
      const nextButtonCount = await nextButton.count();
      if (nextButtonCount === 0) {
        console.log('   ℹ️  Next button not found - likely on last page');
        hasMorePages = false;
        break;
      }

      // Check if next button is disabled
      const isDisabled = await nextButton.isDisabled().catch(() => true);
      if (isDisabled) {
        console.log('   ℹ️  Next button disabled - reached last page');
        hasMorePages = false;
        break;
      }

      // Try clicking the next button
      try {
        console.log('   🔄 Clicking next button...');
        await nextButton.click({ timeout: 5000 });
        await page.waitForTimeout(3000); // Wait for page to load
        await page.waitForSelector('table tbody tr', { timeout: 10000 });
        pageNum++;
      } catch (error) {
        console.log(`   ⚠️  Error clicking next button: ${error}`);
        hasMorePages = false;
      }
    }

    console.log(`\n✅ Extracted ${allPlayers.length} total players from ${pageNum} pages\n`);

    if (allPlayers.length > 0) {
      // Save to file
      const outputPath = path.join(__dirname, '../data/mls-player-stats-2025.json');
      fs.writeFileSync(outputPath, JSON.stringify(allPlayers, null, 2));
      console.log(`💾 Saved to: ${outputPath}\n`);

      // Show top scorers
      console.log('🎯 Top 10 Goal Scorers (2025):');
      allPlayers
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10)
        .forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.playerName} (${p.team}): ${p.goals}G ${p.assists}A (xG: ${p.xG?.toFixed(1)}) - ${p.gamesPlayed} GP`);
        });

      console.log('\n🅰️  Top 10 Assist Providers:');
      allPlayers
        .sort((a, b) => b.assists - a.assists)
        .slice(0, 10)
        .forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.playerName} (${p.team}): ${p.assists}A ${p.goals}G - ${p.gamesPlayed} GP`);
        });

      return allPlayers;
    }

    return [];
  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({ path: 'mls-pagination-error.png' });
    return [];
  } finally {
    await browser.close();
  }
}

// Run scraper
scrapeAllPages().then(players => {
  if (players.length > 0) {
    console.log(`\n✅ Successfully scraped ${players.length} players with correct stats!`);
  }
});
