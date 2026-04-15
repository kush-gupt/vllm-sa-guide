let _positionPill = null;

export function repositionPill() {
  _positionPill?.();
}

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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          positionPill(navLinks.querySelector('a.active'));
        });
      });
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

  function positionPill(link) {
    if (!link || link.closest('li[hidden]')) {
      navLinks.style.setProperty('--pill-opacity', '0');
      return;
    }
    const containerRect = navLinks.getBoundingClientRect();
    if (containerRect.height === 0) {
      navLinks.style.setProperty('--pill-opacity', '0');
      return;
    }
    const linkRect = link.getBoundingClientRect();
    navLinks.style.setProperty('--pill-x', `${linkRect.left - containerRect.left}px`);
    navLinks.style.setProperty('--pill-y', `${linkRect.top - containerRect.top}px`);
    navLinks.style.setProperty('--pill-w', `${linkRect.width}px`);
    navLinks.style.setProperty('--pill-h', `${linkRect.height}px`);
    navLinks.style.setProperty('--pill-opacity', '1');
  }

  _positionPill = () => {
    const active = navLinks.querySelector('a.active');
    positionPill(active);
  };

  let currentId = '';
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) currentId = entry.target.id;
      });

      const currentSection = document.getElementById(currentId);
      if (currentSection && getComputedStyle(currentSection).display === 'none') {
        currentId = '';
      }

      navAnchors.forEach(a => a.classList.remove('active'));
      const active = anchorMap.get(currentId);
      if (active && !active.closest('li[hidden]')) active.classList.add('active');
      positionPill(active);
    },
    { rootMargin: '-20% 0px -80% 0px' }
  );
  sections.forEach(sec => navObserver.observe(sec));

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const active = navLinks.querySelector('a.active');
      positionPill(active);
    });
  });
}
