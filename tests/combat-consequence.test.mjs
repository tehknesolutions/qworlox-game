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
