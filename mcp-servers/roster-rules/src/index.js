import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// MLS 2026 Roster Rules (Updated with comprehensive CBA provisions)
const rosterRules = {
  salaryCap: {
    2025: {
      salaryBudget: 5_950_000,
      maxBudgetCharge: 743_750,
      seniorMinimum: 104_000,
      reserveMinimum: 80_622,
    },
    2026: {
      salaryBudget: 6_425_000,
      maxBudgetCharge: 803_125,
      seniorMinimum: 113_400,
      reserveMinimum: 88_025,
    },
    maxSeniorRoster: 20,
    maxSupplementalRoster: 10,
    totalRosterLimit: 30,
  },
  
  designatedPlayers: {
    maxSlots: 3,
    budgetCharge2026: 803_125,
    description: "DPs count against cap at max budget charge regardless of actual salary",
    youngDPRules: {
      maxAge: 23,
      reducedCharge: 200_000,
      description: "Players 23 or younger when signed get reduced cap hit",
    },
    buyoutsPerYear: 2,
  },
  
  allocationMoney: {
    TAM: {
      name: "Targeted Allocation Money",
      annual2025: 2_225_000,
      annual2026: 2_125_000,
      canBuyDown: true,
      tradeable: false,
      description: "Used to buy down player salaries to max budget charge or below",
    },
    GAM: {
      name: "General Allocation Money",
      annual2025: 2_930_000,
      annual2026: 3_280_000,
      canTrade: true,
      canBuyDown: true,
      rollsOver: true, // As of Jan 2025
      description: "Flexible allocation money for roster building and salary cap relief",
    },
  },
  
  u22Initiative: {
    maxSlots: 3,
    maxSlotsModelB: 4,
    budgetCharge: 200_000,
    maxSalary: 612_500,
    maxAgeAtSigning: 22,
    maxAgeToRemain: 25,
    transferFeeExempt: true, // Critical! Transfer fees don't add to cap for U22
    description: "Young player mechanism to develop talent at reduced cap hit",
  },
  
  homegrownPlayers: {
    description: "Players signed from club's academy",
    budgetExempt: false,
    seniorRosterExempt: true,
    minimumSalary: 88_025, // Reserve min 2026
    offRosterMaxAge: 21,
    offRosterMaxMatches: 6,
    benefits: [
      "Do not count against senior roster limit (supplemental)",
      "No international slot required",
      "Extended U22 Initiative eligibility",
      "15% bonus GAM when sold abroad",
    ],
  },
  
  internationalSlots: {
    defaultSlots: 8,
    canTrade: true,
    canPurchase: true,
    description: "Required for non-domestic players without green card/citizenship",
  },
  
  loanRules: {
    intraMLS: {
      maxPlayersAtOnce: 4,
      minDuration: 14, // days
      loanFeeBuydown: "100% with GAM",
    },
    toAffiliate: {
      limit: "Unlimited",
      noLoanFee: true,
    },
    international: {
      windowRequired: true,
      fifaRules: true,
    },
    description: "MLS allows both intra-league and international loans",
  },
  
  contractBuyouts: {
    maxPerYear: 2,
    includesDPs: true,
    capRelief: "Immediate",
    description: "Can buy out up to 2 guaranteed contracts per year (2025+ rule)",
  },
  
  transferFees: {
    amortized: true,
    formula: "Annual charge = Base Salary + (Transfer Fee ÷ Contract Years)",
    exemptions: {
      DP: "Budget charge capped at max regardless of fee",
      U22: "Budget charge fixed at $200K regardless of fee",
    },
    nonExempt: "Fee adds to budget charge for regular senior players",
  },
  
  rosterModels: {
    modelA: { name: "DP Model", dpSlots: 3, u22Slots: 3, bonusGAM: 0 },
    modelB: { name: "U22 Model", dpSlots: 2, u22Slots: 4, bonusGAM: 2_000_000 },
    switchWindow: "July 1 - August 21",
  },
  
  freeAgency: {
    minAge: 24,
    minServiceYears: 4, // Down from 5 in 2026
    cbaReference: "Article 29.4",
  },
};

