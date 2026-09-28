const TEAM_ORDER = ['blue', 'red'];

function makeTeam(id) {
  return {
    id,
    characters: [1, 2].map(index => ({
      id: `${id}-${index}`,
      status: 'base',
      position: null
    }))
  };
}

export function createGame({ routeLength }) {
  if (!Number.isInteger(routeLength) || routeLength < 1) {
    throw new TypeError('routeLength must be a positive integer');
  }

  return {
    routeLength,
    activeTeam: 'blue',
    winner: null,
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
    legalCharacterIds: characters
      .filter(character => isLegalForRoll(character, roll))
      .map(character => character.id)
  };
}

export function moveCharacter(game, { characterId, roll }) {
  assertRoll(roll);
  if (game.winner) throw new Error('game is already complete');

  const legal = applyRoll(game, roll).legalCharacterIds;
  if (!legal.includes(characterId)) {
    throw new Error(`${characterId} is not legal for roll ${roll}`);
  }

  const next = structuredClone(game);
  const character = next.teams[next.activeTeam].characters.find(item => item.id === characterId);

  if (character.status === 'base') {
    character.status = 'route';
    character.position = 0;
  } else {
    character.position += roll;
    if (character.position >= next.routeLength) {
      character.status = 'goal';
      character.position = next.routeLength;
    }
  }

  if (next.teams[next.activeTeam].characters.every(item => item.status === 'goal')) {
    next.winner = next.activeTeam;
  }

  next.activeTeam = next.activeTeam === TEAM_ORDER[0] ? TEAM_ORDER[1] : TEAM_ORDER[0];
  return next;
}

function isLegalForRoll(character, roll) {
  if (character.status === 'goal') return false;
  if (character.status === 'base') return roll === 6;
  return true;
}

function assertRoll(roll) {
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) {
    throw new RangeError('roll must be an integer from 1 to 6');
  }
}
