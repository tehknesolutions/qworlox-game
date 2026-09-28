import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMovementPath } from '../game/board/path.mjs';
import { opposingOccupant } from '../game/board/occupancy.mjs';

test('mirrored players at the same movement step occupy the same center node', () => {
  const routeLength = 18;
  const step = routeLength / 2;
  const pieces = [
    { id: 'blue-1', team: 'blue', nodeId: buildMovementPath({ routeLength, team: 'blue' })[step] },
    { id: 'red-1', team: 'red', nodeId: buildMovementPath({ routeLength, team: 'red' })[step] }
  ];

  assert.equal(pieces[0].nodeId, 'center');
  assert.equal(pieces[1].nodeId, 'center');
  assert.equal(opposingOccupant(pieces[0], pieces).id, 'red-1');
});
