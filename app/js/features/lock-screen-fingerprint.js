/* Tazvera wallet · app/js/features/lock-screen-fingerprint.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Lock screen: fingerprint and PIN do not clash. / लॉक-स्क्रीन पर फ़िंगरप्रिंट और PIN। */
/* ----- lock screen: fingerprint and PIN no longer get in each other's way -----
   The fingerprint prompt opens by itself only once, only after the opening animation, and never if you have already
   started typing your PIN. The "Use fingerprint" button stays on the screen while you type. */
(function(){var _ls=lockScreen;lockScreen=function(){if(!(typeof BIO!=="undefined"&&BIO.on()))return _ls();
 var typed=false,busy=false;
 pinScreen(t("lockT"),t("lockS"),async function(p,fail){try{await CPW.unlock(p);try{sessionStorage.setItem("v2_unl","1")}catch(e){}if(typeof tzSound==="function")tzSound("unlock");render();load()}catch(e){fail(t("pinBad"))}});
 function onLock(){return !!document.querySelector("#app [data-pk], #app #lp")}
 function go2(){if(busy||!onLock())return;busy=true;BIO.unlock().then(function(){try{sessionStorage.setItem("v2_unl","1")}catch(e){}if(typeof tzSound==="function")tzSound("unlock");render();load()}).catch(function(){}).then(function(){busy=false})}
 function addBtn(){if(!onLock()||document.getElementById("fpBtn"))return;var b=document.createElement("button");b.id="fpBtn";b.type="button";b.className="btnw";b.style.cssText="width:auto;padding:0 18px;height:44px;margin:14px auto 0;font-size:14px;gap:8px";b.innerHTML=ic("shield",18)+esc(t("useFp"));b.onclick=function(){typed=true;go2()};var pw=document.querySelector("#app .pinw");if(pw)pw.after(b)}
 addBtn();var app=document.getElementById("app"),mo=new MutationObserver(function(){if(!onLock()){mo.disconnect();return}addBtn()});mo.observe(app,{childList:true,subtree:true});
 function k(e){if(e.target.closest&&e.target.closest("[data-pk],#lp,#lpGo")){typed=true;document.removeEventListener("pointerdown",k,true)}}document.addEventListener("pointerdown",k,true);
 setTimeout(function(){if(!typed&&!document.hidden)go2()},document.getElementById("splash")?2600:400)}})();
