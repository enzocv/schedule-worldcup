import React from 'react';
import styles from './MonthHeader.module.css';

export interface MonthHeaderProps {
  monthName: string;
  onToday: () => void;
}

export default function MonthHeader({ monthName, onToday }: MonthHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.month}>{monthName}</h2>
      <button
        className={styles.todayBtn}
        onClick={onToday}
        aria-label="Ir a hoy"
        type="button"
      >
        Hoy
      </button>
    </div>
  );
}
