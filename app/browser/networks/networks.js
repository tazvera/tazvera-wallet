/* Tazvera wallet · app/browser/networks/networks.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Everything about networks lives here. To add a chain, add one entry to NETS and, if it needs a
   second node, one line to RPCB in features/send-safety.js. Nothing else has to be touched. */
var NETS={"shardeum-testnet":{name:"Shardeum Testnet",chainId:"0x1fb7",dec:8119,sym:"SHM",rpc:TAZVERA_SHARDEUM.testnetRpc,exp:"https://explorer-mezame.shardeum.org",test:true,tzt:"0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0"},
"bsc-testnet":{name:"BNB Testnet",chainId:"0x61",dec:97,sym:"tBNB",rpc:"https://data-seed-prebsc-1-s1.bnbchain.org:8545",exp:"https://testnet.bscscan.com",test:true},
"sepolia":{name:"Sepolia",chainId:"0xaa36a7",dec:11155111,sym:"SepoliaETH",rpc:"https://ethereum-sepolia-rpc.publicnode.com",exp:"https://sepolia.etherscan.io",test:true},
"bsc":{name:"BNB Chain",chainId:"0x38",dec:56,sym:"BNB",rpc:"https://bsc-rpc.publicnode.com",exp:"https://bscscan.com",test:false},
"ethereum":{name:"Ethereum",chainId:"0x1",dec:1,sym:"ETH",rpc:"https://ethereum-rpc.publicnode.com",exp:"https://etherscan.io",test:false},
"shardeum":{name:"Shardeum Mainnet",chainId:"0x1fb6",dec:8118,sym:"SHM",rpc:TAZVERA_SHARDEUM.mainnetRpc,exp:"https://explorer.shardeum.org",test:false,beta:true,tzv:"0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73"}};

function coinName(n){var y=String(n&&n.sym||"").toLowerCase();
  if(y==="shm")return "Shardeum";
  if(y==="bnb"||y==="tbnb")return "BNB";
  if(y==="eth"||y==="sepoliaeth")return "Ethereum";
  return (n&&n.sym)||""}
function netLogo(k){return (k==="bsc"||k==="bsc-testnet")?CG.BNB:(k==="ethereum"||k==="sepolia")?CG.ETH:SHMLOGO}

/* the network picker */
function netSheet(){var h='<div class="grab"></div><div class="sht">'+esc(t("netT"))+'</div>';
 function opt(k,n){return '<button class="opt" data-pick="'+k+'"><span class="ci"><img src="'+netLogo(k)+'" alt=""></span><div class="m"><b>'+esc(n.name)+(n.test?'':' <span class="rtag">'+esc(t("realTag"))+'</span>')+'</b><small>'+esc(n.sym)+'</small></div>'+(S.net===k?'<span class="tick">'+ic("check",20,2.4)+'</span>':"")+'</button>'}
 /* two groups only: test networks (fake money) and real-money networks, each with its own heading */
 var tests="",reals="";
 Object.keys(NETS).forEach(function(k){var n=NETS[k];if(n.beta)return;if(n.test)tests+=opt(k,n);else reals+=opt(k,n)});
 if(beta()||S.mode==="mm")reals=opt("shardeum",NETS.shardeum)+reals;
 h+='<div class="grp">'+esc(t("testN"))+'</div>'+tests+'<div class="grp">'+esc(t("realN"))+'</div>'+reals;sheet(h)}
