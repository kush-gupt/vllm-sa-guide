import { paPhases } from '../data/pa-phases.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { createAutoplay } from '../utils/autoplay.js';

export function init() {
  const paCinema = document.getElementById('pa-cinema');
  const paCinemaTitle = document.getElementById('pa-cinema-title');
  const paCinemaCaption = document.getElementById('pa-cinema-caption');
  const paCinemaPlay = document.getElementById('pa-cinema-play');
  const paStrip = document.getElementById('pa-strip');
  const paLabelsEl = document.getElementById('pa-labels');
  const paStatUsed = document.getElementById('pa-cstat-used');
  const paStatShared = document.getElementById('pa-cstat-shared');
  const paStatFree = document.getElementById('pa-cstat-free');
  const paUtilFill = document.getElementById('pa-util-fill');
  const paPhaseBtns = document.querySelectorAll('.pa-phase-btn');

  if (
    paCinema && paStrip && paLabelsEl && paCinemaTitle &&
    paCinemaCaption && paStatUsed && paStatShared && paStatFree &&
    paUtilFill && paPhaseBtns.length
  ) {
    const CELL_COUNT = 12;
    const cells = Array.from(paStrip.children);

    let paActivePhase = 0;

    function renderPaPhase(phaseIdx) {
      const phase = paPhases[phaseIdx];
      if (!phase) return;

      paCinema.setAttribute('data-phase', String(phaseIdx));
      paCinemaTitle.textContent = phase.title;
      paCinemaCaption.textContent = phase.caption;

      phase.cells.forEach((cell, i) => {
        const el = cells[i];
        if (!el) return;
        el.setAttribute('data-state', cell.state);
        el.setAttribute('data-tone', cell.tone);
        el.style.transitionDelay = (i * 60) + 'ms';
        el.innerHTML = cell.state === 'free'
          ? '<span class="pa-cell-slot">Free</span>'
          : cell.state === 'reclaimed'
            ? '<span class="pa-cell-slot pa-cell-reclaimed">Freed</span>'
            : '<span class="pa-cell-label">' + cell.label + '</span><span class="pa-cell-sub">' + cell.sub + '</span>';
      });

      paLabelsEl.innerHTML = phase.labels.map(function (lbl) {
        var pills = lbl.indices.map(function (idx) {
          return '<span class="pa-lbl-dot" data-tone="' + lbl.tone + '">' + idx + '</span>';
        }).join('');
        return '<div class="pa-lbl-row" data-tone="' + lbl.tone + '"><strong>' + lbl.name + '</strong>' + pills + '</div>';
      }).join('');

      paStatUsed.textContent = String(phase.stats.used);
      paStatShared.textContent = String(phase.stats.shared);
      paStatFree.textContent = String(phase.stats.free);
      var pct = Math.round((phase.stats.used / CELL_COUNT) * 100);
      paUtilFill.style.width = pct + '%';

      paPhaseBtns.forEach(function (btn) {
        btn.classList.toggle('active', parseInt(btn.dataset.phase, 10) === phaseIdx);
      });
      updatePhaseAria(phaseIdx);
    }

    const autoplay = createAutoplay(paCinema, paCinemaPlay, {
      interval: 3500,
      onTick() {
        paActivePhase = (paActivePhase + 1) % paPhases.length;
        renderPaPhase(paActivePhase);
      },
    });

    paPhaseBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        paActivePhase = parseInt(btn.dataset.phase, 10) || 0;
        renderPaPhase(paActivePhase);
        autoplay.restart();
      });
    });

    function updatePhaseAria(activeIdx) {
      paPhaseBtns.forEach(function (btn) {
        var idx = parseInt(btn.dataset.phase, 10);
        btn.setAttribute('aria-selected', String(idx === activeIdx));
        btn.tabIndex = idx === activeIdx ? 0 : -1;
      });
    }

    var paPhaseBar = document.getElementById('pa-phase-bar');
    if (paPhaseBar) initRovingTabindex(paPhaseBar, paPhaseBtns, btn => btn.click());

    renderPaPhase(0);
    autoplay.start();
  }
}
