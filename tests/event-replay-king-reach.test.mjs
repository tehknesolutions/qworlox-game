import test from 'node:test';
import assert from 'node:assert/strict';
import { replayEvents } from '../game/core/replay.mjs';
import { serializeEventLog, importReplayableEventLog } from '../game/core/event-log-format.mjs';

const winningEvents = [
  { seq: 1, type: 'ROLL', team: 'blue', roll: 1 },
  { seq: 2, type: 'MOVE', team: 'blue', characterId: 'blue-1', fromNodeId: null, toNodeId: 'red-king' },
  { seq: 3, type: 'LAND', team: 'blue', characterId: 'blue-1', nodeId: 'red-king' },
  { seq: 4, type: 'KING_REACHED', team: 'blue', characterId: 'blue-1', kingNodeId: 'red-king' }
];

test('replay reconstructs terminal King Reach victory from recorded fact', () => {
  const state = replayEvents(winningEvents);

  assert.deepEqual(state.victory, {
    winner: 'blue',
    characterId: 'blue-1',
    kingNodeId: 'red-king'
  });
  assert.equal(state.winner, 'blue');
});

test('KING_REACHED must immediately follow the winning LAND for the same actor and node', () => {
  assert.throws(() => replayEvents([
    ...winningEvents.slice(0, 3),
    { seq: 4, type: 'KING_REACHED', team: 'red', characterId: 'blue-1', kingNodeId: 'red-king' }
  ]), /inconsistent KING_REACHED event/);
});

test('no canonical gameplay event may follow terminal King Reach', () => {
  assert.throws(() => replayEvents([
    ...winningEvents,
    { seq: 5, type: 'GAME_EVENT', event: 'AFTER_WIN' }
  ]), /event after terminal victory/);
});

test('King Reach survives Event Log serialize -> import -> replay without loss', () => {
  const result = importReplayableEventLog(serializeEventLog(winningEvents));

  assert.deepEqual(result.document.events, winningEvents);
  assert.equal(result.state.winner, 'blue');
  assert.equal(result.state.victory.kingNodeId, 'red-king');
});
