let ctx, canvasW, canvasH, dpr, isDark = true;
let animId;

const VOCAB = [
  'The', 'model', 'returns', 'async', 'def', 'import', 'class',
  'attention', 'token', 'batch', 'GPU', 'memory', 'cache',
  'inference', 'request', 'stream', 'output', 'layer', 'weight',
  'embed', 'decode', 'prefill', 'query', 'key', 'value',
  'forward', 'compute', 'tensor', 'block', 'schedule',
  'prompt', 'response', 'latency', 'yield', 'True', 'None',
  'self', 'data', 'config', 'norm', 'softmax', 'linear',
];

let LANE_COUNT, FONT_SIZE, LANE_GAP, TOKEN_H, SPAWN_MS;
const TOKEN_PAD_X = 7;
const TOKEN_GAP = 5;
const TOKEN_R = 3;

let fontStr;
const widthCache = new Map();

function tokenWidth(text) {
  if (widthCache.has(text)) return widthCache.get(text);
  ctx.font = fontStr;
  const w = ctx.measureText(text).width + TOKEN_PAD_X * 2;
  widthCache.set(text, w);
  return w;
}

function pickTokens() {
  const count = 6 + Math.floor(Math.random() * 10);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(VOCAB[Math.floor(Math.random() * VOCAB.length)]);
  }
  return out;
}

function createLane(y) {
  return {
    y: y + (Math.random() * 8 - 4),
    baseY: y,
    tokens: pickTokens(),
    revealed: 0,
    prefillDur: 500 + Math.random() * 1500,
    born: performance.now(),
    opacity: 0,
    done: false,
    fadeStart: 0,
  };
}

let lanes = [];

function initLanes() {
  lanes = [];
  const margin = LANE_GAP;
  const usable = canvasH - margin * 2;
  const gap = LANE_COUNT > 1 ? usable / (LANE_COUNT - 1) : 0;
  for (let i = 0; i < LANE_COUNT; i++) {
    const lane = createLane(margin + i * gap);
    lane.born = performance.now() - Math.random() * 4000;
    lanes.push(lane);
  }
}

function rrect(x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function draw(now) {
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.font = fontStr;
  ctx.textBaseline = 'middle';

  for (let li = 0; li < lanes.length; li++) {
    const lane = lanes[li];
    const elapsed = now - lane.born;

    if (!lane.done) lane.opacity = Math.min(1, elapsed / 600);

    let laneAlpha = lane.opacity;
    if (lane.done) {
      const fadeMs = now - lane.fadeStart;
      laneAlpha *= Math.max(0, 1 - fadeMs / 800);
      if (fadeMs > 800) {
        lanes[li] = createLane(lane.baseY);
        continue;
      }
    }
    if (laneAlpha < 0.01) continue;

    if (elapsed < lane.prefillDur) {
      const progress = elapsed / lane.prefillDur;
      const shimmer = 0.2 + 0.12 * Math.sin(elapsed * 0.01);
      const a = shimmer * laneAlpha * (isDark ? 1 : 0.65);
      ctx.fillStyle = `rgba(238, 0, 0, ${a.toFixed(3)})`;
      ctx.beginPath();
      rrect(24, lane.y, 50 + progress * 90, TOKEN_H, TOKEN_R);
      ctx.fill();
      continue;
    }

    const decodeMs = elapsed - lane.prefillDur;
    lane.revealed = Math.min(lane.tokens.length, Math.floor(decodeMs / SPAWN_MS) + 1);

    let x = 24;
    for (let i = 0; i < lane.revealed; i++) {
      const text = lane.tokens[i];
      const tw = tokenWidth(text);
      if (x + tw > canvasW - 24) break;

      const age = decodeMs - i * SPAWN_MS;
      const fadeIn = Math.min(1, age / 200);
      const breathe = 0.82 + 0.18 * Math.sin(now * 0.0025 + i * 1.7);
      const a = fadeIn * laneAlpha * breathe;
      const isNewest = i === lane.revealed - 1 && lane.revealed < lane.tokens.length;

      ctx.fillStyle = `rgba(238, 0, 0, ${((isDark ? 0.1 : 0.07) * a).toFixed(3)})`;
      ctx.beginPath();
      rrect(x, lane.y, tw, TOKEN_H, TOKEN_R);
      ctx.fill();

      if (isNewest) {
        ctx.strokeStyle = `rgba(238, 0, 0, ${(0.35 * a).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        rrect(x, lane.y, tw, TOKEN_H, TOKEN_R);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(238, 0, 0, ${((isDark ? 0.4 : 0.28) * a).toFixed(3)})`;
      ctx.fillText(text, x + TOKEN_PAD_X, lane.y + TOKEN_H / 2 + 1);

      x += tw + TOKEN_GAP;
    }

    if (lane.revealed < lane.tokens.length && !lane.done) {
      if (Math.sin(now * 0.005) > 0) {
        const ca = (isDark ? 0.5 : 0.35) * laneAlpha;
        ctx.fillStyle = `rgba(238, 0, 0, ${ca.toFixed(3)})`;
        ctx.fillRect(x + 2, lane.y + 4, 1.5, TOKEN_H - 8);
      }
    }

    if (lane.revealed >= lane.tokens.length && !lane.done) {
      lane.done = true;
      lane.fadeStart = now + 300;
    }
  }

  animId = requestAnimationFrame(draw);
}

self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init': {
      const offscreen = msg.canvas;
      ctx = offscreen.getContext('2d');
      dpr = msg.dpr;
      canvasW = msg.width;
      canvasH = msg.height;
      const isMobile = msg.isMobile;
      LANE_COUNT = isMobile ? 5 : 8;
      FONT_SIZE = isMobile ? 10 : 12;
      LANE_GAP = isMobile ? 32 : 38;
      TOKEN_H = isMobile ? 20 : 24;
      SPAWN_MS = isMobile ? 220 : 160;
      fontStr = `500 ${FONT_SIZE}px "Red Hat Mono", "SF Mono", "Fira Code", monospace`;
      isDark = msg.isDark;
      offscreen.width = canvasW * dpr;
      offscreen.height = canvasH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLanes();
      draw(performance.now());
      break;
    }
    case 'resize':
      canvasW = msg.width;
      canvasH = msg.height;
      dpr = msg.dpr;
      ctx.canvas.width = canvasW * dpr;
      ctx.canvas.height = canvasH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      widthCache.clear();
      initLanes();
      break;
    case 'theme':
      isDark = msg.isDark;
      break;
    case 'pause':
      cancelAnimationFrame(animId);
      break;
    case 'resume':
      cancelAnimationFrame(animId);
      requestAnimationFrame(draw);
      break;
  }
};
