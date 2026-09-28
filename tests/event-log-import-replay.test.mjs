import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeEventLog, importReplayableEventLog } from '../game/core/event-log-format.mjs';

const validEvents = [
  { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
  { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
  { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
  { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
];

test('import replay boundary returns the document and reconstructed observable state', () => {
  const result = importReplayableEventLog(serializeEventLog(validEvents));

  assert.deepEqual(result.document.events, validEvents);
  assert.deepEqual(result.state.characters['blue-1'], { nodeId: 'blue-entry', team: 'blue' });
  assert.deepEqual(result.state.cardsDrawn, [{ seq: 4, cardId: 'qworlox-combat-001' }]);
});

test('structurally valid document with broken causal history is rejected by replay validation', () => {
  const serialized = JSON.stringify({
    format: 'qworlox-event-log',
    version: 1,
    events: [
      { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
      { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
      { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'center' }
    ]
  });

  assert.throws(() => importReplayableEventLog(serialized), /inconsistent LAND event/);
});

test('structurally valid but incomplete turn is rejected by replay validation', () => {
  const serialized = JSON.stringify({
    format: 'qworlox-event-log',
    version: 1,
    events: [{ seq: 1, type: 'ROLL', team: 'blue', roll: 6 }]
  });

  assert.throws(() => importReplayableEventLog(serialized), /incomplete replay turn/);
});
