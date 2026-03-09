# Scripts Guide (package.json)

This document explains the purpose of each script defined in the root `package.json` of the ZeroCode Portfolio monorepo.

## Development Scripts

- **`dev`**: Starts the main Vite development server for the portfolio.
- **`dev:reformas`**: Starts the development server for the Zero Chaos (Reformas) application in isolation.

## Build Scripts

- **`build:portfolio`**: Builds the main portfolio application using Vite.
- **`build:zerodelay`**: Builds the ZeroDelay (shipping service) app and copies its output to the main `dist/` folder.
- **`build:devops-shop`**: Builds the eCommerce shop and copies its output to `dist/devops-shop/`.
- **`build:reformas`**: Builds the Zero Chaos app and copies its output to `dist/reformas/`.
- **`build`**: Runs all build scripts sequentially to prepare the entire monorepo for deployment.
- **`analyze`**: Runs Vite build with the bundle visualizer (if plugin is enabled).

## Quality & Formatting

- **`lint`**: Runs ESLint across the codebase.
- **`format`**: Runs Prettier to format code.
- **`type-check`**: Runs the TypeScript compiler (tsc) without emitting files to verify types.
- **`check:biome`**: (Optional) Runs Biome linter and formatter checks.
- **`format:biome`**: (Optional) Formats code using Biome.
- **`lint:biome`**: (Optional) Lints code using Biome.

## Testing

- **`test`**: Runs the unit tests via Vitest.
- **`test:ui`**: Runs unit tests with the Vitest UI interface.
- **`test:e2e`**: Runs end-to-end tests via Playwright.

## Utility Scripts

These PowerShell scripts manage repository state and synchronization:

- **`sync`**: (`scripts/sync.ps1`) Sincroniza todos los repositorios (pull y actualización de submódulos), instala dependencias y **restaura automáticamente la sesión de la IA** desde el repositorio.
- **`push-all`**: (`scripts/push-all.ps1`) Exporta la sesión actual de la IA al repositorio, añade, commitea y sube todos los repositorios locales a GitHub en una sola operación.
- **`export-session`**: (`scripts/export-session.ps1`) Exporta manualmente el estado del "cerebro" (brain) y la sesión de la IA a la carpeta `.ai-session/` del repositorio.
- **`import-session`**: (`scripts/import-session.ps1`) Importa manualmente el estado de la sesión de la IA desde `.ai-session/` a la base de datos local de la conversación activa.
