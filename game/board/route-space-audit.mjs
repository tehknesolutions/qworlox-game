export function auditRouteSpace(graph, { startNodeId, steps, movingTeam }) {
  if (!graph?.nodes?.has(startNodeId)) throw new Error(`unknown start node: ${startNodeId}`);
  if (!Number.isInteger(steps) || steps < 0) throw new TypeError('steps must be a non-negative integer');
  const paths = [];
  function walk(current, remaining, path) {
    if (remaining === 0) { paths.push(path); return; }
    const node = graph.nodes.get(current);
    const friendlyKing = graph.kingObjectives?.[movingTeam] === current;
    if (node?.objective?.type === 'KING' && !friendlyKing) { paths.push(path); return; }
    const neighbors = [...new Set(graph.adjacency.get(current) ?? [])];
    if (!neighbors.length) { paths.push(path); return; }
    for (const next of neighbors) walk(next, remaining - 1, [...path, next]);
  }
  walk(startNodeId, steps, [startNodeId]);
  const opponent = movingTeam === 'blue' ? 'red' : 'blue';
  const target = graph.kingObjectives?.[opponent];
  return {
    startNodeId, steps, movingTeam, totalPaths: paths.length,
    reachesEnemyKing: paths.filter(path => path.at(-1) === target).length,
    returnsToStart: paths.filter(path => path.length > 1 && path.at(-1) === startNodeId).length,
    immediateBacktracks: paths.filter(hasImmediateBacktrack).length,
    repeatedNodePaths: paths.filter(path => new Set(path).size < path.length).length,
    paths
  };
}
function hasImmediateBacktrack(path) { for (let i = 2; i < path.length; i += 1) if (path[i] === path[i - 2]) return true; return false; }
