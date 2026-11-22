/*
  Herr Neumann als Lernbegleiter (Schicht über der Kolbi-Engine; Skin: skin-neumann.js)
  Idee: Dr. Benjamin Janzen · Umsetzung: Erik Neumann mit Hilfe von Claude

  Zwei Modi:
    'lernen'    Wiederholungs- und Arbeitenmodule. Ruhig, kein Zufallsgerede, keine Witze.
                Menü: Aufgabe erklären · Tipp · Wort erklären · Fakt (nur auf Wunsch) · Mut · Wie geht's?
                Emotionen folgen dem Verhalten (richtig, falsch, Durchklicken, lange Arbeit).
    'uebersicht' Übersichtsseiten und Pinnwände. Locker (Kolbi-Engine plaudert), Vorstellung von Hugo und Kolbi.

  Datenschutz: Alles läuft nur im Browser. Es wird nichts gespeichert, gesendet oder ausgewertet.
  Einzige Ausnahme: ein Merker, ob die Vorstellung schon einmal gezeigt wurde (localStorage).
  Es wird nichts von externen Adressen geladen.

  Einbindung im Modul:
    Begleiter.init({ mode:'lernen', glossar:{ 'Begriff':'Erklärung' }, aufgabe:'Text…', tipps:['Hinweis 1','Hinweis 2'] });
    Begleiter.richtig('frage-1');  Begleiter.falsch('frage-1');  Begleiter.fertig();
    Begleiter.setAufgabe(text, tipps);   // beim Wechsel der Aufgabe
*/
(function () {
  'use strict';
  // Fabrik: eine Begleiter-Schicht je Engine-Instanz (Kolbi = erste Figur, KolbiB = zweite Figur, z. B. Lily neben Herrn Neumann)
  function make(ENG, PFX) {
  var B = {}, Kolbi = null;
  var cfg = {}, SK = null, P = {};
  var q = {}, log = [], streakWrong = 0, streakOk = 0, curId = null, stage = 0;
  var lastWarn = 0, warns = 0, lastPraise = 0, checkins = 0, wordMode = false, wordTimer = null, factBag = [], niceBag = [];
  var t0 = Date.now(), lastCheck = Date.now(), asked = false;

  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bag(src, store) { if (!store.length) { store.push.apply(store, src.slice()); for (var i = store.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = store[i]; store[i] = store[j]; store[j] = t; } } return store.pop(); }
  function X() { return '<button class="kb-x" aria-label="Schließen" data-k="close">×</button>'; }
  function opt(k, label, dot) { return '<button class="kb-opt" data-nb="' + k + '"><span class="kb-dot"' + (dot ? ' style="background:' + dot + '"' : '') + '></span>' + esc(label) + '</button>'; }
  function say(html, m, ms) { if (Kolbi) Kolbi.open(html, ms || 0, m || 'happy'); }
  function busy() { return Kolbi && Kolbi.bubbleRect && Kolbi.bubbleRect(); }

  // ------------------------------------------------------------------ Menü
  function menu() {
    wordMode = false;
    var h = X() + '<p class="kb-text"><b>' + (cfg.mode === 'lernen' ? (P.help || 'Wobei kann ich dir helfen?') : (P.hello || 'Schön, dass du da bist!')) + '</b></p>';
    if (cfg.mode === 'lernen') {
      if (cfg.aufgabe) h += opt('aufgabe', 'Aufgabe erklären');
      if (cfg.tipps && cfg.tipps.length) h += opt('tipp', 'Tipp geben');
      if (cfg.glossar && Object.keys(cfg.glossar).length) h += opt('wort', 'Wort erklären');
      h += opt('fakt', 'Etwas Interessantes erzählen') + opt('mut', 'Ein freundliches Wort') + opt('checkin', 'Wie geht es mir gerade?');
    } else {
      if (cfg.seite) h += opt('seite', 'Was gibt es hier?');
      if (window.TeamIntro) h += opt('vorstellung', 'Unser Team vorstellen'); h += opt('fakt', 'Etwas Interessantes erzählen') + opt('mut', 'Ein freundliches Wort');
    }
    say(h, 'interested');
  }
  function back(extra) { return '<div style="margin-top:8px">' + (extra || '') + opt('menu', 'Zurück zum Menü', '#9ca3af') + '</div>'; }

  function aufgabe() { say(X() + '<p class="kb-text"><b>Das ist deine Aufgabe:</b></p><p class="kb-text">' + esc(cfg.aufgabe) + '</p>' + (cfg.hilfe ? '<p class="kb-text"><b>So gehst du vor:</b> ' + esc(cfg.hilfe) + '</p>' : '') + back(), 'interested'); }

  function seite() { var o = cfg.seite || {}; var t = typeof o.text === 'function' ? o.text() : o.text, tp = typeof o.tip === 'function' ? o.tip() : o.tip; say(X() + '<p class="kb-text">' + esc(t || '') + '</p>' + (tp ? '<p class="kb-text" style="font-size:13px;color:#4b5563">' + esc(tp) + '</p>' : '') + back(), 'interested'); }

  function tipp() {
    var t = cfg.tipps || []; if (!t.length) return;
    var i = Math.min(stage, t.length - 1), more = i < t.length - 1;
    say(X() + '<p class="kb-text"><b>Tipp ' + (i + 1) + ' von ' + t.length + '</b></p><p class="kb-text">' + esc(t[i]) + '</p>' +
      (more ? '<p class="kb-text" style="font-size:13px;color:#4b5563">Versuch es zuerst noch einmal allein. Wenn es nicht klappt, gibt es einen weiteren Hinweis.</p>' + opt('tipp', 'Noch ein Hinweis') : '') + back(), 'thinking');
    if (more) stage++;
  }

  function fakt() {
    var f = bag(SK.t.FACTS || [], factBag); if (!f) return;
    say(X() + '<p class="kb-text">' + esc(Array.isArray(f) ? f[0] : f) + '</p>' + (Array.isArray(f) && f[1] ? '<p class="kb-text" style="font-size:13px;color:#4b5563">' + esc(f[1]) + '</p>' : '') + back(opt('fakt', 'Noch etwas')), 'happy');
  }
  function mut() { var n = bag((SK.t.NICE || []).concat(SK.t.MOTIVATION || []), niceBag); say(X() + '<p class="kb-text">' + esc(Array.isArray(n) ? n[0] : n) + '</p>' + back(), 'love'); }

  // ------------------------------------------------------------------ Wort erklären (nur aus freigegebenen Wörterbüchern)
  // Einträge: 'Hauptwort|Nebenform|Mehrzahl': 'Erklärung'. Begleiter.glossar({...}) kann mehrfach aufgerufen werden (allgemein + Modul).
  var IDX = null;
  function fold(s) { return String(s).toLowerCase().replace(/[­​]/g, '').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[„“"'’.,;:!?()\[\]δ+−\-–]/g, '').replace(/\s+/g, ' ').trim(); }
  function stem(w) { var r = w; for (var i = 0; i < 2; i++) { var m = r.match(/^(.{4,}?)(ern|en|er|es|em|e|n|s|t|te|st)$/); if (!m) break; r = m[1]; } return r; }
  function build() {
    IDX = { exact: {}, stem: {}, list: [] };
    var g = cfg.glossar || {};
    Object.keys(g).forEach(function (k) {
      var names = k.split('|'), e = { word: names[0], text: g[k] };
      names.forEach(function (nm) { var f = fold(nm); if (!f) return; IDX.exact[f] = IDX.exact[f] || e; var st = stem(f); IDX.stem[st] = IDX.stem[st] || e; IDX.list.push({ f: f, e: e }); });
    });
  }
  function one(w) { var f = fold(w); return IDX.exact[f] || IDX.stem[stem(f)] || null; }
  // Römische Zahlen (I–XXXIX), z. B. bei den Hauptgruppen. Einzelne Buchstaben nur I, V, X (C, L, D, M sind meist Elemente bzw. Abkürzungen).
  function roman(sel) { return null;
    var t = String(sel).trim().replace(/\.$/, '');
    if (!/^[IVXL]+$/.test(t) || !/^(XXX|XX|X)?(IX|IV|V?I{0,3})$|^(XL)(IX|IV|V?I{0,3})$/.test(t)) return null;
    var v = { I: 1, V: 5, X: 10, L: 50 }, n = 0, i;
    for (i = 0; i < t.length; i++) { var a = v[t[i]], b = v[t[i + 1]] || 0; n += a < b ? -a : a; }
    if (n < 1 || n > 39) return null;
    var txt = 'Das ist die römische Zahl für ' + n + '. ';
    if (n <= 8) txt += 'In der Chemie nummeriert man die Hauptgruppen des Periodensystems römisch. Die ' + t + '. Hauptgruppe hat ' + n + ' Außenelektronen.';
    else txt += 'Römische Zahlen nutzen Buchstaben: I = 1, V = 5, X = 10, L = 50. Steht ein kleinerer Wert vor einem größeren, zieht man ihn ab (IV = 4, IX = 9). Sonst zählt man zusammen (VI = 6, XII = 12).';
    var out = [{ word: t + ' (römische Zahl)', text: txt }];
    if (t === 'I' && !/\.\s*$/.test(String(sel).trim()) && one('Iod')) out.push(one('Iod'));
    return out;
  }
  // ------------------------------------------------------------------ Elementsymbole
  var ELEM = {}; 'H:Wasserstoff:1:|He:Helium:2:VIII|Li:Lithium:3:I|Be:Beryllium:4:II|B:Bor:5:III|C:Kohlenstoff:6:IV|N:Stickstoff:7:V|O:Sauerstoff:8:VI|F:Fluor:9:VII|Ne:Neon:10:VIII|Na:Natrium:11:I|Mg:Magnesium:12:II|Al:Aluminium:13:III|Si:Silicium:14:IV|P:Phosphor:15:V|S:Schwefel:16:VI|Cl:Chlor:17:VII|Ar:Argon:18:VIII|K:Kalium:19:I|Ca:Calcium:20:II|Sc:Scandium:21:N|Ti:Titan:22:N|Cr:Chrom:24:N|Mn:Mangan:25:N|Fe:Eisen:26:N|Co:Cobalt:27:N|Ni:Nickel:28:N|Cu:Kupfer:29:N|Zn:Zink:30:N|Ga:Gallium:31:III|Ge:Germanium:32:IV|As:Arsen:33:V|Se:Selen:34:VI|Br:Brom:35:VII|Kr:Krypton:36:VIII|Rb:Rubidium:37:I|Sr:Strontium:38:II|Ag:Silber:47:N|Sn:Zinn:50:IV|I:Iod:53:VII|Xe:Xenon:54:VIII|Cs:Caesium:55:I|Ba:Barium:56:II|Pt:Platin:78:N|Au:Gold:79:N|Hg:Quecksilber:80:N|Pb:Blei:82:IV|U:Uran:92:N'.split('|').forEach(function (s) { var a = s.split(':'); ELEM[a[0]] = { n: a[1], z: a[2], g: a[3] }; });
  function elem(sel) { return null;
    var t = String(sel).trim(), ion = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻+\-−]+$/.test(t), b = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻+\-−]+$/, '');
    if (!ELEM.hasOwnProperty(b)) return null;
    var e = ELEM[b], grp = !e.g ? '' : (e.g === 'N' ? ' Es gehört zu den Nebengruppenelementen.' : ' Es steht in der ' + e.g + '. Hauptgruppe.');
    return { word: b + (ion ? ' (Ion)' : ''), text: b + ' ist das Elementsymbol für ' + e.n + ' (Ordnungszahl ' + e.z + ').' + grp + (ion ? ' Mit Ladungszeichen steht das Symbol für das geladene Teilchen, das Ion.' : '') };
  }
  function lookup(sel) {
    if (!IDX) build();
    var rn = roman(sel); if (rn) return rn;
    var ex = elem(sel), f = fold(sel), hit0 = f.length >= 2 ? one(sel) : null;
    if (ex && !hit0) return [ex];
    if (f.length < 2) return null;
    var hit = hit0; if (hit) return [hit];                           // ganzer Ausdruck oder einzelnes Wort (auch gebeugt)
    var words = sel.split(/[\s­]+/).filter(function (x) { return fold(x).length >= 3; }), multi = sel.trim().split(/\s+/).length > 1, out = [], seen = {};
    if (words.length > 1 || multi) {                                              // mehrere Wörter: längster passender Eintrag zuerst, dann einzelne Wörter
      IDX.list.slice().sort(function (a, b) { return b.f.length - a.f.length; }).forEach(function (x) { if (x.f.indexOf(' ') > 0 && f.indexOf(x.f) >= 0 && !seen[x.e.word]) { seen[x.e.word] = 1; out.push(x.e); } });
      words.forEach(function (w) { var h = one(w); if (h && !seen[h.word]) { seen[h.word] = 1; out.push(h); } });
      sel.split(/\s+/).forEach(function (w) { var rr = roman(w); if (rr && !seen[rr[0].word]) { seen[rr[0].word] = 1; out.unshift(rr[0]); } });
      return out.slice(0, 3).length ? out.slice(0, 3) : null;
    }
    // Zusammengesetztes Wort (z. B. Ölmoleküle): letzten Wortteil im Wörterbuch suchen
    var best = null; IDX.list.forEach(function (x) { if (x.f.length >= 4 && f.length > x.f.length + 1 && (f.slice(-x.f.length) === x.f || stem(f).slice(-x.f.length) === x.f) && (!best || x.f.length > best.f.length)) best = x; });
    return best ? [{ word: sel.trim(), text: 'Das ist ein zusammengesetztes Wort. Der letzte Teil sagt, worum es geht: ' + best.e.word + '. ' + best.e.text, compound: true }] : null;
  }
  B._lookup = function (w) { return lookup(w); };
  B.glossar = function (g) { cfg.glossar = cfg.glossar || {}; Object.keys(g).forEach(function (k) { cfg.glossar[k] = g[k]; }); IDX = null; };
  function wortModus() {
    wordMode = true;
    say(X() + '<p class="kb-text"><b>Markiere das Wort</b>, das ich erklären soll. Ziehe dazu mit dem Finger oder der Maus darüber.</p>' + opt('menu', 'Doch nicht', '#9ca3af'), 'interested');
  }
  // Erst auswerten, wenn der Finger bzw. die Maus losgelassen ist und sich die Markierung kurz nicht mehr ändert
  var ptrDown = false;
  function ptr(d) { return function () { ptrDown = d; if (!d) onSelect(); }; }
  ['touchstart', 'mousedown'].forEach(function (e) { document.addEventListener(e, ptr(true), { passive: true }); });
  ['touchend', 'touchcancel', 'mouseup'].forEach(function (e) { document.addEventListener(e, ptr(false), { passive: true }); });
  function onSelect() {
    if (!wordMode) return;
    clearTimeout(wordTimer);
    if (ptrDown) return;
    wordTimer = setTimeout(function () { if (ptrDown) return;
      var s = window.getSelection && String(window.getSelection() || '').trim(); if (!s || s.length > 60) return;
      var r = lookup(s);
      if (r) { say(X() + r.map(function (e) { return '<p class="kb-text" style="margin-bottom:6px"><b>' + esc(e.word) + '</b><br>' + esc(e.text) + '</p>'; }).join('') + back(opt('wort', 'Noch ein Wort')), 'interested'); wordMode = false; }
      else { say(X() + '<p class="kb-text">Zu „' + esc(s.length > 30 ? s.slice(0, 30) + '…' : s) + '“ habe ich keine Erklärung vorbereitet. Frag am besten deine Lehrkraft oder schlage es im Heft nach.</p>' + opt('wort', 'Anderes Wort probieren') + back(), 'oops'); wordMode = false; }
    }, 1300);
  }

  // ------------------------------------------------------------------ Wie geht es dir?
  function checkin() {
    say(X() + '<p class="kb-text"><b>' + rnd(['Kurze Zwischenfrage: Wie geht es dir gerade?', 'Na, wie fühlst du dich beim Lernen?', 'Ganz ehrlich: Wie läuft es bei dir?']) + '</b></p>' +
      opt('ci-gut', 'Gut, ich bin dabei', '#22c55e') + opt('ci-geht', 'Es geht so', '#f59e0b') + opt('ci-muede', 'Ich bin müde', '#60a5fa') + opt('ci-schwer', 'Ich komme nicht weiter', '#ef4444'), 'caring');
  }
  function checkinReply(k) {
    var R = {
      gut: ['Das freut mich! Dann nutze den Schwung.', 'happy', 'Super. Dann mach in deinem Tempo weiter. Ich bin da, falls du mich brauchst.'],
      geht: ['Das ist völlig in Ordnung.', 'caring', 'Nicht jeder Tag läuft rund. Mach es in kleinen Schritten, eine Aufgabe nach der anderen. Wenn du magst, gebe ich dir einen Tipp.'],
      muede: ['Dann gönn dir eine kurze Pause.', 'caring', 'Steh kurz auf, trink einen Schluck Wasser und schau einmal aus dem Fenster. Danach geht es meist besser. Ich warte hier.'],
      schwer: ['Das ist okay. Dafür bin ich da.', 'caring', 'Lies die Aufgabe noch einmal langsam und suche zuerst das, was du schon weißt. Wenn du magst, gebe ich dir einen Tipp.']
    }[k];
    if (!R) return;
    say(X() + '<p class="kb-text"><b>' + R[0] + '</b></p><p class="kb-text">' + R[2] + '</p>' + ((k === 'geht' || k === 'schwer') && cfg.tipps && cfg.tipps.length ? opt('tipp', 'Tipp geben') : '') + back(), R[1]);
  }

  // ------------------------------------------------------------------ Verhaltenssteuerung (nur im Browser, nichts wird gespeichert)
  function rec(id, ok) {
    var n = Date.now(), o = q[id] || (q[id] = { wrong: 0, t: n });
    log.push({ t: n, ok: ok, id: id }); if (log.length > 30) log.shift();
    return o;
  }
  function recent(ms, okVal) { var n = Date.now(); return log.filter(function (e) { return n - e.t <= ms && (okVal == null || e.ok === okVal); }); }

  B.falsch = function (id) {
    id = id || curId || 'x'; var o = rec(id, false); o.wrong++; streakWrong++; streakOk = 0;
    var fast = recent(12000, false).length >= 3, sameFast = recent(10000, false).filter(function (e) { return e.id === id; }).length >= 3, n = Date.now();
    if (cfg.mode !== 'lernen') return;
    if ((fast || sameFast) && n - lastWarn > 45000) {
      lastWarn = n; warns++;
      var W = P.warn || ['Moment mal. Du klickst gerade sehr schnell durch. Lies die Frage noch einmal in Ruhe, Raten bringt dich hier nicht weiter.', 'Ich sehe, dass du wieder durchklickst. So lernst du nichts, auch wenn am Ende „richtig“ dasteht. Atme kurz durch und lies die Aufgabe noch einmal.', 'Bitte nimm die Aufgabe ernst, mir zuliebe und dir zuliebe. Ich helfe dir gern, aber dafür musst du mir sagen, wo es hakt.'];
      var txt = W[Math.min(warns, W.length) - 1];
      say(X() + '<p class="kb-text"><b>' + esc(txt) + '</b></p>' + (cfg.tipps && cfg.tipps.length ? opt('tipp', 'Ich brauche einen Tipp') : '') + opt('close', 'Ich lese noch einmal'), 'serious');
    } else if (o.wrong === 2 && !busy()) {
      say(X() + '<p class="kb-text">Knifflig, oder? Lies die Frage noch einmal und überlege in Ruhe. Soll ich dir einen Tipp geben?</p>' + (cfg.tipps && cfg.tipps.length ? opt('tipp', 'Ja, bitte') : '') + opt('close', 'Ich probiere es allein'), 'caring');
    } else if (streakWrong === 5 && !busy()) {
      say(X() + '<p class="kb-text"><b>Das scheint gerade schwer zu sein.</b> Das ist nicht schlimm, so etwas passiert jedem. Magst du eine kurze Pause, oder soll ich dir helfen?</p>' + (cfg.tipps && cfg.tipps.length ? opt('tipp', 'Tipp geben') : '') + opt('checkin', 'Wie geht es mir gerade?') + opt('close', 'Es geht schon', '#9ca3af'), 'caring');
    } else if (!busy()) { Kolbi.mood('interested', 1800); }
  };

  B.richtig = function (id) {
    id = id || curId || 'x'; var o = rec(id, true), had = o.wrong || 0, n = Date.now(), guessed = recent(15000, false).length >= 3;
    streakOk++; var sw = streakWrong; streakWrong = 0; if (had === 0 && !guessed) stage = 0; if (cfg.mode !== 'lernen') return;
    if (guessed) { say(X() + '<p class="kb-text">' + (P.lucky || '<b>Richtig. Aber war das Zufall?</b> Schau dir noch einmal an, warum genau diese Antwort stimmt. Nur so bleibt es hängen.') + '</p>' + opt('close', 'Mache ich'), 'serious'); }
    else if (had >= 2 && n - lastPraise > 8000) { lastPraise = n; say(X() + '<p class="kb-text"><b>' + rnd(P.persist || ['Geschafft! Dranbleiben lohnt sich.', 'Da ist der Knoten geplatzt. Gut durchgehalten!', 'Siehst du? Du kannst das.']) + '</b></p>', 'proud', 5000); }
    else if (had === 0 && (streakOk === 3 || streakOk === 6 || streakOk === 10) && n - lastPraise > 8000) { lastPraise = n; say(X() + '<p class="kb-text"><b>' + (streakOk >= 6 ? 'Richtig stark, so konzentriert zu arbeiten!' : 'Drei hintereinander richtig. Das läuft!') + '</b></p>', 'excited', 4500); }
    else if (!busy()) { Kolbi.mood('happy', 1600); }
  };
  B.fertig = function () { say(X() + '<p class="kb-text">' + (P.done || '<b>Das war geschafft!</b> Du hast dir die Zeit genommen und mitgedacht. Gönn dir jetzt eine kleine Pause.') + '</p>' + back(), 'proud', 0); };
  B.tippNext = function () { var t = cfg.tipps || []; if (!t.length) return null; var n = Math.min(stage, t.length - 1) + 1; tipp(); return { shown: n, total: t.length }; };   // für Tipp-Knöpfe der Module: Tipp in der Sprechblase
  B.setAufgabe = function (text, tipps, id, hilfe) { cfg.aufgabe = text; cfg.hilfe = hilfe || ''; cfg.tipps = tipps || []; if (id !== curId) stage = 0; if (id) curId = id; };

  // ------------------------------------------------------------------ Vorstellung des Teams (Übersichtsseiten, siehe team-auto.js)
  var scaleCss = false;
  function scaleStyle() {
    if (scaleCss) return; scaleCss = true;
    var st = document.createElement('style');
    st.textContent = '#' + PFX + '-char{scale:var(--nbs-' + PFX + ',1.3);transform-origin:50% 100%}';
    document.head.appendChild(st);
  }
  B.vorstellung = function () { if (window.TeamIntro) window.TeamIntro.start(); };

  // ------------------------------------------------------------------ Start
  B.init = function (o) { scaleStyle(); document.documentElement.style.setProperty('--nbs-' + PFX, o && o.scale ? String(o.scale) : (o && o.mode === 'lernen' ? '1.12' : '1.3'));
    var g0 = cfg.glossar || {}; cfg = o || {}; cfg.glossar = cfg.glossar ? (function (a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; })(g0, cfg.glossar) : g0; IDX = null; cfg.mode = cfg.mode || 'lernen'; SK = window.KolbiSkins && window.KolbiSkins[cfg.skin || 'neumann']; Kolbi = window[ENG] || null; if (!SK || !Kolbi) return; P = (SK.t && SK.t.B) || {};
    Kolbi.init({
      id: cfg.id || SK.key, skin: SK, color: SK.color || '#5b7a6a', offsetBottom: cfg.offsetBottom == null ? 56 : cfg.offsetBottom, startAnchor: cfg.startAnchor || 0,
      intro: false,
      canTalk: function () { return cfg.mode === 'uebersicht'; },    // im Lernmodus kein Zufallsgerede
      tapHelp: function () { return null; }, comments: cfg.comments || ['Such dir aus, womit du anfangen möchtest.']
    });
    Kolbi.help = menu;      // Antippen öffnet das Menü
    var root = document.getElementById(PFX + '-bubble');
    if (root) root.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-nb]'); if (!t) return; var k = t.getAttribute('data-nb');
      if (k === 'menu') menu(); else if (k === 'aufgabe') aufgabe(); else if (k === 'tipp') tipp(); else if (k === 'wort') wortModus();
      else if (k === 'fakt') fakt(); else if (k === 'mut') mut(); else if (k === 'checkin') checkin(); else if (k === 'vorstellung') { Kolbi.hush(); B.vorstellung(); } else if (k === 'seite') seite();
      else if (k.indexOf('ci-') === 0) checkinReply(k.slice(3));
      else if (k === 'close') Kolbi.hush();
    });
    document.addEventListener('selectionchange', onSelect);
    if (cfg.mode === 'lernen') {
      setTimeout(function () { if (cfg.aufgabe && !busy()) aufgabe(); }, 1600);
      setInterval(function () {                          // freundliches Nachfragen nach längerer Arbeit
        var min = (Date.now() - lastCheck) / 60000;
        if (min >= 20 && checkins < 3 && !busy() && !document.hidden) { lastCheck = Date.now(); checkins++; checkin(); }
      }, 30000);
    }
  };
  B._checkinSoon = function () { lastCheck = 0; };      // nur zum Testen
  B.checkinNow = checkin;
  B.engine = function () { return Kolbi; };
  B.say = function (html, m, ms) { say(X() + '<p class="kb-text">' + html + '</p>', m, ms); };
  return B;
  }
  window.Begleiter = make('Kolbi', 'kolbi');
  window.Begleiter2 = make('KolbiB', 'kolbb');
})();
