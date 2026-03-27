import React from 'react';
import styles from './LiveBanner.module.css';

export interface LiveBannerProps {
  label: string;
  onClick?: () => void;
}

export default function LiveBanner({ label, onClick }: LiveBannerProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={styles.banner}
        onClick={onClick}
        aria-label={`Transmisión en vivo: ${label}`}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </button>
    );
  }

  return (
    <div className={styles.banner}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
