/**
 * MLSPA Salary Guide Scraper
 * 
 * Scrapes the official MLSPA salary guide from:
 * https://mlsplayers.org/resources/salary-guide
 * 
 * This provides the authoritative salary data for ALL MLS players.
 * The MLSPA updates this data twice per year (typically April and October).
 */

import { getCached, setCache } from '../cache/file-cache';

// Dynamic import for puppeteer
let puppeteer: typeof import('puppeteer') | null = null;

async function loadPuppeteer() {
  if (!puppeteer) {
    try {
      puppeteer = await import('puppeteer');
    } catch {
      throw new Error(
        'Puppeteer is not available. This feature requires running locally with puppeteer installed.'
      );
    }
  }
  return puppeteer;
}

export interface MLSPASalaryEntry {
  firstName: string;
  lastName: string;
  club: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

export interface MLSPASalaryGuide {
  players: MLSPASalaryEntry[];
  releaseDate: string;
  scrapedAt: string;
  totalPlayers: number;
  source: string;
}

const CACHE_KEY = 'mlspa-salary-guide-2025';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days (MLSPA updates infrequently)

// Club code mapping for MLSPA abbreviations to our standard codes
const CLUB_CODE_MAP: Record<string, string> = {
  'ATL': 'ATL', // Atlanta United
  'ATX': 'ATX', // Austin FC
  'CLT': 'CLT', // Charlotte FC
  'CHI': 'CHI', // Chicago Fire FC
  'CIN': 'CIN', // FC Cincinnati
  'COL': 'COL', // Colorado Rapids
  'CLB': 'CLB', // Columbus Crew
  'DAL': 'DAL', // FC Dallas
  'DC': 'DC',   // D.C. United
  'HOU': 'HOU', // Houston Dynamo FC
  'SKC': 'SKC', // Sporting Kansas City
  'LA': 'LAG',  // LA Galaxy
  'LAG': 'LAG', // LA Galaxy
  'LAFC': 'LAFC', // Los Angeles FC
  'MIA': 'MIA', // Inter Miami CF
  'MIN': 'MIN', // Minnesota United
  'MTL': 'MTL', // CF Montréal
  'NSH': 'NSH', // Nashville SC
  'NE': 'NE',   // New England Revolution
  'NY': 'NYRB', // New York Red Bulls
  'NYRB': 'NYRB', // New York Red Bulls
  'NYC': 'NYCFC', // New York City FC
  'NYCFC': 'NYCFC', // New York City FC
  'ORL': 'ORL', // Orlando City SC
  'PHI': 'PHI', // Philadelphia Union
  'POR': 'POR', // Portland Timbers
  'RSL': 'RSL', // Real Salt Lake
  'SD': 'SD',   // San Diego FC
  'SJ': 'SJ',   // San Jose Earthquakes
  'SEA': 'SEA', // Seattle Sounders FC
  'STL': 'STL', // St. Louis City SC
  'TOR': 'TOR', // Toronto FC
  'VAN': 'VAN', // Vancouver Whitecaps FC
  'Pool': 'MLS_POOL', // MLS Player Pool
};

/**
 * Normalize club code from MLSPA to our standard format
 */
function normalizeClubCode(mlspaCode: string): string {
  return CLUB_CODE_MAP[mlspaCode] || mlspaCode;
}

/**
 * Parse salary string from MLSPA format (e.g., "$1,234,567" or "$1,234,567*")
 */
function parseSalary(salaryStr: string): number {
  if (!salaryStr) return 0;
  // Remove $, commas, asterisks, and any whitespace
  const cleaned = salaryStr.replace(/[$,*\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Scrape the MLSPA salary guide table
 */
export async function scrapeMLSPASalaryGuide(forceRefresh = false): Promise<MLSPASalaryGuide | null> {
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCached<MLSPASalaryGuide>(CACHE_KEY);
    if (cached) {
      console.log('Using cached MLSPA salary guide');
      return cached;
    }
  }

  console.log('Scraping MLSPA salary guide from mlsplayers.org...');

  let browser;
  try {
    const pptr = await loadPuppeteer();
    browser = await pptr.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto('https://mlsplayers.org/resources/salary-guide', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Wait for the salary table to load
    await page.waitForSelector('table', { timeout: 30000 });

    // The MLSPA page uses a JavaScript-rendered table that may need scrolling
    // to load all data. Let's first check if there's pagination or infinite scroll.
    
    // Scroll to load all data (the table may use lazy loading)
    await autoScroll(page);

    // Extract the release date from the page header
    const releaseDate = await page.evaluate(() => {
      const header = document.querySelector('h2, h3');
      if (header) {
        const text = header.textContent || '';
        const match = text.match(/(\w+\s+\d+,?\s+\d{4})/);
        if (match) return match[1];
      }
      return 'October 1, 2025'; // Default
    });

    // Extract all player data from the table
    const players = await page.evaluate(() => {
      const results: Array<{
        firstName: string;
        lastName: string;
        club: string;
        position: string;
        baseSalary: string;
        guaranteedCompensation: string;
      }> = [];

      // Find the salary table
      const tables = document.querySelectorAll('table');
      
      for (const table of tables) {
        const rows = table.querySelectorAll('tbody tr, tr');
        
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          
          // Skip header rows or rows with wrong cell count
          if (cells.length < 6) continue;
          
          const firstName = cells[0]?.textContent?.trim() || '';
          const lastName = cells[1]?.textContent?.trim() || '';
          const club = cells[2]?.textContent?.trim() || '';
          const position = cells[3]?.textContent?.trim() || '';
          const baseSalary = cells[4]?.textContent?.trim() || '';
          const guaranteedCompensation = cells[5]?.textContent?.trim() || '';
          
          // Skip if it looks like a header or has invalid data
          if (!firstName || !lastName || firstName === 'First Name' || lastName === 'Last Name') continue;
          if (!baseSalary.includes('$')) continue;
          
          results.push({
            firstName,
            lastName,
            club,
            position,
            baseSalary,
            guaranteedCompensation,
          });
        }
      }

      return results;
    });

    await browser.close();

    if (players.length === 0) {
      console.error('No MLSPA salary data extracted');
      return null;
    }

    // Process and normalize the data
    const processedPlayers: MLSPASalaryEntry[] = players.map(p => ({
      firstName: p.firstName,
      lastName: p.lastName,
      club: normalizeClubCode(p.club),
      position: p.position,
      baseSalary: parseSalary(p.baseSalary),
      guaranteedCompensation: parseSalary(p.guaranteedCompensation),
    }));

    const result: MLSPASalaryGuide = {
      players: processedPlayers,
      releaseDate,
      scrapedAt: new Date().toISOString(),
      totalPlayers: processedPlayers.length,
      source: 'https://mlsplayers.org/resources/salary-guide',
    };

    // Cache the result
    await setCache(CACHE_KEY, result, CACHE_TTL);
    console.log(`Scraped ${result.totalPlayers} players from MLSPA salary guide`);

    return result;
  } catch (error) {
    console.error('Error scraping MLSPA salary guide:', error);
    if (browser) await browser.close();
    return null;
  }
}

/**
 * Auto-scroll the page to trigger lazy loading
 */
async function autoScroll(page: Awaited<ReturnType<NonNullable<typeof puppeteer>['launch']>>['newPage'] extends () => Promise<infer P> ? P : never) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, 10000);
    });
  });
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Get salaries for a specific team
 */
