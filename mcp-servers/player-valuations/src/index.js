import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Player valuations data (Transfermarkt-style)
const playerValuations = [
  // Austin FC
  { name: "Sebastián Driussi", team: "Austin FC", position: "CAM", age: 28, marketValue: 12000000, peakValue: 15000000, contract: "2027", nationality: "Argentina", foot: "Right" },
  { name: "Owen Wolff", team: "Austin FC", position: "CM", age: 19, marketValue: 3000000, peakValue: 3000000, contract: "2028", nationality: "USA", foot: "Left", isHomegrown: true },
  { name: "Guilherme Biro", team: "Austin FC", position: "LB", age: 22, marketValue: 2500000, peakValue: 2500000, contract: "2028", nationality: "Brazil", foot: "Left" },
  { name: "Emiliano Rigoni", team: "Austin FC", position: "RM", age: 31, marketValue: 4000000, peakValue: 8000000, contract: "2026", nationality: "Argentina", foot: "Left" },
  { name: "Maxi Urruti", team: "Austin FC", position: "ST", age: 33, marketValue: 1500000, peakValue: 5000000, contract: "2026", nationality: "Argentina", foot: "Right" },
  { name: "Dani Pereira", team: "Austin FC", position: "CDM", age: 26, marketValue: 2000000, peakValue: 2500000, contract: "2026", nationality: "Venezuela", foot: "Right" },
  { name: "Brad Stuver", team: "Austin FC", position: "GK", age: 34, marketValue: 800000, peakValue: 1200000, contract: "2026", nationality: "USA", foot: "Right" },
  { name: "Gyasi Zardes", team: "Austin FC", position: "ST", age: 33, marketValue: 1000000, peakValue: 4000000, contract: "2026", nationality: "USA", foot: "Right" },
  
  // High-value MLS players
  { name: "Lionel Messi", team: "Inter Miami", position: "RW", age: 37, marketValue: 35000000, peakValue: 180000000, contract: "2025", nationality: "Argentina", foot: "Left" },
  { name: "Riqui Puig", team: "LA Galaxy", position: "CM", age: 25, marketValue: 12000000, peakValue: 12000000, contract: "2027", nationality: "Spain", foot: "Right" },
  { name: "Cucho Hernández", team: "Columbus Crew", position: "ST", age: 25, marketValue: 14000000, peakValue: 14000000, contract: "2027", nationality: "Colombia", foot: "Right" },
  { name: "Denis Bouanga", team: "LAFC", position: "LW", age: 29, marketValue: 10000000, peakValue: 12000000, contract: "2026", nationality: "Gabon", foot: "Right" },
  { name: "Hany Mukhtar", team: "Nashville SC", position: "CAM", age: 29, marketValue: 8000000, peakValue: 10000000, contract: "2026", nationality: "Germany", foot: "Right" },
  { name: "Luciano Acosta", team: "FC Cincinnati", position: "CAM", age: 30, marketValue: 9000000, peakValue: 9000000, contract: "2026", nationality: "Argentina", foot: "Right" },
  
  // Young prospects
  { name: "Caden Clark", team: "RB Leipzig (loan)", position: "CM", age: 21, marketValue: 5000000, peakValue: 5000000, contract: "2026", nationality: "USA", foot: "Right" },
  { name: "Paxten Aaronson", team: "Eintracht Frankfurt", position: "CAM", age: 21, marketValue: 4000000, peakValue: 4000000, contract: "2027", nationality: "USA", foot: "Right" },
];

// Transfer history
const recentTransfers = [
  { player: "Lionel Messi", from: "PSG", to: "Inter Miami", fee: 0, type: "Free Transfer", date: "2023-07-15" },
  { player: "Lorenzo Insigne", from: "Napoli", to: "Toronto FC", fee: 0, type: "Free Transfer", date: "2022-07-01" },
  { player: "Xherdan Shaqiri", from: "Lyon", to: "Chicago Fire", fee: 7500000, type: "Transfer", date: "2022-02-01" },
  { player: "Cucho Hernández", from: "Watford", to: "Columbus Crew", fee: 10000000, type: "Transfer", date: "2022-07-07" },
  { player: "Thiago Almada", from: "Vélez Sarsfield", to: "Atlanta United", fee: 16000000, type: "Transfer", date: "2022-02-01" },
  { player: "Brenner", from: "São Paulo", to: "FC Cincinnati", fee: 13000000, type: "Transfer", date: "2021-02-12" },
  { player: "Sebastián Driussi", from: "Zenit", to: "Austin FC", fee: 7500000, type: "Transfer", date: "2021-07-22" },
];

