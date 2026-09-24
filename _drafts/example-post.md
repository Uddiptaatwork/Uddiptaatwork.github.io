---
title: "Example post: how writing here works"
description: "A template showing headings, maths, code and images. Delete or rename it when you write your first real post."
tags: [meta]
math: true
---

This file lives in `_drafts/`, so it is **not published**. Preview drafts locally with
`bundle exec jekyll serve --drafts`. To publish, move it to `_posts/` and name it
`YYYY-MM-DD-some-slug.md`; the date in the file name becomes the post date.

The first paragraph is used as the excerpt on the blog page unless you set `description`.

## A section

Regular Markdown works: *italic*, **bold**, [links](https://inspirehep.net), lists,

- one
- two

and quotes.

> All models are wrong, but some are useful.

## Maths

With `math: true` in the front matter, inline $p(\theta \mid x)$ and display maths work:

$$
r(x, \theta) = \frac{p(x, \theta)}{p(x)\,p(\theta)} = \frac{p(\theta \mid x)}{p(\theta)}
$$

## Code

```python
import numpy as np
theta = np.random.uniform(0, 1, size=1000)
```

## Images

Put images in `assets/img/blog/` and reference them like this:

{% raw %}
    ![Alt text]({{ '/assets/img/blog/figure.png' | relative_url }})
{% endraw %}
