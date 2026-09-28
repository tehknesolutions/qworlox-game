import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayableMatch } from '../game/core/playable-match.mjs';
import { projectPlayableUI } from '../game/ui/playable-ui-model.mjs';

test('UI projection exposes turn, winner and graph nodes without owning game rules', () => {
  const match = createPlayableMatch();
  const ui = projectPlayableUI(match);

  assert.equal(ui.activeTeam, 'blue');
  assert.equal(ui.winner, null);
  assert.equal(ui.nodes.find(node => node.id === 'blue-king').objective.team, 'blue');
  assert.equal(ui.nodes.find(node => node.id === 'red-king').objective.team, 'red');
  assert.equal(ui.nodes.find(node => node.id === 'center').region, 'CONTESTED_CENTER');
});

test('UI projection exposes pieces from domain state', () => {
  const match = createPlayableMatch();
  match.game.teams.blue.characters[0].status = 'route';
  match.game.teams.blue.characters[0].nodeId = 'blue-king';

  const ui = projectPlayableUI(match);
  const piece = ui.pieces.find(item => item.id === 'blue-1');

  assert.equal(piece.team, 'blue');
  assert.equal(piece.status, 'route');
  assert.equal(piece.nodeId, 'blue-king');
});

test('UI projection derives branch choices from graph adjacency', () => {
  const match = createPlayableMatch();
  match.game.teams.blue.characters[0].status = 'route';
  match.game.teams.blue.characters[0].nodeId = 'blue-approach';

  const ui = projectPlayableUI(match, { selectedCharacterId: 'blue-1' });

  assert.ok(ui.legalNextNodes.includes('north-crossing'));
  assert.ok(ui.legalNextNodes.includes('south-crossing'));
  assert.equal(ui.legalNextNodes.includes('red-approach'), false);
});

test('terminal projection freezes interaction and announces King Reach', () => {
  const match = createPlayableMatch();
  match.game.winner = 'blue';
  match.game.victory = { winner: 'blue', characterId: 'blue-1', kingNodeId: 'red-king' };

  const ui = projectPlayableUI(match, { selectedCharacterId: 'blue-1' });

  assert.equal(ui.interactionLocked, true);
  assert.equal(ui.announcement, 'KING REACHED — BLUE WINS');
  assert.deepEqual(ui.legalNextNodes, []);
});
