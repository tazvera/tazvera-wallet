/* Tazvera wallet · 26-v8-trust.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- Version 8: trust & everyday features ----------
   verified badges · token detail sheet · news bell (announcements.json) · network health chip ·
   home security card · empty-wallet card · big amount double check · "before you start" screen ·
   "exit the app?" check on the phone Back button */
Object.assign(L.en,{ver:"Verified",unv:"Not verified",nhOk:"Network OK",nhSlow:"Network slow",nhDown:"Network down",
 secOk:"Your wallet is protected",secLeft:"%n safety step(s) left",secFix:"Fix",secAll:"Backup done · PIN on",
 emptyT:"Your wallet is ready",emptyS:"Receive your first coins to get started.",
 bigT:"Big amount",bigS:"You are sending %a. Check the address once more.",bigTick:"I checked. Send this big amount.",
 annT:"News & alerts",annNone:"No news yet",
 riskT:"Before you start",risk1:"Your keys stay only on this phone. Tazvera cannot see or recover them.",risk2:"Your 12 secret words are the only backup. Never share them with anyone, not even Tazvera.",risk3:"Crypto sent to a wrong address can be lost. Always check before sending.",riskTick:"I understand",riskGo:"Continue",
 tdBal:"Balance",tdContract:"Contract",tdHist:"History",tdNoHist:"No transactions with this coin yet.",tdVerS:"Official coin, checked by Tazvera",tdUnvW:"You added this token yourself. Tazvera has not checked it. Fake airdrop tokens are a common scam: never 'claim' them on a website.",tdExp:"Explorer",
 exitT:"Leave Tazvera?",exitS:"Your wallet stays safe on this phone.",exitY:"Yes, leave",exitN:"Stay"});
Object.assign(L.hi,{ver:"सत्यापित",unv:"सत्यापित नहीं",nhOk:"नेटवर्क ठीक",nhSlow:"नेटवर्क धीमा",nhDown:"नेटवर्क बंद",
 secOk:"आपका वॉलेट सुरक्षित है",secLeft:"%n सुरक्षा काम बाक़ी",secFix:"ठीक करें",secAll:"बैकअप पूरा · PIN चालू",
 emptyT:"आपका वॉलेट तैयार है",emptyS:"शुरू करने के लिए पहले सिक्के पाइए।",
 bigT:"बड़ी रकम",bigS:"आप %a भेज रहे हैं। पता एक बार फिर जाँच लीजिए।",bigTick:"मैंने जाँच लिया। यह बड़ी रकम भेजें।",
 annT:"ख़बरें और चेतावनियाँ",annNone:"अभी कोई ख़बर नहीं",
 riskT:"शुरू करने से पहले",risk1:"आपकी चाबी सिर्फ़ इसी फ़ोन में रहती है। Tazvera उसे न देख सकता है, न वापस ला सकता है।",risk2:"आपके 12 गुप्त शब्द ही एकमात्र बैकअप हैं। इन्हें कभी किसी को न दें, Tazvera को भी नहीं।",risk3:"ग़लत पते पर भेजा crypto खो सकता है। भेजने से पहले हमेशा जाँचिए।",riskTick:"मैं समझता/समझती हूँ",riskGo:"आगे बढ़ें",
 tdBal:"बैलेंस",tdContract:"कॉन्ट्रैक्ट",tdHist:"इतिहास",tdNoHist:"इस सिक्के का अभी कोई लेन-देन नहीं।",tdVerS:"आधिकारिक सिक्का, Tazvera द्वारा जाँचा हुआ",tdUnvW:"यह टोकन आपने ख़ुद जोड़ा है। Tazvera ने इसे जाँचा नहीं है। नक़ली airdrop टोकन आम ठगी है: किसी वेबसाइट पर इन्हें 'claim' कभी न करें।",tdExp:"Explorer",
 exitT:"Tazvera से बाहर जाएँ?",exitS:"आपका वॉलेट इसी फ़ोन में सुरक्षित रहेगा।",exitY:"हाँ, बाहर जाएँ",exitN:"रुकें"});

/* ----- token badges ----- */
function isVer(k){return !!k&&(k.id==="native"||k.id==="tzt"||k.id==="tzv")}
function tokBadge(k){if(isVer(k))return ' <span class="vb" title="'+esc(t("ver"))+'">'+ic("check",10,3.2)+'</span>';if(k&&k.custom)return ' <span class="ub">⚠ '+esc(t("unv"))+'</span>';return ""}

/* ----- safe re-render: only on the main Home screen, never over the lock screen ----- */
function safeRerender(){return S.tab==="home"&&!!document.querySelector("#app .nav")&&!$("sheet").classList.contains("on")}

/* ----- network health ----- */
S.nh=S.nh||"";
async function checkNet(){if(!S.addr)return;var n=N(),t0=Date.now(),st;
 try{await Promise.race([rpc(n.rpc,"eth_blockNumber",[]),new Promise(function(_,rj){setTimeout(function(){rj(new Error("slow"))},8000)})]);st=(Date.now()-t0)<2500?"ok":"slow"}catch(e){st=(Date.now()-t0)>=7900?"slow":"down"}
 if(st!==S.nh){S.nh=st;if(safeRerender())render()}}
function nhChip(){if(!S.nh)return "";var k=S.nh==="ok"?"nhOk":S.nh==="slow"?"nhSlow":"nhDown";return '<span class="nh '+S.nh+'"><i></i>'+esc(t(k))+'</span>'}
setInterval(function(){if(!document.hidden)checkNet()},60000);setTimeout(checkNet,1500);

/* ----- home cards ----- */
function secCard(){if(S.mode!=="inapp")return "";var c;try{c=checks()}catch(e){return ""}var miss=c.filter(function(x){return !x.ok}).length;
 if(!miss)return "";
 return '<button class="secc warn" data-tab="chk"><span class="si">'+ic("warn",20)+'</span><span class="sm"><b>'+esc(t("secLeft").replace("%n",miss))+'</b></span><span class="sf">'+esc(t("secFix"))+'</span></button>'}
function emptyCard(){if(!(S.bal===0)||(S.tzt>0)||(S.tzv>0)||txs().length)return "";var n=N();
 return '<div class="emptyc"><b>'+esc(t("emptyT"))+' 🎉</b><small>'+esc(t("emptyS"))+'</small><div class="eb"><button class="btn" data-go="recv">'+ic("recv",18)+esc(t("recv"))+'</button>'+(n.tzt?'<button class="btnw" data-fourth="1">'+esc(t("getTzt"))+'</button>':'')+'</div></div>'}

/* ----- big amount check (used by openConfirm) ----- */
function isBig(a,k){var x=parseFloat(a);if(!(x>0)||!k)return false;var n=N();if(n.test)return false;
 if(k.id==="native"&&S.inr&&x*S.inr>=1000)return true;
 if(k.bal>0&&x>=k.bal*0.5)return true;return false}
function bigBox(a,k){if(!isBig(a,k))return "";var txt=(k.id==="native"&&dpx())?money(parseFloat(a)*dpx()):exactAmt(a)+" "+k.sym;
 return '<div class="sc warn" style="margin-top:10px">'+ic("warn",24)+'<div><b>'+esc(t("bigT"))+'</b><small>'+esc(t("bigS").replace("%a",txt))+'</small><label class="tick"><input type="checkbox" id="cBig">'+esc(t("bigTick"))+'</label></div></div>'}

