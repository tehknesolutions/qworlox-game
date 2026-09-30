import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPlayableHTML } from '../game/ui/playable-ui-render.mjs';

test('pending combat advance has explicit instruction and distinct legal-node marker', () => {
  const html = renderPlayableHTML({
    activeTeam: 'blue', winner: null, interactionLocked: false, feedbackPhase: 'combat-choice',
    pendingCombatAdvance: { winnerId: 'blue-1', legalChoices: ['center'] }, legalNextNodes: ['center'],
    selectedCharacterId: null, lastRoll: 4, remainingSteps: 0, nodes: [{ id: 'center', region: 'CENTER' }], pieces: [], matchLog: []
  });
  assert.match(html, /COMBAT WON — CHOOSE ADVANCE/);
  assert.match(html, /data-combat-advance-choice="true"/);
  assert.match(html, /data-action="roll" disabled/);
});