// Position market rates
const positionMarketRates = {
  GK: { min: 200000, avg: 800000, max: 5000000 },
  CB: { min: 300000, avg: 1500000, max: 12000000 },
  LB: { min: 300000, avg: 1200000, max: 8000000 },
  RB: { min: 300000, avg: 1200000, max: 8000000 },
  CDM: { min: 400000, avg: 2000000, max: 15000000 },
  CM: { min: 500000, avg: 2500000, max: 20000000 },
  CAM: { min: 600000, avg: 4000000, max: 35000000 },
  LW: { min: 500000, avg: 3000000, max: 25000000 },
  RW: { min: 500000, avg: 3000000, max: 35000000 },
  ST: { min: 500000, avg: 3500000, max: 30000000 },
};

const server = new McpServer({
  name: "player-valuations",
  version: "1.0.0",
});

server.tool(
  "get_player_valuation",
  "Get market valuation details for a specific player",
  {
    type: "object",
    properties: {
      playerName: {
        type: "string",
        description: "Player name to look up",
      },
    },
    required: ["playerName"],
  },
  async ({ playerName }) => {
    const player = playerValuations.find(p => 
      p.name.toLowerCase().includes(playerName.toLowerCase())
    );
    
    if (!player) {
      return {
        content: [
          {
            type: "text",
            text: `Player '${playerName}' not found in database.`,
          },
        ],
      };
    }
    
    const valueChange = ((player.marketValue - player.peakValue) / player.peakValue * 100).toFixed(1);
    
    return {
      content: [
        {
          type: "text",
          text: `PLAYER VALUATION: ${player.name}\n\n` +
            `Team: ${player.team}\n` +
            `Position: ${player.position}\n` +
            `Age: ${player.age}\n` +
            `Nationality: ${player.nationality}\n` +
            `Preferred Foot: ${player.foot}\n` +
            `Contract Until: ${player.contract}\n` +
            `${player.isHomegrown ? '⭐ Homegrown Player\n' : ''}` +
            `\n💰 VALUATION:\n` +
            `Current Market Value: $${(player.marketValue / 1000000).toFixed(1)}M\n` +
            `Peak Value: $${(player.peakValue / 1000000).toFixed(1)}M\n` +
            `Value Trend: ${valueChange > 0 ? '+' : ''}${valueChange}% from peak`,
        },
      ],
    };
  }
);

