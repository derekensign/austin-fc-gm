/**
 * MLS Website Scraper
 * Scrapes standings and other data from mlssoccer.com
 * 
 * Source: https://www.mlssoccer.com/standings/
 * 
 * IMPORTANT: Puppeteer is a devDependency - this module won't work on Vercel.
 * Scraping should be done locally and data committed to the repo.
 */

import { getCached, setCache } from '../cache/file-cache';

// Dynamic import for puppeteer (devDependency - may not be available on Vercel)
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

export interface MLSStanding {
  rank: number;
  team: {
    name: string;
    abbreviation: string;
    logo?: string;
  };
  conference: 'Eastern' | 'Western';
  points: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  homeRecord?: string;
  awayRecord?: string;
  lastFive?: string;
  pointsPerGame?: number;
}

export interface MLSStandingsData {
  eastern: MLSStanding[];
  western: MLSStanding[];
  lastUpdated: string;
  season: number;
}

const CACHE_KEY = 'mls-standings-2025';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Scrape MLS standings from mlssoccer.com
 */
export async function scrapeMLSStandings(forceRefresh = false): Promise<MLSStandingsData | null> {
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCached<MLSStandingsData>(CACHE_KEY);
    if (cached) {
      console.log('Using cached MLS standings');
      return cached;
    }
  }

  console.log('Scraping MLS standings from mlssoccer.com...');

  let browser;
  try {
    const pptr = await loadPuppeteer();
    browser = await pptr.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to standings page
    await page.goto('https://www.mlssoccer.com/standings/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for the standings table to load
    await page.waitForSelector('table', { timeout: 15000 });

    // Extract standings data
    const standingsData = await page.evaluate(() => {
      const eastern: any[] = [];
      const western: any[] = [];
      
      // Find all tables on the page
      const tables = document.querySelectorAll('table');
      
      tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tbody tr');
        const isEastern = tableIndex === 0; // Assuming first table is Eastern
        
        rows.forEach((row, rowIndex) => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return;
          
          // Extract team name from the row
          const teamCell = cells[0];
          const teamNameEl = teamCell.querySelector('span, a, div');
          const teamName = teamNameEl?.textContent?.trim() || cells[0]?.textContent?.trim() || '';
          
          // Extract team logo if available
          const logoEl = teamCell.querySelector('img');
          const logo = logoEl?.getAttribute('src') || '';
          
          // Extract numeric values
          const getValue = (index: number): number => {
            const text = cells[index]?.textContent?.trim() || '0';
            return parseInt(text, 10) || 0;
          };
          
          // Standard MLS standings table format:
          // Team | GP | W | L | T | GF | GA | GD | PTS
          const standing = {
            rank: rowIndex + 1,
            team: {
              name: teamName,
              abbreviation: teamName.substring(0, 3).toUpperCase(),
              logo: logo,
            },
            conference: isEastern ? 'Eastern' : 'Western',
            gamesPlayed: getValue(1),
            wins: getValue(2),
            losses: getValue(3),
            draws: getValue(4),
            goalsFor: getValue(5),
            goalsAgainst: getValue(6),
            goalDiff: getValue(7),
            points: getValue(8),
          };
          
          if (isEastern) {
            eastern.push(standing);
          } else {
            western.push(standing);
          }
        });
      });
      
      return { eastern, western };
    });

    await browser.close();

    // Validate we got data and it looks correct
    // Check if team names look valid (not just numbers/ranks)
    const hasValidTeamNames = (standings: any[]) => 
      standings.some(s => s.team.name && isNaN(Number(s.team.name)) && s.team.name.length > 2);
    
    if (standingsData.eastern.length === 0 && standingsData.western.length === 0) {
      console.error('No standings data extracted');
      return getMockStandings();
    }
    
    // If team names look like numbers (parsing failed), use mock data
    if (!hasValidTeamNames(standingsData.eastern) && !hasValidTeamNames(standingsData.western)) {
      console.warn('Scraped data has invalid team names, using mock data');
      return getMockStandings();
    }

    const result: MLSStandingsData = {
      eastern: standingsData.eastern as MLSStanding[],
      western: standingsData.western as MLSStanding[],
      lastUpdated: new Date().toISOString(),
      season: 2025,
    };

    // Cache the result
    await setCache(CACHE_KEY, result, CACHE_TTL);
    console.log(`Scraped ${result.eastern.length} Eastern + ${result.western.length} Western teams`);

    return result;
  } catch (error) {
    console.error('Error scraping MLS standings:', error);
    if (browser) await browser.close();
    
    // Return mock data as fallback
    return getMockStandings();
  }
}

