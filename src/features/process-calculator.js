export function init() {
  const tpInput = document.getElementById('tp-size');
  const ppInput = document.getElementById('pp-size');
  const dpInput = document.getElementById('dp-size');
  const formulaEl = document.getElementById('calc-formula');
  const treeEl = document.getElementById('calc-tree');
  if (!tpInput || !ppInput || !dpInput) return;

  function updateCalc() {
    const tp = Math.max(1, parseInt(tpInput.value) || 1);
    const pp = Math.max(1, parseInt(ppInput.value) || 1);
    const dp = Math.max(1, parseInt(dpInput.value) || 1);

    const apiServers = dp;
    const engineCores = dp;
    const workersPerEngine = tp * pp;
    const workers = workersPerEngine * dp;
    const hasCoord = dp > 1;
    const coord = hasCoord ? 1 : 0;
    const total = apiServers + engineCores + workers + coord;
    const gpus = tp * pp * dp;

    const resApi = document.getElementById('res-api');
    const resEngine = document.getElementById('res-engine');
    const resWorkers = document.getElementById('res-workers');
    const resCoord = document.getElementById('res-coord');
    const resTotal = document.getElementById('res-total');
    const resGpus = document.getElementById('res-gpus');
    const coordRow = document.getElementById('coord-row');

    if (resApi) resApi.textContent = apiServers;
    if (resEngine) resEngine.textContent = engineCores;
    if (resWorkers) resWorkers.textContent = workers;
    if (resCoord) resCoord.textContent = coord;
    if (resTotal) resTotal.textContent = total;
    if (resGpus) resGpus.textContent = gpus;
    if (coordRow) coordRow.style.display = hasCoord ? 'flex' : 'none';

    if (formulaEl) {
      const parts = [
        `API\u00a0Servers\u00a0(default) = DP (${dp})`,
        `Engine\u00a0Cores = DP (${dp})`,
        `GPU\u00a0Workers = TP\u00d7PP\u00d7DP (${tp}\u00d7${pp}\u00d7${dp} = ${workers})`,
      ];
      if (hasCoord) parts.push('DP\u00a0Coordinator = 1');
      formulaEl.innerHTML = parts
        .map(p => `<span class="formula-chip">${p}</span>`)
        .join('');
    }

    if (treeEl) {
      renderTree(treeEl, tp, pp, dp, workersPerEngine, hasCoord);
    }
  }

  function renderTree(el, tp, pp, dp, workersPerEngine, hasCoord) {
    const lines = [];

    if (dp > 1) {
      for (let d = 0; d < dp; d++) {
        const isLastDP = d === dp - 1 && !hasCoord;
        const dpPrefix = isLastDP ? '\u2514' : '\u251c';
        const dpCont = isLastDP ? ' ' : '\u2502';

        lines.push(line(0, dpPrefix, `API Server ${d + 1}`, 'api'));
        lines.push(line(1, '\u2514', `Engine Core DP${d}`, 'engine', dpCont));
        for (let w = 0; w < workersPerEngine; w++) {
          const wPrefix = w === workersPerEngine - 1 ? '\u2514' : '\u251c';
          const rank = d * workersPerEngine + w;
          lines.push(line(2, wPrefix, `vLLM Worker ${rank}`, 'worker', dpCont, ' '));
        }
      }
      if (hasCoord) {
        lines.push(line(0, '\u2514', 'DP Coordinator', 'coord'));
      }
    } else {
      lines.push(line(0, null, 'API Server', 'api'));
      lines.push(line(0, '\u2514', 'Engine Core', 'engine'));
      for (let w = 0; w < workersPerEngine; w++) {
        const wPrefix = w === workersPerEngine - 1 ? '\u2514' : '\u251c';
        lines.push(line(1, wPrefix, `vLLM Worker ${w}`, 'worker', ' '));
      }
    }

    el.innerHTML = lines.join('\n');
  }

  function line(depth, connector, label, type, ...parentContinuations) {
    let prefix = '';
    for (let i = 0; i < parentContinuations.length; i++) {
      const ch = parentContinuations[i] || ' ';
      prefix += `<span class="ptree-gutter">${ch === '\u2502' ? '\u2502' : ' '}</span>`;
    }
    const conn = connector
      ? `<span class="ptree-connector">${connector}\u2500\u2500</span>`
      : '';
    return `<div class="ptree-line">${prefix}${conn}<span class="ptree-label ptree-${type}">${label}</span></div>`;
  }

  [tpInput, ppInput, dpInput].forEach(input => {
    input.addEventListener('input', updateCalc);
  });
  updateCalc();
}
