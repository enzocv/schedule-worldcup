'use client';

import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { bettingActions, BetSelection } from './slices/bettingSlice';
import { eventsActions } from './slices/eventsSlice';
import { CalendarEvent } from '@/lib/types/event.types';

// Hooks base de RTK

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

// useBetting

export function useBetting() {
  const dispatch = useAppDispatch();
  const selections = useAppSelector((s) => s.betting.selections);

  const totalOdds = useMemo(
    () => (selections.length === 0 ? 1 : selections.reduce((acc, s) => acc * s.value, 1)),
    [selections],
  );

  return {
    selections,
    toggleSelection: (bet: BetSelection) => dispatch(bettingActions.toggleSelection(bet)),
    removeSelection: (matchId: string) => dispatch(bettingActions.removeSelection(matchId)),
    clearSelections: () => dispatch(bettingActions.clearSelections()),
    isSelected: (matchId: string, outcomeKey: string) =>
      selections.some((s) => s.matchId === matchId && s.outcomeKey === outcomeKey),
    totalOdds,
  };
}

// useEvents

export function useEvents() {
  const dispatch = useAppDispatch();
  const events = useAppSelector((s) => s.events.events);

  return {
    events,
    addEvent: (event: CalendarEvent) => dispatch(eventsActions.addEvent(event)),
    updateEvent: (event: CalendarEvent) => dispatch(eventsActions.updateEvent(event)),
    deleteEvent: (id: string) => dispatch(eventsActions.deleteEvent(id)),
    getEventsByDate: (date: string) => events.filter((e) => e.date === date),
  };
}

// Re-exportar BetSelection para consumidores externos

export type { BetSelection };
