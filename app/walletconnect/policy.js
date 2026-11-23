/* Tazvera WalletConnect policy · MIT License
 * Fail-closed policy for the planned WalletConnect integration.
 * It does not create sessions, sign requests, or enable WalletConnect by itself.
 */
(function(root){
  "use strict";
  var CHAINS=Object.freeze(["eip155:56","eip155:8118"]);
  var METHODS=[
    "eth_accounts","eth_chainId","eth_blockNumber","eth_call","eth_getBalance",
    "eth_gasPrice","eth_estimateGas","eth_getTransactionCount",
    "eth_getTransactionReceipt","eth_getBlockByNumber","eth_getCode","eth_getLogs",
    "eth_sendTransaction","personal_sign","eth_signTypedData_v4"
  ];
  var EVENTS=["accountsChanged","chainChanged"];
  function uniqueAllowed(values,allowed){
    if(!Array.isArray(values)||values.length===0)return false;
    var seen={};
    for(var i=0;i<values.length;i++){
      var v=values[i];
      if(typeof v!=="string"||allowed.indexOf(v)<0||seen[v])return false;
      seen[v]=true;
    }
    return true;
  }
  function keysAllowed(obj,allowed){
    if(!obj||typeof obj!=="object"||Array.isArray(obj))return false;
    return Object.keys(obj).every(function(k){return allowed.indexOf(k)>=0});
  }
  function validChain(chain){return typeof chain==="string"&&CHAINS.indexOf(chain)>=0}
  function validateProposal(p){
    var ns=p&&p.params&&p.params.requiredNamespaces;
    if(!ns||!keysAllowed(ns,["eip155"])||!ns.eip155)return {ok:false,reason:"unsupported_namespace"};
    var e=ns.eip155;
    /* One chain per session: no accidental cross-chain permissions. */
    if(!Array.isArray(e.chains)||e.chains.length!==1||!validChain(e.chains[0]))return {ok:false,reason:"unsupported_chain"};
    if(!uniqueAllowed(e.methods,METHODS))return {ok:false,reason:"unsupported_method"};
    if(!Array.isArray(e.events)||!e.events.every(function(x){return EVENTS.indexOf(x)>=0})||new Set(e.events).size!==e.events.length)return {ok:false,reason:"unsupported_event"};
    return {ok:true,chain:e.chains[0],methods:e.methods.slice(),events:e.events.slice()};
  }
  function validateRequest(r){
    if(!r||!validChain(r.chainId))return {ok:false,reason:"unsupported_chain"};
    if(typeof r.method!=="string"||METHODS.indexOf(r.method)<0)return {ok:false,reason:"unsupported_method"};
    return {ok:true,chain:r.chainId,method:r.method,requiresUserApproval:["eth_sendTransaction","personal_sign","eth_signTypedData_v4"].indexOf(r.method)>=0};
  }
  function validateSession(s){
    var ns=s&&s.namespaces;
    if(!keysAllowed(ns,["eip155"])||!ns.eip155)return {ok:false,reason:"unsupported_namespace"};
    var e=ns.eip155;
    if(!Array.isArray(e.chains)||e.chains.length!==1||!validChain(e.chains[0]))return {ok:false,reason:"unsupported_chain"};
    var chain=e.chains[0],chainId=chain.slice("eip155:".length);
    if(!uniqueAllowed(e.methods,METHODS))return {ok:false,reason:"unsupported_method"};
    if(!Array.isArray(e.events)||!e.events.every(function(x){return EVENTS.indexOf(x)>=0})||new Set(e.events).size!==e.events.length)return {ok:false,reason:"unsupported_event"};
    if(!Array.isArray(e.accounts)||e.accounts.length!==1)return {ok:false,reason:"invalid_account"};
    var a=e.accounts[0];
    if(typeof a!=="string"||!new RegExp("^eip155:"+chainId+":0x[0-9a-fA-F]{40}$").test(a))return {ok:false,reason:"invalid_account"};
    return {ok:true,chain:chain,account:a};
  }
  root.TazveraWCPolicy=Object.freeze({
    chains:CHAINS,methods:Object.freeze(METHODS.slice()),events:Object.freeze(EVENTS.slice()),
    validateProposal:validateProposal,validateRequest:validateRequest,validateSession:validateSession
  });
})(typeof window!=="undefined"?window:globalThis);
