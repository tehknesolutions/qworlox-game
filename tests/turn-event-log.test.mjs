import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, resolveTurn } from '../game/core/game.mjs';

function graphFor(nodeId, trigger = null) {
  return { nodes: new Map([[nodeId, { id: nodeId, trigger }]]) };
}

test('resolved turn records roll and movement before landing effects', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveTurn(game, graphFor('blue-entry', { type: 'DRAW_CARD' }), {
    characterId: 'blue-1',
    roll: 6
  });

  assert.deepEqual(result.game.events, [
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
  ]);
});

test('ordinary turn still records roll move and landing deterministically', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveTurn(game, graphFor('blue-entry'), { characterId: 'blue-1', roll: 6 });

  assert.deepEqual(result.game.events, [
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]);
});
