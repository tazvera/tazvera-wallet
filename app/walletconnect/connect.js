/* Tazvera wallet · app/walletconnect/connect.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Developer switch by link only: ?wc=1 turns the WalletConnect flag on in this browser, ?wc=0 turns it off.
   Stored only in this browser's localStorage. Without ?wc= nothing changes. The address is then cleaned and the page reloads. */
(function(){
 if(typeof location==="undefined"||typeof localStorage==="undefined")return;
 var m=null;try{m=new URLSearchParams(location.search).get("wc")}catch(e){return}
 if(m!=="1"&&m!=="0")return;
 try{if(m==="1")localStorage.setItem("tz_wc_on","1");else localStorage.removeItem("tz_wc_on")}catch(e){}
 try{var u=new URL(location.href);u.searchParams.delete("wc");location.replace(u.pathname+u.search+u.hash)}catch(e){}
})();
/* WalletConnect, step 2 (sessions only): a site may ask to connect; the user approves or rejects on a Tazvera screen.
   Approving shares the address and the chain list. There are still no requests, no signing and no keys.
   Off unless this browser has the flag tz_wc_on = "1" (developer test). The bundle loads only when
   the dApps screen opens. / WalletConnect, चरण 1: सिर्फ़ जुड़ाव। कोई सेशन, अनुरोध, साइनिंग या कुंजी नहीं। */

Object.assign(L.en,{
 wcConnecting:"WalletConnect: connecting",
 wcConnected:"WalletConnect: connected",
 wcFailed:"WalletConnect: not connected",
 wcNoBundle:"WalletConnect: bundle did not load",
 wcNoRelay:"WalletConnect: relay unreachable",
 wcInitFail:"WalletConnect: init failed",
 wcAskT:"Connection request",
 wcAskS:"This site wants to connect to your wallet. It will see your address and the networks below. It cannot move money or sign anything without asking you again.",
 wcOk:"Connect",
 wcNo:"Reject",
 wcLocked:"Unlock the wallet first, then ask the site to connect again.",
 wcUnsup:"None of the networks requested is available in Tazvera.",
 wcDone:"Connected.",
 wcFail:"Could not connect. Nothing was shared.",
 wcVerOk:"Checked with WalletConnect: this address is verified.",
 wcVerNo:"This site is not verified. Only connect if you trust it.",
 wcMismatch:"The site name and address do not match. Connection refused.",
 wcOriginT:"Address (checked by WalletConnect)",
 wcOriginNone:"Not verified",
 wcClaimT:"What the site says it is"
});
Object.assign(L.hi,{
 wcConnecting:"WalletConnect: जुड़ रहा है",
 wcConnected:"WalletConnect: जुड़ गया",
 wcFailed:"WalletConnect: नहीं जुड़ा",
 wcNoBundle:"WalletConnect: bundle did not load",
 wcNoRelay:"WalletConnect: relay unreachable",
 wcInitFail:"WalletConnect: init failed",
 wcAskT:"कनेक्शन की माँग",
 wcAskS:"यह साइट आपके वॉलेट से जुड़ना चाहती है। उसे आपका पता और नीचे की नेटवर्क सूची दिखेगी। आपसे दोबारा पूछे बिना वह पैसा नहीं भेज सकती और कुछ साइन नहीं कर सकती।",
 wcOk:"जुड़ें",
 wcNo:"अस्वीकार",
 wcLocked:"पहले वॉलेट अनलॉक करें, फिर साइट से दोबारा जुड़ने को कहें।",
 wcUnsup:"माँगे गए नेटवर्कों में से कोई भी Tazvera में उपलब्ध नहीं है।",
 wcDone:"जुड़ गया।",
 wcFail:"जुड़ नहीं सका। कुछ भी साझा नहीं हुआ।",
 wcVerOk:"WalletConnect से जाँचा गया: यह पता सत्यापित है।",
 wcVerNo:"यह साइट सत्यापित नहीं है। जुड़ें तभी जब आप इस पर भरोसा करते हों।",
 wcMismatch:"साइट का नाम और पता मैच नहीं करते। कनेक्शन से मना किया गया।",
 wcOriginT:"पता (WalletConnect से जाँचा गया)",
 wcOriginNone:"सत्यापित नहीं",
 wcClaimT:"साइट ने खुद जो बताया"
});

var WC_TIMEOUT_MS = 20000;
var WC_STATE = "connecting";
var WC_STARTED = false;
var WC_KIT = null;
/* why it failed: "bundle" (#1), "relay" (#2, no connection in time or dropped), "init" (#3) */
var WC_REASON = "";
var WC_PHASE = "";

