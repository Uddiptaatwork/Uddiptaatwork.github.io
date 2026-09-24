/* LISA-style strain banner.
   Noisy time-domain strain = MBHB (red) + galactic binaries (blue) + EMRI (yellow)
   + stochastic background (green) + instrument noise, scrolling right to left.
   Hover highlights one component, chosen by the cursor's distance from the centre
   line (see BAND); with no pointer it cycles through them. Tune everything in CFG. */
(function () {
  var canvas = document.getElementById("strain");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var CFG = {
    span: 10,          // time units visible across the banner
    speed: 0.8,        // time units per second (0 = frozen)
    step: 1,           // CSS px between samples
    scale: 0.30,       // strain unit -> fraction of banner height
    cycle: 3.2,        // seconds per component when auto-cycling
    idleBeforeCycle: 2.5,
    colors: { mbhb: "#E5574E", gb: "#5B9BE6", emri: "#E8C04A", sgwb: "#5CC08A", total: "#E9EAEE" }
  };
  var KEYS = ["mbhb", "gb", "emri", "sgwb"];
  var TAU = Math.PI * 2;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) CFG.speed = 0;

  // ---- signal models (t in arbitrary time units) ----
  // Massive black hole binary: repeating inspiral-merger-ringdown.
  // f = f0 ((tau+eps)/tau0)^(-3/8), A ~ f^(2/3); eps softens the merger so it stays visible.
  var MB = { period: 16, first: 0.72 * CFG.span, f0: 0.8, tau0: 8, eps: 0.12, A: 0.95, rd: 0.12 };
  var fPeak = MB.f0 * Math.pow(MB.eps / MB.tau0, -3 / 8);
  var kPhase = TAU * MB.f0 * Math.pow(MB.tau0, 3 / 8) / (5 / 8);
  function mbhbAt(t) {
    var k = Math.round((t - MB.first) / MB.period);
    var tau = MB.first + k * MB.period - t;   // time to merger, in [-P/2, P/2]
    if (tau >= 0) {
      var f = MB.f0 * Math.pow((tau + MB.eps) / MB.tau0, -3 / 8);
      // taper the earliest inspiral so consecutive events join smoothly
      var a0 = MB.A * Math.pow(f / fPeak, 2 / 3) * Math.min(1, (MB.period / 2 - tau) / 3);
      return { v: a0 * Math.cos(-kPhase * Math.pow(tau + MB.eps, 5 / 8)), env: a0 };
    }
    var d = -tau, a = MB.A * Math.exp(-d / MB.rd);
    return { v: a * Math.cos(-kPhase * Math.pow(MB.eps, 5 / 8) - TAU * fPeak * 1.15 * d), env: a };
  }
  // Galactic binaries: many overlapping quasi-monochromatic sinusoids at nearby
  // frequencies, so they beat against each other. [freq, amp, phase]
  var GB = [[1.4, .035, 2.6], [1.85, .05, .3], [2.0, .055, 2.1], [2.12, .04, 4.4],
            [2.55, .05, 1.2], [2.68, .045, 5.0], [3.3, .035, 3.3], [3.42, .04, .7]];
  function gbAt(t) {
    var v = 0; for (var i = 0; i < GB.length; i++) v += GB[i][1] * Math.sin(TAU * GB[i][0] * t + GB[i][2]);
    return { v: v, env: 0.2 };
  }
  // EMRI: eccentric, precessing orbit -> harmonics n*f_phi + m*f_r of the azimuthal
  // and radial frequencies, with a slow inspiral drift. [n, m, amp, phase]
  var EM = [[1, 0, .55, 0], [2, 0, 1, .8], [2, 1, .5, 2.1], [2, -1, .45, 3.9],
            [3, 0, .4, .4], [3, 1, .25, 1.7], [4, 0, .2, 5.1]];
  function emriAt(t) {
    var pphi = TAU * (2.2 * t + 0.1 * t * t / 40), pr = TAU * 0.72 * t;
    var a = 0.16 * (0.75 + 0.25 * Math.sin(TAU * t / 9 + 1.3)), v = 0;
    for (var i = 0; i < EM.length; i++) v += EM[i][2] * Math.sin(EM[i][0] * pphi + EM[i][1] * pr + EM[i][3]);
    return { v: a * v, env: a * 2 };
  }
  // Stochastic background: many random-phase modes, red-tilted spectrum.
  var SG = [], rs = 7;
  function rnd() { rs = (rs * 16807) % 2147483647; return rs / 2147483647; }
  for (var i = 0; i < 26; i++) { var f = 0.5 + 5.5 * rnd(); SG.push([f, Math.pow(f, -0.5), TAU * rnd()]); }
  var sgNorm = 0; for (i = 0; i < SG.length; i++) sgNorm += SG[i][1] * SG[i][1];
  sgNorm = 0.05 / Math.sqrt(sgNorm / 2);
  function sgwbAt(t) {
    var v = 0; for (var i = 0; i < SG.length; i++) v += SG[i][1] * Math.sin(TAU * SG[i][0] * t + SG[i][2]);
    return { v: v * sgNorm, env: 0.12 };
  }
  // Instrument noise: two octaves of value noise on absolute time, so it scrolls with the data.
  function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x) {
    var i = Math.floor(x), u = x - i; u = u * u * (3 - 2 * u);
    return hash(i) * (1 - u) + hash(i + 1) * u - 0.5;
  }
  // one noise knot every ~2.5 px, whatever the banner width
  var noiseRate = 50;
  function noiseAt(t) { return vnoise(t * noiseRate) * 0.34 + vnoise(t * noiseRate / 3 + 50) * 0.16; }
  var MODEL = { mbhb: mbhbAt, gb: gbAt, emri: emriAt, sgwb: sgwbAt };
  // Hover bands, as a fraction of banner height from the centre line: the quiet
  // background sits closest to the baseline, the loud binary furthest out.
  var BAND = { sgwb: 0.06, gb: 0.13, emri: 0.21, mbhb: 0.31 };

  // ---- sizing ----
  var dpr = 1, W = 1, H = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(canvas.clientWidth, 1); H = Math.max(canvas.clientHeight, 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    noiseRate = (W / CFG.span) / 2.5;
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);

  // ---- interaction ----
  var pointer = { x: 0, y: 0, over: false }, lastMove = -1e9;
  window.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    pointer.over = pointer.x >= 0 && pointer.x <= r.width && pointer.y >= 0 && pointer.y <= r.height;
    if (pointer.over) lastMove = performance.now();
  }, { passive: true });
  document.addEventListener("mouseout", function (e) { if (!e.relatedTarget) pointer.over = false; });
  window.addEventListener("blur", function () { pointer.over = false; });
  lastMove = performance.now();   // wait a moment before auto-cycling on load

  var active = null, pendingKey = null, pendingSince = 0;
  var alpha = { mbhb: 0.16, gb: 0.16, emri: 0.16, sgwb: 0.16, total: 0.85 };

  function pick(t0, now) {
    if (pointer.over) {
      var t = t0 + (pointer.x / W) * CFG.span, d = Math.abs(pointer.y - H / 2) / H;
      var best = null, bd = 1e9;
      for (var i = 0; i < KEYS.length; i++) {
        var k = KEYS[i], r = BAND[k];
        if (k === "mbhb") r = Math.max(r, MODEL.mbhb(t).env * CFG.scale);  // near merger, follow the peaks
        var dd = Math.abs(d - r);
        if (dd < bd) { bd = dd; best = k; }
      }
      // small hysteresis so the highlight doesn't flicker between neighbours
      if (best !== active) {
        if (best !== pendingKey) { pendingKey = best; pendingSince = now; }
        if (now - pendingSince < 140) return active;
      }
      return best;
    }
    if (now - lastMove < CFG.idleBeforeCycle * 1000) return null;
    var slot = Math.floor(now / 1000 / CFG.cycle) % (KEYS.length + 1);
    return slot < KEYS.length ? KEYS[slot] : null;
  }

  // ---- drawing ----
  var n = 0, buf = { mbhb: [], gb: [], emri: [], sgwb: [], total: [] };
  function trace(arr, color, a, width, glow) {
    if (a < 0.01) return;
    ctx.globalAlpha = a; ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.shadowBlur = glow ? 10 : 0; ctx.shadowColor = color;
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var x = i * CFG.step, y = H / 2 - arr[i] * CFG.scale * H;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  var t0 = 0, last = 0, raf = 0, onScreen = true;
  function frame(now) {
    if (!onScreen || document.hidden) { raf = 0; return; }
    raf = requestAnimationFrame(frame);
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0; last = now;
    t0 += dt * CFG.speed;

    n = Math.ceil(W / CFG.step) + 1;
    for (var i = 0; i < n; i++) {
      var t = t0 + (i * CFG.step / W) * CFG.span, s = noiseAt(t);
      for (var k = 0; k < KEYS.length; k++) { var v = MODEL[KEYS[k]](t).v; buf[KEYS[k]][i] = v; s += v; }
      buf.total[i] = s;
    }

    var sel = pick(t0, now);
    active = sel;
    var ease = 1 - Math.pow(0.001, dt || 0.016);
    KEYS.forEach(function (k) {
      var target = active ? (k === active ? 1 : 0.06) : 0.16;
      alpha[k] += (target - alpha[k]) * ease;
    });
    alpha.total += ((active ? 0.28 : 0.85) - alpha.total) * ease;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round";
    // time grid, scrolling with the data
    ctx.globalAlpha = 0.05; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1; ctx.shadowBlur = 0;
    var g = W / CFG.span, off = -((t0 % 1) * g);
    ctx.beginPath();
    for (var gx = off; gx < W; gx += g) { ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); }
    ctx.stroke();

    KEYS.forEach(function (k) { if (k !== active) trace(buf[k], CFG.colors[k], alpha[k], 1.3, false); });
    trace(buf.total, CFG.colors.total, alpha.total, 1.2, false);
    if (active) trace(buf[active], CFG.colors[active], alpha[active], 2, true);
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }

  if (window.IntersectionObserver) new IntersectionObserver(function (es) {
    onScreen = es[0].isIntersecting;
    if (onScreen && !raf) { last = 0; raf = requestAnimationFrame(frame); }
  }).observe(canvas);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && onScreen && !raf) { last = 0; raf = requestAnimationFrame(frame); }
  });
  raf = requestAnimationFrame(frame);
})();
