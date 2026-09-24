---
layout: default
title: Blog
permalink: /blog/
---

<p class="lede">Notes on inference, gravitational waves and whatever else I find interesting. <a href="{{ '/blog/feed.xml' | relative_url }}">RSS</a></p>

{%- if site.posts.size > 0 -%}
<div class="rows">
{%- for post in site.posts -%}
  <div class="row">
    <span class="yr">{{ post.date | date: "%Y" }}</span>
    <div>
      <p class="t"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></p>
      <p class="s">{{ post.description | default: post.excerpt | strip_html | truncatewords: 32 }}</p>
    </div>
  </div>
{%- endfor -%}
</div>
{%- else -%}
<p class="note">No posts yet.</p>
{%- endif -%}
