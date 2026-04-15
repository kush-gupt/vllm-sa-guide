# Agent instructions for vllm-inference-guide

## What this is

A single-page interactive guide explaining modern LLM inference with vLLM as the anchor. Vendor-neutral educational resource for practitioners, engineers, and anyone evaluating inference engines. Vanilla JS + CSS, bundled with Vite. No framework.

## Critical context

- **This is a static site, not an app.** There is no backend, no API, no database. The build output (`dist/`) is plain HTML/CSS/JS served from a file server (Cloudflare Workers or Caddy).
- **All interactivity is vanilla JS.** Do not introduce React, Vue, Svelte, or any UI framework. Every feature is a self-contained ES module under `src/features/` with a single `init()` export.
- **CSS is in partials, not a preprocessor.** The stylesheets use plain CSS with `@import`. Do not add Sass, PostCSS, Tailwind, or any CSS toolchain. Design tokens live in `src/styles/tokens.css` as CSS custom properties.
- **The CSS `<link>` must stay in `<head>`.** The stylesheet is loaded via `<link rel="stylesheet" href="/src/styles/main.css">` in `index.html`, NOT via a JS import. This prevents flash-of-unstyled-content. Vite processes the `@import` chain during build.
- **Prism.js loads from npm, not CDN.** `prismjs` is an npm dependency; its CSS theme is pulled via `@import` in `main.css` and language grammars are imported in `syntax-highlight.js`. Diagrams use `beautiful-mermaid` via npm (lazy-loaded by `arch-diagrams.js`), also not CDN.

## Path chooser architecture

The site gates content behind a path-chooser so users only see sections relevant to their role. This is the most important cross-cutting system to understand before making changes.

### How it works

1. `<html>` gets a `data-active-path` attribute (`business`, `ops`, `deep`, or `all`). When absent, no path is chosen.
2. Each content `<section>` has a `data-paths` attribute listing which paths include it (e.g. `data-paths="business ops"`).
3. CSS rules in `components.css` use `html:not([data-active-path]) section[data-paths]` and `html[data-active-path="X"] section[data-paths]:not([data-paths~="X"])` to `display: none` non-matching sections.
4. `path-chooser.js` manages all state: `localStorage`, `?path=` URL param, nav link filtering, badge, and the switcher section.

### Section-to-path mapping

| Section ID | `data-paths` value |
|---|---|
| `hero` | *(none — always visible)* |
| `reading-paths` | *(none — always visible)* |
| `why` | `business ops` |
| `modern-inference` | `business ops` |
| `models` | `business ops` |
| `deployment` | `ops` |
| `paged-attention` | `deep` |
| `batching` | `deep` |
| `architecture` | `deep` |
| `tuning` | `ops deep` |
| `reference` | `business ops deep` |
| `path-switcher` | *(none — controlled by `hidden` attr + CSS)* |

### If you add a new section

1. Add `data-paths="..."` to the `<section>` tag with the appropriate path tokens.
2. If it needs interactive JS, add a `lazySection()` call in `main.js` — the observer will only fire when the section becomes visible.
3. The nav `<ul>` in `index.html` has `<li>` elements for each section link. `path-chooser.js` hides `<li>` elements whose target section is outside the active path. This is automatic as long as the `<a href="#section-id">` matches a section with `data-paths`.
4. If the section belongs to a path that currently has no nav divider shown (business or deep), consider whether the nav divider logic in `updateNav()` needs updating.

### The two card sets

There are two sets of reading-path cards with different `data-` attributes:

- **Gate cards** (`#reading-paths`): use `data-path="business"` etc. These are the initial chooser.
- **Switcher cards** (`#path-switcher`): use `data-switch-path="business"` etc. These show at the end of the path for switching. JS hides the card matching the current path so only the other two are visible.

Both sets have identical visual structure (SVG icons, `<h3>`, description, step list) — keep them in sync when editing content.

## Lazy loading and IntersectionObserver interactions

This is where most subtle bugs come from.

### How section lazy loading works

`main.js` calls `lazySection(sectionId, loaders)` for each section with interactive JS. This creates an `IntersectionObserver` on the `<section>` element. When it enters the viewport (with 200px margin), the observer fires, disconnects itself, and dynamically `import()`s the feature modules.

