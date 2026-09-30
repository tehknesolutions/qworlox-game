import test from 'node:test';
import assert from 'node:assert/strict';
import { auditBoardSymmetry } from '../game/board/board-symmetry-audit.mjs';

const row = (nodeId, roll, values = {}) => ({ nodeId, roll, totalPaths: 2, reachesEnemyKing: 0, returnsToStart: 0, immediateBacktracks: 0, repeatedNodePaths: 0, loopShare: 0, backtrackShare: 0, kingReachShare: 0, ...values });

test('mirrored equivalent cells report no structural delta', () => {
  const blue = { rows: [row('blue-approach', 3)] };
  const red = { rows: [row('red-approach', 3)] };
  const audit = auditBoardSymmetry(blue, red, { 'blue-approach': 'red-approach' });
  assert.equal(audit.mismatches.length, 0);
  assert.equal(audit.symmetric, true);
});

test('detects route-count and loop-share asymmetry', () => {
  const blue = { rows: [row('blue-approach', 4, { totalPaths: 5, loopShare: 0.6 })] };
  const red = { rows: [row('red-approach', 4, { totalPaths: 3, loopShare: 0.2 })] };
  const audit = auditBoardSymmetry(blue, red, { 'blue-approach': 'red-approach' });
  assert.equal(audit.symmetric, false);
  assert.deepEqual(audit.mismatches[0].delta, { totalPaths: 2, reachesEnemyKing: 0, returnsToStart: 0, immediateBacktracks: 0, repeatedNodePaths: 0, loopShare: 0.4, backtrackShare: 0, kingReachShare: 0 });
});

test('missing mirrored cell is reported explicitly', () => {
  const audit = auditBoardSymmetry({ rows: [row('blue-approach', 1)] }, { rows: [] }, { 'blue-approach': 'red-approach' });
  assert.equal(audit.symmetric, false);
  assert.equal(audit.mismatches[0].reason, 'MISSING_MIRROR');
});
