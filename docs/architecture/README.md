# Arquitectura del proyecto

## Decisiones técnicas principales

### Next.js App Router
Se usa el App Router de Next.js 16. Las páginas viven en `app/` y los componentes de cliente usan `'use client'` explícitamente. Los componentes de servidor (RSC) no tienen esa directiva y nunca usan hooks de React.

### Sin librería de UI externa
Todos los componentes están construidos desde cero con CSS Modules. Esto da control total sobre el diseño y evita dependencias de terceros que puedan cambiar la API.

### Sin gestor de estado global (Redux / Zustand)
El único estado compartido es el cupón de apuestas, manejado con React Context (`BettingContext`). El resto del estado es local a cada componente o derivado con `useMemo` en el hook `useSchedule`.

---

## Capas de la aplicación

```
┌─────────────────────────────────────────┐
│  app/  (rutas y layout)                 │
├─────────────────────────────────────────┤
│  components/  (presentación)            │
│    ├── ui/        (genéricos)           │
│    ├── schedule/  (del dominio)         │
│    └── calendar/  (legacy)              │
├─────────────────────────────────────────┤
│  lib/  (lógica y datos)                 │
│    ├── types/     (contratos)           │
│    ├── data/      (dataset + flags)     │
│    ├── utils/     (transformaciones)    │
│    ├── hooks/     (estado derivado)     │
│    └── context/   (estado compartido)   │
├─────────────────────────────────────────┤
│  styles/  (design tokens globales)      │
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
  + PHASE_MAP                   (UTC → CDT, parseo de nombres, resolución de banderas)
  + MATCH_OVERRIDES
       │
       ▼
  SportMatch[]               ← lib/types/schedule.types.ts
  (WORLDCUP_2026_MATCHES)    ← lib/data/worldcup2026.ts
       │
       ▼
  useSchedule()              ← lib/hooks/useSchedule.ts
  (filtra, agrupa por día,     retorna DaySchedule[]
   maneja viewMode y phase)
       │
       ▼
  ScheduleView               ← components/schedule/ScheduleView/ScheduleView.tsx
  └─ DayGroup[]
       └─ MatchCard[]
            └─ BettingContext (cuotas seleccionadas)
```

---

## Árbol de componentes de la vista principal

```
ScheduleView (BettingProvider)
├── AppBar
├── ScheduleHeader  (tabs: Agenda / 3 días / Semana)
├── main
│   ├── MonthHeader  (nombre de mes + botón Hoy)
│   └── [DayGroup]   (uno por fecha)
│       ├── columna día  (Lun/Mar/… + número)
│       └── columna partidos
│           └── [MatchCard]
│               ├── LiveBanner  (solo si isLive + liveStream)
│               ├── header (equipo vs equipo, fase, MetaRow)
│               │   └── MetaRow  (hora, competencia, badges PA/BB/SC)
│               └── body (banderas, cuotas 1x2)
├── button.couponBtn  (flotante)
└── BettingSlip  (panel lateral)
```

---

## Convenciones de archivos

| Patrón | Ejemplo | Contenido |
|---|---|---|
| `ComponentName.tsx` | `MatchCard.tsx` | Componente React |
| `ComponentName.module.css` | `MatchCard.module.css` | Estilos del componente |
| `index.ts` | `MatchCard/index.ts` | Barrel export |
| `ComponentName.constants.ts` | `MatchCard.constants.ts` | Constantes propias del componente |
| `use*.ts` | `useSchedule.ts` | Custom hook |
| `*.types.ts` | `schedule.types.ts` | Definiciones de tipos |
| `*.adapter.ts` | `schedule.adapter.ts` | Transformadores de datos |
| `*.utils.ts` | `date.utils.ts` | Funciones utilitarias puras |

---

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

El resto de la aplicación no cambia porque `adaptApiEvent()` ya consume la forma exacta de `ApiEvent`.
