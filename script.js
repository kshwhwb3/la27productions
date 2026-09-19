/* LA 27 — interactions v3 (optimized & premium) */

(() => {
  const i18n = window.LA27_I18N;

  // ----- Premium Micro-Sound Engine (Web Audio API) -----
  const SoundEngine = (() => {
    let ctx = null;
    let analyser = null;
    let enabled = localStorage.getItem("la27.sound") !== "false";

    const init = () => {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.connect(ctx.destination);
      }
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    };

    const play = (type) => {
      if (!enabled) return;
      try {
        init();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(analyser || ctx.destination);

        if (type === "hover") {
          // Warm Pop Analógico Hover: very quick frequency decay in low mids
          osc.type = "sine";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.02);
          
          gainNode.gain.setValueAtTime(0.08, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 0.02);
          
          osc.start(now);
          osc.stop(now + 0.025);
        } else if (type === "click") {
          // Warm Pop Analógico Click
          osc.type = "triangle";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.045);
          
          gainNode.gain.setValueAtTime(0.18, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 0.045);
          
          osc.start(now);
          osc.stop(now + 0.05);
        }
      } catch (err) {
        console.warn("Web Audio playback failed:", err);
      }
    };

    const playLogoChime = () => {
      if (!enabled) return;
      try {
        init();
        const now = ctx.currentTime;
        const notes = [261.63, 392.00, 523.25]; // C4, G4, C5
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(analyser || ctx.destination);
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + index * 0.12);
          
          const time = now + index * 0.12;
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.04, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8);
          
          osc.start(time);
          osc.stop(time + 0.85);
        });
      } catch (err) {
        console.warn("Logo chime playback failed:", err);
      }
    };

    const isEnabled = () => enabled;
    const setEnabled = (val) => {
      enabled = val;
      localStorage.setItem("la27.sound", val ? "true" : "false");
    };

    const getFrequencyData = () => {
      if (!analyser) return null;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      return dataArray;
    };

    return { play, playLogoChime, isEnabled, setEnabled, init, getFrequencyData };
  })();

  const soundBtn = document.querySelector(".sound-toggle-btn");
  const updateSoundBtn = () => {
    if (!soundBtn) return;
    const isMuted = !SoundEngine.isEnabled();
    soundBtn.classList.toggle("is-muted", isMuted);
    const textEl = soundBtn.querySelector(".sound-text");
    if (textEl) {
      const lang = (i18n && i18n.getLang()) || "es";
      const key = SoundEngine.isEnabled() ? "nav.sound.on" : "nav.sound.off";
      textEl.setAttribute("data-i18n", key);
      if (i18n && i18n.T && i18n.T[lang] && i18n.T[lang][key]) {
        textEl.textContent = i18n.T[lang][key];
      } else {
        textEl.textContent = SoundEngine.isEnabled() ? "SONIDO ON" : "SONIDO OFF";
      }
    }
  };

  if (soundBtn) {
    updateSoundBtn();
    soundBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      SoundEngine.setEnabled(!SoundEngine.isEnabled());
      updateSoundBtn();
      SoundEngine.init();
      SoundEngine.play("click");
    });
  }

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
      const soundText = document.querySelector(".sound-toggle-btn .sound-text");
      if (soundText) {
        const key = SoundEngine.isEnabled() ? "nav.sound.on" : "nav.sound.off";
        soundText.setAttribute("data-i18n", key);
      }

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
      updateSoundBtn();

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
      @keyframes wave-gentle {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(0.7); }
      }
      @keyframes wave-energetic {
        0%, 100% { transform: scaleY(0.5); }
        50% { transform: scaleY(1.4); }
      }
      @keyframes wave-deep {
        0%, 100% { transform: scaleY(0.2); }
        50% { transform: scaleY(0.5); }
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
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&api=1&title=0&byline=0&portrait=0&badge=0&color=ffffff&dnt=1&quality=1080p`;
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("title", title || "Video");
    vlbWrap.appendChild(iframe);

    if (vlbTitleEl) vlbTitleEl.textContent = title || "LA 27 PRODUCTIONS";

    vlb.classList.add("is-open");
    vlb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    activeVideoId = String(id);

    // Subscribe to Vimeo player play/pause events
    iframe.addEventListener("load", () => {
      try {
        const win = iframe.contentWindow;
        win.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*');
        win.postMessage(JSON.stringify({ method: 'addEventListener', value: 'pause' }), '*');
      } catch (err) {
        console.warn("Failed to send addEventListener to Vimeo iframe:", err);
      }
    });

    startLightboxVisualizer();
  };

  const closeVideo = () => {
    if (!vlb || !vlbWrap) return;
    vlb.classList.remove("is-open");
    vlb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    stopLightboxVisualizer();
    activeVideoId = null;
    
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

  // ----- Inertial Smooth Scroller -----
  const initSmoothScroll = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    
    let currentY = window.scrollY;
    let targetY = currentY;
    const ease = 0.075;
    let isScrolling = false;

    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      targetY += e.deltaY;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.min(maxScroll, Math.max(0, targetY));
      
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(updateScroll);
      }
    }, { passive: false });

    const updateScroll = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.3) {
        currentY += diff * ease;
        window.scrollTo(0, currentY);
        requestAnimationFrame(updateScroll);
      } else {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isScrolling = false;
      }
    };

    window.addEventListener("scroll", () => {
      if (!isScrolling) {
        currentY = window.scrollY;
        targetY = currentY;
      }
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;
        
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          SoundEngine.play("click");
          
          const rect = targetEl.getBoundingClientRect();
          const headerOffset = 60;
          targetY = window.scrollY + rect.top - headerOffset;
          
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          targetY = Math.min(maxScroll, Math.max(0, targetY));
          
          if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(updateScroll);
          }
        }
      });
    });
  };

  // ----- 3D Tilt Effect -----
  const init3DTilt = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    
    document.querySelectorAll(".play-card").forEach((card) => {
      let rafId = null;
      const maxTilt = 8;
      
      card.addEventListener("mousemove", (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const xPct = (x / rect.width) - 0.5;
          const yPct = (y / rect.height) - 0.5;
          
          const rotX = -(yPct * maxTilt).toFixed(2);
          const rotY = (xPct * maxTilt).toFixed(2);
          
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
          
          const playBtn = card.querySelector(".play-overlay svg, .play-card-btn");
          if (playBtn) {
            const transX = (xPct * 15).toFixed(1);
            const transY = (yPct * 15).toFixed(1);
            playBtn.style.transform = `translate(${transX}px, ${transY}px) translateZ(30px)`;
          }
        });
      });
      
      card.addEventListener("mouseleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        
        const playBtn = card.querySelector(".play-overlay svg, .play-card-btn");
        if (playBtn) {
          playBtn.style.transform = "";
        }
      });
    });
  };

  // ----- Bind Micro-Sounds -----
  const bindMicroSounds = () => {
    const hoverElements = ".btn, .lang-switch-btn, .sound-toggle-btn, .scroll-cue, .nav-links a, .nav-brand, .play-card, .section-index a, .vlightbox-close, .lang-switch-menu a";
    const clickElements = ".btn, .lang-switch-btn, .sound-toggle-btn, .scroll-cue, .nav-links a, .nav-brand, .play-card, .section-index a, .vlightbox-close, .lang-switch-menu a, button[type='submit']";

    document.querySelectorAll(hoverElements).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        SoundEngine.play("hover");
      });
    });

    document.querySelectorAll(clickElements).forEach((el) => {
      el.addEventListener("click", () => {
        SoundEngine.play("click");
      });
    });

    document.addEventListener("click", () => SoundEngine.init(), { once: true });
    document.addEventListener("keydown", () => SoundEngine.init(), { once: true });
  };

  // ----- Bind Logo Chime -----
  const bindLogoChime = () => {
    const brand = document.querySelector(".nav-brand");
    if (brand) {
      brand.addEventListener("mouseenter", () => {
        SoundEngine.playLogoChime();
      });
    }
  };

  // ----- Sensory Upgrades: Lightbox Technical Visualizer -----
  let visAnimFrame = null;
  let isVideoPlaying = false;
  let activeVideoId = null;

  const buildVisualizerBars = () => {
    const container = document.getElementById("vis-bars-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    const BARS_COUNT = 32;
    for (let i = 0; i < BARS_COUNT; i++) {
      const wrap = document.createElement("div");
      wrap.className = "vis-bar-wrapper";
      wrap.innerHTML = `<div class="vis-bar"></div><div class="vis-peak" style="bottom: 0%;"></div>`;
      container.appendChild(wrap);
    }
  };

  const startLightboxVisualizer = () => {
    buildVisualizerBars();
    
    const BARS_COUNT = 32;
    const container = document.getElementById("vis-bars-container");
    if (!container) return;
    
    const wrappers = container.querySelectorAll(".vis-bar-wrapper");
    const peaks = new Array(BARS_COUNT).fill(0);
    const currentHeights = new Array(BARS_COUNT).fill(0);
    
    isVideoPlaying = true; // autoplays by default
    let time = 0;
    
    const animate = () => {
      const vlb = document.getElementById("vlightbox");
      if (!vlb || !vlb.classList.contains("is-open")) return;
      
      visAnimFrame = requestAnimationFrame(animate);
      
      // Determine customized rhythmic profiles based on the playing video
      let speedFactor = 1.0;
      let bassIntensity = 1.0;
      let midIntensity = 1.0;
      let highIntensity = 1.0;
      let noiseLevel = 5;
      
      // Ferrari Roma Spider (ID: 1192292542) - Fast Rock score
      if (activeVideoId === "1192292542") {
        speedFactor = 1.6;
        bassIntensity = 1.4; // strong kick drum
        midIntensity = 1.1;  // electric guitars
        highIntensity = 0.8;
      }
      // Dior Maison Perfume (ID: 1192292538) - Slow acoustic bells
      else if (activeVideoId === "1192292538") {
        speedFactor = 0.7;
        bassIntensity = 0.4; // quiet low end
        midIntensity = 0.7;
        highIntensity = 1.6; // bright chime sparks
        noiseLevel = 2;
      }
      // BMW Dune Taxi (ID: 1200779757) - Aggressive electronic
      else if (activeVideoId === "1200779757") {
        speedFactor = 1.8;
        bassIntensity = 1.2;
        midIntensity = 1.4; // synthesizer waves
        highIntensity = 1.1;
      }
      // Fashion Film (ID: 1200905700) - Cinematic sub-bass drone
      else if (activeVideoId === "1200905700") {
        speedFactor = 0.5;
        bassIntensity = 1.8; // deep rumble
        midIntensity = 0.4;
        highIntensity = 0.2;
      }
      
      time += 0.08 * speedFactor;
      
      for (let i = 0; i < BARS_COUNT; i++) {
        let target = 0;
        
        if (isVideoPlaying) {
          if (i < 8) { // Bass
            const beat = Math.pow(Math.sin(time * 1.5 - i * 0.1), 4) * 0.75 + Math.sin(time * 3.6) * 0.15;
            target = Math.max(noiseLevel, (beat * 85 * bassIntensity) + Math.random() * 10);
          } else if (i < 24) { // Mids
            const wave1 = Math.sin(time * 2.2 + i * 0.3) * 25;
            const wave2 = Math.cos(time * 3.2 - i * 0.15) * 18;
            target = Math.max(noiseLevel * 1.5, (45 + wave1 + wave2) * midIntensity + Math.random() * 8);
          } else { // Treble
            const flicker = Math.sin(time * 8 + i * 0.8) * 18 + Math.cos(time * 15) * 10;
            target = Math.max(noiseLevel, (25 + flicker) * highIntensity + Math.random() * 8);
          }
          
          if (Math.random() < 0.05) {
            target = Math.min(100, target + 25);
          }
        }
        
        currentHeights[i] += (target - currentHeights[i]) * 0.22;
        
        const bar = wrappers[i].querySelector(".vis-bar");
        const peak = wrappers[i].querySelector(".vis-peak");
        
        const h = currentHeights[i];
        bar.style.height = `${h}%`;
        
        if (h > 8) bar.classList.add("active");
        else bar.classList.remove("active");
        
        if (h >= peaks[i]) {
          peaks[i] = h;
        } else {
          peaks[i] = Math.max(0, peaks[i] - 1.6);
        }
        
        peak.style.bottom = `${peaks[i]}%`;
      }
    };
    
    animate();
  };

  const stopLightboxVisualizer = () => {
    if (visAnimFrame) {
      cancelAnimationFrame(visAnimFrame);
      visAnimFrame = null;
    }
  };

  // Listen to Vimeo player state messages
  window.addEventListener("message", (e) => {
    try {
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      
      // If Vimeo player sends ready message, register event listeners
      if (data.event === "ready") {
        const iframe = vlbWrap.querySelector("iframe");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'pause' }), '*');
        }
      }
      
      if (data.event === "play") {
        isVideoPlaying = true;
      } else if (data.event === "pause") {
        isVideoPlaying = false;
      }
    } catch (err) {}
  });

  // ----- Sensory Upgrades: Sonic Click Ripples -----
  const initClickRipples = () => {
    const createRipple = (x, y) => {
      const ripple = document.createElement("span");
      ripple.className = "sonic-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    };
    
    window.addEventListener("click", (e) => {
      if (e.target.closest("iframe") || e.target.closest(".vlightbox-frame")) return;
      
      createRipple(e.pageX, e.pageY);
      setTimeout(() => {
        createRipple(e.pageX, e.pageY);
      }, 140);
    });
  };

  // ----- Barcelona Background Parallax -----
  const initBackgroundParallax = () => {
    const bg = document.querySelector(".bcn-art-background");
    if (!bg) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      bg.style.transform = `translateY(${y * 0.05}px)`;
    }, { passive: true });
  };

  // Load dynamic assets
  loadThumbnails();
  setHeroDelays();
  initSmoothScroll();
  init3DTilt();
  bindMicroSounds();
  bindLogoChime();
  initClickRipples();
  initBackgroundParallax();
})();
