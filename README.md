<div align="center">

# ⚽ Schedule World Cup 2026

**Agenda deportiva interactiva para el FIFA World Cup 2026**

Vista de partidos con cupón de apuestas, filtros por fase, soporte de partidos en vivo y tres modos de visualización — construida con Next.js 16, React 19 y TypeScript.

![CI](https://github.com/enzocv/schedule-worldcup/actions/workflows/pr-validation.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![Tests](https://img.shields.io/badge/tests-50%20passing-success)

</div>

---

## ✨ Características

- 📅 **3 modos de vista** — Agenda, 3 días y semana con cuadrícula de horas
- 🔴 **Partidos en vivo** — Banner con link a transmisión y estado en tiempo real
- 🎯 **Cupón de apuestas** — Selecciona cuotas 1X2, calcula el odd total y persiste en `localStorage`
- 🏆 **Filtros por fase** — Grupos, octavos, cuartos, semis y final
- 📱 **Responsive** — Adaptado a móvil y escritorio
- 🧩 **Patrones de diseño** — Repository, Factory y Strategy para lógica desacoplada

---

## 🛠 Stack

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | ^16 | Framework (App Router, SSR) |
| [React](https://react.dev/) | ^19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | ^6 | Tipado estático |
| [Redux Toolkit](https://redux-toolkit.js.org/) | ^2 | Estado global (apuestas) |
| CSS Modules | — | Estilos encapsulados por componente |
| [Jest](https://jestjs.io/) + Testing Library | 30 / 16 | Tests unitarios |

---

## 📋 Requisitos previos

Elige **una** de las dos opciones para levantar el proyecto:

| Opción | Requisito |
|---|---|
| **npm directo** | [Node.js 22+](https://nodejs.org/) |
| **Docker Compose** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine + Compose |

> **Nota:** No se necesita ninguna variable de entorno para desarrollo local. El proyecto usa datos estáticos (`lib/data/worldcup2026.ts`).

---

## 🚀 Instalación y ejecución

### Opción A — npm (recomendado para desarrollo)

```bash
# 1. Clonar el repositorio
git clone https://github.com/enzocv/schedule-worldcup.git
cd schedule-worldcup

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000/schedule](http://localhost:3000/schedule) en tu navegador.

---

### Opción B — Docker Compose (entorno aislado)

El archivo `docker-compose.dev.yml` levanta un contenedor con Node 22 Alpine, monta el código fuente como volumen y ejecuta `npm install` + `npm run dev` automáticamente. **No necesitas tener Node instalado localmente.**

```bash
# 1. Clonar el repositorio
git clone https://github.com/enzocv/schedule-worldcup.git
cd schedule-worldcup

# 2. Levantar el contenedor de desarrollo
docker compose -f docker-compose.dev.yml up -d
```

Abre [http://localhost:3000/schedule](http://localhost:3000/schedule) en tu navegador.

Los cambios en el código se reflejan en caliente gracias al volumen montado sobre `/app`.

Para detener el contenedor:

```bash
docker compose -f docker-compose.dev.yml down
```

> **Tip:** La primera vez puede tardar unos minutos mientras se descarga la imagen y se instalan las dependencias dentro del contenedor. Las ejecuciones siguientes son instantáneas.

---

## 📦 Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo  → http://localhost:3000
npm run build        # Build de producción
npm run start        # Servidor de producción (requiere build previo)
npm run lint         # ESLint sobre app/, components/, lib/
npm test             # Ejecución única de los 50 tests unitarios
npm run test:watch   # Tests en modo watch (re-ejecuta al guardar)
npm run test:coverage  # Tests con reporte de cobertura
```

---

## 🗂 Estructura del proyecto

```
├── app/
│   ├── layout.tsx            # Layout raíz (StoreProvider, fuentes, globals.css)
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
│   └── schedule/             # Componentes específicos de la agenda
│       ├── ScheduleView/         # Componente raíz de la vista
│       ├── AppBar/               # Barra superior de navegación
│       ├── ScheduleHeader/       # Header con tabs (Agenda / 3 días / Semana)
│       ├── MonthHeader/          # Nombre del mes + botón "Hoy"
│       ├── DayGroup/             # Agrupa partidos por día
│       ├── MatchCard/            # Tarjeta con cuotas expandibles
│       ├── LiveBanner/           # Banner rojo "En vivo"
│       ├── WeeklyCalendarView/   # Vista de semana con cuadrícula de horas
│       └── BettingSlip/          # Panel del cupón de apuestas
│
├── lib/
│   ├── types/                # Tipos internos: SportMatch, DaySchedule…
│   ├── data/                 # Dataset del Mundial 2026
│   ├── utils/                # Adaptadores, fechas, helpers
│   ├── hooks/                # useSchedule (vista, filtros, agrupación)
│   ├── patterns/             # Repository, Factory y Strategy
│   └── store/                # Redux Toolkit (bettingSlice, eventsSlice)
│
├── __tests__/                # 50 tests unitarios (Jest + Testing Library)
├── styles/
│   └── tokens.css            # Design tokens (colores, tipografía, espaciado)
│
└── docs/                     # Documentación técnica extendida
    ├── architecture/         # Arquitectura general y decisiones de diseño
    ├── components/           # Documentación de componentes
    ├── patterns/             # Patrones de diseño (Repository, Factory, Strategy)
    ├── testing/              # Guía de tests y convenciones
    ├── ci-cd/                # Pipeline de CI/CD (GitHub Actions)
    ├── data-flow/            # Flujo de datos de API a UI
    └── design-system/        # Design tokens y guías de estilo
```

---

## 🌐 Rutas

| Ruta | Descripción |
|---|---|
| `/` | Redirige a `/schedule` |
| `/schedule` | Vista principal de la agenda del Mundial |

---

## 🧪 Tests

El proyecto cuenta con **50 tests unitarios** distribuidos en 3 suites:

| Suite | Tests | Qué cubre |
|---|---|---|
| `bettingSlice.test.ts` | 9 | Reducer Redux: selecciones, totalOdds, clearAll |
| `MatchCard.test.tsx` | 21 | Render, expand/collapse, cuotas, live banner |
| `BettingSlip.test.tsx` | 20 | Panel de apuestas, selecciones, apostar |

```bash
npm test
# PASS  __tests__/store/bettingSlice.test.ts
# PASS  __tests__/components/MatchCard.test.tsx
# PASS  __tests__/components/BettingSlip.test.tsx
# Tests: 50 passed, 50 total
```

---

## 📚 Documentación

La carpeta `docs/` contiene documentación técnica detallada:

- [Arquitectura](docs/architecture/README.md) — capas, diagramas y decisiones
- [Componentes](docs/components/README.md) — props y comportamiento de cada componente
- [Patrones de diseño](docs/patterns/README.md) — Repository, Factory y Strategy
- [Flujo de datos](docs/data-flow/README.md) — de la API/mock a la UI
- [Tests](docs/testing/README.md) — estructura, fixtures y convenciones
- [CI/CD](docs/ci-cd/README.md) — GitHub Actions y branch protection
- [Design System](docs/design-system/README.md) — tokens, colores y tipografía

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
