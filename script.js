// Floating hearts animation - отключено на мобильных
function createHearts() {
    if (window.innerWidth > 768) {
        const container = document.getElementById('hearts-container');
        const heartsCount = 15;
        
        for (let i = 0; i < heartsCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '💗';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 8 + 's';
            heart.style.fontSize = (Math.random() * 15 + 12) + 'px';
            container.appendChild(heart);
        }
    }
}

// Phone reviews carousel - оптимизировано для touch
function initPhoneReviews() {
    const reviews = document.querySelectorAll('.phone-review');
    const dots = document.querySelectorAll('.phone-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentReview = 0;
    let autoRotate;

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

    // Auto-rotate только на десктопе
    if (window.innerWidth > 768) {
        autoRotate = setInterval(nextReview, 5000);
    }

    // Event listeners с touch поддержкой
    function addTouchSupport(element, callback) {
        let startX;
        let endX;
        
        element.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Минимальное расстояние свайпа
                if (diff > 0) {
                    // Свайп влево - следующая
                    nextReview();
                } else {
                    // Свайп вправо - предыдущая
                    prevReview();
                }
            }
        }, { passive: true });
        
        element.addEventListener('click', callback);
    }

    if (nextBtn) addTouchSupport(nextBtn, nextReview);
    if (prevBtn) addTouchSupport(prevBtn, prevReview);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (autoRotate) clearInterval(autoRotate);
            showReview(index);
            if (window.innerWidth > 768) {
                autoRotate = setInterval(nextReview, 5000);
            }
        });
    });

    // Свайп на контейнере отзывов
    const phoneReviewsContainer = document.querySelector('.phone-reviews-container');
    if (phoneReviewsContainer) {
        addTouchSupport(phoneReviewsContainer, () => {});
    }

    // Пауза авто-ротации на hover только на десктопе
    if (window.innerWidth > 768) {
        const phoneContent = document.querySelector('.phone-content');
        if (phoneContent) {
            phoneContent.addEventListener('mouseenter', () => {
                if (autoRotate) clearInterval(autoRotate);
            });

            phoneContent.addEventListener('mouseleave', () => {
                if (autoRotate) clearInterval(autoRotate);
                autoRotate = setInterval(nextReview, 5000);
            });
        }
    }
}

// FAQ accordion с touch поддержкой
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', (e) => {
            e.preventDefault();
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
        
        // Touch support для мобильных
        question.addEventListener('touchstart', (e) => {
            e.currentTarget.style.backgroundColor = 'var(--light-pink)';
        }, { passive: true });
        
        question.addEventListener('touchend', (e) => {
            e.currentTarget.style.backgroundColor = '';
        }, { passive: true });
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // Закрываем мобильное меню если открыто
                const navMenu = document.querySelector('nav ul');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
                
                // Плавный скролл
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll effect for header
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = 'rgba(255, 247, 249, 0.98)';
                header.style.boxShadow = '0 5px 30px rgba(176, 49, 94, 0.2)';
                
                // Скрываем/показываем header при скролле на мобильных
                if (window.innerWidth <= 768) {
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        // Прокручиваем вниз - скрываем
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        // Прокручиваем вверх - показываем
                        header.style.transform = 'translateY(0)';
                    }
                }
            } else {
                header.style.background = 'rgba(255, 247, 249, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(176, 49, 94, 0.15)';
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
}

