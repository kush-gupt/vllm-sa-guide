import 'prismjs/themes/prism-tomorrow.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';

export function init() {
  const blocks = document.querySelectorAll('pre > code[class*="language-"]');
  if (!blocks.length) { Prism.highlightAll(); return; }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        Prism.highlightElement(entry.target);
      });
    },
    { rootMargin: '200px' }
  );

  blocks.forEach(block => observer.observe(block));
}
