# vLLM Inference Guide

An interactive, single-page guide covering modern LLM inference engines — with vLLM as the anchor. A vendor-neutral educational resource for practitioners, engineers, and anyone evaluating inference serving options. Built with vanilla JavaScript and CSS, bundled with Vite.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build for deployment

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

The `dist/` folder is a fully static site — serve it from any HTTP server, S3 bucket, or GitHub Pages.

## Project structure

```
index.html                  Single-page HTML (all 10 content sections)
vite.config.js              Minimal Vite config
src/
  main.js                   Entry point — imports and initializes all features
  styles/
    main.css                @import aggregator
    tokens.css              CSS custom properties (design tokens, dark/light themes)
    base.css                Reset, typography, keyframes, reveal animations
    layout.css              Nav, hero, footer
    components.css          Cards, pills, badges, tables, code blocks, model coverage
    interactive.css         Allocator showdown, PA cinema, batching lab, tuning lab, etc.
    responsive.css          All media queries
  features/
    theme.js                Dark/light toggle with localStorage persistence
    nav.js                  Mobile hamburger menu, scroll-based active link highlight, focus trap
    reveal.js               IntersectionObserver scroll reveal + stagger animations
    tooltips.js             Keyboard-accessible jargon tooltips for abbr[data-tip]
    quickstart.js           Collapsible quickstart panel toggle
    battle-cards.js         Rendered comparison cards from battle-cards data
    objections.js           FAQ accordion from objection data
    component-cards.js      Expandable architecture component cards
    paged-attention.js      PagedAttention cinema (animated block allocation)
    batching-lab.js         Continuous batching simulator with workload presets
    chunked-prefill.js      Chunked prefill step-through explainer
    modern-topics.js        Modern inference topic switcher (disagg, spec decode, …)
    tuning-lab.js           Latency vs throughput tuning lab with sliders
    process-calculator.js   TP × PP × DP process count calculator
    parallelism.js          Parallelism strategy tabs (TP/PP/DP/EP/CP)
    allocator-showdown.js   Naive vs PagedAttention allocator comparison
    hero-canvas.js          Particle network canvas animation (reduced-motion aware)
    arch-diagrams.js        Architecture diagrams via beautiful-mermaid
    decode-loop.js          Autoregressive decode walkthrough
    scroll-progress.js      Scroll progress bar at top of viewport
    back-to-top.js          Floating back-to-top button
    syntax-highlight.js     Syntax highlighting via Prism.js
    source-refs.js          Expandable source/reference links
  utils/
    crossfade.js            crossfade / crossfadeMulti transition helpers
    helpers.js              clamp and other shared utilities
    render-diagram.js       Lazy Mermaid rendering with retry on failure
  data/
    batching-scenarios.js   Balanced / prompt-heavy / bursty frame data
    chunk-frames.js         Chunked prefill step definitions
    decode-loop-data.js     Decode loop phase and token data
    modern-topic-data.js    Topic content for the modern inference switcher
    parallelism-data.js     TP/PP/DP/EP/CP strategy definitions and visuals
    pa-phases.js            PagedAttention cinema phase data
    showdown-steps.js       Allocator showdown step definitions
    battle-cards.js         Comparison card data (vs TGI, TRT-LLM, SGLang)
    objection-data.js       FAQ objection/response data
```

## Conventions

Architecture decisions, module patterns, CSS organization, and pitfalls are documented in [`AGENTS.md`](AGENTS.md). Read that file before making changes.

## External dependencies

| Dependency | Loaded via | Purpose |
|---|---|---|
| [Vite](https://vite.dev) | npm (dev only) | Dev server + production build |
| [Prism.js](https://prismjs.com) | npm | Syntax highlighting for code blocks |
| [beautiful-mermaid](https://www.npmjs.com/package/beautiful-mermaid) | npm | Architecture and flow diagrams (lazy-loaded) |
| [Red Hat fonts](https://github.com/RedHatOfficial/RedHatFont) | Self-hosted (`public/fonts/`) | Display, Text, and Mono typefaces (SIL OFL) |

## License

MIT -- see [LICENSE](LICENSE).
