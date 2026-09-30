import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('restart resets transient playtest state and starts a fresh match', () => {
  const controller = createBrowserController({ random: () => 0.99, seed: 'alpha' });
  controller.selectCharacter('blue-1');
  controller.roll();
  assert.ok(controller.view().ui.matchLog.length > 0);
  const restarted = controller.restart();
  assert.equal(restarted.ui.matchLog.length, 0);
  assert.equal(restarted.ui.activeTeam, 'blue');
  assert.equal(restarted.ui.playtest.seed, 'alpha');
  assert.equal(restarted.ui.playtest.turnsCompleted, 0);
});

test('playtest projection exposes reproducibility seed and metrics outside core rules', () => {
  const controller = createBrowserController({ random: () => 0.99, seed: 'session-42' });
  const initial = controller.view().ui.playtest;
  assert.equal(initial.seed, 'session-42');
  assert.equal(initial.rolls, 0);
  controller.selectCharacter('blue-1');
  controller.roll();
  const metrics = controller.view().ui.playtest;
  assert.equal(metrics.rolls, 1);
  assert.equal(metrics.turnsCompleted, 1);
  assert.equal(metrics.victory, null);
});
