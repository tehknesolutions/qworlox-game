export function applyCombatConsequence({ combat, positions, routeLength }) {
  if (!Number.isInteger(routeLength) || routeLength < 1) {
    throw new TypeError('routeLength must be a positive integer');
  }

  const nextPositions = { ...positions };
  if (combat.draw || !combat.winnerId) {
    return { positions: nextPositions, consequence: 'IMPASSE' };
  }

  const current = Number(nextPositions[combat.winnerId]);
  if (!Number.isInteger(current)) {
    throw new TypeError('winner position must be an integer');
  }

  // Baseline GDD consequence: the winner gains one position.
  // The loser remains at the contested position. The graph is the authority
  // for later special repositioning rules.
  nextPositions[combat.winnerId] = Math.min(current + 1, routeLength);
  return { positions: nextPositions, consequence: 'WINNER_ADVANCES_ONE' };
}
