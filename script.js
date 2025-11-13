// Floating hearts animation
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartsCount = 15;
    
    for (let i = 0; i < heartsCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '💗';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
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
                    otherIcon.textContent = '+';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Change icon
            const icon = question.querySelector('span:last-child');
            icon.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
}

// Form submission
function initForm() {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            alert('Спасибо, ' + name + '! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            this.reset();
        } else {
            alert('Пожалуйста, заполните все поля формы.');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
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
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 247, 249, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(176, 49, 94, 0.15)';
        } else {
            header.style.background = 'rgba(255, 247, 249, 0.95)';
            header.style.boxShadow = '0 2px 15px rgba(176, 49, 94, 0.1)';
        }
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createHearts();
    initFAQ();
    initForm();
    initSmoothScroll();
    initHeaderScroll();
});

// Add loading animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-box, .pricing-box, .review-box');
    
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
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize scroll animations
window.addEventListener('load', animateOnScroll);