import test from 'node:test';
import assert from 'node:assert/strict';
import { compareStructuralMetrics } from '../game/board/structural-diff.mjs';

const report = rows => ({ analysis: { blue: { matrix: { rows } }, red: { matrix: { rows: [] } } } });
const row = values => ({ nodeId: 'center', roll: 4, totalPaths: 2, reachesEnemyKing: 0, returnsToStart: 0, immediateBacktracks: 0, repeatedNodePaths: 0, loopShare: 0, backtrackShare: 0, kingReachShare: 0, ...values });

test('identical reports are UNCHANGED', () => {
  const current = report([row()]);
  assert.deepEqual(compareStructuralMetrics(current, current), { status: 'UNCHANGED', changes: [] });
});

test('metric mutation is CHANGED with explicit delta', () => {
  const baseline = report([row({ totalPaths: 2 })]);
  const current = report([row({ totalPaths: 3 })]);
  const result = compareStructuralMetrics(current, baseline);
  assert.equal(result.status, 'CHANGED');
  assert.equal(result.changes[0].status, 'CHANGED');
  assert.equal(result.changes[0].delta.totalPaths, 1);
});

test('added and removed cells are explicit', () => {
  const baseline = report([row()]);
  const current = report([row({ nodeId: 'north-crossing' })]);
  const result = compareStructuralMetrics(current, baseline);
  assert.equal(result.status, 'CHANGED');
  assert.deepEqual(result.changes.map(change => change.status).sort(), ['ADDED', 'REMOVED']);
});
