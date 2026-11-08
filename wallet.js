/* Tazvera in-app wallet: Shardeum Mainnet + test networks (Shardeum Testnet, BNB Testnet, Sepolia). Keys are encrypted with your PIN and never leave this device. */
(function(){
var E=window.ethers;if(!E)return;
var KS="cp3_inapp_keystore",W=null;
/* Test networks; Shardeum Mainnet is added in nets() unless switched off */
var NETS={"0x1fb7":{id:8119,r:["https://api-mezame.shardeum.org"]},"0x61":{id:97,r:["https://data-seed-prebsc-1-s1.bnbchain.org:8545","https://bsc-testnet-rpc.publicnode.com"]},"0xaa36a7":{id:11155111,r:["https://ethereum-sepolia-rpc.publicnode.com","https://sepolia.drpc.org"]}};
/* Shardeum Mainnet is on unless the user switched it off in About (cp3_mainnet_beta = "0") */
function nets(){var n={};for(var k in NETS)n[k]=NETS[k];try{if(localStorage.getItem("cp3_mainnet_beta")!=="0")n["0x1fb6"]={id:8118,r:["https://api.shardeum.org"]}}catch(e){}return n}
var CHAIN="0x1fb7";try{var sc=localStorage.getItem("cp3_inapp_chain");if(sc&&nets()[sc])CHAIN=sc}catch(e){}
var RI=0;
function prov(){var n=nets()[CHAIN]||NETS["0x1fb7"];return new E.JsonRpcProvider(n.r[RI%n.r.length],n.id,{staticNetwork:true})}
async function tryP(f){try{return await f(prov())}catch(e){if((nets()[CHAIN]||NETS["0x1fb7"]).r.length>1){RI++;return await f(prov())}throw e}}
function setChain(c){c=String(c||"").toLowerCase();if(!nets()[c])throw{code:4902,message:"This network is not available in the Tazvera wallet."};if(c!==CHAIN){CHAIN=c;RI=0;try{localStorage.setItem("cp3_inapp_chain",c)}catch(e){}}return null}
var P={isCpWallet:true,
request:async function(a){var m=a.method,p=a.params||[];
if(m==="eth_chainId")return CHAIN;
if(m==="wallet_switchEthereumChain"||m==="wallet_addEthereumChain")return setChain(p[0]&&p[0].chainId);
switch(m){
case"eth_getBalance":return"0x"+(await tryP(function(v){return v.getBalance(p[0])})).toString(16);
case"eth_call":return await tryP(function(v){return v.call(p[0])});
case"eth_blockNumber":return"0x"+(await tryP(function(v){return v.getBlockNumber()})).toString(16);
case"eth_gasPrice":return await tryP(function(v){return v.send("eth_gasPrice",[])});
case"eth_estimateGas":return"0x"+(await tryP(function(v){return v.estimateGas(p[0])})).toString(16);
case"eth_requestAccounts":case"eth_accounts":{var ad=window.CPW.address();if(ad)return[ad];break}}
if(!W)throw{code:4100,message:"Wallet is locked"};
switch(m){
case"eth_sendTransaction":{var t=p[0],pv=prov(),gp=await pv.send("eth_gasPrice",[]),est=await pv.estimateGas({from:W.address,to:t.to,data:t.data,value:t.value}),r=await W.connect(pv).sendTransaction({to:t.to,data:t.data,value:t.value,type:0,gasPrice:gp,gasLimit:est*12n/10n});return r.hash}
default:throw{code:-32601,message:"Not supported: "+m}}},
on:function(){},removeListener:function(){}};
function ks(){return localStorage.getItem(KS)}
window.CPW={has:function(){return!!ks()},unlocked:function(){return!!W},
address:function(){if(W)return W.address;try{return E.getAddress("0x"+JSON.parse(ks()).address)}catch(e){return""}},
create:async function(pin){var w=E.Wallet.createRandom();localStorage.setItem(KS,await w.encrypt(pin));W=w;return w.mnemonic.phrase},
imp:async function(phrase,pin){var w=E.Wallet.fromPhrase(String(phrase).trim().toLowerCase().replace(/\s+/g," "));localStorage.setItem(KS,await w.encrypt(pin));W=w},
unlock:async function(pin){W=await E.Wallet.fromEncryptedJson(ks(),pin)},
phrase:async function(pin){var w=await E.Wallet.fromEncryptedJson(ks(),pin);return w.mnemonic?w.mnemonic.phrase:""},
unlockKs:async function(js,pw,expect){var x=await E.Wallet.fromEncryptedJson(js,pw);if(expect&&x.address.toLowerCase()!==String(expect).toLowerCase())throw new Error("wrong wallet");W=x},
lock:function(){W=null},remove:function(){localStorage.removeItem(KS);W=null}};
window.tazveraProvider=P; /* used only by the Tazvera app itself; it is not exposed as window.ethereum */
})();
