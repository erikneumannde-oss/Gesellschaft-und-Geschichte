/*
  Tinto & Rolli für Navigationsseiten (Startseite, Bereichsseiten, Pinnwände).
  Einbinden:  <script src=".../maskottchen/duo-auto.js"></script>
  Erkennt anhand des Pfades, wo der Schüler gerade ist, begrüßt ihn auf der Startseite bei jedem Besuch
  und erklärt beim ersten Besuch pro Sitzung, was es hier gibt.
*/
(function () {
  'use strict';
  var me = document.currentScript;
  if (!me || !me.src) return;
  var base = me.src.replace(/duo-auto\.js.*$/, '');                // …/maskottchen/
  var root = base.replace(/maskottchen\/$/, '');                    // Wurzel der Seite
  var rel = decodeURIComponent(location.href.replace(/[?#].*$/, '').slice(root.length)).replace(/index\.html$/, '');
  var isRoot = rel === '';

  function run() {
    var h1 = document.querySelector('.paper h1'), title = h1 ? h1.textContent.trim() : (document.title || '').trim();
    function clean(t) { return (t || '').replace(/­/g, '').replace(/\s+/g, ' ').trim(); }
    function names(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' und ' + l[l.length - 1]; }
    function explain() {
      if (isRoot) return 'Das ist eure Pinnwand für Gesellschaft und Geschichte. Hier gibt es Lernmodule zu Geschichte und Politischer Bildung und praktische Werkzeuge. Tippt einen Zettel an, um zu starten.';
      var notes = [].slice.call(document.querySelectorAll('a.note')).filter(function (n) { return !n.hidden && n.offsetParent !== null; });
      if (!notes.length) return 'Das ist die Pinnwand zu „' + title + '“. Hier hängt noch nichts. Schau später wieder vorbei!';
      var t = notes.map(function (n) { var b = n.querySelector('b'); return clean(b ? b.textContent : n.textContent); }).filter(Boolean);
      var shown = t.slice(0, 4), more = t.length > 4 ? ' und ' + (t.length - 4) + ' weitere' : '';
      return 'Das ist die Pinnwand zu „' + title + '“. Hier ' + (notes.length === 1 ? 'hängt ein Zettel: ' : 'hängen ' + notes.length + ' Zettel: ') + (more ? shown.join(', ') + more : names(shown)) + '. Das Etikett auf dem Zettel verrät dir, ob es ein Lernmodul, ein Werkzeug oder etwas anderes ist.';
    }
    var tip = isRoot ? 'Tippe auf einen Zettel an der Pinnwand: Geschichte, Politische Bildung oder Verschiedenes.' : 'Die Zettel führen zu Lernmodulen und Werkzeugen. Tippe einen an. Mit dem Link oben kommst du eine Ebene zurück.';
    var help = { get text() { return explain(); }, tip: tip };
    var comments = isRoot ? [
      'Such dir einen Zettel aus. Alle Wege führen zu Geschichten!',
      'Ob Geschichte oder Politik: Mit Neugier kommt man überall weiter.',
      'Wir wohnen hier auf der Pinnwand. Die Aussicht ist super!'
    ] : [
      title ? 'Du bist gerade bei „' + title + '“. Such dir einen Zettel aus!' : 'Such dir einen Zettel aus!',
      'Wenn an der Pinnwand noch nichts hängt: Hier kommt bald etwas dazu.',
      'Pinnwände sind wie Notizbücher, nur mit Reißzwecken.'
    ];
    Duo.init({ id: 'site', offsetBottom: 56, tapHelp: function () { return help; }, comments: comments });

    var key = 'tr-expl-' + rel, seen = false;
    try { seen = !!sessionStorage.getItem(key); } catch (e) {}
    function mark() { try { sessionStorage.setItem(key, '1'); } catch (e) {} }
    if (isRoot) {
      setTimeout(function () { Duo.greetHome({ hint: seen ? 'Tippe einen Zettel an, um loszulegen.' : explain() }); mark(); }, 2300);
    } else if (!seen) {
      var tries = 0;
      setTimeout(function go() { if (Duo.say(explain(), 'interested', 'R')) mark(); else if (++tries < 5) setTimeout(go, 6000); }, 2400);
    }
  }
  function start() { if (window.Duo) return run(); var s = document.createElement('script'); s.src = base + 'duo.js'; s.onload = run; document.head.appendChild(s); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
