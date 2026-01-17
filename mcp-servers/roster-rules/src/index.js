import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// MLS 2026 Roster Rules
const rosterRules = {
  salaryCap: {
    salaryBudget: 5270000,
    maxSeniorRoster: 20,
    maxSupplementalRoster: 10,
    totalRosterLimit: 30,
    minimumBudgetCharge: 67360,
    maxBudgetCharge: 683750,
  },
  
  designatedPlayers: {
    maxSlots: 3,
    budgetCharge: 683750,
    description: "DPs count against cap at max budget charge regardless of actual salary",
    youngDPRules: {
      maxAge: 23,
      reducedCharge: 150000,
      description: "Players 23 or younger when signed get reduced cap hit",
    },
  },
  
  allocationMoney: {
    TAM: {
      name: "Targeted Allocation Money",
      annualAmount: 2800000,
      maxPerPlayer: 1612500,
      canBuyDown: true,
      description: "Used to buy down player salaries to max budget charge or below",
    },
    GAM: {
      name: "General Allocation Money",
      annualAmount: 1725000,
      canTrade: true,
      canBuyDown: true,
      description: "Flexible allocation money for salary cap relief",
    },
  },
  
  u22Initiative: {
    maxSlots: 3,
    budgetCharge: 200000,
    maxSalary: 612500,
    ageRequirement: "Under 22 on signing date",
    description: "Young player mechanism to develop talent at reduced cap hit",
  },
  
  homegrownPlayers: {
    description: "Players signed from club's academy",
    budgetExempt: false,
    seniorRosterExempt: true,
    minimumSalary: 67360,
    benefits: [
      "Do not count against senior roster limit (up to a point)",
      "First HG exempt from senior roster",
      "Priority in MLS roster rules",
    ],
  },
  
  internationalSlots: {
    defaultSlots: 8,
    canTrade: true,
    canPurchase: true,
    description: "Required for non-domestic players without green card/citizenship",
  },
  
  loanRules: {
    shortTermMax: 4,
    shortTermDuration: "Up to 4 months",
    seasonLongAllowed: true,
    canPaySalary: true,
    internationalRequired: true,
    description: "MLS allows both intra-league and international loans",
  },
};

// Austin FC current roster compliance status
const austinFCCompliance = {
  seniorRoster: {
    current: 18,
    max: 20,
    available: 2,
  },
  supplementalRoster: {
    current: 8,
    max: 10,
    available: 2,
  },
  dpSlots: {
    used: 1,
    max: 3,
    players: ["Sebastián Driussi"],
    available: 2,
  },
  u22Slots: {
    used: 2,
    max: 3,
    players: ["Guilherme Biro", "Damian Las"],
    available: 1,
  },
  internationalSlots: {
    used: 6,
    max: 8,
    available: 2,
  },
  salaryCapStatus: {
    budget: 5270000,
    currentSpend: 4870000,
    available: 400000,
    tamAvailable: 450000,
    gamAvailable: 1200000,
  },
  homegrownPlayers: ["Owen Wolff"],
};

const server = new McpServer({
  name: "roster-rules",
  version: "1.0.0",
});

server.tool(
  "get_salary_cap_rules",
  "Get MLS salary cap rules and limits",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const cap = rosterRules.salaryCap;
    return {
      content: [
        {
          type: "text",
          text: `MLS 2026 SALARY CAP RULES\n\n` +
            `💰 Salary Budget: $${(cap.salaryBudget / 1000000).toFixed(2)}M\n\n` +
            `📋 ROSTER LIMITS:\n` +
            `• Senior Roster: ${cap.maxSeniorRoster} players max\n` +
            `• Supplemental Roster: ${cap.maxSupplementalRoster} players max\n` +
            `• Total Roster: ${cap.totalRosterLimit} players max\n\n` +
            `💵 BUDGET CHARGES:\n` +
            `• Minimum: $${cap.minimumBudgetCharge.toLocaleString()}\n` +
            `• Maximum: $${cap.maxBudgetCharge.toLocaleString()}\n\n` +
            `Players earning above max budget charge must be signed as:\n` +
            `• Designated Player (DP)\n` +
            `• Bought down with TAM to max charge or below\n` +
            `• U22 Initiative player (if eligible)`,
        },
      ],
    };
  }
);

