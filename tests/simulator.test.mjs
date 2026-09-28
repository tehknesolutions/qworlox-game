import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateMatch, simulateBatch } from '../simulation/simulator.mjs';

test('same seed reproduces an identical complete match', () => {
  const a = simulateMatch({ routeLength: 18, seed: 4242 });
  const b = simulateMatch({ routeLength: 18, seed: 4242 });
  assert.deepEqual(a, b);
  assert.ok(['blue', 'red'].includes(a.winner));
  assert.ok(a.turns > 0);
});

test('batch simulation completes requested number of matches', () => {
  const report = simulateBatch({ routeLength: 18, seed: 9001, matches: 100 });
  assert.equal(report.matches, 100);
  assert.equal(report.blueWins + report.redWins, 100);
  assert.ok(report.averageTurns > 0);
  assert.ok(report.noChoiceTurns >= 0);
});

test('same batch seed reproduces identical aggregate metrics', () => {
  const a = simulateBatch({ routeLength: 36, seed: 123456, matches: 64 });
  const b = simulateBatch({ routeLength: 36, seed: 123456, matches: 64 });
  assert.deepEqual(a, b);
});

test('18, 36 and 72 candidates can run under the same simulator', () => {
  for (const routeLength of [18, 36, 72]) {
    const report = simulateBatch({ routeLength, seed: 72, matches: 16 });
    assert.equal(report.routeLength, routeLength);
    assert.equal(report.matches, 16);
  }
});
