# Git Workflow

This repo uses small, named branches for changes that have their own purpose.

## Current Branches

- `main`: stable local baseline. The root-flattening change was committed here as `c015e13` because it changed the project structure before feature work started.
- `mobile-pwa`: feature branch for making the learning app phone-friendly and installable.

## Why Branch This Way

Structural changes and feature changes are easier to review when they are separate commits. If SonarQube Cloud, tests, or manual review finds a problem, the specific change is easier to identify.

## Useful Commands

Create a branch from the current clean baseline:

```bash
git switch -c mobile-pwa
```

Check what changed:

```bash
git status --short
git diff
```

Commit a focused change:

```bash
git add .
git commit -m "Add mobile PWA support"
```

Merge after checks pass:

```bash
git switch main
git merge --no-ff mobile-pwa
```

`--no-ff` keeps the feature branch visible as a merge commit. That is useful while learning Git because the history shows where a feature started and ended.

## Quality Habit

Before merging, run the checks that match the change:

```bash
npm run lint
npm run test
npm run content:validate
npm run build
```
