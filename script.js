// ФИКС: Предотвратить скролл при загрузке на мобильных (ТОЛЬКО ПРИ ЗАГРУЗКЕ)
let mobileScrollFixed = false;

function fixMobileInitialScroll() {
    // Проверяем, мобильное ли устройство
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && !mobileScrollFixed) {
        console.log('Мобильное устройство обнаружено, фиксируем начальный скролл...');
        mobileScrollFixed = true;
        
        // Отключаем плавный скролл на время загрузки
        document.documentElement.classList.add('no-smooth-scroll');
        
        // ТОЛЬКО ОДИН РАЗ при загрузке - скроллим наверх
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'auto'
            });
        }, 50);
        
        // Убираем якорь из URL если он есть (без перезагрузки)
        if (window.location.hash) {
            console.log('Убираем якорь из URL:', window.location.hash);
            history.replaceState(null, null, ' ');
        }
        
        // Включаем плавный скролл обратно
        setTimeout(() => {
            document.documentElement.classList.remove('no-smooth-scroll');
            document.documentElement.classList.add('smooth-scroll-ready');
            console.log('Плавный скролл активирован');
        }, 500);
    }
}

// ФИКС: Исправить скролл к якорям на мобильных
function fixMobileAnchorScroll() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log('Настраиваем якорные ссылки для мобильных...');
        
        // Переопределяем плавный скролл для якорей
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    
                    // Рассчитываем позицию с учетом высоты header
                    const headerHeight = 60; // Высота мобильного header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    // Прокручиваем с небольшим замедлением
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Закрываем мобильное меню если открыто
                    const navMenu = document.querySelector('nav ul');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });
    }
}

// Floating hearts animation
function createHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;
    
    const heartsCount = 20;
    
    for (let i = 0; i < heartsCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '💗';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(heart);
    }
}

// Phone reviews carousel
function initPhoneReviews() {
    const reviews = document.querySelectorAll('.phone-review');
    const dots = document.querySelectorAll('.phone-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!reviews.length || !dots.length) return;
    
    let currentReview = 0;

    function showReview(index) {
        reviews.forEach(review => review.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        reviews[index].classList.add('active');
        dots[index].classList.add('active');
        currentReview = index;
    }

    function nextReview() {
        let nextIndex = currentReview + 1;
        if (nextIndex >= reviews.length) {
            nextIndex = 0;
        }
        showReview(nextIndex);
    }

    function prevReview() {
        let prevIndex = currentReview - 1;
        if (prevIndex < 0) {
            prevIndex = reviews.length - 1;
        }
        showReview(prevIndex);
    }

    // Auto-rotate reviews
    let autoRotate = setInterval(nextReview, 5000);

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoRotate);
            nextReview();
            autoRotate = setInterval(nextReview, 5000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoRotate);
            prevReview();
            autoRotate = setInterval(nextReview, 5000);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoRotate);
            showReview(index);
            autoRotate = setInterval(nextReview, 5000);
        });
    });

    // Pause auto-rotate on hover
    const phoneContent = document.querySelector('.phone-content');
    if (phoneContent) {
        phoneContent.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });

        phoneContent.addEventListener('mouseleave', () => {
            autoRotate = setInterval(nextReview, 5000);
        });
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

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Для мобильных обрабатывается в fixMobileAnchorScroll
            if (window.innerWidth <= 768) return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = 80;
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
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 247, 249, 0.98)';
                header.style.boxShadow = '0 5px 30px rgba(176, 49, 94, 0.2)';
            } else {
                header.style.background = 'rgba(255, 247, 249, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(176, 49, 94, 0.15)';
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
        
        // Close menu when clicking on links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Calculator functionality В РУБЛЯХ
function initCalculator() {
    // DOM elements
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

    // Calculate income
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
        
        // Анимация для итогового значения
        netIncomeEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            netIncomeEl.style.transform = 'scale(1)';
        }, 300);
    }

    // Инициализируем значения при загрузке
    function initializeValues() {
        updateSliderValue(incomeSlider, incomeValue);
        updateSliderValue(daysSlider, daysValue);
        
        // Устанавливаем начальные значения
        const initialDailyIncome = 20000;
        const initialWorkDays = 20;
        grossIncomeEl.textContent = formatCurrency(initialDailyIncome * initialWorkDays);
        commissionEl.textContent = formatCurrency(0);
        netIncomeEl.textContent = formatCurrency(initialDailyIncome * initialWorkDays);
    }

    // EVENTS
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
            
            // Анимация для кнопок
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Инициализация
    initializeValues();
    calculateIncome();
}

