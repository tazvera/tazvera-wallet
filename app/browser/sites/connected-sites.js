/* Tazvera wallet · app/browser/sites/connected-sites.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Every site that is allowed to ask this wallet for a signature is listed here, and every one of them
   can be removed. A connection that cannot be undone is a trap, so this screen exists before the
   browser itself does. Stored on this phone only: {domain, chain, at}. */
function sitesList(){
  var l=ls("sites",[]);
  if(!Array.isArray(l))return [];
  return l.filter(function(x){return x&&typeof x.domain==="string"&&x.domain});
}
function siteAdd(domain,chain){
  var d=signCleanDomain(domain); if(!d)return false;
  var l=sitesList().filter(function(x){return x.domain!==d});
  l.unshift({domain:d,chain:chain||"",at:Date.now()});
  lss("sites",l.slice(0,20)); return true;
}
function siteDrop(domain){
  var d=String(domain||"").toLowerCase();
  lss("sites",sitesList().filter(function(x){return x.domain!==d}));
}
function siteIsOn(domain){
  var d=String(domain||"").toLowerCase();
  return sitesList().some(function(x){return x.domain===d});
}
function sitesWhen(when){
  try{var d=Math.round((Date.now()-(when||0))/60000);
    if(d<1)return t("justNow"); if(d<60)return d+" "+t("min");
    if(d<1440)return Math.round(d/60)+" "+t("hourAgo");
    return Math.round(d/1440)+" "+t("dayAgo")}catch(e){return ""}
}
function sitesSheet(){
  var l=sitesList();
  var body=l.length?l.map(function(x){
    return '<div class="sess"><span class="dot"></span><div class="sm2"><b>'+esc(x.domain)+'</b>'+
      '<small>'+esc(x.chain||"")+(x.at?' · '+esc(sitesWhen(x.at)):'')+'</small></div>'+
      '<button class="srm" data-siteoff="'+esc(x.domain)+'">'+esc(t("sitesRemove"))+'</button></div>'
  }).join(""):'<div class="snone">'+esc(t("sitesNone"))+'</div>';
  sheet('<div class="grab"></div><div class="sht">'+esc(t("sitesT"))+'</div>'+
    '<div class="snote">'+esc(t("sitesNote"))+'</div>'+body+
    '<div class="sfine" style="margin-top:12px">'+esc(t("sitesFine"))+'</div>');
}
