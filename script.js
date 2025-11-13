document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  calc(1); calc(2); calc(3);
});

function calc(t){
  const hoursEl = document.getElementById('hours'+t);
  const resEl = document.getElementById('earn'+t);
  if(!hoursEl || !resEl) return;
  const h = Number(hoursEl.value)||0;
  const rates={1:800,2:1800,3:3600};
  resEl.innerText = Math.round(rates[t]*h).toLocaleString('ru-RU')+' ₽/мес';
}
function initFAQ(){
  document.querySelectorAll('.faq .q').forEach(q=>{
    q.addEventListener('click',()=>{
      const a=q.nextElementSibling;
      a.style.display=(a.style.display==='block')?'none':'block';
    });
  });
}
function openTelegram(e){if(e)e.preventDefault(); alert('Откроется Telegram — замените ссылку');}
function submitForm(){
  const n=document.getElementById('name').value.trim();
  const c=document.getElementById('contactinfo').value.trim();
  alert('Спасибо! '+(n||'')+' Заявка принята');
}
