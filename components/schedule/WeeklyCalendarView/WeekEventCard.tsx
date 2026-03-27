import React from 'react';
import { SportMatch } from '@/lib/types/schedule.types';
import { GlobeIcon } from '@/components/ui/Icon';
import { HOUR_HEIGHT, timeToMinutes, abbrev } from './WeeklyCalendarView.utils';
import styles from './WeeklyCalendarView.module.css';

export interface WeekEventCardProps {
  match: SportMatch;
  onClick: (match: SportMatch) => void;
  grouped?: boolean;
}

export default function WeekEventCard({ match, onClick, grouped }: WeekEventCardProps) {
  const topPx = (timeToMinutes(match.time) / 60) * HOUR_HEIGHT;
  const isTbd = match.homeTeam.name === 'Por definir' && match.awayTeam.name === 'Por definir';

  if (isTbd) {
    return (
      <div
        className={`${styles.eventCard} ${styles.eventCardTbd} ${grouped ? styles.eventCardGrouped : ''}`}
        style={grouped ? undefined : { top: `${topPx}px` }}
        aria-label={`Partido por definir, ${match.phase}`}
      >
        <div className={styles.tbdIconRow}>
          <GlobeIcon size={13} />
        </div>
        <span className={styles.tbdTeam}>Por definir</span>
        <span className={styles.tbdTeam}>Por definir</span>
        <span className={styles.eventPhase}>{match.phase}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.eventCard} ${match.isLive ? styles.eventCardLive : ''} ${grouped ? styles.eventCardGrouped : ''}`}
      style={grouped ? undefined : { top: `${topPx}px` }}
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
