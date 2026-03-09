# IDE Configuration

We use VS Code + modern AI IDEs (Cursor) for development.
Workspace configuration files (`.vscode/` or `.cursor/`) are specifically ignored by git to avoid polluting the repo with local machine paths and custom extensions.

## Recommended Extensions

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Vitest** (ZixuanChen.vitest-explorer)

## Project Settings

- Format on Save: **Enabled** (Default formatter: Prettier)
- ESLint auto-fix on save: **Enabled**

_(Previously tracked under the `.cursor/` directory, now moved to gitignore + documentation)_
