import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('MOVE must have a preceding ROLL for the same team', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' }
  ]), /MOVE without preceding ROLL/);
});

test('MOVE must use the most recent ROLL team', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'red', characterId: 'red-1', fromNodeId: null, toNodeId: 'red-entry' }
  ]), /MOVE without preceding ROLL/);
});

test('a valid ROLL followed by MOVE and LAND remains replayable without recalculating legality', () => {
  const state = replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 1 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]);
  assert.deepEqual(state.characters['blue-1'], { nodeId: 'blue-entry', team: 'blue' });
  assert.deepEqual(state.rolls, [{ seq: 1, team: 'blue', roll: 1 }]);
});
