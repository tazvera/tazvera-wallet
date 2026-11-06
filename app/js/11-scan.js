/* Tazvera wallet · 11-scan.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- SCAN ---------- */
var camStream=null;
async function scan(){sheet('<div class="grab"></div><div class="sht">'+esc(t("scanT"))+'</div><div class="cam"><video id="cv" playsinline muted></video></div><div class="note2" id="cMsg">'+esc(t("scanS"))+'</div>');
 if(!window.jsQR){var s=document.createElement("script");s.src="jsqr.js";document.head.appendChild(s);await new Promise(function(r){s.onload=r;s.onerror=r})}
 try{camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});var v=$("cv");v.srcObject=camStream;await v.play();var c=document.createElement("canvas"),x=c.getContext("2d",{willReadFrequently:true});
  (function tick(){if(!camStream)return;if(v.readyState>=2){c.width=v.videoWidth;c.height=v.videoHeight;x.drawImage(v,0,0);var d=x.getImageData(0,0,c.width,c.height);var q=window.jsQR&&jsQR(d.data,d.width,d.height);if(q&&q.data){var pr=parseQR(q.data);if(pr){stopCam();closeSheet();S.snd.to=pr.to;if(pr.amt)S.snd.amt=pr.amt;if(pr.tok)S.snd.tok=pr.tok;S.tab="send";render();estFee();return}}}requestAnimationFrame(tick)})()}
 catch(e){var mm=$("cMsg");if(mm)mm.textContent=t("noCam")}}
function stopCam(){if(camStream){camStream.getTracks().forEach(function(tr){tr.stop()});camStream=null}}

function parseQR(s){s=String(s||"").trim();var m;
 if((m=s.match(/^ethereum:(0x[0-9a-fA-F]{40})(?:@\d+)?\/transfer\?(.*)$/i))){var q=new URLSearchParams(m[2]);var to=q.get("address");if(!/^0x[0-9a-fA-F]{40}$/.test(to||""))return null;var n=N(),tok=(n.tzt&&m[1].toLowerCase()===n.tzt.toLowerCase())?"tzt":(n.tzv&&m[1].toLowerCase()===n.tzv.toLowerCase())?"tzv":null;if(!tok)return null;var u=q.get("uint256");return{to:to,tok:tok,amt:u?String(Number(BigInt(u.split(/e/i)[0]))/1e18):""}}
 if((m=s.match(/^ethereum:(0x[0-9a-fA-F]{40})(?:@\d+)?(?:\?(.*))?$/i))){var q2=new URLSearchParams(m[2]||"");var v=q2.get("value");var amt="";try{if(v)amt=String(Number(BigInt(Math.round(Number(v)).toLocaleString("fullwide",{useGrouping:false})))/1e18)}catch(e){}return{to:m[1],tok:"native",amt:amt}}
 if((m=s.match(/0x[0-9a-fA-F]{40}/)))return{to:m[0],tok:"",amt:""};return null}
