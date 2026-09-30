import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyMobilityCell, auditBoardBalance } from '../game/board/board-balance-audit.mjs';

const cell = overrides => ({ totalPaths: 4, reachesEnemyKing: 0, returnsToStart: 0, immediateBacktracks: 0, repeatedNodePaths: 0, loopShare: 0, backtrackShare: 0, kingReachShare: 0, ...overrides });

test('classifies clean forward mobility as progression', () => {
  assert.equal(classifyMobilityCell(cell({ totalPaths: 2 })), 'PROGRESSION');
});

test('classifies branching clean mobility as decision', () => {
  assert.equal(classifyMobilityCell(cell({ totalPaths: 4 })), 'DECISION');
});

test('classifies majority repeated routes as looping', () => {
  assert.equal(classifyMobilityCell(cell({ loopShare: 0.75, repeatedNodePaths: 3 })), 'LOOPING');
});

test('king reach opportunity has explicit objective classification', () => {
  assert.equal(classifyMobilityCell(cell({ reachesEnemyKing: 1, kingReachShare: 0.25 })), 'OBJECTIVE');
});

test('board audit aggregates classifications without mutating matrix', () => {
  const matrix = { movingTeam: 'blue', rows: [cell({ totalPaths: 2 }), cell({ totalPaths: 4 }), cell({ loopShare: 0.75 }), cell({ reachesEnemyKing: 1 })] };
  const before = structuredClone(matrix);
  const audit = auditBoardBalance(matrix);
  assert.deepEqual(audit.counts, { OBJECTIVE: 1, LOOPING: 1, DECISION: 1, PROGRESSION: 1 });
  assert.deepEqual(matrix, before);
});
