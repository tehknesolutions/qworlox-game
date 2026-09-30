import { createHash } from 'node:crypto';

export async function createBaselineAcceptance(snapshot, provenance) {
  if (!snapshot?.boardId) throw new TypeError('snapshot.boardId is required');
  if (!snapshot?.baselineVersion) throw new TypeError('snapshot.baselineVersion is required');
  if (!provenance?.sourceCommit) throw new TypeError('sourceCommit is required');
  if (!provenance?.acceptedBy) throw new TypeError('acceptedBy is required');
  const canonical = JSON.stringify(snapshot);
  const snapshotHash = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({
    schemaVersion: 1,
    boardId: snapshot.boardId,
    baselineVersion: snapshot.baselineVersion,
    snapshotHash,
    hashAlgorithm: 'sha256',
    sourceCommit: provenance.sourceCommit,
    acceptedBy: provenance.acceptedBy
  });
}
