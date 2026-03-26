# Componentes de la agenda deportiva

Todos viven en `components/schedule/`.

---

## ScheduleView

**Archivo:** `ScheduleView/ScheduleView.tsx`

Componente raíz de la vista. Envuelve todo con `BettingProvider` y orquesta el layout: AppBar, ScheduleHeader, lista de partidos y panel BettingSlip.

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

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `day` | `DaySchedule` | Datos del día (fecha, partidos, isToday…) |
| `viewMode` | `ScheduleViewMode` | Si no es `'agenda'`, los cards se muestran compactos |

---

## MatchCard

**Archivo:** `MatchCard/MatchCard.tsx`

Tarjeta de un partido. Tiene dos modos de renderizado:

- **Compacto** (`compact=true`): una fila simple con equipo vs equipo, hora y fase. Se usa en vistas de 3 días y semana.
- **Agenda** (default): expandible. Muestra banderas, cuotas 1x2 y badges de mercado cuando se expande.

**Estado inicial expandido:**
- Sí: si `isToday=true` o si `match.isLive=true`
- No: el resto de los partidos

**Props:**

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `match` | `SportMatch` | — | Datos del partido |
| `isToday` | `boolean` | `false` | Si el día del partido es hoy |
| `compact` | `boolean` | `false` | Vista compacta |

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
| `label` | `string` | Texto del link de transmisión |
| `url` | `string?` | URL del stream (opcional) |

---

## BettingSlip

**Archivo:** `BettingSlip/BettingSlip.tsx`

Panel deslizante que muestra las selecciones del cupón de apuestas. Se abre desde el botón flotante "Cupón" en `ScheduleView`.

**Props:**

| Prop | Tipo | Descripción |
|---|---|---|
| `isOpen` | `boolean` | Controla la visibilidad del panel |
| `onClose` | `() => void` | Callback para cerrar |

Consume `BettingContext` para leer y modificar las selecciones.
