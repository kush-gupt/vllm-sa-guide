export function createAutoplay(element, playBtn, { interval, onTick }) {
  let playing = true;
  let timer = null;

  function start() { stop(); timer = setInterval(onTick, interval); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  playBtn.addEventListener('click', () => {
    playing = !playing;
    playBtn.textContent = playing ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    if (playing) start(); else stop();
  });

  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
    else if (playing) start();
  }, { threshold: 0 }).observe(element);

  return { start, stop, restart() { if (playing) start(); } };
}
