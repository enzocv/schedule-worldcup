'use client';

import React from 'react';
import { DaySchedule, ScheduleViewMode } from '../types/schedule.types';
import DayGroup from '@/components/schedule/DayGroup/DayGroup';
import WeeklyCalendarView from '@/components/schedule/WeeklyCalendarView';

// Contexto que recibe cada estrategia

export interface ViewStrategyContext {
  daySchedules: DaySchedule[];
  currentDate: Date;
  todayKey: string;
  /** Clase CSS del wrapper exterior. Solo la usan estrategias basadas en lista. */
  listClassName?: string;
}

// Interfaz de estrategia de vista.
// Añadir un nuevo modo (ej. 'month') solo requiere crear un nuevo objeto
// y registrarlo en VIEW_STRATEGIES; ScheduleView no necesita cambios.

export interface ViewStrategy {
  readonly mode: ScheduleViewMode;
  renderSchedule(ctx: ViewStrategyContext): React.ReactNode;
}

// Estrategias concretas

const agendaStrategy: ViewStrategy = {
  mode: 'agenda',
  renderSchedule: ({ daySchedules, listClassName }) => (
    <div
      className={listClassName}
      role="list"
      aria-label="Partidos por día"
    >
      {daySchedules.map((day) => (
        <DayGroup key={day.date} day={day} viewMode="agenda" />
      ))}
    </div>
  ),
};

const threeDaysStrategy: ViewStrategy = {
  mode: '3days',
  renderSchedule: ({ daySchedules, listClassName }) => (
    <div
      className={listClassName}
      role="list"
      aria-label="Partidos por día"
    >
      {daySchedules.map((day) => (
        <DayGroup key={day.date} day={day} viewMode="3days" />
      ))}
    </div>
  ),
};

const weekStrategy: ViewStrategy = {
  mode: 'week',
  renderSchedule: ({ daySchedules, currentDate, todayKey }) => (
    <WeeklyCalendarView
      daySchedules={daySchedules}
      currentDate={currentDate}
      todayKey={todayKey}
    />
  ),
};

// Registro de estrategias

export const VIEW_STRATEGIES: Record<ScheduleViewMode, ViewStrategy> = {
  agenda: agendaStrategy,
  '3days': threeDaysStrategy,
  week: weekStrategy,
};
