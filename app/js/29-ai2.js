/* Tazvera wallet · 29-ai2.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Tazvera Assistant 2.0
   - Wallet questions (balance, recent activity, fee now, prices) are answered by the app itself, on this phone.
     Those answers never go to any server, and they are never sent to the AI later either.
   - Other questions go to /api/ai as before (only the question text).
   - Chats are kept on this phone only (last 20), so they can be opened again from History.
   - Every answer can show one-tap buttons (Send, Receive, Chart, Quiz…). Information, never advice. */

/* ---- a friendlier, polished assistant icon ---- */
AI_SVG='<svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
 '<linearGradient id="tzaiG1" x1="12" y1="14" x2="52" y2="54" gradientUnits="userSpaceOnUse"><stop stop-color="#5BE88A"/><stop offset=".55" stop-color="#14C8A8"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient>'+
 '<linearGradient id="tzaiG2" x1="32" y1="2" x2="32" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#FDE047"/><stop offset="1" stop-color="#F59E0B"/></linearGradient>'+
 '<radialGradient id="tzaiG3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(4)"><stop stop-color="#fff"/><stop offset="1" stop-color="#A5F3FC"/></radialGradient></defs>'+
 '<ellipse cx="32" cy="58" rx="17" ry="3.2" fill="#000" opacity=".18"/>'+
 '<path d="M32 13V7.5" stroke="#0B1D3A" stroke-width="2.6" stroke-linecap="round"/><circle cx="32" cy="6" r="4" fill="url(#tzaiG2)"/><circle cx="30.8" cy="4.8" r="1.2" fill="#fff" opacity=".8"/>'+
 '<rect x="4.5" y="27" width="6" height="14" rx="3" fill="#0EA5E9"/><rect x="53.5" y="27" width="6" height="14" rx="3" fill="#0EA5E9"/>'+
 '<rect x="9" y="13" width="46" height="41" rx="15" fill="url(#tzaiG1)"/>'+
 '<path d="M17 17.5c4-2.6 9.5-3.4 15-3.4s11 .8 15 3.4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>'+
 '<rect x="15" y="22" width="34" height="24" rx="10" fill="#0B1D3A"/>'+
 '<g transform="translate(24.5 32)"><rect x="-3.2" y="-4.6" width="6.4" height="9.2" rx="3.2" fill="url(#tzaiG3)"/></g>'+
 '<g transform="translate(39.5 32)"><rect x="-3.2" y="-4.6" width="6.4" height="9.2" rx="3.2" fill="url(#tzaiG3)"/></g>'+
 '<path d="M27 40.2c3 2.2 7 2.2 10 0" stroke="#5BE88A" stroke-width="2.4" stroke-linecap="round"/>'+
 '<path d="M53 9.5l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" fill="#FDE047"/></svg>';

Object.assign(AI_TX.en,{online:"Ready to help",hist:"History",newc:"New chat",noHist:"No saved chats yet.",clearAll:"Delete all chats",clearQ:"Delete all saved chats on this phone?",
 note2:"Information, not advice. AI can make mistakes. Never type your 12 words, PIN or private key.",
 hello2:"Namaste 👋 I'm the Tazvera Assistant. Ask about your wallet or about crypto, in any language.",
 q2:["What is my balance?","Show my recent activity","What is the BTC price?","How much is the network fee now?","What are the 12 words?","How do I avoid scams?"],
 bal:"Your balance on %n:",noWal:"Open or create a wallet first, then ask again.",balLoad:"Your balance is still loading. Try again in a moment.",
 act:"Your last %c transactions on %n:",noAct:"No transactions yet on %n.",inW:"Received",outW:"Sent",
 fee:"A normal payment on %n costs about %f right now. It goes to the network, not to Tazvera.",feeNo:"I could not read the fee right now. Check the internet and try again.",
 price:"%c is about %p (24h %h).",priceNo:"I don't have the %c price right now.",tzvP:"TZV is not for sale and has no market price. It is given as rewards. Only the official contract 0x4cC2…dE73 is real.",
 notAdv:"For information only, not advice.",
 aSend:"Send",aRecv:"Receive",aChart:"Price chart",aQuiz:"Crypto Quiz",aAct:"Activity",aFee:"Network fee",aBk:"Backup",aWords:"12 words",aHelp:"Help center"});
