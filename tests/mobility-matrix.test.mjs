import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { buildMobilityMatrix, summarizeMobilityMatrix } from '../game/board/mobility-matrix.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';
const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

test('mobility matrix has one cell per graph node and D6 result', () => {
  const matrix = buildMobilityMatrix(graph, { movingTeam: 'blue' });
  assert.equal(matrix.rows.length, graph.nodes.size * 6);
  assert.deepEqual(matrix.rolls, [1, 2, 3, 4, 5, 6]);
});

test('each mobility cell reports bounded route shares', () => {
  const matrix = buildMobilityMatrix(graph, { movingTeam: 'blue' });
  for (const row of matrix.rows) {
    assert.ok(row.loopShare >= 0 && row.loopShare <= 1);
    assert.ok(row.backtrackShare >= 0 && row.backtrackShare <= 1);
    assert.ok(row.kingReachShare >= 0 && row.kingReachShare <= 1);
  }
});

test('summary identifies cells with loops, returns and king reach opportunities', () => {
  const summary = summarizeMobilityMatrix(buildMobilityMatrix(graph, { movingTeam: 'blue' }));
  assert.ok(summary.cells > 0);
  assert.ok(summary.highLoopCells > 0);
  assert.ok(summary.returnCells > 0);
  assert.ok(summary.kingReachCells > 0);
});

test('matrix is available symmetrically for red analysis', () => {
  const blue = buildMobilityMatrix(graph, { movingTeam: 'blue' });
  const red = buildMobilityMatrix(graph, { movingTeam: 'red' });
  assert.equal(red.rows.length, blue.rows.length);
});
