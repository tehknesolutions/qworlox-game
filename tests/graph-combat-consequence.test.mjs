import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { applyGraphCombatConsequence } from '../game/core/graph-combat-consequence.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';

const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
const piecesAt = nodeId => ({ 'blue-1': { id: 'blue-1', team: 'blue', status: 'route', nodeId }, 'red-1': { id: 'red-1', team: 'red', status: 'route', nodeId } });

test('draw preserves graph nodes and reports impasse', () => {
  const result = applyGraphCombatConsequence({ graph, combat: { draw: true, winnerId: null }, pieces: piecesAt('center') });
  assert.equal(result.consequence, 'IMPASSE'); assert.equal(result.pieces['blue-1'].nodeId, 'center'); assert.equal(result.requiresChoice, false);
});

test('winner advances automatically when exactly one legal edge exists', () => {
  const result = applyGraphCombatConsequence({ graph, combat: { draw: false, winnerId: 'blue-1', loserId: 'red-1' }, pieces: piecesAt('center') });
  assert.equal(result.consequence, 'WINNER_ADVANCES_ONE'); assert.equal(result.pieces['blue-1'].nodeId, 'red-approach'); assert.equal(result.requiresChoice, false);
});

test('winner at graph fork returns pending legal choices instead of guessing', () => {
  const result = applyGraphCombatConsequence({ graph, combat: { draw: false, winnerId: 'blue-1', loserId: 'red-1' }, pieces: piecesAt('blue-approach') });
  assert.equal(result.consequence, 'WINNER_ADVANCE_PENDING'); assert.equal(result.requiresChoice, true);
  assert.deepEqual(new Set(result.legalChoices), new Set(['center', 'north-crossing', 'south-crossing'])); assert.equal(result.pieces['blue-1'].nodeId, 'blue-approach');
});

test('explicit winner choice must be an adjacent graph edge', () => {
  assert.throws(() => applyGraphCombatConsequence({ graph, combat: { draw: false, winnerId: 'blue-1' }, pieces: piecesAt('blue-approach'), choice: 'red-king' }), /legal adjacent node/);
});
