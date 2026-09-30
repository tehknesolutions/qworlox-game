export function nextRestartModalFocus({ current, count, shiftKey }) {
  if (!Number.isInteger(count) || count < 1) throw new Error('restart modal requires at least one focusable control');
  if (!Number.isInteger(current) || current < 0 || current >= count) current = 0;
  return shiftKey ? (current - 1 + count) % count : (current + 1) % count;
}
