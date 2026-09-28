import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTerritoryGraph, shortestPathLength } from '../game/board/territory.mjs';

for (const routeLength of [18, 36, 72]) {
  test(`${routeLength}: opposing teams converge on one shared center`, () => {
    const graph = buildTerritoryGraph({ routeLength });
    assert.ok(graph.nodes.has('center'));
    assert.equal(graph.nodes.get('center').type, 'CENTER');
    assert.ok(graph.adjacency.get('blue-entry').includes('blue-1'));
    assert.ok(graph.adjacency.get('red-entry').includes('red-1'));
    assert.ok([...graph.adjacency.values()].some(edges => edges.includes('center')));
  });

  test(`${routeLength}: mirrored starts have equal distance to center`, () => {
    const graph = buildTerritoryGraph({ routeLength });
    assert.equal(
      shortestPathLength(graph, 'blue-entry', 'center'),
      shortestPathLength(graph, 'red-entry', 'center')
    );
  });

  test(`${routeLength}: center creates a real conflict path between territories`, () => {
    const graph = buildTerritoryGraph({ routeLength });
    const blueToRed = shortestPathLength(graph, 'blue-entry', 'red-goal');
    const redToBlue = shortestPathLength(graph, 'red-entry', 'blue-goal');
    assert.ok(Number.isFinite(blueToRed));
    assert.equal(blueToRed, redToBlue);
  });
}
