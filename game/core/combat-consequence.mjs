import { buildMovementPath } from '../board/path.mjs';

export function applyCombatConsequence({ combat, positions, pieces, routeLength }) {
  if (!Number.isInteger(routeLength) || routeLength < 1) {
    throw new TypeError('routeLength must be a positive integer');
  }

  const nextPieces = pieces ? structuredClone(pieces) : null;
  const nextPositions = positions ? { ...positions } : Object.fromEntries(
    Object.entries(nextPieces ?? {}).map(([id, piece]) => [id, piece.position])
  );

  if (combat.draw || !combat.winnerId) {
    if (nextPieces) syncPieceNodes(nextPieces, routeLength);
    return nextPieces
      ? { pieces: nextPieces, positions: nextPositions, consequence: 'IMPASSE' }
      : { positions: nextPositions, consequence: 'IMPASSE' };
  }

  const current = Number(nextPositions[combat.winnerId]);
  if (!Number.isInteger(current)) {
    throw new TypeError('winner position must be an integer');
  }

  const winner = Math.min(current + 1, routeLength);
  nextPositions[combat.winnerId] = winner;

  if (nextPieces) {
    const piece = nextPieces[combat.winnerId];
    if (!piece) throw new Error(`winner piece not found: ${combat.winnerId}`);
    piece.position = winner;
    piece.status = winner >= routeLength ? 'goal' : 'route';
    syncPieceNodes(nextPieces, routeLength);
  }

  return nextPieces
    ? { pieces: nextPieces, positions: nextPositions, consequence: 'WINNER_ADVANCES_ONE' }
    : { positions: nextPositions, consequence: 'WINNER_ADVANCES_ONE' };
}

function syncPieceNodes(pieces, routeLength) {
  for (const piece of Object.values(pieces)) {
    if (piece.status === 'base') {
      if (piece.position !== null) throw new RangeError(`base piece must have null position: ${piece.id}`);
      piece.nodeId = null;
      continue;
    }
    if (!Number.isInteger(piece.position) || piece.position < 0 || piece.position > routeLength) {
      throw new RangeError(`invalid piece position: ${piece.id}`);
    }
    const path = buildMovementPath({ routeLength, team: piece.team });
    piece.nodeId = path[piece.position];
  }
}
