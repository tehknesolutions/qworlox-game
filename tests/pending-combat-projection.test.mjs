import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';

test('UI projection exposes pending combat advance without browser-controller patching', () => {
  const match = createPlayableMatch();
  match.game.pendingCombatAdvance = { winnerId: 'blue-1', loserId: 'red-1', movedTeam: 'blue', legalChoices: ['center', 'north-crossing'] };
  const ui = projectPlayableUI(match);
  assert.deepEqual(ui.pendingCombatAdvance, match.game.pendingCombatAdvance);
  assert.deepEqual(ui.legalNextNodes, ['center', 'north-crossing']);
  assert.equal(ui.interactionLocked, false);
});
