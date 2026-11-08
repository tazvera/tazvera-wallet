/* Tazvera wallet · 28-backup.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Encrypted wallet backup file: a second way back (the 12 words stay the main backup).
   Every wallet is locked with a separate backup password using the standard Ethereum keystore (scrypt + AES).
   The file is made and opened only on this phone; it is never sent to any server. */
Object.assign(L.en,{wbkT:"Wallet backup file",wbkS:"A locked file with all your wallets. If you lose this phone, the file and its password bring your wallets back. Your 12 words remain your main backup.",
 wbkMake:"Create wallet backup file",wbkRestore:"Restore from wallet backup file",wbkPinS:"To create the backup file",
 wbkW:"File + password = your money. Keep the file in Google Drive or email it to yourself, and write the password on paper. Never give either to anyone. If you forget the password, the file is useless.",
 wbkP1:"Backup password (at least 10 characters)",wbkP2:"Type the password again",wbkShow:"Show password",wbkTick:"I wrote this password on paper",
 wbkWeak:"Weak: add letters, numbers and a symbol",wbkOk:"Good",wbkStrong:"Strong",wbkShort:"Too short: at least 10 characters",wbkDigits:"Use letters too, not only numbers",wbkSame:"Passwords do not match",wbkPinLike:"Do not use your PIN",
 wbkGo:"Create file",wbkWork:"Locking your wallets…",wbkDone:"Backup file saved",wbkDoneS:"Saved as %f. Now put it in Google Drive or email it to yourself, and keep the password on paper.",
 wbkPick:"Choose the backup file",wbkPw:"Backup password",wbkOpen:"Open",wbkBad:"This is not a Tazvera wallet backup file.",wbkWrong:"Wrong backup password. Try again.",
 wbkFound:"%n wallet(s) found in the file",wbkAdded:"%n wallet(s) restored",wbkNone:"All wallets in this file are already on this phone.",wbkOpening:"Opening the file…",done2:"Done"});
Object.assign(L.hi,{wbkT:"वॉलेट बैकअप फ़ाइल",wbkS:"आपके सारे वॉलेट की एक ताले वाली फ़ाइल। फ़ोन खो जाए, तो यह फ़ाइल और इसका पासवर्ड आपके वॉलेट वापस ले आते हैं। आपके 12 शब्द ही मुख्य बैकअप रहेंगे।",
 wbkMake:"वॉलेट बैकअप फ़ाइल बनाएँ",wbkRestore:"वॉलेट बैकअप फ़ाइल से वापस लाएँ",wbkPinS:"बैकअप फ़ाइल बनाने के लिए",
 wbkW:"फ़ाइल + पासवर्ड = आपका पैसा। फ़ाइल Google Drive में रखिए या ख़ुद को ईमेल कीजिए, और पासवर्ड काग़ज़ पर लिखिए। दोनों कभी किसी को न दें। पासवर्ड भूले, तो फ़ाइल बेकार।",
 wbkP1:"बैकअप पासवर्ड (कम से कम 10 अक्षर)",wbkP2:"पासवर्ड दोबारा लिखिए",wbkShow:"पासवर्ड दिखाएँ",wbkTick:"मैंने यह पासवर्ड काग़ज़ पर लिख लिया",
 wbkWeak:"कमज़ोर: अक्षर, अंक और कोई चिह्न जोड़िए",wbkOk:"ठीक",wbkStrong:"मज़बूत",wbkShort:"छोटा है: कम से कम 10 अक्षर",wbkDigits:"सिर्फ़ अंक नहीं, अक्षर भी डालिए",wbkSame:"दोनों पासवर्ड एक जैसे नहीं",wbkPinLike:"अपना PIN इस्तेमाल मत कीजिए",
 wbkGo:"फ़ाइल बनाएँ",wbkWork:"वॉलेट पर ताला लगा रहे हैं…",wbkDone:"बैकअप फ़ाइल सेव हो गई",wbkDoneS:"%f नाम से सेव हुई। अब इसे Google Drive में रखिए या ख़ुद को ईमेल कीजिए, और पासवर्ड काग़ज़ पर रखिए।",
 wbkPick:"बैकअप फ़ाइल चुनिए",wbkPw:"बैकअप पासवर्ड",wbkOpen:"खोलें",wbkBad:"यह Tazvera वॉलेट बैकअप फ़ाइल नहीं है।",wbkWrong:"बैकअप पासवर्ड ग़लत है। फिर कोशिश कीजिए।",
 wbkFound:"फ़ाइल में %n वॉलेट मिले",wbkAdded:"%n वॉलेट वापस आ गए",wbkNone:"इस फ़ाइल के सारे वॉलेट पहले से इस फ़ोन में हैं।",wbkOpening:"फ़ाइल खोल रहे हैं…",done2:"हो गया"});

