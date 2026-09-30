export function combatLogEntry(combat) {
  if (!combat) return null;
  const attacker = String(combat.attackerId).toUpperCase();
  const defender = String(combat.defenderId).toUpperCase();
  const result = combat.draw ? 'DRAW' : `${String(combat.winnerId).toUpperCase()} WINS`;
  return `COMBAT ${attacker} ${combat.attackerValue} vs ${defender} ${combat.defenderValue} — ${result}`;
}

export function latestCombatEvent(events, afterIndex = 0) {
  const slice = events.slice(afterIndex);
  for (let index = slice.length - 1; index >= 0; index -= 1) if (slice[index].type === 'COMBAT_RESOLVED') return slice[index];
  return null;
}
