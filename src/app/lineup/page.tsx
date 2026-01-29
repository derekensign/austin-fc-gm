'use client';

import { motion } from 'framer-motion';
import { Shield, Settings, Users, RotateCcw } from 'lucide-react';
import { LineupProvider, useLineup, type PlayerPosition, type TacticsSettings } from '@/context/LineupContext';
import { SoccerField } from '@/components/lineup/SoccerField';
import { DraggablePlayer } from '@/components/lineup/DraggablePlayer';
import { FormationSelector } from '@/components/lineup/FormationSelector';
import { PlayerBench } from '@/components/lineup/PlayerBench';
import { TacticsPanel } from '@/components/lineup/TacticsPanel';
import { LineupExporter } from '@/components/lineup/LineupExporter';
import { austinFCRoster } from '@/data/austin-fc-roster';

/**
 * Apply tactical adjustments to player positions
 * - Defensive line height: Moves defenders up/back
 * - Team width: Spreads players in/out
 */
function applyTacticalAdjustments(
  basePosition: PlayerPosition,
  positionGroup: string,
  tactics: TacticsSettings
): PlayerPosition {
  const adjusted = { ...basePosition };

  // Apply defensive line height adjustment (only to defenders)
  if (positionGroup === 'DEF' && basePosition.role !== 'GK') {
    // Defensive line: 0 (low/deep) to 100 (high/press)
    // Adjust Y position: Lower number = higher up the pitch
    const lineAdjustment = (tactics.defensiveLineHeight - 50) * 0.15; // Scale the effect
    adjusted.y = Math.max(5, Math.min(95, basePosition.y - lineAdjustment));
  }

  // Apply team width adjustment (all outfield players)
  if (basePosition.role !== 'GK') {
    // Team width: 0 (narrow) to 100 (wide)
    // Adjust X position: Spread from center (50) based on width
    const centerX = 50;
    const distanceFromCenter = basePosition.x - centerX;
    const widthMultiplier = 0.5 + (tactics.teamWidth / 100); // 0.5 to 1.5
    adjusted.x = centerX + (distanceFromCenter * widthMultiplier);
    adjusted.x = Math.max(15, Math.min(85, adjusted.x)); // Keep within bounds
  }

  return adjusted;
}

/**
 * Bench player icon component
 */
function BenchPlayerIcon({ player, onClick }: { player: any; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group"
      title={player.name}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-[var(--obsidian-light)]">
        {player.photo ? (
          <img
            src={player.photo}
            alt={player.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold bg-black/60">
            {player.firstName[0]}{player.lastName[0]}
          </div>
        )}
      </div>
      {player.number && (
        <div className="absolute -top-0.5 -right-0.5 bg-[var(--obsidian)] border border-[var(--verde)] rounded-full w-3.5 h-3.5 flex items-center justify-center">
          <span className="text-[8px] font-bold text-[var(--verde)]">{player.number}</span>
        </div>
      )}
    </motion.button>
  );
}

function LineupBuilderContent() {
  const { lineupState, setPlayerPosition, resetToDefault, addToLineup } = useLineup();

  // Get starting XI players
  const startingPlayers = austinFCRoster.filter(p =>
    lineupState.startingXI.includes(p.id)
  );

  return (
    <div className="p-4 md:p-6 stripe-pattern min-h-screen w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide">
          LINEUP <span className="text-[var(--verde)]">BUILDER</span>
        </h1>
        <p className="text-white/60 text-xs md:text-sm">
          Build your starting XI with formations and tactics
        </p>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel - Controls (30%) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-4"
        >
          {/* Formation Selector */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[var(--verde)]" />
              <h2 className="font-display text-lg text-white">Formation</h2>
            </div>
            <FormationSelector />
          </div>

          {/* Tactics Panel */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-[var(--verde)]" />
              <h2 className="font-display text-lg text-white">Tactics</h2>
            </div>
            <TacticsPanel />
          </div>

          {/* Player Bench */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[var(--verde)]" />
              <h2 className="font-display text-lg text-white">Squad</h2>
            </div>
            <PlayerBench />
          </div>
        </motion.div>

        {/* Right Panel - Field & Export (70%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 space-y-4"
        >
          {/* Soccer Field with Bench */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4 overflow-hidden relative">
            {/* Reset Button */}
            <button
              onClick={resetToDefault}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              title="Reset positions to default for current formation"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Lineup
            </button>

            {/* Field Container */}
            <div className="w-full max-w-lg mx-auto space-y-3">
              {/* Soccer Field */}
              <div className="aspect-[2/3] w-full">
                <SoccerField tactics={lineupState.tactics} showOverlays={true}>
                  {startingPlayers.map((player) => {
                    const basePosition = lineupState.positions.get(player.id);
                    if (!basePosition) return null;

                    // Apply tactical adjustments to position
                    const adjustedPosition = applyTacticalAdjustments(
                      basePosition,
                      player.positionGroup,
                      lineupState.tactics
                    );

                    return (
                      <DraggablePlayer
                        key={player.id}
                        player={player}
                        position={adjustedPosition}
                        onDragEnd={(newPosition) => setPlayerPosition(player.id, newPosition)}
                      />
                    );
                  })}
                </SoccerField>
              </div>

              {/* Bench Area */}
              <div className="bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[var(--verde)]" />
                  <h3 className="font-display text-sm text-white">Bench</h3>
                  <span className="text-xs text-white/60">({lineupState.bench.length})</span>
                </div>

                {/* Bench Players Grid by Position */}
                <div className="grid grid-cols-2 gap-2">
                  {['GK', 'DEF', 'MID', 'FWD'].map((posGroup) => {
                    const groupPlayers = austinFCRoster.filter(p =>
                      lineupState.bench.includes(p.id) && p.positionGroup === posGroup
                    );

                    if (groupPlayers.length === 0) return null;

                    return (
                      <div key={posGroup} className="space-y-1">
                        <div className="text-[10px] text-white/60 uppercase font-bold">{posGroup}</div>
                        <div className="flex flex-wrap gap-1">
                          {groupPlayers.slice(0, 5).map((player) => (
                            <BenchPlayerIcon
                              key={player.id}
                              player={player}
                              onClick={() => {
                                if (lineupState.startingXI.length < 11) {
                                  addToLineup(player.id);
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-white">Export Lineup</h2>
                <p className="text-white/50 text-xs">Download your lineup as an image or PDF</p>
              </div>
              <LineupExporter />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LineupBuilderPage() {
  return (
    <LineupProvider>
      <LineupBuilderContent />
    </LineupProvider>
  );
}
