# Sistema de Diseño — Schedule World Cup 2026

Todos los tokens están definidos en [`styles/tokens.css`](../../styles/tokens.css) como variables CSS y aplicados globalmente desde `app/globals.css`. Nunca se deben usar valores mágicos en los módulos CSS — siempre referenciar las variables de este sistema.

---

## Paleta de Colores

### Colores Primarios
```css
--color-primary: #4F46E5;        /* Indigo principal */
--color-primary-light: #6366F1;  /* Indigo claro */
--color-primary-dark: #4338CA;   /* Indigo oscuro */
```

### Colores Secundarios
```css
--color-secondary: #10B981;      /* Verde éxito */
--color-warning: #F59E0B;        /* Amarillo advertencia */
--color-danger: #EF4444;         /* Rojo error */
--color-info: #3B82F6;           /* Azul información */
```

### Colores Neutros
```css
--color-white: #FFFFFF;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
--color-black: #000000;
```

### Colores de Eventos (Categorías)
```css
--event-work: #3B82F6;           /* Azul para trabajo */
--event-personal: #10B981;       /* Verde para personal */
--event-meeting: #F59E0B;        /* Amarillo para reuniones */
--event-other: #8B5CF6;          /* Púrpura para otros */
```

## Tipografía

### Familia de Fuentes
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
                'Droid Sans', 'Helvetica Neue', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code',
             'Fira Mono', 'Roboto Mono', monospace;
```

### Tamaños de Fuente
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Pesos de Fuente
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Alturas de Línea
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## Espaciado

### Sistema de Espaciado (8px base)
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

## Bordes

### Radio de Bordes
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Círculo completo */
```

### Ancho de Bordes
```css
--border-width-0: 0;
--border-width-1: 1px;
--border-width-2: 2px;
--border-width-4: 4px;
```

## Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

## Transiciones

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

## Breakpoints (Responsive)

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Z-Index Scale

```css
--z-index-dropdown: 1000;
--z-index-sticky: 1020;
--z-index-fixed: 1030;
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;
--z-index-popover: 1060;
--z-index-tooltip: 1070;
```

## Componentes UI - Especificaciones

### Botones
- **Altura**: 40px (md), 36px (sm), 48px (lg)
- **Padding**: 16px horizontal
- **Border Radius**: 8px
- **Font Weight**: 600

### Inputs
- **Altura**: 40px
- **Padding**: 12px
- **Border**: 1px solid gray-300
- **Border Radius**: 6px
- **Focus**: 2px outline primary color

### Modal
- **Ancho máximo**: 500px
- **Padding**: 24px
- **Border Radius**: 12px
- **Backdrop**: rgba(0, 0, 0, 0.5)

### Cards
- **Padding**: 16px
- **Border Radius**: 8px
- **Border**: 1px solid gray-200
- **Shadow**: shadow-sm en hover

## Accesibilidad

### Contraste de Colores
- Todos los textos cumplen WCAG 2.1 AA (mínimo 4.5:1)
- Elementos interactivos cumplen WCAG 2.1 AAA (mínimo 7:1)

### Focus States
- Outline visible en todos los elementos interactivos
- Color: primary con 2px de ancho

### Tamaños Touch
- Mínimo 44x44px para elementos táctiles (iOS guidelines)
- Spacing adecuado entre elementos interactivos

## Guías de Uso

### Espaciado Consistente
- Usar el sistema de espaciado de 8px
- Mantener consistencia vertical y horizontal

### Jerarquía Visual
- Títulos: font-size-2xl + font-weight-bold
- Subtítulos: font-size-lg + font-weight-semibold
- Cuerpo: font-size-base + font-weight-normal

### Feedback Visual
- Estados de hover: reducir opacidad 10%
- Estados activos: aumentar saturación
- Estados disabled: opacidad 50%

---

## Tokens específicos de la agenda deportiva

Estos tokens NO están en `tokens.css` (son propios de los módulos CSS de la agenda), pero siguen las mismas convenciones de naming.

### Badges de mercado (`MatchCard`)

| Badge | Color | Cuándo se muestra |
|---|---|---|
| `PA` (Pago Anticipado) | Rojo `#EF4444` | Solo cuando el partido **no** está en vivo |
| `BB` (BetBuilder) | Azul `#3B82F6` | Siempre |
| `SC` (SuperCuota) | Verde `#10B981` | Siempre |

La configuración de qué badges se muestran y bajo qué condiciones está centralizada en `components/schedule/MatchCard/MatchCard.constants.ts`. Para agregar un badge nuevo, solo se añade una entrada al array `MARKET_BADGES` y se crea el token CSS correspondiente en el módulo.

### Colores del estado en vivo

```css
/* LiveBanner */
--live-bg: darkred;          /* fondo del banner */
--live-dot: #ff4444;         /* indicador pulsante */
```

### Icono centralizado

Todos los SVG de la aplicación están en `components/ui/Icon/Icon.tsx`. Aceptan una prop `size` (número en px, default según el icono). Se consumen via el barrel export `@/components/ui/Icon`.

