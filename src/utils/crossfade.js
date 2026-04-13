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

export function crossfadeText(el, content, html = false, duration = 150) {
  if (!el) return;
  const cur = html ? el.innerHTML : el.textContent;
  if (cur === content) return;

  const prev = crossfadeTimers.get(el);
  if (prev) clearTimeout(prev);

  el.classList.add('fading');
  const tid = setTimeout(() => {
    if (html) el.innerHTML = content;
    else el.textContent = content;
    el.classList.remove('fading');
    crossfadeTimers.delete(el);
  }, duration);
  crossfadeTimers.set(el, tid);
}
