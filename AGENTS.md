# Agent instructions

## Project overview

`newtest` is a minimal GitHub repository scaffold. It currently contains only `README.md` (title: `newtest`). There is no application source, dependency manifests, Docker setup, or CI configuration yet.

## Cursor Cloud specific instructions

### Services

There are no services to start. When application code is added, document required processes here (dev servers, databases, etc.) and point to the canonical run commands in `README.md` or package scripts.

### Lint / test / build / run

No project-level lint, test, build, or run commands exist until you add tooling (for example `package.json`, `Makefile`, or `pyproject.toml`).

The Cloud VM already provides common runtimes if you add code later:

- Node.js (via `/exec-daemon/node` and nvm)
- Python 3.12
- Git

### Update script behavior

The VM startup update script is a no-op (`true`) because this repo has no dependencies to refresh. After adding a lockfile or install script, change the update script to match (for example `npm ci` or `pnpm install --frozen-lockfile`).

### Gotchas

- Do not assume `npm install` will succeed until a `package.json` exists.
- There is no `.cursor/environment.json` or `.devcontainer` configuration in this repo.
