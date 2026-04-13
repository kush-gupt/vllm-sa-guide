export function initRovingTabindex(container, buttons, onActivate) {
  container.addEventListener('keydown', (e) => {
    const btns = Array.from(buttons);
    const idx = btns.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % btns.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + btns.length) % btns.length;
    if (next !== -1) { e.preventDefault(); btns[next].focus(); onActivate(btns[next]); }
  });
}
