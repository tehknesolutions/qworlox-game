import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

function rigPiece(controller, team, id, nodeId) {
  const piece = controller.debugMatch().game.teams[team].characters.find(item => item.id === id);
  piece.status = 'route';
  piece.nodeId = nodeId;
}

test('a deterministic Blue vs Red match can reach the enemy King and lock forever', () => {
  const rolls = [0.99, 0.99, 0.2, 0.2, 0.0]; // 6, 6, 2, 2, 1
  const controller = createBrowserController({ random: () => rolls.shift() ?? 0 });

  controller.selectCharacter('blue-1');
  let state = controller.roll();
  assert.equal(state.ui.activeTeam, 'red');
  assert.equal(state.ui.pieces.find(p => p.id === 'blue-1').nodeId, 'blue-king');

  controller.selectCharacter('red-1');
  state = controller.roll();
  assert.equal(state.ui.activeTeam, 'blue');
  assert.equal(state.ui.pieces.find(p => p.id === 'red-1').nodeId, 'red-king');

  rigPiece(controller, 'blue', 'blue-1', 'blue-approach');
  controller.selectCharacter('blue-1');
  controller.roll();
  controller.chooseNode('north-crossing');
  state = controller.chooseNode('center');
  assert.equal(state.ui.activeTeam, 'red');

  rigPiece(controller, 'red', 'red-1', 'red-approach');
  controller.selectCharacter('red-1');
  controller.roll();
  controller.chooseNode('south-crossing');
  state = controller.chooseNode('center');
  assert.equal(state.ui.activeTeam, 'blue');

  rigPiece(controller, 'blue', 'blue-1', 'red-approach');
  controller.selectCharacter('blue-1');
  controller.roll();
  state = controller.chooseNode('red-king');

  assert.equal(state.ui.winner, 'blue');
  assert.equal(state.ui.feedbackPhase, 'victory');
  assert.equal(state.ui.interactionLocked, true);
  assert.match(state.html, /KING REACHED — BLUE WINS/);

  const terminalSnapshot = JSON.stringify(controller.debugMatch().game);
  assert.throws(() => controller.selectCharacter('blue-1'), /complete/);
  assert.throws(() => controller.roll(), /select a character/);
  assert.equal(JSON.stringify(controller.debugMatch().game), terminalSnapshot);
});

test('illegal route choice is rejected without mutating the match', () => {
  const controller = createBrowserController({ random: () => 0 });
  rigPiece(controller, 'blue', 'blue-1', 'blue-approach');
  controller.selectCharacter('blue-1');
  controller.roll();
  const before = JSON.stringify(controller.debugMatch().game);

  assert.throws(() => controller.chooseNode('red-king'), /illegal graph move/);
  assert.equal(JSON.stringify(controller.debugMatch().game), before);
});

test('presentation exposes a chronological match log', () => {
  const controller = createBrowserController({ random: () => 0.99 });
  controller.selectCharacter('blue-1');
  const state = controller.roll();

  assert.ok(Array.isArray(state.ui.matchLog));
  assert.ok(state.ui.matchLog.some(entry => /BLUE-1.*rolled 6/i.test(entry)));
  assert.ok(state.ui.matchLog.some(entry => /Turn RED/i.test(entry)));
  assert.match(state.html, /data-match-log/);
});