Object.assign(AI_TX.hi,{online:"मदद के लिए तैयार",hist:"इतिहास",newc:"नई बातचीत",noHist:"अभी कोई सेव बातचीत नहीं।",clearAll:"सारी बातचीत मिटाएँ",clearQ:"इस फ़ोन की सारी सेव बातचीत मिटा दें?",
 note2:"यह जानकारी है, सलाह नहीं। AI ग़लती कर सकता है। अपने 12 शब्द, PIN या चाबी कभी न लिखें।",
 hello2:"नमस्ते 👋 मैं Tazvera सहायक हूँ। अपने वॉलेट या crypto के बारे में कुछ भी पूछिए, किसी भी भाषा में।",
 q2:["मेरा बैलेंस कितना है?","पिछले लेन-देन दिखाओ","BTC का भाव क्या है?","अभी नेटवर्क फ़ीस कितनी है?","12 शब्द क्या हैं?","ठगी से कैसे बचें?"],
 bal:"%n पर आपका बैलेंस:",noWal:"पहले वॉलेट खोलिए या बनाइए, फिर पूछिए।",balLoad:"बैलेंस अभी लोड हो रहा है। एक पल बाद फिर पूछिए।",
 act:"%n पर आपके पिछले %c लेन-देन:",noAct:"%n पर अभी कोई लेन-देन नहीं।",inW:"मिला",outW:"भेजा",
 fee:"%n पर अभी एक आम भुगतान की फ़ीस लगभग %f है। यह नेटवर्क को जाती है, Tazvera को नहीं।",feeNo:"अभी फ़ीस नहीं पढ़ पाया। इंटरनेट देखकर फिर कोशिश कीजिए।",
 price:"%c लगभग %p पर है (24 घंटे में %h)।",priceNo:"अभी %c का भाव मेरे पास नहीं है।",tzvP:"TZV बिकता नहीं और इसका कोई बाज़ार भाव नहीं है। यह इनाम के तौर पर मिलता है। सिर्फ़ आधिकारिक पता 0x4cC2…dE73 असली है।",
 notAdv:"सिर्फ़ जानकारी, सलाह नहीं।",
 aSend:"भेजें",aRecv:"पाएँ",aChart:"भाव का ग्राफ़",aQuiz:"Crypto Quiz",aAct:"गतिविधि",aFee:"नेटवर्क फ़ीस",aBk:"बैकअप",aWords:"12 शब्द",aHelp:"मदद केंद्र"});

/* ---- saved chats (this phone only) ---- */
var AIH="tz_ai_chats";
function aiChats(){try{var l=JSON.parse(localStorage.getItem(AIH)||"[]");return Array.isArray(l)?l:[]}catch(e){return[]}}
function aiSaveCur(){if(!AI.cur||!AI.cur.msgs.some(function(m){return m.role==="user"}))return;var l=aiChats().filter(function(c){return c.id!==AI.cur.id});AI.cur.t=Date.now();l.unshift(AI.cur);
 try{localStorage.setItem(AIH,JSON.stringify(l.slice(0,20)))}catch(e){}}
function aiNew(){AI.cur={id:"c"+Date.now(),title:"",t:Date.now(),msgs:[]}}

/* ---- one-tap actions ---- */
var AIACT={
 send:function(){closeSheet();setTimeout(function(){S.tab="send";render();window.scrollTo(0,0);if(typeof estFee==="function")estFee()},260)},
 recv:function(){closeSheet();setTimeout(function(){S.tab="recv";render();window.scrollTo(0,0)},260)},
 act:function(){closeSheet();setTimeout(function(){S.tab="act";render();window.scrollTo(0,0)},260)},
 quiz:function(){closeSheet();setTimeout(function(){if(typeof quizRun==="function")quizRun()},260)},
 fee:function(){closeSheet();setTimeout(function(){if(typeof tool==="function")tool("nfee")},260)},
 bk:function(){closeSheet();setTimeout(function(){if(typeof bkSheet==="function")bkSheet()},260)},
 words:function(){closeSheet();setTimeout(function(){if(typeof wordsSheet==="function")wordsSheet()},260)},
 help:function(){closeSheet();setTimeout(function(){S.tab="helpc";render();window.scrollTo(0,0)},260)}};
