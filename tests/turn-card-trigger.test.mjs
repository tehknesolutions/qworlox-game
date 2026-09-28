import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, resolveTurnCardTrigger } from '../game/core/game.mjs';

test('a turn card trigger can explicitly draw from the shared deck', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveTurnCardTrigger(game, { type: 'DRAW_CARD' });

  assert.equal(result.game.cards.draw.length, 6);
  assert.equal(result.game.cards.hand.length, 1);
  assert.equal(result.card.id, 'qworlox-combat-001');
  assert.deepEqual(result.game.events.at(-1), {
    seq: 1,
    type: 'CARD_DRAWN',
    cardId: 'qworlox-combat-001'
  });
});

test('no trigger means no automatic draw or hidden mutation', () => {
  const game = createGame({ routeLength: 18 });
  const result = resolveTurnCardTrigger(game, null);

  assert.equal(result.card, null);
  assert.equal(result.game.cards.draw.length, 7);
  assert.equal(result.game.cards.hand.length, 0);
  assert.deepEqual(result.game.events, []);
});

test('unknown turn card triggers fail explicitly', () => {
  const game = createGame({ routeLength: 18 });
  assert.throws(
    () => resolveTurnCardTrigger(game, { type: 'AUTO_MAGIC' }),
    /unknown card trigger/
  );
});
