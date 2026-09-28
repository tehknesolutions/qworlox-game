import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMovementPath, nodeAtStep } from '../game/board/path.mjs';
import { buildTerritoryGraph, shortestPathLength } from '../game/board/territory.mjs';

for (const routeLength of [18, 36, 72]) {
  test(`${routeLength}: both teams have deterministic graph movement paths`, () => {
    const blue = buildMovementPath({ routeLength, team: 'blue' });
    const red = buildMovementPath({ routeLength, team: 'red' });
    const graph = buildTerritoryGraph({ routeLength });
    assert.equal(blue[0], 'blue-entry');
    assert.equal(red[0], 'red-entry');
    assert.equal(blue[blue.indexOf('center')], 'center');
    assert.equal(red[red.indexOf('center')], 'center');
    assert.equal(shortestPathLength(graph, blue[0], blue.at(-1)), blue.length - 1);
    assert.equal(shortestPathLength(graph, red[0], red.at(-1)), red.length - 1);
  });

  test(`${routeLength}: center is one shared physical node`, () => {
    const midpoint = routeLength / 2;
    assert.equal(nodeAtStep({ routeLength, team: 'blue', step: midpoint }), 'center');
    assert.equal(nodeAtStep({ routeLength, team: 'red', step: midpoint }), 'center');
  });
}
