# Contributing

Thanks for your interest in improving the vLLM Inference Guide!

## Local development

```bash
npm install
npm run dev       # starts Vite dev server at http://localhost:5173
```

Before pushing, verify the production build works:

```bash
npm run build     # outputs to dist/
npm run preview   # preview the build locally
npm run check     # syntax-check all JS modules
```

## Project conventions

- **Vanilla JS only.** Do not introduce React, Vue, Svelte, or any UI framework.
- **Plain CSS.** No Sass, PostCSS, or Tailwind. Design tokens live in `src/styles/tokens.css`.
- **Feature modules** go in `src/features/` with a single `export function init()`. Every `init()` must guard on its DOM elements so it's a no-op if the HTML section is absent.
- **Large data objects** (> ~50 lines) belong in `src/data/` as named exports, not inline in feature modules.
- **Shared utilities** (crossfade, clamp, etc.) live in `src/utils/`.
- **CSS partials**: static component styles go in `components.css`, interactive widget styles in `interactive.css`, media queries in `responsive.css`. See `AGENTS.md` for the full breakdown.

## Submitting changes

1. Fork the repo and create a feature branch.
2. Make your changes, following the conventions above.
3. Test interactively in the browser -- there is no automated test suite.
4. Open a pull request with a clear description of what changed and why.

## AI-assisted contributions

If you use AI tools to help write code, see [`AGENTS.md`](AGENTS.md) for additional conventions and guardrails.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
