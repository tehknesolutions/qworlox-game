const MODIFIER_KEYS = ['card', 'board', 'equipment', 'ally', 'magic'];

export function resolveCombat({ attacker, defender, commonDie, attackerExclusiveDie = 0, defenderExclusiveDie = 0, attackerModifiers = {}, defenderModifiers = {} }) {
  assertDie(commonDie, 'commonDie'); assertOptionalDie(attackerExclusiveDie, 'attackerExclusiveDie'); assertOptionalDie(defenderExclusiveDie, 'defenderExclusiveDie');
  const attackerBreakdown = confrontationBreakdown({ attribute: attacker.attributes?.strength ?? 0, commonDie, exclusiveDie: attackerExclusiveDie, modifiers: attackerModifiers });
  const defenderBreakdown = confrontationBreakdown({ attribute: defender.attributes?.defense ?? 0, commonDie, exclusiveDie: defenderExclusiveDie, modifiers: defenderModifiers });
  const attackerValue = attackerBreakdown.total; const defenderValue = defenderBreakdown.total;
  if (attackerValue === defenderValue) return { attackerValue, defenderValue, attackerBreakdown, defenderBreakdown, draw: true, winnerId: null, loserId: null };
  const attackerWins = attackerValue > defenderValue;
  return { attackerValue, defenderValue, attackerBreakdown, defenderBreakdown, draw: false, winnerId: attackerWins ? attacker.id : defender.id, loserId: attackerWins ? defender.id : attacker.id };
}
function confrontationBreakdown({ attribute, commonDie, exclusiveDie, modifiers }) { const normalized = Object.fromEntries(MODIFIER_KEYS.map(key => [key, Number(modifiers?.[key]) || 0])); const total = attribute + commonDie + exclusiveDie + Object.values(normalized).reduce((sum, value) => sum + value, 0); return { attribute, commonDie, exclusiveDie, modifiers: normalized, total }; }
function assertDie(value, name) { if (!Number.isInteger(value) || value < 1 || value > 6) throw new RangeError(`${name} must be an integer from 1 to 6`); }
function assertOptionalDie(value, name) { if (!Number.isInteger(value) || value < 0 || value > 6) throw new RangeError(`${name} must be 0 or an integer from 1 to 6`); }
