/* Tazvera wallet · 00-config.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
var SHMLOGO="app/img/shm.png",LOGO="icon-192.png",TZVLOGO="brand/tzv/tzv-logo-128.png";
var CG={BTC:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png",ETH:"https://assets.coingecko.com/coins/images/279/small/ethereum.png",BNB:"https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",USDT:"https://assets.coingecko.com/coins/images/325/small/Tether.png"};
function netLogo(k){return k==="bsc-testnet"?CG.BNB:k==="sepolia"?CG.ETH:SHMLOGO}
var NETS={"shardeum-testnet":{name:"Shardeum Testnet",chainId:"0x1fb7",dec:8119,sym:"SHM",rpc:"https://api-mezame.shardeum.org",exp:"https://explorer-mezame.shardeum.org",test:true,tzt:"0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0"},
"bsc-testnet":{name:"BNB Testnet",chainId:"0x61",dec:97,sym:"tBNB",rpc:"https://data-seed-prebsc-1-s1.bnbchain.org:8545",exp:"https://testnet.bscscan.com",test:true},
"sepolia":{name:"Sepolia",chainId:"0xaa36a7",dec:11155111,sym:"SepoliaETH",rpc:"https://ethereum-sepolia-rpc.publicnode.com",exp:"https://sepolia.etherscan.io",test:true},
"shardeum":{name:"Shardeum Mainnet",chainId:"0x1fb6",dec:8118,sym:"SHM",rpc:"https://api.shardeum.org",exp:"https://explorer.shardeum.org",test:false,beta:true,tzv:"0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73"}};
var KNOWN_CONTRACTS=["0x4cc2d29b65e6a2cd788a144a81e5e99bd892de73","0xc75149e5c95a41b0a4c9e3378d5fc6aaac2cc5f0","0x02b9e35cd82e5c781097d2188b4334c2485438bc","0x623a0e7628f281236d1d81ca1aceecedcc30443e","0xca3a736464f6e0d5ab5d9675fe26b878e6a0eb08","0x9f1da8bc7083e73f1ce93ea14afe7f22bbaf3c6b","0x4cb4a91694b0cdde83fe68ec34376f3ac1f1b790"];
function ls(k,d){try{var v=localStorage.getItem("cp3_"+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function lss(k,v){try{localStorage.setItem("cp3_"+k,JSON.stringify(v))}catch(e){}}
function raw(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
function rawSet(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function beta(){return raw("cp3_mainnet_beta","1")!=="0"}
var S={lang:ls("lang","en"),net:ls("v2net","shardeum-testnet"),addr:"",mode:"",bal:null,tzt:null,inr:null,hide:ls("hide",false),tab:"home",flt:"all",
 snd:{tok:"native",to:"",amt:"",fee:null,err:"",cur:"tok",rs:""},mk:null};
if(!NETS[S.net]||(NETS[S.net].beta&&!beta()))S.net="shardeum-testnet";
