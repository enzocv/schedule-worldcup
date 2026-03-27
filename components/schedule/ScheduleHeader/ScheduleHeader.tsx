'use client';

import React from 'react';
import { ScheduleViewMode } from '@/lib/types/schedule.types';
import { AgendaIcon, GridIcon, CalendarIcon } from '@/components/ui/Icon';
import styles from './ScheduleHeader.module.css';

// ─── Configuración de pestañas ────────────────────────────────

interface Tab {
  mode: ScheduleViewMode;
  label: string;
  Icon: React.ComponentType;
}

const TABS: Tab[] = [
  { mode: 'agenda', label: 'Agenda', Icon: AgendaIcon },
  { mode: '3days', label: '3 Días', Icon: GridIcon },
  { mode: 'week', label: 'Semana', Icon: CalendarIcon },
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
