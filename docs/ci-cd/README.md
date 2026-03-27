# CI/CD

El pipeline está definido en `.github/workflows/` con tres archivos de GitHub Actions.

---

## Arquitectura del pipeline

```
PR → develop | main
        │
        ▼
  [unit-tests.yml]          ← Workflow reutilizable
  - npm ci
  - npm run test:coverage
  - Sube artefacto coverage/
        │
        ▼ (needs: unit-tests)
  [pr-validation.yml / validate]
  - npm run lint
  - npx tsc --noEmit
  - npm run build


push → main
        │
        ▼
  [unit-tests.yml]          ← mismo workflow reutilizable
        │
        ▼ (needs: unit-tests)
  [docker-publish.yml / build-and-push]
  - docker build
  - push → ghcr.io/enzocv/schedule-worldcup
```

---

## `unit-tests.yml` — Workflow reutilizable

**Tipo:** `workflow_call` (no se dispara directamente, solo es invocado).

**Input:**

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `node-version` | `string` | `"22"` | Versión de Node.js |

**Output:**

| Output | Descripción |
|---|---|
| `result` | `"success"` o `"failure"` |

**Pasos:**
1. Checkout del repo
2. Setup Node.js con caché de npm
3. `npm ci`
4. `npm run test:coverage -- --ci --coverageReporters=text-summary`
5. Sube `coverage/` como artefacto (retención: 7 días)

---

## `pr-validation.yml`

**Trigger:** PR a `develop` o `main`; push a `develop`.

**Stage 1 — `unit-tests`:** Invoca `unit-tests.yml` con Node 22.

**Stage 2 — `validate`** (`needs: unit-tests`):
1. `npm ci`
2. `npm run lint` — ESLint 10 sobre `app/`, `components/`, `lib/`
3. `npx tsc --noEmit` — verificación de tipos
4. `npm run build` — build de producción de Next.js

El stage 2 solo se ejecuta si los tests pasan.

---

## `docker-publish.yml`

**Trigger:** Push a `main`.

**Stage 1 — `unit-tests`:** Igual que en pr-validation.

**Stage 2 — `build-and-push`** (`needs: unit-tests`):
1. Login a `ghcr.io` con `GITHUB_TOKEN`
2. Extrae metadatos (tags `latest` + `sha-<short>`)
3. `docker build` + push a `ghcr.io/enzocv/schedule-worldcup`
4. Usa caché de GitHub Actions para acelerar builds subsecuentes

---

## Configuración de Branch Protection (recomendada)

Para que el merge a `main` o `develop` esté bloqueado hasta que los checks pasen:

1. Ir a **Settings → Branches → Branch protection rules**.
2. Añadir regla para `main` y `develop`.
3. Activar **"Require status checks to pass before merging"**.
4. Agregar los checks: `Unit Tests / Run Unit Tests` y `Build & Type-check`.

---

## Notas de configuración

### `.npmrc`

El archivo `.npmrc` en raíz contiene:

```
legacy-peer-deps=true
```

Necesario porque TypeScript 6 entra en conflicto de peer deps con `typescript-eslint@8` (que declara `typescript < 6.0.0`). Sin esta bandera, `npm ci` falla en modo estricto en CI.

### ESLint

El script `lint` ejecuta `eslint app components lib` (flat config en `eslint.config.mjs`). Se usa ESLint 10 directamente porque `next lint` fue eliminado en Next.js 16.
