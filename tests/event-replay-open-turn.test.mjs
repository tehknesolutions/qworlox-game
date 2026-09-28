import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('replay rejects a log ending with an unconsumed ROLL', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 }
  ]), /incomplete replay turn/);
});

test('replay rejects a log ending with MOVE before LAND', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' }
  ]), /incomplete replay turn/);
});

test('replay accepts a log ending after completed LAND', () => {
  const state = replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]);

  assert.equal(state.landings.length, 1);
});
