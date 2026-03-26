'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface BetSelection {
  matchId: string;
  outcomeKey: 'homeWin' | 'draw' | 'awayWin';
  /** Etiqueta de la selección, ej: "México" */
  label: string;
  /** Cuota, ej: 1.45 */
  value: number;
  /** "México vs Sudáfrica" */
  matchLabel: string;
  date: string;
  time: string;
  competition: string;
  phase: string;
}

interface BettingContextType {
  selections: BetSelection[];
  /** Agrega, cambia o quita una selección dentro del mismo partido */
  toggleSelection: (bet: BetSelection) => void;
  removeSelection: (matchId: string) => void;
  clearSelections: () => void;
  isSelected: (matchId: string, outcomeKey: string) => boolean;
  totalOdds: number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<BetSelection[]>([]);

  const toggleSelection = useCallback((bet: BetSelection) => {
    setSelections((prev) => {
      const idx = prev.findIndex((s) => s.matchId === bet.matchId);
      if (idx !== -1) {
        // Si es la misma cuota → quitar; si es diferente → reemplazar
        if (prev[idx].outcomeKey === bet.outcomeKey) {
          return prev.filter((_, i) => i !== idx);
        }
        return prev.map((s, i) => (i === idx ? bet : s));
      }
      return [...prev, bet];
    });
  }, []);

  const removeSelection = useCallback((matchId: string) => {
    setSelections((prev) => prev.filter((s) => s.matchId !== matchId));
  }, []);

  const clearSelections = useCallback(() => setSelections([]), []);

  const isSelected = useCallback(
    (matchId: string, outcomeKey: string) =>
      selections.some((s) => s.matchId === matchId && s.outcomeKey === outcomeKey),
    [selections],
  );

  const totalOdds = useMemo(
    () => selections.reduce((acc, s) => acc * s.value, 1),
    [selections],
  );

  return (
    <BettingContext.Provider
      value={{ selections, toggleSelection, removeSelection, clearSelections, isSelected, totalOdds }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const ctx = useContext(BettingContext);
  if (!ctx) throw new Error('useBetting must be used within BettingProvider');
  return ctx;
}
