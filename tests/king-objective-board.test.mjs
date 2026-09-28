import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';

function kingBoard() {
  return {
    lanes: [
      {
        id: 'royal-route',
        nodes: [
          { id: 'blue-king', objective: { type: 'KING', team: 'blue' } },
          { id: 'center' },
          { id: 'red-king', objective: { type: 'KING', team: 'red' } }
        ]
      }
    ]
  };
}

test('board graph exposes exactly one King objective for each team', () => {
  const graph = buildBoardGraph(kingBoard());

  assert.equal(graph.kingObjectives.blue, 'blue-king');
  assert.equal(graph.kingObjectives.red, 'red-king');
});

test('King objectives remain domain data on their nodes', () => {
  const graph = buildBoardGraph(kingBoard());

  assert.deepEqual(graph.nodes.get('blue-king').objective, { type: 'KING', team: 'blue' });
  assert.deepEqual(graph.nodes.get('red-king').objective, { type: 'KING', team: 'red' });
});

test('board graph rejects duplicate King objectives for one team', () => {
  const board = kingBoard();
  board.lanes[0].nodes.splice(1, 0, {
    id: 'blue-king-duplicate',
    objective: { type: 'KING', team: 'blue' }
  });

  assert.throws(() => buildBoardGraph(board), /duplicate KING objective for blue/);
});

test('board graph rejects a missing King objective', () => {
  const board = kingBoard();
  delete board.lanes[0].nodes[2].objective;

  assert.throws(() => buildBoardGraph(board), /missing KING objective for red/);
});

test('board graph rejects unknown objective types', () => {
  const board = kingBoard();
  board.lanes[0].nodes[2].objective = { type: 'CASTLE', team: 'red' };

  assert.throws(() => buildBoardGraph(board), /unknown board objective: CASTLE/);
});