// Инициализация конверта в стиле телефона
function initPhoneStyleEnvelope() {
    const envelope = document.querySelector('.letter-envelope');
    const sealHeart = document.querySelector('.seal-heart');
    const joinText = document.querySelector('.envelope-join-text');
    
    if (!envelope) return;
    
    // 1. Анимация сердечка на печати
    if (sealHeart) {
        const heartColors = ['#ff6b9d', '#ff5a94', '#b0315e', '#ff7ba8'];
        let colorIndex = 0;
        
        setInterval(() => {
            sealHeart.style.color = heartColors[colorIndex];
            colorIndex = (colorIndex + 1) % heartColors.length;
            
            setTimeout(() => {
                sealHeart.style.color = '#b0315e';
            }, 500);
        }, 2000);
    }
    
    // 2. Клик по конверту
    envelope.addEventListener('click', function(e) {
        // Не открываем если кликнули по ссылке
        if (e.target.closest('.envelope-join-text')) return;
        
        // Легкая анимация при клике
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
    
    // 3. Клик по тексту "Присоединиться"
    if (joinText) {
        joinText.addEventListener('click', function(e) {
            // Пульсация при клике
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
            
            // Анимация конверта
            const envelope = this.closest('.letter-envelope');
            if (envelope) {
                envelope.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    envelope.style.transform = 'translateY(0)';
                }, 300);
            }
        });
    }
    
    // 4. Автоматическое открытие клапана при наведении
    envelope.addEventListener('mouseenter', function() {
        const flap = this.querySelector('.envelope-flap');
        if (flap) {
            flap.style.transform = 'rotateX(-25deg)';
        }
        
        const joinText = this.querySelector('.envelope-join-text');
        if (joinText) {
            joinText.style.opacity = '1';
            joinText.style.transform = 'translateY(0)';
        }
    });
    
    envelope.addEventListener('mouseleave', function() {
        const flap = this.querySelector('.envelope-flap');
        if (flap) {
            flap.style.transform = 'rotateX(0deg)';
        }
        
        const joinText = this.querySelector('.envelope-join-text');
        if (joinText) {
            joinText.style.opacity = '0';
            joinText.style.transform = 'translateY(20px)';
        }
    });
}

// Add loading animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.pricing-box-horizontal, .about-combined-box, .phone-box, .letter-envelope-wrapper, .interview-item, .calculator-box, .result-card');
    
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
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем...');
    
    // Сначала фиксируем скролл на мобильных (ТОЛЬКО ОДИН РАЗ)
    fixMobileInitialScroll();
    fixMobileAnchorScroll();
    
    // Потом остальные функции
    createHearts();
    initPhoneReviews();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initMobileMenu();
    initCalculator();
    initPhoneStyleEnvelope();
    
    // Анимация появления конверта
    const envelopeWrapper = document.querySelector('.letter-envelope-wrapper');
    
    if (envelopeWrapper) {
        envelopeWrapper.style.opacity = '0';
        envelopeWrapper.style.transform = 'translateY(30px) scale(0.9)';
        envelopeWrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            envelopeWrapper.style.opacity = '1';
            envelopeWrapper.style.transform = 'translateY(0) scale(1)';
        }, 400);
    }
    
    // Включаем плавный скролл после полной загрузки
    window.addEventListener('load', function() {
        console.log('Страница полностью загружена');
        animateOnScroll();
        
        // Дополнительная проверка для мобильных (ТОЛЬКО ОДИН РАЗ)
        if (window.innerWidth <= 768 && window.pageYOffset > 100) {
            console.log('Скролл не наверху, фиксируем...');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Включаем плавный скролл
        document.documentElement.classList.add('smooth-scroll-ready');
    });
});

// Вызываем также при изменении ориентации (БЕЗ СКРОЛЛА НАВЕРХ)
window.addEventListener('orientationchange', function() {
    console.log('Ориентация изменена');
    // Только обновляем фикс для якорных ссылок
    fixMobileAnchorScroll();
});

// Эффект параллакса при скролле
window.addEventListener('scroll', function() {
    const envelope = document.querySelector('.letter-envelope');
    const contactSection = document.getElementById('contact');
    
    if (envelope && contactSection) {
        const scrolled = window.pageYOffset;
        const sectionTop = contactSection.offsetTop;
        const sectionHeight = contactSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Параллакс эффект для конверта
        if (scrolled > sectionTop - windowHeight && scrolled < sectionTop + sectionHeight) {
            const rate = (scrolled - sectionTop) * 0.05;
            envelope.style.transform = `translateY(${rate}px) scale(1)`;
        }
    }
});

// Адаптивность для мобильных устройств
function handleMobileAdjustments() {
    const envelope = document.querySelector('.letter-envelope');
    
    if (window.innerWidth < 768) {
        // Уменьшаем анимации на мобильных
        if (envelope) {
            envelope.style.transition = 'transform 0.3s ease';
        }
    }
}

window.addEventListener('resize', handleMobileAdjustments);
handleMobileAdjustments();

// Поддержка тач-устройств
document.addEventListener('touchstart', function() {
    const envelope = document.querySelector('.letter-envelope');
    if (envelope) {
        envelope.classList.add('touch-device');
    }
});

// Дополнительные интерактивные эффекты
document.addEventListener('DOMContentLoaded', function() {
    // Эффект при скролле к конверту
    const contactSection = document.getElementById('contact');
    const envelope = document.querySelector('.letter-envelope');
    
    if (contactSection && envelope) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Легкая анимация конверта при появлении секции
                    envelope.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        envelope.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(contactSection);
    }
});

// УДАЛЕНЫ ВСЕ ЛИШНИЕ ТАЙМЕРЫ КОТОРЫЕ СКРОЛЛИЛИ НАВЕРХ!
// НЕТ больше window.scrollTo в таймерах через 2 секунды и т.д.