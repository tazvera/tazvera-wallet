/* Tazvera wallet · 27-ai.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- "Tazvera Sahayyak" AI helper: floating button + chat sheet ----------
   Talks only to /api/ai (the Gemini key stays on the server). Sends no address, balance, PIN or words.
   Chat is kept in memory only, never saved. Model text is always shown with textContent (never as HTML). */
var AI={msgs:[],busy:false,on:null,tts:null,aud:null};
var AI_TX={en:{name:"Tazvera Assistant",hi:"Hello! I am the Tazvera Assistant. Ask me anything about Tazvera, in any language: English, हिंदी, मराठी…",ph:"Type your question",send:"Send",
 warn:"AI can make mistakes. Never type your 12 words, PIN or private key here.",think:"Writing an answer…",
 eSecret:"This looks like your 12 words or a private key. Never type them here. It was not sent.",
 eOff:"The assistant is not available right now. Write to contact@tazvera.com.",eSlow:"Too many questions. Please try again in a few minutes.",eNet:"No answer received. Please try again.",
 listen:"Listen ▶",stopb:"Stop ■",eVoice:"Voice not available",
 q:["How do I send money?","What is the network fee?","What are the 12 words?","What is TZV?"]},
 hi:{name:"Tazvera सहायक",hi:"नमस्ते! मैं Tazvera सहायक हूँ। Tazvera के बारे में कुछ भी पूछिए, किसी भी भाषा में: हिंदी, मराठी, English…",ph:"अपना सवाल लिखिए",send:"भेजें",
 warn:"AI ग़लती कर सकता है। अपने 12 शब्द, PIN या प्राइवेट की यहाँ कभी न लिखें।",think:"जवाब लिख रहा हूँ…",
 eSecret:"यह आपके 12 शब्द या चाबी जैसा लगता है। इसे यहाँ कभी न लिखें। यह भेजा नहीं गया।",
 eOff:"सहायक अभी उपलब्ध नहीं है। contact@tazvera.com पर लिखिए।",eSlow:"बहुत सवाल हो गए। थोड़ी देर बाद फिर कोशिश कीजिए।",eNet:"जवाब नहीं मिला। फिर कोशिश कीजिए।",
 listen:"सुनें ▶",stopb:"रोकें ■",eVoice:"आवाज़ उपलब्ध नहीं",
 q:["पैसे कैसे भेजें?","नेटवर्क फ़ीस क्या है?","12 शब्द क्या हैं?","TZV क्या है?"]}};
var AI_T={};function aiLang(){var L2=(S.lang==="hi")?"hi":"en";var src=AI_TX[L2];for(var k in src)AI_T[k]=src[k]}aiLang();
var AI_SVG='<svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 30C14 19 22 10 32 10C42 10 50 19 50 30" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" fill="none"/><rect x="8" y="26" width="6" height="15" rx="3" fill="#38BDF8"/><rect x="50" y="26" width="6" height="15" rx="3" fill="#38BDF8"/><path d="M52 38L44 48H36" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="35" cy="48" r="2.5" fill="#F59E0B"/><rect x="16" y="18" width="32" height="28" rx="9" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/><circle cx="26" cy="28" r="3" fill="#38BDF8"/><circle cx="38" cy="28" r="3" fill="#38BDF8"/><line x1="26" y1="37" x2="38" y2="37" stroke="#64748B" stroke-width="2" stroke-linecap="round"/></svg>';
/* same test as the server: 12+ plain words in a row, or 64 hex characters */
function aiSecret(s){if(/(?:0x)?[0-9a-fA-F]{64}/.test(s))return true;var w=s.toLowerCase().replace(/[^a-z\s]/g," ").split(/\s+/).filter(Boolean),run=0;for(var i=0;i<w.length;i++){if(/^[a-z]{3,8}$/.test(w[i])){run++;if(run>=12)return true}else run=0}return false}
/* ---- Marathi voice (api/tts.js). Female is the default; the choice is remembered on this phone only. ---- */
function aiGender(){return "FEMALE"}
function aiSetGender(g){try{localStorage.setItem("tz_aivoice",g)}catch(e){}[].forEach.call(document.querySelectorAll("#sheet [data-aig]"),function(b){var on=b.getAttribute("data-aig")===g;b.style.borderColor=on?"var(--green)":"transparent";b.style.color=on?"var(--green)":"var(--tx)";b.setAttribute("aria-pressed",on)})}
function aiStop(){if(AI.aud){try{AI.aud.pause()}catch(e){}AI.aud=null}[].forEach.call(document.querySelectorAll("#aiLog [data-aispk]"),function(b){b.textContent=AI_T.listen})}
function aiSpeak(btn,text){if(AI.aud&&btn.getAttribute("data-on")==="1"){aiStop();btn.setAttribute("data-on","0");return}aiStop();btn.setAttribute("data-on","0");btn.textContent="…";
 fetch("/api/tts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text,gender:aiGender()})}).then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})}).then(function(x){
  if(x.s!==200||!x.j||typeof x.j.audio!=="string"){btn.textContent=AI_T.eVoice;setTimeout(function(){btn.textContent=AI_T.listen},2500);return}
  var a=new Audio("data:audio/mpeg;base64,"+x.j.audio);AI.aud=a;btn.setAttribute("data-on","1");btn.textContent=AI_T.stopb;
  a.onended=function(){if(AI.aud===a)AI.aud=null;btn.setAttribute("data-on","0");btn.textContent=AI_T.listen};a.ontimeupdate=function(){if(!document.getElementById("aiLog")){a.pause();AI.aud=null}};
  var pr=a.play();if(pr&&pr.catch)pr.catch(function(){btn.setAttribute("data-on","0");btn.textContent=AI_T.listen})}).catch(function(){btn.textContent=AI_T.listen})}
