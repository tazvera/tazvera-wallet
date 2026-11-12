/* Tazvera wallet · app/js/features/send-safety.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Send safety: address checksum, network/wallet reset, one send at a time, smart-contract warning. / भेजने की सुरक्षा। */
Object.assign(L.en,{eSum:"This address has a typing mistake (its capital letters do not match). Copy it again.",eDec:"Too many decimals: at most %d."});
Object.assign(L.hi,{eSum:"इस पते में टाइपिंग की ग़लती लगती है (बड़े-छोटे अक्षर मेल नहीं खाते)। फिर से कॉपी कीजिए।",eDec:"बहुत ज़्यादा दशमलव: ज़्यादा से ज़्यादा %d।"});

/* ----- Version 8.7 ----- */
Object.assign(L.en,{scanFail:"The scanner could not load. Check the internet, or paste the address.",cancelled:"Cancelled",mmOther:"MetaMask has a different account selected. Choose this wallet's account in MetaMask and try again.",eTok:"This token has no valid contract address.",
 shCon:"This is a smart-contract address",shCon2:"Coins sent to a contract are often lost forever unless it was made to receive them. Send only if you are sure."});
Object.assign(L.en,{chkFail:"Could not confirm whether this address is a contract. Send with care.",chkFail2:"The network check did not answer. Make sure the address is right before you send."});
Object.assign(L.en,{chainBad:"You are on the wrong network, so nothing was sent. Choose the right network and try again."});
Object.assign(L.hi,{chainBad:"आप गलत नेटवर्क पर हैं, इसलिए कुछ भी नहीं भेजा गया। सही नेटवर्क चुनकर फिर कोशिश कीजिए।"});
Object.assign(L.hi,{chkFail:"कॉन्ट्रैक्ट की पुष्टि नहीं हो सकी। सावधानी से भेजें।",chkFail2:"नेटवर्क ने जवाब नहीं दिया। भेजने से पहले पता अच्छे से जाँच लीजिए।"});
Object.assign(L.hi,{scanFail:"स्कैनर नहीं खुला। इंटरनेट देखिए, या पता चिपकाइए।",cancelled:"रद्द किया",mmOther:"MetaMask में दूसरा खाता चुना है। MetaMask में इसी वॉलेट का खाता चुनकर फिर कोशिश कीजिए।",eTok:"इस टोकन का सही कॉन्ट्रैक्ट पता नहीं है।",
 shCon:"यह स्मार्ट-कॉन्ट्रैक्ट का पता है",shCon2:"कॉन्ट्रैक्ट पर भेजे सिक्के अक्सर हमेशा के लिए खो जाते हैं, जब तक वह पाने के लिए न बना हो। पूरी तरह पक्का हों, तभी भेजें।"});

/* clear every number that belongs to the old network / wallet */
function netReset(){
  S.bal=null;S.balW=null;S.tzt=null;S.tztW=null;S.tzv=null;S.tzvW=null;S.cust=[];S.balErr=false;S.nh="";
  if(S.snd){S.snd.fee=null;S.snd.feeW=null;S.snd.codeFor=null;S.snd.isC=false}
  setTimeout(function(){if(typeof checkNet==="function")checkNet()},60);
}

/* One confirm + one send at a time. Lock clears after send ends, or if user closes the PIN sheet. */
(function(){
  var _ds=doSend,_go=go;
  /* before sending: confirm the wallet is on the network the app shows. For MetaMask, try to switch once. Fail closed. */
  function provFor(){return S.mode==="mm"?window.ethereum:(window.tazveraProvider||window.ethereum)}
  async function chainNow(p){var c=await p.request({method:"eth_chainId"});return String(c||"").toLowerCase()}
  function stopSend(msg){sheet('<div class="grab"></div><div class="pinw"><div class="pt">'+esc(msg)+'</div><button class="btn" onclick="closeSheet()">OK</button></div>',true)}
  doSend=async function(a){
    if(S.sending)return;
    S.sending=true;S._goLock=true;
    try{
      var want=String(N().chainId||"").toLowerCase(),p=provFor(),have=null;
      try{have=p&&p.request?await chainNow(p):null}catch(e){have=null}
      if(have!==want&&S.mode==="mm"&&p&&p.request){
        try{await p.request({method:"wallet_switchEthereumChain",params:[{chainId:N().chainId}]});have=await chainNow(p)}catch(e){}
      }
      if(have!==want){stopSend(t("chainBad"));return}
      return await _ds(a);
    }
    finally{S.sending=false;S._goLock=false}
  };
  /* the lock only blocks a second tap while go() itself runs; doSend's S.sending guard protects the actual send */
  go=function(a){
    if(S.sending||S._goLock)return;
    S._goLock=true;
    try{return _go(a)}
    finally{S._goLock=false}
  };
})();

