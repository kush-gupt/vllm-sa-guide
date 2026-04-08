/** Bind tooltip behavior to abbr[data-tip] inside root that are not already bound. */
export function bindAbbrTips(root = document) {
  const abbrs = root.querySelectorAll('abbr[data-tip]:not(.jargon-term)');
  if (!abbrs.length) return;

  abbrs.forEach(el => {
    const tip = document.createElement('span');
    tip.className = 'jargon-tip';
    tip.textContent = el.dataset.tip;
    tip.setAttribute('role', 'tooltip');
    tip.id = 'tip-' + Math.random().toString(36).slice(2, 8);

    el.classList.add('jargon-term');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-describedby', tip.id);
    document.body.appendChild(tip);

    const show = () => {
      tip.style.display = 'block';
      const er = el.getBoundingClientRect();
      const tr = tip.getBoundingClientRect();
      let left = er.left + er.width / 2 - tr.width / 2 + window.scrollX;
      left = Math.max(8, Math.min(left, window.innerWidth + window.scrollX - tr.width - 8));
      tip.style.left = left + 'px';
      tip.style.top = (er.top - tr.height - 8 + window.scrollY) + 'px';
    };

    const hide = () => { tip.style.display = ''; };

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', show);
    el.addEventListener('blur', hide);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { hide(); el.blur(); }
    });
  });
}

export function init() {
  bindAbbrTips(document);
}