server.tool(
  "get_dp_rules",
  "Get Designated Player rules and mechanisms",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const dp = rosterRules.designatedPlayers;
    return {
      content: [
        {
          type: "text",
          text: `DESIGNATED PLAYER (DP) RULES\n\n` +
            `📊 SLOTS: ${dp.maxSlots} per team\n\n` +
            `💰 CAP IMPACT:\n` +
            `• Budget Charge: $${dp.budgetCharge.toLocaleString()} (regardless of actual salary)\n` +
            `• ${dp.description}\n\n` +
            `👶 YOUNG DP RULES:\n` +
            `• Age Requirement: ${dp.youngDPRules.maxAge} or younger when signed\n` +
            `• Reduced Charge: $${dp.youngDPRules.reducedCharge.toLocaleString()}\n` +
            `• ${dp.youngDPRules.description}\n\n` +
            `⚠️ CONSIDERATIONS:\n` +
            `• DP slots are valuable - use on highest-paid players\n` +
            `• Young DPs offer cap flexibility\n` +
            `• Can buy down to non-DP status with TAM`,
        },
      ],
    };
  }
);

server.tool(
  "get_allocation_money_rules",
  "Get TAM and GAM rules and usage",
  {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["TAM", "GAM", "both"],
        description: "Type of allocation money to explain",
      },
    },
  },
  async ({ type = "both" }) => {
    const tam = rosterRules.allocationMoney.TAM;
    const gam = rosterRules.allocationMoney.GAM;
    
    let text = "ALLOCATION MONEY RULES\n\n";
    
    if (type === "TAM" || type === "both") {
      text += `💵 TAM (${tam.name})\n` +
        `• Annual Amount: $${(tam.annualAmount / 1000000).toFixed(2)}M\n` +
        `• Max Per Player: $${(tam.maxPerPlayer / 1000000).toFixed(2)}M\n` +
        `• Can Buy Down Salaries: ${tam.canBuyDown ? 'Yes' : 'No'}\n` +
        `• ${tam.description}\n\n`;
    }
    
    if (type === "GAM" || type === "both") {
      text += `💰 GAM (${gam.name})\n` +
        `• Annual Amount: $${(gam.annualAmount / 1000000).toFixed(2)}M\n` +
        `• Tradeable: ${gam.canTrade ? 'Yes' : 'No'}\n` +
        `• Can Buy Down Salaries: ${gam.canBuyDown ? 'Yes' : 'No'}\n` +
        `• ${gam.description}\n\n`;
    }
    
    text += `📝 USAGE PRIORITY:\n` +
      `1. TAM first (player-specific limits apply)\n` +
      `2. GAM for remaining buydown\n` +
      `3. Combination for large contracts`;
    
    return {
      content: [{ type: "text", text }],
    };
  }
);

server.tool(
  "get_u22_initiative_rules",
  "Get U22 Initiative rules for young player development",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const u22 = rosterRules.u22Initiative;
    return {
      content: [
        {
          type: "text",
          text: `U22 INITIATIVE RULES\n\n` +
            `👶 PURPOSE: ${u22.description}\n\n` +
            `📊 LIMITS:\n` +
            `• Max Slots: ${u22.maxSlots} per team\n` +
            `• Budget Charge: $${u22.budgetCharge.toLocaleString()}\n` +
            `• Max Salary: $${u22.maxSalary.toLocaleString()}\n` +
            `• Age Requirement: ${u22.ageRequirement}\n\n` +
            `✅ BENEFITS:\n` +
            `• Reduced cap hit for young talent\n` +
            `• Allows investment in development\n` +
            `• Players can "graduate" if exceeding salary limit\n\n` +
            `⚠️ NOTES:\n` +
            `• International slot still required for foreign U22s\n` +
            `• Age calculated at time of signing`,
        },
      ],
    };
  }
);

