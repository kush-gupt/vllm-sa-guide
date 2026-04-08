import { clamp } from '../utils/helpers.js';

export function init() {
  const tuneConcurrency = document.getElementById('tune-concurrency');
  const tuneBudget = document.getElementById('tune-budget');
  const tuneMemory = document.getElementById('tune-memory');
  const tunePrefix = document.getElementById('tune-prefix');

  if (tuneConcurrency && tuneBudget && tuneMemory && tunePrefix) {
    const tuneConcurrencyValue = document.getElementById('tune-concurrency-value');
    const tuneBudgetValue = document.getElementById('tune-budget-value');
    const tuneMemoryValue = document.getElementById('tune-memory-value');
    const tunePrefixValue = document.getElementById('tune-prefix-value');
    const scoreThroughput = document.getElementById('score-throughput');
    const scoreTtft = document.getElementById('score-ttft');
    const scoreItl = document.getElementById('score-itl');
    const scoreRisk = document.getElementById('score-risk');
    const scoreThroughputFill = document.getElementById('score-throughput-fill');
    const scoreTtftFill = document.getElementById('score-ttft-fill');
    const scoreItlFill = document.getElementById('score-itl-fill');
    const scoreRiskFill = document.getElementById('score-risk-fill');
    const tuningSummaryTitle = document.getElementById('tuning-summary-title');
    const tuningSummaryText = document.getElementById('tuning-summary-text');
    const tuningBullets = document.getElementById('tuning-bullets');

    function labelScore(score) {
      if (score < 35) return 'Low';
      if (score < 65) return 'Medium';
      return 'High';
    }

    function labelRisk(score) {
      if (score < 35) return 'Controlled';
      if (score < 65) return 'Rising';
      return 'High';
    }

    function updateScore(pill, fill, score, label, mode) {
      pill.textContent = label;
      fill.style.width = `${score}%`;
      fill.style.background =
        mode === 'risk'
          ? 'linear-gradient(90deg, var(--gold), var(--red))'
          : 'linear-gradient(90deg, var(--green), var(--gold))';
    }

    function setSummary(title, text, bullets) {
      tuningSummaryTitle.textContent = title;
      tuningSummaryText.textContent = text;
      tuningBullets.innerHTML = bullets.map(item => `<li>${item}</li>`).join('');
    }

    function updateTuningLab() {
      const concurrency = parseInt(tuneConcurrency.value, 10);
      const budget = parseInt(tuneBudget.value, 10);
      const memory = parseInt(tuneMemory.value, 10);
      const prefix = parseInt(tunePrefix.value, 10);

      const nConcurrency = (concurrency - 32) / (512 - 32);
      const nBudget = (budget - 1024) / (8192 - 1024);
      const nMemory = (memory - 70) / (98 - 70);
      const nPrefix = prefix / 90;

      const throughputScore = clamp(Math.round(35 + 30 * nConcurrency + 22 * nBudget + 8 * nMemory + 10 * nPrefix), 5, 95);
      const ttftScore = clamp(Math.round(74 - 20 * nBudget - 16 * nConcurrency + 18 * nPrefix + 8 * (1 - nMemory)), 5, 95);
      const itlScore = clamp(Math.round(72 - 24 * nBudget - 10 * nConcurrency + 6 * (1 - nMemory) + 6 * nPrefix), 5, 95);
      const riskScore = clamp(Math.round(12 + 32 * nMemory + 24 * nConcurrency + 10 * nBudget - 14 * nPrefix), 5, 95);

      tuneConcurrencyValue.textContent = String(concurrency);
      tuneBudgetValue.textContent = String(budget);
      tuneMemoryValue.textContent = `${memory}%`;
      tunePrefixValue.textContent = `${prefix}%`;

      tuneConcurrency.setAttribute('aria-valuetext', `Max concurrency: ${concurrency}`);
      tuneBudget.setAttribute('aria-valuetext', `Token budget: ${budget}`);
      tuneMemory.setAttribute('aria-valuetext', `GPU memory: ${memory}%`);
      tunePrefix.setAttribute('aria-valuetext', `Prefix reuse: ${prefix}%`);

      updateScore(scoreThroughput, scoreThroughputFill, throughputScore, labelScore(throughputScore), 'good');
      updateScore(scoreTtft, scoreTtftFill, ttftScore, labelScore(ttftScore), 'good');
      updateScore(scoreItl, scoreItlFill, itlScore, labelScore(itlScore), 'good');
      updateScore(scoreRisk, scoreRiskFill, riskScore, labelRisk(riskScore), 'risk');

      if (concurrency >= 352 && budget >= 6144) {
        setSummary(
          'Throughput-first shared service',
          'This profile packs more work into each scheduler step, assuming the workload can tolerate queuing and slower first-token delivery.',
          [
            'Useful for high-volume asynchronous or internal workloads.',
            'Watch TTFT and tail latency before using this for end-user chat.',
            'Consider disaggregated prefill if prompt-heavy traffic keeps crowding out decode.',
          ]
        );
      } else if (budget <= 2560 && concurrency <= 160) {
        setSummary(
          'Latency-first interactive chat',
          'This profile favors responsiveness over absolute throughput by keeping per-step work smaller and limiting how much traffic shares the batch.',
          [
            'Good when the user experience is dominated by first-token speed and stream smoothness.',
            'Leave memory headroom for prompt variability and multimodal surprises.',
            'Raise prefix reuse where possible to recover throughput without inflating token budget.',
          ]
        );
      } else if (prefix >= 60) {
        setSummary(
          'Prefix-heavy assistant',
          'Repeated system prompts, RAG scaffolding, or tool schemas are doing real work here, so prefix caching can rescue TTFT and reduce repeated compute.',
          [
            'Great fit for assistants with stable system prompts or repeated retrieval scaffolds.',
            'Keep enough KV headroom so reused blocks are not constantly evicted.',
            'Measure cache hit effectiveness alongside TTFT, not just total tokens per second.',
          ]
        );
      } else if (memory >= 95 || riskScore >= 70) {
        setSummary(
          'High-density cluster',
          'Memory efficiency is pushed to the edge here, which works for stable workloads but increases sensitivity to long prompts, multimodal assets, and preemption.',
          [
            'Watch KV pressure and preemption before raising density further.',
            'Cap context length to real business need instead of headline maximums.',
            'Use quantization or more replicas before turning every instability into a scheduling problem.',
          ]
        );
      } else {
        setSummary(
          'Balanced shared cluster',
          'This profile fits a shared chat service: enough token budget for throughput, enough headroom to avoid preemption, and enough prefix reuse to benefit from repeated scaffolding.',
          [
            'Raise concurrency when requests are short and similar.',
            'Lower token budget if chat streaming feels sticky or TTFT drifts.',
            'Protect memory headroom when context length or multimodal assets vary.',
          ]
        );
      }
    }

    [tuneConcurrency, tuneBudget, tuneMemory, tunePrefix].forEach(input => {
      input.addEventListener("input", updateTuningLab);
    });
    updateTuningLab();
  }
}
