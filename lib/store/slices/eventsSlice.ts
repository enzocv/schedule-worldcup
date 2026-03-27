import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from '@/lib/types/event.types';

interface EventsState {
  events: CalendarEvent[];
}

const initialState: EventsState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<CalendarEvent[]>) {
      state.events = action.payload;
    },
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.events.push(action.payload);
    },
    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      const idx = state.events.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.events[idx] = action.payload;
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
  },
});

export const eventsActions = eventsSlice.actions;
