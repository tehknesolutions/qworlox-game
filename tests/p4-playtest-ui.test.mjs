import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

test('P4 UI exposes new game, reproducibility seed and compact metrics', () => {
  const controller = createBrowserController({ random: () => 0.99, seed: 'session-42' });
  const { html } = controller.view();
  assert.match(html, /data-action="restart"/);
  assert.match(html, /data-playtest-seed="session-42"/);
  assert.match(html, /data-action="copy-seed"/);
  assert.match(html, /data-playtest-metrics/);
  assert.match(html, /Rolls:\s*0/);
  assert.match(html, /Turns:\s*0/);
});
