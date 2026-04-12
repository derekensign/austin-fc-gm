# Verde Manager — Austin FC GM Lab

A fan-built Austin FC roster management and analytics web app. Explore the salary cap, build lineups, analyze the MLS transfer market, and chat with an AI assistant loaded with real roster and salary data.

**Live:** [verdemanager.com](https://verdemanager.com)

## Features

- **Dashboard** — Salary cap status, roster composition, and designation breakdowns at a glance
- **Lineup Builder** — Drag-and-drop players into formations with tactical overlays; export as PNG or PDF
- **Roster** — Sortable player table with salary, contract, and cap designation details
- **MLS Market** — League-wide salary, transfer fee, and performance data by position
- **Transactions** — Austin FC's recent moves and trade history
- **MLS Rules** — Quick reference for salary cap, DP, U22, TAM/GAM, and roster construction rules
- **Transfer Sources** — Where MLS clubs are buying from (country, league, fee benchmarks)
- **AI Chat** — Ask questions about the roster, salary cap, trade scenarios, and transfer market — powered by Claude with real data injected into every conversation

## Tech Stack

- **Framework:** Next.js 16 (Turbopack) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom Austin FC theme (Verde, Obsidian)
- **State:** React Context API
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Export:** html-to-image + jsPDF
- **AI:** Anthropic Claude via Vercel AI SDK

## Getting Started

```bash
# Prerequisites: Node.js >= 20.9
nvm use          # uses .nvmrc

npm install
npm run dev      # http://localhost:3000
```

### Environment Variables

Create a `.env.local` with:

```
ANTHROPIC_API_KEY=sk-ant-...    # Required for AI chat
CHAT_MODEL_ID=claude-sonnet-4-5 # Optional — override the chat model
```

## Data Sources

| Data | Source | Updated |
|------|--------|---------|
| Player salaries | [MLSPA Salary Guide](https://mlsplayers.org/resources/salary-guide) (Oct 2025) | Jan 2026 |
| Austin FC roster | [austinfc.com/roster](https://www.austinfc.com/roster) | Mar 2026 |
| Transfer fees | [Transfermarkt](https://www.transfermarkt.us) (2020–2025) | Feb 2026 |
| Player stats | [MLSSoccer.com](https://www.mlssoccer.com/stats/) (2025 season) | Feb 2026 |

## Project Structure

```
src/
├── app/              # Next.js App Router pages + API routes
├── components/       # UI components (chat, dashboard, layout, lineup)
├── context/          # React Context (LineupContext, AllocationContext)
├── data/             # Static TypeScript data (roster, salaries, transfers, stats)
├── hooks/            # Custom hooks (useLiveData)
└── lib/              # Utilities (cache, data sources, market data processing)

data/                 # Raw JSON data files
scripts/              # Data scraping and processing scripts (Playwright, Cheerio)
mcp-servers/          # Local MCP servers for editor AI integration
```

## Deployment

Hosted on [Vercel](https://vercel.com) with automatic deployments from `main`.

```bash
npm run build   # Verify production build locally
```

## License

This is a personal fan project and is not affiliated with Austin FC, Major League Soccer, or MLS Players Association.
