export function applyGraphCombatConsequence({ graph, combat, pieces, choice = null }) {
  if (!graph?.adjacency || !combat || !pieces) throw new TypeError('graph, combat and pieces are required');
  const nextPieces = structuredClone(pieces);
  if (combat.draw || !combat.winnerId) return { pieces: nextPieces, consequence: 'IMPASSE', winnerNodeId: null };

  const winner = nextPieces[combat.winnerId];
  if (!winner?.nodeId) throw new Error(`winner piece has no graph node: ${combat.winnerId}`);
  const legal = [...new Set(graph.adjacency.get(winner.nodeId) ?? [])];
  const nextNodeId = choice ?? (legal.length === 1 ? legal[0] : null);
  if (!nextNodeId || !legal.includes(nextNodeId)) throw new Error('combat winner advance requires a legal adjacent node');
  winner.nodeId = nextNodeId;
  winner.status = 'route';
  return { pieces: nextPieces, consequence: 'WINNER_ADVANCES_ONE', winnerNodeId: nextNodeId };
}
