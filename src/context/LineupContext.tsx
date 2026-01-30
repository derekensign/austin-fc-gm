'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { austinFCRoster, type AustinFCPlayer } from '@/data/austin-fc-roster';
import { getDefaultFormation, getFormationById, type FormationPreset } from '@/data/formations';

/**
 * Player role within the formation
 * Defines tactical instructions for individual players
 */
export type PlayerRole = 'Balanced' | 'Stay Back' | 'Get Forward' | 'Stay Central' | 'Free Roam';

/**
 * Position of a player on the field
 */
export interface PlayerPosition {
  x: number;           // 0-100 (percentage of field width)
  y: number;           // 0-100 (percentage of field height)
  role: string;        // 'ST', 'CAM', 'CDM', 'RW', etc.
  depth: number;       // 0-10 for z-index layering
}

/**
 * Tactical settings for the lineup
 */
export interface TacticsSettings {
  defensiveLineHeight: number;  // 0-100
  teamWidth: number;             // 0-100
  pressingIntensity: number;     // 0-100
}

/**
 * Complete lineup state
 */
export interface LineupState {
  formation: FormationPreset;
  positions: Map<number, PlayerPosition>; // playerId -> position
  startingXI: number[];                   // 11 player IDs
  bench: number[];                        // Remaining players
  tactics: TacticsSettings;
  playerRoles: Map<number, PlayerRole>;
  lastRemovedPosition: PlayerPosition | null; // Track last removed player position for smart substitution
}

/**
 * Context type for lineup management
 */
interface LineupContextType {
  lineupState: LineupState;
  setFormation: (formationId: string) => void;
  setPlayerPosition: (playerId: number, position: PlayerPosition) => void;
  swapPlayers: (id1: number, id2: number) => void;
  addToLineup: (playerId: number, position?: PlayerPosition) => void;
  removeFromLineup: (playerId: number) => void;
  updateTactics: (tactics: Partial<TacticsSettings>) => void;
  setPlayerRole: (playerId: number, role: PlayerRole) => void;
  resetToDefault: () => void;
  getShareableUrl: () => string;
}

const LineupContext = createContext<LineupContextType | null>(null);

/**
 * Auto-fill starting XI based on formation and player data
 * Prioritizes DPs, U22s, then by position match
 */
function autoFillStartingXI(formation: FormationPreset): { startingXI: number[], positions: Map<number, PlayerPosition> } {
  const positions = new Map<number, PlayerPosition>();
  const startingXI: number[] = [];
  const availablePlayers = [...austinFCRoster];

  // Priority scoring function
  const getPlayerScore = (player: AustinFCPlayer, suggestedPosition: string): number => {
    let score = 0;

    // Preferred starters (highest priority)
    const preferredStarters: Record<string, number[]> = {
      'LB': [20],  // Rosales
      'CB': [5],   // Hines-Ike for RCB
      'CDM': [16, 12],  // Dubersarsky, Sánchez (defensive midfielders)
      'CM': [13, 17, 14, 19],  // Pereira, Burton, Sabovic, Ervin Torres (central)
      'CAM': [18],  // Wolff (attacking midfielder)
      'ST': [24, 23],  // Uzuni first (Vazquez injured), then Vazquez
      'LW': [21],  // Nelson at left wing
      'LM': [21],  // Nelson at left midfield
    };

    const preferredList = preferredStarters[suggestedPosition];
    if (preferredList) {
      const index = preferredList.indexOf(player.id);
      if (index !== -1) {
        // Give higher score to players earlier in the list
        // First player gets 50000, second gets 49000, etc.
        score += 50000 - (index * 1000);
      }
    }

    // Position match (highest priority)
    if (player.position === suggestedPosition) {
      score += 10000; // Exact position match is critical
    } else if (player.positionGroup === getPositionGroup(suggestedPosition)) {
      score += 100; // Position group match is fallback
    }

    // Designation priority
    if (player.designation === 'DP') score += 50;
    else if (player.designation === 'U22') score += 30;

    // Salary indicates importance/quality
    score += (player.baseSalary || 0) / 10000;

    // Market value
    score += (player.marketValue || 0) / 10000;

    return score;
  };

  // ALWAYS fill goalkeeper first (critical position)
  const gkPosition = formation.positions.find(p => p.suggestedPlayerPosition === 'GK');
  if (gkPosition) {
    const goalkeeper = availablePlayers.find(p => p.positionGroup === 'GK');
    if (goalkeeper) {
      startingXI.push(goalkeeper.id);
      positions.set(goalkeeper.id, {
        x: gkPosition.x,
        y: gkPosition.y,
        role: gkPosition.role,
        depth: gkPosition.depth,
      });
      const gkIndex = availablePlayers.indexOf(goalkeeper);
      availablePlayers.splice(gkIndex, 1);
    }
  }

  // Fill each remaining formation position
  for (const formationPos of formation.positions) {
    // Skip GK position (already filled)
    if (formationPos.suggestedPlayerPosition === 'GK') continue;
    // Find best available player for this position
    let bestPlayer: AustinFCPlayer | null = null;
    let bestScore = -1;
    let bestIndex = -1;

    for (let i = 0; i < availablePlayers.length; i++) {
      const player = availablePlayers[i];
      const score = getPlayerScore(player, formationPos.suggestedPlayerPosition);

      if (score > bestScore) {
        bestScore = score;
        bestPlayer = player;
        bestIndex = i;
      }
    }

    if (bestPlayer && bestIndex !== -1) {
      startingXI.push(bestPlayer.id);
      positions.set(bestPlayer.id, {
        x: formationPos.x,
        y: formationPos.y,
        role: formationPos.role,
        depth: formationPos.depth,
      });
      availablePlayers.splice(bestIndex, 1);
    }
  }

  return { startingXI, positions };
}

