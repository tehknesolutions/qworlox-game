export function restartModalKeyAction({ key, pending }) {
  if (!pending) return null;
  if (key === 'Escape') return 'cancel';
  if (key === 'Enter') return 'confirm';
  return null;
}
