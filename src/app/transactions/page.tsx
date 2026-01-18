'use client';

import { motion } from 'framer-motion';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ExternalLink, 
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  austinFCAllocationHistory, 
  NON_GAM_MOVEMENTS,
  getGAMBalanceByYear,
  getTAMBalanceByYear,
  AllocationTransaction 
} from '@/data/austin-fc-allocation-money';
import { formatSalary } from '@/data/austin-fc-roster';

function TransactionCard({ transaction }: { transaction: AllocationTransaction }) {
  const isIncoming = transaction.type.includes('RECEIVED') || transaction.type.includes('TRADED_IN') || transaction.type.includes('PLAYER_SALE');
  const isGAM = transaction.type.includes('GAM');
  const isTAM = transaction.type.includes('TAM');
  
  // Skip annual allocations for the main list (we'll show them in summary)
  const isAnnualAllocation = transaction.id.includes('-annual');
  if (isAnnualAllocation) return null;
  
  const typeLabel = isGAM ? 'GAM' : isTAM ? 'TAM' : 'Allocation';
  const directionLabel = isIncoming ? 'Received' : 'Spent';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${
        isIncoming 
          ? 'border-green-500/30 bg-green-500/5' 
          : 'border-red-500/30 bg-red-500/5'
      } p-4`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon and Amount */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isIncoming ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {isIncoming 
              ? <ArrowDownLeft className="h-5 w-5 text-green-400" />
              : <ArrowUpRight className="h-5 w-5 text-red-400" />
            }
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-display ${
                isIncoming ? 'text-green-400' : 'text-red-400'
              }`}>
                {isIncoming ? '+' : '-'}{transaction.amount ? formatSalary(transaction.amount) : 'Undisclosed'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                isGAM ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {typeLabel}
              </span>
              {transaction.verified && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            {transaction.conditionalAmount && (
              <p className="text-xs text-white/40 mt-0.5">
                + up to {formatSalary(transaction.conditionalAmount)} conditional
              </p>
            )}
          </div>
        </div>
        
        {/* Right: Date */}
        <div className="flex items-center gap-1.5 text-white/40 text-sm">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(transaction.date).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Description */}
      <p className="text-white/80 text-sm mt-3">
        {transaction.description}
      </p>
      
      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-white/50">
        {transaction.counterparty && (
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {transaction.counterparty}
          </span>
        )}
        {transaction.relatedPlayer && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {transaction.relatedPlayer}
          </span>
        )}
      </div>
      
      {/* Notes */}
      {transaction.notes && (
        <p className="text-xs text-white/40 mt-2 flex items-start gap-1.5">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          {transaction.notes}
        </p>
      )}
      
      {/* Source Link */}
      {transaction.source && transaction.source.startsWith('http') && (
        <a 
          href={transaction.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[var(--verde)] hover:text-[var(--verde-light)] text-xs mt-3 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View Source Article
        </a>
      )}
    </motion.div>
  );
}

function NonGAMMovementCard({ movement }: { movement: typeof NON_GAM_MOVEMENTS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{movement.player}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-500/20 text-slate-400">
              {movement.movement}
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">{movement.details}</p>
          {movement.note && (
            <p className="text-xs text-amber-400/80 mt-2 flex items-start gap-1.5">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              {movement.note}
            </p>
          )}
        </div>
        <div className="text-white/40 text-sm">
          {new Date(movement.date).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          })}
        </div>
      </div>
      {movement.source && (
        <a 
          href={movement.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[var(--verde)] hover:text-[var(--verde-light)] text-xs mt-3 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View Source
        </a>
      )}
    </motion.div>
  );
}

