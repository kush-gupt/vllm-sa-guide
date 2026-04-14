export function init() {
  const html = document.documentElement;
  let scrollTimer = 0;
  let scrollendListener = null;
  let wheelBlocker = null;

  function cleanup() {
    clearTimeout(scrollTimer);
    scrollTimer = 0;
    if (scrollendListener) {
      window.removeEventListener('scrollend', scrollendListener);
      scrollendListener = null;
    }
    if (wheelBlocker) {
      window.removeEventListener('wheel', wheelBlocker, true);
      wheelBlocker = null;
    }
    html.classList.remove('scroll-stabilize');
  }

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    if (id.startsWith('source-')) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    cleanup();

    html.classList.add('scroll-stabilize');
    void html.offsetHeight;

    const padding = parseInt(getComputedStyle(html).scrollPaddingTop, 10) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - padding;

    wheelBlocker = (evt) => evt.preventDefault();
    window.addEventListener('wheel', wheelBlocker, { capture: true, passive: false });

    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);

    scrollendListener = cleanup;
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', scrollendListener);
      scrollTimer = setTimeout(cleanup, 3000);
    } else {
      scrollTimer = setTimeout(cleanup, 1000);
    }
  });
}
