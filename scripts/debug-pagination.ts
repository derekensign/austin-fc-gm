/**
 * Debug pagination on MLSSoccer.com
 */

import { chromium } from 'playwright';

async function debugPagination() {
  console.log('🔍 Debugging pagination...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = 'https://www.mlssoccer.com/stats/players/#season=2025&competition=mls-regular-season&club=all&statType=general&position=all';

    console.log('📊 Loading page...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('table tbody tr', { timeout: 15000 });
    await page.waitForTimeout(5000); // Wait longer to ensure everything loads

    // Take a screenshot
    await page.screenshot({ path: 'mls-page-loaded.png', fullPage: true });
    console.log('📸 Screenshot saved: mls-page-loaded.png');

    // Count rows
    const rowCount = await page.locator('table tbody tr').count();
    console.log(`\n📊 Found ${rowCount} rows in table`);

    // Look for pagination elements
    console.log('\n🔍 Looking for pagination elements...');

    // Try various selectors
    const selectors = [
      'button:has-text("Next")',
      'a:has-text("Next")',
      '.pagination button',
      '.pagination a',
      'button[aria-label*="next"]',
      'button[aria-label*="Next"]',
      '[class*="pagination"]',
      '[class*="Pagination"]',
      'nav[aria-label="pagination"]',
      'nav[role="navigation"]',
      '.page-link',
      'button:has-text("›")',
      'button:has-text(">")',
    ];

    for (const selector of selectors) {
      try {
        const count = await page.locator(selector).count();
        if (count > 0) {
          console.log(`✓ Found ${count} elements for: ${selector}`);

          // Get details about the first element
          const first = page.locator(selector).first();
          const text = await first.textContent().catch(() => 'N/A');
          const isVisible = await first.isVisible().catch(() => false);
          const isEnabled = await first.isEnabled().catch(() => false);
          const ariaLabel = await first.getAttribute('aria-label').catch(() => null);

          console.log(`  - Text: "${text}"`);
          console.log(`  - Visible: ${isVisible}`);
          console.log(`  - Enabled: ${isEnabled}`);
          console.log(`  - Aria-label: ${ariaLabel || 'none'}`);
        }
      } catch (e) {
        // Selector not found, continue
      }
    }

    // Check if there's a "Show more" or "Load more" button
    console.log('\n🔍 Looking for load more buttons...');
    const loadMoreSelectors = [
      'button:has-text("Load more")',
      'button:has-text("Show more")',
      'button:has-text("load")',
      'button[class*="load"]',
      'button[class*="more"]',
    ];

    for (const selector of loadMoreSelectors) {
      try {
        const count = await page.locator(selector).count();
        if (count > 0) {
          console.log(`✓ Found ${count} "load more" elements for: ${selector}`);
        }
      } catch (e) {
        // Not found
      }
    }

    // Check the page HTML structure around pagination
    const paginationHTML = await page.evaluate(() => {
      // Look for elements with "pagination" in class or id
      const elements = Array.from(document.querySelectorAll('[class*="pagination"], [id*="pagination"]'));
      return elements.map(el => ({
        tag: el.tagName,
        classes: el.className,
        id: el.id,
        innerHTML: el.innerHTML.substring(0, 200) // First 200 chars
      }));
    });

    if (paginationHTML.length > 0) {
      console.log('\n📋 Pagination HTML structure:');
      console.log(JSON.stringify(paginationHTML, null, 2));
    } else {
      console.log('\n⚠️  No pagination elements found in DOM');
    }

    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({ path: 'pagination-debug-error.png' });
  } finally {
    await browser.close();
  }
}

debugPagination();