// Austin FC current roster compliance status (January 2026)
const austinFCCompliance = {
  year: 2026,
  seniorRoster: {
    current: 18,
    max: 20,
    available: 2,
    players: [
      "Brad Stuver", "Mikkel Desler", "Brendan Hines-Ike", "Oleksandr Svatok",
      "Jon Gallagher", "Žan Kolmanič", "Guilherme Biro", "Ilie Sánchez",
      "Dani Pereira", "Besard Sabovic", "Robert Taylor", "Jáder Obrian",
      "Brandon Vazquez", "Myrto Uzuni", "Jayden Nelson", "Jon Bell",
      "Joseph Rosales", "Nicolás Dubersarsky"
    ],
  },
  supplementalRoster: {
    current: 7,
    max: 10,
    available: 3,
    players: [
      "Damian Las", "Riley Thomas", "Micah Burton", "CJ Fodrey",
      "Ervin Torres", "Mateja Djordjević", "Owen Wolff"
    ],
  },
  dpSlots: {
    used: 2,
    max: 3,
    players: ["Brandon Vazquez", "Myrto Uzuni"],
    available: 1,
    note: "Bukari sold to Widzew Łódź Dec 2025 - freed DP slot",
  },
  u22Slots: {
    used: 3,
    max: 3,
    players: ["Nicolás Dubersarsky", "Mateja Djordjević", "Owen Wolff"],
    available: 0,
    note: "All U22 slots currently filled",
  },
  internationalSlots: {
    used: 6,
    max: 8,
    available: 2,
    players: [
      "Myrto Uzuni", "Besard Sabovic", "Oleksandr Svatok", 
      "Jáder Obrian", "Guilherme Biro", "Jayden Nelson"
    ],
    note: "Dubersarsky and Djordjević use U22 intl slots",
  },
  salaryCapStatus: {
    budget: 6_425_000,
    totalBudgetCharge: 8_310_672,
    budgetChargeAfterMechanisms: 5_804_547, // After DP/U22 reductions
    capSpaceRemaining: 620_453,
    tamAvailable: 2_125_000,
    gamAvailable: 2_674_636, // $3.28M annual - $700K Rosales - $700K Nelson (2026) + rollover
    gamRolledOver: 44_636, // As of Sept 2025
    note: "Low rolled-over GAM due to 2025 spending",
  },
  homegrownPlayers: ["Damian Las", "Micah Burton", "Ervin Torres"],
  generationAdidas: ["CJ Fodrey"],
  
  // Recent transactions affecting compliance
  recentTransactions: [
    { type: "Sale", player: "Osman Bukari", to: "Widzew Łódź", gamGenerated: 1_900_000 },
    { type: "Trade", player: "Jayden Nelson", from: "Vancouver", gamSpent: 1_250_000 },
    { type: "Trade", player: "Joseph Rosales", from: "Minnesota", gamSpent: 700_000, cashPaid: 1_500_000 },
    { type: "Trade", player: "Jon Bell", from: "Seattle", gamSpent: 0 },
  ],
  
  // Contract buyouts available
  buyoutsRemaining: 2,
  cashTransfersRemaining: 1, // Used 1 for Rosales ($1.5M cash)
};

const server = new McpServer({
  name: "roster-rules",
  version: "1.0.0",
});

