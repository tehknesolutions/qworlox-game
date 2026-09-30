export function parseCompareArgs(args) {
  const fromIndex = args.indexOf('--from');
  const toIndex = args.indexOf('--to');
  const from = fromIndex >= 0 ? args[fromIndex + 1] : null;
  const to = toIndex >= 0 ? args[toIndex + 1] : null;
  if (!from) throw new Error('--from baseline version is required');
  if (!to) throw new Error('--to baseline version is required');
  return { from, to };
}

export function formatVersionComparison(result) {
  const lines = [`${result.boardId} · ${result.fromVersion} → ${result.toVersion} · ${result.status}`];
  for (const change of result.changes ?? []) {
    lines.push(`- ${change.key} · ${change.status}`);
    if (change.delta) {
      const deltas = Object.entries(change.delta).filter(([, value]) => value !== 0).map(([key, value]) => `${key}=${value > 0 ? '+' : ''}${value}`);
      if (deltas.length) lines.push(`  ${deltas.join(' · ')}`);
    }
  }
  return `${lines.join('\n')}\n`;
}
