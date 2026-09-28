import { buildMovementPath } from '../board/path.mjs';
import { createTerritoryState, territoryAtNode, setTerritoryControl } from '../board/territory-state.mjs';
import { createDeckState, drawCard, playCard } from '../cards/deck.mjs';

const TEAM_ORDER = ['blue', 'red'];

function makeTeam(id) {
  return {
    id,
    characters: [1, 2].map(index => ({
      id: `${id}-${index}`,
      status: 'base',
      position: null,
      nodeId: null
    }))
  };
}

export function createGame({ routeLength }) {
  if (!Number.isInteger(routeLength) || routeLength < 4 || routeLength % 2 !== 0) {
    throw new TypeError('routeLength must be an even integer >= 4');
  }

  const territory = createTerritoryState({ routeLength });
  return {
    routeLength,
    activeTeam: 'blue',
    winner: null,
    territory,
    cards: createDeckState(),
    events: [],
    teams: {
      blue: makeTeam('blue'),
      red: makeTeam('red')
    }
  };
}

export function applyRoll(game, roll) {
  assertRoll(roll);
  if (game.winner) return { legalCharacterIds: [] };
  const characters = game.teams[game.activeTeam].characters;
  return {
    legalCharacterIds: characters.filter(character => isLegalForRoll(character, roll)).map(character => character.id)
  };
}

export function moveCharacter(game, { characterId, roll }) {
  assertRoll(roll);
  if (game.winner) throw new Error('game is already complete');
  const legal = applyRoll(game, roll).legalCharacterIds;
  if (!legal.includes(characterId)) throw new Error(`${characterId} is not legal for roll ${roll}`);

  const next = structuredClone(game);
  const character = next.teams[next.activeTeam].characters.find(item => item.id === characterId);
  const path = buildMovementPath({ routeLength: next.routeLength, team: next.activeTeam });

  if (character.status === 'base') {
    character.status = 'route';
    character.position = 0;
    character.nodeId = path[0];
  } else {
    character.position = Math.min(character.position + roll, next.routeLength);
    character.nodeId = path[character.position];
    if (character.position >= next.routeLength) character.status = 'goal';
  }

  character.territory = territoryAtNode(next.territory, character.nodeId);
  if (next.teams[next.activeTeam].characters.every(item => item.status === 'goal')) next.winner = next.activeTeam;
  next.activeTeam = next.activeTeam === TEAM_ORDER[0] ? TEAM_ORDER[1] : TEAM_ORDER[0];
  return next;
}

export function drawGameCard(game) {
  const result = drawCard(game.cards);
  return { game: { ...game, cards: result.state }, card: result.card };
}

export function playGameCard(game, { cardId, context = {} }) {
  const result = playCard(game.cards, { cardId, context });
  return { game: { ...game, cards: result.state }, card: result.card, resolution: result.resolution };
}

export function executeCardCommands(game, commands) {
  if (!Array.isArray(commands)) throw new TypeError('commands must be an array');
  let next = structuredClone(game);
  const emitted = [];

  for (const command of commands) {
    const seq = next.events.length + 1;
    if (command.type === 'SET_TERRITORY_CONTROL') {
      next.territory = setTerritoryControl(next.territory, { nodeId: command.nodeId, team: command.team });
      const event = { seq, type: 'TERRITORY_CONTROL_SET', nodeId: command.nodeId, team: command.team };
      next.events.push(event);
      emitted.push(event);
      continue;
    }
    if (command.type === 'EMIT_GAME_EVENT') {
      const event = { seq, type: 'GAME_EVENT', event: command.event, sourceCardId: command.sourceCardId };
      next.events.push(event);
      emitted.push(event);
      continue;
    }
    throw new Error(`unknown game command: ${command.type}`);
  }

  return { game: next, events: emitted };
}

function isLegalForRoll(character, roll) {
  if (character.status === 'goal') return false;
  if (character.status === 'base') return roll === 6;
  return true;
}

function assertRoll(roll) {
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new RangeError('roll must be an integer from 1 to 6');
}
