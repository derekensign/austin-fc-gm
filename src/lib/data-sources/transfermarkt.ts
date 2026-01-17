/**
 * Transfermarkt Scraper
 * 
 * Scrapes player valuations from Transfermarkt
 * Be respectful with rate limiting!
 * 
 * Note: Transfermarkt TOS may prohibit scraping.
 * For production, consider using their official API partnership.
 */

import { getCached, setCache } from '../cache/file-cache';

const BASE_URL = 'https://www.transfermarkt.us';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Austin FC Transfermarkt ID
const AUSTIN_FC_TM_ID = 84272;

// Rate limiting
let lastRequest = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

async function rateLimitedFetch(url: string): Promise<string | null> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequest = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.error(`Transfermarkt error: ${response.status}`);
      return null;
    }

    return response.text();
  } catch (error) {
    console.error('Transfermarkt fetch error:', error);
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
    if (cached) return cached;
  }

  const url = `${BASE_URL}/austin-fc/startseite/verein/${teamId}`;
  const html = await rateLimitedFetch(url);
  
  if (!html) return null;

  try {
    const players: PlayerValuation[] = [];
    
    // Parse market value table
    const valueTableMatch = html.match(/data-market-value[^>]*>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i);
    
    if (valueTableMatch) {
      const rows = valueTableMatch[1].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      
      for (const row of rows) {
        const nameMatch = row.match(/<a[^>]*class="spielprofil_tooltip"[^>]*>([^<]+)<\/a>/i);
        const valueMatch = row.match(/class="rechts hauptlink"[^>]*>([^<]+)</i);
        const posMatch = row.match(/class="inline-table"[^>]*>[\s\S]*?<td[^>]*>([^<]+)<\/td>/i);
        const ageMatch = row.match(/class="zentriert"[^>]*>(\d+)<\/td>/i);
        
        if (nameMatch && valueMatch) {
          players.push({
            name: nameMatch[1].trim(),
            position: posMatch ? posMatch[1].trim() : 'Unknown',
            age: ageMatch ? parseInt(ageMatch[1]) : 0,
            nationality: '',
            marketValue: parseMarketValue(valueMatch[1]),
            marketValueFormatted: valueMatch[1].trim(),
            profileUrl: '',
            photoUrl: '',
          });
        }
      }
    }

    // If we got data, cache it
    if (players.length > 0) {
      await setCache(cacheKey, players, 24 * 60 * 60 * 1000); // 24 hour TTL
      return players;
    }

    console.warn('Could not parse Transfermarkt data - site structure may have changed');
    return null;
  } catch (error) {
    console.error('Transfermarkt parsing error:', error);
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
  const html = await rateLimitedFetch(url);
  
  if (!html) return null;

  try {
    // Parse total market value
    const totalMatch = html.match(/Total market value:[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       html.match(/class="data-header__market-value-wrapper"[^>]*>[\s\S]*?([€$£]\d+[\d.,]*[mk]?)/i);
    
    const squadSizeMatch = html.match(/Squad size:[\s\S]*?<span[^>]*>(\d+)<\/span>/i);
    const avgAgeMatch = html.match(/Average age:[\s\S]*?<span[^>]*>([\d.]+)<\/span>/i);

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
  // For now, return null to indicate no data
  console.log('Transfer scraping not fully implemented');
  return null;
}

