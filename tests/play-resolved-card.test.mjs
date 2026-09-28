import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playResolvedGameCard } from '../game/core/game.mjs';

test('playing a territory card resolves effect commands into Game Core state', () => {
  const game = createGame({ routeLength: 18 });
  game.cards.hand.push({
    id: 'territory-test',
    category: 'TERRITORY',
    effect: { type: 'CLAIM_CONTEXT_NODE' }
  });

  const result = playResolvedGameCard(game, {
    cardId: 'territory-test',
    context: { nodeId: 'center', team: 'blue' }
  });

  assert.equal(result.game.territory.control.center, 'blue');
  assert.equal(result.game.cards.hand.length, 0);
  assert.equal(result.game.cards.discard.at(-1).id, 'territory-test');
  assert.equal(result.effect.status, 'RESOLVED');
  assert.equal(result.game.events.at(-1).type, 'TERRITORY_CONTROL_SET');
});

test('playing an event card appends the emitted game event', () => {
  const game = createGame({ routeLength: 18 });
  game.cards.hand.push({
    id: 'event-test',
    category: 'EVENT',
    effect: { type: 'EMIT_EVENT', event: 'MARKET_DAY' }
  });

  const result = playResolvedGameCard(game, { cardId: 'event-test' });
  assert.equal(result.effect.status, 'RESOLVED');
  assert.deepEqual(result.game.events.at(-1), {
    seq: 1,
    type: 'GAME_EVENT',
    event: 'MARKET_DAY',
    sourceCardId: 'event-test'
  });
});

test('pending card effects are discarded but never mutate domain state silently', () => {
  const game = createGame({ routeLength: 18 });
  game.cards.hand.push({ id: 'magic-test', category: 'MAGIC' });
  const result = playResolvedGameCard(game, { cardId: 'magic-test', context: { nodeId: 'center', team: 'blue' } });

  assert.equal(result.effect.status, 'PENDING');
  assert.equal(result.game.territory.control.center, null);
  assert.deepEqual(result.game.events, []);
});
