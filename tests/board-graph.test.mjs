import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildBoardGraph, shortestPathLength } from '../game/board/graph.mjs';

const load = async name => JSON.parse(await readFile(new URL(`../game/boards/${name}.board.v1.json`, import.meta.url)));

for (const [name, length] of [['candidate-a-72', 72], ['candidate-b-36', 36], ['candidate-c-18', 18]]) {
  test(`${name} materializes two explicit forward lanes`, async () => {
    const graph = buildBoardGraph(await load(name));
    assert.equal(graph.nodes.size, length * 2);
    assert.equal(graph.forwardEdges.length, (length - 1) * 2);
    assert.equal(shortestPathLength(graph, 'b01', `b${String(length).padStart(2, '0')}`), length - 1);
    assert.equal(shortestPathLength(graph, 'r01', `r${String(length).padStart(2, '0')}`), length - 1);
  });

  test(`${name} preserves mirrored blue/red baseline geometry`, async () => {
    const graph = buildBoardGraph(await load(name));
    for (let index = 1; index <= length; index += 1) {
      const suffix = String(index).padStart(2, '0');
      assert.ok(graph.nodes.has(`b${suffix}`));
      assert.ok(graph.nodes.has(`r${suffix}`));
    }
  });
}

test('lateral lane transitions are explicit and absent by default', async () => {
  const graph = buildBoardGraph(await load('candidate-c-18'));
  assert.deepEqual(graph.lateralEdges, []);
});
