import { createHash } from 'node:crypto';

export function createAcceptanceRegistry(boardId) {
  if (!boardId) throw new TypeError('boardId is required');
  return { schemaVersion: 1, boardId, versions: [], acceptances: {} };
}

export function registerAcceptance(registry, acceptance) {
  if (acceptance?.boardId !== registry?.boardId) throw new Error(`boardId mismatch: expected ${registry?.boardId ?? 'missing'}, got ${acceptance?.boardId ?? 'missing'}`);
  const version = acceptance?.baselineVersion;
  if (!version) throw new TypeError('acceptance.baselineVersion is required');
  if (registry.acceptances?.[version]) throw new Error(`baseline version already accepted: ${version}`);
  const next = structuredClone(registry);
  next.versions.push(version);
  next.acceptances[version] = structuredClone(acceptance);
  return next;
}

export async function verifyAcceptedSnapshot(registry, snapshot) {
  const version = snapshot?.baselineVersion;
  const acceptance = registry?.acceptances?.[version];
  if (!acceptance) return { ok: false, reason: 'ACCEPTANCE_NOT_FOUND', baselineVersion: version ?? null };
  if (snapshot?.boardId !== registry.boardId) return { ok: false, reason: 'BOARD_ID_MISMATCH', baselineVersion: version };
  const snapshotHash = createHash('sha256').update(JSON.stringify(snapshot), 'utf8').digest('hex');
  if (snapshotHash !== acceptance.snapshotHash) return { ok: false, reason: 'SNAPSHOT_HASH_MISMATCH', baselineVersion: version, expectedHash: acceptance.snapshotHash, actualHash: snapshotHash };
  return { ok: true, reason: 'VERIFIED', baselineVersion: version, snapshotHash };
}
