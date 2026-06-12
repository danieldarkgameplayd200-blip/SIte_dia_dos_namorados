const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const intro = $('#intro');
const enterBtn = $('#enterBtn');
const audio = $('#mainAudio');
const playBtn = $('#playBtn');
const musicStatus = $('#musicStatus');
const progressBar = $('#progressBar');
const heartsLayer = $('#heartsLayer');
const quickHeart = $('#quickHeart');
const surpriseBtn = $('#surpriseBtn');
const surpriseText = $('#surpriseText');
const modal = $('#photoModal');
const modalImg = $('#modalImg');
const closeModal = $('#closeModal');

const heroMessage = 'Daniel fez esse cantinho para você, Sophia. Um presente simples, mas cheio de sentimento, fotos, música e palavras que vêm direto do coração.';
let typingIndex = 0;

function typeHeroText(){
  const el = $('#typeText');
  if(!el) return;
  el.textContent = heroMessage.slice(0, typingIndex++);
  if(typingIndex <= heroMessage.length) setTimeout(typeHeroText, 32);
}

function makeHeart(){
  const heart = document.createElement('span');
  heart.className = 'heart';
  const symbols = ['❤️','💖','💕','💘','💗','♥'];
  heart.textContent = symbols[Math.floor(Math.random()*symbols.length)];
  heart.style.left = Math.random()*100 + 'vw';
  heart.style.fontSize = (14 + Math.random()*24) + 'px';
  heart.style.setProperty('--drift', (Math.random()*220 - 110) + 'px');
  heart.style.animationDuration = (5 + Math.random()*5) + 's';
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 10500);
}

let heartTimer = null;
function startHearts(){
  if(heartTimer) return;
  for(let i=0;i<18;i++) setTimeout(makeHeart, i*110);
  heartTimer = setInterval(makeHeart, 360);
}

function burstHearts(x = window.innerWidth/2, y = window.innerHeight/2){
  for(let i=0;i<34;i++){
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = ['❤️','💗','💖','💕'][Math.floor(Math.random()*4)];
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random()*190;
    h.style.setProperty('--x', Math.cos(angle)*distance + 'px');
    h.style.setProperty('--y', Math.sin(angle)*distance + 'px');
    h.style.fontSize = (18 + Math.random()*25) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}

async function tryPlayAudio(){
  if(!audio) return;
  try{
    await audio.play();
    playBtn.textContent = '❚❚';
    musicStatus.textContent = 'Tocando agora';
  }catch(err){
    musicStatus.textContent = 'Clique no play para tocar';
  }
}

function pauseAudio(){
  audio.pause();
  playBtn.textContent = '▶';
  musicStatus.textContent = 'Pausado';
}

enterBtn?.addEventListener('click', async () => {
  intro.classList.add('hidden');
  startHearts();
  typeHeroText();
  burstHearts(window.innerWidth/2, window.innerHeight/2);
  await tryPlayAudio();
});

playBtn?.addEventListener('click', () => {
  if(audio.paused) tryPlayAudio(); else pauseAudio();
});

audio?.addEventListener('timeupdate', () => {
  if(!audio.duration) return;
  progressBar.style.width = ((audio.currentTime/audio.duration)*100) + '%';
});

audio?.addEventListener('ended', () => {
  playBtn.textContent = '▶';
  musicStatus.textContent = 'Finalizada';
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

quickHeart?.addEventListener('click', (e)=>{
  burstHearts(e.clientX, e.clientY);
  startHearts();
});

surpriseBtn?.addEventListener('click', (e)=>{
  burstHearts(e.clientX, e.clientY);
  startHearts();
  surpriseText.textContent = 'Sophia, mesmo que esse site tenha várias fotos, animações e palavras bonitas, a parte mais importante é simples: eu gosto muito de você. Obrigado por ser essa pessoa tão especial na minha vida. Assinado: Daniel.';
});

$$('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    modalImg.src = card.dataset.img;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
  });
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - .5) * 7;
    const rotateX = ((y / rect.height) - .5) * -7;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

function closePhoto(){
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
  setTimeout(()=>{ modalImg.src = ''; }, 250);
}
closeModal?.addEventListener('click', closePhoto);
modal?.addEventListener('click', (e)=>{ if(e.target === modal) closePhoto(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closePhoto(); });

window.addEventListener('pointerdown', () => {
  if(intro.classList.contains('hidden')) startHearts();
}, {once:true});
