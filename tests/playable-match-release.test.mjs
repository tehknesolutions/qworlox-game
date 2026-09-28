import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';

test('blue releases from base onto its King/start node with a six', () => {
  const match = playTurn(createPlayableMatch(), {
    characterId: 'blue-1',
    roll: 6
  });

  const character = match.game.teams.blue.characters[0];
  assert.equal(character.status, 'route');
  assert.equal(character.nodeId, 'blue-king');
  assert.equal(match.game.activeTeam, 'red');
  assert.equal(match.game.winner, null);
  assert.deepEqual(match.game.events.slice(-3).map(event => event.type), ['ROLL', 'MOVE', 'LAND']);
  assert.equal(match.game.events.at(-2).fromNodeId, null);
  assert.equal(match.game.events.at(-2).toNodeId, 'blue-king');
});

test('red releases symmetrically onto its King/start node with a six', () => {
  const match = createPlayableMatch();
  match.game.activeTeam = 'red';

  const next = playTurn(match, { characterId: 'red-1', roll: 6 });
  assert.equal(next.game.teams.red.characters[0].nodeId, 'red-king');
  assert.equal(next.game.activeTeam, 'blue');
});

test('a base character cannot enter the board without the release roll', () => {
  assert.throws(
    () => playTurn(createPlayableMatch(), { characterId: 'blue-1', roll: 5 }),
    /requires a 6 to leave base/
  );
});

test('release onto your own King never counts as King Reach victory', () => {
  const match = playTurn(createPlayableMatch(), { characterId: 'blue-1', roll: 6 });

  assert.equal(match.game.winner, null);
  assert.equal(match.game.victory, null);
  assert.equal(match.game.events.some(event => event.type === 'KING_REACHED'), false);
});
