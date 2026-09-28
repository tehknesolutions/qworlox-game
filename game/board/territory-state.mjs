import { buildTerritoryGraph } from './territory.mjs';

export function createTerritoryState({ routeLength }) {
  const graph = buildTerritoryGraph({ routeLength });
  const control = {};
  for (const [nodeId, node] of graph.nodes) {
    control[nodeId] = node.type === 'CENTER' ? null : node.team;
  }
  return { graph, control };
}

export function territoryAtNode(state, nodeId) {
  const node = state.graph.nodes.get(nodeId);
  if (!node) throw new Error(`unknown territory node: ${nodeId}`);
  return { ...node, controller: state.control[nodeId] ?? null };
}

export function setTerritoryControl(state, { nodeId, team }) {
  if (!state.graph.nodes.has(nodeId)) throw new Error(`unknown territory node: ${nodeId}`);
  if (team !== 'blue' && team !== 'red' && team !== null) throw new TypeError('team must be blue, red or null');
  const next = structuredClone(state);
  next.control[nodeId] = team;
  return next;
}
