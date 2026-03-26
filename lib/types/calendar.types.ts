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

export interface CalendarMonth {
  year: number;
  month: number; // 0-11 (Enero=0)
  monthName: string;
  days: CalendarDay[];
  weeksInMonth: number;
}

export interface CalendarViewState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: 'month' | 'week' | 'day';
}

export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const WEEK_DAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
