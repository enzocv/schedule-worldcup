# Componentes de la agenda deportiva

Todos viven en `components/schedule/`.

---

## ScheduleView

**Archivo:** `ScheduleView/ScheduleView.tsx`

Componente raíz de la vista. Orquesta el layout: AppBar, ScheduleHeader, lista de partidos y panel BettingSlip. El estado global viene del store Redux (no usa ningún `Provider` propio).

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `matches` | `SportMatch[]` | `WORLDCUP_2026_MATCHES` | Dataset de partidos |
| `tournamentName` | `string` | — | Nombre del torneo en el header |
| `tournamentSubtitle` | `string` | — | Subtítulo del torneo |

---

## AppBar

**Archivo:** `AppBar/AppBar.tsx`

Barra superior fija con el nombre de la app y controles de navegación. Sin props.

---

## ScheduleHeader

**Archivo:** `ScheduleHeader/ScheduleHeader.tsx`

Header del torneo con los tabs de vista (Agenda / 3 Días / Semana) y filtro de fases.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `viewMode` | `ScheduleViewMode` | Vista activa |
| `onTabChange` | `(mode: ScheduleViewMode) => void` | Callback al cambiar tab |
| `tournamentName` | `string?` | Nombre del torneo |
| `tournamentSubtitle` | `string?` | Subtítulo |

---

## MonthHeader

**Archivo:** `MonthHeader/MonthHeader.tsx`

Muestra el mes actual y el botón "Hoy" para regresar al día presente.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `monthName` | `string` | Nombre del mes en español |
| `onToday` | `() => void` | Navega al día de hoy |

---

## DayGroup

**Archivo:** `DayGroup/DayGroup.tsx`

Renderiza un día completo: columna izquierda con el indicador de día (Lun/11) y columna derecha con la lista de `MatchCard`.

Delega la creación de cada tarjeta a `MatchCardFactory.create(cardVariant, { match, isToday })`. El `cardVariant` es `'agenda'` cuando `viewMode === 'agenda'`, y `'compact'` para las demás vistas.

Ver [Patrones de diseño](../../patterns/README.md) para más detalle sobre la Factory.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `day` | `DaySchedule` | Datos del día (fecha, partidos, isToday…) |
| `viewMode` | `ScheduleViewMode` | Determina el `MatchCardVariant` usado |

---

## MatchCard

**Archivo:** `MatchCard/MatchCard.tsx`

Tarjeta de un partido. Tiene dos modos de renderizado:

- **Compacto** (`compact=true`): una fila simple con equipo vs equipo, hora y fase. Se usa en vistas de 3 días.
- **Agenda** (default): expandible. Muestra banderas, cuotas 1x2 y badges de mercado cuando se expande.

Las tarjetas se crean vía `MatchCardFactory.create()` — no instanciar directamente en DayGroup.

**Estado inicial expandido:**
- Sí: si `isToday=true`, `match.isLive=true`, o `alwaysExpanded=true`
- No: el resto de los partidos

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `match` | `SportMatch` | — | Datos del partido |
| `isToday` | `boolean` | `false` | Si el día del partido es hoy |
| `compact` | `boolean` | `false` | Vista compacta (sin cuotas, sin expand) |
| `alwaysExpanded` | `boolean` | `false` | Forzar estado expandido sin header clickeable |
| `onClose` | `() => void?` | — | Si se pasa, muestra botón de cierre (modo modal) |

**Archivos relacionados:**
- `MetaRow.tsx` — fila de hora + competencia + badges
- `MatchCard.constants.ts` — configuración de `MARKET_BADGES`

### MARKET_BADGES

Definidos en `MatchCard.constants.ts`. Cada badge tiene:

```ts
interface MarketBadge {
  label: string;          // Texto visible: 'PA', 'BB', 'SC'
  styleKey: string;       // Clave CSS: 'iconBadgePa', etc.
  hideWhenLive?: boolean; // Si true → se oculta durante partidos en vivo
}
```

Para agregar un badge nuevo: añadir entrada al array + clase CSS en `MatchCard.module.css`.

---

## LiveBanner

**Archivo:** `LiveBanner/LiveBanner.tsx`

Banner rojo con punto pulsante que aparece encima de la tarjeta cuando un partido está en vivo y tiene `liveStream` configurado.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Texto del banner / link de transmisión |
| `onClick` | `() => void?` | Si se pasa, el banner se renderiza como `<button>`; si no, como `<span>` |

---

## WeeklyCalendarView

**Archivo:** `WeeklyCalendarView/WeeklyCalendarView.tsx`

Vista de cuadrícula semanal con línea de tiempo por horas. Muestra los partidos de la semana actual posicionados verticalmente según su hora de inicio.

**Características:**
- Línea de "ahora" que se actualiza cada minuto.
- Scroll automático hasta la hora actual al primer render.
- Al hacer clic en un partido abre un `Modal` con `MatchCard` en modo `alwaysExpanded`.
- Si un día supera `OVERFLOW_THRESHOLD` partidos en un bloque, muestra un `OverflowPill` con el conteo restante.
- Al hacer clic en `OverflowPill` abre un sheet con todos los partidos del día.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `daySchedules` | `DaySchedule[]` | Días de la semana con sus partidos |
| `currentDate` | `Date` | Fecha representativa de la semana visible |
| `todayKey` | `string` | Clave `YYYY-MM-DD` del día actual para resaltar columna |

**Sub-componentes (en la misma carpeta):**

| Archivo | Rol |
|---|---|
| `WeekEventCard.tsx` | Tarjeta compacta posicionada absolutamente dentro de la columna de hora |
| `OverflowPill.tsx` | Indicador "+N más" que abre el sheet de día completo |
| `WeeklyCalendarView.utils.ts` | Constantes (`HOUR_HEIGHT`, `HOURS`, `OVERFLOW_THRESHOLD`) y helpers (`timeToMinutes`, `formatHour`, `abbrev`) |

---

## BettingSlip

**Archivo:** `BettingSlip/BettingSlip.tsx`

Panel deslizante que muestra las selecciones del cupón de apuestas. Se abre desde el botón flotante "Cupón" en `ScheduleView`.

Consume el hook `useBetting()` (Redux) para leer y modificar las selecciones. No usa `BettingContext`.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `isOpen` | `boolean` | Controla la visibilidad del panel |
| `onClose` | `() => void` | Callback para cerrar |
