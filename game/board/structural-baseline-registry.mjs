export function createBaselineRegistry(boardId) {
  if (!boardId) throw new TypeError('boardId is required');
  return { schemaVersion: 1, boardId, versions: [], baselines: {} };
}

export function registerBaseline(registry, version, snapshot) {
  if (!version) throw new TypeError('baseline version is required');
  if (registry.baselines?.[version]) throw new Error(`baseline version already exists: ${version}`);
  if (snapshot?.boardId !== registry.boardId) throw new Error(`boardId mismatch: expected ${registry.boardId}, got ${snapshot?.boardId ?? 'missing'}`);
  const next = structuredClone(registry);
  next.versions.push(version);
  next.baselines[version] = structuredClone({ ...snapshot, baselineVersion: version });
  return next;
}

export function selectBaseline(registry, version) {
  const snapshot = registry?.baselines?.[version];
  if (!snapshot) throw new Error(`unknown baseline version: ${version}`);
  return structuredClone(snapshot);
}

export function latestBaseline(registry) {
  const version = registry?.versions?.at(-1);
  return version ? selectBaseline(registry, version) : null;
}
