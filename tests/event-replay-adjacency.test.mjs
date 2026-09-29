import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('LAND adjacency is enforced before landing effects', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' },
    { seq: 4, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]), /CARD_DRAWN before LAND/);
});

test('CARD_DRAWN after LAND remains valid because the landing is already closed', () => {
  const state = replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
  ]);
  assert.equal(state.landings.length, 1);
  assert.equal(state.cardsDrawn.length, 1);
});
