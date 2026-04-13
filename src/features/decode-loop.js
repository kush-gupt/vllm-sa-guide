import { phases, PROMPT_TOKENS, GENERATED_TOKENS } from '../data/decode-loop-data.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { createAutoplay } from '../utils/autoplay.js';

const AUTO_INTERVAL = 4500;
const ALL_TOKENS = [...PROMPT_TOKENS, ...GENERATED_TOKENS];

export function init() {
  const root = document.getElementById('decode-loop');
  if (!root) return;

  const titleEl = document.getElementById('decode-loop-title');
  const captionEl = document.getElementById('decode-loop-caption');
  const insightEl = document.getElementById('decode-loop-insight');
  const insightWrap = document.getElementById('decode-loop-insight-wrap');
  const tokensEl = document.getElementById('decode-tokens');
  const modelBox = document.getElementById('decode-model-box');
  const modelTitle = document.getElementById('decode-model-title');
  const modelDetail = document.getElementById('decode-model-detail');
  const modelKv = document.getElementById('decode-model-kv');
  const kvBlocks = document.getElementById('decode-kv-blocks');
  const kvCount = document.getElementById('decode-kv-count');
  const loopArrow = document.getElementById('decode-loop-arrow');
  const loopLabel = document.getElementById('decode-loop-label');
  const candidatesEl = document.getElementById('decode-candidates');
  const playBtn = document.getElementById('decode-loop-play');
  const statGen = document.getElementById('decode-stat-gen');
  const statPasses = document.getElementById('decode-stat-passes');
  const statKv = document.getElementById('decode-stat-kv');
  const statSaved = document.getElementById('decode-stat-saved');
  const phaseBar = document.getElementById('decode-phase-bar');

  if (!titleEl || !captionEl || !tokensEl || !modelBox || !kvBlocks || !playBtn || !phaseBar) return;

  let current = 0;

  const isDecodePhase = (id) => id.startsWith('token-') || id === 'pattern';

  function renderTokens(phase) {
    tokensEl.innerHTML = '';
    const inDecode = isDecodePhase(phase.id);

    PROMPT_TOKENS.forEach((tok, i) => {
      const el = document.createElement('div');
      el.className = 'dtok dtok-prompt';
      if (inDecode) el.classList.add('dtok-cached');
      if (phase.id === 'prefill') el.classList.add('dtok-feeding');
      el.textContent = tok;
      el.style.animationDelay = `${i * 0.07}s`;
      tokensEl.appendChild(el);
    });

    const genCount = phase.generated;
    for (let i = 0; i < genCount; i++) {
      const el = document.createElement('div');
      el.className = 'dtok dtok-gen';
      if (inDecode && i < genCount - 1) el.classList.add('dtok-cached');
      if (i === genCount - 1 && phase.activePass) el.classList.add('dtok-new');
      const isActiveInput = inDecode && phase.activePass && i === genCount - 2;
      if (isActiveInput) el.classList.add('dtok-feeding');
      el.textContent = GENERATED_TOKENS[i] || '\u2026';
      el.style.animationDelay = `${(PROMPT_TOKENS.length + i) * 0.07}s`;
      tokensEl.appendChild(el);
    }

    if (phase.id === 'token-1' && !phase.activePass) {
      const lastPrompt = tokensEl.querySelector('.dtok-prompt:last-of-type');
      if (lastPrompt) lastPrompt.classList.add('dtok-feeding');
    }

    if (phase.activePass && genCount === 0) {
      const el = document.createElement('div');
      el.className = 'dtok dtok-processing';
      el.textContent = '\u2026';
      tokensEl.appendChild(el);
    }
  }

  function renderModel(phase) {
    modelBox.classList.toggle('model-active', phase.activePass);

    const modelTitleEl = document.getElementById('decode-model-title');
    const modelDetailEl = document.getElementById('decode-model-detail');
    const modelKvEl = document.getElementById('decode-model-kv');

    if (phase.passes === 0) {
      if (modelTitleEl) modelTitleEl.textContent = 'Forward Pass';
      if (modelDetailEl) modelDetailEl.textContent = 'Waiting for input\u2026';
      if (modelKvEl) modelKvEl.textContent = '';
    } else if (phase.id === 'prefill') {
      if (modelTitleEl) modelTitleEl.textContent = 'Forward Pass #1';
      if (modelDetailEl) modelDetailEl.textContent = `Input: all ${PROMPT_TOKENS.length} prompt tokens (parallel)`;
      if (modelKvEl) modelKvEl.textContent = 'KV cache: empty \u2192 4 entries';
    } else if (phase.activePass) {
      const inputTok = GENERATED_TOKENS[phase.generated - 2] || PROMPT_TOKENS[PROMPT_TOKENS.length - 1];
      if (modelTitleEl) modelTitleEl.textContent = `Forward Pass #${phase.passes}`;
      if (modelDetailEl) modelDetailEl.textContent = `Input: \u201c${inputTok}\u201d (1 token)`;
      if (modelKvEl) modelKvEl.textContent = `KV cache: ${phase.kvEntries - 1} reused, 1 new`;
    } else if (phase.id === 'pattern') {
      if (modelTitleEl) modelTitleEl.textContent = `${phase.passes} Forward Passes`;
      if (modelDetailEl) modelDetailEl.textContent = 'One per token, every token';
      if (modelKvEl) modelKvEl.textContent = `KV cache: ${phase.kvEntries} entries (${phase.kvSaved} recomputations avoided)`;
    } else {
      if (modelTitleEl) modelTitleEl.textContent = `Forward Pass #${phase.passes}`;
      if (modelDetailEl) modelDetailEl.textContent = `${phase.passes} pass${phase.passes > 1 ? 'es' : ''} so far`;
      if (modelKvEl) modelKvEl.textContent = `KV cache: ${phase.kvEntries} entries`;
    }
  }

  function renderKV(phase) {
    kvBlocks.innerHTML = '';
    const inDecode = isDecodePhase(phase.id);

    for (let i = 0; i < phase.kvEntries; i++) {
      const el = document.createElement('div');
      el.className = 'kv-block';
      if (inDecode) el.classList.add('kv-reading');
      if (i === phase.kvEntries - 1 && phase.activePass && phase.kvEntries > 0) {
        el.classList.add('kv-block-new');
      }
      el.textContent = ALL_TOKENS[i] || `t${i}`;
      el.style.animationDelay = `${i * 0.05}s`;
      kvBlocks.appendChild(el);
    }

    const kvCountEl = document.getElementById('decode-kv-count');
    if (kvCountEl) kvCountEl.textContent = `${phase.kvEntries} entr${phase.kvEntries === 1 ? 'y' : 'ies'}`;
  }

  function renderLoopArrow(phase) {
    if (!loopArrow) return;
    loopArrow.classList.toggle('loop-visible', phase.loopArrow);
    loopArrow.classList.toggle('loop-active', phase.loopArrow && phase.activePass);

    if (!loopLabel) return;
    if (phase.id === 'token-1') {
      loopLabel.innerHTML = '\u201cjumped\u201d \u2192 model';
    } else if (phase.id === 'token-2') {
      loopLabel.innerHTML = '\u201cover\u201d \u2192 model';
    } else if (phase.id === 'token-3') {
      loopLabel.innerHTML = '\u201cthe\u201d \u2192 model';
    } else if (phase.id === 'pattern') {
      loopLabel.innerHTML = 'every token feeds back';
    } else {
      loopLabel.innerHTML = 'feed token back';
    }
  }

  function renderCandidates(phase) {
    if (!candidatesEl) return;
    if (!phase.candidates) {
      candidatesEl.classList.remove('cand-visible');
      return;
    }
    candidatesEl.classList.add('cand-visible');

    const maxProb = phase.candidates[0].prob;
    let html = '<div class="cand-header">';
    html += '<span class="cand-title">Sampling: top predictions</span>';
    html += '<span class="cand-note">The model outputs a probability for every token in its vocabulary. The highest-probability token is selected.</span>';
    html += '</div>';
    html += '<div class="cand-rows">';

    phase.candidates.forEach((c, i) => {
      const pct = (c.prob * 100).toFixed(0);
      const barWidth = ((c.prob / maxProb) * 100).toFixed(1);
      const chosen = c.chosen ? ' cand-chosen' : '';
      html += `<div class="cand-row${chosen}" style="animation-delay:${i * 0.06}s">`;
      html += `<span class="cand-token">${c.token}</span>`;
      html += `<div class="cand-bar-track"><div class="cand-bar" style="width:${barWidth}%"></div></div>`;
      html += `<span class="cand-pct">${pct}%</span>`;
      if (c.chosen) html += '<span class="cand-badge">\u2713 sampled</span>';
      html += '</div>';
    });

    html += '</div>';
    candidatesEl.innerHTML = html;
  }

  function renderPhase(index) {
    const phase = phases[index];
    current = index;

    titleEl.textContent = phase.title;
    captionEl.textContent = phase.caption;

    if (phase.insight && insightEl && insightWrap) {
      insightEl.textContent = phase.insight;
      insightWrap.classList.add('insight-visible');
    } else if (insightWrap) {
      insightWrap.classList.remove('insight-visible');
    }

    renderTokens(phase);
    renderModel(phase);
    renderKV(phase);
    renderLoopArrow(phase);
    renderCandidates(phase);

    if (statGen) statGen.textContent = phase.generated;
    if (statPasses) statPasses.textContent = phase.passes;
    if (statKv) statKv.textContent = phase.kvEntries;
    if (statSaved) statSaved.textContent = phase.kvSaved;

    phaseBar.querySelectorAll('.decode-phase-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.setAttribute('aria-selected', String(i === index));
      btn.tabIndex = i === index ? 0 : -1;
    });
  }

  function advance() {
    const next = (current + 1) % phases.length;
    renderPhase(next);
  }

  const autoplay = createAutoplay(root, playBtn, { interval: AUTO_INTERVAL, onTick: advance });

  initRovingTabindex(phaseBar, phaseBar.querySelectorAll('.decode-phase-btn'), btn => btn.click());

  phases.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'decode-phase-btn' + (i === 0 ? ' active' : '');
    btn.textContent = p.label;
    btn.dataset.phase = i;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.tabIndex = i === 0 ? 0 : -1;
    btn.addEventListener('click', () => {
      renderPhase(i);
      autoplay.restart();
    });
    phaseBar.appendChild(btn);
  });

  renderPhase(0);
  autoplay.start();
}
