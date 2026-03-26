'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DaySchedule, SportMatch } from '@/lib/types/schedule.types';
import Modal from '@/components/ui/Modal/Modal';
import MatchCard from '../MatchCard/MatchCard';
import styles from './WeeklyCalendarView.module.css';

// ─── Constants ────────────────────────────────────────────────

const HOUR_HEIGHT = 64; // px per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ─── Helpers ──────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

function formatHour(h: number): { label: string; period: string } {
  if (h === 0) return { label: '12:00', period: 'AM' };
  if (h < 12) return { label: `${h}:00`, period: 'AM' };
  if (h === 12) return { label: '12:00', period: 'PM' };
  return { label: `${h - 12}:00`, period: 'PM' };
}

function abbrev(name: string): string {
  return name.substring(0, 3).toUpperCase();
}

// ─── Types ────────────────────────────────────────────────────

interface WeekDay {
  dateKey: string;
  label: string;
  number: number;
  isToday: boolean;
  matches: SportMatch[];
}

// ─── Sub-components ───────────────────────────────────────────

interface EventCardProps {
  match: SportMatch;
  onClick: (match: SportMatch) => void;
}

function WeekEventCard({ match, onClick }: EventCardProps) {
  const topPx = (timeToMinutes(match.time) / 60) * HOUR_HEIGHT;

  return (
    <button
      type="button"
      className={`${styles.eventCard} ${match.isLive ? styles.eventCardLive : ''}`}
      style={{ top: `${topPx}px` }}
      aria-label={`Ver ${match.homeTeam.name} vs ${match.awayTeam.name}, ${match.time}`}
      onClick={() => onClick(match)}
    >
      <div className={styles.eventTeamRow}>
        {match.homeTeam.flagEmoji && (
          <span className={styles.eventFlag}>{match.homeTeam.flagEmoji}</span>
        )}
        <span className={styles.eventTeamName}>{abbrev(match.homeTeam.name)}</span>
        {match.result !== undefined && (
          <span className={styles.eventScore}>{match.result.homeScore}</span>
        )}
      </div>
      <div className={styles.eventTeamRow}>
        {match.awayTeam.flagEmoji && (
          <span className={styles.eventFlag}>{match.awayTeam.flagEmoji}</span>
        )}
        <span className={styles.eventTeamName}>{abbrev(match.awayTeam.name)}</span>
        {match.result !== undefined && (
          <span className={styles.eventScore}>{match.result.awayScore}</span>
        )}
      </div>
      <span className={styles.eventPhase}>{match.phase}</span>
    </button>
  );
}

// ─── Props ────────────────────────────────────────────────────

export interface WeeklyCalendarViewProps {
  daySchedules: DaySchedule[];
  currentDate: Date;
  todayKey: string;
}

// ─── Main component ───────────────────────────────────────────

export default function WeeklyCalendarView({
  daySchedules,
  currentDate,
  todayKey,
}: WeeklyCalendarViewProps) {
  const [now, setNow] = useState(() => new Date());
  const [selectedMatch, setSelectedMatch] = useState<SportMatch | null>(null);
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
            {weekDays.map((day) => (
              <div
                key={day.dateKey}
                className={`${styles.dayCol} ${day.isToday ? styles.dayColToday : ''}`}
              >
                {day.matches.map((match) => (
                  <WeekEventCard key={match.id} match={match} onClick={setSelectedMatch} />
                ))}
              </div>
            ))}
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
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setSelectedMatch(null)}
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <MatchCard
              match={selectedMatch}
              isToday={selectedMatch.date === todayKey}
              alwaysExpanded
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
