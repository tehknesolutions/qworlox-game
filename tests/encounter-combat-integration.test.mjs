import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveEncounterCombat } from '../game/core/encounter-combat.mjs';

test('an encounter can be resolved atomically through the shared combat engine', () => {
  const result = resolveEncounterCombat({
    attacker: { id: 'blue-1', team: 'blue', nodeId: 'center', attributes: { strength: 4 } },
    defender: { id: 'red-1', team: 'red', nodeId: 'center', attributes: { defense: 2 } },
    commonDie: 5,
    attackerExclusiveDie: 1,
    defenderExclusiveDie: 0,
    attackerModifiers: { card: 1 },
    defenderModifiers: {}
  });

  assert.equal(result.encounter.type, 'ENCOUNTER');
  assert.equal(result.combat.winnerId, 'blue-1');
  assert.equal(result.combat.loserId, 'red-1');
  assert.equal(result.closed, true);
});

test('allied occupancy cannot enter the combat pipeline', () => {
  assert.throws(() => resolveEncounterCombat({
    attacker: { id: 'blue-1', team: 'blue', nodeId: 'center', attributes: { strength: 4 } },
    defender: { id: 'blue-2', team: 'blue', nodeId: 'center', attributes: { defense: 2 } },
    commonDie: 5
  }), /opposing teams/);
});
