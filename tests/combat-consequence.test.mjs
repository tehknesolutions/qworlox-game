import test from 'node:test';
import assert from 'node:assert/strict';
import { applyCombatConsequence } from '../game/core/combat-consequence.mjs';

test('winner gains one graph position after a decisive encounter', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    positions: { 'blue-1': 10, 'red-1': 11 },
    routeLength: 18
  });
  assert.equal(result.positions['blue-1'], 11);
  assert.equal(result.positions['red-1'], 11);
});

test('winner cannot move beyond the goal boundary', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    positions: { 'blue-1': 18, 'red-1': 17 },
    routeLength: 18
  });
  assert.equal(result.positions['blue-1'], 18);
});

test('an impasse changes neither character position', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: null, loserId: null, draw: true },
    positions: { 'blue-1': 10, 'red-1': 10 },
    routeLength: 18
  });
  assert.deepEqual(result.positions, { 'blue-1': 10, 'red-1': 10 });
});

test('piece-mode consequence preserves team identity while synchronizing canonical nodeId', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    pieces: {
      'blue-1': { id: 'blue-1', team: 'blue', position: 9, status: 'route', nodeId: 'center' },
      'red-1': { id: 'red-1', team: 'red', position: 9, status: 'route', nodeId: 'center' }
    },
    routeLength: 18
  });

  assert.equal(result.pieces['blue-1'].team, 'blue');
  assert.equal(result.pieces['red-1'].team, 'red');
  assert.equal(result.pieces['blue-1'].nodeId, 'red-8');
  assert.equal(result.pieces['red-1'].nodeId, 'center');
});

test('base pieces remain off-board during consequence synchronization', () => {
  const result = applyCombatConsequence({
    combat: { winnerId: 'blue-1', loserId: 'red-1', draw: false },
    pieces: {
      'blue-1': { id: 'blue-1', team: 'blue', position: 9, status: 'route', nodeId: 'center' },
      'blue-2': { id: 'blue-2', team: 'blue', position: null, status: 'base', nodeId: null },
      'red-1': { id: 'red-1', team: 'red', position: 9, status: 'route', nodeId: 'center' },
      'red-2': { id: 'red-2', team: 'red', position: null, status: 'base', nodeId: null }
    },
    routeLength: 18
  });

  assert.equal(result.pieces['blue-2'].position, null);
  assert.equal(result.pieces['blue-2'].nodeId, null);
  assert.equal(result.pieces['red-2'].position, null);
  assert.equal(result.pieces['red-2'].nodeId, null);
});
