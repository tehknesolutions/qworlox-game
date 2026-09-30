import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuralReport } from '../game/board/generate-structural-report.mjs';

test('structural generator exposes stable machine-readable analysis', () => {
  const result = generateStructuralReport();
  const json = JSON.stringify({
    schemaVersion: 1,
    boardId: result.boardId,
    blue: result.analysis.blue.balance,
    red: result.analysis.red.balance,
    symmetry: result.analysis.symmetry
  });
  const parsed = JSON.parse(json);
  assert.equal(parsed.schemaVersion, 1);
  assert.equal(parsed.boardId, 'king-reach-playable-v1');
  assert.equal(parsed.blue.cells, 42);
  assert.equal(parsed.red.cells, 42);
  assert.equal(typeof parsed.symmetry.symmetric, 'boolean');
});
