import test from 'node:test';
import assert from 'node:assert/strict';
import { createBaselineRegistry, registerBaseline, selectBaseline } from '../game/board/structural-baseline-registry.mjs';

const snapshot = version => ({ schemaVersion: 1, boardId: 'king-reach-playable-v1', baselineVersion: version, blue: { rows: [] }, red: { rows: [] }, symmetry: null });

test('registry stores multiple explicit baseline versions', () => {
  let registry = createBaselineRegistry('king-reach-playable-v1');
  registry = registerBaseline(registry, 'v1', snapshot('v1'));
  registry = registerBaseline(registry, 'v2', snapshot('v2'));
  assert.deepEqual(registry.versions, ['v1', 'v2']);
  assert.equal(selectBaseline(registry, 'v2').baselineVersion, 'v2');
});

test('registry rejects duplicate versions instead of silently replacing history', () => {
  const registry = registerBaseline(createBaselineRegistry('king-reach-playable-v1'), 'v1', snapshot('v1'));
  assert.throws(() => registerBaseline(registry, 'v1', snapshot('v1')), /already exists/);
});

test('registry rejects snapshots from another board', () => {
  const registry = createBaselineRegistry('king-reach-playable-v1');
  assert.throws(() => registerBaseline(registry, 'v1', { ...snapshot('v1'), boardId: 'other-board' }), /boardId mismatch/);
});

test('baseline selection is explicit and fails for unknown version', () => {
  const registry = registerBaseline(createBaselineRegistry('king-reach-playable-v1'), 'v1', snapshot('v1'));
  assert.throws(() => selectBaseline(registry, 'v9'), /unknown baseline version/);
});
