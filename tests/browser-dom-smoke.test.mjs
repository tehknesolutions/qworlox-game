import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createBrowserController } from '../game/ui/playable-browser-controller.mjs';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../game/ui/playable-browser-app.mjs', import.meta.url), 'utf8');

test('browser entrypoint mounts the playable app and delegates click interactions', () => {
  assert.match(index, /id="qworlox-app"/);
  assert.match(index, /playable-browser-app\.mjs/);
  assert.match(app, /querySelector\('#qworlox-app'\)/);
  assert.match(app, /addEventListener\('click'/);
  assert.match(app, /data-character-id/);
  assert.match(app, /data-action="roll"/);
  assert.match(app, /data-legal-choice="true"/);
});

test('browser-rendered controller contract exposes initial interaction affordances', () => {
  const controller = createBrowserController({ random: () => 0.99 });
  const initial = controller.view();

  assert.match(initial.html, /data-character-id="blue-1"/);
  assert.match(initial.html, /data-action="roll"/);
  assert.equal(initial.ui.activeTeam, 'blue');
  assert.equal(initial.ui.interactionLocked, false);
});

test('browser controller renders movement choices after a routed piece rolls', () => {
  const rolls = [0.99, 0.99, 0.2];
  const controller = createBrowserController({ random: () => rolls.shift() ?? 0 });

  controller.selectCharacter('blue-1');
  controller.roll();
  controller.selectCharacter('red-1');
  controller.roll();
  controller.selectCharacter('blue-1');
  const moving = controller.roll();

  assert.equal(moving.pendingSteps, 2);
  assert.match(moving.html, /data-legal-choice="true"/);
  assert.match(moving.html, /blue-approach/);
});
