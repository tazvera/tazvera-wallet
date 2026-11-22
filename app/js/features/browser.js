/* Tazvera wallet · app/js/features/browser.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* The browser screen. Everything about it lives in this one file: the address bar, the start page,
   the shortcuts and the history. Opening a real site inside the app needs the Android shell; until
   that exists, a site opens in a new tab and is connected with WalletConnect. The wallet core and
   the signing sheet are NOT here — this screen can only ask them. */
var BRW_SHORTCUTS = [
  { name: "PancakeSwap", url: "https://pancakeswap.finance", tag: "BNB Chain" },
  { name: "Uniswap", url: "https://app.uniswap.org", tag: "Ethereum" },
  { name: "BscScan", url: "https://bscscan.com", tag: "explorer" },
  { name: "Shardeum explorer", url: "https://explorer.shardeum.org", tag: "explorer" }
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
function brwHost(u){ try{ return String(u).replace(/^https?:\/\//i,"").split("/")[0] }catch(e){ return u } }
function brwOpen(u){
  var url=brwClean(u); if(!url){ toast(t("brwBad")); return }
  var b=brwState();
  b.hist=b.hist.slice(0,b.idx+1); b.hist.push(url); b.idx=b.hist.length-1; b.url=url;
  /* inside the Android shell the site loads in our own WebView and gets the wallet injected */
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
    '<div class="baddr"><span class="bdot"></span>'+(b.url?esc(brwHost(b.url)):'<span class="bph">'+esc(t("brwPh"))+'</span>')+'</div>'+
    '<button class="ib" data-brwgo="1" aria-label="open">'+ic("globe",18)+'</button></div>'+
    '<div class="bstrip"><i></i>'+esc(t("brwConn"))+' · '+esc(n.name)+'</div>';
  var body;
  if(b.url){
    body='<div class="brwsite"><b>'+esc(brwHost(b.url))+'</b>'+
      '<p>'+esc(t("brwNote"))+'</p>'+
      '<button class="btn" data-brwtab="1">'+esc(t("brwTab"))+'</button>'+
      '<button class="btnw" data-brwhome="1">'+esc(t("brwHome"))+'</button></div>';
  }else{
    body='<div class="brwstart"><div class="lb3">'+esc(t("brwPop"))+'</div><div class="brwgrid">'+
      BRW_SHORTCUTS.map(function(x,i){return '<button class="brwsc" data-brwopen="'+i+'"><b>'+esc(x.name)+'</b><small>'+esc(x.tag)+'</small></button>'}).join("")+
      '</div><div class="brwnote">'+esc(t("brwNote"))+'</div></div>';
  }
  return '<div class="tb"><button class="ib" data-tab="home" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("brwT"))+'</b></div>'+bar+body;
}
