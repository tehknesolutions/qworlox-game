import { auditRouteSpace } from './route-space-audit.mjs';

export function buildMobilityMatrix(graph, { movingTeam, rolls = [1, 2, 3, 4, 5, 6] } = {}) {
  if (!movingTeam) throw new TypeError('movingTeam is required');
  const rows = [];
  for (const nodeId of graph.nodes.keys()) {
    for (const roll of rolls) {
      const audit = auditRouteSpace(graph, { startNodeId: nodeId, steps: roll, movingTeam });
      rows.push({
        nodeId,
        roll,
        totalPaths: audit.totalPaths,
        reachesEnemyKing: audit.reachesEnemyKing,
        returnsToStart: audit.returnsToStart,
        immediateBacktracks: audit.immediateBacktracks,
        repeatedNodePaths: audit.repeatedNodePaths,
        loopShare: ratio(audit.repeatedNodePaths, audit.totalPaths),
        backtrackShare: ratio(audit.immediateBacktracks, audit.totalPaths),
        kingReachShare: ratio(audit.reachesEnemyKing, audit.totalPaths)
      });
    }
  }
  return { movingTeam, rolls: [...rolls], rows };
}

export function summarizeMobilityMatrix(matrix) {
  const rows = matrix?.rows ?? [];
  if (!rows.length) return { cells: 0, highLoopCells: 0, kingReachCells: 0, returnCells: 0 };
  return {
    cells: rows.length,
    highLoopCells: rows.filter(row => row.loopShare >= 0.5).length,
    kingReachCells: rows.filter(row => row.reachesEnemyKing > 0).length,
    returnCells: rows.filter(row => row.returnsToStart > 0).length
  };
}
function ratio(value, total) { return total ? value / total : 0; }
