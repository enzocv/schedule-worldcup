'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ScheduleViewMode,
  DaySchedule,
  SportMatch,
} from '../types/schedule.types';
import { WORLDCUP_2026_MATCHES } from '../data/worldcup2026';
import { toDateKey } from '../utils/date.utils';
import { MONTH_NAMES_ES } from '../utils/locale';
import { IMatchRepository, StaticMatchRepository } from '../patterns/MatchRepository';

export interface UseScheduleOptions {
  /** Repositorio de partidos. Tiene prioridad sobre `matches`. */
  repository?: IMatchRepository;
  matches?: SportMatch[];
  initialViewMode?: ScheduleViewMode;
  /** Fecha inicial personalizada. Por defecto: primer partido del dataset. */
  initialDate?: Date;
}

export function useSchedule({
  repository,
  matches = WORLDCUP_2026_MATCHES,
  initialViewMode = 'agenda',
  initialDate,
}: UseScheduleOptions = {}) {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const repo = useMemo(
    () => repository ?? new StaticMatchRepository(matches),
    [repository, matches],
  );

  const [viewMode, setViewMode] = useState<ScheduleViewMode>(initialViewMode);
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (initialDate) return initialDate;
    const allMatches = repository?.getAll() ?? matches;
    const first = allMatches.at(0);
    if (first) return new Date(first.date + 'T00:00:00');
    return new Date();
  });

  // Nombre del mes actual
  const currentMonthName = useMemo(
    () => MONTH_NAMES_ES[currentDate.getMonth()],
    [currentDate],
  );

  // Todos los días agrupados
  const allDaySchedules = useMemo(
    () => repo.toDaySchedules(todayKey),
    [repo, todayKey],
  );

  // Días visibles según la vista y fecha actual
  const daySchedules = useMemo((): DaySchedule[] => {
    if (viewMode === 'agenda') return allDaySchedules;

    if (viewMode === '3days') {
      const startKey = toDateKey(currentDate);
      const startIdx = allDaySchedules.findIndex((d) => d.date >= startKey);
      if (startIdx === -1) return allDaySchedules.slice(0, 3);
      return allDaySchedules.slice(startIdx, startIdx + 3);
    }

    // week: lunes-domingo de la semana actual
    const d = new Date(currentDate);
    const dow = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const mondayKey = toDateKey(monday);
    const sundayKey = toDateKey(sunday);
    return allDaySchedules.filter(
      (ds) => ds.date >= mondayKey && ds.date <= sundayKey,
    );
  }, [allDaySchedules, viewMode, currentDate]);

  // Mes visible (toma el mes del primer día si hay)
  const visibleMonthName = useMemo(() => {
    if (daySchedules.length > 0) {
      const first = new Date(daySchedules[0].date + 'T00:00:00');
      return MONTH_NAMES_ES[first.getMonth()];
    }
    return currentMonthName;
  }, [daySchedules, currentMonthName]);

  // Navegación
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'agenda') d.setMonth(d.getMonth() - 1);
      else if (viewMode === '3days') d.setDate(d.getDate() - 3);
      else d.setDate(d.getDate() - 7);
      return d;
    });
  }, [viewMode]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'agenda') d.setMonth(d.getMonth() + 1);
      else if (viewMode === '3days') d.setDate(d.getDate() + 3);
      else d.setDate(d.getDate() + 7);
      return d;
    });
  }, [viewMode]);

  return {
    viewMode,
    setViewMode,
    currentDate,
    currentMonthName: visibleMonthName,
    daySchedules,
    goToToday,
    goToPrevious,
    goToNext,
    todayKey,
  };
}
