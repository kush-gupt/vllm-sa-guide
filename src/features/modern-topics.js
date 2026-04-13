import { modernTopicData } from '../data/modern-topic-data.js';
import { crossfade } from '../utils/crossfade.js';
import { initRovingTabindex } from '../utils/roving-tabindex.js';
import { activateTabButton } from '../utils/tab-utils.js';
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
      activateTabButton(modernTopicBtns, btn, {
        dataKey: 'topic',
        hashPrefix: pushHash ? 'topic-' : null,
        onActivate: updateModernTopic,
      });
    }

    modernTopicBtns.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn, true));
    });

    const tablist = document.querySelector('.modern-topic-buttons');
    if (tablist) initRovingTabindex(tablist, modernTopicBtns, btn => activateTab(btn, true));

    const hash = location.hash;
    const hashTopic = hash.startsWith('#topic-') ? hash.slice(7) : null;
    const initialTopic = (hashTopic && modernTopicData[hashTopic]) ? hashTopic : 'disagg';
    const matchBtn = Array.from(modernTopicBtns).find(b => b.dataset.topic === initialTopic);
    if (matchBtn) activateTab(matchBtn, false);
    else updateModernTopic(initialTopic);
  }
}
