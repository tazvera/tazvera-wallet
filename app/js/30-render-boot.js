/* Tazvera wallet · 30-render-boot.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* ---------- common ---------- */
function soonHTML(){return homeHTML()}

function render(){var h;if(!S.addr){$("app").innerHTML=welHTML();return}
 var m={home:homeHTML,act:actHTML,recv:recvHTML,send:sendHTML,exp:expHTML,set:setHTML,req:reqHTML,chk:chkHTML,helpc:helpHTML}[S.tab]||homeHTML;h=m();
 var an=S.tab!==S._lt;if(an&&!H.pop){if(S.tab!=="home"&&!H.page){H.page=true;hPush()}else if(S.tab==="home"&&H.page){H.page=false;hBack()}}S._lt=S.tab;var y=window.scrollY;$("app").innerHTML='<div class="scr on'+(an?" anim":"")+'">'+h+'</div>'+((S.tab==="recv"||S.tab==="send"||S.tab==="req"||S.tab==="chk")?"":nav());if(!an)window.scrollTo(0,y);
 if(S.tab==="req"){drawReqQR();var ra=$("rAmt");ra.oninput=function(){REQ.amt=ra.value.replace(/,/g,"");clearTimeout(ra._t);ra._t=setTimeout(drawReqQR,250)}}
 if(S.tab==="recv"){try{new QRCode($("qrbox"),{text:rcvURI(),width:212,height:212,colorDark:"#0B1D3A",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H})}catch(e){}}
 if(S.tab==="send"){var a=$("sTo"),b=$("sAmt");a.oninput=function(){S.snd.to=a.value.trim();S.snd.err="";$("sErr").textContent="";clearTimeout(S._ef);S._ef=setTimeout(estFee,600)};function fit(){b.style.width=Math.min(9,Math.max(1,(b.value||"0").length))+0.6+"ch"}fit();b.oninput=function(){fit();readSend();clearTimeout(S._ef);S._ef=setTimeout(estFee,600);S.snd.err="";$("sErr").textContent=feeHigh()?t("feeHi"):"";$("sErr").style.color=feeHigh()?"#B45309":"";$("sInr").textContent=amtInr()}}
 if(S.tab==="helpc"){var hq=$("hq");if(hq)hq.oninput=function(){S.hq=hq.value;var pos=hq.selectionStart;render();var h2=$("hq");if(h2){h2.focus();try{h2.setSelectionRange(pos,pos)}catch(e){}}}}
 if(S.tab==="exp"){loadMk();var xq=$("xq");if(xq){xq.oninput=function(){S.q=xq.value;var pos=xq.selectionStart;render();var n2=$("xq");if(n2){n2.focus();try{n2.setSelectionRange(pos,pos)}catch(e){}}}}}}
var SLOCK=false;function sheet(h,lock){SLOCK=!!lock;if(!H.sheet){H.sheet=true;hPush()}if(!lock&&h.indexOf("data-sx")<0)h='<button class="ib shx" data-sx="1" aria-label="back">'+ic("back",20)+'</button>'+h;$("sheet").innerHTML=h;$("sheet").scrollTop=0;document.body.classList.add("noscroll");$("sheet").classList.add("on");$("sbg").classList.add("on")}
function closeSheet(){SLOCK=false;stopCam();if(typeof aiStop==="function")aiStop();if(H.sheet&&!H.pop){H.sheet=false;hBack()}$("sheet").classList.remove("on");$("sbg").classList.remove("on");document.body.classList.remove("noscroll")}
function netSheet(){var h='<div class="grab"></div><div class="sht">'+esc(t("netT"))+'</div><div class="grp">'+esc(t("testN"))+'</div>';
 function opt(k,n){return '<button class="opt" data-pick="'+k+'"><span class="ci"><img src="'+netLogo(k)+'" alt=""></span><div class="m"><b>'+esc(n.name)+(n.test?'':' <span class="rtag">'+esc(t("realTag"))+'</span>')+'</b><small>'+esc(n.sym)+'</small></div>'+(S.net===k?'<span class="tick">'+ic("check",20,2.4)+'</span>':"")+'</button>'}
 Object.keys(NETS).forEach(function(k){if(!NETS[k].beta)h+=opt(k,NETS[k])});if(beta()||S.mode==="mm"){h+='<div class="grp">'+esc(t("realN"))+'</div>'+opt("shardeum",NETS.shardeum)}sheet(h)}
