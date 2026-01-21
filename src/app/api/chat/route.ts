import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getRulesContext, rosterConstructionModels, designatedPlayerRules, u22InitiativeRules, allocationMoney, internationalSlots, freeAgencyRules, homegrownRules, tradeRules } from '@/data/mls-rules-2025';
import { austinFCRoster, MLS_2026_RULES, AUSTIN_FC_2026_TRANSACTIONS } from '@/data/austin-fc-roster';
import { getMergedRosters, generateMergedRosterSummaryForAI, getMLSPASalariesCount } from '@/lib/data-sources/mls-merged-rosters';
import { ALL_TRANSFERS, getTransferStats, getMLSTeams } from '@/data/mls-transfers-all';

export const maxDuration = 60;

// Generate Austin FC roster context from actual data
function generateRosterContext() {
  const formatMoney = (n: number) => n >= 1_000_000 
    ? `$${(n / 1_000_000).toFixed(2)}M` 
    : `$${(n / 1000).toFixed(0)}K`;

  // Group players by designation
  const dps = austinFCRoster.filter(p => p.isDP);
  const u22s = austinFCRoster.filter(p => p.isU22);
  const tams = austinFCRoster.filter(p => p.designation === 'TAM');
  const seniors = austinFCRoster.filter(p => p.rosterSlot === 'Senior' && !p.isDP);
  const supplementals = austinFCRoster.filter(p => p.rosterSlot === 'Supplemental');
  const internationals = austinFCRoster.filter(p => p.isInternational);
  const homegrowns = austinFCRoster.filter(p => p.isHomegrown);

  // Calculate totals
  const totalBudgetCharge = austinFCRoster.reduce((sum, p) => sum + p.budgetCharge, 0);
  const totalSalary = austinFCRoster.reduce((sum, p) => sum + p.guaranteedCompensation, 0);
  const capSpace = MLS_2026_RULES.salaryBudget - totalBudgetCharge;

  const rosterList = austinFCRoster.map(p => 
    `- ${p.name} (${p.position}, ${p.age}yo, ${p.nationality}${p.isInternational ? ' [INT]' : ''}): ` +
    `Salary ${formatMoney(p.guaranteedCompensation)}, ` +
    `Budget Charge ${formatMoney(p.budgetCharge)}, ` +
    `${p.designation}${p.isDP ? ' [DP]' : ''}${p.isU22 ? ' [U22]' : ''}${p.isHomegrown ? ' [HG]' : ''}, ` +
    `Contract ends ${p.contractEnd}`
  ).join('\n');

  return `
==============================================================================
AUSTIN FC 2026 ROSTER (ACTUAL DATA - SOURCE OF TRUTH)
Source: MLSPA Salary Guide + austinfc.com/roster (Last Updated: January 2026)
==============================================================================

CURRENT ROSTER (${austinFCRoster.length} players):
${rosterList}

SLOT USAGE:
- Designated Players: ${dps.length}/3 used [${dps.map(p => p.name).join(', ')}]
- U22 Initiative: ${u22s.length}/3 used [${u22s.map(p => p.name).join(', ')}]
- International Slots: ${internationals.length}/8 used [${internationals.map(p => p.name).join(', ')}]
- Senior Roster: ${seniors.length + dps.length}/20 used
- Supplemental Roster: ${supplementals.length}/10 used
- Homegrown Players: ${homegrowns.map(p => p.name).join(', ')}

SALARY CAP STATUS:
- 2026 Salary Budget: ${formatMoney(MLS_2026_RULES.salaryBudget)}
- Total Budget Charges: ${formatMoney(totalBudgetCharge)}
- Cap Space Remaining: ${formatMoney(capSpace)}
- Total Actual Salaries: ${formatMoney(totalSalary)}
- TAM Available: ${formatMoney(MLS_2026_RULES.tamAnnual)} (annual allocation)
- GAM Available: ${formatMoney(MLS_2026_RULES.gamAnnual)} (annual allocation, minus spent)

TRANSACTION LIMITS (2026):
- Contract Buyouts Used: ${AUSTIN_FC_2026_TRANSACTIONS.buyoutsUsed}/2
- Cash Transfers Used: ${AUSTIN_FC_2026_TRANSACTIONS.cashTransfersUsed}/2
${AUSTIN_FC_2026_TRANSACTIONS.notes.map(n => `- Note: ${n}`).join('\n')}

AVAILABLE SLOTS:
- DP Slots Available: ${3 - dps.length}
- U22 Slots Available: ${3 - u22s.length}
- International Slots Available: ${8 - internationals.length}
- Senior Roster Spots Available: ${20 - (seniors.length + dps.length)}
`;
}

