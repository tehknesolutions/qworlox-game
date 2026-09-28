import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateKingReach } from '../game/core/victory.mjs';

const graph = {
  kingObjectives: {
    blue: 'blue-king',
    red: 'red-king'
  }
};

test('blue wins by reaching the opposing red King', () => {
  assert.deepEqual(evaluateKingReach({
    graph,
    team: 'blue',
    characterId: 'blue-1',
    nodeId: 'red-king'
  }), {
    winner: 'blue',
    characterId: 'blue-1',
    kingNodeId: 'red-king'
  });
});

test('red wins by reaching the opposing blue King', () => {
  assert.deepEqual(evaluateKingReach({
    graph,
    team: 'red',
    characterId: 'red-1',
    nodeId: 'blue-king'
  }), {
    winner: 'red',
    characterId: 'red-1',
    kingNodeId: 'blue-king'
  });
});

test('reaching your own King is not victory', () => {
  assert.equal(evaluateKingReach({
    graph,
    team: 'blue',
    characterId: 'blue-1',
    nodeId: 'blue-king'
  }), null);
});

test('reaching an ordinary node is not victory', () => {
  assert.equal(evaluateKingReach({
    graph,
    team: 'blue',
    characterId: 'blue-1',
    nodeId: 'center'
  }), null);
});

test('victory evaluation rejects unknown teams', () => {
  assert.throws(() => evaluateKingReach({
    graph,
    team: 'green',
    characterId: 'green-1',
    nodeId: 'red-king'
  }), /unknown team: green/);
});
