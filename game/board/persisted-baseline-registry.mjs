export function parsePersistedBaselineRegistry(text) {
  const registry = JSON.parse(text);
  if (registry?.schemaVersion !== 1) throw new Error('schemaVersion must be 1');
  if (!registry.boardId) throw new Error('boardId is required');
  if (!Array.isArray(registry.versions)) throw new Error('versions must be an array');
  if (!registry.baselines || typeof registry.baselines !== 'object') throw new Error('baselines must be an object');
  for (const version of registry.versions) {
    const baseline = registry.baselines[version];
    if (!baseline) throw new Error(`missing baseline for version: ${version}`);
    if (baseline.boardId !== registry.boardId) throw new Error(`boardId mismatch in baseline: ${version}`);
  }
  return structuredClone(registry);
}
