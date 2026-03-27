'use client';

import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { bettingActions } from '@/lib/store/slices/bettingSlice';

// Re-export type so existing consumers keep working
export type { BetSelection } from '@/lib/store/slices/bettingSlice';

/**
 * Passthrough — el Provider real es StoreProvider en el layout.
 * Se mantiene por compatibilidad con ScheduleView.
 */
export function BettingProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useBetting() {
  const dispatch = useAppDispatch();
  const selections = useAppSelector((s) => s.betting.selections);

  const totalOdds = useMemo(
    () => (selections.length === 0 ? 1 : selections.reduce((acc, s) => acc * s.value, 1)),
    [selections],
  );

  return {
    selections,
    toggleSelection: (bet: Parameters<typeof bettingActions.toggleSelection>[0]) =>
      dispatch(bettingActions.toggleSelection(bet)),
    removeSelection: (matchId: string) => dispatch(bettingActions.removeSelection(matchId)),
    clearSelections: () => dispatch(bettingActions.clearSelections()),
    isSelected: (matchId: string, outcomeKey: string) =>
      selections.some((s) => s.matchId === matchId && s.outcomeKey === outcomeKey),
    totalOdds,
  };
}
