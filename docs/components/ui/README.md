# Componentes UI genéricos

Todos viven en `components/ui/`. Son independientes del dominio (agenda deportiva) y pueden reutilizarse en cualquier parte de la app.

---

## Icon

**Archivo:** `Icon/Icon.tsx`  
**Barrel:** `Icon/index.ts`

Librería centralizada de todos los iconos SVG de la aplicación. Todos aceptan una prop `size` (número en px).

**Iconos disponibles:**

| Export | Descripción | Size default |
|---|---|---|
| `ClockIcon` | Reloj analógico | 11 |
| `GlobeIcon` | Globo terráqueo | 11 |
| `BarChartIcon` | Gráfico de barras | 13 |
| `GridIcon` | Cuadrícula 2x2 | 13 |
| `ScoreIcon` | Documento con líneas | 13 |
| `ChevronDownIcon` | Flecha hacia abajo | 15 |
| `ChevronUpIcon` | Flecha hacia arriba | 15 |
| `InfoIcon` | Círculo de información | 13 |
| `CouponIcon` | Documento (cupón) | 20 |

**Uso:**

```tsx
import { ClockIcon, ChevronDownIcon } from '@/components/ui/Icon';

<ClockIcon />           // size=11 por defecto
<ClockIcon size={16} /> // tamaño personalizado
```

**Para agregar un icono nuevo:**
1. Agregar la función en `Icon/Icon.tsx` siguiendo el patrón existente.
2. Exportarla en `Icon/index.ts`.

---

## Button

**Archivo:** `Button/Button.tsx`

Botón base con variantes de estilo y tamaño.

---

## Input

**Archivo:** `Input/Input.tsx`

Campo de texto controlado con soporte de label y mensaje de error.

---

## Select

**Archivo:** `Select/Select.tsx`

Selector nativo estilizado con ícono de chevron.

---

## TextArea

**Archivo:** `TextArea/TextArea.tsx`

Área de texto con auto-resize y contador de caracteres opcional.

---

## Modal

**Archivo:** `Modal/Modal.tsx`

Modal con backdrop, trap de foco y soporte de cierre por Escape o clic fuera.
