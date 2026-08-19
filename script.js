/* =============================================
   Forest Hill Manor — script.js
   ============================================= */

(function () {
  "use strict";

  /* ── Scroll Progress Bar ─────────────────── */
  const progressBar = document.getElementById("scroll-progress");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  /* ── Sticky Header ───────────────────────── */
  const header = document.querySelector("header");
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.remove("transparent");
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      header.classList.add("transparent");
    }
  }

  window.addEventListener("scroll", () => {
    updateProgress();
    updateHeader();
  }, { passive: true });

  updateHeader(); // call on load

  /* ── Hero Ken Burns & Loaded Class ──────── */
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("load", () => hero.classList.add("loaded"));
    hero.classList.add("loaded"); // fallback for cached pages
  }

  /* ── Hamburger Mobile Menu ───────────────── */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const overlay = document.getElementById("nav-overlay");

  function toggleMenu(force) {
    const open = force !== undefined ? force : !hamburger.classList.contains("open");
    hamburger.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    if (overlay) overlay.classList.toggle("active", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => toggleMenu());
  }

  if (overlay) {
    overlay.addEventListener("click", () => toggleMenu(false));
  }

  // Close menu on nav link click
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  /* ── Scroll Reveal ───────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ── Animated Counters ───────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      el.textContent = display + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counters = document.querySelectorAll(".stat-number[data-target]");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => counterObserver.observe(c));

  /* ── Feature Card Hover Tilt ─────────────── */
  document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
      card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease";
    });
  });

  /* ── Menu Tab Filtering ──────────────────── */
  const tabBtns = document.querySelectorAll(".menu-tab");
  const menuCards = document.querySelectorAll(".menu-card");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active tab
      tabBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Show / hide cards with a fade
      menuCards.forEach(card => {
        const category = card.dataset.category;
        const matches = filter === "all" || category === filter;

        if (matches) {
          card.classList.remove("hidden");
          // Re-trigger reveal animation
          card.classList.remove("visible");
          void card.offsetWidth; // force reflow
          card.classList.add("visible");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ── Gallery Lightbox ────────────────────── */
  const lightbox    = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCap = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, caption, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || "";
    lightboxCap.textContent = caption || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const src     = item.dataset.src;
      const caption = item.dataset.caption;
      const alt     = item.querySelector("img") ? item.querySelector("img").alt : "";
      openLightbox(src, caption, alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  /* ── Smooth Scroll for Anchor Links ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── Active Nav Highlight on Scroll ──────── */
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll("nav a[href^='#']");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Current Year in Footer ──────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
