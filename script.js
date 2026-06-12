const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const intro = $('#intro');
const enterBtn = $('#enterBtn');
const audio = $('#mainAudio');
const playBtn = $('#playBtn');
const jumpMusicBtn = $('#jumpMusicBtn');
const musicStatus = $('#musicStatus');
const progressBar = $('#progressBar');
const heartsLayer = $('#heartsLayer');
const quickHeart = $('#quickHeart');
const surpriseBtn = $('#surpriseBtn');
const surpriseText = $('#surpriseText');
const modal = $('#photoModal');
const modalImg = $('#modalImg');
const closeModal = $('#closeModal');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 620px)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const heroMessage = 'Daniel fez esse cantinho para você, Sophia: fotos, cartas, música e uma surpresa feita do jeito mais carinhoso possível.';
let typingIndex = 0;
let heartTimer = null;
let lastHeartBurst = 0;

function typeHeroText(){
  const el = $('#typeText');
  if(!el) return;
  if(reduceMotion){
    el.textContent = heroMessage;
    return;
  }
  el.textContent = heroMessage.slice(0, typingIndex++);
  if(typingIndex <= heroMessage.length) window.setTimeout(typeHeroText, 28);
}

function makeHeart(){
  if(reduceMotion || document.hidden || !heartsLayer) return;
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = ['❤️','💖','💕','💘','💗','♥'][Math.floor(Math.random()*6)];
  heart.style.left = `${Math.random()*100}vw`;
  heart.style.fontSize = `${14 + Math.random()*(isSmallScreen ? 16 : 24)}px`;
  heart.style.setProperty('--drift', `${Math.random()*(isSmallScreen ? 120 : 220) - (isSmallScreen ? 60 : 110)}px`);
  heart.style.animationDuration = `${5 + Math.random()*4}s`;
  heartsLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), 9500);
}

function startHearts(){
  if(reduceMotion || heartTimer) return;
  const initial = isSmallScreen ? 8 : 14;
  for(let i = 0; i < initial; i++) window.setTimeout(makeHeart, i * 130);
  heartTimer = window.setInterval(makeHeart, isSmallScreen ? 760 : 440);
}

function burstHearts(x = window.innerWidth/2, y = window.innerHeight/2){
  if(reduceMotion) return;
  const now = Date.now();
  if(now - lastHeartBurst < 450) return;
  lastHeartBurst = now;
  const total = isSmallScreen ? 18 : 30;
  for(let i = 0; i < total; i++){
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = ['❤️','💗','💖','💕'][Math.floor(Math.random()*4)];
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 55 + Math.random() * (isSmallScreen ? 115 : 180);
    h.style.setProperty('--x', `${Math.cos(angle)*distance}px`);
    h.style.setProperty('--y', `${Math.sin(angle)*distance}px`);
    h.style.fontSize = `${17 + Math.random()*23}px`;
    document.body.appendChild(h);
    window.setTimeout(() => h.remove(), 950);
  }
}

async function tryPlayAudio(){
  if(!audio || !playBtn || !musicStatus) return;
  try{
    await audio.play();
    playBtn.textContent = '❚❚';
    musicStatus.textContent = 'Tocando agora';
  }catch(_err){
    musicStatus.textContent = 'Clique no play para tocar';
  }
}

function pauseAudio(){
  if(!audio || !playBtn || !musicStatus) return;
  audio.pause();
  playBtn.textContent = '▶';
  musicStatus.textContent = 'Pausado';
}

function toggleAudio(){
  if(!audio) return;
  if(audio.paused) tryPlayAudio(); else pauseAudio();
}

enterBtn?.addEventListener('click', async () => {
  intro?.classList.add('hidden');
  startHearts();
  typeHeroText();
  burstHearts(window.innerWidth/2, window.innerHeight/2);
  await tryPlayAudio();
}, {passive:true});

playBtn?.addEventListener('click', toggleAudio);
jumpMusicBtn?.addEventListener('click', toggleAudio);

audio?.addEventListener('timeupdate', () => {
  if(!audio.duration || !progressBar) return;
  progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
});

audio?.addEventListener('ended', () => {
  if(playBtn) playBtn.textContent = '▶';
  if(musicStatus) musicStatus.textContent = 'Finalizada';
});

if('IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {rootMargin:'0px 0px -6% 0px', threshold:.08});
  $$('.reveal').forEach(el => observer.observe(el));
}else{
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

quickHeart?.addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY);
  startHearts();
});

surpriseBtn?.addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY);
  startHearts();
  if(surpriseText){
    surpriseText.textContent = 'Sophia, mesmo que esse site tenha várias fotos, animações e músicas, a parte mais importante é simples: eu gosto muito de você. Obrigado por ser essa pessoa tão especial na minha vida. Assinado: Daniel.';
  }
  tryPlayAudio();
});

$$('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.dataset.img;
    if(!img || !modal || !modalImg) return;
    modalImg.src = img;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
  });

  if(canHover){
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateY = ((e.clientX - rect.left) / rect.width - .5) * 6;
      const rotateX = ((e.clientY - rect.top) / rect.height - .5) * -6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }, {passive:true});
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  }
});

function closePhoto(){
  if(!modal || !modalImg) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
  window.setTimeout(() => { modalImg.src = ''; }, 220);
}
closeModal?.addEventListener('click', closePhoto);
modal?.addEventListener('click', (e) => { if(e.target === modal) closePhoto(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closePhoto(); });

document.addEventListener('visibilitychange', () => {
  if(document.hidden && heartTimer){
    clearInterval(heartTimer);
    heartTimer = null;
  }
});

window.addEventListener('pointerdown', () => {
  if(intro?.classList.contains('hidden')) startHearts();
}, {once:true, passive:true});
