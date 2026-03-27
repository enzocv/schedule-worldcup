import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BetSelection {
  matchId: string;
  outcomeKey: 'homeWin' | 'draw' | 'awayWin';
  /** Etiqueta de la selección, ej: "México" */
  label: string;
  /** Cuota, ej: 1.45 */
  value: number;
  /** "México vs Sudáfrica" */
  matchLabel: string;
  date: string;
  time: string;
  competition: string;
  phase: string;
}

interface BettingState {
  selections: BetSelection[];
}

const initialState: BettingState = {
  selections: [],
};

export const bettingSlice = createSlice({
  name: 'betting',
  initialState,
  reducers: {
    toggleSelection(state, action: PayloadAction<BetSelection>) {
      const bet = action.payload;
      const idx = state.selections.findIndex((s) => s.matchId === bet.matchId);
      if (idx !== -1) {
        // Misma cuota → quitar; diferente → reemplazar
        if (state.selections[idx].outcomeKey === bet.outcomeKey) {
          state.selections.splice(idx, 1);
        } else {
          state.selections[idx] = bet;
        }
      } else {
        state.selections.push(bet);
      }
    },
    removeSelection(state, action: PayloadAction<string>) {
      state.selections = state.selections.filter((s) => s.matchId !== action.payload);
    },
    clearSelections(state) {
      state.selections = [];
    },
  },
});

export const bettingActions = bettingSlice.actions;
