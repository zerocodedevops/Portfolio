# 🚀 ZeroCode Portfolio Monorepo

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-%23EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)

Bienvenido al epicentro del desarrollo full-stack de **ZeroCode**. Este repositorio opera como un **Monorepo gestionado por Turborepo e npm workspaces**, alojando un ecosistema de 8 aplicaciones independientes que abarcan desde e-commerce avanzados hasta dashboards analíticos en tiempo real.

---

## 🌟 Ecosistema de Aplicaciones (`/apps`)

Nuestra arquitectura modular permite el desarrollo aislado pero interconectado de las siguientes soluciones:

| Proyecto                                                 | Tecnologías Clave                | Área de Negocio                 |
| -------------------------------------------------------- | -------------------------------- | ------------------------------- |
| 🎨 **[Portfolio](./apps/portfolio)**                     | `React`, `Framer Motion`, `i18n` | Presentación principal          |
| 🛒 **[E-Commerce Shop](./apps/ecommerce-shop)**          | `Redux Toolkit`, `Stripe`        | Tienda virtual completa         |
| 📈 **[Analytics Dashboard](./apps/analytics-dashboard)** | `Recharts`, `Zustand`            | Visualización de datos y BI     |
| 🚚 **[Shipping Service](./apps/shipping-service)**       | `React Hook Form`, `Zod`         | Logística y gestión de envíos   |
| 🏗️ **[Home Renovation](./apps/home-renovation)**         | `React Router v7`                | Plataforma B2B para reformas    |
| 💇‍♀️ **[ZeroVanity](./apps/zerovanity)**                   | `Supabase`, `React Big Calendar` | Sistema de gestión para salones |
| 🪙 **[Crypto](./apps/crypto)**                           | `WebSockets`, `Framer Motion`    | Live tracking de criptomonedas  |
| 🛍️ **[E-Commerce](./apps/ecommerce)**                    | `React`, `Tailwind`              | Solución e-commerce genérica    |

---

## ⚡ Quick Start

### 1. Clonar e Instalar

```bash
git clone https://github.com/zerocodedevops/Portfolio.git
cd Portfolio
npm install
```

### 2. Entorno de Desarrollo (Turbo)

Arranca todas las aplicaciones simultáneamente aprovechando la caché de Turbo:

```bash
npm run dev:all
```

_O ejecuta el portfolio principal unicamente con `npm run dev`._

### 3. Build & Producción

```bash
npm run build:all
```

---

## 📚 Documentación Base

Para sumergirte a fondo en las decisiones arquitectónicas del repositorio:

- 🏗️ **[Arquitectura Global (ARCHITECTURE.md)](docs/ARCHITECTURE.md)**: Flujos, estándares de directorios y BBDD.
- ⚙️ **[Guía de Setup (SETUP.md)](docs/SETUP.md)**: Configuración de ESLint, Prettier, Firebase y Husky.
- 🤝 **[Guía de Contribución (CONTRIBUTING.md)](CONTRIBUTING.md)**: Normas para ramas, commits y testing con Vitest/Playwright.
- 🤖 **[Políticas de IA (docs/AI.md)](docs/AI.md)**: Contexto crítico para agentes de código.

---

_Desarrollado con ❤️ por el equipo de ZeroCode Devops._