/**
 * Get position group from position string
 */
function getPositionGroup(position: string): string {
  if (position === 'GK') return 'GK';
  if (['RB', 'LB', 'CB', 'RWB', 'LWB', 'RCB', 'LCB'].includes(position)) return 'DEF';
  if (['CDM', 'CM', 'CAM', 'RM', 'LM', 'RCM', 'LCM', 'RCDM', 'LCDM', 'RAM', 'LAM'].includes(position)) return 'MID';
  return 'FWD';
}

/**
 * Create initial lineup state
 */
function createInitialLineup(): LineupState {
  const formation = getDefaultFormation();
  const { startingXI, positions } = autoFillStartingXI(formation);
  const bench = austinFCRoster
    .filter(p => !startingXI.includes(p.id))
    .map(p => p.id);

  return {
    formation,
    positions,
    startingXI,
    bench,
    tactics: {
      defensiveLineHeight: 50,
      teamWidth: 50,
      pressingIntensity: 50,
    },
    playerRoles: new Map(),
    lastRemovedPosition: null,
  };
}

/**
 * Serialize lineup state to URL-safe string
 */
function serializeLineup(state: LineupState): string {
  const data = {
    f: state.formation.id, // formation
    p: Array.from(state.startingXI), // players
    t: state.tactics, // tactics
    pos: Array.from(state.positions.entries()).map(([id, pos]) => ({
      i: id,
      x: Math.round(pos.x * 10) / 10,
      y: Math.round(pos.y * 10) / 10,
      r: pos.role,
      d: pos.depth,
    })),
  };
  return btoa(JSON.stringify(data));
}

/**
 * Deserialize lineup state from URL-safe string
 */
function deserializeLineup(encoded: string): Partial<LineupState> | null {
  try {
    const data = JSON.parse(atob(encoded));
    const formation = getFormationById(data.f);
    if (!formation) return null;

    const positions = new Map<number, PlayerPosition>(
      data.pos.map((p: any) => [p.i, { x: p.x, y: p.y, role: p.r, depth: p.d }])
    );

    return {
      formation,
      startingXI: data.p,
      bench: austinFCRoster.filter(p => !data.p.includes(p.id)).map(p => p.id),
      tactics: data.t,
      positions,
    };
  } catch (e) {
    console.error('Failed to deserialize lineup:', e);
    return null;
  }
}

