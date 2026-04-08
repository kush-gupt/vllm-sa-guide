import { modernTopicData } from '../data/modern-topic-data.js';
import { crossfade } from '../utils/crossfade.js';
import { bindAbbrTips } from './tooltips.js';

export function init() {
  const section = document.getElementById('modern-inference');
  const modernTopicBtns = document.querySelectorAll('.modern-topic-btn');
  const modernTopicTitle = document.getElementById('modern-topic-title');
  const modernTopicWhat = document.getElementById('modern-topic-what');
  const modernTopicWhy = document.getElementById('modern-topic-why');
  const modernTopicWhen = document.getElementById('modern-topic-when');
  const modernTopicSource = document.getElementById('modern-topic-source');

  if (
    modernTopicBtns.length &&
    modernTopicTitle &&
    modernTopicWhat &&
    modernTopicWhy &&
    modernTopicWhen &&
    modernTopicSource
  ) {
    let modernInitialized = false;

    function removeBoundTipsFrom(container) {
      container.querySelectorAll('.jargon-term').forEach((el) => {
        const tid = el.getAttribute('aria-describedby');
        if (tid) document.getElementById(tid)?.remove();
      });
    }

    function updateModernTopicDirect(topic) {
      const data = modernTopicData[topic];
      if (!data) return;
      removeBoundTipsFrom(modernTopicWhat);
      removeBoundTipsFrom(modernTopicWhy);
      removeBoundTipsFrom(modernTopicWhen);
      modernTopicTitle.textContent = data.title;
      modernTopicWhat.innerHTML = data.what;
      modernTopicWhy.innerHTML = data.why;
      modernTopicWhen.innerHTML = data.when;
      modernTopicSource.innerHTML = data.source;
      const panel = section
        ? section.querySelector('.modern-topic-panel')
        : document.querySelector('.modern-topic-panel');
      if (panel) bindAbbrTips(panel);
    }

    function updateModernTopic(topic) {
      if (!modernInitialized) {
        modernInitialized = true;
        updateModernTopicDirect(topic);
        return;
      }
      const panel = section
        ? section.querySelector('.modern-topic-panel')
        : document.querySelector('.modern-topic-panel');
      crossfade(panel, () => updateModernTopicDirect(topic));
    }

    function activateTab(btn, pushHash) {
      modernTopicBtns.forEach(other => {
        other.classList.remove('active');
        other.setAttribute('aria-selected', 'false');
        other.tabIndex = -1;
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.tabIndex = 0;
      const topic = btn.dataset.topic;
      updateModernTopic(topic);
      if (pushHash) history.replaceState(null, '', '#topic-' + topic);
    }

    modernTopicBtns.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn, true));
    });

    const tablist = document.querySelector('.modern-topic-buttons');
    if (tablist) {
      tablist.addEventListener('keydown', (e) => {
        const btns = Array.from(modernTopicBtns);
        const idx = btns.indexOf(document.activeElement);
        if (idx === -1) return;
        let next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % btns.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + btns.length) % btns.length;
        if (next !== -1) { e.preventDefault(); btns[next].focus(); activateTab(btns[next], true); }
      });
    }

    const hash = location.hash;
    const hashTopic = hash.startsWith('#topic-') ? hash.slice(7) : null;
    const initialTopic = (hashTopic && modernTopicData[hashTopic]) ? hashTopic : 'disagg';
    const matchBtn = Array.from(modernTopicBtns).find(b => b.dataset.topic === initialTopic);
    if (matchBtn) activateTab(matchBtn, false);
    else updateModernTopic(initialTopic);
  }
}
