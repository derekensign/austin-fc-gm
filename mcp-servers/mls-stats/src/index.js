import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Sample MLS data - In production, this would come from an API
const teams = {
  "austin-fc": {
    id: "austin-fc",
    name: "Austin FC",
    conference: "Western",
    founded: 2021,
    stadium: "Q2 Stadium",
    capacity: 20738,
    colors: ["Verde (#00B140)", "Black"],
  },
  "la-galaxy": {
    id: "la-galaxy", 
    name: "LA Galaxy",
    conference: "Western",
    founded: 1996,
    stadium: "Dignity Health Sports Park",
    capacity: 27000,
    colors: ["Navy", "Gold"],
  },
  "lafc": {
    id: "lafc",
    name: "Los Angeles FC", 
    conference: "Western",
    founded: 2018,
    stadium: "BMO Stadium",
    capacity: 22000,
    colors: ["Black", "Gold"],
  },
};

const standings = {
  western: [
    { rank: 1, team: "LAFC", points: 67, wins: 21, draws: 4, losses: 9, gf: 65, ga: 38, gd: 27 },
    { rank: 2, team: "LA Galaxy", points: 58, wins: 17, draws: 7, losses: 10, gf: 62, ga: 52, gd: 10 },
    { rank: 3, team: "Real Salt Lake", points: 55, wins: 15, draws: 10, losses: 9, gf: 55, ga: 45, gd: 10 },
    { rank: 4, team: "Seattle Sounders", points: 52, wins: 14, draws: 10, losses: 10, gf: 48, ga: 42, gd: 6 },
    { rank: 5, team: "Colorado Rapids", points: 50, wins: 14, draws: 8, losses: 12, gf: 52, ga: 51, gd: 1 },
    { rank: 6, team: "Houston Dynamo", points: 49, wins: 13, draws: 10, losses: 11, gf: 50, ga: 48, gd: 2 },
    { rank: 7, team: "Minnesota United", points: 48, wins: 13, draws: 9, losses: 12, gf: 49, ga: 50, gd: -1 },
    { rank: 8, team: "Austin FC", points: 45, wins: 12, draws: 9, losses: 13, gf: 48, ga: 52, gd: -4 },
    { rank: 9, team: "Portland Timbers", points: 44, wins: 12, draws: 8, losses: 14, gf: 45, ga: 50, gd: -5 },
    { rank: 10, team: "FC Dallas", points: 42, wins: 11, draws: 9, losses: 14, gf: 40, ga: 48, gd: -8 },
    { rank: 11, team: "Vancouver Whitecaps", points: 40, wins: 10, draws: 10, losses: 14, gf: 42, ga: 52, gd: -10 },
    { rank: 12, team: "Sporting KC", points: 38, wins: 10, draws: 8, losses: 16, gf: 38, ga: 55, gd: -17 },
    { rank: 13, team: "San Jose Earthquakes", points: 32, wins: 8, draws: 8, losses: 18, gf: 35, ga: 58, gd: -23 },
  ],
  eastern: [
    { rank: 1, team: "Inter Miami", points: 74, wins: 22, draws: 8, losses: 4, gf: 72, ga: 42, gd: 30 },
    { rank: 2, team: "Columbus Crew", points: 62, wins: 18, draws: 8, losses: 8, gf: 58, ga: 40, gd: 18 },
    { rank: 3, team: "FC Cincinnati", points: 58, wins: 17, draws: 7, losses: 10, gf: 55, ga: 45, gd: 10 },
    { rank: 4, team: "Orlando City", points: 54, wins: 15, draws: 9, losses: 10, gf: 50, ga: 42, gd: 8 },
    { rank: 5, team: "Charlotte FC", points: 52, wins: 14, draws: 10, losses: 10, gf: 48, ga: 45, gd: 3 },
    { rank: 6, team: "New York Red Bulls", points: 50, wins: 14, draws: 8, losses: 12, gf: 45, ga: 42, gd: 3 },
    { rank: 7, team: "NYCFC", points: 48, wins: 13, draws: 9, losses: 12, gf: 52, ga: 50, gd: 2 },
    { rank: 8, team: "Philadelphia Union", points: 46, wins: 12, draws: 10, losses: 12, gf: 44, ga: 45, gd: -1 },
    { rank: 9, team: "Atlanta United", points: 44, wins: 12, draws: 8, losses: 14, gf: 48, ga: 52, gd: -4 },
  ],
};

