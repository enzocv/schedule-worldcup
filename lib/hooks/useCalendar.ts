'use client';

import { useState, useMemo } from 'react';
import { CalendarMonth } from '../types/calendar.types';
import { generateCalendarMonth, getPreviousMonth, getNextMonth } from '../utils/date.utils';

export function useCalendar(initialDate?: Date) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date());

  const calendarMonth: CalendarMonth = useMemo(() => {
    return generateCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const goToPreviousMonth = () => {
    const { year, month } = getPreviousMonth(currentDate.getFullYear(), currentDate.getMonth());
    setCurrentDate(new Date(year, month, 1));
  };

  const goToNextMonth = () => {
    const { year, month } = getNextMonth(currentDate.getFullYear(), currentDate.getMonth());
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToDate = (date: Date) => {
    setCurrentDate(date);
  };

  return {
    calendarMonth,
    currentDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToDate,
  };
}
