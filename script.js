document.addEventListener('DOMContentLoaded',()=>{
  initHearts(); bindEnvelope(); bindNavLinks(); initFAQ(); calc(1);calc(2);calc(3);
});

function scrollToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}

function goSignup(){
  const env=document.getElementById('envelope');
  if(env){env.scrollIntoView({behavior:'smooth',block:'center'}); env.classList.add('open'); setTimeout(()=>env.classList.remove('open'),2200);}
  else alert('Форма регистрации — демонстрация.');
}

function bindNavLinks(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href=a.getAttribute('href').slice(1);
      const el=document.getElementById(href);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });
}

const baseRates={1:200,2:450,3:900};
function calc(t){
  const hoursEl=document.getElementById('hours'+t);
  const resEl=document.getElementById('earn'+t);
  if(!hoursEl||!resEl) return;
  const h=Number(hoursEl.value)||0;
  const per=baseRates[t]||0;
  const weekly=per*h;
  const monthly=Math.round(weekly*4);
  resEl.innerText=monthly.toLocaleString('ru-RU')+' ₽/мес (пример)';
}

function initFAQ(){
  document.querySelectorAll('.faq .q').forEach(q=>q.addEventListener('click',()=>toggleFAQ(q)));
}

function toggleFAQ(el){
  const a=el.nextElementSibling;
  if(!a) return;
  a.style.display=getComputedStyle(a).display!=='none'?'none':'block';
}

function bindEnvelope(){
  const env=document.getElementById('envelope');
  if(!env) return;
  env.addEventListener('mouseenter',()=>env.classList.add('open'));
  env.addEventListener('mouseleave',()=>env.classList.remove('open'));
}

function openTelegram(e){if(e) e.preventDefault(); alert('Откроется Telegram — замените ссылку на реальную.');}

function submitForm(){
  const name=document.getElementById('name').value.trim();
  const contact=document.getElementById('contactinfo').value.trim();
  if(!contact){ alert('Укажите контакт (Telegram или почту).'); return; }
  alert('Спасибо! Заявка принята: '+(name||'(без имени)'));
  document.getElementById('name').value='';
  document.getElementById('contactinfo').value='';
  document.getElementById('message').value='';
}

function initHearts(){
  const hearts=document.querySelectorAll('.hearts .heart');
  hearts.forEach((h,i)=>{h.classList.add('animate');h.style.animationDelay=(i*0.6)+'s';});
  const mascot=document.querySelector('.mascot');
  if(!mascot) return;
  const heartsEls=Array.from(document.querySelectorAll('.hearts .heart'));
  mascot.addEventListener('mousemove',function(e){
    const rect=this.getBoundingClientRect();
    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;
    const dx=(e.clientX-cx)/rect.width;
    const dy=(e.clientY-cy)/rect.height;
    heartsEls.forEach((el,idx)=>{const depth=(idx+1)/8; el.style.transform=`translate3d(${dx*18*depth}px,${dy*10*depth}px,0)`;});
  });
  mascot.addEventListener('mouseleave',()=>heartsEls.forEach(el=>el.style.transform=''));
}

window.scrollToSection=scrollToSection;
window.goSignup=goSignup;
window.calc=calc;
window.toggleFAQ=toggleFAQ;
window.openTelegram=openTelegram;
window.submitForm=submitForm;
