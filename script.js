let mobileScrollFixed = false;

// ================= MOBILE SCROLL FIX =================
function fixMobileInitialScroll() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile || mobileScrollFixed) return;

  mobileScrollFixed = true;
  document.documentElement.classList.add('no-smooth-scroll');

  requestAnimationFrame(() => window.scrollTo(0, 0));

  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  setTimeout(() => {
    document.documentElement.classList.remove('no-smooth-scroll');
    document.documentElement.classList.add('smooth-scroll-ready');
  }, 300);
}

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

// ================= HEARTS =================
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

// ================= FAQ =================
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  function setIcon(item, isOpen) {
    const icon = item.querySelector('.faq-question span:last-child');
    if (icon) icon.textContent = isOpen ? '−' : '+';
  }

  function closeItem(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;
    answer.style.maxHeight = answer.scrollHeight + 'px';
    requestAnimationFrame(() => {
      answer.style.transition = 'max-height 0.35s ease';
      answer.style.maxHeight = '0px';
    });
    item.classList.remove('active');
    setIcon(item, false);
  }

  function openItem(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;
    item.classList.add('active');
    setIcon(item, true);
    answer.style.maxHeight = '0px';
    requestAnimationFrame(() => {
      answer.style.transition = 'max-height 0.35s ease';
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  }

  items.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    if (answer) {
      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
    }
    item.classList.remove('active');
    setIcon(item, false);
  });

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(other => {
        if (other !== item && other.classList.contains('active')) closeItem(other);
      });
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });
}

// ================= SMOOTH SCROLL =================
function initSmoothScroll() {
  if (window.innerWidth <= 768) return;
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      const headerHeight = 70;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition - headerHeight, behavior: 'smooth' });
    });
  });
}

// ================= HEADER SCROLL =================
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

// ================= MOBILE MENU =================
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });

  document.addEventListener('click', e => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
}

// ================= CALCULATOR =================
function initCalculator() {
  const shiftsSlider = document.getElementById('shifts');
  const shiftsValue = document.getElementById('shifts-value');
  const planButtons = document.querySelectorAll('.plan-btn');

  const grossIncomeEl = document.getElementById('gross-income');
  const commissionEl = document.getElementById('commission');
  const netIncomeEl = document.getElementById('net-income');

  if (!shiftsSlider || !shiftsValue || !grossIncomeEl || !commissionEl || !netIncomeEl) return;

  const DAILY_INCOME_USD = 90;
  const WEEKS_PER_MONTH = 4;
  const modelShare = { solo: 80, coach: 70, operator: 60 };
  let currentPlan = 'solo';

  function formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function updateSliderValue() {
    shiftsValue.textContent = parseInt(shiftsSlider.value, 10);
  }

  function calculateIncome() {
    const totalShifts = parseInt(shiftsSlider.value, 10) * WEEKS_PER_MONTH;
    const grossIncome = DAILY_INCOME_USD * totalShifts;
    const netIncome = grossIncome * (modelShare[currentPlan] / 100);
    const commission = grossIncome - netIncome;

    grossIncomeEl.textContent = formatUSD(grossIncome);
    commissionEl.textContent = formatUSD(commission);
    netIncomeEl.textContent = formatUSD(netIncome);
  }

  shiftsSlider.addEventListener('input', () => {
    updateSliderValue();
    calculateIncome();
  });

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      planButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlan = btn.dataset.plan;
      calculateIncome();
    });
  });

  updateSliderValue();
  calculateIncome();
}

