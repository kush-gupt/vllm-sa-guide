import { chunkFrames } from '../data/chunk-frames.js';
import { clamp } from '../utils/helpers.js';
import { crossfade } from '../utils/crossfade.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { onBatchSync } from './batching-lab.js';

export function init() {
  const phaseBar = document.getElementById('chunk-phase-bar');
  const caption = document.getElementById('chunk-caption');
  const lanesContainer = document.getElementById('chunk-lanes');
  const budgetLabel = document.getElementById('chunk-budget-label');
  const budgetFill = document.getElementById('chunk-budget-fill');

  if (!phaseBar || !caption || !lanesContainer || !budgetLabel || !budgetFill) return;

  const laneEls = [0, 1, 2, 3, 4, 5].map(i => document.getElementById('chunk-lane-' + i));
  if (laneEls.some(el => !el)) return;

  const phaseBtns = Array.from(phaseBar.querySelectorAll('.chunk-phase-btn'));
  let activeStep = 0;
  let prevLanes = null;

  function buildChunkGradient(remaining) {
    if (remaining <= 1) return '';
    const stops = ['transparent 0%'];
    for (let c = 1; c < remaining; c++) {
      const pct = (c / remaining * 100).toFixed(1);
      stops.push(
        `transparent calc(${pct}% - 1px)`,
        `rgba(255,255,255,0.28) calc(${pct}% - 1px)`,
        `rgba(255,255,255,0.28) calc(${pct}% + 1px)`,
        `transparent calc(${pct}% + 1px)`
      );
    }
    stops.push('transparent 100%');
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }

  function renderStep(stepIndex) {
    const frame = chunkFrames[stepIndex];
    if (!frame) return;

    phaseBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === stepIndex);
    });

    crossfade(caption, () => {
      caption.textContent = frame.caption;
    });

    laneEls.forEach((lane, i) => {
      const data = frame.lanes[i];
      if (!data) return;
      const bar = lane.querySelector('.chunk-lane-bar');
      const name = lane.querySelector('.chunk-lane-name');
      const meta = lane.querySelector('.chunk-lane-meta');

      lane.style.transitionDelay = (i * 40) + 'ms';
      bar.style.width = data.widthPct + '%';
      bar.style.minWidth = data.widthPct === 0 ? '0' : '';
      bar.dataset.tone = data.tone;
      name.textContent = data.name;
      meta.textContent = data.context ? data.meta + ' \u00B7 ' + data.context : data.meta;
      bar.style.backgroundImage = data.chunks ? buildChunkGradient(data.chunks) : '';

      const needed = data.chunks || (data.label ? 1 : 0);
      while (bar.children.length > needed) bar.lastChild.remove();
      while (bar.children.length < needed) {
        const span = document.createElement('span');
        span.className = 'chunk-lane-bar-label';
        bar.appendChild(span);
      }
      for (const child of bar.children) child.textContent = data.label;

      const prev = prevLanes ? prevLanes[i] : null;
      const changed = prev && (prev.tone !== data.tone || prev.widthPct !== data.widthPct);
      lane.classList.remove('chunk-lane--changed');
      if (changed) {
        void lane.offsetWidth;
        lane.classList.add('chunk-lane--changed');
      }
    });

    prevLanes = frame.lanes;
    budgetFill.style.width = frame.budgetPct + '%';
    budgetLabel.textContent = frame.budgetLabel + ' tokens';
  }

  function setStep(stepIndex) {
    activeStep = clamp(stepIndex, 0, chunkFrames.length - 1);
    renderStep(activeStep);
  }

  function activateChunkTab(btn) {
    const step = parseInt(btn.dataset.step, 10) || 0;
    phaseBtns.forEach((b, i) => {
      b.setAttribute('aria-selected', String(i === step));
      b.tabIndex = i === step ? 0 : -1;
    });
    setStep(step);
  }

  phaseBar.addEventListener('click', event => {
    const btn = event.target.closest('.chunk-phase-btn');
    if (!btn) return;
    activateChunkTab(btn);
  });

  initRovingTabindex(phaseBar, phaseBtns, btn => activateChunkTab(btn));

  onBatchSync(setStep);
  renderStep(activeStep);
}
