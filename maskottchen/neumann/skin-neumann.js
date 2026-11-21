/* Herr Neumann – Maskottchen als kleine Version von Erik Neumann
   Skin für die Kolbi-Engine (wie Hugo, Lilibär und Lily). Umsetzung: Erik Neumann mit Hilfe von Claude. */
(function () {
  'use strict';
  var HAIR = '#5b3623', HAIR_D = '#43271a', SKIN = '#fbceb0', SKIN_D = '#eeac90', JACKET = '#ddd6c0', JACKET_D = '#c4b596',
      SHIRT = '#fdfdfb', PANTS = '#404646', SHOE = '#422a26', INK = '#432723', FRAME = '#4b2e2a', LIP = '#c97a6a', MOUTH = '#9c3b44';
  var T = 'scale(0.3487) translate(-360 -45)';

  // ------------------------------------------------------------------ Augen (hinter der Brille)
  var LX = 468, RX = 552, EY = 214;
  function eye(cx, cy, r) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (r + 6) + '" ry="' + (r + 4) + '" fill="#fff" stroke="none"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="' + (cx + r * .35).toFixed(1) + '" cy="' + (cy - r * .38).toFixed(1) + '" r="' + (r * .32).toFixed(1) + '" fill="#fff" stroke="none"/>';
  }
  function lids(a, b) { return '<g class="k-lid">' + a + b + '</g>'; }
  function pair(r, dx, dy) { return lids(eye(LX + (dx || 0), EY + (dy || 0), r), eye(RX + (dx || 0), EY + (dy || 0), r)); }
  var HEART = 'M0 9 C-16 -2 -15 -13 -7 -13 C-3 -13 0 -10 0 -6 C0 -10 3 -13 7 -13 C15 -13 16 -2 0 9 Z';
  function heart(x) { return '<path transform="translate(' + x + ' ' + (EY + 2) + ')" d="' + HEART + '" fill="#ff4d6d" stroke="none"/>'; }
  var HAPPY_R = '<path d="M540 218 q12 -14 24 0"/>';
  var EYES = {
    o:      pair(13),
    big:    pair(14.5),
    wide:   pair(15.5),
    small:  '<g class="k-lid"><circle cx="' + LX + '" cy="' + (EY + 1) + '" r="8" fill="' + INK + '" stroke="none"/><circle cx="' + RX + '" cy="' + (EY + 1) + '" r="8" fill="' + INK + '" stroke="none"/></g>',
    side:   pair(12.5, 4, -2),
    inter:  pair(14, 1, -1),
    half:   '<path d="M455 216 a13 13 0 0 0 26 0 z" fill="' + INK + '" stroke="none"/><path d="M539 216 a13 13 0 0 0 26 0 z" fill="' + INK + '" stroke="none"/><path d="M452 216 h32"/><path d="M536 216 h32"/>',
    closed: '<path d="M456 213 q12 9 24 0"/><path d="M540 213 q12 9 24 0"/>',
    happy:  '<path d="M456 218 q12 -14 24 0"/>' + HAPPY_R,
    wink:   lids(eye(LX, EY, 13), '') + HAPPY_R,
    x:      '<path d="M459 205 l18 18 M477 205 l-18 18"/><path d="M543 205 l18 18 M561 205 l-18 18"/>',
    heart:  heart(LX) + heart(RX)
  };
  var GLASSES = '<g fill="none" stroke="' + FRAME + '" stroke-width="5.5" stroke-linejoin="round">' +
    '<rect x="420" y="195" width="84" height="40" rx="11"/><rect x="520" y="195" width="84" height="40" rx="11"/>' +
    '<path d="M504 204 Q512 199 520 204"/><path d="M420 202 L402 200"/><path d="M604 202 L622 200"/></g>';

  // ------------------------------------------------------------------ Mund (unter dem Schnurrbart), Brauen
  var SMILE = 'M496 263 Q512 274 528 263';
  var OPEN = '<path d="M494 260 Q512 290 530 260 Z" fill="' + MOUTH + '"/><path d="M502 275 Q512 283 522 275 Q512 271 502 275 Z" fill="#ff8a8a" stroke="none"/>';
  var BROWS = 'M446 181 Q461 172 477 177 M547 177 Q563 172 578 181';
  var M = {
    happy:      { e: 'o', m: SMILE },
    excited:    { e: 'big', m: OPEN, l: 'M438 336 Q390 332 382 288', r: 'up', ex: '<text x="632" y="140" font-size="50" font-weight="800" fill="#ffd35a" stroke="none">!</text>' },
    interested: { e: 'inter', m: '<ellipse cx="512" cy="266" rx="5" ry="6" fill="' + MOUTH + '"/>', br: 'M446 175 Q461 165 477 171 M547 171 Q563 165 578 175' },
    thinking:   { e: 'side', m: 'M500 266 Q512 262 526 268', br: 'M446 181 Q461 174 477 178 M547 170 Q563 162 578 172', r: 'M586 336 Q630 334 566 304',
                  ex: '<text x="630" y="140" font-size="56" font-weight="800" fill="#ffd35a" stroke="none">?</text>' },
    bored:      { e: 'half', m: 'M498 266 q4 -3 7 0 t7 0 t7 0' },
    yawn:       { e: 'closed', m: '<ellipse cx="512" cy="270" rx="9" ry="12" fill="' + MOUTH + '"/>' },
    sleep:      { e: 'closed', m: 'M502 265 Q512 270 522 265',
                  ex: '<g class="k-zzz" font-weight="800" fill="#cbd5f5" stroke="none"><text x="626" y="150" font-size="38">z</text><text x="640" y="114" font-size="52">Z</text></g>' },
    wink:       { e: 'wink', m: SMILE, r: 'up' },
    giggle:     { e: 'happy', m: OPEN, r: 'up' },
    dizzy:      { e: 'x', m: 'M496 266 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 q4 4 8 0',
                  ex: '<g class="k-zzz" fill="#ffd35a" stroke="none"><circle cx="440" cy="52" r="7"/><circle cx="512" cy="40" r="7"/><circle cx="590" cy="52" r="7"/></g>' },
    surprised:  { e: 'wide', m: '<ellipse cx="512" cy="270" rx="6" ry="8" fill="' + MOUTH + '"/>', br: 'M446 170 Q461 160 477 166 M547 166 Q563 160 578 170' },
    love:       { e: 'heart', m: SMILE, ex: '<g class="k-zzz" fill="#ff8fa8" stroke="none" font-weight="800"><text x="630" y="146" font-size="40">♥</text><text x="366" y="170" font-size="30">♥</text></g>' },
    hum:        { e: 'o', m: 'M502 262 Q512 272 522 262', ex: '<g class="k-zzz" fill="#cbd5f5" stroke="none" font-weight="800"><text x="630" y="150" font-size="46">♪</text></g>' },
    oops:       { e: 'small', m: 'M496 268 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 q4 4 8 0', br: 'M446 179 Q461 178 477 170 M547 170 Q563 178 578 179',
                  ex: '<path d="M630 140 q14 24 0 32 q-14 -8 0 -32z" fill="#7fd0ff" stroke="none"/>' },
    // Begleiter-Modus: gezielt vom Verhalten der Schüler gesteuert
    serious:    { e: 'o', m: 'M501 267 L523 267', br: 'M446 176 Q461 178 477 184 M547 184 Q563 178 578 176' },
    caring:     { e: 'inter', m: 'M500 268 Q512 262 524 268', br: 'M446 184 Q461 176 477 170 M547 170 Q563 176 578 184' },
    proud:      { e: 'happy', m: OPEN, br: 'M446 176 Q461 168 477 173 M547 173 Q563 168 578 176', r: 'up' }
  };

  // ------------------------------------------------------------------ Arme, Bart, Gesicht-Ebene
  var ARM_L = 'M440 336 Q418 366 410 404', ARM_R = 'M584 336 Q606 366 614 404', ARM_R_UP = 'M586 336 Q634 332 642 288';
  function armG(d) {
    var n = d.match(/-?[\d.]+/g).map(Number), cx = n[2], cy = n[3], ex = n[4], ey = n[5];
    var dx = ex - cx, dy = ey - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, hx = ex + dx / L * 13, hy = ey + dy / L * 13;
    return '<path d="' + d + '" fill="none" stroke="' + JACKET + '" stroke-width="32" stroke-linecap="round"/>' +
      '<circle cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="13" fill="' + SKIN + '"/>';
  }
  var BEARD =
    '<path d="M418 212 L418 256 Q428 300 470 318 Q512 330 554 318 Q596 300 606 256 L606 212 Q596 238 576 250 Q546 240 512 244 Q478 240 448 250 Q428 238 418 212 Z" fill="' + HAIR + '"/>' +
    '<ellipse cx="512" cy="266" rx="30" ry="17" fill="' + SKIN + '"/>' +
    '<path d="M474 258 Q492 240 512 250 Q532 240 550 258 Q536 264 512 257 Q488 264 474 258 Z" fill="' + HAIR + '"/>';

  function face(m) {
    var d = M[m] || M.happy, up = d.r === 'up', r = up ? ARM_R_UP : (d.r || ARM_R);
    var inner =
      '<g class="nm-arml">' + armG(d.l || ARM_L) + '</g>' +
      '<g class="nm-armr"><g id="nm-armr" data-up="' + (up ? 1 : 0) + '">' + armG(r) + '</g></g>' +
      BEARD +
      '<path d="' + (d.br || BROWS) + '" fill="none" stroke="' + HAIR + '" stroke-width="9" stroke-linecap="round"/>' +
      '<g class="k-mouth" fill="none" stroke="' + LIP + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' + (d.m.charAt(0) === 'M' ? '<path d="' + d.m + '"/>' : d.m) + '</g>' +
      '<ellipse cx="449" cy="242" rx="14" ry="7" fill="#f4b0a2" opacity=".75"/><ellipse cx="575" cy="242" rx="14" ry="7" fill="#f4b0a2" opacity=".75"/>' + (d.ex || '');
    return '<g transform="' + T + '">' + inner + '</g>' +
      '<g id="kolbi-eyes" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><g transform="' + T + '">' + EYES[d.e] + '</g></g>' +
      '<g transform="' + T + '">' + GLASSES + '</g>';
  }

  // ------------------------------------------------------------------ Figur
  function art() {
    return '' +
      // Schuhe, Hose
      '<ellipse cx="472" cy="514" rx="28" ry="13" fill="' + SHOE + '"/><ellipse cx="552" cy="514" rx="28" ry="13" fill="' + SHOE + '"/>' +
      '<path d="M446 436 L578 436 L575 508 L526 508 L516 470 L508 470 L498 508 L449 508 Z" fill="' + PANTS + '"/>' +
      // Jacke mit Hemd
      '<path d="M430 344 Q440 318 490 314 L534 314 Q584 318 594 344 Q602 394 604 446 Q512 458 420 446 Q422 394 430 344 Z" fill="' + JACKET + '"/>' +
      '<path d="M490 318 L534 318 L512 368 Z" fill="' + SHIRT + '"/>' +
      '<g fill="none" stroke="' + JACKET_D + '" stroke-width="4" stroke-linecap="round">' +
        '<path d="M486 318 L512 370 L540 340"/><path d="M538 318 L512 368 L470 436"/><path d="M450 362 L446 402"/><path d="M574 362 L578 402"/></g>' +
      // Haare hinten, Ohren, Hals, Gesicht
      '<path d="M418 272 C398 250 392 170 410 110 C428 70 480 52 530 56 C580 60 616 90 624 140 C632 190 628 240 606 272 Z" fill="' + HAIR + '"/>' +
      '<g fill="' + HAIR + '"><circle cx="434" cy="112" r="24"/><circle cx="472" cy="82" r="24"/><circle cx="522" cy="74" r="24"/><circle cx="572" cy="84" r="24"/><circle cx="606" cy="120" r="20"/><circle cx="620" cy="166" r="16"/><circle cx="404" cy="160" r="16"/></g>' +
      '<path d="M432 96 Q426 74 440 64 Q440 80 452 86 Z" fill="' + HAIR + '"/>' +
      '<ellipse cx="404" cy="216" rx="13" ry="17" fill="' + SKIN + '"/><ellipse cx="406" cy="217" rx="6" ry="9" fill="' + SKIN_D + '"/>' +
      '<ellipse cx="620" cy="216" rx="13" ry="17" fill="' + SKIN + '"/><ellipse cx="618" cy="217" rx="6" ry="9" fill="' + SKIN_D + '"/>' +
      '<rect x="492" y="292" width="40" height="34" rx="10" fill="' + SKIN_D + '"/>' +
      '<ellipse cx="512" cy="200" rx="90" ry="100" fill="' + SKIN + '"/>' +
      '<ellipse cx="512" cy="232" rx="8" ry="5.5" fill="#f2b39a"/>' +
      // Haare vorn
      '<path d="M420 214 C414 150 440 104 512 98 C576 94 612 130 606 214 L594 214 C596 170 586 146 560 140 C548 136 542 128 540 118 C522 128 476 126 452 140 C434 152 432 180 432 214 Z" fill="' + HAIR + '"/>' +
      '<path d="M420 200 L434 200 L432 232 L418 232 Z M590 200 L604 200 L606 232 L592 232 Z" fill="' + HAIR + '"/>' +
      '<g id="nm-tuft"><path d="M534 100 Q560 92 580 106 Q560 102 548 108 Z" fill="' + HAIR + '"/></g>' +
      '<g fill="none" stroke="' + HAIR_D + '" stroke-width="4" stroke-linecap="round"><path d="M452 112 q24 -22 60 -18"/><path d="M560 112 q24 6 34 30"/><path d="M412 160 q2 -30 18 -50"/></g>';
  }
  function svg() {
    return '<svg viewBox="0 0 106 172" role="img" aria-label="Herr Neumann als Maskottchen">' +
      '<g transform="' + T + '">' + art() + '</g><g id="kk-face">' + face('happy') + '</g></svg>';
  }

  // ------------------------------------------------------------------ Bewegung (Winkearm)
  var S = { root: null, last: null, a: null, wa: 99, eA: null };
  function phys(el, ph, tn, amp) {
    if (S.root !== el.root) { S.root = el.root; S.last = null; S.a = null; S.wa = 99; S.eA = null; }
    if (!S.eA || !S.eA.isConnected) { S.eA = el.root.querySelector('#nm-armr'); S.wa = 99; S.a = null; }
    var dt = S.last === null ? 0.016 : Math.min(0.05, Math.max(0.001, ph.t - S.last)); S.last = ph.t;
    if (S.eA) {
      var up = S.eA.getAttribute('data-up') === '1', talk = el.char && el.char.classList.contains('talk');
      var ta = up ? (talk ? Math.sin(ph.t * 8) * 10 : Math.sin(ph.t * 2) * 3) : (talk ? -5 - Math.sin(ph.t * 8) * 5 : 0);
      if (S.a === null) S.a = ta;
      S.a += (ta - S.a) * Math.min(1, dt * 10);
      if (Math.abs(S.a - S.wa) > 0.3) { S.wa = S.a; S.eA.setAttribute('transform', 'rotate(' + S.a.toFixed(1) + ' 586 336)'); }
    }
  }

  window.KolbiSkins = window.KolbiSkins || {};
  window.KolbiSkins.neumann = {
    name: 'Herr Neumann', emoji: '👓', key: 'neumann', size: { w: 74, h: 120, wm: 60, hm: 97 },
    svg: svg, face: face, phys: phys,
    t: {
      jokeLead: 'Ein Witz von mir: ',
      intro: ['Hallo! Ich bin Herr Neumann. 👓', 'Na ja, eine kleine Ausgabe davon. Ich bin Historiker, erzähle ab und zu etwas aus Geschichte und Politik, gebe Tipps und helfe, wenn du magst.'],
      NICE: [
        'Das machst du richtig gut. Weiter so!',
        'Schön, dass du so konzentriert dabei bist.',
        'Du denkst mit. Das freut mich wirklich.',
        'Ich bin stolz auf dich!',
        'Du kannst mehr, als du denkst.'
      ],
      MOTIVATION: [
        'Fehler sind nicht schlimm. Aus ihnen lernt man am meisten.',
        'Schritt für Schritt. Niemand muss alles auf einmal können.',
        'Fragen sind immer erlaubt. Wirklich immer.',
        'Lies in Ruhe. Gute Gedanken brauchen manchmal ein bisschen Zeit.',
        'Du schaffst das. Ich glaube an dich.'
      ],
      JOKES: [
        ['Warum trage ich eine Brille?', 'Damit ich eure guten Ideen noch besser sehen kann.'],
        ['Warum ist das Geschichtsbuch so entspannt?', 'Für das ist alles schon längst passiert.'],
        ['Warum ist das Mathebuch immer so traurig?', 'Es hat zu viele Probleme.'],
        ['Wie nennt man einen Bumerang, der nicht zurückkommt?', 'Einen Stock.'],
        ['Wozu ist ein Bart im Winter gut?', 'Er ist ein eingebauter Schal.'],
      ],
      FACTS: [
        'Wusstest du? Das Grundgesetz trat 1949 in Kraft.',
        'Wusstest du? Die Berliner Mauer fiel am 9. November 1989.',
        'Wusstest du? „Demokratie“ kommt aus dem Griechischen und bedeutet „Herrschaft des Volkes“.',
        'Wusstest du? Der Bundestag tagt im Reichstagsgebäude in Berlin.',
        'Wusstest du? Karikaturen übertreiben bewusst. Gute Zeichner zeigen damit, was sie für ein Problem halten.',
        'Wusstest du? Das Wort „nachhaltig“ kommt aus der Forstwirtschaft. 1713 forderte Hans Carl von Carlowitz, nur so viel Holz zu schlagen, wie nachwachsen kann.',
        'Wusstest du? Ohne den natürlichen Treibhauseffekt läge die Durchschnittstemperatur der Erde bei etwa −18 °C statt bei 15 °C.',
        'Wusstest du? In der Geschichte unterscheidet man Quellen aus der Zeit selbst und spätere Darstellungen. Beides liest man unterschiedlich kritisch.'
      ],
      GENERIC: [
        'Du kannst mich gern ein Stück verschieben.',
        'Neugier ist der beste Anfang. In der Politik genauso wie in der Geschichte.',
                'Tipp: Lies Aufgaben lieber einmal mehr als einmal zu wenig.',
        'Probier ruhig aus. Hier geht nichts kaputt!'
      ],
      TICKLE: ['Hihi, das kitzelt! 😄', 'Hey, nicht am Bart zupfen! 😄', 'Kitzeln im Unterricht? Na gut, ausnahmsweise.'],
      DIZZY: ['Uff, mir wird ganz schwindelig!', 'Langsam, meine Brille rutscht gleich!', 'Huch! So wild war es nicht mal in der Pause.'],
      BREAK: ['Du arbeitest schon eine Weile. Trink einen Schluck Wasser und streck dich kurz! 💧', 'Eine kleine Pause tut gut. Danach geht es mit frischem Kopf weiter.'],
      BORED: ['Hallo? Ist da jemand?', 'Ich putze mal kurz meine Brille.', 'Ist gerade Pause? Dann trinke ich schnell einen Kaffee. Eine Lösung, übrigens.', '*gähn* Ich hätte jetzt Lust auf ein bisschen Lernen.'],
      CHECKIN: ['Kurze Zwischenfrage: Wie geht es dir gerade?', 'Na, wie fühlst du dich beim Lernen?', 'Ehrlich gefragt: Wie läuft es bei dir?'],
      CHECK_EMP: ['Oh …', 'Ach, das tut mir leid …', 'Das verstehe ich gut …'],
      CHECK_REPLY: {
        good: ['Das freut mich sehr! 🎉', 'Super! Dann machen wir weiter.'],
        ok: ['Das kenne ich. Manchmal braucht man einen Anlauf. Schritt für Schritt klappt es.', 'In Ordnung. Mach in Ruhe weiter. Wenn du hängst, tippe mich an.'],
        tired: ['Dann gönn dir eine kurze Pause: Schultern lockern, einen Schluck trinken, kurz aus dem Fenster schauen.', 'Verständlich. Auch Lehrer brauchen mal Pause.'],
        hard: ['Das ist völlig in Ordnung. Schwierige Aufgaben gehören dazu, und du musst nicht alles sofort können.']
      },
      WAKE: ['Oh! Ich war kurz in Gedanken. Schön, dass du wieder da bist!', 'Da bist du ja wieder! Ich habe nur kurz die Augen ausgeruht.']
    }
  };
})();
