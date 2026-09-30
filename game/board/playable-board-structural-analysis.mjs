import { buildMobilityMatrix } from './mobility-matrix.mjs';
import { auditBoardBalance } from './board-balance-audit.mjs';
import { auditBoardSymmetry } from './board-symmetry-audit.mjs';

export const KING_REACH_V1_MIRROR_MAP = Object.freeze({
  'blue-king': 'red-king',
  'blue-approach': 'red-approach',
  center: 'center',
  'red-approach': 'blue-approach',
  'red-king': 'blue-king',
  'north-crossing': 'north-crossing',
  'south-crossing': 'south-crossing'
});

export function analyzePlayableBoardStructure(graph) {
  const blueMatrix = buildMobilityMatrix(graph, { movingTeam: 'blue' });
  const redMatrix = buildMobilityMatrix(graph, { movingTeam: 'red' });
  return {
    boardId: graph.id ?? 'king-reach-playable-v1',
    blue: { matrix: blueMatrix, balance: auditBoardBalance(blueMatrix) },
    red: { matrix: redMatrix, balance: auditBoardBalance(redMatrix) },
    symmetry: auditBoardSymmetry(blueMatrix, redMatrix, KING_REACH_V1_MIRROR_MAP)
  };
}
