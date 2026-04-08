const crossfadeTimers = new WeakMap();

export function crossfade(container, renderFn) {
  if (!container) { renderFn(); return; }
  const prev = crossfadeTimers.get(container);
  if (prev) clearTimeout(prev);
  container.setAttribute('data-transitioning', '');
  const tid = setTimeout(() => {
    renderFn();
    requestAnimationFrame(() => {
      container.removeAttribute('data-transitioning');
    });
  }, 220);
  crossfadeTimers.set(container, tid);
}

export function crossfadeMulti(containers, renderFn) {
  containers.forEach(c => { if (c) c.setAttribute('data-transitioning', ''); });
  setTimeout(() => {
    renderFn();
    requestAnimationFrame(() => {
      containers.forEach(c => { if (c) c.removeAttribute('data-transitioning'); });
    });
  }, 220);
}
