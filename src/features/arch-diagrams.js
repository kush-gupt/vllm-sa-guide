import { renderDiagram } from '../utils/render-diagram.js';

const V1_ARCH_DIAGRAM = `graph TD
  subgraph Edge["API Edge"]
    API["API Server<br/><small>FastAPI · OpenAI-compat</small>"]
    IP["Input Processor<br/><small>Tokenize · multimodal</small>"]
    OP["Output Processor<br/><small>Detokenize · SSE</small>"]
  end
  subgraph Core["Engine Core"]
    SC["Scheduler<br/><small>Token budgets · KV blocks</small>"]
    KV["KV Cache Manager<br/><small>Block pool · prefix cache</small>"]
  end
  subgraph GPU["GPU Execution"]
    EX["Executor<br/><small>Uni / Multi / Ray</small>"]
    W["Workers + ModelRunner<br/><small>Forward pass · CUDA graphs</small>"]
  end
  API --> IP
  IP -->|ZMQ IPC| SC
  SC <--> KV
  SC --> EX
  EX --> W
  W -->|new tokens| OP
  OP -->|SSE stream| API`;

const LOOP_STEPS = [
  { angle: 270, num: '1', label: 'Schedule' },
  { angle:  30, num: '2', label: 'Execute' },
  { angle: 150, num: '3', label: 'Update' },
];

function renderEngineLoop(container) {
  if (!container) return;

  const cx = 210, cy = 180, r = 120;
  const nodeW = 120, nodeH = 54, nodeR = 14;
  const gap = 34;

  const rad = (d) => d * Math.PI / 180;
  const xAt = (a) => cx + r * Math.cos(rad(a));
  const yAt = (a) => cy + r * Math.sin(rad(a));

  const arrows = LOOP_STEPS.map((s, i) => {
    const next = LOOP_STEPS[(i + 1) % 3];
    const x1 = xAt(s.angle + gap).toFixed(1);
    const y1 = yAt(s.angle + gap).toFixed(1);
    const x2 = xAt(next.angle - gap).toFixed(1);
    const y2 = yAt(next.angle - gap).toFixed(1);
    return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" class="el-arrow" marker-end="url(#el-arrowhead)"/>`;
  }).join('\n      ');

  const nodes = LOOP_STEPS.map((s) => {
    const nx = xAt(s.angle);
    const ny = yAt(s.angle);
    return `<g>
        <rect x="${(nx - nodeW / 2).toFixed(1)}" y="${(ny - nodeH / 2).toFixed(1)}" width="${nodeW}" height="${nodeH}" rx="${nodeR}" class="el-node"/>
        <text x="${nx.toFixed(1)}" y="${(ny - 8).toFixed(1)}" class="el-num">${s.num}</text>
        <text x="${nx.toFixed(1)}" y="${(ny + 13).toFixed(1)}" class="el-label">${s.label}</text>
      </g>`;
  }).join('\n      ');

  container.innerHTML = `
    <svg viewBox="0 0 420 350" xmlns="http://www.w3.org/2000/svg" class="engine-loop-svg">
      <style>
        .el-orbit { fill: none; stroke: var(--card-border); stroke-width: 1.5; stroke-dasharray: 6 4; }
        .el-arrow { fill: none; stroke: var(--red); stroke-width: 2.5; stroke-linecap: round; }
        .el-node  { fill: var(--card-bg-alt); stroke: var(--red); stroke-width: 1.5; stroke-opacity: 0.35; }
        .el-num   { font-family: var(--font-mono); font-size: 12px; font-weight: 700; fill: var(--red); text-anchor: middle; }
        .el-label { font-family: var(--font-display); font-size: 17px; font-weight: 600; fill: var(--text); text-anchor: middle; }
        .el-center{ font-family: var(--font-text); font-size: 11px; fill: var(--text-dim); text-anchor: middle; letter-spacing: 0.08em; text-transform: uppercase; }
      </style>
      <defs>
        <marker id="el-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 1 2 L 8 5 L 1 8 z" fill="var(--red)" opacity="0.85"/>
        </marker>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" class="el-orbit engine-loop-orbit"/>
      ${arrows}
      ${nodes}
      <text x="${cx}" y="${cy + 5}" class="el-center">Engine Core</text>
    </svg>`;
}

export function init() {
  const loopContainer = document.getElementById('diagram-engine-loop');
  const archContainer = document.getElementById('diagram-v1-arch');

  renderEngineLoop(loopContainer);
  if (archContainer) renderDiagram(archContainer, V1_ARCH_DIAGRAM);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        setTimeout(() => {
          if (archContainer) renderDiagram(archContainer, V1_ARCH_DIAGRAM);
        }, 80);
        break;
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
