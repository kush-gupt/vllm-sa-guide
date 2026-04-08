import 'prismjs/themes/prism-tomorrow.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';

export function init() {
  Prism.highlightAll();
}
