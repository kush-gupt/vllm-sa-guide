export function init() {
  const el = document.getElementById('hero-desc');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const raw = el.textContent.trim();
  const segments = raw.split(/(\s+)/);

  el.innerHTML = '';
  el.dataset.typewriter = 'active';

  const wordSpans = [];
  segments.forEach(seg => {
    if (/^\s+$/.test(seg)) {
      el.appendChild(document.createTextNode(' '));
    } else {
      const span = document.createElement('span');
      span.className = 'tw-word';
      span.textContent = seg;
      el.appendChild(span);
      wordSpans.push(span);
    }
  });

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.appendChild(cursor);

  const parent = el.closest('.reveal');

  function startTyping() {
    let i = 0;
    const BASE = 55;

    function next() {
      if (i >= wordSpans.length) {
        cursor.classList.add('tw-cursor-done');
        return;
      }
      wordSpans[i].classList.add('tw-visible');
      wordSpans[i].after(cursor);
      i++;

      const prev = wordSpans[i - 1].textContent;
      const pause = /[.!?—]$/.test(prev) ? 180 : 0;
      setTimeout(next, BASE + pause + (Math.random() * 30 - 15));
    }

    next();
  }

  function waitForReveal() {
    if (parent && !parent.classList.contains('visible')) {
      const obs = new MutationObserver(() => {
        if (parent.classList.contains('visible')) {
          obs.disconnect();
          setTimeout(startTyping, 800);
        }
      });
      obs.observe(parent, { attributes: true, attributeFilter: ['class'] });
    } else {
      setTimeout(startTyping, 800);
    }
  }

  waitForReveal();
}
