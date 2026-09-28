import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';
import { replayEvents } from '../game/core/replay.mjs';

function forceRouteCharacter(match, team, characterId, position) {
  const character = match.game.teams[team].characters.find(item => item.id === characterId);
  character.status = 'route';
  character.position = position;
  character.nodeId = match.paths[team][position];
}

test('a deterministic playable match can run through alternating turns to King Reach', () => {
  let match = createPlayableMatch();

  assert.equal(match.game.activeTeam, 'blue');
  assert.equal(match.game.winner, null);
  assert.equal(match.paths.blue.at(-1), 'red-king');
  assert.equal(match.paths.red.at(-1), 'blue-king');

  forceRouteCharacter(match, 'blue', 'blue-1', match.paths.blue.length - 2);
  forceRouteCharacter(match, 'red', 'red-1', 0);

  match = playTurn(match, { characterId: 'blue-1', roll: 1 });

  assert.equal(match.game.winner, 'blue');
  assert.equal(match.game.victory.kingNodeId, 'red-king');
  assert.deepEqual(match.game.events.slice(-4).map(event => event.type), [
    'ROLL', 'MOVE', 'LAND', 'KING_REACHED'
  ]);
});

test('non-winning turns alternate the active team', () => {
  let match = createPlayableMatch();
  forceRouteCharacter(match, 'blue', 'blue-1', 0);

  match = playTurn(match, { characterId: 'blue-1', roll: 1 });

  assert.equal(match.game.winner, null);
  assert.equal(match.game.activeTeam, 'red');
});

test('completed playable match replays to the same winner', () => {
  let match = createPlayableMatch();
  forceRouteCharacter(match, 'blue', 'blue-1', match.paths.blue.length - 2);

  match = playTurn(match, { characterId: 'blue-1', roll: 1 });
  const replayed = replayEvents(match.game.events);

  assert.equal(replayed.winner, match.game.winner);
  assert.deepEqual(replayed.victory, match.game.victory);
});

test('playTurn rejects all gameplay after terminal victory', () => {
  let match = createPlayableMatch();
  forceRouteCharacter(match, 'blue', 'blue-1', match.paths.blue.length - 2);
  match = playTurn(match, { characterId: 'blue-1', roll: 1 });

  assert.throws(
    () => playTurn(match, { characterId: 'red-1', roll: 6 }),
    /game is already complete/
  );
});
