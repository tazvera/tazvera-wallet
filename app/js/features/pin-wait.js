/* Tazvera wallet · app/js/features/pin-wait.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Wrong PIN: wait 30 s, then 1, 5, 15 minutes. / ग़लत PIN पर इंतज़ार। */
/* ----- wrong PIN: after 5 wrong tries, wait 30 s, then 1, 5, 15 minutes ----- */
var PINF="tz_pinfail",PINSTEP=[30,60,300,900],PINMEM={n:0,u:0},PINLOCAL=true,PINSESSION=true;
/* Mirror the throttle in localStorage and sessionStorage. This survives accidental
   removal of only localStorage during the current tab session; clearing all site
   data or editing browser storage can still reset a client-side throttle. */
function pinRead(store){
 try{var raw=store.getItem(PINF),o=JSON.parse(raw||"null");if(o&&Number.isSafeInteger(o.n)&&o.n>=0&&Number.isFinite(o.u)&&o.u>=0)return{n:Math.min(o.n,8),u:o.u}}
 catch(e){}
 return null
}
function pinSt(){
 var a=PINLOCAL?pinRead(localStorage):null,b=PINSESSION?pinRead(sessionStorage):null;
 var o=a&&b?(a.n>b.n||a.n===b.n&&a.u>=b.u?a:b):(a||b);
 if(o)PINMEM={n:o.n,u:o.u};
 return PINMEM
}
function pinWrite(o){
 var v=JSON.stringify(o);
 if(PINLOCAL){try{localStorage.setItem(PINF,v)}catch(e){PINLOCAL=false}}
 if(PINSESSION){try{sessionStorage.setItem(PINF,v)}catch(e){PINSESSION=false}}
}
function pinWait(){return Math.max(0,pinSt().u-Date.now())}
function pinFail(){var o=pinSt();o.n=Math.min(8,o.n+1);if(o.n>=5)o.u=Date.now()+PINSTEP[Math.min(o.n-5,PINSTEP.length-1)]*1000;PINMEM={n:o.n,u:o.u};pinWrite(o)}
function pinOk(){PINMEM={n:0,u:0};if(PINLOCAL){try{localStorage.removeItem(PINF)}catch(e){PINLOCAL=false}}if(PINSESSION){try{sessionStorage.removeItem(PINF)}catch(e){PINSESSION=false}}}
function waitTxt(ms){var sec=Math.ceil(ms/1000);return sec>=60?Math.ceil(sec/60)+(S.lang==="hi"?" मिनट":" min"):sec+(S.lang==="hi"?" सेकंड":" s")}
(function(){var bEn=L.en.pinBad,bHi=L.hi.pinBad;
 try{Object.defineProperty(L.en,"pinBad",{configurable:true,get:function(){var w=pinWait();return w?"Too many wrong PINs. Wait "+waitTxt(w)+", then try again.":bEn}});
  Object.defineProperty(L.hi,"pinBad",{configurable:true,get:function(){var w=pinWait();return w?"बहुत बार ग़लत PIN। "+waitTxt(w)+" रुककर फिर कोशिश कीजिए।":bHi}})}catch(e){}
 function guard(fn){return async function(){if(pinWait()>0)throw new Error("pin-wait");try{var r=await fn.apply(this,arguments);pinOk();return r}catch(e){pinFail();throw e}}}
 if(window.CPW){CPW.unlock=guard(CPW.unlock);CPW.phrase=guard(CPW.phrase)}})();
