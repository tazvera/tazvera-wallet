/* Tazvera wallet · 10-send.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- SEND ---------- */
var COLORS=["#F59E0B,#EF4444","#6366F1,#06B6D4","#10B981,#84CC16","#EC4899,#8B5CF6"];
function contacts(){var c=ls("contacts",[]);return Array.isArray(c)?c.filter(function(x){return x&&/^0x[0-9a-fA-F]{40}$/.test(x.a||"")}):[]}
function sentList(){try{return JSON.parse(raw("tz_sent_to","[]"))}catch(e){return[]}}
function nameOf(a){var lo=String(a).toLowerCase(),c=contacts().find(function(x){return x.a.toLowerCase()===lo});return c?c.n:""}
function curTok(){var k=tokens().find(function(x){return x.id===S.snd.tok});return k||tokens()[0]}
function sendHTML(){var k=curTok(),n=N(),cs=contacts().slice(0,4);var inrMode=S.snd.cur==="inr"&&rsOK();
 return '<div class="tb"><button class="ib" data-tab="home" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("send"))+'</b></div>'+
 '<div class="one"><div class="lb3">'+esc(t("coin"))+'</div><button class="tok" data-tokpick="1">'+(k.img?'<img src="'+k.img+'" alt="">':'<span class="ci"><b>'+esc(k.sym.slice(0,1))+'</b></span>')+'<div style="flex:1;text-align:left"><b>'+esc(k.name+" · "+k.sym)+'</b><small>'+esc(t("bal"))+' '+esc(fmt(k.bal,4))+' '+esc(k.sym)+'</small></div>'+ic("chev",20)+'</button>'+
 '<div class="lb3">'+esc(t("to"))+'</div><div class="inp"><input id="sTo" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+esc(t("toPh"))+'" value="'+esc(S.snd.to)+'"><button class="ib2" data-paste="1" aria-label="paste">'+ic("paste",18)+'</button><button class="ib2" data-scan="1" aria-label="scan">'+ic("scan",18)+'</button></div></div>'+
 (cs.length?'<div class="chips">'+cs.map(function(c,i){return '<button class="chip2" data-pickc="'+esc(c.a)+'"><span class="av" style="background:linear-gradient(135deg,'+COLORS[i%4]+')">'+esc((c.n||"?").slice(0,1).toUpperCase())+'</span>'+esc(c.n)+'</button>'}).join("")+'</div>':'')+
 '<div class="big3">'+(inrMode?'<span class="rs">₹</span><input id="sAmt" inputmode="decimal" placeholder="0" value="'+esc(S.snd.rs)+'">':'<input id="sAmt" inputmode="decimal" placeholder="0" value="'+esc(S.snd.amt)+'"><span>'+esc(k.sym)+'</span>')+'</div>'+
 '<div class="sub3"><span id="sInr">'+amtInr()+'</span>'+(rsOK()?'<button class="max" data-cur="1">'+(inrMode?esc(k.sym):"₹")+'</button>':'')+'<button class="max" data-max="1">MAX</button></div>'+
 '<div class="fee"><span>'+esc(t("fee"))+'</span><b id="sFee">'+feeTxt()+'</b></div><div id="sWarn">'+feeWarn()+'</div><div class="err" id="sErr">'+esc(S.snd.err)+'</div>'+
 '<div class="bar"><button class="btn" data-cont="1"'+(lowFee()?' disabled':'')+'>'+esc(t("cont"))+'</button></div>'}
function lowFee(){var n=N(),k=curTok(),a=parseFloat(S.snd.amt)||0;if(S.bal==null||S.snd.fee==null)return false;return S.snd.fee+(k.id==="native"?a:0)>S.bal+1e-12&&(k.id!=="native"||S.bal<S.snd.fee)}
function feeWarn(){if(!lowFee())return"";var n=N(),f=S.snd.fee;var link=S.net==="shardeum-testnet"?'<a href="https://docs.shardeum.org" target="_blank" rel="noopener">'+esc(t("getTestShm"))+' ›</a>':S.net==="shardeum"?'<a href="#" data-fourth="1">'+esc(t("addShm"))+' ›</a>':'<a href="#" data-fourth="1">'+esc(t("testCoins"))+' ›</a>';
 return '<div class="warn3">'+ic("info",18)+'<span>'+esc(t("needFee").replace("%f",ffee(f)).replace("%s",n.sym).replace("%b",fmt(S.bal,4)).replace("%s",n.sym))+' '+link+'</span></div>'}
