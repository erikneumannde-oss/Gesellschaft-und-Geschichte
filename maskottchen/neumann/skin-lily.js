/* Lily – Maskottchen nach Lily Braun (1865–1916), Namensgeberin des Lily-Braun-Gymnasiums
   Skin für die Kolbi-Engine (wie Hugo und Lilibär). Umsetzung: Erik Neumann mit Hilfe von Claude. */
(function () {
  'use strict';
  var HAIR = '#6e412c', HAIR_D = '#4e2a1b', SKIN = '#fcd7bf', SKIN_D = '#f2b89c', DRESS = '#3e4444', DRESS_D = '#2c3131',
      COLLAR = '#f7efdc', LACE = '#d8c4a0', CUFF = '#f6f0dd', SHOE = '#3f262a', INK = '#3a1f16', BROW = '#7a4a32',
      LIP = '#c4645c', MOUTH = '#9c3b44';
  // Gezeichnet in den Koordinaten der Vorlage, skaliert auf die 106er-Breite der Engine
  var T = 'scale(0.1277) translate(-960 -40)';
  var MIRROR = 'matrix(-1 0 0 1 2752 0)';   // Spiegelachse x = 1376 (Körpermitte)

  // ------------------------------------------------------------------ Augen
  function lashes(cx, cy, side) {
    return '<path d="M' + (cx + side * 38) + ' ' + (cy - 26) + ' l' + (side * 22) + ' -12 M' + (cx + side * 42) + ' ' + (cy - 12) + ' l' + (side * 25) + ' -3" stroke="' + INK + '" stroke-width="8" stroke-linecap="round" fill="none"/>';
  }
  function dot(cx, cy, r, side) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="' + (cx + r * .32).toFixed(0) + '" cy="' + (cy - r * .36).toFixed(0) + '" r="' + (r * .3).toFixed(0) + '" fill="#fff" stroke="none"/>' +
      '<circle cx="' + (cx - r * .38).toFixed(0) + '" cy="' + (cy + r * .38).toFixed(0) + '" r="' + (r * .12).toFixed(0) + '" fill="#fff" stroke="none" opacity=".8"/>' + lashes(cx, cy, side);
  }
  function lids(a, b) { return '<g class="k-lid">' + a + b + '</g>'; }
  var LX = 1250, RX = 1502, EY = 560;
  function pair(r, dx, dy) { return lids(dot(LX + (dx || 0), EY + (dy || 0), r, -1), dot(RX + (dx || 0), EY + (dy || 0), r, 1)); }
  var HEART = 'M0 22 C-40 -4 -36 -32 -16 -32 C-6 -32 0 -24 0 -16 C0 -24 6 -32 16 -32 C36 -32 40 -4 0 22 Z';
  function heart(x) { return '<path transform="translate(' + x + ' ' + EY + ') scale(1.3)" d="' + HEART + '" fill="#ff4d6d" stroke="none"/>'; }
  var HAPPY_R = '<path d="M1460 572 q42 -50 84 0"/>';

  var EYES = {
    o:      pair(42),
    big:    pair(46),
    wide:   pair(50),
    small:  '<g class="k-lid"><circle cx="' + LX + '" cy="' + (EY + 4) + '" r="28" fill="' + INK + '" stroke="none"/><circle cx="' + RX + '" cy="' + (EY + 4) + '" r="28" fill="' + INK + '" stroke="none"/></g>',
    side:   pair(40, 12, -6),
    inter:  pair(45, 4, -2),
    half:   '<path d="M1208 566 a42 42 0 0 0 84 0 z" fill="' + INK + '" stroke="none"/><path d="M1460 566 a42 42 0 0 0 84 0 z" fill="' + INK + '" stroke="none"/><path d="M1200 566 h100"/><path d="M1452 566 h100"/>',
    closed: '<path d="M1208 560 q42 32 84 0"/><path d="M1460 560 q42 32 84 0"/>' ,
    happy:  '<path d="M1208 572 q42 -50 84 0"/>' + HAPPY_R,
    wink:   lids(dot(LX, EY, 42, -1), '') + HAPPY_R,
    x:      '<path d="M1220 530 l60 60 M1280 530 l-60 60"/><path d="M1472 530 l60 60 M1532 530 l-60 60"/>',
    heart:  heart(LX) + heart(RX)
  };

  // ------------------------------------------------------------------ Mund und Brauen
  var SMILE = 'M1336 676 Q1376 710 1416 676';
  var OPEN = '<path d="M1336 672 Q1376 740 1416 672 Z" fill="' + MOUTH + '"/><path d="M1356 704 Q1376 722 1396 704 Q1376 694 1356 704 Z" fill="#ff8a8a" stroke="none"/>';
  var BROWS = 'M1195 494 Q1240 470 1290 484 M1462 484 Q1512 470 1557 494';
  var M = {
    happy:      { e: 'o', m: SMILE },
    excited:    { e: 'big', m: OPEN, l: 'M1186 912 Q1080 905 1054 786', r: 'up',
                  ex: '<text x="1700" y="420" font-size="150" font-weight="800" fill="#ffd35a" stroke="none">!</text>' },
    interested: { e: 'inter', m: '<ellipse cx="1376" cy="690" rx="13" ry="15" fill="' + MOUTH + '"/>', br: 'M1195 480 Q1240 454 1290 470 M1462 470 Q1512 454 1557 480' },
    thinking:   { e: 'side', m: 'M1350 692 Q1378 680 1406 694', br: 'M1195 494 Q1240 474 1290 486 M1462 470 Q1512 448 1557 476',
                  r: 'M1566 912 Q1660 905 1556 790',
                  ex: '<text x="1690" y="430" font-size="170" font-weight="800" fill="#ffd35a" stroke="none">?</text>' },
    bored:      { e: 'half', m: 'M1346 690 q10 -8 20 0 t20 0 t20 0' },
    yawn:       { e: 'closed', m: '<ellipse cx="1376" cy="702" rx="22" ry="28" fill="' + MOUTH + '"/>' },
    sleep:      { e: 'closed', m: 'M1352 686 Q1376 700 1400 686',
                  ex: '<g class="k-zzz" font-weight="800" fill="#cbd5f5" stroke="none"><text x="1680" y="470" font-size="110">z</text><text x="1720" y="360" font-size="150">Z</text></g>' },
    wink:       { e: 'wink', m: SMILE, r: 'up' },
    giggle:     { e: 'happy', m: OPEN, r: 'up' },
    dizzy:      { e: 'x', m: 'M1344 692 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0',
                  ex: '<g class="k-zzz" fill="#ffd35a" stroke="none"><circle cx="1150" cy="70" r="20"/><circle cx="1400" cy="44" r="20"/><circle cx="1640" cy="80" r="20"/></g>' },
    surprised:  { e: 'wide', m: '<ellipse cx="1376" cy="698" rx="16" ry="21" fill="' + MOUTH + '"/>', br: 'M1195 470 Q1240 444 1290 458 M1462 458 Q1512 444 1557 470' },
    love:       { e: 'heart', m: SMILE,
                  ex: '<g class="k-zzz" fill="#ff8fa8" stroke="none" font-weight="800"><text x="1690" y="430" font-size="120">♥</text><text x="975" y="470" font-size="90">♥</text></g>' },
    hum:        { e: 'o', m: 'M1352 680 Q1376 706 1400 680',
                  ex: '<g class="k-zzz" fill="#cbd5f5" stroke="none" font-weight="800"><text x="1690" y="440" font-size="140">♪</text></g>' },
    serious:    { e: 'o', m: 'M1348 690 L1404 690', br: 'M1195 486 Q1240 486 1290 498 M1462 498 Q1512 486 1557 486' },
    caring:     { e: 'inter', m: 'M1350 688 Q1376 702 1402 688', br: 'M1195 494 Q1240 480 1290 466 M1462 466 Q1512 480 1557 494' },
    proud:      { e: 'happy', m: OPEN, br: 'M1195 482 Q1240 462 1290 474 M1462 474 Q1512 462 1557 482', r: 'up' },
    oops:       { e: 'small', m: 'M1344 694 q8 -10 16 0 q8 10 16 0 q8 -10 16 0 q8 10 16 0', br: 'M1198 492 Q1240 488 1288 466 M1464 466 Q1512 488 1554 492',
                  ex: '<path d="M1690 430 q40 70 0 96 q-40 -26 0 -96z" fill="#7fd0ff" stroke="none"/>' }
  };

  // ------------------------------------------------------------------ Arme, Kragen, Schleife
  var ARM_L = 'M1192 912 Q1140 985 1110 1062', ARM_R = 'M1560 912 Q1612 985 1642 1062', ARM_R_UP = 'M1566 912 Q1672 905 1698 786';
  function armG(d) {
    var n = d.match(/-?[\d.]+/g).map(Number), cx = n[2], cy = n[3], ex = n[4], ey = n[5];
    var dx = ex - cx, dy = ey - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, hx = ex + dx / L * 40, hy = ey + dy / L * 40;
    return '<path d="' + d + '" fill="none" stroke="' + DRESS + '" stroke-width="76" stroke-linecap="round"/>' +
      '<ellipse cx="' + hx.toFixed(0) + '" cy="' + hy.toFixed(0) + '" rx="33" ry="37" fill="' + SKIN + '" transform="rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI - 90).toFixed(0) + ' ' + hx.toFixed(0) + ' ' + hy.toFixed(0) + ')"/>' +
      '<path d="M' + (ex - dx / L * 20).toFixed(0) + ' ' + (ey - dy / L * 20).toFixed(0) + ' L' + (ex + dx / L * 14).toFixed(0) + ' ' + (ey + dy / L * 14).toFixed(0) + '" stroke="' + CUFF + '" stroke-width="82" stroke-linecap="butt"/>';
  }
  function collarHalf() {
    var sc = [[1150, 900], [1172, 930], [1205, 950], [1245, 960], [1287, 958], [1330, 950]], dots = [[1182, 902], [1214, 924], [1252, 934], [1294, 932]], s = '', t = '';
    sc.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="23"/>'; });
    dots.forEach(function (p) { t += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7"/>'; });
    return '<g fill="' + COLLAR + '">' + s + '</g><g fill="' + LACE + '">' + t + '</g>' +
      '<path d="M1178 872 q22 -16 44 0 t44 0 t44 0" fill="none" stroke="' + LACE + '" stroke-width="6" stroke-linecap="round"/>';
  }
  var COLLAR_SVG =
    '<path d="M1300 790 Q1215 818 1146 878 L1150 905 Q1250 968 1376 945 Q1502 968 1602 905 L1606 878 Q1537 818 1452 790 Z" fill="' + COLLAR + '"/>' +
    collarHalf() + '<g transform="' + MIRROR + '">' + collarHalf() + '</g>' +
    '<path d="M1300 790 Q1215 818 1146 878" fill="none" stroke="' + LACE + '" stroke-width="4"/><path d="M1452 790 Q1537 818 1606 878" fill="none" stroke="' + LACE + '" stroke-width="4"/>';
  var BOW_TAILS =
    '<g id="ly-bow"><g fill="' + COLLAR + '" stroke="' + LACE + '" stroke-width="4" stroke-linejoin="round">' +
      '<path d="M1356 896 L1300 1108 L1332 1090 L1356 1112 L1396 904 Z"/>' +
      '<path d="M1396 896 L1452 1108 L1420 1090 L1396 1112 L1356 904 Z"/></g></g>';
  var BOW_KNOT =
    '<g fill="' + COLLAR + '" stroke="' + LACE + '" stroke-width="4" stroke-linejoin="round">' +
      '<path d="M1376 884 Q1290 822 1262 876 Q1272 936 1376 884 Z"/>' +
      '<path d="M1376 884 Q1462 822 1490 876 Q1480 936 1376 884 Z"/>' +
      '<circle cx="1376" cy="884" r="28"/></g>' +
    '<path d="M1326 872 q20 6 34 10 M1426 872 q-20 6 -34 10" stroke="' + LACE + '" stroke-width="4" fill="none" stroke-linecap="round"/>';

  function face(m) {
    var d = M[m] || M.happy, up = d.r === 'up', r = up ? ARM_R_UP : (d.r || ARM_R);
    var inner =
      '<g class="ly-arml">' + armG(d.l || ARM_L) + '</g>' +
      '<g class="ly-armr"><g id="ly-armr" data-up="' + (up ? 1 : 0) + '">' + armG(r) + '</g></g>' +
      COLLAR_SVG + BOW_TAILS + BOW_KNOT +
      '<path d="' + (d.br || BROWS) + '" fill="none" stroke="' + BROW + '" stroke-width="13" stroke-linecap="round"/>' +
      '<g class="k-mouth" fill="none" stroke="' + LIP + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">' + (d.m.charAt(0) === 'M' ? '<path d="' + d.m + '"/>' : d.m) + '</g>' +
      '<ellipse cx="1214" cy="642" rx="40" ry="23" fill="#f7a39a" opacity=".8"/><ellipse cx="1538" cy="642" rx="40" ry="23" fill="#f7a39a" opacity=".8"/>' + (d.ex || '');
    return '<g transform="' + T + '">' + inner + '</g>' +
      '<g id="kolbi-eyes" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><g transform="' + T + '">' + EYES[d.e] + '</g></g>';
  }

  // ------------------------------------------------------------------ Figur
  function art() {
    return '' +
      // Schuhe, Rock, Oberteil
      '<ellipse cx="1300" cy="1372" rx="56" ry="32" fill="' + SHOE + '"/><ellipse cx="1452" cy="1372" rx="56" ry="32" fill="' + SHOE + '"/>' +
      '<path d="M1215 1020 Q1150 1200 1118 1336 Q1376 1372 1634 1336 Q1602 1200 1537 1020 Z" fill="' + DRESS + '"/>' +
      '<path d="M1300 1062 Q1268 1200 1246 1342 L1272 1346 Q1286 1200 1310 1064 Z M1452 1062 Q1484 1200 1506 1342 L1480 1346 Q1466 1200 1442 1064 Z" fill="' + DRESS_D + '"/>' +
      '<path d="M1186 900 Q1376 868 1566 900 L1552 1046 Q1376 1068 1200 1046 Z" fill="' + DRESS + '"/>' +
      '<path d="M1206 1040 Q1376 1062 1546 1040" fill="none" stroke="' + DRESS_D + '" stroke-width="10"/>' +
      // Haare hinten mit Dutt
      curls([[1310, 150, 96], [1446, 128, 110], [1560, 182, 82], [1238, 236, 104], [1376, 214, 116], [1514, 236, 104]],
        '<path d="M1270 126 q70 -56 160 -18"/><path d="M1450 92 q90 -6 130 70"/><path d="M1170 270 q60 -70 160 -60"/><path d="M1350 210 q70 -40 150 0"/>') +
      '<path d="M1030 430 C1020 300 1110 205 1235 188 C1310 176 1460 174 1560 210 C1680 258 1740 350 1726 452 C1716 520 1690 560 1660 572 L1094 572 C1056 560 1034 505 1030 430 Z" fill="' + HAIR + '"/>' +
      // Ohren, Hals, Gesicht, Nase
      '<ellipse cx="1114" cy="612" rx="40" ry="50" fill="' + SKIN + '"/><ellipse cx="1120" cy="614" rx="18" ry="27" fill="' + SKIN_D + '"/>' +
      '<ellipse cx="1638" cy="612" rx="40" ry="50" fill="' + SKIN + '"/><ellipse cx="1632" cy="614" rx="18" ry="27" fill="' + SKIN_D + '"/>' +
      '<rect x="1334" y="736" width="84" height="80" rx="24" fill="' + SKIN_D + '"/>' +
      '<path d="M1140 560 C1140 400 1240 312 1376 312 C1512 312 1612 400 1612 560 C1612 702 1510 786 1376 786 C1242 786 1140 702 1140 560 Z" fill="' + SKIN + '"/>' +
      '<ellipse cx="1376" cy="622" rx="15" ry="10" fill="#efa98e"/>' +
      // Haare vorn: Locken an den Seiten und über der Stirn
      curls([[1085, 345, 88], [1072, 452, 80], [1112, 522, 56], [1667, 345, 88], [1680, 452, 80], [1640, 522, 56], [1182, 362, 88], [1290, 318, 46], [1548, 352, 92], [1430, 300, 60]],
        '<path d="M1040 400 q20 -80 110 -100"/><path d="M1120 410 q50 60 120 20"/><path d="M1272 330 q-42 42 -12 96"/>' +
        '<path d="M1470 300 q80 -20 130 50"/><path d="M1630 330 q80 30 76 120"/><path d="M1700 480 q-40 30 -90 -10"/><path d="M1060 480 q40 30 90 -10"/>');
  }
  function curls(list, waves) {
    var f = '';
    list.forEach(function (c) { f += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
    return '<g fill="' + HAIR + '">' + f + '</g>' + (waves ? '<g fill="none" stroke="' + HAIR_D + '" stroke-width="14" stroke-linecap="round">' + waves + '</g>' : '');
  }
  function svg() {
    return '<svg viewBox="0 0 106 180" role="img" aria-label="Lily, das Maskottchen nach Lily Braun">' +
      '<g transform="' + T + '">' + art() + '</g><g id="kk-face">' + face('happy') + '</g></svg>';
  }

  // ------------------------------------------------------------------ Bewegung (Schleife, Winkearm)
  var S = { root: null, last: null, b: 0, wb: 99, a: null, wa: 99, eB: null, eA: null };
  function setRot(e, a, cx, cy) { e.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' ' + cx + ' ' + cy + ')'); }
  function phys(el, ph, tn, amp) {
    if (S.root !== el.root) { S.root = el.root; S.last = null; S.b = 0; S.wb = S.wa = 99; S.a = null; S.eB = S.eA = null; }
    if (!S.eB || !S.eB.isConnected) { S.eB = el.root.querySelector('#ly-bow'); S.wb = 99; }
    if (!S.eA || !S.eA.isConnected) { S.eA = el.root.querySelector('#ly-armr'); S.wa = 99; S.a = null; }
    var dt = S.last === null ? 0.016 : Math.min(0.05, Math.max(0.001, ph.t - S.last)); S.last = ph.t;
    S.b += (-tn * 14 + Math.sin(ph.t * 2.2) * 3 - S.b) * Math.min(1, dt * 6);
    if (S.eB && Math.abs(S.b - S.wb) > 0.25) { S.wb = S.b; setRot(S.eB, S.b, 1376, 896); }
    if (S.eA) {
      var up = S.eA.getAttribute('data-up') === '1', talk = el.char && el.char.classList.contains('talk');
      var ta = up ? (talk ? Math.sin(ph.t * 8) * 10 : Math.sin(ph.t * 2) * 3) : (talk ? -5 - Math.sin(ph.t * 8) * 5 : 0);
      if (S.a === null) S.a = ta;
      S.a += (ta - S.a) * Math.min(1, dt * 10);
      if (Math.abs(S.a - S.wa) > 0.3) { S.wa = S.a; setRot(S.eA, S.a, 1564, 912); }
    }
  }

  window.KolbiSkins = window.KolbiSkins || {};
  window.KolbiSkins.lily = {
    name: 'Lily', emoji: '📖', key: 'lily', size: { w: 76, h: 129, wm: 62, hm: 105 }, color: '#7a5c8e',
    svg: svg, face: face, phys: phys,
    t: {
      jokeLead: 'Ein kleiner Witz von mir: ',
      intro: ['Guten Tag! Ich bin Lily. 📖', 'Eine kleine Ausgabe von Lily Braun, nach der eure Schule heißt. Ich habe zu meiner Zeit für die Rechte von Frauen gestritten. Jetzt streite ich mit dir für gute Argumente. Tippe mich an, wenn du Hilfe brauchst.'],
      NICE: [
        'Du denkst gründlich nach. Das gefällt mir!',
        'Schön, dass du dir eine eigene Meinung bildest. Genau darum geht es.',
        'Du gibst nicht auf. Mit so viel Ausdauer habe ich auch angefangen.',
        'Gute Arbeit! Darauf darfst du ruhig stolz sein.',
        'Du kannst mehr, als du denkst. Ich sehe das.'
      ],
      MOTIVATION: [
        'Trau dich, deine Meinung zu sagen. Und dann begründe sie so gut, dass man dir zuhören muss.',
        'Gute Argumente sind stärker als laute Stimmen. Das habe ich oft erlebt.',
        'Wer liest, kann mitreden. Wer mitredet, kann etwas verändern.',
        'Fragen stellen ist klug, nicht peinlich. Die besten Fragen stellen die, die nicht alles glauben.',
        'Mädchen und Jungen können alles lernen. Lass dir von niemandem etwas anderes einreden.',
        'Große Veränderungen fangen klein an. Bei mir war es ein Buch, bei dir vielleicht diese Aufgabe.'
      ],
      JOKES: [
        ['Warum nimmt Lily ihr Buch mit ins Bett?', 'Damit sie ihre Träume gleich nachlesen kann.'],
        ['Warum ist das Mathebuch immer so traurig?', 'Es hat zu viele Probleme.'],
        ['Was ist das Lieblingsfach von Büchern?', 'Geschichte, natürlich.'],
        ['Was sagt die Wahlurne zum Stimmzettel?', 'Schön, dass du dich einwirfst!'],
        ['Warum habe ich immer einen Stift dabei?', 'Falls mir jemand widerspricht. Dann schreibe ich ein Buch darüber.']
      ],
      FACTS: [
        'Wusstest du? Lily Braun wurde 1865 in Halberstadt geboren und starb 1916 in Berlin.',
        'Wusstest du? Ihr Geburtsname war Amalie von Kretschman. Sie stammte aus einer Adelsfamilie und hat sich trotzdem für Arbeiterinnen eingesetzt.',
        'Wusstest du? Lily Braun setzte sich für Arbeiterinnen und für den Schutz von Müttern ein.',
        'Wusstest du? 1901 erschien ihr Buch „Die Frauenfrage“.',
        'Wusstest du? Sie schlug Einküchenhäuser vor: Gemeinsame Großküchen sollten Frauen bei der Hausarbeit entlasten.',
        'Wusstest du? Ihre „Memoiren einer Sozialistin“ erschienen in zwei Bänden.',
        'Wusstest du? Frauen durften in Deutschland erst ab 1918 wählen, zwei Jahre nach Lily Brauns Tod. Sie hat es also nicht mehr erlebt.'
      ],
      GENERIC: [
        'Du darfst mich ruhig verschieben. Ich stehe nicht gern im Weg.',
        'Neugier ist der Anfang von allem Wissen.',
        'Tipp: Lies Aufgaben lieber einmal mehr als einmal zu wenig.',
        'Probier ruhig aus. Hier geht nichts kaputt!',
        'Als ich jung war, durften Mädchen in Preußen kein Abitur machen wie die Jungen. Ihr dürft heute alles lernen. Nutzt das!'
      ],
      TICKLE: ['Hihi, das kitzelt! 😄', 'Also wirklich! So etwas tut man nicht … na gut, einmal noch.', 'Kitzeln verboten! Das schreibe ich in mein nächstes Buch.'],
      DIZZY: ['Oh, mir wird ganz schwindelig!', 'Langsam bitte, mein Dutt löst sich gleich!', 'Huch! So wild wurde früher nicht einmal auf Bällen getanzt.'],
      BREAK: ['Du arbeitest schon eine Weile. Trink einen Schluck Wasser und streck dich kurz! 💧', 'Eine kleine Pause tut gut. Kluge Köpfe brauchen auch mal frische Luft.'],
      BORED: ['Hallo? Ist da jemand?', 'Ich lese inzwischen ein bisschen. Sag Bescheid, wenn du weitermachst.', 'Ist gerade Pause? Dann schreibe ich schnell ein paar Gedanken auf.', '*gähn* Ich hätte jetzt Lust auf eine gute Diskussion.'],
      CHECKIN: ['Kurze Zwischenfrage: Wie geht es dir gerade?', 'Na, wie fühlst du dich beim Lernen?', 'Ehrlich gefragt: Wie läuft es bei dir?'],
      CHECK_EMP: ['Oh …', 'Ach, das tut mir leid …', 'Das verstehe ich gut …'],
      CHECK_REPLY: {
        good: ['Das freut mich sehr! 🎉', 'Wunderbar! Dann machen wir weiter.'],
        ok: ['Das kenne ich. Manchmal braucht man einen Anlauf. Schritt für Schritt klappt es.', 'In Ordnung. Mach in Ruhe weiter. Wenn du hängst, tippe mich an.'],
        tired: ['Dann gönn dir eine kurze Pause: Schultern lockern, einen Schluck trinken, kurz aus dem Fenster schauen.', 'Verständlich. Auch kluge Köpfe brauchen Pausen.'],
        hard: ['Das ist völlig in Ordnung. Schwierige Aufgaben gehören dazu, und du musst nicht alles sofort können.']
      },
      WAKE: ['Oh! Ich war ganz in mein Buch vertieft. Schön, dass du wieder da bist!', 'Da bist du ja wieder! Ich habe nur kurz die Augen ausgeruht.'],
      // Für die Begleiter-Schicht (Übersichtsseiten und Lernmodule)
      B: {
        hello: 'Schön, dass du da bist!',
        help: 'Wobei soll ich dir helfen?',
        warn: ['Halt, nicht so schnell! Raten ist kein Argument. Lies die Frage noch einmal in Ruhe.', 'Du klickst schon wieder durch. Ich weiß, dass du mehr kannst als raten. Zeig es mir.', 'Nimm die Aufgabe bitte ernst. Ich helfe dir gern, aber denken musst du selbst. Sag mir, wo es hakt.'],
        lucky: '<b>Richtig. Aber war das Glück oder ein Argument?</b> Schau dir noch einmal an, warum genau diese Antwort stimmt.',
        persist: ['Siehst du? Dranbleiben lohnt sich.', 'Da ist der Knoten geplatzt. Gut gemacht!', 'Ich wusste, dass du das kannst.'],
        done: '<b>Geschafft!</b> Du hast mitgedacht und nicht aufgegeben. Jetzt hast du dir eine Pause verdient.'
      }
    }
  };
})();
