/* Tazvera wallet · app/js/features/offline-theme-mainnet.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* No-internet messages, status-bar colour, PIN countdown, first-time Mainnet check. / बिना इंटरनेट संदेश, रंग, Mainnet चेतावनी। */
/* ----- Version 8.1: no-internet messages, phone colours, PIN countdown, Mainnet first-time check ----- */
Object.assign(L.en,{balErr:"⟳ Could not load balance · Try again",eOffline:"No internet. Connect and try again.",eNoBal:"Balance not loaded yet. Please wait a moment.",
 backOn:"Internet is back",pinNow:"You can try your PIN again now.",
 mnT:"Real money network",mn1:"Shardeum Mainnet uses real money. A payment cannot be undone, not even by Tazvera.",mn2:"Check the address twice before every send.",mn3:"Start with a small amount.",mnTick:"I understand this is real money",mnGo:"Switch to Mainnet",realTag:"Real money"});
Object.assign(L.hi,{balErr:"⟳ बैलेंस नहीं मिला · फिर कोशिश करें",eOffline:"इंटरनेट नहीं है। जुड़कर फिर कोशिश कीजिए।",eNoBal:"बैलेंस अभी लोड नहीं हुआ। एक पल रुकिए।",
 backOn:"इंटरनेट वापस आ गया",pinNow:"अब आप फिर PIN डाल सकते हैं।",
 mnT:"असली पैसे वाला नेटवर्क",mn1:"Shardeum Mainnet पर असली पैसा होता है। भेजा हुआ पैसा वापस नहीं होता, Tazvera भी नहीं लौटा सकता।",mn2:"हर बार भेजने से पहले पता दो बार जाँचिए।",mn3:"शुरुआत छोटी रकम से कीजिए।",mnTick:"मैं समझता/समझती हूँ कि यह असली पैसा है",mnGo:"Mainnet चालू करें",realTag:"असली पैसा"});
/* balance: try again, and refresh by itself when the internet comes back */
document.addEventListener("click",function(e){var el=e.target.closest("[data-reload]");if(!el)return;S.balErr=false;render();load();checkNet()});
window.addEventListener("online",function(){if(!S.addr)return;toast(t("backOn"));S.balErr=false;load();checkNet()});
window.addEventListener("offline",function(){S.nh="down";if(safeRerender())render()});
/* phone status bar colour follows the theme; "Auto" follows the phone at once */
(function(){var _th=theme;theme=function(){_th();try{var dark=document.documentElement.getAttribute("data-theme")==="dark",m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#0B0E13":"#F5F7FA")}catch(e){}};
 try{var mq=window.matchMedia("(prefers-color-scheme: dark)");var f=function(){if(!raw("tz_theme",""))theme()};if(mq.addEventListener)mq.addEventListener("change",f);else if(mq.addListener)mq.addListener(f)}catch(e){}
 theme()})();
/* wrong-PIN wait: live countdown on any PIN screen */
var pinWasWaiting=false;setInterval(function(){var w=pinWait(),el=document.querySelector(".ps.e");if(w>0){pinWasWaiting=true;if(el)el.textContent=t("pinBad")}else if(pinWasWaiting){pinWasWaiting=false;if(el){el.textContent=t("pinNow");el.classList.remove("e")}}},1000);
/* Mainnet: shown openly, with a one-time "real money" check before the first switch */
function mainnetSheet(){var ok=false;sheet('<div class="grab"></div><div class="sht">'+esc(t("mnT"))+'</div><div class="riskl" style="margin:6px 0 0">'+[["warn","mn1"],["shield","mn2"],["lock","mn3"]].map(function(r){return '<div class="rki"><span>'+ic(r[0],22)+'</span><p>'+esc(t(r[1]))+'</p></div>'}).join("")+'</div><label class="tick" style="margin:16px 2px 0;color:var(--tx)"><input type="checkbox" id="mnOk">'+esc(t("mnTick"))+'</label><div style="margin-top:14px"><button class="btn" id="mnGo" disabled>'+esc(t("mnGo"))+'</button></div>');
 $("mnOk").onchange=function(){ok=this.checked;$("mnGo").disabled=!ok};
 $("mnGo").onclick=function(){if(!ok)return;rawSet("tz_mn_ok","1");S.net="shardeum";lss("v2net",S.net);netReset();S.snd.tok="native";closeSheet();render();load();checkNet()}}
document.addEventListener("click",function(e){var el=e.target.closest('[data-pick="shardeum"]');if(!el||raw("tz_mn_ok","")==="1"||S.net==="shardeum")return;e.stopImmediatePropagation();e.preventDefault();mainnetSheet()},true);
