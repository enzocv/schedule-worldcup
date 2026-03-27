'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '@/lib/store/hooks';
import { CouponIcon, CloseIcon, TrashIcon } from '@/components/ui/Icon';
import { MONTH_NAMES_SHORT_ES } from '@/lib/utils/locale';
import styles from './BettingSlip.module.css';

// ─── Componente principal ─────────────────────────────────────

export interface BettingSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTH_NAMES_SHORT_ES[d.getMonth()]}`;
}

export default function BettingSlip({ isOpen, onClose }: BettingSlipProps) {
  const { selections, removeSelection, clearSelections, totalOdds } = useBetting();
  const [stake, setStake] = useState('');
  const [betPlaced, setBetPlaced] = useState(false);
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
            {betPlaced ? (
              <p className={styles.successMsg}>¡Apuesta realizada con éxito!</p>
            ) : (
              <button
                type="button"
                className={styles.betBtn}
                onClick={() => {
                  setBetPlaced(true);
                  clearSelections();
                  setStake('');
                  setTimeout(() => {
                    setBetPlaced(false);
                    onClose();
                  }, 1200);
                }}
              >
                Realizar apuesta
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
