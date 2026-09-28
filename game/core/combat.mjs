const MODIFIER_KEYS = ['card', 'board', 'equipment', 'ally', 'magic'];

export function resolveCombat({
  attacker,
  defender,
  commonDie,
  attackerExclusiveDie = 0,
  defenderExclusiveDie = 0,
  attackerModifiers = {},
  defenderModifiers = {}
}) {
  assertDie(commonDie, 'commonDie');
  assertOptionalDie(attackerExclusiveDie, 'attackerExclusiveDie');
  assertOptionalDie(defenderExclusiveDie, 'defenderExclusiveDie');

  const attackerValue = confrontationValue({
    attribute: attacker.attributes?.strength ?? 0,
    commonDie,
    exclusiveDie: attackerExclusiveDie,
    modifiers: attackerModifiers
  });
  const defenderValue = confrontationValue({
    attribute: defender.attributes?.defense ?? 0,
    commonDie,
    exclusiveDie: defenderExclusiveDie,
    modifiers: defenderModifiers
  });

  if (attackerValue === defenderValue) {
    return {
      attackerValue,
      defenderValue,
      draw: true,
      winnerId: null,
      loserId: null
    };
  }

  const attackerWins = attackerValue > defenderValue;
  return {
    attackerValue,
    defenderValue,
    draw: false,
    winnerId: attackerWins ? attacker.id : defender.id,
    loserId: attackerWins ? defender.id : attacker.id
  };
}

function confrontationValue({ attribute, commonDie, exclusiveDie, modifiers }) {
  return attribute + commonDie + exclusiveDie + modifierTotal(modifiers);
}

function modifierTotal(modifiers = {}) {
  return MODIFIER_KEYS.reduce((sum, key) => sum + (Number(modifiers[key]) || 0), 0);
}

function assertDie(value, name) {
  if (!Number.isInteger(value) || value < 1 || value > 6) {
    throw new RangeError(`${name} must be an integer from 1 to 6`);
  }
}

function assertOptionalDie(value, name) {
  if (!Number.isInteger(value) || value < 0 || value > 6) {
    throw new RangeError(`${name} must be 0 or an integer from 1 to 6`);
  }
}
