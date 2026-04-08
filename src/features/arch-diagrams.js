import { renderDiagram } from '../utils/render-diagram.js';

const ENGINE_LOOP_DIAGRAM = `graph LR
  S["🗓 Schedule"] --> E["⚡ Execute"]
  E --> U["📤 Update"]
  U --> S`;

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

export function init() {
  const loopContainer = document.getElementById('diagram-engine-loop');
  const archContainer = document.getElementById('diagram-v1-arch');

  if (loopContainer) renderDiagram(loopContainer, ENGINE_LOOP_DIAGRAM);
  if (archContainer) renderDiagram(archContainer, V1_ARCH_DIAGRAM);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        setTimeout(() => {
          if (loopContainer) renderDiagram(loopContainer, ENGINE_LOOP_DIAGRAM);
          if (archContainer) renderDiagram(archContainer, V1_ARCH_DIAGRAM);
        }, 80);
        break;
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