/* default off: the flag must be set on purpose in this browser */
function wcOn(){ try { return localStorage.getItem("tz_wc_on")==="1" } catch(e){ return false } }

var WC_REASON_KEY = {bundle:["wcNoBundle","#1"], relay:["wcNoRelay","#2"], init:["wcInitFail","#3"]};
function wcLabel(s){
  if(s==="connected") return t("wcConnected");
  if(s!=="failed") return t("wcConnecting");
  var r = WC_REASON_KEY[WC_REASON];
  return r ? t(r[0])+" · "+r[1] : t("wcFailed");
}

function wcStatusHTML(){
  if(!wcOn()) return "";
  return '<div class="tz-wc-status" id="wcStatus" role="status" aria-live="polite" data-state="'+WC_STATE+'" data-reason="'+(WC_STATE==="failed"?WC_REASON:"")+'">'+esc(wcLabel(WC_STATE))+'</div>';
}

function wcSet(s){
  WC_STATE = s;
  if(s!=="failed") WC_REASON = "";
  var el = document.getElementById("wcStatus");
  if(el){ el.textContent = wcLabel(s); el.setAttribute("data-state", s); el.setAttribute("data-reason", s==="failed"?WC_REASON:"") }
}
function wcFailWith(reason){ WC_REASON = reason; wcSet("failed") }

/* loads the bundle once, only when needed */
function wcLoadBundle(){
  if(window.TAZVERA_WC) return Promise.resolve();
  return new Promise(function(resolve, reject){
    var s = document.createElement("script");
    s.src = "app/walletconnect/tazvera-walletkit.js";
    s.onload = function(){ window.TAZVERA_WC ? resolve() : reject(new Error("bundle")) };
    s.onerror = function(){ reject(new Error("load")) };
    document.head.appendChild(s);
  });
}

/* starts once per page. Says "connected" only when the relay confirms it. A failure names its reason. */
function wcStart(){
  if(!wcOn() || WC_STARTED) return;
  WC_STARTED = true;
  WC_PHASE = "bundle";
  wcSet("connecting");
  var timer = setTimeout(function(){
    if(WC_STATE==="connected") return;
    /* still loading the file: bundle; otherwise the relay did not answer in time */
    wcFailWith(WC_PHASE==="bundle" ? "bundle" : "relay");
  }, WC_TIMEOUT_MS);
  wcLoadBundle().then(function(){
    WC_PHASE = "init";
    var W = window.TAZVERA_WC;
    if(!W || !W.Core || !W.WalletKit) throw new Error("bundle");
    var core = new W.Core({ projectId: WC_PROJECT_ID, relayUrl: WC_RELAY });
    core.relayer.on("relayer_connect", function(){ clearTimeout(timer); wcSet("connected") });
    core.relayer.on("relayer_disconnect", function(){ wcFailWith("relay") });
    return W.WalletKit.init({ core: core, metadata: WC_META }).then(function(kit){ WC_KIT = kit; kit.on("session_proposal", wcOnProposal) });
  }).catch(function(){
    clearTimeout(timer);
    /* before init starts, the file did not load (#1); after that, init failed (#3) */
    wcFailWith(WC_PHASE==="bundle" ? "bundle" : "init");
  });
}

/* ---- sessions (step 2) ---- */
/* Chains Tazvera can show. Mainnet only when the user has it switched on (beta()). */
var WC_CHAINS = {"eip155:56":"BNB Smart Chain","eip155:1":"Ethereum","eip155:97":"BNB Testnet","eip155:11155111":"Sepolia","eip155:8118":"Shardeum Mainnet","eip155:8119":"Shardeum Testnet"};
function wcChainOk(c){ if(!WC_CHAINS[c]) return false; if(c==="eip155:8118") return typeof beta==="function" && beta(); return true }

/* The session we offer. Rules:
   - every REQUIRED chain must be one Tazvera supports; otherwise the whole proposal is refused (no silent drop)
   - any REQUIRED method or event, or any required namespace other than eip155, is refused (we support none of them)
   - optional chains we do not support are simply left out
   - the session has no methods and no events, so nothing can be signed in this step
   Returns null when the proposal must be refused. Pure function. */
