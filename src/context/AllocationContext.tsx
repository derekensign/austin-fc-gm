'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { 
  calculateAutoAllocation, 
  type AllocationState,
  type PlayerAllocation,
  isTAMEligible,
  getTrueBudgetCharge
} from '@/data/allocation-calculator';
import { austinFCRoster } from '@/data/austin-fc-roster';

interface AllocationContextType {
  allocationMode: 'auto' | 'manual';
  setAllocationMode: (mode: 'auto' | 'manual') => void;
  currentAllocation: AllocationState;
  handleAllocationChange: (playerId: number, type: 'tam' | 'gam', value: number) => void;
  resetToAuto: () => void;
}

const AllocationContext = createContext<AllocationContextType | null>(null);

export function AllocationProvider({ children }: { children: ReactNode }) {
  const [allocationMode, setAllocationMode] = useState<'auto' | 'manual'>('auto');
  const [manualAllocations, setManualAllocations] = useState<AllocationState>(() => 
    calculateAutoAllocation()
  );
  
  // Auto allocation (memoized)
  const autoAllocation = useMemo(() => calculateAutoAllocation(), []);
  
  // Current allocation state based on mode
  const currentAllocation = allocationMode === 'auto' ? autoAllocation : manualAllocations;
  
  // Handle mode change - reset manual to auto values when switching to manual
  const handleModeChange = useCallback((mode: 'auto' | 'manual') => {
    if (mode === 'manual' && allocationMode === 'auto') {
      // When switching to manual, start with auto values
      setManualAllocations(calculateAutoAllocation());
    }
    setAllocationMode(mode);
  }, [allocationMode]);
  
  // Handle manual allocation change
  const handleAllocationChange = useCallback((
    playerId: number, 
    type: 'tam' | 'gam', 
    value: number
  ) => {
    setManualAllocations(prev => {
      const player = austinFCRoster.find(p => p.id === playerId);
      if (!player) return prev;
      
      const existing = prev.allocations.get(playerId) || { playerId, tamApplied: 0, gamApplied: 0 };
      const currentTam = existing.tamApplied;
      const currentGam = existing.gamApplied;
      
      let newTam = currentTam;
      let newGam = currentGam;
      let newTamRemaining = prev.tamRemaining;
      let newGamRemaining = prev.gamRemaining;
      let newTamUsed = prev.tamUsed;
      let newGamUsed = prev.gamUsed;
      
      const trueCharge = getTrueBudgetCharge(player);
      
      if (type === 'tam') {
        if (!isTAMEligible(player)) return prev;
        // Clamp value to what's available
        const maxAllowable = currentTam + newTamRemaining;
        value = Math.min(value, maxAllowable, trueCharge);
        
        const delta = value - currentTam;
        newTamRemaining -= delta;
        newTamUsed += delta;
        newTam = value;
        
        // Reset GAM if applying TAM (no co-mingling)
        if (value > 0 && currentGam > 0) {
          newGamRemaining += currentGam;
          newGamUsed -= currentGam;
          newGam = 0;
        }
      } else {
        // Clamp value to what's available
        const maxAllowable = currentGam + newGamRemaining;
        value = Math.min(value, maxAllowable, trueCharge);
        
        const delta = value - currentGam;
        newGamRemaining -= delta;
        newGamUsed += delta;
        newGam = value;
        
        // Reset TAM if applying GAM (no co-mingling)
        if (value > 0 && currentTam > 0) {
          newTamRemaining += currentTam;
          newTamUsed -= currentTam;
          newTam = 0;
        }
      }
      
      const newAllocations = new Map(prev.allocations);
      newAllocations.set(playerId, { playerId, tamApplied: newTam, gamApplied: newGam });
      
      // Recalculate totals
      const totalBuydownApplied = Array.from(newAllocations.values())
        .reduce((sum, a) => sum + a.tamApplied + a.gamApplied, 0);
      
      return {
        allocations: newAllocations,
        tamRemaining: newTamRemaining,
        gamRemaining: newGamRemaining,
        tamUsed: newTamUsed,
        gamUsed: newGamUsed,
        totalBuydownNeeded: prev.totalBuydownNeeded,
        totalBuydownApplied,
        isCompliant: totalBuydownApplied >= prev.totalBuydownNeeded,
      };
    });
  }, []);
  
  // Reset to auto
  const resetToAuto = useCallback(() => {
    setManualAllocations(calculateAutoAllocation());
  }, []);
  
  const value = useMemo(() => ({
    allocationMode,
    setAllocationMode: handleModeChange,
    currentAllocation,
    handleAllocationChange,
    resetToAuto,
  }), [allocationMode, handleModeChange, currentAllocation, handleAllocationChange, resetToAuto]);
  
  return (
    <AllocationContext.Provider value={value}>
      {children}
    </AllocationContext.Provider>
  );
}

export function useAllocation() {
  const context = useContext(AllocationContext);
  if (!context) {
    throw new Error('useAllocation must be used within an AllocationProvider');
  }
  return context;
}

