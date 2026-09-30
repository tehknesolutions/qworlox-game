import { createBrowserController } from './playable-browser-controller.mjs';

const root = document.querySelector('#qworlox-app');
const controller = createBrowserController();
let message = 'Select a piece from the active team.';
let feedback = { kind: 'idle', text: '' };

function render() {
  const view = controller.view();
  const feedbackMarkup = feedback.text ? `<div class="qworlox-interaction-feedback qworlox-interaction-feedback--${feedback.kind}" data-interaction-feedback role="alert" aria-live="polite">${escapeHTML(feedback.text)}</div>` : '<div class="qworlox-interaction-feedback" data-interaction-feedback aria-live="polite"></div>';
  root.innerHTML = `${view.html}${feedbackMarkup}<p class="qworlox-message" role="status" aria-live="polite">${escapeHTML(message)}</p>`;
}

root.addEventListener('click', async event => {
  const piece = event.target.closest('[data-character-id]'); const roll = event.target.closest('[data-action="roll"]'); const legalNode = event.target.closest('[data-legal-choice="true"]');
  const restart = event.target.closest('[data-action="restart"]'); const copySeed = event.target.closest('[data-action="copy-seed"]');
  feedback = { kind: 'idle', text: '' };
  try {
    if (restart) { controller.restart(); message = 'New game started. Select a BLUE character.'; }
    else if (copySeed) { await copyText(copySeed.dataset.seed); feedback = { kind: 'success', text: 'Seed copied.' }; message = `Reproducibility seed: ${copySeed.dataset.seed}.`; }
    else if (piece) { controller.selectCharacter(piece.dataset.characterId); message = `Selected ${piece.dataset.characterId}.`; }
    else if (roll) { const result = controller.roll(); message = result.pendingSteps > 0 ? `Rolled ${result.roll}. Choose ${result.pendingSteps} move${result.pendingSteps === 1 ? '' : 's'}.` : `Rolled ${result.roll}.`; }
    else if (legalNode) { const result = controller.chooseNode(legalNode.dataset.nodeId); message = result.ui.announcement ?? (result.pendingSteps > 0 ? `Choose ${result.pendingSteps} more move${result.pendingSteps === 1 ? '' : 's'}.` : `Turn: ${result.ui.activeTeam.toUpperCase()}.`); }
  } catch (error) { feedback = { kind: 'error', text: error.message }; message = 'Action not applied. Choose a highlighted action and try again.'; }
  render();
});

render();
async function copyText(value) { if (!navigator.clipboard?.writeText) throw new Error('Clipboard is not available in this browser'); await navigator.clipboard.writeText(String(value)); }
function escapeHTML(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
