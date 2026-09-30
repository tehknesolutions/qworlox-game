import test from 'node:test';
import assert from 'node:assert/strict';
import { createBaselineRegistry, registerBaseline } from '../game/board/structural-baseline-registry.mjs';
import { compareBaselineVersions } from '../game/board/structural-version-compare.mjs';

const row = totalPaths => ({ nodeId: 'center', roll: 4, totalPaths, reachesEnemyKing: 0, returnsToStart: 0, immediateBacktracks: 0, repeatedNodePaths: 0, loopShare: 0, backtrackShare: 0, kingReachShare: 0 });
const snapshot = (version, totalPaths) => ({ schemaVersion: 1, boardId: 'king-reach-playable-v1', baselineVersion: version, blue: { rows: [row(totalPaths)] }, red: { rows: [] }, symmetry: null });

function registry() {
  let value = createBaselineRegistry('king-reach-playable-v1');
  value = registerBaseline(value, 'v1', snapshot('v1', 2));
  return registerBaseline(value, 'v2', snapshot('v2', 3));
}

test('compares explicit baseline versions in requested direction', () => {
  const result = compareBaselineVersions(registry(), 'v1', 'v2');
  assert.equal(result.fromVersion, 'v1');
  assert.equal(result.toVersion, 'v2');
  assert.equal(result.status, 'CHANGED');
  assert.equal(result.changes[0].delta.totalPaths, 1);
});

test('reverse comparison reverses metric delta', () => {
  const result = compareBaselineVersions(registry(), 'v2', 'v1');
  assert.equal(result.changes[0].delta.totalPaths, -1);
});

test('same version is reproducibly unchanged', () => {
  const result = compareBaselineVersions(registry(), 'v1', 'v1');
  assert.equal(result.status, 'UNCHANGED');
  assert.deepEqual(result.changes, []);
});