/* ----- news & alerts (announcements.json on the same site, so news can change without an app update) ----- */
var ANN=[{id:4,d:"2026-11-03",en:["We never DM you first","Tazvera never asks for your 12 words, PIN or money. Anyone who does is a scammer."],hi:["हम कभी पहले DM नहीं करते","Tazvera कभी आपके 12 शब्द, PIN या पैसे नहीं माँगता। जो माँगे, वह ठग है।"]}];
(function(){try{fetch("/announcements.json",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(j){if(Array.isArray(j)&&j.length&&j[0].id){ANN=j;if(safeRerender())render()}}).catch(function(){})}catch(e){}})();
function annMax(){return ANN.reduce(function(m,a){return Math.max(m,a.id||0)},0)}
function annUnread(){return annMax()>Number(ls("annSeen",0)||0)}
function bellSheet(){lss("annSeen",annMax());render();var L2=S.lang==="hi"?"hi":"en";
 sheet('<div class="grab"></div><div class="sht">'+esc(t("annT"))+'</div>'+(ANN.length?ANN.slice().sort(function(a,b){return b.id-a.id}).map(function(a){var x=a[L2]||a.en;return '<div class="annc"><small>'+esc(a.d||"")+'</small><b>'+esc(x[0])+'</b><p>'+esc(x[1])+'</p></div>'}).join(""):'<div class="empty">'+esc(t("annNone"))+'</div>'))}

/* ----- token detail ----- */
function tokDetail(id){var k=tokens().find(function(x){return x.id===id});if(!k)return;var n=N();
 var val=(k.id==="native"&&dpx()&&!n.test&&k.bal!=null)?money(k.bal*dpx()):"";
 var hist=txs().filter(function(x){return String(x.symbol||n.sym).toUpperCase()===String(k.sym).toUpperCase()}).slice(0,8);
 var extra=k.id==="tzt"?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("drop",18)+esc(t("getTzt"))+'</button>':(k.id==="native"&&S.net==="shardeum")?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("add",18)+esc(t("addShm"))+'</button>':(k.id==="native"&&n.test&&!n.tzt)?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("drop",18)+esc(t("testCoins"))+'</button>':'';
 sheet('<div class="grab"></div><div class="tdh"><span class="ci big'+(k.custom?' unv':'')+'">'+(k.img?'<img src="'+k.img+'" alt="">':'<b>'+esc(k.sym.slice(0,1))+'</b>')+'</span><div><b>'+esc(k.name)+tokBadge(k)+'</b><small>'+esc(k.sym+" · "+n.name)+'</small></div></div>'+
 '<div class="tdb"><small>'+esc(t("tdBal"))+'</small><b>'+(S.hide?"••••":esc(fmt(k.bal,6)+" "+k.sym))+'</b>'+(val&&!S.hide?'<span>'+esc(val)+'</span>':'')+'</div>'+
 (isVer(k)?'<div class="note2" style="color:var(--green);font-weight:600;margin:8px 0 0">✓ '+esc(t("tdVerS"))+'</div>':'<div class="sc warn" style="margin-top:12px">'+ic("warn",22)+'<div><small style="font-size:13px;font-weight:600">'+esc(t("tdUnvW"))+'</small></div></div>')+
 (k.addr?'<div class="kv" style="margin-top:12px"><div><span>'+esc(t("tdContract"))+'</span><b style="display:flex;gap:10px;align-items:center">'+esc(sh(k.addr))+' <button data-tkcopy="'+esc(k.addr)+'" aria-label="copy">'+ic("copy",15)+'</button><a href="'+n.exp+'/address/'+k.addr+'" target="_blank" rel="noopener" style="color:var(--green);font-size:13px">'+esc(t("tdExp"))+' ↗</a></b></div></div>':'')+
 (k.id==="native"&&S.net==="shardeum"?'<button class="btnw" data-mkc="SHM" style="margin-top:12px">'+ic("pl",18)+esc(t("chT"))+'</button>':'')+'<div class="tda"><button class="btn" data-tksend="'+esc(k.id)+'">'+ic("send",18,2.1)+esc(t("send"))+'</button><button class="btnw" data-tkrecv="'+esc(k.id)+'">'+ic("recv",18)+esc(t("recv"))+'</button></div>'+extra+
 (k.id==="tzv"&&typeof lockBox==="function"?lockBox():'')+
 '<div class="day" style="margin:18px 0 6px">'+esc(t("tdHist"))+'</div>'+(hist.length?'<div class="card" style="margin:0">'+hist.map(rowTx).join("")+'</div>':'<div class="empty">'+esc(t("tdNoHist"))+'</div>'))}

/* ----- "before you start" screen when creating a new wallet ----- */
var _createFlowV7=createFlow;
createFlow=function(){var ok=false;
 $("app").innerHTML='<div class="tb"><button class="ib" id="rkBack" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("riskT"))+'</b></div>'+
  '<div class="riskl">'+[["lock","risk1"],["shield","risk2"],["warn","risk3"]].map(function(r){return '<div class="rki"><span>'+ic(r[0],22)+'</span><p>'+esc(t(r[1]))+'</p></div>'}).join("")+'</div>'+
  '<label class="tick" style="margin:18px 22px 0;color:var(--tx)"><input type="checkbox" id="rkOk">'+esc(t("riskTick"))+'</label>'+
  '<div style="margin:16px 20px 0"><button class="btn" id="rkGo" disabled>'+esc(t("riskGo"))+'</button></div>';
 $("rkOk").onchange=function(){ok=this.checked;$("rkGo").disabled=!ok};$("rkGo").onclick=function(){if(ok)_createFlowV7()};$("rkBack").onclick=function(){render()}};

/* ----- "leave the app?" on the phone Back button at Home ----- */
var EXIT={armed:false,sheet:false,off:0};
function exitArm(){if(EXIT.armed||Date.now()<EXIT.off||S.tab!=="home"||H.page||H.sheet||H.ign>0||!document.querySelector("#app .nav"))return;EXIT.armed=true;try{history.pushState({tzx:1},"")}catch(e){}}
function exitAsk(){EXIT.sheet=true;sheet('<div class="grab"></div><div class="done" style="padding-top:6px"><div class="sht" style="margin:0">'+esc(t("exitT"))+'</div><p style="color:var(--mu);margin:6px 0 0">'+esc(t("exitS"))+'</p></div><div class="tda"><button class="btnw" data-exn="1">'+esc(t("exitN"))+'</button><button class="btn" data-exy="1">'+esc(t("exitY"))+'</button></div>')}
window.addEventListener("popstate",function(){
 if(EXIT.leaving)return;
 if(H.hd){H.hd=0;return} /* the normal Back button code already handled this one */
 if(H.ign>0||H.sheet||H.page)return;
 if(EXIT.sheet){EXIT.sheet=false;return}
 if(EXIT.armed&&S.tab==="home"&&document.querySelector("#app .nav")){EXIT.armed=false;exitAsk()}});
setInterval(exitArm,1500);

