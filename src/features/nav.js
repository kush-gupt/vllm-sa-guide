export function init() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'nav-links');
  navLinks.id = navLinks.id || 'nav-links';

  const focusableInNav = () => [
    navToggle,
    ...navLinks.querySelectorAll('a'),
    document.querySelector('.theme-toggle'),
  ].filter(Boolean);

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const els = focusableInNav();
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', trapFocus);
  }

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      document.addEventListener('keydown', trapFocus);
    } else {
      document.removeEventListener('keydown', trapFocus);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  const sections = document.querySelectorAll('.section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const anchorMap = new Map();
  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    if (href) anchorMap.set(href.slice(1), a);
  });

  let currentId = '';
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) currentId = entry.target.id;
      });
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = anchorMap.get(currentId);
      if (active) active.classList.add('active');
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );
  sections.forEach(sec => navObserver.observe(sec));
}
