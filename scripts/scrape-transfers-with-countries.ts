/**
 * Proper Transfermarkt scraper that extracts country information from flags
 * Uses Puppeteer to get the actual HTML, not just accessibility tree
 */

import * as fs from 'fs';
import * as path from 'path';

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  sourceCountry: string;  // From the flag!
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free';
  season: string;
  year: number;
}

const SEASONS = [
  { id: 2024, display: '24/25' },
  { id: 2023, display: '23/24' },
  { id: 2022, display: '22/23' },
  { id: 2021, display: '21/22' },
  { id: 2020, display: '20/21' },
];

function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || valueStr.toLowerCase().includes('loan')) {
    return 0;
  }
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  if (cleaned.includes('m')) return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  if (cleaned.includes('k')) return parseFloat(cleaned.replace('k', '')) * 1000;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

async function scrapeTransfersWithCountries() {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: true });
  
  const allTransfers: TransferRecord[] = [];
  
  for (const season of SEASONS) {
    console.log(`\n📊 Scraping season ${season.display}...`);
    const url = `https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1/saison_id/${season.id}`;
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Wait for transfer tables to load
      await page.waitForSelector('.box', { timeout: 30000 });
      
      // Extract transfers from the page
      const transfers = await page.evaluate((seasonDisplay: string, seasonYear: number) => {
        const results: any[] = [];
        
        // Find all team sections (each MLS team has arrivals/departures)
        const teamBoxes = document.querySelectorAll('.box');
        
        teamBoxes.forEach(box => {
          // Get team name from the header
          const teamHeader = box.querySelector('.table-header, .content-box-headline');
          if (!teamHeader) return;
          
          const teamName = teamHeader.textContent?.trim() || '';
          if (!teamName || teamName.includes('Total') || teamName.includes('Filter')) return;
          
          // Find transfer tables (arrivals and departures)
          const tables = box.querySelectorAll('table.items');
          
          tables.forEach((table, tableIndex) => {
            // Determine if arrivals or departures based on position
            const isArrivals = tableIndex === 0;
            
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
              try {
                // Get player name
                const playerCell = row.querySelector('td.hauptlink a');
                const playerName = playerCell?.textContent?.trim() || '';
                if (!playerName) return;
                
                // Get age
                const cells = row.querySelectorAll('td');
                let age = 0;
                cells.forEach(cell => {
                  const text = cell.textContent?.trim() || '';
                  const ageMatch = text.match(/^(\d{2})$/);
                  if (ageMatch) age = parseInt(ageMatch[1]);
                });
                
                // Get position
                const positionCell = row.querySelector('td:nth-child(2)');
                const position = positionCell?.textContent?.trim() || '';
                
                // Get market value
                const marketValueCell = row.querySelector('td.rechts.hauptlink');
                const marketValueStr = marketValueCell?.textContent?.trim() || '0';
                const marketValue = parseValue(marketValueStr);
                
                // Get source/destination club AND country (from the flag!)
                const clubLink = row.querySelector('td.no-border-links a[href*="/verein/"]');
                const clubName = clubLink?.textContent?.trim() || '';
                
                // Get country from the flag image title attribute
                const flagImg = row.querySelector('td.no-border-links img.flaggenrahmen');
                const countryFromFlag = flagImg?.getAttribute('title') || '';
                
                // Get transfer fee
                const feeCell = row.querySelector('td.rechts:last-child');
                const feeStr = feeCell?.textContent?.trim() || '0';
                const fee = parseValue(feeStr);
                
                // Determine transfer type
                let transferType: 'permanent' | 'loan' | 'free' = 'permanent';
                if (feeStr.toLowerCase().includes('loan')) transferType = 'loan';
                else if (fee === 0) transferType = 'free';
                
                results.push({
                  playerName,
                  age,
                  position,
                  marketValue,
                  sourceClub: isArrivals ? clubName : teamName,
                  sourceCountry: countryFromFlag,
                  fee,
                  feeDisplay: feeStr,
                  mlsTeam: teamName,
                  direction: isArrivals ? 'arrival' : 'departure',
                  transferType,
                  season: seasonDisplay,
                  year: seasonYear,
                });
              } catch (e) {
                // Skip problematic rows
              }
            });
          });
        });
        
        return results;
      }, season.display, season.id);
      
      console.log(`   Found ${transfers.length} transfers`);
      allTransfers.push(...transfers);
      
    } catch (error) {
      console.error(`   Error scraping ${season.display}:`, error);
    } finally {
      await page.close();
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  await browser.close();
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    totalTransfers: allTransfers.length,
    transfers: allTransfers,
  };
  
  const outputPath = path.join(__dirname, '../data/mls-transfers-with-countries.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Saved ${allTransfers.length} transfers to data/mls-transfers-with-countries.json`);
  
  // Show country distribution
  const countryCount: Record<string, number> = {};
  allTransfers.forEach(t => {
    const country = t.sourceCountry || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\nTop source countries:');
  Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([country, count]) => console.log(`  ${country}: ${count}`));
}

scrapeTransfersWithCountries().catch(console.error);

