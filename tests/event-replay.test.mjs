import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';

test('replay reconstructs observable movement card territory and game-event history', () => {
  const events = [
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' },
    { seq: 5, type: 'TERRITORY_CONTROL_SET', nodeId: 'center', team: 'blue' },
    { seq: 6, type: 'GAME_EVENT', event: 'MARKET_DAY', sourceCardId: 'event-test' }
  ];

  const state = replayEvents(events);

  assert.deepEqual(state.characters['blue-1'], { nodeId: 'blue-entry', team: 'blue' });
  assert.deepEqual(state.rolls, [{ seq: 1, team: 'blue', roll: 6 }]);
  assert.deepEqual(state.landings, [{ seq: 3, team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }]);
  assert.deepEqual(state.cardsDrawn, [{ seq: 4, cardId: 'qworlox-combat-001' }]);
  assert.equal(state.territoryControl.center, 'blue');
  assert.deepEqual(state.gameEvents, [{ seq: 6, event: 'MARKET_DAY', sourceCardId: 'event-test' }]);
});

test('replay rejects a non-monotonic or missing event sequence', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
  ]), /invalid event sequence/);
});

test('replay rejects unknown event types instead of inventing behavior', () => {
  assert.throws(() => replayEvents([
    { seq: 1, type: 'TELEPORT_BY_MAGIC', characterId: 'blue-1', nodeId: 'center' }
  ]), /unknown replay event/);
});

test('replay is deterministic and does not mutate the source log', () => {
  const events = [
    { seq: 1, type: 'MOVE', team: 'red', characterId: 'red-1', fromNodeId: null, toNodeId: 'red-entry' }
  ];
  const snapshot = structuredClone(events);
  assert.deepEqual(replayEvents(events), replayEvents(events));
  assert.deepEqual(events, snapshot);
});
