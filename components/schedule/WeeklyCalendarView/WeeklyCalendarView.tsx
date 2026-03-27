'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DaySchedule, SportMatch } from '@/lib/types/schedule.types';
import Modal from '@/components/ui/Modal/Modal';
import { MatchCardFactory } from '@/lib/patterns/MatchCardFactory';
import { CloseIcon } from '@/components/ui/Icon';
import { toDateKey } from '@/lib/utils/date.utils';
import OverflowPill from './OverflowPill';
import WeekEventCard from './WeekEventCard';
import {
  HOUR_HEIGHT,
  HOURS,
  DAY_LABELS,
  OVERFLOW_THRESHOLD,
  timeToMinutes,
  formatHour,
} from './WeeklyCalendarView.utils';
import styles from './WeeklyCalendarView.module.css';

// Tipos

interface WeekDay {
  dateKey: string;
  label: string;
  number: number;
  isToday: boolean;
  matches: SportMatch[];
}

// Props

export interface WeeklyCalendarViewProps {
  daySchedules: DaySchedule[];
  currentDate: Date;
  todayKey: string;
}

// Componente principal

export default function WeeklyCalendarView({
  daySchedules,
  currentDate,
  todayKey,
}: WeeklyCalendarViewProps) {
  const [now, setNow] = useState(() => new Date());
  const [selectedMatch, setSelectedMatch] = useState<SportMatch | null>(null);
  const [dayEventsSheet, setDayEventsSheet] = useState<{ label: string; matches: SportMatch[] } | null>(null);
  const nowLineRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  // Refresh current time every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Scroll to current time on first render
  useEffect(() => {
    if (scrolledRef.current || !nowLineRef.current) return;
    nowLineRef.current.scrollIntoView({ block: 'center', behavior: 'instant' });
    scrolledRef.current = true;
  });

  // Build the 7 days of the current week (Mon → Sun)
  const weekDays = useMemo((): WeekDay[] => {
    const d = new Date(currentDate);
    const dow = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));

    const matchMap = new Map<string, SportMatch[]>();
    for (const ds of daySchedules) matchMap.set(ds.date, ds.matches);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const key = toDateKey(day);
      return {
        dateKey: key,
        label: DAY_LABELS[i],
        number: day.getDate(),
        isToday: key === todayKey,
        matches: matchMap.get(key) ?? [],
      };
    });
  }, [currentDate, daySchedules, todayKey]);

  const nowTopPx = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT;
  const isCurrentWeek = weekDays.some((d) => d.isToday);

  return (
    <div className={styles.wrapper}>
      {/* ── Sticky day-column header row ─────────────────────── */}
      <div className={styles.dayHeaderRow} aria-hidden="true">
        <div className={styles.timeCorner} />
        {weekDays.map((day) => (
          <div
            key={day.dateKey}
            className={`${styles.dayHeaderCell} ${day.isToday ? styles.dayHeaderCellToday : ''}`}
          >
            <span className={styles.dayLabel}>{day.label}</span>
            <span
              className={`${styles.dayNumber} ${day.isToday ? styles.dayNumberToday : ''}`}
            >
              {day.number}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main grid (time labels + day columns) ────────────── */}
      <div className={styles.gridRow}>
        {/* Time labels */}
        <div className={styles.timeLabels} aria-hidden="true">
          {HOURS.map((h) => {
            const { label, period } = formatHour(h);
            return (
              <div key={h} className={styles.timeLabelRow}>
                <span className={styles.timeLabel}>{label}</span>
                <span className={styles.timePeriod}>{period}</span>
              </div>
            );
          })}
        </div>

        {/* Days area: hour lines + columns + now indicator */}
        <div className={styles.daysArea}>
          {/* Hour lines */}
          <div className={styles.linesOverlay} aria-hidden="true">
            {HOURS.map((h) => (
              <div
                key={h}
                className={styles.hourLine}
                style={{ top: `${h * HOUR_HEIGHT}px` }}
              />
            ))}
          </div>

          {/* 7 day columns with events */}
          <div className={styles.daysGrid}>
            {weekDays.map((day) => {
              // Group matches by hour
              const byHour = new Map<number, SportMatch[]>();
              for (const match of day.matches) {
                const hour = Math.floor(timeToMinutes(match.time) / 60);
                const group = byHour.get(hour) ?? [];
                group.push(match);
                byHour.set(hour, group);
              }

              return (
                <div
                  key={day.dateKey}
                  className={`${styles.dayCol} ${day.isToday ? styles.dayColToday : ''}`}
                >
                  {Array.from(byHour.entries()).map(([hour, matches]) =>
                    matches.length > OVERFLOW_THRESHOLD ? (
                      <OverflowPill
                        key={hour}
                        count={matches.length}
                        topPx={hour * HOUR_HEIGHT}
                        onClick={() =>
                          setDayEventsSheet({
                            label: `${matches.length} eventos deportivos`,
                            matches,
                          })
                        }
                      />
                    ) : matches.length === 1 ? (
                      <WeekEventCard key={matches[0].id} match={matches[0]} onClick={setSelectedMatch} />
                    ) : (
                      <div
                        key={hour}
                        className={styles.eventCardRow}
                        style={{ top: `${(timeToMinutes(matches[0].time) / 60) * HOUR_HEIGHT}px` }}
                      >
                        {matches.map((match) => (
                          <WeekEventCard key={match.id} match={match} onClick={setSelectedMatch} grouped />
                        ))}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Current time indicator */}
          {isCurrentWeek && (
            <div
              ref={nowLineRef}
              className={styles.nowLine}
              style={{ top: `${nowTopPx}px` }}
              aria-hidden="true"
            >
              <span className={styles.nowDot} />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom sheet: todos los eventos del día ────────────── */}
      {dayEventsSheet && (
        <>
          <div
            className={styles.sheetBackdrop}
            onClick={() => setDayEventsSheet(null)}
            aria-hidden="true"
          />
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={dayEventsSheet.label}
          >
            <div className={styles.sheetHeader}>
              <span className={styles.sheetTitle}>{dayEventsSheet.label}</span>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={() => setDayEventsSheet(null)}
                aria-label="Cerrar"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className={styles.sheetList}>
              {dayEventsSheet.matches.map((match) =>
                MatchCardFactory.create('sheet', { match, isToday: match.date === todayKey })
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Match detail modal ──────────────────────────────── */}
      <Modal
        isOpen={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        showCloseButton={false}
        noPadding
        size="sm"
      >
        {selectedMatch && (
          <div className={styles.modalMatchWrap}>
            {MatchCardFactory.create('modal', {
              match: selectedMatch,
              isToday: selectedMatch.date === todayKey,
              onClose: () => setSelectedMatch(null),
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
