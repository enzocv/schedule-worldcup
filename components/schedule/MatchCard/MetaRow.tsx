import React from 'react';
import { ClockIcon, GlobeIcon, BarChartIcon } from '@/components/ui/Icon';
import { MARKET_BADGES } from './MatchCard.constants';
import styles from './MatchCard.module.css';

interface MetaRowProps {
  time: string;
  competition: string;
  isLive?: boolean;
}

export default function MetaRow({ time, competition, isLive }: MetaRowProps) {
  const visibleBadges = MARKET_BADGES.filter((b) => !(b.hideWhenLive && isLive));

  return (
    <div className={styles.row2}>
      <span className={styles.metaTime}>
        <ClockIcon />
        <span>{time}</span>
      </span>
      <span className={styles.metaComp}>
        <GlobeIcon />
        <span>{competition}</span>
      </span>
      <div className={styles.actionIcons} aria-hidden="true">
        <span className={styles.iconBtn}><BarChartIcon /></span>
        {visibleBadges.map((badge) => (
          <span key={badge.label} className={`${styles.iconBadge} ${styles[badge.styleKey]}`}>
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