// ================= IMAGE REVIEWS SLIDER =================
function initImageReviewsSlider() {
  const root = document.getElementById('reviews-phone');
  if (!root) return;

  const slides = root.querySelectorAll('.phone-slide');
  const oldDots = root.querySelectorAll('.phone-dot');
  const oldPrevBtn = root.querySelector('.phone-nav .prev-btn');
  const oldNextBtn = root.querySelector('.phone-nav .next-btn');
  
  // НОВЫЕ ЭЛЕМЕНТЫ
  const newDots = document.querySelectorAll('.reviews-dot');
  const newPrevBtn = document.querySelector('.reviews-nav-btn.prev-btn');
  const newNextBtn = document.querySelector('.reviews-nav-btn.next-btn');
  
  if (!slides.length) return;

  let current = 0;
  let isAnimating = false;

  function setActive(index) {
    if (isAnimating) return;
    isAnimating = true;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Обновляем слайды
    slides[current].classList.remove('active');
    slides[index].classList.add('active');

    // Обновляем старые точки
    oldDots.forEach(d => d.classList.remove('active'));
    if (oldDots[index]) oldDots[index].classList.add('active');
    
    // Обновляем новые точки
    newDots.forEach(d => d.classList.remove('active'));
    if (newDots[index]) newDots[index].classList.add('active');

    current = index;
    setTimeout(() => { isAnimating = false; }, 450);
  }

  // Обработчики для новых кнопок
  if (newNextBtn) newNextBtn.addEventListener('click', () => setActive(current + 1));
  if (newPrevBtn) newPrevBtn.addEventListener('click', () => setActive(current - 1));
  
  // Обработчики для старых кнопок (на всякий случай)
  if (oldNextBtn) oldNextBtn.addEventListener('click', () => setActive(current + 1));
  if (oldPrevBtn) oldPrevBtn.addEventListener('click', () => setActive(current - 1));

  // Обработчики для новых точек
  newDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!Number.isNaN(idx)) setActive(idx);
    });
  });
  
  // Обработчики для старых точек
  oldDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!Number.isNaN(idx)) setActive(idx);
    });
  });
}

// ================= CONTACT ENVELOPE =================
function initContactEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;
  const letterLink = envelope.querySelector('.letter-link');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

  if (isTouchDevice) {
    envelope.addEventListener('touchstart', e => {
      if (e.target === letterLink) return;
      envelope.classList.add('touch-active');
    }, { passive: true });

    document.addEventListener('touchstart', e => {
      if (!envelope.contains(e.target)) envelope.classList.remove('touch-active');
    }, { passive: true });
  }

  envelope.addEventListener('mouseenter', () => envelope.classList.add('touch-active'));
  envelope.addEventListener('mouseleave', () => envelope.classList.remove('touch-active'));
}

// ================= VACANCY MODAL =================
function initVacancyModal() {
  const modal = document.getElementById('vacancyModal');
  const form = document.getElementById('vacancyForm');
  if (!modal || !form) return;

  const vacancyTitle = document.getElementById('vacancyModalVacancy');
  const vacancyField = document.getElementById('vacancyField');
  const nameField = document.getElementById('nameField');
  const tgField = document.getElementById('tgField');
  const phoneField = document.getElementById('phoneField');
  const submitBtn = form.querySelector('.vacancy-form__submit');

  const TG_BOT_TOKEN = "8497373725:AAFBV65-Km6M_wKxUWWPkDy7sqkp2NiFk74";
  const TG_CHAT_ID = "6324436781";

  function esc(s) { return encodeURIComponent(String(s || '').trim()); }

  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${esc(text)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return !!data.ok;
    } catch (e) {
      const img = new Image();
      img.src = url;
      return true;
    }
  }

  function openModal(vacancy) {
    vacancyTitle.textContent = vacancy || '—';
    vacancyField.value = vacancy || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (nameField) nameField.focus(); }, 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.vacancy-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.vacancy || ''));
  });

  modal.addEventListener('click', e => {
    if (e.target.dataset.close) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!nameField.value || !tgField.value || !phoneField.value) {
      alert('Заполни все поля: имя, ник в TG и телефон.');
      return;
    }

    const text = `✅ Заявка с сайта StripUp\n\nВакансия: ${vacancyField.value}\nИмя: ${nameField.value}\nTG: ${tgField.value}\nТелефон: ${phoneField.value}`;

    if (submitBtn) {
      submitBtn.disabled = true;
      const oldText = submitBtn.textContent;
      submitBtn.textContent = 'Отправляем...';
      const ok = await sendToTelegram(text);
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
      if (ok) { alert('✅ Заявка отправлена!'); closeModal(); form.reset(); }
      else alert('❌ Не удалось отправить.');
    }
  });
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', function () {
  fixMobileInitialScroll();
  fixMobileAnchorScroll();
  createHearts();
  initFAQ();
  initSmoothScroll();
  initHeaderScroll();
  initMobileMenu();
  initCalculator();
  initImageReviewsSlider();
  initVacancyModal();
  initContactEnvelope();
  
  // Задержка для корректного отображения навигации
  setTimeout(() => {
    const nav = document.querySelector('.reviews-phone-navigation');
    if (nav && window.innerWidth <= 768) {
      console.log('✅ Новая навигация загружена и готова к работе');
    }
  }, 500);
});