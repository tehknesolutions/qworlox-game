# P5 Structural Diagnostics

## Purpose

The P5 structural diagnostic layer describes the current executable geometry of the playable King Reach board. It does not change gameplay rules.

## Commands

- `npm run diagnose:board` — human-readable Markdown report.
- `npm run diagnose:board:json` — machine-readable JSON report.
- `npm run gate:p5` — run the test suite, then generate the Markdown diagnostic.

## Analysis pipeline

`board definition → graph → mobility matrix → balance classification → BLUE/RED symmetry audit → report`

The mobility matrix evaluates every playable graph node against D6 results 1–6.

The balance audit classifies cells as:

- `OBJECTIVE`
- `LOOPING`
- `DECISION`
- `PROGRESSION`

The symmetry audit compares mirrored BLUE/RED cells and reports either `MISSING_MIRROR` or `METRIC_DELTA`.

## JSON contract

The machine-readable output currently uses `schemaVersion: 1` and exposes:

- `boardId`
- `blue`
- `red`
- `symmetry`

The JSON output is intended for regression checks and future CI/report artifacts.

## Verification status

The GitHub Actions runner is currently recorded as `CI_INFRA_BLOCKED`. Therefore repository-side diagnostic code should not be described as CI-verified until a runner executes the jobs successfully.

This document records the executable diagnostic contract, not a claim that the current board is balanced or that any loop is a gameplay defect.
