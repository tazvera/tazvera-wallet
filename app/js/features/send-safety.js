/* Tazvera wallet · app/js/features/send-safety.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Send safety: address checksum, network/wallet reset, one send at a time, smart-contract warning. / भेजने की सुरक्षा। */
Object.assign(L.en,{eSum:"This address has a typing mistake (its capital letters do not match). Copy it again.",eDec:"Too many decimals: at most %d."});
Object.assign(L.hi,{eSum:"इस पते में टाइपिंग की ग़लती लगती है (बड़े-छोटे अक्षर मेल नहीं खाते)। फिर से कॉपी कीजिए।",eDec:"बहुत ज़्यादा दशमलव: ज़्यादा से ज़्यादा %d।"});

/* ----- Version 8.7 ----- */
Object.assign(L.en,{scanFail:"The scanner could not load. Check the internet, or paste the address.",cancelled:"Cancelled",mmOther:"MetaMask has a different account selected. Choose this wallet's account in MetaMask and try again.",eTok:"This token has no valid contract address.",
 shCon:"This is a smart-contract address",shCon2:"Coins sent to a contract are often lost forever unless it was made to receive them. Send only if you are sure."});
Object.assign(L.hi,{scanFail:"स्कैनर नहीं खुला। इंटरनेट देखिए, या पता चिपकाइए।",cancelled:"रद्द किया",mmOther:"MetaMask में दूसरा खाता चुना है। MetaMask में इसी वॉलेट का खाता चुनकर फिर कोशिश कीजिए।",eTok:"इस टोकन का सही कॉन्ट्रैक्ट पता नहीं है।",
 shCon:"यह स्मार्ट-कॉन्ट्रैक्ट का पता है",shCon2:"कॉन्ट्रैक्ट पर भेजे सिक्के अक्सर हमेशा के लिए खो जाते हैं, जब तक वह पाने के लिए न बना हो। पूरी तरह पक्का हों, तभी भेजें।"});
/* clear every number that belongs to the old network / wallet */
function netReset(){S.bal=null;S.balW=null;S.tzt=null;S.tztW=null;S.tzv=null;S.tzvW=null;S.cust=[];S.balErr=false;S.nh="";if(S.snd){S.snd.fee=null;S.snd.feeW=null;S.snd.codeFor=null;S.snd.isC=false}setTimeout(function(){if(typeof checkNet==="function")checkNet()},60)}
/* only one send at a time (a double tap can never send twice) */
(function(){var _ds=doSend;doSend=async function(a){if(S.sending)return;S.sending=true;try{return await _ds(a)}finally{S.sending=false}}})();
/* Shield: ask the blockchain whether the address is a smart contract */
(function(){var _oc=openConfirm,_sh=shield;
 openConfirm=function(){readSend();var to=String(S.snd.to||"").toLowerCase(),key=to+"|"+S.net;
  if(/^0x[0-9a-f]{40}$/.test(to)&&S.snd.codeFor!==key){S.snd.codeFor=key;S.snd.isC=false;
   Promise.race([rpc(N().rpc,"eth_getCode",[S.snd.to,"latest"]),new Promise(function(_,rj){setTimeout(function(){rj(0)},6000)})]).then(function(c){S.snd.isC=!!c&&c!=="0x"&&c!=="0x0"}).catch(function(){}).then(function(){if(S.tab==="send")_oc()});return}
  _oc()};
 shield=function(){var r=_sh();if(r.lvl==="warn"&&S.snd.isC&&S.snd.codeFor===String(S.snd.to||"").toLowerCase()+"|"+S.net)return{lvl:"bad",t:t("shCon"),s:t("shCon2")};return r}})();
