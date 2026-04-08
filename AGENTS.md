# Agent instructions for vllm-inference-guide

## What this is

A single-page interactive guide explaining modern LLM inference with vLLM as the anchor. Vendor-neutral educational resource for practitioners, engineers, and anyone evaluating inference engines. Vanilla JS + CSS, bundled with Vite. No framework.

## Critical context

- **This is a static site, not an app.** There is no backend, no API, no database. The build output (`dist/`) is plain HTML/CSS/JS served from a file server.
- **All interactivity is vanilla JS.** Do not introduce React, Vue, Svelte, or any UI framework. Every feature is a self-contained ES module under `src/features/` with a single `init()` export.
- **CSS is in partials, not a preprocessor.** The stylesheets use plain CSS with `@import`. Do not add Sass, PostCSS, Tailwind, or any CSS toolchain. Design tokens live in `src/styles/tokens.css` as CSS custom properties.
- **The CSS `<link>` must stay in `<head>`.** The stylesheet is loaded via `<link rel="stylesheet" href="/src/styles/main.css">` in `index.html`, NOT via a JS import. This prevents flash-of-unstyled-content. Vite processes the `@import` chain during build.
- **Prism.js loads from npm, not CDN.** `prismjs` is an npm dependency; its CSS theme is pulled via `@import` in `main.css` and language grammars are imported in `syntax-highlight.js`. Diagrams use `beautiful-mermaid` via npm (lazy-loaded by `arch-diagrams.js`), also not CDN.

## Module conventions

Each feature module in `src/features/` follows this pattern:

```js
import { someData } from '../data/some-data.js';
import { someUtil } from '../utils/some-util.js';

export function init() {
  const el = document.getElementById('my-element');
  if (!el) return;  // guard: no-op if HTML section is absent
  // ... feature logic
}
```

- Always guard on DOM elements. Features must be safe to call even if their HTML section is removed.
- Large data objects (> ~50 lines) go in `src/data/` as named exports, not inline in the feature.
- Shared utilities (crossfade, clamp) live in `src/utils/`.
- The only cross-module wiring is `batching-lab.js` → `chunked-prefill.js` via the `onBatchSync` callback.

## CSS organization

| File | Contents |
|---|---|
| `tokens.css` | `:root` custom properties, `[data-theme="light"]` overrides |
| `base.css` | Reset, typography, keyframes, section basics, reveal/crossfade |
| `layout.css` | Nav, hero, footer |
| `components.css` | Cards, pills, badges, tables, grids, all static component styles |
| `interactive.css` | Allocator showdown, PA cinema, batching lab, tuning lab, all interactive widget styles |
| `responsive.css` | All `@media` queries consolidated in one file |

When adding styles for a new feature, put them in the appropriate partial. If a feature is interactive (has JS), its styles go in `interactive.css`. If it's a static layout component, use `components.css`.

## How to verify changes

```bash
npm run dev                    # start dev server with HMR
npm run build                  # production build to dist/
node --check src/**/*.js       # syntax-check all modules (no runtime needed)
```

There are no automated tests. Verify interactive features manually in the browser: theme toggle, allocator showdown slider, PA cinema play/pause, batching lab workload buttons + step slider, chunked prefill stepper, modern topic switcher, tuning lab sliders, process calculator inputs, parallelism tabs.

## Common pitfalls

- **Forgetting the DOM guard.** Every `init()` must check that its elements exist before wiring listeners. The guide may be served with sections removed.
- **CSS specificity from "refresh overrides."** The original CSS had a late `REFRESH OVERRIDES` section that re-declares selectors to override earlier rules. These overrides are now folded into `interactive.css` and `responsive.css` — they must come AFTER the base declarations for the same selectors. Keep this ordering when editing.
- **Diagram re-render on theme change.** `arch-diagrams.js` re-renders Mermaid diagrams via `beautiful-mermaid` when the theme toggles, picking up updated CSS custom properties for colors.
- **`@import` order in `main.css` matters.** `tokens.css` must be first (variables), `responsive.css` must be last (media queries override earlier rules).

## Do not

- Add a CSS preprocessor or utility framework.
- Move the CSS `<link>` into a JS import (causes FOUC).
- Add Node.js runtime dependencies beyond `prismjs` and `beautiful-mermaid` — Vite is the only dev dependency.
- Create test files unless explicitly asked — the project has no test infrastructure.
- Modify `index.html` structure without checking that all feature modules still find their DOM elements by ID.
