export function formatStructuralReport(analysis) {
  const lines = [`# Q'Worlox Structural Board Diagnostic`, '', `Board: ${analysis.boardId}`, ''];
  for (const [label, side] of [['BLUE', analysis.blue], ['RED', analysis.red]]) {
    const balance = side?.balance ?? { cells: 0, counts: {} };
    const counts = balance.counts ?? {};
    lines.push(`## ${label} · ${balance.cells} cells`, `OBJECTIVE: ${counts.OBJECTIVE ?? 0} · LOOPING: ${counts.LOOPING ?? 0} · DECISION: ${counts.DECISION ?? 0} · PROGRESSION: ${counts.PROGRESSION ?? 0}`, '');
  }
  const symmetry = analysis.symmetry ?? { symmetric: false, comparedCells: 0, mismatches: [] };
  lines.push(`## Symmetry: ${symmetry.symmetric ? 'PASS' : 'FAIL'} · ${symmetry.comparedCells} compared cells`);
  if (symmetry.mismatches?.length) {
    lines.push('');
    for (const mismatch of symmetry.mismatches) lines.push(`- ${mismatch.nodeId} ↔ ${mismatch.mirroredNodeId ?? 'MISSING'} · D6=${mismatch.roll} · ${mismatch.reason}`);
  }
  lines.push('', '> Diagnostic only. This report describes current executable geometry; it does not change gameplay rules.');
  return `${lines.join('\n')}\n`;
}
