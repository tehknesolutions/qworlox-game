const FORMAT = 'qworlox-event-log';
const VERSION = 1;

export function serializeEventLog(events) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array');

  return JSON.stringify({
    format: FORMAT,
    version: VERSION,
    events
  });
}

export function importEventLog(serialized) {
  let document;

  try {
    document = JSON.parse(serialized);
  } catch {
    throw new Error('invalid event log document');
  }

  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('invalid event log document');
  }
  if (document.format !== FORMAT) {
    throw new Error(`unsupported event log format: ${document.format ?? 'missing'}`);
  }
  if (document.version !== VERSION) {
    throw new Error(`unsupported event log version: ${document.version ?? 'missing'}`);
  }
  if (!Array.isArray(document.events)) {
    throw new Error('invalid event log events');
  }

  return {
    format: FORMAT,
    version: VERSION,
    events: structuredClone(document.events)
  };
}
