/*
  Solo: eine einzelne, lebendige Figur für Module, in denen ein eigenes Maskottchen wohnt
  (Marko, der Markierstift, und Erdi, die Erde). Sie übernehmen dort die Rolle von Tinto und Rolli.
  Einbinden:  <script src=".../maskottchen/solo.js"></script>, danach
  Solo.init({ skin:'marko'|'erdi', help:()=>({text,tip}), onTap:fn, comments:[...], color:()=>'#ffd54a', offsetBottom:16 })
  API: say(text, mood, ms), react(mood, text), mood(m, ms), tell(text, mood)
  Keine Daten werden übertragen. Animationen laufen immer.
*/
(function () {
  'use strict';
  var KEY = 'solo-v1';
  var st = { off: false, quiet: false };
  var cfg = { skin: 'marko', help: null, onTap: null, comments: [], color: null, offsetBottom: 16, intro: null, id: 'solo' };
  var el = {}, pos = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, lean = 0, leanV = 0, dragging = false;
  var curMood = 'happy', moodT = null, base = 'happy', lastAct = Date.now(), nextRemark = 45, bubbleOpen = false, closeT = null, curHelp = null, lastPtr = 0, taps = [], wasSleeping = false, yawned = false;
  var INK = '#1f2733';

  function load() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); st.off = !!o.off; st.quiet = !!o.quiet; } catch (e) {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  // ---------------------------------------------------------------- Gesichter
  // g: Augen-x links/rechts, Augen-y, Radius, Mund-Mitte x, Mund-y, Mundbreite, Linienfarbe, Wangen-y
  function face(m, g) {
    var xl = g.xl, xr = g.xr, y = g.ey, r = g.r, cx = g.cx, my = g.my, w = g.mw, c = g.c, h = '';
    function dot(x, yy, rr) { return '<circle cx="' + x + '" cy="' + yy + '" r="' + rr + '" fill="' + c + '"/><circle cx="' + (x + rr * .35) + '" cy="' + (yy - rr * .35) + '" r="' + (rr * .33).toFixed(1) + '" fill="#fff"/>'; }
    function arcUp(x, yy, rr) { return '<path d="M' + (x - rr) + ' ' + (yy + rr * .4) + ' Q' + x + ' ' + (yy - rr * .9) + ' ' + (x + rr) + ' ' + (yy + rr * .4) + '" fill="none" stroke="' + c + '" stroke-width="' + (g.lw) + '" stroke-linecap="round"/>'; }
    function arcDown(x, yy, rr) { return '<path d="M' + (x - rr) + ' ' + (yy - rr * .2) + ' Q' + x + ' ' + (yy + rr * .9) + ' ' + (x + rr) + ' ' + (yy - rr * .2) + '" fill="none" stroke="' + c + '" stroke-width="' + (g.lw) + '" stroke-linecap="round"/>'; }
    function heart(x, yy, rr) { var s = rr / 5; return '<path transform="translate(' + (x - 5 * s) + ' ' + (yy - 4 * s) + ') scale(' + s + ')" d="M5 9 C-2 4 1 -1 5 2 C9 -1 12 4 5 9Z" fill="#ff4d6d"/>'; }
    var eyes, mouth, extra = '';
    var smile = '<path d="M' + (cx - w) + ' ' + my + ' Q' + cx + ' ' + (my + w * .95) + ' ' + (cx + w) + ' ' + my + '" fill="none" stroke="' + c + '" stroke-width="' + g.lw + '" stroke-linecap="round"/>';
    var open = '<path d="M' + (cx - w) + ' ' + my + ' Q' + cx + ' ' + (my + w * 1.9) + ' ' + (cx + w) + ' ' + my + ' Z" fill="' + c + '" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/><path d="M' + (cx - w * .55) + ' ' + (my + w * .75) + ' Q' + cx + ' ' + (my + w * 1.2) + ' ' + (cx + w * .55) + ' ' + (my + w * .75) + '" fill="#ff7a8a"/>';
    switch (m) {
      case 'excited': eyes = dot(xl, y, r + 1) + dot(xr, y, r + 1); mouth = open; break;
      case 'interested': eyes = dot(xl + 1.5, y - 1, r) + dot(xr + 1.5, y - 1, r); mouth = '<ellipse cx="' + cx + '" cy="' + (my + 2) + '" rx="' + (w * .35) + '" ry="' + (w * .3) + '" fill="' + c + '"/>'; break;
      case 'thinking': eyes = dot(xl - 1, y - 2.5, r) + dot(xr - 1, y - 2.5, r); mouth = '<path d="M' + (cx - w * .5) + ' ' + (my + 3) + ' Q' + cx + ' ' + (my - 1) + ' ' + (cx + w * .6) + ' ' + (my + 2) + '" fill="none" stroke="' + c + '" stroke-width="' + g.lw + '" stroke-linecap="round"/>'; extra = '<text x="' + (g.cx + g.w2) + '" y="' + (g.ey - g.r * 3) + '" font-size="14" font-weight="800" fill="' + c + '" font-family="sans-serif">?</text>'; break;
      case 'sleep': eyes = arcDown(xl, y, r) + arcDown(xr, y, r); mouth = '<ellipse cx="' + cx + '" cy="' + (my + 2) + '" rx="' + (w * .3) + '" ry="' + (w * .25) + '" fill="' + c + '" opacity=".8"/>'; extra = '<g class="so-z" font-family="sans-serif" font-weight="800" fill="' + c + '"><text x="' + (g.cx + g.w2) + '" y="' + (g.ey - g.r * 2) + '" font-size="12">z</text><text x="' + (g.cx + g.w2 + 8) + '" y="' + (g.ey - g.r * 3.4) + '" font-size="16">Z</text></g>'; break;
      case 'wink': eyes = arcUp(xl, y, r) + dot(xr, y, r); mouth = smile; break;
      case 'giggle': eyes = arcUp(xl, y, r) + arcUp(xr, y, r); mouth = open; break;
      case 'oops': eyes = dot(xl, y + 1, r - .6) + dot(xr, y + 1, r - .6); mouth = '<path d="M' + (cx - w) + ' ' + (my + 3) + ' q' + (w / 3) + ' -4 ' + (w * .66) + ' 0 t' + (w * .66) + ' 0 t' + (w * .66) + ' 0" fill="none" stroke="' + c + '" stroke-width="' + g.lw + '" stroke-linecap="round"/>'; extra = '<path d="M' + (xr + r * 2.2) + ' ' + (y - r * 2.4) + ' q-3 5 0 7 q3 -2 0 -7z" fill="#6ec6f7" stroke="' + c + '" stroke-width="1.2"/>'; break;
      case 'love': eyes = heart(xl, y, r * 1.5) + heart(xr, y, r * 1.5); mouth = smile; break;
      case 'yawn': eyes = arcDown(xl, y, r) + arcDown(xr, y, r); mouth = '<ellipse cx="' + cx + '" cy="' + (my + 4) + '" rx="' + (w * .55) + '" ry="' + (w * .8) + '" fill="' + c + '"/>'; break;
      case 'surprised': eyes = dot(xl, y, r + 1.6) + dot(xr, y, r + 1.6); mouth = '<ellipse cx="' + cx + '" cy="' + (my + 3) + '" rx="' + (w * .4) + '" ry="' + (w * .5) + '" fill="' + c + '"/>'; break;
      case 'bored': eyes = '<path d="M' + (xl - r) + ' ' + y + ' H' + (xl + r) + ' M' + (xr - r) + ' ' + y + ' H' + (xr + r) + '" stroke="' + c + '" stroke-width="' + g.lw + '" stroke-linecap="round"/>'; mouth = '<path d="M' + (cx - w * .6) + ' ' + (my + 2) + ' H' + (cx + w * .6) + '" stroke="' + c + '" stroke-width="' + g.lw + '" stroke-linecap="round"/>'; break;
      default: eyes = dot(xl, y, r) + dot(xr, y, r); mouth = smile;
    }
    var bl = (m === 'happy' || m === 'excited' || m === 'interested' || m === 'thinking' || m === 'surprised') ? ' class="so-blink" style="transform-origin:' + cx + 'px ' + y + 'px"' : '';
    return '<g class="so-eyes"><g' + bl + '>' + eyes + '</g></g>' + mouth + extra;
  }

  // ---------------------------------------------------------------- Figuren
  var SKINS = {
    marko: {
      name: 'Marko', emoji: '🖍️', color: '#e0a800', w: 68, h: 91, aria: 'Marko, der Markierstift',
      svg: function (m) {
        var col = cfg.color ? cfg.color() : '#ffd54a', up = (m === 'excited' || m === 'giggle' || m === 'love' || m === 'surprised');
        var arms = up
          ? '<path d="M34 92 Q18 80 14 60" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="14" cy="58" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/><path d="M86 92 Q102 80 106 60" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="106" cy="58" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/>'
          : (m === 'thinking' ? '<path d="M34 96 Q20 102 16 114" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="116" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/><path d="M86 100 Q92 112 78 108" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="74" cy="106" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/>'
          : '<path d="M34 96 Q20 102 16 114" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="116" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/><path d="M86 96 Q100 102 104 114" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="104" cy="116" r="6" fill="#fff" stroke="' + INK + '" stroke-width="3"/>');
        return '<svg viewBox="0 0 120 160" aria-hidden="true" overflow="visible"><g class="so-feet"><ellipse cx="50" cy="156" rx="9" ry="4" fill="' + INK + '"/><ellipse cx="70" cy="156" rx="9" ry="4" fill="' + INK + '"/></g><g transform="rotate(-4 60 80)">' +
          '<path d="M38 24 Q38 6 60 6 Q82 6 82 24 L82 46 H38Z" style="fill:' + col + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="34" y="44" width="52" height="86" rx="10" fill="#fff" stroke="' + INK + '" stroke-width="3"/><rect x="35.5" y="45.5" width="49" height="12" style="fill:' + col + '" opacity=".6"/>' +
          '<path d="M40 130 L80 130 L70 152 L50 152Z" style="fill:' + col + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' + arms +
          '<circle cx="42" cy="90" r="5" fill="#ff9aa8" opacity=".6"/><circle cx="78" cy="90" r="5" fill="#ff9aa8" opacity=".6"/>' +
          face(m, { xl: 50, xr: 70, ey: 79, r: 5.3, cx: 60, my: 93, mw: 11, c: INK, lw: 3.5, w2: 22 }) + '</g></svg>';
      }
    },
    erdi: {
      name: 'Erdi', emoji: '🌍', color: '#1f7a3d', w: 82, h: 90, aria: 'Erdi, die lächelnde Erde',
      svg: function (m) {
        var id = 'se';
        var LAND = '<path d="M18 74 C26 46 56 30 86 36 C96 40 94 50 82 54 C74 58 76 66 66 72 C58 78 54 90 46 90 C38 86 34 78 26 82 C18 82 16 78 18 74Z"/><path d="M50 118 C62 108 80 114 84 130 C86 146 72 162 64 176 C56 178 52 168 54 156 C46 142 40 128 50 118Z"/><path d="M116 40 C130 32 150 36 156 48 C150 58 134 56 126 60 C116 58 110 48 116 40Z"/><path d="M118 98 C134 86 158 94 160 112 C162 130 148 152 136 164 C126 168 122 154 122 142 C114 128 106 112 118 98Z"/><path d="M152 58 C166 54 180 64 182 78 C172 88 160 82 152 72Z"/>';
        var up = (m === 'excited' || m === 'giggle' || m === 'love' || m === 'surprised');
        var arms = up
          ? '<path d="M20 120 Q4 108 2 90" fill="none" stroke="#24352b" stroke-width="6" stroke-linecap="round"/><circle cx="2" cy="88" r="7" fill="#fff" stroke="#24352b" stroke-width="4"/><path d="M180 120 Q196 108 198 90" fill="none" stroke="#24352b" stroke-width="6" stroke-linecap="round"/><circle cx="198" cy="88" r="7" fill="#fff" stroke="#24352b" stroke-width="4"/>'
          : '<path d="M18 120 Q4 130 4 148" fill="none" stroke="#24352b" stroke-width="6" stroke-linecap="round"/><circle cx="4" cy="150" r="7" fill="#fff" stroke="#24352b" stroke-width="4"/><path d="M182 120 Q196 130 196 148" fill="none" stroke="#24352b" stroke-width="6" stroke-linecap="round"/><circle cx="196" cy="150" r="7" fill="#fff" stroke="#24352b" stroke-width="4"/>';
        return '<svg viewBox="0 0 200 210" aria-hidden="true" overflow="visible"><defs><radialGradient id="' + id + 'o" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#6ec6f7"/><stop offset=".6" stop-color="#3b92e3"/><stop offset="1" stop-color="#2468b8"/></radialGradient><clipPath id="' + id + 'g"><circle cx="100" cy="100" r="86"/></clipPath></defs>' +
          '<g class="so-feet"><ellipse cx="72" cy="196" rx="20" ry="9" fill="#24352b"/><ellipse cx="128" cy="196" rx="20" ry="9" fill="#24352b"/></g>' + arms +
          '<circle cx="100" cy="100" r="86" fill="url(#' + id + 'o)"/><g clip-path="url(#' + id + 'g)"><g fill="#66bb47" stroke="#24352b" stroke-width="3.5" stroke-linejoin="round">' + LAND + '</g><path d="M30 70 A76 76 0 0 1 90 24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".45"/><path d="M176 120 A86 86 0 0 1 70 184 A100 100 0 0 0 176 120Z" fill="#14407f" opacity=".28"/></g>' +
          '<circle cx="100" cy="100" r="86" fill="none" stroke="#24352b" stroke-width="6"/><circle cx="58" cy="128" r="8" fill="#ff9aa8" opacity=".85"/><circle cx="142" cy="128" r="8" fill="#ff9aa8" opacity=".85"/>' +
          face(m, { xl: 76, xr: 124, ey: 102, r: 9, cx: 100, my: 132, mw: 21, c: '#24352b', lw: 5, w2: 40 }) + '</svg>';
      }
    }
  };

  // ---------------------------------------------------------------- Texte
  var NICE = ['Du machst das gut!', 'Schön, dass du dir Zeit nimmst.', 'Ich bin gern bei dir. 💙', 'Weiter so, Schritt für Schritt.', 'Du kannst stolz auf dich sein.'];
  var BORED = ['Hallo? Ist da noch jemand? Ich langweile mich ein bisschen …', 'Wenn du Hilfe brauchst, tippe mich einfach an.', '*gähn* … ich bin noch da, falls du mich brauchst.'];
  var WAKE = ['Oh, du bist wieder da! Ich habe nur kurz die Augen zugemacht.', 'Hoppla, eingenickt! Weiter geht es.'];
  var TICKLE = { marko: ['Hihi, das kitzelt an der Spitze!', 'Nicht kitzeln, sonst male ich Striche daneben!'], erdi: ['Hihi, das kitzelt! Ich bin ganz kitzlig am Äquator.', 'Stopp, sonst gerät meine Umlaufbahn durcheinander!'] };
  var DIZZY = { marko: ['Uff, mir wird ganz schwindelig. Ich bin doch kein Kreisel!'], erdi: ['Oh weh, so schnell dreh ich mich sonst nur in 24 Stunden!'] };
  var BREAK = ['Du lernst schon eine ganze Weile. Trink einen Schluck Wasser und streck dich kurz! 💧', 'Kleine Pause gefällig? Danach geht es mit frischem Kopf weiter.'];

  // ---------------------------------------------------------------- Aufbau
  var CSS = '' +
    '#so-root{position:fixed;left:0;top:0;width:0;height:0;z-index:9990;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '.so{position:fixed;left:0;top:0;touch-action:none;cursor:grab;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;outline:none;will-change:transform}' +
    '.so.dragging{cursor:grabbing}' +
    '.so .so-body{width:100%;height:100%;transform-origin:50% 100%;filter:drop-shadow(0 5px 4px rgba(0,0,0,.25))}' +
    '.so .so-body svg{width:100%;height:100%;display:block;overflow:visible}' +
    '.so .so-wrap{width:100%;height:100%;transform-origin:50% 100%}' +
    '.so.idle .so-wrap{animation:so-breathe 3.4s ease-in-out infinite}' +
    '.so.hop .so-wrap{animation:so-hop .8s ease}' +
    '.so.sleepy .so-wrap{animation:so-sleep 4.2s ease-in-out infinite}' +
    '.so-blink{animation:so-bl 4.6s infinite}' +
    '.so-z{animation:so-zz 2.4s ease-in-out infinite}' +
    '@keyframes so-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.025,.975)}}' +
    '@keyframes so-hop{0%{transform:translateY(0) scale(1,1)}20%{transform:translateY(0) scale(1.08,.9)}50%{transform:translateY(-18px) scale(.95,1.06)}80%{transform:translateY(0) scale(1.08,.9)}100%{transform:translateY(0) scale(1,1)}}' +
    '@keyframes so-sleep{0%,100%{transform:rotate(-2deg) scale(1,1)}50%{transform:rotate(2deg) scale(1.03,.97)}}' +
    '@keyframes so-bl{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}' +
    '@keyframes so-zz{0%,100%{opacity:.5;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}' +
    '#so-bubble{position:fixed;left:0;top:0;max-width:min(300px,calc(100vw - 24px));background:#fff;color:#1f2933;border:3px solid #2c2457;border-radius:16px;padding:10px 14px 10px;box-shadow:3px 3px 0 #2c2457;font-size:15px;line-height:1.4;opacity:0;pointer-events:none;transform:translateY(6px);transition:opacity .2s,transform .2s;z-index:9991}' +
    '#so-bubble.open{opacity:1;pointer-events:auto;transform:none}' +
    '#so-bubble .so-who{font-size:12px;font-weight:800;margin-bottom:3px;letter-spacing:.3px}' +
    '#so-bubble p{margin:0 0 6px}' +
    '#so-bubble .so-x{position:absolute;right:4px;top:2px;border:0;background:transparent;font-size:20px;line-height:1;color:#6b7280;cursor:pointer;padding:4px 8px;min-height:32px}' +
    '#so-bubble .so-opt{display:block;width:100%;text-align:left;border:2px solid #d5dbe6;background:#fff;border-radius:12px;padding:8px 11px;margin-top:6px;font:inherit;font-weight:700;font-size:14px;color:#1f2933;cursor:pointer;min-height:40px}' +
    '#so-bubble .so-opt:hover{border-color:#6366f1;background:#eef0ff}' +
    '#so-bubble .so-lk{border:0;background:transparent;color:#6b7280;font:inherit;font-size:12px;text-decoration:underline;cursor:pointer;padding:6px 4px;margin-top:4px;min-height:30px}' +
    '#so-back{position:fixed;left:12px;bottom:12px;z-index:9990;display:none;border:2px solid #2c2457;background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-weight:700;font-size:13px;cursor:pointer;box-shadow:2px 2px 0 #2c2457;min-height:38px}' +
    '@media print{#so-root,#so-bubble,#so-back{display:none!important}}';

  function sk() { return SKINS[cfg.skin]; }
  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }
  function render() { if (el.body) { el.body.innerHTML = sk().svg(curMood); applyEyes(); } }
  function applyEyes() { applyEyesNow(); }
  function mood(m, ms) {
    clearTimeout(moodT); curMood = m; render(); el.node.classList.toggle('sleepy', m === 'sleep'); el.node.classList.toggle('idle', m !== 'sleep');
    if (ms) moodT = setTimeout(function () { curMood = base; render(); el.node.classList.toggle('sleepy', base === 'sleep'); el.node.classList.toggle('idle', base !== 'sleep'); }, ms);
  }
  function setBase(m) { base = m; if (!moodT) { curMood = m; render(); el.node.classList.toggle('sleepy', m === 'sleep'); el.node.classList.toggle('idle', m !== 'sleep'); } }
  function hop() { el.node.classList.add('hop'); setTimeout(function () { el.node.classList.remove('hop'); }, 900); }

  // ---------------------------------------------------------------- Position und Federn
  function size() { return { w: el.node.offsetWidth, h: el.node.offsetHeight }; }
  function clamp(x, y) { var s = size(); return { x: Math.max(4, Math.min(vw() - s.w - 4, x)), y: Math.max(4, Math.min(vh() - s.h - 4, y)) }; }
  function home() { var s = size(); return clamp(14, vh() - s.h - cfg.offsetBottom); }
  function setTarget(x, y) { var c = clamp(x, y); tgt.x = c.x; tgt.y = c.y; }
  function savePos() { try { sessionStorage.setItem('solo-pos-' + cfg.id, JSON.stringify({ fx: pos.x / vw(), fy: pos.y / vh() })); } catch (e) {} }
  var lastTs = 0;
  function loop(ts) {
    var dt = Math.min(.05, (ts - lastTs) / 1000 || .016); lastTs = ts;
    if (el.root && !st.off) {
      if (dragging) { pos.x = tgt.x; pos.y = tgt.y; vel.x = vel.y = 0; }
      else {
        var k = 90, d = 14;
        vel.x += ((tgt.x - pos.x) * k - vel.x * d) * dt; vel.y += ((tgt.y - pos.y) * k - vel.y * d) * dt; pos.x += vel.x * dt; pos.y += vel.y * dt;
      }
      var target = Math.max(-18, Math.min(18, vel.x * .035));
      leanV += ((target - lean) * 140 - leanV * 11) * dt; lean += leanV * dt;
      el.node.style.transform = 'translate(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px)';
      el.wrap.style.transform = el.node.classList.contains('hop') ? '' : 'rotate(' + lean.toFixed(2) + 'deg)';
      if (bubbleOpen) layoutBubble();
    }
    requestAnimationFrame(loop);
  }
  function wander() {
    setTimeout(function () {
      if (el.root && !st.off && !dragging && !bubbleOpen && curMood !== 'sleep' && Date.now() - lastAct > 20000 && Math.random() < .45) {
        var s = size(), x = Math.random() < .5 ? 14 : vw() - s.w - 14; setTarget(x, vh() - s.h - cfg.offsetBottom); try { sessionStorage.setItem('solo-pos-' + cfg.id, JSON.stringify({ fx: x / vw(), fy: tgt.y / vh() })); } catch (e) {}
      }
      wander();
    }, 25000 + Math.random() * 20000);
  }

  // ---------------------------------------------------------------- Blase
  function layoutBubble() {
    var b = el.bubble, s = size(), bw = b.offsetWidth, bh = b.offsetHeight, x = pos.x + s.w / 2 - bw / 2, y = pos.y - bh - 10;
    if (y < 8) y = pos.y + s.h + 10;
    x = Math.max(8, Math.min(vw() - bw - 8, x)); b.style.transform = 'translate(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px)';
  }
  function openBubble(html, autoMs) {
    clearTimeout(closeT); el.bubble.innerHTML = html; el.bubble.classList.add('open'); bubbleOpen = true; layoutBubble();
    if (autoMs) closeT = setTimeout(closeBubble, autoMs);
  }
  function closeBubble() { clearTimeout(closeT); el.bubble.classList.remove('open'); bubbleOpen = false; curHelp = null; }
  function who() { return '<div class="so-who" style="color:' + sk().color + '">' + sk().emoji + ' ' + sk().name + '</div><button class="so-x" aria-label="Schließen" data-k="close">×</button>'; }
  function quietLink() { return '<button class="so-lk" data-k="quiet">' + (st.quiet ? 'Du darfst wieder erzählen' : 'Weniger reden') + '</button>'; }
  function say(text, m, ms) {
    if (!el.root || st.off) return false; lastAct = Date.now(); curHelp = null;
    mood(m || 'happy', 5000); openBubble(who() + '<p>' + esc(text) + '</p>' + quietLink(), ms || (3500 + text.length * 55)); return true;
  }
  function showAsk(o) {
    curHelp = o; mood('interested', 4000);
    openBubble(who() + '<p>' + esc(o.text) + '<br><br><b>Brauchst du Hilfe?</b></p><button class="so-opt" data-k="tip">Tipp anzeigen</button><button class="so-opt" data-k="no">Ohne Hilfe weitermachen</button><button class="so-lk" data-k="off">Ausblenden</button>' + quietLink(), 40000);
  }
  function showTip(o) { mood('thinking', 5000); openBubble(who() + '<p>' + esc(o.tip) + '</p><button class="so-opt" data-k="no">Alles klar</button>', 60000); }
  function applyOff() { if (!el.root) return; el.node.style.display = st.off ? 'none' : ''; el.back.style.display = st.off ? 'block' : 'none'; if (st.off) closeBubble(); }

  // ---------------------------------------------------------------- Persönlichkeit
  var bag = [], lastText = '';
  function pick(a) { var t, n = 0; do { t = rnd(a); n++; } while (t === lastText && n < 5 && a.length > 1); lastText = t; return t; }
  function remark() {
    if (!bag.length) { bag = ['nice', 'comment', 'comment', 'comment', 'help', 'nice']; bag.sort(function () { return Math.random() - .5; }); }
    var k = bag.pop(), o = cfg.help ? cfg.help() : null;
    if (k === 'help' && o) { showAsk(o); return; }
    if (k === 'nice' || !cfg.comments.length) say(pick(NICE), 'love'); else say(pick(cfg.comments), 'interested');
  }
  function activity() {
    lastAct = Date.now(); nextRemark = 45 + Math.random() * 25; yawned = false;
    if (curMood === 'sleep' || curMood === 'bored' || curMood === 'yawn') {
      var slept = wasSleeping; wasSleeping = false; clearTimeout(moodT); moodT = null; base = 'happy';
      if (slept && !bubbleOpen && !st.quiet && !st.off) say(rnd(WAKE), 'happy'); else mood('happy');
    }
  }
  function tick() {
    if (!el.root || st.off || document.hidden) return;
    var idle = (Date.now() - lastAct) / 1000;
    if (idle >= 240 && curMood !== 'sleep') { if (!bubbleOpen) { wasSleeping = true; base = 'sleep'; mood('sleep'); } }
    else if (idle >= 120 && base === 'happy') setBase('bored');
    if (idle >= 150 && !yawned && base === 'bored' && !bubbleOpen) { yawned = true; mood('yawn', 3000); }
    if (idle >= nextRemark && !bubbleOpen && !st.quiet && base !== 'sleep') {
      if (base === 'bored') { say(rnd(BORED), 'bored'); nextRemark = idle + 80; } else { remark(); nextRemark = idle + 60 + Math.random() * 50; }
    }
  }
  function micro() {
    if (!el.root || st.off || bubbleOpen || document.hidden || base === 'sleep' || moodT || dragging) return;
    var a = rnd(['look', 'look', 'wink', 'hop', 'look']);
    if (a === 'look') { var pts = [[-3, -1], [3, -1.5], [-2, 1.5], [0, 0]], i = 0; (function next() { if (Date.now() - lastPtr < 1500 || i >= pts.length) return; el.eyeT = 'translate(' + pts[i][0] + 'px,' + pts[i][1] + 'px)'; applyEyesNow(); i++; setTimeout(next, 1000); })(); }
    else if (a === 'wink') mood('wink', 1400); else hop();
  }
  function applyEyesNow() { var e = el.body && el.body.querySelector('.so-eyes'); if (e) e.style.transform = el.eyeT || ''; }
  function breakCheck() {
    var t0 = 0, done = 0; try { t0 = +sessionStorage.getItem('so-t0'); done = +sessionStorage.getItem('so-brk') || 0; if (!t0) { sessionStorage.setItem('so-t0', String(Date.now())); return; } } catch (e) { return; }
    var min = (Date.now() - t0) / 60000, th = [40, 90, 140];
    if (done < th.length && min >= th[done] && !bubbleOpen && !st.quiet) { try { sessionStorage.setItem('so-brk', String(done + 1)); } catch (e) {} say(rnd(BREAK), 'interested'); }
  }

  // ---------------------------------------------------------------- API
  var API = {
    ready: false,
    init: function (c) {
      for (var k in c) cfg[k] = c[k];
      if (!SKINS[cfg.skin] || document.getElementById('so-root')) return;
      load();
      var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
      var root = document.createElement('div'); root.id = 'so-root'; root.setAttribute('data-html2canvas-ignore', 'true');
      var K = sk();
      root.innerHTML = '<div class="so idle" role="button" tabindex="0" aria-label="' + K.aria + ' – Hilfe" style="width:' + K.w + 'px;height:' + K.h + 'px"><div class="so-wrap"><div class="so-body"></div></div></div><div id="so-bubble" role="dialog" aria-live="polite"></div><button id="so-back" type="button">' + K.emoji + ' ' + K.name + ' holen</button>';
      document.body.appendChild(root);
      el.root = root; el.node = root.querySelector('.so'); el.wrap = root.querySelector('.so-wrap'); el.body = root.querySelector('.so-body'); el.bubble = root.querySelector('#so-bubble'); el.back = root.querySelector('#so-back');
      render();
      el.bubble.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-k]') : null; if (!t) return; var k = t.getAttribute('data-k'), o = curHelp;
        if (k === 'tip' && o) showTip(o); else if (k === 'off') { st.off = true; save(); applyOff(); } else if (k === 'quiet') { st.quiet = !st.quiet; save(); closeBubble(); mood('happy', 1200); } else closeBubble();
      });
      el.back.addEventListener('click', function () { st.off = false; save(); applyOff(); API.help(); });
      // Ziehen, Tippen, Kitzeln
      var d = null, n = el.node;
      n.addEventListener('dragstart', function (e) { e.preventDefault(); });
      n.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') e.preventDefault(); d = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false, flips: [] }; try { n.setPointerCapture(e.pointerId); } catch (x) {} });
      n.addEventListener('pointermove', function (e) {
        if (!d) return; var dx = e.clientX - d.sx, dy = e.clientY - d.sy;
        if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) { d.moved = true; dragging = true; n.classList.add('dragging'); mood('excited', 1500); d.lx = e.clientX; }
        if (d.moved) {
          var c = clamp(d.ox + dx, d.oy + dy); tgt.x = c.x; tgt.y = c.y; lastAct = Date.now();
          var dd = e.clientX - d.lx; if (Math.abs(dd) > 7) { var dir = dd > 0 ? 1 : -1, now = Date.now(); if (d.dir && dir !== d.dir) { d.flips.push(now); d.flips = d.flips.filter(function (t) { return now - t < 1500; }); if (d.flips.length >= 5) { d.flips = []; say(rnd(DIZZY[cfg.skin]), 'oops'); } } d.dir = dir; d.lx = e.clientX; }
        }
      });
      n.addEventListener('pointerup', function () {
        if (!d) return; var m = d.moved; d = null; dragging = false; n.classList.remove('dragging'); if (m) { savePos(); return; }
        var now = Date.now(); taps.push(now); taps = taps.filter(function (t) { return now - t < 2500; });
        if (taps.length >= 4) { taps = []; say(rnd(TICKLE[cfg.skin]), 'giggle'); hop(); return; }
        if (cfg.onTap) { cfg.onTap(); mood('excited', 1500); hop(); return; }
        if (bubbleOpen) closeBubble(); else API.help();
      });
      n.addEventListener('pointercancel', function () { d = null; dragging = false; n.classList.remove('dragging'); });
      n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (cfg.onTap) cfg.onTap(); else bubbleOpen ? closeBubble() : API.help(); } });
      document.addEventListener('pointermove', function (e) {
        if (st.off) return; var r = n.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .45, dx = e.clientX - cx, dy = e.clientY - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, L / 160) * 3;
        el.eyeT = 'translate(' + (dx / L * m).toFixed(2) + 'px,' + (dy / L * m).toFixed(2) + 'px)'; applyEyesNow(); lastPtr = Date.now();
      }, { passive: true });
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, activity, { passive: true, capture: true }); });
      var lastMove = 0; document.addEventListener('pointermove', function () { var t = Date.now(); if (t - lastMove > 400) { lastMove = t; activity(); } }, { passive: true });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bubbleOpen) closeBubble(); });
      function reposition() { var sp = null; try { sp = JSON.parse(sessionStorage.getItem('solo-pos-' + cfg.id) || 'null'); } catch (e) {} if (sp && isFinite(sp.fx)) setTarget(sp.fx * vw(), sp.fy * vh()); else { var h = home(); tgt.x = h.x; tgt.y = h.y; } }
      window.addEventListener('resize', function () { reposition(); });
      reposition(); pos.x = tgt.x; pos.y = vh() + 100; if (!isFinite(pos.x)) pos.x = 14;
      API.ready = true; applyOff(); requestAnimationFrame(loop); setInterval(tick, 1000); setInterval(micro, 9000 + Math.random() * 4000); wander(); breakCheck(); setInterval(breakCheck, 30000);
      nextRemark = 45 + Math.random() * 25; setTimeout(function () { hop(); }, 900);
      if (cfg.intro) setTimeout(function () { if (!bubbleOpen) say(cfg.intro, 'excited', 8000); }, 2400);
    },
    say: say,
    tell: function (text, m, ms) { if (!el.root || st.off) return false; lastAct = Date.now(); if (st.quiet) { mood(m || 'happy', 2400); return false; } return say(text, m, ms); },
    react: function (m, text) { if (!el.root || st.off) return; lastAct = Date.now(); if (text && !bubbleOpen && !st.quiet) say(text, m); else mood(m, 2600); },
    mood: function (m, ms) { if (el.root) mood(m, ms); },
    refresh: function () { if (el.root) render(); },
    help: function () { var o = cfg.help ? cfg.help() : null; if (!o) { say('Hallo, ich bin ' + sk().name + '!', 'happy'); return; } showAsk(o); },
    close: function () { if (el.root) closeBubble(); },
    isOpen: function () { return bubbleOpen; }
  };
  window.Solo = API;
})();
