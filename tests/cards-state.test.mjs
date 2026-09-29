import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeckState, drawCard, playCard } from '../game/cards/deck.mjs';

test('shared deck contains the seven defined QWorlox card families', () => {
  const state = createDeckState();
  assert.deepEqual(state.categories, [
    'COMBAT', 'TERRITORY', 'EVENT', 'TRAP', 'EQUIPMENT', 'ALLY', 'MAGIC'
  ]);
  assert.equal(state.draw.length, 7);
  assert.equal(state.discard.length, 0);
});

test('drawing moves a card from shared draw pile to hand', () => {
  const state = createDeckState();
  const result = drawCard(state);
  assert.equal(result.state.hand.length, 1);
  assert.equal(result.state.draw.length, 6);
  assert.equal(result.state.discard.length, 0);
});

test('category behavior is represented without hard-coding final effects', () => {
  const state = createDeckState();
  const drawn = drawCard(state);
  const played = playCard(drawn.state, { cardId: drawn.card.id, context: { nodeId: 'center' } });
  assert.equal(played.card.category, drawn.card.category);
  assert.equal(played.resolution.category, drawn.card.category);
});
