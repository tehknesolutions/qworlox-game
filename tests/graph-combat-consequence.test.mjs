import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { applyGraphCombatConsequence } from '../game/core/graph-combat-consequence.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';

test('draw preserves graph nodes and reports impasse', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const pieces = {
    'blue-1': { id: 'blue-1', team: 'blue', status: 'route', nodeId: 'crossing-west' },
    'red-1': { id: 'red-1', team: 'red', status: 'route', nodeId: 'crossing-west' }
  };
  const result = applyGraphCombatConsequence({ graph, combat: { draw: true, winnerId: null }, pieces });
  assert.equal(result.consequence, 'IMPASSE');
  assert.equal(result.pieces['blue-1'].nodeId, 'crossing-west');
  assert.equal(result.pieces['red-1'].nodeId, 'crossing-west');
});

test('winner advances one legal graph edge without using linear position', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const pieces = {
    'blue-1': { id: 'blue-1', team: 'blue', status: 'route', nodeId: 'crossing-west' },
    'red-1': { id: 'red-1', team: 'red', status: 'route', nodeId: 'crossing-west' }
  };
  const result = applyGraphCombatConsequence({ graph, combat: { draw: false, winnerId: 'blue-1', loserId: 'red-1' }, pieces, choice: 'crossing-east' });
  assert.equal(result.consequence, 'WINNER_ADVANCES_ONE');
  assert.equal(result.pieces['blue-1'].nodeId, 'crossing-east');
  assert.equal('position' in result.pieces['blue-1'], false);
});

test('winner advance rejects a non-adjacent graph choice', () => {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const pieces = { 'blue-1': { id: 'blue-1', team: 'blue', status: 'route', nodeId: 'crossing-west' } };
  assert.throws(() => applyGraphCombatConsequence({ graph, combat: { draw: false, winnerId: 'blue-1' }, pieces, choice: 'red-king' }), /legal adjacent node/);
});
