/* ============================================================
   MEHR PFLEGEKRÄFTE — Interaktionen
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile Navigation ---------- */
  const burger = document.querySelector(".nav-burger");
  const panel = document.querySelector(".nav-panel");
  if (burger && panel) {
    burger.addEventListener("click", () => {
      panel.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", panel.classList.contains("is-open"));
    });
    panel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        panel.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      })
    );
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Zähler-Animation (Statistiken) ---------- */
  const counters = document.querySelectorAll("[data-counter]");
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      const shown = target % 1 === 0 ? Math.floor(value) : value.toFixed(1);
      el.textContent = (typeof shown === "number" && shown >= 1000 ? shown.toLocaleString("de-DE") : shown) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Festpreis-Rechner (Signature Element) ---------- */
  const slider = document.getElementById("calcSlider");
  const themVal = document.getElementById("calcThemVal");
  const usVal = document.getElementById("calcUsVal");
  const sliderLabel = document.getElementById("calcSliderLabel");
  if (slider) {
    const FIXED_PRICE = 3900; // Festpreis in Euro
    const update = () => {
      const gehalt = parseInt(slider.value, 10);
      const provision = Math.round(gehalt * 0.28); // typische Provisionsspanne 20–30%
      sliderLabel.textContent = gehalt.toLocaleString("de-DE") + " € / Jahr";
      themVal.textContent = provision.toLocaleString("de-DE") + " €";
      usVal.textContent = FIXED_PRICE.toLocaleString("de-DE") + " €";
    };
    slider.addEventListener("input", update);
    update();
  }

  /* ---------- Deutschlandkarte Hover-Sync ---------- */
  const mapPaths = document.querySelectorAll(".de-map path");
  const regionLinks = document.querySelectorAll("[data-region-link]");
  mapPaths.forEach((path) => {
    path.addEventListener("mouseenter", () => {
      const region = path.dataset.region;
      regionLinks.forEach((link) => {
        link.style.color = link.dataset.regionLink === region ? "var(--coral)" : "";
      });
    });
  });

  /* ---------- Kontakt-Popup (ersetzt frühere Calendly-Einbindung) ---------- */
  const openers = document.querySelectorAll("[data-open-calendly]");
  const overlay = document.getElementById("calendlyModal");
  const closeBtn = document.querySelector(".modal-close");
  const modalForm = document.getElementById("modalAnfrageForm");
  const modalFormStep = document.getElementById("modalFormStep");
  const modalSuccessStep = document.getElementById("modalSuccessStep");
  const modalStatus = document.getElementById("modalFormStatus");

  const openModal = () => {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (modalFormStep) modalFormStep.style.display = "";
    if (modalSuccessStep) modalSuccessStep.classList.remove("is-visible");
  };
  const closeModal = () => {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  openers.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet …";
      if (modalStatus) modalStatus.textContent = "";

      try {
        const response = await fetch("https://formular.mehrpflegekraefte.de/kontakt.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(modalForm))),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          modalFormStep.style.display = "none";
          modalSuccessStep.classList.add("is-visible");
          modalForm.reset();
        } else {
          throw new Error(result.message || "Unbekannter Fehler");
        }
      } catch (err) {
        if (modalStatus) {
          modalStatus.textContent = "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie an info@maperso.de.";
          modalStatus.style.color = "#e05a4a";
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ---------- Nav-Schatten beim Scrollen ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.style.boxShadow =
        window.scrollY > 12 ? "0 8px 24px -20px rgba(0,0,0,0.4)" : "none";
    });
  }
});

