const REPLAY_EVENT_TYPES = new Set([
  'ROLL',
  'MOVE',
  'LAND',
  'KING_REACHED',
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
    gameEvents: [],
    winner: null,
    victory: null
  };

  let lastRoll = null;
  let pendingMove = null;
  let landingOpen = false;
  let lastLanding = null;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const expectedSeq = index + 1;

    if (state.winner) throw new Error('event after terminal victory');
    if (!event || event.seq !== expectedSeq) {
      throw new Error(`invalid event sequence: expected ${expectedSeq}, received ${event?.seq ?? 'missing'}`);
    }
    if (!REPLAY_EVENT_TYPES.has(event.type)) {
      throw new Error(`unknown replay event: ${event.type ?? 'missing'}`);
    }

    switch (event.type) {
      case 'ROLL':
        if (pendingMove) throw new Error('ROLL while MOVE is awaiting LAND');
        state.rolls.push({ seq: event.seq, team: event.team, roll: event.roll });
        lastRoll = event;
        lastLanding = null;
        break;
      case 'MOVE':
        applyMove(state, event, lastRoll);
        lastRoll = null;
        pendingMove = event;
        landingOpen = false;
        lastLanding = null;
        break;
      case 'LAND':
        applyLanding(state, event, pendingMove);
        pendingMove = null;
        landingOpen = true;
        lastLanding = event;
        break;
      case 'KING_REACHED':
        applyKingReached(state, event, lastLanding);
        landingOpen = false;
        lastLanding = null;
        break;
      case 'CARD_DRAWN':
        if (!landingOpen) throw new Error('CARD_DRAWN before LAND');
        state.cardsDrawn.push({ seq: event.seq, cardId: event.cardId });
        landingOpen = false;
        lastLanding = null;
        break;
      case 'TERRITORY_CONTROL_SET':
        state.territoryControl[event.nodeId] = event.team;
        lastLanding = null;
        break;
      case 'GAME_EVENT':
        state.gameEvents.push({ seq: event.seq, event: event.event, sourceCardId: event.sourceCardId });
        lastLanding = null;
        break;
    }
  }

  if (lastRoll || pendingMove) throw new Error('incomplete replay turn');
  return state;
}

function applyMove(state, event, lastRoll) {
  if (!lastRoll || lastRoll.team !== event.team) {
    throw new Error(`MOVE without preceding ROLL for ${event.characterId}`);
  }
  const current = state.characters[event.characterId];
  if (current) {
    if (event.fromNodeId !== current.nodeId) {
      throw new Error(`inconsistent MOVE origin for ${event.characterId}: expected ${current.nodeId}, received ${event.fromNodeId}`);
    }
  }
  state.characters[event.characterId] = { nodeId: event.toNodeId, team: event.team };
}

function applyLanding(state, event, pendingMove) {
  if (!pendingMove) throw new Error(`LAND without immediately preceding MOVE for ${event.characterId}`);
  const character = state.characters[event.characterId];
  if (
    pendingMove.characterId !== event.characterId ||
    pendingMove.team !== event.team ||
    pendingMove.toNodeId !== event.nodeId ||
    !character || character.nodeId !== event.nodeId || character.team !== event.team
  ) throw new Error(`inconsistent LAND event for ${event.characterId}`);

  state.landings.push({ seq: event.seq, team: event.team, characterId: event.characterId, nodeId: event.nodeId });
}

function applyKingReached(state, event, lastLanding) {
  if (
    !lastLanding ||
    lastLanding.seq !== event.seq - 1 ||
    lastLanding.team !== event.team ||
    lastLanding.characterId !== event.characterId ||
    lastLanding.nodeId !== event.kingNodeId
  ) throw new Error('inconsistent KING_REACHED event');

  state.winner = event.team;
  state.victory = { winner: event.team, characterId: event.characterId, kingNodeId: event.kingNodeId };
}
