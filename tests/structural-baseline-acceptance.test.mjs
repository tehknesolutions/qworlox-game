import test from 'node:test';
import assert from 'node:assert/strict';
import { createBaselineAcceptance } from '../game/board/structural-baseline-acceptance.mjs';

const snapshot = { schemaVersion: 1, boardId: 'king-reach-playable-v1', baselineVersion: 'v1', blue: { rows: [] }, red: { rows: [] }, symmetry: null };

test('acceptance records explicit provenance and deterministic hash', async () => {
  const a = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  const b = await createBaselineAcceptance(snapshot, { sourceCommit: 'abc123', acceptedBy: 'TW-DA-VINCI' });
  assert.equal(a.snapshotHash, b.snapshotHash);
  assert.equal(a.boardId, snapshot.boardId);
  assert.equal(a.baselineVersion, 'v1');
  assert.equal(a.sourceCommit, 'abc123');
  assert.equal(a.acceptedBy, 'TW-DA-VINCI');
  assert.match(a.snapshotHash, /^[a-f0-9]{64}$/);
});

test('acceptance requires source commit and authority', async () => {
  await assert.rejects(() => createBaselineAcceptance(snapshot, { acceptedBy: 'TW' }), /sourceCommit/);
  await assert.rejects(() => createBaselineAcceptance(snapshot, { sourceCommit: 'abc' }), /acceptedBy/);
});
