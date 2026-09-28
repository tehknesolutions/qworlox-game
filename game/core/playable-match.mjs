import { buildBoardGraph } from '../board/graph.mjs';
import { createGame, resolveTurn } from './game.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../boards/king-reach-playable.v1.mjs';

const PATHS = {
  blue: ['blue-king', 'blue-approach', 'center', 'red-approach', 'red-king'],
  red: ['red-king', 'red-approach', 'center', 'blue-approach', 'blue-king']
};

export function createPlayableMatch() {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const paths = structuredClone(PATHS);
  const game = createGame({ routeLength: paths.blue.length - 1 });

  return { game, graph, paths };
}

export function playTurn(match, action) {
  if (!match || !match.game || !match.graph || !match.paths) {
    throw new TypeError('invalid playable match');
  }
  if (match.game.winner) throw new Error('game is already complete');

  const movedTeam = match.game.activeTeam;
  const path = match.paths[movedTeam];
  const game = structuredClone(match.game);
  const character = game.teams[movedTeam].characters.find(item => item.id === action.characterId);

  if (!character) throw new Error(`unknown character: ${action.characterId}`);

  // The current Game Core uses its canonical movement path. For the playable
  // facade, map route positions onto the explicit board fixture before and
  // after resolution so the board graph remains the presentation/domain map.
  if (character.status === 'route' && Number.isInteger(character.position)) {
    character.nodeId = path[character.position];
  }

  const result = resolveTurn(game, match.graph, action);
  const movedCharacter = result.game.teams[movedTeam].characters.find(item => item.id === action.characterId);

  if (movedCharacter?.status === 'route' || movedCharacter?.status === 'goal') {
    const boardNodeId = path[Math.min(movedCharacter.position, path.length - 1)];
    movedCharacter.nodeId = boardNodeId;

    // resolveTurn evaluated against the legacy route node. Re-evaluate only
    // the terminal board mapping here until movement itself becomes graph-native.
    if (!result.game.winner && boardNodeId === match.graph.kingObjectives[movedTeam === 'blue' ? 'red' : 'blue']) {
      result.game.winner = movedTeam;
      result.game.victory = {
        winner: movedTeam,
        characterId: action.characterId,
        kingNodeId: boardNodeId
      };
      const land = result.game.events.findLast(event => event.type === 'LAND' && event.characterId === action.characterId);
      if (land) land.nodeId = boardNodeId;
      const move = result.game.events.findLast(event => event.type === 'MOVE' && event.characterId === action.characterId);
      if (move) move.toNodeId = boardNodeId;
      result.game.events.push({
        seq: result.game.events.length + 1,
        type: 'KING_REACHED',
        team: movedTeam,
        characterId: action.characterId,
        kingNodeId: boardNodeId
      });
    }
  }

  return { ...match, game: result.game };
}
