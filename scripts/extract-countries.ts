/**
 * Extract source countries by finding the club+country pattern in snapshots
 * Pattern: "name: ClubName" followed by "name: CountryName" within a few lines
 */

import * as fs from 'fs';
import * as path from 'path';

// Known countries
const COUNTRIES = new Set([
  'Albania', 'Algeria', 'Andorra', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Benin', 'Bolivia', 'Bosnia-Herzegovina',
  'Brazil', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cameroon', 'Canada', 'Cape Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Czechia',
  'DR Congo', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'England',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Faroe Islands', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Grenada',
  'Guadeloupe', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Latvia', 'Lebanon', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius',
  'Mexico', 'Moldova', 'Monaco', 'Montenegro', 'Morocco', 'Mozambique', 'Namibia', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Northern Ireland', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Samoa', 'Saudi Arabia', 'Scotland', 'Senegal', 'Serbia',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tahiti', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Türkiye',
  'Turkmenistan', 'UAE', 'Uganda', 'Ukraine', 'United States', 'Uruguay', 'USA', 'Uzbekistan',
  'Venezuela', 'Vietnam', 'Wales', 'Yemen', 'Zambia', 'Zimbabwe'
]);

const BROWSER_LOGS_DIR = '/Users/derekensing/.cursor/browser-logs';

// Read existing transfers and enrich with countries
async function main() {
  // Load the existing parsed data
  const dataPath = path.join(__dirname, '../data/mls-transfers-all-years.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  // Build a map of club -> country from snapshots
  const clubCountryMap: Record<string, string> = {};
  
  const snapshots = [
    'snapshot-2026-01-20T00-50-08-834Z.log',
    'snapshot-2026-01-19T19-56-29-873Z.log',
    'snapshot-2026-01-19T19-56-50-831Z.log',
    'snapshot-2026-01-19T19-57-05-205Z.log',
    'snapshot-2026-01-19T19-57-16-844Z.log',
  ];
  
  for (const snapshotFile of snapshots) {
    const filePath = path.join(BROWSER_LOGS_DIR, snapshotFile);
    if (!fs.existsSync(filePath)) continue;
    
    console.log(`Processing ${snapshotFile}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find patterns: role: cell containing name: Club followed by role: img name: Country
    for (let i = 0; i < lines.length - 10; i++) {
      const line = lines[i];
      
      // Look for "name: " entries that might be clubs
      if (line.includes('name:')) {
        const match = line.match(/name:\s*(.+?)(?:\s*$)/);
        if (!match) continue;
        
        const name = match[1].trim();
        
        // Skip if this is a country, player name (has spaces like "M. Uzuni"), or value
        if (COUNTRIES.has(name) || name.includes('€') || /^[A-Z]\.\s/.test(name)) continue;
        
        // Check if next few lines have a country flag
        for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
          const nextLine = lines[j];
          
          // Check for img with country name
          if (nextLine.includes('- role: img')) {
            // Look for name on this or next line
            for (let k = j; k < Math.min(j + 3, lines.length); k++) {
              const imgLine = lines[k];
              if (imgLine.includes('name:')) {
                const imgMatch = imgLine.match(/name:\s*(.+?)(?:\s*$)/);
                if (imgMatch) {
                  const imgName = imgMatch[1].trim();
                  if (COUNTRIES.has(imgName) && !clubCountryMap[name]) {
                    // Found a club -> country mapping!
                    clubCountryMap[name] = imgName;
                  }
                }
                break;
              }
            }
            break;
          }
          
          // Stop if we hit another cell or row
          if (nextLine.includes('- role: cell') || nextLine.includes('- role: row')) break;
        }
      }
    }
  }
  
  console.log(`\nFound ${Object.keys(clubCountryMap).length} club -> country mappings`);
  
  // Show some examples
  console.log('\nSample mappings:');
  Object.entries(clubCountryMap).slice(0, 20).forEach(([club, country]) => {
    console.log(`  ${club} -> ${country}`);
  });
  
  // Apply to transfers
  let enriched = 0;
  const transfers = data.transfers.map((t: any) => {
    const sourceClub = t.sourceClub;
    
    // Try to find country from our map
    let sourceCountry = clubCountryMap[sourceClub];
    
    // Try partial match if exact doesn't work
    if (!sourceCountry) {
      for (const [club, country] of Object.entries(clubCountryMap)) {
        if (sourceClub.includes(club) || club.includes(sourceClub)) {
          sourceCountry = country;
          break;
        }
      }
    }
    
    if (sourceCountry) {
      enriched++;
      return { ...t, sourceCountry };
    }
    
    return t;
  });
  
  console.log(`\nEnriched ${enriched} out of ${transfers.length} transfers with country data`);
  
  // Save enriched data
  const output = {
    ...data,
    transfers,
    summary: {
      ...data.summary,
      withCountry: transfers.filter((t: any) => t.sourceCountry && !['Unknown', ''].includes(t.sourceCountry)).length,
    }
  };
  
  const outputPath = path.join(__dirname, '../data/mls-transfers-enriched.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Saved enriched data to data/mls-transfers-enriched.json`);
  
  // Show country distribution
  const countryCount: Record<string, number> = {};
  transfers.forEach((t: any) => {
    const country = t.sourceCountry || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });
  
  console.log('\nTop 30 source countries:');
  Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([country, count]) => console.log(`  ${country}: ${count}`));
}

main().catch(console.error);

