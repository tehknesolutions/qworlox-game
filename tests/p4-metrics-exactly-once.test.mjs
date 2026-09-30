import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

function metrics(controller) { return controller.view().ui.playtest; }

function arrangePendingCombat(controller) {
  const match = controller.debugMatch();
  const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'blue-king'; blue.attributes = { strength: 5, defense: 5 };
  red.status = 'route'; red.nodeId = 'blue-approach'; red.attributes = { strength: 1, defense: 1 };
  controller.selectCharacter(blue.id); controller.roll(); controller.chooseNode('blue-approach');
}

test('pending combat counts encounter/combat once and does not complete turn early', () => {
  const controller = createBrowserController({ random: () => 0, seed: 'metrics-pending' });
  arrangePendingCombat(controller);
  assert.deepEqual(metrics(controller), { seed: 'metrics-pending', rolls: 1, turnsCompleted: 0, encounters: 1, combats: 1, victory: null });
});

test('resolving pending combat completes same turn without recounting encounter/combat', () => {
  const controller = createBrowserController({ random: () => 0, seed: 'metrics-resolved' });
  arrangePendingCombat(controller);
  controller.chooseNode('center');
  assert.deepEqual(metrics(controller), { seed: 'metrics-resolved', rolls: 1, turnsCompleted: 1, encounters: 1, combats: 1, victory: null });
});

test('restart resets P4 metrics and match state', () => {
  const controller = createBrowserController({ random: () => 0, seed: 'metrics-reset' });
  arrangePendingCombat(controller);
  controller.restart();
  assert.deepEqual(metrics(controller), { seed: 'metrics-reset', rolls: 0, turnsCompleted: 0, encounters: 0, combats: 0, victory: null });
  assert.equal(controller.debugMatch().game.pendingCombatAdvance, undefined);
});
