/* Was ist Politik? – Das Spandau-RPG: Spiellogik (Module 1–3), freie Wegfindung, Steuerung für Tastatur, Touch und Tippen. */
(function () {
  'use strict';
  const A = window.WPArt, W = A.W, H = A.H, BLD = A.BLD, TREES = A.TREES, ico = A.ico;

  // ------------------------------------------------------------------ Zustand
  const gameState = { phase: 1, isPaused: true, currentNPC: null, factionsRecruited: 0, inventory: 0, phoneUnlocked: false, module: 1 };
  const player = { x: 415, y: 515, r: 8, speed: 235, face: 1, moving: false, path: null, trail: [] };
  const entities = {
    tractor: { active: true, x: 392, y: 352 },
    journalist: { active: false, x: 710, y: 170, r: 8, speed: 96, face: -1, moving: false, path: null, wait: 0, photo: 0 },
    items: [
      { id: 'item1', active: false, x: 135, y: 428, icon: 'plan', name: 'Bauplan' },
      { id: 'item2', active: false, x: 105, y: 188, icon: 'study', name: 'Lärm-Studie' }
    ],
    npcs: [], followers: []
  };
  const DOORS = { zuhause: { x: 110, y: 140 }, rathaus: { x: 110, y: 570 }, land: { x: 710, y: 140 } };

  const factionData = [
    { id: 'anwohner', x: 118, y: 360, name: 'Die Anwohner', look: 'anwohner',
      dialog: 'Wir Anwohner finden den Skatepark viel zu laut! Parkplätze sind leiser.',
      choices: [
        { text: 'Pech gehabt, wir waren zuerst hier!', correct: false, response: 'Mit dieser Einstellung helfe ich euch bestimmt nicht!' },
        { text: 'Wir können feste Ruhezeiten vereinbaren. Ein Parkplatz bringt nur Abgase.', correct: true, response: 'Das ist ein guter Kompromiss. Ich unterschreibe eure Liste!' }
      ] },
    { id: 'sportler', x: 590, y: 520, name: 'Der Sportverein', look: 'sportler',
      dialog: 'Skater stören nur. Wir brauchen den Platz für ein neues Fußballfeld.',
      choices: [
        { text: 'Weißt du was? Wir können den Platz teilen und ein gemeinsames Sportfest für Spandau planen.', correct: true, response: 'Zusammenarbeit klingt gut. Wir unterstützen euch!' },
        { text: 'Euer Sport ist doch eh langweilig.', correct: false, response: 'So gewinnt ihr keine Freunde. Wir sind raus.' }
      ] },
    { id: 'schueler', x: 720, y: 362, name: 'Die Mitschüler', look: 'schueler',
      dialog: 'Ach, Politik ist langweilig. Ich hab keine Zeit für sowas.',
      choices: [
        { text: 'Wenn wir jetzt nicht zusammenhalten, streichen sie unseren Treffpunkt.', correct: true, response: 'Stimmt, wenn wir uns nicht wehren, entscheiden andere über uns. Ich mache mit!' },
        { text: 'Dann mach doch was du willst.', correct: false, response: 'Na dann, viel Erfolg alleine.' }
      ] }
  ];

  const quizQuestions = [
    { question: '1. Was liegt vor, wenn unterschiedliche Interessen oder Ziele von Gruppen (wie Skater vs. Autofahrer) unvereinbar aufeinanderprallen?',
      choices: [
        { text: 'Der Konflikt', correct: true, isDefinition: true, defTitle: 'der Konflikt', defText: 'Ein Konflikt liegt vor, wenn unterschiedliche Interessen, Meinungen oder Ziele von Personen oder Gruppen aufeinanderprallen und unvereinbar scheinen.' },
        { text: 'Der Kompromiss', correct: false, isDefinition: false }, { text: 'Die Abstimmung', correct: false, isDefinition: false }, { text: 'Die Öffentlichkeit', correct: false, isDefinition: false }] },
    { question: '2. Warum war der erste Schritt am Küchentisch bei den Eltern nicht ausreichend?',
      choices: [
        { text: 'Weil die Eltern gegen euren Protest waren und euch nicht helfen wollten.', correct: false, isDefinition: false },
        { text: 'Weil das Problem dort privat blieb und nicht öffentlich gemacht wurde.', correct: true, isDefinition: true, defTitle: 'die Privatheit & die Öffentlichkeit', defText: 'Das Private betrifft das persönliche, geschützte Umfeld. Das Öffentliche betrifft Themen, die für alle Bürger sichtbar sind und die Gesellschaft als Ganzes angehen.' },
        { text: 'Weil über Fragen des Parks nur Erwachsene mitentscheiden dürfen.', correct: false, isDefinition: false },
        { text: 'Weil am Küchentisch niemand wusste, wem der Park gehört.', correct: false, isDefinition: false }] },
    { question: "3. Was ist die genaue Definition des Begriffs 'Gesellschaft'?",
      choices: [
        { text: 'Die Gesamtheit aller Personen, die in einem Staat bei Wahlen abstimmen dürfen.', correct: false, isDefinition: false },
        { text: 'Die Gesamtheit aller Gesetze und Regeln, die in einem Staat für alle gelten.', correct: false, isDefinition: false },
        { text: 'Eine Gruppe von Menschen, die gemeinsame Merkmale, Interessen und Regeln teilen.', correct: true, isDefinition: true, defTitle: 'die Gesellschaft', defText: 'Eine Gesellschaft ist eine Gruppe von Menschen, die gemeinsame Merkmale, Interessen und Regeln teilen.' },
        { text: 'Die Fähigkeit, den eigenen Willen gegen den Widerstand anderer durchzusetzen.', correct: false, isDefinition: false }] },
    { question: "4. Was versteht man unter dem Begriff 'Macht' in der Politik?",
      choices: [
        { text: 'Das Recht einer Behörde, in einem bestimmten Bezirk Entscheidungen zu treffen.', correct: false, isDefinition: false },
        { text: 'Die Fähigkeit, möglichst viele Menschen von der eigenen Meinung zu überzeugen.', correct: false, isDefinition: false },
        { text: 'Die Gesamtheit der Regeln, an die sich alle in einer Gruppe halten müssen.', correct: false, isDefinition: false },
        { text: 'Die Fähigkeit, den eigenen Willen auch gegen den Widerstand anderer durchzusetzen.', correct: true, isDefinition: true, defTitle: 'die Macht', defText: 'Macht ist die Fähigkeit, den eigenen Willen auch gegen den Widerstand anderer durchzusetzen.' }] },
    { question: '5. Warum war das Abgeordnetenhaus am Ende die falsche Adresse für euren Park?',
      choices: [
        { text: 'Weil das Abgeordnetenhaus auf Landesebene entscheidet, ein lokaler Park aber Sache des Bezirksamts ist.', correct: true, isDefinition: true, defTitle: 'die politischen Ebenen', defText: 'Politik ist in verschiedene Ebenen unterteilt (Kommune/Bezirk, Bundesland, Staat). Jede Ebene hat ganz bestimmte Aufgaben und Zuständigkeiten.' },
        { text: 'Weil das Abgeordnetenhaus nur für Bundesgesetze zuständig ist, nicht für Entscheidungen vor Ort.', correct: false, isDefinition: false },
        { text: 'Weil dort Unterschriften von Bürgern grundsätzlich nicht entgegengenommen werden dürfen.', correct: false, isDefinition: false },
        { text: 'Weil der Park einem privaten Unternehmen gehörte und der Staat nicht eingreifen darf.', correct: false, isDefinition: false }] }
  ];
  let currentQuizIndex = 0, selectedWord = null;

  // ------------------------------------------------------------------ Oberfläche
  const $ = id => document.getElementById(id);
  const ui = { task: $('task-display'), phase: $('phase-display'), overlay: $('dialog-overlay'), title: $('dialog-title'), text: $('dialog-text'), scrollBox: $('dialog-scroll-box'), btn: $('dialog-btn'), choices: $('choices-container'), powerBar: $('power-bar'), powerContainer: $('power-bar-container'), inventoryBar: $('inventory-bar'), phoneIcon: $('phone-icon'), chip: $('dialog-chip'), portrait: $('portrait') };
  ui.phoneIcon.innerHTML = ico('phone'); $('power-ico').innerHTML = ico('power'); $('inv-item1').innerHTML = ico('plan'); $('inv-item2').innerHTML = ico('study');
  const TOK = { home: 'home', plan: 'plan', study: 'study', phone: 'phone', cam: 'camera' };
  function setTask(s) { ui.task.innerHTML = s.replace(/\{(\w+)\}/g, (m, k) => TOK[k] ? ico(TOK[k]) : m); }
  setTask('Schau am Skatepark nach!');

  function drawPortrait(kind) {
    const c = ui.portrait.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 132, 148);
    if (!kind) { ui.portrait.style.display = 'none'; return; }
    ui.portrait.style.display = 'block'; const t = performance.now() / 1000;
    if (kind === 'bagger') { c.setTransform(1.45, 0, 0, 1.45, 66, 118); A.excavator(c, 0, 0, t); return; }
    c.setTransform(3.1, 0, 0, 3.1, 66, 132);
    if (kind === 'skater') A.skater(c, 0, 0, t, false, 1);
    else if (kind === 'journalistin') A.journalist(c, 0, 0, null, t, false, 1, 0);
    else A.person(c, 0, 0, A.LOOKS[kind] || A.LOOKS.mit0, t, false, 1);
  }
  function setHead(icon, portrait) {
    if (portrait) { ui.chip.style.display = 'none'; drawPortrait(portrait); }
    else { drawPortrait(null); if (icon) { ui.chip.innerHTML = ico(icon); ui.chip.style.display = 'block'; } else ui.chip.style.display = 'none'; }
  }

  // ------------------------------------------------------------------ Steuerung
  const inputState = { up: false, down: false, left: false, right: false };
  const joy = { x: 0, y: 0, active: false, id: null };
  const KEYS = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  window.addEventListener('keydown', e => {
    if (ui.overlay.style.display === 'flex') { if ((e.key === 'Enter' || e.key === ' ') && ui.btn.style.display !== 'none' && document.activeElement === document.body) { e.preventDefault(); ui.btn.click(); } return; }
    if (gameState.isPaused) return; const k = KEYS[e.key]; if (k) { inputState[k] = true; player.path = null; e.preventDefault(); }
  });
  window.addEventListener('keyup', e => { const k = KEYS[e.key]; if (k) inputState[k] = false; });
  window.addEventListener('blur', () => { inputState.up = inputState.down = inputState.left = inputState.right = false; joyEnd(); });
  function stopInput() { inputState.up = inputState.down = inputState.left = inputState.right = false; joyEnd(); player.path = null; }

  const joyEl = $('joy'), knob = $('joy-knob');
  function joyMove(e) { const r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = e.clientX - cx, dy = e.clientY - cy; const max = r.width / 2 - 8, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / max); const nx = dx / d, ny = dy / d; knob.style.transform = 'translate(' + (nx * k * max) + 'px,' + (ny * k * max) + 'px)'; const m = d < 10 ? 0 : k; joy.x = nx * m; joy.y = ny * m; }
  function joyEnd() { joy.active = false; joy.x = joy.y = 0; joy.id = null; knob.style.transform = ''; }
  joyEl.addEventListener('pointerdown', e => { e.preventDefault(); if (gameState.isPaused) return; joy.active = true; joy.id = e.pointerId; try { joyEl.setPointerCapture(e.pointerId); } catch (x) { } player.path = null; joyMove(e); });
  joyEl.addEventListener('pointermove', e => { if (joy.active && e.pointerId === joy.id) { e.preventDefault(); joyMove(e); } });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(n => joyEl.addEventListener(n, e => { if (e.pointerId === joy.id || n === 'lostpointercapture') joyEnd(); }));
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || (window.matchMedia && matchMedia('(pointer: coarse)').matches)) document.body.classList.add('touch');

  // ------------------------------------------------------------------ Welt: Hindernisse und Wegfindung
  const BEN = [[300, 282], [440, 282], [250, 214], [608, 214], [690, 330], [176, 436]], LAMP = [[205, 226], [330, 226], [420, 226], [590, 226], [205, 276], [330, 276], [590, 276], [620, 440], [232, 430]];
  const OBST = [BLD.zuhause, BLD.land, BLD.rathaus, BLD.schule, BLD.wohn];
  function isSolid(x, y, r) {
    if (x < r || x > W - r || y < r || y > H - r) return true;
    for (let i = 0; i < OBST.length; i++) { const b = OBST[i]; if (x > b.x - r && x < b.x + b.w + r && y > b.y - r && y < b.y + b.h + r) return true; }
    for (let i = 0; i < TREES.length; i++) { const t = TREES[i], dx = x - t[0], dy = y - (t[1] - 5), rr = r + 5; if (dx * dx + dy * dy < rr * rr) return true; }
    for (let i = 0; i < BEN.length; i++) { const b = BEN[i]; if (x > b[0] - 12 - r && x < b[0] + 12 + r && y > b[1] - 7 - r && y < b[1] + 8 + r) return true; }
    for (let i = 0; i < LAMP.length; i++) { const l = LAMP[i], dx = x - l[0], dy = y - l[1], rr = r + 2.5; if (dx * dx + dy * dy < rr * rr) return true; }
    if (x + r > 484 && x - r < 536) { if (y - r < 224 || y + r > 276) return true; }   // Fluss: nur über die Brücke
    return false;
  }
  const GS = 10, GW = W / GS, GH = H / GS, PATH_R = 9;
  const blocked = new Uint8Array(GW * GH);
  for (let cy = 0; cy < GH; cy++) for (let cx = 0; cx < GW; cx++) blocked[cy * GW + cx] = isSolid(cx * GS + GS / 2, cy * GS + GS / 2, PATH_R) ? 1 : 0;
  const cellOf = (x, y) => Math.max(0, Math.min(GH - 1, Math.floor(y / GS))) * GW + Math.max(0, Math.min(GW - 1, Math.floor(x / GS)));
  const cellXY = i => ({ x: (i % GW) * GS + GS / 2, y: Math.floor(i / GW) * GS + GS / 2 });
  function nearestFree(x, y) {
    let s = cellOf(x, y); if (!blocked[s]) return s;
    const seen = new Uint8Array(GW * GH), q = [s]; seen[s] = 1;
    for (let h = 0; h < q.length; h++) { const i = q[h]; if (!blocked[i]) return i; const cx = i % GW, cy = (i / GW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue; const j = ny * GW + nx; if (!seen[j]) { seen[j] = 1; q.push(j); } } }
    return s;
  }
  const start = nearestFree(player.x, player.y);
  const reach = new Uint8Array(GW * GH);   // Alle Zellen, die vom Start aus erreichbar sind
  (function () { const q = [start]; reach[start] = 1; for (let h = 0; h < q.length; h++) { const i = q[h], cx = i % GW, cy = (i / GW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue; const j = ny * GW + nx; if (!reach[j] && !blocked[j]) { reach[j] = 1; q.push(j); } } } })();
  const reachList = []; for (let i = 0; i < reach.length; i++) if (reach[i]) reachList.push(i);

  function los(x1, y1, x2, y2, r) { const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / 4); for (let i = 1; i <= n; i++) { const t = i / n; if (isSolid(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r)) return false; } return true; }
  function findPath(sx, sy, tx, ty) {
    const s = nearestFree(sx, sy), g = nearestFree(tx, ty); if (s === g) return [{ x: cellXY(g).x, y: cellXY(g).y }];
    const gc = cellXY(g), open = [[0, s]], came = new Map(), cost = new Map(); cost.set(s, 0);
    const hf = i => { const c = cellXY(i), dx = Math.abs(c.x - gc.x), dy = Math.abs(c.y - gc.y); return (dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy)) / GS; };
    const push = (f, i) => { open.push([f, i]); let k = open.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (open[p][0] <= open[k][0]) break; [open[p], open[k]] = [open[k], open[p]]; k = p; } };
    const pop = () => { const top = open[0], last = open.pop(); if (open.length) { open[0] = last; let k = 0; for (; ;) { let l = 2 * k + 1, r = l + 1, m = k; if (l < open.length && open[l][0] < open[m][0]) m = l; if (r < open.length && open[r][0] < open[m][0]) m = r; if (m === k) break; [open[m], open[k]] = [open[k], open[m]]; k = m; } } return top; };
    const done = new Set();
    while (open.length) {
      const [, i] = pop(); if (done.has(i)) continue; done.add(i); if (i === g) break;
      const cx = i % GW, cy = (i / GW) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue; const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue; const j = ny * GW + nx; if (blocked[j]) continue;
        if (dx && dy && (blocked[cy * GW + nx] || blocked[ny * GW + cx])) continue;
        const nc = cost.get(i) + (dx && dy ? Math.SQRT2 : 1); if (!cost.has(j) || nc < cost.get(j)) { cost.set(j, nc); came.set(j, i); push(nc + hf(j), j); }
      }
    }
    if (!came.has(g)) return null;
    const cells = []; for (let k = g; k !== undefined; k = came.get(k)) { cells.push(k); if (k === s) break; } cells.reverse();
    let pts = cells.map(cellXY); pts[0] = { x: sx, y: sy }; const last = cellXY(g); pts[pts.length - 1] = isSolid(tx, ty, 8) ? last : { x: tx, y: ty };
    // Pfad glätten (Sichtlinien)
    const out = [pts[0]]; let a = 0; while (a < pts.length - 1) { let b = pts.length - 1; while (b > a + 1 && !los(pts[a].x, pts[a].y, pts[b].x, pts[b].y, 8.5)) b--; out.push(pts[b]); a = b; }
    out.shift(); return out;
  }

  function tryMove(e, dx, dy) { let m = false; if (!isSolid(e.x + dx, e.y, e.r)) { e.x += dx; m = true; } if (!isSolid(e.x, e.y + dy, e.r)) { e.y += dy; m = true; } return m; }
  function followPath(e, dt, speed) {
    if (!e.path || !e.path.length) return false; const t = e.path[0], dx = t.x - e.x, dy = t.y - e.y, d = Math.hypot(dx, dy), step = speed * dt;
    if (d <= step + .5) { e.x = t.x; e.y = t.y; e.path.shift(); return e.path.length > 0; }
    const mx = dx / d * step, my = dy / d * step; const moved = tryMove(e, mx, my); if (Math.abs(mx) > .05) e.face = mx > 0 ? 1 : -1;
    if (!moved) { e.path = null; return false; } return true;
  }
  const nearRect = (p, b, d) => { const dx = Math.max(b.x - p.x, 0, p.x - (b.x + b.w)), dy = Math.max(b.y - p.y, 0, p.y - (b.y + b.h)); return Math.hypot(dx, dy) < d; };
  function pushFrom(px, py, dist) { const dx = player.x - px, dy = player.y - py, d = Math.hypot(dx, dy) || 1; for (let k = dist; k >= 0; k -= 4) { const nx = player.x + dx / d * k, ny = player.y + dy / d * k; if (!isSolid(nx, ny, player.r)) { player.x = nx; player.y = ny; break; } } player.trail = []; player.path = null; }

  // ------------------------------------------------------------------ Dialoge
  function showDialog(title, text, btnText, opts) {
    opts = opts || {}; gameState.isPaused = true; stopInput();
    ui.choices.style.display = 'none'; ui.btn.style.display = 'block'; ui.title.innerHTML = (opts.icon || opts.portrait) ? title.replace(/^\s*<span class="ico[^>]*>.*?<\/svg><\/span>\s*/, '') : title; ui.text.innerHTML = text; setHead(opts.icon, opts.portrait);
    ui.scrollBox.scrollTop = 0; ui.btn.innerText = btnText || 'Weiter'; ui.btn.onclick = closeDialog; ui.overlay.style.display = 'flex';
  }
  function showChoiceDialog(npc) {
    gameState.isPaused = true; stopInput(); gameState.currentNPC = npc; ui.btn.style.display = 'none'; ui.choices.style.display = 'flex';
    ui.title.innerText = npc.name; ui.text.innerHTML = '<p>' + npc.dialog + '</p><p><em>Was antwortest du?</em></p>'; setHead(null, npc.look); ui.scrollBox.scrollTop = 0; ui.choices.innerHTML = '';
    npc.choices.forEach(choice => { const b = document.createElement('button'); b.className = 'btn choice-btn'; b.innerText = choice.text; b.onclick = () => handleChoice(choice); ui.choices.appendChild(b); });
    ui.overlay.style.display = 'flex';
  }
  function handleChoice(choice) {
    const npc = gameState.currentNPC;
    ui.choices.style.display = 'none'; ui.text.innerHTML = '<p>' + choice.response + '</p>'; ui.scrollBox.scrollTop = 0; ui.btn.style.display = 'block'; ui.btn.innerText = 'Weiter';
    if (choice.correct) {
      ui.btn.onclick = () => {
        npc.active = false; gameState.factionsRecruited++;
        entities.followers.push({ look: npc.look }); entities.followers.push({ look: 'mit' + (gameState.factionsRecruited - 1) });
        ui.powerBar.style.width = (gameState.factionsRecruited / 3) * 100 + '%'; closeDialog();
        if (gameState.factionsRecruited === 3) setTimeout(() => {
          showDialog(ico('people') + ' GESELLSCHAFT &amp; ' + ico('power') + ' MACHT',
            'Du hast Unterschriften von Mitschülern, Sportlern und Anwohnern gesammelt!<br>' +
            "<div class='def-box'><strong>Definition GESELLSCHAFT:</strong> Eine Gesellschaft ist eine Gruppe von Menschen, die gemeinsame Merkmale, Interessen und Regeln teilen.</div>" +
            "<div class='example-box'><strong>Beispiel in Spandau:</strong> Du gehörst zu mehreren Gesellschaften gleichzeitig – als Schüler zur Schulgemeinschaft, als Skater zu eurer Clique und als Bürger zum Bezirk Spandau!</div>" +
            "<div class='def-box'><strong>Definition MACHT:</strong> Macht ist die Fähigkeit, den eigenen Willen auch gegen den Widerstand anderer durchzusetzen.</div>" +
            "<div class='example-box'><strong>Beispiel in Spandau:</strong> Weil ihr euch als große Gruppe verbündet habt, habt ihr nun genug Macht, um etwas zu verändern.</div>", 'Weiter', { icon: 'people' });
          ui.btn.onclick = () => {
            gameState.phase = 6; ui.phase.innerText = 'Modul 1 / 3'; setTask('Ihr habt Macht! Läuft zu dem Ort, wo ihr das Problem lösen könnt!');
            showDialog(ico('scale') + ' Wo wollt ihr mit den Unterschriften hin?', 'Ihr haltet den großen Unterschriftenstapel in euren Händen. Aber wo müsst ihr jetzt auf der Karte hin, um den Beschluss zu erwirken?<br><br><em>Lauft zu dem Gebäude, das für einen lokalen Park zuständig ist!</em>', 'Los geht’s', { icon: 'scale' });
          };
        }, 500);
      };
    } else { ui.btn.onclick = () => { npc.cool = 2; pushFrom(npc.x, npc.y, 40); closeDialog(); }; }
  }

  function triggerSmartphone() {
    if (!gameState.phoneUnlocked) return;
    showDialog(ico('phone') + ' SOCIAL MEDIA POST',
      'Du hast den Bauplan und die Lärm-Studie online gestellt! Innerhalb von Minuten wird der Beitrag tausendmal geteilt.<br>' +
      "<div class='def-box'><strong>Definition ÖFFENTLICHKEIT:</strong> Die Öffentlichkeit ist der Raum, in dem gesellschaftliche und politische Themen für alle sichtbar und diskutierbar werden.</div>" +
      "<div class='example-box'><strong>Beispiel in Spandau:</strong> Euer Problem ist nun nicht mehr privat am Küchentisch – ganz Spandau redet darüber. Fange die Journalistin {CAM} ein, sie ist irgendwo in Spandau unterwegs!</div>".replace('{CAM}', ico('camera')), 'Weiter', { icon: 'phone' });
    ui.btn.onclick = () => {
      ui.overlay.style.display = 'none'; ui.phoneIcon.classList.remove('active'); gameState.phase = 4; ui.phase.innerText = 'Modul 1 / 3';
      setTask('Finde die Journalistin {cam}! Sie ist irgendwo in Spandau unterwegs.'); entities.journalist.active = true; gameState.isPaused = false;
    };
  }
  window.triggerSmartphone = triggerSmartphone;

  function closeDialog() {
    ui.overlay.style.display = 'none'; gameState.currentNPC = null;
    if (gameState.phase === 1 && !entities.tractor.active) { gameState.phase = 2; ui.phase.innerText = 'Modul 1 / 3'; setTask('Gehe nach Hause zu deinen Eltern {home} oben links und berichte davon!'); }
    else if (gameState.phase === 2.5) { gameState.phase = 3; ui.phase.innerText = 'Modul 1 / 3'; setTask('Sammle Beweis 1: Hole dir den Bauplan {plan} beim Rathaus!'); ui.inventoryBar.style.display = 'flex'; entities.items[0].active = true; }
    gameState.isPaused = false;
  }
  window.closeDialog = closeDialog;

  // ------------------------------------------------------------------ Modul 2: Wissenstest und Glossar
  function startModule2() { gameState.module = 2; ui.phase.innerText = 'Modul 2 / 3'; setTask('Wissenstest &amp; Glossar-Einträge'); currentQuizIndex = 0; showQuizQuestion(); }
  function shuffleArray(array) { const arr = [...array]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  function showQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) { startModule3(); return; }
    const q = quizQuestions[currentQuizIndex], sh = shuffleArray(q.choices);
    gameState.isPaused = true; ui.btn.style.display = 'none'; ui.choices.style.display = 'flex';
    ui.title.innerHTML = 'Modul 2: Frage ' + (currentQuizIndex + 1) + ' von ' + quizQuestions.length; setHead('quiz');
    ui.text.innerHTML = '<p><strong>' + q.question + '</strong></p><div id="fbmsg"></div>'; ui.scrollBox.scrollTop = 0; ui.choices.innerHTML = '';
    sh.forEach(ch => {
      const b = document.createElement('button'); b.className = 'btn choice-btn'; b.innerText = ch.text;
      b.onclick = () => {
        if (ch.correct) { b.classList.add('correct'); $('fbmsg').innerHTML = '<div class="fb ok">Richtig!</div>'; ui.choices.querySelectorAll('button').forEach(x => x.disabled = true); setTimeout(() => { if (ch.isDefinition) showGlossarNotice(ch.defTitle, ch.defText); else { currentQuizIndex++; showQuizQuestion(); } }, 650); }
        else { b.classList.add('wrong'); b.disabled = true; $('fbmsg').innerHTML = '<div class="fb bad">Das war leider falsch. Probiere es noch einmal!</div>'; }
      };
      ui.choices.appendChild(b);
    });
    ui.overlay.style.display = 'flex';
  }
  function showGlossarNotice(title, text) {
    ui.choices.style.display = 'none'; ui.btn.style.display = 'block'; ui.title.innerHTML = 'Glossar-Auftrag'; setHead('book');
    ui.text.innerHTML = '<p><strong>Richtig!</strong> Da dies eine wichtige Definition war, gehört sie in deinen Hefter:</p><div class="glossar-box"><p style="margin:0 0 6px;color:var(--primary);font-weight:800;">Übertrage dir diesen Begriff mit Definition (Erklärung) in dein Glossar:</p><p style="margin:0;"><strong>' + title + ':</strong> ' + text + '</p></div>';
    ui.scrollBox.scrollTop = 0; ui.btn.innerText = 'Ins Glossar übertragen & Weiter'; ui.btn.onclick = () => { currentQuizIndex++; showQuizQuestion(); };
  }

  // ------------------------------------------------------------------ Modul 3: Lückentext
  function startModule3() {
    gameState.module = 3; ui.phase.innerText = 'Modul 3 / 3'; setTask('Abschluss: Politik-Begriffe im Lückentext anwenden');
    gameState.isPaused = true; ui.btn.style.display = 'none'; ui.choices.style.display = 'none'; ui.title.innerHTML = 'Modul 3: Lückentext ausfüllen'; setHead('puzzle');
    const raw = ['Gesellschaft', 'Regeln und Gesetze', 'Konflikte', 'Öffentlichkeit', 'Macht', 'Ebene']; let sh;
    do { sh = shuffleArray(raw); } while (sh[0] === 'Gesellschaft' && sh[1] === 'Regeln und Gesetze');
    const pool = sh.map(i => '<div class="drag-item" data-w="' + i + '">' + i + '</div>').join('');
    const dz = a => '<span class="dropzone" data-answer="' + a + '">?</span>';
    ui.text.innerHTML = '<p>Tippe zuerst auf einen Begriff unten und danach auf die passende Lücke (?):</p><p style="line-height:2.4;font-size:1.02rem;">Politik regelt das Zusammenleben in einer ' + dz('Gesellschaft') + ' durch verbindliche ' + dz('Regeln und Gesetze') + '. Dabei entstehen oft ' + dz('Konflikte') + ', wenn Interessen aufeinanderprallen. Um diese zu lösen, machen Bürger ihre Anliegen in der ' + dz('Öffentlichkeit') + ' sichtbar und erlangen durch Zusammenschluss die nötige ' + dz('Macht') + ', um auf der richtigen politischen ' + dz('Ebene') + ' etwas zu verändern.</p><div class="drag-items-container" id="drag-items-pool">' + pool + '</div><div id="m3msg"></div>';
    ui.text.querySelectorAll('.drag-item').forEach(el => el.onclick = () => selectWord(el, el.dataset.w));
    ui.text.querySelectorAll('.dropzone').forEach(el => el.onclick = () => fillZone(el));
    ui.scrollBox.scrollTop = 0; selectedWord = null;
    const check = document.createElement('button'); check.className = 'btn'; check.innerText = 'Lösung prüfen'; check.onclick = checkTapDropSolution;
    ui.choices.innerHTML = ''; ui.choices.appendChild(check); ui.choices.style.display = 'block'; ui.overlay.style.display = 'flex';
  }
  function selectWord(el, word) { document.querySelectorAll('.drag-item').forEach(i => i.classList.remove('selected')); el.classList.add('selected'); selectedWord = word; $('m3msg').innerHTML = ''; }
  function fillZone(zone) {
    if (!selectedWord) { if (zone.classList.contains('filled')) { zone.innerText = '?'; zone.classList.remove('filled'); return; } $('m3msg').innerHTML = '<div class="fb bad">Bitte wähle zuerst unten einen Begriff aus!</div>'; return; }
    zone.innerText = selectedWord; zone.classList.add('filled'); selectedWord = null; document.querySelectorAll('.drag-item').forEach(i => i.classList.remove('selected')); $('m3msg').innerHTML = '';
  }
  function checkTapDropSolution() {
    let ok = true; document.querySelectorAll('.dropzone').forEach(z => { if (z.innerText !== z.getAttribute('data-answer')) ok = false; });
    if (ok) {
      showDialog(ico('party') + ' GESAMTSIEG &amp; HEFTER-EINTRAG',
        "Fantastisch! Du hast alle Lücken perfekt ausgefüllt und das Spandau-RPG erfolgreich gemeistert.<br><br><div class='glossar-box'><p style='margin:0 0 6px;color:var(--primary);font-weight:800;'>Hefter-Eintrag (Zusammenfassung):</p><p style='margin:0;'><strong>Politik</strong> regelt das Zusammenleben in einer <strong>Gesellschaft</strong> durch verbindliche <strong>Regeln und Gesetze</strong>. Dabei entstehen oft <strong>Konflikte</strong>, wenn Interessen aufeinanderprallen. Um diese zu lösen, machen Bürger ihre Anliegen in der <strong>Öffentlichkeit</strong> sichtbar und erlangen durch Zusammenschluss die nötige <strong>Macht</strong>, um auf der richtigen politischen <strong>Ebene</strong> etwas zu verändern.</p></div>", 'Spiel neu starten', { icon: 'party' });
      ui.btn.onclick = () => location.reload();
    } else $('m3msg').innerHTML = '<div class="fb bad">Nicht ganz richtig! Überprüfe noch einmal, welcher Begriff in welche Lücke gehört.</div>';
  }

  // ------------------------------------------------------------------ Journalistin: wandert frei durch ganz Spandau (Fluss nur über die Brücke, nie durch Häuser)
  const SPOTS = [[300, 250], [380, 250], [510, 250], [640, 250], [105, 200], [230, 330], [230, 520], [610, 400], [610, 540], [700, 190], [720, 345], [455, 430], [415, 515], [180, 400], [120, 500]];
  function journalistPlan() {
    const j = entities.journalist; let tx, ty;
    for (let tries = 0; tries < 12; tries++) {
      if (Math.random() < .5) { const s = SPOTS[(Math.random() * SPOTS.length) | 0]; tx = s[0] + (Math.random() - .5) * 40; ty = s[1] + (Math.random() - .5) * 24; }
      else { const c = cellXY(reachList[(Math.random() * reachList.length) | 0]); tx = c.x; ty = c.y; }
      const c2 = cellXY(nearestFree(tx, ty)); if (!reach[cellOf(c2.x, c2.y)]) continue; if (Math.hypot(c2.x - j.x, c2.y - j.y) < 140) continue; tx = c2.x; ty = c2.y;
      const p = findPath(j.x, j.y, tx, ty); if (p && p.length) { j.path = p; return; }
    }
    j.wait = 1;
  }
  function updateJournalist(dt) {
    const j = entities.journalist; j.moving = false;
    if (j.photo > 0) { j.photo += dt * .9; if (j.photo >= 1) j.photo = 0; }
    if (j.wait > 0) { j.wait -= dt; if (j.wait <= 0) journalistPlan(); return; }
    if (!j.path || !j.path.length) { if (Math.random() < .7) { j.photo = .001; j.wait = 1.6 + Math.random() * 1.6; } else j.wait = .4; return; }
    j.moving = followPath(j, dt, j.speed) || (j.path && j.path.length > 0);
    if (!j.path || !j.path.length) { j.moving = false; j.wait = .2; if (Math.random() < .75) { j.photo = .001; j.wait = 1.8 + Math.random() * 1.4; } }
  }

  // ------------------------------------------------------------------ Update
  let tapMark = null;
  function update(dt) {
    if (gameState.isPaused) return;
    // Eingabe
    let mx = 0, my = 0; const kx = (inputState.right ? 1 : 0) - (inputState.left ? 1 : 0), ky = (inputState.down ? 1 : 0) - (inputState.up ? 1 : 0);
    if (kx || ky) { const d = Math.hypot(kx, ky); mx = kx / d; my = ky / d; } else if (joy.active && (joy.x || joy.y)) { mx = joy.x; my = joy.y; }
    const px = player.x, py = player.y;
    if (mx || my) { player.path = null; tryMove(player, mx * player.speed * dt, my * player.speed * dt); if (Math.abs(mx) > .15) player.face = mx > 0 ? 1 : -1; }
    else if (player.path) { followPath(player, dt, player.speed); if (!player.path || !player.path.length) tapMark = null; }
    player.moving = Math.hypot(player.x - px, player.y - py) > .05;
    if (player.moving) { const lt = player.trail[0]; if (!lt || Math.hypot(lt.x - player.x, lt.y - player.y) >= 5) { player.trail.unshift({ x: player.x, y: player.y }); if (player.trail.length > 160) player.trail.pop(); } }

    // Phase 1: Bagger
    if (gameState.phase === 1 && entities.tractor.active && Math.hypot(player.x - entities.tractor.x, player.y - entities.tractor.y) < 50) {
      entities.tractor.active = false;
      showDialog(ico('bagger') + ' KONFLIKT AM SKATEPARK', "Du trittst an den Bagger heran. Der Fahrer schnauft: 'Hau ab Kleine(r)! Hier wird alles plattgemacht für neue Parkplätze. Eure Skater-Träume interessieren hier keinen.'<br><div class='def-box'><strong>Definition KONFLIKT:</strong> Ein Konflikt liegt vor, wenn unterschiedliche Interessen, Meinungen oder Ziele von Personen oder Gruppen aufeinanderprallen und unvereinbar scheinen.</div><div class='example-box'><strong>Beispiel in Spandau:</strong> Du willst ungestört skaten, aber die Autofahrer und Anwohner wollen mehr Parkplätze. Genau hier prallen eure Interessen aufeinander.</div>", 'Weiter', { portrait: 'bagger' });
    }
    // Phase 2: Zuhause
    if (gameState.phase === 2 && nearRect(player, BLD.zuhause, 15)) {
      gameState.phase = 2.5; pushFrom(DOORS.zuhause.x, DOORS.zuhause.y - 40, 26);
      showDialog(ico('home') + ' PRIVAT vs. ÖFFENTLICHKEIT', "Völlig aufgelöst kommst du nach Hause und erzählst es deinen Eltern in der Küche. Sie schütteln den Kopf: 'Das ist ja schrecklich, aber solange du dich nur hier am Küchentisch aufregst, bleibt euer Problem völlig <strong>privat</strong>. Wenn du etwas retten willst, musst du damit an die Öffentlichkeit! Besorge dir am besten als Erstes die amtlichen Baupläne drüben beim Rathaus.'<br><div class='def-box'><strong>Definition PRIVAT vs. ÖFFENTLICH:</strong> Das Private betrifft das persönliche, geschützte Umfeld (Familie/Wohnung). Das Öffentliche betrifft Themen, die für alle Bürger sichtbar sind und die Gesellschaft als Ganzes angehen.</div><div class='example-box'><strong>Beispiel in Spandau:</strong> Am Küchentisch zu meckern ist privat. Erst wenn du mit Beweisen nach draußen gehst, machst du das Problem öffentlich.</div>", 'Weiter', { icon: 'home' });
    }
    // Phase 3: Beweise
    if (gameState.phase === 3) {
      const i0 = entities.items[0], i1 = entities.items[1];
      if (i0.active && Math.hypot(player.x - i0.x, player.y - i0.y) < 26) {
        i0.active = false; gameState.inventory++; $('inv-item1').classList.add('found');
        showDialog(ico('rathaus') + ' Amtlicher Tipp im Rathaus', "Die Verwaltungsfachangestellte lächelt dich an: 'Finde ich toll, dass du dich so für euren Jugendtreff einsetzt! Hier hast du den offiziellen Bauplan. Und als kleiner Tipp: Es gibt hier im Haus auch eine Akte über eine Lärmstudie wegen der Bauarbeiten – such die mal oben zwischen deinem Zuhause und den Anwohnern, das ist ein Super-Argument für deine Verhandlungen!'<br><br><strong>Nächster Schritt:</strong> Hole dir das Lärmgutachten " + ico('study') + ' oben links!', 'Weiter', { icon: 'rathaus' });
        ui.btn.onclick = () => { closeDialog(); i1.active = true; setTask('Hole das Lärmgutachten {study} zwischen Zuhause und Anwohnern!'); };
      } else if (i1.active && Math.hypot(player.x - i1.x, player.y - i1.y) < 26) {
        i1.active = false; gameState.inventory++; $('inv-item2').classList.add('found'); gameState.phoneUnlocked = true; ui.phoneIcon.classList.add('active'); setTask('Alle Beweise da! Tippe oben auf das Smartphone {phone}!');
        showDialog(ico('study') + ' Lärmschutzgutachten gefunden!', 'Perfekt! Du hast nun beide Beweise (Bauplan und Lärm-Studie).<br><br><strong>Tippe jetzt oben auf das blinkende Smartphone-Symbol ' + ico('phone') + '</strong>, um die Beweise über Social Media zu teilen!', 'Weiter', { icon: 'study' });
      }
    }
    // Phase 4: Journalistin
    if (gameState.phase === 4 && entities.journalist.active) {
      const j = entities.journalist; updateJournalist(dt);
      if (Math.hypot(player.x - j.x, player.y - j.y) < 30) {
        j.active = false;
        showDialog(ico('camera') + ' ÖFFENTLICHKEIT HERGESTELLT', "Die Journalistin liest deinen Post, fängt dich ab und tippt in ihr Tablet: 'Großartig! Ich schreibe sofort einen fetten Artikel für die Lokalzeitung. Jetzt weiß es die ganze Stadt!'<br><div class='def-box'><strong>Definition ÖFFENTLICHKEIT:</strong> Die Öffentlichkeit ist der Raum, in dem gesellschaftliche und politische Themen für alle sichtbar und diskutierbar werden.</div><div class='example-box'><strong>Beispiel in Spandau:</strong> Durch den Zeitungsartikel wissen jetzt alle Spandauer Bescheid. Die Politiker können den Abriss nicht mehr im Geheimen durchziehen.</div>", 'Weiter', { portrait: 'journalistin' });
        ui.btn.onclick = () => {
          closeDialog(); gameState.phase = 5; ui.phase.innerText = 'Modul 1 / 3'; setTask('Sammle Unterschriften: Überzeuge Anwohner, Lily-Braun-Gymnasium und Sportverein!');
          ui.inventoryBar.style.display = 'none'; ui.powerContainer.style.display = 'block'; factionData.forEach(f => entities.npcs.push(Object.assign({}, f, { active: true, cool: 0, face: 1 })));
        };
      }
    }
    // Phase 5: Unterschriften
    if (gameState.phase === 5) {
      for (const npc of entities.npcs) { if (npc.cool > 0) npc.cool -= dt; if (npc.active && npc.cool <= 0 && Math.hypot(player.x - npc.x, player.y - npc.y) < 34) { showChoiceDialog(npc); break; } }
      entities.npcs.forEach(n => { if (n.active) n.face = player.x < n.x ? -1 : 1; });
    }
    // Phase 6: richtiges Gebäude finden
    if (gameState.phase === 6) {
      const nearLand = nearRect(player, BLD.land, 15);
      if (!nearRect(player, BLD.land, 50)) gameState.landLock = false;
      if (nearLand) {
        if (gameState.landLock) return;
        // Meldung nur einmal pro Besuch; Figur steht danach sicher vor dem Haus (auch wenn sie in der Ecke stand)
        gameState.landLock = true; const f = cellXY(nearestFree(DOORS.land.x - 20, DOORS.land.y + 34)); player.x = f.x; player.y = f.y; player.trail = []; player.path = null;
        showDialog(ico('hall') + ' Falsche politische Ebene!', "Du betrittst das Abgeordnetenhaus oben rechts, aber man winkt ab: 'Wir machen Gesetze für ganz Berlin, aber um deinen lokalen Park in Spandau kümmert sich das Bezirksamt vor Ort! Suche die richtige Institution.'<br><div class='def-box'><strong>Definition POLITISCHE EBENEN:</strong> Politik ist in verschiedene Ebenen unterteilt (Kommune/Bezirk, Bundesland, Staat). Jede Ebene hat ganz bestimmte Aufgaben und Zuständigkeiten.</div>", 'Weiter', { icon: 'hall' });
      } else if (nearRect(player, BLD.rathaus, 15)) {
        gameState.phase = 7;
        showDialog(ico('rathaus') + ' REGELN &amp; GESETZE (Rathaus Spandau)', "Du legst dem Bürgermeister euren riesigen Unterschriftenstapel auf den Tisch. Er schluckt schwer: 'In Ordnung, der öffentliche Druck ist zu groß...'<br><div class='def-box'><strong>Definition REGELN &amp; GESETZE:</strong> Regeln und Gesetze sind verbindliche Vorgaben einer Gesellschaft, an die sich alle halten müssen, um das Zusammenleben zu ordnen.</div><div class='example-box'><strong>Beispiel in Spandau:</strong> Die Bezirksverordnetenversammlung erlässt einen offiziellen Beschluss: Der Parkplatzbau wird gestoppt. Der Skatepark bleibt für alle verbindlich geschützt!</div><br>" + ico('party') + ' <strong>MODUL 1 ERFOLGREICH GESCHAFFT!</strong>', 'Weiter zu Modul 2 (Wissenstest)', { icon: 'party' });
        ui.btn.onclick = () => { closeDialog(); startModule2(); };
      }
    }
  }

  // ------------------------------------------------------------------ Darstellung (Kamera, Zeichnen)
  const canvas = $('gameCanvas'), ctx = canvas.getContext('2d'), stage = $('stage');
  let dpr = 1, cw = 0, ch = 0, zoom = 1, bg = null, bgScale = 0, camX = W / 2, camY = H / 2;
  function fitBody() { const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight; if (vh > 100) document.body.style.height = Math.round(vh) + 'px'; }  // iOS/Safari: 100vh ist im Querformat höher als der sichtbare Bereich
  function layout() {
    fitBody(); dpr =Math.min(window.devicePixelRatio || 1, 2); cw = stage.clientWidth; ch = stage.clientHeight; canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    const fit = Math.min(cw / W, ch / H), minZ = cw < 600 ? .95 : .8; zoom = fit >= minZ ? fit : minZ;
    if (H * zoom < ch * .9) zoom = Math.min(ch / H, zoom * 1.6);            // hohes Format (Handy/Tablet hochkant): Höhe ausfüllen, Kamera folgt seitlich
    else if (W * zoom < cw * .75) zoom = Math.min(cw / W, zoom * 1.35);     // sehr breites Fenster: Breite besser nutzen
    const s = Math.min(3, zoom * dpr); if (!bg || Math.abs(s - bgScale) > .05) { bgScale = s; bg = document.createElement('canvas'); bg.width = Math.ceil(W * s); bg.height = Math.ceil(H * s); const c = bg.getContext('2d'); c.scale(s, s); A.drawMap(c); }
    camSnap = true;
  }
  let camSnap = true;
  window.addEventListener('resize', layout); window.addEventListener('orientationchange', () => { setTimeout(layout, 200); setTimeout(layout, 700); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);
  window.addEventListener('load', () => { setTimeout(layout, 250); setTimeout(layout, 900); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (stage.clientWidth !== cw || stage.clientHeight !== ch) layout(); }).observe(stage);

  function updateCamera(dt) {
    const hw = cw / zoom / 2, hh = ch / zoom / 2; let tx = player.x, ty = player.y - 14;
    tx = W <= hw * 2 ? W / 2 : Math.max(hw, Math.min(W - hw, tx)); ty = H <= hh * 2 ? H / 2 : Math.max(hh, Math.min(H - hh, ty));
    if (camSnap) { camX = tx; camY = ty; camSnap = false; } else { const k = 1 - Math.pow(.0005, dt); camX += (tx - camX) * k; camY += (ty - camY) * k; }
  }

  function objectives() {
    const o = [], p = gameState.phase;
    if (p === 1 && entities.tractor.active) o.push([entities.tractor.x, entities.tractor.y - 62]);
    if (p === 2) o.push([DOORS.zuhause.x, DOORS.zuhause.y + 8]);
    if (p === 3) entities.items.forEach(i => { if (i.active) o.push([i.x, i.y - 30]); });
    if (p === 4 && entities.journalist.active) o.push([entities.journalist.x, entities.journalist.y - 46]);
    if (p === 5) entities.npcs.forEach(n => { if (n.active) o.push([n.x, n.y - 50]); });
    return o;
  }

  let lastT = 0;
  function draw(t, dt) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#3f7a3a'; ctx.fillRect(0, 0, cw, ch);
    updateCamera(dt);
    const ox = cw / 2 - camX * zoom, oy = ch / 2 - camY * zoom;
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, dpr * ox, dpr * oy);
    ctx.drawImage(bg, 0, 0, W, H);
    // Baustelle um den Bagger
    const tr = entities.tractor;
    // sortierte Figuren
    const list = [];
    TREES.forEach((tp, i) => list.push([tp[1], () => A.tree(ctx, tp[0], tp[1], i)]));
    if (tr.active) { list.push([tr.y - 8, () => { A.cone(ctx, tr.x - 52, tr.y + 6); A.cone(ctx, tr.x + 50, tr.y + 10); A.excavator(ctx, tr.x, tr.y, t); }]); list.push([tr.y + 18, () => A.sign(ctx, tr.x - 70, tr.y + 24)]); }
    entities.npcs.forEach(n => { if (n.active) list.push([n.y, () => A.person(ctx, n.x, n.y, A.LOOKS[n.look], t, false, n.face)]); });
    const j = entities.journalist; if (j.active) list.push([j.y, () => A.journalist(ctx, j.x, j.y, null, t, j.moving, j.face, j.photo)]);
    entities.followers.forEach((f, i) => { const idx = (i + 1) * 7, tp = idx < player.trail.length ? player.trail[idx] : (player.trail.length ? player.trail[player.trail.length - 1] : { x: player.x - 20 * (i + 1) * player.face, y: player.y }); const mv = player.moving; const fx = tp.x, fy = tp.y; list.push([fy, () => A.person(ctx, fx, fy, A.LOOKS[f.look], t + i, mv, player.face)]); });
    list.push([player.y, () => A.skater(ctx, player.x, player.y, t, player.moving, player.face, player.moving)]);
    list.sort((a, b) => a[0] - b[0]).forEach(l => l[1]());
    entities.items.forEach(it => { if (it.active) A.pickup(ctx, it.icon, it.x, it.y, t); });
    objectives().forEach(o => A.marker(ctx, o[0], o[1], t));
    if (tapMark) { const a = (t * 2) % 1; ctx.strokeStyle = 'rgba(255,255,255,' + (1 - a).toFixed(2) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(tapMark.x, tapMark.y, 6 + a * 14, 3 + a * 7, 0, 0, 7); ctx.stroke(); }
    // Zielpfeile am Rand, wenn das Ziel nicht im Bild ist
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    objectives().forEach(o => {
      const sx = o[0] * zoom + ox, sy = o[1] * zoom + oy; if (sx > 14 && sx < cw - 14 && sy > 14 && sy < ch - 14) return;
      const cx = cw / 2, cy = ch / 2, dx = sx - cx, dy = sy - cy, k = Math.min((cw / 2 - 26) / Math.abs(dx || 1), (ch / 2 - 26) / Math.abs(dy || 1)), ex = cx + dx * k, ey = cy + dy * k, ang = Math.atan2(dy, dx);
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(ang); ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, -10); ctx.lineTo(-3, 0); ctx.lineTo(-8, 10); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore();
    });
  }

  // Tippen/Klicken auf die Karte: Spieler läuft auf kürzestem Weg dorthin (nicht über Wasser oder durch Häuser)
  canvas.addEventListener('pointerdown', e => {
    if (gameState.isPaused) return; const r = canvas.getBoundingClientRect(), wx = (e.clientX - r.left - (cw / 2 - camX * zoom)) / zoom, wy = (e.clientY - r.top - (ch / 2 - camY * zoom)) / zoom;
    if (wx < 0 || wy < 0 || wx > W || wy > H) return; const c = cellXY(nearestFree(wx, wy)), tx = isSolid(wx, wy, 8) ? c.x : wx, ty = isSolid(wx, wy, 8) ? c.y : wy;
    const p = findPath(player.x, player.y, tx, ty); if (p && p.length) { player.path = p; tapMark = { x: tx, y: ty }; const h = $('hint-tap'); if (h) h.style.opacity = 0; }
  });

  function frame(ts) { requestAnimationFrame(frame); const t = ts / 1000, dt = Math.min(.033, Math.max(0, t - lastT)); lastT = t; update(dt); draw(t, dt); }
  layout();
  setTimeout(() => { const h = $('hint-tap'); if (h) h.style.opacity = 0; }, 9000);

  showDialog(ico('school') + ' Schulschluss im Lily-Braun-Gymnasium', 'Endlich ist die Schule aus und du möchtest eine Runde skaten. Doch was ist denn da vorne an eurem Skatepark los? Da steht ein riesiger Bagger...<br><br><strong>Aufgabe:</strong> Schau mal lieber nach, was dort passiert!', 'Nachschauen gehen!', { portrait: 'skater' });
  requestAnimationFrame(frame);

  window.__g = { gameState, player, entities, isSolid, findPath, reach, cellOf, nearestFree, blocked, GW, GH, ui, factionData, DOORS };
})();
