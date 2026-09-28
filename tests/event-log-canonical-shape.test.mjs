import test from 'node:test';
import assert from 'node:assert/strict';
import { importEventLog } from '../game/core/event-log-format.mjs';

function document(overrides = {}) {
  return JSON.stringify({
    format: 'qworlox-event-log',
    version: 1,
    events: [],
    ...overrides
  });
}

test('import rejects unknown top-level document fields', () => {
  assert.throws(() => importEventLog(document({ debug: true })), /unknown event log document field/);
});

test('import rejects duplicate semantic metadata hidden outside the canonical envelope', () => {
  assert.throws(() => importEventLog(document({ schemaVersion: 1 })), /unknown event log document field/);
});

test('canonical envelope with only format version and events remains valid', () => {
  assert.deepEqual(importEventLog(document()), {
    format: 'qworlox-event-log',
    version: 1,
    events: []
  });
});
