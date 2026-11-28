/* Tazvera wallet · local dApps catalogue UI · MIT License */
"use strict";

/* This screen is deliberately data-only. It does not navigate to a dApp, connect a wallet,
   request permissions, or sign. The only fetch is the same-origin JSON catalogue. */
var TAZVERA_DAPPS = [];
var TAZVERA_DAPPS_READY = false;
var TAZVERA_DAPPS_LOADING = false;

function dappsLoad(){
  if(TAZVERA_DAPPS_READY || TAZVERA_DAPPS_LOADING) return;
  TAZVERA_DAPPS_LOADING = true;
  fetch("/app/browser/dapps/catalog.json", {cache:"no-cache"})
    .then(function(r){ if(!r.ok) throw new Error("catalog unavailable"); return r.json(); })
    .then(function(data){
      if(!data || data.schemaVersion !== 1 || !Array.isArray(data.items)) throw new Error("invalid catalogue");
      var allowed = {bsc:true, shardeum:true};
      TAZVERA_DAPPS = data.items.filter(function(x){
        return x && x.walletConnectSupport==="confirmed" && typeof x.id==="string" && typeof x.name==="string" &&
          typeof x.description==="string" && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(x.domain||"") &&
          Array.isArray(x.networks) && x.networks.length>0 &&
          x.networks.every(function(n){return !!allowed[n]}) &&
          x.icon && /^#[0-9a-f]{6}$/i.test(x.icon.color||"") &&
          typeof x.icon.mark==="string" && x.icon.mark.length<=2;
      });
      TAZVERA_DAPPS_READY = true;
      if(S.tab==="dapps") render();
    })
    .catch(function(){ TAZVERA_DAPPS=[]; TAZVERA_DAPPS_READY=true; if(S.tab==="dapps") render(); })
    .finally(function(){ TAZVERA_DAPPS_LOADING=false; });
}
function dappNetworkLabel(x){
  return x.networks.map(function(n){return n==="bsc"?"BNB Chain":"Shardeum"}).join(" · ");
}
function dappIcon(x, extra){
  var shape=x.icon.shape==="circle"?"circle":"square";
  return '<span class="tz-dapp-icon '+shape+(extra?" "+extra:"")+'" data-icon-color="'+esc(x.icon.color)+'" aria-hidden="true">'+esc(x.icon.mark)+'</span>';
}
function dappDomainStatus(x){
  return x.domainVerified===true ? "" : '<small class="tz-domain-unverified" role="note" aria-label="Domain not verified">⚠ Domain not verified</small>';
}
function dappCard(x){
  return '<article class="tz-dapp-feature" aria-label="'+esc(x.name)+'">'+
    '<div class="tz-dapp-feature-top"><span class="tz-network-label">'+esc(dappNetworkLabel(x))+'</span></div>'+
    '<div class="tz-dapp-feature-main">'+dappIcon(x)+
      '<div class="tz-dapp-feature-copy"><h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p><code>'+esc(x.domain)+'</code>'+dappDomainStatus(x)+'</div>'+
    '</div><button class="tz-open-inert" type="button" data-dapp-open="'+esc(x.id)+'">Open</button>'+
    '<p class="tz-dapp-status">Opens in your phone browser · no wallet connection</p>'+
  '</article>';
}
function dappPopularRow(x){
  return '<button type="button" class="tz-dapp-popular-row" data-dapp-open="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+' in phone browser">'+dappIcon(x)+
    '<span class="tz-dapp-popular-copy"><b>'+esc(x.name)+'</b><small>'+esc(x.description)+'</small><code>'+esc(x.domain)+'</code>'+dappDomainStatus(x)+'</span>'+
    '<span class="tz-dapp-chevron" aria-hidden="true">›</span></button>';
}
function dappsHTML(){
  dappsLoad();
  var q=String(S.dappQuery||"").trim().toLowerCase();
  var items=TAZVERA_DAPPS.filter(function(x){
    return !q || [x.name,x.description,x.domain,dappNetworkLabel(x)].join(" ").toLowerCase().indexOf(q)>=0;
  });
  var bookmarks=items.filter(function(x){return x.bookmark}).slice(0,5);
  var featured=items.filter(function(x){return x.featured});
  var popular=items.filter(function(x){return x.popular});
  var featuredHtml=featured.length?featured.map(dappCard).join(""):'<p class="tz-dapp-empty">No featured dApps match your search.</p>';
  var popularHtml=popular.length?popular.map(dappPopularRow).join(""):'<p class="tz-dapp-empty">No dApps match your search.</p>';
  var bookmarkHtml=bookmarks.map(function(x){return '<button type="button" class="tz-bookmark" data-dapp-open="'+esc(x.id)+'" aria-label="Open '+esc(x.name)+' in phone browser">'+dappIcon(x)+'<span>'+esc(x.name)+'</span></button>'}).join("");
  return '<main class="tz-dapps-shell">'+
    '<header class="tz-dapps-header"><div class="tz-dapps-header-left"><button class="tz-dapps-back" type="button" data-tab="exp" aria-label="Back to Explore">‹</button><h1>dApps</h1></div><span class="tz-dapps-header-spacer"></span></header>'+
    '<form class="tz-browser-address" id="tzDappAddressForm" aria-label="Website address"><span class="tz-lock" id="tzDappScheme" aria-hidden="true">'+(brwState().url&&/^http:\/\//i.test(brwState().url)?"HTTP":"HTTPS")+'</span><input id="tzDappAddress" class="tz-address-text" type="text" inputmode="url" autocomplete="url" spellcheck="false" value="'+esc(brwState().url||"")+'" placeholder="Enter website address" aria-label="Website address"><button class="tz-address-go" type="submit" aria-label="Open website">Go</button></form>'+
    '<label class="tz-dapps-search"><span aria-hidden="true">⌕</span><input id="tzDappSearch" type="search" value="'+esc(S.dappQuery||"")+'" placeholder="Search dApps" autocomplete="off" spellcheck="false" aria-label="Search local dApps"></label>'+
    '<div class="tz-dapps-columns"><section class="tz-dapps-left">'+
      '<section class="tz-dapps-bookmarks"><div class="tz-dapps-section-head"><h2>BOOKMARKS</h2><span class="tz-see-all">See All</span></div><div class="tz-bookmark-row">'+bookmarkHtml+'</div></section>'+
      '<section class="tz-dapps-featured"><div class="tz-dapps-section-head"><h2>FEATURED</h2></div><div class="tz-featured-track">'+featuredHtml+'</div></section>'+
    '</section><section class="tz-dapps-popular"><div class="tz-dapps-section-head"><h2>POPULAR</h2></div><div class="tz-popular-list">'+popularHtml+'</div></section></div>'+
    '<footer class="tz-browser-toolbar" aria-label="Browser toolbar">'+
      '<button type="button" data-dapp-back="1" aria-label="Back" '+(brwState().idx>0?"":"disabled")+'>‹</button>'+
      '<button type="button" data-dapp-forward="1" aria-label="Forward" '+(brwState().idx<brwState().hist.length-1?"":"disabled")+'>›</button>'+
      '<button type="button" data-dapp-tabs="1" aria-label="Open current site in a new tab">▢</button>'+
      '<button type="button" data-dapp-bookmark="1" aria-label="Bookmark current site">♡</button>'+
      '<button type="button" data-dapp-menu="1" aria-label="Enter website address">☰</button>'+
    '</footer></main>';
}

function dappOpenById(id){
  var item=TAZVERA_DAPPS.find(function(x){return x.id===id;});
  if(!item || typeof item.domain!=="string" || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(item.domain)){
    toast("Invalid dApp URL.");
    return;
  }
  brwOpen(item.domain);
}

document.addEventListener("click",function(e){
  var target=e.target&&e.target.closest?e.target.closest("[data-dapp-open],[data-dapp-back],[data-dapp-forward],[data-dapp-tabs],[data-dapp-bookmark],[data-dapp-menu]"):null;
  if(!target)return;
  if(target.hasAttribute("data-dapp-open")){dappOpenById(target.getAttribute("data-dapp-open"));return}
  if(target.hasAttribute("data-dapp-back")){brwBack();return}
  if(target.hasAttribute("data-dapp-forward")){brwForward();return}
  if(target.hasAttribute("data-dapp-tabs")){var current=brwState().url;if(current)brwLaunch(current);else toast("Open a website first.");return}
  if(target.hasAttribute("data-dapp-bookmark")){var current=brwState().url;if(!current){toast("Open a website first.");return}var saved=ls("dappBrowserBookmarks",[]);if(!Array.isArray(saved))saved=[];if(saved.indexOf(current)<0)saved.push(current);lss("dappBrowserBookmarks",saved.slice(-50));toast("Bookmark saved.");return}
  if(target.hasAttribute("data-dapp-menu")){var entry=prompt("Enter website address",brwState().url||"");if(entry)brwOpen(entry);return}
});
document.addEventListener("submit",function(e){
  if(!e.target||e.target.id!=="tzDappAddressForm")return;e.preventDefault();
  var field=document.getElementById("tzDappAddress");
  if(field&&field.value.trim()){var value=field.value.trim();var shortcut=BRW_SHORTCUTS.find(function(x){return x.name.toLowerCase()===value.toLowerCase()});brwOpen(shortcut?shortcut.url:value)}
});
document.addEventListener("input",function(e){if(!e.target||e.target.id!=="tzDappAddress")return;var scheme=document.getElementById("tzDappScheme");if(scheme)scheme.textContent=/^http:\/\//i.test(e.target.value.trim())?"HTTP":"HTTPS"});

document.addEventListener("input",function(e){
  if(!e.target || e.target.id!=="tzDappSearch") return;
  S.dappQuery=e.target.value;
  var pos=e.target.selectionStart;
  render();
  var next=document.getElementById("tzDappSearch");
  if(next){next.focus();try{next.setSelectionRange(pos,pos)}catch(ignore){}}
});
