import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';

test('combat victory records consequence before KING_REACHED and locks the game', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0];
  const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'red-approach'; blue.attributes = { strength: 5, defense: 5 };
  red.status = 'route'; red.nodeId = 'red-king'; red.attributes = { strength: 1, defense: 1 };
  const won = playTurn(match, { characterId: blue.id, roll: 1, choices: ['red-king'], combatDie: 6, combatChoice: 'red-approach' });
  const types = won.game.events.map(event => event.type);
  assert.ok(types.indexOf('ENCOUNTER') < types.indexOf('COMBAT_RESOLVED'));
  assert.ok(types.indexOf('COMBAT_RESOLVED') < types.indexOf('COMBAT_CONSEQUENCE'));
  assert.ok(types.indexOf('COMBAT_CONSEQUENCE') < types.indexOf('KING_REACHED'));
  assert.equal(won.game.winner, 'blue');
  assert.throws(() => playTurn(won, { characterId: blue.id, roll: 1 }), /game is already complete/);
});

test('draw emits IMPASSE, does not create pending choice, and advances normal turn', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0]; const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'center'; blue.attributes = { strength: 2, defense: 2 };
  red.status = 'route'; red.nodeId = 'red-approach'; red.attributes = { strength: 2, defense: 2 };
  const next = playTurn(match, { characterId: blue.id, roll: 1, choices: ['red-approach'], combatDie: 3 });
  const consequence = next.game.events.findLast(event => event.type === 'COMBAT_CONSEQUENCE');
  assert.equal(consequence.consequence, 'IMPASSE');
  assert.equal(next.game.pendingCombatAdvance, undefined);
  assert.equal(next.game.activeTeam, 'red');
  assert.equal(next.game.winner, null);
});
