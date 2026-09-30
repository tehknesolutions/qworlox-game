import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';

test('defender winning combat can advance onto enemy king and end game under defender team authority', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0];
  const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'red-king'; blue.attributes = { strength: 1, defense: 1 };
  red.status = 'route'; red.nodeId = 'red-approach'; red.attributes = { strength: 6, defense: 6 };

  const ended = playTurn(match, {
    characterId: blue.id,
    roll: 1,
    choices: ['red-approach'],
    combatDie: 1,
    combatChoice: 'blue-king'
  });

  assert.equal(ended.game.teams.red.characters[0].nodeId, 'blue-king');
  assert.equal(ended.game.winner, 'red');
  assert.equal(ended.game.teams.red.characters[0].status, 'goal');
  const king = ended.game.events.findLast(event => event.type === 'KING_REACHED');
  assert.equal(king.team, 'red');
  assert.equal(king.characterId, red.id);
  assert.equal(ended.game.pendingCombatAdvance, undefined);
  assert.throws(() => playTurn(ended, { characterId: red.id, roll: 1 }), /game is already complete/);
});
