const BOARD_TRIGGER_TYPES = new Set(['DRAW_CARD']);

export function buildBoardGraph(board) {
  const nodes = new Map();
  const forwardEdges = [];
  const lateralEdges = [];
  const adjacency = new Map();

  for (const lane of board.lanes) {
    for (const node of lane.nodes) {
      if (nodes.has(node.id)) throw new Error(`duplicate board node: ${node.id}`);
      const trigger = normalizeBoardTrigger(node.trigger);
      nodes.set(node.id, { ...node, trigger, laneId: lane.id });
      adjacency.set(node.id, []);
    }

    for (let index = 0; index < lane.nodes.length - 1; index += 1) {
      const from = lane.nodes[index].id;
      const to = lane.nodes[index + 1].id;
      const edge = { from, to, type: 'FORWARD' };
      forwardEdges.push(edge);
      adjacency.get(from).push(to);
    }
  }

  for (const edge of board.lateralEdges ?? []) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) {
      throw new Error(`lateral edge references unknown node: ${edge.from} -> ${edge.to}`);
    }
    lateralEdges.push({ ...edge, type: 'PARALLEL_LANE' });
    adjacency.get(edge.from).push(edge.to);
    if (edge.bidirectional !== false) adjacency.get(edge.to).push(edge.from);
  }

  return { nodes, forwardEdges, lateralEdges, adjacency };
}

function normalizeBoardTrigger(trigger) {
  if (trigger == null) return null;
  if (!trigger.type || !BOARD_TRIGGER_TYPES.has(trigger.type)) {
    throw new Error(`unknown board trigger: ${trigger.type ?? 'missing'}`);
  }
  return { ...trigger };
}

export function shortestPathLength(graph, start, goal) {
  if (!graph.nodes.has(start) || !graph.nodes.has(goal)) return Number.POSITIVE_INFINITY;
  const queue = [[start, 0]];
  const visited = new Set([start]);

  while (queue.length) {
    const [node, distance] = queue.shift();
    if (node === goal) return distance;
    for (const next of graph.adjacency.get(node) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, distance + 1]);
      }
    }
  }

  return Number.POSITIVE_INFINITY;
}
