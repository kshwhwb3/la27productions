/* LA 27 Productions: Einwilligung (Cookies/lokaler Speicher). Selbst gebaut, ohne externen Dienst.
   Die Seite ist ohne dieses Skript vollständig lesbar. Es werden keine Tracking-Skripte geladen. */
(function () {
  var KEY = 'la27_consent';
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}

  function store(c) {
    c.t = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    applyConsent(c);
  }

  function applyConsent(c) {
    /* HOOK: Ein künftiges Statistik-Skript darf NUR hier geladen werden, wenn c.statistik === true.
       Beispiel (derzeit bewusst auskommentiert, es gibt keine Statistik):
       if (c.statistik) { var s = document.createElement('script'); s.src = '...'; s.async = true; document.head.appendChild(s); }
       Gleiches für Marketing mit c.marketing. */
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  var box = null, icon = null;

  function close() { if (box) { box.remove(); box = null; } }

  function showIcon() {
    if (icon) return;
    icon = el('button', 'cc-icon', '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 2 2 0 0 0-2-2zM8 9a1.3 1.3 0 1 1 0 2.600A1.300 1.300 0 0 1 8 9zm3 6a1.300 1.300 0 1 1 0 2.600 1.300 1.300 0 0 1 0-2.600zm5-1a1.300 1.300 0 1 1 0 2.600 1.300 1.300 0 0 1 0-2.600z"/></svg>');
    icon.type = 'button';
    icon.setAttribute('aria-label', 'Cookie-Einstellungen öffnen');
    icon.title = 'Cookie-Einstellungen';
    icon.addEventListener('click', function () { open(true); });
    document.body.appendChild(icon);
  }

  function open(settings) {
    close();
    var c = saved || { statistik: false, marketing: false };
    box = el('div', 'cc-box');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Datenschutz-Einstellungen');
    var h = '<p class="cc-title">Datenschutz-Einstellungen</p>' +
      '<p class="cc-text">Wir verwenden nur technisch notwendige Speicherung. Weitere Kategorien sind ausgeschaltet, solange Sie nicht zustimmen. ' +
      'Mehr dazu in der <a href="datenschutz.html#cookies">Datenschutzerklärung</a>.</p>';
    if (settings) {
      h += '<div class="cc-cats">' +
        row('notwendig', 'Notwendig', 'Speichert Ihre Auswahl hier. Ohne diese Speicherung funktioniert die Website nicht wie vorgesehen.', true, true) +
        row('statistik', 'Statistik', 'Hilft zu verstehen, wie die Website genutzt wird. Derzeit setzen wir keine Statistik ein.', c.statistik, false) +
        row('marketing', 'Marketing', 'Für personalisierte Werbung. Derzeit setzen wir kein Marketing ein.', c.marketing, false) +
        '</div><div class="cc-btns"><button type="button" class="cc-btn" data-a="all">Alle akzeptieren</button>' +
        '<button type="button" class="cc-btn" data-a="none">Nur notwendige</button>' +
        '<button type="button" class="cc-btn" data-a="save">Auswahl speichern</button></div>';
    } else {
      h += '<div class="cc-btns"><button type="button" class="cc-btn" data-a="all">Alle akzeptieren</button>' +
        '<button type="button" class="cc-btn" data-a="none">Nur notwendige</button>' +
        '<button type="button" class="cc-btn" data-a="set">Einstellungen</button></div>';
    }
    box.innerHTML = h;
    box.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-a');
      if (!a) return;
      if (a === 'set') { open(true); return; }
      var res = { statistik: false, marketing: false };
      if (a === 'all') { res.statistik = true; res.marketing = true; }
      if (a === 'save') {
        res.statistik = box.querySelector('#cc-statistik').checked;
        res.marketing = box.querySelector('#cc-marketing').checked;
      }
      saved = res; store(res); close(); showIcon();
    });
    document.body.appendChild(box);
  }

  function row(id, name, text, on, locked) {
    return '<div class="cc-row"><div><strong>' + name + '</strong><span>' + text + '</span></div>' +
      '<label class="cc-sw"><input type="checkbox" id="cc-' + id + '"' + (on ? ' checked' : '') + (locked ? ' disabled' : '') +
      ' aria-label="' + name + '"><i></i></label></div>';
  }

  function init() {
    if (saved) { applyConsent(saved); showIcon(); } else { open(false); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
