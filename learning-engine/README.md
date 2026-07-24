# Local Learning Engine

This project is a local educational web application scaffold for topic-based levels with mixed question types: multiple-choice quizzes, flashcards, and mind-map or organisational-chart completion questions.

The development database contains no educational questions and no seed script is provided. Content is added later through the documented import command.

## Architecture

- `app/`: Next.js App Router pages and empty states.
- `components/learning/`: session shell, progress, and result views.
- `components/questions/`: focused question interfaces.
- `domain/entities/`: domain types.
- `domain/services/`: session orchestration, answer evaluation, flashcard policy, attempt tracking, ordering, and progression.
- `domain/repositories/`: persistence interfaces.
- `infrastructure/database/`: Prisma client.
- `infrastructure/repositories/`: Prisma-backed repository implementation.
- `lib/`: transition config, content validation, and import service.
- `prisma/`: SQLite schema and migrations.
- `tests/`: unit, component, and Playwright tests with synthetic labels only.

## Local Installation

```bash
npm install
cp .env.example .env
npm run dev
```

`npm run dev` applies the local migration, imports `content/sonar-products-learning.json`, and starts Next.js. Open `http://localhost:3000`.

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
npm run content:import
npm run content:import -- path/to/content.json
```

Coverage writes LCOV output to `coverage/lcov.info`.

## Domain State

Questions move through a deterministic state model:

`unanswered`, `active`, `first_error`, `correct`, `failed`, `revealing_answer`, `completed`.

Transition timings live in `lib/transitionConfig.ts`:

- mind-map correct hold: `3000ms`
- failed answer reveal: `2000ms`
- standard correct feedback: `1500ms`
- fade duration: configurable

The session service is the authority for current position, error counts, requeued flashcards, backward navigation, automatic progression, retries, and completion calculations.

## Attempt Recording

Each retry creates a new `LevelAttempt`. Each question has a `QuestionAttempt` containing sequence position, state, final status, error count, selected answers, eventual correctness, timestamps, and the owning level-attempt identifier. `AnswerSelection` preserves selected answer history and prevents repeated answer IDs from corrupting attempt state.

## Importing Content Later

Create a JSON file with this shape, replacing placeholders with your own content:

```json
{
  "topics": [
    {
      "slug": "<topic-slug>",
      "title": "<topic title>",
      "description": "<optional description>"
    }
  ],
  "levels": [
    {
      "slug": "<level-slug>",
      "title": "<level title>",
      "description": "<optional description>",
      "topicSlugs": ["<topic-slug>"],
      "questions": [
        {
          "type": "quiz",
          "key": "<stable-local-key>",
          "prompt": "<prompt>",
          "choices": [
            { "key": "<choice-key>", "label": "<label>", "isCorrect": true },
            { "key": "<choice-key>", "label": "<label>", "isCorrect": false },
            { "key": "<choice-key>", "label": "<label>", "isCorrect": false }
          ]
        },
        {
          "type": "flashcard",
          "key": "<stable-local-key>",
          "prompt": "<prompt>",
          "front": "<front text>",
          "back": "<back text>"
        },
        {
          "type": "mind_map",
          "key": "<stable-local-key>",
          "prompt": "<prompt>",
          "nodes": [
            { "key": "<node-key>", "parentKey": null, "label": "<label>", "isTarget": false },
            { "key": "<node-key>", "parentKey": "<node-key>", "label": null, "isTarget": true }
          ],
          "choices": [
            { "key": "<choice-key>", "label": "<label>", "isCorrect": true },
            { "key": "<choice-key>", "label": "<label>", "isCorrect": false },
            { "key": "<choice-key>", "label": "<label>", "isCorrect": false }
          ],
          "layoutMetadata": {}
        }
      ]
    }
  ]
}
```

Run the default Sonar content import:

```bash
npm run content:import
```

Or import a different future content file:

```bash
npm run content:import -- path/to/content.json
```

The importer validates exactly three choices for quiz and mind-map questions, exactly one correct objective answer, and one target blank for the initial mind-map implementation.

## Test Strategy

Unit tests cover answer forgiveness, second-error failure, correct-after-error preservation, flashcard reveal/requeue/failure, backward restoration, retry ordering, double-click protection, timer cleanup, and result calculations. Component tests cover all three question interfaces. Playwright verifies the local empty application state and can be extended with isolated test-database content.

## Known Limitations

- No authentication, hosted database, cloud deployment, admin content editor, AI content generation, or spaced repetition.
- The browser demo uses an in-memory session; Prisma repository interfaces are ready for deeper persistence wiring in later flows.
- Mind maps support one target blank in the UI, while the schema avoids blocking future multi-blank support.

## Logical Next Steps

- Add an isolated E2E content database setup for full mixed-level browser flows.
- Persist browser session transitions through server actions.
- Add import rollback and duplicate-content reconciliation policies.
