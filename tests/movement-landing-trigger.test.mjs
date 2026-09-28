import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLandingTrigger } from '../game/core/game.mjs';

test('landing on a trigger node exposes its explicit trigger', () => {
  const graph = {
    nodes: new Map([
      ['blue-1', { id: 'blue-1', trigger: { type: 'DRAW_CARD' } }]
    ])
  };

  assert.deepEqual(resolveLandingTrigger(graph, 'blue-1'), { type: 'DRAW_CARD' });
});

test('landing on an ordinary node exposes no trigger', () => {
  const graph = {
    nodes: new Map([
      ['blue-2', { id: 'blue-2', trigger: null }]
    ])
  };

  assert.equal(resolveLandingTrigger(graph, 'blue-2'), null);
});

test('unknown landing node fails explicitly', () => {
  const graph = { nodes: new Map() };
  assert.throws(() => resolveLandingTrigger(graph, 'missing'), /unknown landing node/);
});
