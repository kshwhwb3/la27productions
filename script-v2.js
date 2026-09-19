/* LA 27 — interactions v3 (optimized & premium) */

(() => {
  const i18n = window.LA27_I18N;

  // ----- Premium Micro-Sound Engine (Web Audio API) -----
  const SoundEngine = (() => {
    let ctx = null;
    let enabled = localStorage.getItem("la27.sound") !== "false";

    const init = () => {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        gainNode.connect(ctx.destination);

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

    const isEnabled = () => enabled;
    const setEnabled = (val) => {
      enabled = val;
      localStorage.setItem("la27.sound", val ? "true" : "false");
    };

    return { play, isEnabled, setEnabled, init };
  })();

  // ----- Interactive Campaign Dashboard Metrics & Data -----
  const CAMPAIGNS = {
    es: {
      nicho: {
        sent: "183",
        open: "84.6%",
        replies: "42 (23%)",
        meetings: "11",
        name: "CASO DETALLADO: PROMOTORES DE EVENTOS (ALEMANIA)",
        desc: "Campaña hiper-segmentada dirigida a 183 managers y promotores de recintos y festivales en Alemania. Filtrado manual riguroso y copywriting personalizado para ofrecer servicios audiovisuales a medida. Cero rebotes de entrega."
      },
      enterprise: {
        sent: "1.200",
        open: "72.3%",
        replies: "144 (12%)",
        meetings: "38",
        name: "CASO DETALLADO: ADQUISICIÓN DE CUENTAS B2B SAAS",
        desc: "Campaña outbound de alta gama dirigida a directores de compras y marketing en Europa occidental. Redacción orientada a valor comercial y agendamiento directo de demos con cuentas corporativas."
      },
      volume: {
        sent: "5.400",
        open: "68.1%",
        replies: "324 (6%)",
        meetings: "76",
        name: "CASO DETALLADO: MINORISTAS & DISTRIBUIDORES PARA D2C",
        desc: "Campaña a gran escala dirigida a tiendas especializadas y grandes retailers en España y Francia. Presentación del catálogo digital de producto logrando alta conversión y pipeline comercial."
      }
    },
    en: {
      nicho: {
        sent: "183",
        open: "84.6%",
        replies: "42 (23%)",
        meetings: "11",
        name: "DETAILED CASE: EVENT PROMOTERS (GERMANY)",
        desc: "Highly-targeted campaign sent to 183 venue managers and festival organizers in Germany. Cured lead lists, custom copywriting, and high delivery rate."
      },
      enterprise: {
        sent: "1,200",
        open: "72.3%",
        replies: "144 (12%)",
        meetings: "38",
        name: "DETAILED CASE: ACQUISITION FOR B2B SAAS ACCOUNTS",
        desc: "Premium outbound outreach aimed at marketing and operations directors in Western Europe. Value-proposition focused copywriting securing qualified demos."
      },
      volume: {
        sent: "5,400",
        open: "68.1%",
        replies: "324 (6%)",
        meetings: "76",
        name: "DETAILED CASE: DISTRIBUTORS & RETAILERS FOR D2C BRANDS",
        desc: "Large scale targeted campaigns aimed at boutique shops and department stores across Spain and France to secure retail listings."
      }
    },
    de: {
      nicho: {
        sent: "183",
        open: "84.6%",
        replies: "42 (23%)",
        meetings: "11",
        name: "FALLSTUDIE: VERANSTALTER & PROMOTOREN (DEUTSCHLAND)",
        desc: "Personalisierte Kampagne an 183 Festival- und Konzertveranstalter in Deutschland. Manuell verifizierte Listen und erstklassige Zustellungsraten."
      },
      enterprise: {
        sent: "1.200",
        open: "72.3%",
        replies: "144 (12%)",
        meetings: "38",
        name: "FALLSTUDIE: B2B SAAS ACCOUNT AKQUISE",
        desc: "Premium Outbound-Kampagnen an Einkaufsleiter und CMOs in Westeuropa. Fokus auf direkten geschäftlichen Mehrwert und Demo-Buchungen."
      },
      volume: {
        sent: "5.400",
        open: "68.1%",
        replies: "324 (6%)",
        meetings: "76",
        name: "FALLSTUDIE: EINZELHÄNDLER FÜR D2C-MARKEN",
        desc: "Breit angelegte Akquise für D2C-Marken zur Gewinnung von europäischen Distributoren und Partnerschaften."
      }
    },
    fr: {
      nicho: {
        sent: "183",
        open: "84.6%",
        replies: "42 (23%)",
        meetings: "11",
        name: "ÉTUDE DE CAS : PROMOTEURS DE CONCERTS (ALLEMAGNE)",
        desc: "Campagne ultra-ciblée auprès de 183 directeurs de salles et de festivals en Allemagne. Fichiers qualifiés et copywriting sur-mesure."
      },
      enterprise: {
        sent: "1 200",
        open: "72.3%",
        replies: "144 (12%)",
        meetings: "38",
        name: "ÉTUDE DE CAS : ACQUISITION DE COMPTES B2B SAAS",
        desc: "Campagne outbound de haut niveau ciblant les directeurs achat et marketing en Europe de l'Ouest. Prise de rendez-vous qualifiée directe."
      },
      volume: {
        sent: "5 400",
        open: "68.1%",
        replies: "324 (6%)",
        meetings: "76",
        name: "ÉTUDE DE CAS : DISTRIBUTEURS POUR MARQUES D2C",
        desc: "Campagnes ciblées à grande échelle destinées aux détaillants et grands magasins en Espagne et en France pour négocier des points de vente."
      }
    },
    pt: {
      nicho: {
        sent: "183",
        open: "84.6%",
        replies: "42 (23%)",
        meetings: "11",
        name: "CASO DE ESTUDO: PROMOTORES DE EVENTOS (ALEMANHA)",
        desc: "Campanha altamente segmentada para 183 managers de festivais e salas de concertos na Alemanha. Ficheiros limpos e copywriting outbound."
      },
      enterprise: {
        sent: "1.200",
        open: "72.3%",
        replies: "144 (12%)",
        meetings: "38",
        name: "CASO DE ESTUDO: AQUISIÇÃO DE CONTAS SAAS B2B",
        desc: "Outreach premium direcionado a diretores de compras e CMOs na Europa Ocidental, agendando reuniões de demonstração qualificadas."
      },
      volume: {
        sent: "5.400",
        open: "68.1%",
        replies: "324 (6%)",
        meetings: "76",
        name: "CASO DE ESTUDO: DISTRIBUIDORES PARA MARCAS D2C",
        desc: "Campanhas a larga escala dirigidas a revendedores e retalho em Espanha e França para fechamento de parcerias comerciais."
      }
    }
  };

  let activeCampaign = "nicho";

  const updateDashboard = () => {
    const lang = (i18n && i18n.getLang()) || "es";
    const data = CAMPAIGNS[lang]?.[activeCampaign] || CAMPAIGNS["es"][activeCampaign];
    
    const sentEl = document.getElementById("metric-sent");
    const openEl = document.getElementById("metric-open");
    const repliesEl = document.getElementById("metric-replies");
    const meetingsEl = document.getElementById("metric-meetings");
    const nameEl = document.getElementById("case-name");
    const descEl = document.getElementById("case-description");

    if (sentEl) sentEl.textContent = data.sent;
    if (openEl) openEl.textContent = data.open;
    if (repliesEl) repliesEl.textContent = data.replies;
    if (meetingsEl) meetingsEl.textContent = data.meetings;
    if (nameEl) nameEl.textContent = data.name;
    if (descEl) descEl.textContent = data.desc;
  };

  const initDashboard = () => {
    const toggles = document.querySelectorAll(".db-toggle-btn");
    toggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        toggles.forEach((b) => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--ink-dim)";
        });
        btn.classList.add("active");
        btn.style.background = "var(--line)";
        btn.style.color = "var(--ink)";
        
        activeCampaign = btn.dataset.campaign;
        SoundEngine.play("click");
        updateDashboard();
      });
    });
    updateDashboard();
  };

  // ----- Language: apply stored or default ES -----
  const setHeroDelays = () => {
    const heroWords = document.querySelectorAll(".hero-title .word > span");
    heroWords.forEach((sp, i) => {
      sp.style.animationDelay = (0.1 + i * 0.08) + "s";
    });
  };

  const applyLang = (lang) => {
    if (!i18n) return;
    
    // Smooth transition
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
      updateDashboard();

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
      if (hover) {
        cursor.classList.add("is-hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const hover = e.target.closest("[data-cursor='hover']");
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

  // ----- Hero parallax / fade on scroll -----
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const isMobile = () => window.innerWidth <= 680;

  const onHeroScroll = () => {
    if (!hero) return;
    const y = window.scrollY;
    const h = window.innerHeight;
    const p = Math.min(1, y / h);

    if (isMobile()) {
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

  // ----- Bind Micro-Sounds -----
  const bindMicroSounds = () => {
    const hoverElements = ".btn, .lang-switch-btn, .scroll-cue, .nav-links a, .nav-brand, .section-index a, .lang-switch-menu a";
    const clickElements = ".btn, .lang-switch-btn, .scroll-cue, .nav-links a, .nav-brand, .section-index a, .lang-switch-menu a, button[type='submit']";

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
  setHeroDelays();
  initSmoothScroll();
  bindMicroSounds();
  initClickRipples();
  initBackgroundParallax();
  initDashboard();
})();