function ffee(f){if(f==null)return"…";if(f>=1)return fmt(f,2);if(f>=0.0001)return fmt(f,6);return Number(f).toPrecision(2)}
function rsOK(){var n=N();return !n.test&&S.inr>0&&S.snd.tok==="native"}
function amtInr(){var n=N(),a=parseFloat(S.snd.amt);if(n.test||!S.inr||!a||S.snd.tok!=="native")return"";return S.snd.cur==="inr"?"= "+fmt(a,4)+" "+n.sym:"≈ "+inr(a*S.inr)}
function feeTxt(){var n=N();if(S.snd.fee==null)return"…";var f=S.snd.fee;if(!n.test&&S.inr)return"≈ "+inr(f*S.inr)+" ("+ffee(f)+" "+n.sym+")";return"≈ "+ffee(f)+" "+n.sym}
async function estFee(){var n=N(),k=curTok();try{var gp=BigInt(await rpc(n.rpc,"eth_gasPrice",[]));var gas=BigInt(k.id==="native"?21000:65000);
 try{var to=/^0x[0-9a-fA-F]{40}$/.test(S.snd.to)?S.snd.to:S.addr;var a=parseFloat(S.snd.amt)>0?S.snd.amt:"0";var wei=ethers.parseUnits(String(a),k.dec||18);var tx=k.id==="native"?{from:S.addr,to:to,value:"0x"+wei.toString(16)}:{from:S.addr,to:k.addr,data:"0xa9059cbb"+to.slice(2).toLowerCase().padStart(64,"0")+wei.toString(16).padStart(64,"0")};var g=BigInt(await rpc(n.rpc,"eth_estimateGas",[tx]));if(g>0n)gas=g*11n/10n}catch(e){}
 S.snd.fee=Number(gp*gas)/1e18}catch(e){S.snd.fee=null}var el=$("sFee");if(el)el.textContent=feeTxt();var w=$("sWarn");if(w)w.innerHTML=feeWarn();var cb=document.querySelector("[data-cont]");if(cb)cb.disabled=lowFee()}
function readSend(){var a=$("sTo"),b=$("sAmt");if(a)S.snd.to=a.value.trim();if(b){var v=b.value.replace(/,/g,"").trim();if(S.snd.cur==="inr"&&rsOK()){S.snd.rs=v;var r=parseFloat(v);S.snd.amt=r>0?String(Math.floor(r/S.inr*1e6)/1e6):""}else S.snd.amt=v}}
function feeHigh(){var a=parseFloat(S.snd.amt);return S.snd.tok==="native"&&S.snd.fee>0&&a>0&&S.snd.fee>a}
function validate(){var n=N(),k=curTok(),to=S.snd.to,a=parseFloat(S.snd.amt);
 if(!/^0x[0-9a-fA-F]{40}$/.test(to))return t("eAddr");if(!(a>0))return t("eAmt");
 if(k.bal!=null&&a>k.bal+1e-12)return t("eBal").replace("%s",k.sym);
 if(S.bal!=null&&S.snd.fee!=null){var need=S.snd.fee+(k.id==="native"?a:0);if(need>S.bal+1e-12){var miss=need-S.bal;return t("eFee").replace("%s",n.sym).replace("%f",fmt(miss,miss<1?6:2)).replace("%s",n.sym)}}
 return ""}
function shield(){var to=S.snd.to.toLowerCase(),me=S.addr.toLowerCase();var known=contacts().map(function(c){return{a:c.a.toLowerCase(),n:c.n}}).concat(sentList().map(function(a){return{a:String(a).toLowerCase(),n:""}}));
 if(/^0x0{40}$/.test(to)||/^0x0{30,}dead$/i.test(to))return{lvl:"bad",t:t("shBurn"),s:t("shBurn2")};
 if(KNOWN_CONTRACTS.indexOf(to)>=0||(N().tzt&&to===N().tzt.toLowerCase()))return{lvl:"bad",t:t("shTok"),s:t("shTok2")};
 if(to===me)return{lvl:"warn",t:t("eSelf"),s:""};
 if(known.some(function(k){return k.a===to}))return{lvl:"ok",t:t("shOk"),s:nameOf(to)||t("shOk2")};
 var look=known.find(function(k){return k.a.slice(2,6)===to.slice(2,6)&&k.a.slice(-4)===to.slice(-4)});
 if(look)return{lvl:"bad",t:t("shLook"),s:t("shLook2").replace("%w",look.n||sh(look.a))};
 return{lvl:"warn",t:t("shNew"),s:t("shNew2")}}
