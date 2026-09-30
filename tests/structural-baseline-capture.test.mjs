import test from 'node:test';
import assert from 'node:assert/strict';
import { captureStructuralBaseline } from '../game/board/structural-baseline-capture.mjs';
import { createBaselineRegistry } from '../game/board/structural-baseline-registry.mjs';

const analysis = { boardId: 'king-reach-playable-v1', blue: { matrix: { rows: [] } }, red: { matrix: { rows: [] } }, symmetry: null };

test('capture registers an engine analysis as an explicit version', () => {
  const registry = createBaselineRegistry('king-reach-playable-v1');
  const result = captureStructuralBaseline(registry, 'v1', analysis);
  assert.deepEqual(result.registry.versions, ['v1']);
  assert.equal(result.snapshot.baselineVersion, 'v1');
  assert.equal(result.snapshot.boardId, 'king-reach-playable-v1');
});

test('capture never overwrites an existing historical version', () => {
  const first = captureStructuralBaseline(createBaselineRegistry('king-reach-playable-v1'), 'v1', analysis);
  assert.throws(() => captureStructuralBaseline(first.registry, 'v1', analysis), /already exists/);
});

test('capture rejects analysis from another board', () => {
  const registry = createBaselineRegistry('king-reach-playable-v1');
  assert.throws(() => captureStructuralBaseline(registry, 'v1', { ...analysis, boardId: 'other-board' }), /boardId mismatch/);
});
