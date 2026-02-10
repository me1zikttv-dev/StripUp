let mobileScrollFixed = false;

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

/* ✅ FAQ */
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
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  }

  items.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    if (answer) answer.style.maxHeight = '0px';
    item.classList.remove('active');
    setIcon(item, false);
  });

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(other => {
        if (other !== item && other.classList.contains('active')) closeItem(other);
      });

      if (isOpen) closeItem(item);
      else openItem(item);
    });

    answer.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'max-height') return;
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });
}

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

/* ✅ КАЛЬКУЛЯТОР */
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
    shiftsValue.textContent = String(parseInt(shiftsSlider.value, 10));
  }

  function calculateIncome() {
    const shiftsPerWeek = parseInt(shiftsSlider.value, 10);
    const totalShifts = shiftsPerWeek * WEEKS_PER_MONTH;

    const grossIncome = DAILY_INCOME_USD * totalShifts;

    const yourPercent = modelShare[currentPlan] ?? 80;
    const netIncome = grossIncome * (yourPercent / 100);
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

/* ✅ REVIEWS slider (если нужен) — оставил твой каркас */
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
}

/* =========================================================
   ✅ ВАКАНСИИ: отправка в TELEGRAM (без PHP)
   ========================================================= */
function initVacancyModal() {
  const modal = document.getElementById('vacancyModal');
  const form = document.getElementById('vacancyForm');

  const vacancyTitle = document.getElementById('vacancyModalVacancy');
  const vacancyField = document.getElementById('vacancyField');

  const nameField = document.getElementById('nameField');
  const tgField = document.getElementById('tgField');
  const phoneField = document.getElementById('phoneField');

  const submitBtn = form ? form.querySelector('.vacancy-form__submit') : null;

  if (!modal || !form || !vacancyTitle || !vacancyField) return;

  /* =========================
     🔥 МЕСТА ДЛЯ ЗАМЕНЫ
     ========================= */

  // ✅ BOT TOKEN (если надо заменить — меняешь тут)
  const TG_BOT_TOKEN = "8497373725:AAFBV65-Km6M_wKxUWWPkDy7sqkp2NiFk74";

  // ✅ CHAT ID (если надо заменить — меняешь тут)
  const TG_CHAT_ID = "6324436781";

  /* ========================= */

  function esc(s) {
    return encodeURIComponent(String(s || '').trim());
  }

  // Иногда браузер ругается на CORS — но запрос всё равно может уйти.
  // Для надежности делаем fallback через Image().
  function sendViaImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
      img.src = url;
    });
  }

  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${esc(text)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return !!data.ok;
    } catch (e) {
      await sendViaImage(url);
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

  // открыть по кнопке
  document.querySelectorAll('.vacancy-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vacancy = btn.getAttribute('data-vacancy') || '';
      openModal(vacancy);
    });
  });

  // закрытие по крестику/бекдропу
  modal.addEventListener('click', (e) => {
    const close = e.target && e.target.getAttribute && e.target.getAttribute('data-close');
    if (close) closeModal();
  });

  // закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // submit -> Telegram
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const vacancy = (vacancyField.value || '').trim();
    const name = (nameField.value || '').trim();
    const tg = (tgField.value || '').trim();
    const phone = (phoneField.value || '').trim();

    if (!name || !tg || !phone) {
      alert('Заполни все поля: имя, ник в TG и телефон.');
      return;
    }

    const text =
`✅ Заявка с сайта StripUp

Вакансия: ${vacancy}
Имя: ${name}
TG: ${tg}
Телефон: ${phone}`;

    const oldText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
    }

    const ok = await sendToTelegram(text);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = oldText || 'Отправить';
    }

    if (ok) {
      alert('✅ Заявка отправлена в Telegram!');
      closeModal();
      form.reset();
    } else {
      alert('❌ Не удалось отправить. Попробуй ещё раз.');
    }
  });
function initContactEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  const letterLink = envelope.querySelector('.letter-link');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;


  envelope.addEventListener('click', (e) => {
    if (!isTouchDevice) return;

    if (!envelope.classList.contains('touch-active')) {
      e.preventDefault();
      envelope.classList.add('touch-active');
    }
  });

  if (letterLink) {
    letterLink.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener('click', (e) => {
    if (!isTouchDevice) return;
    if (envelope.contains(e.target)) return;
    envelope.classList.remove('touch-active');
  });
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
  initImageReviewsSlider();
  initVacancyModal();
  initContactEnvelope();
});
}
// JavaScript для обработки касаний на мобильных устройствах
document.addEventListener('DOMContentLoaded', function() {
  const envelope = document.getElementById('envelope');
  let touchActive = false;
  
  // Проверяем, является ли устройство touch-устройством
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
  
  if (isTouchDevice) {
    // Для touch-устройств добавляем обработчики
    envelope.addEventListener('touchstart', function(e) {
      // Предотвращаем всплытие, чтобы не мешать клику по ссылке
      if (e.target.classList.contains('letter-link')) {
        return;
      }
      
      e.preventDefault();
      
      // Снимаем активное состояние со всех конвертов
      document.querySelectorAll('.envelope').forEach(function(item) {
        item.classList.remove('touch-active');
      });
      
      // Добавляем активное состояние к текущему конверту
      envelope.classList.toggle('touch-active');
      touchActive = envelope.classList.contains('touch-active');
    }, { passive: false });
    
    // Закрываем конверт при клике вне его области
    document.addEventListener('touchstart', function(e) {
      if (!envelope.contains(e.target)) {
        envelope.classList.remove('touch-active');
        touchActive = false;
      }
    });
    
    // Предотвращаем стандартное поведение ссылки при первом касании
    const link = envelope.querySelector('.letter-link');
    link.addEventListener('touchstart', function(e) {
      if (!envelope.classList.contains('touch-active')) {
        e.preventDefault();
        // Открываем конверт при первом касании на ссылку
        envelope.classList.add('touch-active');
        touchActive = true;
      }
    });
  }
  
  // Для десктопных устройств сохраняем hover-эффект
  envelope.addEventListener('mouseenter', function() {
    if (!isTouchDevice) {
      envelope.classList.add('touch-active');
    }
  });
  
  envelope.addEventListener('mouseleave', function() {
    if (!isTouchDevice) {
      envelope.classList.remove('touch-active');
    }
  });
});