'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { roster } from '@/data/roster';
import { getTeamValuations, formatCurrency } from '@/data/valuations';

type SortField = 'name' | 'position' | 'salary' | 'age' | 'goals' | 'assists';
type SortOrder = 'asc' | 'desc';

const positionColors: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  RB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CDM: 'bg-green-500/20 text-green-400 border-green-500/30',
  CM: 'bg-green-500/20 text-green-400 border-green-500/30',
  CAM: 'bg-[var(--verde)]/20 text-[var(--verde)] border-[var(--verde)]/30',
  LW: 'bg-red-500/20 text-red-400 border-red-500/30',
  RW: 'bg-red-500/20 text-red-400 border-red-500/30',
  RM: 'bg-red-500/20 text-red-400 border-red-500/30',
  ST: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const designationColors: Record<string, string> = {
  DP: 'bg-amber-500 text-black',
  TAM: 'bg-blue-500 text-white',
  U22: 'bg-purple-500 text-white',
  GA: 'bg-[var(--verde)] text-black',
  HG: 'bg-orange-500 text-white',
};

export default function RosterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('salary');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const valuations = getTeamValuations('Austin FC');

  const filteredRoster = roster
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = positionFilter === 'all' || player.positionGroup === positionFilter;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'position':
          aVal = a.position;
          bVal = b.position;
          break;
        case 'salary':
          aVal = a.salary;
          bVal = b.salary;
          break;
        case 'age':
          aVal = a.age;
          bVal = b.age;
          break;
        case 'goals':
          aVal = a.stats.goals;
          bVal = b.stats.goals;
          break;
        case 'assists':
          aVal = a.stats.assists;
          bVal = b.stats.assists;
          break;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const totalSalary = roster.reduce((sum, p) => sum + p.salary, 0);
  const totalValue = valuations.reduce((sum, p) => sum + p.marketValue, 0);

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-white tracking-wide">
          ROSTER <span className="text-[var(--verde)]">MANAGEMENT</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Full squad overview with valuations and contract details
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="stat-card rounded-xl p-4">
          <p className="text-xs text-white/50 uppercase tracking-wider">Players</p>
          <p className="font-display text-3xl text-white">{roster.length}</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <p className="text-xs text-white/50 uppercase tracking-wider">Total Salary</p>
          <p className="font-display text-3xl text-[var(--verde)]">{formatCurrency(totalSalary)}</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <p className="text-xs text-white/50 uppercase tracking-wider">Squad Value</p>
          <p className="font-display text-3xl text-blue-400">{formatCurrency(totalValue)}</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <p className="text-xs text-white/50 uppercase tracking-wider">Avg Age</p>
          <p className="font-display text-3xl text-white">
            {(roster.reduce((sum, p) => sum + p.age, 0) / roster.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-white placeholder:text-white/40 focus:border-[var(--verde)] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-white focus:border-[var(--verde)] focus:outline-none"
          >
            <option value="all">All Positions</option>
            <option value="GK">Goalkeepers</option>
            <option value="DEF">Defenders</option>
            <option value="MID">Midfielders</option>
            <option value="FWD">Forwards</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-[var(--obsidian-lighter)] bg-[var(--obsidian-light)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--obsidian-lighter)]">
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Player <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSort('position')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Pos <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSort('age')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Age <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSort('salary')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Salary <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Market Value</span>
                </th>
                <th className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleSort('goals')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    G <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleSort('assists')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    A <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Contract</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((player, index) => {
                const valuation = valuations.find(v => v.name === player.name);
                return (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-[var(--obsidian-lighter)] hover:bg-[var(--verde)]/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--obsidian)] flex items-center justify-center font-display text-white/60">
                          {player.number}
                        </div>
                        <div>
                          <p className="font-medium text-white">{player.name}</p>
                          <p className="text-xs text-white/40">{player.nationality}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${positionColors[player.position] || 'bg-white/10 text-white'}`}>
                          {player.position}
                        </span>
                        {player.designation && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${designationColors[player.designation]}`}>
                            {player.designation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{player.age}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[var(--verde)]">{player.salaryFormatted}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-blue-400">
                        {valuation ? formatCurrency(valuation.marketValue) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-white">{player.stats.goals}</td>
                    <td className="px-4 py-3 text-center font-semibold text-white">{player.stats.assists}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-white/50">{player.contractEnd}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

