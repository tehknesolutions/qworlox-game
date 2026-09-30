import { createPlayableMatch, playTurn } from '../core/playable-match.mjs';
import { projectPlayableUI } from './playable-ui-model.mjs';
import { renderPlayableHTML } from './playable-ui-render.mjs';

export function createBrowserController({ random = Math.random, seed = 'unseeded' } = {}) {
  let match;
  let selectedCharacterId;
  let pendingRoll;
  let lastRoll;
  let pendingChoices;
  let pendingNodeId;
  let feedbackPhase;
  let currentMoveNodeId;
  let matchLog;
  let metrics;

  function resetSession() {
    match = createPlayableMatch();
    selectedCharacterId = null; pendingRoll = null; lastRoll = null; pendingChoices = []; pendingNodeId = null;
    feedbackPhase = 'idle'; currentMoveNodeId = null; matchLog = [];
    metrics = { rolls: 0, turnsCompleted: 0, encounters: 0, combats: 0, victory: null };
  }
  resetSession();

  function log(entry) { matchLog.push(entry); }
  function syncMetricsFromTurn(previousEventCount) {
    const events = match.game.events.slice(previousEventCount);
    metrics.encounters += events.filter(event => event.type === 'ENCOUNTER').length;
    metrics.combats += events.filter(event => event.type === 'COMBAT_RESOLVED').length;
    metrics.turnsCompleted += 1;
    metrics.victory = match.game.winner ?? null;
  }
  function view() {
    const ui = projectPlayableUI(match, { selectedCharacterId });
    const remainingSteps = pendingRoll === null ? 0 : pendingRoll - pendingChoices.length;
    ui.lastRoll = lastRoll; ui.remainingSteps = remainingSteps; ui.feedbackPhase = match.game.winner ? 'victory' : feedbackPhase;
    ui.currentMoveNodeId = currentMoveNodeId; ui.matchLog = [...matchLog];
    ui.playtest = { seed: String(seed), ...metrics };
    if (pendingRoll !== null && pendingNodeId) ui.legalNextNodes = [...new Set(match.graph.adjacency.get(pendingNodeId) ?? [])];
    return { ui, html: renderPlayableHTML(ui), roll: pendingRoll ?? lastRoll, pendingSteps: remainingSteps };
  }
  function selectCharacter(characterId) {
    if (match.game.winner) throw new Error('game is already complete');
    const team = match.game.activeTeam; const character = match.game.teams[team].characters.find(item => item.id === characterId);
    if (!character) throw new Error('character must belong to active team');
    if (pendingRoll !== null) throw new Error('cannot change character during pending movement');
    selectedCharacterId = characterId; feedbackPhase = 'selected'; currentMoveNodeId = character.nodeId ?? null; log(`${characterId.toUpperCase()} selected`); return view();
  }
  function roll() {
    if (!selectedCharacterId) throw new Error('select a character before rolling');
    if (pendingRoll !== null) throw new Error('roll already pending');
    const value = Math.floor(normalizeRandom(random()) * 6) + 1; metrics.rolls += 1; lastRoll = value;
    const team = match.game.activeTeam; const character = match.game.teams[team].characters.find(item => item.id === selectedCharacterId); log(`${selectedCharacterId.toUpperCase()} rolled ${value}`);
    if (character.status === 'base') {
      const beforeNode = character.nodeId; const previousEventCount = match.game.events.length;
      match = playTurn(match, { characterId: selectedCharacterId, roll: value }); syncMetricsFromTurn(previousEventCount);
      const after = match.game.teams[team].characters.find(item => item.id === selectedCharacterId);
      if (beforeNode !== after.nodeId && after.nodeId) log(`${selectedCharacterId.toUpperCase()} entered route at ${after.nodeId}`);
      selectedCharacterId = null; currentMoveNodeId = null; feedbackPhase = match.game.winner ? 'victory' : 'turn-changed';
      if (match.game.winner) log(`KING REACHED — ${match.game.winner.toUpperCase()} WINS`); else log(`Turn ${match.game.activeTeam.toUpperCase()}`); return view();
    }
    pendingRoll = value; pendingChoices = []; pendingNodeId = character.nodeId; currentMoveNodeId = character.nodeId; feedbackPhase = 'rolled'; return view();
  }
  function chooseNode(nodeId) {
    if (pendingRoll === null || !selectedCharacterId || !pendingNodeId) throw new Error('no movement is pending');
    const neighbors = match.graph.adjacency.get(pendingNodeId) ?? []; if (!neighbors.includes(nodeId)) throw new Error(`illegal graph move: ${pendingNodeId} -> ${nodeId}`);
    pendingChoices.push(nodeId); pendingNodeId = nodeId; currentMoveNodeId = nodeId; feedbackPhase = 'moving'; log(`${selectedCharacterId.toUpperCase()} chose ${nodeId}`);
    if (pendingChoices.length < pendingRoll) return view();
    const movingCharacterId = selectedCharacterId; const previousEventCount = match.game.events.length;
    match = playTurn(match, { characterId: movingCharacterId, roll: pendingRoll, choices: [...pendingChoices] }); syncMetricsFromTurn(previousEventCount);
    selectedCharacterId = null; pendingRoll = null; pendingChoices = []; pendingNodeId = null; currentMoveNodeId = null; feedbackPhase = match.game.winner ? 'victory' : 'turn-changed';
    if (match.game.winner) log(`KING REACHED — ${match.game.winner.toUpperCase()} WINS`); else log(`Turn ${match.game.activeTeam.toUpperCase()}`); return view();
  }
  function restart() { resetSession(); return view(); }
  return { view, selectCharacter, roll, chooseNode, restart, debugMatch: () => match };
}
function normalizeRandom(value) { if (!Number.isFinite(value)) throw new TypeError('random must return a finite number'); return Math.max(0, Math.min(0.999999999999, value)); }
