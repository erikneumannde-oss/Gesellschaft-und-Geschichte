/*
  Tinto & Rolli in den Lernmodulen.
  Einbinden (am Ende von <body>):  <script src="../../../maskottchen/duo-app.js"></script>
  Erkennt das Modul am Ordnernamen, erklärt beim ersten Öffnen pro Sitzung kurz, worum es geht,
  hilft beim Antippen, kommentiert das Thema und reagiert auf Rückmeldungen im Modul.
  Es werden keine Daten gespeichert oder übertragen (nur Anzeige-Einstellungen im Browser).
*/
(function () {
  'use strict';
  var me = document.currentScript;
  if (!me || !me.src) return;
  var base = me.src.replace(/duo-app\.js.*$/, '');
  var rel = decodeURIComponent(location.href.replace(/[?#].*$/, '').slice(base.replace(/maskottchen\/$/, '').length)).replace(/\/?index\.html$/, '').replace(/\/$/, '');
  var folder = rel.split('/').pop().normalize ? rel.split('/').pop().normalize('NFC') : rel.split('/').pop();

  // Pro Modul: was es ist (ein Satz, ohne zu verraten, was richtig ist) und ein praktischer Tipp.
  var APPS = {
    'Absolutismus': {
      topic: 'absolutismus',
      text: 'Hier erarbeitest du in vier Modulen, wie der Absolutismus in Frankreich funktionierte: von den Grundlagen über den König bis zum Aufbau der Herrschaft.',
      tip: 'Lies jeden Text einmal in Ruhe, bevor du die Aufgaben machst. Wenn eine Antwort nicht stimmt, lies die Stelle noch einmal genau. Die Antworten sind bewusst ähnlich formuliert.'
    },
    'Armut-im-Absolutismus': {
      topic: 'armut', tone: 'serious',
      text: 'In diesem Spiel erlebst du das Leben einer Familie im Paris des Jahres 1695 und musst über sechs Jahre hinweg Entscheidungen treffen.',
      tip: 'Achte auf deine Anzeigen für Geld, Gesundheit und Beobachtung. Jede Entscheidung wirkt sich aus. Es gibt kein „perfektes“ Leben, sondern nur Abwägen.',
      bottom: 90
    },
    'Aufklärung': {
      topic: 'aufklaerung',
      text: 'Hier gehst du mit einem Lernspiel durch Kants Gedanken zur Aufklärung, machst zwischendurch einen Wissens-Check und am Ende eine Abschlussprüfung als Lückentext.',
      tip: 'Nimm dir Zeit für die Texte unterwegs. Im Lückentext brauchst du genau die Begriffe, die dir vorher begegnet sind.'
    },
    'Friedrich-der-Grosse': {
      topic: 'friedrich', tone: 'serious',
      text: 'Hier arbeitet ihr in der Gruppe zu Friedrich dem Großen. Jedes Kapitel hat ein Passwort, und am Ende entsteht ein Plakat.',
      tip: 'Das Passwort für ein Kapitel bekommt ihr von eurer Lehrkraft oder erarbeitet es euch im Kapitel davor. Verteilt die Aufgaben in der Gruppe und schaut am Ende gemeinsam auf das Plakat.'
    },
    'Glorious-Revolution': {
      topic: 'revolution',
      text: 'In dieser Simulation erlebst du die Glorious Revolution von 1688/89. Du klickst wichtige Wörter an, beantwortest ein Quiz und kannst am Ende ein PDF erzeugen.',
      tip: 'Klicke beim Lesen die Wörter an, die dir wichtig erscheinen. Das PDF am Ende fasst deine Ergebnisse zusammen.',
      bottom: 90
    },
    'Franzoesische-Revolution': {
      topic: 'courrier',
      text: 'Du arbeitest anonym für die Pariser Zeitung „Le Courrier“ und stellst ihre Titelseite zusammen. Jedes leere Feld ist eine Mappe mit Aufgaben. Ist sie fertig, wird das Feld gedruckt.',
      tip: 'Fang mit dem Aufmacher an, er gibt dir den Überblick. Lies die Texte in der Mappe in Ruhe, bevor du antwortest. Wenn dir ein Wort fremd ist, tipp uns an und wähle „Wort erklären“.',
      intro: false, clickNext: true
    },
    'Paulskirchenparlament': {
      topic: 'paulskirche',
      text: 'Du bist Mitglied der Nationalversammlung von 1848/49. Du öffnest die Geheimakte, ordnest Argumente zu, fasst einen Beschluss und schreibst ein Protokoll.',
      tip: 'Überlege bei jeder Depesche: Wer könnte das fordern und warum? Dann fällt dir die Zuordnung leichter.'
    },
    'Euro': {
      topic: 'euro',
      text: 'Das ist ein Planspiel: Du spielst eine Rolle im fiktiven Land Novarien und entscheidest mit, wie sich Novarien in der Währungsunion verhält.',
      tip: 'Lies zuerst deine Rolle in Ruhe durch und notiere dir, was dein Land will. Wenn du bei einer Aufgabe nicht weiterkommst, lies den Text darüber noch einmal und suche die Schlüsselwörter. Bei den Zuordnungen kannst du so oft probieren, wie du willst. Rot markierte Karten zeigen dir, wo du noch einmal hinschauen solltest.',
      more: true
    },
    'EU-Reise': {
      topic: 'eu',
      text: 'Du bist Praktikant oder Praktikantin bei der EU und sammelst in sechs Stationen Punkte. Jede Frage kannst du nur einmal beantworten.',
      tip: 'Lies die kurze Einführung jeder Station und danach jede Frage in Ruhe. Bei den Antwortmöglichkeiten lohnt es sich, zuerst das auszuschließen, was sicher nicht passt. Nach jeder Antwort steht eine Erklärung dabei.',
      more: true
    },
    'Dimensionen-der-Politik': {
      topic: 'dimensionen',
      text: 'Hier lernst du die drei Dimensionen von Politik kennen: Inhalt, Form und Prozess. Du ordnest Beispiele zu, damit du sie unterscheiden kannst.',
      tip: 'Frag dich bei jedem Beispiel: Geht es um das Was (Inhalt), um Regeln und Ordnung (Form) oder um das Wie und den Streit darum (Prozess)?',
      bottom: 90
    },
    'Karikaturanalyse': {
      topic: 'karikatur',
      text: 'Hier lernst du Schritt für Schritt, wie man eine Karikatur analysiert: erst die formalen Angaben, dann Beschreibung, Deutung und Beurteilung.',
      tip: 'Du kannst dein eigenes Bild laden. Beginne immer mit dem, was du wirklich siehst, und deute erst danach. Wenn du etwas nicht kennst, markiere die Stelle und recherchiere kurz.'
    },
    'Kinderrechte': {
      topic: 'kinderrechte',
      text: 'Hier bekommst du 16 Alltagssituationen. Du entscheidest jeweils, ob sie erlaubt sind oder gegen Kinderrechte verstoßen.',
      tip: 'Überlege: Geht es um Schutz, um Förderung oder um Beteiligung? Die Rückmeldung nach deiner Entscheidung erklärt dir, warum.'
    },
    'Klimawandel': {
      topic: 'klima', tone: 'serious',
      text: 'In dieser Animation reist du mit Lily Braun durch die Folgen des Klimawandels und stellst am CO₂-Regler selbst ein, wie sich die Erde verändert.',
      tip: 'Probiere den Regler in Ruhe aus und schau, was sich bei jeder Stufe verändert. Die Texte von Lily solltest du in deinem Tempo lesen.',
      bottom: 170
    },
    'Smartphone-Lieferkette': {
      topic: 'lieferkette',
      text: 'Hier verfolgst du den Weg eines Smartphones in neun Schritten von den Rohstoffen bis zum Verkauf: Du ordnest die Schritte und findest die Länder auf der Weltkarte.',
      tip: 'Tippe ein Kärtchen an, dann leuchten passende Länder auf der Karte auf. Das hilft dir bei der Reihenfolge. Das PDF kannst du nach einer richtigen Lösung herunterladen.'
    },
    'Was-ist-Globalisierung': {
      topic: 'globalisierung',
      text: 'Hier erarbeitest du in drei Schritten, was Globalisierung ist: Du ordnest Dinge nach Inland und Ausland, lernst die Dimensionen kennen und prüfst Chancen und Risiken.',
      tip: 'Schau bei den Gegenständen auf das Etikett: Wo wurde etwas hergestellt, und wo kommen die Rohstoffe her? Rot markierte Begriffe darfst du neu einsortieren.'
    },
    'Was-ist-Politik': {
      topic: 'politik',
      text: 'Hier bist du in Spandau unterwegs und erlebst in drei Modulen, was Politik im Alltag bedeutet. Du sammelst Beweise und findest heraus, welche Ebene zuständig ist.',
      tip: 'Sprich mit den Figuren und lies die Hinweise im Dialog ganz. Wenn du nicht weiter weißt, überlege: Wer ist für diese Frage zuständig, der Bezirk, das Land oder der Staat?'
    }
  };

  // Kommentare zum Thema (kurz, sachlich richtig, nie über Kriege oder den Holocaust gescherzt)
  var TOPIC = {
    absolutismus: ['Ludwig XIV. war über 72 Jahre König. Viele seiner Untertanen erlebten nie einen anderen.', 'In Versailles gab es einen ganzen Saal voller Spiegel. Das sollte Eindruck machen.', 'Absolutismus heißt: Der Herrscher ist „losgelöst“ von Gesetzen. Dahinter steckt das lateinische „absolutus“.'],
    armut: ['Wer arm war, hatte damals kaum Wege nach oben. Überleg beim Spielen, was dir fehlen würde.', 'Im Spiel zählt jede Entscheidung. Auch kleine.', 'Gesundheit war damals oft das größte Kapital der armen Leute.'],
    aufklaerung: ['„Habe Mut, dich deines eigenen Verstandes zu bedienen“, schrieb Kant. Das passt zu jeder Hausaufgabe.', 'Die Aufklärung wollte, dass Menschen selbst denken, statt nur zu glauben, was man ihnen sagt.', 'Kant war angeblich so pünktlich, dass die Nachbarn nach ihm die Uhr stellten.'],
    friedrich: ['Friedrich II. wurde „der Alte Fritz“ genannt. Sein Schloss Sanssouci heißt übersetzt „ohne Sorge“.', 'Er regierte von 1740 bis 1786, also fast 46 Jahre.', 'Gruppenarbeit klappt am besten, wenn jeder ein Stück übernimmt und alle am Ende zusammenfügen.'],
    revolution: ['Die Glorious Revolution heißt „glorreich“, weil sie weitgehend ohne Blutvergießen ablief.', 'Die Bill of Rights von 1689 beschränkte die Macht des englischen Königs.', 'Ein Parlament, das dem König Bedingungen stellt: Das war damals eine große Sache.'],
    courrier: ['Nach 1789 erschienen in Paris Hunderte neue Zeitungen. Vorher hatte es nur wenige gegeben.', 'Viele Menschen konnten damals nicht lesen. Zeitungen wurden deshalb oft laut vorgelesen, auf Plätzen und in Cafés.', 'Viele Journalisten schrieben ohne ihren Namen oder unter einem Decknamen. Das konnte sie schützen.'],
    paulskirche: ['Das Parlament tagte in einer Kirche, in der Frankfurter Paulskirche. Heute ist sie ein Ort der Erinnerung.', 'Die Abgeordneten von 1848 wollten ein geeintes Deutschland mit Grundrechten.', 'Hier wurde heftig gestritten und trotzdem versucht, einen Beschluss zu finden. Das ist Demokratie.'],
    eu: ['Das Europäische Parlament tagt abwechselnd in Brüssel und Straßburg. Das kostet viel Zeit und Geld und ist seit Jahren umstritten.', 'Die EU hat 24 Amtssprachen. Viele Texte werden deshalb in alle Sprachen übersetzt.', 'Ein Gesetz in der EU braucht oft Jahre. Beim einheitlichen Ladekabel waren es mehr als 15.'],
    euro: ['Den Euro gibt es als Bargeld seit dem 1. Januar 2002. Vorher brauchte man an der Grenze oft anderes Geld.', 'Eine gemeinsame Währung heißt auch: Länder müssen sich abstimmen. Das ist anstrengend, aber lehrreich.', 'In Novarien wird verhandelt wie in echt: Jede Seite hat gute Gründe.'],
    dimensionen: ['Das Wort Politik kommt vom griechischen „polis“, dem Stadtstaat.', 'Inhalt, Form, Prozess: Drei Brillen, durch die man dieselbe Politik anschauen kann.', 'Politik findet nicht nur im Bundestag statt, auch im Klassenrat.'],
    karikatur: ['„Karikatur“ kommt vom italienischen „caricare“: überladen oder übertreiben.', 'Eine gute Karikatur erkennt man oft an dem, was bewusst übertrieben ist.', 'Erst genau hinsehen, dann deuten. Sonst sieht man nur, was man schon erwartet.'],
    kinderrechte: ['Die UN-Kinderrechtskonvention wurde 1989 beschlossen. Sie gilt für alle unter 18.', 'Kinderrechte gelten überall auf der Welt, auch für dich.', 'Schutz, Förderung, Beteiligung: Daran kann man viele Kinderrechte erkennen.'],
    klima: ['Wetter ist das, was heute draußen passiert. Klima ist der Durchschnitt über viele Jahre.', 'Kleine Änderungen bei der Temperatur können große Wirkung haben, vor allem über lange Zeit.', 'Der CO₂-Regler zeigt, wie eng Ursache und Wirkung zusammenhängen.'],
    lieferkette: ['In einem Smartphone stecken Rohstoffe aus vielen Teilen der Welt.', 'Ein Smartphone ist schon gereist, bevor es bei dir ankommt.', 'Lieferketten sind lang, und genau darum ist es schwer, sie im Blick zu behalten.'],
    globalisierung: ['Dein Frühstück hat vermutlich schon mehr von der Welt gesehen als du.', 'Globalisierung bringt Chancen und Risiken. Meistens kommt beides zusammen.', 'Waren, Ideen, Geld und Menschen sind heute viel schneller unterwegs als früher.'],
    politik: ['Spandau ist ein Berliner Bezirk und hat eine eigene Bezirksverordnetenversammlung.', 'Politik fängt oft vor der Haustür an, zum Beispiel bei Lärm, Straßen und Spielplätzen.', 'Nicht jede Ebene ist für alles zuständig. Das herauszufinden gehört dazu.']
  };

  // Erkennung von Rückmeldungen in den Modulen (vorsichtig, nur bekannte Stellen)
  var CHECKS = {
    'Absolutismus': [
      { sel: '#quiz-result', tips: ['Erinnere dich an Modul 1: Die Legislative legt Regeln fest, die Exekutive setzt sie um, die Judikative urteilt. Wende das bei jeder Handlung des Königs an.', 'Frag dich bei jeder Handlung: Wird hier etwas neu festgelegt, etwas umgesetzt oder über Recht und Unrecht entschieden?', 'Lies die Handlung langsam. Das Verb in dem Satz verrät dir oft, um welche Staatsgewalt es geht.'] },
      { sel: '#drag-result', tips: ['Lies in Modul 3 nach, was die Gruppen am Hof und im Land tatsächlich getan haben. Nicht jede Rolle übt eine Staatsgewalt aus.', 'Manche Karten gehören in kein Feld der drei Gewalten. Auch das kann eine richtige Entscheidung sein.', 'Fang mit den Karten an, bei denen du dir sicher bist. Dann bleiben weniger übrig.'] },
      { sel: '#final-result', tips: ['Die Antworten stehen in Modul 3. Lies den Text gezielt zu der Frage, die rot markiert ist.', 'Achte auf den Unterschied zwischen dem, was der König beanspruchte, und dem, was er wirklich durchsetzen konnte.', 'Lies die Antwortmöglichkeiten einzeln und streiche zuerst aus, was sicher nicht passt.'] },
      { sel: '.feedback', tips: ['Lies den Abschnitt im Modul noch einmal in Ruhe. Die Begriffe sind bewusst ähnlich, achte auf kleine Unterschiede.'] }
    ],
    'Aufklärung': [
      { sel: '#cloze-feedback', tips: ['Denk an die Stationen, an denen Kant dir etwas erklärt hat. Die Begriffe für den Lückentext sind dir dort begegnet.', 'Lies den Satz vor und nach der Lücke. Passt das Wort vom Sinn und von der Grammatik her?', 'Fang mit den Lücken an, bei denen du dir sicher bist. Die anderen werden dadurch leichter.'] }
    ],
    'Paulskirchenparlament': [
      { sel: '#feedback', tips: ['Lies Aktenlage und Zeitdokument noch einmal. Wer spricht hier, und was möchte er erreichen?', 'Frag dich: Wer würde diese Forderung aufstellen, und warum passt sie zu seinen Interessen?', 'Achte auf Schlüsselwörter im Zitat. Sie zeigen oft, welche Seite spricht.'] }
    ],
    'EU-Reise': [
      { sel: '.fb', tips: ['Lies nach jeder Antwort die Erklärung darunter. Sie zeigt dir, woran du das Richtige erkennst.', 'Frag dich bei den Zuständigkeiten: Betrifft das alle Länder gleich (dann eher EU) oder hängt es vom Land ab?', 'Bei Gesetzen gilt: Die Kommission schlägt vor, Parlament und Rat beschließen, und die Länder setzen eine Richtlinie um.'] }
    ],
    'Euro': [
      { sel: '.fb', tips: ['Lies den Text über der Aufgabe noch einmal und suche die Schlüsselwörter. Sie stehen oft fast wörtlich in der richtigen Antwort.', 'Denk an deine Rolle in Novarien: Was will sie, und was befürchtet sie? Das hilft beim Abwägen.', 'Bei den Zuordnungen kannst du so oft probieren, wie du willst. Rot markierte Karten zeigen dir, wo du noch einmal hinschauen solltest.', 'Frag dich bei jeder Aussage: Gilt sie für alle Länder der Währungsunion oder nur für bestimmte?'] }
    ],
    'Karikaturanalyse': [
      { sel: '.fb', tips: ['Beschreibe zuerst nur, was du siehst. Das Deuten kommt erst danach.', 'Karikaturen übertreiben bewusst. Was ist auffallend groß, klein oder seltsam gezeichnet?', 'Die formalen Angaben stehen in der Quellenangabe: Titel, Thema, Jahr, Zeichner und Ort.', 'Frag dich: Was will der Zeichner kritisieren, und worauf möchte er hinweisen?'] }
    ],
    'Kinderrechte': [
      { sel: '#feedback-title', tips: ['Es geht nur darum, ob das Handeln gesetzlich erlaubt ist, nicht darum, ob du es fair findest.', 'Eltern und Lehrkräfte haben einen Erziehungs- und Schutzauftrag. Aber auch dort gibt es Grenzen.', 'Überlege: Geht es um Schutz, um Förderung oder um Beteiligung? Die Rückmeldung nach deiner Entscheidung erklärt dir den Grund.'] }
    ],
    'Smartphone-Lieferkette': [
      { sel: '#result', tips: ['Tippe ein Kärtchen an, dann leuchten die passenden Länder auf der Karte. Das hilft dir bei der Reihenfolge.', 'Überlege rückwärts: Was muss schon fertig sein, bevor der nächste Schritt möglich ist?', 'Beginne mit dem Schritt, bei dem du dir am sichersten bist, und baue von dort vorwärts und rückwärts auf.'] },
      { sel: '#quizResult', tips: ['Schau dir die Karte noch einmal an: Welche Länder leuchten bei diesem Schritt auf?', 'Lies die Frage in Ruhe und streiche zuerst aus, was sicher nicht passt.'] }
    ],
    'Was-ist-Globalisierung': [
      { sel: '#gap-feedback, #eval-success-msg', tips: ['Schau auf das Etikett: Wo wurde der Gegenstand hergestellt, und woher kommen die Rohstoffe?', 'Rot markierte Begriffe darfst du neu einsortieren. Denk dabei an Waren, Ideen, Geld und Menschen.', 'Überlege bei Lebensmitteln: Wächst das bei uns, und gibt es das das ganze Jahr?'] }
    ],
    'Was-ist-Politik': [
      { sel: '#fbmsg .fb', tips: ['Lies die Frage noch einmal ganz und danach jede Antwort einzeln.', 'Denk an das, was dir die Figuren in Spandau erklärt haben. Die Hinweise aus den Dialogen helfen dir hier.', 'Streiche zuerst aus, was sicher nicht passt. Dann bleibt weniger übrig.'] },
      { sel: '#m3msg .fb', tips: ['Tippe zuerst einen Begriff an und danach die Lücke. Prüfe, ob der Satz mit dem Begriff Sinn ergibt.', 'Jeder Begriff passt nur an eine Stelle. Beginne mit der Lücke, bei der du dir sicher bist.'] }
    ]
  };
  var GOOD = /^\s*(✓|✔|richtig|korrekt|perfekt|hervorragend|super|alles richtig|prima|sehr gut|glückwunsch|depesche historisch korrekt)/i;
  var BAD = /^\s*(✗|✘|✖|×|falsch|leider|nicht ganz|noch nicht|einige|prüfe|überprüfe|\d+\s+von\s+\d+)/i;
  var GOOD_CLS = /(^|[\s_-])(ok|correct|richtig|right|success|good)($|[\s_-])/i, BAD_CLS = /(^|[\s_-])(bad|wrong|falsch|incorrect|error|fail)($|[\s_-])/i;
  function verdict(n) {
    var c = (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '', t = (n.textContent || '').trim();
    if (!t || t.length > 400 || /^\s*Bitte /.test(t)) return '';
    if (BAD_CLS.test(c) || BAD.test(t)) { if (/^\s*\d+\s+von\s+\d+/i.test(t)) { var m = t.match(/(\d+)\s+von\s+(\d+)/); if (m && m[1] === m[2]) return 'good'; } return 'bad'; }
    if (GOOD_CLS.test(c) || GOOD.test(t)) return 'good';
    return '';
  }

  var PRAISE = ['Das läuft richtig gut bei dir!', 'Du bist richtig fleißig. Weiter so!', 'Schon so viel geschafft. Stark!', 'Dranbleiben lohnt sich, du machst das prima.'];
  var GOODS = ['Richtig! Das hast du super gelöst. 🎉', 'Stimmt, richtig gemacht!', 'Genau so ist es! Stark.', 'Volltreffer! Weiter so.', 'Das passt. Sehr gut!'];
  var BADS = ['Das stimmt noch nicht ganz. Kein Problem, versuch es noch einmal.', 'Nicht ganz, aber das kriegst du hin.', 'Hm, so noch nicht. Fehler gehören zum Lernen dazu.', 'Fast! Schau noch einmal in Ruhe hin.'];
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

  function run() {
    var app = APPS[folder] || null;
    var help = app ? { text: app.text, tip: app.tip } : null;
    var comments = app && TOPIC[app.topic] ? TOPIC[app.topic] : [];
    Duo.init({ id: 'app-' + folder, offsetBottom: app && app.bottom ? app.bottom : 56, comments: comments, tone: app && app.tone ? app.tone : '', intro: !(app && app.intro === false), clickNext: !!(app && app.clickNext), tapHelp: help ? function () { return help; } : null, idleHelp: help ? function () { return help; } : null });

    // erster Hinweis pro Sitzung
    var key = 'tr-expl-' + rel, seen = false;
    try { seen = !!sessionStorage.getItem(key); } catch (e) {}
    if (help && !seen) {
      var tries = 0;
      setTimeout(function go() {
        var ok = Duo.say(help.text, 'interested', 'R');
        if (ok) { try { sessionStorage.setItem(key, '1'); } catch (e) {} } else if (++tries < 6) setTimeout(go, 6000);
      }, 2600);
    }

    // Lob nach vielen Aktionen
    var clicks = 0, nextPraise = 40;
    document.addEventListener('click', function (e) {
      if (!e.target.closest || e.target.closest('#dc-root')) return;
      if ((app && app.tone === 'serious') || (Duo.getTone && Duo.getTone() === 'serious')) return;
      if (++clicks >= nextPraise) { nextPraise += 40; Duo.react('love', rnd(PRAISE), 'T'); }
    }, true);

    // Armutsspiel: bei Verlusten still und ernst bleiben
    if (folder === 'Armut-im-Absolutismus' && window.MutationObserver) {
      var lastLoss = 0, seenTxt = '';
      var evt = [
        [/Ein Kind ist verloren|Mann ist gestorben|eines ist gestorben|Baby stirbt|Kind.{0,20}gestorben/i, 'Das ist ein schwerer Verlust. Nimm dir einen Moment, bevor du weitermachst.'],
        [/zusammengebrochen|Deine Kräfte sind am Ende|bricht dein Körper/i, 'Das war zu viel für deine Figur. Lies in Ruhe, was passiert ist.'],
        [/Ende:/i, 'Das Spiel ist zu Ende. Schau dir die Auswertung in Ruhe an.']
      ];
      var t2 = null;
      new MutationObserver(function () { clearTimeout(t2); t2 = setTimeout(function () {
        var n = document.getElementById('scenario-text'); if (!n) return; var txt = n.textContent || '';
        if (txt === seenTxt) return; seenTxt = txt;
        for (var i = 0; i < evt.length; i++) if (evt[i][0].test(txt)) { var now = Date.now(); if (now - lastLoss < 8000) return; lastLoss = now; Duo.mood('sad', 8000); setTimeout(function (m) { return function () { Duo.tell(m, 'sad', 'R'); }; }(evt[i][1]), 1200); return; }
      }, 500); }).observe(document.body, { subtree: true, childList: true, characterData: true });
    }

    // Rückmeldungen prüfen: sagen, ob es richtig oder falsch ist, und bei Fehlern einen Tipp zum Modul geben
    var entries = CHECKS[folder];
    if (entries && window.MutationObserver) {
      var all = entries.map(function (e) { return e.sel; }).join(','), serious = app && app.tone === 'serious';
      var last = window.WeakMap ? new WeakMap() : null, lastSay = 0, fails = {}, timer = null;
      var entryOf = function (n) { for (var k = 0; k < entries.length; k++) if (n.matches && n.matches(entries[k].sel)) return k; return -1; };
      function scan() {
        var nodes = document.querySelectorAll(all), ok = 0, bad = 0, badK = -1, okKs = [];
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i]; if (n.offsetParent === null && getComputedStyle(n).position !== 'fixed') continue;
          var v = verdict(n), sig = v + '|' + (n.textContent || '').trim().slice(0, 80);
          if (!v || (last && last.get(n) === sig)) continue;
          if (last) last.set(n, sig);
          var k = entryOf(n);
          if (v === 'good') { ok++; okKs.push(k); } else { bad++; if (badK < 0) badK = k; }
        }
        if (!ok && !bad) return;
        var now = Date.now(); if (now - lastSay < 2500) return; lastSay = now;
        if (!bad) {
          okKs.forEach(function (k) { fails[k] = 0; });
          var t = ok > 1 ? 'Alle ' + ok + ' Aufgaben stimmen. Stark gemacht!' : rnd(GOODS);
          if (serious) t = t.replace(/ ?🎉/, '');
          Duo.talk([{ w: 'T', t: t, m: serious ? 'interested' : 'excited' }]); return;
        }
        var n2 = (fails[badK] = (fails[badK] || 0) + 1), tl = badK >= 0 && entries[badK].tips, head = ok ? ok + ' von ' + (ok + bad) + ' stimmen schon. Du bist nah dran!' : rnd(BADS);
        var lines = [{ w: 'T', t: head, m: serious ? 'interested' : 'oops' }];
        if (tl && tl.length) lines.push({ w: 'R', t: tl[(n2 - 1) % tl.length], m: 'thinking' });
        Duo.talk(lines, { stay: 9000 });
      }
      new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(scan, 300); }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    }
  }
  // Klasse 10 und Oberstufe: Herr Neumann als Lernbegleiter statt Tinto und Rolli (gleiche Modultexte und Tipps)
  function runNeumann() {
    var app = APPS[folder] || null, entries = CHECKS[folder] || [], tips = [];
    entries.forEach(function (e) { (e.tips || []).forEach(function (t) { if (tips.indexOf(t) < 0) tips.push(t); }); });
    Begleiter.init({ mode: 'lernen', skin: 'neumann', glossar: window.Woerter ? Woerter.all() : {}, id: 'app-' + folder, offsetBottom: app && app.bottom ? app.bottom : 56, aufgabe: app ? app.text : '', hilfe: app ? app.tip : '', tipps: tips });
    if (!entries.length || !window.MutationObserver) return;
    var all = entries.map(function (e) { return e.sel; }).join(','), last = window.WeakMap ? new WeakMap() : null, timer = null, n = 0;
    function scan() {
      var nodes = document.querySelectorAll(all);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i]; if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue;
        var v = verdict(el), sig = v + '|' + (el.textContent || '').trim().slice(0, 80);
        if (!v || (last && last.get(el) === sig)) continue; if (last) last.set(el, sig);
        if (v === 'good') Begleiter.richtig('a' + n); else Begleiter.falsch('a' + n);
        if (v === 'good') n++;
      }
    }
    new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(scan, 300); }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] });
  }
  if (/(^|\/)(Klasse-10|Oberstufe)\//.test(rel + '/')) {
    var nb = base + 'neumann/', list = ['kolbi.js', 'skin-neumann.js', 'neumann-begleiter.js'];
    var go = function () { words(function () { (function nx(i) { if (i >= list.length) return runNeumann(); var s = document.createElement('script'); s.src = nb + list[i] + '?v=20261124a'; s.onload = s.onerror = function () { nx(i + 1); }; document.head.appendChild(s); })(0); }); };
    if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
    return;
  }
  // Wörterbuch für „Wort erklären“: allgemeine Wörter + Wörter des Moduls (nicht in der Glorious Revolution, dort erklärt Wilhelm III.)
  function slug(f) { return f.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ß/g, 'ss'); }
  function words(cb) {
    if (folder === 'Glorious-Revolution') return cb();
    var list = ['woerterbuch.js', 'glossare/allgemein.js', 'glossare/' + slug(folder) + '.js'];
    (function nx(i) { if (i >= list.length) return cb(); var s = document.createElement('script'); s.src = base + list[i] + '?v=20261124a'; s.onload = s.onerror = function () { nx(i + 1); }; document.head.appendChild(s); })(0);
  }
  function start() { words(function () { if (window.Duo) return run(); var s = document.createElement('script'); s.src = base + 'duo.js?v=20261124a'; s.onload = run; document.head.appendChild(s); }); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
