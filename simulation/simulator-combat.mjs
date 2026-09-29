import { createRng, rollD6 } from '../game/core/rng.mjs';
import { createGame } from '../game/core/game.mjs';
import { resolveTurnWithEncounter } from '../game/core/turn.mjs';
import { buildMovementPath } from '../game/board/path.mjs';

export function simulateMatchWithCombat({ routeLength, seed, maxTurns = 10000 }) {
  const rng = createRng(seed);
  let game = createGame({ routeLength });
  let turns = 0;
  let noChoiceTurns = 0;
  let encounters = 0;
  let combats = 0;
  let draws = 0;

  while (!game.winner && turns < maxTurns) {
    turns += 1;
    const team = game.activeTeam;
    const roll = rollD6(rng);
    const legal = legalCharacters(game, roll);
    if (legal.length === 0) {
      noChoiceTurns += 1;
      game = passTurn(game);
      continue;
    }

    const characterId = chooseCharacter(game, legal, roll);
    const combat = combatFor(game, characterId, roll, rng);
    const result = resolveTurnWithEncounter(game, { characterId, roll, combat });
    game = result.game;
    if (result.encounter) encounters += 1;
    if (result.combat) {
      combats += 1;
      if (result.combat.draw) draws += 1;
    }
    if (game.teams[team].characters.every(character => character.status === 'goal')) {
      game = { ...game, winner: team, victory: { winner: team } };
    }
  }

  if (!game.winner) throw new Error(`simulation exceeded maxTurns=${maxTurns}`);
  return { routeLength, seed, winner: game.winner, turns, noChoiceTurns, encounters, combats, draws };
}

export function simulateBatchWithCombat({ routeLength, seed, matches, maxTurns = 10000 }) {
  let blueWins = 0, redWins = 0, totalTurns = 0, noChoiceTurns = 0, encounters = 0, combats = 0, draws = 0;
  for (let index = 0; index < matches; index += 1) {
    const result = simulateMatchWithCombat({ routeLength, seed: deriveSeed(seed, index), maxTurns });
    if (result.winner === 'blue') blueWins += 1; else redWins += 1;
    totalTurns += result.turns;
    noChoiceTurns += result.noChoiceTurns;
    encounters += result.encounters;
    combats += result.combats;
    draws += result.draws;
  }
  return { routeLength, seed, matches, blueWins, redWins, firstPlayerWinRate: blueWins / matches, averageTurns: totalTurns / matches, noChoiceTurns, encounters, combats, draws };
}

function legalCharacters(game, roll) {
  return game.teams[game.activeTeam].characters
    .filter(c => c.status !== 'goal' && (c.status !== 'base' || roll === 6))
    .map(c => c.id);
}

function chooseCharacter(game, ids, roll) {
  if (roll === 6) {
    const base = ids.find(id => find(game, id).status === 'base');
    if (base) return base;
  }
  return [...ids].sort((a, b) => progress(find(game, a)) - progress(find(game, b)) || a.localeCompare(b))[0];
}

function progress(c) { return c.status === 'base' ? -1 : c.position; }
function find(game, id) { return Object.values(game.teams).flatMap(t => t.characters).find(c => c.id === id); }
function teamOf(game, id) { return Object.entries(game.teams).find(([, side]) => side.characters.some(c => c.id === id))?.[0] ?? null; }

function combatFor(game, characterId, roll, rng) {
  const mover = find(game, characterId);
  const moverTeam = teamOf(game, characterId);
  if (!mover || !moverTeam) return undefined;
  const path = buildMovementPath({ routeLength: game.routeLength, team: moverTeam });
  const destinationPosition = mover.status === 'base' ? 0 : Math.min(mover.position + roll, game.routeLength);
  const destinationNode = path[destinationPosition];
  const opponent = Object.entries(game.teams)
    .filter(([team]) => team !== moverTeam)
    .flatMap(([, side]) => side.characters)
    .find(character => character.status !== 'base' && character.nodeId === destinationNode);
  return opponent ? {
    commonDie: rollD6(rng),
    attackerExclusiveDie: rollD6(rng),
    defenderExclusiveDie: rollD6(rng),
    attackerModifiers: {},
    defenderModifiers: {}
  } : undefined;
}

function passTurn(game) { const next = structuredClone(game); next.activeTeam = game.activeTeam === 'blue' ? 'red' : 'blue'; return next; }
function deriveSeed(seed, index) { return (Number(seed) + Math.imul(index + 1, 0x9E3779B1)) >>> 0; }