/* Shield: ask the chain if the address is a contract; arm confirm so a double-tap cannot start two sends */
(function(){
  var _oc=openConfirm,_sh=shield;
  function armConfirm(){
    var b=$("cGo");if(!b||b._tzArm)return;
    b._tzArm=1;
    var prev=b.onclick;
    b.onclick=function(ev){
      if(S.sending||S._goLock)return;
      if(typeof prev==="function")prev.call(this,ev);
    };
  }
  openConfirm=function(){
    readSend();
    var to=String(S.snd.to||"").toLowerCase(),key=to+"|"+S.net;
    function show(){
      if(S.tab!=="send")return;
      _oc();
      armConfirm();
    }
    if(/^0x[0-9a-f]{40}$/.test(to)&&S.snd.codeFor!==key){
      S.snd.codeFor=key;S.snd.isC=false;S.snd.chkFail=false;
      Promise.race([
        rpc(N().rpc,"eth_getCode",[S.snd.to,"latest"]),
        new Promise(function(_,rj){setTimeout(function(){rj(0)},6000)})
      ]).then(function(c){
        S.snd.isC=!!c&&c!=="0x"&&c!=="0x0";
        S.snd.chkFail=false;
      }).catch(function(){
        S.snd.isC=false;S.snd.chkFail=true;
      }).then(show);
      return;
    }
    show();
  };
  shield=function(){
    var r=_sh();
    var key=String(S.snd.to||"").toLowerCase()+"|"+S.net;
    if(r.lvl==="warn"&&S.snd.isC&&S.snd.codeFor===key)
      return{lvl:"bad",t:t("shCon"),s:t("shCon2")};
    if(r.lvl!=="bad"&&S.snd.chkFail&&S.snd.codeFor===key)
      return{lvl:"warn",t:t("chkFail"),s:t("chkFail2")};
    return r;
  };
})();
/* MetaMask in the wallet list: shows an extra row when this browser has MetaMask (window.ethereum). Tapping it makes the MetaMask account the active one. */
Object.assign(L.en,{mmUse:"MetaMask account",mmUseS:"Use the account you connect in MetaMask. Balance and sends will use MetaMask.",mmNone:"Open this page inside MetaMask's browser to use MetaMask here."});
Object.assign(L.hi,{mmUse:"MetaMask खाता",mmUseS:"MetaMask में जुड़ा खाता इस्तेमाल होगा। बैलेंस और भेजना MetaMask से होगा।",mmNone:"MetaMask के ब्राउज़र में यह पेज खोलिए, तभी MetaMask यहाँ चलेगा।"});
(function(){
  var _ws=wSheet,_sw=wSwitch;
  wSheet=function(){
    _ws();
    var h='<button class="opt" data-mmuse="1" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left"><span class="av" style="width:42px;height:42px;border-radius:12px;font-size:18px">🦊</span><div class="m"><b>'+esc(t("mmUse"))+'</b><small>'+esc(window.ethereum?t("mmUseS"):t("mmNone"))+'</small></div></button>';
    $("sheet").insertAdjacentHTML("beforeend",h);
  };
  wSwitch=async function(id){
    await _sw(id);
    S.mode="inapp";
    render();load();
  };
  document.addEventListener("click",async function(e){
    var el=e.target.closest("[data-mmuse]");if(!el)return;
    if(!window.ethereum){toast(t("mmNone"));return}
    try{
      var a=await window.ethereum.request({method:"eth_requestAccounts"});
      if(!a||!a[0]){return}
      S.addr=a[0];S.mode="mm";netReset();closeSheet();render();load();
    }catch(err){toast(String((err&&err.message)||err))}
  });
})();