/* ----- clicks for the new parts ----- */
document.addEventListener("click",function(e){var el=e.target.closest("[data-tokd],[data-bell],[data-tksend],[data-tkrecv],[data-tkcopy],[data-exy],[data-exn]");if(!el)return;var d=el.dataset;
 if(d.tokd){tokDetail(d.tokd);return}
 if(d.bell){bellSheet();return}
 if(d.tksend){closeSheet();S.snd.tok=d.tksend;S.snd.fee=null;S.snd.feeW=null;S.tab="send";H.page=true;hPush();render();window.scrollTo(0,0);estFee();return}
 if(d.tkrecv){closeSheet();if(typeof RCV==="object")RCV.tok=d.tkrecv;S.tab="recv";H.page=true;hPush();render();window.scrollTo(0,0);return}
 if(d.tkcopy){copyText(d.tkcopy);return}
 if(d.exn){EXIT.sheet=false;closeSheet();setTimeout(exitArm,400);return}
 if(d.exy){EXIT.leaving=true;EXIT.sheet=false;$("sheet").classList.remove("on");$("sbg").classList.remove("on");H.sheet=false;try{history.go(-2)}catch(x){}
  setTimeout(function(){if(document.hidden)return;try{window.close()}catch(x){}EXIT.leaving=false;EXIT.off=Date.now()+15000},500)}});

/* ----- refresh without the PIN, but only inside the auto-lock time ----- */
function markAct(){try{if(sessionStorage.getItem("v2_unl")==="1")sessionStorage.setItem("v2_act",String(Date.now()))}catch(e){}}
setInterval(function(){if(!document.hidden)markAct()},15000);window.addEventListener("pagehide",markAct);document.addEventListener("click",markAct,true);

/* ----- copying that tells the truth: real copy, a second way, or "copy it yourself" ----- */
Object.assign(L.en,{cpManT:"Copy it yourself",cpManS:"This browser did not allow copying. Press and hold the text below, then choose Copy."});
Object.assign(L.hi,{cpManT:"ख़ुद कॉपी करें",cpManS:"इस ब्राउज़र ने कॉपी नहीं करने दिया। नीचे के अक्षर दबाकर रखिए, फिर Copy चुनिए।"});
function manualCopy(txt){sheet('<div class="grab"></div><div class="sht">'+esc(t("cpManT"))+'</div><p class="note2" style="margin:6px 0 10px">'+esc(t("cpManS"))+'</p><textarea readonly class="cpbox" id="cpBox">'+esc(txt)+'</textarea>');var cb=$("cpBox");if(cb){cb.onfocus=cb.onclick=function(){cb.select()}}}
function copyText(txt){txt=String(txt==null?"":txt);
 function second(){var ok=false;try{var ta=document.createElement("textarea");ta.value=txt;ta.setAttribute("readonly","");ta.style.cssText="position:fixed;top:0;left:0;opacity:0;font-size:16px";document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,txt.length);ok=document.execCommand&&document.execCommand("copy");document.body.removeChild(ta)}catch(e){ok=false}
  if(ok)toast(t("copied"));else manualCopy(txt)}
 try{if(navigator.clipboard&&navigator.clipboard.writeText&&window.isSecureContext){navigator.clipboard.writeText(txt).then(function(){toast(t("copied"))},second);return}}catch(e){}
 second()}

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

/* ----- bottom bar: Home · Scan · Explore, and the assistant in the corner ----- */
Object.assign(L.en,{navScan:"Scan",navLearn:"Learn",aiFab:"Tazvera Assistant"});
Object.assign(L.hi,{navScan:"स्कैन",navLearn:"सीखें",aiFab:"Tazvera सहायक"});

/* ----- the assistant icon can be moved with a finger; it sticks to the nearest side and stays there ----- */
(function(){var KEY="tz_aipos",drag=null,justMoved=0;
 function saved(){try{var p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&(p.s==="l"||p.s==="r")&&typeof p.y==="number")return p}catch(e){}return null}
 function place(f){var p=saved();if(!p)return;var h=window.innerHeight,y=Math.min(Math.max(p.y,70),h-60),edge="max(6px, calc(50% - 214px))";
  f.style.setProperty("top",y+"px","important");f.style.setProperty("bottom","auto","important");f.style.setProperty("left",p.s==="l"?edge:"auto","important");f.style.setProperty("right",p.s==="r"?edge:"auto","important")}
 new MutationObserver(function(){var f=document.querySelector(".aifab");if(f&&!f._pl){f._pl=1;place(f)}}).observe(document.getElementById("app"),{childList:true,subtree:false});
 document.addEventListener("pointerdown",function(e){var f=e.target.closest(".aifab");if(!f)return;var r=f.getBoundingClientRect();drag={f:f,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,moved:false};try{f.setPointerCapture(e.pointerId)}catch(x){}});
 document.addEventListener("pointermove",function(e){if(!drag)return;var f=drag.f;if(!drag.moved&&Math.abs(e.clientX-drag.x0)+Math.abs(e.clientY-drag.y0)<8)return;drag.moved=true;f.classList.add("drag");
  var w=window.innerWidth,h=window.innerHeight,x=Math.min(Math.max(e.clientX-drag.dx,4),w-52),y=Math.min(Math.max(e.clientY-drag.dy,60),h-56);
  f.style.setProperty("left",x+"px","important");f.style.setProperty("top",y+"px","important");f.style.setProperty("right","auto","important");f.style.setProperty("bottom","auto","important");e.preventDefault()},{passive:false});
 function end(){if(!drag)return;var f=drag.f,m=drag.moved;drag=null;f.classList.remove("drag");if(!m)return;justMoved=Date.now();
  var r=f.getBoundingClientRect(),side=(r.left+r.width/2)<window.innerWidth/2?"l":"r";try{localStorage.setItem(KEY,JSON.stringify({s:side,y:Math.round(r.top)}))}catch(x){}
  f.style.removeProperty("left");f.style.removeProperty("right");f.style.removeProperty("top");f.style.removeProperty("bottom");place(f)}
 document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
 document.addEventListener("click",function(e){if(e.target.closest(".aifab")&&Date.now()-justMoved<400){e.stopImmediatePropagation();e.preventDefault()}},true);
})();

/* ----- 12-word backup is checked for EVERY wallet, not just the first one ----- */
function bkMark(a){if(a)rawSet("tz_bk_"+String(a).toLowerCase(),"1")}
function bkDone(a){a=String(a||"").toLowerCase();if(!a)return false;if(raw("tz_bk_"+a,"")==="1")return true;
 try{var l=wList();if(ls("backup_ok",0)&&l.length&&String(l[0].addr).toLowerCase()===a)return true}catch(e){}return false}

/* ----- lock by itself when nobody touches the app (computers keep the tab open for hours) ----- */
(function(){var last=Date.now();function act(){last=Date.now()}
 ["pointerdown","keydown","wheel","touchstart"].forEach(function(ev){document.addEventListener(ev,act,{capture:true,passive:true})});
 setInterval(function(){if(S.mode!=="inapp"||!S.addr||document.hidden)return;if(typeof SLOCK!=="undefined"&&SLOCK)return;
  var open=false;try{open=sessionStorage.getItem("v2_unl")==="1"}catch(e){}if(!open)return;
  if(Date.now()-last>amin()*60000){try{CPW.lock();sessionStorage.removeItem("v2_unl");sessionStorage.removeItem("v2_act")}catch(e){}closeSheet();lockScreen();last=Date.now()}},15000)})();

