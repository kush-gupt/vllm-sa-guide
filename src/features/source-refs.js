function scrollToSource(id, smooth) {
  const target = document.getElementById(id);
  if (!target) return;

  const revealAncestor = target.closest('.reveal:not(.visible)');
  if (revealAncestor) {
    revealAncestor.classList.add('visible');
    revealAncestor.style.animation = 'none';
    revealAncestor.style.opacity = '1';
    revealAncestor.style.transform = 'none';
  }

  document.querySelectorAll('.source-highlight').forEach(
    el => el.classList.remove('source-highlight')
  );

  requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'center',
    });
    target.classList.add('source-highlight');
  });
}

export function init() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#source-"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!document.getElementById(id)) return;

    e.preventDefault();
    history.pushState(null, '', `#${id}`);
    scrollToSource(id, true);
  });

  const hash = window.location.hash.slice(1);
  if (hash && hash.startsWith('source-')) {
    scrollToSource(hash, false);
  }
}
