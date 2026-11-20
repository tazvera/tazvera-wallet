
(function(){var CA="0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73";
function setLang(l){document.documentElement.lang=l;[].forEach.call(document.querySelectorAll("[data-hi]"),function(e){if(e.dataset.en===undefined)e.dataset.en=e.innerHTML;e.innerHTML=l==="hi"?e.dataset.hi:e.dataset.en});[].forEach.call(document.querySelectorAll("img[data-hisrc]"),function(i){if(!i.dataset.ensrc)i.dataset.ensrc=i.src;i.src=l==="hi"?i.dataset.hisrc:i.dataset.ensrc});var b=document.getElementById("langBtn");if(b)b.textContent=l==="hi"?"English":"हिंदी";try{localStorage.setItem("tz_web_lang",l)}catch(e){}}
var q=new URLSearchParams(location.search).get("lang"),saved=null;try{saved=localStorage.getItem("tz_web_lang")}catch(e){}
setLang(q==="hi"||q==="en"?q:(saved||"en"));
var hd=document.querySelector("header");function sc(){hd.classList.toggle("scr",scrollY>10)}addEventListener("scroll",sc,{passive:true});sc();
var ab=document.getElementById("adBar");if(ab&&Date.now()>Date.UTC(2026,10,15,18,30))ab.remove();
document.getElementById("langBtn").onclick=function(){setLang(document.documentElement.lang==="hi"?"en":"hi")};
function toast(t){var d=document.createElement("div");d.textContent=t;d.style.cssText="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#000000;color:#fff;padding:12px 18px;border-radius:14px;font:600 14px Poppins,sans-serif;z-index:99";document.body.appendChild(d);setTimeout(function(){d.remove()},2200)}
var hi=function(){return document.documentElement.lang==="hi"};
document.querySelector("[data-copy]").onclick=function(){try{navigator.clipboard.writeText(CA);toast(hi()?"पता कॉपी हो गया":"Address copied")}catch(e){}};
document.querySelector("[data-mm]").onclick=async function(){var eth=window.ethereum;if(!eth){toast(hi()?"MetaMask नहीं मिला। कंप्यूटर पर MetaMask के साथ खोलिए।":"MetaMask not found. Open on a computer with MetaMask.");return}
 try{try{await eth.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x1fb6"}]})}catch(e){if(e&&e.code===4902)await eth.request({method:"wallet_addEthereumChain",params:[{chainId:"0x1fb6",chainName:"Shardeum Mainnet",nativeCurrency:{name:"SHM",symbol:"SHM",decimals:18},rpcUrls:["https://api.shardeum.org"],blockExplorerUrls:["https://explorer.shardeum.org"]}]});else throw e}
 var ok=await eth.request({method:"wallet_watchAsset",params:{type:"ERC20",options:{address:CA,symbol:"TZV",decimals:18,image:"https://app.tazvera.com/brand/tzv/tzv-logo-256.png"}}});if(ok)toast(hi()?"TZV MetaMask में जुड़ गया":"TZV added to MetaMask")}catch(e){toast(hi()?"नहीं जुड़ा, फिर कोशिश कीजिए":"Could not add. Try again.")}};
})();
