import { selectBaseline } from './structural-baseline-registry.mjs';
import { verifyAcceptedSnapshot } from './structural-acceptance-registry.mjs';

export async function verifyAcceptedBaselineVersion(baselines, acceptances, version) {
  const snapshot = selectBaseline(baselines, version);
  if (snapshot.boardId !== acceptances.boardId) return { ok: false, reason: 'BOARD_ID_MISMATCH', baselineVersion: version };
  return verifyAcceptedSnapshot(acceptances, snapshot);
}