Object.assign(L.en,{eSum:"This address has a typing mistake (its capital letters do not match). Copy it again.",eDec:"Too many decimals: at most %d."});
Object.assign(L.hi,{eSum:"इस पते में टाइपिंग की ग़लती लगती है (बड़े-छोटे अक्षर मेल नहीं खाते)। फिर से कॉपी कीजिए।",eDec:"बहुत ज़्यादा दशमलव: ज़्यादा से ज़्यादा %d।"});

/* ----- changing the PIN re-locks every wallet on this phone, not only the open one ----- */
async function pinRelockAll(oldPin,newPin){var l=wList(),cur=raw("cp3_inapp_keystore",""),act=wActive(),miss=0;
 for(var i=0;i<l.length;i++){if(act&&l[i].id===act.id){l[i].ks=cur;continue}
  try{var w=await ethers.Wallet.fromEncryptedJson(l[i].ks,oldPin);l[i].ks=await w.encrypt(newPin)}catch(e){miss++}}
 wSave(l);return miss}
Object.assign(L.en,{pinOkPart:"PIN changed. %n wallet(s) still use an older PIN.",tokFake:"\"%s\" pretends to be an official coin, but the address is different. It is probably fake, so it was not added.",
 rmNoBkT:"These 12 words were never checked",rmNoBkS:"\"%w\" was never confirmed as backed up. If you remove it without its 12 words, any money in it is lost forever.",rmNoBkTick:"I have its 12 words on paper, or it is empty"});
Object.assign(L.hi,{pinOkPart:"PIN बदल गया। %n वॉलेट अभी भी पुराने PIN पर हैं।",tokFake:"\"%s\" आधिकारिक सिक्के जैसा नाम रखता है, पर पता अलग है। यह शायद नक़ली है, इसलिए जोड़ा नहीं गया।",
 rmNoBkT:"इसके 12 शब्द कभी जाँचे नहीं गए",rmNoBkS:"\"%w\" का बैकअप कभी पक्का नहीं हुआ। 12 शब्दों के बिना हटाया, तो इसमें रखा पैसा हमेशा के लिए चला जाएगा।",rmNoBkTick:"इसके 12 शब्द मेरे पास काग़ज़ पर हैं, या यह ख़ाली है"});

/* ----- Version 8.7 ----- */
Object.assign(L.en,{scanFail:"The scanner could not load. Check the internet, or paste the address.",cancelled:"Cancelled",mmOther:"MetaMask has a different account selected. Choose this wallet's account in MetaMask and try again.",eTok:"This token has no valid contract address.",
 shCon:"This is a smart-contract address",shCon2:"Coins sent to a contract are often lost forever unless it was made to receive them. Send only if you are sure."});
Object.assign(L.hi,{scanFail:"स्कैनर नहीं खुला। इंटरनेट देखिए, या पता चिपकाइए।",cancelled:"रद्द किया",mmOther:"MetaMask में दूसरा खाता चुना है। MetaMask में इसी वॉलेट का खाता चुनकर फिर कोशिश कीजिए।",eTok:"इस टोकन का सही कॉन्ट्रैक्ट पता नहीं है।",
 shCon:"यह स्मार्ट-कॉन्ट्रैक्ट का पता है",shCon2:"कॉन्ट्रैक्ट पर भेजे सिक्के अक्सर हमेशा के लिए खो जाते हैं, जब तक वह पाने के लिए न बना हो। पूरी तरह पक्का हों, तभी भेजें।"});
/* clear every number that belongs to the old network / wallet */
function netReset(){S.bal=null;S.balW=null;S.tzt=null;S.tztW=null;S.tzv=null;S.tzvW=null;S.cust=[];S.balErr=false;S.nh="";if(S.snd){S.snd.fee=null;S.snd.feeW=null;S.snd.codeFor=null;S.snd.isC=false}setTimeout(function(){if(typeof checkNet==="function")checkNet()},60)}
/* only one send at a time (a double tap can never send twice) */
(function(){var _ds=doSend;doSend=async function(a){if(S.sending)return;S.sending=true;try{return await _ds(a)}finally{S.sending=false}}})();
/* Shield: ask the blockchain whether the address is a smart contract */
(function(){var _oc=openConfirm,_sh=shield;
 openConfirm=function(){readSend();var to=String(S.snd.to||"").toLowerCase(),key=to+"|"+S.net;
  if(/^0x[0-9a-f]{40}$/.test(to)&&S.snd.codeFor!==key){S.snd.codeFor=key;S.snd.isC=false;
   Promise.race([rpc(N().rpc,"eth_getCode",[S.snd.to,"latest"]),new Promise(function(_,rj){setTimeout(function(){rj(0)},6000)})]).then(function(c){S.snd.isC=!!c&&c!=="0x"&&c!=="0x0"}).catch(function(){}).then(function(){if(S.tab==="send")_oc()});return}
  _oc()};
 shield=function(){var r=_sh();if(r.lvl==="warn"&&S.snd.isC&&S.snd.codeFor===String(S.snd.to||"").toLowerCase()+"|"+S.net)return{lvl:"bad",t:t("shCon"),s:t("shCon2")};return r}})();

/* ----- Version 9: show money in ₹ or in US dollars (USDT) ----- */
Object.assign(L.en,{curT:"Currency",curInr:"₹ Indian Rupee (INR)",curUsd:"$ US Dollar (USD / USDT)",curNote:"Balances and prices are shown in this currency. Tools like the converter and bill split stay in ₹."});
Object.assign(L.hi,{curT:"मुद्रा",curInr:"₹ भारतीय रुपया (INR)",curUsd:"$ अमेरिकी डॉलर (USD / USDT)",curNote:"बैलेंस और भाव इसी मुद्रा में दिखेंगे। कन्वर्टर, बिल बाँटें जैसे औज़ार ₹ में ही रहेंगे।"});
function curC(){return raw("tz_cur","inr")==="usd"?"usd":"inr"}
function dpx(){var p=curC()==="usd"?S.usd:S.inr;return (p>0)?p:null}
function money(v){if(curC()!=="usd")return inr(v);if(v==null||isNaN(v))return "—";var d=v<0.01?6:(v<1?4:2);return "$"+Number(v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:d})}
document.addEventListener("click",function(e){if(!e.target.closest("[data-curset]"))return;
 choose(t("curT"),[["inr",t("curInr")],["usd",t("curUsd")]],curC(),function(v){rawSet("tz_cur",v==="usd"?"usd":null);S.mkt=0;if(typeof loadMk==="function")loadMk();render();toast(t("curNote"))})});

