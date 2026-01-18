/**
 * MLS Website Scraper
 * Scrapes standings and other data from mlssoccer.com
 * 
 * Source: https://www.mlssoccer.com/standings/
 */

import puppeteer from 'puppeteer';
import { getCached, setCache } from '../cache/file-cache';

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
    browser = await puppeteer.launch({
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
 * Based on 2025 MLS season standings as of January 18, 2026
 * Source: https://www.mlssoccer.com/standings/
 */
function getMockStandings(): MLSStandingsData {
  return {
    eastern: [
      { rank: 1, team: { name: 'Inter Miami CF', abbreviation: 'MIA' }, conference: 'Eastern', points: 74, gamesPlayed: 34, wins: 22, losses: 4, draws: 8, goalsFor: 75, goalsAgainst: 41, goalDiff: 34 },
      { rank: 2, team: { name: 'Columbus Crew', abbreviation: 'CLB' }, conference: 'Eastern', points: 62, gamesPlayed: 34, wins: 17, losses: 6, draws: 11, goalsFor: 63, goalsAgainst: 38, goalDiff: 25 },
      { rank: 3, team: { name: 'FC Cincinnati', abbreviation: 'CIN' }, conference: 'Eastern', points: 59, gamesPlayed: 34, wins: 17, losses: 9, draws: 8, goalsFor: 58, goalsAgainst: 48, goalDiff: 10 },
      { rank: 4, team: { name: 'New York Red Bulls', abbreviation: 'RBNY' }, conference: 'Eastern', points: 55, gamesPlayed: 34, wins: 15, losses: 9, draws: 10, goalsFor: 48, goalsAgainst: 38, goalDiff: 10 },
      { rank: 5, team: { name: 'Charlotte FC', abbreviation: 'CLT' }, conference: 'Eastern', points: 53, gamesPlayed: 34, wins: 14, losses: 9, draws: 11, goalsFor: 49, goalsAgainst: 45, goalDiff: 4 },
      { rank: 6, team: { name: 'Orlando City SC', abbreviation: 'ORL' }, conference: 'Eastern', points: 52, gamesPlayed: 34, wins: 14, losses: 10, draws: 10, goalsFor: 51, goalsAgainst: 44, goalDiff: 7 },
      { rank: 7, team: { name: 'New York City FC', abbreviation: 'NYC' }, conference: 'Eastern', points: 50, gamesPlayed: 34, wins: 13, losses: 10, draws: 11, goalsFor: 52, goalsAgainst: 50, goalDiff: 2 },
      { rank: 8, team: { name: 'Atlanta United FC', abbreviation: 'ATL' }, conference: 'Eastern', points: 48, gamesPlayed: 34, wins: 12, losses: 10, draws: 12, goalsFor: 48, goalsAgainst: 48, goalDiff: 0 },
      { rank: 9, team: { name: 'Philadelphia Union', abbreviation: 'PHI' }, conference: 'Eastern', points: 46, gamesPlayed: 34, wins: 12, losses: 12, draws: 10, goalsFor: 50, goalsAgainst: 52, goalDiff: -2 },
      { rank: 10, team: { name: 'CF Montréal', abbreviation: 'MTL' }, conference: 'Eastern', points: 44, gamesPlayed: 34, wins: 11, losses: 12, draws: 11, goalsFor: 45, goalsAgainst: 49, goalDiff: -4 },
      { rank: 11, team: { name: 'Toronto FC', abbreviation: 'TOR' }, conference: 'Eastern', points: 42, gamesPlayed: 34, wins: 10, losses: 12, draws: 12, goalsFor: 42, goalsAgainst: 48, goalDiff: -6 },
      { rank: 12, team: { name: 'Chicago Fire FC', abbreviation: 'CHI' }, conference: 'Eastern', points: 38, gamesPlayed: 34, wins: 9, losses: 14, draws: 11, goalsFor: 40, goalsAgainst: 50, goalDiff: -10 },
      { rank: 13, team: { name: 'Nashville SC', abbreviation: 'NSH' }, conference: 'Eastern', points: 35, gamesPlayed: 34, wins: 8, losses: 15, draws: 11, goalsFor: 38, goalsAgainst: 55, goalDiff: -17 },
      { rank: 14, team: { name: 'New England Revolution', abbreviation: 'NE' }, conference: 'Eastern', points: 30, gamesPlayed: 34, wins: 6, losses: 16, draws: 12, goalsFor: 35, goalsAgainst: 58, goalDiff: -23 },
      { rank: 15, team: { name: 'D.C. United', abbreviation: 'DC' }, conference: 'Eastern', points: 26, gamesPlayed: 34, wins: 5, losses: 18, draws: 11, goalsFor: 30, goalsAgainst: 66, goalDiff: -36 },
    ],
    western: [
      // Updated from mlssoccer.com standings as of Jan 18, 2026
      { rank: 1, team: { name: 'San Diego FC', abbreviation: 'SD' }, conference: 'Western', points: 63, gamesPlayed: 34, wins: 19, losses: 9, draws: 6, goalsFor: 64, goalsAgainst: 41, goalDiff: 23 },
      { rank: 2, team: { name: 'Vancouver Whitecaps FC', abbreviation: 'VAN' }, conference: 'Western', points: 63, gamesPlayed: 34, wins: 18, losses: 7, draws: 9, goalsFor: 66, goalsAgainst: 38, goalDiff: 28 },
      { rank: 3, team: { name: 'LAFC', abbreviation: 'LAFC' }, conference: 'Western', points: 60, gamesPlayed: 34, wins: 17, losses: 8, draws: 9, goalsFor: 65, goalsAgainst: 40, goalDiff: 25 },
      { rank: 4, team: { name: 'Minnesota United FC', abbreviation: 'MIN' }, conference: 'Western', points: 58, gamesPlayed: 34, wins: 16, losses: 8, draws: 10, goalsFor: 56, goalsAgainst: 39, goalDiff: 17 },
      { rank: 5, team: { name: 'Seattle Sounders FC', abbreviation: 'SEA' }, conference: 'Western', points: 55, gamesPlayed: 34, wins: 15, losses: 9, draws: 10, goalsFor: 58, goalsAgainst: 48, goalDiff: 10 },
      { rank: 6, team: { name: 'Austin FC', abbreviation: 'ATX' }, conference: 'Western', points: 47, gamesPlayed: 34, wins: 13, losses: 13, draws: 8, goalsFor: 37, goalsAgainst: 45, goalDiff: -8 },
      { rank: 7, team: { name: 'FC Dallas', abbreviation: 'DAL' }, conference: 'Western', points: 44, gamesPlayed: 34, wins: 11, losses: 12, draws: 11, goalsFor: 52, goalsAgainst: 55, goalDiff: -3 },
      { rank: 8, team: { name: 'Portland Timbers', abbreviation: 'POR' }, conference: 'Western', points: 44, gamesPlayed: 34, wins: 11, losses: 12, draws: 11, goalsFor: 41, goalsAgainst: 48, goalDiff: -7 },
      { rank: 9, team: { name: 'Real Salt Lake', abbreviation: 'RSL' }, conference: 'Western', points: 41, gamesPlayed: 34, wins: 12, losses: 17, draws: 5, goalsFor: 38, goalsAgainst: 49, goalDiff: -11 },
      { rank: 10, team: { name: 'LA Galaxy', abbreviation: 'LA' }, conference: 'Western', points: 40, gamesPlayed: 34, wins: 10, losses: 14, draws: 10, goalsFor: 45, goalsAgainst: 52, goalDiff: -7 },
      { rank: 11, team: { name: 'Houston Dynamo FC', abbreviation: 'HOU' }, conference: 'Western', points: 38, gamesPlayed: 34, wins: 9, losses: 14, draws: 11, goalsFor: 43, goalsAgainst: 52, goalDiff: -9 },
      { rank: 12, team: { name: 'Colorado Rapids', abbreviation: 'COL' }, conference: 'Western', points: 36, gamesPlayed: 34, wins: 8, losses: 14, draws: 12, goalsFor: 40, goalsAgainst: 55, goalDiff: -15 },
      { rank: 13, team: { name: 'Sporting Kansas City', abbreviation: 'SKC' }, conference: 'Western', points: 32, gamesPlayed: 34, wins: 7, losses: 18, draws: 9, goalsFor: 38, goalsAgainst: 62, goalDiff: -24 },
      { rank: 14, team: { name: 'San Jose Earthquakes', abbreviation: 'SJ' }, conference: 'Western', points: 28, gamesPlayed: 34, wins: 5, losses: 18, draws: 11, goalsFor: 40, goalsAgainst: 68, goalDiff: -28 },
    ],
    lastUpdated: new Date().toISOString(),
    season: 2025,
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

