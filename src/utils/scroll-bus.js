const subscribers = [];
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    for (let i = 0; i < subscribers.length; i++) subscribers[i]();
    ticking = false;
  });
}

let listening = false;

export function subscribe(fn) {
  subscribers.push(fn);
  if (!listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }
}
