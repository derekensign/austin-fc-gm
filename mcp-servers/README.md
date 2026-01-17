# Austin FC GM Lab - MCP Servers

This directory contains Model Context Protocol (MCP) servers that provide AI assistants with access to MLS data for GM decision-making.

## Servers

### 1. MLS Stats (`mls-stats`)
Player and team statistics for the MLS season.

**Tools:**
- `get_team_info` - Get team details (stadium, conference, colors)
- `get_standings` - Western/Eastern conference standings
- `get_player_stats` - Player statistics with filtering
- `get_top_scorers` - League top scorers
- `compare_teams` - Head-to-head team comparison

### 2. Player Valuations (`player-valuations`)
Market values, transfer data, and valuation estimates.

**Tools:**
- `get_player_valuation` - Individual player market value
- `get_team_valuations` - Full squad valuation breakdown
- `get_most_valuable_players` - League MVPs by value
- `get_recent_transfers` - Recent transfer activity
- `get_position_market_rates` - Market value ranges by position
- `estimate_player_value` - AI-assisted value estimation

### 3. Roster Rules (`roster-rules`)
MLS roster compliance, salary cap, and signing rules.

**Tools:**
- `get_salary_cap_rules` - Cap structure and limits
- `get_dp_rules` - Designated Player rules
- `get_allocation_money_rules` - TAM/GAM usage
- `get_u22_initiative_rules` - Young player mechanism
- `get_homegrown_rules` - Academy player benefits
- `check_roster_compliance` - Team compliance status
- `can_sign_player` - Signing feasibility check
- `get_international_slot_rules` - International roster rules

## Installation

```bash
# Install dependencies for all servers
cd mcp-servers/mls-stats && npm install
cd ../player-valuations && npm install
cd ../roster-rules && npm install
```

## Cursor MCP Configuration

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mls-stats": {
      "command": "node",
      "args": ["/path/to/austin-fc-gm/mcp-servers/mls-stats/src/index.js"]
    },
    "player-valuations": {
      "command": "node", 
      "args": ["/path/to/austin-fc-gm/mcp-servers/player-valuations/src/index.js"]
    },
    "roster-rules": {
      "command": "node",
      "args": ["/path/to/austin-fc-gm/mcp-servers/roster-rules/src/index.js"]
    }
  }
}
```

## Usage Examples

Once configured, you can ask the AI assistant questions like:

**Stats:**
- "Show me Austin FC's player stats sorted by goals"
- "Compare Austin FC vs LA Galaxy this season"
- "Who are the top scorers in MLS?"

**Valuations:**
- "What's Sebastián Driussi's market value?"
- "Show me Austin FC's squad value"
- "Estimate the value of a 22-year-old striker with 12 goals"

**Roster Rules:**
- "Explain the DP rules in MLS"
- "Can Austin FC sign a $2M international player?"
- "Check Austin FC's roster compliance status"
- "How much TAM and GAM does Austin FC have?"

## Development

Run servers in development mode with auto-reload:

```bash
cd mcp-servers/mls-stats && npm run dev
```

## Data Sources

Currently using sample data. In production, these servers could connect to:
- MLS official API
- Transfermarkt API
- FBref/StatsBomb data
- MLS Players Association salary data

