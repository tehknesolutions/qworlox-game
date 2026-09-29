import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../game/ui/playable-browser-app.mjs', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../game/ui/playable.css', import.meta.url), 'utf8');

test('invalid browser actions surface a dedicated interaction-feedback state', () => {
  assert.match(app, /data-interaction-feedback/);
  assert.match(app, /interaction-feedback--error/);
  assert.match(app, /role="alert"/);
});

test('browser interaction feedback remains live and non-authoritative', () => {
  assert.match(app, /aria-live="polite"/);
  assert.match(app, /controller\.selectCharacter/);
  assert.match(app, /controller\.chooseNode/);
});

test('visual movement feedback is non-authoritative and reduced-motion safe', () => {
  assert.match(css, /data-feedback-phase="moving"/);
  assert.match(css, /data-feedback-phase="turn-changed"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('terminal lock remains explicit in the player-facing layer', () => {
  assert.match(app, /interactionLocked/);
  assert.match(css, /data-interaction-locked/);
  assert.match(css, /data-action="roll"\]:disabled/);
});
