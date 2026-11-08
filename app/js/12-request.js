/* Tazvera wallet · 12-request.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- REQUEST ---------- */
var REQ={tok:"native",amt:""};
function reqURI(){var n=N(),k=tokens().find(function(x){return x.id===REQ.tok})||tokens()[0],a=parseFloat(REQ.amt);var wei="";try{if(a>0)wei=ethers.parseUnits(String(REQ.amt),k.dec||18).toString()}catch(e){}
 if(k.id==="native"||!/^0x[0-9a-fA-F]{40}$/.test(k.addr||""))return "ethereum:"+S.addr+"@"+n.dec+(wei&&k.id==="native"?"?value="+wei:"");return "ethereum:"+k.addr+"@"+n.dec+"/transfer?address="+S.addr+(wei?"&uint256="+wei:"")}
function reqHTML(){var n=N(),k=tokens().find(function(x){return x.id===REQ.tok})||tokens()[0];
 return '<div class="tb"><button class="ib" data-tab="home" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("reqT"))+'</b></div>'+
 '<div class="lbl2">'+esc(t("coin"))+'</div><div class="chips" style="padding-top:0">'+tokens().map(function(x){return '<button class="chip2" data-rtok="'+x.id+'" style="'+(x.id===REQ.tok?'border-color:var(--green);color:var(--green)':'')+'">'+(x.img?'<img src="'+x.img+'" alt="" style="width:24px;height:24px;border-radius:50%">':'<span class="tav">'+esc(String(x.sym||"?").slice(0,1))+'</span>')+esc(x.sym)+'</button>'}).join("")+'</div>'+
 '<div class="lbl2">'+esc(t("reqS"))+'</div><div class="box amtbox"><div class="amtin"><input id="rAmt" inputmode="decimal" placeholder="0" value="'+esc(REQ.amt)+'"><span>'+esc(k.sym)+'</span></div></div>'+
 '<div class="qrc" style="margin-top:14px"><div class="qr"><div id="qrbox"></div><img class="l" src="'+LOGO+'" alt=""></div><div class="note2">'+esc(t("reqNote"))+'</div></div>'+
 '<div class="two" style="grid-template-columns:1fr"><button class="b2 g" data-rshare="1">'+ic("share",19)+esc(t("shareReq"))+'</button></div>'}
function drawReqQR(){var b=$("qrbox");if(!b)return;b.innerHTML="";try{new QRCode(b,{text:reqURI(),width:212,height:212,colorDark:"#0B1D3A",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H})}catch(e){}}
