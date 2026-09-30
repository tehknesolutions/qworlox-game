import { buildBoardGraph } from './graph.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../boards/king-reach-playable.v1.mjs';
import { analyzePlayableBoardStructure } from './playable-board-structural-analysis.mjs';
import { formatStructuralReport } from './structural-report.mjs';

export function generateStructuralReport() {
  const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);
  const analysis = analyzePlayableBoardStructure(graph);
  return { boardId: KING_REACH_PLAYABLE_BOARD_V1.id, analysis, markdown: formatStructuralReport(analysis) };
}

export function formatStructuralJSON(result) {
  return JSON.stringify({
    schemaVersion: 1,
    boardId: result.boardId,
    blue: result.analysis.blue.balance,
    red: result.analysis.red.balance,
    symmetry: result.analysis.symmetry
  }, null, 2) + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateStructuralReport();
  process.stdout.write(process.argv.includes('--json') ? formatStructuralJSON(result) : result.markdown);
}
