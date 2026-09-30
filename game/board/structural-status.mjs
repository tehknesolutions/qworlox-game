import { compareStructuralMetrics } from './structural-diff.mjs';

export function classifyStructuralStatus(diff, baselineValidation) {
  if (!baselineValidation?.ok) return { status: 'BREAKING', reasons: [...(baselineValidation.errors ?? [])], changes: diff?.changes ?? [] };
  if (!diff || diff.status === 'UNCHANGED') return { status: 'UNCHANGED', reasons: [], changes: [] };
  const breakingChanges = (diff.changes ?? []).filter(change => change.status === 'REMOVED');
  if (breakingChanges.length) return { status: 'BREAKING', reasons: breakingChanges.map(change => 'removed structural cell: ' + change.key), changes: diff.changes };
  return { status: 'CHANGED', reasons: [], changes: diff.changes };
}

export function buildStructuralStatus(current, baseline) {
  const baselineValidation = baseline?.validation ?? { ok: false, errors: ['baseline validation unavailable'] };
  const diff = compareStructuralMetrics(current, baseline?.report ?? current);
  return classifyStructuralStatus(diff, baselineValidation);
}
