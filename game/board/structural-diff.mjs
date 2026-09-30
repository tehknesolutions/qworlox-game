const METRICS = ['totalPaths', 'reachesEnemyKing', 'returnsToStart', 'immediateBacktracks', 'repeatedNodePaths', 'loopShare', 'backtrackShare', 'kingReachShare'];

export function compareStructuralMetrics(current, baseline) {
  const changes = [];
  const currentRows = indexRows(current);
  const baselineRows = indexRows(baseline);
  const keys = [...new Set([...currentRows.keys(), ...baselineRows.keys()])].sort();
  for (const key of keys) {
    const now = currentRows.get(key);
    const before = baselineRows.get(key);
    if (!now || !before) {
      changes.push({ key, status: !before ? 'ADDED' : 'REMOVED', current: now ?? null, baseline: before ?? null });
      continue;
    }
    const delta = Object.fromEntries(METRICS.map(metric => [metric, normalizedDelta(now[metric], before[metric])]));
    if (METRICS.some(metric => delta[metric] !== 0)) changes.push({ key, status: 'CHANGED', delta });
  }
  return { status: changes.length ? 'CHANGED' : 'UNCHANGED', changes };
}

function indexRows(report) {
  const rows = [
    ...(report?.analysis?.blue?.matrix?.rows ?? []).map(row => ({ key: 'blue:' + row.nodeId + ':' + row.roll, row })),
    ...(report?.analysis?.red?.matrix?.rows ?? []).map(row => ({ key: 'red:' + row.nodeId + ':' + row.roll, row }))
  ];
  return new Map(rows.map(item => [item.key, item.row]));
}

function normalizedDelta(a = 0, b = 0) {
  const value = Number(a) - Number(b);
  return Math.abs(value) < 1e-12 ? 0 : Number(value.toFixed(12));
}
