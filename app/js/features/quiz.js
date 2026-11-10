/* Tazvera wallet · app/js/features/quiz.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Crypto Quiz in Learn. / सीखें में Crypto Quiz। */
/* ----- Version 9: Crypto Quiz in Learn (10 questions, Hindi + English) ----- */
var QZ=[
 {en:["Who can you share your 12 secret words with?",["Nobody, ever","Tazvera support","A friend you trust"],0,"Anyone with the 12 words can take all your money. No real support team ever asks for them."],
  hi:["अपने 12 गुप्त शब्द किसे बता सकते हैं?",["किसी को भी नहीं","Tazvera सहायता टीम को","भरोसेमंद दोस्त को"],0,"जिसके पास 12 शब्द हों, वह पूरा पैसा ले सकता है। कोई असली सहायता टीम ये कभी नहीं माँगती।"]},
 {en:["Someone messages you: \"Send 100 SHM, get 1,000 back.\" This is…",["A scam","A lucky offer","Worth a small try"],0,"Doubling offers are always scams. Never send money to get more back."],
  hi:["कोई संदेश भेजे: \"100 SHM भेजो, 1,000 वापस पाओ।\" यह…",["ठगी है","क़िस्मत वाला मौक़ा है","थोड़ा आज़माने लायक़ है"],0,"पैसा दोगुना करने वाले प्रस्ताव हमेशा ठगी होते हैं। ज़्यादा पाने के लिए कभी पैसा मत भेजिए।"]},
 {en:["Where does the network fee go?",["To the blockchain network","To Tazvera","To the person you pay"],0,"The fee pays the network to process your payment. Tazvera takes nothing."],
  hi:["नेटवर्क फ़ीस कहाँ जाती है?",["ब्लॉकचेन नेटवर्क को","Tazvera को","जिसे भुगतान किया, उसे"],0,"फ़ीस नेटवर्क को आपका भुगतान पूरा करने के लिए मिलती है। Tazvera कुछ नहीं लेता।"]},
 {en:["You lost your phone and your 12 words. What happens?",["The wallet is lost forever","Tazvera can bring it back","The bank can bring it back"],0,"In a self-custody wallet only you hold the key. Keep the 12 words (or a wallet backup file) safe."],
  hi:["फ़ोन और 12 शब्द दोनों खो गए। अब क्या होगा?",["वॉलेट हमेशा के लिए गया","Tazvera वापस ला देगा","बैंक वापस ला देगा"],0,"अपनी चाबी वाले वॉलेट में चाबी सिर्फ़ आपके पास होती है। 12 शब्द (या वॉलेट बैकअप फ़ाइल) संभालकर रखिए।"]},
 {en:["A free \"USDT\" token suddenly appears in your wallet. What should you do?",["Ignore it, it may be fake","Sell it quickly","Claim it on its website"],0,"Fake airdrop tokens lead to scam websites. Never \"claim\" or connect your wallet to them."],
  hi:["वॉलेट में अचानक मुफ़्त \"USDT\" टोकन आ गया। क्या करें?",["छोड़ दें, नक़ली हो सकता है","जल्दी बेच दें","उसकी वेबसाइट पर claim करें"],0,"नक़ली airdrop टोकन ठगी वाली वेबसाइटों पर ले जाते हैं। उन्हें कभी claim मत कीजिए।"]},
 {en:["Before sending, how much of the address should you check?",["The whole address","Only the first 4 letters","Nothing, the app checks it"],0,"Scammers copy the start and the end of addresses. Check the whole address, or use your address book."],
  hi:["भेजने से पहले पते का कितना हिस्सा जाँचें?",["पूरा पता","सिर्फ़ पहले 4 अक्षर","कुछ नहीं, ऐप देख लेगा"],0,"ठग पते की शुरुआत और आख़िर की नक़ल करते हैं। पूरा पता जाँचिए, या पता-पुस्तिका इस्तेमाल कीजिए।"]},
 {en:["What are test network (Testnet) coins worth?",["Nothing, they are for practice","The same as real coins","Half of real coins"],0,"Test coins have no value. Practise on Testnet before using real money."],
  hi:["टेस्ट नेटवर्क (Testnet) के सिक्कों की क़ीमत?",["कुछ नहीं, ये अभ्यास के लिए हैं","असली सिक्कों जितनी","असली की आधी"],0,"टेस्ट सिक्कों की कोई क़ीमत नहीं। असली पैसे से पहले Testnet पर अभ्यास कीजिए।"]},
 {en:["You send coins to a smart-contract address by mistake. Usually…",["They are lost","They come back by themselves","Tazvera returns them"],0,"Most contracts cannot send coins back. Tazvera Shield warns you before this happens."],
  hi:["ग़लती से सिक्के स्मार्ट-कॉन्ट्रैक्ट पते पर चले गए। आम तौर पर…",["वे खो जाते हैं","अपने-आप लौट आते हैं","Tazvera लौटा देता है"],0,"ज़्यादातर कॉन्ट्रैक्ट सिक्के वापस नहीं भेज सकते। Tazvera Shield पहले ही चेतावनी देता है।"]},
 {en:["Which TZV is the real one?",["Only the official contract 0x4cC2…dE73","Any token called TZV","The one someone sells you"],0,"There is one official TZV contract. TZV is not for sale; anyone selling \"Tazvera\" coins is a scammer."],
  hi:["असली TZV कौन-सा है?",["सिर्फ़ आधिकारिक पता 0x4cC2…dE73","TZV नाम का कोई भी टोकन","जो कोई आपको बेचे"],0,"आधिकारिक TZV एक ही है। TZV बिकता नहीं; जो \"Tazvera\" सिक्का बेचे, वह ठग है।"]},
 {en:["Can a crypto payment be reversed after it is sent?",["No","Yes, by Tazvera","Yes, by the bank"],0,"Blockchain payments are final. That is why Tazvera checks everything before you send."],
  hi:["भेजा हुआ crypto भुगतान क्या वापस हो सकता है?",["नहीं","हाँ, Tazvera करेगा","हाँ, बैंक करेगा"],0,"ब्लॉकचेन भुगतान पक्के होते हैं। इसीलिए Tazvera भेजने से पहले सब जाँचता है।"]}];
