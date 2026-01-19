import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getRulesContext, rosterConstructionModels, designatedPlayerRules, u22InitiativeRules, allocationMoney, internationalSlots, freeAgencyRules, homegrownRules, tradeRules } from '@/data/mls-rules-2025';
import { austinFCRoster, MLS_2026_RULES, AUSTIN_FC_2026_TRANSACTIONS } from '@/data/austin-fc-roster';

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
- DO NOT make up or guess player salaries, designations, or other teams' rosters.
- If asked about other MLS teams' rosters, explain that you only have verified Austin FC data.
- For trade suggestions, focus on what Austin FC NEEDS based on their actual roster, not speculation about other teams.

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
- TAM Annual: $${allocationMoney.TAM.annualAllocation2025.toLocaleString()}
- GAM Annual: $${allocationMoney.GAM.annualAllocation2025.toLocaleString()}
- TAM Max Per Player: $${allocationMoney.TAM.maxBuydownPerPlayer.toLocaleString()}

INTERNATIONAL SLOTS: 8 default per club (tradeable)

${generateRosterContext()}

==============================================================================
INSTRUCTIONS FOR ANSWERING QUESTIONS
==============================================================================
1. For Austin FC questions: USE THE ACTUAL ROSTER DATA ABOVE. Cite specific players, salaries, and cap numbers.
2. For MLS rules questions: Explain the rule clearly with examples.
3. For signing feasibility: Calculate exact budget impact using Austin FC's actual cap space.
4. For trade ideas: Focus on Austin FC's actual needs (gaps in roster) and available assets (GAM, slots, tradeable players).
5. DO NOT speculate about other teams' rosters or player availability - we don't have that data.
6. If asked about specific players on other teams, say "I don't have verified salary data for [team], but here's how it would work cap-wise..."

REMEMBER: You are a GM assistant with REAL Austin FC data. Be accurate, not creative with numbers.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
