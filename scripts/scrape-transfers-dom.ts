/**
 * Proper Transfermarkt scraper using Puppeteer DOM queries
 * Extracts country information directly from flag title attributes
 */

import * as fs from 'fs';
import * as path from 'path';

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  nationality: string;
  marketValue: number;
  sourceClub: string;
  sourceCountry: string;  // From the flag title!
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure';
  transferType: 'permanent' | 'loan' | 'free' | 'end_of_loan';
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
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || 
      valueStr.toLowerCase().includes('loan') || valueStr === '?') {
    return 0;
  }
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  if (cleaned.includes('m')) return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  if (cleaned.includes('k') || cleaned.includes('th')) return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

async function scrapeTransfersFromDOM() {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const allTransfers: TransferRecord[] = [];
  
  for (const season of SEASONS) {
    console.log(`\n📊 Scraping season ${season.display}...`);
    const url = `https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1/saison_id/${season.id}`;
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    try {
      console.log(`   Loading ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Wait for the transfer boxes to load
      await page.waitForSelector('.box', { timeout: 30000 });
      
      // Extract all transfers by querying the DOM
      const transfers = await page.evaluate((seasonDisplay: string, seasonYear: number) => {
        const results: any[] = [];
        
        // Find all team transfer boxes
        const boxes = document.querySelectorAll('.box');
        
        boxes.forEach(box => {
          // Get team name from the header
          const headerLink = box.querySelector('.content-box-headline a, .table-header a');
          const teamName = headerLink?.textContent?.trim() || '';
          
          if (!teamName || teamName.toLowerCase().includes('filter') || teamName.toLowerCase().includes('total')) {
            return;
          }
          
          // Find tables within this box (arrivals and departures)
          const tables = box.querySelectorAll('table.items');
          
          tables.forEach((table, tableIdx) => {
            // Check if this is arrivals or departures based on preceding header
            let direction: 'arrival' | 'departure' = 'arrival';
            const prevHeader = table.previousElementSibling;
            if (prevHeader?.textContent?.toLowerCase().includes('out') || 
                prevHeader?.textContent?.toLowerCase().includes('departure')) {
              direction = 'departure';
            }
            
            // Also check if we're in the second table (usually departures)
            if (tableIdx === 1) {
              direction = 'departure';
            }
            
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
              try {
                // Player name - from the hauptlink cell
                const playerLink = row.querySelector('td.hauptlink a');
                const playerName = playerLink?.textContent?.trim() || '';
                if (!playerName) return;
                
                // Age
                const cells = row.querySelectorAll('td');
                let age = 0;
                cells.forEach(cell => {
                  const text = cell.textContent?.trim() || '';
                  if (/^\d{2}$/.test(text)) {
                    age = parseInt(text);
                  }
                });
                
                // Player nationality - flag in the player info cell
                const nationalityFlag = row.querySelector('td.hauptlink img.flaggenrahmen, td:first-child img.flaggenrahmen');
                const nationality = nationalityFlag?.getAttribute('title') || '';
                
                // Position
                let position = '';
                cells.forEach(cell => {
                  const text = cell.textContent?.trim() || '';
                  const positions = ['Goalkeeper', 'Centre-Back', 'Left-Back', 'Right-Back', 
                    'Defensive Midfield', 'Central Midfield', 'Attacking Midfield',
                    'Left Winger', 'Right Winger', 'Centre-Forward', 'Second Striker',
                    'Left Midfield', 'Right Midfield'];
                  if (positions.some(p => text.includes(p))) {
                    position = text;
                  }
                });
                
                // Market value
                const marketValueCell = row.querySelector('td.rechts.hauptlink');
                const marketValueStr = marketValueCell?.textContent?.trim() || '0';
                
                // Source/destination club and COUNTRY (from the flag!)
                // The club cell contains both a club link and a country flag
                const clubCells = row.querySelectorAll('td.no-border-links, td.no-border-rechts');
                let sourceClub = '';
                let sourceCountry = '';
                
                clubCells.forEach(cell => {
                  // Look for the club link
                  const clubLink = cell.querySelector('a[href*="/verein/"]');
                  if (clubLink) {
                    const clubText = clubLink.textContent?.trim() || '';
                    if (clubText && !sourceClub) {
                      sourceClub = clubText;
                    }
                  }
                  
                  // Look for country flag (flaggenrahmen class) - this is the KEY!
                  const countryFlag = cell.querySelector('img.flaggenrahmen[title]');
                  if (countryFlag) {
                    const country = countryFlag.getAttribute('title') || '';
                    // Only set if it looks like a country (not a club name)
                    if (country && country.length < 30 && !country.includes('FC') && 
                        !country.includes('CF') && !country.includes('SC')) {
                      sourceCountry = country;
                    }
                  }
                });
                
                // Transfer fee - last rechts cell
                const feeCells = row.querySelectorAll('td.rechts');
                let feeStr = '';
                feeCells.forEach(cell => {
                  const text = cell.textContent?.trim() || '';
                  if (text.includes('€') || text.toLowerCase().includes('free') || 
                      text.toLowerCase().includes('loan') || text === '-') {
                    feeStr = text;
                  }
                });
                
                // Determine transfer type
                let transferType: 'permanent' | 'loan' | 'free' | 'end_of_loan' = 'permanent';
                const feeTextLower = feeStr.toLowerCase();
                if (feeTextLower.includes('end of loan')) {
                  transferType = 'end_of_loan';
                } else if (feeTextLower.includes('loan')) {
                  transferType = 'loan';
                } else if (feeTextLower.includes('free') || feeStr === '-' || !feeStr) {
                  transferType = 'free';
                }
                
                // Parse market value
                function parseVal(str: string): number {
                  if (!str || str === '-' || str.toLowerCase().includes('free') || 
                      str.toLowerCase().includes('loan') || str === '?') return 0;
                  const cleaned = str.replace(/[€$,\s]/g, '').toLowerCase();
                  if (cleaned.includes('m')) return parseFloat(cleaned.replace('m', '')) * 1_000_000;
                  if (cleaned.includes('k') || cleaned.includes('th')) return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
                  const num = parseFloat(cleaned);
                  return isNaN(num) ? 0 : num;
                }
                
                results.push({
                  playerName,
                  age,
                  nationality,
                  position,
                  marketValue: parseVal(marketValueStr),
                  sourceClub: sourceClub || 'Unknown',
                  sourceCountry: sourceCountry || 'Unknown',
                  fee: parseVal(feeStr),
                  feeDisplay: feeStr || '-',
                  mlsTeam: teamName,
                  direction,
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
      
      // Log sample to verify country extraction
      const withCountry = transfers.filter((t: any) => t.sourceCountry && t.sourceCountry !== 'Unknown');
      console.log(`   ${withCountry.length} have source country from flags`);
      if (withCountry.length > 0) {
        console.log(`   Sample: ${withCountry[0].playerName} from ${withCountry[0].sourceClub} (${withCountry[0].sourceCountry})`);
      }
      
      allTransfers.push(...transfers);
      
    } catch (error) {
      console.error(`   Error scraping ${season.display}:`, error);
    } finally {
      await page.close();
    }
    
    // Rate limiting - be nice to Transfermarkt
    console.log('   Waiting 3s before next season...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  await browser.close();
  
  // Filter out empty/invalid transfers
  const validTransfers = allTransfers.filter(t => t.playerName && t.mlsTeam);
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    summary: {
      totalTransfers: validTransfers.length,
      arrivals: validTransfers.filter(t => t.direction === 'arrival').length,
      departures: validTransfers.filter(t => t.direction === 'departure').length,
      withCountry: validTransfers.filter(t => t.sourceCountry && t.sourceCountry !== 'Unknown').length,
    },
    transfers: validTransfers,
  };
  
  const outputPath = path.join(__dirname, '../data/mls-transfers-dom.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Saved ${validTransfers.length} transfers to data/mls-transfers-dom.json`);
  console.log(`   - Arrivals: ${output.summary.arrivals}`);
  console.log(`   - Departures: ${output.summary.departures}`);
  console.log(`   - With country from flags: ${output.summary.withCountry}`);
  
  // Show country distribution
  const countryCount: Record<string, number> = {};
  validTransfers.forEach(t => {
    const country = t.sourceCountry || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\nTop 25 source countries (from DOM flags):');
  Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .forEach(([country, count]) => console.log(`  ${country}: ${count}`));
}

scrapeTransfersFromDOM().catch(console.error);

