import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { compareBaselineVersions } from './structural-version-compare.mjs';
import { parseCompareArgs, formatVersionComparison } from './compare-structural-baselines.mjs';

const args = parseCompareArgs(process.argv.slice(2));
const registryUrl = new URL('./baselines/king-reach-playable-v1.registry.json', import.meta.url);
const registry = parsePersistedBaselineRegistry(await readFile(fileURLToPath(registryUrl), 'utf8'));
const result = compareBaselineVersions(registry, args.from, args.to);
process.stdout.write(formatVersionComparison(result));
