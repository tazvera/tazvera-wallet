/* Tazvera wallet · app/walletconnect/connect.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* WalletConnect, step 2 (sessions only): a site may ask to connect; the user approves or rejects on a Tazvera screen.
   Approving shares the address and the chain list. There are still no requests, no signing and no keys.
   Off unless this browser has the flag tz_wc_on = "1" (developer test). The bundle loads only when
   the dApps screen opens. / WalletConnect, चरण 1: सिर्फ़ जुड़ाव। कोई सेशन, अनुरोध, साइनिंग या कुंजी नहीं। */

Object.assign(L.en,{
 wcConnecting:"WalletConnect: connecting",
 wcConnected:"WalletConnect: connected",
 wcFailed:"WalletConnect: not connected",
 wcAskT:"Connection request",
 wcAskS:"This site wants to connect to your wallet. It will see your address and the networks below. It cannot move money or sign anything without asking you again.",
 wcOk:"Connect",
 wcNo:"Reject",
 wcLocked:"Unlock the wallet first, then ask the site to connect again.",
 wcUnsup:"None of the networks requested is available in Tazvera.",
 wcDone:"Connected.",
 wcFail:"Could not connect. Nothing was shared."
});
Object.assign(L.hi,{
 wcConnecting:"WalletConnect: जुड़ रहा है",
 wcConnected:"WalletConnect: जुड़ गया",
 wcFailed:"WalletConnect: नहीं जुड़ा",
 wcAskT:"कनेक्शन की माँग",
 wcAskS:"यह साइट आपके वॉलेट से जुड़ना चाहती है। उसे आपका पता और नीचे की नेटवर्क सूची दिखेगी। आपसे दोबारा पूछे बिना वह पैसा नहीं भेज सकती और कुछ साइन नहीं कर सकती।",
 wcOk:"जुड़ें",
 wcNo:"अस्वीकार",
 wcLocked:"पहले वॉलेट अनलॉक करें, फिर साइट से दोबारा जुड़ने को कहें।",
 wcUnsup:"माँगे गए नेटवर्कों में से कोई भी Tazvera में उपलब्ध नहीं है।",
 wcDone:"जुड़ गया।",
 wcFail:"जुड़ नहीं सका। कुछ भी साझा नहीं हुआ।"
});

var WC_TIMEOUT_MS = 20000;
var WC_STATE = "connecting";
var WC_STARTED = false;
var WC_KIT = null;

/* default off: the flag must be set on purpose in this browser */
function wcOn(){ try { return localStorage.getItem("tz_wc_on")==="1" } catch(e){ return false } }

function wcLabel(s){ return t(s==="connected" ? "wcConnected" : s==="failed" ? "wcFailed" : "wcConnecting") }

function wcStatusHTML(){
  if(!wcOn()) return "";
  return '<div class="tz-wc-status" id="wcStatus" role="status" aria-live="polite" data-state="'+WC_STATE+'">'+esc(wcLabel(WC_STATE))+'</div>';
}

function wcSet(s){
  WC_STATE = s;
  var el = document.getElementById("wcStatus");
  if(el){ el.textContent = wcLabel(s); el.setAttribute("data-state", s) }
}

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

/* starts once per page. Says "connected" only when the relay confirms it. */
function wcStart(){
  if(!wcOn() || WC_STARTED) return;
  WC_STARTED = true;
  wcSet("connecting");
  var timer = setTimeout(function(){ if(WC_STATE!=="connected") wcSet("failed") }, WC_TIMEOUT_MS);
  wcLoadBundle().then(function(){
    var W = window.TAZVERA_WC;
    var core = new W.Core({ projectId: WC_PROJECT_ID, relayUrl: WC_RELAY });
    core.relayer.on("relayer_connect", function(){ clearTimeout(timer); wcSet("connected") });
    core.relayer.on("relayer_disconnect", function(){ wcSet("failed") });
    return W.WalletKit.init({ core: core, metadata: WC_META }).then(function(kit){ WC_KIT = kit; kit.on("session_proposal", wcOnProposal) });
  }).catch(function(){ clearTimeout(timer); wcSet("failed") });
}

/* ---- sessions (step 2) ---- */
/* Chains Tazvera can show. Mainnet only when the user has it switched on (beta()). */
var WC_CHAINS = {"eip155:56":"BNB Smart Chain","eip155:1":"Ethereum","eip155:97":"BNB Testnet","eip155:11155111":"Sepolia","eip155:8118":"Shardeum Mainnet","eip155:8119":"Shardeum Testnet"};
function wcChainOk(c){ if(!WC_CHAINS[c]) return false; if(c==="eip155:8118") return typeof beta==="function" && beta(); return true }

/* The session we offer: only the chains Tazvera supports, the wallet's address, and no methods or events.
   A site with no methods cannot send requests, so nothing can be signed in this step. Pure function: returns null if no chain is usable. */
function wcBuildNamespaces(params, addr){
  var req = (params && params.requiredNamespaces && params.requiredNamespaces.eip155) || {};
  var opt = (params && params.optionalNamespaces && params.optionalNamespaces.eip155) || {};
  var asked = [].concat(req.chains || [], opt.chains || []);
  var chains = asked.filter(function(c, i){ return wcChainOk(c) && asked.indexOf(c) === i });
  if(!chains.length) return null;
  return { eip155: { chains: chains, accounts: chains.map(function(c){ return c + ":" + addr }), methods: [], events: [] } };
}

function wcReject(id, msg){
  try { WC_KIT && WC_KIT.rejectSession({ id: id, reason: { code: 5000, message: msg || "User rejected" } }) } catch(e){}
}

/* A site asks to connect. Only handled when the wallet is unlocked; otherwise it is rejected with a clear reason. */
function wcOnProposal(ev){
  var p = (ev && ev.params) || ev || {};
  var id = p.id != null ? p.id : (ev && ev.id);
  if(id == null) return;
  if(typeof CPW === "undefined" || !CPW.unlocked()){ wcReject(id, "Wallet is locked"); toast(t("wcLocked")); return }
  var addr = CPW.address();
  var ns = wcBuildNamespaces(p, addr);
  if(!ns){ wcReject(id, "Unsupported chains"); toast(t("wcUnsup")); return }
  var meta = (p.proposer && p.proposer.metadata) || {};
  var site = esc(String(meta.name || "")) + (meta.url ? ' <small>' + esc(String(meta.url)) + '</small>' : "");
  var rows = ns.eip155.chains.map(function(c){ return '<div class="srow"><span>'+esc(t("sgChain"))+'</span><b>'+esc(WC_CHAINS[c])+'</b></div>' }).join("");
  sheet('<div class="grab"></div><div class="sht">'+esc(t("wcAskT"))+'</div><div class="sghead"><div><b>'+site+'</b></div></div>'+rows+
    '<div class="note2">'+esc(t("wcAskS"))+'</div>'+
    '<div class="sgb"><button class="btnw" id="wcNo">'+esc(t("wcNo"))+'</button><button class="btn" id="wcOk">'+esc(t("wcOk"))+'</button></div>', true);
  $("wcNo").onclick = function(){ wcReject(id); closeSheet() };
  $("wcOk").onclick = function(){
    if(typeof CPW === "undefined" || !CPW.unlocked()){ wcReject(id, "Wallet is locked"); closeSheet(); toast(t("wcLocked")); return }
    WC_KIT.approveSession({ id: id, namespaces: ns }).then(function(){ closeSheet(); toast(t("wcDone")) })
      .catch(function(){ wcReject(id); closeSheet(); toast(t("wcFail")) });
  };
}
