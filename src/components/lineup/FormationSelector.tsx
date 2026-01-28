'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { allFormations, type FormationPreset } from '@/data/formations';
import { useLineup } from '@/context/LineupContext';

/**
 * Formation selector dropdown component
 */
export function FormationSelector() {
  const { lineupState, setFormation } = useLineup();
  const [isOpen, setIsOpen] = useState(false);

  const currentFormation = lineupState.formation;

  const handleFormationSelect = (formationId: string) => {
    setFormation(formationId);
    setIsOpen(false);
  };

  // Style badges
  const styleColors: Record<string, string> = {
    offensive: 'bg-red-500/20 text-red-400 border-red-500/50',
    balanced: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    defensive: 'bg-green-500/20 text-green-400 border-green-500/50',
  };

  return (
    <div className="relative">
      {/* Selected Formation Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg hover:border-[var(--verde)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-lg border bg-[var(--verde)]/20 border-[var(--verde)]"
          >
            <span
              className="font-display text-sm text-[var(--verde)]"
            >
              {currentFormation.shortName}
            </span>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{currentFormation.name}</p>
            <p className="text-white/60 text-xs capitalize">{currentFormation.style}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/60" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[var(--obsidian)] border border-[var(--obsidian-lighter)] rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
            >
              {allFormations.map((formation) => {
                const isSelected = formation.id === currentFormation.id;
                return (
                  <button
                    key={formation.id}
                    onClick={() => handleFormationSelect(formation.id)}
                    className={`w-full flex items-center gap-3 p-3 border-b border-[var(--obsidian-lighter)] last:border-b-0 transition-colors ${
                      isSelected
                        ? 'bg-[var(--verde)]/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Formation Badge */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
                        isSelected
                          ? 'bg-[var(--verde)]/20 border-[var(--verde)]'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <span
                        className={`font-display text-sm ${
                          isSelected ? 'text-[var(--verde)]' : 'text-white'
                        }`}
                      >
                        {formation.shortName}
                      </span>
                    </div>

                    {/* Formation Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">
                          {formation.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                            styleColors[formation.style]
                          }`}
                        >
                          {formation.style}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs mt-0.5">
                        {formation.description}
                      </p>
                    </div>

                    {/* Check Icon */}
                    {isSelected && (
                      <Check className="w-5 h-5 text-[var(--verde)] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
