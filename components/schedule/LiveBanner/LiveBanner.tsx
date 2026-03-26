import React from 'react';
import styles from './LiveBanner.module.css';

export interface LiveBannerProps {
  label: string;
  onClick?: () => void;
}

export default function LiveBanner({ label, onClick }: LiveBannerProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={styles.banner}
      onClick={onClick}
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      {...(onClick ? ({ type: 'button' } as any) : {})}
      aria-label={onClick ? `Transmisión en vivo: ${label}` : undefined}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </Tag>
  );
}
