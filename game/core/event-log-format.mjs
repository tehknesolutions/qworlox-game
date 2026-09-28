import { replayEvents } from './replay.mjs';

const FORMAT = 'qworlox-event-log';
const VERSION = 1;
const DOCUMENT_FIELDS = new Set(['format', 'version', 'events']);
const EVENT_FIELDS = {
  ROLL: ['seq', 'type', 'team', 'roll'],
  MOVE: ['seq', 'type', 'team', 'characterId', 'fromNodeId', 'toNodeId'],
  LAND: ['seq', 'type', 'team', 'characterId', 'nodeId'],
  KING_REACHED: ['seq', 'type', 'team', 'characterId', 'kingNodeId'],
  CARD_DRAWN: ['seq', 'type', 'cardId'],
  TERRITORY_CONTROL_SET: ['seq', 'type', 'nodeId', 'team'],
  GAME_EVENT: ['seq', 'type', 'event', 'sourceCardId']
};

export function serializeEventLog(events) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array');
  assertEventEntries(events);
  assertJsonSafe(events);

  return JSON.stringify({ format: FORMAT, version: VERSION, events });
}

export function importEventLog(serialized) {
  let document;
  try {
    document = JSON.parse(serialized);
  } catch {
    throw new Error('invalid event log document');
  }

  if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('invalid event log document');
  assertDocumentFields(document);
  if (document.format !== FORMAT) throw new Error(`unsupported event log format: ${document.format ?? 'missing'}`);
  if (document.version !== VERSION) throw new Error(`unsupported event log version: ${document.version ?? 'missing'}`);
  if (!Array.isArray(document.events)) throw new Error('invalid event log events');

  assertEventEntries(document.events);
  assertJsonSafe(document.events);

  return { format: FORMAT, version: VERSION, events: structuredClone(document.events) };
}

export function importReplayableEventLog(serialized) {
  const document = importEventLog(serialized);
  const state = replayEvents(document.events);
  return { document, state };
}

function assertDocumentFields(document) {
  for (const field of Object.keys(document)) {
    if (!DOCUMENT_FIELDS.has(field)) throw new Error(`unknown event log document field: ${field}`);
  }
}

function assertEventEntries(events) {
  for (const event of events) {
    if (!event || typeof event !== 'object' || Array.isArray(event)) throw new Error('invalid event log event');
    const fields = EVENT_FIELDS[event.type];
    if (!fields) throw new Error(`unknown event log event type: ${event.type ?? 'missing'}`);
    const allowed = new Set(fields);
    for (const field of Object.keys(event)) {
      if (!allowed.has(field)) throw new Error(`unknown ${event.type} event field: ${field}`);
    }
    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(event, field)) throw new Error(`missing ${event.type} event field: ${field}`);
    }
  }
}

function assertJsonSafe(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('non-serializable event log value');
    return;
  }
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') throw new Error('non-serializable event log value');
  if (typeof value !== 'object') throw new Error('non-serializable event log value');
  if (seen.has(value)) throw new Error('non-serializable event log value');

  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) assertJsonSafe(item, seen);
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) throw new Error('non-serializable event log value');
    for (const item of Object.values(value)) assertJsonSafe(item, seen);
  }
  seen.delete(value);
}
