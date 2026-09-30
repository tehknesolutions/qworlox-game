import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuralReport } from '../game/board/generate-structural-report.mjs';

test('generator derives markdown from the real playable board', () => {
  const result = generateStructuralReport();
  assert.equal(result.boardId, 'king-reach-playable-v1');
  assert.match(result.markdown, /Q'Worlox Structural Board Diagnostic/);
  assert.match(result.markdown, /BLUE · 42 cells/);
  assert.match(result.markdown, /RED · 42 cells/);
  assert.match(result.markdown, /Symmetry:/);
});

test('generator is deterministic for the same board definition', () => {
  assert.deepEqual(generateStructuralReport(), generateStructuralReport());
});
