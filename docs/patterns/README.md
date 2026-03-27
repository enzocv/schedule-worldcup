# Patrones de diseño

La carpeta `lib/patterns/` contiene las implementaciones de los tres patrones de diseño que separan la lógica de negocio de los componentes de UI.

---

## Repository Pattern — `MatchRepository.ts`

### Problema que resuelve
Los componentes no deben saber cómo ni de dónde se obtienen los partidos. El repositorio es el único lugar donde vive esa lógica.

### Interfaz

```ts
export interface IMatchRepository {
  getAll(): SportMatch[];
  getByDate(date: string): SportMatch[];
  getByPhase(phase: MatchPhase): SportMatch[];
  getLive(): SportMatch[];
  getUpcoming(fromDate: string): SportMatch[];
  toDaySchedules(todayKey: string): DaySchedule[];
}
```

### Implementación actual

`StaticMatchRepository` recibe `SportMatch[]` en el constructor y sirve los datos desde memoria:

```ts
const repo = new StaticMatchRepository(WORLDCUP_2026_MATCHES);

repo.getAll();                    // todos los partidos
repo.getLive();                   // solo los en vivo
repo.getByDate('2026-06-12');     // partidos de un día
repo.toDaySchedules(todayKey);    // agrupados para la UI
```

`useSchedule()` crea el repositorio internamente; los componentes solo ven `DaySchedule[]`.

### Cómo agregar una fuente de datos real

1. Crear `lib/patterns/ApiMatchRepository.ts` que implemente `IMatchRepository`.
2. En `getAll()` hacer el `fetch` al endpoint y adaptar con `adaptApiEvent()`.
3. Sustituir `StaticMatchRepository` en `useSchedule`.

Los componentes no necesitan ningún cambio porque dependen de la interfaz, no de la implementación.

---

## Factory Pattern — `MatchCardFactory.tsx`

### Problema que resuelve
`MatchCard` tiene cuatro formas de usarse. Sin factory, cada consumidor tendría que conocer y repetir la combinación exacta de props para cada variante.

### Variantes

| Variante | Props resultantes | Dónde se usa |
|---|---|---|
| `'agenda'` | `match`, `isToday` | `DayGroup` (vista agenda) |
| `'compact'` | `match`, `compact` | `DayGroup` (vista 3 días) |
| `'modal'` | `match`, `isToday`, `alwaysExpanded`, `onClose` | `WeeklyCalendarView` al hacer clic en una tarjeta |
| `'sheet'` | `match`, `isToday`, `alwaysExpanded` | Bottom sheet de overflow en `WeeklyCalendarView` |

### Uso

```ts
import { MatchCardFactory } from '@/lib/patterns/MatchCardFactory';

// En DayGroup
MatchCardFactory.create('agenda', { match, isToday: day.isToday })
MatchCardFactory.create('compact', { match })

// En WeeklyCalendarView (modal)
MatchCardFactory.create('modal', { match, isToday, onClose: () => setSelectedMatch(null) })
```

### Cómo agregar una variante nueva

1. Añadir el literal al tipo `MatchCardVariant`.
2. Añadir el `case` correspondiente en `MatchCardFactoryImpl.create()`.

---

## Strategy Pattern — `ViewStrategy.tsx`

### Problema que resuelve
`ScheduleView` soporta tres modos de vista (`'agenda'`, `'3days'`, `'week'`). Sin el patrón Strategy, el componente tendría un bloque `if/else` creciente por cada modo nuevo.

### Interfaz

```ts
export interface ViewStrategy {
  readonly mode: ScheduleViewMode;
  renderSchedule(ctx: ViewStrategyContext): React.ReactNode;
}

export interface ViewStrategyContext {
  daySchedules: DaySchedule[];
  currentDate: Date;
  todayKey: string;
  listClassName?: string;
}
```

### Registro

```ts
export const VIEW_STRATEGIES: Record<ScheduleViewMode, ViewStrategy> = {
  agenda:  agendaStrategy,
  '3days': threeDaysStrategy,
  week:    weekStrategy,
};
```

`ScheduleView` simplemente llama:

```ts
VIEW_STRATEGIES[viewMode].renderSchedule(ctx)
```

### Cómo agregar un modo nuevo

1. Crear el objeto que implemente `ViewStrategy` (con `mode` y `renderSchedule`).
2. Añadir el literal al tipo `ScheduleViewMode` en `lib/types/schedule.types.ts`.
3. Registrar el nuevo objeto en `VIEW_STRATEGIES`.

`ScheduleView`, `ScheduleHeader` y `useSchedule` reciben el nuevo modo automáticamente.
