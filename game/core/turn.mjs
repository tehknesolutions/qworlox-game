import { buildMovementPath } from '../board/path.mjs';
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

  const path = buildMovementPath({ routeLength: next.routeLength, team });
  if (character.status === 'base') {
    if (roll !== 6) throw new Error('base character requires a 6');
    character.status = 'route';
    character.position = 0;
  } else {
    character.position = Math.min(character.position + roll, next.routeLength);
    if (character.position >= next.routeLength) character.status = 'goal';
  }
  character.nodeId = path[character.position];

  const occupants = Object.values(next.teams)
    .flatMap(side => side.characters)
    .filter(item => item.id !== character.id && item.status !== 'base' && item.nodeId)
    .map(item => ({ id: item.id, team: sideFor(next, item.id), nodeId: item.nodeId, attributes: item.attributes ?? {} }));

  const mover = { id: character.id, team, nodeId: character.nodeId, attributes: character.attributes ?? {} };
  const encounter = detectEncounter({ mover, occupants });

  let combatResult = null;
  if (encounter) {
    if (!combat) throw new Error('combat inputs required for an encounter');
    const defender = findCharacter(next, encounter.defenderId);
    combatResult = resolveEncounterCombat({
      attacker: mover,
      defender: { ...defender, team: sideFor(next, defender.id), nodeId: defender.nodeId, attributes: defender.attributes ?? {} },
      ...combat
    }).combat;

    const pieces = Object.fromEntries(
      Object.entries(next.teams).flatMap(([pieceTeam, side]) =>
        side.characters.map(item => [item.id, { ...item, team: pieceTeam }])
      )
    );
    const consequence = applyCombatConsequence({ combat: combatResult, pieces, routeLength: next.routeLength });
    for (const [id, state] of Object.entries(consequence.pieces)) {
      const piece = findCharacter(next, id);
      piece.position = state.position;
      piece.status = state.status;
      piece.nodeId = state.nodeId;
    }
  }

  if (next.teams[team].characters.every(item => item.status === 'goal')) next.winner = team;
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
