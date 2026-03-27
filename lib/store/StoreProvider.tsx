'use client';

import React, { useEffect, useRef } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { eventsActions } from './slices/eventsSlice';
import { useAppSelector } from './hooks';
import type { AppDispatch } from './store';

const STORAGE_KEY = 'calendario_events';

// Hydrates events from localStorage on first mount
function EventsHydrator() {
  const dispatch = useDispatch<AppDispatch>();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch(eventsActions.setEvents(JSON.parse(stored)));
    } catch {
      // ignore malformed data
    }
  }, [dispatch]);

  return null;
}

// Persists events to localStorage whenever the slice changes
function EventsPersistor() {
  const events = useAppSelector((s) => s.events.events);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <EventsHydrator />
      <EventsPersistor />
      {children}
    </Provider>
  );
}
