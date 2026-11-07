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
 if(!miss)return '<button class="secc ok" data-tab="chk"><span class="si">'+ic("shield",20)+'</span><span class="sm"><b>'+esc(t("secOk"))+'</b><small>'+esc(t("secAll"))+'</small></span>'+ic("right",16)+'</button>';
 return '<button class="secc warn" data-tab="chk"><span class="si">'+ic("warn",20)+'</span><span class="sm"><b>'+esc(t("secLeft").replace("%n",miss))+'</b></span><span class="sf">'+esc(t("secFix"))+'</span></button>'}
function emptyCard(){if(!(S.bal===0)||(S.tzt>0)||(S.tzv>0)||txs().length)return "";var n=N();
 return '<div class="emptyc"><b>'+esc(t("emptyT"))+' 🎉</b><small>'+esc(t("emptyS"))+'</small><div class="eb"><button class="btn" data-go="recv">'+ic("recv",18)+esc(t("recv"))+'</button>'+(n.tzt?'<button class="btnw" data-fourth="1">'+esc(t("getTzt"))+'</button>':'')+'</div></div>'}

/* ----- big amount check (used by openConfirm) ----- */
function isBig(a,k){var x=parseFloat(a);if(!(x>0)||!k)return false;var n=N();if(n.test)return false;
 if(k.id==="native"&&S.inr&&x*S.inr>=1000)return true;
 if(k.bal>0&&x>=k.bal*0.5)return true;return false}
function bigBox(a,k){if(!isBig(a,k))return "";var txt=(k.id==="native"&&S.inr)?inr(parseFloat(a)*S.inr):fmt(parseFloat(a),6)+" "+k.sym;
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
 var val=(k.id==="native"&&S.inr&&!n.test&&k.bal!=null)?inr(k.bal*S.inr):"";
 var hist=txs().filter(function(x){return String(x.symbol||n.sym).toUpperCase()===String(k.sym).toUpperCase()}).slice(0,8);
 var extra=k.id==="tzt"?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("drop",18)+esc(t("getTzt"))+'</button>':(k.id==="native"&&S.net==="shardeum")?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("add",18)+esc(t("addShm"))+'</button>':(k.id==="native"&&n.test&&!n.tzt)?'<button class="btnw" data-fourth="1" style="margin-top:10px">'+ic("drop",18)+esc(t("testCoins"))+'</button>':'';
 sheet('<div class="grab"></div><div class="tdh"><span class="ci big'+(k.custom?' unv':'')+'">'+(k.img?'<img src="'+k.img+'" alt="">':'<b>'+esc(k.sym.slice(0,1))+'</b>')+'</span><div><b>'+esc(k.name)+tokBadge(k)+'</b><small>'+esc(k.sym+" · "+n.name)+'</small></div></div>'+
 '<div class="tdb"><small>'+esc(t("tdBal"))+'</small><b>'+(S.hide?"••••":esc(fmt(k.bal,6)+" "+k.sym))+'</b>'+(val&&!S.hide?'<span>'+esc(val)+'</span>':'')+'</div>'+
 (isVer(k)?'<div class="note2" style="color:var(--green);font-weight:600;margin:8px 0 0">✓ '+esc(t("tdVerS"))+'</div>':'<div class="sc warn" style="margin-top:12px">'+ic("warn",22)+'<div><small style="font-size:13px;font-weight:600">'+esc(t("tdUnvW"))+'</small></div></div>')+
 (k.addr?'<div class="kv" style="margin-top:12px"><div><span>'+esc(t("tdContract"))+'</span><b style="display:flex;gap:10px;align-items:center">'+esc(sh(k.addr))+' <button data-tkcopy="'+esc(k.addr)+'" aria-label="copy">'+ic("copy",15)+'</button><a href="'+n.exp+'/token/'+k.addr+'" target="_blank" rel="noopener" style="color:var(--green);font-size:13px">'+esc(t("tdExp"))+' ↗</a></b></div></div>':'')+
 '<div class="tda"><button class="btn" data-tksend="'+esc(k.id)+'">'+ic("send",18,2.1)+esc(t("send"))+'</button><button class="btnw" data-tkrecv="'+esc(k.id)+'">'+ic("recv",18)+esc(t("recv"))+'</button></div>'+extra+
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
 if(d.tksend){closeSheet();S.snd.tok=d.tksend;S.tab="send";H.page=true;hPush();render();window.scrollTo(0,0);return}
 if(d.tkrecv){closeSheet();if(typeof RCV==="object")RCV.tok=d.tkrecv;S.tab="recv";H.page=true;hPush();render();window.scrollTo(0,0);return}
 if(d.tkcopy){try{navigator.clipboard.writeText(d.tkcopy);toast(t("copied"))}catch(x){}return}
 if(d.exn){EXIT.sheet=false;closeSheet();setTimeout(exitArm,400);return}
 if(d.exy){EXIT.leaving=true;EXIT.sheet=false;$("sheet").classList.remove("on");$("sbg").classList.remove("on");H.sheet=false;try{history.go(-2)}catch(x){}
  setTimeout(function(){if(document.hidden)return;try{window.close()}catch(x){}EXIT.leaving=false;EXIT.off=Date.now()+15000},500)}});

/* ----- refresh without the PIN, but only inside the auto-lock time ----- */
function markAct(){try{if(sessionStorage.getItem("v2_unl")==="1")sessionStorage.setItem("v2_act",String(Date.now()))}catch(e){}}
setInterval(function(){if(!document.hidden)markAct()},15000);window.addEventListener("pagehide",markAct);document.addEventListener("click",markAct,true);
