/* Tazvera wallet · app/js/features/pin-wait.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Wrong PIN: wait 30 s, then 1, 5, 15 minutes. / ग़लत PIN पर इंतज़ार। */
/* ----- wrong PIN: after 5 wrong tries, wait 30 s, then 1, 5, 15 minutes ----- */
var PINF="tz_pinfail",PINSTEP=[30,60,300,900];
function pinSt(){try{var o=JSON.parse(localStorage.getItem(PINF)||"null");if(o&&typeof o.n==="number")return o}catch(e){}return{n:0,u:0}}
function pinWait(){return Math.max(0,pinSt().u-Date.now())}
function pinFail(){var o=pinSt();o.n++;if(o.n>=5){o.u=Date.now()+PINSTEP[Math.min(o.n-5,PINSTEP.length-1)]*1000}try{localStorage.setItem(PINF,JSON.stringify(o))}catch(e){}}
function pinOk(){try{localStorage.removeItem(PINF)}catch(e){}}
function waitTxt(ms){var sec=Math.ceil(ms/1000);return sec>=60?Math.ceil(sec/60)+(S.lang==="hi"?" मिनट":" min"):sec+(S.lang==="hi"?" सेकंड":" s")}
(function(){var bEn=L.en.pinBad,bHi=L.hi.pinBad;
 try{Object.defineProperty(L.en,"pinBad",{configurable:true,get:function(){var w=pinWait();return w?"Too many wrong PINs. Wait "+waitTxt(w)+", then try again.":bEn}});
  Object.defineProperty(L.hi,"pinBad",{configurable:true,get:function(){var w=pinWait();return w?"बहुत बार ग़लत PIN। "+waitTxt(w)+" रुककर फिर कोशिश कीजिए।":bHi}})}catch(e){}
 function guard(fn){return async function(){if(pinWait()>0)throw new Error("pin-wait");try{var r=await fn.apply(this,arguments);pinOk();return r}catch(e){pinFail();throw e}}}
 if(window.CPW){CPW.unlock=guard(CPW.unlock);CPW.phrase=guard(CPW.phrase)}})();
