'use client';

import React from 'react';
import { DaySchedule, ScheduleViewMode } from '@/lib/types/schedule.types';
import { MatchCardFactory, MatchCardVariant } from '@/lib/patterns/MatchCardFactory';
import styles from './DayGroup.module.css';

export interface DayGroupProps {
  day: DaySchedule;
  viewMode: ScheduleViewMode;
}

export default function DayGroup({ day, viewMode }: DayGroupProps) {
  const cardVariant: MatchCardVariant = viewMode === 'agenda' ? 'agenda' : 'compact';

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
        {day.matches.map((match) =>
          MatchCardFactory.create(cardVariant, { match, isToday: day.isToday })
        )}
      </div>
    </section>
  );
}
