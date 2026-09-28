export function buildMovementPath({ routeLength, team }) {
  assertTeam(team);
  assertRoute(routeLength);

  const half = routeLength / 2;
  const path = [`${team}-entry`];
  for (let index = 1; index <= half; index += 1) path.push(`${team}-${index}`);
  path.push('center');

  const opponent = team === 'blue' ? 'red' : 'blue';
  for (let index = half; index >= 1; index -= 1) path.push(`${opponent}-${index}`);
  path.push(`${opponent}-goal`);

  // The shared center is counted once; routeLength represents movement steps.
  if (path.length !== routeLength + 1) {
    throw new Error(`movement path length mismatch for ${team}/${routeLength}`);
  }
  return path;
}

export function nodeAtStep({ routeLength, team, step }) {
  const path = buildMovementPath({ routeLength, team });
  if (!Number.isInteger(step) || step < 0 || step >= path.length) {
    throw new RangeError('step is outside the movement path');
  }
  return path[step];
}

function assertTeam(team) {
  if (team !== 'blue' && team !== 'red') throw new TypeError('team must be blue or red');
}

function assertRoute(routeLength) {
  if (!Number.isInteger(routeLength) || routeLength < 4 || routeLength % 2 !== 0) {
    throw new TypeError('routeLength must be an even integer >= 4');
  }
}
