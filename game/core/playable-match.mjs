import { buildBoardGraph } from '../board/graph.mjs';
import { advanceOnGraph } from '../board/graph-movement.mjs';
import { createGame } from './game.mjs';
import { evaluateKingReach } from './victory.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../boards/king-reach-playable.v1.mjs';

export function createPlayableMatch() {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const game = createGame({ routeLength: 4 });
  return { game, graph };
}

export function playTurn(match, { characterId, roll, choices = [] }) {
  assertMatch(match);
  assertRoll(roll);
  if (match.game.winner) throw new Error('game is already complete');

  const movedTeam = match.game.activeTeam;
  const game = structuredClone(match.game);
  const character = game.teams[movedTeam].characters.find(item => item.id === characterId);
  if (!character) throw new Error(`unknown character: ${characterId}`);
  if (character.status === 'base') throw new Error(`${characterId} must be placed on the board before graph movement`);
  if (!character.nodeId) throw new Error(`${characterId} has no graph node`);

  const fromNodeId = character.nodeId;
  const movement = advanceOnGraph(match.graph, { startNodeId: fromNodeId, steps: roll, choices });
  character.nodeId = movement.nodeId;
  character.position = null;

  game.events.push({ seq: game.events.length + 1, type: 'ROLL', team: movedTeam, roll });
  game.events.push({
    seq: game.events.length + 1,
    type: 'MOVE',
    team: movedTeam,
    characterId,
    fromNodeId,
    toNodeId: character.nodeId
  });
  game.events.push({
    seq: game.events.length + 1,
    type: 'LAND',
    team: movedTeam,
    characterId,
    nodeId: character.nodeId
  });

  const victory = evaluateKingReach({
    graph: match.graph,
    team: movedTeam,
    characterId,
    nodeId: character.nodeId
  });

  if (victory) {
    game.winner = victory.winner;
    game.victory = victory;
    character.status = 'goal';
    game.events.push({
      seq: game.events.length + 1,
      type: 'KING_REACHED',
      team: victory.winner,
      characterId: victory.characterId,
      kingNodeId: victory.kingNodeId
    });
  } else {
    game.activeTeam = movedTeam === 'blue' ? 'red' : 'blue';
  }

  return { ...match, game };
}

function assertMatch(match) {
  if (!match?.game || !match?.graph) throw new TypeError('invalid playable match');
}

function assertRoll(roll) {
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) {
    throw new RangeError('roll must be an integer from 1 to 6');
  }
}