/* ----- Version 9: price chart (line or candles; 24 hours / 7 days / 30 days) ----- */
Object.assign(L.en,{chT:"Price chart",ch1:"24H",ch7:"7D",ch30:"30D",chHi:"High",chLo:"Low",chLine:"Line",chCandle:"Candles",chNo:"Chart not available right now. Check the internet and try again.",chSrc:"Prices from public exchanges (KuCoin, Gate). Past prices do not tell the future."});
Object.assign(L.hi,{chT:"भाव का ग्राफ़",ch1:"24 घंटे",ch7:"7 दिन",ch30:"30 दिन",chHi:"सबसे ऊँचा",chLo:"सबसे नीचा",chLine:"लाइन",chCandle:"कैंडल",chNo:"ग्राफ़ अभी उपलब्ध नहीं। इंटरनेट देखकर फिर कोशिश कीजिए।",chSrc:"भाव सार्वजनिक एक्सचेंज (KuCoin, Gate) से। पुराने भाव भविष्य नहीं बताते।"});
var CHID={SHM:1,BTC:1,ETH:1,BNB:1,USDT:1},CHC={};
/* price history comes from our own small server (exchange candles, cached 5 minutes), so many users never hit a rate limit */
async function chData(sym,days){if(!CHID[sym])return null;var key=sym+"|"+days+"|"+curC(),c=CHC[key];if(c&&Date.now()-c.t<300000)return c.d;
 var r=await fetch("/api/chart?sym="+encodeURIComponent(sym)+"&days="+days+"&cur="+curC());if(!r.ok)throw 0;var j=await r.json();
 var p=(j&&Array.isArray(j.prices)?j.prices:[]).filter(function(x){return Array.isArray(x)&&x[1]>0});if(p.length<2)throw 0;
 var k=(j&&Array.isArray(j.candles)?j.candles:[]).filter(function(x){return Array.isArray(x)&&x.length===5&&x[1]>0&&x[2]>0&&x[3]>0&&x[4]>0});
 var d={p:p,k:k.length>=2?k:null};CHC[key]={t:Date.now(),d:d};return d}
