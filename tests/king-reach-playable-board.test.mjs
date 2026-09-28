import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph, shortestPathLength } from '../game/board/graph.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';

test('playable fixture exposes both canonical King objectives', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

  assert.equal(graph.kingObjectives.blue, 'blue-king');
  assert.equal(graph.kingObjectives.red, 'red-king');
});

test('playable fixture has mirrored routes between both Kings', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

  assert.equal(
    shortestPathLength(graph, 'blue-king', 'red-king'),
    shortestPathLength(graph, 'red-king', 'blue-king')
  );
  assert.notEqual(shortestPathLength(graph, 'blue-king', 'red-king'), Number.POSITIVE_INFINITY);
});

test('playable fixture contains a shared contested center', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const center = graph.nodes.get('center');

  assert.equal(center.region, 'CONTESTED_CENTER');
  assert.ok(graph.adjacency.get('center').length >= 2);
});

test('playable fixture offers a real route choice before the center', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const choices = graph.adjacency.get('blue-approach');

  assert.ok(choices.includes('north-crossing'));
  assert.ok(choices.includes('south-crossing'));
});

test('fixture is explicitly experimental rather than final geometry', () => {
  assert.equal(KING_REACH_PLAYABLE_BOARD_V1.status, 'EXPERIMENTAL_PLAYTEST');
  assert.equal(KING_REACH_PLAYABLE_BOARD_V1.finalGeometry, false);
});
