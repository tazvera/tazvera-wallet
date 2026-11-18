/* Tazvera wallet · app/js/features/session-and-copy.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Stay unlocked on refresh (only inside the auto-lock time) and honest copying. / रीफ़्रेश पर दोबारा PIN नहीं (auto-lock समय के अंदर) और सही कॉपी। */
/* ----- refresh without the PIN, but only inside the auto-lock time ----- */
function markAct(){try{if(sessionStorage.getItem("v2_unl")==="1")sessionStorage.setItem("v2_act",String(Date.now()))}catch(e){}}
setInterval(function(){if(!document.hidden)markAct()},15000);window.addEventListener("pagehide",markAct);document.addEventListener("click",markAct,true);

/* ----- copying that tells the truth: real copy, a second way, or "copy it yourself" ----- */
Object.assign(L.en,{cpManT:"Copy it yourself",cpManS:"This browser did not allow copying. Press and hold the text below, then choose Copy."});
Object.assign(L.hi,{cpManT:"ख़ुद कॉपी करें",cpManS:"इस ब्राउज़र ने कॉपी नहीं करने दिया। नीचे के अक्षर दबाकर रखिए, फिर Copy चुनिए।"});
function manualCopy(txt){sheet('<div class="grab"></div><div class="sht">'+esc(t("cpManT"))+'</div><p class="note2" style="margin:6px 0 10px">'+esc(t("cpManS"))+'</p><textarea readonly class="cpbox" id="cpBox">'+esc(txt)+'</textarea>');var cb=$("cpBox");if(cb){cb.onfocus=cb.onclick=function(){cb.select()}}}
function copyText(txt){txt=String(txt==null?"":txt);
 function second(){var ok=false;try{var ta=document.createElement("textarea");ta.value=txt;ta.setAttribute("readonly","");ta.style.cssText="position:fixed;top:0;left:0;opacity:0;font-size:16px";document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,txt.length);ok=document.execCommand&&document.execCommand("copy");document.body.removeChild(ta)}catch(e){ok=false}
  if(ok)toast(t("copied"));else manualCopy(txt)}
 try{if(navigator.clipboard&&navigator.clipboard.writeText&&window.isSecureContext){navigator.clipboard.writeText(txt).then(function(){toast(t("copied"))},second);return}}catch(e){}
 second()}
