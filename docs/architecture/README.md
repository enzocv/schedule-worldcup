# Arquitectura del proyecto

## Decisiones técnicas principales

### Next.js App Router
Se usa el App Router de Next.js 16. Las páginas viven en `app/` y los componentes de cliente usan `'use client'` explícitamente. Los componentes de servidor (RSC) no tienen esa directiva y nunca usan hooks de React.

### Sin librería de UI externa
Todos los componentes están construidos desde cero con CSS Modules. Esto da control total sobre el diseño y evita dependencias de terceros que puedan cambiar la API.

### Redux Toolkit como gestor de estado global
El estado compartido se maneja con Redux Toolkit a través de dos slices:
- `bettingSlice` — selecciones del cupón de apuestas
- `eventsSlice` — eventos del calendario (con persistencia en `localStorage`)

El `StoreProvider` hidrata y persiste `eventsSlice` automáticamente. Los hooks de consumo están centralizados en `lib/store/hooks.ts` (`useBetting`, `useEvents`).

> **Migración Context API → Redux:** la versión anterior usaba React Context (`BettingContext`, `EventsContext`). Ambos fueron eliminados y reemplazados por Redux Toolkit.

---

## Capas de la aplicación

```
┌─────────────────────────────────────────┐
│  app/  (rutas y layout)                 │
├─────────────────────────────────────────┤
│  components/  (presentación)            │
│    ├── ui/        (genéricos)           │
│    └── schedule/  (del dominio)         │
├─────────────────────────────────────────┤
│  lib/  (lógica y datos)                 │
│    ├── types/     (contratos)           │
│    ├── data/      (dataset + flags)     │
│    ├── utils/     (transformaciones)    │
│    ├── hooks/     (estado derivado)     │
│    ├── patterns/  (Repository, Factory, │
│    │               Strategy)            │
│    └── store/     (Redux + slices)      │
├─────────────────────────────────────────┤
│  styles/  (design tokens globales)      │
├─────────────────────────────────────────┤
│  __tests__/  (tests unitarios)          │
└─────────────────────────────────────────┘
```

---

## Flujo de datos completo

```
[Endpoint / JSON]
       │
       ▼
  ApiEvent[]                 ← lib/types/api.types.ts
       │
       ▼
  adaptApiEvent()            ← lib/utils/schedule.adapter.ts
  + TEAM_FLAG_MAP               (UTC → CDT, parseo de nombres, resolución de banderas)
       │
       ▼
  SportMatch[]               ← lib/types/schedule.types.ts
  (WORLDCUP_2026_MATCHES)    ← lib/data/worldcup2026.ts
       │
       ▼
  IMatchRepository           ← lib/patterns/MatchRepository.ts
  StaticMatchRepository         (getAll, getByDate, toDaySchedules…)
       │
       ▼
  useSchedule()              ← lib/hooks/useSchedule.ts
  (agrupa por día, maneja       retorna DaySchedule[])
   viewMode y navegación)
       │
       ▼
  VIEW_STRATEGIES[viewMode]  ← lib/patterns/ViewStrategy.tsx
  .renderSchedule(ctx)          (Strategy pattern: agenda / 3days / week)
       │
       ▼
  DayGroup / WeeklyCalendarView
       │
       ▼
  MatchCardFactory.create()  ← lib/patterns/MatchCardFactory.tsx
  (Factory pattern)             (agenda / compact / modal / sheet)
       │
       ▼
  MatchCard[]
       └─ useBetting()       ← lib/store/hooks.ts → bettingSlice (Redux)
```

---

## Árbol de componentes de la vista principal

