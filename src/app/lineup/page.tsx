'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Users, RotateCcw, Share2, Check } from 'lucide-react';
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
 * Draggable bench player component
 */
function DraggableBenchPlayer({
  player,
  onDragToField
}: {
  player: any;
  onDragToField: (playerId: number, fieldX: number, fieldY: number) => void;
}) {
  const handleDragEnd = (_event: any, info: any) => {
    // Get the field element
    const fieldElement = document.querySelector('[data-field-container]');
    if (!fieldElement) return;

    const fieldRect = fieldElement.getBoundingClientRect();

    // Use the pointer position from Framer Motion
    const pointerX = info.point.x;
    const pointerY = info.point.y;

    // Check if dropped on field
    if (
      pointerX >= fieldRect.left &&
      pointerX <= fieldRect.right &&
      pointerY >= fieldRect.top &&
      pointerY <= fieldRect.bottom
    ) {
      // Calculate percentage position within field
      const fieldX = ((pointerX - fieldRect.left) / fieldRect.width) * 100;
      const fieldY = ((pointerY - fieldRect.top) / fieldRect.height) * 100;

      // Add player to field at this position
      onDragToField(player.id, fieldX, fieldY);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragSnapToOrigin={true}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      className="relative cursor-grab active:cursor-grabbing"
      title={player.name}
    >
      <div className="flex flex-col items-center gap-0.5 pointer-events-none select-none">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 bg-[var(--obsidian-light)] flex items-center justify-center">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="text-white text-xs font-bold">
              {player.firstName[0]}{player.lastName[0]}
            </div>
          )}
        </div>
        {/* Jersey Number */}
        {player.number && (
          <div className="absolute top-0 right-0 bg-[var(--obsidian)] border border-[var(--verde)] rounded-full w-4 h-4 flex items-center justify-center">
            <span className="text-[8px] font-bold text-[var(--verde)]">{player.number}</span>
          </div>
        )}
        {/* Name */}
        <div className="text-white text-[9px] font-semibold text-center truncate max-w-[60px]">
          {player.lastName}
        </div>
      </div>
    </motion.div>
  );
}

function LineupBuilderContent() {
  const { lineupState, setPlayerPosition, resetToDefault, addToLineup, getShareableUrl } = useLineup();
  const [showFullLineupMessage, setShowFullLineupMessage] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Handle share button click
  const handleShare = async () => {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Get starting XI players
  const startingPlayers = austinFCRoster.filter(p =>
    lineupState.startingXI.includes(p.id)
  );

  // Handle dragging bench player to field
  const handleDragBenchToField = (playerId: number, fieldX: number, fieldY: number) => {
    if (lineupState.startingXI.length >= 11) {
      // Show notification that lineup is full
      setShowFullLineupMessage(true);
      setTimeout(() => setShowFullLineupMessage(false), 2000);
      return;
    }

    // Constrain to field boundaries
    const constrainedX = Math.max(6, Math.min(94, fieldX));
    const constrainedY = Math.max(6, Math.min(94, fieldY));

    // Find the closest formation position to determine the role
    let closestPosition = lineupState.formation.positions[0];
    let minDistance = Infinity;

    for (const formationPos of lineupState.formation.positions) {
      const dx = formationPos.x - constrainedX;
      const dy = formationPos.y - constrainedY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestPosition = formationPos;
      }
    }

    // Add player with the dropped position and the role from the closest formation position
    addToLineup(playerId, {
      x: constrainedX,
      y: constrainedY,
      role: closestPosition.role,
      depth: closestPosition.depth,
    });
  };

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
            {/* Full Lineup Notification */}
            {showFullLineupMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl border border-red-400"
              >
                <p className="text-sm font-semibold whitespace-nowrap">
                  Must remove player from field before subbing on a replacement.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--verde)] hover:bg-[var(--verde)]/80 text-black font-semibold rounded-lg transition-colors"
                title="Copy shareable URL to clipboard"
              >
                {showCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                title="Reset positions to default for current formation"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {/* Field Container with Bench on Left */}
            <div className="flex gap-4 items-stretch justify-center">
              {/* Bench Area - Left Side (Portrait) */}
              <div className="flex-shrink-0 w-48 flex" data-bench-container>
                <div className="bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg p-2 flex flex-col w-full">
                  <div className="flex items-center gap-1 mb-2 justify-center flex-shrink-0">
                    <Users className="w-3 h-3 text-[var(--verde)]" />
                    <h3 className="font-display text-xs text-white">Bench</h3>
                  </div>

                  {/* Bench Players by Position (Portrait) */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {['GK', 'DEF', 'MID', 'FWD'].map((posGroup) => {
                      const groupPlayers = austinFCRoster.filter(p =>
                        lineupState.bench.includes(p.id) && p.positionGroup === posGroup
                      );

                      if (groupPlayers.length === 0) return null;

                      return (
                        <div key={posGroup}>
                          <div className="text-[9px] text-white/60 uppercase font-bold mb-1 text-center">
                            {posGroup}
                          </div>
                          <div className="grid grid-cols-2 gap-2 justify-items-center">
                            {groupPlayers.map((player) => (
                              <DraggableBenchPlayer
                                key={player.id}
                                player={player}
                                onDragToField={handleDragBenchToField}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Soccer Field - Right Side */}
              <div className="aspect-[2/3] w-full max-w-md" data-field-container>
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
