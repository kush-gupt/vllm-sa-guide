export function init() {
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const hCtx = heroCanvas.getContext('2d');
  if (!hCtx) return;

  let heroAnimId;
  let heroStartTime = performance.now();
  let resizeTimer;

  function resizeHeroCanvas() {
    const dpr = window.devicePixelRatio || 1;
    heroCanvas.width = heroCanvas.offsetWidth * dpr;
    heroCanvas.height = heroCanvas.offsetHeight * dpr;
    hCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const particles = [];
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 35 : 80;
  const CONNECT_DIST = isMobile ? 140 : 185;
  const SPEED = 0.45;

  function initParticles() {
    particles.length = 0;
    const w = heroCanvas.offsetWidth;
    const h = heroCanvas.offsetHeight;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseVx: (Math.random() - 0.5) * SPEED,
        baseVy: (Math.random() - 0.5) * SPEED,
        baseR: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        freqX: 0.0003 + Math.random() * 0.0004,
        freqY: 0.0002 + Math.random() * 0.0005,
        breathFreq: 0.001 + Math.random() * 0.002,
      });
    }
  }

  const CELL_SIZE = CONNECT_DIST;

  function buildGrid(w, h) {
    const cols = Math.ceil(w / CELL_SIZE) + 1;
    const rows = Math.ceil(h / CELL_SIZE) + 1;
    const grid = new Array(cols * rows);
    for (let i = 0; i < grid.length; i++) grid[i] = [];

    particles.forEach((p, idx) => {
      const cx = Math.floor(p.x / CELL_SIZE);
      const cy = Math.floor(p.y / CELL_SIZE);
      const key = cy * cols + cx;
      if (key >= 0 && key < grid.length) grid[key].push(idx);
    });

    return { grid, cols, rows };
  }

  // Pre-render a radial glow sprite (replaces expensive per-particle shadowBlur)
  const GLOW_SIZE = 48;
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = GLOW_SIZE;
  glowCanvas.height = GLOW_SIZE;
  const glowCtx = glowCanvas.getContext('2d');
  const halfGlow = GLOW_SIZE / 2;
  const grad = glowCtx.createRadialGradient(halfGlow, halfGlow, 0, halfGlow, halfGlow, halfGlow);
  grad.addColorStop(0, 'rgba(238, 0, 0, 0.4)');
  grad.addColorStop(1, 'rgba(238, 0, 0, 0)');
  glowCtx.fillStyle = grad;
  glowCtx.fillRect(0, 0, GLOW_SIZE, GLOW_SIZE);

  const BUCKET_COUNT = 4;
  const lineBuckets = Array.from({ length: BUCKET_COUNT }, () => []);

  function drawHero(now) {
    const w = heroCanvas.offsetWidth;
    const h = heroCanvas.offsetHeight;
    hCtx.clearRect(0, 0, w, h);

    const t = now - heroStartTime;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const baseAlpha = isDark ? 0.6 : 0.4;
    const linePulse = 0.82 + 0.18 * Math.sin(t * 0.00045);
    const lineBaseAlpha = (isDark ? 0.12 : 0.085) * linePulse;

    particles.forEach(p => {
      const driftX = Math.sin(t * p.freqX + p.phase) * 0.35;
      const driftY = Math.cos(t * p.freqY + p.phase * 1.3) * 0.35;
      p.x += p.baseVx + driftX;
      p.y += p.baseVy + driftY;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    });

    const { grid, cols, rows } = buildGrid(w, h);
    const distSq = CONNECT_DIST * CONNECT_DIST;

    for (let b = 0; b < BUCKET_COUNT; b++) lineBuckets[b].length = 0;

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const cell = grid[cy * cols + cx];
        if (!cell.length) continue;

        for (let ncx = cx; ncx <= cx + 1 && ncx < cols; ncx++) {
          for (let ncy = cy - 1; ncy <= cy + 1 && ncy < rows; ncy++) {
            if (ncy < 0) continue;
            const neighbor = grid[ncy * cols + ncx];
            if (!neighbor.length) continue;

            for (let ii = 0; ii < cell.length; ii++) {
              const pi = particles[cell[ii]];
              for (let jj = (ncx === cx && ncy === cy) ? ii + 1 : 0; jj < neighbor.length; jj++) {
                const pj = particles[neighbor[jj]];
                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < distSq) {
                  const ratio = 1 - Math.sqrt(d2) / CONNECT_DIST;
                  const bucket = Math.min(Math.floor(ratio * BUCKET_COUNT), BUCKET_COUNT - 1);
                  lineBuckets[bucket].push(pi.x, pi.y, pj.x, pj.y);
                }
              }
            }
          }
        }
      }
    }

    // Draw all connection lines in a few batched strokes instead of per-line
    hCtx.lineWidth = 1;
    for (let b = 0; b < BUCKET_COUNT; b++) {
      const coords = lineBuckets[b];
      if (!coords.length) continue;
      hCtx.strokeStyle = `rgba(238, 0, 0, ${(lineBaseAlpha * ((b + 0.5) / BUCKET_COUNT)).toFixed(3)})`;
      hCtx.beginPath();
      for (let i = 0; i < coords.length; i += 4) {
        hCtx.moveTo(coords[i], coords[i + 1]);
        hCtx.lineTo(coords[i + 2], coords[i + 3]);
      }
      hCtx.stroke();
    }

    // Draw glow sprites then particle dots (cheap drawImage replaces shadowBlur)
    particles.forEach(p => {
      const breath = 0.8 + 0.2 * Math.sin(t * p.breathFreq + p.phase);
      const r = p.baseR * breath;
      const alpha = baseAlpha * (0.7 + 0.3 * breath);
      const glowR = r * 6;

      hCtx.globalAlpha = alpha;
      hCtx.drawImage(glowCanvas, p.x - glowR, p.y - glowR, glowR * 2, glowR * 2);

      hCtx.globalAlpha = 1;
      hCtx.fillStyle = `rgba(238, 0, 0, ${alpha.toFixed(3)})`;
      hCtx.beginPath();
      hCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      hCtx.fill();
    });
    hCtx.globalAlpha = 1;

    heroAnimId = requestAnimationFrame(drawHero);
  }

  resizeHeroCanvas();
  initParticles();
  drawHero(performance.now());

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeHeroCanvas();
      initParticles();
    }, 150);
  });

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(heroAnimId);
        } else {
          requestAnimationFrame(drawHero);
        }
      });
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroCanvas);
}
