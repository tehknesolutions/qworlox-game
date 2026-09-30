import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAcceptedBaselineVersion } from '../game/board/verify-accepted-board.mjs';
import { createBaselineAcceptance } from '../game/board/structural-baseline-acceptance.mjs';
import { createAcceptanceRegistry, registerAcceptance } from '../game/board/structural-acceptance-registry.mjs';

const snapshot = { schemaVersion: 1, boardId: 'king-reach-playable-v1', baselineVersion: 'v1', blue: { rows: [] }, red: { rows: [] }, symmetry: null };

test('accepted persisted snapshot verifies against acceptance hash', async () => {
  const acceptance = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  const acceptances = registerAcceptance(createAcceptanceRegistry(snapshot.boardId), acceptance);
  const baselines = { schemaVersion: 1, boardId: snapshot.boardId, versions: ['v1'], baselines: { v1: snapshot } };
  const result = await verifyAcceptedBaselineVersion(baselines, acceptances, 'v1');
  assert.equal(result.ok, true);
  assert.equal(result.reason, 'VERIFIED');
});

test('verification fails when accepted snapshot was altered', async () => {
  const acceptance = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  const acceptances = registerAcceptance(createAcceptanceRegistry(snapshot.boardId), acceptance);
  const baselines = { schemaVersion: 1, boardId: snapshot.boardId, versions: ['v1'], baselines: { v1: { ...snapshot, blue: { rows: [{ nodeId: 'tampered' }] } } } };
  const result = await verifyAcceptedBaselineVersion(baselines, acceptances, 'v1');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'SNAPSHOT_HASH_MISMATCH');
});