function aiActLabel(a){if(a.indexOf("chart:")===0)return AI_T.aChart+" · "+a.slice(6);return AI_T[{send:"aSend",recv:"aRecv",act:"aAct",quiz:"aQuiz",fee:"aFee",bk:"aBk",words:"aWords",help:"aHelp"}[a]]||a}
function aiDo(a){if(a.indexOf("chart:")===0){var s=a.slice(6);closeSheet();setTimeout(function(){if(typeof chartSheet==="function")chartSheet(s,1)},260);return}if(AIACT[a])AIACT[a]()}
/* buttons that fit the question */
function aiActsFor(q){q=String(q||"").toLowerCase();var a=[];
 if(/(send|भेज|bhej|transfer|पैसे भेज)/.test(q))a.push("send");
 if(/(receive|qr|पा(ना|एँ|ऊँ)|address|पता|मँगा|request)/.test(q))a.push("recv");
 if(/(quiz|क्विज़|क्विज|test my)/.test(q))a.push("quiz");
 if(/(backup|बैकअप|फ़ोन खो|phone lost|lose my phone)/.test(q))a.push("bk");
 if(/(12 ?words|12 शब्द|seed|recovery|गुप्त शब्द)/.test(q))a.push("words");
 if(/(scam|ठग|fraud|धोखा|safe|सुरक्ष)/.test(q))a.push("quiz");
 if(/(fee|फ़ीस|फीस|gas|गैस)/.test(q))a.push("fee");
 return a.filter(function(x,i){return a.indexOf(x)===i}).slice(0,3)}

/* ---- answers the app gives by itself (private: never sent anywhere) ---- */
var AICOIN=[["BTC",/(\bbtc\b|bitcoin|बिटकॉइन|बिटकॉईन)/],["ETH",/(\beth\b|ethereum|ईथर|एथेरियम)/],["BNB",/(\bbnb\b|binance coin|बीएनबी)/],["USDT",/(usdt|tether|टेथर)/],["SHM",/(\bshm\b|shardeum|शार्डियम|शारडियम)/],["TZV",/(\btzv\b|tazvera token|टीज़ेडवी)/]];
function aiCoinPrice(sym){var C=curC(),mk=S.mk||{},id={BTC:"bitcoin",ETH:"ethereum",BNB:"binancecoin",USDT:"tether"}[sym];
 if(sym==="SHM")return{p:dpx(),h:S.chg};if(id&&mk[id])return{p:mk[id][C],h:mk[id][C+"_24h_change"]};return null}
async function aiLocal2(text){var q=String(text||"").toLowerCase(),n=N(),k,lines;
 var isQ=/(\?|kya|क्या|kitn|कितन|how much|what|show|दिखा|बता|check|my |मेरा|मेरे|मुझे)/.test(q);
 /* balance */
 if(/(balance|बैलेंस|बैलन्स|शेष राशि|kitna paisa|कितना पैसा|मेरे पास कितन|portfolio|पोर्टफोलियो|my coins|मेरे सिक्के)/.test(q)){
  if(!S.addr)return{text:AI_T.noWal,acts:[]};var tk=tokens();if(S.bal==null)return{text:AI_T.balLoad,acts:[]};
  lines=[AI_T.bal.replace("%n",n.name)];tk.forEach(function(x){if(x.bal==null)return;var v=(x.id==="native"&&!n.test&&dpx())?" ≈ "+money(x.bal*dpx()):"";lines.push("• "+fmt(x.bal,4)+" "+x.sym+v)});
  if(n.test)lines.push(t("testc"));return{text:lines.join("\n"),acts:["send","recv","chart:SHM"]}}
 /* recent activity */
 if(/(transaction|लेन.?देन|history|हिस्ट्री|pichl|पिछल|recent|activity|गतिविधि|last payment|आख़िरी भुगतान)/.test(q)&&isQ){
  if(!S.addr)return{text:AI_T.noWal,acts:[]};var l=(typeof txs==="function"?txs():[]).slice(0,5);if(!l.length)return{text:AI_T.noAct.replace("%n",n.name),acts:["recv"]};
  lines=[AI_T.act.replace("%c",l.length).replace("%n",n.name)];l.forEach(function(x){var d=new Date(x.time||0);lines.push("• "+(isIn(x)?AI_T.inW+" +":AI_T.outW+" −")+(isNaN(parseFloat(x.amt))?x.amt:fmt(parseFloat(x.amt),4))+" "+x.symbol+" · "+d.toLocaleDateString(S.lang==="hi"?"hi-IN":"en-IN",{day:"numeric",month:"short"})+" "+d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}))});
  return{text:lines.join("\n"),acts:["act"]}}
 /* fee right now */
 if(/(fee|फ़ीस|फीस|gas|गैस)/.test(q)&&/(kitn|कितन|how much|now|abhi|अभी|current|today|आज)/.test(q)){
  try{var gp=BigInt(await rpc(n.rpc,"eth_gasPrice",[])),f=Number(gp*21000n)/1e18;var fs=ffee(f)+" "+n.sym+((!n.test&&dpx())?" (≈ "+money(f*dpx())+")":"");return{text:AI_T.fee.replace("%n",n.name).replace("%f",fs),acts:["fee","send"]}}catch(e){return{text:AI_T.feeNo,acts:["fee"]}}}
 /* price of a coin */
 if(/(price|भाव|rate|रेट|kitne ka|कितने का|कीमत|क़ीमत|value|मूल्य)/.test(q)){
  for(var i=0;i<AICOIN.length;i++){if(!AICOIN[i][1].test(q))continue;var sym=AICOIN[i][0];if(sym==="TZV")return{text:AI_T.tzvP,acts:[]};
   if(typeof loadMk==="function"){try{await loadMk()}catch(e){}}var pr=aiCoinPrice(sym);
   if(!pr||!(pr.p>0))return{text:AI_T.priceNo.replace("%c",sym),acts:["chart:"+sym]};
   var h=pr.h==null?"—":((pr.h>=0?"+":"")+fmt(pr.h,2)+"%");return{text:AI_T.price.replace("%c",sym).replace("%p",money(pr.p)).replace("%h",h)+"\n"+AI_T.notAdv,acts:["chart:"+sym]}}}
 return null}

