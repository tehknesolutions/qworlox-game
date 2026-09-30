import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardGraph } from '../game/board/graph.mjs';
import { auditRouteSpace } from '../game/board/route-space-audit.mjs';
import { KING_REACH_PLAYABLE_BOARD_V1 } from '../game/boards/king-reach-playable.v1.mjs';
const graph = buildBoardGraph(KING_REACH_PLAYABLE_BOARD_V1);

test('blue route audit exposes progress and loop metrics without changing movement rules', () => {
  const audit = auditRouteSpace(graph, { startNodeId: 'blue-approach', steps: 4, movingTeam: 'blue' });
  assert.ok(audit.totalPaths > 0);
  assert.ok(audit.reachesEnemyKing > 0);
  assert.ok(audit.returnsToStart > 0);
  assert.ok(audit.immediateBacktracks > 0);
  assert.ok(audit.repeatedNodePaths > 0);
});

test('red route audit exposes the same categories from the opposite side', () => {
  const audit = auditRouteSpace(graph, { startNodeId: 'red-approach', steps: 4, movingTeam: 'red' });
  assert.ok(audit.totalPaths > 0);
  assert.ok(audit.reachesEnemyKing > 0);
  assert.ok(audit.returnsToStart > 0);
  assert.ok(audit.immediateBacktracks > 0);
  assert.ok(audit.repeatedNodePaths > 0);
});

test('audit stops route expansion at enemy KING', () => {
  const audit = auditRouteSpace(graph, { startNodeId: 'red-approach', steps: 6, movingTeam: 'blue' });
  const kingPaths = audit.paths.filter(path => path.includes('red-king'));
  assert.ok(kingPaths.length > 0);
  assert.ok(kingPaths.every(path => path.at(-1) === 'red-king'));
});
