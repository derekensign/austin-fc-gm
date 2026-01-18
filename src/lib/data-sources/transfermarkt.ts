/**
 * Transfermarkt Scraper with Puppeteer
 * 
 * Scrapes player valuations from Transfermarkt using headless Chrome
 * Be respectful with rate limiting!
 * 
 * Note: Transfermarkt TOS may prohibit scraping.
 * For production, consider using their official API partnership.
 * 
 * IMPORTANT: Puppeteer is a devDependency - this module won't work on Vercel.
 * Scraping should be done locally and data committed to the repo.
 */

import { getCached, setCache } from '../cache/file-cache';

// Dynamic import for puppeteer (devDependency - may not be available on Vercel)
type Browser = import('puppeteer').Browser;
let puppeteer: typeof import('puppeteer') | null = null;

async function loadPuppeteer() {
  if (!puppeteer) {
    try {
      puppeteer = await import('puppeteer');
    } catch {
      throw new Error(
        'Puppeteer is not available. This feature requires running locally with puppeteer installed (npm install puppeteer).'
      );
    }
  }
  return puppeteer;
}

const BASE_URL = 'https://www.transfermarkt.us';

// Austin FC Transfermarkt ID (MLS team founded 2021)
const AUSTIN_FC_TM_ID = 72309;

// Rate limiting - be respectful!
let lastRequest = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests

// Reusable browser instance
let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  const pptr = await loadPuppeteer();
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await pptr.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
    });
  }
  return browserInstance;
}

async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

// Rate-limited scrape helper using puppeteer
async function rateLimitedScrape(url: string): Promise<string | null> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequest = Date.now();

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Handle cookie consent
    try {
      const acceptButton = await page.$('[title="ACCEPT ALL"], .sp_choice_type_11, [data-testid="uc-accept-all-button"]');
      if (acceptButton) {
        await acceptButton.click();
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch { /* no popup */ }
    
    const html = await page.content();
    await page.close();
    return html;
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}

// ============ PLAYER VALUATIONS ============

export interface PlayerValuation {
  name: string;
  position: string;
  age: number;
  nationality: string;
  marketValue: number; // in USD
  marketValueFormatted: string;
  profileUrl: string;
  photoUrl: string;
}

function parseMarketValue(valueStr: string): number {
  // Parse values like "$5.00m", "$500k", "€4.50m"
  const cleaned = valueStr.toLowerCase().replace(/[€$£,]/g, '').trim();
  
  if (cleaned.includes('m')) {
    return parseFloat(cleaned.replace('m', '')) * 1_000_000;
  } else if (cleaned.includes('k')) {
    return parseFloat(cleaned.replace('k', '')) * 1_000;
  }
  
  return parseFloat(cleaned) || 0;
}

export async function getTeamValuations(teamId: number = AUSTIN_FC_TM_ID, forceRefresh = false): Promise<PlayerValuation[] | null> {
  const cacheKey = `tm-valuations-${teamId}`;
  
  if (!forceRefresh) {
    const cached = await getCached<PlayerValuation[]>(cacheKey);
    if (cached) {
      console.log('Returning cached Transfermarkt valuations');
      return cached;
    }
  }

  console.log('Fetching fresh Transfermarkt data with Puppeteer...');
  const url = `${BASE_URL}/austin-fc/startseite/verein/${teamId}`;
  
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequest = Date.now();

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Handle cookie consent
    try {
      const acceptButton = await page.$('[title="ACCEPT ALL"], .sp_choice_type_11, [data-testid="uc-accept-all-button"]');
      if (acceptButton) {
        await acceptButton.click();
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch { /* no popup */ }
    
    // Wait a bit for dynamic content
    await new Promise(r => setTimeout(r, 3000));
    
    // Debug: Log what we see on the page
    const debugInfo = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      const items = document.querySelectorAll('.items');
      return {
        url: window.location.href,
        title: document.title,
        tableCount: tables.length,
        itemsCount: items.length,
        bodyPreview: document.body?.innerText?.substring(0, 500) || 'no body',
      };
    });
    console.log('Transfermarkt debug:', JSON.stringify(debugInfo, null, 2));
    
    // Extract data directly from the DOM using page.evaluate
    const players = await page.evaluate(() => {
      const results: {
        name: string;
        position: string;
        age: number;
        nationality: string;
        marketValue: string;
        profileUrl: string;
        photoUrl: string;
      }[] = [];
      
      // Try to find player rows in the squad table
      const rows = document.querySelectorAll('.items tbody tr, #yw1 tbody tr, table.items tbody tr');
      
      rows.forEach(row => {
        try {
          // Get player name from the hauptlink or tooltip
          const nameEl = row.querySelector('.hauptlink a, .spielprofil_tooltip');
          const name = nameEl?.textContent?.trim() || '';
          
          if (!name || name.length < 2) return;
          
          // Get profile URL
          const linkEl = row.querySelector('a[href*="/profil/spieler/"]') as HTMLAnchorElement;
          const profileUrl = linkEl?.href || '';
          
          // Get photo URL
          const imgEl = row.querySelector('img[data-src], img.bilderrahmen') as HTMLImageElement;
          const photoUrl = imgEl?.getAttribute('data-src') || imgEl?.src || '';
          
          // Get position from inline table or specific cell
          const posEl = row.querySelector('.inline-table td:first-child, td.posrela + td');
          const position = posEl?.textContent?.trim() || 'Unknown';
          
          // Get age
          const cells = row.querySelectorAll('td.zentriert');
          let age = 0;
          cells.forEach(cell => {
            const text = cell.textContent?.trim() || '';
            const parsed = parseInt(text);
            if (parsed > 15 && parsed < 50) age = parsed;
          });
          
          // Get nationality from flag
          const flagEl = row.querySelector('img.flaggenrahmen');
          const nationality = flagEl?.getAttribute('title') || 'Unknown';
          
          // Get market value - usually in the last column or a specific class
          const valueEl = row.querySelector('.rechts.hauptlink, td.rechts a');
          const marketValue = valueEl?.textContent?.trim() || '$0';
          
          if (name) {
            results.push({
              name,
              position,
              age,
              nationality,
              marketValue,
              profileUrl,
              photoUrl,
            });
          }
        } catch {
          // Skip malformed rows
        }
      });
      
      return results;
    });
    
    await page.close();
    
    if (players && players.length > 0) {
      // Deduplicate by name and filter out entries without market value
      const seen = new Set<string>();
      const parsed: PlayerValuation[] = [];
      
      for (const p of players) {
        const marketValue = parseMarketValue(p.marketValue);
        // Skip duplicates and entries without real market values
        if (seen.has(p.name) || marketValue === 0) continue;
        seen.add(p.name);
        
        parsed.push({
          name: p.name,
          position: p.position,
          age: p.age,
          nationality: p.nationality,
          marketValue,
          marketValueFormatted: p.marketValue,
          profileUrl: p.profileUrl,
          photoUrl: p.photoUrl,
        });
      }
      
      console.log(`Parsed ${parsed.length} unique players from Transfermarkt`);
      await setCache(cacheKey, parsed, 24 * 60 * 60 * 1000);
      return parsed;
    }
    
    console.warn('Could not parse any players from Transfermarkt');
    return null;
  } catch (error) {
    console.error('Transfermarkt scraping error:', error);
    return null;
  }
}