/* ---- chat window ---- */
function aiBubble(m){var log=document.getElementById("aiLog");if(!log)return null;var row=document.createElement("div");row.className="aim "+(m.role==="user"?"u":"b");
 if(m.role!=="user"){var av=document.createElement("span");av.className="aiav";av.innerHTML=AI_SVG;row.appendChild(av)}
 var wrap=document.createElement("div");wrap.className="aiw";var d=document.createElement("div");d.className="aib"+(m.err?" e":"");d.textContent=m.text;wrap.appendChild(d);
 if(m.acts&&m.acts.length){var c=document.createElement("div");c.className="aiacts";m.acts.forEach(function(a){var b=document.createElement("button");b.type="button";b.textContent=aiActLabel(a)+" ›";b.onclick=function(){aiDo(a)};c.appendChild(b)});wrap.appendChild(c)}
 if(m.role==="model"&&!m.err&&!m.local&&typeof aiBtn==="function")aiBtn(wrap,m.text);
 row.appendChild(wrap);log.appendChild(row);log.scrollTop=log.scrollHeight;return d}
function aiEmpty(){var log=document.getElementById("aiLog");if(!log)return;log.innerHTML='<div class="aiempty"><span class="aibig">'+AI_SVG+'</span><p>'+esc(AI_T.hello2)+'</p><div class="aisug">'+AI_T.q2.map(function(q,i){return '<button data-aiq2="'+i+'">'+esc(q)+'</button>'}).join("")+'</div></div>';
 [].forEach.call(log.querySelectorAll("[data-aiq2]"),function(b){b.onclick=function(){aiAsk2(AI_T.q2[+b.getAttribute("data-aiq2")])}})}