```
ScheduleView
├── AppBar
├── ScheduleHeader  (tabs: Agenda / 3 días / Semana)
├── main
│   ├── MonthHeader  (nombre de mes + botón Hoy)
│   └── [DayGroup]   (uno por fecha — vista agenda/3days)
│       ├── columna día  (Lun/Mar/… + número)
│       └── columna partidos
│           └── [MatchCard]  (vía MatchCardFactory)
│               ├── LiveBanner  (solo si isLive + liveStream)
│               ├── header (equipo vs equipo, fase, MetaRow)
│               │   └── MetaRow  (hora, competencia)
│               └── body (banderas, cuotas 1x2)
│   └── WeeklyCalendarView  (vista semana)
│       ├── columna de horas
│       ├── [WeekEventCard]  (tarjeta compacta por evento)
│       └── OverflowPill  ("+N más" cuando hay overflow)
├── button.couponBtn  (flotante con badge de conteo)
└── BettingSlip  (panel lateral)
    ├── lista de selecciones
    ├── campo de monto
    └── botón "Realizar apuesta"
```

---

## Convenciones de archivos

| Patrón | Ejemplo | Contenido |
|---|---|---|
| `ComponentName.tsx` | `MatchCard.tsx` | Componente React |
| `ComponentName.module.css` | `MatchCard.module.css` | Estilos del componente |
| `index.ts` | `MatchCard/index.ts` | Barrel export |
| `ComponentName.constants.ts` | `MatchCard.constants.ts` | Constantes propias del componente |
| `ComponentName.utils.ts` | `WeeklyCalendarView.utils.ts` | Utilidades del componente |
| `use*.ts` | `useSchedule.ts` | Custom hook |
| `*.types.ts` | `schedule.types.ts` | Definiciones de tipos |
| `*.adapter.ts` | `schedule.adapter.ts` | Transformadores de datos |
| `*.utils.ts` | `date.utils.ts` | Funciones utilitarias puras |
| `*Slice.ts` | `bettingSlice.ts` | Redux slice (RTK) |

## Estado global — Redux Toolkit

```
lib/store/
├── store.ts          ← configureStore (bettingSlice + eventsSlice)
├── StoreProvider.tsx ← Provider + hydratación/persistencia en localStorage
├── hooks.ts          ← useBetting(), useEvents()
└── slices/
    ├── bettingSlice.ts  ← toggleSelection, removeSelection, clearSelections
    └── eventsSlice.ts   ← addEvent, updateEvent, deleteEvent, setEvents
```

`StoreProvider` hidrata `eventsSlice` desde `localStorage` al montar y lo persiste en cada cambio. No se requiere nada adicional para que los eventos sobrevivan a recargas.

## Patrones de diseño

Ver documentación detallada en [`docs/patterns/README.md`](../patterns/README.md).

| Patrón | Archivo | Problema que resuelve |
|---|---|---|
| Repository | `lib/patterns/MatchRepository.ts` | Abstrae la fuente de datos de partidos |
| Factory | `lib/patterns/MatchCardFactory.tsx` | Centraliza la creación de variantes de MatchCard |
| Strategy | `lib/patterns/ViewStrategy.tsx` | Encapsula la lógica de cada modo de vista |

## Tests unitarios

Ver documentación detallada en [`docs/testing/README.md`](../testing/README.md).

Los tests viven en `__tests__/` e incluyen:
- Tests de lógica Redux (`bettingSlice.test.ts`)
- Tests de componentes UI (`MatchCard.test.tsx`, `BettingSlip.test.tsx`)

Correr con `npm test`.

## CI/CD

Ver documentación detallada en [`docs/ci-cd/README.md`](../ci-cd/README.md).

Tres workflows en `.github/workflows/`:
- `unit-tests.yml` — workflow reutilizable de tests
- `pr-validation.yml` — valida todo PR hacia `develop`/`main`
- `docker-publish.yml` — publica imagen Docker al fusionar en `main`

## Integración con endpoint real

Cuando el backend esté disponible, el único punto de cambio es `lib/data/worldcup2026.ts`:

```ts
// Reemplazar:
const RAW_EVENTS: ApiEvent[] = [ /* datos hardcodeados */ ];

// Por:
const response = await fetch('/api/events');
const { Events }: ApiScheduleResponse = await response.json();
const RAW_EVENTS = Events;
```

El resto de la aplicación no cambia porque `adaptApiEvent()` ya consume la forma exacta de `ApiEvent`, y el `StaticMatchRepository` acepta cualquier array de `SportMatch`.
