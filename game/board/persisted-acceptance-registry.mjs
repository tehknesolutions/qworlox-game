export function parsePersistedAcceptanceRegistry(text) {
  const registry = JSON.parse(text);
  if (registry?.schemaVersion !== 1) throw new Error('schemaVersion must be 1');
  if (!registry.boardId) throw new Error('boardId is required');
  if (!Array.isArray(registry.versions)) throw new Error('versions must be an array');
  if (!registry.acceptances || typeof registry.acceptances !== 'object') throw new Error('acceptances must be an object');
  for (const version of registry.versions) {
    const acceptance = registry.acceptances[version];
    if (!acceptance) throw new Error(`missing acceptance for version: ${version}`);
    if (acceptance.boardId !== registry.boardId) throw new Error(`boardId mismatch in acceptance: ${version}`);
    if (acceptance.baselineVersion !== version) throw new Error(`baselineVersion mismatch in acceptance: ${version}`);
  }
  return structuredClone(registry);
}
