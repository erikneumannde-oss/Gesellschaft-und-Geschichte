/*
  Wort erklären: gemeinsame Wörterbuch-Funktion für die Assistenten in den Lernmodulen (Tinto und Rolli, Erdi, Herr Neumann).
  Die Schüler tippen den Assistenten an, wählen „Wort erklären“ und markieren ein Wort. Erklärt werden nur Wörter
  aus den freigegebenen Wörterbüchern (maskottchen/glossare/…). Es wird nichts gespeichert, gesendet oder von außen geladen.

  Wörterbuch-Einträge:  Woerter.glossar({ 'Hauptwort|Nebenform|Mehrzahl': 'Erklärung' });
  Abfrage:              Woerter.watch(function (treffer, markierung) { … });   Woerter.stop();
  Umsetzung: Erik Neumann mit Hilfe von Claude
*/
(function () {
  'use strict';
  if (window.Woerter) return;
  var G = {}, IDX = null, cb = null, timer = null, ptrDown = false;
  function fold(s) { return String(s).toLowerCase().replace(/[­​]/g, '').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[„“"'’‚‘.,;:!?()\[\]+−\-–…]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function stem(w) { var r = w; for (var i = 0; i < 2; i++) { var m = r.match(/^(.{4,}?)(ern|en|er|es|em|e|n|s|t|te|st)$/); if (!m) break; r = m[1]; } return r; }
  function build() {
    IDX = { exact: {}, stem: {}, list: [] };
    Object.keys(G).forEach(function (k) {
      var names = k.split('|'), e = { word: names[0], text: G[k] };
      names.forEach(function (nm) { var f = fold(nm); if (!f) return; IDX.exact[f] = IDX.exact[f] || e; var st = stem(f); IDX.stem[st] = IDX.stem[st] || e; IDX.list.push({ f: f, e: e }); });
    });
  }
  function one(w) { var f = fold(w); return IDX.exact[f] || IDX.stem[stem(f)] || null; }
  function lookup(sel) {
    if (!IDX) build();
    var f = fold(sel); if (f.length < 2) return null;
    var hit = one(sel); if (hit) return [hit];
    var words = sel.split(/[\s­]+/).filter(function (x) { return fold(x).length >= 3; }), multi = sel.trim().split(/\s+/).length > 1, out = [], seen = {};
    if (words.length > 1 || multi) {
      IDX.list.slice().sort(function (a, b) { return b.f.length - a.f.length; }).forEach(function (x) { if (x.f.indexOf(' ') > 0 && f.indexOf(x.f) >= 0 && !seen[x.e.word]) { seen[x.e.word] = 1; out.push(x.e); } });
      words.forEach(function (w) { var h = one(w); if (h && !seen[h.word]) { seen[h.word] = 1; out.push(h); } });
      return out.length ? out.slice(0, 3) : null;
    }
    // Bindestrich-Wörter: Teile einzeln
    if (/-/.test(sel)) { sel.split('-').forEach(function (w) { var h = fold(w).length >= 3 ? one(w) : null; if (h && !seen[h.word]) { seen[h.word] = 1; out.push(h); } }); if (out.length) return out.slice(0, 3); }
    // Zusammengesetztes Wort: letzten Wortteil im Wörterbuch suchen
    var best = null; IDX.list.forEach(function (x) { if (x.f.length >= 4 && f.length > x.f.length + 1 && (f.slice(-x.f.length) === x.f || stem(f).slice(-x.f.length) === x.f) && (!best || x.f.length > best.f.length)) best = x; });
    return best ? [{ word: sel.trim(), text: 'Das ist ein zusammengesetztes Wort. Der letzte Teil sagt, worum es geht: ' + best.e.word + '. ' + best.e.text, compound: true }] : null;
  }
  function check() {
    clearTimeout(timer); if (!cb || ptrDown) return;
    timer = setTimeout(function () {
      if (!cb || ptrDown) return;
      var s = window.getSelection && String(window.getSelection() || '').trim(); if (!s || s.length > 60) return;
      var f = cb; cb = null; selectable(false); f(lookup(s), s);
    }, 1300);
  }
  // Manche Module verbieten das Markieren (user-select: none). Solange „Wort erklären“ aktiv ist, wird es erlaubt.
  var css = null;
  function selectable(on) {
    if (!css) { css = document.createElement('style'); css.textContent = 'html.wb-wort,html.wb-wort body,html.wb-wort body *:not(button):not(input):not(textarea):not(select){-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}'; document.head.appendChild(css); }
    document.documentElement.classList.toggle('wb-wort', !!on);
  }
  function ptr(d) { return function () { ptrDown = d; if (!d) check(); }; }
  ['touchstart', 'mousedown'].forEach(function (e) { document.addEventListener(e, ptr(true), { passive: true }); });
  ['touchend', 'touchcancel', 'mouseup'].forEach(function (e) { document.addEventListener(e, ptr(false), { passive: true }); });
  document.addEventListener('selectionchange', check);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  window.Woerter = {
    glossar: function (g) { Object.keys(g || {}).forEach(function (k) { G[k] = g[k]; }); IDX = null; },
    count: function () { return Object.keys(G).length; },
    all: function () { var o = {}; Object.keys(G).forEach(function (k) { o[k] = G[k]; }); return o; },
    lookup: lookup,
    watch: function (f) { cb = f; selectable(true); },
    stop: function () { cb = null; clearTimeout(timer); selectable(false); },
    active: function () { return !!cb; },
    // fertiger Sprechblasen-Text (HTML) für einen Treffer
    html: function (res, sel) {
      if (res) return res.map(function (e) { return '<b>' + esc(e.word) + '</b><br>' + esc(e.text); }).join('<br><br>');
      return 'Zu „' + esc(sel.length > 30 ? sel.slice(0, 30) + '…' : sel) + '“ habe ich keine Erklärung vorbereitet. Frag am besten deine Lehrkraft oder schlage es nach.';
    },
    ASK: '<b>Markiere das Wort</b>, das ich erklären soll. Ziehe dazu mit dem Finger oder der Maus darüber.'
  };
})();
