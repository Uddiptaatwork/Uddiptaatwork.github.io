---
layout: default
title: Teaching
permalink: /teaching/
---

<div class="rows">
{%- assign prev = "" -%}
{%- for t in site.data.teaching -%}
  {%- capture y %}{{ t.year }}{% endcapture -%}
  <div class="row{% if y != prev %} ny{% endif %}">
    <span class="yr">{% if y != prev %}{{ y }}{% endif %}</span>
    {%- assign prev = y -%}
    <div>
      <p class="t">{% if t.url %}<a href="{{ t.url }}">{{ t.title }}</a>{% else %}{{ t.title }}{% endif %}</p>
      <p class="s">{% if t.role %}{{ t.role }} · {% endif %}{{ t.where }}</p>
    </div>
  </div>
{%- endfor -%}
</div>
