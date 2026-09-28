const TEAMS = ['blue', 'red'];

export function evaluateKingReach({ graph, team, characterId, nodeId }) {
  if (!TEAMS.includes(team)) throw new Error(`unknown team: ${team}`);

  const opposingTeam = team === 'blue' ? 'red' : 'blue';
  const opposingKingNodeId = graph?.kingObjectives?.[opposingTeam];

  if (nodeId !== opposingKingNodeId) return null;

  return {
    winner: team,
    characterId,
    kingNodeId: opposingKingNodeId
  };
}
