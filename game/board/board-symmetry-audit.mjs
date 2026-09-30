const METRICS = ['totalPaths', 'reachesEnemyKing', 'returnsToStart', 'immediateBacktracks', 'repeatedNodePaths', 'loopShare', 'backtrackShare', 'kingReachShare'];

export function auditBoardSymmetry(blueMatrix, redMatrix, mirrorMap) {
  const redIndex = new Map((redMatrix?.rows ?? []).map(row => [`${row.nodeId}:${row.roll}`, row]));
  const mismatches = [];
  for (const blue of blueMatrix?.rows ?? []) {
    const mirroredNodeId = mirrorMap?.[blue.nodeId];
    const red = mirroredNodeId ? redIndex.get(`${mirroredNodeId}:${blue.roll}`) : null;
    if (!red) { mismatches.push({ nodeId: blue.nodeId, mirroredNodeId: mirroredNodeId ?? null, roll: blue.roll, reason: 'MISSING_MIRROR' }); continue; }
    const delta = Object.fromEntries(METRICS.map(metric => [metric, normalizedDelta(blue[metric], red[metric])]));
    if (METRICS.some(metric => delta[metric] !== 0)) mismatches.push({ nodeId: blue.nodeId, mirroredNodeId, roll: blue.roll, reason: 'METRIC_DELTA', delta });
  }
  return { symmetric: mismatches.length === 0, comparedCells: (blueMatrix?.rows ?? []).length, mismatches };
}
function normalizedDelta(a = 0, b = 0) { const value = Number(a) - Number(b); return Math.abs(value) < 1e-12 ? 0 : Number(value.toFixed(12)); }
