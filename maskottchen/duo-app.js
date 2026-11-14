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
      topic: 'armut',
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
      topic: 'friedrich',
      text: 'Hier arbeitet ihr in der Gruppe zu Friedrich dem Großen. Jedes Kapitel hat ein Passwort, und am Ende entsteht ein Plakat.',
      tip: 'Das Passwort für ein Kapitel bekommt ihr von eurer Lehrkraft oder erarbeitet es euch im Kapitel davor. Verteilt die Aufgaben in der Gruppe und schaut am Ende gemeinsam auf das Plakat.'
    },
    'Glorious-Revolution': {
      topic: 'revolution',
      text: 'In dieser Simulation erlebst du die Glorious Revolution von 1688/89. Du klickst wichtige Wörter an, beantwortest ein Quiz und kannst am Ende ein PDF erzeugen.',
      tip: 'Klicke beim Lesen die Wörter an, die dir wichtig erscheinen. Das PDF am Ende fasst deine Ergebnisse zusammen.',
      bottom: 90
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
      topic: 'klima',
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
      tip: 'Sprich mit den Figuren und lies die Hinweise im Dialog ganz. Wenn du nicht weiter weißt, überlege: Wer ist für diese Frage zuständig, der Bezirk, das Land oder der Staat?',
      bottom: 170
    }
  };

  // Kommentare zum Thema (kurz, sachlich richtig, nie über Kriege oder den Holocaust gescherzt)
  var TOPIC = {
    absolutismus: ['Ludwig XIV. war über 72 Jahre König. Viele seiner Untertanen erlebten nie einen anderen.', 'In Versailles gab es einen ganzen Saal voller Spiegel. Das sollte Eindruck machen.', 'Absolutismus heißt: Der Herrscher ist „losgelöst“ von Gesetzen. Dahinter steckt das lateinische „absolutus“.'],
    armut: ['Wer arm war, hatte damals kaum Wege nach oben. Überleg beim Spielen, was dir fehlen würde.', 'Im Spiel zählt jede Entscheidung. Auch kleine.', 'Gesundheit war damals oft das größte Kapital der armen Leute.'],
    aufklaerung: ['„Habe Mut, dich deines eigenen Verstandes zu bedienen“, schrieb Kant. Das passt zu jeder Hausaufgabe.', 'Die Aufklärung wollte, dass Menschen selbst denken, statt nur zu glauben, was man ihnen sagt.', 'Kant war angeblich so pünktlich, dass die Nachbarn nach ihm die Uhr stellten.'],
    friedrich: ['Friedrich II. wurde „der Alte Fritz“ genannt. Sein Schloss Sanssouci heißt übersetzt „ohne Sorge“.', 'Er regierte von 1740 bis 1786, also fast 46 Jahre.', 'Gruppenarbeit klappt am besten, wenn jeder ein Stück übernimmt und alle am Ende zusammenfügen.'],
    revolution: ['Die Glorious Revolution heißt „glorreich“, weil sie weitgehend ohne Blutvergießen ablief.', 'Die Bill of Rights von 1689 beschränkte die Macht des englischen Königs.', 'Ein Parlament, das dem König Bedingungen stellt: Das war damals eine große Sache.'],
    paulskirche: ['Das Parlament tagte in einer Kirche, in der Frankfurter Paulskirche. Heute ist sie ein Ort der Erinnerung.', 'Die Abgeordneten von 1848 wollten ein geeintes Deutschland mit Grundrechten.', 'Hier wurde heftig gestritten und trotzdem versucht, einen Beschluss zu finden. Das ist Demokratie.'],
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
    'Absolutismus': '.feedback, #drag-result, #quiz-result, #final-result',
    'Aufklärung': '#cloze-feedback',
    'Paulskirchenparlament': '#feedback',
    'Euro': '.fb',
    'Karikaturanalyse': '.fb',
    'Kinderrechte': '#feedback-title',
    'Smartphone-Lieferkette': '#quizResult',
    'Was-ist-Globalisierung': '#gap-feedback, #eval-success-msg'
  };
  var GOOD = /^\s*(✓|✔|richtig|korrekt|perfekt|hervorragend|super|alles richtig|prima|sehr gut|glückwunsch|depesche historisch korrekt)/i;
  var BAD = /^\s*(✗|✘|✖|×|falsch|leider|nicht ganz|noch nicht|einige|prüfe|überprüfe|\d+\s+von\s+\d+)/i;
  var GOOD_CLS = /(^|[\s_-])(ok|correct|richtig|right|success|good)($|[\s_-])/i, BAD_CLS = /(^|[\s_-])(bad|wrong|falsch|incorrect|error|fail)($|[\s_-])/i;
  function verdict(n) {
    var c = (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '', t = (n.textContent || '').trim();
    if (!t || t.length > 400) return '';
    if (BAD_CLS.test(c) || BAD.test(t)) { if (/^\s*\d+\s+von\s+\d+/i.test(t)) { var m = t.match(/(\d+)\s+von\s+(\d+)/); if (m && m[1] === m[2]) return 'good'; } return 'bad'; }
    if (GOOD_CLS.test(c) || GOOD.test(t)) return 'good';
    return '';
  }

  var PRAISE = ['Das läuft richtig gut bei dir!', 'Du bist richtig fleißig. Weiter so!', 'Schon so viel geschafft. Stark!', 'Dranbleiben lohnt sich, du machst das prima.'];
  var GOODS = ['Stimmt, richtig gemacht! 🎉', 'Sehr gut!', 'Genau so!', 'Das passt. Stark!', 'Prima, das sitzt.'];
  var BADS = ['Nicht ganz, aber das kriegst du hin. Lies noch einmal in Ruhe.', 'Das war noch nicht ganz richtig. Probier es noch einmal.', 'Kein Problem, Fehler gehören dazu. Schau noch einmal hin.'];
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

  function run() {
    var app = APPS[folder] || null;
    var help = app ? { text: app.text, tip: app.tip } : null;
    var comments = app && TOPIC[app.topic] ? TOPIC[app.topic] : [];
    Duo.init({ id: 'app-' + folder, offsetBottom: app && app.bottom ? app.bottom : 56, comments: comments, tapHelp: help ? function () { return help; } : null, idleHelp: help ? function () { return help; } : null });

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
      if (++clicks >= nextPraise) { nextPraise += 40; Duo.react('love', rnd(PRAISE), 'T'); }
    }, true);

    // Rückmeldungen erkennen
    var sel = CHECKS[folder];
    if (sel && window.MutationObserver) {
      var last = window.WeakMap ? new WeakMap() : null, lastReact = 0, nBad = 0;
      var timer = null;
      function scan() {
        var nodes = document.querySelectorAll(sel);
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i]; if (n.offsetParent === null && getComputedStyle(n).position !== 'fixed') continue;
          var v = verdict(n), sig = v + '|' + (n.textContent || '').trim().slice(0, 80);
          if (!v || (last && last.get(n) === sig)) continue;
          if (last) last.set(n, sig);
          var now = Date.now(); if (now - lastReact < 6000) continue; lastReact = now;
          if (v === 'good') { nBad = 0; Duo.react('excited', Math.random() < .5 ? rnd(GOODS) : '', 'T'); }
          else { nBad++; Duo.react('oops', nBad % 2 ? '' : rnd(BADS), 'T'); }
        }
      }
      new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(scan, 250); }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    }
  }
  function start() { if (window.Duo) return run(); var s = document.createElement('script'); s.src = base + 'duo.js'; s.onload = run; document.head.appendChild(s); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
