/**
 * MLS Roster Scraper
 * Scrapes rosters from all MLS teams via mlssoccer.com
 * 
 * Source: https://www.mlssoccer.com/players/ (hub page)
 * Individual teams: https://www.mlssoccer.com/clubs/{team-slug}/roster/
 * 
 * IMPORTANT: Puppeteer is a devDependency - scraping should be done locally.
 * 
 * Data Structure:
 * - Player name, position, jersey number
 * - Roster category (Senior, Supplemental Slots 21-24, 25-28, 29-30)
 * - Player category (DP, U22 Initiative, Homegrown, International, Generation Adidas)
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

// MLS team slugs for roster URLs
export const MLS_TEAMS = [
  { slug: 'atlanta-united', name: 'Atlanta United', abbreviation: 'ATL' },
  { slug: 'austin-fc', name: 'Austin FC', abbreviation: 'ATX' },
  { slug: 'charlotte-fc', name: 'Charlotte FC', abbreviation: 'CLT' },
  { slug: 'chicago-fire-fc', name: 'Chicago Fire FC', abbreviation: 'CHI' },
  { slug: 'fc-cincinnati', name: 'FC Cincinnati', abbreviation: 'CIN' },
  { slug: 'colorado-rapids', name: 'Colorado Rapids', abbreviation: 'COL' },
  { slug: 'columbus-crew', name: 'Columbus Crew', abbreviation: 'CLB' },
  { slug: 'fc-dallas', name: 'FC Dallas', abbreviation: 'DAL' },
  { slug: 'd-c-united', name: 'D.C. United', abbreviation: 'DC' },
  { slug: 'houston-dynamo-fc', name: 'Houston Dynamo FC', abbreviation: 'HOU' },
  { slug: 'sporting-kansas-city', name: 'Sporting Kansas City', abbreviation: 'SKC' },
  { slug: 'la-galaxy', name: 'LA Galaxy', abbreviation: 'LAG' },
  { slug: 'los-angeles-football-club', name: 'Los Angeles FC', abbreviation: 'LAFC' },
  { slug: 'inter-miami-cf', name: 'Inter Miami CF', abbreviation: 'MIA' },
  { slug: 'minnesota-united-fc', name: 'Minnesota United', abbreviation: 'MIN' },
  { slug: 'cf-montreal', name: 'CF Montréal', abbreviation: 'MTL' },
  { slug: 'nashville-sc', name: 'Nashville SC', abbreviation: 'NSH' },
  { slug: 'new-england-revolution', name: 'New England Revolution', abbreviation: 'NE' },
  { slug: 'red-bull-new-york', name: 'New York Red Bulls', abbreviation: 'NYRB' },
  { slug: 'new-york-city-football-club', name: 'New York City FC', abbreviation: 'NYCFC' },
  { slug: 'orlando-city-sc', name: 'Orlando City SC', abbreviation: 'ORL' },
  { slug: 'philadelphia-union', name: 'Philadelphia Union', abbreviation: 'PHI' },
  { slug: 'portland-timbers', name: 'Portland Timbers', abbreviation: 'POR' },
  { slug: 'real-salt-lake', name: 'Real Salt Lake', abbreviation: 'RSL' },
  { slug: 'san-diego-fc', name: 'San Diego FC', abbreviation: 'SD' },
  { slug: 'san-jose-earthquakes', name: 'San Jose Earthquakes', abbreviation: 'SJ' },
  { slug: 'seattle-sounders-fc', name: 'Seattle Sounders FC', abbreviation: 'SEA' },
  { slug: 'st-louis-city-sc', name: 'St. Louis City SC', abbreviation: 'STL' },
  { slug: 'toronto-fc', name: 'Toronto FC', abbreviation: 'TOR' },
  { slug: 'vancouver-whitecaps-fc', name: 'Vancouver Whitecaps FC', abbreviation: 'VAN' },
] as const;

export type MLSTeamAbbreviation = typeof MLS_TEAMS[number]['abbreviation'];

export interface MLSRosterPlayer {
  name: string;
  jerseyNumber: number | null;
  position: string;
  rosterCategory: 'Senior' | 'Supplemental 21-24' | 'Supplemental 25-28' | 'Supplemental 29-30' | 'Unknown';
  categories: {
    isDP: boolean;
    isU22: boolean;
    isHomegrown: boolean;
    isInternational: boolean;
    isGenerationAdidas: boolean;
  };
  playerUrl: string;
}

export interface MLSTeamRoster {
  team: {
    name: string;
    abbreviation: string;
    slug: string;
  };
  players: MLSRosterPlayer[];
  lastUpdated: string;
}

export interface MLSLeagueRosters {
  teams: MLSTeamRoster[];
  lastUpdated: string;
  source: string;
}

const CACHE_KEY = 'mls-rosters-2026';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Parse roster category from MLS table cell text
 */
