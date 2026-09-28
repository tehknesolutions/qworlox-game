export function projectPlayableUI(match, { selectedCharacterId = null } = {}) {
  if (!match?.game || !match?.graph) throw new TypeError('invalid playable match');

  const nodes = [...match.graph.nodes.values()].map(node => structuredClone(node));
  const pieces = Object.entries(match.game.teams).flatMap(([team, state]) =>
    state.characters.map(character => ({
      id: character.id,
      team,
      status: character.status,
      nodeId: character.nodeId ?? null
    }))
  );

  const interactionLocked = Boolean(match.game.winner);
  const selectedPiece = selectedCharacterId
    ? pieces.find(piece => piece.id === selectedCharacterId)
    : null;

  let legalNextNodes = [];
  if (!interactionLocked && selectedPiece?.nodeId) {
    legalNextNodes = [...new Set(match.graph.adjacency.get(selectedPiece.nodeId) ?? [])];
  }

  return {
    activeTeam: match.game.activeTeam,
    winner: match.game.winner,
    victory: match.game.victory ? structuredClone(match.game.victory) : null,
    interactionLocked,
    announcement: match.game.winner
      ? `KING REACHED — ${match.game.winner.toUpperCase()} WINS`
      : null,
    selectedCharacterId,
    legalNextNodes,
    nodes,
    pieces
  };
}