function openConfirm(){readSend();var e=validate();S.snd.err=e;var el=$("sErr");if(el)el.textContent=e;if(e)return;
 var n=N(),k=curTok(),a=S.snd.amt,to=S.snd.to,sd=shield(),nm=nameOf(to);
 var amtTxt=fmt(parseFloat(a),6)+" "+k.sym;var bigTxt=rsOK()?inr(parseFloat(a)*S.inr):amtTxt,subTxt=rsOK()?amtTxt:amtInr();
 var card='<div class="sc '+sd.lvl+'">'+ic(sd.lvl==="ok"?"shield":"warn",24)+'<div><b>'+esc(sd.t)+'</b>'+(sd.s?'<small>'+esc(sd.s)+'</small>':"")+(sd.lvl==="bad"?'<label class="tick"><input type="checkbox" id="cTick">'+esc(t("tickT"))+'</label>':"")+'</div></div>';
 var h='<div class="grab"></div><div class="sht">'+esc(t("confirm"))+'</div>'+(n.test?"":'<div class="note2" style="color:var(--red);font-weight:700;margin:0">'+esc(t("real"))+' · '+esc(n.name)+'</div>')+
 '<div class="camt">'+esc(bigTxt)+'</div><div class="camtr">'+esc(subTxt)+'</div>'+(feeHigh()?'<div class="note2" style="color:#B45309;font-weight:600">'+esc(t("feeHi"))+'</div>':'')+''+
 '<div class="kv"><div><span>'+esc(t("from"))+'</span><b>'+esc(wName()+" · "+sh(S.addr))+'</b></div><div><span>'+esc(t("to"))+'</span><b class="who2">'+(nm?'<span class="av" style="background:linear-gradient(135deg,'+COLORS[0]+')">'+esc(nm.slice(0,1).toUpperCase())+'</span>'+esc(nm):esc(t("newAddr")))+'</b></div><div><span>'+esc(t("network"))+'</span><b>'+esc(n.name)+'</b></div><div><span>'+esc(t("fee"))+'</span><b>'+esc(feeTxt())+'</b></div></div>'+
 '<div class="addr"><em>'+esc(to.slice(0,6))+'</em>'+esc(to.slice(6,-4))+'<em>'+esc(to.slice(-4))+'</em></div>'+card+
 bigBox(a,k)+'<div style="margin-top:14px"><button class="btn" id="cGo"'+(sd.lvl==="bad"||isBig(a,k)?" disabled":"")+'>'+ic("lock",20)+esc(t("sendX").replace("%a",amtTxt))+'</button></div><div class="note2">'+esc(S.mode==="inapp"?t("pinNext"):t("mmNext"))+'</div>';
 sheet(h);var tk=$("cTick"),bt=$("cBig");function upd(){$("cGo").disabled=(tk&&!tk.checked)||(bt&&!bt.checked)}if(tk)tk.onchange=upd;if(bt)bt.onchange=upd;
 $("cGo").onclick=function(){if(this.disabled)return;go(amtTxt)}}
