import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeEventLog, importEventLog } from '../game/core/event-log-format.mjs';

const validEvents = [
  { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
  { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
  { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' }
];

test('serialization rejects event values that JSON would silently lose', () => {
  const events = structuredClone(validEvents);
  events[0].debugOnly = undefined;
  assert.throws(() => serializeEventLog(events), /non-serializable event log value/);
});

test('serialization rejects non-finite numeric values', () => {
  const events = structuredClone(validEvents);
  events[0].roll = Number.NaN;
  assert.throws(() => serializeEventLog(events), /non-serializable event log value/);
});

test('import rejects non-object event entries before replay', () => {
  const serialized = JSON.stringify({
    format: 'qworlox-event-log',
    version: 1,
    events: [null]
  });
  assert.throws(() => importEventLog(serialized), /invalid event log event/);
});

test('ordinary canonical events remain lossless', () => {
  const imported = importEventLog(serializeEventLog(validEvents));
  assert.deepEqual(imported.events, validEvents);
});
