import { repositionPill } from './nav.js';
import { reobserve as reobserveReveals } from './reveal.js';

const PATH_KEY = 'vllm-guide-path';

const PATH_META = {
  business: { label: 'Business & Decision-Makers', color: 'green' },
  ops:      { label: 'Platform & Ops Engineers',   color: 'red' },
  deep:     { label: 'Deep-Dive & Research',       color: 'gold' },
};

const ORDERED_PATHS = ['business', 'ops', 'deep'];

let currentPath = null;

function readInitialPath() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('path');
  if (fromUrl && PATH_META[fromUrl]) return fromUrl;

  const fromStorage = localStorage.getItem(PATH_KEY);
  if (fromStorage && PATH_META[fromStorage]) return fromStorage;

  return null;
}

function persistPath(path) {
  if (path && path !== 'all') {
    localStorage.setItem(PATH_KEY, path);
  }

  const url = new URL(window.location);
  if (path && path !== 'all') {
    url.searchParams.set('path', path);
  } else {
    url.searchParams.delete('path');
  }
  history.replaceState(null, '', url);
}

function updateNav(path) {
  const navLinks = document.querySelectorAll('.nav-links li');
  const divider = document.querySelector('li.nav-divider');

  navLinks.forEach(li => {
    if (li === divider) return;
    const a = li.querySelector('a[href^="#"]');
    if (!a) return;

    const sectionId = a.getAttribute('href').slice(1);
    const section = document.getElementById(sectionId);
    if (!section?.dataset.paths) {
      li.hidden = false;
      return;
    }

    if (!path || path === 'all') {
      li.hidden = false;
      return;
    }

    li.hidden = !section.dataset.paths.split(' ').includes(path);
  });

  if (divider) {
    divider.hidden = (path === 'business' || path === 'deep');
  }

  requestAnimationFrame(() => repositionPill());
}

function updateBadge(path) {
  const badge = document.querySelector('.nav-path-badge');
  if (!badge) return;

  if (!path || path === 'all') {
    badge.hidden = true;
    return;
  }

  const meta = PATH_META[path];
  badge.textContent = meta.label;
  badge.dataset.color = meta.color;
  badge.hidden = false;
}

function updateSwitcher(path) {
  const section = document.getElementById('path-switcher');
  if (!section) return;

  if (!path || path === 'all') {
    section.hidden = true;
    return;
  }

  section.hidden = false;

  const currentLabel = section.querySelector('.path-switcher-current');
  if (currentLabel) {
    currentLabel.textContent = PATH_META[path].label;
  }

  section.querySelectorAll('[data-switch-path]').forEach(card => {
    card.hidden = (card.dataset.switchPath === path);
  });
}

function updateCardHighlight(path) {
  document.querySelectorAll('.reading-path-card').forEach(card => {
    card.classList.remove('path-was-active');
  });

  if (path === 'all' && currentPath) {
    const prev = document.querySelector(`.reading-path-card[data-path="${currentPath}"]`);
    if (prev) prev.classList.add('path-was-active');
  }
}

function firstVisibleSection(path) {
  if (!path || path === 'all') return null;
  const sections = document.querySelectorAll('section[data-paths]');
  for (const sec of sections) {
    if (sec.dataset.paths.split(' ').includes(path)) return sec;
  }
  return null;
}

export function activatePath(path, scrollToContent = false) {
  const prev = currentPath;
  currentPath = path;

  if (path) {
    document.documentElement.dataset.activePath = path;
  } else {
    delete document.documentElement.dataset.activePath;
  }

  persistPath(path);
  updateCardHighlight(path);
  updateNav(path);
  updateBadge(path);
  updateSwitcher(path);

  window.dispatchEvent(new CustomEvent('path-changed', { detail: { path, prev } }));

  if (scrollToContent && path && path !== 'all') {
    const target = firstVisibleSection(path);
    if (target) {
      requestAnimationFrame(() => {
        reobserveReveals();
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  } else if (scrollToContent && path === 'all') {
    requestAnimationFrame(() => reobserveReveals());
  }
}

export function init() {
  document.querySelectorAll('.reading-path-card[data-path]').forEach(card => {
    const path = card.dataset.path;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      activatePath(path, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        activatePath(path, true);
      }
    });
  });

  const badge = document.querySelector('.nav-path-badge');
  if (badge) {
    badge.addEventListener('click', () => {
      const pathsSection = document.getElementById('reading-paths');
      if (pathsSection) {
        pathsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  document.querySelectorAll('[data-switch-path]').forEach(card => {
    const path = card.dataset.switchPath;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      activatePath(path, true);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        activatePath(path, true);
      }
    });
  });

  const showAllBtn = document.querySelector('.path-show-all');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => activatePath('all', true));
  }

  const initial = readInitialPath();
  if (initial) {
    activatePath(initial, false);
  }
}
