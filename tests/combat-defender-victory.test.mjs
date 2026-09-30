import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch, playTurn, resolvePendingCombatAdvance } from '../game/core/playable-match.mjs';

test('defending combat winner keeps own team semantics when resolving pending advance', () => {
  const match = createPlayableMatch();
  const blue = match.game.teams.blue.characters[0];
  const red = match.game.teams.red.characters[0];
  blue.status = 'route'; blue.nodeId = 'blue-king'; blue.attributes = { strength: 1, defense: 1 };
  red.status = 'route'; red.nodeId = 'blue-approach'; red.attributes = { strength: 5, defense: 5 };
  const pending = playTurn(match, { characterId: blue.id, roll: 1, choices: ['blue-approach'], combatDie: 1 });
  assert.equal(pending.game.pendingCombatAdvance.winnerId, red.id);
  const resolved = resolvePendingCombatAdvance(pending, 'center');
  assert.equal(resolved.game.teams.red.characters[0].nodeId, 'center');
  assert.equal(resolved.game.activeTeam, 'red');
  assert.equal(resolved.game.winner, null);
});
