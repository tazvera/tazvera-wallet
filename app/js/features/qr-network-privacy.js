/* Tazvera wallet · app/js/features/qr-network-privacy.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* QR for another network, hiding the 12 words when you leave, offline app shell. / दूसरे नेटवर्क का QR, 12 शब्द छिपाना। */
/* ----- Version 8.2 ----- */
Object.assign(L.en,{qrNetT:"This QR is for another network",qrNetS:"This QR code is for %q, but you are on %n. Switch the network first, then check the details again.",qrNetGo:"Switch to %q",qrNetNo:"This QR code is for a network Tazvera does not support (chain %c). Do not send money with it.",cancel2:"Cancel",qrAlt:"QR code of your address"});
Object.assign(L.hi,{qrNetT:"यह QR दूसरे नेटवर्क का है",qrNetS:"यह QR कोड %q का है, पर आप %n पर हैं। पहले नेटवर्क बदलिए, फिर जानकारी दोबारा जाँचिए।",qrNetGo:"%q पर बदलें",qrNetNo:"यह QR ऐसे नेटवर्क (chain %c) का है जो Tazvera में नहीं है। इससे पैसे न भेजें।",cancel2:"रद्द करें",qrAlt:"आपके पते का QR कोड"});
L.en.bkW+=" Do not take a screenshot: photos often go to the cloud.";
L.hi.bkW+=" स्क्रीनशॉट न लें: फ़ोटो अक्सर क्लाउड में चली जाती हैं।";
/* leaving the app hides the secret words (they must not stay in the recent-apps preview) */
document.addEventListener("visibilitychange",function(){if(!document.hidden)return;
 var sh=$("sheet");if(sh&&sh.classList.contains("on")&&sh.querySelector(".w12s")){closeSheet();return}
 [].forEach.call(document.querySelectorAll(".w12s"),function(e){e.style.filter="blur(8px)"})});
/* QR images get a description for screen readers */
new MutationObserver(function(){[].forEach.call(document.querySelectorAll("#qrbox img:not([alt]),#qrbox canvas:not([aria-label])"),function(e){if(e.tagName==="IMG")e.alt=t("qrAlt");else{e.setAttribute("role","img");e.setAttribute("aria-label",t("qrAlt"))}})}).observe(document.body,{childList:true,subtree:true});
/* open even without internet: a small offline helper (always fetches the newest files when online) */
if("serviceWorker" in navigator&&location.protocol==="https:"){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})})}
