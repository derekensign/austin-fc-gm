'use client';

import { useState, useMemo } from 'react';
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
  Users,
  DollarSign,
  Filter,
  ArrowUpDown,
  Trophy,
  Calendar,
  Building2,
} from 'lucide-react';
import { ALL_TRANSFERS, type TransferRecord, getMLSTeams } from '@/data/mls-transfers-all';

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
    .replace(/Red Bull /gi, 'Red Bulls');
  result = result.replace(/ {2,}/g, ' ').trim();
  return result;
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const MIN_YEAR = YEARS[0];
const MAX_YEAR = YEARS[YEARS.length - 1];

type SortKey = 'totalSpend' | 'transfers' | 'avgFee' | 'topFee';
type SortDirection = 'asc' | 'desc';

// Only "arrival" rows in the dataset count as incoming MLS purchases.
const INCOMING_TRANSFERS: TransferRecord[] = ALL_TRANSFERS.filter(t => t.direction === 'arrival');

const VERDE = '#00b140';
const BLUE = '#3b82f6';
const TEAM_COLORS = [
  '#00b140', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#10b981', '#ec4899', '#06b6d4', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#eab308', '#22d3ee', '#f43f5e',
];

export default function ClubSpendingPage() {
  const [startYear, setStartYear] = useState<number>(MIN_YEAR);
  const [endYear, setEndYear] = useState<number>(MAX_YEAR);
  const [sortKey, setSortKey] = useState<SortKey>('totalSpend');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showTop, setShowTop] = useState<number>(15);

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return amount > 0 ? `$${amount.toLocaleString()}` : '-';
  };

  // Normalize range so start <= end, regardless of which control the user changed.
  const [lo, hi] = startYear <= endYear ? [startYear, endYear] : [endYear, startYear];
  const isSingleYear = lo === hi;

  const rangeTransfers = useMemo(() => {
    return INCOMING_TRANSFERS.filter(t => t.year >= lo && t.year <= hi);
  }, [lo, hi]);

  // Aggregate per MLS club for the selected window.
  const clubData = useMemo(() => {
    type Agg = {
      mlsTeam: string;
      transfers: number;
      totalSpend: number;
      paidCount: number;
      topFee: number;
      topPlayer: string;
    };
    const map = new Map<string, Agg>();

    rangeTransfers.forEach(t => {
      const existing = map.get(t.mlsTeam) || {
        mlsTeam: t.mlsTeam,
        transfers: 0,
        totalSpend: 0,
        paidCount: 0,
        topFee: 0,
        topPlayer: '',
      };
      existing.transfers++;
      existing.totalSpend += t.fee;
      if (t.fee > 0) existing.paidCount++;
      if (t.fee > existing.topFee) {
        existing.topFee = t.fee;
        existing.topPlayer = t.playerName;
      }
      map.set(t.mlsTeam, existing);
    });

    // Ensure every MLS team appears even with zero transfers in the window.
    getMLSTeams().forEach(team => {
      if (!map.has(team)) {
        map.set(team, {
          mlsTeam: team,
          transfers: 0,
          totalSpend: 0,
          paidCount: 0,
          topFee: 0,
          topPlayer: '',
        });
      }
    });

    return Array.from(map.values())
      .map(d => ({
        ...d,
        avgFee: d.paidCount > 0 ? d.totalSpend / d.paidCount : 0,
      }))
      .sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? -1 : 1;
        return (a[sortKey] - b[sortKey]) * multiplier;
      });
  }, [rangeTransfers, sortKey, sortDirection]);

  const visibleClubs = useMemo(() => clubData.slice(0, showTop), [clubData, showTop]);

  const summaryStats = useMemo(() => {
    const totalSpend = rangeTransfers.reduce((sum, t) => sum + t.fee, 0);
    const paidCount = rangeTransfers.filter(t => t.fee > 0).length;
    const clubsWithSpend = clubData.filter(c => c.totalSpend > 0).length;
    const topClub = clubData.find(c => c.totalSpend > 0);

    return {
      totalSpend,
      totalTransfers: rangeTransfers.length,
      paidCount,
      avgFee: paidCount > 0 ? totalSpend / paidCount : 0,
      clubsWithSpend,
      topClub: topClub?.mlsTeam || '',
      topClubSpend: topClub?.totalSpend || 0,
    };
  }, [rangeTransfers, clubData]);

  // Year-by-year spend, one series per visible club. Used when range spans 2+ seasons.
  const yearlyByClub = useMemo(() => {
    if (isSingleYear) return [];
    const seriesClubs = visibleClubs.slice(0, 8).map(c => c.mlsTeam);
    return YEARS.filter(y => y >= lo && y <= hi).map(year => {
      const row: Record<string, number | string> = { year: year.toString() };
      seriesClubs.forEach(team => {
        const teamSpend = INCOMING_TRANSFERS
          .filter(t => t.mlsTeam === team && t.year === year)
          .reduce((sum, t) => sum + t.fee, 0);
        row[team] = teamSpend / 1_000_000;
      });
      return row;
    });
  }, [visibleClubs, isSingleYear, lo, hi]);

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

  const barChartData = visibleClubs.map(c => ({
    name: fixDisplay(c.mlsTeam),
    rawTeam: c.mlsTeam,
    spend: c.totalSpend / 1_000_000,
    transfers: c.transfers,
    avgFee: c.avgFee / 1_000_000,
    topFee: c.topFee / 1_000_000,
  }));

  const rangeLabel = isSingleYear ? `${lo}` : `${lo}–${hi}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--obsidian)] via-[var(--obsidian-light)] to-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-[var(--verde)]" />
            <h1 className="text-3xl font-display font-bold text-white">
              MLS Club Incoming Transfer Spend
            </h1>
          </div>
          <p className="text-white/60">
            Rank MLS clubs by incoming transfer fees — pick a single season or a multi-year window
          </p>
          <p className="text-xs text-white/40 mt-1">
            Source:{' '}
            <a
              href="https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--verde)] hover:underline"
            >
              Transfermarkt
            </a>
            . Fees converted to USD. Only incoming transfers (arrivals) are counted.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--verde)]" />
              <span className="text-sm font-medium text-white">Year Range:</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)] min-w-[100px]"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="text-white/50 text-sm">to</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)] min-w-[100px]"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-white/60">Show top:</span>
              <select
                value={showTop}
                onChange={(e) => setShowTop(Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>All</option>
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-white/40 py-1.5">Quick presets:</span>
            {YEARS.map(y => (
              <button
                key={`single-${y}`}
                onClick={() => { setStartYear(y); setEndYear(y); }}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  isSingleYear && lo === y
                    ? 'bg-[var(--verde)] text-black'
                    : 'bg-[var(--obsidian)] text-white/60 hover:text-white border border-[var(--verde)]/20'
                }`}
              >
                {y}
              </button>
            ))}
            <button
              onClick={() => { setStartYear(MIN_YEAR); setEndYear(MAX_YEAR); }}
              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                lo === MIN_YEAR && hi === MAX_YEAR
                  ? 'bg-[var(--verde)] text-black'
                  : 'bg-[var(--obsidian)] text-white/60 hover:text-white border border-[var(--verde)]/20'
              }`}
            >
              All Years
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">League Spend</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summaryStats.totalSpend)}</p>
            <p className="text-xs text-white/50">{rangeLabel}</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Incoming Transfers</span>
            </div>
            <p className="text-3xl font-bold text-white">{summaryStats.totalTransfers}</p>
            <p className="text-xs text-white/50">{summaryStats.paidCount} with fees</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Avg. Paid Fee</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summaryStats.avgFee)}</p>
            <p className="text-xs text-white/50">Across {summaryStats.clubsWithSpend} clubs</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Top Spender</span>
            </div>
            <p className="text-xl font-bold text-white truncate">{fixDisplay(summaryStats.topClub) || '-'}</p>
            <p className="text-xs text-white/50">{formatCurrency(summaryStats.topClubSpend)}</p>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-white/60 py-2">Rank by:</span>
          {(
            [
              ['totalSpend', 'Total Spend'],
              ['transfers', '# Transfers'],
              ['avgFee', 'Avg Fee'],
              ['topFee', 'Top Single Fee'],
            ] as Array<[SortKey, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
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
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Club Ranking — {rangeLabel}
            <span className="text-sm font-normal text-white/50 ml-2">
              ({sortKey === 'totalSpend' ? 'Total Spend ($M)' :
                sortKey === 'transfers' ? '# Incoming Transfers' :
                sortKey === 'avgFee' ? 'Avg Paid Fee ($M)' :
                'Top Single Fee ($M)'})
            </span>
          </h2>
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ left: 140, right: 40, top: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  type="number"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickFormatter={(value) =>
                    sortKey === 'transfers' ? value.toString() : `$${value.toFixed(0)}M`
                  }
                  label={{
                    value:
                      sortKey === 'totalSpend' ? 'Total Spend ($ Millions)' :
                      sortKey === 'transfers' ? '# Incoming Transfers' :
                      sortKey === 'avgFee' ? 'Avg Paid Fee ($ Millions)' :
                      'Top Single Fee ($ Millions)',
                    position: 'bottom',
                    offset: 10,
                    style: { fill: 'var(--verde)', fontSize: 12, fontWeight: 600 },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  width={130}
                  tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--obsidian)',
                    border: '1px solid var(--verde)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                  labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                  itemStyle={{ color: 'white', padding: '2px 0' }}
                  cursor={{ fill: 'rgba(0, 177, 64, 0.1)' }}
                  formatter={(value, name) => {
                    if (value === undefined) return ['', ''];
                    if (name === 'transfers') return [`${value} players`, '📊 Transfers'];
                    return [`$${Number(value).toFixed(2)}M`, '💰 Value'];
                  }}
                  labelFormatter={(label) => `🏟️  ${label}`}
                />
                <Bar
                  dataKey={
                    sortKey === 'totalSpend' ? 'spend' :
                    sortKey === 'transfers' ? 'transfers' :
                    sortKey === 'avgFee' ? 'avgFee' :
                    'topFee'
                  }
                  radius={[0, 4, 4, 0]}
                >
                  {barChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TEAM_COLORS[index % TEAM_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-year per-club trend (only when range spans 2+ seasons) */}
        {!isSingleYear && yearlySeriesClubs.length > 0 && (
          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-1">
              Year-by-Year Spend — Top {yearlySeriesClubs.length} Clubs
            </h2>
            <p className="text-xs text-white/50 mb-4">
              One line per club. Top clubs determined by current ranking ({rangeLabel}).
            </p>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyByClub} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="year"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}M`}
                    label={{
                      value: 'Spend ($M)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: VERDE, fontSize: 12, fontWeight: 600 },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--obsidian)',
                      border: '1px solid var(--verde)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    }}
                    labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                    itemStyle={{ padding: '2px 0' }}
                    formatter={(value, name) => {
                      if (value === undefined) return ['', ''];
                      return [`$${Number(value).toFixed(2)}M`, fixDisplay(String(name))];
                    }}
                    labelFormatter={(label) => `📅 Season ${label}`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                        {fixDisplay(value)}
                      </span>
                    )}
                  />
                  {yearlySeriesClubs.map((team, idx) => (
                    <Line
                      key={team}
                      type="monotone"
                      dataKey={team}
                      stroke={TEAM_COLORS[idx % TEAM_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detail Table */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[var(--verde)]/20">
            <h2 className="text-xl font-bold text-white">
              Club Spend Detail — {rangeLabel}
              <span className="text-sm font-normal text-white/50 ml-2">
                ({clubData.filter(c => c.transfers > 0).length} clubs with activity)
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--obsidian)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Club</th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('totalSpend')}
                  >
                    Total Spend {sortKey === 'totalSpend' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('transfers')}
                  >
                    Transfers {sortKey === 'transfers' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('avgFee')}
                  >
                    Avg Fee {sortKey === 'avgFee' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('topFee')}
                  >
                    Top Fee {sortKey === 'topFee' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Top Signing
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--obsidian-lighter)]">
                {clubData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/50">
                      No clubs in the selected range
                    </td>
                  </tr>
                ) : (
                  clubData.map((row, index) => (
                    <tr key={row.mlsTeam} className="hover:bg-[var(--obsidian)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">{fixDisplay(row.mlsTeam)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'totalSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.totalSpend > 0 ? formatCurrency(row.totalSpend) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'transfers' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.transfers}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'avgFee' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.avgFee > 0 ? formatCurrency(row.avgFee) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'topFee' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.topFee > 0 ? formatCurrency(row.topFee) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60 max-w-xs truncate">
                        {row.topPlayer ? fixDisplay(row.topPlayer) : <span className="text-white/30">-</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
