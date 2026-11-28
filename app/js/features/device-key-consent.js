/* Tazvera wallet · app/js/features/device-key-consent.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Consent for the device key. This step only asks, checks the 12 words, and records the answer.
   No key is created or used here.
   / डिवाइस-की की सहमति। इस चरण में सिर्फ़ पूछा जाता है, 12 शब्द जाँचे जाते हैं और जवाब दर्ज होता है। कोई कुंजी नहीं बनती। */

Object.assign(L.en,{
 dkNavT:"Security key",
 dkOff:"Not on yet. Your wallet is protected by PIN only.",
 dkOn:"You agreed. The key is not added yet.",
 dkQ:"After this, your PIN alone will not be enough. If you change this phone or clear the browser data, your wallet comes back only with your 12 words. Do you have your 12 words safe?",
 dkYes:"Yes, I have them",
 dkNo:"Not now",
 dkNeedBk:"First, check your 12-word backup once. Then we will ask again.",
 dkBk:"Check my backup",
 dkDoneT:"Recorded",
 dkWT:"Enter your 12 words",
 dkWS:"This check happens only on this phone. The words are not saved or sent anywhere.",
 dkWGo:"Check",
 dkWBad:"The words did not match. First check your backup, then come back.",
 dkWWait:"Too many wrong tries. Wait 30 seconds and try again.",
 dkShow:"Show",
 dkHide:"Hide"
});
Object.assign(L.hi,{
 dkNavT:"सुरक्षा कुंजी",
 dkOff:"अभी चालू नहीं है। आपका वॉलेट सिर्फ़ PIN से सुरक्षित है।",
 dkOn:"आपने सहमति दी है। कुंजी अभी नहीं जुड़ी है।",
 dkQ:"इसके बाद आपका PIN अकेला काफ़ी नहीं होगा। अगर यह फ़ोन बदला या ब्राउज़र का डेटा साफ़ हुआ, तो वॉलेट सिर्फ़ आपके 12 शब्दों से वापस आएगा। क्या आपके पास 12 शब्द सुरक्षित हैं?",
 dkYes:"हाँ, मेरे पास हैं",
 dkNo:"अभी नहीं",
 dkNeedBk:"पहले 12 शब्दों का बैकअप एक बार देख लें। फिर दोबारा पूछेंगे।",
 dkBk:"बैकअप देखें",
 dkDoneT:"दर्ज हो गया",
 dkWT:"अपने 12 शब्द डालें",
 dkWS:"यह जाँच सिर्फ़ इसी फ़ोन पर होती है। शब्द कहीं सहेजे या भेजे नहीं जाते।",
 dkWGo:"जाँचें",
 dkWBad:"शब्द मेल नहीं खाए। पहले अपना बैकअप देख लें, फिर दोबारा आएं।",
 dkWWait:"बहुत बार गलत हुआ। 30 सेकंड बाद फिर कोशिश करें।",
 dkShow:"दिखाएँ",
 dkHide:"छिपाएँ"
});

/* the answer is kept per wallet address, per browser: "" (not asked), "on" (agreed), "later" (not now) */
function dkKey(a){return "tz_dk_choice_"+String(a||"").toLowerCase()}
function dkChoice(a){return raw(dkKey(a||S.addr),"")}
function dkStatus(){return dkChoice()==="on"?t("dkOn"):t("dkOff")}

/* asked at most once per session, and only for wallets made in this app */
function dkAskOnce(){try{if(S.mode!=="inapp"||dkChoice()||sessionStorage.getItem("tz_dkask"))return;sessionStorage.setItem("tz_dkask","1")}catch(e){return}
 setTimeout(dkSheet,5000)}

function dkOpen(){var o=document.getElementById("sheet");return !!(o&&o.classList.contains("on"))}

