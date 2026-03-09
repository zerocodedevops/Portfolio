# 🔧 Setup & Configuration

Bienvenido a la guía de configuración y setup de herramientas del ecosistema ZeroCode Monorepo.

## Code Quality Tools

| Tool           | Purpose                                            | Config File                       |
| -------------- | -------------------------------------------------- | --------------------------------- |
| **ESLint**     | Linting analítico para bugs y estándares de código | `.eslintrc.cjs` / `.eslintignore` |
| **Prettier**   | Formateador de código predeterminado               | `.prettierrc` / `.prettierignore` |
| **TypeScript** | Type safety y compilación (no-emit settings)       | `tsconfig.json`                   |

_(Nota: Anteriormente existía Biome (`biome.json`), esta herramienta se ha eliminado para eliminar redundancias con Prettier y ESLint)_.

## CI/CD & Monitoring

| Tool                      | Purpose                                  | Config File                                     |
| ------------------------- | ---------------------------------------- | ----------------------------------------------- |
| **Lighthouse**            | Métricas de Performance y Auditoría      | `lighthouserc.js`                               |
| **Playwright**            | E2E Testing Framework                    | `playwright.config.ts`                          |
| **Vitest**                | Unit & Component Testing                 | `vitest.config.ts`                              |
| **Firebase**              | Continuous Deployment and Hosting config | `firebase.json` / `.firebaserc`                 |
| **CodeClimate/SonarQube** | Métricas del código                      | `.codeclimate.yml` / `sonar-project.properties` |

## Tailwind & Estilos

Cada aplicación en `/apps` hereda o implementa un `tailwind.config.js` independiente acoplado con su proceso de build a través de Vite (`vite.config.ts`).