export function LineupProvider({ children }: { children: ReactNode }) {
  const [lineupState, setLineupState] = useState<LineupState>(() => {
    // Try to load from URL on initial mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('lineup');
      if (encoded) {
        const decoded = deserializeLineup(encoded);
        if (decoded) {
          return {
            ...createInitialLineup(),
            ...decoded,
            lastRemovedPosition: null,
          };
        }
      }
    }
    return createInitialLineup();
  });

  // Set formation and auto-fill positions
  const setFormation = useCallback((formationId: string) => {
    const formation = getFormationById(formationId);
    if (!formation) return;

    const { startingXI, positions } = autoFillStartingXI(formation);
    const bench = austinFCRoster
      .filter(p => !startingXI.includes(p.id))
      .map(p => p.id);

    setLineupState(prev => ({
      ...prev,
      formation,
      positions,
      startingXI,
      bench,
      // Reset tactics to neutral when changing formations
      tactics: {
        defensiveLineHeight: 50,
        teamWidth: 50,
        pressingIntensity: 50,
      },
      lastRemovedPosition: null, // Clear on formation change
    }));
  }, []);

  // Update individual player position
  const setPlayerPosition = useCallback((playerId: number, position: PlayerPosition) => {
    setLineupState(prev => {
      const newPositions = new Map(prev.positions);
      newPositions.set(playerId, position);
      return {
        ...prev,
        positions: newPositions,
      };
    });
  }, []);

  // Swap two players
  const swapPlayers = useCallback((id1: number, id2: number) => {
    setLineupState(prev => {
      const pos1 = prev.positions.get(id1);
      const pos2 = prev.positions.get(id2);

      if (!pos1 || !pos2) return prev;

      const newPositions = new Map(prev.positions);
      newPositions.set(id1, pos2);
      newPositions.set(id2, pos1);

      return {
        ...prev,
        positions: newPositions,
      };
    });
  }, []);

  // Add player to lineup from bench
  const addToLineup = useCallback((playerId: number, position?: PlayerPosition) => {
    setLineupState(prev => {
      // Check if already in lineup or already have 11
      if (prev.startingXI.includes(playerId) || prev.startingXI.length >= 11) {
        return prev;
      }

      const newStartingXI = [...prev.startingXI, playerId];
      const newBench = prev.bench.filter(id => id !== playerId);
      const newPositions = new Map(prev.positions);

      // Use provided position, or lastRemovedPosition, or default to center field
      if (position) {
        newPositions.set(playerId, position);
      } else if (prev.lastRemovedPosition) {
        // Use the position of the last removed player (smart substitution)
        newPositions.set(playerId, prev.lastRemovedPosition);
      } else {
        newPositions.set(playerId, {
          x: 50,
          y: 50,
          role: 'SUB',
          depth: 5,
        });
      }

      return {
        ...prev,
        startingXI: newStartingXI,
        bench: newBench,
        positions: newPositions,
        lastRemovedPosition: null, // Clear after using
      };
    });
  }, []);

  // Remove player from lineup to bench
  const removeFromLineup = useCallback((playerId: number) => {
    setLineupState(prev => {
      if (!prev.startingXI.includes(playerId)) {
        return prev;
      }

      // Save the position before removing
      const removedPosition = prev.positions.get(playerId) || null;

      const newStartingXI = prev.startingXI.filter(id => id !== playerId);
      const newBench = [...prev.bench, playerId];
      const newPositions = new Map(prev.positions);
      newPositions.delete(playerId);

      return {
        ...prev,
        startingXI: newStartingXI,
        bench: newBench,
        positions: newPositions,
        lastRemovedPosition: removedPosition,
      };
    });
  }, []);

  // Update tactics settings
  const updateTactics = useCallback((tactics: Partial<TacticsSettings>) => {
    setLineupState(prev => ({
      ...prev,
      tactics: {
        ...prev.tactics,
        ...tactics,
      },
    }));
  }, []);

  // Set player role
  const setPlayerRole = useCallback((playerId: number, role: PlayerRole) => {
    setLineupState(prev => {
      const newPlayerRoles = new Map(prev.playerRoles);
      newPlayerRoles.set(playerId, role);
      return {
        ...prev,
        playerRoles: newPlayerRoles,
      };
    });
  }, []);

  // Reset to default positions for current formation
  const resetToDefault = useCallback(() => {
    setLineupState(prev => {
      const { startingXI, positions } = autoFillStartingXI(prev.formation);
      const bench = austinFCRoster
        .filter(p => !startingXI.includes(p.id))
        .map(p => p.id);

      return {
        ...prev,
        positions,
        startingXI,
        bench,
        lastRemovedPosition: null, // Clear on reset
      };
    });
  }, []);

  // Generate shareable URL
  const getShareableUrl = useCallback(() => {
    const encoded = serializeLineup(lineupState);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    return `${baseUrl}?lineup=${encoded}`;
  }, [lineupState]);

  const value = useMemo(() => ({
    lineupState,
    setFormation,
    setPlayerPosition,
    swapPlayers,
    addToLineup,
    removeFromLineup,
    updateTactics,
    setPlayerRole,
    resetToDefault,
    getShareableUrl,
  }), [
    lineupState,
    setFormation,
    setPlayerPosition,
    swapPlayers,
    addToLineup,
    removeFromLineup,
    updateTactics,
    setPlayerRole,
    resetToDefault,
    getShareableUrl,
  ]);

  return (
    <LineupContext.Provider value={value}>
      {children}
    </LineupContext.Provider>
  );
}

export function useLineup() {
  const context = useContext(LineupContext);
  if (!context) {
    throw new Error('useLineup must be used within a LineupProvider');
  }
  return context;
}
