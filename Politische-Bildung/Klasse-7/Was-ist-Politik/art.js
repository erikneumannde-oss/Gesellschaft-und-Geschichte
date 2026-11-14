/* Grafik für „Was ist Politik? – Das Spandau-RPG“: Symbole (SVG), Karte, Figuren. Alles selbst gezeichnet, keine Emojis, keine Fremdbibliothek. */
(function () {
  'use strict';
  const W = 850, H = 600;

  // ------------------------------------------------------------------ Symbole (SVG, auch für Canvas)
  const S = (body, vb) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || '0 0 24 24') + '" aria-hidden="true">' + body + '</svg>';
  const ICONS = {
    skate: S('<rect x="2" y="15" width="20" height="3.2" rx="1.6" fill="#1f9d8a" stroke="#0b5b50" stroke-width="1.2"/><circle cx="7" cy="20" r="1.8" fill="#37474f"/><circle cx="17" cy="20" r="1.8" fill="#37474f"/><circle cx="12" cy="6.2" r="3.2" fill="#f2c9a0" stroke="#7a4b21" stroke-width="1.2"/><path d="M8.6 5.6a3.4 3.4 0 0 1 6.8 0z" fill="#e53935" stroke="#7f1d1d" stroke-width="1"/><path d="M12 9.6v4M8.5 11.5l3.5-1 3.5 1" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" fill="none"/>'),
    home: S('<path d="M3 11.6 12 4l9 7.6" fill="none" stroke="#a24a12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.6 10.6V20h12.8v-9.4L12 5.2z" fill="#fde7c3" stroke="#a24a12" stroke-width="1.5" stroke-linejoin="round"/><rect x="10" y="13" width="4" height="7" rx=".8" fill="#2563eb"/><rect x="6.8" y="12" width="2.4" height="2.4" fill="#9ed2f5" stroke="#a24a12" stroke-width=".6"/>'),
    plan: S('<rect x="3" y="5" width="18" height="14" rx="1.6" fill="#2f6fd6" stroke="#173a7a" stroke-width="1.5"/><path d="M6 9h6M6 12h10M6 15h5" stroke="#d6e7ff" stroke-width="1.3" stroke-linecap="round"/><rect x="14" y="8" width="4.2" height="3" fill="none" stroke="#d6e7ff" stroke-width="1.2"/>'),
    study: S('<path d="M5 3h10l4 4v14H5z" fill="#fff" stroke="#374151" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 3v4h4" fill="#e5e7eb" stroke="#374151" stroke-width="1.3" stroke-linejoin="round"/><rect x="7.5" y="13" width="2.2" height="5" fill="#e67e22"/><rect x="11" y="10.5" width="2.2" height="7.5" fill="#c0392b"/><rect x="14.5" y="14.5" width="2.2" height="3.5" fill="#f1c40f"/>'),
    phone: S('<rect x="6.5" y="2.5" width="11" height="19" rx="2.4" fill="#263238" stroke="#0f172a" stroke-width="1.3"/><rect x="8" y="5" width="8" height="12" rx="1" fill="#7dd3fc"/><circle cx="12" cy="19.2" r="1" fill="#90a4ae"/><path d="M9.5 8.5h5M9.5 11h5M9.5 13.5h3" stroke="#0369a1" stroke-width="1" stroke-linecap="round"/>'),
    camera: S('<path d="M3 8.5h4l1.5-2.5h7L17 8.5h4V19H3z" fill="#455a64" stroke="#1c262b" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="4" fill="#90caf9" stroke="#1c262b" stroke-width="1.4"/><circle cx="12" cy="13.5" r="1.6" fill="#1e3a8a"/><rect x="17.5" y="10" width="2" height="1.4" rx=".5" fill="#ffd54f"/>'),
    bagger: S('<rect x="2" y="17" width="15" height="4.5" rx="2.2" fill="#37474f"/><rect x="4" y="11" width="9" height="6.5" rx="1" fill="#f6b800" stroke="#8a6500" stroke-width="1"/><rect x="5" y="8.2" width="5" height="4" rx=".8" fill="#9bdcf7" stroke="#8a6500" stroke-width="1"/><path d="M11 12 17 5l3.5 1.6L18 12.5" fill="none" stroke="#f6b800" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><path d="M18.3 12l3.2 1.2-.6 3.4-4-.6z" fill="#8a6500"/>'),
    rathaus: S('<rect x="4" y="9" width="16" height="11" fill="#c0563b" stroke="#7a2f1f" stroke-width="1.3"/><rect x="5.5" y="2" width="4.5" height="8" fill="#c0563b" stroke="#7a2f1f" stroke-width="1.3"/><path d="M5 2.4 7.75 0.2 10.5 2.4z" fill="#2e8b6e"/><circle cx="7.75" cy="5.2" r="1.2" fill="#fff"/><rect x="11.5" y="13" width="3.2" height="7" fill="#5b3a29"/><rect x="16" y="11.5" width="2.3" height="3" fill="#9bdcf7"/>'),
    hall: S('<path d="M2.5 9.5 12 3l9.5 6.5z" fill="#e8dcc0" stroke="#8c7a52" stroke-width="1.3" stroke-linejoin="round"/><rect x="4.5" y="10.5" width="2" height="8" fill="#f3ead2" stroke="#8c7a52" stroke-width="1"/><rect x="8.5" y="10.5" width="2" height="8" fill="#f3ead2" stroke="#8c7a52" stroke-width="1"/><rect x="13.5" y="10.5" width="2" height="8" fill="#f3ead2" stroke="#8c7a52" stroke-width="1"/><rect x="17.5" y="10.5" width="2" height="8" fill="#f3ead2" stroke="#8c7a52" stroke-width="1"/><rect x="3" y="18.5" width="18" height="2.6" fill="#d6c9a6" stroke="#8c7a52" stroke-width="1"/>'),
    school: S('<rect x="3" y="8" width="18" height="12" fill="#e9b872" stroke="#8a5a1d" stroke-width="1.3"/><rect x="5" y="10.5" width="3" height="3" fill="#8fd0f5"/><rect x="10.5" y="10.5" width="3" height="3" fill="#8fd0f5"/><rect x="16" y="10.5" width="3" height="3" fill="#8fd0f5"/><rect x="10" y="15" width="4" height="5" fill="#5b3a29"/><path d="M12 8V2.5l4 1.6-4 1.6" fill="#e53935" stroke="#7f1d1d" stroke-width="1"/>'),
    ball: S('<circle cx="12" cy="12" r="9" fill="#fff" stroke="#263238" stroke-width="1.5"/><path d="M12 7.2 16.3 10.3 14.6 15.4H9.4L7.7 10.3z" fill="#263238"/><path d="M12 3v4.2M16.3 10.3 20.5 9M14.6 15.4l3 3.4M9.4 15.4l-3 3.4M7.7 10.3 3.5 9" stroke="#263238" stroke-width="1.2" fill="none"/>'),
    people: S('<circle cx="8" cy="7.5" r="3" fill="#f2c9a0" stroke="#7a4b21" stroke-width="1.1"/><circle cx="16.5" cy="8.5" r="2.6" fill="#e0ac7a" stroke="#7a4b21" stroke-width="1.1"/><path d="M2.8 20c.2-4.6 2.4-6.6 5.2-6.6s5 2 5.2 6.6z" fill="#2f6fd6"/><path d="M12.8 20c.2-3.8 1.7-5.6 3.8-5.6S20.2 16.2 20.4 20z" fill="#e67e22"/>'),
    power: S('<path d="M13.5 2 5 13.5h6L9.5 22 19 9.8h-6.3z" fill="#f6b800" stroke="#8a6500" stroke-width="1.4" stroke-linejoin="round"/>'),
    megaphone: S('<path d="M3 10v4l3 .6 9 4.4V5L6 9.4z" fill="#ef6c3b" stroke="#8a3412" stroke-width="1.4" stroke-linejoin="round"/><path d="M18 8.5c1.6 1 1.6 5 0 6M20.2 6.5c3 2 3 9 0 11" fill="none" stroke="#f6b800" stroke-width="1.6" stroke-linecap="round"/>'),
    book: S('<path d="M4 4.5h6.5A2.2 2.2 0 0 1 12 6.7V20a2.2 2.2 0 0 0-1.5-.5H4z" fill="#fff" stroke="#374151" stroke-width="1.4" stroke-linejoin="round"/><path d="M20 4.5h-6.5A2.2 2.2 0 0 0 12 6.7V20a2.2 2.2 0 0 1 1.5-.5H20z" fill="#e5efff" stroke="#374151" stroke-width="1.4" stroke-linejoin="round"/><path d="M6 8.5h3.5M6 11.5h3.5M14.5 8.5H18M14.5 11.5H18" stroke="#9ca3af" stroke-width="1.1" stroke-linecap="round"/>'),
    puzzle: S('<path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4H4z" fill="#8bc34a" stroke="#3f6212" stroke-width="1.4" stroke-linejoin="round"/>'),
    quiz: S('<circle cx="12" cy="12" r="9.5" fill="#6366f1" stroke="#3730a3" stroke-width="1.4"/><path d="M9.2 9.4a2.9 2.9 0 1 1 4.2 2.6c-.9.5-1.4 1-1.4 2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#fff"/>'),
    party: S('<path d="M3 21 8.5 7l8.5 8.5z" fill="#f6b800" stroke="#8a6500" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 5.5c1-2 3-2 4-4M15 9c2-1 4 0 5-1.6M17.5 13c1.6-.6 3 .2 4 1.5" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/><circle cx="19" cy="4" r="1.2" fill="#3b82f6"/><circle cx="6" cy="4" r="1.2" fill="#10b981"/>'),
    scale: S('<path d="M12 3v17M7 20h10M4 7h16" stroke="#374151" stroke-width="1.7" stroke-linecap="round" fill="none"/><path d="M4 7 1.8 13a3 3 0 0 0 4.4 0zM20 7l-2.2 6a3 3 0 0 0 4.4 0z" fill="#f6b800" stroke="#8a6500" stroke-width="1.2" stroke-linejoin="round"/>'),
    news: S('<rect x="3" y="4" width="18" height="16" rx="1.6" fill="#fff" stroke="#374151" stroke-width="1.4"/><rect x="5.5" y="6.5" width="7" height="5" fill="#93c5fd"/><path d="M14 7h4.5M14 9.6h4.5M5.5 14h13M5.5 16.6h13" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round"/>')
  };
  const imgCache = {};
  function iconImg(name, cb) {
    if (imgCache[name]) return imgCache[name];
    const im = new Image(); im.onload = function () { im._ok = true; if (cb) cb(); };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ICONS[name]);
    imgCache[name] = im; return im;
  }
  function ico(name, cls) { return '<span class="ico ' + (cls || '') + '">' + ICONS[name] + '</span>'; }

  // ------------------------------------------------------------------ Hilfsfunktionen
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function shade(c, x, y, w, h, off) { c.save(); c.fillStyle = 'rgba(20,40,20,.28)'; rr(c, x + (off || 6), y + (off || 6), w, h, 6); c.fill(); c.restore(); }
  function label(c, text, cx, y, col) {
    c.save(); c.font = '700 13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const w = c.measureText(text).width + 18; rr(c, cx - w / 2, y - 11, w, 22, 11); c.fillStyle = 'rgba(15,23,42,.82)'; c.fill();
    c.fillStyle = col || '#fff'; c.fillText(text, cx, y + .5); c.restore();
  }

  // ------------------------------------------------------------------ Karte (statisch, wird einmal in ein Offscreen-Canvas gezeichnet)
  const BLD = {
    zuhause: { x: 20, y: 20, w: 180, h: 120 }, land: { x: 620, y: 20, w: 180, h: 120 }, rathaus: { x: 20, y: 450, w: 180, h: 120 },
    schule: { x: 640, y: 220, w: 160, h: 100 }, wohn: { x: 20, y: 220, w: 140, h: 100 },
    skatepark: { x: 260, y: 292, w: 200, h: 130 }, sport: { x: 640, y: 450, w: 160, h: 120 }
  };
  const TREES = [[186, 178], [44, 200], [172, 346], [282, 450], [452, 462], [468, 556], [330, 560], [572, 150], [585, 214], [602, 322], [608, 430], [578, 566], [626, 580], [756, 410], [836, 340], [830, 596], [248, 120], [246, 12], [452, 80], [420, 20], [400, 180], [560, 70], [30, 410], [840, 200]];
  const BENCHES = [[300, 282, 0], [440, 282, 0], [250, 214, 0], [608, 214, 0], [690, 330, 0], [150, 440, 0]];
  const LAMPS = [[205, 226], [330, 226], [420, 226], [590, 226], [205, 276], [330, 276], [590, 276], [620, 440], [232, 430]];

  function drawMap(c) {
    const R = rng(7);
    // Gras
    c.fillStyle = '#79c466'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { c.fillStyle = R() < .5 ? 'rgba(98,170,80,.55)' : 'rgba(150,214,110,.45)'; c.beginPath(); c.ellipse(R() * W, R() * H, 10 + R() * 34, 6 + R() * 20, R() * 3, 0, 7); c.fill(); }
    for (let i = 0; i < 420; i++) { const x = R() * W, y = R() * H; c.strokeStyle = 'rgba(52,120,48,.45)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 1.5, y - 4); c.moveTo(x + 2, y); c.lineTo(x + 3, y - 4); c.stroke(); }
    const fl = ['#ffffff', '#ffe066', '#ff9ec1', '#c4a1ff'];
    for (let i = 0; i < 90; i++) { c.fillStyle = fl[i % 4]; c.beginPath(); c.arc(R() * W, R() * H, 1.5, 0, 7); c.fill(); }

    // Fluss (Havel) mit Sandufer
    const bank = (x0, x1, col, a) => { c.fillStyle = col; c.beginPath(); c.moveTo(x0, 0); for (let y = 0; y <= H; y += 10) c.lineTo(x0 + Math.sin(y / 38 + a) * 3, y); for (let y = H; y >= 0; y -= 10) c.lineTo(x1 + Math.sin(y / 44 + a + 1) * 3, y); c.closePath(); c.fill(); };
    bank(468, 552, '#e6d9aa', 0); bank(476, 544, '#bfe3f5', 0);
    const g = c.createLinearGradient(480, 0, 540, 0); g.addColorStop(0, '#3f93cc'); g.addColorStop(.5, '#5db3e6'); g.addColorStop(1, '#3a8bc4');
    c.fillStyle = g; c.beginPath(); c.moveTo(480, 0); for (let y = 0; y <= H; y += 10) c.lineTo(480 + Math.sin(y / 38) * 3, y); for (let y = H; y >= 0; y -= 10) c.lineTo(540 + Math.sin(y / 44 + 1) * 3, y); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 1.4; c.lineCap = 'round';
    for (let i = 0; i < 46; i++) { const y = R() * H, x = 488 + R() * 44, w = 6 + R() * 10; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - 2.5, x + w, y); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(494, 0, 6, H);

    // Wege und Straßen
    const road = (x, y, w, h) => { c.fillStyle = '#d9dce0'; c.fillRect(x - 6, y - 6, w + 12, h + 12); c.fillStyle = '#59636f'; c.fillRect(x, y, w, h); };
    road(160, 228, 690, 44);                  // Hauptstraße (Spandauer Straße)
    road(212, 272, 36, 328);                  // Straße nach Süden (links)
    road(590, 272, 30, 328);                  // Straße nach Süden (rechts)
    // Kreuzungen glätten
    c.fillStyle = '#59636f'; c.fillRect(212, 228, 36, 44); c.fillRect(590, 228, 30, 44);
    // Mittelstreifen
    c.strokeStyle = '#f5f5f5'; c.lineWidth = 2.2; c.setLineDash([14, 12]);
    c.beginPath(); c.moveTo(160, 250); c.lineTo(470, 250); c.moveTo(550, 250); c.lineTo(850, 250); c.moveTo(230, 280); c.lineTo(230, 600); c.moveTo(605, 280); c.lineTo(605, 600); c.stroke(); c.setLineDash([]);
    // Zebrastreifen vor den Brücken
    c.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 5; i++) { c.fillRect(448, 232 + i * 8.5, 14, 5); c.fillRect(558, 232 + i * 8.5, 14, 5); }
    // Pflaster vor den Gebäuden
    const plaza = (x, y, w, h, col) => { c.fillStyle = col; rr(c, x, y, w, h, 6); c.fill(); c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 1; for (let xx = x; xx <= x + w; xx += 14) { c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + h); c.stroke(); } for (let yy = y; yy <= y + h; yy += 14) { c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke(); } };
    plaza(70, 142, 80, 44, '#e3d7bd');         // vor Zuhause
    plaza(662, 142, 96, 50, '#e3d7bd');        // vor Abgeordnetenhaus
    plaza(60, 572, 100, 28, '#d9d2c0');        // vor Rathaus
    plaza(660, 322, 120, 34, '#e3d7bd');       // vor Schule
    // Weg zu Zuhause, Abgeordnetenhaus
    c.fillStyle = '#e3d7bd'; c.fillRect(100, 186, 20, 42); c.fillRect(700, 192, 20, 36);

    // Brücke
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(472, 232, 78, 52);
    c.fillStyle = '#8b9199'; c.fillRect(468, 220, 86, 60);
    c.fillStyle = '#59636f'; c.fillRect(468, 224, 86, 52);
    c.fillStyle = '#f5f5f5'; c.setLineDash([12, 10]); c.lineWidth = 2.2; c.strokeStyle = '#f5f5f5'; c.beginPath(); c.moveTo(468, 250); c.lineTo(554, 250); c.stroke(); c.setLineDash([]);
    for (const y of [220, 276]) { c.fillStyle = '#c9ced4'; c.fillRect(468, y, 86, 4); c.fillStyle = '#9aa1a9'; c.fillRect(468, y + 3, 86, 1.5); for (let x = 470; x <= 552; x += 16) { c.fillStyle = '#b4bac1'; c.fillRect(x - 1.5, y - 2, 3, 8); } }
    c.fillStyle = '#6b7280'; c.fillRect(466, 217, 8, 66); c.fillRect(548, 217, 8, 66);

    // Gebäude
    houseZuhause(c, BLD.zuhause); wohnhaeuser(c, BLD.wohn); rathaus(c, BLD.rathaus); abgeordnetenhaus(c, BLD.land); schule(c, BLD.schule);
    skatepark(c, BLD.skatepark); sportplatz(c, BLD.sport);

    // Bänke, Laternen, Büsche
    BENCHES.forEach(b => bench(c, b[0], b[1]));
    LAMPS.forEach(l => lamp(c, l[0], l[1]));
    const bushes = [[205, 150], [60, 150], [155, 150], [660, 200], [758, 200], [630, 150], [212, 580], [248, 580], [592, 440], [618, 520], [214, 300], [244, 520]];
    bushes.forEach(b => bush(c, b[0], b[1], R));

    // Beschriftungen
    label(c, 'Zuhause (Eltern)', 110, 156); label(c, 'Abgeordnetenhaus', 710, 156); label(c, 'Rathaus Spandau', 110, 588);
    label(c, 'Lily-Braun-Gymnasium', 720, 340); label(c, 'Anwohner', 90, 334); label(c, 'Skatepark', 360, 410); label(c, 'Sportverein', 720, 560);
    c.save(); c.font = 'italic 700 12px system-ui,sans-serif'; c.fillStyle = 'rgba(255,255,255,.85)'; c.textAlign = 'center'; c.translate(510, 120); c.rotate(-Math.PI / 2); c.fillText('Havel', 0, 4); c.restore();
  }

  function bench(c, x, y) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x - 11, y + 4, 24, 4); c.fillStyle = '#8b5a2b'; c.fillRect(x - 12, y - 2, 24, 5); c.fillStyle = '#a56f37'; c.fillRect(x - 12, y - 7, 24, 3.5); c.fillStyle = '#444'; c.fillRect(x - 10, y + 3, 2.5, 5); c.fillRect(x + 8, y + 3, 2.5, 5); }
  function lamp(c, x, y) { c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(x + 2, y + 1, 4, 2, 0, 0, 7); c.fill(); c.fillStyle = '#37474f'; c.fillRect(x - 1, y - 18, 2.4, 19); c.fillStyle = '#fff3b0'; c.beginPath(); c.arc(x, y - 20, 3.6, 0, 7); c.fill(); c.strokeStyle = '#37474f'; c.lineWidth = 1; c.stroke(); }
  function bush(c, x, y, R) { c.fillStyle = 'rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(x + 2, y + 5, 12, 4, 0, 0, 7); c.fill(); for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? '#3f9a45' : '#4fae53'; c.beginPath(); c.arc(x - 8 + i * 5.4, y - (i % 2) * 3, 7, 0, 7); c.fill(); } c.fillStyle = '#ff7aa8'; c.beginPath(); c.arc(x - 4, y - 3, 1.5, 0, 7); c.arc(x + 6, y - 1, 1.5, 0, 7); c.fill(); }

  function houseZuhause(c, r) {
    const { x, y, w, h } = r; shade(c, x + 8, y + 18, w - 16, h - 18, 7);
    c.fillStyle = '#8fd07a'; rr(c, x, y + 60, w, h - 60, 8); c.fill();
    const bx = x + 22, bw = w - 44, by = y + 46, bh = h - 48 - 0;
    c.fillStyle = '#fbe9c8'; c.fillRect(bx, by, bw, bh); c.strokeStyle = '#a07a45'; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh);
    // Dach
    const rg = c.createLinearGradient(0, y, 0, y + 54); rg.addColorStop(0, '#d2603a'); rg.addColorStop(1, '#a8431f');
    c.fillStyle = rg; c.beginPath(); c.moveTo(bx - 14, by + 4); c.lineTo(bx + 24, y + 8); c.lineTo(bx + bw - 24, y + 8); c.lineTo(bx + bw + 14, by + 4); c.closePath(); c.fill(); c.strokeStyle = '#7a2e12'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = 'rgba(80,25,8,.35)'; c.lineWidth = 1; for (let i = 1; i < 4; i++) { const yy = y + 8 + i * 10; c.beginPath(); c.moveTo(bx - 14 + i * 9, yy); c.lineTo(bx + bw + 14 - i * 9, yy); c.stroke(); }
    c.fillStyle = '#8a4b2b'; c.fillRect(bx + bw - 44, y - 2, 12, 22); c.fillStyle = '#5a2e18'; c.fillRect(bx + bw - 46, y - 4, 16, 4);
    // Fenster und Tür
    const win = (wx, wy) => { c.fillStyle = '#9bd7f5'; c.fillRect(wx, wy, 22, 22); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.strokeRect(wx, wy, 22, 22); c.beginPath(); c.moveTo(wx + 11, wy); c.lineTo(wx + 11, wy + 22); c.moveTo(wx, wy + 11); c.lineTo(wx + 22, wy + 11); c.stroke(); c.fillStyle = '#e25555'; c.fillRect(wx - 2, wy + 22, 26, 4); c.fillStyle = '#ffb3c1'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(wx + 2 + i * 6.4, wy + 21, 2, 0, 7); c.fill(); } };
    win(bx + 14, by + 16); win(bx + bw - 36, by + 16);
    c.fillStyle = '#3b6fd0'; rr(c, x + w / 2 - 10, by + 24, 20, bh - 24, 3); c.fill(); c.strokeStyle = '#1e3f86'; c.lineWidth = 1.5; c.stroke(); c.fillStyle = '#ffd54f'; c.beginPath(); c.arc(x + w / 2 + 5, by + 56, 1.7, 0, 7); c.fill();
    c.fillStyle = '#d9d2c0'; c.fillRect(x + w / 2 - 14, y + h - 4, 28, 4);
  }

  function wohnhaeuser(c, r) {
    const { x, y, w, h } = r; shade(c, x, y + 6, w, h - 6, 5); c.fillStyle = '#8fd07a'; rr(c, x, y, w, h, 8); c.fill();
    const cols = [['#e8935a', '#f9e0c0'], ['#5b8fd6', '#e6eefb'], ['#6bb07b', '#f1f0d4']];
    for (let i = 0; i < 3; i++) {
      const hx = x + 6 + i * 44, hy = y + 26, hw = 38, hh = h - 36;
      c.fillStyle = cols[i][1]; c.fillRect(hx, hy, hw, hh); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1.3; c.strokeRect(hx, hy, hw, hh);
      c.fillStyle = cols[i][0]; c.beginPath(); c.moveTo(hx - 4, hy + 2); c.lineTo(hx + hw / 2, y + 4); c.lineTo(hx + hw + 4, hy + 2); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#9bd7f5'; c.fillRect(hx + 5, hy + 10, 10, 10); c.fillRect(hx + hw - 15, hy + 10, 10, 10); c.strokeStyle = '#fff'; c.strokeRect(hx + 5, hy + 10, 10, 10); c.strokeRect(hx + hw - 15, hy + 10, 10, 10);
      c.fillStyle = '#7a4b2b'; c.fillRect(hx + hw / 2 - 4, hy + hh - 17, 8, 17);
    }
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 2, y + h - 2); c.lineTo(x + w - 2, y + h - 2); c.stroke(); for (let xx = x + 4; xx < x + w; xx += 8) { c.beginPath(); c.moveTo(xx, y + h - 8); c.lineTo(xx, y + h - 1); c.stroke(); }
  }

  function spandauFlag(c, x, y, w, h) {
    const u = h / 5;
    c.fillStyle = '#d32f2f'; c.fillRect(x, y, w, u); c.fillRect(x, y + 4 * u, w, u);
    c.fillStyle = '#fff'; c.fillRect(x, y + u, w, 3 * u);
    const cx = x + w / 2, by = y + 4 * u - .6;
    c.fillStyle = '#c62828'; c.fillRect(cx - w * .22, by - h * .36, w * .44, h * .36);
    for (let i = 0; i < 3; i++) c.fillRect(cx - w * .22 + i * w * .17, by - h * .48, w * .1, h * .13);
    c.fillStyle = '#4a1010'; c.fillRect(cx - w * .05, by - h * .2, w * .1, h * .2);
    c.fillStyle = '#fff'; c.strokeStyle = '#222'; c.lineWidth = .6; c.beginPath(); c.moveTo(cx - w * .1, by - h * .33); c.lineTo(cx + w * .1, by - h * .33); c.lineTo(cx + w * .1, by - h * .22); c.quadraticCurveTo(cx, by - h * .1, cx - w * .1, by - h * .22); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#111'; c.fillRect(cx - w * .025, by - h * .3, w * .05, h * .1);
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .8; c.strokeRect(x, y, w, h);
  }
  function berlinFlag(c, x, y, w, h) { const u = h / 5; c.fillStyle = '#d32f2f'; c.fillRect(x, y, w, h); c.fillStyle = '#fff'; c.fillRect(x, y + u, w, 3 * u); c.fillStyle = '#222'; c.beginPath(); c.ellipse(x + w / 2, y + h / 2, w * .13, h * .28, 0, 0, 7); c.fill(); }
  function pole(c, x, y0, y1) { c.strokeStyle = '#5b6168'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); }

  // Rathaus Spandau: roter Ziegelwalmdach, Mittelrisalit mit Segmentgiebel, hoher Turm mit Uhr und grüner Kupferhaube
  function rathaus(c, r) {
    const { x, y, w, h } = r; shade(c, x + 4, y + 10, w, h - 10, 7);
    const wall = '#a89572', wallD = '#8d7b58', roof = '#c4472a', roofD = '#9e3720', dark = '#6b5a3d';
    const wing = (wx, ww, roofCol) => {
      c.fillStyle = wall; c.fillRect(wx, y + 62, ww, h - 70); c.strokeStyle = dark; c.lineWidth = 1; c.strokeRect(wx, y + 62, ww, h - 70);
      c.fillStyle = roofCol; c.beginPath(); c.moveTo(wx - 3, y + 64); c.lineTo(wx + 8, y + 50); c.lineTo(wx + ww - 8, y + 50); c.lineTo(wx + ww + 3, y + 64); c.closePath(); c.fill(); c.strokeStyle = '#5e2112'; c.stroke();
      for (let i = 0; i < ww - 12; i += 11) { c.fillStyle = '#f2ead6'; c.fillRect(wx + 6 + i, y + 70, 5, 10); c.fillRect(wx + 6 + i, y + 86, 5, 10); }
      for (let i = 0; i < ww - 12; i += 11) { c.fillStyle = '#b86a52'; c.fillRect(wx + 7 + i, y + 55, 4, 5); }
    };
    wing(x + 2, 40, '#8a4a3a'); wing(x + w - 46, 44, '#8a4a3a');
    c.fillStyle = '#5f8f3f'; c.fillRect(x + w - 12, y + 66, 8, h - 76);
    c.fillStyle = wall; c.fillRect(x + 38, y + 56, w - 80, h - 64); c.strokeStyle = dark; c.lineWidth = 1.2; c.strokeRect(x + 38, y + 56, w - 80, h - 64);
    const rg = c.createLinearGradient(0, y + 30, 0, y + 58); rg.addColorStop(0, roof); rg.addColorStop(1, roofD);
    c.fillStyle = rg; c.beginPath(); c.moveTo(x + 32, y + 58); c.lineTo(x + 50, y + 34); c.lineTo(x + w - 54, y + 34); c.lineTo(x + w - 32, y + 58); c.closePath(); c.fill(); c.strokeStyle = '#5e2112'; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = 'rgba(70,20,8,.35)'; c.lineWidth = .8; for (let yy = y + 38; yy < y + 58; yy += 4) { c.beginPath(); c.moveTo(x + 48 - (yy - y - 38) * .9, yy); c.lineTo(x + w - 52 + (yy - y - 38) * .9, yy); c.stroke(); }
    for (let i = 0; i < 6; i++) { const dx = x + 56 + i * 15; c.fillStyle = '#e8dcc0'; c.fillRect(dx, y + 44, 6, 7); c.fillStyle = roofD; c.beginPath(); c.moveTo(dx - 1, y + 44); c.lineTo(dx + 3, y + 40); c.lineTo(dx + 7, y + 44); c.closePath(); c.fill(); }
    // Turm
    const tx = x + 74, tw = 28; c.fillStyle = '#b3a07a'; c.fillRect(tx, y + 8, tw, 36); c.strokeStyle = dark; c.lineWidth = 1.2; c.strokeRect(tx, y + 8, tw, 36);
    c.fillStyle = '#9d8a64'; c.fillRect(tx + tw - 6, y + 8, 6, 36);
    c.fillStyle = '#4c8f78'; c.beginPath(); c.moveTo(tx - 2, y + 9); c.lineTo(tx + 5, y + 1); c.lineTo(tx + tw - 5, y + 1); c.lineTo(tx + tw + 2, y + 9); c.closePath(); c.fill(); c.strokeStyle = '#2d5b4a'; c.stroke();
    c.fillStyle = '#f7f1da'; c.beginPath(); c.arc(tx + tw / 2 - 2, y + 20, 6.5, 0, 7); c.fill(); c.strokeStyle = '#d6a21a'; c.lineWidth = 1.6; c.stroke(); c.strokeStyle = '#333'; c.lineWidth = 1; c.beginPath(); c.moveTo(tx + tw / 2 - 2, y + 20); c.lineTo(tx + tw / 2 - 2, y + 15.5); c.moveTo(tx + tw / 2 - 2, y + 20); c.lineTo(tx + tw / 2 + 2, y + 21.5); c.stroke();
    c.fillStyle = '#e8dcc0'; for (let k = 0; k < 3; k++) c.fillRect(tx + tw / 2 - 5, y + 29 + k * 5, 4, 3);
    // Segmentgiebel
    const gx = x + w / 2 + 2; c.fillStyle = '#b09c74'; c.beginPath(); c.moveTo(gx - 24, y + 62); c.quadraticCurveTo(gx, y + 38, gx + 24, y + 62); c.closePath(); c.fill(); c.strokeStyle = dark; c.lineWidth = 1.2; c.stroke();
    c.fillStyle = '#d9c99c'; c.beginPath(); c.arc(gx, y + 55, 4.5, 0, 7); c.fill(); c.stroke();
    // Fassade: Pilaster und hohe Fenster
    for (let i = 0; i < 8; i++) { const wx = x + 44 + i * 11.5; c.fillStyle = '#e8dcc0'; c.fillRect(wx, y + 66, 5, 13); c.fillRect(wx, y + 84, 5, 13); c.fillStyle = '#8fc3de'; c.fillRect(wx + .8, y + 67, 3.4, 11); c.fillRect(wx + .8, y + 85, 3.4, 11); }
    c.fillStyle = wallD; for (let i = 0; i <= 8; i++) c.fillRect(x + 42 + i * 11.5, y + 62, 1.6, h - 74);
    c.fillStyle = '#3f3224'; rr(c, gx - 8, y + h - 28, 16, 22, 7); c.fill(); c.strokeStyle = '#e8dcc0'; c.lineWidth = 1.6; c.stroke();
    // Hecke, Pappeln
    c.fillStyle = '#3a8a3e'; rr(c, x + 44, y + h - 10, w - 90, 7, 3); c.fill();
    for (const px of [x + 30, x + w - 30]) { c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(px + 2, y + h - 6, 6, 2.4, 0, 0, 7); c.fill(); c.fillStyle = '#3f7d36'; c.beginPath(); c.ellipse(px, y + h - 34, 6, 24, 0, 0, 7); c.fill(); c.fillStyle = '#58a04a'; c.beginPath(); c.ellipse(px - 2, y + h - 38, 3, 16, 0, 0, 7); c.fill(); }
    // Spandauer Flagge
    const fx = x + w - 28; pole(c, fx, y + 62, y + 14); spandauFlag(c, fx + .8, y + 14, 24, 14.5);
  }

  // Abgeordnetenhaus von Berlin: Sandsteinfassade, sechs Säulen, drei Rundbogenportale, Balustraden, Fahnen
  function abgeordnetenhaus(c, r) {
    const { x, y, w, h } = r; shade(c, x + 4, y + 10, w, h - 10, 7);
    const sand = '#dcc9a0', sandL = '#ead9ad', sandD = '#b79f70', line = '#8c7a52';
    c.fillStyle = '#d3cdbb'; c.fillRect(x, y + h - 12, w, 12);
    for (let i = 0; i < w; i += 10) { c.fillStyle = 'rgba(0,0,0,.07)'; c.fillRect(x + i, y + h - 12, 5, 12); }
    const wing = (wx, ww) => {
      c.fillStyle = sand; c.fillRect(wx, y + 42, ww, h - 54); c.strokeStyle = line; c.lineWidth = 1.2; c.strokeRect(wx, y + 42, ww, h - 54);
      c.fillStyle = sandD; c.fillRect(wx - 1, y + 40, ww + 2, 4);
      c.fillStyle = sandL; for (let i = 0; i < ww; i += 5) c.fillRect(wx + i, y + 37, 3, 4); c.fillRect(wx, y + 36.5, ww, 1.3);
      for (let i = 0; i < 3; i++) { const ux = wx + 6 + i * 15; c.fillStyle = '#9fcbe4'; c.fillRect(ux, y + 50, 7, 11); c.strokeStyle = sandL; c.lineWidth = 1.5; c.strokeRect(ux, y + 50, 7, 11); c.fillStyle = sandL; c.beginPath(); c.moveTo(ux - 2, y + 49); c.lineTo(ux + 3.5, y + 45); c.lineTo(ux + 9, y + 49); c.closePath(); c.fill(); c.strokeStyle = line; c.lineWidth = .7; c.stroke(); }
      c.fillStyle = '#c4ae80'; c.fillRect(wx, y + 70, ww, h - 82);
      c.strokeStyle = 'rgba(90,70,40,.3)'; c.lineWidth = .8; for (let yy = y + 74; yy < y + h - 12; yy += 5) { c.beginPath(); c.moveTo(wx, yy); c.lineTo(wx + ww, yy); c.stroke(); }
      for (let i = 0; i < 3; i++) { const ux = wx + 6 + i * 15; c.fillStyle = '#7fb0cc'; c.beginPath(); c.moveTo(ux, y + h - 16); c.lineTo(ux, y + 80); c.arc(ux + 3.5, y + 80, 3.5, Math.PI, 0); c.lineTo(ux + 7, y + h - 16); c.closePath(); c.fill(); c.strokeStyle = sandL; c.lineWidth = 1.4; c.stroke(); }
    };
    wing(x + 2, 52); wing(x + w - 54, 52);
    // Mittelbau
    const mx = x + 50, mw = w - 100;
    c.fillStyle = sand; c.fillRect(mx, y + 26, mw, h - 38); c.strokeStyle = line; c.lineWidth = 1.2; c.strokeRect(mx, y + 26, mw, h - 38);
    c.fillStyle = sandD; c.fillRect(mx - 2, y + 28, mw + 4, 4); c.fillStyle = sandL; for (let i = 0; i < mw; i += 5) c.fillRect(mx + i, y + 22, 3, 5); c.fillRect(mx - 1, y + 21.5, mw + 2, 1.4);
    // Fensterbögen zwischen den Säulen
    for (let i = 0; i < 5; i++) { const ux = mx + 7 + i * 13.6; c.fillStyle = '#7fb0cc'; c.beginPath(); c.moveTo(ux, y + 62); c.lineTo(ux, y + 44); c.arc(ux + 4, y + 44, 4, Math.PI, 0); c.lineTo(ux + 8, y + 62); c.closePath(); c.fill(); c.strokeStyle = '#4f6e82'; c.lineWidth = .8; c.stroke(); c.beginPath(); c.moveTo(ux + 4, y + 40); c.lineTo(ux + 4, y + 62); c.moveTo(ux, y + 52); c.lineTo(ux + 8, y + 52); c.stroke(); }
    // sechs Säulen
    for (let i = 0; i < 6; i++) { const cx = mx + 3 + i * 13.6; const g = c.createLinearGradient(cx - 3, 0, cx + 3, 0); g.addColorStop(0, '#fff6dc'); g.addColorStop(1, '#cdb98a'); c.fillStyle = g; c.fillRect(cx - 2.8, y + 38, 5.6, 30); c.strokeStyle = line; c.lineWidth = .7; c.strokeRect(cx - 2.8, y + 38, 5.6, 30); c.fillStyle = sandL; c.fillRect(cx - 4.2, y + 35.5, 8.4, 3.6); c.strokeRect(cx - 4.2, y + 35.5, 8.4, 3.6); }
    // Sockel mit drei Portalen
    c.fillStyle = '#c4ae80'; c.fillRect(mx, y + 68, mw, h - 80); c.strokeStyle = 'rgba(90,70,40,.3)'; c.lineWidth = .8; for (let yy = y + 72; yy < y + h - 12; yy += 5) { c.beginPath(); c.moveTo(mx, yy); c.lineTo(mx + mw, yy); c.stroke(); }
    c.fillStyle = sandL; c.fillRect(mx + 2, y + 66, mw - 4, 3); c.strokeStyle = line; c.strokeRect(mx + 2, y + 66, mw - 4, 3);
    for (let i = -1; i <= 1; i++) { const dx = x + w / 2 + i * 17 - 6; c.fillStyle = '#3c3730'; c.beginPath(); c.moveTo(dx, y + h - 12); c.lineTo(dx, y + 84); c.arc(dx + 6, y + 84, 6, Math.PI, 0); c.lineTo(dx + 12, y + h - 12); c.closePath(); c.fill(); c.strokeStyle = sandL; c.lineWidth = 1.6; c.stroke(); c.strokeStyle = 'rgba(200,190,150,.35)'; c.lineWidth = .8; c.beginPath(); c.moveTo(dx + 6, y + 78); c.lineTo(dx + 6, y + h - 12); c.stroke(); }
    for (const px of [x + w / 2 - 25.5, x + w / 2 - 8.5, x + w / 2 + 8.5, x + w / 2 + 25.5]) { c.fillStyle = sandL; c.fillRect(px - 2, y + 70, 4, h - 82); c.strokeStyle = line; c.lineWidth = .7; c.strokeRect(px - 2, y + 70, 4, h - 82); }
    // Fahnenmast auf dem Dach und drei Fahnen vor dem Haus
    pole(c, x + w / 2 - 6, y + 22, y + 1); berlinFlag(c, x + w / 2 - 5.2, y + 1.5, 13, 8);
    const fl = [x + w - 42, x + w - 32, x + w - 22];
    fl.forEach((fx, i) => { pole(c, fx, y + h - 12, y + 40); const fy = y + 41; if (i === 0) { c.fillStyle = '#1f4fa8'; c.fillRect(fx + .8, fy, 8, 5.5); c.fillStyle = '#ffd400'; c.beginPath(); c.arc(fx + 4.8, fy + 2.7, 1.8, 0, 7); c.fill(); } else if (i === 1) { c.fillStyle = '#111'; c.fillRect(fx + .8, fy, 8, 1.9); c.fillStyle = '#d32f2f'; c.fillRect(fx + .8, fy + 1.9, 8, 1.9); c.fillStyle = '#ffcc00'; c.fillRect(fx + .8, fy + 3.8, 8, 1.9); } else berlinFlag(c, fx + .8, fy, 8, 5.5); });
  }

  // Lily-Braun-Gymnasium: nach dem Schullogo (Hauptflügel mit Walmdach und Gauben, fünf Rundbogenfenster, Eingangsblock links, Giebelflügel rechts)
  function schule(c, r) {
    const { x, y, w, h } = r; shade(c, x + 4, y + 8, w, h - 8, 6);
    const st = '#ead9b0', stD = '#cdb88a', line = '#8a6b2d', slate = '#5f6a76';
    // Hauptflügel
    const mx = x + 30, mw = 92;
    c.fillStyle = st; c.fillRect(mx, y + 26, mw, h - 26); c.strokeStyle = line; c.lineWidth = 1.4; c.strokeRect(mx, y + 26, mw, h - 26);
    c.fillStyle = slate; c.beginPath(); c.moveTo(mx - 4, y + 30); c.lineTo(mx + 10, y + 8); c.lineTo(mx + mw - 10, y + 8); c.lineTo(mx + mw + 4, y + 30); c.closePath(); c.fill(); c.strokeStyle = '#38414b'; c.stroke();
    for (let i = 0; i < 5; i++) { const dx = mx + 10 + i * 17.5; c.fillStyle = st; c.fillRect(dx, y + 15, 7, 9); c.fillStyle = '#38414b'; c.beginPath(); c.moveTo(dx - 1.5, y + 15); c.lineTo(dx + 3.5, y + 10); c.lineTo(dx + 8.5, y + 15); c.closePath(); c.fill(); c.fillStyle = '#8fc3de'; c.fillRect(dx + 1.5, y + 17, 4, 5); }
    c.fillStyle = stD; c.fillRect(mx, y + 28, mw, 3);
    for (let i = 0; i < 5; i++) { const wx = mx + 8 + i * 17.5; c.fillStyle = '#8fc3de'; c.fillRect(wx, y + 35, 9, 19); c.strokeStyle = '#f7f1e3'; c.lineWidth = 1.5; c.strokeRect(wx, y + 35, 9, 19); c.beginPath(); c.moveTo(wx + 4.5, y + 35); c.lineTo(wx + 4.5, y + 54); c.moveTo(wx, y + 44); c.lineTo(wx + 9, y + 44); c.stroke(); c.fillStyle = stD; c.fillRect(wx - 3.5, y + 35, 2, 19); c.fillRect(wx + 10.5, y + 35, 2, 19); }
    c.fillStyle = stD; c.fillRect(mx, y + 58, mw, 3);
    for (let i = 0; i < 5; i++) { const wx = mx + 8 + i * 17.5; c.fillStyle = '#7fb0cc'; c.beginPath(); c.moveTo(wx, y + h - 6); c.lineTo(wx, y + 72); c.arc(wx + 4.5, y + 72, 4.5, Math.PI, 0); c.lineTo(wx + 9, y + h - 6); c.closePath(); c.fill(); c.strokeStyle = '#f7f1e3'; c.lineWidth = 1.5; c.stroke(); }
    c.fillStyle = '#d6cdb6'; c.fillRect(mx - 2, y + h - 6, mw + 4, 6); c.fillRect(mx + 2, y + h - 3, mw - 4, 3);
    // Eingangsblock links (höher, Glaseingang)
    c.fillStyle = st; c.fillRect(x + 6, y + 14, 26, h - 14); c.strokeStyle = line; c.lineWidth = 1.4; c.strokeRect(x + 6, y + 14, 26, h - 14);
    c.fillStyle = slate; c.beginPath(); c.moveTo(x + 3, y + 18); c.lineTo(x + 19, y + 2); c.lineTo(x + 35, y + 18); c.closePath(); c.fill(); c.strokeStyle = '#38414b'; c.stroke();
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) { c.fillStyle = '#8fc3de'; c.fillRect(x + 10 + j * 11, y + 22 + k * 16, 7, 11); c.strokeStyle = '#f7f1e3'; c.lineWidth = 1.2; c.strokeRect(x + 10 + j * 11, y + 22 + k * 16, 7, 11); }
    c.fillStyle = '#bfe6fb'; c.fillRect(x + 10, y + h - 26, 18, 26); c.strokeStyle = '#4a5a68'; c.lineWidth = 1; c.strokeRect(x + 10, y + h - 26, 18, 26); c.beginPath(); c.moveTo(x + 19, y + h - 26); c.lineTo(x + 19, y + h); for (let yy = y + h - 20; yy < y + h; yy += 6) { c.moveTo(x + 10, yy); c.lineTo(x + 28, yy); } c.stroke();
    // Giebelflügel rechts
    const gx = mx + mw; c.fillStyle = stD; c.fillRect(gx, y + 20, 30, h - 20); c.strokeStyle = line; c.lineWidth = 1.4; c.strokeRect(gx, y + 20, 30, h - 20);
    c.fillStyle = slate; c.beginPath(); c.moveTo(gx - 2, y + 24); c.lineTo(gx + 15, y + 6); c.lineTo(gx + 32, y + 24); c.closePath(); c.fill(); c.strokeStyle = '#38414b'; c.stroke();
    c.strokeStyle = 'rgba(90,70,40,.5)'; c.lineWidth = 1.2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(gx + 5 + i * 5, y + 28); c.lineTo(gx + 5 + i * 5, y + h - 3); c.stroke(); }
    // kleine Bäume an den Enden
    for (const tx of [x - 4, x + w + 3]) { c.fillStyle = '#2f7a3a'; c.beginPath(); c.arc(tx, y + h - 22, 9, 0, 7); c.arc(tx + 4, y + h - 30, 8, 0, 7); c.fill(); c.fillStyle = '#6b4a2b'; c.fillRect(tx - 1, y + h - 14, 3, 14); }
  }

  function skatepark(c, r) {
    const { x, y, w, h } = r; shade(c, x, y + 4, w, h, 5);
    c.fillStyle = '#b9bfc7'; rr(c, x, y, w, h, 12); c.fill(); c.strokeStyle = '#7d848d'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(0,0,0,.1)'; c.lineWidth = 1; for (let xx = x + 20; xx < x + w; xx += 28) { c.beginPath(); c.moveTo(xx, y + 4); c.lineTo(xx, y + h - 4); c.stroke(); } for (let yy = y + 22; yy < y + h; yy += 28) { c.beginPath(); c.moveTo(x + 4, yy); c.lineTo(x + w - 4, yy); c.stroke(); }
    // Bowl
    const bg = c.createRadialGradient(x + 52, y + 80, 6, x + 52, y + 80, 44); bg.addColorStop(0, '#5f6770'); bg.addColorStop(1, '#a3aab3'); c.fillStyle = bg; c.beginPath(); c.ellipse(x + 52, y + 80, 44, 32, 0, 0, 7); c.fill(); c.strokeStyle = '#6b727b'; c.lineWidth = 2.5; c.stroke(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.beginPath(); c.ellipse(x + 52, y + 80, 36, 25, 0, Math.PI * .1, Math.PI * .9); c.stroke();
    // Quarterpipe
    c.fillStyle = '#9097a1'; c.beginPath(); c.moveTo(x + w - 62, y + 20); c.lineTo(x + w - 10, y + 20); c.lineTo(x + w - 10, y + 62); c.quadraticCurveTo(x + w - 20, y + 30, x + w - 62, y + 28); c.closePath(); c.fill(); c.strokeStyle = '#656c75'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#ffd54a'; c.fillRect(x + w - 10, y + 20, 3, 42);
    // Funbox + Rail
    c.fillStyle = '#8a929c'; c.beginPath(); c.moveTo(x + 104, y + 98); c.lineTo(x + 128, y + 82); c.lineTo(x + 160, y + 82); c.lineTo(x + 176, y + 98); c.closePath(); c.fill(); c.strokeStyle = '#5f666f'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#ffd54a'; c.fillRect(x + 128, y + 80, 32, 3);
    c.strokeStyle = '#4b5563'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 92, y + 28); c.lineTo(x + 150, y + 28); c.stroke(); c.fillStyle = '#4b5563'; c.fillRect(x + 94, y + 28, 2.5, 8); c.fillRect(x + 146, y + 28, 2.5, 8);
    // Graffiti
    const gr = [['#ff4f81', 36, 24, 8], ['#30c4e0', 90, 52, 6], ['#ffc400', 70, 108, 7], ['#7c4dff', 188, 108, 5]]; gr.forEach(g => { c.fillStyle = g[0]; c.globalAlpha = .75; c.beginPath(); c.ellipse(x + g[1], y + g[2], g[3] * 1.8, g[3], .4, 0, 7); c.fill(); c.globalAlpha = 1; });
  }

  function sportplatz(c, r) {
    const { x, y, w, h } = r; shade(c, x, y + 4, w, h, 5);
    c.fillStyle = '#3e9f4a'; rr(c, x, y, w, h, 8); c.fill(); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(x + i * (w / 8), y, w / 8, h); }
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2; c.strokeRect(x + 6, y + 6, w - 12, h - 12); c.beginPath(); c.moveTo(x + w / 2, y + 6); c.lineTo(x + w / 2, y + h - 6); c.stroke(); c.beginPath(); c.arc(x + w / 2, y + h / 2, 16, 0, 7); c.stroke(); c.strokeRect(x + 6, y + h / 2 - 22, 22, 44); c.strokeRect(x + w - 28, y + h / 2 - 22, 22, 44);
    for (const gx of [x + 2, x + w - 6]) { c.fillStyle = '#fff'; c.fillRect(gx, y + h / 2 - 12, 4, 24); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1; for (let k = -10; k <= 10; k += 5) { c.beginPath(); c.moveTo(gx + 2, y + h / 2 + k); c.lineTo(gx + (gx < x + w / 2 ? -8 : 10), y + h / 2 + k); c.stroke(); } }
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x + w / 2 + 24, y + h / 2 + 6, 4, 0, 7); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 1; c.stroke();
  }

  // ------------------------------------------------------------------ Bäume (dynamisch, nach y sortiert)
  function tree(c, x, y, k) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(4, 2, 16, 6, 0, 0, 7); c.fill();
    c.fillStyle = '#7a4f2b'; c.fillRect(-3, -14, 6, 15); c.fillStyle = '#5e3a1d'; c.fillRect(1, -14, 2.4, 15);
    const sets = [['#2f8f46', '#3da556', '#58bf6d'], ['#3a9a4f', '#4eb162', '#74cc7f'], ['#4a9a35', '#63b348', '#88cc62']][k % 3];
    c.fillStyle = sets[0]; c.beginPath(); c.arc(-8, -28, 12, 0, 7); c.arc(9, -27, 12, 0, 7); c.arc(0, -40, 14, 0, 7); c.fill();
    c.fillStyle = sets[1]; c.beginPath(); c.arc(-4, -32, 11, 0, 7); c.arc(8, -33, 9, 0, 7); c.arc(-2, -42, 10, 0, 7); c.fill();
    c.fillStyle = sets[2]; c.beginPath(); c.arc(-6, -38, 5, 0, 7); c.arc(5, -44, 4, 0, 7); c.fill();
    c.restore();
  }

  // ------------------------------------------------------------------ Figuren
  // Alle Figuren: (x,y) = Fußpunkt, face = 1 (rechts) oder -1 (links), t = Zeit, moving = läuft
  const SKIN = ['#f5cfa6', '#e2a975', '#c68a5b', '#8d5a3a'];
  function limb(c, x1, y1, x2, y2, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function head(c, x, y, o, r) {
    r = r || 7.6;
    c.fillStyle = o.skin; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = 'rgba(70,40,20,.55)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#2b2118'; c.beginPath(); c.arc(x + 3, y - .6, 1.1, 0, 7); c.fill(); c.beginPath(); c.arc(x - 1.4, y - .6, 1.1, 0, 7); c.fill();
    c.strokeStyle = '#8a3b2b'; c.lineWidth = 1; c.beginPath(); c.arc(x + 1.2, y + 2, 2.2, .15 * Math.PI, .85 * Math.PI); c.stroke();
    c.fillStyle = 'rgba(255,120,120,.35)'; c.beginPath(); c.arc(x + 4.2, y + 2.4, 1.6, 0, 7); c.fill();
  }

  function person(c, x, y, o, t, moving, face) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(0,0,0,.24)'; c.beginPath(); c.ellipse(0, 1, 11, 4, 0, 0, 7); c.fill();
    c.scale(face || 1, 1);
    const ph = moving ? t * 11 : 0, sw = moving ? Math.sin(ph) * 5 : 0, bob = moving ? Math.abs(Math.sin(ph)) * 1.6 : Math.sin(t * 2.2) * .7;
    const legC = o.bottom || '#3d4a63', long = !!o.skirt;
    // Beine
    if (!long) { limb(c, -2.5, -13 - bob * .2, -2.5 + sw, -2, 4.2, legC); limb(c, 2.5, -13 - bob * .2, 2.5 - sw, -2, 4.2, legC); }
    else { c.fillStyle = legC; c.beginPath(); c.moveTo(-8, -15 - bob); c.lineTo(8, -15 - bob); c.lineTo(10 + sw * .25, -5); c.lineTo(-10 + sw * .25, -5); c.closePath(); c.fill(); limb(c, -2.5, -6, -2.5 + sw * .8, -1.5, 3, o.skin); limb(c, 2.5, -6, 2.5 - sw * .8, -1.5, 3, o.skin); }
    c.fillStyle = o.shoe || '#222'; c.beginPath(); c.ellipse(-2.5 + sw, -1.2, 4, 2.4, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(2.5 - sw, -1.2, 4, 2.4, 0, 0, 7); c.fill();
    if (o.socks) { c.fillStyle = '#fff'; c.fillRect(-4.5 + sw * .5, -6, 4, 4); c.fillRect(.5 - sw * .5, -6, 4, 4); }
    // Rucksack
    if (o.pack) { c.fillStyle = o.pack; rr(c, -12, -27 - bob, 8, 14, 3); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.stroke(); }
    // Torso
    c.fillStyle = o.top; rr(c, -6.5, -25 - bob, 13, 14, 4); c.fill(); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 1; c.stroke();
    if (o.number) { c.fillStyle = '#fff'; c.font = '700 8px system-ui,sans-serif'; c.textAlign = 'center'; c.fillText(o.number, 0, -14.5 - bob); }
    if (o.coat) { c.fillStyle = o.coat; c.beginPath(); c.moveTo(-7, -25 - bob); c.lineTo(7, -25 - bob); c.lineTo(9, -9 - bob * .5); c.lineTo(-9, -9 - bob * .5); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 1; c.stroke(); c.strokeStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.moveTo(0, -25 - bob); c.lineTo(0, -9 - bob * .5); c.stroke(); }
    // Arme
    const asw = moving ? Math.sin(ph) * 4 : Math.sin(t * 2.2) * 1.2;
    if (!o.photo) { limb(c, -6, -22 - bob, -7 - asw * .3, -12 - bob + asw * .6, 3.4, o.sleeve || o.top); limb(c, 6, -22 - bob, 7 + asw * .3, -12 - bob - asw * .6, 3.4, o.sleeve || o.top); c.fillStyle = o.skin; c.beginPath(); c.arc(-7 - asw * .3, -11 - bob + asw * .6, 2.2, 0, 7); c.arc(7 + asw * .3, -11 - bob - asw * .6, 2.2, 0, 7); c.fill(); }
    // Kopf und Haare
    const hy = -32.5 - bob;
    if (o.hairBack) { c.fillStyle = o.hair; c.beginPath(); c.ellipse(-4, hy + 2, 6, 8, 0, 0, 7); c.fill(); }
    head(c, 0, hy, o);
    c.fillStyle = o.hair;
    if (o.style === 'bun') { c.beginPath(); c.arc(0, hy - 1, 8, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.beginPath(); c.arc(-6, hy - 8, 4.2, 0, 7); c.fill(); }
    else if (o.style === 'band') { c.beginPath(); c.arc(0, hy - 1, 8, Math.PI * 1.05, Math.PI * 1.95); c.fill(); c.fillStyle = '#e53935'; c.fillRect(-7.7, hy - 4.5, 15.4, 3); }
    else if (o.style === 'beanie') { c.fillStyle = o.beanie || '#e67e22'; c.beginPath(); c.arc(0, hy - 1.5, 8.2, Math.PI, 0); c.fill(); c.fillRect(-8.2, hy - 3.5, 16.4, 3.4); c.beginPath(); c.arc(0, hy - 9.5, 2.2, 0, 7); c.fill(); }
    else if (o.style === 'pony') { c.beginPath(); c.arc(0, hy - 1, 8.2, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.beginPath(); c.ellipse(-8, hy + 4, 3.2, 7, .25, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(0, hy - 1, 8, Math.PI * 1.02, Math.PI * 1.98); c.fill(); }
    if (o.glasses) { c.strokeStyle = '#444'; c.lineWidth = 1; c.beginPath(); c.arc(3, hy - .6, 2.5, 0, 7); c.arc(-1.4, hy - .6, 2.5, 0, 7); c.moveTo(.9, hy - .6); c.lineTo(.2, hy - .6); c.stroke(); }
    c.restore();
  }

  const LOOKS = {
    anwohner: { skin: SKIN[0], hair: '#cfd3d8', style: 'bun', top: '#6aa57a', bottom: '#7b5e8a', skirt: true, glasses: true, shoe: '#4a3a2a' },
    sportler: { skin: SKIN[1], hair: '#3a2a1c', style: 'band', top: '#d32f2f', bottom: '#fff', number: '9', shoe: '#1d4ed8', socks: true },
    schueler: { skin: SKIN[2], hair: '#2a1d12', style: 'beanie', beanie: '#ff9800', top: '#3f7fd8', bottom: '#2e3b55', pack: '#e0572f' },
    mit0: { skin: SKIN[3], hair: '#1a1410', style: 'plain', top: '#8e44ad', bottom: '#334155' },
    mit1: { skin: SKIN[0], hair: '#a8581e', style: 'pony', top: '#16a085', bottom: '#475569', hairBack: false },
    mit2: { skin: SKIN[1], hair: '#222', style: 'plain', top: '#f1c40f', bottom: '#3d4a63' },
    journalistin: { skin: SKIN[1], hair: '#3a2417', style: 'pony', top: '#fff', coat: '#c9a66b', bottom: '#2c3340', shoe: '#3a2a1c' }
  };

  function journalist(c, x, y, o, t, moving, face, photo) {
    person(c, x, y, Object.assign({}, LOOKS.journalistin, { photo: photo > 0 }), t, moving, face);
    c.save(); c.translate(x, y); c.scale(face || 1, 1);
    const bob = moving ? Math.abs(Math.sin(t * 11)) * 1.6 : 0;
    // Umhängetasche + Kamera
    c.strokeStyle = '#6b4a22'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-5, -25 - bob); c.lineTo(5, -13 - bob); c.stroke();
    if (photo > 0) {
      limb(c, 5, -22 - bob, 8, -29 - bob, 3.4, '#c9a66b'); limb(c, -5, -22 - bob, 5, -29 - bob, 3.4, '#c9a66b');
      c.fillStyle = '#37474f'; rr(c, 4, -37 - bob, 11, 8, 2); c.fill(); c.fillStyle = '#90caf9'; c.beginPath(); c.arc(14.2, -33 - bob, 3, 0, 7); c.fill(); c.strokeStyle = '#1c262b'; c.lineWidth = 1; c.stroke();
      const a = Math.max(0, 1 - Math.abs(photo - .5) * 3.2); if (a > 0) { c.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')'; c.beginPath(); c.arc(18, -33 - bob, 9 + a * 8, 0, 7); c.fill(); }
    } else {
      c.fillStyle = '#37474f'; rr(c, 3, -20 - bob, 9, 7, 2); c.fill(); c.fillStyle = '#90caf9'; c.beginPath(); c.arc(7.5, -16.5 - bob, 2.1, 0, 7); c.fill();
    }
    c.fillStyle = '#f6b800'; rr(c, -5, -22 - bob, 6, 4, 1); c.fill(); c.fillStyle = '#6b4a00'; c.fillRect(-4, -20.5 - bob, 4, 1);
    c.restore();
  }

  // Skater: Brett, Mütze, Kapuzenpulli
  function skater(c, x, y, t, moving, face, speedK) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(0,0,0,.26)'; c.beginPath(); c.ellipse(0, 1, 15, 4.5, 0, 0, 7); c.fill();
    c.scale(face || 1, 1);
    const lean = moving ? .13 : 0, bounce = moving ? Math.sin(t * 14) * .7 : Math.sin(t * 2.2) * .5;
    // Brett
    c.save(); c.translate(0, -5 - bounce * .3); c.rotate(moving ? -.05 + Math.sin(t * 9) * .02 : 0);
    c.fillStyle = '#37474f'; c.beginPath(); c.arc(-10, 4, 2.6, 0, 7); c.arc(10, 4, 2.6, 0, 7); c.fill(); c.fillStyle = '#b0bec5'; c.beginPath(); c.arc(-10, 4, 1, 0, 7); c.arc(10, 4, 1, 0, 7); c.fill();
    c.fillStyle = '#1f9d8a'; c.beginPath(); c.moveTo(-17, -2); c.quadraticCurveTo(-18, 1.5, -13, 1.6); c.lineTo(13, 1.6); c.quadraticCurveTo(18, 1.5, 17, -2); c.lineTo(13, 0); c.lineTo(-13, 0); c.closePath(); c.fill(); c.strokeStyle = '#0b5b50'; c.lineWidth = 1.2; c.stroke();
    c.fillStyle = '#ffd54a'; c.fillRect(-5, .1, 10, 1.1);
    c.restore();
    // Körper (mit leichter Neigung)
    c.save(); c.translate(0, -8 - bounce); c.rotate(lean);
    // Beine
    const kick = moving ? Math.sin(t * 6) * 2 : 0;
    limb(c, -6, -2, -4, -11, 4.4, '#2f4f8f'); limb(c, 6 + kick * .3, -2, 4, -11, 4.4, '#2f4f8f');
    c.fillStyle = '#fafafa'; c.beginPath(); c.ellipse(-7, -1.4, 4.3, 2.5, 0, 0, 7); c.ellipse(7 + kick * .3, -1.4, 4.3, 2.5, 0, 0, 7); c.fill(); c.strokeStyle = '#c33'; c.lineWidth = 1; c.stroke();
    // Pulli
    c.fillStyle = '#e74c3c'; rr(c, -7.2, -26, 14.4, 17, 5); c.fill(); c.strokeStyle = 'rgba(70,10,5,.5)'; c.lineWidth = 1.1; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-2, -26); c.lineTo(-2, -20); c.moveTo(2, -26); c.lineTo(2, -20); c.stroke(); c.fillStyle = 'rgba(0,0,0,.18)'; rr(c, -4.5, -16, 9, 5, 2); c.fill();
    // Arme (Balance)
    const ar = moving ? 1 : .4, as = Math.sin(t * 7) * 1.2 * ar;
    limb(c, 6, -23, 14 + as, -17 - as, 3.8, '#e74c3c'); limb(c, -6, -23, -13 - as, -17 + as, 3.8, '#e74c3c'); c.fillStyle = '#f5cfa6'; c.beginPath(); c.arc(14.6 + as, -16.6 - as, 2.3, 0, 7); c.arc(-13.6 - as, -16.6 + as, 2.3, 0, 7); c.fill();
    // Kopf
    head(c, 0, -33, { skin: '#f2c9a0' }, 7.6);
    c.fillStyle = '#3b2a1b'; c.beginPath(); c.ellipse(-6.5, -31, 3, 5, .3, 0, 7); c.fill();
    c.fillStyle = '#2563eb'; c.beginPath(); c.arc(0, -34, 8.3, Math.PI * 1.02, Math.PI * 1.98); c.fill(); c.fillRect(-8.3, -36, 16.6, 3); c.fillStyle = '#1d4ed8'; c.beginPath(); c.moveTo(4, -35); c.quadraticCurveTo(15, -35, 15, -32); c.lineTo(4, -32); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.fillRect(-2, -41, 4, 3);
    c.restore();
    if (moving && speedK) { c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.4; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const yy = -8 - i * 6; c.beginPath(); c.moveTo(-20 - i * 3, yy); c.lineTo(-27 - i * 3, yy); c.stroke(); } }
    c.restore();
  }

  function excavator(c, x, y, t) {
    c.save(); c.translate(x, y); const arm = Math.sin(t * 1.4) * .12;
    c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.ellipse(0, 2, 40, 7, 0, 0, 7); c.fill();
    // Raupen
    c.fillStyle = '#2f3a42'; rr(c, -34, -15, 68, 15, 7.5); c.fill(); c.fillStyle = '#4a5760'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-24 + i * 16, -7.5, 4.3, 0, 7); c.fill(); }
    c.strokeStyle = '#1b2329'; c.lineWidth = 1.5; c.stroke();
    // Oberwagen
    c.fillStyle = '#f6b800'; rr(c, -26, -32, 44, 18, 4); c.fill(); c.strokeStyle = '#8a6500'; c.lineWidth = 1.6; c.stroke();
    c.fillStyle = '#f6b800'; rr(c, -34, -30, 12, 14, 4); c.fill(); c.stroke();
    // Kabine
    c.fillStyle = '#f6b800'; rr(c, -10, -52, 24, 22, 4); c.fill(); c.stroke(); c.fillStyle = '#9bdcf7'; rr(c, -7, -49, 18, 15, 3); c.fill(); c.strokeStyle = '#5c8aa3'; c.stroke();
    c.fillStyle = '#e8a37c'; c.beginPath(); c.arc(1, -41, 4.2, 0, 7); c.fill(); c.fillStyle = '#f6b800'; c.beginPath(); c.arc(1, -43, 4.6, Math.PI, 0); c.fill();
    // Ausleger + Löffel
    c.save(); c.translate(14, -34); c.rotate(-.55 + arm);
    c.strokeStyle = '#d99f00'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(34, -4); c.stroke(); c.strokeStyle = '#8a6500'; c.lineWidth = 1.4; c.stroke();
    c.translate(34, -4); c.rotate(1.35 - arm * 2.2); c.strokeStyle = '#d99f00'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(24, 0); c.stroke();
    c.translate(24, 0); c.rotate(.9); c.fillStyle = '#6b7280'; c.beginPath(); c.moveTo(-2, -5); c.lineTo(12, -4); c.lineTo(15, 5); c.lineTo(-3, 7); c.closePath(); c.fill(); c.strokeStyle = '#2f3a42'; c.lineWidth = 1.4; c.stroke();
    c.restore();
    // Warnstreifen
    c.fillStyle = '#222'; for (let i = 0; i < 5; i++) { c.fillRect(-24 + i * 8, -20, 4, 5); }
    c.restore();
  }

  function cone(c, x, y) { c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(x, y + 1, 7, 2.5, 0, 0, 7); c.fill(); c.fillStyle = '#ff6a1f'; c.beginPath(); c.moveTo(x - 5, y); c.lineTo(x - 1.6, y - 15); c.lineTo(x + 1.6, y - 15); c.lineTo(x + 5, y); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.fillRect(x - 3.4, y - 9, 6.8, 2.6); c.fillStyle = '#c24a12'; c.fillRect(x - 6, y - 1, 12, 2); }
  function sign(c, x, y) { c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(x, y + 1, 8, 2.5, 0, 0, 7); c.fill(); c.fillStyle = '#666'; c.fillRect(x - 1, y - 24, 2.4, 24); c.fillStyle = '#ffd400'; c.beginPath(); c.moveTo(x, y - 36); c.lineTo(x + 12, y - 16); c.lineTo(x - 12, y - 16); c.closePath(); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 1.6; c.stroke(); c.fillStyle = '#222'; c.fillRect(x - .8, y - 30, 1.8, 7); c.beginPath(); c.arc(x, y - 20.5, 1.1, 0, 7); c.fill(); }

  // Sammelgegenstand: Symbol mit leuchtendem Ring, schwebend
  function pickup(c, name, x, y, t, onload) {
    const im = iconImg(name, onload), b = Math.sin(t * 3) * 3;
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 12, 12 - b * .3, 4, 0, 0, 7); c.fill();
    const g = c.createRadialGradient(0, -4 + b, 2, 0, -4 + b, 22); g.addColorStop(0, 'rgba(255,236,150,.95)'); g.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, -4 + b, 22, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.strokeStyle = '#f59e0b'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, -4 + b, 15, 0, 7); c.fill(); c.stroke();
    if (im._ok) c.drawImage(im, -11, -15 + b, 22, 22);
    c.restore();
  }

  function marker(c, x, y, t) { // schwebender Pfeil über einem Ziel
    const b = Math.sin(t * 5) * 3; c.save(); c.translate(x, y + b); c.fillStyle = '#f59e0b'; c.strokeStyle = '#fff'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(0, 0); c.lineTo(-8, -11); c.lineTo(-3, -11); c.lineTo(-3, -19); c.lineTo(3, -19); c.lineTo(3, -11); c.lineTo(8, -11); c.closePath(); c.stroke(); c.fill(); c.restore();
  }

  window.WPArt = { W, H, BLD, TREES, ICONS, ico, iconImg, drawMap, tree, person, journalist, skater, excavator, cone, sign, pickup, marker, LOOKS, rr, rng };
})();
