'use client';

import { Fragment, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Filter,
  ArrowUpDown,
  Trophy,
  Calendar,
  Building2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  ALL_TRANSFERS,
  ALL_DEPARTURES,
  type TransferRecord,
  type DepartureRecord,
  getMLSTeams,
} from '@/data/mls-transfers-all';

// Same display fixer as transfer-sources page — the underlying scrape strips some 's' chars.
function fixDisplay(str: string): string {
  if (!str) return str;
  let result = str
    .replace(/Cri tian/gi, 'Cristian')
    .replace(/Ro  i\b/gi, 'Rossi')
    .replace(/Ro i\b/gi, 'Rossi')
    .replace(/Aco ta/gi, 'Acosta')
    .replace(/Co ta\b/gi, 'Costa')
    .replace(/Da Co ta/gi, 'Da Costa')
    .replace(/Ca tellano /gi, 'Castellanos')
    .replace(/Bu quet /gi, 'Busquets')
    .replace(/Me  i\b/gi, 'Messi')
    .replace(/Pa alić/gi, 'Pašalić')
    .replace(/Pa alic/gi, 'Pasalic')
    .replace(/Driu  i/gi, 'Driussi')
    .replace(/Driu i/gi, 'Driussi')
    .replace(/Au tin FC/gi, 'Austin FC')
    .replace(/Au tin\b/gi, 'Austin')
    .replace(/Lo  Angele /gi, 'Los Angeles')
    .replace(/Minne ota/gi, 'Minnesota')
    .replace(/Na hville/gi, 'Nashville')
    .replace(/Kan a  City/gi, 'Kansas City')
    .replace(/Kan a /gi, 'Kansas')
    .replace(/Sounder /gi, 'Sounders')
    .replace(/Whitecap /gi, 'Whitecaps')
    .replace(/Rapid /gi, 'Rapids')
    .replace(/Timber /gi, 'Timbers')
    .replace(/Hou ton/gi, 'Houston')
    .replace(/Columbu /gi, 'Columbus')
    .replace(/St\. Loui /gi, 'St. Louis')
    .replace(/FC Dalla\b/gi, 'FC Dallas')
    ;
  result = result.replace(/ {2,}/g, ' ').trim();
  return result;
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

// Map each name variant in the dataset to a single canonical bucket so totals
// aren't split between e.g. "Atlanta United" and "Atlanta United FC".
const CANONICAL_OVERRIDES: Record<string, string> = {
  'Atlanta United FC': 'Atlanta United',
  'Chicago Fire': 'Chicago Fire FC',
  'Columbus Crew SC': 'Columbus Crew',
  'Houston Dynamo': 'Houston Dynamo FC',
  'Los Angeles Galaxy': 'LA Galaxy',
  'Montreal Impact': 'CF Montréal',
  'Real Salt Lake City': 'Real Salt Lake',
  'Seattle Sounders': 'Seattle Sounders FC',
  // Transfermarkt's per-club departure pages list the Red Bulls in
  // German-style ordering. Fold to the arrivals naming convention.
  'Red Bull New York': 'New York Red Bulls',
};

function canonicalTeam(team: string): string {
  return CANONICAL_OVERRIDES[team] || team;
}

type SortKey = 'totalSpend' | 'outgoingSpend' | 'netSpend' | 'transfers' | 'outgoingCount' | 'avgFee' | 'topFee';
type SortDirection = 'asc' | 'desc';

type BarRow = {
  name: string;
  rawTeam: string;
  spend: number;
  outgoingSpend: number;
  netSpend: number;
  transfers: number;
  outgoingCount: number;
  avgFee: number;
  topFee: number;
};

const SORT_KEY_TO_BAR: Record<SortKey, keyof BarRow> = {
  totalSpend: 'spend',
  outgoingSpend: 'outgoingSpend',
  netSpend: 'netSpend',
  transfers: 'transfers',
  outgoingCount: 'outgoingCount',
  avgFee: 'avgFee',
  topFee: 'topFee',
};

const SORT_KEY_LABEL: Record<SortKey, string> = {
  totalSpend: 'Incoming Spend ($M)',
  outgoingSpend: 'Outgoing Spend ($M)',
  netSpend: 'Net Spend ($M)',
  transfers: '# Incoming Transfers',
  outgoingCount: '# Outgoing Sales',
  avgFee: 'Avg Paid Fee ($M)',
  topFee: 'Top Single Fee ($M)',
};

function barDataKey(k: SortKey): keyof BarRow { return SORT_KEY_TO_BAR[k]; }
function barLabel(k: SortKey): string { return SORT_KEY_LABEL[k]; }

const VERDE = '#00b140';

// Primary brand color per MLS club. Keys are normalized: lowercased, with
// suffixes like "FC", "SC", "CF" stripped so we can match the various forms
// that appear in the data ("Atlanta United" vs "Atlanta United FC", etc.).
const TEAM_COLOR_MAP: Record<string, string> = {
  'atlanta united': '#80000A',
  'austin': '#00B140',
  'charlotte': '#1A85C8',
  'chicago fire': '#0E2348',
  'colorado rapids': '#960A2C',
  'columbus crew': '#FFEF00',
  'd.c. united': '#000000',
  'dc united': '#000000',
  'fc cincinnati': '#FE5000',
  'cincinnati': '#FE5000',
  'fc dallas': '#BF0D3E',
  'dallas': '#BF0D3E',
  'houston dynamo': '#F36600',
  'inter miami': '#F7B5CD',
  'la galaxy': '#00245D',
  'los angeles galaxy': '#00245D',
  'lafc': '#000000',
  'los angeles': '#C39E6D',
  'minnesota united': '#8CD2F4',
  'cf montréal': '#0033A0',
  'montreal impact': '#0033A0',
  'nashville': '#FFC72C',
  'new england revolution': '#0A2240',
  'new york city': '#6CADDE',
  'new york red bulls': '#ED1C24',
  'orlando city': '#612E8A',
  'philadelphia union': '#003049',
  'portland timbers': '#00482B',
  'real salt lake': '#A50531',
  'real salt lake city': '#A50531',
  'san diego': '#00214E',
  'san jose earthquakes': '#0051BA',
  'seattle sounders': '#5D9741',
  'sporting kansas city': '#93B1D7',
  'st. louis city': '#C8102E',
  'toronto': '#A6192E',
  'vancouver whitecaps': '#00245E',
};

// Fallback palette for any team without a brand color mapped.
const FALLBACK_COLORS = [
  '#00b140', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#10b981', '#ec4899', '#06b6d4', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#eab308', '#22d3ee', '#f43f5e',
];

function normalizeTeamKey(team: string): string {
  return team
    .toLowerCase()
    .replace(/\s+(fc|sc|cf)\b/g, '')
    .replace(/^(fc|cf|sc)\s+/g, match => match.toLowerCase().startsWith('fc ') ? match.toLowerCase() : '')
    .trim();
}

function getTeamColor(team: string, fallbackIdx: number): string {
  const key = normalizeTeamKey(team);
  // Try exact normalized match first, then loosen by stripping common prefixes.
  if (TEAM_COLOR_MAP[key]) return TEAM_COLOR_MAP[key];
  const looser = key.replace(/^(fc|cf|sc)\s+/, '');
  if (TEAM_COLOR_MAP[looser]) return TEAM_COLOR_MAP[looser];
  return FALLBACK_COLORS[fallbackIdx % FALLBACK_COLORS.length];
}

// Normalize a player name to a dedupe key. Uses the last whitespace-separated
// token, lowercased and ascii-folded, so "Sebastián Driussi" and "S. Driussi"
// collapse to the same bucket. Same-last-name distinct players moving to the
// same MLS team across this date range is rare enough to accept as residual noise.
function lastNameKey(playerName: string): string {
  const last = playerName.trim().split(/\s+/).pop() || playerName;
  return last
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Two-pass dedupe:
//   1. Within a single (team, year), the same player can appear twice — usually
//      a loan + permanent pair. Keep the highest-fee row.
//   2. Across years, the same player joining the same team (loan-then-buy, e.g.
//      Driussi 2021 loan + 2022 permanent) double-counts spend. Keep only the
//      highest-fee row across all years for each (team, lastName).
function dedupeArrivals(rows: TransferRecord[]): TransferRecord[] {
  const withinYear = new Map<string, TransferRecord>();
  for (const row of rows) {
    const key = `${row.mlsTeam}|${lastNameKey(row.playerName)}|${row.year}`;
    const existing = withinYear.get(key);
    if (!existing || row.fee > existing.fee) withinYear.set(key, row);
  }

  const acrossYears = new Map<string, TransferRecord>();
  for (const row of withinYear.values()) {
    const key = `${row.mlsTeam}|${lastNameKey(row.playerName)}`;
    const existing = acrossYears.get(key);
    if (!existing) {
      acrossYears.set(key, row);
      continue;
    }
    // Prefer the higher-fee row. Tiebreak: prefer the more recent permanent
    // transfer over a free loan.
    if (
      row.fee > existing.fee ||
      (row.fee === existing.fee && row.transferType === 'permanent' && existing.transferType !== 'permanent')
    ) {
      acrossYears.set(key, row);
    }
  }

  return Array.from(acrossYears.values());
}

const INCOMING_TRANSFERS: TransferRecord[] = dedupeArrivals(
  ALL_TRANSFERS
    .filter(t => t.direction === 'arrival')
    .map(t => ({ ...t, mlsTeam: canonicalTeam(t.mlsTeam) }))
);

// List of canonical MLS team names, derived from the dataset and collapsed
// via the canonical override map.
const CANONICAL_TEAMS = Array.from(new Set(getMLSTeams().map(canonicalTeam))).sort();

// Outgoing transfers: paid sales scraped directly from Transfermarkt's
// per-club Departures tables. We keep only fee > 0 (true cash sales) and
// dedupe loan→permanent pairs the same way we dedupe arrivals.
const OUTGOING_TRANSFERS: DepartureRecord[] = (() => {
  const paid = ALL_DEPARTURES
    .filter(d => d.fee > 0)
    .map(d => ({ ...d, mlsTeam: canonicalTeam(d.mlsTeam) }));

  // Dedupe per (mlsTeam, lastName, year) — same rationale as the incoming
  // dedupe: a loan + permanent pair across rows shouldn't double-count.
  const byKey = new Map<string, DepartureRecord>();
  for (const row of paid) {
    const k = `${row.mlsTeam}|${lastNameKey(row.playerName)}|${row.year}`;
    const existing = byKey.get(k);
    if (!existing || row.fee > existing.fee) byKey.set(k, row);
  }
  // Also collapse cross-year same-player-same-team (loan one year, perm next).
  const acrossYears = new Map<string, DepartureRecord>();
  for (const row of byKey.values()) {
    const k = `${row.mlsTeam}|${lastNameKey(row.playerName)}`;
    const existing = acrossYears.get(k);
    if (!existing || row.fee > existing.fee) acrossYears.set(k, row);
  }
  return Array.from(acrossYears.values());
})();

type ClubAgg = {
  mlsTeam: string;
  transfers: number;
  totalSpend: number;
  paidCount: number;
  topFee: number;
  topPlayer: string;
  avgFee: number;
  outgoingSpend: number;
  outgoingCount: number;
  netSpend: number;
  rows: TransferRecord[];
  outgoingRows: DepartureRecord[];
};

export default function ClubSpendingPage() {
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set(YEARS));
  const [sortKey, setSortKey] = useState<SortKey>('totalSpend');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showTop, setShowTop] = useState<number>(15);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return amount > 0 ? `$${amount.toLocaleString()}` : '-';
  };

  // Sorted, deduped list of selected years for stable display + iteration.
  const selectedYearList = useMemo(
    () => Array.from(selectedYears).sort((a, b) => a - b),
    [selectedYears]
  );
  const isSingleYear = selectedYearList.length === 1;

  const toggleYear = (y: number) => {
    setSelectedYears(prev => {
      const next = new Set(prev);
      if (next.has(y)) {
        // Don't let the user deselect the last remaining year.
        if (next.size > 1) next.delete(y);
      } else {
        next.add(y);
      }
      return next;
    });
  };

  const rangeTransfers = useMemo(
    () => INCOMING_TRANSFERS.filter(t => selectedYears.has(t.year)),
    [selectedYears]
  );

  const rangeOutgoing = useMemo(
    () => OUTGOING_TRANSFERS.filter(t => selectedYears.has(t.year)),
    [selectedYears]
  );

  const clubData = useMemo<ClubAgg[]>(() => {
    const baseAgg = (team: string): ClubAgg => ({
      mlsTeam: team,
      transfers: 0,
      totalSpend: 0,
      paidCount: 0,
      topFee: 0,
      topPlayer: '',
      avgFee: 0,
      outgoingSpend: 0,
      outgoingCount: 0,
      netSpend: 0,
      rows: [],
      outgoingRows: [],
    });
    const map = new Map<string, ClubAgg>();

    rangeTransfers.forEach(t => {
      const existing = map.get(t.mlsTeam) || baseAgg(t.mlsTeam);
      existing.transfers++;
      existing.totalSpend += t.fee;
      if (t.fee > 0) existing.paidCount++;
      if (t.fee > existing.topFee) {
        existing.topFee = t.fee;
        existing.topPlayer = t.playerName;
      }
      existing.rows.push(t);
      map.set(t.mlsTeam, existing);
    });

    rangeOutgoing.forEach(t => {
      const existing = map.get(t.mlsTeam) || baseAgg(t.mlsTeam);
      existing.outgoingSpend += t.fee;
      existing.outgoingCount++;
      existing.outgoingRows.push(t);
      map.set(t.mlsTeam, existing);
    });

    // Ensure every canonical MLS team appears even with zero transfers in the window.
    CANONICAL_TEAMS.forEach(team => {
      if (!map.has(team)) map.set(team, baseAgg(team));
    });

    return Array.from(map.values())
      .map(d => ({
        ...d,
        avgFee: d.paidCount > 0 ? d.totalSpend / d.paidCount : 0,
        // Accounting convention: income − spend. Negative = net spender (red),
        // positive = net seller (green).
        netSpend: d.outgoingSpend - d.totalSpend,
        rows: d.rows.sort((a, b) => b.fee - a.fee || b.year - a.year),
        outgoingRows: d.outgoingRows.sort((a, b) => b.fee - a.fee || b.year - a.year),
      }))
      .sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? -1 : 1;
        return (a[sortKey] - b[sortKey]) * multiplier;
      });
  }, [rangeTransfers, rangeOutgoing, sortKey, sortDirection]);

  const visibleClubs = useMemo(() => clubData.slice(0, showTop), [clubData, showTop]);

  // Lookup by team for the chart tooltip
  const clubByTeam = useMemo(() => {
    const map = new Map<string, ClubAgg>();
    clubData.forEach(c => map.set(c.mlsTeam, c));
    return map;
  }, [clubData]);

  const summaryStats = useMemo(() => {
    const totalSpend = rangeTransfers.reduce((sum, t) => sum + t.fee, 0);
    const totalOutgoing = rangeOutgoing.reduce((sum, t) => sum + t.fee, 0);
    const paidCount = rangeTransfers.filter(t => t.fee > 0).length;
    const topClub = [...clubData].sort((a, b) => b.totalSpend - a.totalSpend)[0];

    return {
      totalSpend,
      totalOutgoing,
      totalTransfers: rangeTransfers.length,
      paidCount,
      avgFee: paidCount > 0 ? totalSpend / paidCount : 0,
      topClub: topClub?.mlsTeam || '',
      topClubSpend: topClub?.totalSpend || 0,
    };
  }, [rangeTransfers, rangeOutgoing, clubData]);

  const yearlyByClub = useMemo(() => {
    if (isSingleYear) return [];
    const seriesClubs = visibleClubs.slice(0, 8).map(c => c.mlsTeam);
    return selectedYearList.map(year => {
      const row: Record<string, number | string> = { year: year.toString() };
      seriesClubs.forEach(team => {
        const teamSpend = INCOMING_TRANSFERS
          .filter(t => t.mlsTeam === team && t.year === year)
          .reduce((sum, t) => sum + t.fee, 0);
        row[team] = teamSpend / 1_000_000;
      });
      return row;
    });
  }, [visibleClubs, isSingleYear, selectedYearList]);

  const yearlySeriesClubs = useMemo(
    () => visibleClubs.slice(0, 8).map(c => c.mlsTeam),
    [visibleClubs]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const toggleExpanded = (team: string) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  };

  const barChartData: BarRow[] = visibleClubs.map(c => ({
    name: fixDisplay(c.mlsTeam),
    rawTeam: c.mlsTeam,
    spend: c.totalSpend / 1_000_000,
    outgoingSpend: c.outgoingSpend / 1_000_000,
    netSpend: c.netSpend / 1_000_000,
    transfers: c.transfers,
    outgoingCount: c.outgoingCount,
    avgFee: c.avgFee / 1_000_000,
    topFee: c.topFee / 1_000_000,
  }));

  const rangeLabel = useMemo(() => {
    if (selectedYearList.length === 0) return '';
    if (selectedYearList.length === 1) return String(selectedYearList[0]);
    if (selectedYearList.length === YEARS.length) return `${YEARS[0]}–${YEARS[YEARS.length - 1]}`;
    // Detect contiguous range
    const min = selectedYearList[0];
    const max = selectedYearList[selectedYearList.length - 1];
    const isContiguous = max - min + 1 === selectedYearList.length;
    return isContiguous ? `${min}–${max}` : selectedYearList.join(', ');
  }, [selectedYearList]);

  // Custom tooltip — shows team aggregate + top 5 signings
  type TooltipPayload = {
    payload?: { rawTeam?: string };
  };
  const ClubTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (!active || !payload || !payload.length) return null;
    const team = payload[0]?.payload?.rawTeam;
    if (!team) return null;
    const club = clubByTeam.get(team);
    if (!club) return null;

    // Pick which list of transfers to show based on the active sort:
    //  - Outgoing / # Out → top 5 sales
    //  - Net Spend → mix the highest fees from both sides, tagged in/out
    //  - default (incoming, transfers, avg, top fee) → top 5 signings
    type Item = { kind: 'in' | 'out'; year: number; playerName: string; position: string; fee: number; counterparty: string };
    const inItems: Item[] = club.rows.map(r => ({
      kind: 'in', year: r.year, playerName: r.playerName, position: r.position, fee: r.fee, counterparty: r.sourceClub,
    }));
    const outItems: Item[] = club.outgoingRows.map(r => ({
      kind: 'out', year: r.year, playerName: r.playerName, position: r.position, fee: r.fee, counterparty: r.destinationClub,
    }));

    let listLabel: string;
    let items: Item[];
    let totalCount: number;
    if (sortKey === 'outgoingSpend' || sortKey === 'outgoingCount') {
      items = [...outItems].sort((a, b) => b.fee - a.fee).slice(0, 5);
      totalCount = club.outgoingCount;
      listLabel = totalCount > 5 ? `Top 5 sales of ${totalCount}` : 'Sales';
    } else if (sortKey === 'netSpend') {
      // Combine and rank by raw fee — gives the biggest single moves either direction.
      items = [...inItems, ...outItems].sort((a, b) => b.fee - a.fee).slice(0, 5);
      totalCount = inItems.length + outItems.length;
      listLabel = totalCount > 5 ? `Top 5 moves of ${totalCount}` : 'Moves';
    } else {
      items = [...inItems].sort((a, b) => b.fee - a.fee).slice(0, 5);
      totalCount = club.transfers;
      listLabel = totalCount > 5 ? `Top 5 signings of ${totalCount}` : 'Signings';
    }

    // Accounting: negative = net spender (red), positive = net seller (green).
    const netColor =
      club.netSpend < 0 ? 'text-rose-400' :
      club.netSpend > 0 ? 'text-emerald-400' :
      'text-white';

    return (
      <div className="bg-[var(--obsidian)] border border-[var(--verde)] rounded-lg p-3 shadow-xl max-w-sm">
        <p className="font-bold text-white mb-1">🏟️ {fixDisplay(team)}</p>
        <p className="text-xs text-white/60 mb-2">{rangeLabel}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
          <span className={sortKey === 'totalSpend' ? 'text-[var(--verde)]' : 'text-white/60'}>Incoming Spend</span>
          <span className="text-[var(--verde)] font-semibold text-right">{formatCurrency(club.totalSpend)}</span>
          <span className={sortKey === 'outgoingSpend' ? 'text-[var(--verde)]' : 'text-white/60'}>Outgoing (paid sales)</span>
          <span className="text-white font-semibold text-right">{club.outgoingSpend > 0 ? formatCurrency(club.outgoingSpend) : '-'}</span>
          <span className={sortKey === 'netSpend' ? 'text-[var(--verde)]' : 'text-white/60'}>Net Spend</span>
          <span className={`font-semibold text-right ${netColor}`}>
            {club.netSpend === 0 ? '-' : `${club.netSpend > 0 ? '+' : '-'}${formatCurrency(Math.abs(club.netSpend))}`}
          </span>
          <span className="text-white/60">Transfers (in / out)</span>
          <span className="text-white font-semibold text-right">{club.transfers} / {club.outgoingCount}</span>
        </div>
        {items.length > 0 && (
          <>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{listLabel}</p>
            <ul className="space-y-1">
              {items.map((t, i) => (
                <li key={i} className="text-xs flex items-center justify-between gap-3">
                  <span className="text-white/85 truncate">
                    <span className="text-white/40 mr-1">{t.year}</span>
                    <span className={`mr-1 text-[10px] uppercase tracking-wider ${t.kind === 'in' ? 'text-[var(--verde)]/80' : 'text-rose-400/80'}`}>
                      {t.kind === 'in' ? '←' : '→'}
                    </span>
                    {fixDisplay(t.playerName)}
                    {t.counterparty && <span className="text-white/40 ml-1">{t.kind === 'in' ? 'from' : 'to'} {fixDisplay(t.counterparty)}</span>}
                  </span>
                  <span className={`whitespace-nowrap font-semibold ${t.kind === 'in' ? 'text-[var(--verde)]' : 'text-rose-400'}`}>
                    {t.fee > 0 ? formatCurrency(t.fee) : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--obsidian)] via-[var(--obsidian-light)] to-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-[var(--verde)]" />
            <h1 className="text-xl sm:text-3xl font-display font-bold text-white">
              MLS Club Transfer Spend
            </h1>
          </div>
          <p className="text-xs sm:text-base text-white/60">
            Rank MLS clubs by incoming + outgoing transfer fees — pick a season or multi-year window
          </p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-1">
            Source:{' '}
            <a
              href="https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--verde)] hover:underline"
            >
              Transfermarkt
            </a>
            . Fees in USD. Loan + permanent duplicates collapsed.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--verde)]" />
              <span className="text-xs sm:text-sm font-medium text-white">Years:</span>
            </div>
            <Calendar className="h-4 w-4 text-white/60 hidden sm:inline" />
            <div className="flex flex-wrap gap-1.5">
              {YEARS.map(y => {
                const active = selectedYears.has(y);
                return (
                  <button
                    key={`year-${y}`}
                    onClick={() => toggleYear(y)}
                    className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${
                      active
                        ? 'bg-[var(--verde)] text-black'
                        : 'bg-[var(--obsidian)] text-white/60 hover:text-white border border-[var(--verde)]/20'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
              <button
                onClick={() => setSelectedYears(new Set(YEARS))}
                className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${
                  selectedYears.size === YEARS.length
                    ? 'bg-[var(--verde)]/20 text-[var(--verde)] border border-[var(--verde)]/40'
                    : 'bg-[var(--obsidian)] text-white/50 hover:text-white border border-[var(--verde)]/20'
                }`}
              >
                All
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <span className="text-xs sm:text-sm text-white/60">Top:</span>
              <select
                value={showTop}
                onChange={(e) => setShowTop(Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-[var(--verde)]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={999}>All</option>
              </select>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-white/40">
            Tap any year to toggle. Selected: <span className="text-white/70">{rangeLabel}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-1 sm:mb-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Incoming</span>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white">{formatCurrency(summaryStats.totalSpend)}</p>
            <p className="text-[10px] sm:text-xs text-white/50">{summaryStats.paidCount} paid · {rangeLabel}</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-1 sm:mb-2">
              <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Outgoing</span>
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white">{formatCurrency(summaryStats.totalOutgoing)}</p>
            <p className="text-[10px] sm:text-xs text-white/50">paid sales</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-1 sm:mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">League Net</span>
            </div>
            {(() => {
              const net = summaryStats.totalOutgoing - summaryStats.totalSpend;
              return (
                <>
                  <p className={`text-xl sm:text-3xl font-bold ${
                    net < 0 ? 'text-rose-400' : net > 0 ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {net > 0 ? '+' : net < 0 ? '−' : ''}
                    {formatCurrency(Math.abs(net))}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/50">income − spend</p>
                </>
              );
            })()}
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-1 sm:mb-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Top Spender</span>
            </div>
            <p className="text-sm sm:text-xl font-bold text-white truncate">{fixDisplay(summaryStats.topClub) || '-'}</p>
            <p className="text-[10px] sm:text-xs text-white/50">{formatCurrency(summaryStats.topClubSpend)}</p>
          </div>
        </div>

        <p className="text-[10px] sm:text-xs text-white/40 mb-4 -mt-2">
          Outgoing = paid sales only (free transfers, end-of-loan moves, and intra-MLS trades without fees are excluded).
        </p>

        {/* Sort Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs sm:text-sm text-white/60 py-2">Rank by:</span>
          {(
            [
              ['totalSpend', 'Incoming'],
              ['outgoingSpend', 'Outgoing'],
              ['netSpend', 'Net Spend'],
              ['transfers', '# Transfers'],
              ['avgFee', 'Avg Fee'],
              ['topFee', 'Top Fee'],
            ] as Array<[SortKey, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
                sortKey === key
                  ? 'bg-[var(--verde)] text-black'
                  : 'bg-[var(--obsidian-light)] text-white/70 hover:text-white border border-[var(--verde)]/30'
              }`}
            >
              {label}
              {sortKey === key && <ArrowUpDown className="h-3 w-3" />}
            </button>
          ))}
        </div>

        {/* Bar Chart - Club Ranking */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
            Club Ranking — {rangeLabel}
            <span className="block sm:inline text-xs sm:text-sm font-normal text-white/50 sm:ml-2">
              ({barLabel(sortKey)})
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-white/40 mb-3 sm:mb-4">
            Tap a bar for team breakdown · tap a row below to expand all transfers
          </p>
          <div
            style={{
              // ~32px per bar + ~80px for axes/padding. Floor at 320px so tiny
              // selections don't collapse.
              height: `${Math.max(320, barChartData.length * 32 + 80)}px`,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ left: 6, right: 16, top: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  type="number"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  tickFormatter={(value) =>
                    sortKey === 'transfers' ? value.toString() : `$${value.toFixed(0)}M`
                  }
                  label={{
                    value: barLabel(sortKey),
                    position: 'bottom',
                    offset: 10,
                    style: { fill: 'var(--verde)', fontSize: 11, fontWeight: 600 },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  width={110}
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.85)' }}
                />
                <Tooltip content={<ClubTooltip />} cursor={{ fill: 'rgba(0, 177, 64, 0.08)' }} />
                <Bar dataKey={barDataKey(sortKey)} radius={[0, 4, 4, 0]}>
                  {barChartData.map((d, index) => (
                    <Cell key={`cell-${index}`} fill={getTeamColor(d.rawTeam, index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-year per-club trend (only when range spans 2+ seasons) */}
        {!isSingleYear && yearlySeriesClubs.length > 0 && (
          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-3 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Year-by-Year Spend — Top {yearlySeriesClubs.length} Clubs
            </h2>
            <p className="text-[11px] sm:text-xs text-white/50 mb-3 sm:mb-4">
              One line per club. Top clubs determined by current ranking ({rangeLabel}).
            </p>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyByClub} margin={{ top: 10, right: 16, left: 4, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="year"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}M`}
                    width={48}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                    content={(props) => {
                      const { active, payload, label } = props as unknown as {
                        active?: boolean;
                        label?: string;
                        payload?: Array<{ name?: string; value?: number; color?: string }>;
                      };
                      if (!active || !payload || !payload.length) return null;
                      // Sort by spend descending so the biggest spender is on top.
                      const sorted = [...payload]
                        .filter(p => typeof p.value === 'number')
                        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
                      return (
                        <div className="bg-[var(--obsidian)] border border-[var(--verde)] rounded-lg p-3 shadow-xl">
                          <p className="font-bold text-white mb-2">📅 Season {label}</p>
                          <ul className="space-y-1">
                            {sorted.map((p, i) => (
                              <li key={i} className="text-xs flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2">
                                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
                                  <span style={{ color: p.color }}>{fixDisplay(String(p.name ?? ''))}</span>
                                </span>
                                <span className="font-semibold text-white whitespace-nowrap">
                                  ${(p.value ?? 0).toFixed(2)}M
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                        {fixDisplay(value)}
                      </span>
                    )}
                  />
                  {yearlySeriesClubs.map((team, idx) => {
                    const color = getTeamColor(team, idx);
                    return (
                      <Line
                        key={team}
                        type="monotone"
                        dataKey={team}
                        stroke={color}
                        strokeWidth={2}
                        dot={{ r: 4, fill: color }}
                        activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detail — desktop table, mobile cards */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 overflow-hidden mb-8">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--verde)]/20">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Club Spend Detail — {rangeLabel}
              <span className="block sm:inline text-xs sm:text-sm font-normal text-white/50 sm:ml-2">
                ({clubData.filter(c => c.transfers > 0 || c.outgoingCount > 0).length} clubs with activity)
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-white/50 mt-1">Tap any row to expand transfers in / out.</p>
          </div>

          {/* Mobile card list (below md) */}
          <div className="md:hidden divide-y divide-[var(--obsidian-lighter)]">
            {clubData.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/50 text-sm">No clubs in the selected range</div>
            ) : (
              clubData.map((row, index) => {
                const isExpanded = expandedTeams.has(row.mlsTeam);
                const canExpand = row.rows.length > 0 || row.outgoingRows.length > 0;
                const accent = getTeamColor(row.mlsTeam, index);
                const netSign = row.netSpend > 0 ? '+' : row.netSpend < 0 ? '−' : '';
                const netColor =
                  row.netSpend < 0 ? 'text-rose-400' :
                  row.netSpend > 0 ? 'text-emerald-400' :
                  'text-white/60';
                return (
                  <div key={row.mlsTeam}>
                    <button
                      onClick={() => canExpand && toggleExpanded(row.mlsTeam)}
                      className={`w-full text-left px-4 py-3 ${canExpand ? 'active:bg-[var(--obsidian)]' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block w-1.5 h-10 rounded-full flex-shrink-0"
                          style={{ background: accent }}
                        />
                        <span className="text-xs text-white/40 font-mono w-6">{index + 1}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-white truncate">{fixDisplay(row.mlsTeam)}</span>
                          {row.topPlayer && (
                            <span className="block text-[11px] text-white/40 truncate">
                              top: {fixDisplay(row.topPlayer)} {row.topFee > 0 && `· ${formatCurrency(row.topFee)}`}
                            </span>
                          )}
                        </span>
                        {canExpand && (
                          isExpanded
                            ? <ChevronDown className="h-4 w-4 text-white/40 flex-shrink-0" />
                            : <ChevronRight className="h-4 w-4 text-white/40 flex-shrink-0" />
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 pl-7 text-[11px]">
                        <div>
                          <div className="text-white/40">In</div>
                          <div className={`font-semibold ${sortKey === 'totalSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                            {row.totalSpend > 0 ? formatCurrency(row.totalSpend) : '-'}
                          </div>
                          <div className="text-white/30">{row.transfers} transfers</div>
                        </div>
                        <div>
                          <div className="text-white/40">Out</div>
                          <div className={`font-semibold ${sortKey === 'outgoingSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                            {row.outgoingSpend > 0 ? formatCurrency(row.outgoingSpend) : '-'}
                          </div>
                          <div className="text-white/30">{row.outgoingCount} sales</div>
                        </div>
                        <div>
                          <div className="text-white/40">Net</div>
                          <div className={`font-semibold ${netColor}`}>
                            {row.netSpend === 0 ? '-' : `${netSign}${formatCurrency(Math.abs(row.netSpend))}`}
                          </div>
                          <div className="text-white/30">income − spend</div>
                        </div>
                      </div>
                    </button>
                    {isExpanded && canExpand && (
                      <div className="bg-[var(--obsidian)] px-4 py-3 space-y-3">
                        {row.rows.length > 0 && (
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Incoming</p>
                            <ul className="space-y-1.5">
                              {row.rows.map((t, i) => (
                                <li key={`in-${i}`} className="text-xs flex items-center justify-between gap-2">
                                  <span className="text-white/85 truncate">
                                    <span className="text-white/40 mr-1">{t.year}</span>
                                    {fixDisplay(t.playerName)}
                                    <span className="text-white/40 ml-1">← {fixDisplay(t.sourceClub)}</span>
                                  </span>
                                  <span className={`whitespace-nowrap font-semibold ${t.fee > 0 ? 'text-[var(--verde)]' : 'text-white/40'}`}>
                                    {t.fee > 0 ? formatCurrency(t.fee) : 'Free'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {row.outgoingRows.length > 0 && (
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Outgoing (paid sales)</p>
                            <ul className="space-y-1.5">
                              {row.outgoingRows.map((t, i) => (
                                <li key={`out-${i}`} className="text-xs flex items-center justify-between gap-2">
                                  <span className="text-white/85 truncate">
                                    <span className="text-white/40 mr-1">{t.year}</span>
                                    {fixDisplay(t.playerName)}
                                    <span className="text-white/40 ml-1">→ {fixDisplay(t.destinationClub)}{t.destinationCountry ? ` (${t.destinationCountry})` : ''}</span>
                                  </span>
                                  <span className="whitespace-nowrap font-semibold text-rose-400">
                                    {formatCurrency(t.fee)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--obsidian)]">
                  <th className="px-3 py-3 w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Club</th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('totalSpend')}
                  >
                    Incoming {sortKey === 'totalSpend' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('outgoingSpend')}
                  >
                    Outgoing {sortKey === 'outgoingSpend' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('netSpend')}
                  >
                    Net {sortKey === 'netSpend' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('transfers')}
                  >
                    # In {sortKey === 'transfers' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('outgoingCount')}
                  >
                    # Out {sortKey === 'outgoingCount' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('topFee')}
                  >
                    Top Fee {sortKey === 'topFee' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Top Signing
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--obsidian-lighter)]">
                {clubData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-white/50">
                      No clubs in the selected range
                    </td>
                  </tr>
                ) : (
                  clubData.map((row, index) => {
                    const isExpanded = expandedTeams.has(row.mlsTeam);
                    const canExpand = row.rows.length > 0 || row.outgoingRows.length > 0;
                    const netSign = row.netSpend > 0 ? '+' : row.netSpend < 0 ? '−' : '';
                    const netColor =
                      row.netSpend > 0 ? 'text-emerald-400' :
                      row.netSpend < 0 ? 'text-rose-400' :
                      'text-white/40';
                    return (
                      <Fragment key={row.mlsTeam}>
                        <tr
                          className={`transition-colors ${canExpand ? 'cursor-pointer hover:bg-[var(--obsidian)]' : ''}`}
                          onClick={() => canExpand && toggleExpanded(row.mlsTeam)}
                        >
                          <td className="px-3 py-3 text-white/40">
                            {canExpand && (
                              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white/50">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-1 h-5 rounded-full flex-shrink-0"
                                style={{ background: getTeamColor(row.mlsTeam, index) }}
                              />
                              <span className="text-sm font-medium text-white">{fixDisplay(row.mlsTeam)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${sortKey === 'totalSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                              {row.totalSpend > 0 ? formatCurrency(row.totalSpend) : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${sortKey === 'outgoingSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                              {row.outgoingSpend > 0 ? formatCurrency(row.outgoingSpend) : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${netColor}`}>
                              {row.netSpend === 0 ? '-' : `${netSign}${formatCurrency(Math.abs(row.netSpend))}`}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${sortKey === 'transfers' ? 'text-[var(--verde)]' : 'text-white'}`}>
                              {row.transfers}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${sortKey === 'outgoingCount' ? 'text-[var(--verde)]' : 'text-white'}`}>
                              {row.outgoingCount || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${sortKey === 'topFee' ? 'text-[var(--verde)]' : 'text-white'}`}>
                              {row.topFee > 0 ? formatCurrency(row.topFee) : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60 max-w-xs truncate">
                            {row.topPlayer ? fixDisplay(row.topPlayer) : <span className="text-white/30">-</span>}
                          </td>
                        </tr>
                        {isExpanded && canExpand && (
                          <tr>
                            <td colSpan={10} className="bg-[var(--obsidian)] px-6 py-4">
                              <div className="grid lg:grid-cols-2 gap-6">
                                {row.rows.length > 0 && (
                                  <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Incoming ({row.rows.length})</p>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-[10px] text-white/40 uppercase tracking-wider">
                                          <th className="px-2 py-1 text-left">Year</th>
                                          <th className="px-2 py-1 text-left">Player</th>
                                          <th className="px-2 py-1 text-left">From</th>
                                          <th className="px-2 py-1 text-left">Type</th>
                                          <th className="px-2 py-1 text-right">Fee</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {row.rows.map((t, i) => (
                                          <tr key={`in-${i}`} className="border-t border-[var(--obsidian-lighter)]">
                                            <td className="px-2 py-1.5 text-white/60">{t.year}</td>
                                            <td className="px-2 py-1.5 text-white">
                                              {fixDisplay(t.playerName)}
                                              <span className="text-white/40 ml-1 text-xs">{t.position}</span>
                                            </td>
                                            <td className="px-2 py-1.5 text-white/70">
                                              {fixDisplay(t.sourceClub)}
                                              <span className="text-white/40 ml-1 text-xs">{t.sourceCountry}</span>
                                            </td>
                                            <td className="px-2 py-1.5 text-white/60 capitalize">{t.transferType}</td>
                                            <td className={`px-2 py-1.5 text-right font-semibold ${t.fee > 0 ? 'text-[var(--verde)]' : 'text-white/40'}`}>
                                              {t.fee > 0 ? formatCurrency(t.fee) : 'Free'}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                                {row.outgoingRows.length > 0 && (
                                  <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                                      Outgoing — paid sales ({row.outgoingRows.length})
                                    </p>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-[10px] text-white/40 uppercase tracking-wider">
                                          <th className="px-2 py-1 text-left">Year</th>
                                          <th className="px-2 py-1 text-left">Player</th>
                                          <th className="px-2 py-1 text-left">To</th>
                                          <th className="px-2 py-1 text-left">Type</th>
                                          <th className="px-2 py-1 text-right">Fee</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {row.outgoingRows.map((t, i) => (
                                          <tr key={`out-${i}`} className="border-t border-[var(--obsidian-lighter)]">
                                            <td className="px-2 py-1.5 text-white/60">{t.year}</td>
                                            <td className="px-2 py-1.5 text-white">
                                              {fixDisplay(t.playerName)}
                                              <span className="text-white/40 ml-1 text-xs">{t.position}</span>
                                            </td>
                                            <td className="px-2 py-1.5 text-white/70">
                                              {fixDisplay(t.destinationClub)}
                                              <span className="text-white/40 ml-1 text-xs">{t.destinationCountry}</span>
                                            </td>
                                            <td className="px-2 py-1.5 text-white/60 capitalize">{t.transferType}</td>
                                            <td className="px-2 py-1.5 text-right font-semibold text-rose-400">
                                              {formatCurrency(t.fee)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
