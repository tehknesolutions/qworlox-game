import { createPlayableMatch, playTurn } from '../core/playable-match.mjs';
import { projectPlayableUI } from './playable-ui-model.mjs';
import { renderPlayableHTML } from './playable-ui-render.mjs';

export function createBrowserController({ random = Math.random } = {}) {
  let match = createPlayableMatch();
  let selectedCharacterId = null;
  let pendingRoll = null;
  let pendingChoices = [];
  let pendingNodeId = null;

  function view() {
    const ui = projectPlayableUI(match, { selectedCharacterId });
    if (pendingRoll !== null && pendingNodeId) {
      ui.legalNextNodes = [...new Set(match.graph.adjacency.get(pendingNodeId) ?? [])];
    }
    return {
      ui,
      html: renderPlayableHTML(ui),
      roll: pendingRoll,
      pendingSteps: pendingRoll === null ? 0 : pendingRoll - pendingChoices.length
    };
  }

  function selectCharacter(characterId) {
    if (match.game.winner) throw new Error('game is already complete');
    const team = match.game.activeTeam;
    const character = match.game.teams[team].characters.find(item => item.id === characterId);
    if (!character) throw new Error('character must belong to active team');
    if (pendingRoll !== null) throw new Error('cannot change character during pending movement');
    selectedCharacterId = characterId;
    return view();
  }

  function roll() {
    if (!selectedCharacterId) throw new Error('select a character before rolling');
    if (pendingRoll !== null) throw new Error('roll already pending');

    const value = Math.floor(normalizeRandom(random()) * 6) + 1;
    const team = match.game.activeTeam;
    const character = match.game.teams[team].characters.find(item => item.id === selectedCharacterId);

    if (character.status === 'base') {
      match = playTurn(match, { characterId: selectedCharacterId, roll: value });
      selectedCharacterId = null;
      return { ...view(), roll: value };
    }

    pendingRoll = value;
    pendingChoices = [];
    pendingNodeId = character.nodeId;
    return view();
  }

  function chooseNode(nodeId) {
    if (pendingRoll === null || !selectedCharacterId || !pendingNodeId) {
      throw new Error('no movement is pending');
    }

    const neighbors = match.graph.adjacency.get(pendingNodeId) ?? [];
    if (!neighbors.includes(nodeId)) throw new Error(`illegal graph move: ${pendingNodeId} -> ${nodeId}`);

    pendingChoices.push(nodeId);
    pendingNodeId = nodeId;

    if (pendingChoices.length < pendingRoll) return view();

    const completedRoll = pendingRoll;
    match = playTurn(match, {
      characterId: selectedCharacterId,
      roll: completedRoll,
      choices: [...pendingChoices]
    });
    selectedCharacterId = null;
    pendingRoll = null;
    pendingChoices = [];
    pendingNodeId = null;
    return view();
  }

  return {
    view,
    selectCharacter,
    roll,
    chooseNode,
    debugMatch: () => match
  };
}

function normalizeRandom(value) {
  if (!Number.isFinite(value)) throw new TypeError('random must return a finite number');
  return Math.max(0, Math.min(0.999999999999, value));
}
