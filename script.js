// ФИКС: Предотвратить скролл при загрузке на мобильных (ТОЛЬКО ОДИН РАЗ)
let mobileScrollFixed = false;

function fixMobileInitialScroll() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile || mobileScrollFixed) return;

  mobileScrollFixed = true;

  document.documentElement.classList.add('no-smooth-scroll');

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });

  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  setTimeout(() => {
    document.documentElement.classList.remove('no-smooth-scroll');
    document.documentElement.classList.add('smooth-scroll-ready');
  }, 300);
}

// ФИКС: Исправить скролл к якорям на мобильных (БЕЗ smooth-scroll)
function fixMobileAnchorScroll() {
  if (window.innerWidth > 768) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 55;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: y, behavior: 'auto' });

      const navMenu = document.querySelector('nav ul');
      if (navMenu) navMenu.classList.remove('active');
    });
  });
}

// Floating hearts animation
function createHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heartsCount = 15;

  for (let i = 0; i < heartsCount; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '💗';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 6 + 's';
    heart.style.fontSize = (Math.random() * 15 + 12) + 'px';
    container.appendChild(heart);
  }
}

// FAQ accordion
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentNode.parentNode;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherIcon = otherItem.querySelector('.faq-question span:last-child');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      item.classList.toggle('active');

      const icon = question.querySelector('span:last-child');
      if (icon) icon.textContent = item.classList.contains('active') ? '−' : '+';
    });
  });
}

// Smooth scrolling for navigation links (ТОЛЬКО ДЛЯ ДЕСКТОПА)
function initSmoothScroll() {
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
}

// Add scroll effect for header
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      header.style.background = 'rgba(255, 247, 249, 0.98)';
      header.style.boxShadow = '0 4px 25px rgba(176, 49, 94, 0.18)';
    } else {
      header.style.background = 'rgba(255, 247, 249, 0.95)';
      header.style.boxShadow = '0 2px 15px rgba(176, 49, 94, 0.15)';
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
}

// Calculator
function initCalculator() {
  const incomeSlider = document.getElementById('income');
  const incomeValue = document.getElementById('income-value');
  const daysSlider = document.getElementById('days');
  const daysValue = document.getElementById('days-value');
  const planButtons = document.querySelectorAll('.plan-btn');
  const grossIncomeEl = document.getElementById('gross-income');
  const commissionEl = document.getElementById('commission');
  const netIncomeEl = document.getElementById('net-income');

  if (!incomeSlider || !daysSlider || !incomeValue || !daysValue || !grossIncomeEl || !commissionEl || !netIncomeEl) return;

  const commissionRates = { start: 0, pro: 15, premium: 10 };
  let currentPlan = 'start';

  function updateSliderValue(slider, valueEl) {
    const value = parseInt(slider.value, 10);
    valueEl.textContent = value.toLocaleString('ru-RU');
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount) + ' ₽';
  }

  function calculateIncome() {
    const dailyIncome = parseInt(incomeSlider.value, 10);
    const workDays = parseInt(daysSlider.value, 10);
    const commissionRate = commissionRates[currentPlan];

    const grossIncome = dailyIncome * workDays;

    let commission = 0;
    if (currentPlan === 'start') {
      const freeDays = Math.min(workDays, 10);
      const paidDays = Math.max(0, workDays - freeDays);
      commission = dailyIncome * paidDays * commissionRate / 100;
    } else {
      commission = grossIncome * commissionRate / 100;
    }

    const netIncome = grossIncome - commission;

    grossIncomeEl.textContent = formatCurrency(grossIncome);
    commissionEl.textContent = formatCurrency(commission);
    netIncomeEl.textContent = formatCurrency(netIncome);
  }

  function initializeValues() {
    updateSliderValue(incomeSlider, incomeValue);
    updateSliderValue(daysSlider, daysValue);

    const initialDailyIncome = 20000;
    const initialWorkDays = 20;
    grossIncomeEl.textContent = formatCurrency(initialDailyIncome * initialWorkDays);
    commissionEl.textContent = formatCurrency(0);
    netIncomeEl.textContent = formatCurrency(initialDailyIncome * initialWorkDays);
  }

  incomeSlider.addEventListener('input', () => { updateSliderValue(incomeSlider, incomeValue); calculateIncome(); });
  daysSlider.addEventListener('input', () => { updateSliderValue(daysSlider, daysValue); calculateIncome(); });

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      planButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlan = btn.dataset.plan;
      calculateIncome();
    });
  });

  initializeValues();
  calculateIncome();
}

