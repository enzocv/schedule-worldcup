'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CalendarEvent, EventAction } from '../types/event.types';

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

function eventsReducer(state: CalendarEvent[], action: EventAction): CalendarEvent[] {
  switch (action.type) {
    case 'ADD_EVENT':
      return [...state, action.payload];
    case 'UPDATE_EVENT':
      return state.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
    case 'DELETE_EVENT':
      return state.filter((event) => event.id !== action.payload);
    case 'SET_EVENTS':
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = 'calendario_events';

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, dispatch] = useReducer(eventsReducer, []);

  // Cargar eventos desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          dispatch({ type: 'SET_EVENTS', payload: parsedEvents });
        } catch (error) {
          console.error('Error parsing stored events:', error);
        }
      }
    }
  }, []);

  // Guardar eventos en localStorage cuando cambian
  useEffect(() => {
    if (typeof window !== 'undefined' && events.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const addEvent = (event: CalendarEvent) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  const updateEvent = (event: CalendarEvent) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  const getEventsByDate = (date: string): CalendarEvent[] => {
    return events.filter((event) => event.date === date);
  };

  const value: EventsContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents(): EventsContextType {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
