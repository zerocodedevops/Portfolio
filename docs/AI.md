# AI Development Workflows & Agents

This document maintains rules, context settings, and conventions for any AI agents (like Cursor, Gemini, Claude, Copilot) interacting with this monorepo.

## Rules & Context

- Agents should always run commands from the monorepo root unless explicitly instructed otherwise.
- Scripts must respect the workspace structure (`apps/*`).
- Do not create abstract/empty directories. Wait for requirements.
- Tests must colocate with components (`*.test.tsx`).
- Respect strict typing. Avoid `any`.

_(Previously tracked under `.agent/` directory, now centralized here for cleaner infrastructure)._