**The gotcha:** When a section is `display: none` (hidden by path-chooser CSS), it is never intersecting. The observer never fires. When the path changes and the section becomes visible, the old observer is already dead. That's why `main.js` keeps a `pendingObservers` Map — on `path-changed` events, it re-creates observers for sections whose modules haven't loaded yet.

### How reveal animations work

`reveal.js` uses a separate `IntersectionObserver` on `.reveal` elements. Same problem: elements inside hidden sections never trigger. `reveal.js` exports a `reobserve()` function that scans for `.reveal:not(.visible)` elements and re-observes them. Both `main.js` and `path-chooser.js` call it after path changes.

### `content-visibility: auto`

Sections use `content-visibility: auto` with `contain-intrinsic-block-size: auto 800px` (in `base.css`). This is fine — when sections are `display: none`, `content-visibility` has no effect. When they become visible, the browser handles progressive rendering.

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

- Always guard on DOM elements. Features must be safe to call even if their HTML section is removed or hidden.
- Large data objects (> ~50 lines) go in `src/data/` as named exports, not inline in the feature.
- Shared utilities (crossfade, clamp) live in `src/utils/`.
- Some modules export additional functions beyond `init()`: `nav.js` exports `repositionPill()`, `reveal.js` exports `reobserve()`, `path-chooser.js` exports `activatePath()`. These are consumed by other eager-loaded modules.

## Cross-module dependencies

Most modules are independent, but these have coupling you need to be aware of:

| Consumer | Provider | Mechanism |
|---|---|---|
| `path-chooser.js` | `nav.js` | Imports `repositionPill()` to update the nav pill after filtering links |
| `path-chooser.js` | `reveal.js` | Imports `reobserve()` to re-trigger reveals on newly visible sections |
| `main.js` | `reveal.js` | Imports `reobserve()`, calls it on `path-changed` events |
| `main.js` | `path-chooser.js` | Eagerly imports and inits it; listens for `path-changed` custom event |
| `batching-lab.js` | `chunked-prefill.js` | `onBatchSync` callback |

## Nav system

The nav has several cooperating pieces:

- **Pill highlight**: CSS `::before` pseudo-element on `.nav-links` positioned via `--pill-x/y/w/h` CSS variables. `nav.js` updates these from `getBoundingClientRect()`. The pill animates position/size via CSS transition.
- **Active section tracking**: `IntersectionObserver` on `.section[id]` with `rootMargin: '-20% 0px -80% 0px'`. Whichever section is in view gets its nav link marked `.active`.
- **Hidden section guard**: If `currentId` points to a `display: none` section (hidden by path-chooser), `nav.js` clears the active state. It also checks `link.closest('li[hidden]')` before positioning the pill.
- **Mobile**: The nav links become an expandable dropdown. Focus trap keeps Tab cycling within the menu. **The mobile `.nav-links` transition must only animate `opacity`** — not `padding`, `height`, or other layout-affecting properties. `positionPill()` calls `getBoundingClientRect()` on a double-rAF after the menu opens; if layout properties are mid-transition at that point, the pill lands between links instead of on the active one.

### The nav divider

The `<li class="nav-divider">` separates "start here" sections from "deep dive" sections. `path-chooser.js` hides it when the active path is `business` or `deep` (since those paths only show one side of the divide).

## CSS organization

| File | Contents |
|---|---|
| `tokens.css` | `:root` custom properties, `[data-theme="light"]` overrides |
| `base.css` | Reset, typography, keyframes, section basics, reveal/crossfade |
| `layout.css` | Nav, hero, footer |
| `components.css` | Cards, pills, badges, tables, grids, path-chooser gating rules, path-switcher, nav badge |
| `interactive.css` | Allocator showdown, PA cinema, batching lab, tuning lab, all interactive widget styles |
| `responsive.css` | All `@media` queries consolidated in one file |

When adding styles for a new feature, put them in the appropriate partial. If a feature is interactive (has JS), its styles go in `interactive.css`. If it's a static layout component, use `components.css`.

### Path-gating CSS lives in `components.css`

