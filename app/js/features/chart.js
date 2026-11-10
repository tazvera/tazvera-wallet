/* Tazvera wallet · app/js/features/chart.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Price chart: line or candles, 24h / 7d / 30d. / भाव का ग्राफ़। */
/* ----- Version 9: price chart (line or candles; 24 hours / 7 days / 30 days) ----- */
Object.assign(L.en,{chT:"Price chart",ch1:"24H",ch7:"7D",ch30:"30D",chHi:"High",chLo:"Low",chLine:"Line",chCandle:"Candles",chNo:"Chart not available right now. Check the internet and try again.",chSrc:"Prices from public exchanges (KuCoin, Gate). Past prices do not tell the future."});
Object.assign(L.hi,{chT:"भाव का ग्राफ़",ch1:"24 घंटे",ch7:"7 दिन",ch30:"30 दिन",chHi:"सबसे ऊँचा",chLo:"सबसे नीचा",chLine:"लाइन",chCandle:"कैंडल",chNo:"ग्राफ़ अभी उपलब्ध नहीं। इंटरनेट देखकर फिर कोशिश कीजिए।",chSrc:"भाव सार्वजनिक एक्सचेंज (KuCoin, Gate) से। पुराने भाव भविष्य नहीं बताते।"});
var CHID={SHM:1,BTC:1,ETH:1,BNB:1,USDT:1},CHC={};
/* price history comes from our own small server (exchange candles, cached 5 minutes), so many users never hit a rate limit */
async function chData(sym,days){if(!CHID[sym])return null;var key=sym+"|"+days+"|"+curC(),c=CHC[key];if(c&&Date.now()-c.t<300000)return c.d;
 var r=await fetch("/api/chart?sym="+encodeURIComponent(sym)+"&days="+days+"&cur="+curC());if(!r.ok)throw 0;var j=await r.json();
 var p=(j&&Array.isArray(j.prices)?j.prices:[]).filter(function(x){return Array.isArray(x)&&x[1]>0});if(p.length<2)throw 0;
 var k=(j&&Array.isArray(j.candles)?j.candles:[]).filter(function(x){return Array.isArray(x)&&x.length===5&&x[1]>0&&x[2]>0&&x[3]>0&&x[4]>0});
 var d={p:p,k:k.length>=2?k:null};CHC[key]={t:Date.now(),d:d};return d}