function dkSheet(){
 if(dkOpen())return; /* never replace a sheet the user opened */
 var bk=typeof bkDone==="function"&&bkDone(S.addr);
 var body=bk
  ? '<p class="note2" style="text-align:left;margin:10px 2px 0;line-height:1.55">'+esc(t("dkQ"))+'</p>'+
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px"><button class="btn" data-dkyes="1">'+esc(t("dkYes"))+'</button><button class="btn sec" data-dkno="1">'+esc(t("dkNo"))+'</button></div>'
  : '<p class="note2" style="text-align:left;margin:10px 2px 0;line-height:1.55">'+esc(t("dkNeedBk"))+'</p>'+
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px"><button class="btn" data-dkbk="1">'+esc(t("dkBk"))+'</button><button class="btn sec" data-dkno="1">'+esc(t("dkNo"))+'</button></div>';
 sheet('<div class="grab"></div><div class="sht">'+esc(t("dkNavT"))+'</div>'+body);
}

/* 12 words: typed into one box, checked here, then cleared. They are never stored, logged or sent.
   The check derives the address from the typed words and compares it with this wallet's address. */
var dkFails=0,dkLockUntil=0;
function dkWordsSheet(){
 sheet('<div class="grab"></div><div class="sht">'+esc(t("dkWT"))+'</div>'+
  '<p class="note2" style="text-align:left;margin:6px 2px 0;line-height:1.5">'+esc(t("dkWS"))+'</p>'+
  '<div style="display:flex;gap:8px;margin-top:10px;align-items:stretch"><input id="dkW" type="password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="12 words" style="flex:1;min-width:0;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--tx);font-size:15px"><button type="button" id="dkTog" class="btn sec" style="width:auto;padding:0 14px;white-space:nowrap">'+esc(t("dkShow"))+'</button></div>'+
  '<p id="dkWMsg" class="err" style="min-height:18px;margin:8px 2px 0"></p>'+
  '<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px"><button class="btn" id="dkWGo">'+esc(t("dkWGo"))+'</button><button class="btn sec" data-dkbk="1">'+esc(t("dkBk"))+'</button></div>');
 var go=document.getElementById("dkWGo");if(go)go.onclick=dkCheckWords;
 var tg=document.getElementById("dkTog");if(tg)tg.onclick=dkToggleWords;
}
/* the words are hidden by default; show/hide only changes how the box looks, the check is the same */
function dkToggleWords(){var box=document.getElementById("dkW"),tg=document.getElementById("dkTog");if(!box||!tg)return;var shown=box.type==="text";box.type=shown?"password":"text";tg.textContent=shown?t("dkShow"):t("dkHide")}
function dkMsg(m){var e=document.getElementById("dkWMsg");if(e)e.textContent=m}
function dkCheckWords(){
 var box=document.getElementById("dkW");if(!box)return;
 var typed=box.value;box.value="";
 if(Date.now()<dkLockUntil){dkMsg(t("dkWWait"));return}
 var words=String(typed).trim().toLowerCase().split(/\s+/).filter(Boolean);typed="";
 var ok=false;
 if(words.length===12){try{ok=ethers.Wallet.fromPhrase(words.join(" ")).address.toLowerCase()===String(S.addr||"").toLowerCase()}catch(e){ok=false}}
 words=null;
 if(ok){
  rawSet(dkKey(S.addr),"on");
  if(typeof bkMark==="function")bkMark(S.addr);
  dkFails=0;closeSheet();setTimeout(function(){toast(t("dkDoneT"));if(typeof render==="function")render()},250);return;
 }
 dkFails++;
 if(dkFails>=3){dkFails=0;dkLockUntil=Date.now()+30000;dkMsg(t("dkWWait"));return}
 dkMsg(t("dkWBad"));
}

/* settings row and the answer buttons (delegated, so no change to the main click list) */
document.addEventListener("click",function(e){
 var el=e.target.closest("[data-dk],[data-dkyes],[data-dkno],[data-dkbk]");if(!el)return;
 if(el.hasAttribute("data-dk")){dkSheet();return}
 if(el.hasAttribute("data-dkyes")){dkWordsSheet();return}
 if(el.hasAttribute("data-dkno")){if(dkChoice()!=="on")rawSet(dkKey(S.addr),"later");closeSheet();if(typeof render==="function")setTimeout(render,250);return}
 if(el.hasAttribute("data-dkbk")){closeSheet();setTimeout(function(){if(typeof bkSheet==="function")bkSheet()},250);return}
});
