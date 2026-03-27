import { configureStore } from '@reduxjs/toolkit';
import { bettingSlice, bettingActions } from '@/lib/store/slices/bettingSlice';
import { selectionMexico, selectionEmpate, selectionSuecia } from '../fixtures/matches';

// Helpers

function makeStore() {
  return configureStore({ reducer: { betting: bettingSlice.reducer } });
}

function getSelections(store: ReturnType<typeof makeStore>) {
  return store.getState().betting.selections;
}

// Tests

describe('bettingSlice', () => {
  describe('estado inicial', () => {
    it('inicia sin selecciones', () => {
      const store = makeStore();
      expect(getSelections(store)).toHaveLength(0);
    });
  });

  describe('toggleSelection', () => {
    it('agrega una selección nueva', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));

      const selections = getSelections(store);
      expect(selections).toHaveLength(1);
      expect(selections[0].matchId).toBe(selectionMexico.matchId);
      expect(selections[0].outcomeKey).toBe('homeWin');
      expect(selections[0].value).toBe(1.45);
    });

    it('elimina la selección si se alterna el mismo resultado', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));
      store.dispatch(bettingActions.toggleSelection(selectionMexico));

      expect(getSelections(store)).toHaveLength(0);
    });

    it('reemplaza la selección si cambia el resultado para el mismo partido', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));
      store.dispatch(bettingActions.toggleSelection(selectionEmpate));

      const selections = getSelections(store);
      expect(selections).toHaveLength(1);
      expect(selections[0].outcomeKey).toBe('draw');
      expect(selections[0].label).toBe('Empate');
      expect(selections[0].value).toBe(2.0);
    });

    it('permite selecciones en múltiples partidos', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));
      store.dispatch(bettingActions.toggleSelection(selectionSuecia));

      expect(getSelections(store)).toHaveLength(2);
    });
  });

  describe('removeSelection', () => {
    it('elimina una selección por matchId', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));
      store.dispatch(bettingActions.toggleSelection(selectionSuecia));

      store.dispatch(bettingActions.removeSelection(selectionMexico.matchId));

      const selections = getSelections(store);
      expect(selections).toHaveLength(1);
      expect(selections[0].matchId).toBe(selectionSuecia.matchId);
    });

    it('no falla si el matchId no existe', () => {
      const store = makeStore();
      expect(() =>
        store.dispatch(bettingActions.removeSelection('id-inexistente'))
      ).not.toThrow();
      expect(getSelections(store)).toHaveLength(0);
    });
  });

  describe('clearSelections', () => {
    it('vacía todas las selecciones', () => {
      const store = makeStore();
      store.dispatch(bettingActions.toggleSelection(selectionMexico));
      store.dispatch(bettingActions.toggleSelection(selectionSuecia));

      store.dispatch(bettingActions.clearSelections());

      expect(getSelections(store)).toHaveLength(0);
    });

    it('no falla en estado vacío', () => {
      const store = makeStore();
      expect(() => store.dispatch(bettingActions.clearSelections())).not.toThrow();
    });
  });
});
