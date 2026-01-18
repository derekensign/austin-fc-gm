/**
 * Austin FC Transaction Scraper
 * 
 * Scrapes austinfc.com/news for all transaction-related articles
 * to extract verified GAM/TAM information from official press releases.
 */

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface TransactionArticle {
  title: string;
  date: string;
  url: string;
  excerpt: string;
  fullText?: string;
  transactionType: 'signing' | 'trade' | 'transfer' | 'loan' | 'extension' | 'release' | 'draft' | 'other';
  playerName?: string;
  gamMentioned: boolean;
  tamMentioned: boolean;
  allocationDetails?: string;
}

// Keywords to identify transaction articles
const TRANSACTION_KEYWORDS = [
  'signs', 'signed', 'signing',
  'trade', 'traded', 'trades',
  'transfer', 'transferred', 'transfers',
  'acquire', 'acquired', 'acquires',
  'loan', 'loaned', 'loans',
  'release', 'released', 'releases',
  'waive', 'waived', 'waives',
  'draft', 'drafted', 'selects',
  'extension', 'contract',
  'depart', 'departure',
  'homegrown',
  'superdraft',
  're-entry',
];

// Keywords indicating GAM/TAM involvement
const ALLOCATION_KEYWORDS = [
  'general allocation money',
  'gam',
  'targeted allocation money', 
  'tam',
  'allocation money',
  'transfer fee',
  'undisclosed fee',
  'free transfer',
];

function identifyTransactionType(title: string): TransactionArticle['transactionType'] {
  const lower = title.toLowerCase();
  if (lower.includes('trade') || lower.includes('acquires')) return 'trade';
  if (lower.includes('transfer')) return 'transfer';
  if (lower.includes('loan')) return 'loan';
  if (lower.includes('extension')) return 'extension';
  if (lower.includes('release') || lower.includes('waive')) return 'release';
  if (lower.includes('draft') || lower.includes('selects')) return 'draft';
  if (lower.includes('sign')) return 'signing';
  return 'other';
}

function extractPlayerName(title: string): string | undefined {
  // Common patterns: "Austin FC Signs [Player Name]", "Austin FC Trades for [Player Name]"
  const patterns = [
    /Austin FC (?:Signs|Acquires|Trades for|Loans|Transfers)\s+(?:Defender |Midfielder |Forward |Goalkeeper |Winger )?([A-Z][a-zÀ-ÿ'-]+ [A-Z][a-zÀ-ÿ'-]+)/i,
    /([A-Z][a-zÀ-ÿ'-]+ [A-Z][a-zÀ-ÿ'-]+)\s+(?:Signs|Joins|Loaned|Transferred)/i,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return match[1];
  }
  return undefined;
}

async function scrapeNewsPage(page: puppeteer.Page, pageNum: number = 1): Promise<TransactionArticle[]> {
  const url = pageNum === 1 
    ? 'https://www.austinfc.com/news/' 
    : `https://www.austinfc.com/news/?page=${pageNum}`;
  
  console.log(`\nScraping page ${pageNum}: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('article, .d3-o-media-object, [class*="card"], [class*="article"]', { timeout: 10000 }).catch(() => {});
  
  // Scroll to load more content
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const articles: TransactionArticle[] = [];
  
  // Find all article links
  $('a[href*="/news/"]').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    const title = $el.text().trim() || $el.find('h2, h3, h4').text().trim();
    
    if (!href || !title || title.length < 10) return;
    
    // Check if this is a transaction article
    const isTransaction = TRANSACTION_KEYWORDS.some(kw => 
      title.toLowerCase().includes(kw)
    );
    
    if (isTransaction) {
      const fullUrl = href.startsWith('http') ? href : `https://www.austinfc.com${href}`;
      
      // Skip duplicates
      if (articles.some(a => a.url === fullUrl)) return;
      
      articles.push({
        title,
        date: '',
        url: fullUrl,
        excerpt: '',
        transactionType: identifyTransactionType(title),
        playerName: extractPlayerName(title),
        gamMentioned: false,
        tamMentioned: false,
      });
    }
  });
  
  return articles;
}

