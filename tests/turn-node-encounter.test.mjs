import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';
import { resolveTurnWithEncounter } from '../game/core/turn.mjs';

test('turn resolution detects encounter from canonical nodeId at center', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 9 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 9 });

  assert.equal(game.teams.blue.characters[0].nodeId, 'center');
  assert.equal(game.teams.red.characters[0].nodeId, 'center');

  const result = resolveTurnWithEncounter(game, {
    characterId: 'blue-1',
    roll: 1,
    combat: { commonDie: 6, attackerExclusiveDie: 2, defenderExclusiveDie: 1 }
  });

  assert.equal(result.encounter.type, 'ENCOUNTER');
});
