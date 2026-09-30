export async function promoteCanonicalBaseline(declaration, version, verify) {
  if (!version) throw new TypeError('baseline version is required');
  if (typeof verify !== 'function') throw new TypeError('verify function is required');
  const verification = await verify(version);
  if (!verification?.ok) throw new Error(`canonical promotion rejected: ${verification?.reason ?? 'verification failed'}`);
  if (verification.baselineVersion !== version) throw new Error(`canonical promotion version mismatch: expected ${version}, got ${verification.baselineVersion ?? 'missing'}`);
  return {
    declaration: { ...structuredClone(declaration), canonicalVersion: version },
    verification: structuredClone(verification)
  };
}