function chMode(){return raw("tz_chmode","line")==="candle"?"candle":"line"}
var CW=340,CH=170,CP=6;
function chLineSVG(p){var xs=p.map(function(x){return x[0]}),ys=p.map(function(x){return x[1]}),x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),lo=Math.min.apply(null,ys),hi=Math.max.apply(null,ys),sp=(hi-lo)||hi*0.01||1;
 var pts=p.map(function(q){return [CP+(q[0]-x0)/((x1-x0)||1)*(CW-2*CP),CP+(1-(q[1]-lo)/sp)*(CH-2*CP)]}),up=ys[ys.length-1]>=ys[0],col=up?"#00A86B":"#E5484D";
 var line=pts.map(function(q,i){return (i?"L":"M")+q[0].toFixed(1)+" "+q[1].toFixed(1)}).join(" "),area=line+" L"+(CW-CP)+" "+CH+" L"+CP+" "+CH+" Z",last=pts[pts.length-1];
 return '<svg viewBox="0 0 '+CW+' '+CH+'" class="chsvg" role="img" aria-label="'+esc(t("chT"))+'"><defs><linearGradient id="chg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+col+'" stop-opacity=".28"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></linearGradient></defs><path d="'+area+'" fill="url(#chg)"/><path d="'+line+'" fill="none" stroke="'+col+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+last[0].toFixed(1)+'" cy="'+last[1].toFixed(1)+'" r="4.5" fill="'+col+'" stroke="var(--card)" stroke-width="2"/></svg>'}
function chCandleSVG(k){var lo=Math.min.apply(null,k.map(function(x){return x[3]})),hi=Math.max.apply(null,k.map(function(x){return x[2]})),sp=(hi-lo)||hi*0.01||1,n=k.length,slot=(CW-2*CP)/n,bw=Math.max(2,Math.min(12,slot*0.62));
 function y(v){return CP+(1-(v-lo)/sp)*(CH-2*CP)}
 var g='';k.forEach(function(c,i){var up=c[4]>=c[1],col=up?"#00A86B":"#E5484D",cx=CP+slot*(i+.5),yo=y(c[1]),yc=y(c[4]),top=Math.min(yo,yc),h=Math.max(1.2,Math.abs(yc-yo));
  g+='<line x1="'+cx.toFixed(1)+'" y1="'+y(c[2]).toFixed(1)+'" x2="'+cx.toFixed(1)+'" y2="'+y(c[3]).toFixed(1)+'" stroke="'+col+'" stroke-width="1.3"/><rect x="'+(cx-bw/2).toFixed(1)+'" y="'+top.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="1" fill="'+col+'"/>'});
 return '<svg viewBox="0 0 '+CW+' '+CH+'" class="chsvg" role="img" aria-label="'+esc(t("chT"))+'">'+g+'</svg>'}
async function chartSheet(sym,days){days=days||1;var name={SHM:"Shardeum",BTC:"Bitcoin",ETH:"Ethereum",BNB:"BNB",USDT:"Tether"}[sym]||sym;
 function head(body,canCandle){var m=chMode();sheet('<div class="grab"></div><div class="sht">'+esc(name)+' · '+esc(t("chT"))+'</div><div class="chtabs">'+[[1,"ch1"],[7,"ch7"],[30,"ch30"]].map(function(d){return '<button class="f1'+(d[0]===days?" on":"")+'" data-chd="'+d[0]+'" data-chs="'+esc(sym)+'">'+esc(t(d[1]))+'</button>'}).join("")+'</div>'+
  (canCandle?'<div class="chmode"><button class="'+(m==="line"?"on":"")+'" data-chm="line" data-chs="'+esc(sym)+'" data-chdd="'+days+'">〰️ '+esc(t("chLine"))+'</button><button class="'+(m==="candle"?"on":"")+'" data-chm="candle" data-chs="'+esc(sym)+'" data-chdd="'+days+'">🕯️ '+esc(t("chCandle"))+'</button></div>':'')+body+'<div class="note2" style="margin-top:10px">'+esc(t("chSrc"))+'</div>')}
 head('<div class="chbox"><div class="empty">'+esc(t("loading"))+'</div></div>',sym!=="USDT");
 try{var d=await chData(sym,days);if(!$("sheet").classList.contains("on")||!document.querySelector('[data-chs="'+sym+'"]'))return;
  var p=d.p,ys=p.map(function(x){return x[1]}),f=d.k?d.k[0][1]:ys[0],l=ys[ys.length-1],ch=(l-f)/f*100,up=ch>=0,cand=chMode()==="candle"&&!!d.k,
   hiV=d.k?Math.max.apply(null,d.k.map(function(x){return x[2]})):Math.max.apply(null,ys),loV=d.k?Math.min.apply(null,d.k.map(function(x){return x[3]})):Math.min.apply(null,ys);
  head('<div class="chnow"><b>'+esc(money(l))+'</b><span class="'+(up?"up2":"dn2")+'">'+(up?"+":"")+fmt(ch,2)+'%</span></div><div class="chbox">'+(cand?chCandleSVG(d.k):chLineSVG(p))+'</div><div class="chhl"><span>'+esc(t("chHi"))+' <b>'+esc(money(hiV))+'</b></span><span>'+esc(t("chLo"))+' <b>'+esc(money(loV))+'</b></span></div>',!!d.k)}
 catch(e){if(document.querySelector('[data-chs="'+sym+'"]'))head('<div class="chbox"><div class="empty">'+esc(t("chNo"))+'</div></div>',false)}}
document.addEventListener("click",function(e){var el=e.target.closest("[data-mkc],[data-chd],[data-chm]");if(!el)return;
 if(el.dataset.chm){rawSet("tz_chmode",el.dataset.chm==="candle"?"candle":null);chartSheet(el.dataset.chs,+el.dataset.chdd);return}
 if(el.dataset.chd){chartSheet(el.dataset.chs,+el.dataset.chd);return}var s=el.dataset.mkc;if(CHID[s]){var open=$("sheet").classList.contains("on");if(open)closeSheet();setTimeout(function(){chartSheet(s,1)},open?250:0)}});
/* ----- Version 9: Crypto Quiz in Learn (10 questions, Hindi + English) ----- */
var QZ=[
 {en:["Who can you share your 12 secret words with?",["Nobody, ever","Tazvera support","A friend you trust"],0,"Anyone with the 12 words can take all your money. No real support team ever asks for them."],
  hi:["अपने 12 गुप्त शब्द किसे बता सकते हैं?",["किसी को भी नहीं","Tazvera सहायता टीम को","भरोसेमंद दोस्त को"],0,"जिसके पास 12 शब्द हों, वह पूरा पैसा ले सकता है। कोई असली सहायता टीम ये कभी नहीं माँगती।"]},
 {en:["Someone messages you: \"Send 100 SHM, get 1,000 back.\" This is…",["A scam","A lucky offer","Worth a small try"],0,"Doubling offers are always scams. Never send money to get more back."],
  hi:["कोई संदेश भेजे: \"100 SHM भेजो, 1,000 वापस पाओ।\" यह…",["ठगी है","क़िस्मत वाला मौक़ा है","थोड़ा आज़माने लायक़ है"],0,"पैसा दोगुना करने वाले प्रस्ताव हमेशा ठगी होते हैं। ज़्यादा पाने के लिए कभी पैसा मत भेजिए।"]},
 {en:["Where does the network fee go?",["To the blockchain network","To Tazvera","To the person you pay"],0,"The fee pays the network to process your payment. Tazvera takes nothing."],
  hi:["नेटवर्क फ़ीस कहाँ जाती है?",["ब्लॉकचेन नेटवर्क को","Tazvera को","जिसे भुगतान किया, उसे"],0,"फ़ीस नेटवर्क को आपका भुगतान पूरा करने के लिए मिलती है। Tazvera कुछ नहीं लेता।"]},
 {en:["You lost your phone and your 12 words. What happens?",["The wallet is lost forever","Tazvera can bring it back","The bank can bring it back"],0,"In a self-custody wallet only you hold the key. Keep the 12 words (or a wallet backup file) safe."],
  hi:["फ़ोन और 12 शब्द दोनों खो गए। अब क्या होगा?",["वॉलेट हमेशा के लिए गया","Tazvera वापस ला देगा","बैंक वापस ला देगा"],0,"अपनी चाबी वाले वॉलेट में चाबी सिर्फ़ आपके पास होती है। 12 शब्द (या वॉलेट बैकअप फ़ाइल) संभालकर रखिए।"]},
 {en:["A free \"USDT\" token suddenly appears in your wallet. What should you do?",["Ignore it, it may be fake","Sell it quickly","Claim it on its website"],0,"Fake airdrop tokens lead to scam websites. Never \"claim\" or connect your wallet to them."],
  hi:["वॉलेट में अचानक मुफ़्त \"USDT\" टोकन आ गया। क्या करें?",["छोड़ दें, नक़ली हो सकता है","जल्दी बेच दें","उसकी वेबसाइट पर claim करें"],0,"नक़ली airdrop टोकन ठगी वाली वेबसाइटों पर ले जाते हैं। उन्हें कभी claim मत कीजिए।"]},
 {en:["Before sending, how much of the address should you check?",["The whole address","Only the first 4 letters","Nothing, the app checks it"],0,"Scammers copy the start and the end of addresses. Check the whole address, or use your address book."],
  hi:["भेजने से पहले पते का कितना हिस्सा जाँचें?",["पूरा पता","सिर्फ़ पहले 4 अक्षर","कुछ नहीं, ऐप देख लेगा"],0,"ठग पते की शुरुआत और आख़िर की नक़ल करते हैं। पूरा पता जाँचिए, या पता-पुस्तिका इस्तेमाल कीजिए।"]},
 {en:["What are test network (Testnet) coins worth?",["Nothing, they are for practice","The same as real coins","Half of real coins"],0,"Test coins have no value. Practise on Testnet before using real money."],
  hi:["टेस्ट नेटवर्क (Testnet) के सिक्कों की क़ीमत?",["कुछ नहीं, ये अभ्यास के लिए हैं","असली सिक्कों जितनी","असली की आधी"],0,"टेस्ट सिक्कों की कोई क़ीमत नहीं। असली पैसे से पहले Testnet पर अभ्यास कीजिए।"]},
 {en:["You send coins to a smart-contract address by mistake. Usually…",["They are lost","They come back by themselves","Tazvera returns them"],0,"Most contracts cannot send coins back. Tazvera Shield warns you before this happens."],
  hi:["ग़लती से सिक्के स्मार्ट-कॉन्ट्रैक्ट पते पर चले गए। आम तौर पर…",["वे खो जाते हैं","अपने-आप लौट आते हैं","Tazvera लौटा देता है"],0,"ज़्यादातर कॉन्ट्रैक्ट सिक्के वापस नहीं भेज सकते। Tazvera Shield पहले ही चेतावनी देता है।"]},
 {en:["Which TZV is the real one?",["Only the official contract 0x4cC2…dE73","Any token called TZV","The one someone sells you"],0,"There is one official TZV contract. TZV is not for sale; anyone selling \"Tazvera\" coins is a scammer."],
  hi:["असली TZV कौन-सा है?",["सिर्फ़ आधिकारिक पता 0x4cC2…dE73","TZV नाम का कोई भी टोकन","जो कोई आपको बेचे"],0,"आधिकारिक TZV एक ही है। TZV बिकता नहीं; जो \"Tazvera\" सिक्का बेचे, वह ठग है।"]},
 {en:["Can a crypto payment be reversed after it is sent?",["No","Yes, by Tazvera","Yes, by the bank"],0,"Blockchain payments are final. That is why Tazvera checks everything before you send."],
  hi:["भेजा हुआ crypto भुगतान क्या वापस हो सकता है?",["नहीं","हाँ, Tazvera करेगा","हाँ, बैंक करेगा"],0,"ब्लॉकचेन भुगतान पक्के होते हैं। इसीलिए Tazvera भेजने से पहले सब जाँचता है।"]}];
Object.assign(L.en,{qzT:"Crypto Quiz",qzS:"10 quick questions. How safe are you?",qzBest:"Best: %s/10",qzNext:"Next",qzRight:"Correct!",qzWrong:"Not quite.",qzDone:"Your score: %s/10",qzGreat:"Excellent! You know how to stay safe.",qzGood:"Good! Read the answers you missed.",qzMore:"Keep learning: read the help center and try again.",qzAgain:"Try again"});
Object.assign(L.hi,{qzT:"Crypto Quiz",qzS:"10 छोटे सवाल। आप कितने सुरक्षित हैं?",qzBest:"सबसे अच्छा: %s/10",qzNext:"आगे",qzRight:"सही!",qzWrong:"यह सही नहीं।",qzDone:"आपके अंक: %s/10",qzGreat:"शानदार! आप सुरक्षित रहना जानते हैं।",qzGood:"अच्छा! जो छूटे, उनके जवाब पढ़ लीजिए।",qzMore:"सीखते रहिए: मदद केंद्र पढ़कर फिर कोशिश कीजिए।",qzAgain:"फिर से खेलें"});
function quizCard(){var b=ls("quizBest",null);return '<button class="qzc" data-quiz="1"><span>🎓</span><div><b>'+esc(t("qzT"))+'</b><small>'+esc(b!=null?t("qzBest").replace("%s",b):t("qzS"))+'</small></div>'+ic("right",16)+'</button>'}
function quizRun(){var i=0,score=0,L2=S.lang==="hi"?"hi":"en";
 function q(){var x0=QZ[i][L2],ord=[0,1,2].sort(function(){return Math.random()-.5}),x=[x0[0],ord.map(function(k){return x0[1][k]}),ord.indexOf(x0[2]),x0[3]];sheet('<div class="grab"></div><div class="sht">'+esc(t("qzT"))+' · '+(i+1)+'/'+QZ.length+'</div><div class="qzbar"><i style="width:'+((i)/QZ.length*100)+'%"></i></div><p class="qzq">'+esc(x[0])+'</p>'+x[1].map(function(o,k){return '<button class="qzo" data-qa="'+k+'">'+esc(o)+'</button>'}).join("")+'<div id="qzE"></div>');
  [].forEach.call(document.querySelectorAll("#sheet [data-qa]"),function(b){b.onclick=function(){if(b.parentNode.querySelector(".qzo.ok"))return;var k=+b.dataset.qa,ok=k===x[2];if(ok)score++;
   [].forEach.call(document.querySelectorAll("#sheet [data-qa]"),function(o){if(+o.dataset.qa===x[2])o.classList.add("ok");else if(o===b)o.classList.add("no");o.disabled=true});
   $("qzE").innerHTML='<div class="qzx '+(ok?"ok":"no")+'"><b>'+esc(ok?t("qzRight"):t("qzWrong"))+'</b> '+esc(x[3])+'</div><div style="margin-top:12px"><button class="btn" id="qzN">'+esc(i<QZ.length-1?t("qzNext"):t("done2"))+'</button></div>';
   $("qzN").onclick=function(){i++;if(i<QZ.length)q();else end()}}})}
 function end(){var b=ls("quizBest",null);if(b==null||score>b)lss("quizBest",score);
  sheet('<div class="grab"></div><div class="done" style="padding-top:8px"><div style="font-size:44px">'+(score>=9?"🏆":score>=6?"👍":"📘")+'</div><div class="sht" style="margin:4px 0 0">'+esc(t("qzDone").replace("%s",score))+'</div><p style="color:var(--mu);margin:8px 0 0">'+esc(score>=9?t("qzGreat"):score>=6?t("qzGood"):t("qzMore"))+'</p></div><div class="tda"><button class="btnw" data-sx="1">'+esc(t("done2"))+'</button><button class="btn" id="qzA">'+esc(t("qzAgain"))+'</button></div>');
  $("qzA").onclick=function(){i=0;score=0;q()};if(S.tab==="helpc")setTimeout(function(){var y=scrollY;render();scrollTo(0,y)},50)}
 q()}
document.addEventListener("click",function(e){if(e.target.closest("[data-quiz]"))quizRun()});

/* ----- Version 9: strong lock (a long password instead of the 6-digit PIN) ----- */
Object.assign(L.en,{lockSP:"Enter your password to open",slT:"Strong lock",slOn:"Password",slOff:"6-digit PIN",passT:"Enter your password",passGo:"Unlock",passOk:"OK",
 slInfo:"A long password is much harder to guess than a 6-digit PIN. Recommended if you keep real money in Tazvera. It replaces your PIN everywhere.",
 slNew:"New password (at least 10 characters)",slNew2:"Type the password again",slSet:"Use this password",slDone:"Strong lock is on",slBack:"Go back to a 6-digit PIN",slBackDone:"Back to the 6-digit PIN",slCur:"Enter your current PIN",slCurP:"Enter your current password",slTick:"I wrote this password on paper"});
Object.assign(L.hi,{lockSP:"खोलने के लिए पासवर्ड डालिए",slT:"मज़बूत ताला",slOn:"पासवर्ड",slOff:"6 अंकों का PIN",passT:"अपना पासवर्ड डालिए",passGo:"खोलें",passOk:"ठीक",
 slInfo:"लंबा पासवर्ड 6 अंकों के PIN से कहीं ज़्यादा मुश्किल से टूटता है। Tazvera में असली पैसा रखते हों, तो यही अच्छा। यह हर जगह PIN की जगह लेगा।",
 slNew:"नया पासवर्ड (कम से कम 10 अक्षर)",slNew2:"पासवर्ड दोबारा लिखिए",slSet:"यही पासवर्ड रखें",slDone:"मज़बूत ताला चालू",slBack:"वापस 6 अंकों का PIN",slBackDone:"फिर से 6 अंकों का PIN",slCur:"अपना अभी का PIN डालिए",slCurP:"अपना अभी का पासवर्ड डालिए",slTick:"मैंने यह पासवर्ड काग़ज़ पर लिख लिया"});
function passOn(){return raw("tz_lockmode","")==="pass"}
function passForm(id,btn){return '<div class="passw"><input id="'+id+'" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" aria-label="password"><button class="btn" id="'+id+'Go">'+esc(btn)+'</button></div>'}
function passBind(id,cb){var i=$(id),g=$(id+"Go");if(!i||!g)return;setTimeout(function(){try{i.focus()}catch(e){}},80);function go(){var v=i.value;if(!v)return;i.value="";cb(v)}g.onclick=go;i.onkeydown=function(e){if(e.key==="Enter")go()}}
(function(){var _ps=pinScreen,_ap=askPin,_pp=pinPad2,_np=newPinFlow;window.askPin6=_ap;
 newPinFlow=function(done){rawSet("tz_lockmode",null);_np(done)};
 pinScreen=function(title,sub,onDone,opts){if(!passOn())return _ps(title,sub,onDone,opts);opts=opts||{};var tt=(title===t("lockT"))?title:t("passT");if(sub===t("lockS"))sub=t("lockSP");
  function draw(msg,bad){$("app").innerHTML='<div class="scr on" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:12vh 24px 30px;text-align:center;box-sizing:border-box">'+(opts.back?'<button class="ib" id="pBack" style="position:absolute;left:20px;top:16px">'+ic("back",20)+'</button>':'')+'<img src="'+LOGO+'" alt="" style="width:84px;height:84px;border-radius:24px"><div class="pinw" style="margin-top:16px;width:100%;max-width:360px"><div class="pt" style="font-size:22px;font-weight:700">'+esc(tt)+'</div><div class="ps'+(bad?" e":"")+'">'+esc(msg||sub||t("passT"))+'</div>'+passForm("lp",t("passGo"))+'</div></div>';
   var bk=$("pBack");if(bk)bk.onclick=opts.back;passBind("lp",function(v){onDone(v,function(m){draw(m,true)})})}
  draw()};
 askPin=function(title,sub,cb){if(!passOn())return _ap(title,sub,cb);
  function draw(msg,bad){sheet('<div class="grab"></div><button class="ib" id="pX" style="position:absolute;right:16px;top:14px" aria-label="close">'+ic("x",18)+'</button><div class="pinw"><div class="pt">'+esc(title===t("pinT")?t("passT"):title)+'</div><div class="ps'+(bad?" e":"")+'">'+esc(msg||sub||"")+'</div>'+passForm("ap",t("passOk"))+'</div>',true);$("pX").onclick=closeSheet;passBind("ap",function(v){cb(v,function(m){draw(m,true)})})}
  draw()};
 pinPad2=function(amtTxt,ok){if(!passOn())return _pp(amtTxt,ok);
  function draw(msg,bad){sheet('<div class="grab"></div><button class="ib" id="pX" style="position:absolute;right:16px;top:14px" aria-label="close">'+ic("x",18)+'</button><div class="pinw"><div class="pt">'+esc(t("passT"))+'</div><div class="ps'+(bad?" e":"")+'">'+esc(msg||t("pinS").replace("%a",amtTxt))+'</div>'+passForm("sp",t("passOk"))+'</div>',true);var px=$("pX");if(px)px.onclick=closeSheet;
   passBind("sp",async function(v){sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("sending"))+'</div></div>',true);try{await CPW.unlock(v);ok()}catch(e){draw(t("pinBad"),true)}})}
  draw()}})();
function slSetSheet(oldSecret){var lv=0;
 sheet('<div class="grab"></div><div class="sht">'+esc(t("slT"))+'</div><p class="note2" style="text-align:left;margin:6px 2px 0">'+esc(t("slInfo"))+'</p>'+
 '<div class="lbl2" style="margin:14px 2px 6px">'+esc(t("slNew"))+'</div><div class="box inp" style="margin:0"><input id="slP1" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false"></div><div class="wbbar"><i id="slBar"></i></div><div class="wbmsg" id="slMsg"></div>'+
 '<div class="lbl2" style="margin:10px 2px 6px">'+esc(t("slNew2"))+'</div><div class="box inp" style="margin:0"><input id="slP2" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false"></div>'+
 '<label class="tick" style="color:var(--tx)"><input type="checkbox" id="slTk">'+esc(t("slTick"))+'</label><div style="margin-top:14px"><button class="btn" id="slGo" disabled>'+esc(t("slSet"))+'</button></div>');
 var p1=$("slP1"),p2=$("slP2"),go=$("slGo");
 function upd(){lv=wbkLevel(p1.value,oldSecret);var why=wbkWhy(p1.value,p2.value,oldSecret);$("slBar").className="l"+lv;$("slMsg").textContent=p1.value?(lv<2?why:(p2.value&&p2.value!==p1.value?t("wbkSame"):(lv===3?t("wbkStrong"):t("wbkOk")))):"";$("slMsg").className="wbmsg l"+lv;go.disabled=!!why||!$("slTk").checked}
 p1.oninput=p2.oninput=$("slTk").onchange=upd;
 go.onclick=async function(){if(go.disabled)return;var np=p1.value;p1.value=p2.value="";sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("making"))+'</div></div>',true);
  try{var ph=await CPW.phrase(oldSecret);await CPW.imp(ph,np);ph=null;var miss=await pinRelockAll(oldSecret,np);rawSet("tz_lockmode","pass");closeSheet();render();toast(miss?t("pinOkPart").replace("%n",miss):t("slDone"))}catch(e){closeSheet();toast(String(e&&e.message||e).slice(0,80))}}}
