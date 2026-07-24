# ADR 0001: Local Learning Scaffold

## Status

Accepted.

## Context

The initial product must run locally, avoid hosted services, keep question content out of the development database, and support mixed question types within a level.

## Decisions

SQLite is selected because it is a relational database that runs locally from a file, keeps setup friction low, and is well supported by Prisma.

Questions use relational subtype tables instead of one large JSON payload so quiz, flashcard, and mind-map fields can be validated, constrained, queried, and migrated independently. JSON is reserved only for optional visual layout metadata.

Progression is handled by a state machine because answer forgiveness, timed transitions, retry behavior, back navigation, and restoration rules need one deterministic authority.

Flashcards use self-assessment because they are not objective multiple-choice questions. The transition policy is isolated so later learning-science changes can be made without disturbing quiz or mind-map behavior.

Question types are mixed in the level sequence because the learning session is the product unit; separate sections would train navigation around formats rather than preserving a unified level attempt.

## Consequences

The first scaffold has more domain code than a page-only prototype, but behavior is easier to test and persistence has clear boundaries. Future work can add server-side persistence without rewriting the question interfaces.
