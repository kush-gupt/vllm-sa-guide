export function init() {
  const grid = document.querySelector('.cards-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.comp-card')];
  if (!cards.length) return;

  const left = document.createElement('div');
  const right = document.createElement('div');
  left.className = 'cards-col';
  right.className = 'cards-col';

  cards.forEach((card, i) => {
    (i % 2 === 0 ? left : right).appendChild(card);
  });

  grid.replaceChildren(left, right);

  grid.querySelectorAll('.comp-card-header').forEach(header => {
    const card = header.closest('.comp-card');
    const body = card.querySelector('.comp-card-body');
    if (body && card.getAttribute('data-expanded') !== 'true') {
      body.setAttribute('aria-hidden', 'true');
    }

    header.addEventListener('click', () => {
      const expanded = card.getAttribute('data-expanded') === 'true';
      card.setAttribute('data-expanded', String(!expanded));
      header.setAttribute('aria-expanded', String(!expanded));
      if (body) body.setAttribute('aria-hidden', String(expanded));
    });
  });
}