const playerStats = [
  // Austin FC players
  { name: "Sebastián Driussi", team: "Austin FC", position: "CAM", goals: 14, assists: 8, minutes: 2700, appearances: 30, yellowCards: 4, redCards: 0 },
  { name: "Maxi Urruti", team: "Austin FC", position: "ST", goals: 9, assists: 4, minutes: 2070, appearances: 23, yellowCards: 3, redCards: 0 },
  { name: "Emiliano Rigoni", team: "Austin FC", position: "RM", goals: 7, assists: 6, minutes: 2160, appearances: 24, yellowCards: 5, redCards: 0 },
  { name: "Gyasi Zardes", team: "Austin FC", position: "ST", goals: 5, assists: 2, minutes: 1260, appearances: 14, yellowCards: 1, redCards: 0 },
  { name: "Owen Wolff", team: "Austin FC", position: "CM", goals: 3, assists: 5, minutes: 1890, appearances: 21, yellowCards: 2, redCards: 0 },
  { name: "Jader Obrian", team: "Austin FC", position: "LW", goals: 4, assists: 7, minutes: 1800, appearances: 20, yellowCards: 3, redCards: 0 },
  { name: "Brad Stuver", team: "Austin FC", position: "GK", goals: 0, assists: 0, minutes: 2790, appearances: 31, yellowCards: 1, redCards: 0, saves: 98, cleanSheets: 8 },
  // Top MLS scorers
  { name: "Lionel Messi", team: "Inter Miami", position: "RW", goals: 20, assists: 16, minutes: 2520, appearances: 28, yellowCards: 2, redCards: 0 },
  { name: "Christian Benteke", team: "DC United", position: "ST", goals: 18, assists: 4, minutes: 2880, appearances: 32, yellowCards: 6, redCards: 1 },
  { name: "Denis Bouanga", team: "LAFC", position: "LW", goals: 17, assists: 9, minutes: 2700, appearances: 30, yellowCards: 3, redCards: 0 },
  { name: "Cucho Hernández", team: "Columbus Crew", position: "ST", goals: 16, assists: 7, minutes: 2520, appearances: 28, yellowCards: 4, redCards: 0 },
];

// Create MCP server
const server = new McpServer({
  name: "mls-stats",
  version: "1.0.0",
});

