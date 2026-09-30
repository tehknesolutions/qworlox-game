import test from 'node:test';
import assert from 'node:assert/strict';
import { restartModalKeyAction } from '../game/ui/restart-modal-keyboard.mjs';

test('Escape cancels restart confirmation', () => {
  assert.equal(restartModalKeyAction({ key: 'Escape', pending: true }), 'cancel');
});

test('Enter confirms restart when confirmation is pending', () => {
  assert.equal(restartModalKeyAction({ key: 'Enter', pending: true }), 'confirm');
});

test('keyboard shortcuts do nothing when modal is closed', () => {
  assert.equal(restartModalKeyAction({ key: 'Escape', pending: false }), null);
  assert.equal(restartModalKeyAction({ key: 'Enter', pending: false }), null);
});

test('unrelated keys do not mutate restart state', () => {
  assert.equal(restartModalKeyAction({ key: 'ArrowRight', pending: true }), null);
});
