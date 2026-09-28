import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('CARD_DRAWN is only accepted after a completed LAND', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
  ]), /CARD_DRAWN before LAND/);
});

test('CARD_DRAWN after LAND is a valid landing effect boundary', () => {
  const state = replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
  ]);

  assert.deepEqual(state.cardsDrawn, [
    { seq: 4, cardId: 'qworlox-combat-001' }
  ]);
});
