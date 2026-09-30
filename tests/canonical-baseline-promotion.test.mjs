import test from 'node:test';
import assert from 'node:assert/strict';
import { promoteCanonicalBaseline } from '../game/board/canonical-baseline-promotion.mjs';

const declaration = { schemaVersion: 1, boardId: 'king-reach-playable-v1', canonicalVersion: null };

test('promotion requires a verified accepted baseline', async () => {
  const result = await promoteCanonicalBaseline(declaration, 'v1', async () => ({ ok: true, reason: 'VERIFIED', baselineVersion: 'v1', snapshotHash: 'abc' }));
  assert.equal(result.declaration.canonicalVersion, 'v1');
  assert.equal(result.verification.snapshotHash, 'abc');
});

test('promotion refuses failed integrity verification', async () => {
  await assert.rejects(() => promoteCanonicalBaseline(declaration, 'v1', async () => ({ ok: false, reason: 'SNAPSHOT_HASH_MISMATCH' })), /SNAPSHOT_HASH_MISMATCH/);
});

test('promotion refuses verifier response for another version', async () => {
  await assert.rejects(() => promoteCanonicalBaseline(declaration, 'v1', async () => ({ ok: true, reason: 'VERIFIED', baselineVersion: 'v2', snapshotHash: 'abc' })), /version mismatch/);
});
