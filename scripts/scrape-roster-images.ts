/**
 * Scrape player images from Austin FC roster page
 * Run with: npx tsx scripts/scrape-roster-images.ts
 */

import puppeteer from 'puppeteer';

interface PlayerImage {
  name: string;
  number: string | null;
  imageUrl: string;
  position: string;
  category: string;
}

async function scrapeAustinFCRoster(): Promise<PlayerImage[]> {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating to Austin FC roster page...');
  await page.goto('https://www.austinfc.com/roster/', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait for player cards to load
  await page.waitForSelector('[class*="PlayerCard"]', { timeout: 10000 }).catch(() => {
    console.log('PlayerCard selector not found, trying alternatives...');
  });
  
  // Give extra time for images to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Extracting player data...');
  
  const players = await page.evaluate(() => {
    const results: PlayerImage[] = [];
    
    // Try multiple selectors for player cards
    const selectors = [
      '[class*="PlayerCard"]',
      '[class*="player-card"]',
      '.mls-o-roster-players__item',
      'article[class*="player"]',
      '[data-testid*="player"]',
      '.css-1dbjc4n' // Generic React Native Web class
    ];
    
    let cards: Element[] = [];
    for (const selector of selectors) {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        cards = Array.from(found);
        console.log(`Found ${cards.length} elements with selector: ${selector}`);
        break;
      }
    }
    
    // Also try to find all images that look like player headshots
    const allImages = document.querySelectorAll('img');
    const playerImages: { name: string; url: string }[] = [];
    
    allImages.forEach((img) => {
      const src = img.src || img.getAttribute('data-src') || '';
      const alt = img.alt || '';
      
      // Look for MLS CDN images or player-related images
      if (src.includes('mlssoccer.com') || src.includes('player') || src.includes('headshot')) {
        // Try to find associated name
        const parent = img.closest('article, div[class*="player"], a[href*="player"]');
        let name = alt;
        
        if (parent) {
          const nameEl = parent.querySelector('h2, h3, [class*="name"], [class*="Name"]');
          if (nameEl) {
            name = nameEl.textContent?.trim() || alt;
          }
        }
        
        if (src && name) {
          playerImages.push({ name, url: src });
        }
      }
    });
    
    // Try to extract structured data from the page
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        console.log('Found JSON-LD data:', data);
      } catch (e) {
        // ignore
      }
    });
    
    // Look for Next.js data
    const nextData = document.getElementById('__NEXT_DATA__');
    if (nextData) {
      try {
        const data = JSON.parse(nextData.textContent || '');
        console.log('Found Next.js data');
        // The roster data might be in here
      } catch (e) {
        // ignore
      }
    }
    
    return playerImages;
  });
  
  // Also try to get the page HTML to parse manually
  const html = await page.content();
  
  // Look for image URLs in the HTML
  const imgRegex = /https:\/\/images\.mlssoccer\.com\/image\/[^"'\s]+/g;
  const foundUrls = html.match(imgRegex) || [];
  
  console.log(`Found ${foundUrls.length} MLS CDN image URLs in page HTML`);
  
  // Extract unique player image URLs
  const uniqueUrls = [...new Set(foundUrls)].filter(url => 
    url.includes('mls-atx') || url.includes('headshot') || url.includes('player')
  );
  
  console.log(`Found ${uniqueUrls.length} potential Austin FC player images`);
  
  // Try to match URLs with player names from the page
  const playerNameRegex = /#(\d+)\s*-\s*([A-Za-zÀ-ÿ\s\-']+)/g;
  const nameMatches = [...html.matchAll(playerNameRegex)];
  
  console.log(`Found ${nameMatches.length} player name/number patterns`);
  
  nameMatches.forEach(match => {
    console.log(`  #${match[1]} - ${match[2].trim()}`);
  });
  
  // Print all unique image URLs for manual mapping
  console.log('\n=== Player Image URLs ===\n');
  uniqueUrls.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  
  await browser.close();
  
  return players;
}

// Run the scraper
scrapeAustinFCRoster()
  .then(players => {
    console.log('\n=== Scraped Players ===\n');
    console.log(JSON.stringify(players, null, 2));
  })
  .catch(error => {
    console.error('Scraping failed:', error);
    process.exit(1);
  });

