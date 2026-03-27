/**
 * Tipos y definiciones para el calendario
 */

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: string[]; // Array de IDs de eventos
}
