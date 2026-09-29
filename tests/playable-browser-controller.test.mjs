import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('controller starts from canonical playable match and renders BLUE active player', () => {
  const controller = createBrowserController({ random: () => 0.99 });
  const view = controller.view();

  assert.equal(view.ui.activeTeam, 'blue');
  assert.match(view.html, /data-active-team="blue"/);
  assert.match(view.html, /data-turn-status>BLUE/);
});

test('selecting an active-team piece is reflected in UI projection', () => {
  const controller = createBrowserController({ random: () => 0.99 });
  controller.selectCharacter('blue-1');

  assert.equal(controller.view().ui.selectedCharacterId, 'blue-1');
});

test('rolling a six releases selected base piece and rerenders RED active player', () => {
  const controller = createBrowserController({ random: () => 0.99 });
  controller.selectCharacter('blue-1');
  const result = controller.roll();

  assert.equal(result.roll, 6);
  assert.equal(result.ui.pieces.find(piece => piece.id === 'blue-1').nodeId, 'blue-king');
  assert.equal(result.ui.activeTeam, 'red');
  assert.match(result.html, /data-active-team="red"/);
  assert.match(result.html, /data-turn-status>RED/);
});

test('controller rejects selecting opponent piece', () => {
  const controller = createBrowserController();
  assert.throws(() => controller.selectCharacter('red-1'), /active team/);
});

test('controller accumulates graph choices for a rolled route move then commits turn', () => {
  const controller = createBrowserController({ random: () => 0.2 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';

  controller.selectCharacter('blue-1');
  const pending = controller.roll();
  assert.equal(pending.roll, 2);
  assert.equal(pending.pendingSteps, 2);

  controller.chooseNode('north-crossing');
  const completed = controller.chooseNode('center');

  assert.equal(completed.pendingSteps, 0);
  assert.equal(completed.ui.pieces.find(item => item.id === 'blue-1').nodeId, 'center');
  assert.equal(completed.ui.activeTeam, 'red');
});
