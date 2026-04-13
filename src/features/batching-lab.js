import { batchingScenarios } from '../data/batching-scenarios.js';
import { clamp } from '../utils/helpers.js';
import { crossfadeMulti } from '../utils/crossfade.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { activateTabButton } from '../utils/tab-utils.js';

export function init() {
  const workloadBtns = document.querySelectorAll('.workload-btn');
  const batchStepInput = document.getElementById('batch-step');
  const batchStepReadout = document.getElementById('batch-step-readout');
  const staticSlots = document.getElementById('static-slots');
  const continuousSlots = document.getElementById('continuous-slots');
  const staticMetrics = document.getElementById('static-metrics');
  const continuousMetrics = document.getElementById('continuous-metrics');
  const batchTakeaway = document.getElementById('batch-takeaway');
  let activeWorkload = 'balanced';

  if (
    workloadBtns.length &&
    batchStepInput &&
    batchStepReadout &&
    staticSlots &&
    continuousSlots &&
    staticMetrics &&
    continuousMetrics &&
    batchTakeaway
  ) {
    const staticSlotEls = Array.from(staticSlots.querySelectorAll('.batch-slot'));
    const continuousSlotEls = Array.from(continuousSlots.querySelectorAll('.batch-slot'));

    function updateSlots(slotEls, frame) {
      slotEls.forEach((el, i) => {
        const cell = frame[i];
        if (!cell) return;
        el.style.transitionDelay = (i * 55) + 'ms';
        el.dataset.tone = cell.tone;
        el.querySelector('.batch-slot-phase').textContent = cell.phase;
        el.querySelector('.batch-slot-title').textContent = cell.title;
        el.querySelector('.batch-slot-detail').textContent = cell.detail;
      });
    }

    function renderMetrics(container, metrics) {
      container.innerHTML = metrics
        .map(m => `<span class="metric-pill" data-metric="${m.name}"><span>${m.name}</span><strong>${m.value}</strong></span>`)
        .join('');
    }

    function updateBatchLab() {
      const scenario = batchingScenarios[activeWorkload];
      const maxStep = scenario.staticFrames.length - 1;
      batchStepInput.max = String(maxStep);
      const step = clamp(parseInt(batchStepInput.value, 10) || 0, 0, maxStep);
      batchStepReadout.textContent = `Step ${step + 1} / ${scenario.staticFrames.length}`;
      batchStepInput.setAttribute('aria-valuetext',
        `Step ${step + 1} of ${scenario.staticFrames.length}, ${activeWorkload} workload`);

      updateSlots(staticSlotEls, scenario.staticFrames[step]);
      updateSlots(continuousSlotEls, scenario.continuousFrames[step]);
      renderMetrics(staticMetrics, scenario.staticMetrics[step]);
      renderMetrics(continuousMetrics, scenario.continuousMetrics[step]);
      batchTakeaway.textContent = scenario.takeaways[step];
    }

    let workloadInitialized = false;

    function activateWorkload(btn) {
      const prev = activeWorkload;
      activateTabButton(workloadBtns, btn, {
        dataKey: 'workload',
        onActivate(workload) {
          activeWorkload = workload;
          if (!workloadInitialized || prev === workload) {
            workloadInitialized = true;
            updateBatchLab();
          } else {
            crossfadeMulti(
              [staticSlots, continuousSlots, staticMetrics, continuousMetrics, batchTakeaway],
              () => updateBatchLab()
            );
          }
        },
      });
    }

    workloadBtns.forEach(btn => {
      btn.addEventListener('click', () => activateWorkload(btn));
    });

    const tablist = document.querySelector('.segmented-control');
    if (tablist) initRovingTabindex(tablist, workloadBtns, btn => activateWorkload(btn));

    batchStepInput.addEventListener('input', updateBatchLab);
    updateBatchLab();
  }
}
