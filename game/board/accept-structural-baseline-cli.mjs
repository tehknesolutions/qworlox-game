export function parseAcceptArgs(args) {
  const value = flag => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; };
  const version = value('--version');
  const sourceCommit = value('--source-commit');
  const acceptedBy = value('--accepted-by');
  if (!version) throw new Error('--version is required');
  if (!sourceCommit) throw new Error('--source-commit is required');
  if (!acceptedBy) throw new Error('--accepted-by is required');
  return { version, sourceCommit, acceptedBy };
}

export function serializeAcceptanceRegistry(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}