// Add loading animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.pricing-box-horizontal, .about-combined-box, .phone-box, .letter-envelope-wrapper, .interview-item, .calculator-box, .result-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Mobile menu functionality - улучшено
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        // Клик по бургеру
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Клик по ссылке
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Клик вне меню
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Свайп для закрытия меню на мобильных
        let startX = 0;
        document.addEventListener('touchstart', (e) => {
            if (navMenu.classList.contains('active')) {
                startX = e.touches[0].clientX;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (navMenu.classList.contains('active')) {
                const currentX = e.touches[0].clientX;
                const diff = startX - currentX;
                
                if (diff > 100) { // Свайп влево для закрытия
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }, { passive: true });
    }
}

// Calculator functionality В РУБЛЯХ - оптимизировано для touch
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

    // Анимация значения при изменении
    function animateValue(valueElement) {
        if (valueElement && valueElement.parentElement.style) {
            const element = valueElement.parentElement;
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'valuePulse 0.3s ease';
            }, 10);
        }
    }

    function updateSliderValue(slider, valueEl) {
        const value = parseInt(slider.value);
        valueEl.textContent = value.toLocaleString('ru-RU');
        animateValue(valueEl);
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
        netIncomeEl.style.transform = 'scale(1.05)';
        setTimeout(() => {
            netIncomeEl.style.transform = 'scale(1)';
        }, 200);
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

    // Touch-оптимизация для слайдеров
    function addSliderTouchSupport(slider, valueEl) {
        let isSliding = false;
        
        slider.addEventListener('touchstart', () => {
            isSliding = true;
        }, { passive: true });
        
        slider.addEventListener('touchmove', () => {
            if (isSliding) {
                updateSliderValue(slider, valueEl);
                calculateIncome();
            }
        }, { passive: true });
        
        slider.addEventListener('touchend', () => {
            isSliding = false;
            updateSliderValue(slider, valueEl);
            calculateIncome();
        }, { passive: true });
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

    // Добавляем touch поддержку для слайдеров
    addSliderTouchSupport(incomeSlider, incomeValue);
    addSliderTouchSupport(daysSlider, daysValue);

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
        
        // Touch feedback
        btn.addEventListener('touchstart', () => {
            btn.style.opacity = '0.8';
        }, { passive: true });
        
        btn.addEventListener('touchend', () => {
            btn.style.opacity = '1';
        }, { passive: true });
    });

    // Инициализация
    initializeValues();
    calculateIncome();
}

// Инициализация конверта в стиле телефона - оптимизировано для touch
function initPhoneStyleEnvelope() {
    const envelope = document.querySelector('.letter-envelope');
    const sealHeart = document.querySelector('.seal-heart');
    const joinText = document.querySelector('.envelope-join-text');
    
    if (!envelope) return;
    
    // 1. Анимация сердечка на печати
    if (sealHeart && window.innerWidth > 768) {
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
    
    // 2. Touch/click по конверту
    let isTouchDevice = 'ontouchstart' in window;
    let envelopeTimer;
    
    function handleEnvelopeInteraction(e) {
        // Не открываем если кликнули по ссылке
        if (e.target.closest('.envelope-join-text')) return;
        
        // Предотвращаем стандартное поведение на touch
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        // Легкая анимация при взаимодействии
        envelope.style.transform = 'scale(0.98)';
        clearTimeout(envelopeTimer);
        envelopeTimer = setTimeout(() => {
            envelope.style.transform = 'scale(1)';
        }, 200);
        
        // На десктопе - hover эффекты
        if (!isTouchDevice) {
            const flap = envelope.querySelector('.envelope-flap');
            if (flap) {
                flap.style.transform = 'rotateX(-25deg)';
            }
            
            if (joinText) {
                joinText.style.opacity = '1';
                joinText.style.transform = 'translateY(0)';
            }
        }
    }
    
    function handleEnvelopeLeave() {
        if (!isTouchDevice) {
            const flap = envelope.querySelector('.envelope-flap');
            if (flap) {
                flap.style.transform = 'rotateX(0deg)';
            }
            
            if (joinText) {
                joinText.style.opacity = '0';
                joinText.style.transform = 'translateY(15px)';
            }
        }
    }
    
    // Добавляем обработчики в зависимости от устройства
    if (isTouchDevice) {
        // Для touch устройств
        envelope.addEventListener('touchstart', handleEnvelopeInteraction, { passive: false });
        envelope.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
        });
        
        // Открываем конверт при тапе
        envelope.addEventListener('click', (e) => {
            if (!e.target.closest('.envelope-join-text')) {
                const flap = envelope.querySelector('.envelope-flap');
                const isOpen = flap.style.transform === 'rotateX(-25deg)' || flap.style.transform.includes('-25deg');
                
                if (isOpen) {
                    flap.style.transform = 'rotateX(0deg)';
                    if (joinText) {
                        joinText.style.opacity = '0';
                        joinText.style.transform = 'translateY(15px)';
                    }
                } else {
                    flap.style.transform = 'rotateX(-25deg)';
                    if (joinText) {
                        joinText.style.opacity = '1';
                        joinText.style.transform = 'translateY(0)';
                    }
                }
            }
        });
    } else {
        // Для десктопа
        envelope.addEventListener('mouseenter', handleEnvelopeInteraction);
        envelope.addEventListener('mouseleave', handleEnvelopeLeave);
        envelope.addEventListener('click', handleEnvelopeInteraction);
    }
    
    // 3. Клик по тексту "Присоединиться"
    if (joinText) {
        joinText.addEventListener('click', function(e) {
            // Пульсация при клике
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
            
            // Анимация конверта
            if (envelope) {
                envelope.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    envelope.style.transform = 'translateY(0)';
                }, 300);
            }
        });
        
        // Touch feedback
        joinText.addEventListener('touchstart', function() {
            this.style.opacity = '0.9';
        }, { passive: true });
        
        joinText.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, { passive: true });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
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
        envelopeWrapper.style.transform = 'translateY(20px) scale(0.95)';
        envelopeWrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            envelopeWrapper.style.opacity = '1';
            envelopeWrapper.style.transform = 'translateY(0) scale(1)';
        }, 400);
    }
    
    // Предотвращение скачков контента при загрузке
    document.body.style.visibility = 'visible';
});