server.tool(
  "get_salary_cap_rules",
  "Get MLS salary cap rules and limits for a specific year",
  {
    type: "object",
    properties: {
      year: {
        type: "number",
        enum: [2025, 2026],
        description: "The MLS season year (default: 2026)",
      },
    },
  },
  async ({ year = 2026 }) => {
    const cap = rosterRules.salaryCap[year] || rosterRules.salaryCap[2026];
    const alloc = rosterRules.allocationMoney;
    
    return {
      content: [
        {
          type: "text",
          text: `MLS ${year} SALARY CAP RULES\n\n` +
            `💰 SALARY BUDGET: $${(cap.salaryBudget / 1_000_000).toFixed(2)}M\n\n` +
            `📋 ROSTER LIMITS:\n` +
            `• Senior Roster: ${rosterRules.salaryCap.maxSeniorRoster} players max (slots 1-20)\n` +
            `• Supplemental Roster: ${rosterRules.salaryCap.maxSupplementalRoster} players max (slots 21-30)\n` +
            `• Total Roster: ${rosterRules.salaryCap.totalRosterLimit} players max\n\n` +
            `💵 BUDGET CHARGES:\n` +
            `• Senior Minimum: $${cap.seniorMinimum.toLocaleString()}\n` +
            `• Reserve Minimum: $${cap.reserveMinimum.toLocaleString()}\n` +
            `• Maximum: $${cap.maxBudgetCharge.toLocaleString()}\n\n` +
            `💰 ALLOCATION MONEY:\n` +
            `• TAM: $${(alloc.TAM[`annual${year}`] / 1_000_000).toFixed(2)}M (NOT tradeable)\n` +
            `• GAM: $${(alloc.GAM[`annual${year}`] / 1_000_000).toFixed(2)}M (tradeable, rolls over)\n\n` +
            `⚠️ Players earning above $${cap.maxBudgetCharge.toLocaleString()} must be:\n` +
            `• Designated Player (DP) - counts at $${cap.maxBudgetCharge.toLocaleString()}\n` +
            `• Bought down with TAM/GAM\n` +
            `• U22 Initiative player - counts at $200,000\n\n` +
            `📝 TRANSFER FEES:\n` +
            `• Amortized over contract years for non-exempt players\n` +
            `• DPs and U22s are EXEMPT from transfer fee cap charges`,
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
            `• Canadian citizens (playing for Canadian teams)\n` +
            `• Homegrown International Rule qualifiers\n\n` +
            `💡 STRATEGY:\n` +
            `• Trade for additional slots if needed\n` +
            `• Target players close to green card\n` +
            `• Homegrown domestic players free up slots`,
        },
      ],
    };
  }
);

// NEW TOOLS FOR COMPREHENSIVE CBA COVERAGE

server.tool(
  "get_loan_rules",
  "Get detailed MLS loan rules (intra-MLS, affiliate, international)",
  {
    type: "object",
    properties: {
      loanType: {
        type: "string",
        enum: ["intraMLS", "affiliate", "international", "all"],
        description: "Type of loan to get rules for",
      },
    },
  },
  async ({ loanType = "all" }) => {
    const loans = rosterRules.loanRules;
    let text = "MLS LOAN RULES\n\n";
    
    if (loanType === "intraMLS" || loanType === "all") {
      text += `📋 INTRA-MLS LOANS (Between MLS Clubs)\n` +
        `• Max Players at Once: ${loans.intraMLS.maxPlayersAtOnce}\n` +
        `• Minimum Duration: ${loans.intraMLS.minDuration} days\n` +
        `• Loan Fee Buydown: ${loans.intraMLS.loanFeeBuydown}\n` +
        `• Salary can be split between clubs\n` +
        `• International slot required at receiving club\n\n`;
    }
    
    if (loanType === "affiliate" || loanType === "all") {
      text += `🏟️ LOANS TO AFFILIATES (USL/MLS NEXT Pro)\n` +
        `• Limit: ${loans.toAffiliate.limit}\n` +
        `• No Loan Fee: ${loans.toAffiliate.noLoanFee ? 'Yes' : 'No'}\n` +
        `• Purpose: Development and playing time\n` +
        `• MLS club pays salary (usually)\n` +
        `• Can recall player anytime (24-48 hrs notice)\n\n`;
    }
    
    if (loanType === "international" || loanType === "all") {
      text += `🌍 INTERNATIONAL LOANS\n` +
        `• Transfer Window Required: ${loans.international.windowRequired ? 'Yes' : 'No'}\n` +
        `• FIFA Rules Apply: ${loans.international.fifaRules ? 'Yes' : 'No'}\n` +
        `• Can include option/obligation to buy\n` +
        `• Loan fees amortized and count against cap\n` +
        `• 100% of loan fee can be bought down with GAM\n`;
    }
    
    return { content: [{ type: "text", text }] };
  }
);

