import test from 'node:test';
import assert from 'node:assert/strict';
import { createStructuralBaselineSnapshot } from '../game/board/structural-baseline-snapshot.mjs';

const analysis = {
  boardId: 'king-reach-playable-v1',
  blue: { matrix: { rows: [{ nodeId: 'center', roll: 1, totalPaths: 2 }] } },
  red: { matrix: { rows: [{ nodeId: 'center', roll: 1, totalPaths: 2 }] } },
  symmetry: { symmetric: true, comparedCells: 42, mismatches: [] }
};

test('baseline snapshot is explicitly versioned and board-scoped', () => {
  const snapshot = createStructuralBaselineSnapshot(analysis);
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.boardId, 'king-reach-playable-v1');
  assert.deepEqual(snapshot.blue.rows, analysis.blue.matrix.rows);
  assert.deepEqual(snapshot.red.rows, analysis.red.matrix.rows);
});

test('baseline snapshot does not alias mutable analysis rows', () => {
  const snapshot = createStructuralBaselineSnapshot(analysis);
  analysis.blue.matrix.rows[0].totalPaths = 99;
  assert.equal(snapshot.blue.rows[0].totalPaths, 2);
});
