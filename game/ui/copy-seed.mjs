export async function copySeedText(text, { clipboard = globalThis.navigator?.clipboard ?? null } = {}) {
  if (!clipboard?.writeText) return { copied: false, method: 'manual' };
  try {
    await clipboard.writeText(String(text));
    return { copied: true, method: 'clipboard' };
  } catch {
    return { copied: false, method: 'manual' };
  }
}