server.tool(
  "get_contract_buyout_rules",
  "Get rules for buying out player contracts (2025+ rule)",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const buyout = rosterRules.contractBuyouts;
    return {
      content: [
        {
          type: "text",
          text: `CONTRACT BUYOUT RULES (2025+)\n\n` +
            `📝 OVERVIEW:\n` +
            `• Max Buyouts Per Year: ${buyout.maxPerYear}\n` +
            `• Includes DP Contracts: ${buyout.includesDPs ? 'Yes' : 'No'}\n` +
            `• Cap Relief: ${buyout.capRelief}\n\n` +
            `💰 BUYOUT CALCULATION:\n` +
            `• Cost = Remaining guaranteed compensation\n` +
            `• Includes: Base salary, guaranteed bonuses, allowances\n` +
            `• Excludes: Performance bonuses (unearned), option years\n\n` +
            `✅ BENEFITS:\n` +
            `• Immediate cap relief - player no longer counts\n` +
            `• DP slot freed immediately\n` +
            `• Roster spot opens up\n\n` +
            `⚠️ CONSIDERATIONS:\n` +
            `• Club pays buyout amount out of pocket\n` +
            `• Any GAM/TAM spent on player is "lost"\n` +
            `• Player can sign elsewhere immediately\n\n` +
            `🎯 BEST USED FOR:\n` +
            `• High-salary underperformers\n` +
            `• Players wanting to leave\n` +
            `• Freeing DP slot for better signing`,
        },
      ],
    };
  }
);

server.tool(
  "get_draft_rules",
  "Get rules for MLS drafts (SuperDraft, Re-Entry, Expansion)",
  {
    type: "object",
    properties: {
      draftType: {
        type: "string",
        enum: ["superdraft", "reentry", "expansion"],
        description: "Type of draft to get rules for",
      },
    },
    required: ["draftType"],
  },
  async ({ draftType }) => {
    let text = "";
    
    if (draftType === "superdraft") {
      text = `MLS SUPERDRAFT RULES\n\n` +
        `📅 TIMING: January (before preseason)\n` +
        `📋 ROUNDS: 2 (reduced from 4)\n\n` +
        `✅ ELIGIBLE PLAYERS:\n` +
        `• College players (must register)\n` +
        `• International players (not under contract)\n` +
        `• NOT: Homegrowns, Generation adidas, current MLS\n\n` +
        `📊 DRAFT ORDER:\n` +
        `• Based on previous season standings\n` +
        `• Worst record picks first\n` +
        `• Playoff teams draft last\n\n` +
        `💰 TRADING PICKS:\n` +
        `• Can trade for GAM, players, intl slots\n` +
        `• Example: Austin traded 1st round pick for $250K GAM\n\n` +
        `👶 GENERATION ADIDAS:\n` +
        `• Top prospects signed by MLS before draft\n` +
        `• Don't count against senior roster\n` +
        `• Reduced/waived budget charge (2-4 years)`;
    } else if (draftType === "reentry") {
      text = `RE-ENTRY DRAFT RULES\n\n` +
        `📅 TIMING: Within 12 days after MLS Cup\n` +
        `📋 FORMAT: Two stages over consecutive days\n\n` +
        `✅ ELIGIBLE PLAYERS:\n` +
        `• Out of contract (option declined/expired)\n` +
        `• NOT eligible for Free Agency\n\n` +
        `📊 STAGE 1 - Original Club Rights:\n` +
        `• Original club has first right to re-sign\n` +
        `• Must offer at least prior year salary\n` +
        `• 24 hours to decide\n\n` +
        `📊 STAGE 2 - Open Selection:\n` +
        `• All clubs can select\n` +
        `• Inverse standings order (worst first)\n` +
        `• 7 day negotiation window\n\n` +
        `⚠️ IF NOT SIGNED:\n` +
        `• Player becomes unattached\n` +
        `• Can sign anywhere (MLS or abroad)`;
    } else if (draftType === "expansion") {
      text = `EXPANSION DRAFT RULES\n\n` +
        `📅 TIMING: After MLS Cup, before SuperDraft\n` +
        `📋 OCCURS: When new teams join MLS\n` +
        `📊 RECENT: San Diego (2025), St. Louis (2023)\n\n` +
        `🛡️ PROTECTIONS:\n` +
        `• Each club protects 12 players\n` +
        `• Automatically protected: Homegrowns, GA, SEI\n` +
        `• Submitted 24-48 hours before draft\n\n` +
        `📋 SELECTION RULES:\n` +
        `• Expansion team selects ~5 players\n` +
        `• Max 1 player from each existing club\n` +
        `• Expansion assumes existing contract\n\n` +
        `💰 COMPENSATION:\n` +
        `• $50K GAM per player selected\n` +
        `• May include future draft picks\n\n` +
        `🟢 AUSTIN FC EXPANSION (2020):\n` +
        `• Selected 5 players\n` +
        `• Most didn't make long-term impact`;
    }
    
    return { content: [{ type: "text", text }] };
  }
);

