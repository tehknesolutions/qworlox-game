import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCombat } from '../game/core/combat.mjs';

test('combat resolves from board, card, common die, exclusive die and modifiers', () => {
  const result = resolveCombat({
    attacker: { id: 'blue-1', attributes: { strength: 4 } },
    defender: { id: 'red-1', attributes: { defense: 3 } },
    commonDie: 5,
    attackerExclusiveDie: 2,
    defenderExclusiveDie: 1,
    attackerModifiers: { card: 2, board: 1, equipment: 0, ally: 0, magic: 0 },
    defenderModifiers: { card: 0, board: 0, equipment: 1, ally: 0, magic: 0 }
  });

  assert.equal(result.winnerId, 'blue-1');
  assert.equal(result.loserId, 'red-1');
  assert.equal(result.draw, false);
});

test('equal confrontation values produce an impasse, not an arbitrary winner', () => {
  const result = resolveCombat({
    attacker: { id: 'blue-1', attributes: { strength: 3 } },
    defender: { id: 'red-1', attributes: { defense: 3 } },
    commonDie: 4,
    attackerExclusiveDie: 1,
    defenderExclusiveDie: 1,
    attackerModifiers: { card: 0, board: 0, equipment: 0, ally: 0, magic: 0 },
    defenderModifiers: { card: 0, board: 0, equipment: 0, ally: 0, magic: 0 }
  });

  assert.equal(result.draw, true);
  assert.equal(result.winnerId, null);
  assert.equal(result.loserId, null);
});

test('missing modifiers default to zero', () => {
  const result = resolveCombat({
    attacker: { id: 'blue-1', attributes: { strength: 2 } },
    defender: { id: 'red-1', attributes: { defense: 1 } },
    commonDie: 6
  });
  assert.ok(Number.isInteger(result.attackerValue));
  assert.ok(Number.isInteger(result.defenderValue));
});
