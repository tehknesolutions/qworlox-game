import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { analyzePlayableBoardStructure, KING_REACH_V1_MIRROR_MAP } from '../game/board/playable-board-structural-analysis.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';

const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

test('canonical mirror map covers every playable node exactly once', () => {
  assert.deepEqual(new Set(Object.keys(KING_REACH_V1_MIRROR_MAP)), new Set(graph.nodes.keys()));
  assert.deepEqual(new Set(Object.values(KING_REACH_V1_MIRROR_MAP)), new Set(graph.nodes.keys()));
  for (const [node, mirror] of Object.entries(KING_REACH_V1_MIRROR_MAP)) assert.equal(KING_REACH_V1_MIRROR_MAP[mirror], node);
});

test('unified analysis returns blue red balance and symmetry evidence', () => {
  const report = analyzePlayableBoardStructure(graph);
  assert.equal(report.boardId, KING_REACH_PLAYABLE_BOARD_V1.id);
  assert.equal(report.blue.matrix.movingTeam, 'blue');
  assert.equal(report.red.matrix.movingTeam, 'red');
  assert.equal(report.blue.balance.cells, graph.nodes.size * 6);
  assert.equal(report.red.balance.cells, graph.nodes.size * 6);
  assert.equal(report.symmetry.comparedCells, graph.nodes.size * 6);
});