function wcBuildNamespaces(params, addr){
  var rq = (params && params.requiredNamespaces) || {};
  var req = rq.eip155 || {};
  var opt = (params && params.optionalNamespaces && params.optionalNamespaces.eip155) || {};
  if(Object.keys(rq).some(function(k){ return k !== "eip155" })) return null;
  if((req.methods || []).length || (req.events || []).length) return null;
  var reqChains = req.chains || [];
  if(reqChains.some(function(c){ return !wcChainOk(c) })) return null;
  var all = reqChains.concat((opt.chains || []).filter(wcChainOk));
  var chains = all.filter(function(c, i){ return all.indexOf(c) === i });
  if(!chains.length) return null;
  return { eip155: { chains: chains, accounts: chains.map(function(c){ return c + ":" + addr }), methods: [], events: [] } };
}

function wcHost(u){ try { return new URL(String(u)).hostname.toLowerCase() } catch(e){ return "" } }

/* What the screen may show as the site's address. It comes from WalletConnect's check (verifyContext), never from the site's own metadata.
   state: "verified" (green) · "unverified" (yellow) · "mismatch" (red, refused)
   host: the checked address (only when verified) · claim: what the site says it is */
function wcVerify(p){
  var v = (p && p.verifyContext && p.verifyContext.verified) || {};
  var meta = (p && p.proposer && p.proposer.metadata) || {};
  var claim = wcHost(meta.url), real = wcHost(v.verifyUrl), val = String(v.validation || "UNKNOWN");
  if(v.isScam || val === "INVALID") return { state: "mismatch", host: real, claim: claim };
  if(real && claim && real !== claim) return { state: "mismatch", host: real, claim: claim };
  if(val === "VALID" && real) return { state: "verified", host: real, claim: claim };
  return { state: "unverified", host: "", claim: claim };
}

function wcReject(id, msg){
  try { WC_KIT && WC_KIT.rejectSession({ id: id, reason: { code: 5000, message: msg || "User rejected" } }) } catch(e){}
}

/* A site asks to connect. Refused when the wallet is locked, the chains or methods cannot be served, or the site's identity does not match. */
function wcOnProposal(ev){
  var p = (ev && ev.params) || ev || {};
  var id = p.id != null ? p.id : (ev && ev.id);
  if(id == null) return;
  if(typeof CPW === "undefined" || !CPW.unlocked()){ wcReject(id, "Wallet is locked"); toast(t("wcLocked")); return }
  var ns = wcBuildNamespaces(p, CPW.address());
  if(!ns){ wcReject(id, "Unsupported request"); toast(t("wcUnsup")); return }
  var vf = wcVerify(p);
  var rows = ns.eip155.chains.map(function(c){ return '<div class="srow"><span>'+esc(t("sgChain"))+'</span><b>'+esc(WC_CHAINS[c])+'</b></div>' }).join("");
  var origin = '<div class="srow"><span>'+esc(t("wcOriginT"))+'</span><b>'+esc(vf.host || t("wcOriginNone"))+'</b></div>';
  var claim = '<div class="srow"><span>'+esc(t("wcClaimT"))+'</span><b>'+esc(vf.claim || "-")+'</b></div>';
  if(vf.state === "mismatch"){
    wcReject(id, "Site identity mismatch");
    sheet('<div class="grab"></div><div class="sht">'+esc(t("wcAskT"))+'</div>'+origin+claim+
      '<div class="sgwarn"><b>'+esc(t("wcMismatch"))+'</b></div>'+
      '<div class="sgb"><button class="btnw" id="wcNo">'+esc(t("wcNo"))+'</button></div>', true);
    $("wcNo").onclick = function(){ closeSheet() };
    return;
  }
  var badge = vf.state === "verified"
    ? '<div style="color:#4CF07A;font-weight:700;margin:8px 0">'+esc(t("wcVerOk"))+'</div>'
    : '<div class="sgwarn"><b>'+esc(t("wcVerNo"))+'</b></div>';
  sheet('<div class="grab"></div><div class="sht">'+esc(t("wcAskT"))+'</div>'+badge+origin+claim+rows+
    '<div class="note2">'+esc(t("wcAskS"))+'</div>'+
    '<div class="sgb"><button class="btnw" id="wcNo">'+esc(t("wcNo"))+'</button><button class="btn" id="wcOk">'+esc(t("wcOk"))+'</button></div>', true);
  $("wcNo").onclick = function(){ wcReject(id); closeSheet() };
  $("wcOk").onclick = function(){
    if(typeof CPW === "undefined" || !CPW.unlocked()){ wcReject(id, "Wallet is locked"); closeSheet(); toast(t("wcLocked")); return }
    /* on failure only a message: no second reject for the same request */
    WC_KIT.approveSession({ id: id, namespaces: ns }).then(
      function(){ closeSheet(); toast(t("wcDone")) },
      function(){ closeSheet(); toast(t("wcFail")) });
  };
}
