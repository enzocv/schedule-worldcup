'use client';

import React, { useState } from 'react';
import { useSchedule } from '@/lib/hooks/useSchedule';
import { SportMatch } from '@/lib/types/schedule.types';
import { useBetting } from '@/lib/context/BettingContext';
import AppBar from '../AppBar/AppBar';
import ScheduleHeader from '../ScheduleHeader/ScheduleHeader';
import MonthHeader from '../MonthHeader/MonthHeader';
import DayGroup from '../DayGroup/DayGroup';
import WeeklyCalendarView from '../WeeklyCalendarView';
import BettingSlip from '../BettingSlip/BettingSlip';
import { CouponIcon } from '@/components/ui/Icon';
import styles from './ScheduleView.module.css';

// ─── Props ─────────────────────────────────────────────

export interface ScheduleViewProps {
  matches?: SportMatch[];
  tournamentName?: string;
  tournamentSubtitle?: string;
}

export default function ScheduleView({ matches, tournamentName, tournamentSubtitle }: ScheduleViewProps) {
  const [slipOpen, setSlipOpen] = useState(false);
  const { selections } = useBetting();

  const {
    viewMode,
    setViewMode,
    currentDate,
    currentMonthName,
    daySchedules,
    goToToday,
    todayKey,
  } = useSchedule({ matches });

  return (
    <div className={styles.container}>
      {/* Barra superior de la app */}
      <AppBar />

      {/* Header fijo del torneo */}
      <ScheduleHeader
        viewMode={viewMode}
        onTabChange={setViewMode}
        tournamentName={tournamentName}
        tournamentSubtitle={tournamentSubtitle}
      />

      {/* Contenido scrollable */}
      <main className={styles.main}>
        <MonthHeader monthName={currentMonthName} onToday={goToToday} />

        {viewMode === 'week' ? (
          <WeeklyCalendarView
            daySchedules={daySchedules}
            currentDate={currentDate}
            todayKey={todayKey}
          />
        ) : (
          <div className={styles.schedule} role="list" aria-label="Partidos por día">
            {daySchedules.length === 0 ? (
              <div className={styles.empty}>
                <p>No hay eventos para este período.</p>
              </div>
            ) : (
              daySchedules.map((day) => (
                <DayGroup key={day.date} day={day} viewMode={viewMode} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Botón flotante "Cupón" */}
      <button
        type="button"
        className={styles.couponBtn}
        aria-label={`Ver cupón${selections.length > 0 ? ` (${selections.length} selecciones)` : ''}`}
        onClick={() => setSlipOpen(true)}
      >
        <CouponIcon />
        <span>Cupón</span>
        {selections.length > 0 && (
          <span className={styles.couponBadge} aria-hidden="true">
            {selections.length}
          </span>
        )}
      </button>

      {/* Panel del cupón */}
      <BettingSlip isOpen={slipOpen} onClose={() => setSlipOpen(false)} />
    </div>
  );
}