function tokSheet(){var h='<div class="grab"></div><div class="sht">'+esc(t("coin"))+'</div>'+tokens().map(function(k){return '<button class="opt" data-tok="'+k.id+'"><span class="ci">'+(k.img?'<img src="'+k.img+'" alt="">':'<b>'+esc(k.sym.slice(0,1))+'</b>')+'</span><div class="m"><b>'+esc(k.name)+'</b><small>'+esc(fmt(k.bal,4)+" "+k.sym)+'</small></div>'+(S.snd.tok===k.id?'<span class="tick">'+ic("check",20,2.4)+'</span>':"")+'</button>'}).join("");sheet(h)}
function choose(title,opts,cur,cb){sheet('<div class="grab"></div><div class="sht">'+esc(title)+'</div>'+opts.map(function(o){return '<button class="opt" data-ch="'+o[0]+'"><div class="m"><b>'+esc(o[1])+'</b></div>'+(cur===o[0]?'<span class="tick">'+ic("check",20,2.4)+'</span>':"")+'</button>'}).join(""));[].forEach.call(document.querySelectorAll("#sheet [data-ch]"),function(b){b.onclick=function(){cb(b.getAttribute("data-ch"));closeSheet();render()}})}
document.addEventListener("click",function(e){var el=e.target.closest("[data-wsheet],[data-wsw],[data-wren],[data-wnew2],[data-wimp2],[data-pinsheet],[data-pinsw2],[data-words],[data-fix],[data-hc],[data-hq],[data-bk],[data-notif],[data-tool],[data-csv],[data-addtok],[data-fourth],[data-tx],[data-s12],[data-chpin],[data-fp],[data-alock],[data-about],[data-help],[data-cur],[data-rtok],[data-rcvtok],[data-ai],[data-sx],[data-rshare],[data-wnew],[data-wimp],[data-wmm],[data-tab],[data-go],[data-net],[data-pick],[data-copy],[data-share],[data-hide],[data-flt],[data-scan],[data-paste],[data-pickc],[data-max],[data-cont],[data-tokpick],[data-tok],[data-pinsw],[data-t12],[data-lock],[data-lang],[data-thm],#sbg");if(!el)return;var d=el.dataset;
 if(el.id==="sbg"){if(SLOCK)return;return closeSheet()}
 if(d.help){helpSheet();return}
 if(d.ai){if(typeof aiOpen==="function")aiOpen();else helpSheet();return}
 if(d.wsheet){wSheet();return}
 if(d.wsw){wSwitch(d.wsw);return}
 if(d.wren){wRename(d.wren);return}
 if(d.wnew2){closeSheet();wAdd("new");return}
 if(d.wimp2){closeSheet();wAdd("imp");return}
 if(d.pinsheet){pinSheet();return}
 if(d.pinsw2){var on2=raw("tz_pinsend","1")!=="0";rawSet("tz_pinsend",on2?"0":"1");pinSheet();return}
 if(d.words){wordsSheet();return}
 if(d.fix){var f=d.fix;if(f==="t12")t12();else if(f==="pin"){rawSet("tz_pinsend","1");render()}else if(f==="fp")toggleFp();else if(f==="alock")choose(t("alock"),[["1","1 "+t("min")],["2","2 "+t("min")],["5","5 "+t("min")]],String(amin()),function(v){lss("xt_am",+v)});return}
 if(d.hc){hcOpen(d.hc);return}
 if(d.hq){S.hopen=S.hopen===+d.hq?0:+d.hq;render();return}
 if(d.bk){bkSheet();return}
 if(d.notif){notifToggle();return}
 if(d.tool){tool(d.tool);return}
 if(d.csv){csv();return}
 if(d.addtok){addTokSheet();return}
 if(d.fourth){fourth();return}
 if(d.tx){var ex=N().exp;if(ex)window.open(ex+"/tx/"+d.tx,"_blank","noopener");return}
 if(d.s12){show12();return}
 if(d.chpin){changePin();return}
 if(d.fp){toggleFp();return}
 if(d.alock){choose(t("alock"),[["1","1 "+t("min")],["2","2 "+t("min")],["5","5 "+t("min")],["15","15 "+t("min")]],String(amin()),function(v){lss("xt_am",+v)});return}
 if(d.about){aboutSheet();return}
 if(d.rtok){REQ.tok=d.rtok;render();return}
 if(d.rcvtok){RCV.tok=d.rcvtok;render();return}
 if(d.sx){closeSheet();return}
 if(d.rshare){var k=tokens().find(function(x){return x.id===REQ.tok})||tokens()[0];var msg=t("reqMsg").replace("%a",(REQ.amt?REQ.amt+" ":"")+k.sym+" ("+N().name+")")+" "+S.addr;if(navigator.share)navigator.share({text:msg}).catch(function(){});else{copyText(msg)}return}
 if(d.wnew){createFlow();return}
 if(d.wimp){importFlow();return}
 if(d.wmm){window.ethereum.request({method:"eth_requestAccounts"}).then(function(a){if(a&&a[0]){S.addr=a[0];S.mode="mm";render();load()}}).catch(function(){});return}
 if(d.tab){closeSheet();if(S.tab==="send")readSend();S.tab=d.tab;render();window.scrollTo(0,0);return}
 if(d.go){S.tab=d.go;render();window.scrollTo(0,0);if(d.go==="send")estFee();return}
 if(d.net)return netSheet();
 if(d.pick){S.net=d.pick;lss("v2net",S.net);S.bal=null;S.tzt=null;S.snd.tok="native";S.snd.fee=null;closeSheet();render();load();return}
 if(d.copy){copyText(S.addr);return}
 if(d.share){if(navigator.share)navigator.share({text:S.addr}).catch(function(){});else{copyText(S.addr)}return}
 if(d.hide){S.hide=!S.hide;lss("hide",S.hide);render();return}
 if(d.flt){S.flt=d.flt;render();return}
 if(d.scan){if(S.tab==="send")readSend();scan();return}
 if(d.paste){(navigator.clipboard&&navigator.clipboard.readText?navigator.clipboard.readText():Promise.reject()).then(function(x){var m=String(x).match(/0x[0-9a-fA-F]{40}/);if(m){S.snd.to=m[0];$("sTo").value=m[0]}}).catch(function(){});return}
 if(d.pickc){readSend();S.snd.to=d.pickc;render();return}
 if(d.cur){readSend();if(S.snd.cur==="inr"){S.snd.cur="tok"}else{S.snd.cur="inr";var a0=parseFloat(S.snd.amt);S.snd.rs=a0>0?String(Math.round(a0*S.inr*100)/100):""}render();return}
 if(d.max){readSend();var k=curTok(),mx;if(k.raw!=null){var mw=k.id==="native"?k.raw-(S.snd.feeW!=null?S.snd.feeW*12n/10n:0n):k.raw;if(mw<0n)mw=0n;S.snd.amt=ethers.formatUnits(mw,k.dec||18).replace(/\.0$/,"");mx=parseFloat(S.snd.amt)}else{mx=k.id==="native"?Math.max(0,(k.bal||0)-(S.snd.fee||0)*1.2):(k.bal||0);S.snd.amt=String(Math.floor(mx*1e6)/1e6)}if(S.snd.cur==="inr"&&rsOK())S.snd.rs=String(Math.floor(mx*S.inr*100)/100);render();return}
 if(d.cont){openConfirm();return}
 if(d.tokpick){readSend();tokSheet();return}
 if(d.tok){S.snd.tok=d.tok;closeSheet();render();estFee();return}
 if(d.pinsw){var on=raw("tz_pinsend","1")!=="0";rawSet("tz_pinsend",on?"0":"1");render();return}
 if(d.t12){t12();return}
 if(d.lock){try{CPW.lock()}catch(_){}toast(t("locked"));return}
 if(d.lang){choose(t("lang"),[["en","English"],["hi","हिंदी"]],S.lang,function(v){S.lang=v;lss("lang",v);theme()});return}
 if(d.thm){choose(t("theme"),[["auto",t("auto")],["light",t("light")],["dark",t("dark")]],raw("tz_theme","")||"auto",function(v){rawSet("tz_theme",v==="auto"?null:v);theme()});return}});
