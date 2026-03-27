'use client';

import React, { useState } from 'react';
import { SportMatch } from '@/lib/types/schedule.types';
import { useBetting } from '@/lib/store/hooks';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, GlobeIcon } from '@/components/ui/Icon';
import LiveBanner from '../LiveBanner/LiveBanner';
import MetaRow from './MetaRow';
import { MARKET_BADGES } from './MatchCard.constants';
import styles from './MatchCard.module.css';

// ─── Props principales ────────────────────────────────────────

export interface MatchCardProps {
  match: SportMatch;
  /** cards del día de hoy arrancan expandidas por defecto */
  isToday?: boolean;
  /** true → vista compacta para vistas de 3 días / semana */
  compact?: boolean;
  /** true → siempre expandido, sin opción de colapsar */
  alwaysExpanded?: boolean;
  /** callback para cerrar el modal padre — si se pasa, muestra el botón X */
  onClose?: () => void;
}

// ─── Componente ────────────────────────────────────────────

export default function MatchCard({ match, isToday = false, compact = false, alwaysExpanded = false, onClose }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(isToday || Boolean(match.isLive) || alwaysExpanded);
  const { toggleSelection, isSelected } = useBetting();

  const isExpandable = !alwaysExpanded;

  const matchLabel = `${match.homeTeam.name} vs ${match.awayTeam.name}`;

  // ── Vista compacta (3 Días / Semana) ─────────────────────
  if (compact) {
    return (
      <div className={styles.compact}>
        <div className={styles.compactRow1}>
          <span className={styles.compactTeams}>
            {match.homeTeam.name} vs {match.awayTeam.name}
          </span>
          <span className={styles.phaseBadge}>{match.phase}</span>
        </div>
        <div className={styles.compactRow2}>
          <span className={styles.metaTime}>
            <ClockIcon />
            <span>{match.time}</span>
          </span>
          <span className={styles.metaComp}>
            <GlobeIcon />
            <span>{match.competition}</span>
          </span>
        </div>
      </div>
    );
  }

  // ── Vista agenda (toggle expand/collapse) ─────────────────
  return (
    <article className={styles.card}>
      {onClose && (
        <div className={styles.headerWrapModalEvent}>
          {match.isLive && match.liveStream && (
            <div className={`${styles.liveBannerWrap}${alwaysExpanded ? ' liveBannerWrapModal' : ''}`}>
              <LiveBanner label={match.liveStream.label} />
            </div>
          )}
          <button
            type="button"
            className={styles.closeBtnHeader}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
      {!onClose && match.isLive && match.liveStream && (
        <div className={styles.liveBannerWrap}>
          <LiveBanner label={match.liveStream.label} />
        </div>
      )}
      <div
        className={`${styles.cardHeader} ${!isExpandable ? styles.cardHeaderStatic : ''}`}
        role={isExpandable ? 'button' : undefined}
        tabIndex={isExpandable ? 0 : undefined}
        onClick={() => isExpandable && setIsExpanded((prev) => !prev)}
        onKeyDown={(e) => isExpandable && e.key === 'Enter' && setIsExpanded((prev) => !prev)}
        aria-expanded={isExpandable ? isExpanded : undefined}
        aria-controls={isExpandable ? `match-body-${match.id}` : undefined}
      >
        <div className={styles.cardMain}>
          <div className={styles.row1}>
            <span className={styles.teams}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </span>
            <span className={styles.phaseBadge}>{match.phase}</span>
          </div>
          <MetaRow time={match.time} competition={match.competition} isLive={match.isLive} />
        </div>
        {isExpandable && (
          <span className={styles.chevron} aria-hidden="true">
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        )}
      </div>

      {isExpanded && (
        <div id={`match-body-${match.id}`} className={styles.cardBody}>
          <div className={styles.teamsDetail} style={{ paddingTop: 'var(--spacing-2)' }}>
            <div className={styles.teamRow}>
              {match.homeTeam.flagEmoji && (
                <span className={styles.flag}>{match.homeTeam.flagEmoji}</span>
              )}
              <span className={styles.teamName}>{match.homeTeam.name}</span>
            </div>
            <div className={styles.teamRow}>
              {match.awayTeam.flagEmoji && (
                <span className={styles.flag}>{match.awayTeam.flagEmoji}</span>
              )}
              <span className={styles.teamName}>{match.awayTeam.name}</span>
            </div>
          </div>

          {match.odds ? (
            <div className={styles.oddsSection}>
              <div className={styles.oddsHeader}>
                <span className={styles.oddsTitle}>Resultado del partido (1x2)</span>
                {MARKET_BADGES.filter((b) => b.hideWhenLive && !match.isLive).map((badge) => (
                  <span key={badge.label} className={`${styles.iconBadge} ${styles[badge.styleKey]}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
              <div className={styles.oddsGrid}>
                {(
                  [
                    { key: 'homeWin', data: match.odds.homeWin },
                    { key: 'draw',    data: match.odds.draw    },
                    { key: 'awayWin', data: match.odds.awayWin },
                  ] as const
                ).map(({ key, data }) => {
                  const selected = isSelected(match.id, key);
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.oddCell} ${selected ? styles.oddCellSelected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection({
                          matchId: match.id,
                          outcomeKey: key,
                          label: data.label,
                          value: data.value,
                          matchLabel,
                          date: match.date,
                          time: match.time,
                          competition: match.competition,
                          phase: match.phase,
                        });
                      }}
                      aria-pressed={selected}
                      aria-label={`${data.label} ${data.value.toFixed(2)}`}
                    >
                      <span className={styles.oddValue}>{data.value.toFixed(2)}</span>
                      <span className={styles.oddLabel}>{data.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className={styles.oddsDots} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={i === 0 ? styles.oddsDotsActive : styles.oddsDot}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.oddsUnavailable}>Cuotas no disponibles aún</p>
          )}
        </div>
      )}
    </article>
  );
}
