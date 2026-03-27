# Componentes

Índice de todos los componentes de la aplicación, organizados por categoría.

- [Componentes de la agenda deportiva](./schedule/README.md)

> **Nota:** La carpeta `calendar/` fue eliminada. La carpeta `components/ui/` contiene los componentes genéricos (Button, Input, Modal, Select, TextArea, Icon).

## Reglas generales

- Cada componente vive en su propia carpeta con el mismo nombre.
- La carpeta contiene: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts` (barrel).
- Los sub-componentes que solo usa un componente padre viven en la misma carpeta (ej. `MetaRow.tsx`, `OverflowPill.tsx`, `WeekEventCard.tsx`).
- Las constantes propias del componente van en `ComponentName.constants.ts`.
- Las utilidades propias van en `ComponentName.utils.ts`.
- Ningún componente crea instancias de otros componentes directamente si existe un Factory — usar `MatchCardFactory.create()` para los cards de partidos.
- Los componentes no acceden al store directamente; consumen `useBetting()` o `useEvents()` de `@/lib/store/hooks`.
