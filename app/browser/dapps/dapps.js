/* Tazvera wallet · dApps discovery · MIT */
"use strict";
var TAZVERA_DAPPS=[],TAZVERA_DAPPS_READY=false,TAZVERA_DAPPS_LOADING=false;
function dappsLoad(){
 if(TAZVERA_DAPPS_READY||TAZVERA_DAPPS_LOADING)return;TAZVERA_DAPPS_LOADING=true;
 fetch("/app/browser/dapps/catalog.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw Error("catalog unavailable");return r.json()}).then(function(data){
  if(!data||data.schemaVersion!==1||!Array.isArray(data.items))throw Error("invalid catalogue");
  var allowed={bsc:true,shardeum:true};
  TAZVERA_DAPPS=data.items.filter(function(x){return x&&x.domainVerified===true&&typeof x.id==="string"&&typeof x.name==="string"&&typeof x.description==="string"&&/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(x.domain||"")&&Array.isArray(x.networks)&&x.networks.length>0&&x.networks.every(function(n){return !!allowed[n]})&&x.icon&&typeof x.icon.mark==="string"&&x.icon.mark.length<=2});
  TAZVERA_DAPPS_READY=true;if(S.tab==="dapps")render();
 }).catch(function(){TAZVERA_DAPPS=[];TAZVERA_DAPPS_READY=true;if(S.tab==="dapps")render()}).finally(function(){TAZVERA_DAPPS_LOADING=false});
}
function dappSelectedChain(){var v=ls("dappSelectedChain","all");return ["all","bsc","shardeum"].indexOf(v)>=0?v:"all"}
function dappChainName(v){return v==="bsc"?"BNB Chain":v==="shardeum"?"Shardeum":"All"}
function dappChainCount(v){return TAZVERA_DAPPS.filter(function(x){return v==="all"||x.networks.indexOf(v)>=0}).length}
function dappChainPicker(){
 if(!S.dappChainPickerOpen)return "";var selected=dappSelectedChain();
 return '<div class="tz-chain-backdrop" data-chain-close="1"><section class="tz-chain-sheet" role="dialog" aria-modal="true" aria-label="Choose chain"><div class="tz-chain-sheet-heading"><h2>Choose chain</h2><button type="button" data-chain-close="1" aria-label="Close">×</button></div>'+
 ["all","bsc","shardeum"].map(function(v){return '<button type="button" class="tz-chain-option" data-chain-select="'+v+'" aria-pressed="'+(selected===v?'true':'false')+'"><span>'+(v==="all"?"All":v==="bsc"?"BNB Chain":"Shardeum")+'</span><span class="tz-chain-count">'+dappChainCount(v)+'</span><span class="tz-chain-check">'+(selected===v?"✓":"")+'</span></button>'}).join("")+'</section></div>';
}
function dappNetworkLabel(x){return x.networks.map(function(n){return n==="bsc"?"BNB Chain":"Shardeum"}).join(" · ")}
function dappIcon(x,kind){
 var file=""; /* Use letters until an original official logo asset is verified. */
 return '<span class="tz-dapp-mark '+(kind||"")+'" aria-hidden="true"><span class="tz-dapp-fallback">'+esc((x.icon&&x.icon.mark)||x.name.slice(0,1))+'</span>'+(file?'<img class="tz-dapp-logo" src="'+esc(file)+'" alt="" loading="lazy">':"")+'</span>';
}
function dappDomainStatus(x){return x.domainVerified===true?"":'<small class="tz-domain-unverified">Domain not verified</small>'}
function dappRow(x){
 return '<button type="button" class="tz-dapp-row" data-dapp-open="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+'"><span class="tz-dapp-row-icon">'+dappIcon(x)+'</span><span class="tz-dapp-row-copy"><b>'+esc(x.name)+'</b><small>'+esc(x.domain)+'</small>'+dappDomainStatus(x)+'</span><span class="tz-dapp-chevron" aria-hidden="true">›</span></button>';
}
function dappIsAddress(v){var s=String(v||"").trim();return !!s&&!/\s/.test(s)&&(/^(https?:\/\/)/i.test(s)||/^[a-z0-9-]+(\.[a-z0-9-]+)+(?::\d{1,5})?(\/[^\s]*)?$/i.test(s))}
function dappAddressUrl(v){if(!dappIsAddress(v))return "";return brwClean(v)||""}
function dappOpenAddress(v){var u=dappAddressUrl(v);if(!u){toast("Enter a valid website address.");return}S.dappChainPickerOpen=false;brwLaunch(u)}
function dappOpenById(id){
 var x=TAZVERA_DAPPS.find(function(v){return v.id===id});
 if(!x||!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(x.domain||"")){toast("Invalid dApp URL.");return}
 S.dappChainPickerOpen=false;brwLaunch("https://"+x.domain);
}
function dappsHTML(){
 dappsLoad();var raw=String(S.dappQuery||"").trim(),q=raw.toLowerCase(),url=dappAddressUrl(raw),chain=dappSelectedChain();
 var items=TAZVERA_DAPPS.filter(function(x){return (chain==="all"||x.networks.indexOf(chain)>=0)&&(!q||url||[x.name,x.description,x.domain,dappNetworkLabel(x)].join(" ").toLowerCase().indexOf(q)>=0)});
 var suggestion=url?'<button type="button" class="tz-address-suggestion" data-dapp-address="'+esc(url)+'"><span aria-hidden="true">↗</span><span><b>Open '+esc(url)+'</b><small>Open website in a new tab</small></span><span>Enter ↵</span></button>':"";
 return '<main class="tz-dapps-shell"><header class="tz-dapps-header"><div class="tz-dapps-header-left"><button class="tz-dapps-back" type="button" data-tab="exp" aria-label="Back">←</button><h1>dApps</h1></div><button class="tz-chain-trigger" type="button" data-chain-toggle="1" aria-haspopup="dialog" aria-expanded="'+(S.dappChainPickerOpen?'true':'false')+'">'+esc(chain==="all"?"All":chain==="bsc"?"BNB Chain":"Shardeum")+' <span aria-hidden="true">▾</span></button></header>'+
 '<form class="tz-dapps-search-wrap" id="tzDappSearchForm" autocomplete="off"><label class="tz-dapps-search"><span aria-hidden="true">⌕</span><input id="tzDappSearch" type="search" value="'+esc(raw)+'" placeholder="Search dApps or enter a website" autocomplete="off" spellcheck="false" aria-label="Search dApps or enter a website"></label>'+suggestion+'</form>'+
 '<section class="tz-dapps-section tz-all-section"><div class="tz-dapps-section-head"><h2>ALL DAPPS</h2></div><div class="tz-popular-list">'+(items.length?items.map(dappRow).join(""):'<p class="tz-dapp-empty">No dApps match your search.</p>')+'</div></section>'+dappChainPicker()+'</main>';
}
document.addEventListener("click",function(e){
 var t=e.target&&e.target.closest?e.target.closest("[data-chain-toggle],[data-chain-select],[data-chain-close],[data-dapp-open],[data-dapp-address]"):null;if(!t)return;
 if(t.hasAttribute("data-chain-toggle")){S.dappChainPickerOpen=!S.dappChainPickerOpen;render();return}
 if(t.hasAttribute("data-chain-select")){lss("dappSelectedChain",t.getAttribute("data-chain-select"));S.dappChainPickerOpen=false;render();return}
 if(t.hasAttribute("data-chain-close")){if(t.classList.contains("tz-chain-backdrop")&&e.target!==t)return;S.dappChainPickerOpen=false;render();return}
 if(t.hasAttribute("data-dapp-open")){dappOpenById(t.getAttribute("data-dapp-open"));return}
 if(t.hasAttribute("data-dapp-address"))dappOpenAddress(t.getAttribute("data-dapp-address"));
});
document.addEventListener("submit",function(e){if(!e.target||e.target.id!=="tzDappSearchForm")return;e.preventDefault();var input=document.getElementById("tzDappSearch");if(input&&dappIsAddress(input.value))dappOpenAddress(input.value)});
document.addEventListener("input",function(e){
 if(!e.target||e.target.id!=="tzDappSearch")return;S.dappQuery=e.target.value;var pos=e.target.selectionStart;render();
 var next=document.getElementById("tzDappSearch");if(next){next.focus();try{next.setSelectionRange(pos,pos)}catch(ignore){}}
});
document.addEventListener("load",function(e){
 var img=e.target;if(!img||!img.classList||!img.classList.contains("tz-dapp-logo"))return;
 if(img.parentNode&&img.parentNode.classList)img.parentNode.classList.add("has-logo");
},true);
document.addEventListener("error",function(e){
 var img=e.target;if(!img||!img.classList||!img.classList.contains("tz-dapp-logo"))return;
 img.style.display="none";if(img.parentNode&&img.parentNode.classList)img.parentNode.classList.remove("has-logo");var fallback=img.parentNode&&img.parentNode.querySelector(".tz-dapp-fallback");if(fallback)fallback.style.opacity="1";
},true);
