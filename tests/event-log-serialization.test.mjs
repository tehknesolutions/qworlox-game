import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeEventLog, importEventLog } from '../game/core/event-log-format.mjs';

const events = [
  { seq: 1, type: 'ROLL', team: 'blue', roll: 6 },
  { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'blue-entry' },
  { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'blue-entry' },
  { seq: 4, type: 'CARD_DRAWN', cardId: 'qworlox-combat-001' }
];

test('canonical Event Log round-trips without loss', () => {
  const serialized = serializeEventLog(events);
  const imported = importEventLog(serialized);

  assert.deepEqual(imported.events, events);
  assert.equal(imported.format, 'qworlox-event-log');
  assert.equal(imported.version, 1);
});

test('serialization is deterministic for the same canonical input', () => {
  assert.equal(serializeEventLog(events), serializeEventLog(structuredClone(events)));
});

test('import rejects unsupported format', () => {
  assert.throws(() => importEventLog(JSON.stringify({
    format: 'other-game-log',
    version: 1,
    events: []
  })), /unsupported event log format/);
});

test('import rejects unsupported schema version', () => {
  assert.throws(() => importEventLog(JSON.stringify({
    format: 'qworlox-event-log',
    version: 999,
    events: []
  })), /unsupported event log version/);
});

test('import rejects malformed JSON explicitly', () => {
  assert.throws(() => importEventLog('{not-json'), /invalid event log document/);
});

test('import rejects a document without an events array', () => {
  assert.throws(() => importEventLog(JSON.stringify({
    format: 'qworlox-event-log',
    version: 1
  })), /invalid event log events/);
});
