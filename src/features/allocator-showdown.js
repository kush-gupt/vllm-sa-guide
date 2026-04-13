import { SHOWDOWN_STEPS } from '../data/showdown-steps.js';
import { crossfadeText } from '../utils/crossfade.js';

const ROWS = 4;
const COLS = 16;
const POOL = 9;
const MAX_BLOCKS = 3;
const MAX_NAIVE_PILLS = 3;
const MAX_PAGED_PILLS = 4;

export function init() {
  const showdownSlider = document.getElementById('showdown-step');
  const showdownStepLabel = document.getElementById('showdown-step-label');
  const naiveGrid = document.getElementById('naive-grid');
  const naiveMetrics = document.getElementById('naive-metrics');
  const naiveCaption = document.getElementById('naive-caption');
  const pagedLogical = document.getElementById('paged-logical');
  const pagedPhysical = document.getElementById('paged-physical');
  const pagedMetrics = document.getElementById('paged-metrics');
  const pagedCaption = document.getElementById('paged-caption');
  const showdownContrast = document.getElementById('showdown-contrast');

  if (
    !showdownSlider || !naiveGrid || !naiveMetrics ||
    !pagedLogical || !pagedPhysical || !pagedMetrics || !showdownContrast
  ) return;

  /* ─── Build stable DOM once ─── */

  const naiveRowRefs = Array.from({ length: ROWS }, (_, r) => {
    const row = document.createElement('div');
    row.className = 'showdown-row';

    const label = document.createElement('span');
    label.className = 'showdown-row-label';
    row.appendChild(label);

    const wait = document.createElement('span');
    wait.className = 'showdown-waiting-label';
    row.appendChild(wait);

    const wrap = document.createElement('div');
    wrap.className = 'showdown-cells';
    const cells = Array.from({ length: COLS }, (_, c) => {
      const cell = document.createElement('div');
      cell.className = 'showdown-cell cell-free';
      cell.style.transitionDelay = `${c * 18}ms`;
      wrap.appendChild(cell);
      return cell;
    });
    row.appendChild(wrap);
    naiveGrid.appendChild(row);
    return { row, label, wait, wrap, cells };
  });

  const laneRefs = Array.from({ length: ROWS }, (_, l) => {
    const lane = document.createElement('div');
    lane.className = 'showdown-logical-lane';

    const label = document.createElement('span');
    label.className = 'showdown-lane-label';
    lane.appendChild(label);

    const wait = document.createElement('span');
    wait.className = 'showdown-waiting-label';
    wait.textContent = 'Queued';
    lane.appendChild(wait);

    const arrow = document.createElement('span');
    arrow.className = 'showdown-lane-arrow';
    arrow.textContent = '\u2192';
    lane.appendChild(arrow);

    const blocks = Array.from({ length: MAX_BLOCKS }, (_, b) => {
      const el = document.createElement('span');
      el.className = 'showdown-block block-hidden';
      el.style.transitionDelay = `${b * 40}ms`;
      const idEl = document.createElement('span');
      idEl.className = 'showdown-block-id';
      const metaEl = document.createElement('small');
      el.appendChild(idEl);
      el.appendChild(metaEl);
      lane.appendChild(el);
      return { el, idEl, metaEl };
    });

    pagedLogical.appendChild(lane);
    return { lane, label, wait, arrow, blocks };
  });

  const physRefs = Array.from({ length: POOL }, (_, p) => {
    const el = document.createElement('div');
    el.className = 'showdown-phys-cell';
    el.style.transitionDelay = `${p * 25}ms`;

    const slot = document.createElement('span');
    slot.className = 'showdown-phys-slot';
    const lbl = document.createElement('span');
    lbl.className = 'showdown-phys-label';
    const meta = document.createElement('span');
    meta.className = 'showdown-phys-meta';

    el.appendChild(slot);
    el.appendChild(lbl);
    el.appendChild(meta);
    pagedPhysical.appendChild(el);
    return { el, slot, lbl, meta };
  });

  function buildPills(container, count) {
    return Array.from({ length: count }, () => {
      const pill = document.createElement('span');
      pill.className = 'showdown-metric-pill';
      const key = document.createElement('span');
      key.className = 'pill-key';
      const strong = document.createElement('strong');
      pill.appendChild(key);
      pill.appendChild(document.createTextNode(' '));
      pill.appendChild(strong);
      container.appendChild(pill);
      return { pill, key, strong };
    });
  }

  const naivePillRefs = buildPills(naiveMetrics, MAX_NAIVE_PILLS);
  const pagedPillRefs = buildPills(pagedMetrics, MAX_PAGED_PILLS);

  /* ─── In-place update helpers ─── */

  function updateNaive(rows) {
    rows.forEach((row, r) => {
      const ref = naiveRowRefs[r];
      ref.label.textContent = row.name;
      ref.wait.textContent = row.note || 'Queued';

      if (row.waiting) {
        ref.row.classList.add('is-waiting');
      } else {
        ref.row.classList.remove('is-waiting');
      }

      for (let i = 0; i < COLS; i++) {
        const c = ref.cells[i];
        c.className = 'showdown-cell';
        if (!row.waiting && i < row.used) {
          c.classList.add('cell-used', 'tone-' + row.tone);
        } else if (!row.waiting && i < row.reserved) {
          c.classList.add('cell-reserved');
        } else {
          c.classList.add('cell-free');
        }
      }
    });
  }

  function updateLogical(lanes) {
    lanes.forEach((lane, l) => {
      const ref = laneRefs[l];
      ref.label.textContent = lane.name;

      if (lane.waiting) {
        ref.lane.classList.add('is-waiting');
        ref.blocks.forEach(b => { b.el.className = 'showdown-block block-hidden'; });
      } else {
        ref.lane.classList.remove('is-waiting');
        lane.blocks.forEach((blk, b) => {
          const bRef = ref.blocks[b];
          bRef.el.className = 'showdown-block tone-border-' + blk.tone;
          if (blk.shared) bRef.el.classList.add('block-shared');
          bRef.idEl.textContent = blk.id;
          bRef.metaEl.textContent = blk.meta;
        });
        for (let b = lane.blocks.length; b < MAX_BLOCKS; b++) {
          ref.blocks[b].el.className = 'showdown-block block-hidden';
        }
      }
    });
  }

  function updatePhysical(pool) {
    pool.forEach((cell, p) => {
      const ref = physRefs[p];
      ref.slot.textContent = cell.slot;
      ref.el.className = 'showdown-phys-cell';

      if (cell.free) {
        ref.el.classList.add('phys-free');
        ref.lbl.textContent = 'Free';
        ref.lbl.style.color = 'var(--text-dim)';
        ref.meta.textContent = '';
      } else {
        if (cell.shared) ref.el.classList.add('phys-shared');
        ref.el.classList.add('tone-border-' + cell.tone);
        ref.lbl.textContent = cell.label;
        ref.lbl.style.color = 'var(--text)';
        ref.meta.textContent = cell.meta;
      }
    });
  }

  function updatePills(refs, obj) {
    const entries = Object.entries(obj);
    refs.forEach((ref, i) => {
      if (i < entries.length) {
        ref.key.textContent = entries[i][0];
        ref.strong.textContent = entries[i][1];
        ref.pill.classList.remove('pill-hidden');
      } else {
        ref.pill.classList.add('pill-hidden');
      }
    });
  }

  /* ─── Main step render ─── */

  let firstRender = true;

  function renderStep(idx) {
    const step = SHOWDOWN_STEPS[idx];
    if (!step) return;

    if (showdownStepLabel) {
      showdownStepLabel.textContent =
        (idx + 1) + ' / ' + SHOWDOWN_STEPS.length + ' \u2013 ' + step.label;
    }
    showdownSlider.setAttribute('aria-valuetext',
      'Step ' + (idx + 1) + ' of ' + SHOWDOWN_STEPS.length + ': ' + step.label);

    updateNaive(step.rows);
    updatePills(naivePillRefs, step.naive.metrics);
    updateLogical(step.paged.logical);
    updatePhysical(step.paged.physical);
    updatePills(pagedPillRefs, step.paged.metrics);

    if (firstRender) {
      if (naiveCaption) naiveCaption.textContent = step.naive.caption;
      if (pagedCaption) pagedCaption.textContent = step.paged.caption;
      showdownContrast.innerHTML = step.contrast;
      firstRender = false;
    } else {
      crossfadeText(naiveCaption, step.naive.caption, false);
      crossfadeText(pagedCaption, step.paged.caption, false);
      crossfadeText(showdownContrast, step.contrast, true);
    }
  }

  showdownSlider.setAttribute('aria-label', 'Allocator showdown step');
  showdownSlider.addEventListener('input', () => renderStep(+showdownSlider.value));
  renderStep(0);
}