function aiBtn(d,text){if(!AI.tts||!d)return;var b=document.createElement("button");b.type="button";b.setAttribute("data-aispk","1");b.textContent=AI_T.listen;
 b.style.cssText="display:block;margin-top:6px;padding:4px 10px;border-radius:12px;background:var(--soft);color:var(--green);font-size:12.5px;font-weight:600";b.onclick=function(){aiSpeak(b,text)};d.appendChild(b)}
function aiCheck(cb){if(AI.on!==null)return cb(AI.on);fetch("/api/ai",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){AI.on=!!(j&&j.enabled);cb(AI.on)}).catch(function(){cb(false)})}
var AI_FLOAT=false; /* the bot opens from the Helper button in the Home header; set true to also show a floating button */
function aiOpen(){if(AI.on===false)helpSheet();else aiSheet()}
function aiFab(){if(!AI_FLOAT)return;var f=document.getElementById("aiFab"),show=!!document.querySelector("#app .nav")&&AI.on!==false;
 if(!f){if(!show)return;f=document.createElement("button");f.id="aiFab";f.type="button";f.setAttribute("aria-label",AI_T.name);f.title=AI_T.name;f.innerHTML=AI_SVG;
  f.style.cssText="position:fixed;right:14px;bottom:calc(100px + env(safe-area-inset-bottom,0px));width:40px;height:40px;padding:0;border:0;background:none;z-index:30;cursor:pointer;-webkit-tap-highlight-color:transparent";
  f.onclick=aiSheet;document.body.appendChild(f);aiCheck(function(on){if(!on)f.style.display="none"})}
 else f.style.display=show&&AI.on!==false?"":"none"}
function aiAdd(role,text,err){var log=document.getElementById("aiLog");if(!log)return null;var d=document.createElement("div");
 d.style.cssText="max-width:86%;margin:8px 0;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;"+(role==="user"?"margin-left:auto;background:var(--tx);color:var(--bg)":"background:var(--bg);color:"+(err?"var(--red,#DC2626)":"var(--tx)"));
 d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function aiAsk(text){text=String(text||"").trim().slice(0,500);if(!text||AI.busy)return;var inp=document.getElementById("aiIn");
 if(aiSecret(text)){aiAdd("model",AI_T.eSecret,true);if(inp)inp.value="";return}
 AI.msgs.push({role:"user",text:text});aiAdd("user",text);if(inp)inp.value="";AI.busy=true;var w=aiAdd("model",AI_T.think);
 fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:AI.msgs.slice(-8),lang:S.lang==="hi"?"hi":"en"})}).then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})}).then(function(x){AI.busy=false;
  if(x.s===200&&x.j&&typeof x.j.text==="string"){AI.msgs.push({role:"model",text:x.j.text});if(w){w.textContent=x.j.text;aiBtn(w,x.j.text)}}
  else{AI.msgs.pop();var m=x.s===503?AI_T.eOff:x.s===429?AI_T.eSlow:x.s===422?AI_T.eSecret:AI_T.eNet;if(w){w.textContent=m;w.style.color="var(--red,#DC2626)"}}
  var log=document.getElementById("aiLog");if(log)log.scrollTop=log.scrollHeight}).catch(function(){AI.busy=false;AI.msgs.pop();if(w){w.textContent=AI_T.eNet;w.style.color="var(--red,#DC2626)"}})}
function aiSheet(){aiLang();var chips=AI_T.q.map(function(q,i){return '<button data-aiq="'+i+'" style="padding:8px 12px;border-radius:16px;background:var(--soft);font-size:13px;font-weight:600;color:var(--tx)">'+esc(q)+'</button>'}).join("");
 sheet('<div class="grab"></div><button class="ib" data-sx="1" aria-label="back" style="position:absolute;left:16px;top:14px">'+ic("back",20)+'</button><div class="sht">'+esc(AI_T.name)+'</div>'+
  '<div id="aiLog" style="height:min(46vh,360px);overflow-y:auto;padding:2px 2px 6px"></div>'+
  '<div class="faq" style="margin-top:4px">'+chips+'</div>'+
  '<div style="display:flex;gap:8px;margin-top:10px"><input id="aiIn" maxlength="500" autocomplete="off" placeholder="'+esc(AI_T.ph)+'" style="flex:1;min-width:0;padding:12px 14px;border-radius:16px;border:1px solid var(--line);background:var(--card);color:var(--tx);font-size:15px"><button id="aiGo" style="padding:0 16px;border-radius:16px;background:var(--tx);color:var(--bg);font-weight:600">'+esc(AI_T.send)+'</button></div>'+
  '<div class="note2">'+esc(AI_T.warn)+'</div>');
 AI.msgs.length?AI.msgs.forEach(function(m){var d=aiAdd(m.role,m.text);if(m.role==="model")aiBtn(d,m.text)}):aiAdd("model",AI_T.hi);
 var go=document.getElementById("aiGo"),inp=document.getElementById("aiIn");go.onclick=function(){aiAsk(inp.value)};inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();aiAsk(inp.value)}};
 
 [].forEach.call(document.querySelectorAll("#sheet [data-aiq]"),function(b){b.onclick=function(){aiAsk(AI_T.q[+b.getAttribute("data-aiq")])}})}
aiCheck(function(){});fetch("/api/tts",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){AI.tts=!!(j&&j.enabled)}).catch(function(){AI.tts=false});
(function(){var a=document.getElementById("app");if(!a||!window.MutationObserver)return;var t=null;new MutationObserver(function(){clearTimeout(t);t=setTimeout(aiFab,60)}).observe(a,{childList:true});setTimeout(aiFab,400)})();
