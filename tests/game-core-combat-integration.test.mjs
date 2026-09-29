import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, moveCharacter } from '../game/core/game.mjs';
import { resolveTurnWithEncounter } from '../game/core/turn.mjs';

function placeOnRoute(game, team, characterIndex, { position, nodeId }) {
  const character = game.teams[team].characters[characterIndex];
  character.status = 'route';
  character.position = position;
  character.nodeId = nodeId;
}

test('Game Core moves into the shared center node and resolves combat', () => {
  const game = createGame({ routeLength: 18 });
  placeOnRoute(game, 'blue', 0, { position: 8, nodeId: 'blue-8' });
  placeOnRoute(game, 'red', 0, { position: 9, nodeId: 'center' });
  game.activeTeam = 'blue';

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
  assert.equal(result.encounter.nodeId, 'center');
  assert.equal(result.combat.winnerId, 'blue-1');
  assert.equal(result.game.teams.blue.characters[0].position, 10);
});

test('encounter consequence preserves characters still in base', () => {
  const game = createGame({ routeLength: 18 });
  placeOnRoute(game, 'blue', 0, { position: 8, nodeId: 'blue-8' });
  placeOnRoute(game, 'red', 0, { position: 9, nodeId: 'center' });
  game.activeTeam = 'blue';

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
