export function classifyMobilityCell(cell) {
  if ((cell.reachesEnemyKing ?? 0) > 0) return 'OBJECTIVE';
  if ((cell.loopShare ?? 0) >= 0.5) return 'LOOPING';
  if ((cell.totalPaths ?? 0) >= 3) return 'DECISION';
  return 'PROGRESSION';
}

export function auditBoardBalance(matrix) {
  const rows = (matrix?.rows ?? []).map(row => ({ ...row, classification: classifyMobilityCell(row) }));
  const counts = { OBJECTIVE: 0, LOOPING: 0, DECISION: 0, PROGRESSION: 0 };
  for (const row of rows) counts[row.classification] += 1;
  return { movingTeam: matrix?.movingTeam ?? null, cells: rows.length, counts, rows };
}
