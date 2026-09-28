export function renderPlayableHTML(ui) {
  if (!ui || !Array.isArray(ui.nodes) || !Array.isArray(ui.pieces)) {
    throw new TypeError('invalid playable UI projection');
  }

  const legal = new Set(ui.legalNextNodes ?? []);
  const piecesByNode = new Map();
  for (const piece of ui.pieces) {
    if (!piece.nodeId) continue;
    const bucket = piecesByNode.get(piece.nodeId) ?? [];
    bucket.push(piece);
    piecesByNode.set(piece.nodeId, bucket);
  }

  const nodes = ui.nodes.map(node => {
    const objective = node.objective?.type === 'KING'
      ? `<span class="qworlox-king">KING · ${escapeHTML(node.objective.team.toUpperCase())}</span>`
      : '';
    const pieces = (piecesByNode.get(node.id) ?? []).map(piece =>
      `<button class="qworlox-piece qworlox-piece--${escapeHTML(piece.team)}" data-character-id="${escapeHTML(piece.id)}" data-team="${escapeHTML(piece.team)}">${escapeHTML(piece.id)}</button>`
    ).join('');
    const legalAttribute = legal.has(node.id) ? ' data-legal-choice="true"' : '';

    return `<div class="qworlox-node qworlox-node--${escapeHTML(node.region.toLowerCase().replaceAll('_', '-'))}" data-node-id="${escapeHTML(node.id)}"${legalAttribute}>
      <span class="qworlox-node__region">${escapeHTML(label(node.region))}</span>
      ${objective}
      <div class="qworlox-node__pieces">${pieces}</div>
    </div>`;
  }).join('\n');

  const announcement = ui.announcement
    ? `<div class="qworlox-victory" role="status">${escapeHTML(ui.announcement)}</div>`
    : '';

  return `<main class="qworlox-shell" data-interaction-locked="${ui.interactionLocked ? 'true' : 'false'}">
    <header class="qworlox-hud">
      <strong class="qworlox-turn">Turn: ${escapeHTML(String(ui.activeTeam).toUpperCase())}</strong>
      <button type="button" data-action="roll"${ui.interactionLocked ? ' disabled' : ''}>ROLL D6</button>
    </header>
    ${announcement}
    <section class="qworlox-board" data-qworlox-board aria-label="Q'Worlox King Reach board">
      ${nodes}
    </section>
  </main>`;
}

function label(value) {
  return String(value).replaceAll('_', ' ');
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
