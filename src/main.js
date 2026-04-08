import { init as initTheme } from './features/theme.js';
import { init as initNav } from './features/nav.js';
import { init as initReveal } from './features/reveal.js';
import { init as initSourceRefs } from './features/source-refs.js';
import { init as initScrollProgress } from './features/scroll-progress.js';
import { init as initBackToTop } from './features/back-to-top.js';
import { init as initHeroCanvas } from './features/hero-canvas.js';

const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

function showDevError(name) {
  if (!isDev) return;
  let banner = document.getElementById('dev-init-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'dev-init-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#A30000;color:#fff;padding:8px 16px;font:14px/1.4 system-ui;text-align:center';
    document.body.appendChild(banner);
  }
  banner.textContent += (banner.textContent ? ', ' : 'Feature init failed: ') + name;
}

function safeInit(fn, name) {
  try { fn(); }
  catch (e) {
    console.error(`[${name}] init failed:`, e);
    showDevError(name);
  }
}

// --- Critical path: above-fold and global features ---
safeInit(initTheme, 'theme');
safeInit(initNav, 'nav');
safeInit(initReveal, 'reveal');
safeInit(initSourceRefs, 'source-refs');
safeInit(initScrollProgress, 'scroll-progress');
safeInit(initBackToTop, 'back-to-top');
safeInit(initHeroCanvas, 'hero-canvas');

// --- Lazy-load below-fold features when their section approaches viewport ---
function lazySection(sectionId, loaders) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      (async () => {
        for (const load of loaders) {
          try {
            const mod = await load();
            if (mod.init) mod.init();
          } catch (e) {
            console.error(`[lazy:${sectionId}] init failed:`, e);
            showDevError(`lazy:${sectionId}`);
          }
        }
      })();
    },
    { rootMargin: '200px' }
  );
  observer.observe(section);
}

lazySection('why', [
  () => import('./features/quickstart.js'),
]);

lazySection('modern-inference', [
  () => import('./features/modern-topics.js'),
  () => import('./features/battle-cards.js'),
  () => import('./features/objections.js'),
]);

lazySection('deployment', [
  () => import('./features/parallelism.js'),
]);

lazySection('paged-attention', [
  () => import('./features/allocator-showdown.js'),
  () => import('./features/paged-attention.js'),
]);

lazySection('batching', [
  () => import('./features/batching-lab.js'),
  () => import('./features/chunked-prefill.js'),
]);

lazySection('architecture', [
  () => import('./features/arch-diagrams.js'),
  () => import('./features/decode-loop.js'),
  () => import('./features/component-cards.js'),
  () => import('./features/process-calculator.js'),
]);

lazySection('tuning', [
  () => import('./features/tuning-lab.js'),
]);

// --- Scattered/global features: load when idle ---
function loadOnIdle(loader, name) {
  const run = () => loader().then(m => { if (m.init) safeInit(m.init, name); });
  if ('requestIdleCallback' in window) requestIdleCallback(run);
  else setTimeout(run, 2000);
}

loadOnIdle(() => import('./features/tooltips.js'), 'tooltips');
loadOnIdle(() => import('./features/syntax-highlight.js'), 'syntax-highlight');

// --- Hash navigation: scroll after critical init (source-refs handles #source-*) ---
if (window.location.hash && !window.location.hash.startsWith('#source-')) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'instant' });
    });
  }
}
