import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCardEffect } from '../game/cards/effects.mjs';

test('territory card can request explicit control of the contextual node', () => {
  const result = resolveCardEffect({
    card: { id: 'territory-test', category: 'TERRITORY', effect: { type: 'CLAIM_CONTEXT_NODE' } },
    context: { nodeId: 'center', team: 'blue' }
  });
  assert.deepEqual(result.commands, [
    { type: 'SET_TERRITORY_CONTROL', nodeId: 'center', team: 'blue' }
  ]);
});

test('event card emits a domain event without mutating board state directly', () => {
  const result = resolveCardEffect({
    card: { id: 'event-test', category: 'EVENT', effect: { type: 'EMIT_EVENT', event: 'MARKET_DAY' } },
    context: { nodeId: 'blue-4', team: 'blue' }
  });
  assert.deepEqual(result.commands, [
    { type: 'EMIT_GAME_EVENT', event: 'MARKET_DAY', sourceCardId: 'event-test' }
  ]);
});

test('undefined final effects remain pending rather than being invented', () => {
  const result = resolveCardEffect({
    card: { id: 'magic-001', category: 'MAGIC' },
    context: { nodeId: 'center', team: 'red' }
  });
  assert.equal(result.status, 'PENDING');
  assert.deepEqual(result.commands, []);
});
