'use client';

import React from 'react';
import { DaySchedule, ScheduleViewMode } from '../types/schedule.types';
import DayGroup from '@/components/schedule/DayGroup/DayGroup';
import WeeklyCalendarView from '@/components/schedule/WeeklyCalendarView';

// ─── Context passed to every strategy ────────────────────────

export interface ViewStrategyContext {
  daySchedules: DaySchedule[];
  currentDate: Date;
  todayKey: string;
  /** CSS class for the outer list wrapper. Only used by list-based strategies. */
  listClassName?: string;
}

// ─── Interface ────────────────────────────────────────────────
//
// Each view mode is an independent strategy. Adding a new mode
// (e.g. 'month') means creating a new strategy object and
// registering it in VIEW_STRATEGIES — the ScheduleView component
// never needs to be touched.

export interface ViewStrategy {
  readonly mode: ScheduleViewMode;
  renderSchedule(ctx: ViewStrategyContext): React.ReactNode;
}

// ─── Concrete strategies ──────────────────────────────────────

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

// ─── Registry ────────────────────────────────────────────────

export const VIEW_STRATEGIES: Record<ScheduleViewMode, ViewStrategy> = {
  agenda: agendaStrategy,
  '3days': threeDaysStrategy,
  week: weekStrategy,
};
