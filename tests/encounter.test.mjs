import test from 'node:test';
import assert from 'node:assert/strict';
import { detectEncounter } from '../game/core/encounter.mjs';

test('opponents on the same contested node create an encounter', () => {
  const encounter = detectEncounter({
    mover: { id: 'blue-1', team: 'blue', nodeId: 'center' },
    occupants: [{ id: 'red-1', team: 'red', nodeId: 'center' }]
  });
  assert.deepEqual(encounter, {
    type: 'ENCOUNTER',
    nodeId: 'center',
    attackerId: 'blue-1',
    defenderId: 'red-1'
  });
});

test('allies on the same node do not create a battle encounter', () => {
  assert.equal(detectEncounter({
    mover: { id: 'blue-1', team: 'blue', nodeId: 'center' },
    occupants: [{ id: 'blue-2', team: 'blue', nodeId: 'center' }]
  }), null);
});

test('opponents on different nodes do not create an encounter', () => {
  assert.equal(detectEncounter({
    mover: { id: 'blue-1', team: 'blue', nodeId: 'blue-9' },
    occupants: [{ id: 'red-1', team: 'red', nodeId: 'center' }]
  }), null);
});

test('encounter detection does not decide the battle winner', () => {
  const encounter = detectEncounter({
    mover: { id: 'red-2', team: 'red', nodeId: 'center' },
    occupants: [{ id: 'blue-2', team: 'blue', nodeId: 'center' }]
  });
  assert.equal('winnerId' in encounter, false);
  assert.equal('loserId' in encounter, false);
});
