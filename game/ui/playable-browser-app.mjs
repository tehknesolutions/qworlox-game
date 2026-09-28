import { createBrowserController } from './playable-browser-controller.mjs';

const root = document.querySelector('#qworlox-app');
const controller = createBrowserController();
let message = 'Select a piece from the active team.';

function render() {
  const view = controller.view();
  root.innerHTML = `${view.html}<p class="qworlox-message" role="status">${message}</p>`;
}

root.addEventListener('click', event => {
  const piece = event.target.closest('[data-character-id]');
  const roll = event.target.closest('[data-action="roll"]');
  const legalNode = event.target.closest('[data-legal-choice="true"]');

  try {
    if (piece) {
      controller.selectCharacter(piece.dataset.characterId);
      message = `Selected ${piece.dataset.characterId}.`;
    } else if (roll) {
      const result = controller.roll();
      message = result.pendingSteps > 0
        ? `Rolled ${result.roll}. Choose ${result.pendingSteps} move${result.pendingSteps === 1 ? '' : 's'}.`
        : `Rolled ${result.roll}.`;
    } else if (legalNode) {
      const result = controller.chooseNode(legalNode.dataset.nodeId);
      message = result.ui.announcement ?? (result.pendingSteps > 0
        ? `Choose ${result.pendingSteps} more move${result.pendingSteps === 1 ? '' : 's'}.`
        : `Turn: ${result.ui.activeTeam.toUpperCase()}.`);
    }
  } catch (error) {
    message = error.message;
  }

  render();
});

render();
