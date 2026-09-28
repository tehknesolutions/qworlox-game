import { detectEncounter } from './encounter.mjs';
import { resolveCombat } from './combat.mjs';

export function resolveEncounterCombat({
  attacker,
  defender,
  commonDie,
  attackerExclusiveDie = 0,
  defenderExclusiveDie = 0,
  attackerModifiers = {},
  defenderModifiers = {}
}) {
  if (attacker.team === defender.team) {
    throw new Error('encounter combat requires opposing teams');
  }

  const encounter = detectEncounter({ mover: attacker, occupants: [defender] });
  if (!encounter) throw new Error('pieces must occupy the same node');

  const combat = resolveCombat({
    attacker,
    defender,
    commonDie,
    attackerExclusiveDie,
    defenderExclusiveDie,
    attackerModifiers,
    defenderModifiers
  });

  return {
    encounter,
    combat,
    closed: true
  };
}
