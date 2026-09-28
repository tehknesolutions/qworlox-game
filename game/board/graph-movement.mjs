export function advanceOnGraph(graph, { startNodeId, steps, choices = [] }) {
  if (!graph?.nodes?.has(startNodeId)) throw new Error(`unknown start node: ${startNodeId}`);
  if (!Number.isInteger(steps) || steps < 0) throw new TypeError('steps must be a non-negative integer');
  if (!Array.isArray(choices)) throw new TypeError('choices must be an array');

  const path = [startNodeId];
  let current = startNodeId;

  for (let step = 0; step < steps; step += 1) {
    const node = graph.nodes.get(current);
    if (node?.objective?.type === 'KING') throw new Error('cannot move beyond KING objective');

    const neighbors = [...new Set(graph.adjacency.get(current) ?? [])];
    if (neighbors.length === 0) throw new Error(`no graph move available from ${current}`);

    const requested = choices[step];
    let next;

    if (requested != null) {
      if (!neighbors.includes(requested)) throw new Error(`illegal graph move: ${current} -> ${requested}`);
      next = requested;
    } else if (neighbors.length === 1) {
      next = neighbors[0];
    } else {
      throw new Error(`movement choice required from ${current}`);
    }

    path.push(next);
    current = next;
  }

  return { nodeId: current, path };
}
