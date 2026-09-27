/* Aviso de cookies de LA 27.
   La web no usa cookies: el aviso es informativo y solo guarda que ya se ha visto. */
(function () {
  var KEY = 'la27.aviso';
  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}

  var TXT = {
    es: ['Esta web no usa cookies de seguimiento ni de publicidad. Solo guarda en tu navegador tu idioma y tus preferencias.', 'Más información', 'Entendido'],
    en: ['This site uses no tracking or advertising cookies. It only stores your language and preferences in your browser.', 'Learn more', 'Got it'],
    de: ['Diese Website verwendet keine Tracking- oder Werbe-Cookies. Sie speichert nur Ihre Sprache und Einstellungen in Ihrem Browser.', 'Mehr erfahren', 'Verstanden'],
    fr: ['Ce site n’utilise aucun cookie de suivi ni de publicité. Il enregistre seulement votre langue et vos préférences dans votre navigateur.', 'En savoir plus', 'Compris'],
    pt: ['Este site não usa cookies de rastreamento nem de publicidade. Apenas guarda o seu idioma e preferências no seu navegador.', 'Saber mais', 'Entendido']
  };

  function idioma() {
    var l = '';
    try { l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('la27.lang') || ''; } catch (e) {}
    l = (l || 'de').slice(0, 2).toLowerCase(); // como la web: el alemán es el primer idioma
    return TXT[l] ? l : 'en';
  }

  function mostrar() {
    var t = TXT[idioma()];
    var css = document.createElement('style');
    css.textContent =
      '#la27-aviso{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:760px;margin:0 auto;' +
      'background:rgba(14,7,8,.96);color:#f5f1ef;border:1px solid rgba(245,241,239,.10);border-radius:20px;' +
      'backdrop-filter:blur(16px);box-shadow:0 16px 48px rgba(0,0,0,.5);padding:18px 20px;display:flex;gap:18px;align-items:center;' +
      'font:14px/1.55 "Space Grotesk",system-ui,sans-serif}' +
      '#la27-aviso p{margin:0;flex:1;color:#d8d2cf}' +
      '#la27-aviso a{color:#a39a97;text-decoration:underline;margin-left:6px}' +
      '#la27-aviso button{flex:none;cursor:pointer;background:oklch(0.58 0.22 25);color:#fff;border:0;border-radius:14px;padding:12px 20px;' +
      'font:500 14px/1 "Space Grotesk",system-ui,sans-serif;letter-spacing:-.01em}' +
      '#la27-aviso button:focus-visible{outline:2px solid #f5f1ef;outline-offset:2px}' +
      '@media (max-width:600px){#la27-aviso{flex-direction:column;align-items:stretch;left:12px;right:12px;bottom:12px}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'la27-aviso';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p');
    p.textContent = t[0];
    var a = document.createElement('a');
    a.href = '/privacidad.html#cookies';
    a.textContent = t[1];
    p.appendChild(a);
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = t[2];
    b.onclick = function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      box.remove();
    };
    box.appendChild(p);
    box.appendChild(b);
    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrar);
  else mostrar();
})();