server.tool(
  "get_homegrown_rules",
  "Get Homegrown Player rules and benefits",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const hg = rosterRules.homegrownPlayers;
    return {
      content: [
        {
          type: "text",
          text: `HOMEGROWN PLAYER RULES\n\n` +
            `🏠 DEFINITION: ${hg.description}\n\n` +
            `📋 ROSTER STATUS:\n` +
            `• Budget Exempt: ${hg.budgetExempt ? 'Yes' : 'No'}\n` +
            `• Senior Roster Exempt: ${hg.seniorRosterExempt ? 'Yes (first HG)' : 'No'}\n` +
            `• Minimum Salary: $${hg.minimumSalary.toLocaleString()}\n\n` +
            `✅ BENEFITS:\n` +
            hg.benefits.map(b => `• ${b}`).join('\n') +
            `\n\n💡 STRATEGY:\n` +
            `• Invest in academy development\n` +
            `• HG players provide cap flexibility\n` +
            `• Can be signed as DP or TAM players too`,
        },
      ],
    };
  }
);

server.tool(
  "check_roster_compliance",
  "Check Austin FC's current roster compliance status",
  {
    type: "object",
    properties: {
      team: {
        type: "string",
        description: "Team to check (currently only Austin FC supported)",
      },
    },
  },
  async ({ team = "Austin FC" }) => {
    if (!team.toLowerCase().includes("austin")) {
      return {
        content: [
          {
            type: "text",
            text: `Currently only Austin FC compliance data is available.`,
          },
        ],
      };
    }
    
    const c = austinFCCompliance;
    const capStatus = c.salaryCapStatus;
    
    return {
      content: [
        {
          type: "text",
          text: `AUSTIN FC ROSTER COMPLIANCE STATUS\n\n` +
            `📋 ROSTER SPOTS:\n` +
            `• Senior Roster: ${c.seniorRoster.current}/${c.seniorRoster.max} (${c.seniorRoster.available} available)\n` +
            `• Supplemental: ${c.supplementalRoster.current}/${c.supplementalRoster.max} (${c.supplementalRoster.available} available)\n\n` +
            `⭐ SPECIAL DESIGNATIONS:\n` +
            `• DP Slots: ${c.dpSlots.used}/${c.dpSlots.max} (${c.dpSlots.available} available)\n` +
            `  → Current: ${c.dpSlots.players.join(', ')}\n` +
            `• U22 Slots: ${c.u22Slots.used}/${c.u22Slots.max} (${c.u22Slots.available} available)\n` +
            `  → Current: ${c.u22Slots.players.join(', ')}\n` +
            `• International: ${c.internationalSlots.used}/${c.internationalSlots.max} (${c.internationalSlots.available} available)\n\n` +
            `💰 SALARY CAP STATUS:\n` +
            `• Budget: $${(capStatus.budget / 1000000).toFixed(2)}M\n` +
            `• Current Spend: $${(capStatus.currentSpend / 1000000).toFixed(2)}M\n` +
            `• Cap Space: $${(capStatus.available / 1000).toFixed(0)}K\n` +
            `• TAM Available: $${(capStatus.tamAvailable / 1000).toFixed(0)}K\n` +
            `• GAM Available: $${(capStatus.gamAvailable / 1000000).toFixed(1)}M\n\n` +
            `🏠 HOMEGROWN: ${c.homegrownPlayers.join(', ')}`,
        },
      ],
    };
  }
);

