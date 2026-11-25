const dayContent = {
1:{
 title:"Baseline & Relaxed Articulation", region:"Mouth Mechanics Workshop", target:"Awareness, breath, relaxed movement",
 warmup:["Drop your shoulders and breathe out slowly.","Open and close the jaw without forcing it.","Smile, pucker, then relax the lips.","Trace slow circles with the tongue behind closed lips."],
 syllables:["mah","mee","moh","nah","nee","noh","lah","lee"],
 words:["morning","balance","clearly","steady","comfortable","energy","listen","message","practice","voice"],
 sentences:[
  "My voice can be clear without feeling forced.",
  "I pause, breathe, and finish each word.",
  "Steady speech is easier to understand.",
  "I let my jaw and lips move freely.",
  "Today I notice how my voice feels."
 ],
 rhythm:"I breathe / I pause / I speak clearly.",
 passages:{
  Calm:"Today I am listening to my natural voice. I do not need to rush. I can breathe, pause, and allow each word to arrive clearly.",
  Confident:"My voice deserves space. I speak at a steady pace, finish my words, and let every sentence land with intention.",
  Performer:"Welcome to the first stage of the quest. The world responds as I breathe deeply, speak deliberately, and bring each phrase to life."
 },
 tongue:"Unique New York, unique New York.",
 reflection:"What changed when you slowed down by ten percent?",
 feedback:"Notice which words feel easiest. Your baseline is a starting point, not a score."
},
2:{
 title:"P & B: Lip Precision", region:"Mouth Mechanics Workshop", target:"P and B",
 warmup:["Press the lips together gently, then release.","Alternate a silent P and B shape.","Do three relaxed lip trills.","Say “puh-buh” slowly without tightening the jaw."],
 syllables:["pah","pee","poh","bah","bee","boh","pay","bay"],
 words:["paper","bright","people","balance","purpose","better","open","habit","prepare","possible"],
 sentences:[
  "Please bring the blue paper.",
  "People improve through patient practice.",
  "Breathe before beginning the paragraph.",
  "A balanced pace makes speech more powerful.",
  "Prepare each P and B with both lips."
 ],
 rhythm:"Prepare / breathe / begin.",
 passages:{
  Calm:"Before I begin, I breathe. My lips meet gently for each P and B, then release without extra pressure.",
  Confident:"People pay attention when a speaker begins with purpose. I breathe, prepare, and place each word clearly.",
  Performer:"Beyond the bright portal, a patient builder prepared a bridge. Piece by piece, the path became possible."
 },
 tongue:"Peter packed a bright blue backpack.",
 reflection:"Were your P sounds crisp without becoming explosive?",
 feedback:"Let both lips meet fully, then release. Avoid squeezing the jaw."
},
3:{
 title:"T & D: Tongue-Tip Control", region:"Mouth Mechanics Workshop", target:"T and D",
 warmup:["Touch the tongue tip behind the upper front teeth.","Alternate light T and D taps.","Say “tee-dee” at a slow, even pace.","Relax the jaw while the tongue does the work."],
 syllables:["tah","tee","toh","dah","dee","doh","tie","die"],
 words:["today","detail","steady","direct","attention","decide","total","different","timing","understand"],
 sentences:[
  "Today I take time to speak distinctly.",
  "Details are easier to understand at a steady pace.",
  "Do not rush the final sound.",
  "Timing and tone direct attention.",
  "I decide where each sentence ends."
 ],
 rhythm:"Take time / define details / end clearly.",
 passages:{
  Calm:"Today I direct my attention to the tip of my tongue. Each T and D is light, clear, and steady.",
  Confident:"I take time to define the details. My timing is deliberate, and every ending is easy to hear.",
  Performer:"At dawn, the traveler detected a hidden door. With steady timing and determined focus, they entered the distant tower."
 },
 tongue:"Tiny details determine the total design.",
 reflection:"Did the tongue stay active while the jaw stayed relaxed?",
 feedback:"Use a light tongue tap. Stronger pressure does not always create clearer speech."
}
};

