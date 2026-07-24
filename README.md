# Sonar Products

Local learning app for studying Sonar products, code-quality concepts, and Customer Success Engineer interview scenarios. The app runs directly from this repository root.

Public offline app: `https://learn-products.netlify.app/offline`

## What Is Included

- Next.js learning interface with topic levels and mixed question sessions.
- Quiz, flashcard, and mind-map question support in the domain model.
- Prisma-backed SQLite schema and local migration script.
- JSON content import and validation for the Sonar learning curriculum.
- Unit, component, and Playwright test coverage.
- Research, glossary, and question-review notes under `docs`.
- Installable PWA metadata and mobile-first touch ergonomics for phone study.

## Architecture

```text
.
+-- app/                    Next.js App Router pages
+-- components/             Learning session and question UI
+-- content/                Importable Sonar learning content
+-- docs/                   Research notes, glossary, review, and ADRs
+-- domain/                 Entities, services, and repository contracts
+-- infrastructure/         Prisma database and repository implementation
+-- lib/                    Import, validation, and transition config
+-- public/                 PWA manifest, service worker, and app icon
+-- prisma/                 SQLite schema and migrations
+-- scripts/                Local migration and content import commands
+-- tests/                  Vitest and Playwright tests
```

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

`npm run dev` applies the local SQLite migration, imports `content/sonar-products-learning.json`, and starts Next.js. Open `http://localhost:3000`.

To try it from a phone on the same Wi-Fi network, start the dev server on all interfaces:

```bash
npm run dev -- -H 0.0.0.0
```

Then open `http://<your-computer-lan-ip>:3000/offline` on the phone. For an actual commuting setup, deploy the app to a reachable HTTPS URL and install it from the browser's Add to Home Screen option. The `/offline` route bundles the current curriculum into static pages so it can run without the local Prisma database once cached.

Before commuting, open `/offline` and each level once while you still have a connection. That gives the service worker a chance to cache the static study pages and app assets.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
npm run db:migrate
npm run db:reset
npm run content:validate
npm run content:import
```

Import a custom content file:

```bash
npm run content:import -- path/to/content.json
```

Coverage writes LCOV output to `coverage/lcov.info`.

## Learning Flow

Questions move through a deterministic state model:

```text
unanswered -> active -> first_error -> correct -> failed -> revealing_answer -> completed
```

Transition timings live in `lib/transitionConfig.ts`:

- mind-map correct hold: `3000ms`
- failed answer reveal: `2000ms`
- standard correct feedback: `1500ms`
- fade duration: configurable

The session service owns current position, error counts, requeued flashcards, backward navigation, automatic progression, retries, and completion calculations.

## Content

The default curriculum lives in `content/sonar-products-learning.json`. Supporting review material lives in:

- `docs/sonar-research-dossier.md`
- `docs/sonar-cse-glossary.md`
- `docs/sonar-question-review.md`
- `docs/adr/0001-local-learning-scaffold.md`
- `docs/git-workflow.md`
- `docs/deployment.md`

The importer validates quiz and mind-map shape, single correct objective answers, and the initial one-target mind-map implementation.

## Status

This is a local scaffold rather than a hosted product. It does not include authentication, an admin content editor, cloud deployment, AI content generation, or spaced repetition. The current browser demo uses an in-memory session while Prisma repository interfaces are ready for deeper persistence wiring.