server.tool(
  "can_sign_player",
  "Check if a player can be signed given current roster constraints",
  {
    type: "object",
    properties: {
      salary: {
        type: "number",
        description: "Player's proposed salary",
      },
      isInternational: {
        type: "boolean",
        description: "Whether player needs international slot",
      },
      age: {
        type: "number",
        description: "Player's age (for U22 eligibility)",
      },
      proposedDesignation: {
        type: "string",
        enum: ["DP", "TAM", "U22", "Senior"],
        description: "Proposed roster designation",
      },
    },
    required: ["salary"],
  },
  async ({ salary, isInternational = false, age = 25, proposedDesignation = "Senior" }) => {
    const c = austinFCCompliance;
    const issues = [];
    const recommendations = [];
    let canSign = true;
    
    // Check roster spots
    if (c.seniorRoster.available === 0 && c.supplementalRoster.available === 0) {
      issues.push("❌ No roster spots available");
      canSign = false;
    }
    
    // Check international slot
    if (isInternational && c.internationalSlots.available === 0) {
      issues.push("❌ No international slots available");
      recommendations.push("→ Trade for international slot or target domestic player");
      canSign = false;
    }
    
    // Check designation-specific rules
    if (proposedDesignation === "DP") {
      if (c.dpSlots.available === 0) {
        issues.push("❌ No DP slots available");
        canSign = false;
      } else {
        recommendations.push("✅ DP slot available - $683,750 cap hit");
      }
    } else if (proposedDesignation === "U22") {
      if (age >= 22) {
        issues.push("❌ Player too old for U22 Initiative");
        canSign = false;
      } else if (c.u22Slots.available === 0) {
        issues.push("❌ No U22 slots available");
        canSign = false;
      } else if (salary > 612500) {
        issues.push("❌ Salary exceeds U22 maximum ($612,500)");
        canSign = false;
      } else {
        recommendations.push("✅ U22 eligible - $200,000 cap hit");
      }
    } else {
      // Senior or TAM player
      const maxCharge = 683750;
      const capSpace = c.salaryCapStatus.available + c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable;
      
      if (salary > maxCharge) {
        const buydownNeeded = salary - maxCharge;
        if (buydownNeeded > c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable) {
          issues.push(`❌ Cannot buy down salary - need $${(buydownNeeded / 1000).toFixed(0)}K, have $${((c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable) / 1000).toFixed(0)}K`);
          recommendations.push("→ Consider using DP slot instead");
          canSign = false;
        } else {
          recommendations.push(`✅ Can buy down with TAM/GAM - need $${(buydownNeeded / 1000).toFixed(0)}K`);
        }
      }
      
      if (salary > c.salaryCapStatus.available && salary <= maxCharge) {
        recommendations.push(`⚠️ Would need to use $${((salary - c.salaryCapStatus.available) / 1000).toFixed(0)}K GAM for cap relief`);
      }
    }
    
    return {
      content: [
        {
          type: "text",
          text: `SIGNING ANALYSIS\n\n` +
            `Player Details:\n` +
            `• Salary: $${(salary / 1000000).toFixed(2)}M\n` +
            `• International: ${isInternational ? 'Yes' : 'No'}\n` +
            `• Age: ${age}\n` +
            `• Proposed: ${proposedDesignation}\n\n` +
            `Result: ${canSign ? '✅ CAN SIGN' : '❌ CANNOT SIGN'}\n\n` +
            (issues.length > 0 ? `Issues:\n${issues.join('\n')}\n\n` : '') +
            (recommendations.length > 0 ? `Notes:\n${recommendations.join('\n')}` : ''),
        },
      ],
    };
  }
);

server.tool(
  "get_international_slot_rules",
  "Get international roster slot rules",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const intl = rosterRules.internationalSlots;
    return {
      content: [
        {
          type: "text",
          text: `INTERNATIONAL SLOT RULES\n\n` +
            `📊 BASICS:\n` +
            `• Default Slots: ${intl.defaultSlots} per team\n` +
            `• Tradeable: ${intl.canTrade ? 'Yes' : 'No'}\n` +
            `• Can Purchase: ${intl.canPurchase ? 'Yes' : 'No'}\n\n` +
            `${intl.description}\n\n` +
            `🌍 WHO NEEDS A SLOT:\n` +
            `• Foreign players without US work authorization\n` +
            `• Players without green card or citizenship\n\n` +
            `✅ EXEMPT FROM SLOTS:\n` +
            `• US Citizens\n` +
            `• Green Card holders\n` +
            `• Canadian citizens (playing for Canadian teams)\n\n` +
            `💡 STRATEGY:\n` +
            `• Trade for additional slots if needed\n` +
            `• Target players close to green card\n` +
            `• Homegrown domestic players free up slots`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Roster Rules MCP server running on stdio");
}

main().catch(console.error);

