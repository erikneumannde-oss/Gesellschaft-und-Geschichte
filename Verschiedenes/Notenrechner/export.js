/* PDF-Export der Gesamtübersicht. Wird erst beim ersten Export geladen. */
(function () {
    'use strict';

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Skript nicht ladbar: ' + src));
            document.head.append(s);
        });
    }

    async function fetchBytes(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error('Datei nicht ladbar: ' + url);
        return new Uint8Array(await r.arrayBuffer());
    }

    // rows: [{ name, kind, res, note, flag }]
    async function build(rows) {
        if (!window.PDFLib) await loadScript('lib/pdf-lib.min.js');
        if (!window.fontkit) await loadScript('lib/fontkit.umd.min.js');
        const PDFLib = window.PDFLib;
        const rgb = PDFLib.rgb;
        const [regBytes, boldBytes] = await Promise.all([
            fetchBytes('lib/fonts/DejaVuSans.ttf'),
            fetchBytes('lib/fonts/DejaVuSans-Bold.ttf')
        ]);
        const doc = await PDFLib.PDFDocument.create();
        doc.registerFontkit(window.fontkit);
        const font = await doc.embedFont(regBytes, { subset: true });
        const bold = await doc.embedFont(boldBytes, { subset: true });
        const dateStr = new Date().toLocaleDateString('de-DE');

        const ink = rgb(0.13, 0.16, 0.2), grey = rgb(0.45, 0.48, 0.52), line = rgb(0.72, 0.76, 0.8);
        const headBg = rgb(0.9, 0.93, 0.96), zebra = rgb(0.965, 0.975, 0.985), accent = rgb(0.15, 0.68, 0.38);
        const red = rgb(0.78, 0.1, 0.1), redBg = rgb(0.99, 0.9, 0.9);

        const W = 595.28, H = 841.89, M = 40;
        const pages = [];

        function fit(text, f, size, maxW) {
            if (f.widthOfTextAtSize(text, size) <= maxW) return text;
            let t = text;
            while (t.length > 1 && f.widthOfTextAtSize(t + '…', size) > maxW) t = t.slice(0, -1);
            return t + '…';
        }
        function wrap(text, f, size, maxW) {
            const words = text.split(' '), lines = [];
            let cur = '';
            words.forEach(w => {
                const t = cur ? cur + ' ' + w : w;
                if (f.widthOfTextAtSize(t, size) <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
            });
            if (cur) lines.push(cur);
            return lines;
        }

        const colX = [M, M + 160, M + 360, M + 440, W - M];   // Fach | Stufe | Ergebnis | Note
        const heads = ['Fach', 'Stufe', 'Ergebnis', 'Note'];
        const rowH = 26;

        function newPage(first) {
            const page = doc.addPage([W, H]);
            pages.push(page);
            const text = (t, x, y, size, f, color, align, maxW) => {
                if (!t) return;
                const s = maxW ? fit(t, f, size, maxW) : t;
                const w = f.widthOfTextAtSize(s, size);
                page.drawText(s, { x: align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, y: y, size: size, font: f, color: color || ink });
            };
            let y = H - M - 4;
            text('Notenübersicht', M, y - 14, 18, bold, ink);
            text('Stand: ' + dateStr, W - M, y - 12, 9, font, grey, 'right');
            y -= 30;
            // roter Hinweis
            const msg = 'NICHT VERBINDLICH: Dieser Notenrechner dient nur der eigenen Orientierung. Die Zeugnisnote legt allein die Lehrkraft fest.';
            const lines = wrap(msg, bold, 9.5, W - 2 * M - 20);
            const bh = lines.length * 13 + 12;
            page.drawRectangle({ x: M, y: y - bh, width: W - 2 * M, height: bh, color: redBg, borderColor: red, borderWidth: 1.2 });
            lines.forEach((l, i) => text(l, M + 10, y - 17 - i * 13, 9.5, bold, red));
            y -= bh + 18;
            // Tabellenkopf
            page.drawRectangle({ x: M, y: y - 22, width: W - 2 * M, height: 22, color: headBg });
            page.drawRectangle({ x: M, y: y - 22, width: W - 2 * M, height: 1.5, color: accent });
            heads.forEach((h, i) => text(h, colX[i] + 6, y - 15, 9, bold, ink));
            return { page: page, text: text, y: y - 22 };
        }

        let ctx = newPage(true);
        const bottom = M + 24;
        let rowIndex = 0;
        if (!rows.length) ctx.text('Es sind noch keine Fächer angelegt.', M, ctx.y - 24, 10, font, grey);
        rows.forEach(r => {
            if (ctx.y - rowH < bottom) ctx = newPage(false);
            const yb = ctx.y - rowH;
            if (rowIndex % 2 === 1) ctx.page.drawRectangle({ x: M, y: yb, width: W - 2 * M, height: rowH, color: zebra });
            const ty = yb + 9;
            ctx.text(r.name, colX[0] + 6, ty, 10.5, bold, ink, 'left', colX[1] - colX[0] - 12);
            ctx.text(r.kind, colX[1] + 6, ty, 8.5, font, grey, 'left', colX[2] - colX[1] - 10);
            ctx.text(r.res, colX[2] + 6, ty, 10, font, ink, 'left', colX[3] - colX[2] - 10);
            if (r.flag) ctx.text(r.flag, colX[3] + 6, ty, 8, font, grey, 'left', colX[4] - colX[3] - 8);
            else {
                const m = /^(\S+) \(vorläufig\)$/.exec(r.note || '');
                const main = m ? m[1] : r.note;
                ctx.text(main, colX[3] + 6, ty, 12, bold, ink, 'left', colX[4] - colX[3] - 8);
                if (m) ctx.text('vorläufig', colX[3] + 12 + bold.widthOfTextAtSize(main, 12), ty, 7.5, font, grey);
            }
            ctx.page.drawLine({ start: { x: M, y: yb }, end: { x: W - M, y: yb }, thickness: 0.4, color: line });
            ctx.y = yb;
            rowIndex++;
        });

        pages.forEach((p, i) => {
            const t = 'Notenrechner · Seite ' + (i + 1) + ' von ' + pages.length;
            p.drawText(t, { x: M, y: M - 10, size: 7.5, font: font, color: grey });
            const n = 'Nicht verbindlich – die Zeugnisnote legt die Lehrkraft fest.';
            p.drawText(n, { x: W - M - font.widthOfTextAtSize(n, 7.5), y: M - 10, size: 7.5, font: font, color: red });
        });

        return await doc.save();
    }

    window.NRExport = { build: build };
})();