async function go(amtTxt){if(S.mode==="inapp"){var need=raw("tz_pinsend","1")!=="0"||!CPW.unlocked();if(need){pinPad(amtTxt,function(){doSend(amtTxt)})}else doSend(amtTxt)}else doSend(amtTxt)}
function pinPad(amtTxt,ok){if(BIO.full()){BIO.unlock().then(ok).catch(function(){pinPad2(amtTxt,ok)});return}pinPad2(amtTxt,ok)}
function pinPad2(amtTxt,ok){var pin="";function dots(){return '<div class="dots">'+[0,1,2,3,4,5].map(function(i){return '<i class="'+(i<pin.length?'f':(i===pin.length?'cur':''))+'"></i>'}).join("")+'</div>'}
 function draw(msg,bad){sheet('<div class="grab"></div><button class="ib" id="pX" style="position:absolute;right:16px;top:14px" aria-label="close">'+ic("x",18)+'</button><div class="pinw"><div class="pt">'+esc(t("pinT"))+'</div><div class="ps'+(bad?" e":"")+'">'+esc(msg||t("pinS").replace("%a",amtTxt))+'</div>'+dots()+'</div><div class="kp">'+"123456789".split("").map(function(d){return '<button class="k" data-k="'+d+'">'+d+'</button>'}).join("")+'<span class="k t"></span><button class="k" data-k="0">0</button><button class="k t" data-k="del" aria-label="delete">'+ic("del",26)+'</button></div>',true);var px=$("pX");if(px)px.onclick=closeSheet;
  [].forEach.call(document.querySelectorAll("#sheet [data-k]"),function(b){b.onclick=async function(){var k=b.getAttribute("data-k");if(k==="del"){pin=pin.slice(0,-1);draw()}else if(pin.length<6){pin+=k;draw();if(pin.length===6){var p=pin;sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("sending"))+'</div></div>',true);try{await CPW.unlock(p);ok()}catch(e){pin="";draw(t("pinBad"),true)}}}}})}
 draw()}
function toHex(v){return "0x"+BigInt(v).toString(16)}
async function doSend(amtTxt){var n=N(),k=curTok(),to=S.snd.to,prov=window.ethereum;sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(t("sending"))+'</div></div>',true);
 try{var wei=ethers.parseUnits(String(S.snd.amt),k.dec||18);
  if(S.mode==="mm"){var acc=await prov.request({method:"eth_requestAccounts"});if(!acc||acc[0].toLowerCase()!==S.addr.toLowerCase())S.addr=acc[0];
   try{await prov.request({method:"wallet_switchEthereumChain",params:[{chainId:n.chainId}]})}catch(e){if(e&&(e.code===4902||e.code===-32603))await prov.request({method:"wallet_addEthereumChain",params:[{chainId:n.chainId,chainName:n.name,nativeCurrency:{name:n.sym,symbol:n.sym,decimals:18},rpcUrls:[n.rpc],blockExplorerUrls:[n.exp]}]});else throw e}}
  else{await prov.request({method:"wallet_switchEthereumChain",params:[{chainId:n.chainId}]})}
  var tx=k.id==="native"?{from:S.addr,to:to,value:toHex(wei)}:{from:S.addr,to:k.addr,value:"0x0",data:"0xa9059cbb"+to.slice(2).toLowerCase().padStart(64,"0")+BigInt(wei).toString(16).padStart(64,"0")};
  var hash=await prov.request({method:"eth_sendTransaction",params:[tx]});
  var list=txsAll();list.unshift({type:"out",amt:String(S.snd.amt),symbol:k.sym,hash:hash||"",time:Date.now(),net:S.net,st:"pending"});lss("txs",list.slice(0,300));
  var sl=sentList();if(sl.indexOf(to.toLowerCase())<0){sl.unshift(to.toLowerCase());rawSet("tz_sent_to",JSON.stringify(sl.slice(0,500)))}
  if(raw("tz_pinsend","1")!=="0"&&S.mode==="inapp"){try{CPW.lock()}catch(e){}}
  var toN=nameOf(to)||sh(to),net0=S.net;function bindOk(){var b=$("dOk");if(b)b.onclick=function(){closeSheet();S.snd={tok:"native",to:"",amt:"",fee:null,err:"",cur:"tok",rs:""};S.tab="home";render();load()}}
  sheet(stepsHTML("wait",amtTxt,toN,hash),true);if(hash){trackTx(hash,net0,function(st){sheet(stepsHTML(st,amtTxt,toN,hash),true);bindOk();load()})}else{sheet(stepsHTML("slow",amtTxt,toN,hash),true);bindOk()}}
 catch(e){var m=(e&&(e.shortMessage||e.message))||String(e);if(/insufficient funds/i.test(m))m=t("eFee").replace("%s",n.sym).replace("%f","?").replace("%s",n.sym);if(/user (rejected|denied)/i.test(m))m="Cancelled";
  sheet('<div class="grab"></div><div class="done"><div class="ok2" style="background:var(--redSoft);color:var(--red)">'+ic("x",34,2.4)+'</div><h3>'+esc(t("failT"))+'</h3><p>'+esc(m).slice(0,180)+'</p><div style="margin-top:18px"><button class="btnw" id="dOk">'+esc(t("doneB"))+'</button></div></div>',true);$("dOk").onclick=closeSheet}}
