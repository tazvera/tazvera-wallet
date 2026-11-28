/* Tazvera wallet · app/browser/browser.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* The browser screen. Everything about it lives in this one file: the address bar, the start page,
   the shortcuts and the history. Opening a real site inside the app needs the Android shell; until
   that exists, a site opens in a new tab. Connecting to the wallet (WalletConnect) is planned, not live yet. The wallet core and
   the signing sheet are NOT here — this screen can only ask them. */
/* Only sites whose address has been checked by hand. Each carries its own official logo, taken from
   Trust Wallet's public assets collection (the same source Trust Wallet itself uses). */
var BRW_LOGOS = "app/browser/layout/logos/";
var BRW_SHORTCUTS = [
  { name: "PancakeSwap", url: "https://pancake.xyz", tag: "BNB Chain", cat: "swap", logo: BRW_LOGOS + "pancakeswap.finance.png" },
  { name: "Uniswap", url: "https://app.uniswap.org", tag: "Ethereum", cat: "swap", logo: BRW_LOGOS + "app.uniswap.org.png" },
  { name: "1inch", url: "https://app.1inch.io", tag: "Both chains", cat: "swap", logo: BRW_LOGOS + "app.1inch.io.png" },
  { name: "Curve", url: "https://curve.fi", tag: "Ethereum", cat: "swap", logo: BRW_LOGOS + "curve.fi.png" },
  { name: "BscScan", url: "https://bscscan.com", tag: "BNB Chain", cat: "exp", logo: BRW_LOGOS + "bscscan.com.png" },
  { name: "Etherscan", url: "https://etherscan.io", tag: "Ethereum", cat: "exp", logo: BRW_LOGOS + "etherscan.io.png" },
  { name: "Shardeum explorer", url: "https://explorer.shardeum.org", tag: "Shardeum", cat: "exp", logo: "app/img/shm.png" },
  { name: "OpenSea", url: "https://opensea.io", tag: "NFT", cat: "nft", logo: BRW_LOGOS + "opensea.io.png" },
  { name: "Magic Eden", url: "https://magiceden.io", tag: "NFT", cat: "nft", logo: BRW_LOGOS + "magiceden.io.png" },
  { name: "Blur", url: "https://blur.io", tag: "NFT", cat: "nft", logo: BRW_LOGOS + "blur.io.png" },
  { name: "Aave", url: "https://aave.com", tag: "Lending", cat: "defi", logo: BRW_LOGOS + "aave.com.png" },
  { name: "Axie Infinity", url: "https://axieinfinity.com", tag: "Game", cat: "game", logo: BRW_LOGOS + "axieinfinity.com.png" }
];
function brwState(){ if(!S.brw||typeof S.brw!=="object")S.brw={url:"",hist:[],idx:-1}; return S.brw }
/* a URL is only accepted as http(s); anything else (javascript:, data:) is refused outright */
function brwClean(v){
  var s=String(v||"").trim();
  if(!s || /[\u0000-\u0020]/.test(s)) return "";
  if(!/^[a-z][a-z0-9+.-]*:/i.test(s)) s="https://"+s;
  if(!/^https?:\/\//i.test(s)) return "";
  try{var u=new URL(s);if((u.protocol!=="http:"&&u.protocol!=="https:")||!u.hostname||u.username||u.password)return "";return u.href}catch(e){return ""}
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
  /* sites the user added with Connect are NOT marked verified: a typed address is exactly what an attacker wants trusted */
  return "new";
}
function brwHost(u){ try{ return String(u).replace(/^https?:\/\//i,"").split("/")[0] }catch(e){ return u } }
function brwLaunch(url){
  if(window.TazveraBrowser&&typeof window.TazveraBrowser.open==="function"){try{window.TazveraBrowser.open(url);return}catch(e){}}
  try{window.open(url,"_blank","noopener")}catch(e){}
}
function brwOpen(u){
  var url=brwClean(u);if(!url){toast(t("brwBad"));return}
  var b=brwState();b.hist=b.hist.slice(0,b.idx+1);b.hist.push(url);b.idx=b.hist.length-1;b.url=url;brwLaunch(url);render();
}
function brwBack(){var b=brwState();if(b.idx>0){b.idx--;b.url=b.hist[b.idx];brwLaunch(b.url);render()}}
function brwForward(){var b=brwState();if(b.idx>=0&&b.idx<b.hist.length-1){b.idx++;b.url=b.hist[b.idx];brwLaunch(b.url);render()}}
function brwHome(){ var b=brwState(); b.url=""; render() }
function browserHTML(){
  var b=brwState(), n=N();
  var bar='<div class="brwbar">'+
    '<button class="ib" data-brwback="1" aria-label="back" '+(b.idx>0?'':'disabled')+'>'+ic("back",18)+'</button>'+
    '<div class="baddr"><span class="bdot '+(b.url?brwTrust(brwHost(b.url)):'')+'"></span>'+
      '<input id="burl" class="binput" type="text" inputmode="url" autocomplete="off" spellcheck="false" '+
      'value="'+esc(b.url?brwHost(b.url):(S.bq||""))+'" placeholder="'+esc(t("brwPh"))+'" aria-label="'+esc(t("brwPh"))+'">'+
    '</div>'+
    
    '<button class="ib" data-brwgo="1" aria-label="open">'+ic("globe",18)+'</button></div>'+
    '<div class="bstrip">Wallet not connected. Sites open in a new tab and cannot use your wallet.<small>वॉलेट किसी site से जुड़ा नहीं है। Site नए tab में खुलती है और आपके वॉलेट का इस्तेमाल नहीं कर सकती।</small></div>';
  var q=(S.bq||"").trim().toLowerCase();
  var list=BRW_SHORTCUTS.filter(function(x){return !q||(x.name+" "+x.url).toLowerCase().indexOf(q)>=0});
  var pinnedIdx = brwPins();
  var rest = list.filter(function(x){ return pinnedIdx.indexOf(BRW_SHORTCUTS.indexOf(x)) < 0 });
  function card(x){ var i=BRW_SHORTCUTS.indexOf(x);
    return '<button class="brwli" data-brwopen="'+i+'">'+
      '<span class="blg"><img src="'+esc(x.logo)+'" alt="" loading="lazy"></span>'+
      '<span class="bm"><b>'+esc(x.name)+'</b><small>'+esc(x.url.replace(/^https?:\/\//,"").replace(/\/$/,""))+'</small></span>'+
      ic("right",16)+'</button>' }
  var groups=[["swap",t("brwSwap")],["exp",t("brwExp")],["nft","NFT"],["defi","DeFi"],["game","Games"]];
  var catRows = groups.map(function(g){
    var items=rest.filter(function(x){return x.cat===g[0]});
    if(!items.length) return "";
    return '<div class="brwcat"><div class="lb3">'+esc(g[1])+'</div>'+items.map(card).join("")+'</div>'
  }).join("");
  var body;
  if(b.url){
    var tr=brwTrust(brwHost(b.url));
    body='<div class="brwsite"><b>'+esc(brwHost(b.url))+'</b>'+
      (tr==="ok"?'':'<div class="bnew">'+esc(t("brwNew"))+'</div>')+
      '<p>'+esc(t("brwNote"))+'</p>'+
      '<button class="btn" data-brwtab="1">'+esc(t("brwTab"))+'</button>'+
      '<button class="btnw" data-brwhome="1">'+esc(t("brwHome"))+'</button>'+
      '<div class="brwtb">'+
        '<button class="tbb" data-brwback="1" aria-label="back">'+ic("back",21)+'</button>'+
        '<button class="tbb" data-brwhome="1" aria-label="'+esc(t("brwHome"))+'">'+ic("grid",21)+'</button>'+
        '<button class="tbb" data-brwpin="1" aria-label="'+esc(t("brwPinAdd"))+'">'+
          '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+
          '<path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20z"/></svg></button>'+
        '<button class="tbb" data-brwtab="1" aria-label="'+esc(t("brwTab"))+'">'+ic("globe",21)+'</button>'+
      '</div></div>';
  }else{
    var fe=BRW_SHORTCUTS[0];
    body='<div class="brwstart">'+
      (q?'':'<button class="brwfeat" data-brwopen="0"><img src="'+esc(fe.logo)+'" alt=""><span class="ft"><b>'+esc(fe.name)+'</b><small>'+esc(fe.tag)+' · '+esc(fe.url.replace(/^https?:\/\//,""))+'</small></span>'+ic("right",16)+'</button>')+
      '<div class="lb3">'+esc(t("brwPinned"))+'</div><div class="brwpin">'+
        (q?'':brwPins().map(function(i){var x=BRW_SHORTCUTS[i];return '<button class="brwpin2" data-brwopen="'+i+'"><img src="'+esc(x.logo)+'" alt="">'+esc(x.name)+'</button>'}).join(""))+
        '<button class="brwpin2 add" data-brwpin="1">'+ic("plus",14)+' '+esc(t("brwPinAdd"))+'</button>'+
      '</div>'+
      catRows+
      '<div class="brwnote">'+esc(t("brwNote"))+'</div></div>';
  }
  return '<div class="tb"><button class="ib" data-tab="home" aria-label="back">'+ic("back",20)+'</button><b>'+esc(t("brwT"))+'</b></div>'+bar+body;
}
