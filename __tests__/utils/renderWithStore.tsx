import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { bettingSlice } from '@/lib/store/slices/bettingSlice';
import { eventsSlice } from '@/lib/store/slices/eventsSlice';
import type { BetSelection } from '@/lib/store/slices/bettingSlice';

// ─── Fresh store factory ──────────────────────────────────────
// Always creates a new isolated store so tests never share state.

export function makeTestStore(preloadedSelections: BetSelection[] = []) {
  return configureStore({
    reducer: {
      betting: bettingSlice.reducer,
      events: eventsSlice.reducer,
    },
    preloadedState: {
      betting: { selections: preloadedSelections },
    },
  });
}

// ─── Custom render ────────────────────────────────────────────

interface RenderWithStoreOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedSelections?: BetSelection[];
}

export function renderWithStore(
  ui: React.ReactElement,
  { preloadedSelections = [], ...renderOptions }: RenderWithStoreOptions = {},
) {
  const store = makeTestStore(preloadedSelections);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