export async function getTeamSalaries(
  teamCode: string,
  forceRefresh = false
): Promise<MLSPASalaryEntry[]> {
  const guide = await scrapeMLSPASalaryGuide(forceRefresh);
  if (!guide) return [];
  
  return guide.players.filter(p => p.club === teamCode);
}

/**
 * Get a player's salary by name
 */
export async function getPlayerSalary(
  firstName: string,
  lastName: string,
  forceRefresh = false
): Promise<MLSPASalaryEntry | null> {
  const guide = await scrapeMLSPASalaryGuide(forceRefresh);
  if (!guide) return null;
  
  // Try exact match first
  const exact = guide.players.find(
    p => p.firstName.toLowerCase() === firstName.toLowerCase() &&
         p.lastName.toLowerCase() === lastName.toLowerCase()
  );
  if (exact) return exact;
  
  // Try partial match
  const partial = guide.players.find(
    p => p.lastName.toLowerCase() === lastName.toLowerCase()
  );
  return partial || null;
}

/**
 * Generate a TypeScript data file from the scraped data
 */
export function generateSalaryDataFile(guide: MLSPASalaryGuide): string {
  const sortedPlayers = [...guide.players].sort((a, b) => {
    if (a.club !== b.club) return a.club.localeCompare(b.club);
    return a.lastName.localeCompare(b.lastName);
  });

  const playerLines = sortedPlayers.map(p => {
    return `  { club: '${p.club}', firstName: '${p.firstName.replace(/'/g, "\\'")}', lastName: '${p.lastName.replace(/'/g, "\\'")}', position: '${p.position}', baseSalary: ${p.baseSalary}, guaranteedCompensation: ${p.guaranteedCompensation} },`;
  }).join('\n');

  return `/**
 * MLSPA Salary Data - ${guide.releaseDate}
 * 
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * 
 * Source: ${guide.source}
 * Scraped: ${guide.scrapedAt}
 * Total Players: ${guide.totalPlayers}
 */

export interface MLSPASalaryEntry {
  club: string;
  firstName: string;
  lastName: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

export const MLSPA_SALARIES: MLSPASalaryEntry[] = [
${playerLines}
];

export const MLSPA_RELEASE_DATE = '${guide.releaseDate}';
export const MLSPA_TOTAL_PLAYERS = ${guide.totalPlayers};
`;
}

