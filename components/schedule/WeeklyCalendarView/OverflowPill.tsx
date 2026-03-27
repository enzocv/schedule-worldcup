import React from 'react';
import styles from './WeeklyCalendarView.module.css';

interface OverflowPillProps {
  count: number;
  topPx: number;
  onClick: () => void;
}

export default function OverflowPill({ count, topPx, onClick }: OverflowPillProps) {
  return (
    <button
      type="button"
      className={styles.overflowPill}
      style={{ top: `${topPx}px` }}
      onClick={onClick}
      aria-label={`Ver ${count} eventos`}
    >
      <span className={styles.overflowCount}>{count}</span>
      <span className={styles.overflowLabel}>Eventos</span>
    </button>
  );
}
