/*
  Tinto & Rolli – das Maskottchen-Duo von „Gesellschaft und Geschichte“.
  Tinto (Tintenfass) begleitet die Arbeit: reagiert, lobt, motiviert.
  Rolli (Schriftrolle) liefert den Hintergrund: Fakten, Hilfe, Erklärungen.
  Beide sind unzertrennlich, frei beweglich und teilen sich eine Sprechblase.

  Einbinden:  <script src=".../maskottchen/duo.js"></script>
  Nutzen:     Duo.init({ id:'seite', tapHelp:fn, comments:[…] });
              Duo.say('Text','interested','R');   Duo.react('excited','Text','T');
              Duo.chat([{w:'T',t:'…',m:'happy'},{w:'R',t:'…'}]);

  Gespeichert wird nur im Browser der Schüler: „Duo aus“, „weniger reden“, „kennt sich schon“,
  „Tipp nicht mehr anzeigen“. Keine Auswertung, keine Datenübertragung.
*/
(function () {
  'use strict';
  var KEY = 'tinto-rolli-v1';
  var cfg = { id: 'seite', offsetBottom: 56, comments: [], tapHelp: null, intro: true, canTalk: null, idleHelp: null, introExtra: '' };
  var st = { off: false, mute: {}, met: false, quiet: false };
  var el = {}, CH = {}, order = ['T', 'R'];
  var pos = { x: 0, y: 0 }, side = 1;                       // pos = Position von Tinto (Anführer), side = auf welcher Seite Rolli steht
  var wanderT = null, quietUntil = 0, bubbleOpen = false, curAsk = null, shownIds = {}, queue = [], closeT = null, chatT = null, chatSeq = 0, introActive = false;
  var speaker = 'T', lastAct = Date.now(), nextRemark = 45, base = 'happy', wasSleeping = false, yawned = false, lastPtr = 0, taps = [], lastDizzy = 0, microT = null;

  function load() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); if (o && typeof o === 'object') { st.off = !!o.off; st.mute = o.mute || {}; st.met = !!o.met; st.quiet = !!o.quiet; } } catch (e) {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function other(w) { return w === 'T' ? 'R' : 'T'; }

  // ------------------------------------------------------------------ Texte
  var NICE = [   // Tinto
    'Du machst das richtig gut. Weiter so!',
    'Schön, dass du dir die Zeit nimmst. So lernt man am meisten.',
    'Mit dir macht Geschichte echt Spaß!',
    'Ich bin stolz auf dich. Und ich bin nur ein Tintenfass!',
    'Du hast ein gutes Auge für Zusammenhänge.',
    'Falls du es noch nicht gehört hast: Du bist klüger, als du denkst.'
  ];
  var MOTIVATION = [   // Tinto
    'Jeder große Text beginnt mit dem ersten Wort. Fang einfach an!',
    'Fehler sind wie Tintenkleckse: Man kann daraus noch etwas machen.',
    'Auch Historiker wissen nicht alles. Sie fragen nur besser.',
    'Wer Fragen stellt, ist schon auf dem richtigen Weg.',
    'Ein bisschen Geduld, dann fügt sich alles zu einem Bild zusammen.',
    'Mach dir Notizen. Was aufgeschrieben ist, geht nicht verloren!',
    'Du musst nicht alles sofort verstehen. Gründlich ist besser als schnell.'
  ];
  var FACTS = [   // Rolli
    'Wusstest du? „Demokratie“ kommt aus dem Griechischen: „demos“ heißt Volk, „kratos“ Herrschaft.',
    'Wusstest du? „Politik“ geht auf das griechische Wort „polis“ zurück, den Stadtstaat.',
    'Wusstest du? Die Magna Carta von 1215 gilt als einer der ersten Texte, die die Macht eines Königs schriftlich begrenzten.',
    'Wusstest du? Um 1450 erfand Johannes Gutenberg den Buchdruck mit beweglichen Lettern. Danach verbreitete sich Wissen viel schneller.',
    'Wusstest du? Das Grundgesetz trat am 23. Mai 1949 in Kraft. Artikel 1 beginnt mit: „Die Würde des Menschen ist unantastbar.“',
    'Wusstest du? Kant forderte in der Aufklärung: „Habe Mut, dich deines eigenen Verstandes zu bedienen!“',
    'Wusstest du? Pergament wurde aus Tierhaut gemacht. Papier kam im Mittelalter über die arabische Welt nach Europa.',
    'Wusstest du? Papyrus, das Schreibmaterial der alten Ägypter, wurde aus einer Pflanze hergestellt. Mich gibt es also in Gras-Ausführung auch!',
    'Wusstest du? In Deutschland dürfen Frauen seit 1918 wählen.',
    'Wusstest du? In der Frankfurter Paulskirche tagte 1848 die Nationalversammlung, ein Meilenstein auf dem Weg zur Demokratie.',
    'Wusstest du? Seit 2002 gibt es den Euro als Bargeld. Zahlen konnte man schon früher damit, aber nur auf dem Papier.',
    'Wusstest du? Mit dem Rosetta-Stein konnte man die Hieroglyphen entziffern. Er wurde 1799 gefunden.',
    'Wusstest du? Seit 1970 liegt das Wahlalter bei Bundestagswahlen bei 18 Jahren. Vorher waren es 21.'
  ];
  var JOKES = [   // Dialoge: Tinto fragt, Rolli antwortet (oder umgekehrt)
    [{ w: 'T', t: 'Rolli, warum bist du nie pünktlich?', m: 'interested' }, { w: 'R', t: 'Ich muss mich erst aufrollen.', m: 'giggle', fx: 'roll' }],
    [{ w: 'T', t: 'Warum schreibt man Verträge mit Tinte?', m: 'interested' }, { w: 'R', t: 'Damit man sie nicht einfach wegradieren kann. Bleistift gilt nicht!', m: 'excited' }],
    [{ w: 'T', t: 'Was passiert mit einem Antrag im Parlament?', m: 'thinking' }, { w: 'R', t: 'Er geht erst mal in den Ausschuss. Wie jeder gute Antrag.', m: 'wink' }],
    [{ w: 'T', t: 'Warum war die Aufklärung so hell?', m: 'interested' }, { w: 'R', t: 'Sie hat Licht ins Dunkel gebracht.', m: 'excited' }],
    [{ w: 'R', t: 'Tinto, was ist dein Lieblingsfach?', m: 'interested' }, { w: 'T', t: 'Geschichte! Da kann ich so schön alles aufschreiben. Und du, Rolli?', m: 'excited' }, { w: 'R', t: 'Auch Geschichte. Ich bin ja schon ein Stück davon.', m: 'wink' }],
    [{ w: 'T', t: 'Was haben Quellen und Zeugen gemeinsam?', m: 'thinking' }, { w: 'R', t: 'Man sollte beide fragen: Wer sagt das und warum?', m: 'excited' }],
    [{ w: 'T', t: 'Wie nennt man ein Parlament, in dem alle gleichzeitig reden?', m: 'thinking' }, { w: 'R', t: 'Eine Talkshow.', m: 'giggle' }],
    [{ w: 'R', t: 'Tinto, warum bist du so ruhig?', m: 'interested' }, { w: 'T', t: 'Ich sammle meine Gedanken. Die tropfen nur langsam.', m: 'hum' }]
  ];
  var GENERIC = [   // zufällige Bemerkungen
    'Neugier ist die halbe Geschichte.',
    'Fragen sind erlaubt. Sogar erwünscht!',
    'Hast du schon alle Ecken der Pinnwand entdeckt?',
    'Probier ruhig Dinge aus. Hier geht nichts kaputt!'
  ];
  var TICKLE = ['Hihi, das kitzelt! 😄', 'Hihihi! Hör auf, ich schwapp über!', 'Kitzeln verboten! … na gut, ein bisschen ist okay.'];
  var TICKLE_R = ['Hihi, nicht kitzeln, sonst rolle ich mich auf!', 'Huch, das kitzelt am Pergament!', 'Ha! Hör auf, ich lache mich noch zusammen!'];
  var DIZZY = ['Uff … mir wird ganz schwindelig!', 'Oh weh, ich schwappe überall hin. Das war ein Wirbelwind!', 'Langsam bitte, ich bin kein Schüttelbecher!'];
  var DIZZY_R = ['Mir dreht sich alles, ich rolle gleich weg!', 'Langsam, ich bin ein Pergament, kein Wimpel!'];
  var BREAK = ['Du lernst schon eine ganze Weile. Trink einen Schluck Wasser und streck dich kurz! 💧', 'Kleine Pause gefällig? Danach geht es mit frischem Kopf weiter.'];
  var BORED = [
    [{ w: 'T', t: 'Ähm … hallo? Ist da jemand?', m: 'bored' }],
    [{ w: 'R', t: 'Ich zähle mal meine Zeilen. Eine … zwei …', m: 'bored' }],
    [{ w: 'T', t: 'Ist hier gerade Pause? Ich schwenke einfach mal ein bisschen.', m: 'bored' }, { w: 'R', t: '*gähn* Ich hätte jetzt Lust auf eine gute Quelle.', m: 'bored' }]
  ];
  var WAKE = [
    [{ w: 'T', t: 'Oh! Wir sind kurz eingenickt. Schön, dass du wieder da bist!', m: 'excited' }, { w: 'R', t: 'Ich hab nur kurz die Augen zugemacht. Ehrlich.', m: 'wink' }],
    [{ w: 'R', t: 'Huch, da bist du ja wieder!', m: 'excited' }, { w: 'T', t: 'Wir haben schon fast Staub angesetzt.', m: 'happy' }]
  ];
  var INTRO = [
    ['T', 'Hallo! Ich bin Tinto 🖋️. Ich bin das Tintenfass und schreibe gern alles auf.'],
    ['R', 'Und ich bin Rolli 📜. Ich bin die Schriftrolle und weiß so einiges über früher. Wir sind unzertrennlich!']
  ];

  // ------------------------------------------------------------------ Gesicht (Stimmungen)
  var INK = '#2c2457', PINK = '#ff6b81';
  function dot(cx, cy, r, hl) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (cx + 1.5) + '" cy="' + (cy - 1.6) + '" r="' + (hl || 1.6) + '" fill="#fff"/>'; }
  function eyesOpen(r) { return '<g class="dc-lid">' + dot(41, 74, r || 4.6) + dot(61, 74, r || 4.6) + '</g>'; }
  // Koordinaten um den Gesichtsmittelpunkt (51,80); Arme kommen getrennt je nach Figur
  var MOODS = {
    happy: { pose: 'down', eyes: eyesOpen(), mouth: '<path d="M43 83 q8 9 16 0"/>' },
    excited: {
      pose: 'up', eyes: '<path d="M35 76 q6 -10 12 0"/><path d="M55 76 q6 -10 12 0"/>', mouth: '<path d="M42 81 q9 16 18 0 z" fill="' + PINK + '"/>',
      extra: '<g fill="#ffd35a" stroke="none"><polygon points="8,40 10,45 15,45 11,48 13,53 8,50 3,53 5,48 1,45 6,45"/><polygon points="94,34 96,39 101,39 97,42 99,47 94,44 89,47 91,42 87,39 92,39"/></g>'
    },
    interested: { pose: 'curious', eyes: '<g class="dc-lid">' + dot(41, 74, 5.8, 1.9) + dot(61, 74, 5.8, 1.9) + '</g>', brows: '<path d="M34 64 q6 -5 13 -1"/><path d="M55 63 q7 -4 13 1"/>', mouth: '<ellipse cx="51" cy="86" rx="2.6" ry="3" fill="#3b1d4a"/>' },
    thinking: {
      pose: 'think', eyes: '<g class="dc-lid"><circle cx="40" cy="72" r="4.6" fill="' + INK + '"/><circle cx="60" cy="72" r="4.6" fill="' + INK + '"/><circle cx="41.5" cy="70.4" r="1.6" fill="#fff"/><circle cx="61.5" cy="70.4" r="1.6" fill="#fff"/></g>',
      mouth: '<path d="M45 85 q6 -3 12 0"/>', extra: '<text x="82" y="24" font-size="26" font-weight="800" fill="#ffd35a" stroke="none">?</text>'
    },
    bored: {
      pose: 'down', eyes: '<path d="M36.4 75 a4.6 4.6 0 0 0 9.2 0 z" fill="' + INK + '" stroke="none"/><path d="M56.4 75 a4.6 4.6 0 0 0 9.2 0 z" fill="' + INK + '" stroke="none"/><path d="M35 75 h12"/><path d="M55 75 h12"/>',
      mouth: '<path d="M44 86 q3 -2 7 0 t7 0"/>'
    },
    yawn: { pose: 'yawn', eyes: '<path d="M36 75 q5 4 10 0"/><path d="M56 75 q5 4 10 0"/>', mouth: '<ellipse cx="51" cy="86" rx="5.5" ry="7.5" fill="#3b1d4a"/>' },
    sleep: {
      pose: 'down', eyes: '<path d="M36 75 q5 4 10 0"/><path d="M56 75 q5 4 10 0"/>', mouth: '<path d="M46 86 q5 3 10 0"/>',
      extra: '<g class="dc-zzz" fill="#cbd5f5" stroke="none" font-weight="800"><text x="80" y="38" font-size="15">Z</text><text x="90" y="24" font-size="11">z</text></g>'
    },
    wink: { pose: 'wave', eyes: '<g class="dc-lid">' + dot(41, 74, 4.6) + '</g><path d="M56 76 q5 -6 10 0"/>', mouth: '<path d="M42 83 q9 11 18 0"/>' },
    giggle: { pose: 'hug', eyes: '<path d="M35 76 q6 -10 12 0"/><path d="M55 76 q6 -10 12 0"/>', mouth: '<path d="M42 81 q9 16 18 0 z" fill="' + PINK + '"/>' },
    dizzy: {
      pose: 'out', eyes: '<path d="M37 70 l8 8 M45 70 l-8 8"/><path d="M57 70 l8 8 M65 70 l-8 8"/>', mouth: '<path d="M43 87 q4 -5 8 0 q4 5 8 0"/>',
      extra: '<g class="dc-zzz" fill="#ffd35a" stroke="none"><circle cx="30" cy="40" r="2.6"/><circle cx="72" cy="36" r="2.6"/><circle cx="51" cy="28" r="2.6"/></g>'
    },
    surprised: { pose: 'up2', eyes: '<g class="dc-lid">' + dot(41, 74, 6.2, 2.1) + dot(61, 74, 6.2, 2.1) + '</g>', brows: '<path d="M34 63 q6 -6 13 -2"/><path d="M55 61 q7 -4 13 2"/>', mouth: '<ellipse cx="51" cy="87" rx="3.4" ry="4.2" fill="#3b1d4a"/>' },
    love: {
      pose: 'down', eyes: '<path d="M41 80 c-8 -5 -8 -12 -2.5 -12 c2.3 0 2.5 2 2.5 3 c0 -1 .2 -3 2.5 -3 c5.5 0 5.5 7 -2.5 12z" fill="#ff4d6d" stroke="none"/><path d="M61 80 c-8 -5 -8 -12 -2.5 -12 c2.3 0 2.5 2 2.5 3 c0 -1 .2 -3 2.5 -3 c5.5 0 5.5 7 -2.5 12z" fill="#ff4d6d" stroke="none"/>',
      mouth: '<path d="M43 84 q8 9 16 0"/>', extra: '<g class="dc-zzz" fill="#ff8fa8" stroke="none" font-weight="800"><text x="82" y="34" font-size="14">♥</text><text x="6" y="44" font-size="10">♥</text></g>'
    },
    hum: { pose: 'down', eyes: eyesOpen(), mouth: '<path d="M44 84 q7 7 14 0"/>', extra: '<g class="dc-zzz" fill="#cbd5f5" stroke="none" font-weight="800"><text x="84" y="40" font-size="16">♪</text><text x="2" y="46" font-size="13">♫</text></g>' },
    oops: {
      pose: 'out', eyes: '<g class="dc-lid"><circle cx="41" cy="75" r="4" fill="' + INK + '"/><circle cx="61" cy="75" r="4" fill="' + INK + '"/></g>', brows: '<path d="M35 66 l10 3"/><path d="M67 66 l-10 3"/>',
      mouth: '<path d="M43 88 q4 -5 8 0 q4 5 8 0"/>', extra: '<path d="M78 58 q4 7 0 10 q-4 -3 0 -10z" fill="#7fd0ff" stroke="none"/>'
    }
  };
  // Armhaltungen: [Kontrollpunkt dx,dy, Endpunkt dx,dy] relativ zum Ansatz (links, rechts)
  var POSES = {
    down: [[-10, 6, -11, 16], [10, 6, 11, 16]],
    up: [[-12, -4, -14, -22], [12, -4, 14, -22]],
    up2: [[-12, -2, -16, -14], [12, -2, 16, -14]],
    wave: [[-10, 6, -11, 16], [10, -8, 9, -22]],
    curious: [[-10, 6, -11, 16], [8, -4, 6, -16]],
    think: [[-10, 6, -11, 16], [4, -6, -12, -18]],
    yawn: [[-4, -8, 8, -18], [4, -8, -8, -18]],
    hug: [[-2, 4, 10, -2], [2, 4, -10, -2]],
    out: [[-12, 0, -16, 6], [12, 0, 16, 6]]
  };
  function armPath(c, m, i) {
    var d = MOODS[m] || MOODS.happy, p = POSES[d.pose] || POSES.down, a = c.skin.arms[i], q = p[i];
    return '<path class="dc-arm ' + (i ? 'dc-armr' : 'dc-arml') + '" d="M' + a[0] + ' ' + a[1] + ' Q' + (a[0] + q[0]) + ' ' + (a[1] + q[1]) + ' ' + (a[0] + q[2]) + ' ' + (a[1] + q[3]) + '"/>';
  }
  function faceSVG(c, m) {
    var d = MOODS[m] || MOODS.happy, F = c.skin.face, S = 'stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
    return '<g ' + S + '>' + armPath(c, m, 0) + armPath(c, m, 1) + '</g>' +
      '<g transform="translate(' + F.cx + ' ' + F.cy + ') scale(' + F.s + ') translate(-51 -80)">' +
      '<g ' + S + '>' + (d.brows || '') + '</g><g class="dc-eyes" ' + S + '>' + d.eyes + '</g><g class="dc-mouth" ' + S + '>' + d.mouth + '</g>' +
      '<ellipse cx="33" cy="83" rx="5" ry="3.4" fill="#ff8fa8" opacity=".7"/><ellipse cx="69" cy="83" rx="5" ry="3.4" fill="#ff8fa8" opacity=".7"/>' + (d.extra || '') + '</g>';
  }

  // ------------------------------------------------------------------ Figuren
  var TINTO_BODY = 'M38 46 V52 C22 60 16 74 16 90 Q16 112 38 112 H72 Q94 112 94 90 C94 74 88 60 72 52 V46 Z';
  var SKINS = {
    T: {
      name: 'Tinto', emoji: '🖋️', color: '#3b5bdb', face: { cx: 55, cy: 86, s: 1 }, arms: [[18, 92], [92, 92]],
      svg: function () {
        return '<svg viewBox="-6 -6 122 130" role="img" aria-label="Tinto, das Tintenfass-Maskottchen"><defs><clipPath id="tt-c"><path d="' + TINTO_BODY + '"/></clipPath>' +
          '<linearGradient id="tt-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa4ff"/><stop offset="1" stop-color="#5a78e6"/></linearGradient></defs>' +
          '<path d="' + TINTO_BODY + '" fill="#fff" fill-opacity=".3"/>' +
          '<g clip-path="url(#tt-c)"><path id="tt-liq" d="M-6 66 H116 V125 H-6Z" fill="url(#tt-g)"/><path id="tt-surf" d="M-6 66 H116" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/>' +
          '<circle class="dc-bub b1" cx="34" cy="106" r="3" fill="#fff"/><circle class="dc-bub b2" cx="74" cy="100" r="2.2" fill="#fff"/><circle class="dc-bub b3" cx="60" cy="108" r="1.8" fill="#fff"/></g>' +
          '<path d="' + TINTO_BODY + '" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="33" y="40" width="44" height="9" rx="4.5" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-width="2.5"/>' +
          '<g id="tt-quill"><path d="M62 42 C66 26 78 12 98 2 C97 18 90 32 76 40 Z" fill="#fff8e6" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<path d="M64 40 C72 28 82 16 96 5" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/><path d="M70 36 l8 -2 M74 30 l8 -2 M79 24 l7 -3" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/></g>' +
          '<path d="M24 82 Q22 92 28 100" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/><g id="tt-face"></g></svg>';
      },
      phys: function (c, ph, tn, amp) {
        var d = '', y, x;
        for (x = -6; x <= 116; x += 6) { y = 66 + tn * (x - 55) + amp * Math.sin(x * 0.11 + ph.t * 7) * 0.6; y = Math.max(50, Math.min(120, y)); d += (d ? ' L' : 'M') + x + ' ' + y.toFixed(1); }
        var s = d; d += ' L116 125 L-6 125 Z';
        if (c.liq) c.liq.setAttribute('d', d); if (c.surf) c.surf.setAttribute('d', s);
        if (c.quill) c.quill.setAttribute('transform', 'rotate(' + (ph.th * -18).toFixed(2) + ' 62 42)');
      }
    },
    R: {
      name: 'Rolli', emoji: '📜', color: '#a0661c', face: { cx: 55, cy: 58, s: 1 }, arms: [[26, 66], [84, 66]],
      svg: function () {
        return '<svg viewBox="-6 -6 122 130" role="img" aria-label="Rolli, die Schriftrolle"><defs><linearGradient id="rr-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3dca6"/><stop offset=".5" stop-color="#fff0c4"/><stop offset="1" stop-color="#f0d596"/></linearGradient></defs><g id="rr-all">' +
          '<path id="rr-sheet" d="M26 26 H84 V96 H26Z" fill="url(#rr-g)" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
          '<g id="rr-top"><rect x="18" y="12" width="74" height="18" rx="9" fill="#f6e2ae" stroke="' + INK + '" stroke-width="2.6"/><ellipse cx="22" cy="21" rx="4.5" ry="7" fill="#e8c883" stroke="' + INK + '" stroke-width="2"/><rect x="8" y="14" width="10" height="14" rx="4" fill="#9a6a3c" stroke="' + INK + '" stroke-width="2"/></g>' +
          '<g id="rr-deco"><path d="M36 90 h18 M36 84 h26" stroke="#c9a85f" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
          '<g id="rr-bot"><rect x="18" y="92" width="74" height="18" rx="9" fill="#f6e2ae" stroke="' + INK + '" stroke-width="2.6"/><ellipse cx="88" cy="101" rx="4.5" ry="7" fill="#e8c883" stroke="' + INK + '" stroke-width="2"/><rect x="92" y="94" width="10" height="14" rx="4" fill="#9a6a3c" stroke="' + INK + '" stroke-width="2"/></g>' +
          '<path d="M74 84 l-4 14 l5 -3 l5 3 l-3 -14" fill="#d64550" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><circle cx="74" cy="82" r="8" fill="#d64550" stroke="' + INK + '" stroke-width="2"/><path d="M71 82 l2 2 l4 -4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".8"/></g>' +
          '<g id="rr-face"></g></g></svg>';
      },
      // u = 1: Rolle ganz aufgerollt (Pergament offen), u = 0: zusammengerollt wie ein Röllchen. Federt mit leichtem Überschwingen.
      phys: function (c, ph, tn, amp) {
        var r = c.roll, dt = ph.dt || 0.016, a = Math.max(-7, Math.min(7, ph.th * 9));
        r.v += ((r.target - r.u) * 170 - r.v * 13) * dt; r.u += r.v * dt; r.u = Math.max(0, Math.min(1.12, r.u));
        var u = r.u, H = 66 * u, dy = H - 66, k = .72 + .28 * Math.min(1, u), cy = 28 + 30 * Math.min(1, u);
        if (c.all) c.all.setAttribute('transform', 'translate(0 ' + (Math.max(0, 1 - u) * 66).toFixed(1) + ')');   // zusammengerollt sitzt Rolli auf dem Boden
        if (c.sheet) { c.sheet.setAttribute('d', 'M26 26 H84 V' + (26 + H + 4).toFixed(1) + ' H26Z'); c.sheet.setAttribute('opacity', Math.max(0, Math.min(1, u * 8)).toFixed(2)); }
        if (c.deco) { c.deco.setAttribute('transform', 'translate(0 ' + dy.toFixed(1) + ')'); c.deco.setAttribute('opacity', Math.max(0, Math.min(1, (u - .45) * 3)).toFixed(2)); }
        if (c.bot) c.bot.setAttribute('transform', 'translate(0 ' + dy.toFixed(1) + ') rotate(' + a.toFixed(2) + ' 55 101)');
        if (c.top) c.top.setAttribute('transform', 'rotate(' + (-a * .6).toFixed(2) + ' 55 21)');
        c.faceG.setAttribute('transform', 'translate(55 ' + cy.toFixed(1) + ') scale(' + k.toFixed(3) + ') translate(-55 -58)');
      }
    }
  };
  var SIZE = { w: 84, h: 90, wm: 66, hm: 71 };

  var CSS = '' +
  '#dc-root{position:fixed;left:0;top:0;width:0;height:0;z-index:9000;pointer-events:none;font-family:"Segoe UI",system-ui,-apple-system,sans-serif}' +
  '.dc{position:fixed;left:0;top:0;width:var(--dw,84px);height:var(--dh,90px);pointer-events:auto;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;perspective:420px;transition:left 1.8s cubic-bezier(.45,0,.25,1),top 1.8s cubic-bezier(.45,0,.25,1),opacity .3s}' +
  '.dc-r{transition-duration:2.1s;transition-delay:.12s}' +
  '#dc-root.dragging .dc{transition:left .05s linear,top .05s linear}#dc-root.dragging .dc-r{transition:left .35s ease-out,top .35s ease-out}#dc-root.dragging .dc{cursor:grabbing}' +
  '#dc-root.nomove .dc{transition:none}' +
  '.dc-shadow{position:absolute;left:50%;bottom:-2px;width:calc(var(--dw,84px) * .8);height:11px;margin-left:calc(var(--dw,84px) * -.4);border-radius:50%;background:rgba(0,0,0,.3);filter:blur(3px);transition:transform .3s,opacity .3s}' +
  '.dc-body{position:absolute;left:0;top:0;width:100%;height:100%;transform-style:preserve-3d;transform:rotateY(var(--ry,0deg)) rotateZ(var(--rz,0deg));transform-origin:50% 90%;animation:dc-bob 3.2s ease-in-out infinite;filter:drop-shadow(0 6px 5px rgba(0,0,0,.3))}' +
  '.dc-r .dc-body{animation-delay:-1.4s}' +
  '.dc.walk .dc-body{animation:dc-hop .42s ease-in-out infinite}.dc.walk .dc-shadow{transform:scale(.8);opacity:.7}' +
  '.dc.hop .dc-body{animation:dc-hop .42s ease-in-out 2}' +
  '.dc[data-mood=excited] .dc-body{animation:dc-hop .34s ease-in-out infinite}' +
  '.dc[data-mood=giggle] .dc-body{animation:dc-shake .22s linear infinite}.dc[data-mood=dizzy] .dc-body{animation:dc-wobble .7s ease-in-out infinite}' +
  '.dc[data-mood=bored] .dc-body{animation-duration:5.5s}.dc[data-mood=sleep] .dc-body{animation-duration:6.5s}' +
  '.dc-body svg{-webkit-user-drag:none;pointer-events:none;width:100%;height:100%;overflow:visible;display:block}' +
  '.dc-body .dc-lid{transform-box:fill-box;transform-origin:center;animation:dc-blink 5s infinite}.dc-r .dc-lid{animation-delay:-2s}' +
  '.dc-body .dc-arm{transform-box:fill-box;transform-origin:50% 0}' +
  '.dc.talk .dc-armr{animation:dc-wave .7s ease-in-out infinite}' +
  '.dc.talk .dc-mouth{transform-box:fill-box;transform-origin:center;animation:dc-talk .32s ease-in-out infinite}' +
  '.dc-eyes{transition:transform .22s ease-out}' +
  '.dc-body .dc-bub{animation:dc-rise 3.4s linear infinite;opacity:0}.dc-body .dc-bub.b2{animation-delay:1.1s;animation-duration:4s}.dc-body .dc-bub.b3{animation-delay:2.2s;animation-duration:3.1s}' +
  '.dc-body .dc-zzz{animation:dc-zzz 3s ease-in-out infinite}' +
  '@keyframes dc-bob{0%,100%{translate:0 0}50%{translate:0 -4px}}' +
  '@keyframes dc-hop{0%,100%{translate:0 0;scale:1 1}35%{translate:0 -11px;scale:.96 1.05}70%{translate:0 0;scale:1.05 .94}}' +
  '@keyframes dc-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
  '@keyframes dc-shake{0%,100%{translate:-2px 0;rotate:-2deg}50%{translate:2px -2px;rotate:2deg}}' +
  '@keyframes dc-wobble{0%,100%{rotate:-7deg}50%{rotate:7deg}}' +
  '@keyframes dc-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-24deg)}}' +
  '@keyframes dc-talk{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.55)}}' +
  '@keyframes dc-rise{0%{transform:translateY(0);opacity:0}15%{opacity:.7}85%{opacity:.5}100%{transform:translateY(-26px);opacity:0}}' +
  '@keyframes dc-zzz{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-6px);opacity:1}}' +
  '#dc-bubble{position:fixed;left:0;top:0;width:min(300px,calc(100vw - 20px));box-sizing:border-box;pointer-events:auto;background:#fffbe3;color:#1f2937;border:1.5px solid #3b3b2a;border-radius:12px;padding:12px 14px;box-shadow:0 10px 26px rgba(0,0,0,.35);font-size:14.5px;line-height:1.45;display:none;opacity:0;transform:scale(.94);transform-origin:var(--ox,50%) 100%;transition:opacity .18s,transform .18s}' +
  '#dc-bubble.on{display:block}#dc-bubble.show{opacity:1;transform:scale(1)}' +
  '#dc-bubble::after{content:"";position:absolute;left:var(--tx,40px);width:14px;height:14px;background:#fffbe3;border:1.5px solid #3b3b2a;border-top:0;border-left:0;transform:rotate(45deg);margin-left:-7px;bottom:-8px}' +
  '#dc-bubble.below::after{bottom:auto;top:-8px;border:1.5px solid #3b3b2a;border-bottom:0;border-right:0}' +
  '#dc-bubble .kb-who{font-weight:800;font-size:12.5px;letter-spacing:.2px;margin:0 0 3px;color:var(--wc,#334155)}' +
  '#dc-bubble .kb-text{margin:0 18px 10px 0}' +
  '#dc-bubble .kb-x{position:absolute;right:6px;top:4px;border:0;background:none;font-size:20px;line-height:1;color:#6b7280;cursor:pointer;padding:4px 7px}' +
  '#dc-bubble .kb-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;background:none;padding:7px 4px;font:inherit;color:#111827;cursor:pointer;border-radius:8px}' +
  '#dc-bubble .kb-opt:hover,#dc-bubble .kb-opt:focus-visible{background:rgba(59,130,246,.14);outline:none}' +
  '#dc-bubble .kb-dot{flex:none;width:13px;height:13px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#60a5fa,#1d4ed8);box-shadow:0 0 0 1.5px #1e3a8a}' +
  '#dc-bubble .kb-mute{display:flex;align-items:center;gap:9px;margin-top:6px;padding:6px 2px 0;font-size:13px;color:#374151;cursor:pointer}#dc-bubble .kb-mute input{width:17px;height:17px;margin:0}' +
  '#dc-bubble .kb-links{display:flex;justify-content:flex-end;gap:14px;margin-top:6px}' +
  '#dc-bubble .kb-link{border:0;background:none;color:#6b7280;font:inherit;font-size:12px;text-decoration:underline;cursor:pointer;padding:4px 0}' +
  '#dc-bubble .kb-ok{margin-top:6px;border:0;border-radius:8px;background:#2563eb;color:#fff;font:inherit;font-weight:600;padding:8px 16px;cursor:pointer}' +
  '#dc-bubble .kb-punch{display:block;margin-top:6px;font-weight:700}' +
  '#dc-back{position:fixed;left:10px;pointer-events:auto;display:none;border:0;border-radius:999px;background:rgba(30,41,59,.92);color:#e2e8f0;font:600 12px "Segoe UI",system-ui,sans-serif;padding:7px 12px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.35)}' +
  '@media (max-width:520px){#dc-back .kb-hol{display:none}}' +
  '@media (max-width:700px){.dc{width:var(--dwm,66px);height:var(--dhm,71px)}.dc-shadow{width:calc(var(--dwm,66px) * .8);margin-left:calc(var(--dwm,66px) * -.4)}}' +
  '@media print{#dc-root{display:none!important}}';

  // ------------------------------------------------------------------ Stimmung
  var ROLL_BY_MOOD = { sleep: 0, dizzy: .3, oops: .55 };
  function rollTo(c, t, back) { if (!c.roll) return; c.roll.target = t; if (back) setTimeout(function () { if (c.roll) c.roll.target = ROLL_BY_MOOD[c.mood] != null ? ROLL_BY_MOOD[c.mood] : 1; }, back); }
  function setFace(c, m) {
    if (c.roll) c.roll.target = ROLL_BY_MOOD[m] != null ? ROLL_BY_MOOD[m] : 1;
    c.mood = m; c.node.setAttribute('data-mood', m);
    c.faceG.innerHTML = faceSVG(c, m);
    c.eyes = c.faceG.querySelector('.dc-eyes');
    if (c.eyes && c.eyeT) c.eyes.style.transform = c.eyeT;
  }
  function mood(w, m, ms) {
    var c = CH[w]; if (!c) return;
    clearTimeout(c.moodT); c.moodT = null; setFace(c, m);
    if (ms) c.moodT = setTimeout(function () { c.moodT = null; setFace(c, base); }, ms);
  }
  function moodBoth(m, ms) { mood('T', m, ms); mood('R', m, ms); }
  function setBase(m) { base = m; order.forEach(function (w) { if (!CH[w].moodT) setFace(CH[w], m); }); }

  // ------------------------------------------------------------------ Position (Tinto führt, Rolli folgt)
  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }
  function csz() { return el.T ? el.T.offsetWidth : 84; }
  function chH() { return el.T ? el.T.offsetHeight : 90; }
  function clampLead(x, y) {
    var w = csz(), h = chH(), gap = 6, s = (x + w / 2) > vw() / 2 ? -1 : 1;
    var minX = s < 0 ? w + gap + 6 : 6, maxX = s < 0 ? vw() - w - 6 : vw() - 2 * w - gap - 6;
    if (maxX < minX) maxX = minX;
    return { x: Math.max(minX, Math.min(maxX, x)), y: Math.max(6, Math.min(vh() - h - 6, y)), s: s };
  }
  function place(x, y, animate) {
    var p = clampLead(x, y), w = csz();
    if (!animate) el.root.classList.add('nomove');
    pos = { x: p.x, y: p.y }; side = p.s;
    CH.T.node.style.left = p.x + 'px'; CH.T.node.style.top = p.y + 'px';
    CH.R.node.style.left = (p.x + p.s * (w + 6)) + 'px'; CH.R.node.style.top = (p.y + 3) + 'px';
    if (!animate) { void el.root.offsetWidth; el.root.classList.remove('nomove'); }
    if (bubbleOpen) layoutBubble();
  }
  function cpos(w) { var n = CH[w].node; return { x: parseFloat(n.style.left) || 0, y: parseFloat(n.style.top) || 0 }; }
  function anchors() {
    var w = csz(), h = chH(), b = cfg.offsetBottom;
    return [{ x: vw() - w - 14, y: vh() - h - b }, { x: 14, y: vh() - h - b }, { x: vw() - w - 14, y: vh() * 0.55 }, { x: 14, y: vh() * 0.6 }, { x: vw() * 0.5 - w, y: vh() - h - b }];
  }
  function walkTo(a) {
    var far = Math.abs(a.x - pos.x) + Math.abs(a.y - pos.y) > 40;
    if (far) { order.forEach(function (w) { CH[w].node.classList.add('walk'); }); setTimeout(function () { order.forEach(function (w) { CH[w].node.classList.remove('walk'); }); }, 2200); }
    place(a.x, a.y, true); savePos();
  }
  function savePos() { try { sessionStorage.setItem('tr-pos', JSON.stringify({ fx: pos.x / vw(), fy: pos.y / vh() })); } catch (e) {} }
  function loadPos() { try { var o = JSON.parse(sessionStorage.getItem('tr-pos') || 'null'); if (o && isFinite(o.fx) && isFinite(o.fy)) return o; } catch (e) {} return null; }
  function wander() {
    clearTimeout(wanderT);
    wanderT = setTimeout(function () {
      if (!bubbleOpen && !st.off && Date.now() > quietUntil && !document.hidden && CH.T.mood !== 'sleep' && talkOk()) walkTo(rnd(anchors()));
      wander();
    }, 14000 + Math.random() * 14000);
  }

  // ------------------------------------------------------------------ Physik (Tinte schwappt, Rolle schwingt)
  var PH = { T: { px: null, py: null, vx: 0, vy: 0, th: 0, w: 0, lean: 0, ry: 0, t: 0 }, R: { px: null, py: null, vx: 0, vy: 0, th: 0, w: 0, lean: 0, ry: 0, t: 0 } }, lastTs = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!el.root || st.off) { PH.T.px = PH.R.px = null; return; }
    var dt = Math.min(0.05, (ts - (lastTs || ts)) / 1000 || 0.016); lastTs = ts; if (dt <= 0) return;
    order.forEach(function (w) {
      var c = CH[w], ph = PH[w], r = c.body.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top;
      if (ph.px === null) { ph.px = cx; ph.py = cy; return; }
      var vx = (cx - ph.px) / dt, vy = (cy - ph.py) / dt, ax = (vx - ph.vx) / dt, ay = (vy - ph.vy) / dt;
      ph.px = cx; ph.py = cy; ph.vx = vx; ph.vy = vy;
      ax = Math.max(-3500, Math.min(3500, ax)); ay = Math.max(-3500, Math.min(3500, ay));
      var wn = 10, zeta = 0.1, acc = -wn * wn * ph.th - 2 * zeta * wn * ph.w - ax * 0.0012;
      ph.w += acc * dt; ph.th += ph.w * dt; ph.th = Math.max(-0.7, Math.min(0.7, ph.th));
      var leanT = Math.max(-12, Math.min(12, vx * 0.014)); ph.lean += (leanT - ph.lean) * Math.min(1, dt * 7);
      var sd = (cx / vw()) - 0.5, ryT = -sd * 34 + Math.max(-10, Math.min(10, vx * 0.02)); ph.ry += (ryT - ph.ry) * Math.min(1, dt * 6);
      c.body.style.setProperty('--rz', ph.lean.toFixed(2) + 'deg'); c.body.style.setProperty('--ry', ph.ry.toFixed(2) + 'deg');
      ph.t += dt;
      var tn = Math.tan(Math.max(-0.75, Math.min(0.75, ph.th - ph.lean * Math.PI / 180))), amp = 0.7 + Math.min(4.5, Math.abs(ph.w) * 1.1) + Math.min(2.5, Math.abs(ay) * 0.0012);
      ph.dt = dt; c.skin.phys(c, ph, tn, amp);
    });
  }

  // ------------------------------------------------------------------ Sprechblase
  function layoutBubble() {
    var b = el.bubble, w = b.offsetWidth, h = b.offsetHeight, c = CH[speaker], p = cpos(speaker), cx = p.x + csz() / 2;
    var x = Math.max(10, Math.min(vw() - w - 10, cx - w / 2));
    var above = p.y - h - 14 > 8, y = above ? p.y - h - 14 : p.y + chH() + 14;
    b.style.left = x + 'px'; b.style.top = Math.max(8, Math.min(vh() - h - 8, y)) + 'px'; b.classList.toggle('below', !above);
    var tx = Math.max(24, Math.min(w - 24, cx - x)); b.style.setProperty('--tx', tx + 'px'); b.style.setProperty('--ox', tx + 'px'); b.style.setProperty('--wc', c.skin.color);
  }
  function openBubble(html, autoMs, who) {
    clearTimeout(closeT); if (who) speaker = who;
    el.bubble.innerHTML = html; el.bubble.classList.add('on'); bubbleOpen = true; quietUntil = Date.now() + 25000; layoutBubble();
    requestAnimationFrame(function () { el.bubble.classList.add('show'); layoutBubble(); });
    var c = CH[speaker]; c.node.classList.add('talk'); setTimeout(function () { if (c.node) c.node.classList.remove('talk'); }, Math.min(6000, 1200 + (el.bubble.textContent || '').length * 40));
    if (autoMs) closeT = setTimeout(closeBubble, autoMs);
  }
  function closeBubble() {
    clearTimeout(closeT); clearTimeout(chatT); chatSeq++; bubbleOpen = false; curAsk = null; introActive = false;
    if (!el.bubble) return;
    el.bubble.classList.remove('show'); order.forEach(function (w) { CH[w].node.classList.remove('talk'); });
    setTimeout(function () { if (!bubbleOpen) el.bubble.classList.remove('on'); }, 200);
    setTimeout(runQueue, 1800);
  }
  function runQueue() { if (bubbleOpen || !queue.length || st.off) return; API.ask(queue.shift()); }
  var X = '<button class="kb-x" aria-label="Schließen" data-k="close">×</button>';
  function who(w) { return '<div class="kb-who">' + CH[w].skin.emoji + ' ' + CH[w].skin.name + '</div>'; }
  function quietLink() { return '<button class="kb-link" data-k="quiet">' + (st.quiet ? 'Wir dürfen wieder erzählen' : 'Weniger reden') + '</button>'; }

  // Dialog: lines = [{w:'T'|'R', t:'Text', m:'Stimmung', sub:'Zusatz'}], eine Blase, die von Figur zu Figur wechselt
  function chat(lines, opts) {
    if (!el.root || !lines || !lines.length) return;
    clearTimeout(chatT); var my = ++chatSeq, i = 0; opts = opts || {};
    (function next() {
      if (my !== chatSeq || i >= lines.length) return;
      var L = lines[i++], last = i === lines.length, w = L.w || 'T', o = other(w), ms = 2400 + L.t.length * 55 + (L.sub ? 1500 : 0);
      mood(w, L.m || 'happy', last ? 6000 : ms + 400);
      if (L.fx === 'roll') { rollTo(CH[w], 0, 900); }
      if (!CH[o].moodT || !last) mood(o, L.om || (CH[o].mood === 'sleep' ? 'interested' : 'interested'), Math.min(ms, 3500));
      openBubble(X + who(w) + '<p class="kb-text" style="margin-bottom:4px">' + esc(L.t) + '</p>' + (L.sub ? '<p class="kb-text" style="margin:0 0 4px;font-size:13px;color:#4b5563">' + esc(L.sub) + '</p>' : '') +
        (last ? '<div class="kb-links">' + quietLink() + '</div>' : ''), last ? (opts.stay || 6000 + L.t.length * 55 + (L.sub ? L.sub.length * 40 : 0)) : 0, w);
      if (!last) chatT = setTimeout(next, ms);
    })();
  }
  function showAsk(o, w) {
    w = w || 'R'; curAsk = o; chatSeq++; clearTimeout(chatT); mood(w, 'interested', 4000);
    openBubble(X + who(w) + '<p class="kb-text">' + esc(o.text) + '<br><br><b>Brauchst du Hilfe?</b></p>' +
      '<button class="kb-opt" data-k="tip"><span class="kb-dot"></span>Tipp anzeigen</button>' +
      '<button class="kb-opt" data-k="no"><span class="kb-dot"></span>Ohne Hilfe weitermachen</button>' +
      (o.id ? '<label class="kb-mute"><input type="checkbox" id="kb-mute"> Diesen Tipp nicht mehr anzeigen</label>' : '') +
      '<div class="kb-links">' + quietLink() + '<button class="kb-link" data-k="off">Ausblenden</button></div>', 40000, w);
  }
  function showTip(o) { chatSeq++; mood(speaker, 'thinking', 5000); openBubble(X + who(speaker) + '<p class="kb-text" style="margin-bottom:8px">' + esc(o.tip) + '</p><button class="kb-ok" data-k="no">Alles klar</button>', 60000, speaker); }
  function showIntro() {
    introActive = true; chatSeq++; mood('T', 'excited', 2800); mood('R', 'excited', 2800);
    openBubble(X + '<p class="kb-text" style="margin-bottom:6px"><b style="color:' + SKINS.T.color + '">Tinto:</b> ' + esc(INTRO[0][1]) + '</p><p class="kb-text" style="margin-bottom:6px"><b style="color:' + SKINS.R.color + '">Rolli:</b> ' + esc(INTRO[1][1]) + '</p>' +
      (cfg.introExtra ? '<p class="kb-text">' + cfg.introExtra + '</p>' : '') + '<p class="kb-text" style="font-size:13px;color:#4b5563;margin-top:-4px">Du kannst uns ziehen, antippen oder ausblenden.</p><button class="kb-ok" data-k="hello">Hallo, ihr zwei! 👋</button>', 0, 'T');
  }
  function onBubbleClick(e) {
    var t = e.target.closest ? e.target.closest('[data-k]') : null; if (!t) return;
    var k = t.getAttribute('data-k'), o = curAsk, m = document.getElementById('kb-mute');
    if (m && m.checked && o && o.id) { st.mute[o.id] = 1; save(); }
    if (k === 'tip' && o) showTip(o);
    else if (k === 'off') API.hide();
    else if (k === 'quiet') { st.quiet = !st.quiet; save(); closeBubble(); moodBoth('happy', 1500); }
    else if (k === 'hello') { st.met = true; save(); closeBubble(); moodBoth('excited', 1800); }
    else closeBubble();
  }

  // ------------------------------------------------------------------ Persönlichkeit
  var bag = [], lastText = '';
  function refillBag() { bag = ['nice', 'joke', 'motiv', 'comment', 'help', 'fact', 'joke', 'motiv', 'comment', 'fact', 'nice', 'comment', 'fact']; for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t; } }
  function pick(arr) { var t, n = 0; do { t = rnd(arr); n++; } while (t === lastText && n < 5 && arr.length > 1); lastText = typeof t === 'string' ? t : JSON.stringify(t[0]); return t; }
  function remark() {
    if (!bag.length) refillBag();
    var kind = bag.pop();
    if (kind === 'help') {
      var o = cfg.idleHelp ? cfg.idleHelp() : (cfg.tapHelp ? cfg.tapHelp() : null);
      if (o) { showAsk({ id: '', text: o.text, tip: o.tip }, 'R'); return; }
      kind = 'nice';
    }
    if (kind === 'nice') chat([{ w: 'T', t: pick(NICE), m: 'love' }]);
    else if (kind === 'fact') chat([{ w: 'R', t: pick(FACTS), m: 'interested' }]);
    else if (kind === 'motiv') chat([{ w: 'T', t: pick(MOTIVATION), m: 'excited' }]);
    else if (kind === 'joke') chat(pick(JOKES));
    else { var c = cfg.comments && cfg.comments.length ? cfg.comments.concat(GENERIC) : GENERIC; chat([{ w: Math.random() < .5 ? 'T' : 'R', t: pick(c), m: 'interested' }]); }
  }
  function activity() {
    lastAct = Date.now(); nextRemark = 40 + Math.random() * 25; yawned = false;
    var c = CH.T.mood;
    if (c === 'sleep' || c === 'bored' || c === 'yawn' || CH.R.mood === 'sleep') {
      var slept = wasSleeping; wasSleeping = false; order.forEach(function (w) { clearTimeout(CH[w].moodT); CH[w].moodT = null; }); base = 'happy';
      if (slept && !bubbleOpen && !st.quiet && !st.off) chat(rnd(WAKE)); else moodBoth('happy');
    }
  }
  function tick() {
    if (!el.root || st.off || document.hidden) return;
    var idle = (Date.now() - lastAct) / 1000;
    if (idle >= 240 && CH.T.mood !== 'sleep') { if (!bubbleOpen) { wasSleeping = true; base = 'sleep'; mood('T', 'sleep'); setTimeout(function () { if (base === 'sleep') mood('R', 'sleep'); }, 900); } }
    else if (idle >= 120 && base === 'happy') { base = 'bored'; setBase('bored'); }
    if (idle >= 150 && !yawned && base === 'bored' && !bubbleOpen) { yawned = true; mood('T', 'yawn', 3200); setTimeout(function () { if (base === 'bored') mood('R', 'yawn', 3000); }, 700); }
    if (idle >= nextRemark && !bubbleOpen && !introActive && !st.quiet && base !== 'sleep' && talkOk()) {
      if (base === 'bored') { chat(rnd(BORED)); nextRemark = idle + 70 + Math.random() * 50; }
      else { remark(); nextRemark = idle + 55 + Math.random() * 45; }
    }
  }
  function talkOk() { return !cfg.canTalk || cfg.canTalk(); }
  function micro() {
    if (!el.root || st.off || bubbleOpen || document.hidden || base === 'sleep') return;
    var w = rnd(order), c = CH[w], a = rnd(['look', 'look', 'wink', 'hop', 'hum', 'look', 'peek', w === 'R' ? 'roll' : 'hop', w === 'R' ? 'roll' : 'look']);
    if (c.moodT) return;
    if (a === 'look') {
      var pts = [[-2.4, -0.6], [2.4, -1], [-1.6, 1.2], [0, 0]], i = 0;
      (function next() { if (Date.now() - lastPtr < 1500 || i >= pts.length) return; c.eyeT = 'translate(' + pts[i][0] + 'px,' + pts[i][1] + 'px)'; if (c.eyes) c.eyes.style.transform = c.eyeT; i++; setTimeout(next, 1100); })();
    } else if (a === 'roll') { rollTo(c, 0, 1300);
    } else if (a === 'peek') {   // der andere schaut kurz zum Partner
      mood(other(w), 'interested', 1600);
    } else if (a === 'wink') mood(w, 'wink', 1400);
    else if (a === 'hum') { mood(w, 'hum', 3600); }
    else { c.node.classList.add('hop'); setTimeout(function () { c.node.classList.remove('hop'); }, 900); }
  }
  function scheduleMicro() { clearTimeout(microT); microT = setTimeout(function () { micro(); scheduleMicro(); }, 8000 + Math.random() * 9000); }
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function breakCheck() {
    var t0 = +sget('tr-t0'); if (!t0) { sset('tr-t0', String(Date.now())); return; }
    var min = (Date.now() - t0) / 60000, done = +sget('tr-brk') || 0, th = [40, 90, 140];
    if (done < th.length && min >= th[done] && !bubbleOpen && !introActive && !st.quiet) { sset('tr-brk', String(done + 1)); chat([{ w: 'R', t: rnd(BREAK), m: 'interested' }]); }
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function greetText() {
    var d = new Date(), h = d.getHours(), wd = d.getDay(), v = { n: 1, last: 0 };
    try { var o = JSON.parse(localStorage.getItem('tr-visit') || '{}'); v.last = +o.last || 0; v.n = (o.day === today() ? (+o.n || 0) : 0) + 1; localStorage.setItem('tr-visit', JSON.stringify({ day: today(), n: v.n, last: Date.now() })); } catch (e) {}
    var t = h < 5 ? 'Noch (oder schon) wach? Respekt! Willkommen bei uns.' : h < 10 ? 'Guten Morgen! Bereit für eine kleine Zeitreise?' : h < 13 ? 'Guten Tag! Schön, dass du da bist.' : h < 17 ? 'Hallo! Na, wie läuft dein Tag?' : h < 22 ? 'Guten Abend! Noch ein bisschen Geschichte vor dem Feierabend?' : 'So spät noch hier? Wir sind bei dir, aber denk an deinen Schlaf.';
    if (wd === 1 && h >= 5 && h < 17) t += ' Auf in die Woche!';
    else if (wd === 5 && h >= 5 && h < 17) t += ' Und gleich ist Wochenende!';
    else if ((wd === 0 || wd === 6) && h >= 5 && h < 22) t += ' Am Wochenende hier? Das nenne ich Einsatz!';
    if (v.last && Date.now() - v.last > 7 * 86400000) t = 'Lange nicht gesehen! Schön, dass du wieder da bist. 💙';
    else if (v.n >= 3) t = 'Schon wieder da? Wir freuen uns jedes Mal!';
    else if (v.n === 2) t = 'Willkommen zurück! Das ging ja schnell.';
    return t;
  }

  // ------------------------------------------------------------------ API
  var API = {
    init: function (c) {
      for (var k in c) cfg[k] = c[k];
      load();
      if (document.getElementById('dc-root')) return;
      var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
      var root = document.createElement('div'); root.id = 'dc-root'; root.setAttribute('data-html2canvas-ignore', 'true');
      var html = '';
      order.forEach(function (w) {
        var sk = SKINS[w]; html += '<div class="dc dc-' + w.toLowerCase() + '" data-w="' + w + '" role="button" tabindex="0" aria-label="' + sk.name + ' – Hilfe"><div class="dc-shadow"></div><div class="dc-body">' + sk.svg() + '</div></div>';
      });
      root.innerHTML = html + '<div id="dc-bubble" role="dialog" aria-live="polite"></div><button id="dc-back" type="button" aria-label="Tinto und Rolli wieder holen" title="Tinto und Rolli wieder holen">🖋️📜<span class="kb-hol"> Tinto &amp; Rolli holen</span></button>';
      document.body.appendChild(root);
      root.style.setProperty('--dw', SIZE.w + 'px'); root.style.setProperty('--dh', SIZE.h + 'px'); root.style.setProperty('--dwm', SIZE.wm + 'px'); root.style.setProperty('--dhm', SIZE.hm + 'px');
      el.root = root; el.bubble = root.querySelector('#dc-bubble'); el.back = root.querySelector('#dc-back'); el.T = root.querySelector('.dc-t'); el.R = root.querySelector('.dc-r');
      order.forEach(function (w) {
        var n = root.querySelector('.dc-' + w.toLowerCase()), sk = SKINS[w], p = w === 'T' ? 'tt' : 'rr';
        CH[w] = { w: w, skin: sk, node: n, body: n.querySelector('.dc-body'), faceG: n.querySelector('#' + p + '-face'), mood: 'happy', moodT: null, eyeT: '', liq: n.querySelector('#tt-liq'), surf: n.querySelector('#tt-surf'), quill: n.querySelector('#tt-quill'), top: n.querySelector('#rr-top'), bot: n.querySelector('#rr-bot'), sheet: n.querySelector('#rr-sheet'), all: n.querySelector('#rr-all'), deco: n.querySelector('#rr-deco'), roll: { u: 1, v: 0, target: 1 } };
        setFace(CH[w], 'happy');
      });
      el.bubble.addEventListener('click', onBubbleClick);
      el.back.addEventListener('click', function () { st.off = false; save(); applyOff(); API.help(); });

      // Ziehen: beide Figuren lassen sich anfassen, das Paar bewegt sich gemeinsam
      var d = null;
      order.forEach(function (w) {
        var n = CH[w].node;
        n.addEventListener('dragstart', function (e) { e.preventDefault(); });
        n.addEventListener('pointerdown', function (e) {
          if (e.pointerType === 'mouse') e.preventDefault();
          var cp = cpos(w); d = { w: w, sx: e.clientX, sy: e.clientY, ox: pos.x - cp.x, oy: pos.y - cp.y, cx: cp.x, cy: cp.y, moved: false }; try { n.setPointerCapture(e.pointerId); } catch (x) {}
        });
        n.addEventListener('pointermove', function (e) {
          if (!d || d.w !== w) return; var dx = e.clientX - d.sx, dy = e.clientY - d.sy;
          if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) { d.moved = true; d.flips = []; d.lx = e.clientX; el.root.classList.add('dragging'); moodBoth('excited', 1600); }
          if (d.moved) {
            place(d.cx + dx + d.ox, d.cy + dy + d.oy, false); quietUntil = Date.now() + 30000;
            var dd = e.clientX - d.lx;
            if (Math.abs(dd) > 7) { var dir = dd > 0 ? 1 : -1, now = Date.now(); if (d.dir && dir !== d.dir) { d.flips.push(now); d.flips = d.flips.filter(function (t) { return now - t < 1500; }); if (d.flips.length >= 5 && now - lastDizzy > 12000) { lastDizzy = now; d.flips = []; chat([{ w: w, t: rnd(w === 'T' ? DIZZY : DIZZY_R), m: 'dizzy' }]); } } d.dir = dir; d.lx = e.clientX; }
          }
        });
        n.addEventListener('pointerup', function () {
          if (!d || d.w !== w) return; var m = d.moved; d = null; el.root.classList.remove('dragging'); if (m) { savePos(); return; }
          var now = Date.now(); taps.push({ t: now, w: w }); taps = taps.filter(function (x) { return now - x.t < 2500 && x.w === w; });
          if (taps.length >= 4) { taps = []; mood(other(w), 'surprised', 2500); if (w === 'R') rollTo(CH.R, 0, 1400); chat([{ w: w, t: rnd(w === 'T' ? TICKLE : TICKLE_R), m: 'giggle' }]); return; }
          if (bubbleOpen) closeBubble(); else API.help(w);
        });
        n.addEventListener('pointercancel', function () { d = null; el.root.classList.remove('dragging'); });
        n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bubbleOpen ? closeBubble() : API.help(w); } });
      });

      document.addEventListener('pointermove', function (e) {
        if (st.off) return;
        order.forEach(function (w) {
          var c = CH[w]; if (!c.eyes) return;
          var r = c.node.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.6, dx = e.clientX - cx, dy = e.clientY - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, L / 160) * 2.6;
          c.eyeT = 'translate(' + (dx / L * m).toFixed(2) + 'px,' + (dy / L * m).toFixed(2) + 'px)'; c.eyes.style.transform = c.eyeT;
        });
        lastPtr = Date.now();
      }, { passive: true });
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, activity, { passive: true, capture: true }); });
      var lastMove = 0; document.addEventListener('pointermove', function () { var n = Date.now(); if (n - lastMove > 400) { lastMove = n; activity(); } }, { passive: true });
      window.addEventListener('resize', function () { place(pos.x, pos.y, false); });
      window.addEventListener('orientationchange', function () { setTimeout(function () { place(pos.x, pos.y, false); }, 200); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bubbleOpen) closeBubble(); });

      var sp = loadPos(), a = anchors()[0];
      if (sp) { place(sp.fx * vw(), sp.fy * vh(), false); setTimeout(API.arrive, 300); }
      else { place(a.x, vh() + 120, false); setTimeout(function () { place(a.x, a.y, true); }, 400); }
      scheduleMicro(); breakCheck(); setInterval(breakCheck, 30000);
      applyOff(); wander(); requestAnimationFrame(loop); setInterval(tick, 1000);
      nextRemark = 40 + Math.random() * 25;
      if (cfg.intro && !st.met && !st.off) setTimeout(showIntro, 1800);
    },
    ask: function (o) {
      if (!el.root || st.off || !talkOk()) return;
      if (o.id && (st.mute[o.id] || (shownIds[o.id] && !o.repeat))) return;
      if (bubbleOpen || introActive || (cfg.intro && !st.met)) { if (o.id && !shownIds['q' + o.id]) { shownIds['q' + o.id] = 1; queue.push(o); } return; }
      if (o.id) shownIds[o.id] = 1;
      showAsk(o, o.w || 'R');
    },
    help: function (w) {
      var o = cfg.tapHelp ? cfg.tapHelp() : null;
      if (!o) o = { text: 'Hallo, ich bin ' + SKINS[w || 'R'].name + '!', tip: 'Tippe auf einen von uns, wenn du Hilfe brauchst. Du kannst uns auch verschieben.' };
      showAsk({ id: '', text: o.text, tip: o.tip }, w || 'R');
    },
    greetHome: function (o) {
      o = o || {}; if (!el.root || st.off) return;
      if (bubbleOpen || introActive || (cfg.intro && !st.met)) return;
      var l = [{ w: 'T', t: o.text || greetText(), m: 'excited' }]; if (o.hint) l.push({ w: 'R', t: o.hint, m: 'happy' }); chat(l, { stay: 9000 });
    },
    arrive: function () { if (!el.root || st.off) return; order.forEach(function (w) { CH[w].node.classList.add('walk'); }); setTimeout(function () { order.forEach(function (w) { CH[w].node.classList.remove('walk'); }); }, 800); moodBoth('excited', 1500); },
    say: function (text, m, w) { if (!el.root || st.off || introActive || (cfg.intro && !st.met)) return false; curAsk = null; chat([{ w: w || 'R', t: text, m: m || 'happy' }]); return true; },
    react: function (m, text, w) { if (!el.root || st.off) return; if (text && !bubbleOpen && !introActive && !st.quiet) chat([{ w: w || 'T', t: text, m: m }]); else mood(w || 'T', m, 2600); lastAct = Date.now(); },
    tell: function (text, m, w) { if (!el.root || st.off || introActive) return false; lastAct = Date.now(); if (st.quiet) { mood(w || 'T', m || 'happy', 2600); return false; } curAsk = null; chat([{ w: w || 'T', t: text, m: m || 'happy' }]); return true; },
    chat: chat,
    roll: function (t, back) { if (CH.R) rollTo(CH.R, t == null ? 0 : t, back); },   // Rolli zusammenrollen (0) oder aufrollen (1)
    place: function (fx, fy) { if (!el.root) return; place(fx * vw(), fy * vh(), true); savePos(); },
    mood: function (m, ms, w) { w ? mood(w, m, ms) : moodBoth(m, ms); },
    _remark: function () { if (el.root) remark(); },
    _idle: function (sec) { lastAct = Date.now() - sec * 1000; },
    hide: function () { st.off = true; save(); closeBubble(); applyOff(); },
    show: function () { st.off = false; save(); applyOff(); }
  };
  function applyOff() {
    if (!el.root) return;
    order.forEach(function (w) { CH[w].node.style.display = st.off ? 'none' : ''; });
    el.back.style.display = st.off ? 'block' : 'none'; el.back.style.bottom = 'calc(10px + env(safe-area-inset-bottom,0px))'; el.back.style.left = '128px';
  }
  window.Duo = API;
})();
