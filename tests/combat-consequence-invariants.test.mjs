import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCombatConsequence } from '../game/core/combat-consequence.mjs';

test('combat consequence preserves route status and canonical node identity', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    pieces: {
      'blue-1': { team: 'blue', position: 8, status: 'route' },
      'red-1': { team: 'red', position: 8, status: 'route' }
    },
    routeLength: 18
  });

  assert.equal(result.pieces['blue-1'].position, 9);
  assert.equal(result.pieces['blue-1'].status, 'route');
  assert.equal(result.pieces['blue-1'].nodeId, 'center');
  assert.equal(result.pieces['red-1'].position, 8);
  assert.equal(result.pieces['red-1'].status, 'route');
});

test('combat consequence marks a winner as goal at the route boundary', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    pieces: {
      'blue-1': { team: 'blue', position: 18, status: 'route' },
      'red-1': { team: 'red', position: 17, status: 'route' }
    },
    routeLength: 18
  });

  assert.equal(result.pieces['blue-1'].position, 18);
  assert.equal(result.pieces['blue-1'].status, 'goal');
  assert.equal(result.pieces['blue-1'].nodeId, 'red-goal');
});

test('draw preserves every piece state', () => {
  const pieces = {
    'blue-1': { team: 'blue', position: 9, status: 'route' },
    'red-1': { team: 'red', position: 9, status: 'route' }
  };
  const result = applyCombatConsequence({
    combat: { winnerId: null, loserId: null, draw: true },
    pieces,
    routeLength: 18
  });
  assert.deepEqual(result.pieces, {
    'blue-1': { ...pieces['blue-1'], nodeId: 'center' },
    'red-1': { ...pieces['red-1'], nodeId: 'center' }
  });
});
