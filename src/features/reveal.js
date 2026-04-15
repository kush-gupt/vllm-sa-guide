let _revealObserver = null;
let _staggerObserver = null;

const STAGGER_GRID_SELECTORS = [
  '.coverage-grid', '.hw-grid', '.landscape-grid',
  '.discovery-grid', '.links-grid',
];

export function reobserve() {
  if (_revealObserver) {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.addEventListener('animationend', () => el.classList.add('done'), { once: true });
      _revealObserver.observe(el);
    });
  }
  if (_staggerObserver) {
    STAGGER_GRID_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const hasAnimated = Array.from(el.children).some(
          c => c.style.transition && c.style.opacity === '1'
        );
        if (!hasAnimated) _staggerObserver.observe(el);
      });
    });
  }
}

export function init() {
  const revealEls = document.querySelectorAll('.reveal');
  _revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          _revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => {
    el.addEventListener('animationend', () => el.classList.add('done'), { once: true });
    _revealObserver.observe(el);
  });

  _staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(18px)';
          child.style.transition = `opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
          });
        });
        _staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  STAGGER_GRID_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => _staggerObserver.observe(el));
  });
}
