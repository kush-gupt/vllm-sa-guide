function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  const bg = style.getPropertyValue('--bg').trim();
  const fg = style.getPropertyValue('--text').trim();
  const accent = style.getPropertyValue('--red').trim();
  const muted = style.getPropertyValue('--text-dim').trim();
  const surface = style.getPropertyValue('--card-bg').trim();
  const border = style.getPropertyValue('--card-border').trim();
  return { bg, fg, accent, muted, surface, border };
}

export async function renderDiagram(containerEl, mermaidSource) {
  if (!containerEl) return;
  const colors = getThemeColors();
  try {
    const { renderMermaidSVG } = await import('beautiful-mermaid');
    const svg = renderMermaidSVG(mermaidSource, {
      ...colors,
      font: '"Red Hat Text", system-ui, sans-serif',
      transparent: true,
      padding: 24,
    });
    containerEl.innerHTML = svg;
  } catch (err) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'text-align:center;padding:24px';
    const msg = document.createElement('pre');
    msg.style.cssText = 'color:var(--red);font-size:0.85rem;margin-bottom:12px';
    msg.textContent = 'Diagram failed to load: ' + err.message;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry';
    retry.style.cssText = 'padding:6px 16px;border-radius:6px;border:1px solid var(--red);background:transparent;color:var(--red);cursor:pointer;font-family:var(--font-text)';
    retry.addEventListener('click', () => renderDiagram(containerEl, mermaidSource));
    wrapper.appendChild(msg);
    wrapper.appendChild(retry);
    containerEl.innerHTML = '';
    containerEl.appendChild(wrapper);
  }
}