server.tool(
  "get_injury_rules",
  "Get Season-Ending Injury List and Extreme Hardship rules",
  {
    type: "object",
    properties: {},
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: `INJURY LIST & EXTREME HARDSHIP RULES\n\n` +
            `🏥 SEASON-ENDING INJURY LIST (SEI)\n\n` +
            `Definition: Player expected to miss rest of MLS season\n` +
            `• Minimum Games Out: 6 MLS league games\n` +
            `• League Approval: Required (verify injury)\n\n` +
            `📋 ROSTER RELIEF:\n` +
            `• ✅ Roster Spot Freed: Yes - can sign replacement\n` +
            `• ❌ Cap Relief: NO - salary still counts!\n` +
            `• Player cannot return until following season\n\n` +
            `⚠️ EXTREME HARDSHIP (CBA Article 19.8)\n\n` +
            `Definition: Multiple significant injuries to key players\n\n` +
            `📝 APPLICATION:\n` +
            `• Club must apply to MLS League Office\n` +
            `• Submit medical reports for all injured players\n` +
            `• Demonstrate roster impact\n\n` +
            `💰 POSSIBLE RELIEF:\n` +
            `• Additional GAM from league\n` +
            `• Temporary budget relief on injured player charges\n` +
            `• Additional roster spots\n` +
            `• Amount determined case-by-case\n\n` +
            `⚠️ LIMITATIONS:\n` +
            `• Not guaranteed - discretionary\n` +
            `• Only for injuries, not roster mismanagement\n` +
            `• Must demonstrate genuine need`,
        },
      ],
    };
  }
);

