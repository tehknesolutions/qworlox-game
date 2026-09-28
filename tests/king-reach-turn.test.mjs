import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, resolveTurn } from '../game/core/game.mjs';

function graphForKingReach() {
  return {
    nodes: new Map([
      ['red-goal', { id: 'red-goal', trigger: null, objective: { type: 'KING', team: 'red' } }],
      ['blue-goal', { id: 'blue-goal', trigger: null, objective: { type: 'KING', team: 'blue' } }]
    ]),
    kingObjectives: {
      blue: 'blue-goal',
      red: 'red-goal'
    }
  };
}

function blueOneStepFromRedKing() {
  const game = createGame({ routeLength: 4 });
  const blue = game.teams.blue.characters[0];
  blue.status = 'route';
  blue.position = 3;
  blue.nodeId = 'red-1';
  return game;
}

test('LAND on the opposing King ends the match for the moving team', () => {
  const result = resolveTurn(
    blueOneStepFromRedKing(),
    graphForKingReach(),
    { characterId: 'blue-1', roll: 1 }
  );

  assert.equal(result.nodeId, 'red-goal');
  assert.equal(result.game.winner, 'blue');
  assert.deepEqual(result.game.victory, {
    winner: 'blue',
    characterId: 'blue-1',
    kingNodeId: 'red-goal'
  });
});

test('ordinary LAND does not produce King Reach victory', () => {
  const game = createGame({ routeLength: 4 });
  const graph = {
    nodes: new Map([['blue-entry', { id: 'blue-entry', trigger: null }]]),
    kingObjectives: { blue: 'blue-goal', red: 'red-goal' }
  };

  const result = resolveTurn(game, graph, { characterId: 'blue-1', roll: 6 });

  assert.equal(result.nodeId, 'blue-entry');
  assert.equal(result.game.winner, null);
  assert.equal(result.game.victory, null);
});

test('normal turns are rejected after King Reach victory', () => {
  const won = resolveTurn(
    blueOneStepFromRedKing(),
    graphForKingReach(),
    { characterId: 'blue-1', roll: 1 }
  ).game;

  assert.throws(
    () => resolveTurn(won, graphForKingReach(), { characterId: 'red-1', roll: 6 }),
    /game is already complete/
  );
});
