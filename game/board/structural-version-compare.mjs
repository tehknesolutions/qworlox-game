import { selectBaseline } from './structural-baseline-registry.mjs';
import { baselineSnapshotAsReport } from './structural-baseline-snapshot.mjs';
import { compareStructuralMetrics } from './structural-diff.mjs';

export function compareBaselineVersions(registry, fromVersion, toVersion) {
  const from = selectBaseline(registry, fromVersion);
  const to = selectBaseline(registry, toVersion);
  const diff = compareStructuralMetrics(
    baselineSnapshotAsReport(to),
    baselineSnapshotAsReport(from)
  );
  return {
    boardId: registry.boardId,
    fromVersion,
    toVersion,
    status: diff.status,
    changes: diff.changes
  };
}
