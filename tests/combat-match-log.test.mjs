import test from 'node:test';
import assert from 'node:assert/strict';
import { combatLogEntry } from '../game/ui/combat-log.mjs';

test('combat log summarizes winner and arithmetic totals', () => {
  assert.equal(combatLogEntry({ attackerId: 'blue-1', defenderId: 'red-1', attackerValue: 9, defenderValue: 8, winnerId: 'blue-1', draw: false }), 'COMBAT BLUE-1 9 vs RED-1 8 — BLUE-1 WINS');
});

test('combat log summarizes draw without inventing winner', () => {
  assert.equal(combatLogEntry({ attackerId: 'blue-1', defenderId: 'red-1', attackerValue: 8, defenderValue: 8, winnerId: null, draw: true }), 'COMBAT BLUE-1 8 vs RED-1 8 — DRAW');
});
