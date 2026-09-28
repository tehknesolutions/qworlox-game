import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';
import { renderPlayableHTML } from '../game/ui/playable-ui-render.mjs';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('controller exposes a roll feedback phase after rolling', () => {
  const controller = createBrowserController({ random: () => 0.2 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';

  controller.selectCharacter('blue-1');
  const rolled = controller.roll();

  assert.equal(rolled.ui.feedbackPhase, 'rolled');
  assert.equal(rolled.ui.lastRoll, 2);
});

test('pending movement exposes current piece node and next legal choices', () => {
  const controller = createBrowserController({ random: () => 0.2 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';

  controller.selectCharacter('blue-1');
  controller.roll();
  const moved = controller.chooseNode('north-crossing');

  assert.equal(moved.ui.feedbackPhase, 'moving');
  assert.equal(moved.ui.currentMoveNodeId, 'north-crossing');
  assert.equal(moved.ui.remainingSteps, 1);
  assert.ok(moved.ui.legalNextNodes.includes('center'));
});

test('completed movement exposes a turn-change feedback state', () => {
  const controller = createBrowserController({ random: () => 0.2 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';

  controller.selectCharacter('blue-1');
  controller.roll();
  controller.chooseNode('north-crossing');
  const completed = controller.chooseNode('center');

  assert.equal(completed.ui.feedbackPhase, 'turn-changed');
  assert.equal(completed.ui.activeTeam, 'red');
});

test('renderer marks feedback phase and current movement node', () => {
  const ui = projectPlayableUI(createPlayableMatch());
  ui.feedbackPhase = 'moving';
  ui.currentMoveNodeId = 'center';
  const html = renderPlayableHTML(ui);

  assert.match(html, /data-feedback-phase="moving"/);
  assert.match(html, /data-node-id="center"[^>]*data-current-move="true"/);
});

test('terminal feedback phase remains victorious and locked', () => {
  const match = createPlayableMatch();
  match.game.winner = 'blue';
  match.game.victory = { winner: 'blue', characterId: 'blue-1', kingNodeId: 'red-king' };
  const ui = projectPlayableUI(match);
  ui.feedbackPhase = 'victory';
  const html = renderPlayableHTML(ui);

  assert.equal(ui.interactionLocked, true);
  assert.match(html, /data-feedback-phase="victory"/);
  assert.match(html, /KING REACHED — BLUE WINS/);
});
