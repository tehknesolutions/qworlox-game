import { createStructuralBaselineSnapshot } from './structural-baseline-snapshot.mjs';
import { registerBaseline } from './structural-baseline-registry.mjs';

export function captureStructuralBaseline(registry, version, analysis) {
  if (!version) throw new TypeError('baseline version is required');
  if (analysis?.boardId !== registry?.boardId) throw new Error(`boardId mismatch: expected ${registry?.boardId ?? 'missing'}, got ${analysis?.boardId ?? 'missing'}`);
  const snapshot = { ...createStructuralBaselineSnapshot(analysis), baselineVersion: version };
  const nextRegistry = registerBaseline(registry, version, snapshot);
  return { snapshot: structuredClone(nextRegistry.baselines[version]), registry: nextRegistry };
}
