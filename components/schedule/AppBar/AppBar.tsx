'use client';

import React from 'react';
import styles from './AppBar.module.css';

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export interface AppBarProps {
  balance?: number;
  bonus?: number;
  userInitial?: string;
}

export default function AppBar({
  balance = 200.0,
  bonus = 0.0,
  userInitial = 'A',
}: AppBarProps) {
  return (
    <div className={styles.bar}>
      {/* Logo */}
      <span className={styles.logo}>at</span>

      {/* Balance */}
      <div className={styles.balanceGroup}>
        <button className={styles.balanceBtn} type="button" aria-label="Ver balance">
          <span className={styles.balanceAmount}>S/ {balance.toFixed(2)}</span>
          <ChevronDownSmall />
        </button>
        <span className={styles.bonus}>
          <ChevronDownSmall />
          <span>Bono S/ {bonus.toFixed(2)}</span>
        </span>
      </div>

      {/* Acciones */}
      <div className={styles.actions}>
        <button className={styles.avatar} type="button" aria-label="Mi cuenta">
          {userInitial}
        </button>
        <button className={styles.rechargeBtn} type="button">
          Recargar
        </button>
        <button className={styles.menuBtn} type="button" aria-label="Menú">
          <MenuIcon />
        </button>
      </div>
    </div>
  );
}
