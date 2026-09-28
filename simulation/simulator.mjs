import { createRng, rollD6 } from '../game/core/rng.mjs';
import { createGame, applyRoll, moveCharacter } from '../game/core/game.mjs';

export function simulateMatch({ routeLength, seed, maxTurns = 10000 }) {
  const rng = createRng(seed);
  let game = createGame({ routeLength });
  let turns = 0;
  let noChoiceTurns = 0;

  while (!game.winner && turns < maxTurns) {
    turns += 1;
    const roll = rollD6(rng);
    const { legalCharacterIds } = applyRoll(game, roll);

    if (legalCharacterIds.length === 0) {
      noChoiceTurns += 1;
      game = passTurn(game);
      continue;
    }

    const characterId = chooseCharacter(game, legalCharacterIds);
    game = moveCharacter(game, { characterId, roll });
  }

  if (!game.winner) {
    throw new Error(`simulation exceeded maxTurns=${maxTurns}`);
  }

  return {
    routeLength,
    seed,
    winner: game.winner,
    turns,
    noChoiceTurns
  };
}

export function simulateBatch({ routeLength, seed, matches, maxTurns = 10000 }) {
  if (!Number.isInteger(matches) || matches < 1) {
    throw new TypeError('matches must be a positive integer');
  }

  let blueWins = 0;
  let redWins = 0;
  let totalTurns = 0;
  let noChoiceTurns = 0;

  for (let index = 0; index < matches; index += 1) {
    const matchSeed = deriveSeed(seed, index);
    const result = simulateMatch({ routeLength, seed: matchSeed, maxTurns });
    if (result.winner === 'blue') blueWins += 1;
    else redWins += 1;
    totalTurns += result.turns;
    noChoiceTurns += result.noChoiceTurns;
  }

  return {
    routeLength,
    seed,
    matches,
    blueWins,
    redWins,
    firstPlayerWinRate: blueWins / matches,
    averageTurns: totalTurns / matches,
    noChoiceTurns
  };
}

function chooseCharacter(game, legalCharacterIds) {
  // Baseline policy: prefer the character furthest from completion.
  // This deterministic policy isolates geometry/RNG before tactical AI exists.
  const active = game.teams[game.activeTeam].characters;
  return [...legalCharacterIds].sort((a, b) => {
    const ca = active.find(character => character.id === a);
    const cb = active.find(character => character.id === b);
    return progress(ca) - progress(cb) || a.localeCompare(b);
  })[0];
}

function progress(character) {
  if (character.status === 'base') return -1;
  if (character.status === 'goal') return Number.POSITIVE_INFINITY;
  return character.position;
}

function passTurn(game) {
  const next = structuredClone(game);
  next.activeTeam = game.activeTeam === 'blue' ? 'red' : 'blue';
  return next;
}

function deriveSeed(seed, index) {
  return (Number(seed) + Math.imul(index + 1, 0x9E3779B1)) >>> 0;
}
