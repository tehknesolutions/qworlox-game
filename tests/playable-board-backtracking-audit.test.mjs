import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { advanceOnGraph } from '../game/board/graph-movement.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';

const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

test('current playable graph permits immediate backtracking on bidirectional route edges', () => {
  const result = advanceOnGraph(graph, {
    startNodeId: 'blue-approach',
    steps: 2,
    choices: ['north-crossing', 'blue-approach'],
    movingTeam: 'blue'
  });
  assert.deepEqual(result.path, ['blue-approach', 'north-crossing', 'blue-approach']);
});

test('current playable graph permits crossing loop that consumes steps without net progress', () => {
  const result = advanceOnGraph(graph, {
    startNodeId: 'center',
    steps: 4,
    choices: ['north-crossing', 'blue-approach', 'south-crossing', 'center'],
    movingTeam: 'blue'
  });
  assert.deepEqual(result.path, ['center', 'north-crossing', 'blue-approach', 'south-crossing', 'center']);
});

test('enemy KING remains terminal even when a longer choice path is supplied', () => {
  assert.throws(() => advanceOnGraph(graph, {
    startNodeId: 'red-approach',
    steps: 2,
    choices: ['red-king', 'red-approach'],
    movingTeam: 'blue'
  }), /cannot move beyond KING objective/);
});
