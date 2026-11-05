/*
  Pinnwand: Zettel mit dem Attribut data-optional werden nur gezeigt, wenn ihr Ziel existiert.
  Lädst du eine neue Simulation hoch, hängt der passende Zettel beim nächsten Öffnen der Seite von selbst an.
  Antwortet der Server mit "nicht gefunden" (404), bleibt der Zettel unsichtbar.
  Bei jedem anderen Ergebnis (auch beim lokalen Öffnen der Datei ohne Server) wird er angezeigt.
*/
(function () {
  var optional = document.querySelectorAll('a.note[data-optional]');
  var leer = document.querySelector('.leer');
  var offen = optional.length;
  var sichtbar = document.querySelectorAll('a.note:not([data-optional])').length;

  function fertig() {
    if (leer) { leer.hidden = sichtbar > 0; }
  }

  if (!optional.length) { fertig(); return; }

  Array.prototype.forEach.call(optional, function (a) { a.hidden = true; });

  Array.prototype.forEach.call(optional, function (a) {
    var url = new URL(a.getAttribute('href'), location.href).href;
    function ergebnis(vorhanden) {
      if (vorhanden) { a.hidden = false; sichtbar++; }
      offen--;
      if (offen === 0) { fertig(); }
    }
    fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { ergebnis(r.status !== 404 && r.status !== 410); })
      .catch(function () { ergebnis(true); });
  });
})();
