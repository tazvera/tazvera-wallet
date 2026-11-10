/* Tazvera wallet · app/js/features/sounds.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Gentle sounds for unlock, payment confirmed and money received. / आवाज़ें। */
/* ----- Version 9.4: gentle sounds (made by code, no files, works offline) -----
   Unlock: two soft notes. Payment confirmed: a bright "ting". Money received while the app is open: a warm chime.
   Browsers allow sound only after you touch the screen, so the first touch quietly prepares the sound. Settings → Sounds turns them off. */
Object.assign(L.en,{sndT:"Sounds"});Object.assign(L.hi,{sndT:"आवाज़ें"});
function sndOn(){return raw("tz_sound","1")!=="0"}
var TZA=null;
function tzAC(){try{if(!TZA){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;TZA=new C()}if(TZA.state==="suspended")TZA.resume();return TZA}catch(e){return null}}
document.addEventListener("pointerdown",function(){if(sndOn())tzAC()},{capture:true,passive:true});
function tzSound(kind){if(!sndOn())return;var ac=tzAC();if(!ac)return;
 var notes={unlock:[[1046.5,0],[1568,.11]],ok:[[880,0],[1174.7,.09],[1760,.18]],in:[[1318.5,0],[1046.5,.12],[1568,.24]]}[kind];if(!notes)return;var t0=ac.currentTime+.02;
 try{notes.forEach(function(n){var o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain();o.type="sine";o2.type="triangle";o.frequency.value=n[0];o2.frequency.value=n[0]*2;g2.gain.value=.12;
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(ac.destination);var s=t0+n[1];g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.16,s+.015);g.gain.exponentialRampToValueAtTime(.0001,s+.45);
  o.start(s);o2.start(s);o.stop(s+.5);o2.stop(s+.5)})}catch(e){}}
document.addEventListener("click",function(e){if(!e.target.closest("[data-sndsw]"))return;rawSet("tz_sound",sndOn()?"0":null);render();if(sndOn())tzSound("unlock")});
