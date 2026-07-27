[![Deploy](https://github.com/RaresToader/rarestoader.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/RaresToader/rarestoader.github.io/actions/workflows/deploy.yml)

# rarestoader.github.io

Personal site. Astro, hand-written CSS, no component framework, no client-side
router. Ships zero JavaScript files, the only two scripts (theme toggle,
scroll reveal) are small enough that Astro inlines them.

Live at <https://rarestoader.github.io>.

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check && astro build → dist/
npm run preview  # serve the built output
```

`npm run build` runs `astro check` first, so a type error fails the build.

## Editing the content

| File | What's in it |
| --- | --- |
| `src/data/site.ts` | Name, role, location, status line, social links, nav |
| `src/data/experience.ts` | Jobs and education |
| `src/data/projects.ts` | The featured `now` project, past projects, skills |

Set `now` to `null` in `projects.ts` to hide the "What I'm building" section
entirely.

### Pointer effect

`src/components/fx/Pulse.astro`, rendered from `Base.astro`. Rings bloom where
the pointer has been, expand and fade. Off under `prefers-reduced-motion`, and
it takes touch as an input, so it works while scrolling a phone.

`Topology.astro` sits alongside it, parked and imported by nothing. To swap,
change the one import in `Base.astro`; the two are interchangeable.

### Writing

Posts are Markdown in `src/content/writing/`. The filename becomes the URL.

```md
---
title: 'Post title'
description: 'One sentence, shown in listings and meta tags.'
date: 2026-07-26
draft: false
tags: ['systems']
---
```

`draft: true` posts render in `npm run dev` but are excluded from the listing,
the homepage, and the RSS feed in production builds.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages via `actions/deploy-pages`.