const topics = [
"Baseline","P & B","T & D","K & G","F & V","S & Z","Review",
"SH & CH","J / soft G","TH","R","L","M, N & NG","Review",
"Final sounds","Starting clusters","Ending clusters","Long words","Word stress","Pausing","Review",
"Conversation","Introduce yourself","Expressive reading","Explain an idea","Nervous speech","Performance","Finale"
];
const regions = ["Mouth Mechanics Workshop","Sound Forge","Rhythm Path","Confidence Stage"];

let state = JSON.parse(localStorage.getItem("aqState")||"null") || {
  onboarded:false,name:"Traveler",difficulty:"Calm",xp:0,streak:0,completed:[],ratings:{},recordings:{},
  settings:{font:16,volume:1,reducedMotion:false,contrast:"standard"},lastPlayed:null
};
let currentView="home", session=null, timerId=null, beatId=null, mediaRecorder=null, chunks=[], currentAudioURL=null;

function save(){localStorage.setItem("aqState",JSON.stringify(state));updateHeader()}
function updateHeader(){document.getElementById("headerXP").textContent=`${state.xp} XP`}
function setView(v){currentView=v;document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===v));render()}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>setView(b.dataset.view));

function render(){
 applySettings();
 const root=document.getElementById("view");
 if(currentView==="home") root.innerHTML=homeHTML();
 if(currentView==="progress") root.innerHTML=progressHTML();
 if(currentView==="settings") root.innerHTML=settingsHTML();
 bind();
}
function homeHTML(){
 const pct=Math.round(state.completed.length/28*100);
 return `
 <section class="hero">
  <p class="muted">Welcome back, ${escapeHTML(state.name)}.</p>
  <h1>Restore the world<br>with your voice.</h1>
  <p class="muted">Complete one focused 9-minute session today.</p>
  <div class="progress"><div style="width:${pct}%"></div></div>
  <div class="stats">
   <div class="stat"><b>${state.completed.length}/28</b><small>days restored</small></div>
   <div class="stat"><b>${state.streak}</b><small>day streak</small></div>
   <div class="stat"><b>${state.xp}</b><small>experience points</small></div>
  </div>
 </section>
 ${regions.map((r,ri)=>{
  const start=ri*7;
  return `<section class="region">
   <div class="region-title"><div><h3>Region ${ri+1}</h3><h2>${r}</h2></div><span class="pill">${state.completed.filter(d=>d>start&&d<=start+7).length}/7</span></div>
   <div class="day-grid">${topics.slice(start,start+7).map((t,i)=>{
    const day=start+i+1, ready=day<=3, done=state.completed.includes(day), current=day===Math.min(28,state.completed.length+1);
    return `<button class="day ${!ready?'locked':''} ${done?'done':''} ${current?'current':''}" data-day="${day}">
      <b>${day}</b><small>${t}</small>
    </button>`
   }).join("")}</div>
  </section>`
 }).join("")}`;
}
function progressHTML(){
 return `<section class="hero"><h1>Your voice archive.</h1><p class="muted">Recordings remain on this device for the current session only in this prototype. Ratings and progress are stored locally.</p></section>
 <section class="card"><h2>Milestones</h2>
 ${[1,7,14,21,28].map(d=>`<div class="section-item"><div><strong>Day ${d} recording</strong><small>${state.completed.includes(d)?"Completed":"Not yet completed"}</small></div><span>${state.completed.includes(d)?"✦":"○"}</span></div>`).join("")}
 </section>
 <section class="card"><h2>Self-ratings</h2>
 ${Object.keys(state.ratings).length?Object.entries(state.ratings).map(([d,r])=>`<div class="section-item"><div><strong>Day ${d}</strong><small>Clarity ${r.clarity}/5 · Comfort ${r.comfort}/5 · Confidence ${r.confidence}/5</small></div></div>`).join(""):"<p class='muted'>Complete a session to begin your archive.</p>"}
 </section>`;
}
function settingsHTML(){
 return `<section class="hero"><h1>Settings</h1><p class="muted">Adjust the training experience to fit you.</p></section>
 <section class="card">
  <label>Difficulty</label><select id="settingDifficulty"><option ${state.difficulty==="Calm"?"selected":""}>Calm</option><option ${state.difficulty==="Confident"?"selected":""}>Confident</option><option ${state.difficulty==="Performer"?"selected":""}>Performer</option></select>
  <label>Text size: <span id="fontVal">${state.settings.font}px</span></label><input id="fontRange" type="range" min="14" max="22" value="${state.settings.font}">
  <label>Example audio volume</label><input id="volumeRange" type="range" min="0" max="1" step=".1" value="${state.settings.volume}">
  <label><input id="reducedMotion" type="checkbox" ${state.settings.reducedMotion?"checked":""}> Reduce animation</label>
  <label>Contrast</label><select id="contrast"><option value="standard" ${state.settings.contrast==="standard"?"selected":""}>Standard</option><option value="high" ${state.settings.contrast==="high"?"selected":""}>High contrast</option></select>
  <div class="row" style="margin-top:18px"><button class="danger" id="resetBtn">Reset all progress</button></div>
 </section>`;
}
function bind(){
 document.querySelectorAll("[data-day]").forEach(btn=>btn.onclick=()=>{
  const d=+btn.dataset.day;
  if(d>3){alert("This day is mapped and ready for future content. Days 1–3 are fully playable in this prototype.");return}
  openDay(d);
 });
 const diff=document.getElementById("settingDifficulty"); if(diff) diff.onchange=e=>{state.difficulty=e.target.value;save()};
 const fr=document.getElementById("fontRange"); if(fr) fr.oninput=e=>{state.settings.font=+e.target.value;document.getElementById("fontVal").textContent=e.target.value+"px";save();render()};
 const vr=document.getElementById("volumeRange"); if(vr) vr.oninput=e=>{state.settings.volume=+e.target.value;save()};
 const rm=document.getElementById("reducedMotion"); if(rm) rm.onchange=e=>{state.settings.reducedMotion=e.target.checked;save();applySettings()};
 const ct=document.getElementById("contrast"); if(ct) ct.onchange=e=>{state.settings.contrast=e.target.value;save();applySettings()};
 const rb=document.getElementById("resetBtn"); if(rb) rb.onclick=()=>{if(confirm("Reset all Articulation Quest progress?")){localStorage.removeItem("aqState");location.reload()}};
}
function openDay(day){
 session={day,step:0,ratings:{clarity:3,comfort:3,difficulty:3,confidence:3}};
 renderSession();
}
const steps=[
 ["Wake-Up",60],["Sound Training",120],["Precision Challenge",120],
 ["Rhythm & Pacing",120],["Final Performance",60],["Reflection & Reward",60]
];
function renderSession(){
 const c=dayContent[session.day], [name,seconds]=steps[session.step];
 currentView="session"; document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active"));
 document.getElementById("view").innerHTML=`
  <section class="hero"><p class="muted">Day ${session.day} · ${c.region}</p><h1 style="font-size:clamp(2rem,9vw,4rem)">${c.title}</h1><div class="progress"><div style="width:${session.step/6*100}%"></div></div></section>
  <section class="card"><h3>Stage ${session.step+1} of 6</h3><h2>${name}</h2>${stepContent(c)}
   <div class="row" style="margin-top:18px">
    <button class="secondary" id="exitSession">Exit</button>
    ${session.step<5?`<button class="primary" id="startTimer">Start ${Math.ceil(seconds/60)}-minute stage</button>`:`<button class="primary" id="completeDay">Complete Day</button>`}
   </div>
  </section>`;
 document.getElementById("exitSession").onclick=()=>{stopAll();currentView="home";render()};
 const st=document.getElementById("startTimer");if(st) st.onclick=()=>startTimer(seconds);
 const cd=document.getElementById("completeDay");if(cd) cd.onclick=completeDay;
 bindRecorder();bindRatings();bindSpeak();bindBeat();
}
function stepContent(c){
 switch(session.step){
  case 0:return `<p class="muted">Move gently. Stop if anything hurts.</p><div class="exercise-box">${c.warmup.map((x,i)=>`<p><b>${i+1}.</b> ${x}</p>`).join("")}</div><div class="timer" id="timer">1:00</div>`;
  case 1:return `<p>Target: <span class="target">${c.target}</span></p><h3>Syllables</h3><div class="words">${c.syllables.map(w=>`<span class="word">${w}</span>`).join("")}</div><h3 style="margin-top:18px">Practice words</h3><div class="words">${c.words.map(w=>`<span class="word">${w}</span>`).join("")}</div><button class="secondary speakBtn" data-speak="${c.words.join(", ")}" style="margin-top:15px">Hear an example</button><div class="timer" id="timer">2:00</div>`;
  case 2:return `<p class="muted">Read slowly once. Repeat with a natural pace.</p><div class="exercise-box">${c.sentences.map(s=>`<p>${highlight(s,c.target)}</p>`).join("")}</div><button class="secondary speakBtn" data-speak="${c.sentences.join(" ")}">Replay example</button><div class="recorder" style="margin-top:16px"><button id="recordBtn" class="primary">Start recording</button><div class="record-status" id="recordStatus"></div><audio id="playback" controls class="hidden"></audio></div><div class="timer" id="timer">2:00</div>`;
  case 3:return `<p>Speak with the pulse:</p><div class="exercise-box"><h2 style="text-align:center">${c.rhythm}</h2><div class="beatline">${[0,1,2,3].map(i=>`<span class="beat"></span>`).join("")}</div><button class="secondary" id="beatBtn">Start rhythm guide</button></div><div class="timer" id="timer">2:00</div>`;
  case 4:return `<div class="row">${["Calm","Confident","Performer"].map(d=>`<button class="${state.difficulty===d?"primary":"secondary"} diffBtn" data-diff="${d}">${d}</button>`).join("")}</div><div class="exercise-box"><p id="performanceText">${c.passages[state.difficulty]}</p></div><button class="secondary speakBtn" data-speak="${c.passages[state.difficulty]}">Hear example</button><div class="recorder" style="margin-top:16px"><button id="recordBtn" class="primary">Record performance</button><div class="record-status" id="recordStatus"></div><audio id="playback" controls class="hidden"></audio></div><p class="muted"><b>Bonus:</b> ${c.tongue}</p><div class="timer" id="timer">1:00</div>`;
  case 5:return `<p>${c.reflection}</p>${ratingHTML("clarity","Clarity")}${ratingHTML("comfort","Comfort")}${ratingHTML("difficulty","Difficulty")}${ratingHTML("confidence","Confidence")}<div class="exercise-box"><b>Guide feedback</b><p>${c.feedback}</p></div>`;
 }
}
function ratingHTML(key,label){return `<label>${label}</label><div class="rating" data-rating="${key}">${[1,2,3,4,5].map(n=>`<button class="${session.ratings[key]===n?"selected":""}" data-score="${n}">${n}</button>`).join("")}</div>`}
function bindRatings(){document.querySelectorAll(".rating").forEach(g=>g.querySelectorAll("button").forEach(b=>b.onclick=()=>{session.ratings[g.dataset.rating]=+b.dataset.score;renderSession()}))}
function bindSpeak(){document.querySelectorAll(".speakBtn").forEach(b=>b.onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.speak);u.rate=.82;u.volume=state.settings.volume;speechSynthesis.speak(u)})}
function bindBeat(){
 document.querySelectorAll(".diffBtn").forEach(b=>b.onclick=()=>{state.difficulty=b.dataset.diff;save();renderSession()})
 const btn=document.getElementById("beatBtn");if(!btn)return;
 btn.onclick=()=>{clearInterval(beatId);let i=0,beats=[...document.querySelectorAll(".beat")];beats.forEach(x=>x.classList.remove("active"));beats[0].classList.add("active");beatId=setInterval(()=>{beats.forEach(x=>x.classList.remove("active"));i=(i+1)%beats.length;beats[i].classList.add("active")},650)}
}
function startTimer(total){
 const el=document.getElementById("timer"); let left=total; document.getElementById("startTimer").disabled=true;
 clearInterval(timerId); timerId=setInterval(()=>{left--;el.textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;
  if(left<=0){clearInterval(timerId);navigator.vibrate?.(120);session.step++;renderSession()}
 },1000)
}
async function bindRecorder(){
 const btn=document.getElementById("recordBtn"); if(!btn)return;
 btn.onclick=async()=>{
  if(mediaRecorder?.state==="recording"){mediaRecorder.stop();btn.textContent="Start recording";return}
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   chunks=[];mediaRecorder=new MediaRecorder(stream);
   mediaRecorder.ondataavailable=e=>chunks.push(e.data);
   mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:"audio/webm"});currentAudioURL=URL.createObjectURL(blob);const a=document.getElementById("playback");a.src=currentAudioURL;a.classList.remove("hidden");document.getElementById("recordStatus").textContent="Recording ready for playback.";stream.getTracks().forEach(t=>t.stop())};
   mediaRecorder.start();btn.textContent="Stop recording";document.getElementById("recordStatus").textContent="Recording… speak naturally.";
  }catch(e){document.getElementById("recordStatus").textContent="Microphone unavailable. You can still complete the exercise using self-rating."}
 }
}
function completeDay(){
 const d=session.day;
 if(!state.completed.includes(d)){state.completed.push(d);state.xp+=100;state.streak+=1}
 state.ratings[d]=session.ratings;state.lastPlayed=new Date().toISOString();save();stopAll();
 document.getElementById("view").innerHTML=`<section class="hero"><h3>Day ${d} restored</h3><h1>+100 XP</h1><p>${dayContent[d].feedback}</p><div class="row"><button class="primary" id="returnMap">Return to map</button></div></section>`;
 document.getElementById("returnMap").onclick=()=>{currentView="home";render()}
}
function stopAll(){clearInterval(timerId);clearInterval(beatId);speechSynthesis.cancel();if(mediaRecorder?.state==="recording")mediaRecorder.stop()}
function applySettings(){
 document.documentElement.style.setProperty("--font",state.settings.font+"px");
 if(state.settings.contrast==="high"){document.documentElement.style.setProperty("--muted","#e9ebff");document.documentElement.style.setProperty("--border","rgba(255,255,255,.28)")}else{document.documentElement.style.setProperty("--muted","#b9bfd9");document.documentElement.style.setProperty("--border","rgba(255,255,255,.1)")}
 document.documentElement.style.scrollBehavior=state.settings.reducedMotion?"auto":"smooth";
}
function highlight(s,target){
 const letters=target.match(/[A-Z]+/g)||[];
 let out=escapeHTML(s);
 letters.forEach(l=>{if(l.length===1)out=out.replace(new RegExp(`(${l})`,"gi"),'<span class="target">$1</span>')});
 return out
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.getElementById("startQuest").onclick=()=>{
 state.name=document.getElementById("playerName").value.trim()||"Traveler";
 state.difficulty=document.getElementById("difficulty").value;state.onboarded=true;save();
 document.getElementById("onboarding").classList.remove("open");render()
};
if(!state.onboarded)document.getElementById("onboarding").classList.add("open");
updateHeader();render();
