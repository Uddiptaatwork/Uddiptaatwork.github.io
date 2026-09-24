---
layout: default
title: Research
permalink: /research/
---

<p class="lede">I build contrastive learning methods for gravitational-wave science: models that learn what gravitational-wave data mean by learning what belongs together and what does not.</p>

Contrastive learning trains a network to tell matched pairs from mismatched ones. That one principle covers much of what gravitational-wave science needs. Pair data with data, and you learn **representations** of detector strain that transfer across tasks. Pair data with physical parameters, and you get **inference**: calibrated posteriors, learned directly from simulations. Next-generation detectors such as LISA and the Einstein Telescope will record far more signals than today's instruments, many of them long and overlapping, and I develop contrastive methods that scale to that regime.

### Contrastive representation learning

An encoder learns a representation of detector strain by pulling together different views of the same signal and pushing apart unrelated signals and noise. A good representation captures the physics of the data, so one encoder can serve many tasks.

<figure class="fig plain">
{% include contrastive-pretraining.svg %}
<figcaption>Views of the same signal are mapped close together in representation space, while other signals and noise are pushed apart. The learned encoder is shared across downstream tasks.</figcaption>
</figure>

### Contrastive inference

<figure class="fig plain">
{% include nre-diagram.svg %}
<figcaption>A classifier is trained to distinguish matched pairs (θ, x) drawn together from the simulator from pairs where θ and x have been shuffled. The optimal classifier encodes the posterior-to-prior ratio, so the likelihood is never evaluated. Because θ can be any subset of parameters, each marginal posterior can be learned on its own.</figcaption>
</figure>

For inference, the contrastive objective pairs data with physical parameters. This is **neural ratio estimation** (NRE). Two features make it powerful for gravitational waves. It is **marginal**: a network can target only the parameters you care about, such as the chirp mass and mass ratio, without sampling the full 15-dimensional posterior. It is **targeted**: after each round, regions of the prior that are ruled out for the observed signal are truncated, so later simulations concentrate where the posterior actually is. Together these give *truncated marginal neural ratio estimation* (TMNRE).

### Targeted marginal inference for transient signals

<figure class="fig">
  <img src="{{ '/assets/img/research/tmnre-schematic.png' | relative_url }}" alt="Four-step TMNRE loop: simulate, train ratio estimators, infer, truncate the prior, repeat." loading="lazy">
  <figcaption>The TMNRE loop as implemented in <em>peregrine</em>: simulate, estimate ratios for each marginal, infer for the target observation, truncate the prior, and repeat until converged.</figcaption>
</figure>

With *peregrine* we showed that TMNRE recovers marginal posteriors for precessing binary black hole mergers that match a standard nested-sampling analysis, while using **only about 2% of the waveform evaluations**. Because each marginal is learned directly, cost goes into the parameters of interest rather than the full joint space.

<figure class="fig">
  <img src="{{ '/assets/img/research/tmnre-vs-dynesty.png' | relative_url }}" alt="1D marginal posteriors for all 15 binary black hole parameters, peregrine versus dynesty." loading="lazy">
  <figcaption>1D marginals for all 15 parameters of a high-SNR binary black hole: <em>peregrine</em> (orange) against the likelihood-based <em>dynesty</em> result (purple). Dashed lines mark injected values.</figcaption>
</figure>

<p class="refs">Paper: <a href="https://arxiv.org/abs/2304.02035">Bhardwaj et al., PRD 108, 042004 (2023)</a> · Code: <a href="https://github.com/PEREGRINE-GW/peregrine">peregrine</a></p>

### Overlapping transient signals

Einstein Telescope and Cosmic Explorer will regularly record several signals in the same stretch of data. A joint likelihood analysis of overlapping sources scales badly with the number of parameters. Marginal NRE sidesteps this: we inferred all **30 parameters** of two overlapping binary black holes, using only about 15% of the waveform evaluations a traditional method needs for *a single* signal.

<div class="fig-2">
  <figure class="fig">
    <img src="{{ '/assets/img/research/overlap-signal.png' | relative_url }}" alt="Two binary black hole signals overlapping in detector strain, merging 0.05 seconds apart." loading="lazy">
    <figcaption>Two binary black hole signals merging 0.05 s apart, individually (top) and as observed (bottom).</figcaption>
  </figure>
  <figure class="fig">
    <img src="{{ '/assets/img/research/overlap-chirpmass.png' | relative_url }}" alt="Chirp mass posteriors of both signals for three different merger-time separations." loading="lazy">
    <figcaption>Chirp masses of both signals are recovered for all three time separations, consistent with single-signal analyses (dashed).</figcaption>
  </figure>
