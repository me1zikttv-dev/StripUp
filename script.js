document.addEventListener('DOMContentLoaded', () => {
  const hearts = ['💗', '💞', '💘'];
  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }, 1000);
});