function slBackToPin(oldPass){var first=null;
 function ask(title){window.askPin6(t("pinT"),title,async function(p,fail){if(first===null){first=p;closeSheet();setTimeout(function(){ask(t("rePin"))},250);return}
  if(p!==first){first=null;closeSheet();toast(t("pinMis"));return}
  sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("making"))+'</div></div>',true);
  try{var ph=await CPW.phrase(oldPass);await CPW.imp(ph,p);ph=null;var miss=await pinRelockAll(oldPass,p);rawSet("tz_lockmode",null);closeSheet();render();toast(miss?t("pinOkPart").replace("%n",miss):t("slBackDone"))}catch(e){closeSheet();toast(String(e&&e.message||e).slice(0,80))}})}
 ask(t("newPin"))}
document.addEventListener("click",function(e){if(!e.target.closest("[data-slock]"))return;
 if(!passOn()){askPin(t("pinT"),t("slCur"),async function(p,fail){try{await CPW.unlock(p)}catch(x){return fail(t("pinBad"))}closeSheet();setTimeout(function(){slSetSheet(p)},250)});return}
 choose(t("slT"),[["keep",t("slOn")+" ✓"],["pin",t("slBack")]],"keep",function(v){if(v!=="pin")return;setTimeout(function(){askPin(t("passT"),t("slCurP"),async function(p,fail){try{await CPW.unlock(p)}catch(x){return fail(t("pinBad"))}closeSheet();setTimeout(function(){slBackToPin(p)},250)})},250)})});