</div>

<p class="refs">Paper: <a href="https://arxiv.org/abs/2308.06318">Bhardwaj &amp; Alvey et al. (2023)</a> · Code: <a href="https://github.com/PEREGRINE-GW/peregrine/tree/overlapping">peregrine</a></p>

### Persistent and transient signals in LISA

LISA data will contain a stochastic gravitational-wave background on top of instrumental noise and a population of transient signals. With *saqqara*, we use marginalisation to infer the background in simulated LISA data **in the presence of overlapping transients**. A standard analysis that ignores the transients is biased; the marginal NRE analysis is not.

<figure class="fig narrow">
  <img src="{{ '/assets/img/research/sgwb-transients.png' | relative_url }}" alt="Corner plot of background and noise parameters with and without transients, comparing saqqara and MCMC." loading="lazy">
  <figcaption>Background amplitude and slope (α, γ) and noise parameters (A, P). Without transients, <em>saqqara</em> (solid) and MCMC (dashed) agree (black). With transients added (orange), MCMC is pulled away from the truth, while <em>saqqara</em> still recovers it. Inset: excess power from the transients.</figcaption>
</figure>

<p class="refs">Paper: <a href="https://arxiv.org/abs/2309.07954">Alvey, Bhardwaj et al., PRD 109, 083008 (2024)</a> · Code: <a href="https://github.com/PEREGRINE-GW/saqqara">saqqara</a></p>

### Flexible representations: time-varying noise

Real LISA noise will drift over the mission. Likelihood-based methods have to model this explicitly, but a neural ratio estimator can learn a data representation that absorbs it. We showed that this **representation flexibility** turns time-varying noise from a nuisance into an advantage: constraints on the background come close to the Fisher-matrix forecast, and are tighter than when the noise is assumed fixed.

<figure class="fig narrow">
  <img src="{{ '/assets/img/research/sgwb-timevarying-noise.png' | relative_url }}" alt="Histograms of sensitivity to background amplitude and slope for time-dependent versus time-independent noise." loading="lazy">
  <figcaption>Sensitivity to the background amplitude σ(α) and slope σ(γ). SBI with time-dependent noise (blue) approaches the Fisher forecast (black) and outperforms the time-independent case (orange).</figcaption>
</figure>

<p class="refs">Paper: <a href="https://arxiv.org/abs/2408.00832">Alvey, Bhardwaj et al., PRD 111, 102006 (2025)</a></p>

### Extreme mass ratio inspirals

EMRIs produce long, intricate waveforms with a highly multimodal likelihood, which makes them a hard case for stochastic samplers. Sequential truncation with TMNRE reliably narrows an initially broad prior to the true source parameters over a few rounds.

<figure class="fig">
  <img src="{{ '/assets/img/research/emri-truncation.png' | relative_url }}" alt="Prior bounds for each EMRI parameter shrinking over seven rounds of TMNRE, compared with differential evolution." loading="lazy">
  <figcaption>Prior region retained by TMNRE (shaded) over seven rounds, for each EMRI parameter, compared with points found by differential evolution (red). Dashed lines mark injected values.</figcaption>
</figure>

<p class="refs">Paper: <a href="https://arxiv.org/abs/2505.16795">Cole et al., PRD 113, 063030 (2026)</a></p>

### Multi-messenger astronomy

How binary neutron star ejecta models affect kilonova parameter estimation ([Henkel et al. 2025](https://arxiv.org/abs/2504.03900)).

### AI for scientific discovery

[*praxis*](https://github.com/Uddiptaatwork/praxis) configures a large language model as a small research lab that follows the scientific method explicitly; the reference setup and examples use Claude. It frames a falsifiable question, reads the literature, computes on real data, then tries to break its own result, with every number traceable to its source. Domain packs make it an expert co-scientist in a given field; the first cover ground-based gravitational waves and pulsar timing arrays. Built at the Anthropic–ETH AI Sprint.

### Student projects

I supervise BSc and MSc thesis projects in gravitational-wave data analysis and machine learning. I am especially keen to hear from students interested in:

- gravitational-wave inference with simulation-based inference,
- contrastive learning across multiple data representations,
- interpretable machine-learning models for gravitational-wave science.

If you are interested, [email me]({{ '/contact/' | relative_url }}) with a short, informal motivation statement and your CV.

### Software

<div class="proj">
{%- for s in site.data.software -%}
  <article>
    <h3><a href="{{ s.url }}">{{ s.name }}</a></h3>
    <p>{{ s.body }}</p>
  </article>
{%- endfor -%}
</div>
