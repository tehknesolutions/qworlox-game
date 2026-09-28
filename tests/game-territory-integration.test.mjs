import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';

test('Game Core exposes territory at a character node after movement', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'blue-entry');
  assert.equal(game.territory.atNode.type, 'ENTRY');
  assert.equal(game.territory.atNode.controller, 'blue');
});

test('center is neutral when a character reaches it', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 9 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'center');
  assert.equal(game.territory.atNode.controller, null);
});
