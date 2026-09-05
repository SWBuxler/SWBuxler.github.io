/* Intro behaviour for index.html: word reveals, the glyph stream, and the
   handoff into the site below it.

   Progress is measured against the STORY's height, not the document's — the
   site content sits in the same page, so document scroll would stretch the
   colour arc across content the story has nothing to do with. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var story = document.querySelector('.st-story');
  var beats = [].slice.call(document.querySelectorAll('.st-beat'));
  if (!story || !beats.length) return;

  /* ---- split headlines into animatable words ---- */
  document.querySelectorAll('.st-beat h2[data-split]').forEach(function (h) {
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(h.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'st-w';
          var b = document.createElement('b'); b.textContent = tok;
          w.appendChild(b); frag.appendChild(w);
        });
      } else {
        var w2 = document.createElement('span'); w2.className = 'st-w';
        var b2 = document.createElement('b'); b2.appendChild(node.cloneNode(true));
        w2.appendChild(b2); frag.appendChild(w2);
      }
    });
    h.innerHTML = ''; h.appendChild(frag);
    h.querySelectorAll('.st-w b').forEach(function (b, i) {
      b.style.transitionDelay = (i * 0.045) + 's';
    });
  });

  beats[0].classList.add('on');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.2 });
  beats.forEach(function (b) { io.observe(b); });

  /* ---- scroll state ---- */
  var head = document.querySelector('.site-head');
  var skip = document.querySelector('.st-skip');
  var cv   = document.getElementById('stream');
  var vig  = document.querySelector('.st-vig');
  var p = 0, targetP = 0, fade = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function measure() {
    var end = Math.max(1, story.offsetHeight - innerHeight * 0.55);
    targetP = clamp01(scrollY / end);

    /* the intro dissolves as the site arrives: stream and vignette fade out
       over the last half-viewport, and the header slides in behind them */
    var storyBottom = story.offsetTop + story.offsetHeight;
    fade = clamp01((scrollY + innerHeight - storyBottom) / (innerHeight * 0.5));

    if (head) head.classList.toggle('show', fade > 0.35);
    if (skip) skip.classList.toggle('gone', fade > 0.15);
  }

  /* Green -> grey -> amber, all inside the Terminal system's own two colours.
     Retimed for five beats: the rupture (beat 4) sits near p = 0.75. */
  function paint() {
    var h, s, l;
    if (p < 0.60)      { h = 118; s = 30; l = 68; }
    else if (p < 0.75) { var t = (p - 0.60) / 0.15; h = lerp(118, 90, t); s = lerp(30, 4, t); l = lerp(68, 55, t); }
    else if (p < 0.92) { var u = (p - 0.75) / 0.17; h = lerp(90, 41, u); s = lerp(4, 100, u); l = lerp(55, 50, u); }
    else               { h = 41; s = 100; l = 50; }
    root.style.setProperty('--st-h', h.toFixed(1));
    root.style.setProperty('--st-s', s.toFixed(1) + '%');
    root.style.setProperty('--st-l', l.toFixed(1) + '%');
    var o = (1 - fade).toFixed(3);
    if (cv)  cv.style.opacity  = o;
    if (vig) vig.style.opacity = o;
  }

  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);
  measure(); p = targetP; paint();

  /* ---- the background: tail -f, not matrix rain ----------------------------
     Log lines scroll up from the bottom. The rate and the number of parallel
     streams are read from scroll position, which is the whole point: one slow
     stream while the work is hand-built, a stalled cursor at the rupture, then
     three streams running at once once the leverage arrives. */
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var LH = 19, dpr = Math.min(devicePixelRatio || 1, 2);

  var VERBS = ['build', 'test', 'deploy', 'migrate', 'index', 'sync', 'compile', 'lint', 'seed'];
  var NOUNS = ['ingest', 'parser', 'scheduler', 'api', 'worker', 'store', 'client', 'report',
               'pipeline', 'resolver', 'cache', 'router'];
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function line() {
    var r = Math.random();
    if (r < 0.13) return '$ ' + pick(VERBS) + ' ' + pick(NOUNS);
    if (r < 0.24) return 'git commit -m "' + pick(VERBS) + ': ' + pick(NOUNS) + '"';
    if (r < 0.34) return '  ' + (120 + (Math.random() * 800 | 0)) + ' passed  ' +
                        (Math.random() * 4 | 0) + ' skipped';
    if (r < 0.46) return 'GET /' + pick(NOUNS) + '  200  ' + (4 + (Math.random() * 90 | 0)) + 'ms';
    if (r < 0.56) return '[warn] ' + pick(NOUNS) + ' deprecated';
    return '[ok] ' + pick(NOUNS) + ' ' + pick(VERBS) + 'd in ' +
           (0.2 + Math.random() * 3).toFixed(1) + 's';
  }

  var streams = [];
  function build() {
    cv.width = Math.max(1, innerWidth * dpr);
    cv.height = Math.max(1, innerHeight * dpr);
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textBaseline = 'top';
    var rows = Math.ceil(innerHeight / LH) + 2;
    streams = [];
    for (var i = 0; i < 3; i++) {
      var s = { lines: [], off: 0, wait: Math.random() * 40 };
      for (var r = 0; r < rows; r++) s.lines.push(line());
      streams.push(s);
    }
  }
  build();
  addEventListener('resize', build);

  var blink = 0;
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (fade >= 1) return;                     /* handed off — stop drawing */

    /* rate = lines per frame; live = how many streams are running */
    var rate, live, stall;
    if (p < 0.60)      { rate = lerp(0.010, 0.020, p / 0.60); live = 1; stall = 0; }
    else if (p < 0.75) { var t = (p - 0.60) / 0.15; rate = lerp(0.020, 0, t); live = 1; stall = t; }
    else if (p < 0.92) { var u = (p - 0.75) / 0.17; rate = lerp(0, 0.16, u); live = u > 0.45 ? (u > 0.75 ? 3 : 2) : 1; stall = 1 - u; }
    else               { rate = 0.16; live = 3; stall = 0; }

    var cs = getComputedStyle(root);
    var h = cs.getPropertyValue('--st-h').trim() || '118';
    var s = cs.getPropertyValue('--st-s').trim() || '30%';
    var colW = innerWidth / live;
    blink++;

    for (var i = 0; i < live; i++) {
      var st = streams[i];
      if (!reduce) {
        st.off += rate * LH;
        while (st.off >= LH) { st.off -= LH; st.lines.push(line()); st.lines.shift(); }
      }
      var x = i * colW + 26;
      for (var r = 0; r < st.lines.length; r++) {
        var y = innerHeight - (st.lines.length - r) * LH + st.off;
        if (y < -LH || y > innerHeight) continue;
        /* newest line brightest, older lines fade upward */
        var age = (st.lines.length - r) / st.lines.length;
        var a = (0.30 - age * 0.22) * (0.5 + rate * 3);
        if (a <= 0.005) continue;
        ctx.fillStyle = 'hsl(' + h + ' ' + s + ' 62% / ' + a.toFixed(3) + ')';
        ctx.fillText(st.lines[r], x, y);
      }
      /* at the rupture the newest line just sits there with a blinking cursor */
      if (stall > 0.5 && i === 0 && (blink >> 5) % 2 === 0) {
        ctx.fillStyle = 'hsl(' + h + ' ' + s + ' 62% / 0.34)';
        ctx.fillRect(x + ctx.measureText(st.lines[st.lines.length - 1]).width + 3,
                     innerHeight - LH + st.off + 2, 7, 12);
      }
    }
  }

  if (reduce) {
    p = targetP; paint(); draw();
    addEventListener('scroll', function () { p = targetP; paint(); draw(); }, { passive: true });
  } else {
    (function loop() {
      requestAnimationFrame(loop);
      p += (targetP - p) * 0.07;
      paint(); draw();
    })();
  }
})();
