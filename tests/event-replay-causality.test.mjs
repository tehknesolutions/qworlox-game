import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('LAND must agree with the immediately preceding MOVE destination and actor', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 2, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'center' }
  ]), /inconsistent LAND event/);
});

test('LAND cannot claim a different character than the immediately preceding MOVE', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 2, type: 'LAND', team: 'blue', characterId: 'blue-2', nodeId: 'blue-entry' }
  ]), /inconsistent LAND event/);
});

test('MOVE origin must agree with the last reconstructed position when one exists', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: 'center', toNodeId: 'blue-1' }
  ]), /inconsistent MOVE origin/);
});

test('causally consistent movement history still replays', () => {
  const state = replayEvents([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 2, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 3, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: 'blue-entry', toNodeId: 'blue-1' },
    { seq: 4, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-1' }
  ]);

  assert.deepEqual(state.characters['blue-1'], { nodeId: 'blue-1', team: 'blue' });
});
