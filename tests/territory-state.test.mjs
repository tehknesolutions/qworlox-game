import test from 'node:test';
import assert from 'node:assert/strict';
import { createTerritoryState, territoryAtNode, setTerritoryControl } from '../game/board/territory-state.mjs';

test('territory state classifies center and team territories', () => {
  const state = createTerritoryState({ routeLength: 18 });
  assert.equal(territoryAtNode(state, 'center').type, 'CENTER');
  assert.equal(territoryAtNode(state, 'blue-4').team, 'blue');
  assert.equal(territoryAtNode(state, 'red-4').team, 'red');
});

test('center starts neutral and can be controlled explicitly', () => {
  let state = createTerritoryState({ routeLength: 18 });
  assert.equal(state.control.center, null);
  state = setTerritoryControl(state, { nodeId: 'center', team: 'blue' });
  assert.equal(state.control.center, 'blue');
});

test('invalid control cannot be assigned to a goal outside the territory graph', () => {
  const state = createTerritoryState({ routeLength: 18 });
  assert.throws(() => setTerritoryControl(state, { nodeId: 'missing', team: 'blue' }), /unknown territory node/);
});
