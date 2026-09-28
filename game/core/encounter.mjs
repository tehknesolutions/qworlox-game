export function detectEncounter({ mover, occupants }) {
  const defender = occupants.find(piece =>
    piece.id !== mover.id &&
    piece.team !== mover.team &&
    piece.nodeId === mover.nodeId
  );

  if (!defender) return null;

  return {
    type: 'ENCOUNTER',
    nodeId: mover.nodeId,
    attackerId: mover.id,
    defenderId: defender.id
  };
}
