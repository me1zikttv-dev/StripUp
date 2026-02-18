(() => {
  "use strict";

  /* =========================
     Helpers
  ========================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  /* =========================
     Mobile menu
  ========================= */
  const initMobileMenu = () => {
    const toggle = $(".mobile-menu-toggle");
    const navList = $("nav ul");
    if (!toggle || !navList) return;

    const closeMenu = () => {
      navList.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      navList.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = navList.classList.contains("active");
      isOpen ? closeMenu() : openMenu();
    });

    // close on link click
    $$("a", navList).forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("active")) return;
      const insideNav = navList.contains(e.target);
      const insideBtn = toggle.contains(e.target);
      if (!insideNav && !insideBtn) closeMenu();
    });

    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  };

  /* =========================
     FAQ accordion
  ========================= */
  const initFAQ = () => {
    const items = $$(".faq-item");
    if (!items.length) return;

    items.forEach((item) => {
      const q = $(".faq-question", item);
      if (!q) return;

      q.addEventListener("click", () => {
        // toggle current; close others
        const willOpen = !item.classList.contains("active");
        items.forEach((i) => i.classList.remove("active"));
        if (willOpen) item.classList.add("active");
      });
    });
  };

  /* =========================
     Touch envelope (contact)
  ========================= */
  const initEnvelopeTouch = () => {
    const env = $(".envelope");
    if (!env) return;

    // Only for touch devices
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouch) return;

    const setActive = (on) => {
      env.classList.toggle("touch-active", !!on);
    };

    env.addEventListener("click", (e) => {
      // 1st tap opens, 2nd tap on link should work
      // If click on link - let it pass
      const link = e.target.closest(".letter-link");
      if (link) return;

      e.preventDefault();
      setActive(!env.classList.contains("touch-active"));
    });

    // close on outside tap
    document.addEventListener("click", (e) => {
      if (!env.classList.contains("touch-active")) return;
      if (!env.contains(e.target)) setActive(false);
    });

    // close on scroll (optional, helps on mobile)
    window.addEventListener(
      "scroll",
      () => {
        if (env.classList.contains("touch-active")) setActive(false);
      },
      { passive: true }
    );
  };

  /* =========================
     Reviews phone slider
     Works with BOTH:
      - desktop nav: .phone-nav-btn[data-dir], .phone-dot
      - mobile nav:  .reviews-nav-btn[data-dir], .reviews-dot
  ========================= */
  const initReviewsPhone = () => {
    const root = $("#reviews-phone");
    if (!root) return;

    const slides = $$(".phone-slide", root);
    if (!slides.length) return;

    // Desktop dots (if exist)
    const deskDots = $$(".phone-dot", root);
    // Mobile dots (if exist)
    const mobDots = $$(".reviews-dot", root);

    const setActive = (idx) => {
      const total = slides.length;
      const i = ((idx % total) + total) % total;

      slides.forEach((s, n) => s.classList.toggle("active", n === i));
      deskDots.forEach((d, n) => d.classList.toggle("active", n === i));
      mobDots.forEach((d, n) => d.classList.toggle("active", n === i));

      activeIndex = i;
    };

    const getActiveFromDOM = () => {
      const found = slides.findIndex((s) => s.classList.contains("active"));
      return found >= 0 ? found : 0;
    };

    let activeIndex = getActiveFromDOM();
    setActive(activeIndex);

    const prev = () => setActive(activeIndex - 1);
    const next = () => setActive(activeIndex + 1);

    // Desktop arrows
    $$(".phone-nav-btn", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const dir =
          btn.dataset.dir ||
          (btn.classList.contains("prev") ? "prev" : "next");
        dir === "prev" ? prev() : next();
      });
    });

    // Mobile arrows
    $$(".reviews-nav-btn", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const dir = btn.dataset.dir || "next";
        dir === "prev" ? prev() : next();
      });
    });

    // Dots (both)
    deskDots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        setActive(i);
      });
    });
    mobDots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        setActive(i);
      });
    });

    // Swipe support (mobile)
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (!tracking) return;
      tracking = false;

      const touch = (e.changedTouches && e.changedTouches[0]) || null;
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      // horizontal swipe only
      if (Math.abs(dx) < 35) return;
      if (Math.abs(dy) > 80) return;

      dx < 0 ? next() : prev();
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    // Keyboard arrows (desktop)
    document.addEventListener("keydown", (e) => {
      // only if reviews visible-ish
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  };

  /* =========================
     Calculator (safe init)
     Supports:
       - sliders with class .slider
       - value bubbles with .slider-value near slider
       - plan buttons with .plan-btn (data-plan)
       - outputs:
           #calcTotal, #calcMonthly, #calcPeople (optional)
     If your ids differ — JS won't break.
  ========================= */
  const initCalculator = () => {
    const calc = $("#calculator");
    if (!calc) return;

    const sliders = $$(".slider", calc);
    const planButtons = $$(".plan-btn", calc);

    // Optional outputs (only update if exist)
    const outTotal = $("#calcTotal");
    const outMonthly = $("#calcMonthly");
    const outPeople = $("#calcPeople");

    // Internal state
    let plan = planButtons.find((b) => b.classList.contains("active"))?.dataset
      ?.plan || "base";

    const readSliderValue = (slider) => {
      const v = Number(slider.value);
      return Number.isFinite(v) ? v : 0;
    };

    const updateBubble = (slider) => {
      // bubble might be sibling or inside same group
      const group = slider.closest(".calculator-group") || slider.parentElement;
      const bubble = group ? $(".slider-value", group) : null;
      if (!bubble) return;

      const min = Number(slider.min ?? 0);
      const max = Number(slider.max ?? 100);
      const val = readSliderValue(slider);

      bubble.textContent = slider.dataset.suffix
        ? `${val}${slider.dataset.suffix}`
        : `${val}`;

      // position bubble above thumb
      const percent =
        max === min ? 0 : ((val - min) / (max - min)) * 100;
      // keep within reasonable bounds
      const left = clamp(percent, 5, 95);
      bubble.style.left = `${left}%`;
    };

    const updateAllBubbles = () => sliders.forEach(updateBubble);

    const compute = () => {
      // This is a generic calculation.
      // If your site had specific formula earlier — скажи какие входы и формулу, и я подстрою 1:1.
      const values = sliders.map(readSliderValue);
      const sum = values.reduce((a, b) => a + b, 0);

      // Plan multiplier (example)
      const mult =
        plan === "pro" ? 1.3 : plan === "max" ? 1.6 : 1.0;

      const total = Math.round(sum * mult);
      const monthly = Math.round(total / 30);

      if (outTotal) outTotal.textContent = total.toString();
      if (outMonthly) outMonthly.textContent = monthly.toString();
      if (outPeople) outPeople.textContent = values[0]?.toString?.() ?? "0";
    };

    sliders.forEach((slider) => {
      // init bubble suffix (optional)
      updateBubble(slider);
      slider.addEventListener("input", () => {
        updateBubble(slider);
        compute();
      });
      slider.addEventListener("change", compute);
    });

    planButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        planButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        plan = btn.dataset.plan || plan;
        compute();
      });
    });

    // initial
    updateAllBubbles();
    compute();
  };

  /* =========================
     Vacancies modal (safe)
     Structure supported:
       .vacancy-apply-btn opens modal #vacancyModal or .vacancy-modal
       close button .vacancy-modal__close
       backdrop .vacancy-modal__backdrop
  ========================= */
  const initVacancyModal = () => {
    const modal =
      $("#vacancyModal") || $(".vacancy-modal");
    if (!modal) return;

    const openBtns = $$(".vacancy-apply-btn");
    const closeBtn = $(".vacancy-modal__close", modal);
    const backdrop = $(".vacancy-modal__backdrop", modal);

    const open = () => modal.classList.add("is-open");
    const close = () => modal.classList.remove("is-open");

    openBtns.forEach((btn) => btn.addEventListener("click", (e) => {
      // if it's a link — prevent jump
      e.preventDefault();
      open();
    }));

    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });

    backdrop?.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  };

  /* =========================
     Optional: smooth-scroll safety
     (doesn't break anything, just fixes jumpy behavior sometimes)
  ========================= */
  const initSmoothScroll = () => {
    // If you use CSS smooth scroll, leave it.
    // Here we only add safe anchor behavior if needed.
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;

        const target = $(id);
        if (!target) return;

        // If mobile menu open - it will close via initMobileMenu anyway
        // Use native smooth if available; if mobile, let browser handle
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  /* =========================
     Boot
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initFAQ();
    initEnvelopeTouch();
    initReviewsPhone();
    initCalculator();
    initVacancyModal();
    initSmoothScroll();
  });
})();
