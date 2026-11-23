/* Tazvera wallet · app/js/features/pin-change-wallets.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Changing the PIN re-locks every wallet; fake-token and remove-wallet texts. / PIN बदलने पर सारे वॉलेट नए PIN से। */
/* Re-encrypt every wallet as one transaction: never save a partial PIN migration. */
async function pinRelockAll(oldPin,newPin,previousActiveKeystore){
 var l=wList(),cur=raw("cp3_inapp_keystore",""),act=wActive(),next=l.map(function(x){return Object.assign({},x)});
 if(!act||!cur)throw new Error("Active wallet is missing; no wallet PINs were changed.");
 try{
  var activeNext=await ethers.Wallet.fromEncryptedJson(cur,newPin);
  if(act.addr&&activeNext.address.toLowerCase()!==String(act.addr).toLowerCase())throw new Error("Active wallet address mismatch.");
  var found=false;
  for(var i=0;i<next.length;i++){
   if(next[i].id===act.id){next[i].ks=cur;next[i].addr=activeNext.address;found=true;continue}
   var w=await ethers.Wallet.fromEncryptedJson(next[i].ks,oldPin);
   if(next[i].addr&&w.address.toLowerCase()!==String(next[i].addr).toLowerCase())throw new Error("Wallet address mismatch.");
   next[i].ks=await w.encrypt(newPin);
   next[i].addr=w.address;
  }
  if(!found)throw new Error("Active wallet is not in the wallet list.");
  wSave(next);
  return 0;
 }catch(e){
  /* CPW.imp() has already changed the active keystore. Roll it back before returning. */
  if(typeof previousActiveKeystore==="string"&&previousActiveKeystore){rawSet("cp3_inapp_keystore",previousActiveKeystore);try{await CPW.unlock(oldPin)}catch(_){CPW.lock()}}
  throw new Error("PIN change cancelled. No wallet PINs were changed. Check that every wallet uses the current PIN, then try again.");
 }
}
Object.assign(L.en,{pinOkPart:"PIN changed. %n wallet(s) still use an older PIN.",tokFake:"\"%s\" pretends to be an official coin, but the address is different. It is probably fake, so it was not added.",
 rmNoBkT:"These 12 words were never checked",rmNoBkS:"\"%w\" was never confirmed as backed up. If you remove it without its 12 words, any money in it is lost forever.",rmNoBkTick:"I have its 12 words on paper, or it is empty"});
Object.assign(L.hi,{pinOkPart:"PIN बदल गया। %n वॉलेट अभी भी पुराने PIN पर हैं।",tokFake:"\"%s\" आधिकारिक सिक्के जैसा नाम रखता है, पर पता अलग है। यह शायद नक़ली है, इसलिए जोड़ा नहीं गया।",
 rmNoBkT:"इसके 12 शब्द कभी जाँचे नहीं गए",rmNoBkS:"\"%w\" का बैकअप कभी पक्का नहीं हुआ। 12 शब्दों के बिना हटाया, तो इसमें रखा पैसा हमेशा के लिए चला जाएगा।",rmNoBkTick:"इसके 12 शब्द मेरे पास काग़ज़ पर हैं, या यह ख़ाली है"});
