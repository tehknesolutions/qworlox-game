import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn } from '../game/core/playable-match.mjs';

test('playable turn emits encounter, combat and consequence when opposing pieces share landing node', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0];
  const red = match.game.teams.red.characters[0];

  blue.status = 'route';
  blue.nodeId = 'blue-approach';
  blue.attributes = { strength: 3, defense: 1 };
  red.status = 'route';
  red.nodeId = 'crossing-west';
  red.attributes = { strength: 1, defense: 1 };

  const next = playTurn(match, {
    characterId: blue.id,
    roll: 1,
    choices: ['crossing-west'],
    combatDie: 4
  });

  const turnEvents = next.game.events.slice(-6);
  assert.ok(turnEvents.some(event => event.type === 'ENCOUNTER' && event.attackerId === blue.id && event.defenderId === red.id));
  assert.ok(turnEvents.some(event => event.type === 'COMBAT_RESOLVED' && event.winnerId === blue.id));
  assert.ok(turnEvents.some(event => event.type === 'COMBAT_CONSEQUENCE' && event.consequence === 'WINNER_ADVANCES_ONE'));
});

test('playable turn does not emit combat events when landing node has no opponent', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0];
  blue.status = 'route';
  blue.nodeId = 'blue-approach';
  blue.attributes = { strength: 3, defense: 1 };

  const next = playTurn(match, { characterId: blue.id, roll: 1, choices: ['crossing-west'], combatDie: 4 });
  assert.equal(next.game.events.some(event => event.type === 'ENCOUNTER'), false);
  assert.equal(next.game.events.some(event => event.type === 'COMBAT_RESOLVED'), false);
});
