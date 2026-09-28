export function renderPlayableHTML(ui) {
  if (!ui || !Array.isArray(ui.nodes) || !Array.isArray(ui.pieces)) throw new TypeError('invalid playable UI projection');
  const legal = new Set(ui.legalNextNodes ?? []);
  const piecesByNode = new Map();
  for (const piece of ui.pieces) {
    if (!piece.nodeId) continue;
    const bucket = piecesByNode.get(piece.nodeId) ?? [];
    bucket.push(piece);
    piecesByNode.set(piece.nodeId, bucket);
  }

  const pieceButton = piece => `<button class="qworlox-piece qworlox-piece--${escapeHTML(piece.team)}" data-character-id="${escapeHTML(piece.id)}" data-team="${escapeHTML(piece.team)}"${piece.id === ui.selectedCharacterId ? ' data-selected="true"' : ''}>${escapeHTML(piece.id)}</button>`;
  const reserve = team => `<aside class="qworlox-reserve qworlox-reserve--${team}" data-reserve-team="${team}"><strong>${team.toUpperCase()} RESERVE</strong><div>${ui.pieces.filter(piece => piece.team === team && piece.status === 'base').map(pieceButton).join('')}</div></aside>`;
  const nodes = ui.nodes.map(node => {
    const objective = node.objective?.type === 'KING' ? `<span class="qworlox-king">KING · ${escapeHTML(node.objective.team.toUpperCase())}</span>` : '';
    const pieces = (piecesByNode.get(node.id) ?? []).map(pieceButton).join('');
    const legalAttr = legal.has(node.id) ? ' data-legal-choice="true"' : '';
    const currentAttr = node.id === ui.currentMoveNodeId ? ' data-current-move="true"' : '';
    return `<div class="qworlox-node qworlox-node--${escapeHTML(node.region.toLowerCase().replaceAll('_', '-'))}" data-node-id="${escapeHTML(node.id)}"${legalAttr}${currentAttr}><span class="qworlox-node__region">${escapeHTML(label(node.region))}</span>${objective}<div class="qworlox-node__pieces">${pieces}</div></div>`;
  }).join('\n');

  const die = ui.lastRoll == null ? 'D6: —' : `D6: ${escapeHTML(ui.lastRoll)}`;
  const steps = ui.remainingSteps > 0 ? `<span class="qworlox-steps">Steps: ${escapeHTML(ui.remainingSteps)}</span>` : '';
  const announcement = ui.announcement ? `<div class="qworlox-victory" role="status">${escapeHTML(ui.announcement)}</div>` : '';
  const phase = escapeHTML(ui.feedbackPhase ?? 'idle');

  return `<main class="qworlox-shell" data-interaction-locked="${ui.interactionLocked ? 'true' : 'false'}" data-feedback-phase="${phase}"><header class="qworlox-hud"><strong class="qworlox-turn">Turn: ${escapeHTML(String(ui.activeTeam).toUpperCase())}</strong><div class="qworlox-roll-state"><span>${die}</span>${steps}</div><button type="button" data-action="roll"${ui.interactionLocked ? ' disabled' : ''}>ROLL D6</button></header>${announcement}<div class="qworlox-arena">${reserve('blue')}<section class="qworlox-board" data-qworlox-board aria-label="Q'Worlox King Reach board"><div class="qworlox-route-layer" data-route-layer aria-hidden="true"></div>${nodes}</section>${reserve('red')}</div></main>`;
}

function label(value) { return String(value).replaceAll('_', ' '); }
function escapeHTML(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
