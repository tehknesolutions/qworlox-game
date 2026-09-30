import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCombat } from '../game/core/combat.mjs';

test('combat result exposes additive breakdown for both sides', () => {
  const result = resolveCombat({
    attacker: { id: 'blue-1', attributes: { strength: 3 } },
    defender: { id: 'red-1', attributes: { defense: 4 } },
    commonDie: 4,
    attackerExclusiveDie: 1,
    defenderExclusiveDie: 2,
    attackerModifiers: { magic: 2, card: 1 },
    defenderModifiers: { board: 1 }
  });
  assert.deepEqual(result.attackerBreakdown, { attribute: 3, commonDie: 4, exclusiveDie: 1, modifiers: { card: 1, board: 0, equipment: 0, ally: 0, magic: 2 }, total: 11 });
  assert.deepEqual(result.defenderBreakdown, { attribute: 4, commonDie: 4, exclusiveDie: 2, modifiers: { card: 0, board: 1, equipment: 0, ally: 0, magic: 0 }, total: 11 });
  assert.equal(result.draw, true);
});
