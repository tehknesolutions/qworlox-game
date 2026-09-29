import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';
import { renderPlayableHTML } from '../game/ui/playable-ui-render.mjs';

test('rendered UI contains board, turn panel and roll control', () => {
  const html = renderPlayableHTML(projectPlayableUI(createPlayableMatch()));

  assert.match(html, /data-qworlox-board/);
  assert.match(html, /Turn: BLUE/);
  assert.match(html, /data-action="roll"/);
});

test('player-facing HUD exposes active player, action state and die result hooks', () => {
  const ui = projectPlayableUI(createPlayableMatch(), { selectedCharacterId: 'blue-1' });
  ui.lastRoll = 6;
  ui.feedbackPhase = 'selected';
  const html = renderPlayableHTML(ui);

  assert.match(html, /data-player-hud/);
  assert.match(html, /data-active-team="blue"/);
  assert.match(html, /data-turn-status/);
  assert.match(html, /data-die-result="6"/);
  assert.match(html, /data-selected-piece="blue-1"/);
  assert.match(html, /data-action-state="selected"/);
});

test('rendered board exposes both Kings and contested center', () => {
  const html = renderPlayableHTML(projectPlayableUI(createPlayableMatch()));

  assert.match(html, /data-node-id="blue-king"/);
  assert.match(html, /data-node-id="center"/);
  assert.match(html, /data-node-id="red-king"/);
  assert.match(html, /CONTESTED CENTER/);
});

test('legal graph choices are rendered as actionable nodes only', () => {
  const match = createPlayableMatch();
  match.game.teams.blue.characters[0].status = 'route';
  match.game.teams.blue.characters[0].nodeId = 'blue-approach';
  const ui = projectPlayableUI(match, { selectedCharacterId: 'blue-1' });
  const html = renderPlayableHTML(ui);

  assert.match(html, /data-node-id="north-crossing"[^>]*data-legal-choice="true"/);
  assert.match(html, /data-node-id="south-crossing"[^>]*data-legal-choice="true"/);
  assert.doesNotMatch(html, /data-node-id="red-approach"[^>]*data-legal-choice="true"/);
});

test('terminal UI announces winner and replaces normal turn affordance', () => {
  const match = createPlayableMatch();
  match.game.winner = 'blue';
  match.game.victory = { winner: 'blue', characterId: 'blue-1', kingNodeId: 'red-king' };
  const html = renderPlayableHTML(projectPlayableUI(match));

  assert.match(html, /KING REACHED — BLUE WINS/);
  assert.match(html, /data-victory-state="blue"/);
  assert.match(html, /data-action="roll" disabled/);
});
