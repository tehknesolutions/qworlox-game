import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../game/ui/playable.css', import.meta.url), 'utf8');

test('gameplay phases have explicit visual feedback', () => {
  assert.match(css, /data-feedback-phase="rolled"/);
  assert.match(css, /data-feedback-phase="moving"/);
  assert.match(css, /data-feedback-phase="turn-changed"/);
  assert.match(css, /data-feedback-phase="victory"/);
  assert.match(css, /data-current-move="true"/);
});

test('motion feedback respects reduced-motion preference', () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /animation-duration:\s*\.001ms\s*!important/);
  assert.match(css, /transition-duration:\s*\.001ms\s*!important/);
});
