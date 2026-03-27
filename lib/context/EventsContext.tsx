'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { eventsActions } from '@/lib/store/slices/eventsSlice';
import { CalendarEvent } from '../types/event.types';

/**
 * Passthrough — el Provider real es StoreProvider en el layout.
 * Se mantiene por compatibilidad con app/layout.tsx.
 */
export function EventsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

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
