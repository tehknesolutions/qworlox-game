import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';
import { advanceOnGraph } from '../game/board/graph-movement.mjs';

const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

test('graph-native movement advances through explicit node choices', () => {
  const result = advanceOnGraph(graph, {
    startNodeId: 'blue-approach',
    steps: 2,
    choices: ['north-crossing', 'center']
  });

  assert.deepEqual(result.path, ['blue-approach', 'north-crossing', 'center']);
  assert.equal(result.nodeId, 'center');
});

test('graph-native movement can choose the alternate crossing', () => {
  const result = advanceOnGraph(graph, {
    startNodeId: 'blue-approach',
    steps: 2,
    choices: ['south-crossing', 'center']
  });

  assert.equal(result.nodeId, 'center');
  assert.ok(result.path.includes('south-crossing'));
});

test('graph-native movement rejects a visual/non-edge jump', () => {
  assert.throws(() => advanceOnGraph(graph, {
    startNodeId: 'blue-approach',
    steps: 1,
    choices: ['red-approach']
  }), /illegal graph move/);
});

test('graph-native movement requires an explicit choice at a branch', () => {
  assert.throws(() => advanceOnGraph(graph, {
    startNodeId: 'blue-approach',
    steps: 1,
    choices: []
  }), /movement choice required/);
});

test('graph-native movement cannot continue beyond a King objective', () => {
  assert.throws(() => advanceOnGraph(graph, {
    startNodeId: 'red-approach',
    steps: 2,
    choices: ['red-king', 'red-approach']
  }), /cannot move beyond KING objective/);
});
