# Personal site

Jekyll 4, no theme. Hosted at https://uddiptaatwork.github.io from the
`Uddiptaatwork/Uddiptaatwork.github.io` repo.

## Publishing
Every push to `main` rebuilds and deploys the site via `.github/workflows/pages.yml`
(takes ~1 minute; progress under the repo's Actions tab). This uses the Jekyll version
in `Gemfile.lock`, so the live site matches `bundle exec jekyll serve` locally.
One-time setting: repo Settings → Pages → Source: **GitHub Actions**.

## Editing content
- Prose pages: `index.md`, `research.md`, `contact.md` — plain Markdown under the front matter.
- Lists: `_data/publications.yml`, `_data/teaching.yml`,
  `_data/software.yml`, `_data/collaboration.yml`, `_data/news.yml` (About me page).
  Adding a paper = adding 6 lines of YAML. Never touch HTML.
- Blog: add `_posts/YYYY-MM-DD-slug.md` with `title:` (and optionally `description:`, `tags:`,
  `math: true`) in the front matter. Work-in-progress posts go in `_drafts/` (no date in the
  file name) and only show with `jekyll serve --drafts`. See `_drafts/example-post.md`.
  RSS feed is at `/blog/feed.xml`.
- Nav order and labels: the `nav:` block in `_config.yml`.
- Colours and type: the `:root` block at the top of `assets/css/style.css`.

## Local preview (optional)
```
bundle install
bundle exec jekyll serve
```

## Notes
- `jekyll-seo-tag` and `jekyll-sitemap` are whitelisted by GitHub Pages. Do not add `jekyll-scholar`
  (BibTeX) — it is not whitelisted and would force a GitHub Actions build.
- Banner: `banner:` in `_config.yml` picks the animation.
  - `strain` (default): `assets/js/strain.js`, overlapping LISA signals in noise; hover highlights
    one. Tune speed, amplitudes and colours in its `CFG` block.
  - `ringfield`: `assets/js/ringfield.js`, the WebGL particle ring, with the SVG chirp in
    `assets/js/site.js` as fallback.

## LaTeX
Add `math: true` to a page's front matter. MathJax then loads on that page only
(it is ~1 MB, so pages without equations stay light).

    ---
    layout: default
    title: Research
    permalink: /research/
    math: true
    ---

Inline `$\Omega_{\rm gw}(f)$`, display `$$ ... $$`, and `\begin{align}` all work.
`\label` / `\eqref` numbering is on (`tags: 'ams'`).

Gotcha: Markdown eats underscores outside math sometimes. If `$a_1 b_2$` renders
oddly, wrap it in backticks-free `$$ ... $$` or escape the underscore. Safer still,
put long equations in display mode.

Math inside a YAML data file (e.g. a paper title) is NOT rendered — MathJax only
scans page body text.

Swap to KaTeX (smaller, faster, no `\eqref`) by replacing the MathJax block in
`_layouts/default.html`; KaTeX needs its stylesheet as well as its script.
