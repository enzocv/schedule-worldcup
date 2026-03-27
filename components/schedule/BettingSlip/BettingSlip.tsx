'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '@/lib/store/hooks';
import styles from './BettingSlip.module.css';

// ─── Icons ────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function CouponIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────

export interface BettingSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTH_NAMES_SHORT[d.getMonth()]}`;
}

export default function BettingSlip({ isOpen, onClose }: BettingSlipProps) {
  const { selections, removeSelection, clearSelections, totalOdds } = useBetting();
  const [stake, setStake] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const stakeNum = parseFloat(stake) || 0;
  const potentialWin = stakeNum > 0 ? (stakeNum * totalOdds).toFixed(2) : '—';

  // Enfocar el input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className={styles.panel}
        role="dialog"
        aria-label="Cupón de apuestas"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <CouponIcon />
            <span className={styles.title}>Cupón</span>
            {selections.length > 0 && (
              <span className={styles.countBadge}>{selections.length}</span>
            )}
          </div>
          <div className={styles.headerRight}>
            {selections.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearSelections}
                aria-label="Borrar todas las selecciones"
              >
                <TrashIcon />
                <span>Borrar todo</span>
              </button>
            )}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Cerrar cupón"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className={styles.body}>
          {selections.length === 0 ? (
            <div className={styles.empty}>
              <CouponIcon />
              <p>Tu cupón está vacío</p>
              <span>Selecciona una cuota para comenzar</span>
            </div>
          ) : (
            <>
              {/* Lista de selecciones */}
              <div className={styles.selectionList}>
                {selections.map((sel) => (
                  <div key={sel.matchId} className={styles.selectionItem}>
                    <div className={styles.selectionInfo}>
                      <span className={styles.selectionMatch}>{sel.matchLabel}</span>
                      <span className={styles.selectionMeta}>
                        {formatDate(sel.date)} · {sel.time} · {sel.phase}
                      </span>
                      <span className={styles.selectionOutcome}>
                        Resultado (1x2): <strong>{sel.label}</strong>
                      </span>
                    </div>
                    <div className={styles.selectionRight}>
                      <span className={styles.selectionOdd}>{sel.value.toFixed(2)}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeSelection(sel.matchId)}
                        aria-label={`Quitar ${sel.matchLabel}`}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total de cuotas */}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Cuota total</span>
                <span className={styles.totalValue}>{totalOdds.toFixed(2)}</span>
              </div>

              {/* Stake */}
              <div className={styles.stakeSection}>
                <label className={styles.stakeLabel} htmlFor="stake-input">
                  Monto a apostar (S/)
                </label>
                <div className={styles.stakeInputWrapper}>
                  <span className={styles.stakePrefix}>S/</span>
                  <input
                    ref={inputRef}
                    id="stake-input"
                    type="number"
                    min="1"
                    step="0.50"
                    placeholder="0.00"
                    className={styles.stakeInput}
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                  />
                </div>
              </div>

              {/* Ganancia potencial */}
              <div className={styles.payoutRow}>
                <span className={styles.payoutLabel}>Ganancia potencial</span>
                <span className={styles.payoutValue}>
                  {stakeNum > 0 ? `S/ ${potentialWin}` : '—'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer con botón apostar */}
        {selections.length > 0 && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.betBtn}
              onClick={() => {
                alert(`Apuesta realizada: ${selections.length} evento(s) × S/ ${stake || 0} → S/ ${stakeNum > 0 ? potentialWin : 0}`);
                clearSelections();
                setStake('');
                onClose();
              }}
            >
              Realizar apuesta
            </button>
          </div>
        )}
      </div>
    </>
  );
}
