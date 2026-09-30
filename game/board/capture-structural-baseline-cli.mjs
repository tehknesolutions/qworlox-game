export function parseCaptureArgs(args) {
  const index = args.indexOf('--version');
  const version = index >= 0 ? args[index + 1] : null;
  if (!version) throw new Error('--version baseline version is required');
  return { version };
}

export function serializeBaselineRegistry(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}
