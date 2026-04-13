export function init() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => {
    el.addEventListener('animationend', () => el.classList.add('done'), { once: true });
    revealObserver.observe(el);
  });

  const staggerGridSelectors = [
    '.coverage-grid', '.hw-grid', '.landscape-grid',
    '.discovery-grid', '.links-grid',
  ];

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(18px)';
          child.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
          });
        });
        staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  staggerGridSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => staggerObserver.observe(el));
  });
}