var WBK_TYPE="tazvera-wallet-backup";
/* 0 = not allowed, 1 = weak, 2 = good, 3 = strong */
function wbkLevel(p,pin){p=String(p||"");if(p.length<10||/^\d+$/.test(p)||(pin&&p.indexOf(pin)>=0))return 0;var s=0;if(/[a-zA-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p)||/[a-z]/.test(p)&&/[A-Z]/.test(p))s++;if(p.length>=14)s++;return s<=1?1:(s===2?2:3)}
function wbkWhy(p,q,pin){p=String(p||"");if(p.length<10)return t("wbkShort");if(/^\d+$/.test(p))return t("wbkDigits");if(pin&&p.indexOf(pin)>=0)return t("wbkPinLike");if(wbkLevel(p,pin)<2)return t("wbkWeak");if(q!==p)return t("wbkSame");return ""}

/* ---- make the file ---- */
function wbkMake(){askPin(t("pinT"),t("wbkPinS"),async function(pin,fail){try{await CPW.unlock(pin)}catch(e){return fail(t("pinBad"))}try{wSyncActive()}catch(e){}wbkPwSheet(pin)})}
function wbkPwSheet(pin){
 sheet('<div class="grab"></div><div class="sht">'+esc(t("wbkT"))+'</div><div class="sc warn">'+ic("warn",22)+'<div><small style="font-size:13px;font-weight:600">'+esc(t("wbkW"))+'</small></div></div>'+
 '<div class="lbl2" style="margin:14px 2px 6px">'+esc(t("wbkP1"))+'</div><div class="box inp" style="margin:0"><input id="wbP1" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false"></div>'+
 '<div class="wbbar"><i id="wbBar"></i></div><div class="wbmsg" id="wbMsg"></div>'+
 '<div class="lbl2" style="margin:10px 2px 6px">'+esc(t("wbkP2"))+'</div><div class="box inp" style="margin:0"><input id="wbP2" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false"></div>'+
 '<label class="tick" style="color:var(--tx)"><input type="checkbox" id="wbShow">'+esc(t("wbkShow"))+'</label><label class="tick" style="color:var(--tx)"><input type="checkbox" id="wbTick">'+esc(t("wbkTick"))+'</label>'+
 '<div style="margin-top:14px"><button class="btn" id="wbGo" disabled>'+ic("dl",19)+esc(t("wbkGo"))+'</button></div>');
 var p1=$("wbP1"),p2=$("wbP2"),go=$("wbGo");
 function upd(){var lv=wbkLevel(p1.value,pin),why=wbkWhy(p1.value,p2.value,pin),bar=$("wbBar");bar.className="l"+lv;
  $("wbMsg").textContent=p1.value?(lv===0||lv===1?why:(p2.value&&p2.value!==p1.value?t("wbkSame"):(lv===3?t("wbkStrong"):t("wbkOk")))):"";$("wbMsg").className="wbmsg l"+lv;
  go.disabled=!!why||!$("wbTick").checked}
 p1.oninput=p2.oninput=$("wbTick").onchange=upd;
 $("wbShow").onchange=function(){p1.type=p2.type=this.checked?"text":"password"};
 go.onclick=function(){if(go.disabled)return;var pw=p1.value;p1.value=p2.value="";wbkBuild(pin,pw)}}
async function wbkBuild(pin,pw){var l=wList(),out=[];
 try{for(var i=0;i<l.length;i++){sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("wbkWork"))+'</div><div class="ps">'+(i+1)+' / '+l.length+'</div></div>',true);
   var w=await ethers.Wallet.fromEncryptedJson(l[i].ks,pin);out.push({name:l[i].name,addr:w.address,ks:await w.encrypt(pw)})}
  var day=new Date().toISOString().slice(0,10),name="tazvera-wallet-backup-"+day+".json",o={app:"Tazvera",type:WBK_TYPE,v:1,time:new Date().toISOString(),note:"Locked with your backup password (standard Ethereum keystore). Keep it private.",wallets:out};
  var b=new Blob([JSON.stringify(o,null,1)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},1500);
  closeSheet();setTimeout(function(){sheet('<div class="grab"></div><div class="done" style="padding-top:8px"><div class="sht" style="margin:0">✅ '+esc(t("wbkDone"))+'</div><p style="color:var(--mu);margin:8px 0 0;line-height:1.55">'+esc(t("wbkDoneS").replace("%f",name))+'</p></div><div style="margin-top:14px"><button class="btn" data-sx="1">'+esc(t("done2"))+'</button></div>')},300)}
 catch(e){closeSheet();toast(String(e&&e.message||e).slice(0,80))}}

/* ---- open the file (new phone, or add to this phone) ---- */
function wbkRestore(){var inp=document.createElement("input");inp.type="file";inp.accept=".json,application/json";inp.style.display="none";document.body.appendChild(inp);
 inp.onchange=function(){var f=inp.files&&inp.files[0];inp.remove();if(!f)return;var r=new FileReader();r.onload=function(){var o=null;try{o=JSON.parse(r.result)}catch(e){}
  if(!o||o.app!=="Tazvera"||o.type!==WBK_TYPE||!Array.isArray(o.wallets)||!o.wallets.length||!o.wallets.every(function(x){return x&&typeof x.ks==="string"})){toast(t("wbkBad"));return}wbkPwAsk(o)};r.readAsText(f)};inp.click()}