// Register tools
server.tool(
  "get_team_info",
  "Get information about an MLS team including stadium, conference, and colors",
  {
    type: "object",
    properties: {
      teamId: {
        type: "string",
        description: "Team ID (e.g., 'austin-fc', 'la-galaxy', 'lafc')",
      },
    },
    required: ["teamId"],
  },
  async ({ teamId }) => {
    const team = teams[teamId.toLowerCase()];
    if (!team) {
      return {
        content: [
          {
            type: "text",
            text: `Team '${teamId}' not found. Available teams: ${Object.keys(teams).join(", ")}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(team, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_standings",
  "Get current MLS standings for Western or Eastern conference",
  {
    type: "object",
    properties: {
      conference: {
        type: "string",
        enum: ["western", "eastern"],
        description: "Conference to get standings for",
      },
    },
    required: ["conference"],
  },
  async ({ conference }) => {
    const conf = conference.toLowerCase();
    const data = standings[conf];
    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: `Invalid conference. Use 'western' or 'eastern'.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `${conference.toUpperCase()} CONFERENCE STANDINGS\n\n` +
            data.map(t => `${t.rank}. ${t.team} - ${t.points} pts (${t.wins}W-${t.draws}D-${t.losses}L) GD: ${t.gd > 0 ? '+' : ''}${t.gd}`).join("\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_player_stats",
  "Get statistics for players, optionally filtered by team",
  {
    type: "object",
    properties: {
      team: {
        type: "string",
        description: "Team name to filter by (optional)",
      },
      sortBy: {
        type: "string",
        enum: ["goals", "assists", "minutes", "appearances"],
        description: "Stat to sort by (default: goals)",
      },
      limit: {
        type: "number",
        description: "Number of players to return (default: 10)",
      },
    },
  },
  async ({ team, sortBy = "goals", limit = 10 }) => {
    let players = [...playerStats];
    
    if (team) {
      players = players.filter(p => p.team.toLowerCase().includes(team.toLowerCase()));
    }
    
    players.sort((a, b) => b[sortBy] - a[sortBy]);
    players = players.slice(0, limit);
    
    const header = team ? `${team.toUpperCase()} PLAYER STATS` : `TOP MLS PLAYERS BY ${sortBy.toUpperCase()}`;
    
    return {
      content: [
        {
          type: "text",
          text: `${header}\n\n` +
            players.map((p, i) => 
              `${i + 1}. ${p.name} (${p.team}) - ${p.position}\n` +
              `   Goals: ${p.goals} | Assists: ${p.assists} | Minutes: ${p.minutes} | Apps: ${p.appearances}`
            ).join("\n\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_top_scorers",
  "Get the top goal scorers in MLS",
  {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of players to return (default: 10)",
      },
    },
  },
  async ({ limit = 10 }) => {
    const scorers = [...playerStats]
      .sort((a, b) => b.goals - a.goals)
      .slice(0, limit);
    
    return {
      content: [
        {
          type: "text",
          text: `MLS TOP SCORERS\n\n` +
            scorers.map((p, i) => 
              `${i + 1}. ${p.name} (${p.team}) - ${p.goals} goals, ${p.assists} assists`
            ).join("\n"),
        },
      ],
    };
  }
);

server.tool(
  "compare_teams",
  "Compare two teams' current season statistics",
  {
    type: "object",
    properties: {
      team1: {
        type: "string",
        description: "First team name",
      },
      team2: {
        type: "string",
        description: "Second team name",
      },
    },
    required: ["team1", "team2"],
  },
  async ({ team1, team2 }) => {
    const allStandings = [...standings.western, ...standings.eastern];
    
    const t1 = allStandings.find(t => t.team.toLowerCase().includes(team1.toLowerCase()));
    const t2 = allStandings.find(t => t.team.toLowerCase().includes(team2.toLowerCase()));
    
    if (!t1 || !t2) {
      return {
        content: [
          {
            type: "text",
            text: `Could not find one or both teams. Team 1: ${t1 ? 'found' : 'not found'}, Team 2: ${t2 ? 'found' : 'not found'}`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `TEAM COMPARISON: ${t1.team} vs ${t2.team}\n\n` +
            `                    ${t1.team.padEnd(20)} ${t2.team}\n` +
            `Points:             ${String(t1.points).padEnd(20)} ${t2.points}\n` +
            `Wins:               ${String(t1.wins).padEnd(20)} ${t2.wins}\n` +
            `Draws:              ${String(t1.draws).padEnd(20)} ${t2.draws}\n` +
            `Losses:             ${String(t1.losses).padEnd(20)} ${t2.losses}\n` +
            `Goals For:          ${String(t1.gf).padEnd(20)} ${t2.gf}\n` +
            `Goals Against:      ${String(t1.ga).padEnd(20)} ${t2.ga}\n` +
            `Goal Difference:    ${(t1.gd > 0 ? '+' : '') + t1.gd.toString().padEnd(19)} ${t2.gd > 0 ? '+' : ''}${t2.gd}\n` +
            `Conference Rank:    ${String(t1.rank).padEnd(20)} ${t2.rank}`,
        },
      ],
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MLS Stats MCP server running on stdio");
}

main().catch(console.error);



