/* Tazvera wallet · app/js/features/currency.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Show money in ₹ or $ (USDT). / ₹ या $ में बैलेंस। */
/* ----- Version 9: show money in ₹ or in US dollars (USDT) ----- */
Object.assign(L.en,{curT:"Currency",curInr:"₹ Indian Rupee (INR)",curUsd:"$ US Dollar (USD / USDT)",curNote:"Balances and prices are shown in this currency. Tools like the converter and bill split stay in ₹."});
Object.assign(L.hi,{curT:"मुद्रा",curInr:"₹ भारतीय रुपया (INR)",curUsd:"$ अमेरिकी डॉलर (USD / USDT)",curNote:"बैलेंस और भाव इसी मुद्रा में दिखेंगे। कन्वर्टर, बिल बाँटें जैसे औज़ार ₹ में ही रहेंगे।"});
function curC(){return raw("tz_cur","inr")==="usd"?"usd":"inr"}
function dpx(){var p=curC()==="usd"?S.usd:S.inr;return (p>0)?p:null}
function money(v){if(curC()!=="usd")return inr(v);if(v==null||isNaN(v))return "—";var d=v<0.01?6:(v<1?4:2);return "$"+Number(v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:d})}
document.addEventListener("click",function(e){if(!e.target.closest("[data-curset]"))return;
 choose(t("curT"),[["inr",t("curInr")],["usd",t("curUsd")]],curC(),function(v){rawSet("tz_cur",v==="usd"?"usd":null);S.mkt=0;if(typeof loadMk==="function")loadMk();render();toast(t("curNote"))})});
