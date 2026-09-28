export function nodeForPosition({ team, position }) {
  if (team !== 'blue' && team !== 'red') throw new TypeError('team must be blue or red');
  if (!Number.isInteger(position) || position < 0) throw new TypeError('position must be a non-negative integer');
  return `${team}-${position + 1}`;
}

export function opposingOccupant(mover, pieces) {
  return pieces.find(piece =>
    piece.id !== mover.id &&
    piece.team !== mover.team &&
    piece.nodeId === mover.nodeId
  ) ?? null;
}
