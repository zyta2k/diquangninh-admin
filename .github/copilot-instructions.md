<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot / AI agent instructions — diquangninh-admin

Purpose: give succinct, actionable guidance so an AI can be productive in this repo immediately.

- **Big picture:** This is a Vite + React app using TanStack Router (file-based routes) and Tailwind. Routing is file-first under `src/routes`; the router is created in `src/router.tsx` (imports `routeTree.gen`). The root layout is `src/routes/__root.tsx` which composes `Header`, global CSS, and devtools. Production deploy uses Cloudflare Workers via `wrangler` (see `package.json` scripts and `wrangler.jsonc`).

- **Key files to inspect first:**
  - `package.json` — scripts and deps (use `npm run dev`, `build`, `preview`, `deploy`, `test`, `lint`).
  - `src/routes/__root.tsx` — global layout, `HeadContent`, `Scripts`, devtools integration.
  - `src/router.tsx` — constructs router using `routeTree` (generated file).
  - `src/routeTree.gen` (generated) — the file-based route tree; modify routes under `src/routes` instead of editing the generated tree directly.
  - `src/components/*` — UI primitives (e.g., `Header.tsx`).
  - `data/` — demo data used by routes (`demo.punk-songs.ts`).

- **Routing and data-loading patterns:**
  - Routes are created as files in `src/routes`. Add a new route by adding a file; the build generates `routeTree.gen` from these files.
  - Use TanStack Router `loader` functions for per-route server/client data loading. Example patterns are in `src/routes/demo/*` (look for `start.ssr.*` and `start.api-request.tsx`).
  - There are several demo variants showing SSR vs SPA vs data-only loader usage — use them as templates when adding server-rendered routes.

- **Scripts & workflows:**
  - Local dev: `npm install` then `npm run dev` (Vite dev server on port 3000).
  - Build: `npm run build` (Vite). Preview: `npm run preview`.
  - Deploy to Cloudflare Workers: `npm run deploy` (runs `wrangler deploy` after `build`).
  - Tests: `npm run test` (Vitest). Lint/format: `npm run lint`, `npm run format`, `npm run check`.
  - Note: README contains an outdated `npm run start` instruction — prefer `npm run dev` per `package.json`.

- **Project-specific conventions & gotchas:**
  - File-based routing: always add/remove files inside `src/routes` and let the generator update `routeTree.gen` rather than editing the router tree manually.
  - Demo files (prefixed with `demo`) are safe to remove; they show common patterns (see `src/routes/demo`).
  - Root layout (`__root.tsx`) uses `TanStackDevtools` and `TanStackRouterDevtoolsPanel` — these are present in development and may be removed for production changes.
  - CSS is imported in the root via `import appCss from '../styles.css?url'` — keep the query suffix if copying the import style.

- **Integration points / external dependencies:**
  - Cloudflare: `wrangler` and `@cloudflare/vite-plugin` → relevant for build and deploy.
  - TanStack packages: `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-query` variants — be cautious when updating major versions due to generated route tree compatibility.
  - Tailwind CSS and `tailwind-merge` are in use for styling.

- **Good first edits for an agent:**
  - Fix README mismatch: update to mention `npm run dev` instead of `npm run start`.
  - Add a small route under `src/routes` using a demo SSR example (copy from `src/routes/demo/start.ssr.index.tsx`).
  - When editing routes, run `npm run dev` locally to ensure `routeTree.gen` is regenerated and HMR works.

- **When to run tests / lint / build:**
  - Run `npm run test` after non-trivial logic changes.
  - Run `npm run lint` / `npm run format` before commits; `npm run check` runs both autofixers.
  - Run `npm run build` and `npm run preview` to validate production artifacts; use `npm run deploy` only when ready for Cloudflare.

If any section is unclear or you want this tailored (e.g., include examples from `src/routes/demo`), tell me which part to expand or merge differently.
