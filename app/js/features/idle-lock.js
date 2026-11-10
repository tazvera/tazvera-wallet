/* Tazvera wallet · app/js/features/idle-lock.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Lock by itself when nobody touches the app. / कुछ न छूने पर अपने-आप ताला। */
/* ----- lock by itself when nobody touches the app (computers keep the tab open for hours) ----- */
(function(){var last=Date.now();function act(){last=Date.now()}
 ["pointerdown","keydown","wheel","touchstart"].forEach(function(ev){document.addEventListener(ev,act,{capture:true,passive:true})});
 setInterval(function(){if(S.mode!=="inapp"||!S.addr||document.hidden)return;if(typeof SLOCK!=="undefined"&&SLOCK)return;
  var open=false;try{open=sessionStorage.getItem("v2_unl")==="1"}catch(e){}if(!open)return;
  if(Date.now()-last>amin()*60000){try{CPW.lock();sessionStorage.removeItem("v2_unl");sessionStorage.removeItem("v2_act")}catch(e){}closeSheet();lockScreen();last=Date.now()}},15000)})();