function chMode(){return raw("tz_chmode","line")==="candle"?"candle":"line"}
var CW=340,CH=170,CP=6;
function chLineSVG(p){var xs=p.map(function(x){return x[0]}),ys=p.map(function(x){return x[1]}),x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),lo=Math.min.apply(null,ys),hi=Math.max.apply(null,ys),sp=(hi-lo)||hi*0.01||1;
 var pts=p.map(function(q){return [CP+(q[0]-x0)/((x1-x0)||1)*(CW-2*CP),CP+(1-(q[1]-lo)/sp)*(CH-2*CP)]}),up=ys[ys.length-1]>=ys[0],col=up?"#00A86B":"#E5484D";
 var line=pts.map(function(q,i){return (i?"L":"M")+q[0].toFixed(1)+" "+q[1].toFixed(1)}).join(" "),area=line+" L"+(CW-CP)+" "+CH+" L"+CP+" "+CH+" Z",last=pts[pts.length-1];
 return '<svg viewBox="0 0 '+CW+' '+CH+'" class="chsvg" role="img" aria-label="'+esc(t("chT"))+'"><defs><linearGradient id="chg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+col+'" stop-opacity=".28"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></linearGradient></defs><path d="'+area+'" fill="url(#chg)"/><path d="'+line+'" fill="none" stroke="'+col+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+last[0].toFixed(1)+'" cy="'+last[1].toFixed(1)+'" r="4.5" fill="'+col+'" stroke="var(--card)" stroke-width="2"/></svg>'}
function chCandleSVG(k){var lo=Math.min.apply(null,k.map(function(x){return x[3]})),hi=Math.max.apply(null,k.map(function(x){return x[2]})),sp=(hi-lo)||hi*0.01||1,n=k.length,slot=(CW-2*CP)/n,bw=Math.max(2,Math.min(12,slot*0.62));
 function y(v){return CP+(1-(v-lo)/sp)*(CH-2*CP)}
 var g='';k.forEach(function(c,i){var up=c[4]>=c[1],col=up?"#00A86B":"#E5484D",cx=CP+slot*(i+.5),yo=y(c[1]),yc=y(c[4]),top=Math.min(yo,yc),h=Math.max(1.2,Math.abs(yc-yo));
  g+='<line x1="'+cx.toFixed(1)+'" y1="'+y(c[2]).toFixed(1)+'" x2="'+cx.toFixed(1)+'" y2="'+y(c[3]).toFixed(1)+'" stroke="'+col+'" stroke-width="1.3"/><rect x="'+(cx-bw/2).toFixed(1)+'" y="'+top.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="1" fill="'+col+'"/>'});
 return '<svg viewBox="0 0 '+CW+' '+CH+'" class="chsvg" role="img" aria-label="'+esc(t("chT"))+'">'+g+'</svg>'}
async function chartSheet(sym,days){days=days||1;var name={SHM:"Shardeum",BTC:"Bitcoin",ETH:"Ethereum",BNB:"BNB",USDT:"Tether"}[sym]||sym;
 function head(body,canCandle){var m=chMode();sheet('<div class="grab"></div><div class="sht">'+esc(name)+' · '+esc(t("chT"))+'</div><div class="chtabs">'+[[1,"ch1"],[7,"ch7"],[30,"ch30"]].map(function(d){return '<button class="f1'+(d[0]===days?" on":"")+'" data-chd="'+d[0]+'" data-chs="'+esc(sym)+'">'+esc(t(d[1]))+'</button>'}).join("")+'</div>'+
  (canCandle?'<div class="chmode"><button class="'+(m==="line"?"on":"")+'" data-chm="line" data-chs="'+esc(sym)+'" data-chdd="'+days+'">〰️ '+esc(t("chLine"))+'</button><button class="'+(m==="candle"?"on":"")+'" data-chm="candle" data-chs="'+esc(sym)+'" data-chdd="'+days+'">🕯️ '+esc(t("chCandle"))+'</button></div>':'')+body+'<div class="note2" style="margin-top:10px">'+esc(t("chSrc"))+'</div>')}
 head('<div class="chbox"><div class="empty">'+esc(t("loading"))+'</div></div>',sym!=="USDT");
 try{var d=await chData(sym,days);if(!$("sheet").classList.contains("on")||!document.querySelector('[data-chs="'+sym+'"]'))return;
  var p=d.p,ys=p.map(function(x){return x[1]}),f=d.k?d.k[0][1]:ys[0],l=ys[ys.length-1],ch=(l-f)/f*100,up=ch>=0,cand=chMode()==="candle"&&!!d.k,
   hiV=d.k?Math.max.apply(null,d.k.map(function(x){return x[2]})):Math.max.apply(null,ys),loV=d.k?Math.min.apply(null,d.k.map(function(x){return x[3]})):Math.min.apply(null,ys);
  head('<div class="chnow"><b>'+esc(money(l))+'</b><span class="'+(up?"up2":"dn2")+'">'+(up?"+":"")+fmt(ch,2)+'%</span></div><div class="chbox">'+(cand?chCandleSVG(d.k):chLineSVG(p))+'</div><div class="chhl"><span>'+esc(t("chHi"))+' <b>'+esc(money(hiV))+'</b></span><span>'+esc(t("chLo"))+' <b>'+esc(money(loV))+'</b></span></div>',!!d.k)}
 catch(e){if(document.querySelector('[data-chs="'+sym+'"]'))head('<div class="chbox"><div class="empty">'+esc(t("chNo"))+'</div></div>',false)}}
document.addEventListener("click",function(e){var el=e.target.closest("[data-mkc],[data-chd],[data-chm]");if(!el)return;
 if(el.dataset.chm){rawSet("tz_chmode",el.dataset.chm==="candle"?"candle":null);chartSheet(el.dataset.chs,+el.dataset.chdd);return}
 if(el.dataset.chd){chartSheet(el.dataset.chs,+el.dataset.chd);return}var s=el.dataset.mkc;if(CHID[s]){var open=$("sheet").classList.contains("on");if(open)closeSheet();setTimeout(function(){chartSheet(s,1)},open?250:0)}});