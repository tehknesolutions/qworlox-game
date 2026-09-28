import test from 'node:test';
import assert from 'node:assert/strict';
import { importEventLog } from '../game/core/event-log-format.mjs';

function log(events) {
  return JSON.stringify({ format: 'qworlox-event-log', version: 1, events });
}

test('ROLL rejects unknown event fields', () => {
  assert.throws(() => importEventLog(log([
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6, debug: true }
  ])), /unknown ROLL event field/);
});

test('MOVE rejects unknown event fields', () => {
  assert.throws(() => importEventLog(log([
    { seq: 1, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry', distance: 6 }
  ])), /unknown MOVE event field/);
});

test('KING_REACHED rejects unknown event fields', () => {
  assert.throws(() => importEventLog(log([
    { seq: 1, type: 'KING_REACHED', team: 'blue', characterId: 'blue-1', kingNodeId: 'red-king', debug: true }
  ])), /unknown KING_REACHED event field/);
});

test('KING_REACHED requires its canonical fields', () => {
  assert.throws(() => importEventLog(log([
    { seq: 1, type: 'KING_REACHED', team: 'blue', characterId: 'blue-1' }
  ])), /missing KING_REACHED event field: kingNodeId/);
});

test('canonical event fields remain accepted by structural import', () => {
  const events = [
    { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
    { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
    { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
    { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' },
    { seq: 5, type: 'TERRITORY_CONTROL_SET', nodeId: 'center', team: 'blue' },
    { seq: 6, type: 'GAME_EVENT', event: 'MARKET_DAY', sourceCardId: 'event-test' },
    { seq: 7, type: 'KING_REACHED', team: 'blue', characterId: 'blue-1', kingNodeId: 'red-king' }
  ];

  assert.deepEqual(importEventLog(log(events)).events, events);
});
