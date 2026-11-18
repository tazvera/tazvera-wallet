/* Tazvera wallet · app/js/features/pin-change-wallets.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Changing the PIN re-locks every wallet; fake-token and remove-wallet texts. / PIN बदलने पर सारे वॉलेट नए PIN से। */
/* ----- changing the PIN re-locks every wallet on this phone, not only the open one ----- */
async function pinRelockAll(oldPin,newPin){var l=wList(),cur=raw("cp3_inapp_keystore",""),act=wActive(),miss=0;
 for(var i=0;i<l.length;i++){if(act&&l[i].id===act.id){l[i].ks=cur;continue}
  try{var w=await ethers.Wallet.fromEncryptedJson(l[i].ks,oldPin);l[i].ks=await w.encrypt(newPin)}catch(e){miss++}}
 wSave(l);return miss}
Object.assign(L.en,{pinOkPart:"PIN changed. %n wallet(s) still use an older PIN.",tokFake:"\"%s\" pretends to be an official coin, but the address is different. It is probably fake, so it was not added.",
 rmNoBkT:"These 12 words were never checked",rmNoBkS:"\"%w\" was never confirmed as backed up. If you remove it without its 12 words, any money in it is lost forever.",rmNoBkTick:"I have its 12 words on paper, or it is empty"});
Object.assign(L.hi,{pinOkPart:"PIN बदल गया। %n वॉलेट अभी भी पुराने PIN पर हैं।",tokFake:"\"%s\" आधिकारिक सिक्के जैसा नाम रखता है, पर पता अलग है। यह शायद नक़ली है, इसलिए जोड़ा नहीं गया।",
 rmNoBkT:"इसके 12 शब्द कभी जाँचे नहीं गए",rmNoBkS:"\"%w\" का बैकअप कभी पक्का नहीं हुआ। 12 शब्दों के बिना हटाया, तो इसमें रखा पैसा हमेशा के लिए चला जाएगा।",rmNoBkTick:"इसके 12 शब्द मेरे पास काग़ज़ पर हैं, या यह ख़ाली है"});
