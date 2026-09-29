import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng, rollD6 } from '../game/core/rng.mjs';
import { createGame, applyRoll, moveCharacter } from '../game/core/game.mjs';

test('seeded RNG reproduces the same d6 sequence', () => {
  const a = createRng(20260928);
  const b = createRng(20260928);
  const seqA = Array.from({ length: 12 }, () => rollD6(a));
  const seqB = Array.from({ length: 12 }, () => rollD6(b));
  assert.deepEqual(seqA, seqB);
  assert.ok(seqA.every(value => value >= 1 && value <= 6));
});

test('a character cannot leave base unless release roll is 6', () => {
  const game = createGame({ routeLength: 18 });
  assert.deepEqual(applyRoll(game, 5).legalCharacterIds, []);
  assert.deepEqual(applyRoll(game, 6).legalCharacterIds, ['blue-1', 'blue-2']);
});

test('release moves selected character to route position zero and changes turn', () => {
  const game = createGame({ routeLength: 18 });
  const released = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  assert.equal(released.teams.blue.characters[0].status, 'route');
  assert.equal(released.teams.blue.characters[0].position, 0);
  assert.equal(released.activeTeam, 'red');
});

test('an on-route character advances by the movement roll', () => {
  let game = createGame({ routeLength: 18 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 4 });
  assert.equal(game.teams.blue.characters[0].position, 4);
});

test('a team wins only after both characters reach goal', () => {
  let game = createGame({ routeLength: 4 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 6 });
  game = moveCharacter(game, { characterId: 'blue-1', roll: 4 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 1 });
  game = moveCharacter(game, { characterId: 'blue-2', roll: 6 });
  game = moveCharacter(game, { characterId: 'red-1', roll: 3 });
  game = moveCharacter(game, { characterId: 'blue-2', roll: 4 });
  assert.equal(game.winner, 'blue');
});
