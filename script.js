document.addEventListener('DOMContentLoaded', () => {
  initHearts();
  initFAQ();
  calc(1); calc(2); calc(3);
});

function scrollToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
function goSignup(){
  const env=document.getElementById('envelope');
  if(env){
    env.scrollIntoView({behavior:'smooth', block:'center'});
    env.classList.add('open');
    setTimeout(()=>env.classList.remove('open'),2200);
  }
}
function calc(t){
  const hoursEl=document.getElementById('hours'+t);
  const resEl=document.getElementById('earn'+t);
  if(!hoursEl||!resEl) return;
  const h=Number(hoursEl.value)||0;
  const rates={1:200,2:450,3:900};
  resEl.innerText=Math.round(rates[t]*h*4).toLocaleString('ru-RU')+' ₽/мес';
}
function initFAQ(){
  document.querySelectorAll('.faq .q').forEach(q=>{
    q.addEventListener('click',()=>toggleFAQ(q));
  });
}
function toggleFAQ(el){
  const a=el.nextElementSibling;
  if(!a) return;
  a.style.display=(getComputedStyle(a).display!=='none')?'none':'block';
}
function initHearts(){
  const hearts=document.querySelectorAll('.background-hearts .heart');
  hearts.forEach((h,i)=>{
    h.style.left=(i*80)+'px';
    h.style.top=(Math.random()*300)+'px';
    h.style.animationDelay=(i*0.5)+'s';
  });
}
function openTelegram(e){if(e)e.preventDefault();alert('Откроется Telegram — замените ссылку на реальную');}
function submitForm(){
  const n=document.getElementById('name').value.trim();
  const c=document.getElementById('contactinfo').value.trim();
  if(!c){alert('Укажите контакт.'); return;}
  alert('Спасибо! Заявка принята: '+(n||'(без имени)'));
  document.getElementById('name').value='';
  document.getElementById('contactinfo').value='';
  document.getElementById('message').value='';
}
