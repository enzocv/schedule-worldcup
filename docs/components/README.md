# Componentes

Índice de todos los componentes de la aplicación, organizados por categoría.

- [Componentes de la agenda deportiva](./schedule/README.md)
- [Componentes UI genéricos](./ui/README.md)

---

## Reglas generales

- Cada componente vive en su propia carpeta con el mismo nombre.
- La carpeta contiene: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts` (barrel).
- Los sub-componentes que solo usa un componente padre viven en la misma carpeta.
- Las constantes propias del componente van en `ComponentName.constants.ts`.
- Ningún componente importa directamente desde otro componente `src/`, solo desde su propio módulo CSS o desde `@/lib/*` y `@/components/ui/*`.
