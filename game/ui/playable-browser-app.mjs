import { createBrowserController } from './playable-browser-controller.mjs';
import { copySeedText } from './copy-seed.mjs';
import { createRestartGuard } from './restart-guard.mjs';

const root = document.querySelector('#qworlox-app');
const controller = createBrowserController();
const restartGuard = createRestartGuard({ restart: () => controller.restart() });
let message = 'Select a piece from the active team.';
let feedback = { kind: 'idle', text: '' };

function render() {
  const view = controller.view(); const modalOpen = restartGuard.blocksInteraction();
  const feedbackMarkup = feedback.text ? `<div class="qworlox-interaction-feedback qworlox-interaction-feedback--${feedback.kind}" data-interaction-feedback role="alert" aria-live="polite">${escapeHTML(feedback.text)}</div>` : '<div class="qworlox-interaction-feedback" data-interaction-feedback aria-live="polite"></div>';
  const restartConfirmation = modalOpen ? '<div class="qworlox-restart-confirm" data-restart-confirm role="alertdialog" aria-modal="true" aria-label="Confirm new game"><strong>Start a new game?</strong><span>Current match, log and metrics will be cleared.</span><button type="button" data-action="confirm-restart">CONFIRM</button><button type="button" data-action="cancel-restart">CANCEL</button></div>' : '';
  root.innerHTML = `<div data-game-surface${modalOpen ? ' inert aria-hidden="true"' : ''}>${view.html}</div>${restartConfirmation}${feedbackMarkup}<p class="qworlox-message" role="status" aria-live="polite">${escapeHTML(message)}</p>`;
}

root.addEventListener('click', async event => {
  const piece = event.target.closest('[data-character-id]'); const roll = event.target.closest('[data-action="roll"]'); const legalNode = event.target.closest('[data-legal-choice="true"]');
  const restart = event.target.closest('[data-action="restart"]'); const confirmRestart = event.target.closest('[data-action="confirm-restart"]'); const cancelRestart = event.target.closest('[data-action="cancel-restart"]'); const copySeed = event.target.closest('[data-action="copy-seed"]');
  feedback = { kind: 'idle', text: '' };
  try {
    if (confirmRestart) { restartGuard.confirm(); message = 'New game started. Select a BLUE character.'; feedback = { kind: 'success', text: 'New game started.' }; }
    else if (cancelRestart) { restartGuard.cancel(); message = 'New game cancelled. Current match preserved.'; feedback = { kind: 'info', text: 'Current match preserved.' }; }
    else if (restartGuard.blocksInteraction()) { feedback = { kind: 'info', text: 'Confirm or cancel NEW GAME before continuing.' }; }
    else if (restart) { restartGuard.request(); message = 'Confirm NEW GAME or cancel to keep this match.'; feedback = { kind: 'info', text: 'New game requires confirmation.' }; }
    else if (copySeed) { const seed = copySeed.dataset.seed; const result = await copySeedText(seed); feedback = result.copied ? { kind: 'success', text: 'Seed copied.' } : { kind: 'info', text: 'Clipboard unavailable — copy the visible seed manually.' }; message = `Reproducibility seed: ${seed}.`; }
    else if (piece) { controller.selectCharacter(piece.dataset.characterId); message = `Selected ${piece.dataset.characterId}.`; }
    else if (roll) { const result = controller.roll(); message = result.pendingSteps > 0 ? `Rolled ${result.roll}. Choose ${result.pendingSteps} move${result.pendingSteps === 1 ? '' : 's'}.` : `Rolled ${result.roll}.`; }
    else if (legalNode) { const result = controller.chooseNode(legalNode.dataset.nodeId); message = result.ui.announcement ?? (result.pendingSteps > 0 ? `Choose ${result.pendingSteps} more move${result.pendingSteps === 1 ? '' : 's'}.` : `Turn: ${result.ui.activeTeam.toUpperCase()}.`); }
  } catch (error) { feedback = { kind: 'error', text: error.message }; message = 'Action not applied. Choose a highlighted action and try again.'; }
  render();
});

render();
function escapeHTML(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
