# Flujo de datos

Este documento describe cómo los datos fluyen desde su origen (endpoint o mocks) hasta los componentes de UI.

---

## Diagrama general

```
Endpoint API (sportsbook)
        │
        ▼
  ApiEvent[]  ──────────────────────────────────────────┐
        │                                               │
  adaptApiEvent()  ←── PHASE_MAP                       │
  schedule.adapter.ts   ←── teamFlags.ts               │
        │                                               │
        ▼                                               │
  SportMatch[]                                   MATCH_OVERRIDES
        │                                               │
        └───────────────────────────────────────────────┘
                        │
                        ▼
              WORLDCUP_2026_MATCHES
              lib/data/worldcup2026.ts
                        │
                        ▼
                  useSchedule()
              lib/hooks/useSchedule.ts
                        │
                 ┌──────┴──────┐
                 ▼             ▼
           DaySchedule[]    MatchPhase[]
           (grouped)        (filters)
                 │
                 ▼
           ScheduleView
                 │
                 ▼
     DayGroup → MatchCard (UI final)
```

---

## 1. Tipos de datos

### `ApiEvent` (`lib/types/api.types.ts`)
Shape exacto que devuelve el endpoint del sportsbook:

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
  date: string;       // "YYYY-MM-DD" en zona horaria display
  time: string;       // "HH:MM" en zona horaria display
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
// Ejemplo completo
const match = adaptApiEvent(
  { _id: "abc", EventName: "Mexico vs USA", StartEventDate: "2026-06-12T20:00:00Z", ... },
  "GROUP_STAGE"
);
// → { id: "abc", homeTeam: { name: "Mexico", flag: "🇲🇽" }, ... date: "2026-06-12", time: "15:00" }
```

### `utcToCdt(utcIso)`

```ts
utcToCdt("2026-06-12T20:00:00Z") // → { date: "2026-06-12", time: "15:00" }
```

Aplica offset `-5h`. Si el resultado cruza la medianoche, la fecha se ajusta correctamente.

---

## 3. Dataset final (`worldcup2026.ts`)

El archivo combina tres fuentes:

```ts
// 1. Eventos de API transformados
const adapted = RAW_EVENTS.map((e) => {
  const base = adaptApiEvent(e, PHASE_MAP[e._id] ?? 'GROUP_STAGE');
  return { ...base, ...MATCH_OVERRIDES[e._id] };
});

// 2. Partidos de fase eliminatoria (manuales, "Por definir")
const knockout = KNOCKOUT_MATCHES;

// 3. Exportación final
export const WORLDCUP_2026_MATCHES: SportMatch[] = [...adapted, ...knockout];
```

| Fuente | Qué contiene |
|---|---|
| `RAW_EVENTS` | 19 eventos de la jornada de grupos del sportsbook |
| `PHASE_MAP` | Mapeo `_id → MatchPhase` para todos los eventos |
| `MATCH_OVERRIDES` | Datos de demo: isLive, liveStream, odds (solo México) |
| `KNOCKOUT_MATCHES` | Octavos, cuartos, semi y final con "Por definir" |

---

## 4. Hook `useSchedule`

**Archivo:** `lib/hooks/useSchedule.ts`

Aplica filtros y agrupa los partidos para consumo del componente:

```ts
const {
  groupedByDay,    // DaySchedule[] — días con sus partidos
  phases,          // MatchPhase[] únicas presentes
  viewMode,        // 'schedule' | 'grid' | 'scores'
  phaseFilter,     // MatchPhase | 'all'
  setViewMode,
  setPhaseFilter,
} = useSchedule(WORLDCUP_2026_MATCHES);
```

**Flujo interno:**
1. Filtra por `phaseFilter` si no es `'all'`
2. Ordena por fecha y hora
3. Agrupa en `DaySchedule[]` por `date`
4. Memoiza con `useMemo`

---

## 5. Estado compartido: `BettingContext`

**Archivo:** `lib/context/BettingContext.tsx`

Gestiona el cupón de apuestas. Propagado globalmente desde `app/layout.tsx`.

```ts
const {
  selections,        // BettingSelection[]
  toggleSelection,   // (matchId, market, odds) => void
  removeSelection,   // (matchId) => void
  clearSelections,   // () => void
  totalOdds,         // number (product de todos los odds)
  isSelected,        // (matchId: string) => boolean
} = useBettingContext();
```

**No persiste** entre recargas (estado en memoria). Para persistencia, agregar `localStorage` en el reducer.

---

## 6. Integración con endpoint real

Para reemplazar los mocks por datos reales del endpoint:

```ts
// app/schedule/page.tsx (Server Component)
import { adaptApiEvent } from '@/lib/utils/schedule.adapter';
import type { ApiEvent } from '@/lib/types/api.types';

const res = await fetch('https://api.sportsbook.com/events?league=worldcup2026');
const { Events }: { Events: ApiEvent[] } = await res.json();

const matches = Events.map((e) => adaptApiEvent(e, 'GROUP_STAGE'));
```

El adaptador ya maneja todos los casos edge (equipos desconocidos, fechas UTC, campos opcionales).
