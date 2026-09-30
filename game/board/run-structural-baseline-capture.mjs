import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { generateStructuralReport } from './generate-structural-report.mjs';
import { parsePersistedBaselineRegistry } from './persisted-baseline-registry.mjs';
import { captureStructuralBaseline } from './structural-baseline-capture.mjs';
import { parseCaptureArgs, serializeBaselineRegistry } from './capture-structural-baseline-cli.mjs';

const { version } = parseCaptureArgs(process.argv.slice(2));
const registryUrl = new URL('./baselines/king-reach-playable-v1.registry.json', import.meta.url);
const registryPath = fileURLToPath(registryUrl);
const temporaryPath = `${registryPath}.tmp`;
const registry = parsePersistedBaselineRegistry(await readFile(registryPath, 'utf8'));
const generated = generateStructuralReport();
const captured = captureStructuralBaseline(registry, version, { boardId: generated.boardId, ...generated.analysis });

await writeFile(temporaryPath, serializeBaselineRegistry(captured.registry), { encoding: 'utf8', flag: 'wx' });
try {
  await rename(temporaryPath, registryPath);
} catch (error) {
  try { await import('node:fs/promises').then(fs => fs.unlink(temporaryPath)); } catch {}
  throw error;
}
process.stdout.write(`STRUCTURAL_BASELINE_CAPTURED=${version}\n`);