server.tool(
  "get_team_valuations",
  "Get all player valuations for a specific team",
  {
    type: "object",
    properties: {
      team: {
        type: "string",
        description: "Team name",
      },
    },
    required: ["team"],
  },
  async ({ team }) => {
    const players = playerValuations
      .filter(p => p.team.toLowerCase().includes(team.toLowerCase()))
      .sort((a, b) => b.marketValue - a.marketValue);
    
    if (players.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No players found for team '${team}'.`,
          },
        ],
      };
    }
    
    const totalValue = players.reduce((sum, p) => sum + p.marketValue, 0);
    
    return {
      content: [
        {
          type: "text",
          text: `${team.toUpperCase()} SQUAD VALUATIONS\n\n` +
            `Total Squad Value: $${(totalValue / 1000000).toFixed(1)}M\n` +
            `Players: ${players.length}\n\n` +
            players.map((p, i) => 
              `${i + 1}. ${p.name} (${p.position}, ${p.age}yo)\n` +
              `   Value: $${(p.marketValue / 1000000).toFixed(1)}M | Contract: ${p.contract}`
            ).join("\n\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_most_valuable_players",
  "Get the most valuable players in MLS",
  {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of players to return (default: 10)",
      },
      position: {
        type: "string",
        description: "Filter by position (optional)",
      },
      maxAge: {
        type: "number",
        description: "Maximum age filter (optional)",
      },
    },
  },
  async ({ limit = 10, position, maxAge }) => {
    let players = [...playerValuations];
    
    if (position) {
      players = players.filter(p => p.position.toLowerCase() === position.toLowerCase());
    }
    if (maxAge) {
      players = players.filter(p => p.age <= maxAge);
    }
    
    players = players.sort((a, b) => b.marketValue - a.marketValue).slice(0, limit);
    
    const title = position 
      ? `MOST VALUABLE ${position.toUpperCase()}s IN MLS`
      : maxAge 
        ? `MOST VALUABLE PLAYERS U${maxAge}`
        : "MOST VALUABLE PLAYERS IN MLS";
    
    return {
      content: [
        {
          type: "text",
          text: `${title}\n\n` +
            players.map((p, i) => 
              `${i + 1}. ${p.name} - $${(p.marketValue / 1000000).toFixed(1)}M\n` +
              `   ${p.team} | ${p.position} | ${p.age}yo | ${p.nationality}`
            ).join("\n\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_recent_transfers",
  "Get recent MLS transfer activity",
  {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of transfers to return (default: 10)",
      },
    },
  },
  async ({ limit = 10 }) => {
    const transfers = recentTransfers.slice(0, limit);
    
    return {
      content: [
        {
          type: "text",
          text: `RECENT MLS TRANSFERS\n\n` +
            transfers.map(t => 
              `${t.player}\n` +
              `${t.from} → ${t.to}\n` +
              `Fee: ${t.fee > 0 ? '$' + (t.fee / 1000000).toFixed(1) + 'M' : t.type}\n` +
              `Date: ${t.date}`
            ).join("\n\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_position_market_rates",
  "Get typical market value ranges by position",
  {
    type: "object",
    properties: {
      position: {
        type: "string",
        description: "Position code (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST)",
      },
    },
  },
  async ({ position }) => {
    if (position) {
      const rates = positionMarketRates[position.toUpperCase()];
      if (!rates) {
        return {
          content: [
            {
              type: "text",
              text: `Position '${position}' not found. Available: ${Object.keys(positionMarketRates).join(", ")}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `${position.toUpperCase()} MARKET VALUE RANGES\n\n` +
              `Minimum: $${(rates.min / 1000000).toFixed(2)}M\n` +
              `Average: $${(rates.avg / 1000000).toFixed(2)}M\n` +
              `Maximum: $${(rates.max / 1000000).toFixed(2)}M`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `MLS POSITION MARKET VALUE RANGES\n\n` +
            Object.entries(positionMarketRates)
              .map(([pos, rates]) => 
                `${pos}: $${(rates.min / 1000000).toFixed(1)}M - $${(rates.max / 1000000).toFixed(1)}M (avg: $${(rates.avg / 1000000).toFixed(1)}M)`
              ).join("\n"),
        },
      ],
    };
  }
);

server.tool(
  "estimate_player_value",
  "Estimate a player's market value based on attributes",
  {
    type: "object",
    properties: {
      position: {
        type: "string",
        description: "Player position",
      },
      age: {
        type: "number",
        description: "Player age",
      },
      goals: {
        type: "number",
        description: "Goals scored this season",
      },
      assists: {
        type: "number",
        description: "Assists this season",
      },
      minutesPlayed: {
        type: "number",
        description: "Minutes played this season",
      },
      isInternational: {
        type: "boolean",
        description: "Has international caps",
      },
    },
    required: ["position", "age"],
  },
  async ({ position, age, goals = 0, assists = 0, minutesPlayed = 0, isInternational = false }) => {
    const baseRates = positionMarketRates[position.toUpperCase()] || positionMarketRates.CM;
    let value = baseRates.avg;
    
    // Age factor
    if (age < 23) value *= 1.3;
    else if (age < 27) value *= 1.1;
    else if (age > 30) value *= 0.7;
    else if (age > 33) value *= 0.4;
    
    // Performance factor
    const goalValue = goals * 200000;
    const assistValue = assists * 100000;
    value += goalValue + assistValue;
    
    // Playing time factor
    if (minutesPlayed > 2000) value *= 1.15;
    else if (minutesPlayed < 500) value *= 0.7;
    
    // International factor
    if (isInternational) value *= 1.2;
    
    value = Math.round(value / 100000) * 100000; // Round to nearest 100k
    
    return {
      content: [
        {
          type: "text",
          text: `ESTIMATED MARKET VALUE\n\n` +
            `Position: ${position}\n` +
            `Age: ${age}\n` +
            `Stats: ${goals}G, ${assists}A, ${minutesPlayed} mins\n` +
            `International: ${isInternational ? 'Yes' : 'No'}\n\n` +
            `💰 Estimated Value: $${(value / 1000000).toFixed(1)}M\n` +
            `Range: $${(value * 0.7 / 1000000).toFixed(1)}M - $${(value * 1.3 / 1000000).toFixed(1)}M`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Player Valuations MCP server running on stdio");
}

main().catch(console.error);



