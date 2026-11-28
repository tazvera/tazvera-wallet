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
/* network names and icons. The button shows only the icon; the list shows icon + name + count. */
function chainName(v){return v==="all"?"All networks":v==="bsc"?"BNB Chain":"Shardeum"}
/* Chain logos, in this order: a file in logos/chains/ (if one is added), then the default (Shardeum: app/img/shm.png;
   BNB Chain: CoinGecko's BNB icon). If neither loads, the circle shows the chain's first letter (B, S). */
var CHAIN_LOGO={};
function chainLogoSources(v){return v==="bsc"?["app/browser/layout/logos/chains/bnb-chain.svg",CG.BNB]:["app/browser/layout/logos/chains/shardeum.svg",SHMLOGO]}
function chainLogoCheck(v){
 if(CHAIN_LOGO[v])return;CHAIN_LOGO[v]="checking";
 var list=chainLogoSources(v),i=0;
 (function next(){
  if(i>=list.length){CHAIN_LOGO[v]="missing";return}
  var u=list[i++],im=new Image();
  im.onload=function(){CHAIN_LOGO[v]=u;if(typeof render==="function")render()};
  im.onerror=next;
  im.src=u;
 })();
}
function chainIcon(v,size){
 var px='width:'+size+'px;height:'+size+'px';
 if(v==="all")return '<span class="tz-chain-ico tz-chain-grid" style="'+px+'" aria-hidden="true"><svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="currentColor"/></svg></span>';
 chainLogoCheck(v);
 var u=CHAIN_LOGO[v];if(u&&u!=="checking"&&u!=="missing")return '<span class="tz-chain-ico" style="'+px+';background-image:url('+u+')" aria-hidden="true"></span>';
 return '<span class="tz-chain-ico tz-chain-letter" style="'+px+';font-size:'+Math.round(size*0.5)+'px" aria-hidden="true">'+esc(chainName(v).charAt(0))+'</span>';
}
function dappChainPicker(){
 if(!S.dappChainPickerOpen)return "";var selected=dappSelectedChain();
 return '<div class="tz-chain-pop" role="listbox" aria-label="Choose network">'+
  ["all","bsc","shardeum"].map(function(v){return '<button type="button" role="option" class="tz-chain-opt" data-chain-select="'+v+'" aria-selected="'+(selected===v?'true':'false')+'">'+chainIcon(v,20)+'<span class="tz-chain-name">'+esc(chainName(v))+'</span><span class="tz-chain-count">'+dappChainCount(v)+'</span><span class="tz-chain-check" aria-hidden="true">'+(selected===v?"✓":"")+'</span></button>'}).join("")+'</div>';
}
function dappNetworkLabel(x){return x.networks.map(function(n){return n==="bsc"?"BNB Chain":"Shardeum"}).join(" · ")}
function dappIcon(x,kind){
 var col=x.icon&&/^#[0-9a-f]{6}$/i.test(x.icon.color||"")?' style="background:'+x.icon.color+'"':"";
 var file=typeof x.iconFile==="string"&&/^app\/browser\/layout\/logos\/[a-z0-9._-]+\.(?:png|svg)$/i.test(x.iconFile)?"/"+x.iconFile:"";
 return '<span class="tz-dapp-mark '+(kind||"")+'"'+col+' aria-hidden="true"><span class="tz-dapp-fallback">'+esc((x.icon&&x.icon.mark)||x.name.slice(0,1))+'</span>'+(file?'<img class="tz-dapp-logo" src="'+esc(file)+'" alt="" loading="lazy">':"")+'</span>';
}
function dappDomainStatus(x){return x.domainVerified===true?"":'<small class="tz-domain-unverified">Domain not verified</small>'}
function dappRow(x){
 return '<button type="button" class="tz-dapp-popular-row tz-dapp-row" data-dapp-open="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+'"><span class="tz-dapp-row-icon">'+dappIcon(x)+'</span><span class="tz-dapp-popular-copy tz-dapp-row-copy"><b>'+esc(x.name)+'</b><small>'+esc(x.description)+'</small><code>'+esc(x.domain)+'</code>'+dappDomainStatus(x)+'</span><span class="tz-dapp-chevron" aria-hidden="true">›</span></button>';
}
function dappBookmark(x){
 return '<button type="button" class="tz-bookmark" data-dapp-open="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+'">'+dappIcon(x,"bookmark-icon")+'<span>'+esc(x.name)+'</span></button>';
}
function dappFeatured(x){
 return '<article class="tz-dapp-feature" aria-label="Featured dApp">'+
  '<div class="tz-dapp-feature-top"><span class="tz-featured-label">Featured</span><span class="tz-network-label">'+esc(dappNetworkLabel(x))+'</span></div>'+
  '<div class="tz-dapp-feature-main">'+dappIcon(x,"featured-icon")+'<div class="tz-dapp-feature-copy"><h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p><code>'+esc(x.domain)+'</code></div></div>'+
  '<button type="button" class="tz-open-inert" data-dapp-open="'+esc(x.id)+'">Open</button></article>';
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
 wcStart();dappsLoad();var raw=String(S.dappQuery||"").trim(),q=raw.toLowerCase(),url=dappAddressUrl(raw),chain=dappSelectedChain();
 var featured=TAZVERA_DAPPS.find(function(x){return x.id==="pancake"})||TAZVERA_DAPPS[0];
 var items=TAZVERA_DAPPS.filter(function(x){return (chain==="all"||x.networks.indexOf(chain)>=0)&&(!q||url||[x.name,x.description,x.domain,dappNetworkLabel(x)].join(" ").toLowerCase().indexOf(q)>=0)});
 var suggestion=url?'<button type="button" class="tz-address-suggestion" data-dapp-address="'+esc(url)+'"><span aria-hidden="true">↗</span><span><b>Open '+esc(url)+'</b><small>Open website in a new tab</small></span><span>Enter ↵</span></button>':"";
 var addrShort=S.addr?S.addr.slice(0,6)+"…"+S.addr.slice(-4):"";
 return '<main class="tz-dapps-shell">'+(S.addr?'<div class="tz-dapps-strip"><span class="tz-strip-wallet">'+esc(addrShort)+'</span><button type="button" class="tz-strip-copy" data-dapp-copy="1" aria-label="Copy address">Copy</button><span class="tz-strip-net">'+esc(N()?N().name:"")+'</span></div>':'')+'<header class="tz-dapps-header"><div class="tz-dapps-header-left"><button class="tz-dapps-back" type="button" data-tab="exp" aria-label="Back">←</button><h1>dApps</h1></div><div class="tz-chain-wrap"><button class="tz-chain-trigger" type="button" data-chain-toggle="1" aria-haspopup="listbox" aria-expanded="'+(S.dappChainPickerOpen?'true':'false')+'" aria-label="'+esc(chainName(chain))+'">'+chainIcon(chain,24)+'<span aria-hidden="true" class="tz-chain-caret">▾</span></button>'+dappChainPicker()+'</div></header>'+
 '<form class="tz-dapps-search-wrap" id="tzDappSearchForm" autocomplete="off"><label class="tz-dapps-search"><span aria-hidden="true">⌕</span><input id="tzDappSearch" type="search" value="'+esc(raw)+'" placeholder="Search dApps or enter a website" autocomplete="off" spellcheck="false" aria-label="Search dApps or enter a website"></label>'+suggestion+'</form>'+
 ''+wcStatusHTML()+
 (q?'':'<section class="tz-dapps-section" aria-label="Bookmarks"><div class="tz-dapps-section-head"><h2>BOOKMARKS</h2></div><div class="tz-bookmark-row">'+items.slice(0,5).map(dappBookmark).join("")+'</div></section>'+
 (featured?'<section class="tz-dapps-section" aria-label="Featured"><div class="tz-dapps-section-head"><h2>FEATURED</h2></div><div class="tz-featured-track">'+dappFeatured(featured)+'</div></section>':''))+
 '<section class="tz-dapps-section tz-all-section"><div class="tz-dapps-section-head"><h2>'+(q?'RESULTS':'POPULAR')+'</h2></div><div class="tz-popular-list">'+(items.length?items.map(dappRow).join(""):'<p class="tz-dapp-empty">No dApps match your search.</p>')+'</div></section>'+'</main>';
}
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&S.dappChainPickerOpen){S.dappChainPickerOpen=false;render()}});
document.addEventListener("click",function(e){
 if(S.dappChainPickerOpen&&!(e.target&&e.target.closest&&e.target.closest(".tz-chain-wrap"))){S.dappChainPickerOpen=false;render()}
 var t=e.target&&e.target.closest?e.target.closest("[data-chain-toggle],[data-chain-select],[data-dapp-open],[data-dapp-address],[data-dapp-copy]"):null;if(!t)return;
 if(t.hasAttribute("data-dapp-copy")){copyText(S.addr);return}
 if(t.hasAttribute("data-chain-toggle")){S.dappChainPickerOpen=!S.dappChainPickerOpen;render();return}
 if(t.hasAttribute("data-chain-select")){lss("dappSelectedChain",t.getAttribute("data-chain-select"));S.dappChainPickerOpen=false;render();return}
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