async function scrapeArticleDetails(page: puppeteer.Page, article: TransactionArticle): Promise<TransactionArticle> {
  console.log(`  Reading: ${article.title}`);
  
  try {
    await page.goto(article.url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Get article text
    const articleBody = $('article, .article-body, [class*="article"], .d3-l-col__col-12').text();
    article.fullText = articleBody.replace(/\s+/g, ' ').trim();
    
    // Get date
    const dateEl = $('time, [class*="date"], [class*="Date"]').first();
    article.date = dateEl.attr('datetime') || dateEl.text().trim() || '';
    
    // Check for GAM/TAM mentions
    const lowerText = article.fullText.toLowerCase();
    article.gamMentioned = lowerText.includes('general allocation money') || 
                          /\bgam\b/.test(lowerText) ||
                          lowerText.includes('allocation money');
    article.tamMentioned = lowerText.includes('targeted allocation money') || 
                          /\btam\b/.test(lowerText);
    
    // Extract allocation details if mentioned
    if (article.gamMentioned || article.tamMentioned) {
      // Look for sentences containing allocation info
      const sentences = article.fullText.split(/[.!?]+/);
      const allocationSentences = sentences.filter(s => 
        ALLOCATION_KEYWORDS.some(kw => s.toLowerCase().includes(kw))
      );
      article.allocationDetails = allocationSentences.join('. ').trim();
    }
    
  } catch (error) {
    console.log(`    Error reading article: ${error}`);
  }
  
  return article;
}

async function main() {
  console.log('Austin FC Transaction Scraper');
  console.log('=============================\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  const allArticles: TransactionArticle[] = [];
  
  try {
    // Scrape multiple pages of news
    for (let pageNum = 1; pageNum <= 20; pageNum++) {
      const articles = await scrapeNewsPage(page, pageNum);
      console.log(`  Found ${articles.length} transaction articles on page ${pageNum}`);
      
      if (articles.length === 0) {
        console.log('  No more articles found, stopping pagination');
        break;
      }
      
      allArticles.push(...articles);
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log(`\n\nTotal transaction articles found: ${allArticles.length}`);
    console.log('Reading each article for GAM/TAM details...\n');
    
    // Read each article for details
    for (let i = 0; i < allArticles.length; i++) {
      allArticles[i] = await scrapeArticleDetails(page, allArticles[i]);
      
      // Rate limiting
      if (i % 5 === 0 && i > 0) {
        console.log(`  Progress: ${i}/${allArticles.length}`);
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
  } finally {
    await browser.close();
  }
  
  // Output results
  console.log('\n\n========================================');
  console.log('RESULTS');
  console.log('========================================\n');
  
  // Separate articles with/without allocation mentions
  const withAllocation = allArticles.filter(a => a.gamMentioned || a.tamMentioned);
  const trades = allArticles.filter(a => a.transactionType === 'trade');
  const transfers = allArticles.filter(a => a.transactionType === 'transfer');
  const signings = allArticles.filter(a => a.transactionType === 'signing');
  
  console.log('=== ARTICLES MENTIONING GAM/TAM ===\n');
  withAllocation.forEach(a => {
    console.log(`${a.date || 'Unknown date'} | ${a.title}`);
    console.log(`  URL: ${a.url}`);
    console.log(`  GAM: ${a.gamMentioned ? 'YES' : 'no'} | TAM: ${a.tamMentioned ? 'YES' : 'no'}`);
    if (a.allocationDetails) {
      console.log(`  Details: ${a.allocationDetails.substring(0, 200)}...`);
    }
    console.log('');
  });
  
  console.log('\n=== ALL TRADES ===\n');
  trades.forEach(a => {
    console.log(`${a.date || 'Unknown'} | ${a.title}`);
    console.log(`  Player: ${a.playerName || 'Unknown'}`);
    console.log(`  GAM/TAM: ${a.gamMentioned || a.tamMentioned ? 'MENTIONED' : 'not mentioned'}`);
    console.log(`  URL: ${a.url}`);
    console.log('');
  });
  
  console.log('\n=== ALL TRANSFERS ===\n');
  transfers.forEach(a => {
    console.log(`${a.date || 'Unknown'} | ${a.title}`);
    console.log(`  Player: ${a.playerName || 'Unknown'}`);
    console.log(`  GAM/TAM: ${a.gamMentioned || a.tamMentioned ? 'MENTIONED' : 'not mentioned'}`);
    console.log(`  URL: ${a.url}`);
    console.log('');
  });
  
  // Save to JSON for later use
  const outputPath = 'src/data/austin-fc-transactions-scraped.json';
  fs.writeFileSync(outputPath, JSON.stringify({
    scrapedAt: new Date().toISOString(),
    totalArticles: allArticles.length,
    withAllocationMentions: withAllocation.length,
    articles: allArticles,
  }, null, 2));
  
  console.log(`\n\nResults saved to ${outputPath}`);
  
  // Summary
  console.log('\n\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Total transaction articles: ${allArticles.length}`);
  console.log(`  - Trades: ${trades.length}`);
  console.log(`  - Transfers: ${transfers.length}`);  
  console.log(`  - Signings: ${signings.length}`);
  console.log(`  - Other: ${allArticles.length - trades.length - transfers.length - signings.length}`);
  console.log(`Articles mentioning GAM/TAM: ${withAllocation.length}`);
}

main().catch(console.error);

