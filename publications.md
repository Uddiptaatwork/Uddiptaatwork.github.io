---
layout: default
title: Publications
permalink: /publications/
---

<p class="lede">Full, up-to-date list on <a href="{{ site.profiles[0].url }}">INSPIRE-HEP</a>.</p>

<div class="pubs">
{%- assign prev = "" -%}
{%- for p in site.data.publications -%}
  {%- capture y %}{{ p.year }}{% endcapture -%}
  <article class="pub{% if y != prev %} ny{% endif %}">
    <span class="yr">{% if y != prev %}{{ y }}{% endif %}</span>
    {%- assign prev = y -%}
    <div>
      <p class="t">{{ p.title }}</p>
      <p class="au">{{ p.authors | markdownify | remove: '<p>' | remove: '</p>' }}</p>
      <p class="vn">{{ p.venue }}</p>
      {%- if p.links -%}
      <p class="lk">{% for l in p.links %}<a href="{{ l.url }}">{{ l.name }}</a>{% endfor %}</p>
      {%- endif -%}
    </div>
  </article>
{%- endfor -%}
</div>

<h3 class="sec">Collaboration papers</h3>
<p class="note">Papers written as a member of the LIGO–Virgo–KAGRA and GRANDMA collaborations, with alphabetical author lists.</p>

<details class="collab">
  <summary>Show all {{ site.data.collaboration | size }} papers</summary>
  <div class="pubs">
  {%- assign prev = "" -%}
  {%- for p in site.data.collaboration -%}
    {%- capture y %}{{ p.year }}{% endcapture -%}
    <article class="pub{% if y != prev %} ny{% endif %}">
      <span class="yr">{% if y != prev %}{{ y }}{% endif %}</span>
      {%- assign prev = y -%}
      <div>
        <p class="t">{{ p.title }}</p>
        <p class="vn">{{ p.collab }} · {{ p.venue }}</p>
        {%- if p.links -%}
        <p class="lk">{% for l in p.links %}<a href="{{ l.url }}">{{ l.name }}</a>{% endfor %}</p>
        {%- endif -%}
      </div>
    </article>
  {%- endfor -%}
  </div>
</details>
