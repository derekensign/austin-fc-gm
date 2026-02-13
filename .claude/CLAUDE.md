# Austin FC GM - Project Context

## Project Overview

Verde Manager - An Austin FC roster management and lineup builder application built with Next.js, React, and TypeScript.

**Live URL:** https://austinfc-gm.vercel.app

**Key Features:**
- Interactive lineup builder with drag-and-drop players
- Formation selector with tactical overlays
- Roster management with salary cap tracking
- MLS transfer market data integration
- PNG/PDF export of lineups

## Tech Stack

- **Framework:** Next.js 16.1.3 (Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom CSS variables
- **State Management:** React Context API
- **Animation:** Framer Motion
- **Export:** html-to-image, jsPDF

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── lineup/              # Lineup builder page
│   └── mls-market/          # MLS transfer market (in development)
├── components/
│   ├── layout/              # Layout components (Sidebar, etc.)
│   └── lineup/              # Lineup builder components
│       ├── SoccerField.tsx  # Soccer field with id="lineup-field"
│       ├── LineupExporter.tsx # PNG/PDF export functionality
│       ├── DraggablePlayer.tsx
│       └── FormationSelector.tsx
├── context/
│   ├── LineupContext.tsx    # Lineup state management
│   └── AllocationContext.tsx # Salary cap tracking
├── data/                     # Static data files
│   ├── austin-fc-roster.ts  # Current roster data
│   └── mls-transfers-*.json # Transfer market data
└── lib/                      # Utility functions
```

## Data Sources

### MLS Player Stats (2025 Season)

**Source:** MLSSoccer.com Stats Page
**Scraping Script:** `scripts/scrape-mls-stats-all-pages.ts`
**Last Updated:** Feb 13, 2026

- **Total Players Scraped:** 1011 players across 34 pages
- **JSON Data:** `data/mls-player-stats-2025.json` (178KB, all 1011 players)
- **TypeScript Export:** `src/data/mls-stats.ts` → `leaguePlayerStats` array (top 84 players)
- **Selection Criteria:** Top 50 goal scorers + Top 50 assist providers (deduplicated)

**Column Mapping (CORRECTED):**
- GP, GS, Mins, Sub, **G** (index 4), Pass%, **A** (index 6), Conv%, SOT, KP, **xG** (index 10), F, FS, OFF, YC, RC

**Key Stats Tracked:**
- Goals, Assists, Minutes Played, Appearances, Games Started, xG (Expected Goals)

**Important Notes:**
- Team abbreviations are mapped to full names in `generate-top-players-ts.ts`
- Initial scraping had goals/assists columns swapped - this has been corrected
- Uses Playwright with `button[aria-label="Next results"]` selector for pagination
- Includes notable players: L. Messi (29G 19A), D. Bouanga (24G 9A), S. Surridge (24G 5A)

## Known Issues & Solutions

### PNG/PDF Export Sizing

**Problem:** Exported lineup images were coming out tiny and distorted because the export function used hardcoded dimensions (2400x3200) that didn't match the actual DOM element size.

**Solution (Feb 2026):** Updated `LineupExporter.tsx` to use actual element dimensions via `getBoundingClientRect()`:

```typescript
// Get the actual element dimensions
const rect = element.getBoundingClientRect();

const dataUrl = await toPng(element, {
  quality: 1.0,
  backgroundColor: '#1a1a1a',
  pixelRatio: 4, // High resolution export (4x the screen resolution)
  width: rect.width,
  height: rect.height,
});
```

**Key takeaway:** When using `html-to-image` library, always use the actual element dimensions rather than hardcoded values to ensure correct scaling.

### Export Target Element

The export function targets the element with `id="lineup-field"` which is located in `SoccerField.tsx`. This element contains:
- Soccer field background image (`/public/soccer-field.png`)
- Tactical overlays (when enabled)
- Player positioning layer with draggable players

## Development Guidelines

### CSS Variables

The project uses CSS custom properties for theming:
- `--verde`: Austin FC green (#A4D825)
- `--obsidian`: Dark background colors
- `--obsidian-light`: Lighter dark shade
- `--obsidian-lighter`: Card borders

### Component Patterns

1. **Drag and Drop:** Uses Framer Motion's drag functionality with `dragSnapToOrigin={true}` for bench players
2. **State Management:** Context providers wrap pages that need shared state
3. **Export Functionality:** Always test exports at different viewport sizes since dimensions are derived from DOM

### Dev Server

```bash
npm run dev  # Runs on http://localhost:3000
```

**Note:** If you see a lock error, kill existing Next.js processes and remove `.next/dev/lock`

## Data Management

### Roster Data
- Located in `src/data/austin-fc-roster.ts`
- Contains player info: name, number, position, salary, etc.
- Used throughout the app for lineup building and roster management

### Transfer Data
- Multiple JSON files in `data/` directory
- Scripts in `scripts/` folder scrape transfer market data
- Integration with MLS market page (in development)

## Git Workflow

- **Main Branch:** `main`
- **Remote:** `origin`
- Standard feature branch workflow recommended

## Deployment

Hosted on Vercel with automatic deployments from main branch.

## Future Considerations

1. **MLS Market Integration:** New `/mls-market` route is in development
2. **Mobile Responsiveness:** Lineup builder works on mobile but could be optimized
3. **Player Photos:** Some players missing photos, fallback shows initials
4. **Export Formats:** Consider adding more export options (SVG, higher res PNG)

## Tips for AI Assistants

1. **Before modifying exports:** Always test with actual DOM dimensions, not assumptions
2. **State updates:** Use the Context API hooks (`useLineup()`, `useAllocation()`) for state
3. **Player data:** Check `austin-fc-roster.ts` for current roster before suggesting changes
4. **Tactical features:** Formation positions and tactical overlays are tightly coupled
5. **CSS:** Prefer Tailwind classes, but use CSS variables for theme colors

## Recent Changes

- **2026-02-13:** Added real 2025 MLS player stats (goals, assists, minutes, appearances) from MLSSoccer.com
- **2026-02-13:** Created Playwright scraper to fetch league-wide 2025 stats for MLS market feature
- **2026-02-13:** Updated `src/data/mls-stats.ts` with 30 top MLS players (2025 season data)
- **2026-02-13:** Fixed PNG/PDF export sizing issue by using actual element dimensions
- **2026-02-13:** Moved project to `/Users/derekensing/soccer-projects/` directory structure

## 2025 MLS Stats Integration

Successfully scraped and integrated 2025 MLS season stats for the MLS market feature:

**Data Source:** MLSSoccer.com stats page
**Scraper:** `scripts/scrape-mls-2025-final.ts` (Playwright-based)
**Data File:** `data/mls-player-stats-2025.json` (30 top players)
**Integration:** `src/data/mls-stats.ts` (TypeScript format)

**Stats included:**
- Goals and assists
- Games played and minutes
- Player names and teams

**Top performers (2025):**
- Messi (Inter Miami): 2G, 29A
- Bouanga (LAFC): 2G, 24A
- Musovski (Seattle): 15G, 14A

**Note:** API-Football free plan only has 2022-2024 access, so we used web scraping for 2025 data.
