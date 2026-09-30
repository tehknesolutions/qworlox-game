import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCaptureArgs, serializeBaselineRegistry } from '../game/board/capture-structural-baseline-cli.mjs';

test('capture CLI requires explicit version', () => {
  assert.deepEqual(parseCaptureArgs(['--version', 'v1']), { version: 'v1' });
  assert.throws(() => parseCaptureArgs([]), /--version/);
});

test('registry serialization is deterministic and newline terminated', () => {
  const registry = { schemaVersion: 1, boardId: 'board-v1', versions: ['v1'], baselines: { v1: { boardId: 'board-v1' } } };
  const text = serializeBaselineRegistry(registry);
  assert.equal(text, JSON.stringify(registry, null, 2) + '\n');
});
