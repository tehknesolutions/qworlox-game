import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, executeCardCommands } from '../game/core/game.mjs';

test('territory command mutates only the addressed canonical node', () => {
  const game = createGame({ routeLength: 18 });
  const result = executeCardCommands(game, [{
    type: 'SET_TERRITORY_CONTROL', nodeId: 'center', team: 'blue'
  }]);

  assert.equal(result.game.territory.control.center, 'blue');
  assert.equal(result.game.territory.control['red-1'], 'red');
  assert.equal(result.events.length, 1);
  assert.deepEqual(result.events[0], {
    seq: 1,
    type: 'TERRITORY_CONTROL_SET',
    nodeId: 'center',
    team: 'blue'
  });
});

test('game event command appends deterministic event data', () => {
  const game = createGame({ routeLength: 18 });
  const result = executeCardCommands(game, [{
    type: 'EMIT_GAME_EVENT', event: 'MARKET_DAY', sourceCardId: 'event-test'
  }]);

  assert.deepEqual(result.game.events, [{
    seq: 1,
    type: 'GAME_EVENT',
    event: 'MARKET_DAY',
    sourceCardId: 'event-test'
  }]);
});

test('unknown commands fail explicitly and do not silently mutate state', () => {
  const game = createGame({ routeLength: 18 });
  assert.throws(
    () => executeCardCommands(game, [{ type: 'UNKNOWN_COMMAND' }]),
    /unknown game command/
  );
  assert.deepEqual(game.events, []);
  assert.equal(game.territory.control.center, null);
});
