/**
 * MLS Transfer History Scraper
 * 
 * Scrapes MLS-wide transfer data from Transfermarkt
 * Source: https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1
 * 
 * Analyzes which leagues MLS acquires players from over the last 5 years
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { promises as fs } from 'fs';

// ============================================================================
// TYPES
// ============================================================================

interface TransferRecord {
  playerName: string;
  age: number | null;
  nationality: string;
  position: string;
  fromClub: string;
  fromCountry: string;  // Country of the source club
  fromLeague: string;   // League of the source club (if detectable)
  toClub: string;       // MLS club
  fee: string;          // Raw fee string
  feeNumeric: number;   // Parsed fee in USD
  type: 'permanent' | 'loan' | 'free' | 'unknown';
  season: string;       // e.g., "24/25", "23/24"
}

interface SeasonTransfers {
  season: string;
  arrivals: TransferRecord[];
  departures: TransferRecord[];
}

interface MLSTransferAnalysis {
  seasons: SeasonTransfers[];
  sourceLeagues: { league: string; country: string; count: number; totalSpend: number }[];
  topSourceCountries: { country: string; count: number; totalSpend: number }[];
  totalArrivals: number;
  totalSpend: number;
  scrapedAt: string;
}

// ============================================================================
// SCRAPER UTILITIES
// ============================================================================

const BASE_URL = 'https://www.transfermarkt.us';
const MLS_TRANSFERS_URL = `${BASE_URL}/major-league-soccer/transfers/wettbewerb/MLS1`;

// Seasons to scrape (last 5 years + current)
const SEASONS_TO_SCRAPE = ['25/26', '24/25', '23/24', '22/23', '21/22', '20/21'];

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920x1080',
      ],
    });
  }
  return browser;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseTransferFee(feeStr: string): { numeric: number; type: TransferRecord['type'] } {
  const cleaned = feeStr.toLowerCase().trim();
  
  if (cleaned.includes('loan') || cleaned === '-') {
    return { numeric: 0, type: 'loan' };
  }
  if (cleaned.includes('free') || cleaned === 'free transfer') {
    return { numeric: 0, type: 'free' };
  }
  if (cleaned === '?' || cleaned === '-' || cleaned === '') {
    return { numeric: 0, type: 'unknown' };
  }
  
  // Parse values like "€5.00m", "$500k", "€4.50m"
  const numMatch = cleaned.match(/([\d.,]+)\s*(m|k)?/);
  if (numMatch) {
    let value = parseFloat(numMatch[1].replace(',', '.'));
    if (numMatch[2] === 'm') value *= 1_000_000;
    else if (numMatch[2] === 'k') value *= 1_000;
    return { numeric: value, type: 'permanent' };
  }
  
  return { numeric: 0, type: 'unknown' };
}

// Known league mappings by country
const COUNTRY_TO_LEAGUE: Record<string, string> = {
  'England': 'Premier League / EFL',
  'Spain': 'La Liga / Segunda',
  'Germany': 'Bundesliga / 2. Bundesliga',
  'Italy': 'Serie A / Serie B',
  'France': 'Ligue 1 / Ligue 2',
  'Portugal': 'Primeira Liga',
  'Netherlands': 'Eredivisie',
  'Belgium': 'Pro League',
  'Brazil': 'Brasileirão',
  'Argentina': 'Liga Profesional',
  'Mexico': 'Liga MX',
  'Colombia': 'Categoría Primera A',
  'United States': 'MLS / USL',
  'Scotland': 'Scottish Premiership',
  'Turkey': 'Süper Lig',
  'Russia': 'Russian Premier League',
  'Ukraine': 'Ukrainian Premier League',
  'Japan': 'J1 League',
  'South Korea': 'K League',
  'China': 'Chinese Super League',
  'Saudi Arabia': 'Saudi Pro League',
  'Australia': 'A-League',
  'Sweden': 'Allsvenskan',
  'Denmark': 'Superliga',
  'Norway': 'Eliteserien',
  'Switzerland': 'Super League',
  'Austria': 'Bundesliga (Austria)',
  'Greece': 'Super League Greece',
  'Poland': 'Ekstraklasa',
  'Czech Republic': 'Czech First League',
  'Croatia': 'HNL',
  'Serbia': 'Serbian SuperLiga',
  'Ecuador': 'Serie A (Ecuador)',
  'Chile': 'Primera División (Chile)',
  'Peru': 'Liga 1 (Peru)',
  'Uruguay': 'Primera División (Uruguay)',
  'Paraguay': 'Primera División (Paraguay)',
  'Venezuela': 'Primera División (Venezuela)',
  'Costa Rica': 'Primera División (Costa Rica)',
  'Honduras': 'Liga Nacional (Honduras)',
  'Jamaica': 'Jamaica Premier League',
  'Canada': 'Canadian Premier League',
};

async function handleCookieConsent(page: Page): Promise<void> {
  try {
    // Look for common cookie consent buttons
    const selectors = [
      '[title="ACCEPT ALL"]',
      '.sp_choice_type_11',
      '[data-testid="uc-accept-all-button"]',
      '#onetrust-accept-btn-handler',
      '.accept-cookies',
      'button[class*="accept"]',
    ];
    
    for (const selector of selectors) {
      const button = await page.$(selector);
      if (button) {
        await button.click();
        await delay(1500);
        break;
      }
    }
  } catch { /* no popup */ }
}