The `display: none` rules for path gating are at the bottom of `components.css`, in the "PATH CHOOSER GATING" section. They use attribute selectors on `<html>` and `<section>` elements. The `~=` selector does whitespace-separated word matching on `data-paths`.

## How to verify changes

```bash
npm run dev                    # start dev server with HMR
npm run build                  # production build to dist/
npm run check                  # syntax-check all JS modules (no runtime needed)
```

There are no automated tests. Verify interactive features manually in the browser.

### Path chooser test matrix

When touching path-chooser, nav, or section visibility, verify all of these:

1. Fresh visit (clear localStorage, no `?path=`): see hero → full-viewport gate with 3 cards.
2. Click each path card: correct sections appear, nav links filter, badge shows, smooth-scroll to first section.
3. Scroll to path-switcher: current path card is hidden, other two are visible, "Show everything" pill button is present.
4. Click a different path card in the switcher: sections swap, scroll jumps to new first section.
5. Click "Show everything": all sections visible, switcher hides, badge hides, nav shows all links.
6. Reload the page: saved path restores from localStorage, no flash of gate.
7. Share URL with `?path=ops`: recipient lands directly in ops path.
8. Mobile: hamburger menu shows only relevant links, badge is hidden at small widths.

### Other features to spot-check

Theme toggle, allocator showdown slider, PA cinema play/pause, batching lab workload buttons + step slider, chunked prefill stepper, modern topic switcher, tuning lab sliders, process calculator inputs, parallelism tabs.

## Deployment

- **Cloudflare Workers**: `wrangler.jsonc` sets `assets.directory: ./dist`. Static assets only, no server-side Worker code.
- **CSP**: `public/_headers` sets `script-src 'self'`. Do not add inline scripts or CDN sources without updating the CSP.
- **Cache**: `/assets/*` and `/fonts/*` are immutable (hashed filenames). HTML is `max-age=0, must-revalidate`. The `?path=` query param is fine because HTML is always revalidated.
- **Container**: `Caddyfile` mirrors the same headers. Keep `_headers` and `Caddyfile` in sync.

## Common pitfalls

- **Transitioning layout properties that JS measures.** `nav.js` positions the pill highlight via `getBoundingClientRect()`. If the mobile `.nav-links` transitions `padding` or other layout-affecting properties when opening, the measurement happens mid-transition and the pill ends up between links. Only transition visual properties (like `opacity`) on containers where JS reads element geometry.
- **Forgetting the DOM guard.** Every `init()` must check that its elements exist before wiring listeners. The guide may be served with sections removed.
- **Not re-observing after path changes.** If you add a new `IntersectionObserver` for a feature inside a gated section, it will never fire when the section starts hidden. Either use the `lazySection` pattern (which handles re-observation) or listen for `path-changed` and re-observe manually.
- **Editing only one card set.** The reading-paths gate (`#reading-paths`) and the path-switcher (`#path-switcher`) have duplicate card markup. If you change section names, step lists, or icons in one, update the other.
- **CSS specificity from late overrides.** `interactive.css` and `responsive.css` must come AFTER base declarations. Keep `@import` order in `main.css` intact.
- **Diagram re-render on theme change.** `arch-diagrams.js` re-renders Mermaid diagrams when the theme toggles, picking up updated CSS custom properties.
- **`@import` order in `main.css` matters.** `tokens.css` must be first (variables), `responsive.css` must be last (media queries override earlier rules).
- **The `index.html` is large (~1800 lines).** Use section comment markers (`<!-- ========== SECTION NAME ==========-->`) and `data-paths` attributes to orient yourself. Grep for section IDs rather than scrolling.

## Do not

- Add a CSS preprocessor or utility framework.
- Move the CSS `<link>` into a JS import (causes FOUC).
- Add Node.js runtime dependencies beyond `prismjs` and `beautiful-mermaid` — Vite is the only dev dependency.
- Create test files unless explicitly asked — the project has no test infrastructure.
- Modify `index.html` section structure without checking that all feature modules still find their DOM elements by ID.
- Add inline `<script>` tags — the CSP disallows them.
- Use `display: block` to override path-gating `display: none` on individual sections — use the `data-active-path` attribute on `<html>` instead, which the CSS rules handle globally.
