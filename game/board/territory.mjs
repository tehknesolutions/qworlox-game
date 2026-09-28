export function buildTerritoryGraph({ routeLength }) {
  if (!Number.isInteger(routeLength) || routeLength < 4 || routeLength % 2 !== 0) {
    throw new TypeError('routeLength must be an even integer >= 4');
  }

  const nodes = new Map();
  const adjacency = new Map();
  const half = routeLength / 2;

  const addNode = (id, type, team = null) => {
    nodes.set(id, { id, type, team });
    adjacency.set(id, []);
  };
  const connect = (from, to) => adjacency.get(from).push(to);

  addNode('blue-entry', 'ENTRY', 'blue');
  addNode('red-entry', 'ENTRY', 'red');
  addNode('center', 'CENTER');
  addNode('blue-goal', 'GOAL', 'blue');
  addNode('red-goal', 'GOAL', 'red');

  // Each approach contains half - 1 lane nodes; the shared center is the
  // exact midpoint of the movement path.
  for (const team of ['blue', 'red']) {
    for (let index = 1; index < half; index += 1) {
      addNode(`${team}-${index}`, 'LANE', team);
    }
    connect(`${team}-entry`, `${team}-1`);
    for (let index = 1; index < half - 1; index += 1) {
      connect(`${team}-${index}`, `${team}-${index + 1}`);
    }
    connect(`${team}-${half - 1}`, 'center');
  }

  // After the shared center, a team crosses the opponent-facing half toward
  // the opposing upper territory.
  connect('center', `red-${half - 1}`);
  connect('center', `blue-${half - 1}`);

  for (let index = half - 1; index > 1; index -= 1) {
    connect(`blue-${index}`, `blue-${index - 1}`);
    connect(`red-${index}`, `red-${index - 1}`);
  }

  connect('blue-1', 'blue-goal');
  connect('red-1', 'red-goal');

  return { nodes, adjacency, routeLength, half };
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