// ============ TEAM MARKET VALUE ============

export interface TeamMarketValue {
  totalValue: number;
  totalValueFormatted: string;
  averageValue: number;
  averageAge: number;
  squadSize: number;
}

export async function getTeamMarketValue(teamId: number = AUSTIN_FC_TM_ID, forceRefresh = false): Promise<TeamMarketValue | null> {
  const cacheKey = `tm-team-value-${teamId}`;
  
  if (!forceRefresh) {
    const cached = await getCached<TeamMarketValue>(cacheKey);
    if (cached) return cached;
  }

  const url = `${BASE_URL}/austin-fc/startseite/verein/${teamId}`;
  const html = await rateLimitedScrape(url);
  
  if (!html) return null;

  try {
    // Parse total market value from the header
    const totalMatch = html.match(/Total market value:[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       html.match(/data-header__market-value-wrapper[^>]*>[\s\S]*?([€$£][\d,.]+[mk]?)/i) ||
                       html.match(/<span[^>]*class="[^"]*waehrung[^"]*"[^>]*>([^<]+)<\/span>/i);
    
    const squadSizeMatch = html.match(/Squad size:[\s\S]*?<span[^>]*>(\d+)<\/span>/i) ||
                           html.match(/>(\d+)\s*players?</i);
    const avgAgeMatch = html.match(/Average age:[\s\S]*?<span[^>]*>([\d.]+)<\/span>/i) ||
                        html.match(/Ø-Age:[\s\S]*?([\d.]+)/i);

    if (totalMatch) {
      const totalValue = parseMarketValue(totalMatch[1]);
      const squadSize = squadSizeMatch ? parseInt(squadSizeMatch[1]) : 25;
      
      const result: TeamMarketValue = {
        totalValue,
        totalValueFormatted: totalMatch[1].trim(),
        averageValue: squadSize > 0 ? totalValue / squadSize : 0,
        averageAge: avgAgeMatch ? parseFloat(avgAgeMatch[1]) : 0,
        squadSize,
      };

      await setCache(cacheKey, result, 24 * 60 * 60 * 1000);
      return result;
    }

    return null;
  } catch (error) {
    console.error('Transfermarkt team value parsing error:', error);
    return null;
  }
}

// ============ RECENT TRANSFERS ============

export interface Transfer {
  playerName: string;
  fromTeam: string;
  toTeam: string;
  fee: number;
  feeFormatted: string;
  date: string;
  type: 'in' | 'out' | 'loan-in' | 'loan-out';
}

export async function getTeamTransfers(teamId: number = AUSTIN_FC_TM_ID, forceRefresh = false): Promise<Transfer[] | null> {
  const cacheKey = `tm-transfers-${teamId}`;
  
  if (!forceRefresh) {
    const cached = await getCached<Transfer[]>(cacheKey);
    if (cached) return cached;
  }

  // Would need to scrape the transfers page
  // For now, return null to indicate not implemented
  console.log('Transfer scraping not fully implemented');
  return null;
}

// Cleanup function for graceful shutdown
export async function cleanup(): Promise<void> {
  await closeBrowser();
}

// Handle process exit
if (typeof process !== 'undefined') {
  process.on('exit', cleanup);
  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });
}
