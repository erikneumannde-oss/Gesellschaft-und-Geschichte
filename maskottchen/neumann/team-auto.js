/*
  Herr Neumann und Lily auf den Navigationsseiten (Startseite, Bereichsseiten, Pinnwände) ab Klasse 9.
  Wird von maskottchen/duo-auto.js geladen; in Klasse 7 und 8 bleiben Tinto und Rolli zuständig.

  Wer hilft wo:
    Alle Übersichtsseiten (Startseite, Bereichs-, Klassen- und Semesterseiten)   Herr Neumann und Lily gemeinsam
    In den Modulen: Klasse 7/8 Tinto und Rolli, Klasse 9 Lily, Klasse 10 Herr Neumann, Oberstufe Geschichte Herr Neumann (Q2 mit Lily), Oberstufe Politik Lily

  Beim allerersten Besuch der Startseite stellen sich Herr Neumann und Lily vor. Danach kommen Tinto und Rolli, Erdi und Marko
  kurz vorbei, stellen sich vor und verabschieden sich wieder. Die Vorstellung lässt sich auf jeder Seite über das Menü wiederholen.
  Gespeichert wird nur im Browser, ob die Vorstellung schon gezeigt wurde. Es wird nichts von externen Adressen geladen.
  Umsetzung: Erik Neumann mit Hilfe von Claude
*/
(function () {
  'use strict';
  var me = document.currentScript;
  if (!me || !me.src) return;
  var V = '20261122e';
  var base = me.src.replace(/team-auto\.js.*$/, '');                       // …/maskottchen/neumann/
  var mBase = base.replace(/neumann\/$/, '');                               // …/maskottchen/
  var root = mBase.replace(/maskottchen\/$/, '');                           // Wurzel der Seite
  var rel = decodeURIComponent(location.href.replace(/[?#].*$/, '').slice(root.length)).replace(/index\.html$/, '');
  if (rel.normalize) rel = rel.normalize('NFC');
  var isRoot = rel === '';
  var SEEN = 'gg-team-vorstellung';

  // ------------------------------------------------------------------ Wer ist auf dieser Seite?
  function cast() { return 'NL'; }              // auf allen Übersichtsseiten: Herr Neumann und Lily gemeinsam
  var CAST = cast();

  // ------------------------------------------------------------------ Texte für die Pinnwand
  var h1 = null, title = '';
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
  function tip() { return isRoot ? 'Tippe auf einen Zettel an der Pinnwand: Geschichte, Politische Bildung oder Verschiedenes.' : 'Die Zettel führen zu Lernmodulen und Werkzeugen. Tippe einen an. Mit dem Link oben kommst du eine Ebene zurück.'; }

  var COMMENTS = {
    neumann: ['Such dir in Ruhe einen Zettel aus. Ich bin hier, falls du Fragen hast.', 'Geschichte ist spannender, als viele denken. Versprochen.', 'Wenn du nicht weißt, wo du anfangen sollst: Fang einfach irgendwo an.'],
    lily: ['Na, wofür entscheidest du dich? Eine gute Entscheidung braucht gute Gründe.', 'Wer sich auskennt, kann mitreden. Such dir einen Zettel aus!', 'Ich bin gespannt, was du heute lernst.']
  };

  // ------------------------------------------------------------------ Skripte laden
  function load(list, cb) {
    (function next(i) {
      if (i >= list.length) return cb();
      var f = list[i];
      if (f.test && f.test()) return next(i + 1);
      var s = document.createElement('script'); s.src = f.src + '?v=' + V; s.onload = s.onerror = function () { next(i + 1); }; document.head.appendChild(s);
    })(0);
  }
  var LIB = {
    kolbi: { src: base + 'kolbi.js', test: function () { return !!window.Kolbi; } },
    kolbiB: { src: base + 'kolbi-b.js', test: function () { return !!window.KolbiB; } },
    neumann: { src: base + 'skin-neumann.js', test: function () { return !!(window.KolbiSkins && window.KolbiSkins.neumann); } },
    lily: { src: base + 'skin-lily.js', test: function () { return !!(window.KolbiSkins && window.KolbiSkins.lily); } },
    begleiter: { src: base + 'neumann-begleiter.js', test: function () { return !!window.Begleiter2; } },
    duo: { src: mBase + 'duo.js', test: function () { return !!window.Duo; } },
    solo: { src: mBase + 'solo.js', test: function () { return !!window.Solo; } }
  };

  // ------------------------------------------------------------------ Gastauftritte (laufen kurz rein und wieder raus)
  var actorCss = false;
  function actorStyle() {
    if (actorCss) return; actorCss = true;
    var st = document.createElement('style');
    st.textContent = '.ti-actor{position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom,0px));z-index:2147482000;display:flex;gap:6px;align-items:flex-end;pointer-events:none;transform:translateX(60vw);opacity:0}' +
      '.ti-actor.in{animation:tiin .9s cubic-bezier(.2,1.2,.4,1) forwards}.ti-actor.out{animation:tiout .8s ease-in forwards}' +
      '.ti-fig{display:block;width:74px;transform-origin:50% 100%}.ti-fig svg{display:block;width:100%;height:auto;overflow:visible}.ti-actor.in .ti-fig{animation:tihop .5s ease-out .6s 1}.ti-fig.talk{animation:tiwave .6s ease-in-out 2}' +
      '.ti-bub{position:absolute;left:50%;bottom:calc(100% + 10px);width:250px;max-width:calc(100vw - 30px);transform:translateX(-50%) translateY(6px);background:#fffbe6;color:#1f2937;border:1px solid #d6cfa8;border-radius:16px;padding:10px 14px 12px;font:14px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 8px 26px rgba(0,0,0,.28);pointer-events:auto;opacity:0;transition:opacity .25s,transform .25s}' +
      '.ti-bub.on{opacity:1;transform:translateX(-50%)}.ti-bub:after{content:"";position:absolute;left:calc(50% - 7px);bottom:-8px;width:14px;height:14px;background:#fffbe6;border-right:1px solid #d6cfa8;border-bottom:1px solid #d6cfa8;transform:rotate(45deg)}' +
      '.ti-who{display:block;font-weight:700;font-size:12.5px;color:#6b4f2a;margin-bottom:2px}.ti-hint{display:block;margin-top:6px;font-size:11.5px;color:#6b7280}' +
      '.ti-bub button{display:block;margin:8px 0 -4px auto;background:none;border:0;color:#4b5563;font-size:12px;text-decoration:underline;cursor:pointer;padding:2px 0}' +
      '@keyframes tiin{from{transform:translateX(60vw);opacity:0}to{transform:translateX(-50%);opacity:1}}@keyframes tiout{from{transform:translateX(-50%);opacity:1}to{transform:translateX(60vw);opacity:0}}' +
      '@keyframes tihop{0%,100%{transform:none}40%{transform:translateY(-16px)}}@keyframes tiwave{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}' +
      '@media (prefers-reduced-motion:reduce){.ti-actor.in,.ti-actor.out{animation-duration:.01s}.ti-fig{animation:none!important}}';
    document.head.appendChild(st);
  }
  function skinSvg(k, m) {
    var sk = window.KolbiSkins && window.KolbiSkins[k]; if (!sk) return '';
    var s = String(sk.svg(sk.color)); try { s = s.replace(/<g id="kk-face">[\s\S]*<\/g><\/svg>$/, '<g id="kk-face">' + sk.face(m || 'happy') + '</g></svg>'); } catch (e) {}
    return s.replace(/id="kk-/g, 'id="ti-kk-').replace(/id="kolbi-/g, 'id="ti-kolbi-');
  }
  var GUESTS = {
    TR: { figs: function () { return [window.Duo && Duo.figure('T', 'excited'), window.Duo && Duo.figure('R', 'happy')]; }, w: [74, 74], lines: [
      [0, 'Tinto', 'Hallo! Ich bin Tinto, das Tintenfass. 🖋️'],
      [1, 'Rolli', 'Und ich bin Rolli, die Schriftrolle! 📜'],
      [0, 'Tinto', 'Wir zwei helfen dir in Klasse 7 und 8, in Geschichte und in Politik. Wir erklären dir die Lernmodule und geben dir Tipps.'],
      [1, 'Rolli', 'Tipp uns einfach an, wenn du nicht weiterkommst. Bis bald!']] },
    E: { figs: function () { return [window.Solo && Solo.figure('erdi', 'excited')]; }, w: [86], lines: [
      [0, 'Erdi', 'Hallo, ich bin Erdi, die Erde! 🌍'],
      [0, 'Erdi', 'Mich triffst du im Lernmodul zum ökologischen Fußabdruck in Klasse 7. Dort finden wir zusammen heraus, wie viel Platz auf mir dein Alltag braucht.'],
      [0, 'Erdi', 'Pass gut auf mich auf. Tschüss!']] },
    M: { figs: function () { return [window.Solo && Solo.figure('marko', 'excited')]; }, w: [70], lines: [
      [0, 'Marko', 'Hi, ich bin Marko, der Markierstift! 🖍️'],
      [0, 'Marko', 'Ich wohne im Textmarkierer unter „Verschiedenes“. Dort markierst du mit mir die wichtigen Stellen in einem Text, Farbe für Farbe.'],
      [0, 'Marko', 'Bis zum nächsten Text. Tschüss!']] },
    N: { figs: function () { return [skinSvg('neumann', 'excited')]; }, w: [78], lines: [
      [0, 'Herr Neumann', 'Hallo, ich bin Herr Neumann! 👓 Ich bin Historiker und Chemiker und unterrichte euch in Geschichte und Politik.'],
      [0, 'Herr Neumann', 'Ich helfe dir in Klasse 10, in der Oberstufe in Geschichte und zusammen mit Lily auf den Übersichtsseiten. Bis bald!']] },
    L: { figs: function () { return [skinSvg('lily', 'excited')]; }, w: [74], lines: [
      [0, 'Lily', 'Guten Tag! Ich bin Lily, eine kleine Ausgabe von Lily Braun, nach der eure Schule heißt. 📖'],
      [0, 'Lily', 'Ich helfe dir in Klasse 9, in der Oberstufe in Politik und zusammen mit Herrn Neumann auf den Übersichtsseiten. Bis bald!']] }
  };
  var abort = function () {};
  function guest(key, done) {
    var G = GUESTS[key], figs = (G && G.figs()) || [];
    if (!figs.length || !figs[0]) return done();
    actorStyle();
    var el = document.createElement('div'); el.className = 'ti-actor'; el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="ti-bub"><span class="ti-who"></span><span class="ti-t"></span><span class="ti-hint"></span><button type="button" class="ti-skip">Vorstellung überspringen</button></div>' +
      figs.map(function (s, i) { return '<span class="ti-fig" style="width:' + (G.w[i] || 74) + 'px" aria-hidden="true">' + s + '</span>'; }).join('');
    document.body.appendChild(el);
    var bub = el.querySelector('.ti-bub'), who = el.querySelector('.ti-who'), txt = el.querySelector('.ti-t'), hint = el.querySelector('.ti-hint'), F = el.querySelectorAll('.ti-fig');
    var ended = false, idx = -1, ready = false, tm = null;
    function finish(skipped) {
      if (ended) return; ended = true; clearTimeout(tm);
      document.removeEventListener('click', onClick, true); document.removeEventListener('keydown', onKey, true);
      bub.classList.remove('on'); el.classList.remove('in'); void el.offsetWidth; el.classList.add('out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); if (!skipped) done(); }, 850);
    }
    function next() {
      if (ended || !ready) return;
      idx++; if (idx >= G.lines.length) return finish(false);
      var l = G.lines[idx]; who.textContent = l[1]; txt.textContent = l[2]; bub.classList.add('on');
      [].forEach.call(F, function (f, i) { f.classList.remove('talk'); if (i === l[0]) { void f.offsetWidth; f.classList.add('talk'); } });
      hint.textContent = idx === G.lines.length - 1 ? 'Tippen oder Enter: Tschüss' : 'Tippen oder Enter: weiter';
    }
    function onClick(e) {
      if (e.target.closest && e.target.closest('.ti-skip')) { e.preventDefault(); e.stopPropagation(); abort(); return; }
      e.preventDefault(); e.stopPropagation(); next();
    }
    function onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); next(); } }
    document.addEventListener('click', onClick, true); document.addEventListener('keydown', onKey, true);
    abort = function () { finish(true); endAll(); };
    el.classList.add('in');
    tm = setTimeout(function () { ready = true; next(); }, 950);
  }

  // ------------------------------------------------------------------ Vorstellung
  var run = 0, N = null, L = null;          // N, L: die Engines von Herrn Neumann und Lily (falls auf der Seite)
  function mark() { try { localStorage.setItem(SEEN, '1'); } catch (e) {} }
  function endAll() { run++; mark(); try { if (N) N.guideEnd(); } catch (e) {} try { if (L) L.guideEnd(); } catch (e) {} }
  function step(eng, o, next) {
    var mine = run;
    if (!eng) return next();
    eng.guide({ endLabel: 'Vorstellung beenden', html: o.h, btn: o.btn, mood: o.m || 'excited',
      onGo: function () { eng.guideEnd(); if (mine === run) next(); },
      onEnd: function () { eng.guideEnd(); endAll(); } });
  }
  function chain(list) { (function go(i) { if (i < list.length) list[i](function () { go(i + 1); }); })(0); }
  var ROLES = '<b>Damit du weißt, wer wo hilft:</b><br>Klasse 7 und 8: Tinto und Rolli<br>Klasse 9: Lily<br>Klasse 10: Herr Neumann<br>Oberstufe Geschichte: Herr Neumann, im 2. Semester zusammen mit Lily<br>Oberstufe Politik: Lily<br>Und hier auf den Übersichtsseiten sind wir beide für dich da.';
  var AVATAR = 'Übrigens: In zwei Modulen der 7. Klasse, „Was ist Globalisierung?“ und „Klimawandel“, triffst du mich auch. Dort bin ich aber eine Figur in der Geschichte und nicht deine Helferin. Helfen tun dir dort Tinto und Rolli.';
  function start() {
    run++; var mine = run;
    load([LIB.duo, LIB.solo, LIB.neumann, LIB.lily], function () {
      if (mine !== run) return;
      var steps = [];
      if (N) steps.push(function (nx) { step(N, { m: 'excited', h: '<b>Hallo, ich bin Herr Neumann!</b> Ich bin Historiker und Chemiker und unterrichte euch in Geschichte und Politik. Hier begleite ich dich durch die Lernmodule. Und ich bin nicht allein. Darf ich vorstellen?', btn: L ? 'Wer ist das?' : 'Gern!' }, nx); });
      else steps.push(function (nx) { guest('N', nx); });
      if (L) steps.push(function (nx) { step(L, { m: 'proud', h: '<b>Guten Tag! Ich bin Lily.</b> Eine kleine Ausgabe von Lily Braun, nach der eure Schule heißt. Vor über hundert Jahren habe ich dafür gestritten, dass Frauen mitreden dürfen. Heute helfe ich dir, gute Argumente zu finden und dir deine eigene Meinung zu bilden.<br><br>' + AVATAR, btn: 'Wer sind Tinto und Rolli?' }, nx); });
      else if (CAST === 'L-solo') steps.push(function (nx) { if (window.Kolbi && Kolbi.open) Kolbi.open('<p class="kb-text"><b>Guten Tag! Ich bin Lily.</b> Eine kleine Ausgabe von Lily Braun, nach der eure Schule heißt. ' + AVATAR.replace(/<[^>]+>/g, '') + '</p>', 9000, 'proud'); setTimeout(nx, 11000); });
      else steps.push(function (nx) { guest('L', nx); });
      steps.push(function (nx) { step(N || L, { m: 'happy', h: N ? 'Das zeigen sie dir am besten selbst. Zwei weitere Freunde kommen gleich mit. Sie laufen kurz vorbei.' : 'Das zeigen sie dir am besten selbst. Zwei weitere Freunde kommen gleich mit. Sie laufen kurz vorbei.', btn: 'Gern!' }, nx); });
      if (!window.__teamIntroOnly) steps.push(function (nx) { guest('TR', nx); });
      steps.push(function (nx) { guest('E', nx); });
      steps.push(function (nx) { guest('M', nx); });
      if (CAST === 'L-solo') steps.push(function (nx) { if (window.Kolbi && Kolbi.open) Kolbi.open('<p class="kb-text">' + ROLES + '<br><br>Viel Spaß beim Entdecken!</p>', 14000, 'happy'); mark(); nx(); });
      else if (window.__teamIntroOnly) steps.push(function (nx) { if (window.Duo && Duo.say) Duo.say(ROLES.replace(/<br>/g, ' ').replace(/<[^>]+>/g, '') + ' Viel Spaß beim Entdecken!', 'happy', 'T'); nx(); });
      else steps.push(function (nx) { step(L || N, { m: 'interested', h: ROLES, btn: 'Alles klar!' }, nx); });
      if (!window.__teamIntroOnly && CAST !== 'L-solo') steps.push(function (nx) { step(N || L, { m: 'excited', h: 'Wenn du Hilfe brauchst, tippe einen von uns an. Dann erklären wir dir, was es auf der Seite gibt. Viel Spaß beim Entdecken!', btn: 'Los geht’s!' }, function () { mark(); nx(); }); });
      chain(steps);
    });
  }
  window.TeamIntro = { start: start };
  if (window.__teamIntroOnly) return;      // nur die Vorstellung bereitstellen (Seiten, auf denen Tinto und Rolli helfen)

  // ------------------------------------------------------------------ Start auf der Seite
  function run0() {
    h1 = document.querySelector('.paper h1'); title = h1 ? clean(h1.textContent) : clean(document.title);
    var seite = { text: explain, tip: tip }, key = 'tr-expl-' + rel, seenS = false;
    try { seenS = !!sessionStorage.getItem(key); } catch (e) {}
    function markS() { try { sessionStorage.setItem(key, '1'); } catch (e) {} }

    if (CAST === 'L-solo') {                    // Klasse 9: Lily locker, wie Tinto und Rolli
      var stl = document.createElement('style'); stl.textContent = '#kolbi-char{scale:1.2;transform-origin:50% 100%}'; document.head.appendChild(stl);
      window.Kolbi.init({ id: 'lily-site', skin: window.KolbiSkins.lily, color: '#7a5c8e', offsetBottom: 56, extraOpts: [{ label: 'Unser Team vorstellen', fn: start }], tapHelp: function () { return { text: explain(), tip: tip() }; }, comments: COMMENTS.lily.concat(title ? ['Du bist gerade bei „' + title + '“. Such dir einen Zettel aus!'] : []) });
      if (!seenS) { var tries = 0; setTimeout(function go() { if (window.Kolbi.say(explain(), 'interested')) markS(); else if (++tries < 5) setTimeout(go, 6000); }, 2600); }
      return;
    }
    var hasN = CAST.indexOf('N') >= 0, hasL = CAST.indexOf('L') >= 0;
    if (hasN) { Begleiter.init({ mode: 'uebersicht', skin: 'neumann', id: 'site', offsetBottom: 56, comments: COMMENTS.neumann, seite: seite }); N = Begleiter.engine(); }
    if (hasL) {
      var B2 = hasN ? Begleiter2 : Begleiter;
      B2.init({ mode: 'uebersicht', skin: 'lily', id: 'site-lily', offsetBottom: 56, startAnchor: hasN ? 1 : 0, scale: 1.25, comments: COMMENTS.lily, seite: seite }); L = B2.engine();
    }
    var seenIntro = false; try { seenIntro = !!localStorage.getItem(SEEN); } catch (e) {}
    var host = N || L;
    if (isRoot && !seenIntro) { setTimeout(start, 1800); markS(); return; }
    if (!seenS && host) {
      var tr = 0;
      setTimeout(function go() {
        if (host.bubbleRect && host.bubbleRect()) { if (++tr < 5) setTimeout(go, 6000); return; }
        Begleiter.say((isRoot ? '<b>Schön, dass du wieder da bist!</b> ' : '') + explain(), 'interested', 12000); markS();
      }, 2400);
    }
  }
  var need = CAST === 'L-solo' ? [LIB.kolbi, LIB.lily] : [LIB.kolbi, LIB.kolbiB, LIB.neumann, LIB.lily, LIB.begleiter];
  function go() { load(need, run0); }
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();
