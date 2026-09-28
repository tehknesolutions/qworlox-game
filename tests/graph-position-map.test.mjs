import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMovementPath, nodeAtStep } from '../game/board/path.mjs';

for (const routeLength of [18, 36, 72]) {
  test(`${routeLength}: both teams have a deterministic graph movement path`, () => {
    const blue = buildMovementPath({ routeLength, team: 'blue' });
    const red = buildMovementPath({ routeLength, team: 'red' });
    assert.equal(blue.length, routeLength + 1);
    assert.equal(red.length, routeLength + 1);
    assert.equal(blue[0], `${'blue'}-entry`);
    assert.equal(red[0], `${'red'}-entry`);
    assert.equal(blue[Math.floor(routeLength / 2)], 'center');
    assert.equal(red[Math.floor(routeLength / 2)], 'center');
    assert.equal(blue.length, red.length);
  });

  test(`${routeLength}: center is the same physical node for both teams`, () => {
    assert.equal(nodeAtStep({ routeLength, team: 'blue', step: routeLength / 2 }), 'center');
    assert.equal(nodeAtStep({ routeLength, team: 'red', step: routeLength / 2 }), 'center');
  });
}
