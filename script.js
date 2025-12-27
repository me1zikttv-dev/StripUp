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

/* ✅ FAQ — плавное открытие/закрытие */
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
    requestAnimationFrame(() => { answer.style.maxHeight = '0px'; });
    item.classList.remove('active');
    setIcon(item, false);
  }

  function openItem(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;
    item.classList.add('active');
    setIcon(item, true);
    answer.style.maxHeight = '0px';
    requestAnimationFrame(() => { answer.style.maxHeight = answer.scrollHeight + 'px'; });
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

/* =========================================================
   ✅ ВАКАНСИИ: МОДАЛКА + отправка в Telegram через tg.php
   ========================================================= */
function initVacancyModal() {
  const modal = document.getElementById('vacancyModal');
  const form = document.getElementById('vacancyForm');

  const vacancyTitle = document.getElementById('vacancyModalVacancy');
  const vacancyField = document.getElementById('vacancyField');

  const nameField = document.getElementById('nameField');
  const tgField = document.getElementById('tgField');
  const phoneField = document.getElementById('phoneField');

  if (!modal || !form || !vacancyTitle || !vacancyField) return;

  // ✅ ВОТ ЭТОТ ФАЙЛ НУЖНО СОЗДАТЬ НА ХОСТИНГЕ (см. tg.php ниже)
  const TG_ENDPOINT = 'tg.php';

  function openModal(vacancy) {
    vacancyTitle.textContent = vacancy || '—';
    vacancyField.value = vacancy || '';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (nameField) nameField.focus();
    }, 50);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.vacancy-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vacancy = btn.getAttribute('data-vacancy') || '';
      openModal(vacancy);
    });
  });

  modal.addEventListener('click', (e) => {
    const close = e.target && e.target.getAttribute && e.target.getAttribute('data-close');
    if (close) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

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

    // блокируем кнопку на время отправки
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
    }

    try {
      const res = await fetch(TG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancy, name, tg, phone })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok !== true) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      alert('✅ Заявка отправлена! Мы скоро напишем тебе в Telegram.');
      closeModal();
      form.reset();

    } catch (err) {
      console.error(err);
      alert('❌ Не удалось отправить заявку. Проверь tg.php и хостинг (PHP).');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
      }
    }
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
  initVacancyModal();

  window.addEventListener('load', function () {
    document.documentElement.classList.add('smooth-scroll-ready');
  });
});

window.addEventListener('orientationchange', function () {
  setTimeout(fixMobileAnchorScroll, 100);
});