// Build comprehensive system prompt with FULL MLS rules + ACTUAL Austin FC data
const systemPrompt = `You are the Austin FC GM Lab Assistant - an expert on Austin FC roster management, MLS salary cap rules, and player analysis.

⚠️ CRITICAL INSTRUCTIONS:
- You have ACTUAL Austin FC roster data below. Use ONLY this data when discussing Austin FC players, salaries, and cap situation.
- You also have MLS-wide salary data from MLSPA (944 players across all 30 teams) - use this for comparing salaries and trade discussions.
- You have TRANSFER MARKET DATA from Transfermarkt (2020-2025) - use this for discussing transfer fees, source markets, and signing benchmarks.
- DO NOT make up or guess player salaries that aren't in the data.
- For trade suggestions, reference actual players and their real salaries from the MLS data below.
- For transfer fee benchmarks, reference the Transfermarkt data to understand market values.

PERSONALITY:
- Enthusiastic about Austin FC (use 🌳⚽ occasionally)
- Speak like a knowledgeable sports analyst
- Be concise but thorough
- Use **bold** for important numbers and player names
- Always cite your data source when discussing Austin FC

==============================================================================
MLS 2026 ROSTER RULES (CBA SOURCE OF TRUTH)
==============================================================================

${getRulesContext()}

ROSTER CONSTRUCTION MODELS:
**MODEL A (DP Focus):** Max 3 DPs, Max 3 U22s
**MODEL B (Youth Focus):** Max 2 DPs, Max 4 U22s, Extra $2M GAM

DESIGNATED PLAYER DETAILS:
- Budget Charge: $${designatedPlayerRules.budgetCharge.toLocaleString()} (capped regardless of actual salary)
- Young DP (≤${designatedPlayerRules.youngDP.maxAge}): $${designatedPlayerRules.youngDP.reducedBudgetCharge.toLocaleString()} charge

U22 INITIATIVE:
- Budget Charge: $${u22InitiativeRules.budgetCharge.tier1.toLocaleString()} - $${u22InitiativeRules.budgetCharge.tier2.toLocaleString()}
- Max Salary: $${u22InitiativeRules.maxSalary.toLocaleString()}

ALLOCATION MONEY (2026):
- TAM Annual: $${allocationMoney.TAM.annualAllocation2026.toLocaleString()}
- GAM Annual: $${allocationMoney.GAM.annualAllocation2026.toLocaleString()}
- TAM Max Per Player: $${allocationMoney.TAM.maxBuydownPerPlayer.toLocaleString()}

INTERNATIONAL SLOTS: 8 default per club (tradeable)

${generateRosterContext()}

==============================================================================
INSTRUCTIONS FOR ANSWERING QUESTIONS
==============================================================================
1. For Austin FC questions: USE THE ACTUAL ROSTER DATA ABOVE. Cite specific players, salaries, and cap numbers.
2. For MLS rules questions: Explain the rule clearly with examples.
3. For signing feasibility: Calculate exact budget impact using Austin FC's actual cap space.
4. For trade ideas: Reference the MLS-wide salary data below - you have real salaries for ~944 players across all 30 teams!
5. When comparing players or suggesting trades, cite actual salary figures from the data.
6. For TRANSFER FEE questions: Use the Transfermarkt data to discuss market values, source leagues, and comparable signings.
7. When discussing potential signings from abroad, reference similar transfers from the database for fee benchmarks.
8. For market analysis: The transfer data shows where MLS clubs are buying from (England, Argentina, Brazil are top sources).
9. If a player isn't in our data (very recent signing), note that their salary isn't in the October 2025 MLSPA release.

REMEMBER: You are a GM assistant with REAL Austin FC data and MLS-wide salary data. Be accurate, not creative with numbers.`;

