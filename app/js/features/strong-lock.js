/* Tazvera wallet · app/js/features/strong-lock.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Strong lock: a long password instead of the PIN. / मज़बूत ताला (पासवर्ड)। */
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
