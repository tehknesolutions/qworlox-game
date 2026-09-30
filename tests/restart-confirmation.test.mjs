import test from 'node:test';
import assert from 'node:assert/strict';
import { createRestartGuard } from '../game/ui/restart-guard.mjs';

test('first restart request asks for confirmation without resetting', () => {
  let resets = 0; const guard = createRestartGuard({ restart: () => { resets += 1; } });
  assert.deepEqual(guard.request(), { pending: true, restarted: false });
  assert.equal(resets, 0);
});

test('confirm performs exactly one restart and clears pending state', () => {
  let resets = 0; const guard = createRestartGuard({ restart: () => { resets += 1; } });
  guard.request();
  assert.deepEqual(guard.confirm(), { pending: false, restarted: true });
  assert.equal(resets, 1);
});

test('cancel preserves game by clearing confirmation without restart', () => {
  let resets = 0; const guard = createRestartGuard({ restart: () => { resets += 1; } });
  guard.request();
  assert.deepEqual(guard.cancel(), { pending: false, restarted: false });
  assert.equal(resets, 0);
});
