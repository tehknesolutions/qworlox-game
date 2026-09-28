import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, drawGameCard, playGameCard } from '../game/core/game.mjs';

test('a new game owns one shared QWorlox deck state', () => {
  const game = createGame({ routeLength: 18 });
  assert.equal(game.cards.draw.length, 7);
  assert.equal(game.cards.hand.length, 0);
  assert.equal(game.cards.discard.length, 0);
});

test('drawing a game card moves it to the shared hand', () => {
  const game = createGame({ routeLength: 18 });
  const result = drawGameCard(game);
  assert.equal(result.game.cards.hand.length, 1);
  assert.equal(result.game.cards.draw.length, 6);
  assert.equal(result.card.category, 'COMBAT');
});

test('playing a game card preserves category context and discards the card', () => {
  const game = createGame({ routeLength: 18 });
  const drawn = drawGameCard(game);
  const played = playGameCard(drawn.game, {
    cardId: drawn.card.id,
    context: { nodeId: 'center' }
  });
  assert.equal(played.game.cards.hand.length, 0);
  assert.equal(played.game.cards.discard.length, 1);
  assert.equal(played.resolution.category, 'COMBAT');
  assert.equal(played.resolution.context.nodeId, 'center');
});
