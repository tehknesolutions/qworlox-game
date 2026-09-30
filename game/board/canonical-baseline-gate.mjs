export async function resolveCanonicalBaselineGate({ canonicalVersion, verify }) {
  if (!canonicalVersion) return { ok: true, status: 'SKIPPED', reason: 'NO_CANONICAL_BASELINE' };
  if (typeof verify !== 'function') throw new TypeError('verify function is required when canonical baseline is declared');
  const result = await verify(canonicalVersion);
  return result.ok
    ? { ...result, status: 'VERIFIED' }
    : { ...result, status: 'FAILED' };
}
