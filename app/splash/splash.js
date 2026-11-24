/* Tazvera wallet · splash.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Opening animation: shown once per browser session (not again after every reload or update), never blocks the app, skipped with a tap or "reduce motion". */
(function(){var sp=document.getElementById("splash");if(!sp)return;try{if(sessionStorage.getItem("tz_splash_seen")){sp.parentNode&&sp.parentNode.removeChild(sp);return}sessionStorage.setItem("tz_splash_seen","1")}catch(e){}
 var lang="en";try{lang=JSON.parse(localStorage.getItem("cp3_lang")||'"en"')}catch(e){}
 var tag=document.getElementById("spTag");if(tag&&lang==="hi")tag.textContent="आपकी चाबी · आपका क्रिप्टो";
 var done=false;function out(){if(done)return;done=true;sp.classList.add("out");setTimeout(function(){if(sp.parentNode)sp.parentNode.removeChild(sp)},520)}
 var calm=false;try{calm=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}if(calm)sp.classList.add("calm");
 sp.addEventListener("pointerdown",out);setTimeout(out,calm?1400:2700)})();
