/**
 * Utilidades para manejo de fechas
 */

import { CalendarDay, CalendarMonth, MONTH_NAMES } from '../types/calendar.types';

/**
 * Obtiene el número de días en un mes específico
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Obtiene el primer día de la semana de un mes (0 = Domingo, 6 = Sábado)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Verifica si una fecha es fin de semana
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo o Sábado
}

/**
 * Formatea una fecha a string ISO (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parsea una fecha ISO a objeto Date
 */
export function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formatea una hora a string (HH:mm)
 */
export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Parsea una hora string (HH:mm) a objeto { hours, minutes }
 */
export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Compara dos fechas (solo día, mes, año)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Genera un array de días para un mes específico
 */
export function generateMonthDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);

  // Días del mes anterior (para completar la primera semana)
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, dayNumber);
    days.push({
      date,
      dayNumber,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      events: [],
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      events: [],
    });
  }

  // Días del mes siguiente (para completar la última semana)
  const remainingDays = 42 - days.length; // 6 semanas * 7 días
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      events: [],
    });
  }

  return days;
}

/**
 * Genera datos completos del mes para el calendario
 */
export function generateCalendarMonth(year: number, month: number): CalendarMonth {
  const days = generateMonthDays(year, month);
  const weeksInMonth = Math.ceil(days.length / 7);

  return {
    year,
    month,
    monthName: MONTH_NAMES[month],
    days,
    weeksInMonth,
  };
}

/**
 * Obtiene el mes anterior
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
}

/**
 * Obtiene el mes siguiente
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
}

/**
 * Formatea una fecha para mostrar (ej: "15 de Marzo, 2024")
 */
export function formatDateForDisplay(date: Date, locale: string = 'es-ES'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
