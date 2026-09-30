import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('browser projects only pending combat advance choices and blocks normal actions', () => {
  const controller = createBrowserController({ random: () => 0.6 });
  const match = controller.debugMatch(); const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'blue-king'; blue.attributes = { strength: 3, defense: 1 };
  red.status = 'route'; red.nodeId = 'blue-approach'; red.attributes = { strength: 1, defense: 1 };
  controller.selectCharacter(blue.id); controller.roll(); controller.chooseNode('blue-approach');
  const view = controller.view();
  assert.equal(view.ui.feedbackPhase, 'combat-choice');
  assert.deepEqual(new Set(view.ui.legalNextNodes), new Set(['center', 'north-crossing', 'south-crossing']));
  assert.throws(() => controller.roll(), /combat advance choice is pending/);
});

test('clicking a legal pending combat node resolves consequence then changes turn', () => {
  const controller = createBrowserController({ random: () => 0.6 });
  const match = controller.debugMatch(); const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'blue-king'; blue.attributes = { strength: 3, defense: 1 };
  red.status = 'route'; red.nodeId = 'blue-approach'; red.attributes = { strength: 1, defense: 1 };
  controller.selectCharacter(blue.id); controller.roll(); controller.chooseNode('blue-approach');
  const resolved = controller.chooseNode('center');
  assert.equal(resolved.ui.activeTeam, 'red'); assert.equal(resolved.ui.feedbackPhase, 'turn-changed');
  assert.equal(controller.debugMatch().game.pendingCombatAdvance, undefined);
});
