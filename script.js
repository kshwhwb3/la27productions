/* LA 27 — interactions v3 (optimized & premium) */

(() => {
  const i18n = window.LA27_I18N;

  // ----- Language: apply stored or default ES, no overlay -----
  const setHeroDelays = () => {
    const heroWords = document.querySelectorAll(".hero-title .word > span");
    heroWords.forEach((sp, i) => {
      sp.style.animationDelay = (0.1 + i * 0.08) + "s";
    });
  };

  const applyLang = (lang) => {
    if (!i18n) return;
    
    // Smooth transition: fade out translatable elements
    const targets = document.querySelectorAll("[data-i18n], [data-i18n-html]");
    targets.forEach((t) => {
      t.classList.add("i18n-fade", "i18n-fade-out");
    });

    setTimeout(() => {
      i18n.apply(lang);
      i18n.setLang(lang);
      
      // Update nav current lang display
      const cur = document.querySelector(".lang-switch-current");
      if (cur) cur.textContent = lang.toUpperCase();
      
      // Mark active in menu
      document.querySelectorAll(".lang-switch-menu a").forEach((a) => {
        a.classList.toggle("is-active", a.dataset.lang === lang);
      });
      
      setHeroDelays();

      // Fade back in
      setTimeout(() => {
        targets.forEach((t) => {
          t.classList.remove("i18n-fade-out");
        });
      }, 50);
    }, 180);
  };

  const stored = i18n && i18n.getLang();
  const initial = (stored && i18n.T && i18n.T[stored]) ? stored : "es";
  applyLang(initial);

  // Nav language switcher
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

  // ----- Custom cursor & Magnetic effect (desktop only) -----
  const cursor = document.querySelector(".cursor");
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  if (cursor && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      // If we are not hovering over a magnetic element, trace the exact cursor coordinates
      if (!document.querySelector(".cursor-magnetic-hover")) {
        tx = e.clientX;
        ty = e.clientY;
      }
    });

    const renderCursor = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    document.addEventListener("mouseover", (e) => {
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
      const hover = e.target.closest("[data-cursor='hover']");
      const play = e.target.closest("[data-cursor='play']");
      if (play && !e.relatedTarget?.closest("[data-cursor='play']")) {
        cursor.classList.remove("is-play");
      }
      if (hover && !e.relatedTarget?.closest("[data-cursor='hover']")) {
        cursor.classList.remove("is-hover");
      }
    });

    // Premium Magnetic Pull Effect for Buttons and Nav Links
    document.querySelectorAll(".btn, .lang-switch-btn, .scroll-cue, .nav-links a, .nav-brand").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        el.classList.add("cursor-magnetic-hover");
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        
        // Gently pull the element towards cursor
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        
        // Lock cursor destination near center
        tx = rect.left + rect.width / 2 + x * 0.12;
        ty = rect.top + rect.height / 2 + y * 0.12;
      });
      
      el.addEventListener("mouseleave", () => {
        el.classList.remove("cursor-magnetic-hover");
        el.style.transform = "";
      });
    });
  }

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
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

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

  // ----- Hero waveform -----
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

    // Interactive Waveform Hover: scale up and color ripple
    wave.addEventListener("mousemove", (e) => {
      const rect = wave.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const bars = wave.querySelectorAll(".bar");
      
      bars.forEach((bar, index) => {
        const barRect = bar.getBoundingClientRect();
        const barX = barRect.left + barRect.width / 2 - rect.left;
        const dist = Math.abs(mouseX - barX);
        
        if (dist < 100) {
          const factor = 1 + (1 - dist / 100) * 0.8;
          bar.style.transform = `scaleY(${factor})`;
          bar.style.backgroundColor = "var(--accent)";
        } else {
          bar.style.transform = "";
          bar.style.backgroundColor = "";
        }
      });
    });

    wave.addEventListener("mouseleave", () => {
      wave.querySelectorAll(".bar").forEach((bar) => {
        bar.style.transform = "";
        bar.style.backgroundColor = "";
      });
    });
  }

  // ----- Hero parallax / fade on scroll (desktop only, gentle on tablet) -----
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const heroWave = document.querySelector(".waveform");
  const isMobile = () => window.innerWidth <= 680;

  const onHeroScroll = () => {
    if (!hero) return;
    const y = window.scrollY;
    const h = window.innerHeight;
    const p = Math.min(1, y / h);

    if (isMobile()) {
      // On mobile: no parallax, just a very subtle title fade
      if (heroTitle) {
        heroTitle.style.transform = "";
        heroTitle.style.opacity = String(Math.max(0, 1 - p * 1.2));
      }
      if (heroSub) {
        heroSub.style.opacity = String(Math.max(0, 1 - p * 2));
        heroSub.style.transform = "";
      }
      return;
    }

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
      
      const btn = form.querySelector("button[type='submit']");
      const btnText = btn ? btn.querySelector("span") : null;
      const originalText = btnText ? btnText.textContent : "Enviar";
      if (btnText) btnText.textContent = "...";
      if (btn) btn.disabled = true;

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: json
      })
      .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
          success.classList.add("is-shown");
          form.querySelectorAll("input, textarea, select").forEach((el) => { el.value = ""; });
          document.querySelectorAll(".field").forEach((f) => f.classList.remove("is-filled"));
        } else {
          console.error("Web3Forms error:", jsonRes);
          alert(jsonRes.message || "Error al enviar el formulario.");
        }
      })
      .catch((error) => {
        console.error("Connection error:", error);
        alert("Error de conexión. Por favor, inténtalo de nuevo.");
      })
      .then(() => {
        if (btnText) btnText.textContent = originalText;
        if (btn) btn.disabled = false;
      });
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
    vlbWrap.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1&quality=1080p`;
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
    setTimeout(() => { vlbWrap.innerHTML = ""; }, 500);
  };

  // ----- Dynamic Vimeo thumbnail loader -----
  const loadThumbnails = () => {
    document.querySelectorAll(".play-card[data-vimeo-id]").forEach((card) => {
      const id = card.dataset.vimeoId;
      const placeholder = card.querySelector(".thumbnail-placeholder");
      if (!id || !placeholder) return;
      
      // Fetch oEmbed JSON to get thumbnail_url
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.thumbnail_url) {
            // Replace default low-res thumbnail suffix with higher resolution width
            const highResUrl = data.thumbnail_url.replace(/_[0-9]+x[0-9]+/, "_1280");
            placeholder.style.backgroundImage = `url('${highResUrl}')`;
          }
        })
        .catch((err) => console.error("Error loading Vimeo thumbnail:", err));
    });
  };

  // Bind portfolio play-card trigger with accessibility roles
  document.querySelectorAll(".play-card[data-vimeo-id]").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    const playVideo = (e) => {
      e.preventDefault();
      const id = card.dataset.vimeoId;
      const title = card.dataset.vimeoTitle || "LA 27 PRODUCTIONS";
      openVideo(id, title);
    };

    card.addEventListener("click", playVideo);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        playVideo(e);
      }
    });
  });

  document.querySelectorAll("[data-vlightbox-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeVideo();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && vlb && vlb.classList.contains("is-open")) closeVideo();
  });

  // Load dynamic assets
  loadThumbnails();
  setHeroDelays();
})();
