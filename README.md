# ZeroCode DevOps Monorepo

Welcome to the ZeroCode DevOps Monorepo. This repository houses the main developer portfolio, along with a suite of complete applications that demonstrate various capabilities: E-commerce workflows, realtime dashboards, crypto tracking, and more.

## Architecture & Structure

This is a Vite-powered monorepo, orchestrating multiple independent applications from a single source of truth.

```text
/
├── apps/                  # Independent workspaces (applications)
│   ├── analytics          # Dashboard & metrics application
│   ├── crypto             # Realtime websocket crypto tracking
│   ├── devops-shop        # E-commerce application
│   ├── ecommerce          # E-commerce alternative / modules
│   ├── zero-chaos         # Home renovation landing & service app
│   ├── zerodelay          # Shipping service platform
│   └── zerovanity         # Salon booking application
├── db/                    # Database schemas and scripts
│   └── schema/            # SQL init and logic scripts
├── src/                   # Main Portfolio application source code
│   ├── app/               # Main layout and routing
│   ├── components/        # Shared portfolio components
│   ├── features/          # Portfolio feature modules
│   └── ...
├── SCRIPTS.md             # Documentation for package.json scripts
├── CONTRIBUTING.md        # Testing strategies and Git workflow
└── package.json           # Root workspace and monorepo scripts
```

## Entry Point

The root application is the **Main Developer Portfolio**.

- The entry point for the portfolio is **`public/index.html`**, which bootstraps `src/main.tsx`.
- The apps inside `apps/` have their own nested `index.html` entry points.

## Firebase Deployment Targets

The monolithic structure deploys to different Firebase Hosting targets based on the application:

- **Portfolio (Root)**: Deploys to `zerocode-portfolio`
- **Zerodelay**: Deploys to its designated target via `firebase.json` configuration
- **DevOps Shop**: Deploys to its designated target via `firebase.json` configuration
- **Zero Chaos**: Deploys to its designated target via `firebase.json` configuration

_Check `firebase.json` and `.firebaserc` for the exact hosting configurations mappings per site._

## Quick Start

### Installation

```bash
git clone https://github.com/zerocodedevops/Portfolio.git
cd Portfolio
npm install
```

### Running the Portfolio

```bash
npm run dev
```

For more details on running individual apps, testing, and formatting, see [SCRIPTS.md](./SCRIPTS.md).

## Tools Configuration

This project enforces strict code quality:

- **ESLint & Prettier**: Used for core logic linting and code formatting.
- **Biome**: Experimental integration for high-performance formatting and linting.
- **Vitest & Playwright**: Unit and E2E testing standard. Check `CONTRIBUTING.md` for guidelines.
