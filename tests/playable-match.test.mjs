import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';
import { replayEvents } from '../game/core/replay.mjs';

function placeCharacter(match, team, characterId, nodeId) {
  const character = match.game.teams[team].characters.find(item => item.id === characterId);
  character.status = 'route';
  character.nodeId = nodeId;
}

test('a deterministic playable match reaches the opposing King through graph-native movement', () => {
  let match = createPlayableMatch();

  assert.equal(match.game.activeTeam, 'blue');
  assert.equal(match.game.winner, null);
  assert.equal(match.graph.kingObjectives.red, 'red-king');

  placeCharacter(match, 'blue', 'blue-1', 'red-approach');
  match = playTurn(match, { characterId: 'blue-1', roll: 1, choices: ['red-king'] });

  assert.equal(match.game.teams.blue.characters[0].nodeId, 'red-king');
  assert.equal(match.game.winner, 'blue');
  assert.equal(match.game.victory.kingNodeId, 'red-king');
  assert.deepEqual(match.game.events.slice(-4).map(event => event.type), [
    'ROLL', 'MOVE', 'LAND', 'KING_REACHED'
  ]);
});

test('a branch choice is consumed by the Board Graph rather than a legacy path', () => {
  let match = createPlayableMatch();
  placeCharacter(match, 'blue', 'blue-1', 'blue-approach');

  match = playTurn(match, {
    characterId: 'blue-1',
    roll: 2,
    choices: ['north-crossing', 'center']
  });

  assert.equal(match.game.teams.blue.characters[0].nodeId, 'center');
  assert.equal(match.game.winner, null);
  assert.equal(match.game.activeTeam, 'red');
});

test('playable match rejects a non-edge movement choice', () => {
  const match = createPlayableMatch();
  placeCharacter(match, 'blue', 'blue-1', 'blue-approach');

  assert.throws(() => playTurn(match, {
    characterId: 'blue-1',
    roll: 1,
    choices: ['red-approach']
  }), /illegal graph move/);
});

test('completed graph-native match replays to the same winner', () => {
  let match = createPlayableMatch();
  placeCharacter(match, 'blue', 'blue-1', 'red-approach');
  match = playTurn(match, { characterId: 'blue-1', roll: 1, choices: ['red-king'] });

  const replayed = replayEvents(match.game.events);
  assert.equal(replayed.winner, match.game.winner);
  assert.deepEqual(replayed.victory, match.game.victory);
  assert.equal(replayed.characters['blue-1'].nodeId, 'red-king');
});

test('playTurn rejects all gameplay after terminal victory', () => {
  let match = createPlayableMatch();
  placeCharacter(match, 'blue', 'blue-1', 'red-approach');
  match = playTurn(match, { characterId: 'blue-1', roll: 1, choices: ['red-king'] });

  assert.throws(
    () => playTurn(match, { characterId: 'red-1', roll: 1, choices: ['red-approach'] }),
    /game is already complete/
  );
});