server.tool(
  "analyze_signing",
  "Analyze a potential player signing for cap implications",
  {
    type: "object",
    properties: {
      playerName: {
        type: "string",
        description: "Name of the player",
      },
      salary: {
        type: "number",
        description: "Player's proposed annual salary",
      },
      transferFee: {
        type: "number",
        description: "Transfer fee (if any)",
      },
      contractYears: {
        type: "number",
        description: "Guaranteed contract years",
      },
      age: {
        type: "number",
        description: "Player's age",
      },
      isInternational: {
        type: "boolean",
        description: "Whether player needs international slot",
      },
      proposedDesignation: {
        type: "string",
        enum: ["DP", "U22", "TAM", "Senior"],
        description: "Proposed roster designation",
      },
    },
    required: ["salary", "age"],
  },
  async ({ playerName = "Player", salary, transferFee = 0, contractYears = 3, age, isInternational = false, proposedDesignation = "Senior" }) => {
    const c = austinFCCompliance;
    const rules = rosterRules.salaryCap[2026];
    const issues = [];
    const recommendations = [];
    
    // Calculate amortized transfer fee
    const amortizedFee = transferFee > 0 ? transferFee / contractYears : 0;
    const rawBudgetCharge = salary + amortizedFee;
    
    let finalCharge = rawBudgetCharge;
    let optimalDesignation = proposedDesignation;
    
    // Analyze U22 eligibility
    const u22Eligible = age <= 22 && salary <= rosterRules.u22Initiative.maxSalary;
    const u22Available = c.u22Slots.available > 0;
    
    // Analyze DP eligibility
    const youngDPEligible = age <= 23;
    const dpAvailable = c.dpSlots.available > 0;
    
    // Analyze TAM needs
    const needsTAMBuydown = rawBudgetCharge > rules.maxBudgetCharge;
    const tamBuydownNeeded = needsTAMBuydown ? rawBudgetCharge - rules.maxBudgetCharge : 0;
    
    // Check international slot
    if (isInternational && c.internationalSlots.available === 0) {
      issues.push("❌ No international slots available");
      recommendations.push("→ Trade for intl slot or target domestic player");
    }
    
    // Determine optimal designation
    if (u22Eligible && u22Available) {
      finalCharge = rosterRules.u22Initiative.budgetCharge;
      optimalDesignation = "U22";
      recommendations.push(`✨ BEST OPTION: U22 designation - only $200K cap hit!`);
      recommendations.push(`   Transfer fee ($${(amortizedFee / 1000).toFixed(0)}K/yr) is EXEMPT from cap`);
    } else if (rawBudgetCharge <= rules.maxBudgetCharge) {
      finalCharge = rawBudgetCharge;
      optimalDesignation = "Senior";
      recommendations.push(`✅ Fits as senior roster player under max charge`);
    } else if (youngDPEligible && dpAvailable) {
      finalCharge = rosterRules.designatedPlayers.youngDPRules.reducedCharge;
      optimalDesignation = "YoungDP";
      recommendations.push(`⭐ Young DP available - $200K cap hit`);
    } else if (dpAvailable) {
      finalCharge = rules.maxBudgetCharge;
      optimalDesignation = "DP";
      recommendations.push(`⭐ DP slot available - $${(rules.maxBudgetCharge / 1000).toFixed(0)}K cap hit`);
    } else if (tamBuydownNeeded <= c.salaryCapStatus.tamAvailable + c.salaryCapStatus.gamAvailable) {
      finalCharge = rules.maxBudgetCharge;
      optimalDesignation = "TAM";
      recommendations.push(`💰 TAM buydown required: $${(tamBuydownNeeded / 1000).toFixed(0)}K`);
    } else {
      issues.push(`❌ Cannot fit player - no DP slot and insufficient TAM/GAM`);
    }
    
    // Check cap space
    const newTotalCharge = c.salaryCapStatus.budgetChargeAfterMechanisms + finalCharge;
    const capSpaceAfter = rules.salaryBudget - newTotalCharge;
    if (capSpaceAfter < 0) {
      issues.push(`❌ Would exceed salary budget by $${(Math.abs(capSpaceAfter) / 1000).toFixed(0)}K`);
    } else {
      recommendations.push(`📊 Cap space after signing: $${(capSpaceAfter / 1000).toFixed(0)}K`);
    }
    
    const canSign = issues.length === 0;
    
    return {
      content: [
        {
          type: "text",
          text: `SIGNING ANALYSIS: ${playerName}\n\n` +
            `📋 PLAYER DETAILS:\n` +
            `• Salary: $${(salary / 1_000_000).toFixed(2)}M\n` +
            `• Transfer Fee: $${(transferFee / 1_000_000).toFixed(2)}M\n` +
            `• Amortized Fee: $${(amortizedFee / 1000).toFixed(0)}K/year\n` +
            `• Age: ${age}\n` +
            `• International: ${isInternational ? 'Yes' : 'No'}\n\n` +
            `📊 CAP CALCULATION:\n` +
            `• Raw Budget Charge: $${(rawBudgetCharge / 1000).toFixed(0)}K\n` +
            `• Optimal Designation: ${optimalDesignation}\n` +
            `• Final Cap Hit: $${(finalCharge / 1000).toFixed(0)}K\n\n` +
            `${canSign ? '✅ CAN SIGN' : '❌ CANNOT SIGN'}\n\n` +
            (issues.length > 0 ? `⚠️ ISSUES:\n${issues.join('\n')}\n\n` : '') +
            `💡 RECOMMENDATIONS:\n${recommendations.join('\n')}`,
        },
      ],
    };
  }
);

