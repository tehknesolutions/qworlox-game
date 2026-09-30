import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';

test('playable combat emits graph consequence and applies explicit winner advance', () => {
  const match = createPlayableMatch(); const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'center'; blue.attributes = { strength: 3, defense: 1 };
  red.status = 'route'; red.nodeId = 'red-approach'; red.attributes = { strength: 1, defense: 1 };
  const next = playTurn(match, { characterId: blue.id, roll: 1, choices: ['red-approach'], combatDie: 4, combatChoice: 'red-king' });
  const consequence = next.game.events.findLast(event => event.type === 'COMBAT_CONSEQUENCE');
  assert.equal(consequence.consequence, 'WINNER_ADVANCES_ONE'); assert.equal(consequence.winnerNodeId, 'red-king');
  assert.equal(next.game.teams.blue.characters[0].nodeId, 'red-king'); assert.equal(next.game.winner, 'blue');
});

test('combat at graph fork remains pending and does not change active team', () => {
  const match = createPlayableMatch(); const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'blue-king'; blue.attributes = { strength: 3, defense: 1 };
  red.status = 'route'; red.nodeId = 'blue-approach'; red.attributes = { strength: 1, defense: 1 };
  const next = playTurn(match, { characterId: blue.id, roll: 1, choices: ['blue-approach'], combatDie: 4 });
  const consequence = next.game.events.findLast(event => event.type === 'COMBAT_CONSEQUENCE');
  assert.equal(consequence.consequence, 'WINNER_ADVANCE_PENDING'); assert.equal(consequence.requiresChoice, true);
  assert.deepEqual(new Set(consequence.legalChoices), new Set(['center', 'north-crossing', 'south-crossing']));
  assert.equal(next.game.activeTeam, 'blue'); assert.equal(next.game.pendingCombatAdvance.winnerId, blue.id);
});

test('playable turn does not emit combat events when landing node has no opponent', () => {
  const match = createPlayableMatch(); const blue = match.game.teams.blue.characters[0]; blue.status = 'route'; blue.nodeId = 'blue-approach'; blue.attributes = { strength: 3, defense: 1 };
  const next = playTurn(match, { characterId: blue.id, roll: 1, choices: ['center'], combatDie: 4 });
  assert.equal(next.game.events.some(event => event.type === 'ENCOUNTER'), false); assert.equal(next.game.events.some(event => event.type === 'COMBAT_RESOLVED'), false);
});
