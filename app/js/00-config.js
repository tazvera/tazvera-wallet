/* Tazvera wallet · 00-config.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
var SHMLOGO="app/img/shm.png",LOGO="icon-192.png",TZVLOGO="brand/tzv/tzv-logo-128.png";
var CG={BTC:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png",ETH:"https://assets.coingecko.com/coins/images/279/small/ethereum.png",BNB:"https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",USDT:"https://assets.coingecko.com/coins/images/325/small/Tether.png"};
/* The token is called BNB; "BNB Chain" is the network. Never show the network name as a coin. */


/* Token contracts per network. Add an address only after checking it on the official source and the explorer.
   USDC (Ethereum): Circle developer docs. WBNB (BSC): found on several explorer aggregators; check it on bscscan.com before relying on it. */
var CHAIN_TOKENS={"ethereum":[{sym:"USDC",name:"USD Coin",addr:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",dec:6,src:"circle-docs"},{sym:"USDT",name:"Tether USD",addr:"0xdAC17F958D2ee523a2206206994597C13D831ec7",dec:6,src:"tether-official"},{sym:"USDe",name:"Ethena USDe",addr:"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",dec:18,src:"ethena-docs"},{sym:"LINK",name:"Chainlink",addr:"0x514910771AF9Ca656af840dff83E8264EcF986CA",dec:18,src:"chainlink-docs"}],"bsc":[{sym:"WBNB",name:"Wrapped BNB",addr:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",dec:18,src:"unverified-aggregator"},{sym:"CAKE",name:"PancakeSwap Token",addr:"0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",dec:18,src:"pancakeswap-docs"}]};
var KNOWN_CONTRACTS=["0x4cc2d29b65e6a2cd788a144a81e5e99bd892de73","0xc75149e5c95a41b0a4c9e3378d5fc6aaac2cc5f0","0x02b9e35cd82e5c781097d2188b4334c2485438bc","0x623a0e7628f281236d1d81ca1aceecedcc30443e","0xca3a736464f6e0d5ab5d9675fe26b878e6a0eb08","0x9f1da8bc7083e73f1ce93ea14afe7f22bbaf3c6b","0x4cb4a91694b0cdde83fe68ec34376f3ac1f1b790"];
function ls(k,d){try{var v=localStorage.getItem("cp3_"+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function lss(k,v){try{localStorage.setItem("cp3_"+k,JSON.stringify(v))}catch(e){}}
function raw(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
function rawSet(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function beta(){return raw("cp3_mainnet_beta","0")==="1"}
var S={lang:ls("lang","en"),net:ls("v2net","shardeum-testnet"),addr:"",mode:"",bal:null,tzt:null,inr:null,hide:ls("hide",false),tab:"home",flt:"all",
 snd:{tok:"native",to:"",amt:"",fee:null,err:"",cur:"tok",rs:""},mk:null};
if(!NETS[S.net]||(NETS[S.net].beta&&!beta()))S.net="shardeum-testnet";

/* WalletConnect Cloud project ID (public identifier, not a secret). Used only by the dApp connection feature. */
