import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = async (name) => JSON.parse(await readFile(new URL(`../game/boards/${name}.board.v1.json`, import.meta.url)));

for (const [name, expectedRouteLength] of [['candidate-a-72', 72], ['candidate-b-36', 36], ['candidate-c-18', 18]]) {
  test(`${name} satisfies the board.v1 baseline`, async () => {
    const board = await load(name);
    assert.equal(board.schemaVersion, 'board.v1');
    assert.equal(board.routeLength, expectedRouteLength);
    assert.deepEqual(board.teams, ['blue', 'red']);
    assert.equal(board.startSlotsPerTeam, 2);
    assert.equal(board.releaseRoll, 6);
    assert.equal(board.lanes.length, 2);
    assert.equal(board.lanes[0].nodes.length, expectedRouteLength);
    assert.equal(board.lanes[1].nodes.length, expectedRouteLength);
    assert.equal(new Set(board.lanes.flatMap(lane => lane.nodes.map(node => node.id))).size, expectedRouteLength * 2);
  });
}

test('candidate geometries preserve the exact 72 → 36 → 18 reduction chain', async () => {
  const a = await load('candidate-a-72');
  const b = await load('candidate-b-36');
  const c = await load('candidate-c-18');
  assert.equal(a.routeLength / b.routeLength, 2);
  assert.equal(b.routeLength / c.routeLength, 2);
  assert.equal(a.routeLength / c.routeLength, 4);
});
