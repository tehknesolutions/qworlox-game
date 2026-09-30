import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePersistedBaselineRegistry } from '../game/board/persisted-baseline-registry.mjs';

test('persisted registry validates schema and board identity', () => {
  const registry = parsePersistedBaselineRegistry(JSON.stringify({ schemaVersion: 1, boardId: 'king-reach-playable-v1', versions: [], baselines: {} }));
  assert.equal(registry.boardId, 'king-reach-playable-v1');
});

test('persisted registry rejects malformed history', () => {
  assert.throws(() => parsePersistedBaselineRegistry('{}'), /schemaVersion/);
  assert.throws(() => parsePersistedBaselineRegistry(JSON.stringify({ schemaVersion: 1, boardId: 'king-reach-playable-v1', versions: ['v1'], baselines: {} })), /missing baseline/);
});
