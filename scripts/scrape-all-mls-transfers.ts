import * as fs from 'fs';
import * as path from 'path';

// We'll use the browser tools to scrape each season
// This script will be run with the browser MCP tools

interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  marketValue: number;
  sourceClub: string;
  destinationClub: string;
  fee: number;
  feeDisplay: string;
  mlsTeam: string;
  direction: 'arrival' | 'departure'; // KEY: distinguish incoming vs outgoing
  transferType: 'permanent' | 'loan' | 'free';
  season: string;
  year: number;
}

// Seasons to scrape: 2020/21 through 2024/25
const SEASONS = [
  { id: 2024, display: '24/25' },
  { id: 2023, display: '23/24' },
  { id: 2022, display: '22/23' },
  { id: 2021, display: '21/22' },
  { id: 2020, display: '20/21' },
];

// Parse currency value
function parseValue(valueStr: string): number {
  if (!valueStr || valueStr === '-' || valueStr.toLowerCase().includes('free') || valueStr.toLowerCase().includes('loan')) {
    return 0;
  }
  
  const cleaned = valueStr.replace(/[€$,\s]/g, '').toLowerCase();
  
  if (cleaned.includes('m')) {
    return parseFloat(cleaned.replace('m', '')) * 1000000;
  } else if (cleaned.includes('k') || cleaned.includes('th')) {
    return parseFloat(cleaned.replace(/[kth]/g, '')) * 1000;
  }
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// URLs for each season
function getTransferUrl(seasonId: number): string {
  return `https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1/saison_id/${seasonId}`;
}

console.log('=== MLS Transfer Scraping URLs ===\n');
console.log('Use the browser tools to navigate to each URL and take snapshots:\n');

SEASONS.forEach(season => {
  console.log(`Season ${season.display}: ${getTransferUrl(season.id)}`);
});

console.log('\n=== Instructions ===');
console.log('1. Navigate to each URL');
console.log('2. Take a snapshot');
console.log('3. The page will show BOTH Arrivals and Departures tables');
console.log('4. Save each snapshot for processing\n');

