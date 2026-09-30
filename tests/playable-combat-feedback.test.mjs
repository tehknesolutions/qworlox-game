import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';
import { renderPlayableHTML } from '../game/ui/playable-ui-render.mjs';

test('latest encounter pipeline is projected and rendered as player-facing combat feedback', () => {
  const match = createPlayableMatch();
  match.game.events.push(
    { seq: 1, type: 'ENCOUNTER', nodeId: 'crossing-west', attackerId: 'blue-1', defenderId: 'red-1' },
    { seq: 2, type: 'COMBAT_RESOLVED', attackerId: 'blue-1', defenderId: 'red-1', attackerValue: 7, defenderValue: 5, draw: false, winnerId: 'blue-1', loserId: 'red-1' },
    { seq: 3, type: 'COMBAT_CONSEQUENCE', consequence: 'WINNER_ADVANCES_ONE', winnerId: 'blue-1', loserId: 'red-1' }
  );

  const ui = projectPlayableUI(match);
  assert.equal(ui.combatFeedback.winnerId, 'blue-1');
  assert.equal(ui.combatFeedback.consequence, 'WINNER_ADVANCES_ONE');
  const html = renderPlayableHTML(ui);
  assert.match(html, /data-combat-feedback/);
  assert.match(html, /BLUE-1 wins combat/);
  assert.match(html, /Winner advances one/);
});