function YearSummaryCard({ year, gam, tam }: { 
  year: number; 
  gam: { received: number; spent: number; net: number }; 
  tam: { received: number; spent: number; net: number };
}) {
  return (
    <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4">
      <h4 className="font-display text-lg text-white mb-3">{year}</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-400 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> GAM
          </span>
          <div className="flex items-center gap-2">
            <span className="text-green-400">+{formatSalary(gam.received)}</span>
            {gam.spent > 0 && (
              <span className="text-red-400">-{formatSalary(gam.spent)}</span>
            )}
            <span className={`font-medium ${gam.net >= 0 ? 'text-white' : 'text-red-400'}`}>
              = {formatSalary(gam.net)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-400 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> TAM
          </span>
          <div className="flex items-center gap-2">
            <span className="text-green-400">+{formatSalary(tam.received)}</span>
            {tam.spent > 0 && (
              <span className="text-red-400">-{formatSalary(tam.spent)}</span>
            )}
            <span className={`font-medium ${tam.net >= 0 ? 'text-white' : 'text-red-400'}`}>
              = {formatSalary(tam.net)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const gamByYear = getGAMBalanceByYear();
  const tamByYear = getTAMBalanceByYear();
  const years = Object.keys(gamByYear).map(Number).sort((a, b) => b - a);
  
  // Get non-annual transactions sorted by date
  const transactions = austinFCAllocationHistory
    .filter(t => !t.id.includes('-annual'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate totals
  const totalGAMReceived = Object.values(gamByYear).reduce((sum, y) => sum + y.received, 0);
  const totalGAMSpent = Object.values(gamByYear).reduce((sum, y) => sum + y.spent, 0);
  const totalTAMReceived = Object.values(tamByYear).reduce((sum, y) => sum + y.received, 0);
  const totalTAMSpent = Object.values(tamByYear).reduce((sum, y) => sum + y.spent, 0);
  
  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide">
          GAM & TAM <span className="text-[var(--verde)]">TRANSACTIONS</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Verified allocation money transactions from official Austin FC sources
        </p>
      </motion.div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            TOTAL GAM RECEIVED
          </div>
          <p className="font-display text-2xl text-green-400">
            {formatSalary(totalGAMReceived)}
          </p>
          <p className="text-white/40 text-xs mt-1">Since 2021</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
            <TrendingDown className="h-3.5 w-3.5" />
            TOTAL GAM SPENT
          </div>
          <p className="font-display text-2xl text-red-400">
            {formatSalary(totalGAMSpent)}
          </p>
          <p className="text-white/40 text-xs mt-1">Trades & buydowns</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            TOTAL TAM RECEIVED
          </div>
          <p className="font-display text-2xl text-green-400">
            {formatSalary(totalTAMReceived)}
          </p>
          <p className="text-white/40 text-xs mt-1">Since 2021</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
            <TrendingDown className="h-3.5 w-3.5" />
            TOTAL TAM SPENT
          </div>
          <p className="font-display text-2xl text-white/60">
            {formatSalary(totalTAMSpent)}
          </p>
          <p className="text-white/40 text-xs mt-1">Player buydowns</p>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Transactions Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-lg text-white tracking-wide mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              VERIFIED TRANSACTIONS
            </h2>
            
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </motion.div>
          
          {/* Non-GAM Movements Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="font-display text-lg text-white tracking-wide mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              CLARIFICATIONS (NO GAM INVOLVED)
            </h2>
            <p className="text-white/50 text-sm mb-4">
              These player movements did NOT involve GAM/TAM trades, despite common misconceptions.
            </p>
            
            <div className="space-y-3">
              {NON_GAM_MOVEMENTS.map((movement, index) => (
                <NonGAMMovementCard key={index} movement={movement} />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Right: Year-by-Year Summary */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-display text-lg text-white tracking-wide mb-4">
              ALLOCATION BY YEAR
            </h2>
            
            <div className="space-y-3">
              {years.map((year) => (
                <YearSummaryCard
                  key={year}
                  year={year}
                  gam={gamByYear[year] || { received: 0, spent: 0, net: 0 }}
                  tam={tamByYear[year] || { received: 0, spent: 0, net: 0 }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
          >
            <h3 className="font-display text-sm text-white/70 mb-3">LEGEND</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">GAM</span>
                <span className="text-white/50">General Allocation Money</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">TAM</span>
                <span className="text-white/50">Targeted Allocation Money</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-white/50">Verified from official source</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                <span className="text-white/50">GAM/TAM received</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-red-400" />
                <span className="text-white/50">GAM/TAM spent</span>
              </div>
            </div>
          </motion.div>
          
          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-xl p-4"
          >
            <h3 className="font-display text-sm text-white/70 mb-3">DATA SOURCES</h3>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <a 
                  href="https://www.austinfc.com/news/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--verde)] hover:text-[var(--verde-light)] flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Austin FC Official News
                </a>
              </li>
              <li>
                <a 
                  href="https://mlsplayers.org/resources/salary-guide" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--verde)] hover:text-[var(--verde-light)] flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  MLSPA Salary Guide
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/spreadsheets/d/1YTpiweEHfmkVnxa3ilVW1CXaiKCADVcdbt9wqMNLmt4/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--verde)] hover:text-[var(--verde-light)] flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  The North End Podcast Sheet
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

