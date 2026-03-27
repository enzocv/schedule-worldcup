# Schedule World Cup 2026

Vista de agenda deportiva para el FIFA World Cup 2026, construida con **Next.js 16**, **React 19** y **TypeScript**. Incluye un sistema de cupón de apuestas, filtros por fase del torneo y soporte para partidos en vivo.

## Demo rápida

```bash
npm install
npm run dev
# → http://localhost:3000/schedule
```

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | ^16 | Framework (App Router) |
| React | ^19 | UI |
| TypeScript | ^6 | Tipado estático |
| CSS Modules | — | Estilos encapsulados |

Sin librerías de UI externas ni gestores de estado globales — solo React context.

## Estructura del proyecto

```
├── app/
│   ├── layout.tsx            # Layout raíz (fuentes, globals.css)
│   ├── page.tsx              # Redirige a /schedule
│   └── schedule/
│       └── page.tsx          # Ruta principal: /schedule
│
├── components/
│   ├── ui/                   # Componentes genéricos reutilizables
│   │   ├── Icon/             # Librería centralizada de iconos SVG
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Select/
│   │   └── TextArea/
│   │
│   ├── schedule/             # Componentes específicos de la agenda
│   │   ├── ScheduleView/     # Componente raíz de la vista
│   │   ├── AppBar/           # Barra superior de navegación
│   │   ├── ScheduleHeader/   # Header con tabs (Agenda / 3 días / Semana)
│   │   ├── MonthHeader/      # Nombre del mes + botón "Hoy"
│   │   ├── DayGroup/         # Agrupa partidos de un mismo día
│   │   ├── MatchCard/        # Tarjeta de partido con cuotas expandibles
│   │   ├── LiveBanner/       # Banner rojo "En vivo" con link de stream
│   │   └── BettingSlip/      # Panel lateral del cupón de apuestas
│   │
│   └── calendar/             # Componentes del calendario mensual (legacy)
│
├── lib/
│   ├── types/
│   │   ├── schedule.types.ts # Tipos internos: SportMatch, Team, DaySchedule…
│   │   └── api.types.ts      # Shape del endpoint: ApiEvent, ApiScheduleResponse
│   │
│   ├── data/
│   │   ├── worldcup2026.ts   # Dataset principal (raw events + adaptación)
│   │   └── teamFlags.ts      # Mapa nombre→{id, flagEmoji} para todos los equipos
│   │
│   ├── utils/
│   │   ├── schedule.adapter.ts  # adaptApiEvent(): convierte ApiEvent → SportMatch
│   │   ├── date.utils.ts
│   │   ├── helpers.ts
│   │   └── validation.utils.ts
│   │
│   ├── hooks/
│   │   ├── useSchedule.ts    # Lógica de vistas, filtros y agrupación por día
│   │
│   └── context/
│       ├── BettingContext.tsx  # Estado global del cupón de apuestas
│       └── EventsContext.tsx
│
├── styles/
│   └── tokens.css            # Design tokens (colores, tipografía, espaciado…)
│
└── docs/                     # Documentación técnica extendida
    ├── architecture/
    ├── components/
    ├── design-system/
    └── data-flow/
```

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter (ESLint)
```

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Redirige a `/schedule` |
| `/schedule` | Vista principal de la agenda del Mundial |

## Cómo funciona el flujo de datos

```
Endpoint (JSON)
    └─ ApiEvent[]
         └─ adaptApiEvent()        ←  schedule.adapter.ts
              └─ SportMatch[]
                   └─ useSchedule()
                        └─ DaySchedule[]
                             └─ DayGroup → MatchCard
```

Los datos reales del torneo están modelados como `ApiEvent` (ver `lib/types/api.types.ts`), con la misma forma que devuelve el endpoint. Las banderas de los equipos no vienen del API y se resuelven localmente desde `lib/data/teamFlags.ts`.

→ Documentación detallada en [`docs/`](./docs/)

## Agregar un partido nuevo

Cuando el endpoint esté conectado, solo se actualiza `RAW_EVENTS` en `lib/data/worldcup2026.ts` con los eventos de la respuesta. No requiere cambios en ningún componente.

Para una fase nueva, agregar su valor en `MatchPhase` (`lib/types/schedule.types.ts`) y la entrada correspondiente en `PHASE_MAP` del mismo archivo de datos.
