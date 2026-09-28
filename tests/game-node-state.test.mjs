import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';

test('characters expose canonical nodeId after release and movement', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'blue-entry');

  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 4 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'blue-4');
});

test('the midpoint is represented by the shared center node', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 9 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'center');
});
