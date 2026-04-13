import { strategies } from '../data/parallelism-data.js';
import { crossfadeMulti } from '../utils/crossfade.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { activateTabButton } from '../utils/tab-utils.js';

export function init() {
  const parTabs = document.querySelectorAll('.par-tab');
  const parallelismVisual = document.getElementById('parallelism-visual');
  const parTitle = document.getElementById('par-title');
  const parSummary = document.getElementById('par-summary');
  const parBest = document.getElementById('par-best');
  const parTradeoff = document.getElementById('par-tradeoff');
  const parCombo = document.getElementById('par-combo');
  const parFlag = document.getElementById('par-flag');
  const parCaution = document.getElementById('par-caution');

  if (
    parTabs.length &&
    parallelismVisual &&
    parTitle &&
    parSummary &&
    parBest &&
    parTradeoff &&
    parCombo &&
    parFlag &&
    parCaution
  ) {
    let activeStrategy = 'tp';
    let parInitialized = false;

    function renderStrategyDirect(name) {
      const strategy = strategies[name];
      if (!strategy) return;

      activeStrategy = name;
      parTitle.textContent = strategy.title;
      parSummary.textContent = strategy.summary;
      parBest.textContent = strategy.best;
      parTradeoff.textContent = strategy.tradeoff;
      parCombo.textContent = strategy.combo;
      parFlag.textContent = strategy.flag;
      parCaution.textContent = strategy.caution;

      parallelismVisual.innerHTML = `<div class="par-visual-grid" style="grid-template-columns: repeat(${strategy.visual.length}, minmax(0, 1fr));">
        ${strategy.visual
          .map(col => {
            const nodes = col.nodes
              .map(node => `<div class="par-node ${node.highlight ? 'is-highlight' : ''}">
                <strong>${node.title}</strong>
                <span>${node.detail}</span>
              </div>`)
              .join('');
            return `<div class="par-visual-col">
              <span class="par-visual-label">${col.label}</span>
              ${nodes}
            </div>`;
          })
          .join('')}
      </div>`;
    }

    function renderStrategy(name) {
      if (!parInitialized) {
        parInitialized = true;
        renderStrategyDirect(name);
        return;
      }
      const detail = parallelismVisual.closest('.parallelism-shell').querySelector('.parallelism-detail');
      crossfadeMulti([parallelismVisual, detail], () => renderStrategyDirect(name));
    }

    function activateTab(btn, pushHash) {
      activateTabButton(parTabs, btn, {
        dataKey: 'strategy',
        hashPrefix: pushHash ? 'par-' : null,
        onActivate: renderStrategy,
      });
    }

    parTabs.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn, true));
    });

    const tablist = document.querySelector('.parallelism-tabs');
    if (tablist) initRovingTabindex(tablist, parTabs, btn => activateTab(btn, true));

    const hash = location.hash;
    const hashStrategy = hash.startsWith('#par-') ? hash.slice(5) : null;
    if (hashStrategy && strategies[hashStrategy]) activeStrategy = hashStrategy;
    const initBtn = Array.from(parTabs).find(b => b.dataset.strategy === activeStrategy);
    if (initBtn) activateTab(initBtn, false);
    else renderStrategy(activeStrategy);
  }
}