function parseRosterCategory(text: string): MLSRosterPlayer['rosterCategory'] {
  const normalized = text.toLowerCase().trim();
  if (normalized.includes('senior')) return 'Senior';
  if (normalized.includes('21-24') || normalized.includes('21–24')) return 'Supplemental 21-24';
  if (normalized.includes('25-28') || normalized.includes('25–28')) return 'Supplemental 25-28';
  if (normalized.includes('29-30') || normalized.includes('29–30')) return 'Supplemental 29-30';
  return 'Unknown';
}

/**
 * Parse player categories from MLS table cell text
 */
function parsePlayerCategories(text: string) {
  const normalized = text.toLowerCase();
  return {
    isDP: normalized.includes('designated player'),
    isU22: normalized.includes('u22') || normalized.includes('u-22'),
    isHomegrown: normalized.includes('homegrown'),
    isInternational: normalized.includes('international'),
    isGenerationAdidas: normalized.includes('generation adidas') || normalized.includes('ga'),
  };
}

/**
 * Scrape a single team's roster from mlssoccer.com
 */
async function scrapeTeamRoster(
  page: Awaited<ReturnType<NonNullable<typeof puppeteer>['launch']>>['newPage'] extends () => Promise<infer P> ? P : never,
  teamSlug: string,
  teamName: string,
  teamAbbrev: string
): Promise<MLSTeamRoster | null> {
  const url = `https://www.mlssoccer.com/clubs/${teamSlug}/roster/`;
  console.log(`Scraping roster for ${teamName}...`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for roster table to load
    await page.waitForSelector('table tbody tr', { timeout: 15000 });
    
    // Accept cookies if dialog appears
    try {
      const acceptBtn = await page.$('button[aria-label="Accept & Continue"]');
      if (acceptBtn) await acceptBtn.click();
    } catch {
      // Cookie dialog may not appear
    }

    // Extract roster data from tables
    const players = await page.evaluate(() => {
      const results: Array<{
        name: string;
        jerseyNumber: number | null;
        position: string;
        rosterCategory: string;
        playerCategory: string;
        playerUrl: string;
      }> = [];

      // Find all roster tables (there may be multiple for different categories)
      const tables = document.querySelectorAll('table');
      
      tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 4) return;
          
          // Extract player link and name from first cell
          const playerLink = cells[0]?.querySelector('a');
          const name = playerLink?.textContent?.trim() || cells[0]?.textContent?.trim() || '';
          const playerUrl = playerLink?.getAttribute('href') || '';
          
          // Skip if no valid name
          if (!name || name.length < 2) return;
          
          // Jersey number is typically second cell
          const jerseyText = cells[1]?.textContent?.trim() || '';
          const jerseyNumber = jerseyText ? parseInt(jerseyText, 10) : null;
          
          // Position is typically third cell
          const position = cells[2]?.textContent?.trim() || '';
          
          // Roster category (Senior, Supplemental)
          const rosterCategory = cells[3]?.textContent?.trim() || '';
          
          // Player category (DP, U22, Homegrown, etc.)
          const playerCategory = cells[4]?.textContent?.trim() || '';
          
          results.push({
            name,
            jerseyNumber: isNaN(jerseyNumber!) ? null : jerseyNumber,
            position,
            rosterCategory,
            playerCategory,
            playerUrl: playerUrl.startsWith('http') ? playerUrl : `https://www.mlssoccer.com${playerUrl}`,
          });
        });
      });

      return results;
    });

    // Dedupe by name (same player may appear in multiple table views)
    const uniquePlayers = new Map<string, MLSRosterPlayer>();
    
    players.forEach(p => {
      if (!uniquePlayers.has(p.name)) {
        uniquePlayers.set(p.name, {
          name: p.name,
          jerseyNumber: p.jerseyNumber,
          position: p.position,
          rosterCategory: parseRosterCategory(p.rosterCategory),
          categories: parsePlayerCategories(p.playerCategory),
          playerUrl: p.playerUrl,
        });
      }
    });

    return {
      team: {
        name: teamName,
        abbreviation: teamAbbrev,
        slug: teamSlug,
      },
      players: Array.from(uniquePlayers.values()),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error scraping ${teamName}:`, error);
    return null;
  }
}

/**
 * Scrape all MLS team rosters
 * This takes a while (~2-3 minutes for 30 teams)
 */
export async function scrapeAllMLSRosters(forceRefresh = false): Promise<MLSLeagueRosters | null> {
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCached<MLSLeagueRosters>(CACHE_KEY);
    if (cached) {
      console.log('Using cached MLS rosters');
      return cached;
    }
  }

  console.log('Scraping all MLS rosters (this may take a few minutes)...');

  let browser;
  try {
    const pptr = await loadPuppeteer();
    browser = await pptr.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set user agent to look like a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const teams: MLSTeamRoster[] = [];

    for (const team of MLS_TEAMS) {
      const roster = await scrapeTeamRoster(page, team.slug, team.name, team.abbreviation);
      if (roster && roster.players.length > 0) {
        teams.push(roster);
      }
      // Small delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await browser.close();

    if (teams.length === 0) {
      console.error('No team rosters were scraped');
      return null;
    }

    const result: MLSLeagueRosters = {
      teams,
      lastUpdated: new Date().toISOString(),
      source: 'mlssoccer.com/clubs/{team}/roster/',
    };

    // Cache the result
    await setCache(CACHE_KEY, result, CACHE_TTL);
    console.log(`Scraped rosters for ${teams.length} teams`);

    return result;
  } catch (error) {
    console.error('Error scraping MLS rosters:', error);
    if (browser) await browser.close();
    return null;
  }
}

/**
 * Get a single team's roster by abbreviation
 */
export async function getTeamRoster(
  abbreviation: MLSTeamAbbreviation,
  forceRefresh = false
): Promise<MLSTeamRoster | null> {
  const allRosters = await scrapeAllMLSRosters(forceRefresh);
  if (!allRosters) return null;
  
  return allRosters.teams.find(t => t.team.abbreviation === abbreviation) || null;
}

/**
 * Generate a text summary of rosters for AI context
 * Includes key roster info without overwhelming the context window
 */
export function generateRosterSummaryForAI(rosters: MLSLeagueRosters): string {
  const summaries: string[] = [];
  
  for (const team of rosters.teams) {
    const dps = team.players.filter(p => p.categories.isDP);
    const u22s = team.players.filter(p => p.categories.isU22);
    const internationals = team.players.filter(p => p.categories.isInternational);
    const homegrowns = team.players.filter(p => p.categories.isHomegrown);
    const seniors = team.players.filter(p => p.rosterCategory === 'Senior');
    
    summaries.push(`
**${team.team.name} (${team.team.abbreviation})**
- Roster Size: ${team.players.length} players
- Senior Roster: ${seniors.length}/20
- DPs (${dps.length}/3): ${dps.map(p => p.name).join(', ') || 'None'}
- U22 Initiative (${u22s.length}): ${u22s.map(p => p.name).join(', ') || 'None'}
- International (${internationals.length}/8): ${internationals.map(p => p.name).join(', ') || 'None'}
- Homegrown: ${homegrowns.map(p => p.name).join(', ') || 'None'}
`);
  }

  return `
==============================================================================
MLS LEAGUE-WIDE ROSTERS (${rosters.teams.length} teams)
Source: ${rosters.source}
Last Updated: ${rosters.lastUpdated}
==============================================================================

NOTE: This data shows CURRENT rosters from mlssoccer.com. Salary data may be 
from an earlier MLSPA release and should be cross-referenced for accuracy.

${summaries.join('\n')}
`;
}

/**
 * Get roster summary for a specific team (for targeted queries)
 */
export function getTeamRosterSummary(roster: MLSTeamRoster): string {
  const byPosition: Record<string, MLSRosterPlayer[]> = {};
  
  roster.players.forEach(p => {
    const pos = p.position || 'Unknown';
    if (!byPosition[pos]) byPosition[pos] = [];
    byPosition[pos].push(p);
  });

  const positionSummary = Object.entries(byPosition)
    .map(([pos, players]) => {
      const playerList = players.map(p => {
        const tags: string[] = [];
        if (p.categories.isDP) tags.push('DP');
        if (p.categories.isU22) tags.push('U22');
        if (p.categories.isInternational) tags.push('INT');
        if (p.categories.isHomegrown) tags.push('HG');
        const tagStr = tags.length > 0 ? ` [${tags.join(', ')}]` : '';
        return `${p.name}${p.jerseyNumber ? ` #${p.jerseyNumber}` : ''}${tagStr}`;
      }).join(', ');
      return `${pos}: ${playerList}`;
    })
    .join('\n');

  return `
**${roster.team.name} Full Roster**
${positionSummary}
`;
}

