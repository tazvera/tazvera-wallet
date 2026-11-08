/* Tazvera wallet · 11-scan.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- SCAN ---------- */
var camStream=null;
async function scan(){sheet('<div class="grab"></div><div class="sht">'+esc(t("scanT"))+'</div><div class="cam"><video id="cv" playsinline muted></video></div><div class="note2" id="cMsg">'+esc(t("scanS"))+'</div>');
 if(!window.jsQR){var s=document.createElement("script");s.src="jsqr.js";document.head.appendChild(s);await new Promise(function(r){s.onload=r;s.onerror=r})}
 try{camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});var v=$("cv");v.srcObject=camStream;await v.play();var c=document.createElement("canvas"),x=c.getContext("2d",{willReadFrequently:true});
  (function tick(){if(!camStream)return;if(v.readyState>=2){c.width=v.videoWidth;c.height=v.videoHeight;x.drawImage(v,0,0);var d=x.getImageData(0,0,c.width,c.height);var q=window.jsQR&&jsQR(d.data,d.width,d.height);if(q&&q.data){var pr=parseQR(q.data);if(pr){pr.raw=q.data;stopCam();closeSheet();if(pr.chain!=null&&pr.chain!==N().dec){setTimeout(function(){qrNetSheet(pr)},350);return}useQR(pr);return}}}requestAnimationFrame(tick)})()}
 catch(e){var mm=$("cMsg");if(mm)mm.textContent=t("noCam")}}
function stopCam(){if(camStream){camStream.getTracks().forEach(function(tr){tr.stop()});camStream=null}}

/* EIP-681 numbers can be "1500000000000000000", "1.5e18" or "2.014e18": convert exactly, never with rounding */
function qrWei(v){v=String(v||"").trim();var m=v.match(/^(\d+)(?:\.(\d+))?(?:e(\d+))?$/i);if(!m)return null;var frac=m[2]||"",exp=+(m[3]||0),digits=(m[1]+frac).replace(/^0+(?=\d)/,""),shift=exp-frac.length;
 if(shift<0){if(!/^0+$/.test(digits.slice(digits.length+shift)))return null;digits=digits.slice(0,digits.length+shift)||"0";shift=0}
 try{return BigInt(digits)*(10n**BigInt(shift))}catch(e){return null}}
function qrAmt(v,dec){var w=qrWei(v);if(w==null||w<=0n)return "";var s=ethers.formatUnits(w,dec||18);return s.replace(/\.0$/,"")}
function parseQR(s){s=String(s||"").trim();var m;
 if((m=s.match(/^ethereum:(0x[0-9a-fA-F]{40})(?:@(\d+))?\/transfer\?(.*)$/i))){var q=new URLSearchParams(m[3]);var to=q.get("address");if(!/^0x[0-9a-fA-F]{40}$/.test(to||""))return null;var n=N(),tok=(n.tzt&&m[1].toLowerCase()===n.tzt.toLowerCase())?"tzt":(n.tzv&&m[1].toLowerCase()===n.tzv.toLowerCase())?"tzv":null;
  var chain=m[2]?+m[2]:null;if(!tok&&chain==null)return null;return{to:to,tok:tok||"",token:m[1],amt:qrAmt(q.get("uint256"),18),chain:chain}}
 if((m=s.match(/^ethereum:(0x[0-9a-fA-F]{40})(?:@(\d+))?(?:\?(.*))?$/i))){var q2=new URLSearchParams(m[3]||"");return{to:m[1],tok:"native",amt:qrAmt(q2.get("value"),18),chain:m[2]?+m[2]:null}}
 if((m=s.match(/^0x[0-9a-fA-F]{40}$/)))return{to:m[0],tok:"",amt:"",chain:null};return null}

function useQR(pr){S.snd.to=pr.to;if(pr.amt)S.snd.amt=pr.amt;if(pr.tok)S.snd.tok=pr.tok;else if(pr.token){var n=N(),k=pr.token.toLowerCase();S.snd.tok=(n.tzt&&k===n.tzt.toLowerCase())?"tzt":(n.tzv&&k===n.tzv.toLowerCase())?"tzv":"native"}S.tab="send";render();estFee()}
/* the QR is for another network: say so clearly, and offer to switch (Mainnet still asks its real-money check first) */
function qrNetSheet(pr){var key=Object.keys(NETS).filter(function(k){return NETS[k].dec===pr.chain})[0],cur=N();
 if(!key){sheet('<div class="grab"></div><div class="sht">'+esc(t("qrNetT"))+'</div><div class="sc bad">'+ic("warn",22)+'<div><small style="font-size:13.5px;font-weight:600">'+esc(t("qrNetNo").replace("%c",pr.chain))+'</small></div></div>');return}
 var tn=NETS[key];sheet('<div class="grab"></div><div class="sht">'+esc(t("qrNetT"))+'</div><div class="sc warn">'+ic("warn",22)+'<div><small style="font-size:13.5px;font-weight:600">'+esc(t("qrNetS").replace("%q",tn.name).replace("%n",cur.name))+'</small>'+(tn.test?'':'<small style="display:block;margin-top:6px;color:var(--red);font-weight:700">'+esc(t("realTag"))+'</small>')+'</div></div><div class="tda"><button class="btnw" data-sx="1">'+esc(t("cancel2"))+'</button><button class="btn" id="qrSw">'+esc(t("qrNetGo").replace("%q",tn.name))+'</button></div>');
 $("qrSw").onclick=function(){if(key==="shardeum"&&raw("tz_mn_ok","")!=="1"){closeSheet();setTimeout(mainnetSheet,300);return}closeSheet();S.net=key;lss("v2net",key);S.bal=null;S.tzt=null;S.tzv=null;S.balErr=false;S.snd.fee=null;load();checkNet();var p2=parseQR(pr.raw||"")||pr;useQR(p2)}}
