/* Tazvera wallet · app/browser/browser.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* The browser screen. Everything about it lives in this one file: the address bar, the start page,
   the shortcuts and the history. Opening a real site inside the app needs the Android shell; until
   that exists, a site opens in a new tab. Connecting to the wallet (WalletConnect) is planned, not live yet. The wallet core and
   the signing sheet are NOT here — this screen can only ask them. */
var BRW_SHORTCUTS = [
  { name: "PancakeSwap", url: "https://pancakeswap.finance", tag: "BNB Chain", cat: "swap" },
  { name: "Uniswap", url: "https://app.uniswap.org", tag: "Ethereum", cat: "swap" },
  { name: "BscScan", url: "https://bscscan.com", tag: "explorer", cat: "exp" },
  { name: "Shardeum explorer", url: "https://explorer.shardeum.org", tag: "explorer", cat: "exp" }
];
function brwState(){ if(!S.brw||typeof S.brw!=="object")S.brw={url:"",hist:[],idx:-1}; return S.brw }
/* a URL is only accepted as http(s); anything else (javascript:, data:) is refused outright */
function brwClean(v){
  var s=String(v||"").trim();
  if(!s)return "";
  if(/^[a-z][a-z0-9+.-]*:/i.test(s)) return /^https?:\/\//i.test(s) ? s : "";
  if(!/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(s)) return "";
  return "https://" + s;
}
/* Which sites do we know? Only the ones on the verified list, plus any the user has already opened
   once. Anything else is "new" and says so, because a wrong address is the whole attack. */
/* Pinned sites: four by default, chosen by the user, kept on this phone. A pin is an index into
   BRW_SHORTCUTS, so nothing can be pinned that is not on the verified list. */
function brwPins(){
  var l=ls("pins",null);
  if(!Array.isArray(l))return [0,1,2,3];
  return l.filter(function(i){return typeof i==="number"&&i>=0&&i<BRW_SHORTCUTS.length}).slice(0,6);
}
function brwPinToggle(i){
  var l=brwPins(),k=l.indexOf(i);
  if(k>=0)l.splice(k,1); else { if(l.length>=6)return false; l.push(i) }
  lss("pins",l); return true;
}
function brwPinSheet(){
  var l=brwPins();
  var rows=BRW_SHORTCUTS.map(function(x,i){
    var on=l.indexOf(i)>=0;
    return '<button class="sess" style="width:100%;text-align:left;background:var(--soft);border:1px solid var(--line)" data-pintoggle="'+i+'">'+
      '<span class="dot" style="background:'+(on?"var(--green)":"var(--line)")+'"></span>'+
      '<div class="sm2"><b>'+esc(x.name)+'</b><small>'+esc(x.url.replace(/^https?:\/\//,""))+'</small></div>'+
      '<span class="srm" style="color:'+(on?"var(--green)":"var(--mu)")+'">'+esc(t(on?"brwPinned":"brwPinAdd"))+'</span></button>'
  }).join("");
  sheet('<div class="grab"></div><div class="sht">'+esc(t("brwPinsT"))+'</div>'+
    '<div class="snote">'+esc(t("brwPinsNote"))+'</div>'+rows);
}
function brwTrust(host){
  var h=String(host||"").toLowerCase();
  if(!h)return "new";
  for(var i=0;i<BRW_SHORTCUTS.length;i++){
    if(brwHost(BRW_SHORTCUTS[i].url)===h)return "ok";
  }
  try{ if(sitesList().some(function(x){return x.domain===h}))return "ok" }catch(e){}
  return "new";
}
function brwHost(u){ try{ return String(u).replace(/^https?:\/\//i,"").split("/")[0] }catch(e){ return u } }
function brwOpen(u){
  var url=brwClean(u); if(!url){ toast(t("brwBad")); return }
  var b=brwState();
  b.hist=b.hist.slice(0,b.idx+1); b.hist.push(url); b.idx=b.hist.length-1; b.url=url;
  /* if an Android shell bridge exists, open the site there. No wallet is injected into it yet. */
  if(window.TazveraBrowser&&typeof window.TazveraBrowser.open==="function"){
    try{ window.TazveraBrowser.open(url); render(); return }catch(e){}
  }
  try{ window.open(url,"_blank","noopener") }catch(e){}
  render();
}
function brwBack(){ var b=brwState(); if(b.idx>0){ b.idx--; b.url=b.hist[b.idx]; render() } }
function brwHome(){ var b=brwState(); b.url=""; render() }
function browserHTML(){
  var b=brwState(), n=N();
  var bar='<div class="brwbar">'+
    '<button class="ib" data-brwback="1" aria-label="back" '+(b.idx>0?'':'disabled')+'>'+ic("back",18)+'</button>'+
    '<div class="baddr"><span class="bdot '+(b.url?brwTrust(brwHost(b.url)):'')+'"></span>'+(b.url?esc(brwHost(b.url)):'<span class="bph">'+esc(t("brwPh"))+'</span>')+'</div>'+
    '<button class="ib" data-brwsites="1" aria-label="'+esc(t("brwSites"))+'">'+ic("shield",18)+'</button>'+
    '<button class="ib" data-brwgo="1" aria-label="open">'+ic("globe",18)+'</button></div>'+
    '<div class="bstrip"><i></i>'+esc(t("brwConn"))+' · '+esc(n.name)+'</div>';
  var body;
  if(b.url){
    var tr=brwTrust(brwHost(b.url));
    body='<div class="brwsite"><b>'+esc(brwHost(b.url))+'</b>'+
      (tr==="ok"?'':'<div class="bnew">'+esc(t("brwNew"))+'</div>')+
      '<p>'+esc(t("brwNote"))+'</p>'+
      '<button class="btn" data-brwtab="1">'+esc(t("brwTab"))+'</button>'+
      '<button class="btnw" data-brwhome="1">'+esc(t("brwHome"))+'</button></div>';
  }else{
    body='<div class="brwstart">'+
      '<div class="lb3">'+esc(t("brwPinned"))+'</div><div class="brwpin">'+
        brwPins().map(function(i){return '<button class="brwfav" data-brwopen="'+i+'">'+esc(BRW_SHORTCUTS[i].name.slice(0,1))+'</button>'}).join("")+
        '<button class="brwfav add" data-brwpin="1">+</button>'+
      '</div>'+
      '<div class="brwcat"><div class="lb3">'+esc(t("brwSwap"))+'</div>'+
        BRW_SHORTCUTS.filter(function(x){return x.cat==="swap"}).map(function(x){
          return '<button class="brwli" data-brwopen="'+BRW_SHORTCUTS.indexOf(x)+'"><div><b>'+esc(x.name)+'</b><small>'+esc(x.url.replace(/^https?:\/\//,""))+'</small></div></button>'}).join("")+
      '</div>'+
      '<div class="brwcat"><div class="lb3">'+esc(t("brwExp"))+'</div>'+
        BRW_SHORTCUTS.filter(function(x){return x.cat==="exp"}).map(function(x){
          return '<button class="brwli" data-brwopen="'+BRW_SHORTCUTS.indexOf(x)+'"><div><b>'+esc(x.name)+'</b><small>'+esc(x.url.replace(/^https?:\/\//,""))+'</small></div></button>'}).join("")+
      '</div>'+
      '<div class="brwnote">'+esc(t("brwNote"))+'</div></div>';
  }
  return '<div class="tb"><button class="ib" data-tab="home" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("brwT"))+'</b></div>'+bar+body;
}
