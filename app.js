// Simple in-browser LGU Admissions chatbot
let KB = [];
const stopwords = new Set(['the','is','and','to','a','of','in','for','on','how','what','when','i','you','my','me','do','can','are','with','by','be','at','from']);

function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

async function loadKB(){
  try{
    const res = await fetch('kb.json');
    KB = await res.json();
    console.log('KB loaded', KB.length);
  }catch(e){
    console.error('Failed to load KB', e);
  }
}

function tokenize(s){
  return s.toLowerCase().replace(/[^
\w ]+/g,' ').split(/\s+/).filter(w=>w && !stopwords.has(w));
}

function bestMatch(query){
  const qtokens = tokenize(query);
  if(qtokens.length===0) return null;
  let best=null; let bestScore=0;
  for(const item of KB){
    const text = (item.question + ' ' + item.answer).toLowerCase();
    const tokens = new Set(tokenize(text));
    let score=0; for(const t of qtokens) if(tokens.has(t)) score++;
    // also allow exact intent tag match
    if(item.intent){
      const it = item.intent.toLowerCase();
      if(qtokens.includes(it)) score += 1.5;
    }
    if(score>bestScore){ bestScore=score; best=item; }
  }
  // threshold: at least one overlapping token or score >=1
  if(bestScore>=1) return best; return null;
}

function appendMessage(text, from='bot'){
  const m = document.createElement('div'); m.className = 'message ' + (from==='user'?'user':'bot');
  const b = document.createElement('div'); b.className = 'bubble ' + (from==='user'?'user':'bot');
  b.innerHTML = text;
  m.appendChild(b);
  const ms = document.getElementById('messages');
  ms.appendChild(m); ms.scrollTop = ms.scrollHeight;
}

function botReplyFor(query){
  const match = bestMatch(query);
  if(match){
    return match.answer + '\n\nSource: ' + (match.source || 'https://lgu.edu.pk/admissions/');
  }
  return "I'm sorry — I don't have that exact information. You can check the official admissions page: https://lgu.edu.pk/admissions/ or ask to contact the admissions office for help.";
}

function initChat(){
  const widget = document.getElementById('chat-widget');
  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('close-chat');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const themeToggle = document.getElementById('theme-toggle');

  function openChat(){ widget.classList.remove('closed'); panel.setAttribute('aria-hidden','false'); }
  function closeChat(){ widget.classList.add('closed'); panel.setAttribute('aria-hidden','true'); }

  toggle.addEventListener('click', ()=>{ openChat(); appendMessage('<em>Hello! I am the LGU Admissions Assistant. How may I help you today?</em>'); });
  closeBtn.addEventListener('click', ()=>{ closeChat(); });

  form.addEventListener('submit', (e)=>{
    e.preventDefault(); const q = input.value.trim(); if(!q) return;
    appendMessage(escapeHtml(q), 'user');
    input.value='';
    // small typing delay
    setTimeout(()=>{
      const reply = botReplyFor(q);
      appendMessage(escapeHtml(reply), 'bot');
    }, 500);
  });

  // quick buttons
  document.querySelectorAll('.quick-buttons button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const q = b.getAttribute('data-q'); appendMessage(escapeHtml(q), 'user');
      setTimeout(()=>{ appendMessage(escapeHtml(botReplyFor(q)), 'bot'); }, 350);
    });
  });

  themeToggle.addEventListener('click', ()=>{
    const root = document.getElementById('chat-widget');
    if(root.classList.contains('theme-light')){ root.classList.remove('theme-light'); root.classList.add('theme-dark'); }
    else{ root.classList.remove('theme-dark'); root.classList.add('theme-light'); }
  });
}

// bootstrap
loadKB().then(()=>{ initChat(); });