server.tool(
  "calculate_sale_gam",
  "Calculate GAM generated from selling a player abroad",
  {
    type: "object",
    properties: {
      grossFee: {
        type: "number",
        description: "Gross transfer fee in USD",
      },
      isHomegrown: {
        type: "boolean",
        description: "Whether player was a homegrown",
      },
      playerAge: {
        type: "number",
        description: "Player age at time of sale",
      },
    },
    required: ["grossFee"],
  },
  async ({ grossFee, isHomegrown = false, playerAge = 25 }) => {
    // Calculate net revenue (after MLS and agent fees)
    const mlsFee = grossFee * 0.05;
    const agentFee = grossFee * 0.10;
    const netRevenue = grossFee - mlsFee - agentFee;
    
    // Calculate GAM using tiers
    let baseGAM = 0;
    let remaining = netRevenue;
    const breakdown = [];
    
    // Tier 1: First $1M at 50%
    const tier1 = Math.min(remaining, 1_000_000);
    baseGAM += tier1 * 0.50;
    remaining -= tier1;
    if (tier1 > 0) breakdown.push(`First $1M: $${(tier1 * 0.50 / 1000).toFixed(0)}K (50%)`);
    
    // Tier 2: $1M-$3M at 40%
    const tier2 = Math.min(remaining, 2_000_000);
    baseGAM += tier2 * 0.40;
    remaining -= tier2;
    if (tier2 > 0) breakdown.push(`$1M-$3M: $${(tier2 * 0.40 / 1000).toFixed(0)}K (40%)`);
    
    // Tier 3: $3M+ at 25%
    if (remaining > 0) {
      baseGAM += remaining * 0.25;
      breakdown.push(`$3M+: $${(remaining * 0.25 / 1000).toFixed(0)}K (25%)`);
    }
    
    // Calculate bonuses
    const homegrownBonus = isHomegrown ? baseGAM * 0.15 : 0;
    const youngBonus = playerAge < 23 ? baseGAM * 0.10 : 0;
    
    // Apply $3M cap
    const totalGAM = Math.min(baseGAM + homegrownBonus + youngBonus, 3_000_000);
    const wasCapped = (baseGAM + homegrownBonus + youngBonus) > 3_000_000;
    
    return {
      content: [
        {
          type: "text",
          text: `GAM FROM PLAYER SALE\n\n` +
            `💰 TRANSFER DETAILS:\n` +
            `• Gross Fee: $${(grossFee / 1_000_000).toFixed(2)}M\n` +
            `• MLS Admin Fee (5%): -$${(mlsFee / 1000).toFixed(0)}K\n` +
            `• Agent Fee (10%): -$${(agentFee / 1000).toFixed(0)}K\n` +
            `• Net Revenue: $${(netRevenue / 1_000_000).toFixed(2)}M\n\n` +
            `📊 GAM CALCULATION:\n` +
            `${breakdown.join('\n')}\n` +
            `= Base GAM: $${(baseGAM / 1000).toFixed(0)}K\n` +
            (isHomegrown ? `+ Homegrown Bonus (15%): +$${(homegrownBonus / 1000).toFixed(0)}K\n` : '') +
            (playerAge < 23 ? `+ Young Player Bonus (10%): +$${(youngBonus / 1000).toFixed(0)}K\n` : '') +
            (wasCapped ? `⚠️ CAPPED at $3,000,000\n` : '') +
            `\n💵 TOTAL GAM: $${(totalGAM / 1_000_000).toFixed(2)}M`,
        },
      ],
    };
  }
);