function wbkPwAsk(o){
 sheet('<div class="grab"></div><div class="sht">'+esc(t("wbkRestore"))+'</div><div class="note2" style="margin:4px 0 0">'+esc(t("wbkFound").replace("%n",o.wallets.length))+'</div>'+
 '<div class="lbl2" style="margin:14px 2px 6px">'+esc(t("wbkPw"))+'</div><div class="box inp" style="margin:0"><input id="wbR" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false"></div><div class="err" id="wbRE" style="margin:8px 2px 0"></div>'+
 '<div style="margin-top:14px"><button class="btn" id="wbRGo">'+esc(t("wbkOpen"))+'</button></div>');
 $("wbRGo").onclick=async function(){var pw=$("wbR").value,btn=this;if(!pw)return;btn.disabled=true;btn.textContent=t("wbkOpening");var ws=[];
  try{for(var i=0;i<o.wallets.length;i++){var w=await ethers.Wallet.fromEncryptedJson(o.wallets[i].ks,pw);ws.push({name:String(o.wallets[i].name||"").slice(0,30),w:w})}}
  catch(e){btn.disabled=false;btn.textContent=t("wbkOpen");$("wbRE").textContent=t("wbkWrong");return}
  $("wbR").value="";closeSheet();
  if(S.addr&&S.mode==="inapp"){askPin(t("pinT"),t("samePin"),async function(pin,fail){try{await CPW.unlock(pin)}catch(e){return fail(t("pinBad"))}await wbkSave(ws,pin,false)})}
  else newPinFlow(function(pin){wbkSave(ws,pin,true)})}}
async function wbkSave(ws,pin,fresh){
 var busy='<div class="wel"><img src="'+LOGO+'" alt=""><h1 style="font-size:20px">'+esc(t("making"))+'</h1></div>';if(fresh)$("app").innerHTML=busy;else sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("making"))+'</div></div>',true);
 try{try{wSyncActive()}catch(e){}var l=fresh?[]:wList(),have={},added=0,first=null;l.forEach(function(x){have[String(x.addr).toLowerCase()]=1});
  for(var i=0;i<ws.length;i++){var a=ws[i].w.address;if(have[a.toLowerCase()])continue;var id="w"+Date.now()+"_"+i;l.push({id:id,name:ws[i].name||(t("wallet")+" "+(l.length+1)),ks:await ws[i].w.encrypt(pin),addr:a});have[a.toLowerCase()]=1;added++;if(!first)first=l[l.length-1]}
  if(!added){if(!fresh)closeSheet();toast(t("wbkNone"));if(fresh)render();return}
  wSave(l);var act=fresh?l[0]:first;rawSet("cp3_inapp_keystore",act.ks);rawSet("cp3_v2_active",act.id);
  await CPW.unlock(pin);try{sessionStorage.setItem("v2_unl","1")}catch(e){}S.addr=CPW.address();S.mode="inapp";S.bal=null;S.tzt=null;S.tzv=null;S.cust=[];S.tab="home";
  if(!fresh)closeSheet();render();load();toast(t("wbkAdded").replace("%n",added))}
 catch(e){if(!fresh)closeSheet();toast(String(e&&e.message||e).slice(0,80));if(fresh)render()}}

/* ---- where the buttons live: Settings → Backup & restore, and the welcome screen ---- */
(function(){var _bk=bkSheet;bkSheet=function(){_bk();var sh=$("sheet"),ttl=sh&&sh.querySelector(".sht");if(!ttl)return;var d=document.createElement("div");d.className="wbk";
 d.innerHTML='<div class="wbkh"><span>'+ic("lock",20)+'</span><div><b>'+esc(t("wbkT"))+'</b><small>'+esc(t("wbkS"))+'</small></div></div>'+(S.mode==="inapp"?'<button class="btn" data-wbke="1">'+ic("dl",19)+esc(t("wbkMake"))+'</button>':'')+'<button class="btnw" data-wbkr="1">'+esc(t("wbkRestore"))+'</button>';
 ttl.after(d)}})();
(function(){var _wel=welHTML;welHTML=function(){var h=_wel();if(h.indexOf('data-wimp="1"')<0)return h;return h.replace(/(<button class="btnw" data-wimp="1">[^<]*<\/button>)/,'$1<button class="wlnk" data-wbkr="1">'+esc(t("wbkRestore"))+'</button>')}})();
document.addEventListener("click",function(e){var el=e.target.closest("[data-wbke],[data-wbkr]");if(!el)return;if(el.dataset.wbke){closeSheet();setTimeout(wbkMake,250);return}if(S.addr)closeSheet();setTimeout(wbkRestore,S.addr?250:0)});
