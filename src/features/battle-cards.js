import { battleCards } from '../data/battle-cards.js';

export function init() {
  const container = document.getElementById('battle-cards-grid');
  if (!container) return;

  container.innerHTML = battleCards.map(card => `
    <article class="battle-card">
      <div class="battle-card-head">
        <span class="battle-vs-label">vs</span>
        <h4>${card.versus}</h4>
      </div>
      <div class="battle-card-body">
        <div class="battle-section">
          <span class="battle-kicker">Scenario</span>
          <p class="battle-quote">${card.scenario}</p>
        </div>
        <div class="battle-section">
          <span class="battle-kicker">How vLLM differs</span>
          <p>${card.howVllmDiffers}</p>
        </div>
        <div class="battle-section">
          <span class="battle-kicker">Key differences</span>
          <ul class="battle-points">
            ${card.keyDifferences.map(pt => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
      </div>
    </article>
  `).join('');
}