// Эффект параллакса при скролле - отключен на мобильных
window.addEventListener('scroll', function() {
    if (window.innerWidth > 768) {
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
    }
}, { passive: true });

// Адаптивность для мобильных устройств
function handleMobileAdjustments() {
    const envelope = document.querySelector('.letter-envelope');
    const html = document.documentElement;
    
    // Устанавливаем корректную высоту viewport на iOS
    function setVH() {
        const vh = window.innerHeight * 0.01;
        html.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    if (window.innerWidth < 768) {
        // Уменьшаем анимации на мобильных
        if (envelope) {
            envelope.style.transition = 'transform 0.3s ease';
        }
        
        // Улучшаем производительность
        document.querySelectorAll('.result-card, .interview-item, .pricing-box-horizontal').forEach(el => {
            el.style.willChange = 'transform';
        });
    }
}

window.addEventListener('resize', handleMobileAdjustments);
window.addEventListener('load', handleMobileAdjustments);
handleMobileAdjustments();

// Initialize scroll animations when page is fully loaded
window.addEventListener('load', function() {
    animateOnScroll();
    
    // Предотвращение zoom на инпутах на iOS
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            document.body.style.zoom = "100%";
        }
    }, { passive: true });
});

// Поддержка тач-устройств
document.addEventListener('touchstart', function() {
    const envelope = document.querySelector('.letter-envelope');
    if (envelope) {
        envelope.classList.add('touch-device');
    }
}, { passive: true });

// Дополнительные интерактивные эффекты
document.addEventListener('DOMContentLoaded', function() {
    // Эффект при скролле к конверту
    const contactSection = document.getElementById('contact');
    const envelope = document.querySelector('.letter-envelope');
    
    if (contactSection && envelope && window.innerWidth > 768) {
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

// Предотвращение скролла body при открытом мобильном меню
document.addEventListener('touchmove', function(e) {
    const navMenu = document.querySelector('nav ul');
    if (navMenu && navMenu.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });