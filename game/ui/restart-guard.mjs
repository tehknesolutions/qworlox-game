export function createRestartGuard({ restart }) {
  if (typeof restart !== 'function') throw new TypeError('restart function is required');
  let pending = false;
  return {
    request() { pending = true; return { pending, restarted: false }; },
    confirm() { if (!pending) return { pending: false, restarted: false }; restart(); pending = false; return { pending, restarted: true }; },
    cancel() { pending = false; return { pending, restarted: false }; },
    isPending() { return pending; }
  };
}
