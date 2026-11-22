/* Tazvera wallet · app/js/features/add-token.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Adding a token lives here on its own, so new token work never touches the rest of the app. */
function addTokSheet(){sheet('<div class="grab"></div><div class="sht">'+esc(t("addTok"))+'</div><div class="note2">'+esc(N().name)+'</div>'+fld("tA",t("tokAddr"),"0x…","")+'<div class="err" id="tE" style="margin:8px 2px 0"></div><div style="margin-top:10px"><button class="btn" id="tGo">'+esc(t("tokFind"))+'</button></div>');
 $("tGo").onclick=async function(){var a=$("tA").value.trim(),n=N();if(!/^0x[0-9a-fA-F]{40}$/.test(a)){$("tE").textContent=t("eAddr");return}$("tE").textContent=t("loading");
  try{var sr=await rpc(n.rpc,"eth_call",[{to:a,data:"0x95d89b41"},"latest"]);var dr=await rpc(n.rpc,"eth_call",[{to:a,data:"0x313ce567"},"latest"]);if(!sr||sr==="0x")throw 0;var sym="TOKEN";try{sym=ethers.AbiCoder.defaultAbiCoder().decode(["string"],sr)[0]}catch(e){try{sym=ethers.decodeBytes32String(sr.slice(0,66))}catch(_){}}sym=String(sym).replace(/[^\w.$-]/g,"").slice(0,12)||"TOKEN";var dec=parseInt(dr,16);if(!(dec>=0&&dec<=36)){$("tE").textContent=t("tokNo");return}
   try{var bq=await rpc(n.rpc,"eth_call",[{to:a,data:"0x70a08231"+S.addr.slice(2).toLowerCase().padStart(64,"0")},"latest"]);if(!bq||bq==="0x")throw 0}catch(_){$("tE").textContent=t("tokNo");return}
   var SY=sym.toUpperCase(),offi=[n.sym,"TZV","TZT"].map(function(x){return String(x).toUpperCase()});if(offi.indexOf(SY)>=0){$("tE").textContent=t("tokFake").replace("%s",sym);return}
   var l=ls("customTokens",[]);if(!Array.isArray(l))l=[];if(l.some(function(x){return String((x&&x.addr)||x).toLowerCase()===a.toLowerCase()&&(!x.net||x.net===S.net)})){$("tE").textContent=t("dup");return}l.push({addr:a,symbol:sym,decimals:dec,net:S.net,time:Date.now()});lss("customTokens",l);closeSheet();toast(t("tokAdded")+": "+sym);load()}
  catch(e){$("tE").textContent=t("tokNo")}}}
