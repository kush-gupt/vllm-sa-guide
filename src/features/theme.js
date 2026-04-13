export function init() {
  const html = document.documentElement;
  const themeBtn = document.querySelector('.theme-toggle');
  if (!themeBtn) return;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('vllm-sa-theme', theme);
    themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
  }

  const stored = localStorage.getItem('vllm-sa-theme');
  if (stored) setTheme(stored);
  else themeBtn.setAttribute('aria-pressed', String(html.getAttribute('data-theme') === 'light'));

  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(next));
    } else {
      html.classList.add('theme-transitioning');
      setTheme(next);
      setTimeout(() => html.classList.remove('theme-transitioning'), 500);
    }
  });
}