server.tool(
  "get_roster_model_rules",
  "Get rules for MLS Roster Construction Models (DP vs U22 Model)",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const models = rosterRules.rosterModels;
    return {
      content: [
        {
          type: "text",
          text: `MLS ROSTER CONSTRUCTION MODELS (2025+)\n\n` +
            `Clubs must choose ONE model at start of each season.\n\n` +
            `🅰️ MODEL A: ${models.modelA.name}\n` +
            `• DP Slots: ${models.modelA.dpSlots}\n` +
            `• U22 Slots: ${models.modelA.u22Slots}\n` +
            `• Bonus GAM: $${(models.modelA.bonusGAM / 1_000_000).toFixed(0)}M\n` +
            `Best For: Maximum star power, marquee signings\n\n` +
            `🅱️ MODEL B: ${models.modelB.name}\n` +
            `• DP Slots: ${models.modelB.dpSlots}\n` +
            `• U22 Slots: ${models.modelB.u22Slots}\n` +
            `• Bonus GAM: $${(models.modelB.bonusGAM / 1_000_000).toFixed(1)}M\n` +
            `Best For: Youth development, roster flexibility\n\n` +
            `📅 KEY DATES:\n` +
            `• Declaration: Roster Compliance Date (late Feb)\n` +
            `• Mid-Season Switch Window: ${models.switchWindow}\n\n` +
            `⚠️ SWITCH RULES:\n` +
            `• DP→U22: Must have ≤2 DPs, can only invest ≤$1M extra GAM\n` +
            `• U22→DP: Must have used ≤$1M extra GAM, ≤3 U22 players`,
        },
      ],
    };
  }
);

server.tool(
  "get_free_agency_rules",
  "Get MLS Free Agency eligibility rules",
  {
    type: "object",
    properties: {},
  },
  async () => {
    const fa = rosterRules.freeAgency;
    return {
      content: [
        {
          type: "text",
          text: `MLS FREE AGENCY RULES (CBA ${fa.cbaReference})\n\n` +
            `📋 ELIGIBILITY REQUIREMENTS:\n` +
            `• Minimum Age: ${fa.minAge} years old\n` +
            `• Minimum MLS Service: ${fa.minServiceYears} years\n` +
            `• Out of contract (option declined/expired)\n\n` +
            `📝 2026 CHANGES:\n` +
            `• Service requirement dropped from 5 to 4 years\n` +
            `• More players now qualify for unrestricted FA\n\n` +
            `💰 COMPENSATION RULES:\n` +
            `• Under Max Charge: Initial salary of $25K above max OR 20% above prior (whichever greater)\n` +
            `• Above Max Charge: 20% above prior up to $500K above max, then 15%\n\n` +
            `📋 CONTRACT TERMS ALLOWED:\n` +
            `• 1 year + 1-2 options\n` +
            `• 2 years + 1-2 options\n` +
            `• 3 years + 1-2 options\n` +
            `• 2 years no options (if player is 30+)\n\n` +
            `⚠️ FOR CLUBS LOSING PLAYERS:\n` +
            `• $50K compensatory allocation per net player loss\n` +
            `• Must have made bona fide offer (≥105% prior salary)\n\n` +
            `📅 NOT FA ELIGIBLE → RE-ENTRY DRAFT:\n` +
            `Players who don't meet FA requirements enter Re-Entry Draft`,
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



