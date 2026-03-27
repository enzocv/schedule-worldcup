# Tests unitarios

El proyecto usa **Jest 30** + **@testing-library/react v16** + **@testing-library/user-event v14**.

---

## Estructura de carpetas

```
__tests__/
├── components/
│   ├── BettingSlip.test.tsx   (20 tests)
│   └── MatchCard.test.tsx     (21 tests)
├── store/
│   └── bettingSlice.test.ts   (9 tests)
├── fixtures/
│   └── matches.ts             — datos de prueba reutilizables
└── utils/
    └── renderWithStore.tsx    — helper de render con Redux
```

**Total: 50 tests** en 3 suites.

---

## Comandos

```bash
npm test                 # ejecución única
npm run test:watch       # modo watch (re-ejecuta al guardar)
npm run test:coverage    # cobertura + reporte de texto
```

---

## Helper: `renderWithStore`

**Archivo:** `__tests__/utils/renderWithStore.tsx`

Envuelve el componente bajo test en `StoreProvider` con un store precargado:

```ts
import { renderWithStore } from '../utils/renderWithStore';

const { getByText } = renderWithStore(<BettingSlip isOpen onClose={jest.fn()} />, {
  preloadedSelections: [selectionMexico],
});
```

| Opción | Tipo | Descripción |
|---|---|---|
| `preloadedSelections` | `BettingSelection[]` | Selecciones iniciales en el store |

También exporta `makeTestStore(preloadedSelections)` para acceder al store directamente sin render.

---

## Fixtures

**Archivo:** `__tests__/fixtures/matches.ts`

| Export | Descripción |
|---|---|
| `matchBase` | Partido genérico sin cuotas ni live |
| `matchWithOdds` | `matchBase` + odds 1x2 completos |
| `matchLive` | Partido en vivo con liveStream |
| `matchB` | Segundo partido (para tests de múltiples selecciones) |
| `selectionMexico` | `BettingSelection` para el partido de México (local) |
| `selectionEmpate` | `BettingSelection` para empate |
| `selectionSuecia` | `BettingSelection` para un partido diferente |

---

## Suites

### `bettingSlice.test.ts`

Tests del reducer Redux puro (sin componentes):

- Estado inicial vacío
- `toggleSelection`: agregar, eliminar y re-agregar una selección
- `removeSelection`: eliminar selección específica
- `clearSelections`: limpiar todo
- `totalOdds`: cálculo del producto correcto con múltiples selecciones
- `isSelected`: selector de estado booleano

### `MatchCard.test.tsx`

Tests del componente con `renderWithStore`:

- Renderiza equipos y datos básicos
- Plegado/expandido por defecto según `isToday` y `match.isLive`
- `alwaysExpanded`: no permite plegar, no muestra header clickeable
- `compact`: muestra solo una fila, sin cuotas
- `onClose`: renderiza botón de cierre y lo llama al hacer clic
- Botones de cuotas: toggle y estado visual seleccionado/no seleccionado
- `LiveBanner` visible cuando `isLive=true` y hay `liveStream`
- `MARKET_BADGES` visibles/ocultos según `isLive`

### `BettingSlip.test.tsx`

Tests del panel de apuestas con store precargado:

- Panel cerrado: no renderiza contenido
- Panel vacío: mensaje "No hay selecciones"
- Con selecciones: lista de equipos y cuotas
- `removeSelection`: botón × elimina la fila
- `clearSelections`: botón "Vaciar" limpia todo
- Resumen de cuota total (producto de odds)
- Botón "Apostar": muestra mensaje de éxito y vacía el slip
- Footer visible con 0 selecciones después de apostar (estado `betPlaced`)
- Tecla Escape llama a `onClose`

---

## Convenciones

- Cada test describe un comportamiento observable, no una implementación.
- Los mocks de Next.js (`next/navigation`, `next/image`) están en `jest.setup.ts`.
- No se usan `snapshots`; se prefieren aserciones explícitas con `getByText`, `getByRole`, etc.
- Para acciones de usuario se usa `userEvent` (no `fireEvent`).
