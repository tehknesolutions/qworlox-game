import test from 'node:test';
import assert from 'node:assert/strict';
import { createAcceptanceRegistry, registerAcceptance, verifyAcceptedSnapshot } from '../game/board/structural-acceptance-registry.mjs';
import { createBaselineAcceptance } from '../game/board/structural-baseline-acceptance.mjs';

const snapshot = { schemaVersion: 1, boardId: 'king-reach-playable-v1', baselineVersion: 'v1', blue: { rows: [] }, red: { rows: [] }, symmetry: null };

test('acceptance registry preserves explicit immutable history', async () => {
  const acceptance = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  const registry = registerAcceptance(createAcceptanceRegistry(snapshot.boardId), acceptance);
  assert.deepEqual(registry.versions, ['v1']);
  assert.equal(registry.acceptances.v1.snapshotHash, acceptance.snapshotHash);
  assert.throws(() => registerAcceptance(registry, acceptance), /already accepted/);
});

test('integrity verification detects post-acceptance snapshot mutation', async () => {
  const acceptance = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  const registry = registerAcceptance(createAcceptanceRegistry(snapshot.boardId), acceptance);
  assert.equal((await verifyAcceptedSnapshot(registry, snapshot)).ok, true);
  const mutated = { ...snapshot, blue: { rows: [{ nodeId: 'tampered' }] } };
  const result = await verifyAcceptedSnapshot(registry, mutated);
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'SNAPSHOT_HASH_MISMATCH');
});
