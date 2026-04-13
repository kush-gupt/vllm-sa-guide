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

See [`AGENTS.md`](AGENTS.md) for architecture decisions, module patterns, CSS organization, and common pitfalls.

## Submitting changes

1. Fork the repo and create a feature branch.
2. Make your changes, following the conventions above.
3. Test interactively in the browser -- there is no automated test suite.
4. Open a pull request with a clear description of what changed and why.

## AI-assisted contributions

If you use AI tools to help write code, see [`AGENTS.md`](AGENTS.md) for additional conventions and guardrails.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
