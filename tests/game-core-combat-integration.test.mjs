import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';
import { resolveTurnWithEncounter } from '../game/core/turn.mjs';

test('Game Core can move into an occupied contested node and resolve combat', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 1 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 2 });

  const result = resolveTurnWithEncounter(game, {
    characterId: 'blue-1',
    roll: 1,
    combat: {
      commonDie: 6,
      attackerExclusiveDie: 2,
      defenderExclusiveDie: 1,
      attackerModifiers: { card: 1 },
      defenderModifiers: {}
    }
  });

  assert.equal(result.encounter.type, 'ENCOUNTER');
  assert.equal(result.combat.winnerId, 'blue-1');
  assert.equal(result.game.teams.blue.characters[0].position, 3);
});

test('encounter consequence preserves characters still in base', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 1 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 2 });

  const result = resolveTurnWithEncounter(game, {
    characterId: 'blue-1',
    roll: 1,
    combat: { commonDie: 6, attackerExclusiveDie: 2, defenderExclusiveDie: 1 }
  });

  assert.deepEqual(result.game.teams.blue.characters[1], {
    id: 'blue-2', status: 'base', position: null, nodeId: null
  });
  assert.deepEqual(result.game.teams.red.characters[1], {
    id: 'red-2', status: 'base', position: null, nodeId: null
  });
});

test('a turn without an encounter still returns a valid game state', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  const result = resolveTurnWithEncounter(game, { characterId: 'blue-1', roll: 2 });
  assert.equal(result.encounter, null);
  assert.equal(result.game.teams.blue.characters[0].position, 2);
});
