import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';
import { territoryAtNode } from '../game/board/territory-state.mjs';

test('Game Core exposes territory at a character node after movement', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'blue-entry');
  const territory = territoryAtNode(game.territory, game.teams.blue.characters[0].nodeId);
  assert.equal(territory.type, 'ENTRY');
  assert.equal(territory.controller, 'blue');
});

test('center is neutral when a character reaches it', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 4 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 5 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'center');
  assert.equal(territoryAtNode(game.territory, game.teams.blue.characters[0].nodeId).controller, null);
});
