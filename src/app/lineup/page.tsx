'use client';

import { motion } from 'framer-motion';
import { Shield, Settings, Users, RotateCcw } from 'lucide-react';
import { LineupProvider, useLineup } from '@/context/LineupContext';
import { SoccerField } from '@/components/lineup/SoccerField';
import { DraggablePlayer } from '@/components/lineup/DraggablePlayer';
import { FormationSelector } from '@/components/lineup/FormationSelector';
import { PlayerBench } from '@/components/lineup/PlayerBench';
import { TacticsPanel } from '@/components/lineup/TacticsPanel';
import { LineupExporter } from '@/components/lineup/LineupExporter';
import { austinFCRoster } from '@/data/austin-fc-roster';

function LineupBuilderContent() {
  const { lineupState, setPlayerPosition, resetToDefault } = useLineup();

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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--verde)]" />
                <h2 className="font-display text-lg text-white">Formation</h2>
              </div>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-1 px-2 py-1 text-xs text-white/60 hover:text-[var(--verde)] transition-colors"
                title="Reset to default 4-3-3"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
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
          {/* Soccer Field */}
          <div className="bg-[var(--obsidian-light)] border border-[var(--obsidian-lighter)] rounded-lg p-4 overflow-hidden">
            <div className="aspect-[3/4] md:aspect-[4/3] w-full">
              <SoccerField tactics={lineupState.tactics} showOverlays={true}>
                {startingPlayers.map((player) => {
                  const position = lineupState.positions.get(player.id);
                  if (!position) return null;

                  return (
                    <DraggablePlayer
                      key={player.id}
                      player={player}
                      position={position}
                      onDragEnd={(newPosition) => setPlayerPosition(player.id, newPosition)}
                    />
                  );
                })}
              </SoccerField>
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
