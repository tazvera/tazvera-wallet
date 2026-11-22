/* Tazvera wallet · splash.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Opening animation: shown once when the app opens, never blocks the app, not skipped by taps; shorter with "reduce motion". */
(function(){var sp=document.getElementById("splash");if(!sp)return;
 var lang="en";try{lang=JSON.parse(localStorage.getItem("cp3_lang")||'"en"')}catch(e){}
 var tag=document.getElementById("spTag");if(tag&&lang==="hi")tag.textContent="आपकी चाबी · आपका क्रिप्टो";
 var done=false;function out(){if(done)return;done=true;sp.classList.add("out");setTimeout(function(){if(sp.parentNode)sp.parentNode.removeChild(sp)},520)}
 var calm=false;try{calm=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}if(calm)sp.classList.add("calm");
 setTimeout(out,calm?1400:2700)})();
