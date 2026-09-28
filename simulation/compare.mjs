import { simulateBatch } from './simulator.mjs';

export function compareCandidates({ seed = 20260928, matches = 10000 } = {}) {
  return [18, 36, 72].map(routeLength =>
    simulateBatch({ routeLength, seed, matches })
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const matches = Number(process.argv[2] ?? 10000);
  const seed = Number(process.argv[3] ?? 20260928);
  const reports = compareCandidates({ seed, matches });
  console.log(JSON.stringify({ seed, matches, reports }, null, 2));
}