Object.assign(L.en,{qzT:"Crypto Quiz",qzS:"10 quick questions. How safe are you?",qzBest:"Best: %s/10",qzNext:"Next",qzRight:"Correct!",qzWrong:"Not quite.",qzDone:"Your score: %s/10",qzGreat:"Excellent! You know how to stay safe.",qzGood:"Good! Read the answers you missed.",qzMore:"Keep learning: read the help center and try again.",qzAgain:"Try again"});
Object.assign(L.hi,{qzT:"Crypto Quiz",qzS:"10 छोटे सवाल। आप कितने सुरक्षित हैं?",qzBest:"सबसे अच्छा: %s/10",qzNext:"आगे",qzRight:"सही!",qzWrong:"यह सही नहीं।",qzDone:"आपके अंक: %s/10",qzGreat:"शानदार! आप सुरक्षित रहना जानते हैं।",qzGood:"अच्छा! जो छूटे, उनके जवाब पढ़ लीजिए।",qzMore:"सीखते रहिए: मदद केंद्र पढ़कर फिर कोशिश कीजिए।",qzAgain:"फिर से खेलें"});
function quizCard(){var b=ls("quizBest",null);return '<button class="qzc" data-quiz="1"><span>🎓</span><div><b>'+esc(t("qzT"))+'</b><small>'+esc(b!=null?t("qzBest").replace("%s",b):t("qzS"))+'</small></div>'+ic("right",16)+'</button>'}
function quizRun(){var i=0,score=0,L2=S.lang==="hi"?"hi":"en";
 function q(){var x0=QZ[i][L2],ord=[0,1,2].sort(function(){return Math.random()-.5}),x=[x0[0],ord.map(function(k){return x0[1][k]}),ord.indexOf(x0[2]),x0[3]];sheet('<div class="grab"></div><div class="sht">'+esc(t("qzT"))+' · '+(i+1)+'/'+QZ.length+'</div><div class="qzbar"><i style="width:'+((i)/QZ.length*100)+'%"></i></div><p class="qzq">'+esc(x[0])+'</p>'+x[1].map(function(o,k){return '<button class="qzo" data-qa="'+k+'">'+esc(o)+'</button>'}).join("")+'<div id="qzE"></div>');
  [].forEach.call(document.querySelectorAll("#sheet [data-qa]"),function(b){b.onclick=function(){if(b.parentNode.querySelector(".qzo.ok"))return;var k=+b.dataset.qa,ok=k===x[2];if(ok)score++;
   [].forEach.call(document.querySelectorAll("#sheet [data-qa]"),function(o){if(+o.dataset.qa===x[2])o.classList.add("ok");else if(o===b)o.classList.add("no");o.disabled=true});
   $("qzE").innerHTML='<div class="qzx '+(ok?"ok":"no")+'"><b>'+esc(ok?t("qzRight"):t("qzWrong"))+'</b> '+esc(x[3])+'</div><div style="margin-top:12px"><button class="btn" id="qzN">'+esc(i<QZ.length-1?t("qzNext"):t("done2"))+'</button></div>';
   $("qzN").onclick=function(){i++;if(i<QZ.length)q();else end()}}})}
 function end(){var b=ls("quizBest",null);if(b==null||score>b)lss("quizBest",score);
  sheet('<div class="grab"></div><div class="done" style="padding-top:8px"><div style="font-size:44px">'+(score>=9?"🏆":score>=6?"👍":"📘")+'</div><div class="sht" style="margin:4px 0 0">'+esc(t("qzDone").replace("%s",score))+'</div><p style="color:var(--mu);margin:8px 0 0">'+esc(score>=9?t("qzGreat"):score>=6?t("qzGood"):t("qzMore"))+'</p></div><div class="tda"><button class="btnw" data-sx="1">'+esc(t("done2"))+'</button><button class="btn" id="qzA">'+esc(t("qzAgain"))+'</button></div>');
  $("qzA").onclick=function(){i=0;score=0;q()};if(S.tab==="helpc")setTimeout(function(){var y=scrollY;render();scrollTo(0,y)},50)}
 q()}
document.addEventListener("click",function(e){if(e.target.closest("[data-quiz]"))quizRun()});
