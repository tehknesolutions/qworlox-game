const REPLAY_EVENT_TYPES = new Set([
  'ROLL',
  'MOVE',
  'LAND',
  'CARD_DRAWN',
  'TERRITORY_CONTROL_SET',
  'GAME_EVENT'
]);

export function replayEvents(events) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array');

  const state = {
    characters: {},
    rolls: [],
    landings: [],
    cardsDrawn: [],
    territoryControl: {},
    gameEvents: []
  };

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const expectedSeq = index + 1;

    if (!event || event.seq !== expectedSeq) {
      throw new Error(`invalid event sequence: expected ${expectedSeq}, received ${event?.seq ?? 'missing'}`);
    }
    if (!REPLAY_EVENT_TYPES.has(event.type)) {
      throw new Error(`unknown replay event: ${event.type ?? 'missing'}`);
    }

    switch (event.type) {
      case 'ROLL':
        state.rolls.push({ seq: event.seq, team: event.team, roll: event.roll });
        break;
      case 'MOVE':
        state.characters[event.characterId] = { nodeId: event.toNodeId, team: event.team };
        break;
      case 'LAND':
        state.landings.push({ seq: event.seq, team: event.team, characterId: event.characterId, nodeId: event.nodeId });
        break;
      case 'CARD_DRAWN':
        state.cardsDrawn.push({ seq: event.seq, cardId: event.cardId });
        break;
      case 'TERRITORY_CONTROL_SET':
        state.territoryControl[event.nodeId] = event.team;
        break;
      case 'GAME_EVENT':
        state.gameEvents.push({ seq: event.seq, event: event.event, sourceCardId: event.sourceCardId });
        break;
    }
  }

  return state;
}
