export function init() {
  const section = document.getElementById('quickstart');
  if (!section) return;

  const toggle = section.querySelector('.quickstart-toggle');
  const body = section.querySelector('.quickstart-body');
  if (!toggle || !body) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded;
  });
}
