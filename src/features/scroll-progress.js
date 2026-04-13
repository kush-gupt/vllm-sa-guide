import { subscribe } from '../utils/scroll-bus.js';

export function init() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
  }

  subscribe(update);
  update();
}
