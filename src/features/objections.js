import { comparisonFaq } from '../data/comparison-faq.js';

export function init() {
  const container = document.getElementById('objection-cards');
  if (!container) return;

  container.innerHTML = comparisonFaq.map(item => `
    <article class="objection-card">
      <button type="button" class="objection-header" aria-expanded="false">
        <h4>&ldquo;${item.question}&rdquo;</h4>
        <span class="expand-icon" aria-hidden="true">+</span>
      </button>
      <div class="objection-body" hidden>
        <p class="objection-response">${item.response}</p>
        <ul class="objection-points">
          ${item.keyPoints.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
    </article>
  `).join('');

  container.addEventListener('click', (e) => {
    const header = e.target.closest('.objection-header');
    if (!header) return;

    const card = header.closest('.objection-card');
    const body = card.querySelector('.objection-body');
    const icon = header.querySelector('.expand-icon');
    const expanded = header.getAttribute('aria-expanded') === 'true';

    header.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded;
    icon.textContent = expanded ? '+' : '\u00d7';
  });
}