/* ============================================================
   EXPERIENCE LAYER — Cursor, Magnetismus, Kinetik, Prozess-Aktivierung
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Custom Cursor ---------- */
  if (isFinePointer) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const raf = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    raf();

    document.querySelectorAll("a, button, input[type='range'], .card, .testi, .faq-q").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });

    /* ---------- Magnetische Buttons ---------- */
    document.querySelectorAll(".btn-primary, .btn-light").forEach((btn) => {
      btn.classList.add("magnetic");
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${relX * 0.22}px, ${relY * 0.32}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Kinetische Headline (wortweise) ---------- */
  document.querySelectorAll("[data-kinetic]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="kinetic-word" style="animation-delay:${0.05 + i * 0.055}s">${w}</span>`)
      .join(" ");
  });

  /* ---------- Prozess-Schritte: aktiv beim Durchscrollen ---------- */
  const processItems = document.querySelectorAll(".process-item");
  if ("IntersectionObserver" in window && processItems.length) {
    const pio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );
    processItems.forEach((el) => pio.observe(el));
  }

  /* ---------- Clip-Reveal für Bilder ---------- */
  const clipEls = document.querySelectorAll(".clip-reveal");
  if ("IntersectionObserver" in window && clipEls.length) {
    const cio2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            cio2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    clipEls.forEach((el) => cio2.observe(el));
  }

  /* ---------- Cursor-Spotlight im Hero ---------- */
  const heroGlow = document.querySelector(".hero-home");
  if (heroGlow && isFinePointer) {
    heroGlow.addEventListener("mousemove", (e) => {
      const r = heroGlow.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      heroGlow.style.setProperty("--mx", mx + "%");
      heroGlow.style.setProperty("--my", my + "%");
    });
  }
});

/* ============================================================
   LEBENDIGKEITS-LAYER — Scroll-Fortschritt, Nav-Verhalten,
   Spotlight-Karten, 3D-Tilt
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Scroll-Fortschrittsbalken ---------- */
  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      progress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Nav: verbergen beim Runterscrollen ---------- */
  const navEl = document.querySelector(".nav");
  if (navEl) {
    let lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y > lastY && y > 140) {
          navEl.classList.add("nav-hidden");
        } else {
          navEl.classList.remove("nav-hidden");
        }
        navEl.style.boxShadow = y > 12 ? "0 8px 24px -20px rgba(0,0,0,0.6)" : "none";
        lastY = y;
      },
      { passive: true }
    );
  }

  /* ---------- Spotlight-Glow auf Karten ---------- */
  if (isFinePointer) {
    document.querySelectorAll(".card, .testi").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });

    /* ---------- Sanftes 3D-Tilt auf Leistungs-Karten ---------- */
    document.querySelectorAll(".card-grid .card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-6px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }
});

/* ============================================================
   BEWERBUNGS-FEED — sanftes Umschalten der aktiven Bewerbung
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const rows = document.querySelectorAll(".match-feed .match-row");
  if (!rows.length) return;

  const messages = ["Wird vorgestellt", "Passt zum Profil", "Termin vereinbart"];
  let current = 0;

  const activate = (index) => {
    rows.forEach((row, i) => {
      const status = row.querySelector(".match-status");
      if (i === index) {
        row.classList.add("is-active");
        status.textContent = messages[Math.floor(Math.random() * messages.length)];
      } else {
        row.classList.remove("is-active");
        status.textContent = "Profil geprüft";
      }
    });
  };

  activate(current);
  setInterval(() => {
    current = (current + 1) % rows.length;
    activate(current);
  }, 2800);
});

/* ============================================================
   KONTAKTFORMULAR — Anbindung an Web3Forms
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet …";
    status.textContent = "";
    status.style.color = "";

    try {
      const response = await fetch("https://formular.mehrpflegekraefte.de/kontakt.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        status.textContent = "Danke, Ihre Nachricht ist angekommen. Wir melden uns in der Regel innerhalb eines Werktags.";
        status.style.color = "var(--turq)";
        form.reset();
      } else {
        throw new Error(result.message || "Unbekannter Fehler");
      }
    } catch (err) {
      status.textContent = "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@maperso.de.";
      status.style.color = "#e05a4a";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

/* ============================================================
   NAV-DROPDOWN — "Mehr"-Klappmenü
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector(".nav-dropdown-trigger");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains("is-open");
      dropdowns.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".nav-dropdown-trigger").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        dd.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((dd) => {
      dd.classList.remove("is-open");
      dd.querySelector(".nav-dropdown-trigger").setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdowns.forEach((dd) => dd.classList.remove("is-open"));
    }
  });
});

/* ============================================================
   LEAD-MAGNET — Checkliste-Formular
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("leadStatus");
  const formWrap = document.getElementById("leadFormWrap");
  const success = document.getElementById("leadSuccess");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet …";
    status.textContent = "";

    try {
      const response = await fetch("https://formular.mehrpflegekraefte.de/leadmagnet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        formWrap.style.display = "none";
        success.classList.add("is-visible");
      } else {
        throw new Error(result.message || "Unbekannter Fehler");
      }
    } catch (err) {
      status.textContent = "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie an info@maperso.de.";
      status.style.color = "#e05a4a";
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
