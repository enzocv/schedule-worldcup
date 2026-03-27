import { SportMatch } from '@/lib/types/schedule.types';
import type { BetSelection } from '@/lib/store/slices/bettingSlice';

// Partido base (sin cuotas ni en vivo)

export const matchBase: SportMatch = {
  id: 'match-test-1',
  homeTeam: { id: 'mex', name: 'México', flagEmoji: '🇲🇽' },
  awayTeam: { id: 'rsa', name: 'Sudáfrica', flagEmoji: '🇿🇦' },
  date: '2026-06-11',
  time: '14:00',
  competition: 'Copa Mundial 2026',
  phase: 'Grupo A',
};

// Partido con cuotas

export const matchWithOdds: SportMatch = {
  ...matchBase,
  odds: {
    homeWin: { label: 'México', value: 1.45 },
    draw: { label: 'Empate', value: 2.0 },
    awayWin: { label: 'Sudáfrica', value: 2.25 },
  },
};

// Partido en vivo

export const matchLive: SportMatch = {
  ...matchWithOdds,
  id: 'match-test-live',
  isLive: true,
  liveStream: { label: 'Mira aquí la transmisión con Jorge Luna' },
};

// Segundo partido (para tests de selección múltiple)

export const matchB: SportMatch = {
  id: 'match-test-2',
  homeTeam: { id: 'sui', name: 'Suecia', flagEmoji: '🇸🇪' },
  awayTeam: { id: 'nga', name: 'Nigeria', flagEmoji: '🇳🇬' },
  date: '2026-06-12',
  time: '17:00',
  competition: 'Copa Mundial 2026',
  phase: 'Grupo E',
};

// Selecciones pre-construidas

export const selectionMexico: BetSelection = {
  matchId: matchWithOdds.id,
  outcomeKey: 'homeWin',
  label: 'México',
  value: 1.45,
  matchLabel: 'México vs Sudáfrica',
  date: matchWithOdds.date,
  time: matchWithOdds.time,
  competition: matchWithOdds.competition,
  phase: matchWithOdds.phase,
};

export const selectionEmpate: BetSelection = {
  matchId: matchWithOdds.id,
  outcomeKey: 'draw',
  label: 'Empate',
  value: 2.0,
  matchLabel: 'México vs Sudáfrica',
  date: matchWithOdds.date,
  time: matchWithOdds.time,
  competition: matchWithOdds.competition,
  phase: matchWithOdds.phase,
};

export const selectionSuecia: BetSelection = {
  matchId: matchB.id,
  outcomeKey: 'homeWin',
  label: 'Suecia',
  value: 1.8,
  matchLabel: 'Suecia vs Nigeria',
  date: matchB.date,
  time: matchB.time,
  competition: matchB.competition,
  phase: matchB.phase,
};
