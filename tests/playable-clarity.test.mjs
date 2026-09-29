import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';
import { renderPlayableHTML } from '../game/ui/playable-ui-render.mjs';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('base characters remain visible in team reserves', () => {
  const ui = projectPlayableUI(createPlayableMatch());
  const html = renderPlayableHTML(ui);

  assert.match(html, /data-reserve-team="blue"/);
  assert.match(html, /data-reserve-team="red"/);
  assert.match(html, /data-character-id="blue-1"/);
  assert.match(html, /data-character-id="red-1"/);
});

test('selected character is visually explicit', () => {
  const match = createPlayableMatch();
  const html = renderPlayableHTML(projectPlayableUI(match, { selectedCharacterId: 'blue-1' }));

  assert.match(html, /data-character-id="blue-1"[^>]*data-selected="true"/);
});

test('controller exposes last roll and remaining steps to presentation', () => {
  const controller = createBrowserController({ random: () => 0.2 });
  const match = controller.debugMatch();
  const piece = match.game.teams.blue.characters[0];
  piece.status = 'route';
  piece.nodeId = 'blue-approach';

  controller.selectCharacter('blue-1');
  const rolled = controller.roll();
  assert.equal(rolled.roll, 2);
  assert.equal(rolled.pendingSteps, 2);
  assert.equal(rolled.ui.lastRoll, 2);
  assert.equal(rolled.ui.remainingSteps, 2);

  const moved = controller.chooseNode('north-crossing');
  assert.equal(moved.ui.lastRoll, 2);
  assert.equal(moved.ui.remainingSteps, 1);
});

test('rendered HUD shows die result and remaining movement when present', () => {
  const ui = projectPlayableUI(createPlayableMatch());
  ui.lastRoll = 4;
  ui.remainingSteps = 2;
  const html = renderPlayableHTML(ui);

  assert.match(html, /data-die-result="4"/);
  assert.match(html, /<strong>4<\/strong>/);
  assert.match(html, /Steps: 2/);
});

test('board renders a route layer for visual path connections', () => {
  const html = renderPlayableHTML(projectPlayableUI(createPlayableMatch()));
  assert.match(html, /data-route-layer/);
});
