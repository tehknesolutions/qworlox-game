import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateMatchWithCombat, simulateBatchWithCombat } from '../simulation/simulator-combat.mjs';

test('combat-aware match is deterministic for the same seed', () => {
  const a = simulateMatchWithCombat({ routeLength: 18, seed: 4242 });
  const b = simulateMatchWithCombat({ routeLength: 18, seed: 4242 });
  assert.deepEqual(a, b);
  assert.ok(['blue', 'red'].includes(a.winner));
  assert.ok(a.encounters >= 0);
  assert.ok(a.combats >= 0);
});

test('combat-aware batch reports encounter and combat metrics', () => {
  const report = simulateBatchWithCombat({ routeLength: 18, seed: 9001, matches: 100 });
  assert.equal(report.matches, 100);
  assert.equal(report.blueWins + report.redWins, 100);
  assert.ok(report.encounters >= report.combats);
  assert.ok(report.averageTurns > 0);
  assert.ok(report.draws >= 0);
});

test('18, 36 and 72 candidates remain executable with combat enabled', () => {
  for (const routeLength of [18, 36, 72]) {
    const report = simulateBatchWithCombat({ routeLength, seed: 72, matches: 16 });
    assert.equal(report.routeLength, routeLength);
    assert.equal(report.matches, 16);
  }
});
