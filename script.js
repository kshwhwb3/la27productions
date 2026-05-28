/* LA 27 — interactions */

(() => {
  const i18n = window.LA27_I18N;

  // ----- Language overlay + switcher -----
  const overlay = document.getElementById("lang-overlay");
  const body = document.body;

  const setHeroDelays = () => {
    const heroWords = document.querySelectorAll(".hero-title .word > span");
    heroWords.forEach((sp, i) => {
      sp.style.animationDelay = (0.1 + i * 0.08) + "s";
    });
  };

  const applyLang = (lang, { fromOverlay = false } = {}) => {
    if (!i18n) return;
    i18n.apply(lang);
    i18n.setLang(lang);
    setHeroDelays();
    if (fromOverlay) hideOverlay();
  };

  const hideOverlay = () => {
    if (!overlay) return;
    overlay.classList.add("is-hidden");
    body.classList.remove("is-locked");
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.setAttribute("aria-hidden", "true");
      }
    }, 700);
  };

  // Determine starting language
  const stored = i18n && i18n.getLang();
  const initial = (stored && i18n.T[stored]) ? stored : "es";

  // If user already picked, skip overlay
  if (stored && i18n.T[stored]) {
    body.classList.remove("is-locked");
    if (overlay) overlay.classList.add("is-hidden");
    applyLang(stored);
  } else {
    // Apply default (Spanish) text but keep overlay visible
    applyLang(initial);
    body.classList.add("is-locked");
  }

  // Overlay clicks
  document.querySelectorAll(".lang-overlay-list a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = a.dataset.lang;
      if (!lang) return;
      applyLang(lang, { fromOverlay: true });
    });
  });

  // Nav switcher
  const switcher = document.querySelector(".lang-switch");
  const switcherBtn = document.querySelector(".lang-switch-btn");

  if (switcherBtn && switcher) {
    switcherBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      switcher.classList.toggle("is-open");
      switcherBtn.setAttribute("aria-expanded", switcher.classList.contains("is-open"));
    });
    document.addEventListener("click", () => {
      switcher.classList.remove("is-open");
      switcherBtn.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".lang-switch-menu a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = a.dataset.lang;
      if (!lang) return;
      applyLang(lang);
      if (switcher) switcher.classList.remove("is-open");
    });
  });

  // ----- Custom cursor -----
  const cursor = document.querySelector(".cursor");
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  const renderCursor = () => {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  // Delegated hover handlers (works on dynamically-rendered elements too)
  document.addEventListener("mouseover", (e) => {
    if (!cursor) return;
    const hover = e.target.closest("[data-cursor='hover']");
    const play = e.target.closest("[data-cursor='play']");
    if (play) {
      cursor.classList.add("is-play");
      cursor.classList.remove("is-hover");
      const label = cursor.querySelector(".cursor-label");
      if (label) label.textContent = play.dataset.cursorLabel || "Play";
    } else if (hover) {
      cursor.classList.add("is-hover");
      cursor.classList.remove("is-play");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (!cursor) return;
    const hover = e.target.closest("[data-cursor='hover']");
    const play = e.target.closest("[data-cursor='play']");
    if (play && !e.relatedTarget?.closest("[data-cursor='play']")) {
      cursor.classList.remove("is-play");
    }
    if (hover && !e.relatedTarget?.closest("[data-cursor='hover']")) {
      cursor.classList.remove("is-hover");
    }
  });

  // ----- Scroll progress -----
  const progress = document.querySelector(".scroll-progress");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, window.scrollY / h));
    if (progress) progress.style.width = (p * 100) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- Reveal-on-scroll -----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ----- Section index active state -----
  const sections = [...document.querySelectorAll("section[data-section]")];
  const indexLinks = [...document.querySelectorAll(".section-index a")];

  const updateIndex = () => {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= mid) active = s;
    }
    indexLinks.forEach((a) => {
      a.classList.toggle("is-active", active && a.getAttribute("href") === "#" + active.id);
    });
  };
  window.addEventListener("scroll", updateIndex, { passive: true });
  updateIndex();

  // ----- Hero waveform: build bars + animate -----
  const wave = document.querySelector(".waveform");
  if (wave) {
    const COUNT = 84;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const bar = document.createElement("div");
      bar.className = "bar";
      const t = i / COUNT;
      const env = Math.sin(t * Math.PI);
      const noise = 0.4 + 0.6 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
      const h = Math.max(6, env * noise * 72);
      bar.style.height = h + "px";
      bar.style.animationDelay = (i * 0.04) + "s";
      bar.style.animationDuration = (1.6 + (i % 5) * 0.2) + "s";
      bar.dataset.base = h.toString();
      frag.appendChild(bar);
    }
    wave.appendChild(frag);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes wave {
        0%, 100% { transform: scaleY(0.4); }
        50% { transform: scaleY(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // ----- Hero parallax / fade on scroll -----
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const heroWave = document.querySelector(".waveform");

  const onHeroScroll = () => {
    if (!hero) return;
    const y = window.scrollY;
    const h = window.innerHeight;
    const p = Math.min(1, y / h);
    if (heroTitle) {
      heroTitle.style.transform = `translateY(${y * 0.18}px)`;
      heroTitle.style.opacity = String(1 - p * 0.85);
    }
    if (heroSub) {
      heroSub.style.opacity = String(1 - p * 1.5);
      heroSub.style.transform = `translateY(${y * 0.3}px)`;
    }
    if (heroWave) {
      heroWave.style.transform = `translateY(${y * 0.4}px) scaleY(${1 - p * 0.4})`;
    }
  };
  window.addEventListener("scroll", onHeroScroll, { passive: true });
  onHeroScroll();

  // ----- Form interactions -----
  document.querySelectorAll(".field").forEach((f) => {
    const input = f.querySelector("input, textarea, select");
    if (!input) return;
    const setFilled = () => f.classList.toggle("is-filled", !!input.value);
    input.addEventListener("input", setFilled);
    input.addEventListener("change", setFilled);
    setFilled();
  });

  const form = document.querySelector(".form");
  const success = document.querySelector(".form-success");
  if (form && success) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      success.classList.add("is-shown");
      form.querySelectorAll("input, textarea, select").forEach((el) => { el.value = ""; });
      document.querySelectorAll(".field").forEach((f) => f.classList.remove("is-filled"));
    });
  }

  // ----- Current local time (Barcelona) in nav -----
  const timeEl = document.querySelector("[data-bcn-time]");
  const updateTime = () => {
    if (!timeEl) return;
    try {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Madrid"
      });
      timeEl.textContent = fmt.format(new Date()) + " BCN";
    } catch (err) {
      const d = new Date();
      timeEl.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + " BCN";
    }
  };
  updateTime();
  setInterval(updateTime, 30000);

  // ----- Video lightbox -----
  const vlb = document.getElementById("vlightbox");
  const vlbWrap = document.getElementById("vlightbox-iframe-wrap");
  const vlbTitleEl = document.querySelector(".vlightbox-title-text");

  const openVideo = (id, title) => {
    if (!vlb || !vlbWrap || !id) return;
    // Build iframe fresh each time so the video reloads / autoplays
    vlbWrap.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1`;
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("title", title || "Video");
    vlbWrap.appendChild(iframe);

    if (vlbTitleEl) vlbTitleEl.textContent = title || "LA 27 PRODUCTIONS";

    vlb.classList.add("is-open");
    vlb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeVideo = () => {
    if (!vlb || !vlbWrap) return;
    vlb.classList.remove("is-open");
    vlb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Delay iframe removal until fade-out finishes so we don't see a snap to black
    setTimeout(() => { vlbWrap.innerHTML = ""; }, 500);
  };

  // Play cards intercept the click
  document.querySelectorAll(".play-card[data-vimeo-id]").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const id = card.dataset.vimeoId;
      const title = card.dataset.vimeoTitle || "LA 27 PRODUCTIONS";
      openVideo(id, title);
    });
  });

  // Close handlers
  document.querySelectorAll("[data-vlightbox-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeVideo();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && vlb && vlb.classList.contains("is-open")) closeVideo();
  });

  // ----- Initial hero delays -----
  setHeroDelays();
})();
