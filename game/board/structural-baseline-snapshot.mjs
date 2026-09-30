export function createStructuralBaselineSnapshot(analysis) {
  if (!analysis?.boardId) throw new TypeError('analysis.boardId is required');
  return {
    schemaVersion: 1,
    boardId: analysis.boardId,
    blue: { rows: structuredClone(analysis.blue?.matrix?.rows ?? []) },
    red: { rows: structuredClone(analysis.red?.matrix?.rows ?? []) },
    symmetry: structuredClone(analysis.symmetry ?? null)
  };
}

export function baselineSnapshotAsReport(snapshot) {
  return {
    boardId: snapshot.boardId,
    analysis: {
      blue: { matrix: { rows: structuredClone(snapshot.blue?.rows ?? []) } },
      red: { matrix: { rows: structuredClone(snapshot.red?.rows ?? []) } },
      symmetry: structuredClone(snapshot.symmetry ?? null)
    }
  };
}
