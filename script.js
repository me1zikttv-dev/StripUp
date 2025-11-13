document.addEventListener('DOMContentLoaded', () => {
  initHearts();
  initFAQ();
  calc(1); calc(2); calc(3);
});

function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'})}
function goSignup(){const env=document.getElementById('envelope');if(env){env.scrollIntoView({behavior:'smooth', block:'center'});env.classList.add('open');setTimeout(()=>env.classList.remove('open'),2200)}}
function calc(t){const h=document.getElementById('hours'+t).value||0;const r={1:200,2:450,3:900};document.getElementById('earn'+t).innerText=(r[t]*h*4).toLocaleString('ru-RU')+' ₽/мес'}
function initFAQ(){document.querySelectorAll('.faq .q').forEach(q=>q.addEventListener('click',()=>{const a=q.nextElementSibling;a&&(a.style.display=a.style.display!=='none'?'none':'block')}))}
function initHearts(){document.querySelectorAll('.hearts .heart').forEach((h,i)=>{h.style.left=(12+i*44)+'px';h.style.top=(18+i*28)+'px';h.style.animationDelay=(i*0.6)+'s'})}
function openTelegram(e){e.preventDefault();alert('Откроется Telegram — замените ссылку')}
function submitForm(){alert('Спасибо! Заявка принята: '+(document.getElementById('name').value||'(без имени)'));['name','contactinfo','message'].forEach(id=>document.getElementById(id).value='')}
