import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePersistedAcceptanceRegistry } from '../game/board/persisted-acceptance-registry.mjs';

test('acceptance registry validates canonical empty state', () => {
  const registry = parsePersistedAcceptanceRegistry(JSON.stringify({ schemaVersion: 1, boardId: 'king-reach-playable-v1', versions: [], acceptances: {} }));
  assert.equal(registry.boardId, 'king-reach-playable-v1');
});

test('acceptance registry rejects incomplete history', () => {
  assert.throws(() => parsePersistedAcceptanceRegistry('{}'), /schemaVersion/);
  assert.throws(() => parsePersistedAcceptanceRegistry(JSON.stringify({ schemaVersion: 1, boardId: 'king-reach-playable-v1', versions: ['v1'], acceptances: {} })), /missing acceptance/);
});