function aiRedraw(){var log=document.getElementById("aiLog");if(!log)return;log.innerHTML="";if(!AI.cur.msgs.length){aiEmpty();return}AI.cur.msgs.forEach(aiBubble)}
async function aiAsk2(text){text=String(text||"").trim().slice(0,500);if(!text||AI.busy)return;var inp=document.getElementById("aiIn");if(inp)inp.value="";
 if(!AI.cur.msgs.length){var log=document.getElementById("aiLog");if(log)log.innerHTML=""}
 if(aiSecret(text)){aiBubble({role:"model",text:AI_T.eSecret,err:true});return}
 var um={role:"user",text:text};AI.cur.msgs.push(um);if(!AI.cur.title)AI.cur.title=text.slice(0,48);aiBubble(um);
 AI.busy=true;var loc=null;try{loc=await aiLocal2(text)}catch(e){loc=null}
 if(loc){um.local=true;var lm={role:"model",text:loc.text,acts:loc.acts,local:true};AI.cur.msgs.push(lm);aiBubble(lm);AI.busy=false;aiSaveCur();return}
 var w=aiBubble({role:"model",text:AI_T.think});
 /* only real questions and AI answers go to the server; private wallet answers never do */
 var send=AI.cur.msgs.filter(function(m){return !m.local&&!m.err}).slice(-8).map(function(m){return{role:m.role,text:m.text}});
 fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:send,lang:S.lang==="hi"?"hi":"en"})}).then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})}).then(function(x){AI.busy=false;
  var row=w&&w.closest?w.closest(".aim"):null;if(row)row.remove();
  if(x.s===200&&x.j&&typeof x.j.text==="string"){var mm={role:"model",text:x.j.text,acts:aiActsFor(text)};AI.cur.msgs.push(mm);aiBubble(mm);aiSaveCur()}
  else{um.local=true;var em=x.s===503?AI_T.eOff:x.s===429?AI_T.eSlow:x.s===422?AI_T.eSecret:AI_T.eNet;aiBubble({role:"model",text:em,err:true,acts:aiActsFor(text)})}})
 .catch(function(){AI.busy=false;var row=w&&w.closest?w.closest(".aim"):null;if(row)row.remove();um.local=true;aiBubble({role:"model",text:AI_T.eNet,err:true,acts:aiActsFor(text)})})}
function aiHist(){var l=aiChats();sheet('<div class="grab"></div><button class="ib" id="aiHB" aria-label="back" style="position:absolute;left:16px;top:14px">'+ic("back",20)+'</button><div class="sht">'+esc(AI_T.hist)+'</div>'+
 (l.length?'<div class="card" style="margin:10px 0 0">'+l.map(function(c,i){var d=new Date(c.t||0);return '<button class="srow" data-aih="'+i+'"><span class="si">'+ic("act",18)+'</span><b style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(c.title||AI_T.newc)+'</b><em>'+esc(d.toLocaleDateString(S.lang==="hi"?"hi-IN":"en-IN",{day:"numeric",month:"short"}))+'</em></button>'}).join("")+'</div><button class="btnw" id="aiClr" style="margin-top:12px;color:var(--red)">'+esc(AI_T.clearAll)+'</button>':'<div class="empty" style="margin-top:14px">'+esc(AI_T.noHist)+'</div>'));
 $("aiHB").onclick=function(){aiSheet2()};[].forEach.call(document.querySelectorAll("#sheet [data-aih]"),function(b){b.onclick=function(){var c=aiChats()[+b.getAttribute("data-aih")];if(c){AI.cur=JSON.parse(JSON.stringify(c))}aiSheet2()}});
 var cl=$("aiClr");if(cl)cl.onclick=function(){if(!confirm(AI_T.clearQ))return;try{localStorage.removeItem(AIH)}catch(e){}aiNew();aiHist()}}
function aiSheet2(){aiLang();if(!AI.cur)aiNew();
 sheet('<div class="grab"></div><div class="aihd"><button class="ib" data-sx="1" aria-label="back">'+ic("back",20)+'</button><span class="aihav">'+AI_SVG+'</span><div class="aiht"><b>'+esc(AI_T.name)+'</b><small><i></i>'+esc(AI_T.online)+'</small></div><button class="ib" id="aiH" aria-label="'+esc(AI_T.hist)+'">'+ic("act",19)+'</button><button class="ib" id="aiN" aria-label="'+esc(AI_T.newc)+'">'+ic("add",19)+'</button></div>'+
  '<div id="aiLog" class="ailog"></div>'+
  '<div class="aiin"><input id="aiIn" maxlength="500" autocomplete="off" placeholder="'+esc(AI_T.ph)+'"><button id="aiGo" aria-label="'+esc(AI_T.send)+'">'+ic("up",20,2.4)+'</button></div>'+
  '<div class="note2" style="margin-top:8px">'+esc(AI_T.note2)+'</div>');
 aiRedraw();var go=$("aiGo"),inp=$("aiIn");go.onclick=function(){aiAsk2(inp.value)};inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();aiAsk2(inp.value)}};
 $("aiH").onclick=aiHist;$("aiN").onclick=function(){aiSaveCur();aiNew();aiRedraw()}}
/* the new window replaces the old one everywhere; wallet answers work even when the online AI is off */
aiSheet=aiSheet2;aiOpen=function(){aiSheet2()};aiAsk=aiAsk2;
