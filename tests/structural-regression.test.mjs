import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuralReport } from '../game/board/generate-structural-report.mjs';
import { validateStructuralBaseline, STRUCTURAL_BASELINE } from '../game/board/structural-regression.mjs';

test('current playable board satisfies structural baseline contract', () => {
  const result = generateStructuralReport();
  const validation = validateStructuralBaseline(result);
  assert.equal(validation.ok, true, validation.errors.join('; '));
  assert.deepEqual(validation.schemaVersion, STRUCTURAL_BASELINE.schemaVersion);
});

test('baseline contract remains explicit and minimal', () => {
  assert.deepEqual(STRUCTURAL_BASELINE, {
    schemaVersion: 1,
    boardId: 'king-reach-playable-v1',
    cellsPerTeam: 42
  });
});