/**
 * Get Austin FC's standing from the scraped data
 */
export async function getAustinFCStanding(forceRefresh = false): Promise<MLSStanding | null> {
  const standings = await scrapeMLSStandings(forceRefresh);
  if (!standings) return null;
  
  // Austin FC is in the Western Conference
  const austinStanding = standings.western.find(
    s => s.team.name.toLowerCase().includes('austin')
  );
  
  return austinStanding || null;
}

/**
 * Mock standings data for development/fallback
 * Based on 2026 MLS season standings as of April 12, 2026
 * Source: ESPN
 */
function getMockStandings(): MLSStandingsData {
  return {
    eastern: [
      { rank: 1, team: { name: 'Nashville SC', abbreviation: 'NSH' }, conference: 'Eastern', points: 16, gamesPlayed: 7, wins: 5, losses: 1, draws: 1, goalsFor: 15, goalsAgainst: 4, goalDiff: 11 },
      { rank: 2, team: { name: 'Chicago Fire FC', abbreviation: 'CHI' }, conference: 'Eastern', points: 13, gamesPlayed: 7, wins: 4, losses: 2, draws: 1, goalsFor: 9, goalsAgainst: 5, goalDiff: 4 },
      { rank: 3, team: { name: 'Inter Miami CF', abbreviation: 'MIA' }, conference: 'Eastern', points: 12, gamesPlayed: 7, wins: 3, losses: 1, draws: 3, goalsFor: 13, goalsAgainst: 12, goalDiff: 1 },
      { rank: 4, team: { name: 'New York City FC', abbreviation: 'NYC' }, conference: 'Eastern', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 14, goalsAgainst: 9, goalDiff: 5 },
      { rank: 5, team: { name: 'Charlotte FC', abbreviation: 'CLT' }, conference: 'Eastern', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 13, goalsAgainst: 9, goalDiff: 4 },
      { rank: 6, team: { name: 'Toronto FC', abbreviation: 'TOR' }, conference: 'Eastern', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 10, goalsAgainst: 11, goalDiff: -1 },
      { rank: 7, team: { name: 'New York Red Bulls', abbreviation: 'RBNY' }, conference: 'Eastern', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 11, goalsAgainst: 15, goalDiff: -4 },
      { rank: 8, team: { name: 'New England Revolution', abbreviation: 'NE' }, conference: 'Eastern', points: 9, gamesPlayed: 6, wins: 3, losses: 3, draws: 0, goalsFor: 12, goalsAgainst: 9, goalDiff: 3 },
      { rank: 9, team: { name: 'D.C. United', abbreviation: 'DC' }, conference: 'Eastern', points: 7, gamesPlayed: 7, wins: 2, losses: 4, draws: 1, goalsFor: 4, goalsAgainst: 9, goalDiff: -5 },
      { rank: 10, team: { name: 'FC Cincinnati', abbreviation: 'CIN' }, conference: 'Eastern', points: 7, gamesPlayed: 7, wins: 2, losses: 4, draws: 1, goalsFor: 10, goalsAgainst: 16, goalDiff: -6 },
      { rank: 11, team: { name: 'Columbus Crew', abbreviation: 'CLB' }, conference: 'Eastern', points: 5, gamesPlayed: 6, wins: 1, losses: 3, draws: 2, goalsFor: 8, goalsAgainst: 9, goalDiff: -1 },
      { rank: 12, team: { name: 'Atlanta United FC', abbreviation: 'ATL' }, conference: 'Eastern', points: 4, gamesPlayed: 7, wins: 1, losses: 5, draws: 1, goalsFor: 6, goalsAgainst: 12, goalDiff: -6 },
      { rank: 13, team: { name: 'Philadelphia Union', abbreviation: 'PHI' }, conference: 'Eastern', points: 3, gamesPlayed: 7, wins: 1, losses: 6, draws: 0, goalsFor: 6, goalsAgainst: 12, goalDiff: -6 },
      { rank: 14, team: { name: 'CF Montréal', abbreviation: 'MTL' }, conference: 'Eastern', points: 3, gamesPlayed: 7, wins: 1, losses: 6, draws: 0, goalsFor: 8, goalsAgainst: 19, goalDiff: -11 },
      { rank: 15, team: { name: 'Orlando City SC', abbreviation: 'ORL' }, conference: 'Eastern', points: 3, gamesPlayed: 6, wins: 1, losses: 5, draws: 0, goalsFor: 5, goalsAgainst: 23, goalDiff: -18 },
    ],
    western: [
      { rank: 1, team: { name: 'Vancouver Whitecaps FC', abbreviation: 'VAN' }, conference: 'Western', points: 18, gamesPlayed: 7, wins: 6, losses: 1, draws: 0, goalsFor: 19, goalsAgainst: 4, goalDiff: 15 },
      { rank: 2, team: { name: 'San Jose Earthquakes', abbreviation: 'SJ' }, conference: 'Western', points: 18, gamesPlayed: 7, wins: 6, losses: 1, draws: 0, goalsFor: 13, goalsAgainst: 2, goalDiff: 11 },
      { rank: 3, team: { name: 'LAFC', abbreviation: 'LAFC' }, conference: 'Western', points: 16, gamesPlayed: 7, wins: 5, losses: 1, draws: 1, goalsFor: 15, goalsAgainst: 2, goalDiff: 13 },
      { rank: 4, team: { name: 'Real Salt Lake', abbreviation: 'RSL' }, conference: 'Western', points: 13, gamesPlayed: 6, wins: 4, losses: 1, draws: 1, goalsFor: 12, goalsAgainst: 8, goalDiff: 4 },
      { rank: 5, team: { name: 'Seattle Sounders FC', abbreviation: 'SEA' }, conference: 'Western', points: 13, gamesPlayed: 6, wins: 4, losses: 1, draws: 1, goalsFor: 6, goalsAgainst: 2, goalDiff: 4 },
      { rank: 6, team: { name: 'Colorado Rapids', abbreviation: 'COL' }, conference: 'Western', points: 12, gamesPlayed: 7, wins: 4, losses: 3, draws: 0, goalsFor: 19, goalsAgainst: 12, goalDiff: 7 },
      { rank: 7, team: { name: 'FC Dallas', abbreviation: 'DAL' }, conference: 'Western', points: 12, gamesPlayed: 7, wins: 3, losses: 1, draws: 3, goalsFor: 15, goalsAgainst: 10, goalDiff: 5 },
      { rank: 8, team: { name: 'San Diego FC', abbreviation: 'SD' }, conference: 'Western', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 14, goalsAgainst: 10, goalDiff: 4 },
      { rank: 9, team: { name: 'Minnesota United FC', abbreviation: 'MIN' }, conference: 'Western', points: 11, gamesPlayed: 7, wins: 3, losses: 2, draws: 2, goalsFor: 8, goalsAgainst: 13, goalDiff: -5 },
      { rank: 10, team: { name: 'LA Galaxy', abbreviation: 'LA' }, conference: 'Western', points: 8, gamesPlayed: 7, wins: 2, losses: 3, draws: 2, goalsFor: 10, goalsAgainst: 11, goalDiff: -1 },
      { rank: 11, team: { name: 'Portland Timbers', abbreviation: 'POR' }, conference: 'Western', points: 7, gamesPlayed: 7, wins: 2, losses: 4, draws: 1, goalsFor: 11, goalsAgainst: 16, goalDiff: -5 },
      { rank: 12, team: { name: 'Houston Dynamo FC', abbreviation: 'HOU' }, conference: 'Western', points: 6, gamesPlayed: 6, wins: 2, losses: 4, draws: 0, goalsFor: 10, goalsAgainst: 16, goalDiff: -6 },
      { rank: 13, team: { name: 'Austin FC', abbreviation: 'ATX' }, conference: 'Western', points: 6, gamesPlayed: 7, wins: 1, losses: 3, draws: 3, goalsFor: 8, goalsAgainst: 11, goalDiff: -3 },
      { rank: 14, team: { name: 'St. Louis City SC', abbreviation: 'STL' }, conference: 'Western', points: 6, gamesPlayed: 7, wins: 1, losses: 3, draws: 3, goalsFor: 6, goalsAgainst: 9, goalDiff: -3 },
      { rank: 15, team: { name: 'Sporting Kansas City', abbreviation: 'SKC' }, conference: 'Western', points: 4, gamesPlayed: 7, wins: 1, losses: 5, draws: 1, goalsFor: 7, goalsAgainst: 17, goalDiff: -10 },
    ],
    lastUpdated: new Date().toISOString(),
    season: 2026,
  };
}

/**
 * Get all standings with Austin FC highlighted
 */
export async function getAllStandingsWithAustin(forceRefresh = false): Promise<{
  standings: MLSStandingsData;
  austinFC: MLSStanding | null;
} | null> {
  const standings = await scrapeMLSStandings(forceRefresh);
  if (!standings) return null;
  
  const austinFC = standings.western.find(
    s => s.team.name.toLowerCase().includes('austin')
  ) || null;
  
  return { standings, austinFC };
}

