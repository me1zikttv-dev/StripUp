// ФИКС: Предотвратить скролл при загрузке на мобильных (ТОЛЬКО ОДИН РАЗ)
let mobileScrollFixed = false;

function fixMobileInitialScroll() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile || mobileScrollFixed) return;

    mobileScrollFixed = true;

    document.documentElement.classList.add('no-smooth-scroll');

    // ОДИН РАЗ при загрузке - без таймеров
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
    });

    // Убираем якорь из URL если он есть
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
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (!id || id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 55;
            const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: y,
                behavior: 'auto'
            });

            // Закрываем мобильное меню
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
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-question span:last-child');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Change icon
            const icon = question.querySelector('span:last-child');
            if (icon) {
                icon.textContent = item.classList.contains('active') ? '−' : '+';
            }
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
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add scroll effect for header
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 80) {
                header.style.background = 'rgba(255, 247, 249, 0.98)';
                header.style.boxShadow = '0 4px 25px rgba(176, 49, 94, 0.18)';
            } else {
                header.style.background = 'rgba(255, 247, 249, 0.95)';
                header.style.boxShadow = '0 2px 15px rgba(176, 49, 94, 0.15)';
            }
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
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
}

// Calculator functionality В РУБЛЯХ
function initCalculator() {
    const incomeSlider = document.getElementById('income');
    const incomeValue = document.getElementById('income-value');
    const daysSlider = document.getElementById('days');
    const daysValue = document.getElementById('days-value');
    const planButtons = document.querySelectorAll('.plan-btn');
    const grossIncomeEl = document.getElementById('gross-income');
    const commissionEl = document.getElementById('commission');
    const netIncomeEl = document.getElementById('net-income');

    if (!incomeSlider || !daysSlider) return;

    const commissionRates = {
        start: 0,
        pro: 15,
        premium: 10
    };

    let currentPlan = 'start';

    function updateSliderValue(slider, valueEl) {
        const value = parseInt(slider.value);
        valueEl.textContent = value.toLocaleString('ru-RU');
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' ₽';
    }

    function calculateIncome() {
        const dailyIncome = parseInt(incomeSlider.value);
        const workDays = parseInt(daysSlider.value);
        const commissionRate = commissionRates[currentPlan];

        const grossIncome = dailyIncome * workDays;

        let commission = 0;
        if (currentPlan === 'start') {
            const freeDays = Math.min(workDays, 10);
            const paidDays = Math.max(0, workDays - 10);
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

    incomeSlider.addEventListener('input', () => {
        updateSliderValue(incomeSlider, incomeValue);
        calculateIncome();
    });

    daysSlider.addEventListener('input', () => {
        updateSliderValue(daysSlider, daysValue);
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

    initializeValues();
    calculateIncome();
}

// Инициализация нового конверта с письмом
function initNewEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;
  
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
  
  // Анимация при первом появлении
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

// Add loading animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.pricing-box-horizontal, .about-combined-box, .letter-envelope-wrapper, .interview-item, .calculator-box, .result-card, .phone-image-container-large');
    
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

// Эффект параллакса при скролле (ТОЛЬКО ДЛЯ ДЕСКТОПА)
function initParallaxEffect() {
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const envelope = document.querySelector('.letter-envelope');
            const contactSection = document.getElementById('contact');
            
            if (envelope && contactSection) {
                const scrolled = window.pageYOffset;
                const sectionTop = contactSection.offsetTop;
                const sectionHeight = contactSection.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (scrolled > sectionTop - windowHeight && scrolled < sectionTop + sectionHeight) {
                    const rate = (scrolled - sectionTop) * 0.04;
                    envelope.style.transform = `translateY(${rate}px)`;
                }
            }
        });
    }
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

  // ✅ свайп на мобильных
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

      // горизонтальный свайп
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    }, { passive: true });
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    fixMobileInitialScroll();
    fixMobileAnchorScroll();
    
    createHearts();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initMobileMenu();
    initCalculator();
    initNewEnvelope(); // Используем новый конверт
    initParallaxEffect();
    initImageReviewsSlider();
    
    const envelopeWrapper = document.querySelector('.letter-envelope-wrapper');
    
    if (envelopeWrapper) {
        envelopeWrapper.style.opacity = '0';
        envelopeWrapper.style.transform = 'translateY(25px) scale(0.9)';
        envelopeWrapper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            envelopeWrapper.style.opacity = '1';
            envelopeWrapper.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }
    
    window.addEventListener('load', function() {
        animateOnScroll();
        document.documentElement.classList.add('smooth-scroll-ready');
    });
});

// При изменении ориентации только обновляем обработчики
window.addEventListener('orientationchange', function() {
    setTimeout(fixMobileAnchorScroll, 100);
});

// Адаптивность для мобильных устройств
function handleMobileAdjustments() {
    const envelope = document.querySelector('.letter-envelope');
    
    if (window.innerWidth < 768) {
        if (envelope) {
            envelope.style.transition = 'transform 0.25s ease';
        }
    }
}

// Поддержка тач-устройств
document.addEventListener('touchstart', function() {
    const envelope = document.querySelector('.letter-envelope');
    if (envelope) {
        envelope.classList.add('touch-device');
    }
});

// Дополнительные интерактивные эффекты (только для десктопа)
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', function() {
        const contactSection = document.getElementById('contact');
        const envelope = document.querySelector('.envelope');
        
        if (contactSection && envelope) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        envelope.style.transform = 'scale(1.04)';
                        setTimeout(() => {
                            envelope.style.transform = 'scale(1)';
                        }, 250);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(contactSection);
        }
    });
}