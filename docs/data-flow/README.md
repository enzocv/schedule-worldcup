# Flujo de datos

Este documento describe cómo los datos fluyen desde su origen (mocks / endpoint) hasta los componentes de UI.

---

## Diagrama general

```
lib/data/worldcup2026.ts
(RAW_EVENTS + KNOCKOUT_MATCHES)
        │
        │  adaptApiEvent()  ←── PHASE_MAP, teamFlags.ts
        │  schedule.adapter.ts
        ▼
  WORLDCUP_2026_MATCHES: SportMatch[]
        │
        ▼
  StaticMatchRepository          ← IMatchRepository (contrato)
  lib/patterns/MatchRepository.ts
        │
        ├─ .getAll()
        ├─ .getByDate()
        ├─ .getLive()
        └─ .toDaySchedules(todayKey)
                 │
                 ▼
           useSchedule()
       lib/hooks/useSchedule.ts
                 │
          ┌──────┴──────────┐
          ▼                 ▼
    DaySchedule[]      MatchPhase[]
    (agrupados)        (filtros)
          │
          ▼
    VIEW_STRATEGIES[viewMode]       ← Strategy Pattern
    lib/patterns/ViewStrategy.tsx
          │
          ▼
    DayGroup / WeeklyCalendarView
          │
          ▼
    MatchCardFactory.create(variant, opts)   ← Factory Pattern
    lib/patterns/MatchCardFactory.tsx
          │
          ▼
      MatchCard (UI final)
          │
          │  toggleSelection(matchId, market, odds)
          ▼
    Redux Store (bettingSlice)       ← useBetting() hook
    lib/store/slices/bettingSlice.ts
          │
          ▼
      BettingSlip
```

---

## 1. Tipos de datos

### `ApiEvent` (`lib/types/api.types.ts`)
Shape que devuelve el endpoint del sportsbook:

```ts
interface ApiEvent {
  _id: string;
  EventName: string;         // "Mexico vs USA"
  StartEventDate: string;    // ISO 8601 UTC
  LeagueName: string;
  IsLive: boolean;
  IsSuspended: boolean;
  Metadata?: {
    HomeTeam?: string;
    AwayTeam?: string;
    Phase?: string;
    Group?: string;
    Venue?: string;
    Round?: number;
  };
}
```

### `SportMatch` (`lib/types/schedule.types.ts`)
Shape interno que consumen los componentes:

```ts
interface SportMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:MM"
  phase: MatchPhase;
  group?: string;
  venue?: string;
  isLive?: boolean;
  liveStream?: string;
  odds?: MatchOdds;
  score?: MatchScore;
  round?: number;
}
```

---

## 2. Adaptación del API (`schedule.adapter.ts`)

### `adaptApiEvent(event, phase)`

Convierte un `ApiEvent` en `SportMatch`:

1. **Conversión de fecha/hora** vía `utcToCdt()` — UTC a CDT (UTC-5).
2. **Parsing de equipos** — divide `EventName` en `" vs "` como fallback si no hay `Metadata.HomeTeam/AwayTeam`.
3. **Resolución de banderas** vía `resolveTeam(name)` — busca en `TEAM_FLAG_MAP`, genera id slug si no existe.
4. **Mapeo de campos** — `IsLive → isLive`, `Metadata.Venue → venue`, etc.

```ts
const match = adaptApiEvent(
  { _id: "abc", EventName: "Mexico vs USA", StartEventDate: "2026-06-12T20:00:00Z", ... },
  "GROUP_STAGE"
);
// → { id: "abc", homeTeam: { name: "Mexico", flag: "🇲🇽" }, date: "2026-06-12", time: "15:00", ... }
```

---

## 3. Dataset final (`worldcup2026.ts`)

```ts
const adapted = RAW_EVENTS.map((e) => {
  const base = adaptApiEvent(e, PHASE_MAP[e._id] ?? 'GROUP_STAGE');
  return { ...base, ...MATCH_OVERRIDES[e._id] };
});

export const WORLDCUP_2026_MATCHES: SportMatch[] = [...adapted, ...KNOCKOUT_MATCHES];
```

| Fuente | Contenido |
|---|---|
| `RAW_EVENTS` | Eventos de grupos del sportsbook |
| `PHASE_MAP` | Mapeo `_id → MatchPhase` |
| `MATCH_OVERRIDES` | Datos de demo: `isLive`, `liveStream`, `odds` (México) |
| `KNOCKOUT_MATCHES` | Octavos, cuartos, semi y final con "Por definir" |

---

## 4. Repository Pattern (`MatchRepository.ts`)

`StaticMatchRepository` implementa `IMatchRepository`. Recibe el array de `SportMatch[]` en el constructor (por defecto `WORLDCUP_2026_MATCHES`).

Para cambiar la fuente de datos, crear una clase `ApiMatchRepository` que implemente la misma interfaz sin tocar los consumidores.

Ver [Patrones de diseño](../patterns/README.md).

---

## 5. Hook `useSchedule`

**Archivo:** `lib/hooks/useSchedule.ts`

```ts
const {
  groupedByDay,    // DaySchedule[]
  phases,          // MatchPhase[] únicas
  viewMode,        // ScheduleViewMode
  phaseFilter,     // MatchPhase | 'all'
  setViewMode,
  setPhaseFilter,
  currentDate,
  todayKey,
} = useSchedule(WORLDCUP_2026_MATCHES);
```

**Flujo interno:**
1. Crea un `StaticMatchRepository` con los partidos recibidos.
2. Selecciona la `ViewStrategy` activa desde `VIEW_STRATEGIES[viewMode]`.
3. Filtra por `phaseFilter`, ordena y agrupa en `DaySchedule[]` vía `.toDaySchedules()`.
4. Memoiza con `useMemo`.

---

## 6. Estado compartido: Redux Store

**Archivos:** `lib/store/slices/bettingSlice.ts`, `lib/store/slices/eventsSlice.ts`

El estado global del cupón de apuestas vive en Redux. `StoreProvider` hidrata desde `localStorage` y persiste cambios automáticamente.

```ts
const {
  selections,        // BettingSelection[]
  toggleSelection,   // (matchId, market, odds) => void
  removeSelection,   // (matchId) => void
  clearSelections,   // () => void
  totalOdds,         // número (producto de todos los odds)
  isSelected,        // (matchId: string) => boolean
} = useBetting();
```

---

## 7. Integración con endpoint real

Para reemplazar los mocks por datos reales:

```ts
// app/schedule/page.tsx (Server Component)
import { adaptApiEvent } from '@/lib/utils/schedule.adapter';
import type { ApiEvent } from '@/lib/types/api.types';

const res = await fetch('https://api.sportsbook.com/events?league=worldcup2026');
const { Events }: { Events: ApiEvent[] } = await res.json();

const matches = Events.map((e) => adaptApiEvent(e, 'GROUP_STAGE'));
```

O bien implementar `ApiMatchRepository` que llame al endpoint en `getAll()` y pasarlo a `useSchedule()`.