async function boot(){theme();var eth=window.ethereum;
 try{if(window.CPW&&CPW.has()){S.addr=CPW.address();S.mode="inapp"}}catch(e){}
 if(!S.addr&&eth&&!eth.isCpWallet){try{var a=await eth.request({method:"eth_accounts"});if(a&&a[0]){S.addr=a[0];S.mode="mm"}}catch(e){}}
 if(S.mode==="mm"&&NETS[ls("v2net","")]){S.net=ls("v2net","shardeum-testnet")}
 try{if(S.addr){var cb=ls("v2_bal_"+S.net+"_"+S.addr.toLowerCase(),null);if(cb&&cb.bal!=null)S.bal=cb.bal}}catch(e){}
 try{if(S.mode==="inapp")wList()}catch(e){}
 var unl=false;try{unl=sessionStorage.getItem("v2_unl")==="1"&&(CPW.unlocked()||Number(sessionStorage.getItem("v2_act")||0)>Date.now()-amin()*60000)}catch(e){}
 if(S.mode==="inapp"&&!unl){lockScreen();setInterval(function(){if(CPW.unlocked())load()},30000);return}
 render();load();setInterval(load,30000);setInterval(function(){if(alarms().length){S.mkt=0;loadMk().then(function(){fetch("/api/price").then(function(r){return r.json()}).then(function(pj){if(pj&&pj.inr>0)S.inr=pj.inr;checkAlarms()}).catch(checkAlarms)})}},60000)}
window.addEventListener("pageshow",function(){theme()});
boot();