// Generate MLS transfer market context
function generateTransferContext(): string {
  const stats = getTransferStats();
  const teams = getMLSTeams();
  
  // Get top source countries
  const countryData = new Map<string, { count: number; spend: number; topSignings: string[] }>();
  ALL_TRANSFERS.forEach(t => {
    const country = t.sourceCountry || 'Unknown';
    const existing = countryData.get(country) || { count: 0, spend: 0, topSignings: [] };
    existing.count++;
    existing.spend += t.fee;
    if (t.fee > 5000000 && existing.topSignings.length < 3) {
      existing.topSignings.push(`${t.playerName} ($${(t.fee / 1000000).toFixed(1)}M from ${t.sourceClub})`);
    }
    countryData.set(country, existing);
  });
  
  const topCountries = Array.from(countryData.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([country, data]) => 
      `- ${country}: ${data.count} transfers, $${(data.spend / 1000000).toFixed(1)}M total spend` +
      (data.topSignings.length > 0 ? ` (Notable: ${data.topSignings.slice(0, 2).join(', ')})` : '')
    )
    .join('\n');
  
  // Get Austin FC transfers
  const austinTransfers = ALL_TRANSFERS
    .filter(t => t.mlsTeam?.toLowerCase().includes('austin'))
    .sort((a, b) => b.fee - a.fee)
    .slice(0, 10)
    .map(t => `- ${t.playerName}: $${(t.fee / 1000000).toFixed(1)}M from ${t.sourceClub} (${t.sourceCountry}, ${t.year})`)
    .join('\n');
  
  // Get recent 2025 big signings
  const recent2025 = ALL_TRANSFERS
    .filter(t => t.year === 2025 && t.fee > 3000000)
    .sort((a, b) => b.fee - a.fee)
    .slice(0, 10)
    .map(t => `- ${t.playerName} to ${t.mlsTeam}: $${(t.fee / 1000000).toFixed(1)}M from ${t.sourceClub} (${t.sourceCountry})`)
    .join('\n');
  
  return `
==============================================================================
MLS TRANSFER MARKET DATA (SOURCE: Transfermarkt 2020-2025)
Total Transfers in Database: ${stats.totalTransfers}
Data Source: transfermarkt.us (incoming international transfers only)
==============================================================================

LEAGUE-WIDE SUMMARY (2020-2025):
- Total Transfers: ${stats.totalTransfers}
- Total Spend: $${(stats.totalSpend / 1000000).toFixed(1)}M
- Paid Transfers: ${stats.paidTransfers} ($${(stats.avgFee / 1000000).toFixed(2)}M avg)
- Free Transfers: ${stats.freeTransfers} (${((stats.freeTransfers / stats.totalTransfers) * 100).toFixed(0)}%)

TOP SOURCE COUNTRIES/LEAGUES:
${topCountries}

AUSTIN FC TOP SIGNINGS (2021-2025):
${austinTransfers}

NOTABLE 2025 WINTER WINDOW SIGNINGS:
${recent2025 || '- Window still in progress, data being updated'}

⚠️ NOTES ON TRANSFER DATA:
- All fees converted to USD at €1 = $1.10
- Only includes incoming international transfers (excludes internal MLS moves)
- Player nationality may differ from source league (e.g., American playing in Europe)
- Use for market analysis, comparable signings, and transfer fee benchmarks
`;
}

// Generate MLS-wide context (called per request to ensure fresh data)
async function generateMLSContext(): Promise<string> {
  try {
    const mergedRosters = await getMergedRosters(false); // Use cached if available
    if (mergedRosters) {
      const summary = generateMergedRosterSummaryForAI(mergedRosters);
      const totalPlayers = getMLSPASalariesCount();
      return `
==============================================================================
MLS LEAGUE-WIDE ROSTER & SALARY DATA (SOURCE: MLSPA + mlssoccer.com)
Total Players in Database: ${totalPlayers}
Data Sources: 
- Salaries: MLSPA Salary Guide (October 2025 release)
- Rosters: mlssoccer.com (current as of January 2026)
==============================================================================

${summary}

⚠️ NOTES ON MLS-WIDE DATA:
- Salary data is from MLSPA October 2025 release - some transfers have occurred since
- Use this data for general comparisons and trade value discussions
- For Austin FC specifics, always defer to the Austin FC roster section above
`;
    }
  } catch (error) {
    console.error('Failed to load MLS context:', error);
  }
  return '';
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch MLS-wide context (async)
  const mlsContext = await generateMLSContext();
  
  // Generate transfer market context
  const transferContext = generateTransferContext();
  
  const fullSystemPrompt = systemPrompt + mlsContext + transferContext;

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: fullSystemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
