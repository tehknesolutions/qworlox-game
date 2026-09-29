import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildBoardGraph } from '../game/board/graph.mjs';

const load = async name => JSON.parse(await readFile(new URL(`../game/boards/${name}.board.v1.json`, import.meta.url)));

for (const name of ['candidate-a-72', 'candidate-b-36', 'candidate-c-18']) {
  test(`${name} is migrated to the current explicit KING objective contract`, async () => {
    const graph = buildBoardGraph(await load(name));
    assert.ok(graph.kingObjectives.blue, 'blue KING objective must be explicit');
    assert.ok(graph.kingObjectives.red, 'red KING objective must be explicit');
  });
}
