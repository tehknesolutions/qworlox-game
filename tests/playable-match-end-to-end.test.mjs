import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';
import { replayEvents } from '../game/core/replay.mjs';
import { serializeEventLog, importReplayableEventLog } from '../game/core/event-log-format.mjs';

function turn(match, action) {
  return playTurn(match, action);
}

test('complete match runs from all characters in base to King Reach without state mutation shortcuts', () => {
  let match = createPlayableMatch();

  assert.ok(Object.values(match.game.teams).flatMap(team => team.characters).every(character => character.status === 'base'));

  match = turn(match, { characterId: 'blue-1', roll: 6 });
  assert.equal(match.game.teams.blue.characters[0].nodeId, 'blue-king');

  match = turn(match, { characterId: 'red-1', roll: 6 });
  assert.equal(match.game.teams.red.characters[0].nodeId, 'red-king');

  match = turn(match, {
    characterId: 'blue-1',
    roll: 5,
    choices: ['blue-approach', 'north-crossing', 'center', 'south-crossing', 'red-approach']
  });
  assert.equal(match.game.teams.blue.characters[0].nodeId, 'red-approach');

  match = turn(match, {
    characterId: 'red-1',
    roll: 1,
    choices: ['red-approach']
  });
  assert.equal(match.game.teams.red.characters[0].nodeId, 'red-approach');

  match = turn(match, {
    characterId: 'blue-1',
    roll: 1,
    choices: ['red-king']
  });

  assert.equal(match.game.winner, 'blue');
  assert.deepEqual(match.game.victory, {
    winner: 'blue',
    characterId: 'blue-1',
    kingNodeId: 'red-king'
  });
  assert.equal(match.game.events.at(-1).type, 'KING_REACHED');
});

test('zero-state complete match is deterministic through serialize/import/replay', () => {
  let match = createPlayableMatch();
  match = turn(match, { characterId: 'blue-1', roll: 6 });
  match = turn(match, { characterId: 'red-1', roll: 6 });
  match = turn(match, { characterId: 'blue-1', roll: 5, choices: ['blue-approach', 'south-crossing', 'center', 'north-crossing', 'red-approach'] });
  match = turn(match, { characterId: 'red-1', roll: 1, choices: ['red-approach'] });
  match = turn(match, { characterId: 'blue-1', roll: 1, choices: ['red-king'] });

  const directReplay = replayEvents(match.game.events);
  const imported = importReplayableEventLog(serializeEventLog(match.game.events));

  assert.equal(directReplay.winner, 'blue');
  assert.equal(imported.state.winner, 'blue');
  assert.deepEqual(imported.state.victory, match.game.victory);
  assert.equal(imported.state.characters['blue-1'].nodeId, 'red-king');
});
