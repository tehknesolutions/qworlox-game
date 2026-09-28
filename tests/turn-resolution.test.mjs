import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, resolveTurn } from '../game/core/game.mjs';

function graphFor(nodes) {
  return { nodes: new Map(nodes.map(node => [node.id, node])) };
}

test('turn resolution moves, resolves landing, then hands control to opponent', () => {
  const game = createGame({ routeLength: 18 });
  const graph = graphFor([
    { id: 'blue-entry', trigger: { type: 'DRAW_CARD' } }
  ]);

  const result = resolveTurn(game, graph, { characterId: 'blue-1', roll: 6 });

  assert.equal(result.characterId, 'blue-1');
  assert.equal(result.nodeId, 'blue-entry');
  assert.equal(result.trigger.type, 'DRAW_CARD');
  assert.equal(result.card.id, 'qworlox-combat-001');
  assert.equal(result.game.cards.hand.length, 1);
  assert.equal(result.game.activeTeam, 'red');
  assert.deepEqual(result.game.events.at(-1), {
    seq: 1,
    type: 'CARD_DRAWN',
    cardId: 'qworlox-combat-001'
  });
});

test('turn resolution on ordinary landing changes player without hidden card action', () => {
  const game = createGame({ routeLength: 18 });
  const graph = graphFor([{ id: 'blue-entry', trigger: null }]);

  const result = resolveTurn(game, graph, { characterId: 'blue-1', roll: 6 });

  assert.equal(result.nodeId, 'blue-entry');
  assert.equal(result.trigger, null);
  assert.equal(result.card, null);
  assert.equal(result.game.cards.hand.length, 0);
  assert.equal(result.game.activeTeam, 'red');
  assert.deepEqual(result.game.events, []);
});
