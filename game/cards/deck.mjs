export const CARD_CATEGORIES = Object.freeze([
  'COMBAT',
  'TERRITORY',
  'EVENT',
  'TRAP',
  'EQUIPMENT',
  'ALLY',
  'MAGIC'
]);

const BASE_CARDS = CARD_CATEGORIES.map((category, index) => ({
  id: `qworlox-${category.toLowerCase()}-001`,
  category,
  name: `${category} 001`
}));

export function createDeckState() {
  return {
    categories: [...CARD_CATEGORIES],
    draw: structuredClone(BASE_CARDS),
    discard: [],
    hand: []
  };
}

export function drawCard(state) {
  if (!state.draw.length) throw new Error('shared draw pile is empty');
  const next = structuredClone(state);
  const card = next.draw.shift();
  next.hand.push(card);
  return { state: next, card };
}

export function playCard(state, { cardId, context = {} }) {
  const next = structuredClone(state);
  const index = next.hand.findIndex(card => card.id === cardId);
  if (index < 0) throw new Error(`card not in hand: ${cardId}`);
  const [card] = next.hand.splice(index, 1);
  next.discard.push(card);

  return {
    state: next,
    card,
    resolution: resolveCategory(card, context)
  };
}

function resolveCategory(card, context) {
  return {
    type: 'CARD_EFFECT_PENDING',
    category: card.category,
    context,
    effect: null
  };
}
