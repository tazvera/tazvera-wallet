/* Tazvera wallet · app/js/features/signing.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* The signing sheet. This is the only door between a website and your keys: a site can ask, this
   screen decides, and nothing is signed anywhere else. Every request is shown as: who is asking,
   what they get, on which chain, and what it costs. Unlimited approvals are named in plain words.
   A request from a domain we cannot read is refused before the sheet is even drawn. */
function signCleanDomain(d){
  var s=String(d||"").trim().toLowerCase().replace(/^https?:\/\//,"").split("/")[0];
  if(!/^[a-z0-9.-]+\.[a-z]{2,}(:\d+)?$/.test(s))return "";
  return s;
}
/* what the request actually gives away, in one line a person can read */
function signGives(r){
  if(r.action==="connect")return t("sgGivesConnect");
  if(r.unlimited)return t("sgGivesAll")+" "+String(r.sym||"").trim();
  return fmt(r.amount,6)+" "+String(r.sym||"").trim();
}
function signSheet(req,cb){
  var r=req||{},domain=signCleanDomain(r.domain);
  if(!domain){ if(cb)cb(false); toast(t("sgBadDomain")); return }
  var n=N(),unl=!!r.unlimited&&r.action!=="connect";
  var rows=
    '<div class="srow"><span>'+esc(t("sgSite"))+'</span><b>'+esc(domain)+'</b></div>'+
    '<div class="srow"><span>'+esc(t("sgGives"))+'</span><b'+(unl?' style="color:#FFD23F"':'')+'>'+esc(signGives(r))+'</b></div>'+
    '<div class="srow"><span>'+esc(t("sgChain"))+'</span><b>'+esc(n.name)+'</b></div>'+
    (r.fee?('<div class="srow"><span>'+esc(t("sgFee"))+'</span><b>'+esc(r.fee)+'</b></div>'):'');
  var warn=unl?('<div class="sgwarn"><b>'+esc(t("sgUnlimited"))+'</b><span>'+esc(t("sgUnlimitedS"))+'</span></div>'):'';
  sheet('<div class="grab"></div>'+
    '<div class="sghead"><span class="sgic">'+ic("globe",18)+'</span><div><b>'+esc(t(r.action==="connect"?"sgConnect":"sgApprove"))+'</b>'+
    '<small>'+esc(domain)+'</small></div></div>'+rows+warn+
    '<div class="sgb"><button class="btnw" id="sgNo">'+esc(t("sgReject"))+'</button>'+
    '<button class="btn" id="sgYes">'+esc(t(r.action==="connect"?"sgAllow":"sgSign"))+'</button></div>'+
    '<div class="sgfine">'+esc(t("sgFine"))+'</div>',true);
  $("sgNo").onclick=function(){ closeSheet(); if(cb)cb(false) };
  $("sgYes").onclick=function(){ closeSheet(); if(cb)cb(true) };
}
