import test from 'node:test';
import assert from 'node:assert/strict';
import { combatConsequenceSummary } from '../game/ui/combat-consequence-summary.mjs';

test('pending advance names winner and required choice', () => {
  assert.equal(combatConsequenceSummary({ consequence: 'WINNER_ADVANCE_PENDING', winnerId: 'blue-1', loserId: 'red-1' }), 'BLUE-1 won — choose an adjacent node to advance');
});

test('automatic advance names winner destination and loser outcome without inventing removal', () => {
  assert.equal(combatConsequenceSummary({ consequence: 'WINNER_ADVANCES_ONE', winnerId: 'blue-1', loserId: 'red-1', winnerNodeId: 'center' }), 'BLUE-1 won and advanced to center; RED-1 remains in place');
});

test('impasse explicitly says neither piece advances', () => {
  assert.equal(combatConsequenceSummary({ consequence: 'IMPASSE', winnerId: null, loserId: null }), 'Impasse — neither piece advances');
});
