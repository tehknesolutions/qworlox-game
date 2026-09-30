import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCompareArgs, formatVersionComparison } from '../game/board/compare-structural-baselines.mjs';

test('CLI requires explicit from and to versions', () => {
  assert.deepEqual(parseCompareArgs(['--from', 'v1', '--to', 'v2']), { from: 'v1', to: 'v2' });
  assert.throws(() => parseCompareArgs(['--from', 'v1']), /--to/);
});

test('comparison formatter exposes direction and status', () => {
  const output = formatVersionComparison({ boardId: 'board-v1', fromVersion: 'v1', toVersion: 'v2', status: 'CHANGED', changes: [{ key: 'blue:center:4', status: 'CHANGED', delta: { totalPaths: 1 } }] });
  assert.match(output, /board-v1 · v1 → v2 · CHANGED/);
  assert.match(output, /blue:center:4 · CHANGED/);
  assert.match(output, /totalPaths=\+1/);
});
