'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, ArrowUpDown, Globe, Star, Users, DollarSign, Trophy, Calendar } from 'lucide-react';
import { roster, salaryCap, getDPs, getU22Players, getInternationalPlayers } from '@/data/roster';
import { formatSalary } from '@/data/austin-fc-roster';

type SortField = 'name' | 'position' | 'salary' | 'budgetCharge' | 'age' | 'marketValue';
type SortOrder = 'asc' | 'desc';

const positionColors: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  RB: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CDM: 'bg-green-500/20 text-green-400 border-green-500/30',
  CM: 'bg-green-500/20 text-green-400 border-green-500/30',
  MID: 'bg-green-500/20 text-green-400 border-green-500/30',
  CAM: 'bg-[var(--verde)]/20 text-[var(--verde)] border-[var(--verde)]/30',
  LW: 'bg-red-500/20 text-red-400 border-red-500/30',
  RW: 'bg-red-500/20 text-red-400 border-red-500/30',
  RM: 'bg-red-500/20 text-red-400 border-red-500/30',
  ST: 'bg-red-500/20 text-red-400 border-red-500/30',
  FW: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const designationColors: Record<string, string> = {
  DP: 'bg-amber-500 text-black font-bold',
  TAM: 'bg-blue-500 text-white',
  U22: 'bg-purple-500 text-white',
  GA: 'bg-[var(--verde)] text-black',
  HG: 'bg-orange-500 text-white',
  Senior: 'bg-white/10 text-white/60',
  Supplemental: 'bg-white/5 text-white/40',
};

const designationLabels: Record<string, string> = {
  DP: 'DP',
  TAM: 'TAM',
  U22: 'U22',
  GA: 'GA',
  HG: 'HG',
  Senior: 'SR',
  Supplemental: 'SUP',
};

export default function RosterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [designationFilter, setDesignationFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('budgetCharge');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredRoster = roster
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = positionFilter === 'all' || player.positionGroup === positionFilter;
      const matchesDesignation = designationFilter === 'all' || player.designation === designationFilter;
      return matchesSearch && matchesPosition && matchesDesignation;
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
        case 'budgetCharge':
          aVal = a.budgetCharge;
          bVal = b.budgetCharge;
          break;
        case 'age':
          aVal = a.age;
          bVal = b.age;
          break;
        case 'marketValue':
          aVal = a.marketValue;
          bVal = b.marketValue;
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
  const totalBudgetCharge = roster.reduce((sum, p) => sum + p.budgetCharge, 0);
  const totalMarketValue = roster.reduce((sum, p) => sum + p.marketValue, 0);
  const dps = getDPs();
  const u22s = getU22Players();
  const internationals = getInternationalPlayers();

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-white tracking-wide">
          2026 <span className="text-[var(--verde)]">ROSTER</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          {roster.length} players • {dps.length} DPs • {u22s.length} U22s • {internationals.length} International slots
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Squad</p>
          </div>
          <p className="font-display text-2xl text-white">{roster.length}</p>
          <p className="text-xs text-white/40">{salaryCap.seniorRosterSpots.used}/{salaryCap.seniorRosterSpots.total} Senior</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Budget Charge</p>
          </div>
          <p className="font-display text-2xl text-[var(--verde)]">{formatSalary(totalBudgetCharge)}</p>
          <p className="text-xs text-white/40">of {formatSalary(salaryCap.totalBudget)} cap</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Total Salary</p>
          </div>
          <p className="font-display text-2xl text-amber-400">{formatSalary(totalSalary)}</p>
          <p className="text-xs text-white/40">Guaranteed comp</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Squad Value</p>
          </div>
          <p className="font-display text-2xl text-blue-400">{formatSalary(totalMarketValue)}</p>
          <p className="text-xs text-white/40">Market value</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Int&apos;l Slots</p>
          </div>
          <p className="font-display text-2xl text-purple-400">{salaryCap.internationalSlots.used}/{salaryCap.internationalSlots.total}</p>
          <p className="text-xs text-white/40">{salaryCap.internationalSlots.total - salaryCap.internationalSlots.used} available</p>
        </div>
        <div className="stat-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-white/50" />
            <p className="text-xs text-white/50 uppercase tracking-wider">Avg Age</p>
          </div>
          <p className="font-display text-2xl text-white">
            {(roster.reduce((sum, p) => sum + p.age, 0) / roster.length).toFixed(1)}
          </p>
          <p className="text-xs text-white/40">years old</p>
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
        <div className="flex gap-2 flex-wrap">
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
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] text-white focus:border-[var(--verde)] focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="DP">Designated Players</option>
            <option value="U22">U22 Initiative</option>
            <option value="TAM">TAM Players</option>
            <option value="HG">Homegrown</option>
            <option value="GA">Generation Adidas</option>
            <option value="Senior">Senior Roster</option>
            <option value="Supplemental">Supplemental</option>
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
              <tr className="border-b border-[var(--obsidian-lighter)] bg-[var(--obsidian)]/50">
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
                    onClick={() => handleSort('budgetCharge')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Cap Hit <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <button 
                    onClick={() => handleSort('salary')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Salary <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <button 
                    onClick={() => handleSort('marketValue')}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Value <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Contract Until</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.015 }}
                  className="border-b border-[var(--obsidian-lighter)] hover:bg-[var(--verde)]/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover bg-[var(--obsidian)]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--obsidian)] flex items-center justify-center font-display text-white/60 text-sm">
                          {player.number || '?'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{player.name}</p>
                          {player.isInternational && (
                            <span title="International slot">
                              <Globe className="h-3 w-3 text-purple-400" />
                            </span>
                          )}
                        </div>
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
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${designationColors[player.designation]}`}>
                          {designationLabels[player.designation]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 text-center">{player.age}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${player.budgetCharge === 0 ? 'text-white/40 italic' : 'text-[var(--verde)]'}`}>
                      {player.budgetCharge === 0 ? 'Off-cap' : player.budgetChargeFormatted}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-amber-400/80">{player.salaryFormatted}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-blue-400">{formatSalary(player.marketValue)}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-white/50 text-sm">{player.contractEnd}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRoster.length === 0 && (
          <div className="py-12 text-center text-white/40">
            No players match your filters
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 rounded-xl bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)]"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">Roster Designations</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${designationColors.DP}`}>DP</span>
            <span className="text-white/60">Designated Player (max $803K cap hit)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${designationColors.U22}`}>U22</span>
            <span className="text-white/60">U22 Initiative ($200K fixed cap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${designationColors.TAM}`}>TAM</span>
            <span className="text-white/60">TAM Buydown Applied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${designationColors.HG}`}>HG</span>
            <span className="text-white/60">Homegrown Player</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded ${designationColors.GA}`}>GA</span>
            <span className="text-white/60">Generation Adidas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-purple-400" />
            <span className="text-white/60">International Slot</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
