# João Fernandes

[![Build Status](https://img.shields.io/github/actions/workflow/status/joaofernandes52/joaofernandes52.github.io/deploy.yml?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/joaofernandes52/joaofernandes52.github.io/actions)
[![Live Demo](https://img.shields.io/badge/demo-online-success?style=flat-square&logo=vercel&logoColor=white)](https://joaofernandes52.github.io/)
[![Framework](https://img.shields.io/badge/framework-React-61DAFB?style=flat-square&logo=react&logoColor=black)]()
[![Language](https://img.shields.io/badge/language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)]()

A personal portfolio highlighting ***artificial intelligence engineering*** and ***full-stack development***.

> Note: This portfolio is already deployed at [joaofernandes52.github.io](https://joaofernandes52.github.io/). You don't need to clone or build anything to see it — just open the link. The repo is here for the curious.

Try it live: [https://joaofernandes52.github.io/](https://joaofernandes52.github.io/) *(Hosted via GitHub Pages; immediate load)*

## Features

* **Static generation:** Compiled via Vite for zero-runtime server overhead and immediate LCP.
* **Type safety:** Strict TypeScript configuration enforcing structural typing across components and data definitions.
* **Utility-first styling:** Tailored using Tailwind CSS to eliminate cascading side-effects and unused CSS.
* **Hardware-accelerated motion:** Fluid layout transitions managed by Framer Motion leveraging CSS transforms.
* **Client-side routing:** Implemented via hash-based anchoring for immediate sub-section navigation without page reloads.

## Tech stack

| Choice | Why |
| :--- | :--- |
| React 18 | Standard declarative component model. |
| TypeScript | Eliminates runtime type errors during development. |
| Tailwind CSS | Colocates styling with markup for faster iteration. |
| Vite | Near-instant HMR and optimized production builds. |
| Framer Motion | Declarative animation primitives for complex entering/exiting states. |

## Project structure

```text
.
├── .github/workflows/    # CI/CD pipelines (GitHub Pages deployment)
├── public/               # Static assets bypassing the bundler
├── src/
│   ├── App.tsx           # Main application composition and layout
│   ├── index.css         # Global styling and Tailwind directives
│   └── main.tsx          # React application entry point
├── tailwind.config.js    # Design system configuration
└── vite.config.ts        # Bundler and build pipeline configuration
```

## Development

```bash
npm run dev       # Start the local development server
npm run build     # Type-check and compile static bundle
npm run lint      # Run ESLint against the codebase
```

## License

MIT