async function scrapeSeasonTransfers(page: Page, season: string): Promise<SeasonTransfers> {
  console.log(`\nScraping season ${season}...`);
  
  // Navigate to the season-specific page
  // Transfermarkt uses format like saison_id=2024 for 24/25 season
  const seasonYear = '20' + season.split('/')[0]; // e.g., "24/25" -> "2024"
  const url = `${MLS_TRANSFERS_URL}/plus/0?saison_id=${seasonYear}&s_w=&leihe=1&intern=0`;
  
  console.log(`URL: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await delay(2000);
  
  await handleCookieConsent(page);
  await delay(1000);
  
  // Extract arrivals from the page
  const arrivals = await page.evaluate((seasonStr) => {
    const results: {
      playerName: string;
      age: number | null;
      nationality: string;
      position: string;
      fromClub: string;
      fromCountry: string;
      toClub: string;
      fee: string;
      season: string;
    }[] = [];
    
    // Find all team sections
    const teamSections = document.querySelectorAll('.box');
    
    teamSections.forEach(section => {
      // Get the MLS team name from section header
      const teamHeader = section.querySelector('h2 a');
      const mlsTeamName = teamHeader?.textContent?.trim() || 'Unknown MLS Team';
      
      // Find the "In" (arrivals) table
      const tables = section.querySelectorAll('table.items');
      
      tables.forEach((table, tableIndex) => {
        // Check if this is arrivals table (usually first) by looking at headers
        const headerText = table.previousElementSibling?.textContent?.toLowerCase() || '';
        const isArrivals = tableIndex === 0 || headerText.includes('in');
        
        if (!isArrivals) return;
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          try {
            // Player name
            const nameEl = row.querySelector('.hauptlink a');
            const playerName = nameEl?.textContent?.trim() || '';
            if (!playerName) return;
            
            // Get all cells
            const cells = row.querySelectorAll('td');
            
            // Age (usually in a centered cell)
            let age: number | null = null;
            cells.forEach(cell => {
              const text = cell.textContent?.trim() || '';
              if (cell.classList.contains('zentriert')) {
                const parsed = parseInt(text);
                if (parsed > 15 && parsed < 50) age = parsed;
              }
            });
            
            // Nationality from flag
            const flagImg = row.querySelector('img.flaggenrahmen');
            const nationality = flagImg?.getAttribute('title') || 'Unknown';
            
            // Position
            const posCell = row.querySelector('td.posrela');
            const position = posCell?.textContent?.trim()?.split('\n')[0]?.trim() || 'Unknown';
            
            // From club and country
            const fromClubEl = row.querySelector('td.no-border-links a[href*="/verein/"]');
            const fromClub = fromClubEl?.textContent?.trim() || 'Unknown';
            
            // From country (flag next to club)
            const fromFlagImg = row.querySelector('td.no-border-links img.flaggenrahmen');
            const fromCountry = fromFlagImg?.getAttribute('title') || 'Unknown';
            
            // Fee
            const feeEl = row.querySelector('td.rechts a, td.rechts');
            const fee = feeEl?.textContent?.trim() || '-';
            
            results.push({
              playerName,
              age,
              nationality,
              position,
              fromClub,
              fromCountry,
              toClub: mlsTeamName,
              fee,
              season: seasonStr,
            });
          } catch { /* skip malformed row */ }
        });
      });
    });
    
    return results;
  }, season);
  
  console.log(`  Found ${arrivals.length} raw arrival records`);
  
  // Convert to full TransferRecord with parsed fees
  const processedArrivals: TransferRecord[] = arrivals.map(a => {
    const { numeric, type } = parseTransferFee(a.fee);
    return {
      ...a,
      fromLeague: COUNTRY_TO_LEAGUE[a.fromCountry] || a.fromCountry,
      feeNumeric: numeric,
      type,
    };
  });
  
  // Filter out internal MLS transfers and without-club
  const externalArrivals = processedArrivals.filter(a => 
    a.fromCountry !== 'United States' || 
    !a.fromClub.toLowerCase().includes('without club')
  );
  
  console.log(`  Filtered to ${externalArrivals.length} external arrivals`);
  
  return {
    season,
    arrivals: externalArrivals,
    departures: [], // We're focused on arrivals for this analysis
  };
}

// ============================================================================
// MAIN SCRAPER
// ============================================================================

async function scrapeMLSTransferHistory(): Promise<MLSTransferAnalysis> {
  console.log('Starting MLS Transfer History Scrape...');
  console.log('Source: https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1\n');
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  
  const allSeasons: SeasonTransfers[] = [];
  
  for (const season of SEASONS_TO_SCRAPE) {
    try {
      const seasonData = await scrapeSeasonTransfers(page, season);
      allSeasons.push(seasonData);
      await delay(3000); // Rate limiting between seasons
    } catch (error) {
      console.error(`Error scraping season ${season}:`, error);
      allSeasons.push({ season, arrivals: [], departures: [] });
    }
  }
  
  await page.close();
  
  // Aggregate data
  const allArrivals = allSeasons.flatMap(s => s.arrivals);
  
  // Count by source country
  const countryMap = new Map<string, { count: number; totalSpend: number }>();
  allArrivals.forEach(a => {
    const existing = countryMap.get(a.fromCountry) || { count: 0, totalSpend: 0 };
    existing.count++;
    existing.totalSpend += a.feeNumeric;
    countryMap.set(a.fromCountry, existing);
  });
  
  const topSourceCountries = Array.from(countryMap.entries())
    .map(([country, data]) => ({ country, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);
  
  // Count by source league
  const leagueMap = new Map<string, { country: string; count: number; totalSpend: number }>();
  allArrivals.forEach(a => {
    const key = a.fromLeague;
    const existing = leagueMap.get(key) || { country: a.fromCountry, count: 0, totalSpend: 0 };
    existing.count++;
    existing.totalSpend += a.feeNumeric;
    leagueMap.set(key, existing);
  });
  
  const sourceLeagues = Array.from(leagueMap.entries())
    .map(([league, data]) => ({ league, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);
  
  return {
    seasons: allSeasons,
    sourceLeagues,
    topSourceCountries,
    totalArrivals: allArrivals.length,
    totalSpend: allArrivals.reduce((sum, a) => sum + a.feeNumeric, 0),
    scrapedAt: new Date().toISOString(),
  };
}

// ============================================================================
// ENTRY POINT
// ============================================================================

async function main() {
  try {
    const analysis = await scrapeMLSTransferHistory();
    
    // Save raw data
    await fs.mkdir('data', { recursive: true });
    await fs.writeFile('data/mls-transfer-history.json', JSON.stringify(analysis, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('MLS TRANSFER ANALYSIS - TOP 25 SOURCE COUNTRIES');
    console.log('='.repeat(80));
    console.log(`Total Arrivals Analyzed: ${analysis.totalArrivals}`);
    console.log(`Total Spend: €${(analysis.totalSpend / 1_000_000).toFixed(2)}M\n`);
    
    console.log('Rank | Country               | Players | Total Spend');
    console.log('-'.repeat(60));
    analysis.topSourceCountries.forEach((c, i) => {
      const spend = c.totalSpend > 0 ? `€${(c.totalSpend / 1_000_000).toFixed(2)}M` : 'N/A';
      console.log(`${String(i + 1).padStart(4)} | ${c.country.padEnd(21)} | ${String(c.count).padStart(7)} | ${spend}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('TOP 25 SOURCE LEAGUES FOR MLS');
    console.log('='.repeat(80));
    console.log('Rank | League                           | Country      | Players | Spend');
    console.log('-'.repeat(85));
    analysis.sourceLeagues.forEach((l, i) => {
      const spend = l.totalSpend > 0 ? `€${(l.totalSpend / 1_000_000).toFixed(2)}M` : 'N/A';
      console.log(`${String(i + 1).padStart(4)} | ${l.league.padEnd(32)} | ${l.country.padEnd(12)} | ${String(l.count).padStart(7)} | ${spend}`);
    });
    
    console.log('\nData saved to data/mls-transfer-history.json');
    
  } catch (error) {
    console.error('Scraper error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();

