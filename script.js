// Появление элементов при скролле (минимальная анимация)
document.addEventListener('DOMContentLoaded', () => {
  const toAnimate = document.querySelectorAll('.section, .card, .pricing-card');
  const appear = (entry) => {
    entry.classList.add('visible');
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) appear(e.target);
    });
  }, { threshold: 0.15 });

  toAnimate.forEach(el => io.observe(el));

  // FAQ: раскрытие ответов
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.style.display === 'block';
      answer.style.display = isOpen ? 'none' : 'block';
    });
  });

  // Калькулятор
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const tariff = parseFloat(document.getElementById('tariffSelect').value) || 0;
      const hours = parseFloat(document.getElementById('hours').value) || 0;
      const rate = parseFloat(document.getElementById('rate').value) || 0;
      const commission = parseFloat(document.getElementById('commission').value) || 0;

      const preTax = (hours * rate) * (tariff > 0 ? 1 : 0); // базовый ориентир
      const afterTax = preTax * (1 - commission / 100);

      document.getElementById('preTax').textContent = preTax.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
      document.getElementById('afterTax').textContent = afterTax.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    });
  }
});
