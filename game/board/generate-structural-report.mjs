import { buildBoardGraph } from './graph.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../boards/king-reach-playable.v1.mjs';
import { analyzePlayableBoardStructure } from './playable-board-structural-analysis.mjs';
import { formatStructuralReport } from './structural-report.mjs';

export function generateStructuralReport() {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const analysis = analyzePlayableBoardStructure(graph);
  return { boardId: KING_REACH_PLAYABLE_BOARD_V1.id, analysis, markdown: formatStructuralReport(analysis) };
}

if (import.meta.url === `file://${process.argv[1]}`) process.stdout.write(generateStructuralReport().markdown);
