import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';
import { resolveTurnWithEncounter } from '../game/core/turn.mjs';

test('turn resolution detects encounter from canonical nodeId at center', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });

  for (const roll of [3, 3]) {
    game = moveCharacter(game, { characterId: 'blue-1', roll });
    game = moveCharacter(game, { characterId: 'red-1', roll });
  }

  game = moveCharacter(game, { characterId: 'blue-1', roll: 3 });
  assert.equal(game.teams.blue.characters[0].nodeId, 'center');
  assert.equal(game.teams.red.characters[0].nodeId, 'red-6');

  const result = resolveTurnWithEncounter(game, {
    characterId: 'red-1',
    roll: 3,
    combat: { commonDie: 6, attackerExclusiveDie: 2, defenderExclusiveDie: 1 }
  });

  assert.equal(result.encounter.type, 'ENCOUNTER');
  assert.equal(result.encounter.nodeId, 'center');
  assert.equal(result.encounter.attackerId, 'red-1');
  assert.equal(result.encounter.defenderId, 'blue-1');
  assert.ok(result.combat);
});
