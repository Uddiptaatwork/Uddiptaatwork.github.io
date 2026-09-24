---
layout: default
title: About me
permalink: /
---

<p class="lede">I work where state-of-the-art machine learning meets fundamental gravitational physics, using contrastive learning to turn gravitational-wave data into physical insight.</p>

I am a **postdoctoral researcher** at [ETH Zürich](https://ethz.ch), working on **contrastive learning** for gravitational-wave science. I completed my PhD in 2025 at [GRAPPA](https://www.grappa.amsterdam/), University of Amsterdam.

My work spans the gravitational-wave spectrum and the communities built around it: ground-based detectors with **LIGO–Virgo–KAGRA** and the **Einstein Telescope**, space-based detection with **LISA**, **pulsar timing arrays**, and electromagnetic follow-up with **GRANDMA**.

I enjoy building and using contrastive learning algorithms. I have worked extensively on **neural ratio estimation**, in particular **marginal** and **targeted** inference, and I am now also developing contrastive learning for **representations** of gravitational-wave data.

I maintain these open-source projects:

- [**peregrine**](https://github.com/PEREGRINE-GW/peregrine): neural ratio estimation for gravitational-wave inference.
- [**praxis**](https://github.com/Uddiptaatwork/praxis): an AI harness that runs a large language model as a small research lab following the scientific method.

For a full list of the open-source software I have led or co-developed, see [Software]({{ '/research/#software' | relative_url }}).

Before Amsterdam, I did my MSc at the Zentrum für Astronomie, Heidelberg University, and my BSc at the University of Delhi.

More detail is in the [research]({{ '/research/' | relative_url }}) and [publications]({{ '/publications/' | relative_url }}) sections. For collaborations or questions, [get in touch]({{ '/contact/' | relative_url }}).

### News

<div class="rows news">
{%- for n in site.data.news limit: 8 -%}
  <div class="row">
    <span class="yr">{{ n.date }}</span>
    <p class="t">{{ n.text | markdownify | remove: '<p>' | remove: '</p>' | strip }}</p>
  </div>
{%- endfor -%}
</div>
