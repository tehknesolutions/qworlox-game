import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCanonicalBaselineGate } from '../game/board/canonical-baseline-gate.mjs';

const verified = { ok: true, reason: 'VERIFIED', baselineVersion: 'v1', snapshotHash: 'abc' };

test('gate skips cleanly when no canonical baseline is declared', async () => {
  const result = await resolveCanonicalBaselineGate({ canonicalVersion: null });
  assert.deepEqual(result, { ok: true, status: 'SKIPPED', reason: 'NO_CANONICAL_BASELINE' });
});

test('gate verifies explicitly declared canonical baseline', async () => {
  const result = await resolveCanonicalBaselineGate({ canonicalVersion: 'v1', verify: async version => ({ ...verified, baselineVersion: version }) });
  assert.equal(result.ok, true);
  assert.equal(result.status, 'VERIFIED');
  assert.equal(result.baselineVersion, 'v1');
});

test('gate propagates integrity failure for canonical baseline', async () => {
  const result = await resolveCanonicalBaselineGate({ canonicalVersion: 'v1', verify: async () => ({ ok: false, reason: 'SNAPSHOT_HASH_MISMATCH', baselineVersion: 'v1' }) });
  assert.equal(result.ok, false);
  assert.equal(result.status, 'FAILED');
  assert.equal(result.reason, 'SNAPSHOT_HASH_MISMATCH');
});
