# vLLM Inference Guide

An interactive, single-page guide covering modern LLM inference engines — with vLLM as the anchor. A vendor-neutral educational resource for practitioners, engineers, and anyone evaluating inference serving options. Built with vanilla JavaScript and CSS, bundled with Vite.

**[Live site](https://learnvllm.com)** · [Source](https://github.com/kush-gupt/vllm-sa-guide)

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

The `dist/` folder is a fully static site — serve it from any HTTP server, S3 bucket, or GitHub Pages.

## Reading paths

The guide gates content behind a **path chooser**. First-time visitors see a full-viewport prompt asking them to pick one of three reading paths:

| Path | Sections shown |
|------|----------------|
| **Business & Decision-Makers** | The Problem, Key Techniques, Capabilities, Reference |
| **Platform & Ops Engineers** | The Problem, Key Techniques, Capabilities, Deployment, Tuning, Reference |
| **Deep-Dive & Research** | PagedAttention, Batching, Architecture, Tuning, Reference |

The chosen path is persisted in `localStorage` and the `?path=` URL parameter so links are shareable. Users can switch paths via a card-based switcher before the Reference section, or click "Show everything" to reveal all content.

Sections outside the active path are `display: none`, which means their `IntersectionObserver`-based lazy loading never fires — JS modules for hidden sections are never downloaded.

## Deployment

### Cloudflare Workers (default)

The site is configured to deploy as a Cloudflare Workers static asset via `wrangler.jsonc`:

```bash
npm run build
npx wrangler deploy
```

### Container (production)

A multi-stage `Containerfile` builds the site with Node 22 and serves it with Caddy on port 8080:

```bash
npm run container:build   # podman build -t vllm-guide
npm run container:run     # podman run --rm -p 8080:8080
```

### Container (development)

`Containerfile.dev` runs the Vite dev server inside a container with your source bind-mounted:

```bash
npm run container:dev     # builds image, runs on port 5173 with live reload
```

## Project structure

```
index.html                  Single-page HTML (all content sections)
vite.config.js              Vite config (output dir, manual chunks for vendors)
package.json                Scripts, dependencies, metadata
wrangler.jsonc              Cloudflare Workers static-asset deployment config
Containerfile               Multi-stage production image (Node builder → Caddy)
Containerfile.dev           Dev image running Vite with hot reload
Caddyfile                   Security headers and cache rules for the Caddy server
.containerignore            Build-context exclusions for container builds
CONTRIBUTING.md             Contribution workflow and local dev instructions
public/
  _headers                  Cloudflare Pages/Workers response headers (CSP, caching)
  fonts/                    Self-hosted Red Hat font files (woff2) + LICENSE
  og-image.png              Open Graph preview image
src/
  main.js                   Entry point — eager inits, lazy-loads sections, path-changed relay
  styles/
    main.css                @import aggregator (order matters — see AGENTS.md)
    fonts.css               @font-face declarations for Red Hat typefaces
    tokens.css              CSS custom properties (design tokens, dark/light themes)
    base.css                Reset, typography, keyframes, section basics, reveal animations
    layout.css              Nav, hero, footer
    components.css          Cards, pills, badges, tables, code blocks, path-chooser gating
    interactive.css         Allocator showdown, PA cinema, batching lab, tuning lab
    responsive.css          All media queries
  features/
    path-chooser.js         Reading-path gate, card handlers, nav/badge/switcher state
    theme.js                Dark/light toggle with localStorage persistence
    nav.js                  Hamburger menu, scroll-based active link + pill, focus trap
    smooth-nav.js           Enhanced smooth-scroll for in-page anchor links
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
    hero-canvas-worker.js   OffscreenCanvas web worker for hero particles
    hero-typewriter.js      Word-by-word hero description reveal animation
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
    roving-tabindex.js      Arrow-key focus management for tab groups
    autoplay.js             Play/pause + IntersectionObserver auto-stop for animations
    tab-utils.js            Shared tab-button activation with ARIA and URL hash sync
    scroll-bus.js           Lightweight pub/sub for coordinating scroll-sensitive features
  data/
    batching-scenarios.js   Balanced / prompt-heavy / bursty frame data
    chunk-frames.js         Chunked prefill step definitions
    decode-loop-data.js     Decode loop phase and token data
    modern-topic-data.js    Topic content for the modern inference switcher
    parallelism-data.js     TP/PP/DP/EP/CP strategy definitions and visuals
    pa-phases.js            PagedAttention cinema phase data
    showdown-steps.js       Allocator showdown step definitions
    battle-cards.js         Comparison card data (vs TGI, TRT-LLM, SGLang)
    comparison-faq.js       Side-by-side comparison FAQ entries
    objection-data.js       FAQ objection/response data
```

## Conventions

Architecture decisions, module patterns, CSS organization, and pitfalls are documented in [AGENTS.md](AGENTS.md). Read that file before making changes.

## Dev Container

The project includes a [Dev Container](.devcontainer/devcontainer.json) configuration (Node 22, auto `npm ci`, port 5173 forwarded). Open the repo in VS Code or any Dev Container-compatible editor to get a ready-to-go environment.

## CI / CD

A [GitHub Actions workflow](.github/workflows/container.yml) builds and pushes container images to `ghcr.io`:

- **Production image** — built from `Containerfile` on pushes to `main` and version tags.
- **Dev image** — built from `Containerfile.dev` alongside the production image.

Pull requests trigger builds but do not push to the registry.

## External dependencies

| Dependency                                                           | Loaded via                    | Purpose                                      |
| -------------------------------------------------------------------- | ----------------------------- | -------------------------------------------- |
| [Vite](https://vite.dev)                                             | npm (dev only)                | Dev server + production build                |
| [Prism.js](https://prismjs.com)                                      | npm                           | Syntax highlighting for code blocks          |
| [beautiful-mermaid](https://www.npmjs.com/package/beautiful-mermaid) | npm                           | Architecture and flow diagrams (lazy-loaded) |
| [Red Hat fonts](https://github.com/RedHatOfficial/RedHatFont)        | Self-hosted (`public/fonts/`) | Display, Text, and Mono typefaces (SIL OFL)  |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup, project conventions, and how to submit changes.

## License

MIT -- see [LICENSE](LICENSE).
