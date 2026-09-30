export function applyGraphCombatConsequence({ graph, combat, pieces, choice = null }) {
  if (!graph?.adjacency || !combat || !pieces) throw new TypeError('graph, combat and pieces are required');
  const nextPieces = structuredClone(pieces);
  if (combat.draw || !combat.winnerId) return { pieces: nextPieces, consequence: 'IMPASSE', winnerNodeId: null, requiresChoice: false, legalChoices: [] };

  const winner = nextPieces[combat.winnerId];
  if (!winner?.nodeId) throw new Error(`winner piece has no graph node: ${combat.winnerId}`);
  const legalChoices = [...new Set(graph.adjacency.get(winner.nodeId) ?? [])];
  if (choice && !legalChoices.includes(choice)) throw new Error('combat winner advance requires a legal adjacent node');
  if (!choice && legalChoices.length > 1) return { pieces: nextPieces, consequence: 'WINNER_ADVANCE_PENDING', winnerNodeId: winner.nodeId, requiresChoice: true, legalChoices };
  const nextNodeId = choice ?? legalChoices[0];
  if (!nextNodeId) throw new Error('combat winner has no legal adjacent node');
  winner.nodeId = nextNodeId; winner.status = 'route';
  return { pieces: nextPieces, consequence: 'WINNER_ADVANCES_ONE', winnerNodeId: nextNodeId, requiresChoice: false, legalChoices };
}
