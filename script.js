// Floating hearts animation
function createHearts() {
    const container = document.getElementById('hearts-container');
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
    nextBtn.addEventListener('click', () => {
        clearInterval(autoRotate);
        nextReview();
        autoRotate = setInterval(nextReview, 5000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoRotate);
        prevReview();
        autoRotate = setInterval(nextReview, 5000);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoRotate);
            showReview(index);
            autoRotate = setInterval(nextReview, 5000);
        });
    });

    // Pause auto-rotate on hover
    const phoneContent = document.querySelector('.phone-content');
    phoneContent.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    phoneContent.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextReview, 5000);
    });
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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
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

// Add loading animation for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.pricing-box-horizontal, .about-combined-box, .phone-box, .envelope-wrapper, .interview-item');
    
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

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
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
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createHearts();
    initPhoneReviews();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initMobileMenu();
});

// Initialize scroll animations when page is fully loaded
window.addEventListener('load', function() {
    animateOnScroll();
});