/* wrong-password wording in strong-lock mode */
(function(){var gEn=Object.getOwnPropertyDescriptor(L.en,"pinBad"),gHi=Object.getOwnPropertyDescriptor(L.hi,"pinBad");
 try{Object.defineProperty(L.en,"pinBad",{configurable:true,get:function(){var v=gEn.get?gEn.get():gEn.value;return (passOn()&&!pinWait())?"Wrong password. Try again.":v}});
  Object.defineProperty(L.hi,"pinBad",{configurable:true,get:function(){var v=gHi.get?gHi.get():gHi.value;return (passOn()&&!pinWait())?"पासवर्ड ग़लत है। फिर कोशिश कीजिए।":v}})}catch(e){}})();

/* ----- lock screen: fingerprint and PIN no longer get in each other's way -----
   The fingerprint prompt opens by itself only once, only after the opening animation, and never if you have already
   started typing your PIN. The "Use fingerprint" button stays on the screen while you type. */
(function(){var _ls=lockScreen;lockScreen=function(){if(!(typeof BIO!=="undefined"&&BIO.on()))return _ls();
 var typed=false,busy=false;
 pinScreen(t("lockT"),t("lockS"),async function(p,fail){try{await CPW.unlock(p);try{sessionStorage.setItem("v2_unl","1")}catch(e){}render();load()}catch(e){fail(t("pinBad"))}});
 function onLock(){return !!document.querySelector("#app [data-pk], #app #lp")}
 function go2(){if(busy||!onLock())return;busy=true;BIO.unlock().then(function(){try{sessionStorage.setItem("v2_unl","1")}catch(e){}render();load()}).catch(function(){}).then(function(){busy=false})}
 function addBtn(){if(!onLock()||document.getElementById("fpBtn"))return;var b=document.createElement("button");b.id="fpBtn";b.type="button";b.className="btnw";b.style.cssText="width:auto;padding:0 18px;height:44px;margin:14px auto 0;font-size:14px;gap:8px";b.innerHTML=ic("shield",18)+esc(t("useFp"));b.onclick=function(){typed=true;go2()};var pw=document.querySelector("#app .pinw");if(pw)pw.after(b)}
 addBtn();var app=document.getElementById("app"),mo=new MutationObserver(function(){if(!onLock()){mo.disconnect();return}addBtn()});mo.observe(app,{childList:true,subtree:true});
 function k(e){if(e.target.closest&&e.target.closest("[data-pk],#lp,#lpGo")){typed=true;document.removeEventListener("pointerdown",k,true)}}document.addEventListener("pointerdown",k,true);
 setTimeout(function(){if(!typed&&!document.hidden)go2()},document.getElementById("splash")?2600:400)}})();