// Envelope (touch + hover)
function initNewEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  const link = envelope.querySelector('.letter-link');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

  if (isTouchDevice) {
    envelope.addEventListener('touchstart', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('letter-link')) return;
      e.preventDefault();

      document.querySelectorAll('.envelope').forEach(item => item.classList.remove('touch-active'));
      envelope.classList.toggle('touch-active');
    }, { passive: false });

    document.addEventListener('touchstart', function (e) {
      if (!envelope.contains(e.target)) envelope.classList.remove('touch-active');
    });

    if (link) {
      link.addEventListener('touchstart', function (e) {
        if (!envelope.classList.contains('touch-active')) {
          e.preventDefault();
          envelope.classList.add('touch-active');
        }
      }, { passive: false });
    }
  } else {
    envelope.addEventListener('mouseenter', () => envelope.classList.add('touch-active'));
    envelope.addEventListener('mouseleave', () => envelope.classList.remove('touch-active'));
  }

  // маленькая анимация появления (как у тебя было)
  setTimeout(() => {
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.9) translateY(20px)';
    envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    requestAnimationFrame(() => {
      envelope.style.opacity = '1';
      envelope.style.transform = 'scale(1) translateY(0)';
    });
  }, 300);
}

// Scroll animations (НЕ трогаем phone-image-container-large, чтобы не ломать z-index/навигацию)
function animateOnScroll() {
  const elements = document.querySelectorAll(
    '.pricing-box-horizontal, .about-combined-box, .interview-item, .calculator-box, .result-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(element);
  });
}

function initImageReviewsSlider() {
  const root = document.getElementById('reviews-phone');
  if (!root) return;

  const slides = root.querySelectorAll('.phone-slide');
  const dots = root.querySelectorAll('.phone-dot');
  const prevBtn = root.querySelector('.prev-btn');
  const nextBtn = root.querySelector('.next-btn');

  if (!slides.length) return;

  let current = 0;
  let isAnimating = false;

  function setActive(index) {
    if (isAnimating) return;
    isAnimating = true;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[current].classList.remove('active');
    slides[index].classList.add('active');

    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    current = index;

    setTimeout(() => { isAnimating = false; }, 450);
  }

  function next() { setActive(current + 1); }
  function prev() { setActive(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!Number.isNaN(idx)) setActive(idx);
    });
  });

  // свайп
  const mask = root.querySelector('.phone-screen-mask');
  if (mask) {
    let startX = 0;
    let startY = 0;
    let moved = false;

    mask.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      moved = false;
    }, { passive: true });

    mask.addEventListener('touchmove', () => {
      moved = true;
    }, { passive: true });

    mask.addEventListener('touchend', (e) => {
      if (!moved) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fixMobileInitialScroll();
  fixMobileAnchorScroll();

  createHearts();
  initFAQ();
  initSmoothScroll();
  initHeaderScroll();
  initMobileMenu();
  initCalculator();
  initNewEnvelope();
  initImageReviewsSlider();

  window.addEventListener('load', function () {
    animateOnScroll();
    document.documentElement.classList.add('smooth-scroll-ready');
  });
});

window.addEventListener('orientationchange', function () {
  setTimeout(fixMobileAnchorScroll, 100);
});

// Доп. эффект для десктопа (как было), без конфликтов
if (window.innerWidth > 768) {
  document.addEventListener('DOMContentLoaded', function () {
    const contactSection = document.getElementById('contact');
    const envelope = document.querySelector('.envelope');

    if (contactSection && envelope) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            envelope.style.transform = 'scale(1.04)';
            setTimeout(() => { envelope.style.transform = 'scale(1)'; }, 250);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(contactSection);
    }
  });
}
