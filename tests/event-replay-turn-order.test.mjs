import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('a new team roll starts the next turn and may move that same team', () => {
  const state = replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'ROLL', team: 'red', roll: 6 },
    { seq: 5, type: 'MOVE', team: 'red', characterId: 'red-1', fromNodeId: null, toNodeId: 'red-entry' },
    { seq: 6, type: 'LAND', team: 'red', characterId: 'red-1', nodeId: 'red-entry' }
  ]);

  assert.deepEqual(state.characters['red-1'], { nodeId: 'red-entry', team: 'red' });
});

test('MOVE after a completed turn cannot reuse an older team roll', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'MOVE', team: 'blue', characterId: 'blue-2', fromNodeId: null, toNodeId: 'blue-entry-2' }
  ]), /MOVE without preceding ROLL/);
});
