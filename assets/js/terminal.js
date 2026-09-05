/* Terminal idioms, shared by every page.
   Injects the window title bar, the bottom bar, and the command palette, then
   wires the keys. All of it is progressive enhancement — with JS off the site
   is exactly what it was.

   The bottom bar does two jobs with one line, the way vim's does: status by
   default, command prompt once you press : or / */
(function () {
  "use strict";
  var doc = document, body = doc.body;
  if (!body) return;

  /* ---------- where are we ---------- */
  var file = (location.pathname.split('/').pop() || 'index.html');
  var deep = /\/projects\//.test(location.pathname);
  var up   = deep ? '../' : '';
  var slug = file.replace(/\.html$/, '');
  var path = deep ? '~/projects/' + slug : (slug === 'index' ? '~' : '~/' + slug);

  var PROJECTS = [
    ['project-qqq', 'Project QQQ'],
    ['project-ghostbusters', 'Project Ghostbusters'],
    ['market-share-analysis', 'Visual Market Share Analysis'],
    ['positions-report', 'Interactive Commodity Trading Positions Report']
  ];
  function proj(s) { return (deep ? '' : 'projects/') + s + '.html'; }

  var TARGETS = [
    ['Home', up + 'index.html', '~'],
    ['About', up + 'about.html', '~/about'],
    ['Experience', up + 'index.html#experience', '~#experience'],
    ['Selected work', up + 'index.html#projects', '~#projects'],
    ['Contact', up + 'index.html#contact', '~#contact'],
    ['Résumé (PDF)', up + 'assets/files/seth-hartzler-resume.pdf', 'download']
  ].concat(PROJECTS.map(function (p) { return [p[1], proj(p[0]), '~/projects/' + p[0]]; }));

  /* ---------- 01 · window chrome ---------- */
  body.classList.add('has-chrome');
  var bar = doc.createElement('div');
  bar.className = 'win-bar';
  bar.innerHTML = '<span class="win-dots"><i></i><i></i><i></i></span>' +
    '<span class="win-title">seth@hartzler — <b></b></span>' +
    '<span class="win-hint">⌘K</span>';
  bar.querySelector('b').textContent = path;
  body.insertBefore(bar, body.firstChild);

  /* ---------- 03 + 05 · the bottom bar ---------- */
  var sb = doc.createElement('div');
  sb.className = 'bar';
  sb.innerHTML =
    '<span class="bar__mode">NORMAL</span>' +
    '<span class="bar__file"></span>' +
    '<span class="bar__sect"></span>' +
    '<span class="bar__pct">0%</span>' +
    '<div class="bar__out" id="barOut"></div>' +
    '<div class="bar__cli"><span class="bar__ps">:</span>' +
      '<span class="bar__wrap">' +
        '<span class="bar__ghost"><b></b><span></span></span>' +
        '<input class="bar__in" autocomplete="off" spellcheck="false" aria-label="Command line">' +
      '</span></div>' +
    '<div class="bar__comp"></div>';
  body.appendChild(sb);
  sb.querySelector('.bar__file').textContent = file;

  var elSect  = sb.querySelector('.bar__sect'),
      elPct   = sb.querySelector('.bar__pct'),
      elOut   = sb.querySelector('.bar__out'),
      elIn    = sb.querySelector('.bar__in'),
      elTyped = sb.querySelector('.bar__ghost b'),
      elRest  = sb.querySelector('.bar__ghost span'),
      elComp  = sb.querySelector('.bar__comp');

  /* status: which section am I in, and how far down */
  var marks = [].slice.call(doc.querySelectorAll('main section[id], .prose h2, .st-beat'));
  function status() {
    var max = doc.documentElement.scrollHeight - innerHeight;
    var pct = max > 0 ? Math.round(scrollY / max * 100) : 100;
    elPct.textContent = (scrollY < 8 ? 'TOP' : pct >= 99 ? 'BOT' : pct + '%');
    var mid = scrollY + innerHeight * 0.4, cur = '';
    marks.forEach(function (m) {
      if (m.getBoundingClientRect().top + scrollY <= mid) {
        cur = (m.id || (m.textContent || '').trim()).replace(/^##\s*/, '').slice(0, 34);
      }
    });
    elSect.textContent = cur;
  }
  addEventListener('scroll', status, { passive: true });
  addEventListener('resize', status);
  status();

  /* ---------- 05 + 07 + 08 · the command line ---------- */
  var CMDS = {};
  CMDS['help']    = { out: 'ls · cd <page> · open <project> · cat resume · whoami · contact · clear' };
  CMDS['ls']      = { out: 'about  projects/  resume.pdf  contact' };
  CMDS['cd projects'] = { go: up + 'index.html#projects' };
  CMDS['cd about']    = { go: up + 'about.html' };
  CMDS['cd home']     = { go: up + 'index.html' };
  CMDS['cat resume']  = { go: up + 'assets/files/seth-hartzler-resume.pdf' };
  CMDS['whoami']  = { out: 'seth hartzler — software engineer. five years shipping.' };
  CMDS['contact'] = { go: up + 'index.html#contact' };
  CMDS['clear']   = { clear: true };
  PROJECTS.forEach(function (p) { CMDS['open ' + p[0]] = { go: proj(p[0]) }; });
  var NAMES = Object.keys(CMDS).sort();

  var hist = [], hi = -1, cands = [], ci = 0;
  try { hist = JSON.parse(localStorage.getItem('cli-history') || '[]'); } catch (e) { hist = []; }

  function matches(v) {
    return v ? NAMES.filter(function (n) { return n.indexOf(v) === 0 && n !== v; }) : [];
  }
  function refresh() {
    var v = elIn.value;
    elTyped.textContent = v;
    cands = matches(v);
    elRest.textContent = cands.length ? cands[0].slice(v.length) : '';
    elComp.innerHTML = cands.length > 1
      ? cands.map(function (c, i) { return '<b class="' + (i === ci ? 'sel' : '') + '">' + c + '</b>'; }).join('')
      : '';
  }
  function print(t, cls) {
    var d = doc.createElement('div');
    if (cls) d.className = cls;
    d.textContent = t;
    elOut.appendChild(d);
    elOut.scrollTop = elOut.scrollHeight;
  }
  function openCmd(seed) {
    sb.classList.add('cmd');
    elIn.value = seed || '';
    refresh();
    elIn.focus();
  }
  function closeCmd() {
    sb.classList.remove('cmd');
    elIn.blur();
    status();
  }

  elIn.addEventListener('input', function () { ci = 0; refresh(); });
  elIn.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeCmd(); return; }

    if (e.key === 'Tab' || (e.key === 'ArrowRight' && elIn.selectionStart === elIn.value.length)) {
      if (!cands.length) return;
      e.preventDefault();
      if (e.key === 'Tab' && cands.length > 1) { elIn.value = cands[ci]; ci = (ci + 1) % cands.length; }
      else { elIn.value = cands[0]; ci = 0; }
      refresh();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hist.length) { hi = Math.min(hi + 1, hist.length - 1); elIn.value = hist[hi]; refresh(); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      hi = Math.max(hi - 1, -1);
      elIn.value = hi < 0 ? '' : hist[hi];
      refresh();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      var v = elIn.value.trim();
      if (!v) return;
      hist.unshift(v); hist = hist.slice(0, 30); hi = -1;
      try { localStorage.setItem('cli-history', JSON.stringify(hist)); } catch (err) {}
      var c = CMDS[v];
      if (!c) { print(': ' + v); print('command not found: ' + v + '  (try: help)', 'err'); }
      else if (c.clear) { elOut.innerHTML = ''; }
      else if (c.go) { location.href = c.go; return; }
      else { print(': ' + v); print(c.out); }
      elIn.value = ''; refresh();
    }
  });

  /* ---------- 06 · command palette ---------- */
  var pal = doc.createElement('div');
  pal.className = 'pal';
  pal.innerHTML =
    '<div class="pal__box" role="dialog" aria-label="Command palette">' +
      '<input class="pal__in" placeholder="Jump to…" autocomplete="off" spellcheck="false">' +
      '<ul class="pal__l"></ul>' +
      '<div class="pal__foot"><span>↑↓ move</span><span>⏎ open</span><span>esc close</span></div>' +
    '</div>';
  body.appendChild(pal);
  var pin = pal.querySelector('.pal__in'), plist = pal.querySelector('.pal__l'), psel = 0, rows = [];
  var lastFocus = null;

  function fuzzy(q, s) {           /* subsequence match, like a real palette */
    q = q.toLowerCase(); s = s.toLowerCase();
    var i = 0;
    for (var j = 0; j < s.length && i < q.length; j++) if (s[j] === q[i]) i++;
    return i === q.length;
  }
  function drawPal() {
    var q = pin.value.trim();
    rows = TARGETS.filter(function (t) { return !q || fuzzy(q, t[0] + ' ' + t[2]); });
    if (psel >= rows.length) psel = Math.max(0, rows.length - 1);
    plist.innerHTML = rows.length
      ? rows.map(function (t, i) {
          return '<li class="' + (i === psel ? 'on' : '') + '" data-i="' + i + '">' +
                 t[0] + '<span class="k">' + t[2] + '</span></li>';
        }).join('')
      : '<li class="none">no matches</li>';
  }
  function openPal() {
    lastFocus = doc.activeElement;
    pal.classList.add('open'); pin.value = ''; psel = 0; drawPal(); pin.focus();
  }
  /* restore focus when dismissed, but not when navigating away */
  function closePal(restore) {
    pal.classList.remove('open');
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }
  function goSel() {
    var t = rows[psel];
    if (!t) return;
    /* close first: a same-page anchor doesn't reload, so the overlay would
       otherwise stay up over the section it just jumped to */
    closePal(false);
    location.href = t[1];
  }

  pin.addEventListener('input', function () { psel = 0; drawPal(); });
  pin.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePal(true); return; }
    if (!rows.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); psel = (psel + 1) % rows.length; drawPal(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); psel = (psel - 1 + rows.length) % rows.length; drawPal(); }
    if (e.key === 'Enter')     { e.preventDefault(); goSel(); }
  });
  plist.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-i]');
    if (li) { psel = +li.dataset.i; goSel(); }
  });
  pal.addEventListener('click', function (e) { if (e.target === pal) closePal(true); });

  /* ---------- global keys ---------- */
  function typing(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }
  addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      pal.classList.contains('open') ? closePal(true) : openPal();
      return;
    }
    if (typing(e.target)) return;
    if (e.key === ':' || e.key === '/') { e.preventDefault(); openCmd(); }
    if (e.key === 'Escape') { closePal(true); closeCmd(); }
  });
  sb.addEventListener('click', function (e) {
    if (!sb.classList.contains('cmd') && !typing(e.target)) openCmd();
  });
})();
