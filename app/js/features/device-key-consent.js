/* Tazvera wallet · app/js/features/device-key-consent.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Consent for the device key. This step only asks and records the answer. No key is created or used here.
   / डिवाइस-की की सहमति। इस चरण में सिर्फ़ पूछा और जवाब दर्ज होता है, कोई कुंजी नहीं बनती। */

Object.assign(L.en,{
 dkNavT:"Security key",
 dkOff:"Not on yet. Your wallet is protected by PIN only.",
 dkOn:"You agreed. The key is not added yet.",
 dkQ:"After this, your PIN alone will not be enough. If you change this phone or clear the browser data, your wallet comes back only with your 12 words. Do you have your 12 words safe?",
 dkYes:"Yes, I have them. Turn it on",
 dkNo:"Not now",
 dkNeedBk:"First, check your 12-word backup once. Then we will ask again.",
 dkBk:"Check my backup",
 dkDoneT:"Recorded"
});
Object.assign(L.hi,{
 dkNavT:"सुरक्षा कुंजी",
 dkOff:"अभी चालू नहीं है। आपका वॉलेट सिर्फ़ PIN से सुरक्षित है।",
 dkOn:"आपने सहमति दी है। कुंजी अभी नहीं जुड़ी है।",
 dkQ:"इसके बाद आपका PIN अकेला काफ़ी नहीं होगा। अगर यह फ़ोन बदला या ब्राउज़र का डेटा साफ़ हुआ, तो वॉलेट सिर्फ़ आपके 12 शब्दों से वापस आएगा। क्या आपके पास 12 शब्द सुरक्षित हैं?",
 dkYes:"हाँ, मेरे पास हैं — चालू करें",
 dkNo:"अभी नहीं",
 dkNeedBk:"पहले 12 शब्दों का बैकअप एक बार देख लें। फिर दोबारा पूछेंगे।",
 dkBk:"बैकअप देखें",
 dkDoneT:"दर्ज हो गया"
});

/* the answer is kept per browser: "" (not asked), "on" (agreed), "later" (not now) */
function dkChoice(){return raw("tz_dk_choice","")}
function dkStatus(){var c=dkChoice();return c==="on"?t("dkOn"):t("dkOff")}

/* asked at most once per session, and only for wallets made in this app */
function dkAskOnce(){try{if(S.mode!=="inapp"||dkChoice()||sessionStorage.getItem("tz_dkask"))return;sessionStorage.setItem("tz_dkask","1")}catch(e){return}
 setTimeout(dkSheet,5000)}

function dkSheet(){
 var open=document.getElementById("sheet");if(open&&open.classList.contains("on"))return; /* never replace a sheet the user opened */
 var bk=typeof bkDone==="function"&&bkDone(S.addr);
 var body=bk
  ? '<p class="note2" style="text-align:left;margin:10px 2px 0;line-height:1.55">'+esc(t("dkQ"))+'</p>'+
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px"><button class="btn" data-dkyes="1">'+esc(t("dkYes"))+'</button><button class="btn sec" data-dkno="1">'+esc(t("dkNo"))+'</button></div>'
  : '<p class="note2" style="text-align:left;margin:10px 2px 0;line-height:1.55">'+esc(t("dkNeedBk"))+'</p>'+
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px"><button class="btn" data-dkbk="1">'+esc(t("dkBk"))+'</button><button class="btn sec" data-dkno="1">'+esc(t("dkNo"))+'</button></div>';
 sheet('<div class="grab"></div><div class="sht">'+esc(t("dkNavT"))+'</div>'+body);
}

/* settings row and the answer buttons (delegated, so no change to the main click list) */
document.addEventListener("click",function(e){
 var el=e.target.closest("[data-dk],[data-dkyes],[data-dkno],[data-dkbk]");if(!el)return;
 if(el.hasAttribute("data-dk")){dkSheet();return}
 if(el.hasAttribute("data-dkyes")){rawSet("tz_dk_choice","on");closeSheet();setTimeout(function(){toast(t("dkDoneT"));if(typeof render==="function")render()},250);return}
 if(el.hasAttribute("data-dkno")){if(dkChoice()!=="on")rawSet("tz_dk_choice","later");closeSheet();if(typeof render==="function")setTimeout(render,250);return}
 if(el.hasAttribute("data-dkbk")){closeSheet();setTimeout(function(){if(typeof bkSheet==="function")bkSheet()},250);return}
});
