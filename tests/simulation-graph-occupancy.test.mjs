import test from 'node:test';
import assert from 'node:assert/strict';
import { nodeForPosition, opposingOccupant } from '../game/board/occupancy.mjs';

test('position resolves to a canonical graph node', () => {
  assert.equal(nodeForPosition({ team: 'blue', position: 0 }), 'blue-1');
  assert.equal(nodeForPosition({ team: 'red', position: 0 }), 'red-1');
});

test('occupancy uses graph node identity rather than raw numeric position', () => {
  const pieces = [
    { id: 'blue-1', team: 'blue', nodeId: 'center' },
    { id: 'red-1', team: 'red', nodeId: 'center' },
    { id: 'red-2', team: 'red', nodeId: 'red-7' }
  ];
  const found = opposingOccupant({ team: 'blue', nodeId: 'center' }, pieces);
  assert.equal(found.id, 'red-1');
});

test('allied occupancy is not an opposing encounter', () => {
  assert.equal(opposingOccupant({ team: 'blue', nodeId: 'center' }, [
    { id: 'blue-2', team: 'blue', nodeId: 'center' }
  ]), null);
});
