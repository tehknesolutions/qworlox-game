export function combatConsequenceSummary({ consequence, winnerId, loserId, winnerNodeId = null }) {
  if (consequence === 'IMPASSE') return 'Impasse — neither piece advances';
  const winner = String(winnerId).toUpperCase();
  const loser = String(loserId).toUpperCase();
  if (consequence === 'WINNER_ADVANCE_PENDING') return `${winner} won — choose an adjacent node to advance`;
  if (consequence === 'WINNER_ADVANCES_ONE') return `${winner} won and advanced to ${winnerNodeId}; ${loser} remains in place`;
  return 'Combat consequence unresolved';
}
