export function resolveCardEffect({ card, context = {} }) {
  if (!card?.category) throw new TypeError('card category is required');

  const effect = card.effect;
  if (!effect?.type) {
    return { status: 'PENDING', category: card.category, commands: [] };
  }

  if (card.category === 'TERRITORY' && effect.type === 'CLAIM_CONTEXT_NODE') {
    if (!context.nodeId || !context.team) {
      throw new Error('territory effect requires nodeId and team context');
    }
    return {
      status: 'RESOLVED',
      category: card.category,
      commands: [{ type: 'SET_TERRITORY_CONTROL', nodeId: context.nodeId, team: context.team }]
    };
  }

  if (card.category === 'EVENT' && effect.type === 'EMIT_EVENT') {
    if (!effect.event) throw new Error('event effect requires an event id');
    return {
      status: 'RESOLVED',
      category: card.category,
      commands: [{ type: 'EMIT_GAME_EVENT', event: effect.event, sourceCardId: card.id }]
    };
  }

  return { status: 'PENDING', category: card.category, commands: [] };
}
