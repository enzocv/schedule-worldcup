/**
 * Tipos y definiciones para eventos del calendario
 */

export type EventCategory = 'work' | 'personal' | 'meeting' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  category: EventCategory;
  color?: string; // Color personalizado opcional
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
}

export interface EventValidationError {
  field: keyof EventFormData;
  message: string;
}

export type EventAction =
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_EVENTS'; payload: CalendarEvent[] };
