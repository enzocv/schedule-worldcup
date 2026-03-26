'use client';

import React from 'react';
import { DaySchedule, ScheduleViewMode } from '@/lib/types/schedule.types';
import MatchCard from '../MatchCard/MatchCard';
import styles from './DayGroup.module.css';

export interface DayGroupProps {
  day: DaySchedule;
  viewMode: ScheduleViewMode;
}

export default function DayGroup({ day, viewMode }: DayGroupProps) {
  const isCompact = viewMode !== 'agenda';

  return (
    <section
      className={styles.group}
      aria-label={`${day.dayLabel} ${day.dayNumber} de ${day.monthName}`}
    >
      {/* Columna izquierda: indicador de día */}
      <div className={styles.dayCol}>
        <span className={styles.dayName}>{day.dayLabel}</span>
        <span
          className={`${styles.dayNumber} ${day.isToday ? styles.dayNumberToday : ''}`}
          aria-current={day.isToday ? 'date' : undefined}
        >
          {day.dayNumber}
        </span>
      </div>

      {/* Columna derecha: lista de partidos */}
      <div className={styles.matchesCol}>
        {day.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            isToday={day.isToday}
            compact={isCompact}
          />
        ))}
      </div>
    </section>
  );
}
