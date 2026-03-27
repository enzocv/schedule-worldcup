import { configureStore } from '@reduxjs/toolkit';
import { bettingSlice } from './slices/bettingSlice';
import { eventsSlice } from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    betting: bettingSlice.reducer,
    events: eventsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
