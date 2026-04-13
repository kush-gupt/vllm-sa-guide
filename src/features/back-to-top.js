import { subscribe } from '../utils/scroll-bus.js';

export function init() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function toggle() {
    btn.classList.toggle('visible', window.scrollY > 600);
  }

  subscribe(toggle);
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
