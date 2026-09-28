import { detectEncounter } from './encounter.mjs';
import { resolveEncounterCombat } from './encounter-combat.mjs';
import { applyCombatConsequence } from './combat-consequence.mjs';

export function resolveTurnWithEncounter(game, { characterId, roll, combat } = {}) {
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) {
    throw new RangeError('roll must be an integer from 1 to 6');
  }
  if (game.winner) throw new Error('game is already complete');

  const next = structuredClone(game);
  const team = next.activeTeam;
  const character = next.teams[team].characters.find(item => item.id === characterId);
  if (!character) throw new Error(`unknown character: ${characterId}`);
  if (character.status === 'goal') throw new Error('goal character cannot move');

  if (character.status === 'base') {
    if (roll !== 6) throw new Error('base character requires a 6');
    character.status = 'route';
    character.position = 0;
  } else {
    character.position = Math.min(character.position + roll, next.routeLength);
    if (character.position >= next.routeLength) character.status = 'goal';
  }

  const occupants = Object.values(next.teams)
    .flatMap(side => side.characters)
    .filter(item => item.id !== character.id && item.status !== 'base')
    .map(item => ({ id: item.id, team: sideFor(next, item.id), nodeId: String(item.position) }));

  const mover = { id: character.id, team, nodeId: String(character.position), attributes: character.attributes ?? {} };
  const encounter = detectEncounter({ mover, occupants });

  let combatResult = null;
  if (encounter) {
    if (!combat) throw new Error('combat inputs required for an encounter');
    const defender = findCharacter(next, encounter.defenderId);
    combatResult = resolveEncounterCombat({
      attacker: mover,
      defender: { ...defender, team: sideFor(next, defender.id), nodeId: String(defender.position) },
      ...combat
    }).combat;

    const positions = Object.fromEntries(
      Object.values(next.teams).flatMap(side => side.characters.map(item => [item.id, item.position]))
    );
    const consequence = applyCombatConsequence({ combat: combatResult, positions, routeLength: next.routeLength });
    for (const [id, position] of Object.entries(consequence.positions)) {
      const piece = findCharacter(next, id);
      if (piece) piece.position = position;
    }
  }

  if (next.teams[team].characters.every(item => item.status === 'goal')) {
    next.winner = team;
  }

  next.activeTeam = team === 'blue' ? 'red' : 'blue';
  return { game: next, encounter, combat: combatResult };
}

function findCharacter(game, id) {
  for (const side of Object.values(game.teams)) {
    const character = side.characters.find(item => item.id === id);
    if (character) return character;
  }
  throw new Error(`unknown character: ${id}`);
}

function sideFor(game, characterId) {
  for (const [team, side] of Object.entries(game.teams)) {
    if (side.characters.some(item => item.id === characterId)) return team;
  }
  throw new Error(`unknown character: ${characterId}`);
}
