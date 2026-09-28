import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, resolveLanding } from '../game/core/game.mjs';

function graphWith(nodeId, trigger) {
  return { nodes: new Map([[nodeId, { id: nodeId, trigger }]]) };
}

test('landing resolution executes DRAW_CARD from the landed node', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveLanding(game, graphWith('blue-1', { type: 'DRAW_CARD' }), 'blue-1');

  assert.equal(result.trigger.type, 'DRAW_CARD');
  assert.equal(result.card.id, 'qworlox-combat-001');
  assert.equal(result.game.cards.draw.length, 6);
  assert.equal(result.game.cards.hand.length, 1);
  assert.deepEqual(result.game.events.at(-1), {
    seq: 1,
    type: 'CARD_DRAWN',
    cardId: 'qworlox-combat-001'
  });
});

test('landing resolution on a normal node is inert', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveLanding(game, graphWith('blue-2', null), 'blue-2');

  assert.equal(result.trigger, null);
  assert.equal(result.card, null);
  assert.equal(result.game.cards.draw.length, 7);
  assert.deepEqual(result.game.events, []);
});
