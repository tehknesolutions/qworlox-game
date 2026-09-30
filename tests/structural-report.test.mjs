import test from 'node:test';
import assert from 'node:assert/strict';
import { formatStructuralReport } from '../game/board/structural-report.mjs';

test('structural report exposes board identity, team balance counts and symmetry evidence', () => {
  const report = formatStructuralReport({
    boardId: 'board-v1',
    blue: { balance: { cells: 42, counts: { OBJECTIVE: 2, LOOPING: 10, DECISION: 20, PROGRESSION: 10 } } },
    red: { balance: { cells: 42, counts: { OBJECTIVE: 2, LOOPING: 10, DECISION: 20, PROGRESSION: 10 } } },
    symmetry: { symmetric: true, comparedCells: 42, mismatches: [] }
  });
  assert.match(report, /board-v1/);
  assert.match(report, /BLUE.*42/);
  assert.match(report, /RED.*42/);
  assert.match(report, /Symmetry: PASS.*42/);
});

test('structural report lists symmetry mismatches instead of hiding them', () => {
  const report = formatStructuralReport({ boardId: 'board-v1', blue: { balance: { cells: 1, counts: {} } }, red: { balance: { cells: 1, counts: {} } }, symmetry: { symmetric: false, comparedCells: 1, mismatches: [{ nodeId: 'a', mirroredNodeId: 'b', roll: 4, reason: 'METRIC_DELTA' }] } });
  assert.match(report, /Symmetry: FAIL/);
  assert.match(report, /a ↔ b · D6=4 · METRIC_DELTA/);
});
