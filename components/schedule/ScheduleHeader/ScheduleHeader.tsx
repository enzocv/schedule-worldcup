'use client';

import React from 'react';
import { ScheduleViewMode } from '@/lib/types/schedule.types';
import styles from './ScheduleHeader.module.css';

// ─── Inline SVG icons ─────────────────────────────────────────

function AgendaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ThreeDaysIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function WeekIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ─── Configuración de pestañas ────────────────────────────────

interface Tab {
  mode: ScheduleViewMode;
  label: string;
  Icon: () => React.ReactElement;
}

const TABS: Tab[] = [
  { mode: 'agenda', label: 'Agenda', Icon: AgendaIcon },
  { mode: '3days', label: '3 Días', Icon: ThreeDaysIcon },
  { mode: 'week', label: 'Semana', Icon: WeekIcon },
];

// ─── Props ────────────────────────────────────────────────────

export interface ScheduleHeaderProps {
  viewMode: ScheduleViewMode;
  onTabChange: (mode: ScheduleViewMode) => void;
  tournamentName?: string;
  tournamentSubtitle?: string;
}

// ─── Componente ───────────────────────────────────────────────

export default function ScheduleHeader({
  viewMode,
  onTabChange,
  tournamentName = 'FIFA 2026',
  tournamentSubtitle = 'WORLD CUP',
}: ScheduleHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {/* Logo del torneo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon} aria-hidden="true">⚽</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>{tournamentName}</span>
            <span className={styles.logoSubtitle}>{tournamentSubtitle}</span>
          </div>
        </div>

        {/* Pestañas de vista */}
        <nav className={styles.tabs} role="tablist" aria-label="Modo de vista del calendario">
          {TABS.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              role="tab"
              type="button"
              aria-selected={viewMode === mode}
              aria-label={label}
              className={`${styles.tab} ${viewMode === mode ? styles.tabActive : ''}`}
              onClick={() => onTabChange(mode)}
            >
              <Icon />
              <span className={styles.tabLabel}>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Franja decorativa de colores */}
      <div className={styles.gradientBar} aria-hidden="true" />
    </header>
  );
}
