/* Tazvera wallet · app/js/features/idle-lock.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Lock by itself when nobody touches the app. / कुछ न छूने पर अपने-आप ताला। */
/* Check again immediately when a background tab becomes visible; timers may be throttled while hidden. */
(function(){
 var last=Date.now();
 /* A sheet that is open (PIN or signing) is not closed by the normal idle timer, but after this much time with no touch the wallet locks anyway. */
 var SHEET_IDLE_MS=120000;
 function act(){last=Date.now()}
 function lockIfIdle(){
  if(S.mode!=="inapp"||!S.addr)return;
  var open=false;try{open=sessionStorage.getItem("v2_unl")==="1"}catch(e){}
  if(!open)return;
  var idle=Date.now()-last;
  if(typeof SLOCK!=="undefined"&&SLOCK){if(idle>SHEET_IDLE_MS)lockNow(true);return}
  if(idle>amin()*60000)lockNow(false);
 }
 function lockNow(sheetOpen){
  /* A signing request is rejected through its own Reject button, so the site gets the normal "rejected" answer. */
  if(sheetOpen){try{var no=document.getElementById("sgNo");if(no)no.click()}catch(e){}}
  try{CPW.lock();sessionStorage.removeItem("v2_unl");sessionStorage.removeItem("v2_act")}catch(e){}
  closeSheet();lockScreen();last=Date.now();
 }
 ["pointerdown","keydown","wheel","touchstart"].forEach(function(ev){document.addEventListener(ev,act,{capture:true,passive:true})});
 setInterval(function(){if(!document.hidden)lockIfIdle()},15000);
 document.addEventListener("visibilitychange",function(){if(!document.hidden)lockIfIdle()});
})();
