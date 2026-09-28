import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('fresh game explains the objective and first action without external coaching', () => {
  const state = createBrowserController().view();
  assert.match(state.html, /data-playtest-guide/);
  assert.match(state.html, /Reach the enemy King before they reach yours/i);
  assert.match(state.html, /Select a BLUE character/i);
});

test('selected character changes contextual instruction to rolling the D6', () => {
  const controller = createBrowserController();
  const state = controller.selectCharacter('blue-1');
  assert.match(state.html, /Roll the D6/i);
});

test('pending movement tells the player to choose a highlighted route', () => {
  const controller = createBrowserController({ random: () => 0 });
  const piece = controller.debugMatch().game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';
  controller.selectCharacter('blue-1');
  const state = controller.roll();
  assert.match(state.html, /Choose a highlighted route/i);
});

test('victory replaces turn coaching with terminal King Reach messaging', () => {
  const controller = createBrowserController({ random: () => 0 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'red-approach';
  controller.selectCharacter('blue-1');
  controller.roll();
  const state = controller.chooseNode('red-king');
  assert.match(state.html, /KING REACHED/i);
  assert.doesNotMatch(state.html, /Select a BLUE character/i);
});
