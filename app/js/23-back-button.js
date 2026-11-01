/* Tazvera wallet · 23-back-button.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- phone Back button ---------- */
var H={page:false,sheet:false,ign:0,pend:0,pop:false};var PARENT={chk:"set",helpc:"set"};
function hPush(){if(H.ign>0){H.pend++;return}try{history.pushState({tz:Date.now()},"")}catch(e){}}
function hBack(){if(H.pend>0){H.pend--;return}H.ign++;try{history.back()}catch(e){H.ign--}}
window.addEventListener("popstate",function(){if(H.ign>0){H.ign--;if(H.ign===0){while(H.pend>0){H.pend--;try{history.pushState({tz:Date.now()},"")}catch(e){}}}return}
 if(H.sheet){if(SLOCK){hPush();return}H.sheet=false;H.pop=true;closeSheet();H.pop=false;return}
 if(H.page){H.page=false;var p=PARENT[S.tab]||"home";H.pop=true;if(S.tab==="send")readSend();S.tab=p;if(p!=="home"){H.page=true;hPush()}render();window.scrollTo(0,0);H.pop=false}});
