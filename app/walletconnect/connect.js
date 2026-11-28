/* Tazvera wallet · app/walletconnect/connect.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* WalletConnect, step 1: connection only. No sessions, no requests, no signing, no keys.
   Off unless this browser has the flag tz_wc_on = "1" (developer test). The bundle loads only when
   the dApps screen opens. / WalletConnect, चरण 1: सिर्फ़ जुड़ाव। कोई सेशन, अनुरोध, साइनिंग या कुंजी नहीं। */

Object.assign(L.en,{
 wcConnecting:"WalletConnect: connecting",
 wcConnected:"WalletConnect: connected",
 wcFailed:"WalletConnect: not connected"
});
Object.assign(L.hi,{
 wcConnecting:"WalletConnect: जुड़ रहा है",
 wcConnected:"WalletConnect: जुड़ गया",
 wcFailed:"WalletConnect: नहीं जुड़ा"
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
    return W.WalletKit.init({ core: core, metadata: WC_META }).then(function(kit){ WC_KIT = kit });
  }).catch(function(){ clearTimeout(timer); wcSet("failed") });
}
