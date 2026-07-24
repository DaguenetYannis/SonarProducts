# Sonar Products

Local learning app for studying Sonar products, code-quality concepts, and Customer Success Engineer interview scenarios. The app runs directly from this repository root.

## What Is Included

- Next.js learning interface with topic levels and mixed question sessions.
- Quiz, flashcard, and mind-map question support in the domain model.
- Prisma-backed SQLite schema and local migration script.
- JSON content import and validation for the Sonar learning curriculum.
- Unit, component, and Playwright test coverage.
- Research, glossary, and question-review notes under `docs`.

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

The importer validates quiz and mind-map shape, single correct objective answers, and the initial one-target mind-map implementation.

## Status

This is a local scaffold rather than a hosted product. It does not include authentication, an admin content editor, cloud deployment, AI content generation, or spaced repetition. The current browser demo uses an in-memory session while Prisma repository interfaces are ready for deeper persistence wiring.
