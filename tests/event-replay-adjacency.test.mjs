import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('LAND must immediately follow the MOVE it closes', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' },
    { seq: 4, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]), /LAND without immediately preceding MOVE/);
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
