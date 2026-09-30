import test from 'node:test';
import assert from 'node:assert/strict';
import { createRestartGuard } from '../game/ui/restart-guard.mjs';

test('restart guard exposes interaction lock only while confirmation is pending', () => {
  const guard = createRestartGuard({ restart: () => {} });
  assert.equal(guard.blocksInteraction(), false);
  guard.request();
  assert.equal(guard.blocksInteraction(), true);
  guard.cancel();
  assert.equal(guard.blocksInteraction(), false);
});

test('confirm clears restart interaction lock after reset', () => {
  const guard = createRestartGuard({ restart: () => {} });
  guard.request(); guard.confirm();
  assert.equal(guard.blocksInteraction(), false);
});
