import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';

const board = {
  lanes: [{
    id: 'blue-lane',
    nodes: [
      { id: 'blue-entry', type: 'ENTRY' },
      { id: 'blue-1', type: 'LANE', trigger: { type: 'DRAW_CARD' } },
      { id: 'center', type: 'CENTER' }
    ]
  }]
};

test('board graph preserves an explicit physical node trigger descriptor', () => {
  const graph = buildBoardGraph(board);
  assert.deepEqual(graph.nodes.get('blue-1').trigger, { type: 'DRAW_CARD' });
});

test('ordinary board nodes remain trigger-free by default', () => {
  const graph = buildBoardGraph(board);
  assert.equal(graph.nodes.get('blue-entry').trigger, null);
  assert.equal(graph.nodes.get('center').trigger, null);
});

test('board topology rejects unknown trigger descriptors', () => {
  assert.throws(() => buildBoardGraph({
    lanes: [{ id: 'lane', nodes: [{ id: 'x', trigger: { type: 'AUTO_MAGIC' } }] }]
  }), /unknown board trigger/);
});
