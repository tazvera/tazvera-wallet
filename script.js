/* Build 63: new TZT logo everywhere */
window.TZLOGO='<img src="icon-192.png" alt="" style="width:100%;height:100%;border-radius:50%;display:block;object-fit:cover">';

const $=id=>document.getElementById(id);
const ls={get:(k,d)=>{try{const v=localStorage.getItem('cp3_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('cp3_'+k,JSON.stringify(v))}catch(e){}}};

const NETWORKS={
  "shardeum-testnet":{name:"Shardeum Testnet",chainId:"0x1fb7",chainIdDec:8119,symbol:"SHM",rpc:"https://api-mezame.shardeum.org",explorer:"https://explorer-mezame.shardeum.org"},
  shardeum:{name:"Shardeum Mainnet",chainId:"0x1fb6",chainIdDec:8118,symbol:"SHM",rpc:"https://api.shardeum.org",explorer:"https://explorer.shardeum.org"},
  ethereum:{name:"Ethereum",chainId:"0x1",chainIdDec:1,symbol:"ETH",rpc:"https://cloudflare-eth.com",explorer:"https://etherscan.io"},
  bsc:{name:"BNB Chain",chainId:"0x38",chainIdDec:56,symbol:"BNB",rpc:"https://bsc-dataseed.binance.org",explorer:"https://bscscan.com"}
};

const LOGOS={
  SHM:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAABdmlDQ1BJQ0MgUHJvZmlsZQAAeJylkLFLw0AYxV9bRdFKBx0cHDIUB2lB6uKodShIKaVWsOqSpEkrJG1IUkQcHVw7dFFxsYr/gW7iPyAIgjq56OygIIKU+K4pxKGd/MLd9+PdvcvdA8JNQzWdoXnArLl2IZOWNkqbEv6UrDrWcj6fxcD6ekRI9IekOGvwvr41XtYcFQiNkhdVy3bJS+TcrmsJbpKn1KpcJp+TEzYvSL4XuuLzm+CKz9+C7WJhBQhHyVLF54RgxWfxFkmt2ibZIMdNo6H27iNeEtVq62vsM93hoIAM0pCgoIEdGHCRZK8xs/6+VNeXQ50elbOFPdh0VFClN0G1wVM1dp26xs/gDlaQfZCpoy+k/D9EV4HhV8/7nANGToDOoef9nHlepw1EnoHbVuCvtxjnO/VmoMVPgdgBcHUTaMoFcM2Mp18s2Za7UoQjrOvAxyUwUQImmfXY1n/X/bx762g/AcV9IHsHHB0Ds9wf2/4F9IxzaxM+sS0AABGmSURBVHja7ZxpkF3Fdcf/53Tfe98+i2a0IQECK7ZlGWw2BalsYyEjyxhQIrCQAAlGqxXHjvMhFadS+ZJylfMhxJXgoCCBwHbM4qXsCgiIg1Mpx+UFb5CknIDtQKAMYqRZ3nv3vvve7T4nH2YkRkhPQprRSMivq2s+3df39O+ePlt3D71nuUOntW/cQdAB1AHUAdQB1AHUAdQB1AHUaR1AHUAdQB1AHUCTafRbAUhISGBJQQD88R73ILUkpCrc/K0AxMqwWdxsiBJgjve4FTFx04HBYn8rAFmYrNn80NVDXVHDy3EE8EJd+eo1KwazZmqPT/OtD4gJSZbNn1f/3J/NufqqwThJjGkrgzEcN5IVVw197jOzz51XT7KM6ewFpASj3hA1XX3bFpsPw423ds2aOdLymYUoZ0p68ElVygyk5bNZ/cMbbunNheG2LZy6BhMxPKB09gEiSmG4FqfLlzRWXdWVNZvnz+2+fa0mtUysMcKk48KQslFWa5JadsdanD+3krVaKz9YXn5FXE1SMBG1AD27AJEYF3kygU0+uSUKKQc2Km796v5FC4fTtMkI6OCcCcoI0rS5aOHIutX9Kg7MEeU/uTUX2URg2Ed6lmmQQq3huJrccK1fvKhHJAssiXKpFGwesNSIxUIOLjEhFQtuxFs2mVLJinJgSCR796Lu6z/i6rXYMoHkrAJklRLxs3uHt20sqhKRBTEbdl5WXdW7ZGkzrrYsEaCAWqJ6tXXF0uaqD8zwHsYwiAlWlbZvLM7prTZUrfJZBYg4SOvVdeuCebMD8RkRAUQgUQmM+/jmchhW/XhYZLxSLqrv2NpljfcQgAAiJu/9vNnhunVBIxkG27MHEBPFrea7LsxuubFXxPAEvx5Y613ussWF1avSuJYaJmMorqU3rGpcuijnXWjN67GPYRYJbrmxZ9GCVtxKp8fln1pABBnTH81qmzZTJS+qSrATnb9jUsXWDd19fTXn4Zz2zahtva2iKt4cln0Rsaqv5HXTgPWtOsiQgk6xOzu1gKywMb6eNN53WfOaD1bEWWI+FO8AIKKIScTMm1u+7WZtJrVmI96wXufNrYgGITFNkFAJzCTerLy68r4rmvWkYY038hbWIHYsqiZn6lu22pAjqAJ8ZFLOTCq4ZU33vDnD8+cOr1/TraJMdKQrVDBEQg62bQ1ypu7UePZ6KrP8UwrIm8DFI/6GVe7yxd0+AwVVgjtyURBBoZVC9Ic7zCe2cyUfKnAEH7ASQShIfIsvf1fv9at8fVSMFTp+SeDMAqQHV4+4Rtjfv3/TQAESqVWgG7CAHFbNUFWIklPB7D6e3ccqJOQUAigw4fAJeYAUJQ28it10R65/5n6XRob0oFbqWwWQAmrY1pN0/To9b1bJiVgyBCZ6Q4lDFE3VDGKE/J13Ne68KxXyUFZtKZqqE+dsiQzDWLJe5PzZ5VvWSj1pENtDL31LADJj6pM03dsXJrf8/gz1noy2YRmAoBkZQ3u//drPfzHj5//du/fbr1kmyXj8gaO/RMT7W9fMeMfCJEkdjSuReUsAYkCJjW/Vtg/4SjFyMEzctmAoFmyGa9Wd9zobFqwt/MN9fqhWI2ZI2C6lMGS8mkox2jbgfVYjZkBPxXSmeEQlAcSSqcfNZUvqq5b3iSgboTb1CQVUvLH+y19Nnvv1jHzI+ZCf+1Xvl7+aGCsqvl0dmpTYioh+ePmMZUvq9bhpyWDcbJ3BgEiZ4DxJzsaf2Fw2bAE2CNpMU9Uzm/CF3zQffESL5ZwXeEW+nHv4EbzwmyYbA2kbgxoEAFsOdgyUIlP3EIab8sL+lAMiZjtaa16/0r93cY8ImI9ZIxJR8rv2xAeGe0ygqlCFtbp/qHfXnlTJQbJjSc8QwaUX9dywUkbrLeKA9AwHRGh5mdV7YOvGgshRYpmJTQQc8A+frT72hBbLkbhxYcRzscs+9gT94Jk6WyNynDeK0NbbC7N7D7S8JzoTbRApeZBjYTJI4mRgLc8/p+SljbgqXjNRD7Qy7++5p9GUCpNOiI88Q5uS27W7kXkALa/qNYPKUQF5cfPPKd+xluJ6QwMhJYID/JQstynSIDUKo2HSSOWdC5o339gtAtuuIqGs5NULc/DEU/u//3SxUCyoPywtVc+FUv77P8o//tR+5gDeKfl2lWjLVkTW3ti96IK00YCGMcA8RQWjKRlFGKpqFTlpVbcPaKlYgGbUrujHjiVgppF6es99jqIytAkSIjCDGUQAeYjjqGvXntZoPWVmklDZt7Nkqmm5WNi+SdGqAnmPQA9TydOtQQpm65tVt3TJ4Mqre7z3YlTby6eixPahr1ef+1VXoeAsyJNJW6ZWR62ONDNC1sLmC/65X3Z95WujxAxpGygrVE0gXlYun7HsisHmqGPrpiqDnRJAhuBYNAiHd2yaaY0FYBAQHT2u9aJs6KVXql962HUV8+JoqArI4IJzX13x/pEV7x+5YP6rIoMHas476ioWvvSIe+mVGhu0s9ZE1sAqqTXm45v7TDgCYYafktnZqVGgQOIh93ur6dKLKuLJGHtM50XG6s77a/uHZlBRynJg00247trcBQtK+VwOQCNNf/1C89G9Q488qqOmn4b7d96//7OfKajndlMmkGErHpe+u+faVfu++Y2k1B1NSZJPk76rQcQuE+o2tX98IJw/O6/K3L4aKgJm+dnPaxs/LeIK58179S8/U7rkol5AFaJeFWADAgP80/8c/vPP1v7v5TkmiPfcyZe8pyzCxwisRMCEF/aN3LqxVWv1GeN10qZ6kr8nQJiCtJ7cdFt87pyiy6g9HVUoAV793XviOC6eM+fA7ju7L7mokmWx9wIxICZi9daLZi6+ZHF59193nTNnsF4r3H1f7NUToO2zdma4zJ0/u+umW7NGXOPxLJ9ODyACALGUpSkWXljbsKZPRaxto4+iXl3TZcT+saeGv/fDYiFf/5NPhXPmdGWZCYKSYUtMY50NGbaBLWWZmTu3+08/nSsU4u/9qLj3qWFiabrMq4McnZGxoqIb1/Re+LZqmsJSBgidJkBK1BSOsmz/toF8dyESAdpk7coOQIhwKG7sfmAkbVWWLsmuWlbyToKAD/EmHFaEDgL2Tj5wZWnpEt9qVXbdPzIUN0KEAI0NeLQFb0S0uxBuv6OQZfuFI6LmZAr7Jw1IVSlArpa4pZemH11eFt+AYcAcVf9VA1Vl6x/8WvLcL2cG+WTlcmMQHNcZK4g1WLlcg3zyP7+a9eBXY7ZeRaFBm1VMMCw+/ejV5aWXprXEBcip0kln+ZOwQaQqiMzQji1lwxaaU3IY3+c7UnJnyL70Svzwwz6KukulA4vfHgHu+BUuBih79zuiYmkoF3Y99JB/6dXYsFHN2qx7VXLQnGG7Y0s5sgdUADoNGkSWaShJV3+odfnFFS/E1ljY9rEPEWH3A0OvHigbi4ApX/BAyMcLdokAmFzeGWZrdd9IedeeA0Tq2py8IjIWlq3xQpdfXFm9IhtuNC3jpE01n7SFbjma3Ts0sKlfpUkTDffRvG9gzU+fHf3m3u5iJYIDqVEIIHQ8N0xjdUICqyXvi+XoW493/+w/quGxsnw6qEutgU39M3v2t9zJ78KeJCA2lDRGb10TLZiTUx/y8Ybx4v5+d6Phi5YyMpIk4eAgq4oer3yjSqoYHAwaqSE2llzqy1/YlXg5TvjGDHXBgjm529bk4mSUzbRoEEFIQYxGioULknUfK6k0YKid7ii8854ZT35n+LtPR5UiNMvBIG4Uf/xMTGRUvEJ1PLo50uKKek8kP/5ZHCd5GNIsrBT1u09HT/7rMDOcd9o2XiYypJKu+1jpdxYkaQpikCqdYAZ7whrESmparjm0bWOuq2zVh8S+nQ0UBRFq9WTnnoYNu1TIM5NHLhc+tlfqaYMJKgT10DeMIUCmQkxUTxuPPu5yUV5VPJMIbNCz876kFidEx8hhAfbqg66y2XZ7zrWG1LRY+UTd2QkBIgFp4BpVe+UVjVXX5CQzbFTbJHQKVa+G6Stfj3/xfG8+GgvuxANBQZ57vmf3AwlZqGvBMx3miRVK6q24Flvc+8XG88/3BAXxCkBEOZ/DL56f8eA3YsOs3iu1y/INGRVnP3xNbsllSaNqNXBCfEIG+4QAKdiTasTJji3FgAtCopzR4cWuCbZZjaGX9sVffJgKxYLIeGpCEPGUq+T2PBB85Vv7TMhk4D1EDnX1TonJhuahf9p37/1BVMmJJxrftFDxKBYLDzyIl/fVmVnaRNWkAs4EEnLhD7YWQ4qhCjqxnQ8ze8FfnEDuT2a06q67fuj2G/syB7KONCJyE6sC42Grkjpiizu/8NrTPymW85GX8a/BGKuKqrHRd/8tS9zo4ndyPhcQMRGIQERstJqkf7fnwF13BUGui0hZiElpfHgODQ0P+2ZrePn7KpqNpccCQCdWeSlTjdQ47/jcOeEL+4aeeaaQzwV6IovsBLJ5IqjP8tHgg7tL8+d2iYihcYFpzPzRmINVQLx4a/jp/2ps3uFMlPMI6Ui5CORNvXHggvP8yuXmyotRKhMU9bp+/1k88R3/6xdNOd+n5I62AQej4lu1e+82ly2qeO+ZAVhVIqgqEY3nxlB4VSZ66ZX6uk3VRtZHHL55RicAyBgeHq1+envzE3f0Oy90NMdJUIYCVlVVdesfvfLvP5hTqqgXkJjXI9qxHFtB3FQOmi3fijXIJyZwAHzLumYxKCAKDUmmGo3/5PVoGcpiyMR1v2zJy/d8/lymsQ+jcrSoWUHqNTB0157Bv7k719Nd9v7N+rI3WzBjQppi0YWN9au70pYSKcvEpawgQAkkol4EgTF7/+XFp5/JKjMHTWasGZ/Y6/ZRxw+gkUT5vHKp6SQSDQBwJEHXqPgoU1LbZNQPAZ0wiJIE5f70R8+mj/7zix9ZcV7LCxvPYCiNP3bwZQQVSOrN+tXlJ79d/d+Xy1HYrhxwshpEBO/R1R3P6m1moiAyQhO8wcEjzgpSail68oN//KneSqXiBRYexG+MdGjMYDAgAhIo0/hBYCWoMikZUlVW8kf8EASCqgcbRrVa/6u/3V9P+gNioYk6RIcWpLCoimV6bTg/OlwwBm9ylb1ZDVKFMRgZLg4OFo+1OacwYVYdyj61vXTRolmYppZ/13saO3fmurtzmadjzyKwsBanxAaNPc/H3rs02my5hf3779/TU85FSkQA6NQckRtfcQrFaJpuuH30xcEZQWiPHSqLntgxohONpFVUjtEVnKW1zQPoKua9iGFiJh6rg01557G/lKnrKeZvH0AzHSWlY0t4SiPpQx/u8E4CqEWLjYvr7srL4g9f09+Shpmuu0uWKZPm9Sv7lry3WU88G2dVDh6FObKf8myejuggqErkYUIzsn1z3jBBicx0XacgqCJg3r4lsnzAazQeAY2fqH2jtNO+cagGajTM6qPZdSvd715clkwDyk3RptubcrEBhZLJ0ksq166QuBYjGGNxpmw9qxKyzM7srm+7I68aqWGiFk3XrTdSQ9RSw9Bw+0ChrxJnbsxN6RkBiKDGolFvbbjJnze3JAJmBpnpu8RNAFlm8qIL5pdvXaNxPTOW6Ew5/sKaNrBwwejam0vqwTyWk03zBVxDIGaIz25en3/bubW0weAzQoOUKMjS0a0bqKdU8uIBGjtJN/19rMYyo1zZsoGb6ShRMPlVNumta6a4ni1bVlt9bR/gbGAPlixOSycbhIBfc13vsqUjcT3jSYcadtL2GYFJV38k/9r+xDctAplYYJweMz0xfyf1yMjk/OpVhR//JFUtTHbwSZ/uUGKJ8lXKCKQeIasSVAmk02SmFQcTeCUhMsjGPn3aKKvwJA8vTD5UURXE1W6CVc50wuY6Heln6WiTwxQ8c6gQohCCkASKzExFpDolsRwZA3BMEpFC2ZMehDNtt84VChDp+OmYsA6JML6HcZo1iMc/oUSKsb2JCTZhuq6366GAdUzBfK6NNp4eDcJp+c8+0yNP5z9QdQB1AHUAdQB1AHUAdQB1AHVaB1AHUAdQB1AHUAdQB1AHUKdNaP8P+hKhggjT42IAAAAASUVORK5CYII=",
  USDT:"https://assets.coingecko.com/coins/images/325/small/Tether.png",
  BTC:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH:"https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB:"https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png"
};

let currentNet="shardeum-testnet",addr="",fx=89.5,lastBal=null,lastOk=0,cur="INR",lang=ls.get("lang","en"),soundOn=ls.get("sound",true),hideBal=ls.get("hide",false),txs=ls.get("txs",[]),contacts=ls.get("contacts",[]);

const T={SHM:{bal:"0.0000",p:null},USDT:{bal:"0.00",p:null},BTC:{bal:"0.000000",p:null},ETH:{bal:"0.0000",p:null},BNB:{bal:"0.0000",p:null}};

const I18N={
  en:{
    total:"Total Balance",send:"Send",recv:"Receive",req:"Request",assets:"Crypto Assets",home:"Home",book:"Contacts",tools:"Services",settings:"Settings",
    disc:"⚠ Crypto is risky. Only use what you can afford to lose. Keys stay in your wallet. Non-custodial. Not financial advice.",tx:"Recent",
    cryptoSec:"CRYPTO",calcSec:"CALCULATORS (REAL MATH)",gas:"⛽ Estimate network fee",price:"🔁 Price converter",csv:"📥 Export history CSV",
    explorer:"🔗 Open block explorer",addTok:"➕ Add custom token",close:"Close",
    sip:"📈 SIP Calculator",emi:"🏦 EMI Calculator",yield:"🏠 Rental Yield",frac:"🏢 Fractional Ownership",roi:"💹 ROI Calculator",comp:"📊 Compound Interest",
    calc:"Calculate",edu:"Educational only. Not financial advice.",
    sipM:"Monthly investment ₹",sipR:"Expected return % / year",sipY:"Years",
    emiP:"Loan amount ₹",emiR:"Interest % / year",emiN:"Tenure (months)",
    yV:"Property value ₹",yR:"Annual rent ₹",yE:"Annual expenses ₹",
    fV:"Property value ₹",fI:"Your investment ₹",fT:"Total tokens (optional)",
    rI:"Invested ₹",rC:"Current / returned ₹",
    cP:"Principal ₹",cR:"Rate % / year",cY:"Years",
    toolsTitle:"Tools",settingsTitle:"Settings"
  },
  hi:{
    total:"कुल बैलेंस",send:"भेजें",recv:"प्राप्त",req:"अनुरोध",assets:"एसेट्स",home:"होम",book:"संपर्क",tools:"सेवाएँ",settings:"सेटिंग्स",
    disc:"⚠ क्रिप्टो जोखिम भरा है। केवल उतना ही उपयोग करें जितना खो सकें। कुंजियाँ आपके वॉलेट में रहती हैं। नॉन-कस्टोडियल।",tx:"हालिया",
    cryptoSec:"क्रिप्टो",calcSec:"कैलकुलेटर (असली गणित)",gas:"⛽ नेटवर्क शुल्क अनुमान",price:"🔁 कीमत कन्वर्टर",csv:"📥 इतिहास CSV निर्यात",
    explorer:"🔗 ब्लॉक एक्सप्लोरर खोलें",addTok:"➕ कस्टम टोकन जोड़ें",close:"बंद करें",
    sip:"📈 SIP कैलकुलेटर",emi:"🏦 EMI कैलकुलेटर",yield:"🏠 किराया यील्ड",frac:"🏢 आंशिक स्वामित्व",roi:"💹 ROI कैलकुलेटर",comp:"📊 चक्रवृद्धि ब्याज",
    calc:"गणना करें",edu:"केवल शैक्षिक। वित्तीय सलाह नहीं।",
    sipM:"मासिक निवेश ₹",sipR:"अपेक्षित रिटर्न % / वर्ष",sipY:"वर्ष",
    emiP:"ऋण राशि ₹",emiR:"ब्याज % / वर्ष",emiN:"अवधि (महीने)",
    yV:"संपत्ति मूल्य ₹",yR:"वार्षिक किराया ₹",yE:"वार्षिक खर्च ₹",
    fV:"संपत्ति मूल्य ₹",fI:"आपका निवेश ₹",fT:"कुल टोकन (वैकल्पिक)",
    rI:"निवेशित ₹",rC:"वर्तमान / वापसी ₹",
    cP:"मूलधन ₹",cR:"दर % / वर्ष",cY:"वर्ष",
    toolsTitle:"टूल्स",settingsTitle:"सेटिंग्स"
  },
  mr:{
    total:"एकूण शिल्लक",send:"पाठवा",recv:"स्वीकारा",req:"विनंती",assets:"मालमत्ता",home:"होम",book:"संपर्क",tools:"सेवा",settings:"सेटिंग्ज",
    disc:"⚠ क्रिप्टो जोखमीचे. फक्त गमावता येईल इतकेच वापरा. की तुमच्या वॉलेटमध्ये राहतात. नॉन-कस्टोडियल.",tx:"अलीकडील",
    cryptoSec:"क्रिप्टो",calcSec:"कॅल्क्युलेटर (खरे गणित)",gas:"⛽ नेटवर्क शुल्क अंदाज",price:"🔁 किंमत कन्व्हर्टर",csv:"📥 इतिहास CSV निर्यात",
    explorer:"🔗 ब्लॉक एक्सप्लोरर उघडा",addTok:"➕ कस्टम टोकन जोडा",close:"बंद करा",
    sip:"📈 SIP कॅल्क्युलेटर",emi:"🏦 EMI कॅल्क्युलेटर",yield:"🏠 भाडे यील्ड",frac:"🏢 अंशतः मालकी",roi:"💹 ROI कॅल्क्युलेटर",comp:"📊 चक्रवाढ व्याज",
    calc:"गणना करा",edu:"फक्त शैक्षणिक. आर्थिक सल्ला नाही.",
    sipM:"मासिक गुंतवणूक ₹",sipR:"अपेक्षित परतावा % / वर्ष",sipY:"वर्षे",
    emiP:"कर्ज रक्कम ₹",emiR:"व्याज % / वर्ष",emiN:"कालावधी (महिने)",
    yV:"मालमत्ता मूल्य ₹",yR:"वार्षिक भाडे ₹",yE:"वार्षिक खर्च ₹",
    fV:"मालमत्ता मूल्य ₹",fI:"तुमची गुंतवणूक ₹",fT:"एकूण टोकन्स (ऐच्छिक)",
    rI:"गुंतवले ₹",rC:"सध्याचे / परत ₹",
    cP:"मुद्दल ₹",cR:"दर % / वर्ष",cY:"वर्षे",
    toolsTitle:"टूल्स",settingsTitle:"सेटिंग्ज"
  }
};

function toast(m,ms){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),ms||2200)}
function tz(x){return String(x).replace(/(\.\d*?)0+$/,"$1").replace(/\.$/,"")}function fmt(n){if(!n&&n!==0)return"0";if(n===0)return"0";if(n<0.0001)return tz(n.toFixed(8));if(n<0.01)return tz(n.toFixed(5));if(n<1)return tz(n.toFixed(4));return n.toLocaleString("en-IN",{maximumFractionDigits:2})}function nz(s){if(s==null)return s;var x=String(s).replace(/,/g,"");if(!/^-?\d+(\.\d+)?$/.test(x))return s;if(parseFloat(x)===0)return"0";return String(s).indexOf(".")>-1?tz(s):s}
function pfx(){return cur==="INR"?"₹":"$"}
function rate(p){return p?(cur==="INR"?p.inr:p.usd):0}

function changeCurrency(c){cur=c;paint()}
function changeLang(l){
  lang=l;ls.set("lang",l);const d=I18N[l]||I18N.en;
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
  set("lblTotal",d.total);set("btnSend",d.send);set("btnRecv",d.recv);set("btnReq",d.req);
  set("tabAssets",d.assets);set("navHome",d.home);set("navBook",d.book);
  set("navTools",d.tools);set("navSettings",d.settings);set("disclaimer",d.disc);set("txtTx",d.tx);
  if($("toolsTitle"))$("toolsTitle").textContent=d.toolsTitle;
  if($("cryptoSec"))$("cryptoSec").textContent=d.cryptoSec;
  if($("calcSec"))$("calcSec").textContent=d.calcSec;
  if($("btnGas"))$("btnGas").textContent=d.gas;
  if($("btnPrice"))$("btnPrice").textContent=d.price;
  if($("btnCsv"))$("btnCsv").textContent=d.csv;
  if($("btnExp"))$("btnExp").textContent=d.explorer;
  if($("btnTok"))$("btnTok").textContent=d.addTok;
  if($("btnSip"))$("btnSip").textContent=d.sip;
  if($("btnEmi"))$("btnEmi").textContent=d.emi;
  if($("btnYield"))$("btnYield").textContent=d.yield;
  if($("btnFrac"))$("btnFrac").textContent=d.frac;
  if($("btnRoi"))$("btnRoi").textContent=d.roi;
  if($("btnComp"))$("btnComp").textContent=d.comp;
  if($("btnToolsClose"))$("btnToolsClose").textContent=d.close;
  const lsEl=$("langSelect");if(lsEl)lsEl.value=l;
}
function changeNetwork(key){
  currentNet=key;const n=NETWORKS[key];
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
  set("netLabel",n.name);set("setNet",n.name);
  set("sendUnit",n.symbol);set("recvUnit",n.symbol);set("reqUnit",n.symbol);
  set("sendTitle","Send "+n.symbol);set("recvTitle","Receive "+n.symbol);
  set("recvCap","Only send "+n.symbol+" on "+n.name);
  const fb=$("faucetBtn");if(fb)fb.style.display=key==="shardeum-testnet"?"block":"none";
  if(addr)ensureNetwork().then(()=>readBal(false));
  paint();
}

let AC;
function chime(){
  if(!soundOn)return;
  try{
    AC=AC||new(window.AudioContext||window.webkitAudioContext)();
    if(AC.state==="suspended")AC.resume();
    [523.25,659.25,783.99].forEach((f,i)=>{
      const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+i*.12;
      o.type="sine";o.frequency.value=f;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.4);
      o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.45);
    });
  }catch(e){}
}
function speakAlert(amount,symbol){
  if(!soundOn||!("speechSynthesis"in window))return;
  try{
    window.speechSynthesis.cancel();
    const r=T[symbol]&&T[symbol].p?rate(T[symbol].p):0;
    const inr=r?Math.round(parseFloat(amount)*r):0;
    let msg;
    if(lang==="hi")msg="ताज़वेरा पर "+amount+" "+symbol+(inr?" यानी लगभग "+inr+" रुपये":"")+" प्राप्त हुए।";
    else if(lang==="mr")msg="ताज़वेरा वर "+amount+" "+symbol+(inr?" म्हणजे सुमारे "+inr+" रुपये":"")+" मिळाले.";
    else msg="Tazvera received "+amount+" "+symbol+(inr?", about "+inr+" rupees":"")+".";
    const u=new SpeechSynthesisUtterance(msg);
    u.lang=lang==="hi"?"hi-IN":lang==="mr"?"mr-IN":"en-IN";u.rate=.95;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function applySound(){$("soundBtn").className="snd"+(soundOn?" on":"");$("soundBtn").textContent=soundOn?"🔊":"🔇";if($("setSound"))$("setSound").textContent=soundOn?"On":"Off"}
function toggleSound(){soundOn=!soundOn;ls.set("sound",soundOn);applySound()}
function togglePriv(){hideBal=!hideBal;ls.set("hide",hideBal);if($("setPriv"))$("setPriv").textContent=hideBal?"On":"Off";paint()}
function testVoice(){speakAlert("5","SHM")}

function toWei(s){
  if(!/^\d*\.?\d*$/.test(s)||s===""||s===".")return null;
  const[i,f=""]=s.split(".");
  return(BigInt(i||"0")*10n**18n+BigInt((f+"0".repeat(18)).slice(0,18))).toString();
}

function getCustoms(){
  return (ls.get("customTokens",[])||[]).map(x=>typeof x==="string"?{addr:x,symbol:"TOKEN"}:x).filter(x=>x&&x.addr);
}
function buildList(){
  const order=["SHM","USDT","BTC","ETH","BNB"];
  let html=order.map(k=>`<div class="row" onclick="XA.tap('${k}')"><div class="ic"><img src="${LOGOS[k]}" alt="${k}" onerror="this.parentElement.textContent='${k[0]}'"></div><div class="mid"><div class="sym">${k}</div><div class="sub" id="s-${k}">—</div></div><div class="rt"><div class="amt" id="b-${k}">0</div><div class="sub" id="v-${k}">—</div></div></div>`).join("");
  getCustoms().forEach((t,i)=>{
    if(order.indexOf(t.symbol)>-1)return;const id="ct"+i;
    html+=`<div class="row" onclick="XA.tap('${t.symbol}')"><div class="ic">${(t.symbol==="TZT")?TZLOGO:(t.symbol==="CPAY")?CPLOGO:(LOGOS[t.symbol]?"<img src=\""+LOGOS[t.symbol]+"\" alt=\"\">":(t.symbol||"T")[0])}</div><div class="mid"><div class="sym">${t.symbol||"TOKEN"}</div><div class="sub" id="s-${id}">Custom token</div></div><div class="rt"><div class="amt" id="b-${id}">…</div><div class="sub" id="v-${id}">${(t.symbol==="TZT"||t.symbol==="CPAY")?"test coin":""}</div></div></div>`;
  });
  $("list").innerHTML=html;
}
function paint(){
  let total=0;const H="••••";const native=NETWORKS[currentNet].symbol;const isTest=/testnet|sepolia/.test(currentNet);const nb=parseFloat((T[native]||{}).bal)||0;
  Object.keys(T).forEach(k=>{
    const t=T[k],bal=parseFloat(t.bal)||0,rt=rate(t.p);
    if(bal>0&&rt)total+=bal*rt;
    let chg="";
    if(t.p&&typeof t.p.chg==="number"){const c=t.p.chg<0?"var(--r)":"var(--g)";chg=` <span style="color:${c}">${t.p.chg>=0?"+":""}${t.p.chg.toFixed(2)}%</span>`}
    if($("s-"+k))$("s-"+k).innerHTML=t.p?pfx()+fmt(rt)+chg:pfx()+"--";
    if(isTest&&k===native&&$("s-"+k))$("s-"+k).textContent=lang==="en"?"Shardeum Test token":"Shardeum टेस्ट टोकन";
    if($("b-"+k))$("b-"+k).textContent=hideBal?H:nz(k===native?t.bal:(TOKB(k)||"—"));
    if($("v-"+k))$("v-"+k).textContent=hideBal?H:(isTest&&k===native?"test coin":(t.p&&k===native?pfx()+fmt(bal*rt):(t.p&&TOKB(k)?pfx()+fmt(+TOKB(k).replace(/,/g,"")*rt):(isTest?(lang==="en"?"price only":"सिर्फ़ भाव"):"—"))));
  });
  getCustoms().forEach((t,i)=>{
    const id="ct"+i,bal=t.bal!=null?parseFloat(t.bal):null;
    if($("b-"+id))$("b-"+id).textContent=hideBal?H:(bal!=null?fmt(bal):"—");
    if($("s-"+id))$("s-"+id).textContent=t.symbol==="TZT"?"Tazvera Test token":t.symbol==="CPAY"?"CryptoPay Test (old)":((window.TOKNAMES&&TOKNAMES[t.symbol])||(t.symbol||"TOKEN")+" · token");
  });
  $("total").textContent=hideBal?(isTest?H:pfx()+H):(isTest?fmt(nb)+" "+native:pfx()+fmt(total));
  if($("lblTotal"))$("lblTotal").textContent=isTest?(lang==="en"?"Test balance":"टेस्ट बैलेंस"):(lang==="en"?"Total Balance":"कुल बैलेंस");
  const live=Date.now()-lastOk<45000;
  $("feed").className="feed"+(live?"":" bad");
  $("feedText").textContent=isTest?(lang==="en"?"Test network":"टेस्ट नेटवर्क"):(live?"Live Market Connected":"Prices delayed");
}
async function ethCall(to,data){
  return ethereum.request({method:"eth_call",params:[{to,data},"latest"]});
}
async function readCustomBalances(){
  if(!addr||!window.ethereum)return;
  const list=getCustoms();
  if(!list.length)return;
  const updated=[];
  for(const t of list){
    try{
      const data="0x70a08231"+addr.slice(2).toLowerCase().padStart(64,"0");
      const raw=await ethCall(t.addr,data);
      let decimals=18;
      try{
        const draw=await ethCall(t.addr,"0x313ce567");
        decimals=parseInt(draw,16)||18;
      }catch(e){}
      const bal=Number(BigInt(raw||"0x0"))/Math.pow(10,decimals);
      updated.push({...t,bal:bal.toFixed(Math.min(6,decimals)),decimals});
    }catch(e){
      updated.push({...t,bal:null});
    }
  }
  ls.set("customTokens",updated);
  buildList();
  paint();
}

async function fetchPrices(){
  try{
    const cg=await(await fetch("https://api.coingecko.com/api/v3/simple/price?ids=shardeum,ethereum,binancecoin,bitcoin,tether&vs_currencies=usd,inr&include_24hr_change=true")).json();
    
    if(cg.ethereum)T.ETH.p={usd:cg.ethereum.usd,inr:cg.ethereum.inr||cg.ethereum.usd*fx,chg:cg.ethereum.usd_24h_change||0};
    if(cg.binancecoin)T.BNB.p={usd:cg.binancecoin.usd,inr:cg.binancecoin.inr||cg.binancecoin.usd*fx,chg:cg.binancecoin.usd_24h_change||0};
    if(cg.bitcoin)T.BTC.p={usd:cg.bitcoin.usd,inr:cg.bitcoin.inr||cg.bitcoin.usd*fx,chg:cg.bitcoin.usd_24h_change||0};
    if(cg.tether)T.USDT.p={usd:cg.tether.usd,inr:cg.tether.inr||fx,chg:0};
    lastOk=Date.now();
  }catch(e){}
  paint();
}
async function usdToInr(){try{const d=await(await fetch("https://open.er-api.com/v6/latest/USD")).json();if(d?.rates?.INR)fx=d.rates.INR}catch(e){}}
function refreshAll(){usdToInr();fetchPrices();toast("Refreshing…")}

function ensureNetwork(){
  const n=NETWORKS[currentNet];
  return ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:n.chainId}]}).catch(e=>{
    if(e.code===4902||e.code===-32603){
      return ethereum.request({method:"wallet_addEthereumChain",params:[{chainId:n.chainId,chainName:n.name,nativeCurrency:{name:n.symbol,symbol:n.symbol,decimals:18},rpcUrls:[n.rpc],blockExplorerUrls:[n.explorer]}]});
    }
    throw e;
  });
}

async function connectWallet(){
  if(!window.ethereum){
    toast("Install MetaMask");
    if(confirm("MetaMask not found. Open download page?"))window.open("https://metamask.io/download/","_blank");
    return;
  }
  try{
    const accounts=await ethereum.request({method:"eth_requestAccounts"});
    addr=accounts[0];
    await ensureNetwork();
    const chainId=await ethereum.request({method:"eth_chainId"});
    const ok=chainId===NETWORKS[currentNet].chainId;
    if(ok){await readBal(false);await readCustomBalances()}
    $("recvWarn").style.display=ok?"none":"block";
    const chip=$("chip");
    chip.innerHTML="";
    chip.classList.add("on");
    const t=document.createElement("span");
    t.id="chipText";
    t.textContent=addr.slice(0,6)+"…"+addr.slice(-4);
    chip.appendChild(t);
    chip.onclick=null;
    buildList();paint();toast("Wallet connected");
  }catch(e){if(e.code!==4001)toast(e.message||"Failed")}
}

async function readBal(detect){
  if(!addr)return;
  try{
    const n=NETWORKS[currentNet];
    const h=await ethereum.request({method:"eth_getBalance",params:[addr,"latest"]});
    const val=Number(BigInt(h))/1e18;
    const key=n.symbol;
    if(detect&&lastBal!==null&&val>lastBal+1e-9){
      const got=(val-lastBal).toFixed(4);
      logTx("in",got,key,"");
      chime();speakAlert(got,key);toast("+"+got+" "+key+" received");
    }
    lastBal=val;T[key].bal=val.toFixed(4);
    ["SHM","ETH","BNB"].forEach(k=>{if(k!==key)T[k].bal="0.0000"});
    paint();
  }catch(e){}
}
function pollBal(){if(!addr||!window.ethereum)return;ethereum.request({method:"eth_chainId"}).then(id=>{if(id===NETWORKS[currentNet].chainId)readBal(true)}).catch(()=>{})}

function logTx(type,amt,symbol,hash){txs.unshift({type,amt,symbol,hash:hash||"",time:Date.now()});txs=txs.slice(0,300);ls.set("txs",txs);renderTx()}
function renderTx(){
  const box=$("txHistory");if(!box)return;
  if(!txs.length){box.innerHTML='<div style="font-size:12px;color:var(--mut);text-align:center;padding:6px">No transactions yet</div>';return}
  box.innerHTML=txs.map(x=>{
    const d=new Date(x.time).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
    const col=x.type==="in"?"var(--g)":"var(--r)";const sign=x.type==="in"?"+":"-";
    const link=x.hash?` · <a href="${NETWORKS[currentNet].explorer}/tx/${x.hash}" target="_blank" style="color:var(--y);text-decoration:none">View</a>`:"";
    return`<div class="txi"><div><b>${x.type==="in"?"In":"Out"} ${x.symbol}</b><div style="color:var(--mut);font-size:10px">${d}${link}</div></div><div style="color:${col};font-weight:800">${sign}${x.amt}</div></div>`;
  }).join("");
}
function clearTxs(){if(!confirm("Clear history?"))return;txs=[];ls.set("txs",[]);renderTx()}

function closeAll(){stopScan();document.querySelectorAll(".shade").forEach(s=>s.classList.remove("open"))}
function sendMsg(t,ok){const m=$("sendMsg");m.textContent=t;m.className="msg"+(ok?" ok":"")}

async function openSend(){if(!addr){await connectWallet();if(!addr)return}sendMsg("");$("sheetSend").classList.add("open")}
async function doSend(){
  const to=$("sendTo").value.trim(),amt=$("sendAmt").value.trim(),wei=toWei(amt),n=NETWORKS[currentNet];
  if(!/^0x[0-9a-fA-F]{40}$/.test(to))return sendMsg("Invalid address");
  if(!wei)return sendMsg("Invalid amount");
  if(parseFloat(amt)>parseFloat(T[n.symbol].bal)+0.0001)return sendMsg("Insufficient balance");
  if(!confirm(`Send ${amt} ${n.symbol} to\n${to}?`))return;
  try{
    const chainId=await ethereum.request({method:"eth_chainId"});
    if(chainId!==n.chainId)return sendMsg("Wrong network");
    $("sendBtn").disabled=true;sendMsg("Confirm in wallet…");
    const hash=await ethereum.request({method:"eth_sendTransaction",params:[{from:addr,to,value:"0x"+BigInt(wei).toString(16)}]});
    sendMsg("Sent ✓ "+hash.slice(0,12)+"…",true);chime();logTx("out",amt,n.symbol,hash);$("sendAmt").value="";setTimeout(pollBal,5000);toast("Sent");
  }catch(e){sendMsg(e.code===4001?"Cancelled":(e.message||"Failed"))}
  $("sendBtn").disabled=false;
}

async function openReceive(){if(!addr){await connectWallet();if(!addr)return}
  const n=NETWORKS[currentNet];$("recvTitle").textContent="Receive "+n.symbol;$("recvUnit").textContent=n.symbol;
  $("recvCap").textContent="Only send "+n.symbol+" on "+n.name;$("addrBox").textContent=addr;$("sheetRecv").classList.add("open");drawQR()}
function drawQR(){
  if(!addr)return;const box=$("qrcode");box.innerHTML="";const n=NETWORKS[currentNet];
  let text=addr;const amount=$("payAmount").value.trim(),wei=toWei(amount);
  if(wei)text=`ethereum:${addr}@${n.chainIdDec}?value=${wei}`;
  if(typeof QRCode!=="undefined")new QRCode(box,{text,width:168,height:168,colorDark:"#000",colorLight:"#fff",correctLevel:QRCode.CorrectLevel.H});
  const pl=$("payLink");if(wei){pl.style.display="block";pl.textContent=text}else pl.style.display="none";
}
function copyAddress(){if(!addr)return;navigator.clipboard.writeText(addr).then(()=>{toast("Address copied");$("copyBtn").textContent="✓ Copied";setTimeout(()=>$("copyBtn").textContent="Copy Address",1500)})}
function copyPayLink(){const t=$("payLink").textContent||addr;navigator.clipboard.writeText(t).then(()=>toast("Payment link copied"))}
function shareWhatsApp(){
  if(!addr)return;const n=NETWORKS[currentNet],amount=$("payAmount").value.trim();
  let msg=`Pay me on Tazvera%0ANetwork: ${n.name}%0AToken: ${n.symbol}%0AAddress: ${addr}`;
  if(amount)msg+=`%0AAmount: ${amount} ${n.symbol}`;
  window.open("https://wa.me/?text="+msg,"_blank");
}

async function openRequest(){if(!addr){await connectWallet();if(!addr)return}
  $("reqUnit").textContent=NETWORKS[currentNet].symbol;$("reqAddr").textContent=addr;$("sheetReq").classList.add("open");drawReqQR()}
function drawReqQR(){
  if(!addr)return;const box=$("reqQR");box.innerHTML="";const n=NETWORKS[currentNet];
  const amount=$("reqAmt").value.trim(),wei=toWei(amount);
  const text=wei?`ethereum:${addr}@${n.chainIdDec}?value=${wei}`:addr;
  if(typeof QRCode!=="undefined")new QRCode(box,{text,width:180,height:180,colorDark:"#000",colorLight:"#fff",correctLevel:QRCode.CorrectLevel.H});
}
function copyReqLink(){
  if(!addr)return;const n=NETWORKS[currentNet],amount=$("reqAmt").value.trim(),wei=toWei(amount);
  const text=wei?`ethereum:${addr}@${n.chainIdDec}?value=${wei}`:addr;
  navigator.clipboard.writeText(text).then(()=>toast("Request link copied"));
}
function shareReqWA(){
  if(!addr)return;const n=NETWORKS[currentNet],amount=$("reqAmt").value.trim(),note=$("reqNote").value.trim();
  let msg=`Tazvera payment request%0A${n.name} · ${n.symbol}%0A`;
  if(amount)msg+=`Amount: ${amount} ${n.symbol}%0A`;
  if(note)msg+=`Note: ${note}%0A`;
  msg+=`Address: ${addr}`;
  window.open("https://wa.me/?text="+encodeURIComponent(msg.replace(/%0A/g,"\n")),"_blank");
}

let scanning=false,scanStream=null;
function stopScan(){scanning=false;if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null}$("scanVid").style.display="none"}
async function scanQR(){
  if(!("BarcodeDetector"in window)){sendMsg("QR scan not supported — paste address");return}
  try{
    scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    const v=$("scanVid");v.srcObject=scanStream;v.style.display="block";await v.play();
    const det=new BarcodeDetector({formats:["qr_code"]});scanning=true;
    while(scanning){try{const r=await det.detect(v);if(r.length){handleScan(r[0].rawValue);break}}catch(e){}await new Promise(r=>setTimeout(r,300))}
  }catch(e){sendMsg("Camera permission needed");stopScan()}
}
function handleScan(text){stopScan();const m=text.match(/0x[0-9a-fA-F]{40}/);if(!m)return sendMsg("No address found");$("sendTo").value=m[0];sendMsg("Scanned ✓",true)}

function openBook(){renderBook();$("sheetBook").classList.add("open")}
function renderBook(){
  const box=$("bookList");
  if(!contacts.length){box.innerHTML='<div class="cap">No contacts yet</div>';return}
  box.innerHTML=contacts.map((c,i)=>`<div class="srow"><span><b>${c.n}</b><br><span style="font-size:11px;color:var(--mut)">${c.a.slice(0,8)}…${c.a.slice(-6)}</span></span><span><u style="color:var(--y);cursor:pointer" onclick="useContact(${i})">Send</u> · <u style="color:var(--r);cursor:pointer" onclick="delContact(${i})">✕</u></span></div>`).join("");
}
function saveContact(){
  const n=$("bookName").value.trim(),a=$("bookAddr").value.trim();
  if(!n||!/^0x[0-9a-fA-F]{40}$/.test(a)){toast("Name + valid address");return}
  contacts.push({n,a});ls.set("contacts",contacts);$("bookName").value="";$("bookAddr").value="";renderBook();toast("Saved");
}
function useContact(i){closeAll();$("sendTo").value=contacts[i].a;openSend()}
function delContact(i){contacts.splice(i,1);ls.set("contacts",contacts);renderBook()}

async function toolGas(){
  const out=$("toolOut");out.textContent="Fetching…";
  try{
    const n=NETWORKS[currentNet];
    const r=await fetch(n.rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_gasPrice",params:[]})});
    const d=await r.json();const fe=parseInt(d.result,16)*21000/1e18;const p=rate(T[n.symbol].p);
    out.textContent=`≈ ${fe.toFixed(8)} ${n.symbol}`+(p?` (₹${(fe*p).toFixed(4)})`:"");
  }catch(e){out.textContent="Could not fetch fee"}
}
function toolConvert(){
  const n=NETWORKS[currentNet].symbol,p=rate(T[n].p);
  $("toolOut").textContent=p?`1 ${n} ≈ ${pfx()}${fmt(p)}`:"Price not loaded yet";
}
function toolExport(){
  const c="type,amount,symbol,hash,time\n"+txs.map(x=>[x.type,x.amt,x.symbol,x.hash,new Date(x.time).toISOString()].join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([c],{type:"text/csv"}));a.download="tazvera-history.csv";a.click();toast("CSV downloaded");
}
function openExplorer(){const n=NETWORKS[currentNet];window.open(addr?n.explorer+"/address/"+addr:n.explorer,"_blank")}
function openFaucet(){window.open("https://docs.shardeum.org/docs/developer/faucet","_blank")}

function openTools(){$("toolOut").textContent="";$("calcBox").style.display="none";$("sheetTools").classList.add("open")}
function toolAddToken(){
  $("toolOut").textContent="";
  const box=$("calcBox");
  box.style.display="block";
  const list=ls.get("customTokens",[]);
  const saved=list.length?`<div style="margin-top:10px;font-size:11px;color:var(--mut);text-align:left">Saved (${list.length}):<br>`+list.map(x=>{const a=typeof x==="string"?x:x.addr;const s=typeof x==="object"&&x.symbol?x.symbol+" ":"";return `<code style="color:var(--y)">${s}${a.slice(0,10)}…${a.slice(-6)}</code>`}).join("<br>")+`</div>`:"";
  box.innerHTML=`
    <b style="display:block;margin-bottom:8px">➕ Add custom token</b>
    <p style="font-size:12px;color:var(--mut);margin-bottom:10px;line-height:1.4">Paste the token <b style="color:#fff">contract address</b> (0x…). This is NOT your wallet address.</p>
    <input id="tokAddr" type="text" placeholder="0x..." spellcheck="false" style="width:100%;margin:4px 0;padding:12px;border-radius:12px;border:1px solid var(--ln);background:var(--bg);color:#fff;font-size:13px;font-family:monospace">
    <input id="tokSym" type="text" placeholder="Symbol (e.g. USDT)" style="width:100%;margin:4px 0;padding:12px;border-radius:12px;border:1px solid var(--ln);background:var(--bg);color:#fff;font-size:14px">
    <button class="btn" style="margin-top:10px" onclick="saveCustomToken()">Save token</button>
    <p style="font-size:10px;color:var(--mut);margin-top:8px;line-height:1.4">For live balance, also add the same token in MetaMask (Import tokens).</p>
    ${saved}`;
}
async function saveCustomToken(){
  const a=($("tokAddr").value||"").trim();
  const sym=($("tokSym").value||"").trim()||"TOKEN";
  if(!/^0x[0-9a-fA-F]{40}$/.test(a)){
    toast("Invalid contract address — need 0x + 40 hex characters");
    return;
  }
  const list=getCustoms();
  if(list.some(x=>x.addr.toLowerCase()===a.toLowerCase())){toast("Already saved");return}
  if(!addr){
    toast("Connect MetaMask first, then add token");
    return;
  }
  toast("Reading on-chain balance…");
  list.push({addr:a,symbol:sym,time:Date.now()});
  ls.set("customTokens",list);
  buildList();
  await readCustomBalances();
  toast("Token added: "+sym);
  toolAddToken();
  $("toolOut").textContent=sym+" added. Balance shows on Home if contract is on current network.";
}
function showCalc(type){
  const d=I18N[lang]||I18N.en;
  const box=$("calcBox");box.style.display="block";$("toolOut").textContent="";
  const inp=(id,ph,val)=>`<input id="${id}" type="number" placeholder="${ph}" value="${val||""}" style="width:100%;margin:4px 0;padding:10px;border-radius:8px;border:1px solid var(--ln);background:var(--bg);color:#fff;font-size:14px">`;
  const btn=(fn)=>`<button class="btn" style="margin-top:8px" onclick="${fn}">${d.calc}</button>`;
  const out=`<div id="calcRes" style="margin-top:10px;font-size:14px;font-weight:700;color:var(--y);line-height:1.5"></div><div style="font-size:10px;color:var(--mut);margin-top:6px">${d.edu}</div>`;
  if(type==="sip"){
    box.innerHTML=`<b>${d.sip}</b>${inp("c1",d.sipM,5000)}${inp("c2",d.sipR,12)}${inp("c3",d.sipY,10)}${btn("runSIP()")}${out}`;
  }else if(type==="emi"){
    box.innerHTML=`<b>${d.emi}</b>${inp("c1",d.emiP,500000)}${inp("c2",d.emiR,10)}${inp("c3",d.emiN,60)}${btn("runEMI()")}${out}`;
  }else if(type==="yield"){
    box.innerHTML=`<b>${d.yield}</b>${inp("c1",d.yV,5000000)}${inp("c2",d.yR,300000)}${inp("c3",d.yE,50000)}${btn("runYield()")}${out}`;
  }else if(type==="frac"){
    box.innerHTML=`<b>${d.frac}</b>${inp("c1",d.fV,10000000)}${inp("c2",d.fI,500000)}${inp("c3",d.fT,1000)}${btn("runFrac()")}${out}`;
  }else if(type==="roi"){
    box.innerHTML=`<b>${d.roi}</b>${inp("c1",d.rI,100000)}${inp("c2",d.rC,125000)}${btn("runROI()")}${out}`;
  }else if(type==="comp"){
    box.innerHTML=`<b>${d.comp}</b>${inp("c1",d.cP,100000)}${inp("c2",d.cR,8)}${inp("c3",d.cY,5)}${btn("runComp()")}${out}`;
  }
}
function runSIP(){
  const m=+$("c1").value,r=+$("c2").value/100/12,n=+$("c3").value*12;
  if(!m||!n){$("calcRes").textContent="Enter values";return}
  const fv=r?m*((Math.pow(1+r,n)-1)/r)*(1+r):m*n;
  $("calcRes").innerHTML=`Invested: ₹${(m*n).toLocaleString("en-IN")}<br>Maturity ≈ ₹${Math.round(fv).toLocaleString("en-IN")}<br>Gain ≈ ₹${Math.round(fv-m*n).toLocaleString("en-IN")}`;
}
function runEMI(){
  const p=+$("c1").value,r=+$("c2").value/100/12,n=+$("c3").value;
  if(!p||!n){$("calcRes").textContent="Enter values";return}
  const emi=r?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n;
  $("calcRes").innerHTML=`EMI ≈ ₹${Math.round(emi).toLocaleString("en-IN")}/month<br>Total ≈ ₹${Math.round(emi*n).toLocaleString("en-IN")}<br>Interest ≈ ₹${Math.round(emi*n-p).toLocaleString("en-IN")}`;
}
function runYield(){
  const v=+$("c1").value,rent=+$("c2").value,exp=+$("c3").value||0;
  if(!v||!rent){$("calcRes").textContent="Enter values";return}
  const net=rent-exp,y=(net/v)*100;
  $("calcRes").innerHTML=`Net annual income: ₹${net.toLocaleString("en-IN")}<br>Gross yield: ${((rent/v)*100).toFixed(2)}%<br>Net yield: ${y.toFixed(2)}%`;
}
function runFrac(){
  const v=+$("c1").value,inv=+$("c2").value,tok=+$("c3").value;
  if(!v||!inv){$("calcRes").textContent="Enter values";return}
  const pct=(inv/v)*100;
  let t=`Your share: ${pct.toFixed(4)}%`;
  if(tok)t+=`<br>Tokens ≈ ${((inv/v)*tok).toFixed(4)}<br>1 token ≈ ₹${(v/tok).toLocaleString("en-IN")}`;
  $("calcRes").innerHTML=t;
}
function runROI(){
  const a=+$("c1").value,b=+$("c2").value;
  if(!a){$("calcRes").textContent="Enter values";return}
  const roi=((b-a)/a)*100;
  $("calcRes").innerHTML=`Profit/Loss: ₹${(b-a).toLocaleString("en-IN")}<br>ROI: ${roi.toFixed(2)}%`;
}
function runComp(){
  const p=+$("c1").value,r=+$("c2").value/100,y=+$("c3").value;
  if(!p||!y){$("calcRes").textContent="Enter values";return}
  const fv=p*Math.pow(1+r,y);
  $("calcRes").innerHTML=`After ${y} yrs ≈ ₹${Math.round(fv).toLocaleString("en-IN")}<br>Interest ≈ ₹${Math.round(fv-p).toLocaleString("en-IN")}`;
}

function openSettings(){$("setAddr").textContent=addr||"Not connected";$("setNet").textContent=NETWORKS[currentNet].name;applySound();$("faucetBtn").style.display=currentNet==="shardeum-testnet"?"block":"none";$("sheetSet").classList.add("open")}
function goHome(){closeAll()}

if(window.ethereum){ethereum.on("chainChanged",()=>{try{readBal(false);readCustomBalances()}catch(e){}});ethereum.on("accountsChanged",()=>location.reload())}

window.onload=()=>{
  try{
    applySound();buildList();paint();renderTx();changeLang(lang);changeNetwork(currentNet);
    if("speechSynthesis"in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices()}
    usdToInr().then(fetchPrices);
    setInterval(fetchPrices,15000);setInterval(usdToInr,600000);setInterval(pollBal,8000);
  }catch(e){console.error(e)}
  setTimeout(()=>{const s=$("splash");if(s)s.classList.add("hide")},Math.max(0,3200-Math.round(performance.now())));
};


(function(){
var K=function(k,d){return ls.get("xt_"+k,d)},S=function(k,v){ls.set("xt_"+k,v)};
var R=document.documentElement,A=document.querySelector(".app"),V={},cur="",last=Date.now(),XT=window.XT={};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return"&#"+c.charCodeAt(0)+";"})};
var g=function(i){return $("x_"+i)},nv=function(i){return parseFloat(g(i).value)||0};
var f=function(n){return n.toLocaleString("en-IN",{maximumFractionDigits:2})};
var I=function(id,ph,t){return'<input id="x_'+id+'" placeholder="'+ph+'" type="'+(t||"number")+'" step="any" oninput="XT.u()">'};
var B=function(l,fn){return'<button class="btn ghost" onclick="'+fn+'">'+l+'</button>'};
var O=function(id){return'<div id="x_'+id+'" class="xt-r"></div>'};
var C=function(id){return'<select id="x_'+id+'" onchange="XT.u()">'+Object.keys(T).map(function(k){return"<option>"+k+"</option>"}).join("")+"</select>"};
var inr=function(s){var p=T[s]&&T[s].p;return p?(p.inr||p.usd*fxCache):0};
var ADDR=/^0x[a-fA-F0-9]{40}$/;
function tz(m){var d=document.createElement("div");d.className="xt-tz";d.textContent=m;document.body.appendChild(d);setTimeout(function(){d.remove()},3500)}
function nf(m){var n=K("nt",[]);n.unshift({m:m,t:Date.now()});S("nt",n.slice(0,50));tz(m);try{if(soundOn)chime()}catch(e){}}
function ta(){R.classList.toggle("xt-light",!!K("light",0));document.body.style.zoom=K("zoom",1)}
function rpc(m,p){return fetch(NETWORKS[currentNet].rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:m,params:p})}).then(function(r){return r.json()})}
function list(key,fn,del){return K(key,[]).map(function(x,i){return'<div class="xt-o">'+fn(x,i)+(del?' <b style="float:right" onclick="XT.dl(\''+key+"',"+i+')">✕</b>':"")+"</div>"}).join("")}
XT.dl=function(k,i){var a=K(k,[]);a.splice(i,1);S(k,a);XT.go(cur)};
XT.ad=function(k,o){var a=K(k,[]);a.push(o);S(k,a);XT.go(cur)};
XT.u=function(){if(V[cur]&&V[cur].u)V[cur].u()};
XT.go=function(n){cur=n;$("xtT").textContent=V[n].t;$("xtB").innerHTML=V[n].h();if(V[n].u)V[n].u();$("xtSheet").classList.add("open")};

var sh=document.createElement("div");sh.className="shade";sh.id="xtSheet";
sh.innerHTML='<div class="panel xt-p"><div class="grab"></div><div class="ttl" id="xtT"></div><div id="xtB"></div></div>';
sh.onclick=function(e){if(e.target===sh)closeAll()};A.appendChild(sh);

/* ---- Menu ---- */
var ICO={"set": "<path d=\"M4 7h9m4 0h3M4 17h3m4 0h9\"/><circle cx=\"15\" cy=\"7\" r=\"2\"/><circle cx=\"9\" cy=\"17\" r=\"2\"/>", "al": "<circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M12 9v4l3 2M5 4l-2 2M19 4l2 2\"/>", "nt": "<path d=\"M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 20h4\"/>", "pl": "<path d=\"M4 19V5M4 19h16M7 15l4-4 3 3 5-6\"/>", "bs": "<circle cx=\"8\" cy=\"12\" r=\"4.5\"/><circle cx=\"16\" cy=\"12\" r=\"4.5\"/>", "tx": "<circle cx=\"11\" cy=\"11\" r=\"6\"/><path d=\"M16 16l4 4\"/>", "st": "<path d=\"M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z\"/>", "qz": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.1\"/>", "sec": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9 12l2 2 4-4\"/>", "ra": "<path d=\"M5 21V5h9v16M14 10h5v11M8 9h3M8 13h3M8 17h3\"/>", "rr": "<path d=\"M4 6h16v14H4zM4 10h16M8 3v4M16 3v4\"/>", "ck": "<path d=\"M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2\"/>", "sc": "<path d=\"M6 21V4M6 5h11l-2 4 2 4H6\"/>", "ln": "<path d=\"M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19h15\"/>"};var ic=function(k){return'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="url(#gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 6px">'+ICO[k]+"</svg>"};

V.home={t:"✨ More tools",h:function(){var m=[["al","Price Alarm"],["nt","Notifications"],["pl","Profit / Loss"],["bs","Bill Split"],["tx","History Search"],["st","Daily Streak"],["qz","Crypto Quiz"],["sec","Security Tips"]],r=[["ra","My RWA Assets"],["rr","Rent Records"],["ck","Docs Checklist"],["sc","Scam Check"],["ln","Learn RWA"]];
var b=function(a){return'<div class="xt-g">'+a.map(function(x){return"<button onclick=\"XT.go('"+x[0]+"')\">"+ic(x[0])+x[1]+"</button>"}).join("")+"</div>"};
return b(m)+'<div class="ttl" style="margin:12px 0 8px">RWA tools</div>'+b(r)}};

/* ---- Settings: theme, font, PIN, blur, auto-lock, backup ---- */
V.set={t:"Settings & Lock",h:function(){return'<div class="xt-g"><button onclick="XT.th()">🌗 Light/Dark</button><button onclick="XT.bl()">Blur: '+(K("bl",1)?"On":"Off")+'</button><button onclick="XT.zm(.1)">A +</button><button onclick="XT.zm(-.1)">A −</button></div>'+I("pin","New PIN (4-6 digits)","password")+B("Set PIN","XT.pin()")+B("Remove PIN","XT.rp()")+I("am","Auto-lock minutes (now "+K("am",2)+")")+B("Save auto-lock","XT.am()")+'<textarea id="x_bk" rows="3" placeholder="Backup / restore data"></textarea>'+B("Backup (show data)","XT.bk()")+B("Restore from box","XT.rs()")}};
XT.th=function(){S("light",!K("light",0));ta()};
XT.zm=function(d){S("zoom",Math.min(1.3,Math.max(.8,+(K("zoom",1)+d).toFixed(2))));ta()};
XT.bl=function(){S("bl",!K("bl",1));XT.go("set")};
XT.pin=function(){var v=g("pin").value;if(!/^\d{4,6}$/.test(v))return tz("PIN must be 4-6 digits");S("pin",btoa(v+"cp"));tz("PIN set")};
XT.rp=function(){S("pin","");tz("PIN removed")};
XT.am=function(){S("am",nv("am")||2);XT.go("set")};
XT.bk=function(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);o[k]=localStorage.getItem(k)}g("bk").value=JSON.stringify(o)};
XT.rs=function(){try{var o=JSON.parse(g("bk").value);Object.keys(o).forEach(function(k){localStorage.setItem(k,o[k])});location.reload()}catch(e){tz("Invalid backup data")}};

/* ---- PIN lock, background blur, auto-lock ---- */
var lk=document.createElement("div");lk.id="xtLock";lk.innerHTML='<div style="font-size:42px">🔒</div><input id="xtPin" type="password" inputmode="numeric" placeholder="PIN"><button class="btn" style="width:200px" onclick="XT.un()">Unlock</button>';document.body.appendChild(lk);
function lock(){if(K("pin","")){lk.style.display="flex";$("xtPin").value=""}}
XT.un=function(){if(btoa($("xtPin").value+"cp")===K("pin","")){lk.style.display="none";last=Date.now()}else tz("Wrong PIN")};
["click","touchstart","keydown"].forEach(function(e){document.addEventListener(e,function(){last=Date.now()})});
var hid=0;document.addEventListener("visibilitychange",function(){if(document.hidden){hid=Date.now();if(K("bl",1))A.style.filter="blur(16px)"}else{A.style.filter="";if(hid&&Date.now()-hid>30000)lock()}});
setInterval(function(){if(K("pin","")&&Date.now()-last>K("am",2)*60000)lock()},5000);

/* ---- Alarm & notifications ---- */
V.al={t:"⏰ Price Alarm",h:function(){return C("c")+'<select id="x_d"><option value="a">Above ≥</option><option value="b">Below ≤</option></select>'+I("p","Price in USD")+B("Add alarm","XT.aa()")+list("al",function(a){return a.s+(a.d=="a"?" ≥ ":" ≤ ")+"$"+a.p+(a.x?" ✅":"")},1)}};
XT.aa=function(){if(nv("p")>0)XT.ad("al",{s:g("c").value,d:g("d").value,p:nv("p")})};
setInterval(function(){var a=K("al",[]),ch=0;a.forEach(function(x){var p=T[x.s]&&T[x.s].p;if(!p||x.x)return;if(x.d=="a"?p.usd>=x.p:p.usd<=x.p){x.x=1;ch=1;nf("⏰ "+x.s+(x.d=="a"?" reached $":" fell to $")+x.p)}});if(ch)S("al",a)},15000);
V.nt={t:"🔔 Notifications",h:function(){return(list("nt",function(n){return esc(n.m)+'<div style="color:var(--mut);font-size:10px">'+new Date(n.t).toLocaleString("en-IN")+"</div>"})||"No alerts yet")+B("Clear all","S('nt',[]);XT.go('nt')".replace("S(","XT.cl(").replace(/'nt',\[\]\)/,"'nt')"))}};
XT.cl=function(k){S(k,[]);XT.go(cur)};

/* ---- Address book ---- */

/* ---- Calculators ---- */
V.bs={t:"🧾 Bill Split",h:function(){return I("t","Total bill ₹")+I("p","People")+I("tp","Tip %")+O("o")},u:function(){var p=nv("p");g("o").textContent=p?"Each pays ₹"+f(nv("t")*(1+nv("tp")/100)/p):""}};
V.pl={t:"💹 Profit / Loss",h:function(){return C("c")+I("q","Quantity")+I("b","Buy price ₹ per coin")+B("Add","XT.pa()")+O("o")+list("pl",function(x){var cv=x.q*inr(x.s),cs=x.q*x.b,d=cv-cs;return x.s+" × "+x.q+' — <b style="color:'+(d>=0?"var(--g)":"var(--r)")+'">'+(inr(x.s)?(d>=0?"+":"")+"₹"+f(d):"price n/a")+"</b>"},1)},u:function(){}};
XT.pa=function(){if(nv("q")>0)XT.ad("pl",{s:g("c").value,q:nv("q"),b:nv("b")})};

/* ---- Merchant QR, fee, history ---- */
V.tx={t:"History",h:function(){return I("s","Search coin / in / out / hash","text")+'<div id="x_l"></div>'+B("Export CSV","toolExport()")+B("Clear all history","clearTxs();XT.go('tx')")},u:function(){var q=(g("s").value||"").toLowerCase();g("l").innerHTML=txs.filter(function(x){return(x.symbol+x.type+x.hash).toLowerCase().indexOf(q)>-1}).map(function(x){return'<div class="xt-o">'+(x.type=="in"?"+":"-")+x.amt+" "+x.symbol+' <span style="color:var(--mut)">'+new Date(x.time).toLocaleString("en-IN")+"</span></div>"}).join("")||"No match"}};

/* ---- Streak & quiz & tips ---- */
var td=new Date().toISOString().slice(0,10),st=K("st",{d:"",n:0});
if(st.d!=td){var yd=new Date(Date.now()-864e5).toISOString().slice(0,10);st={d:td,n:st.d==yd?st.n+1:1};S("st",st)}
V.st={t:"🔥 Daily Streak",h:function(){return'<div style="text-align:center;font-size:44px">🔥 '+K("st",st).n+'</div><p style="text-align:center">day(s) in a row — open the app daily!</p>'}};
var Q=[["What does 'non-custodial' mean?",["App holds your keys","You hold your keys","Bank holds funds"],1],["Sending to the wrong network usually…",["Gets refunded","Can lose funds","Is free"],1],["Should you share your seed phrase?",["Yes, with support","Never","Only on WhatsApp"],1],["RWA stands for…",["Real World Assets","Random Wallet Address","Rapid Web App"],0],["A 'guaranteed' very high return is usually…",["Safe","A red flag","Government backed"],1]],qi=0,qs=0;
V.qz={t:"🧠 Crypto Quiz",h:function(){if(qi>=Q.length){var r="Score: "+qs+"/"+Q.length+B("Retry","qi=0;qs=0;XT.go('qz')".replace("qi=0;qs=0;","XT.qr();"));return r}var q=Q[qi];return"<b>"+(qi+1)+". "+q[0]+"</b>"+q[1].map(function(o,i){return B(o,"XT.qa("+i+")")}).join("")}};
XT.qa=function(i){if(i==Q[qi][2]){qs++;tz("✅ Correct")}else tz("❌ Wrong");qi++;XT.go("qz")};XT.qr=function(){qi=0;qs=0;XT.go("qz")};
V.sec={t:"🛡 Security Tips",h:function(){return["Never share seed phrase or private key — nobody from support will ask.","Check network and address before every send.","Test with a small amount first.","Avoid unknown links and fake airdrops.","Use a PIN and keep your phone updated.","If it promises guaranteed profit, walk away."].map(function(x){return'<div class="xt-o">🛡 '+x+"</div>"}).join("")}};

/* ---- RWA ---- */
V.ra={t:"🏠 My RWA Assets",h:function(){var tot=K("ra",[]).reduce(function(a,x){return a+x.v},0);return I("n","Asset name","text")+'<select id="x_k"><option>Flat</option><option>Land</option><option>Shop</option><option>Gold token</option><option>Other</option></select>'+I("v","Value ₹")+B("Add","XT.ra()")+'<div class="xt-r">Total ₹'+f(tot)+"</div>"+list("ra",function(x){return esc(x.n)+" ("+x.k+") — ₹"+f(x.v)},1)}};
XT.ra=function(){if(g("n").value&&nv("v")>0)XT.ad("ra",{n:g("n").value,k:g("k").value,v:nv("v")})};
V.rr={t:"📅 Rent Records",h:function(){return I("n","Tenant name","text")+I("a","Rent ₹")+'<input id="x_d" type="date">'+B("Add","XT.rr()")+list("rr",function(x,i){var od=!x.p&&x.d<td;return esc(x.n)+" ₹"+f(x.a)+" · due "+x.d+' <u onclick="XT.rt('+i+')" style="color:'+(x.p?"var(--g)":od?"var(--r)":"var(--y)")+'">'+(x.p?"Paid ✓":od?"Overdue!":"Mark paid")+"</u>"},1)}};
XT.rr=function(){if(g("n").value&&g("d").value)XT.ad("rr",{n:g("n").value,a:nv("a"),d:g("d").value,p:0})};
XT.rt=function(i){var a=K("rr",[]);a[i].p=!a[i].p;S("rr",a);XT.go("rr")};
setTimeout(function(){var o=K("rr",[]).filter(function(x){return!x.p&&x.d<td}).length;if(o)nf("📅 "+o+" rent payment(s) overdue")},3000);
var CK=["7/12 extract (land)","Sale / title deed","Property tax receipts","Electricity & water bills","Society NOC","Encumbrance certificate","Rent agreement","Owner ID & PAN"];
V.ck={t:"📋 Docs Checklist",h:function(){var c=K("ck",{});return CK.map(function(x,i){return'<div class="xt-o" onclick="XT.ct('+i+')">'+(c[i]?"☑":"☐")+" "+x+"</div>"}).join("")+O("o")},u:function(){}};
XT.ct=function(i){var c=K("ck",{});c[i]=!c[i];S("ck",c);XT.go("ck")};
var SC=["Promises guaranteed / very high returns","No legal documents shown","Pressure to invest quickly","Owner or company can't be verified","Asked to pay to a personal account","Title / 7-12 not verified","Token contract not public","No rent or income proof"];
V.sc={t:"🚩 Scam Check",h:function(){return SC.map(function(x,i){return'<label class="xt-o" style="display:block"><input type="checkbox" id="x_c'+i+'" onchange="XT.u()">'+x+"</label>"}).join("")+O("o")},u:function(){var n=SC.filter(function(x,i){return g("c"+i).checked}).length;g("o").textContent=n+" red flag(s) — "+(n<=1?"Lower risk, still verify":n<=3?"⚠ Medium risk — be careful":"🚨 High risk — avoid")}};
V.ln={t:"📚 Learn RWA",h:function(){return["<b>RWA</b> = Real World Assets (property, gold, etc.) represented as digital tokens.","<b>Fractional ownership</b> lets many people own small shares of one asset.","<b>Benefits:</b> small entry amount, easy records, transparent history.","<b>Risks:</b> legal rules, fake projects, low liquidity, price swings.","Always verify documents and legality before investing."].map(function(x){return'<div class="xt-o">'+x+"</div>"}).join("")}};

A.insertAdjacentHTML("afterbegin",'<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6EA2FF"/><stop offset="1" stop-color="#2B6DF6"/></linearGradient></defs></svg>');
var tp=document.querySelector("#sheetTools .ttl");if(tp){var mb=document.createElement("button");mb.className="btn";mb.style.cssText="margin:8px 0";mb.textContent="✨ More tools & RWA";mb.onclick=function(){XT.go("home")};tp.after(mb)}
setInterval(function(){var c=$("chip"),t=$("chipText");if(c)c.classList.toggle("on",!!addr);if(t&&!addr&&t.textContent=="MetaMask")t.textContent="Connect Wallet"},800);
ta();lock();
})();

/* Tazvera extras: runs after index.html. If this file fails, the main app still works. */
(function(){
"use strict";
var NL={"shardeum-testnet":["#2563EB","S","Testnet · test coins"],shardeum:["#2563EB","S","Mainnet · real money"],ethereum:["#627EEA","E","Mainnet · real money"],bsc:["#F0B90B","B","Mainnet · real money"],polygon:["#8247E5","P","Mainnet · real money"],base:["#0052FF","B","Mainnet · real money"],optimism:["#FF0420","O","Mainnet · real money"],arbitrum:["#28A0F0","A","Mainnet · real money"],"bsc-testnet":["#F0B90B","B","Testnet · test coins"],sepolia:["#627EEA","E","Testnet · test coins"]};
var NU={"shardeum-testnet":LOGOS.SHM,shardeum:LOGOS.SHM,ethereum:LOGOS.ETH,bsc:LOGOS.BNB,polygon:"https://assets.coingecko.com/coins/images/4713/small/polygon.png",optimism:"https://assets.coingecko.com/coins/images/25244/small/Optimism.png",arbitrum:"https://assets.coingecko.com/coins/images/16547/small/arb.jpg","bsc-testnet":LOGOS.BNB,sepolia:LOGOS.ETH};
var lg=function(k){var l=NL[k]||["#555","?"],u=NU[k];return'<span class="nlg" style="background:'+l[0]+(k==="bsc"?";color:#111":"")+'">'+l[1]+(u?'<img src="'+u+'" alt="" onerror="this.remove()">':"")+"</span>"};
var S=function(p){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+"</svg>"};
var A=document.querySelector(".app");

/* fix: name used by older add-on */
try{Object.defineProperty(window,"fxCache",{get:function(){return fx}})}catch(e){}

/* ---- Function icons (own drawings) replace emoji ---- */
var P={gas:'<path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M5 20h9M5 10h9M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/>',price:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',csv:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',exp:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',tok:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',sip:'<path d="M4 19V5M4 19h16M7 15l4-4 3 3 5-6"/>',emi:'<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',yld:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM10 21v-6h4v6"/>',frac:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',roi:'<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',comp:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',share:'<path d="M12 15V4M8 8l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',vol:'<path d="M4 10v4h4l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6"/>',drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>'};
var M={"#btnGas":"gas","#btnPrice":"price","#btnCsv":"csv","#btnExp":"exp","#btnTok":"tok","#btnSip":"sip","#btnEmi":"emi","#btnYield":"yld","#btnFrac":"frac","#btnRoi":"roi","#btnComp":"comp",'[onclick="scanQR()"]':"scan",'[onclick="shareReqWA()"]':"share",'[onclick="testVoice()"]':"vol","#faucetBtn":"drop"};
var css="";Object.keys(P).forEach(function(k){var u='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+P[k]+"</svg>")+'")';css+='[data-xi="'+k+'"]::before{-webkit-mask-image:'+u+';mask-image:'+u+"}"});
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
var strip=function(s){return s.replace(/^[^\p{L}\p{N}]+/u,"")};
try{Object.keys(I18N).forEach(function(l){["gas","price","csv","explorer","addTok","sip","emi","yield","frac","roi","comp"].forEach(function(k){if(I18N[l][k])I18N[l][k]=strip(I18N[l][k])})})}catch(e){}
Object.keys(M).forEach(function(s){var e=document.querySelector(s);if(e){e.setAttribute("data-xi",M[s]);e.textContent=strip(e.textContent)}});

/* ---- Real network picker (switches the actual network) ---- */
var nm=function(){return NETWORKS[currentNet].name};
var chip=function(){return'<div class="xnc" onclick="XN.open()">'+lg(currentNet)+"<span>"+nm()+"</span></div>"};
var ns=document.createElement("div");ns.className="shade";ns.id="xnSheet";
ns.onclick=function(e){if(e.target===ns)ns.classList.remove("open")};
ns.innerHTML='<div class="panel"><div class="grab"></div><div class="ttl">Select Network</div><div id="xnList"></div><div class="cap" style="margin-top:12px">Mainnet networks use real money. Test first on Testnet.</div></div>';
A.appendChild(ns);
var XN=window.XN={open:function(){$("xnList").innerHTML=Object.keys(NETWORKS).map(function(k){return'<div class="xni'+(k===currentNet?" on":"")+'" onclick="XN.pick(\''+k+"')\">"+lg(k)+"<div>"+NETWORKS[k].name+"<small>"+(NL[k]?NL[k][2]:"")+"</small></div></div>"}).join("");ns.classList.add("open")},
pick:function(k){if(window.ethereum&&window.ethereum.isCpWallet&&!/testnet|sepolia/.test(k)&&!(k==="shardeum"&&localStorage.getItem("cp3_mainnet_beta")==="1")){ns.classList.remove("open");toast((typeof lang!=="undefined"&&lang==="en")?"The in-app wallet works on test networks only. Real-money networks need MetaMask.":"ऐप के अपने वॉलेट में सिर्फ़ टेस्ट नेटवर्क चलते हैं। असली पैसे वाले नेटवर्क के लिए MetaMask चाहिए।",5000);return}var s=$("netSelect");if(s)s.value=k;changeNetwork(k);ns.classList.remove("open");if(!/testnet|sepolia/.test(k))toast("Mainnet: real money. Double-check before sending.",3200)}};
function upd(){var n=NETWORKS[currentNet];document.querySelectorAll(".xnc-slot").forEach(function(e){e.innerHTML=chip()});
var c=$("recvCap");if(c)c.textContent="Only send "+n.name+" assets to this address. Other assets will be lost forever.";
if($("sheetRecv")&&$("sheetRecv").classList.contains("open"))drawQR()}
var _cn=changeNetwork;changeNetwork=function(k){_cn(k);upd()};

/* Send sheet: slot instead of the fake dropdown */
var sp=document.querySelector("#sheetSend .ttl");if(sp){var d=document.createElement("div");d.className="xnc-slot";sp.after(d)}

/* ---- Receive sheet (Trust-style) ---- */
var rp=document.querySelector("#sheetRecv .panel");
if(rp)rp.innerHTML='<div class="grab"></div><div class="rc-h"><button class="rc-x bkb" onclick="BK(this)" aria-label="Back">'+S('<path d="M15 5l-7 7 7 7"/>')+'</button><div class="ttl" id="recvTitle">Receive</div><i></i></div><div class="xnc-slot"></div><div class="warn" id="recvWarn">Switch to the correct network in your wallet</div><div class="inp"><input type="number" id="payAmount" placeholder="Amount (optional)" oninput="drawQR()" step="any" min="0"><b id="recvUnit">SHM</b></div><div class="qrbox" id="qrcode"></div><div class="addr" id="addrBox"></div><div class="cap" style="font-size:11px">One address works on all EVM networks (Ethereum, BNB, Polygon, Base…).</div><div class="paylink" id="payLink" style="display:none"></div><div class="xwarn">'+S('<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.1"/>')+'<span id="recvCap"></span></div><div class="xbtns"><button onclick="copyAddress()">'+S('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>')+'<span id="copyBtn">Copy</span></button><button onclick="xShare()">'+S(P.share)+'<span>Share</span></button></div><button class="btn ghost" onclick="copyPayLink()">Copy payment link</button>';
window.xShare=function(){if(navigator.share&&addr){navigator.share({title:"Tazvera",text:nm()+" address:\n"+addr}).catch(function(){})}else shareWhatsApp()};

/* ---- Styled QR: round dots, round corner eyes, logo in the middle ---- */
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();x.fill()}
function sq(el,text,Z){if(!el||typeof QRCode==="undefined")return;
var t=document.createElement("div"),o=new QRCode(t,{text:text,width:64,height:64,correctLevel:QRCode.CorrectLevel.H}),m=o._oQRCode,N=m.getModuleCount(),d=window.devicePixelRatio||1,c=document.createElement("canvas");
c.width=c.height=Z*d;c.style.cssText="width:"+Z+"px;height:"+Z+"px";var x=c.getContext("2d");x.scale(d,d);x.fillStyle="#fff";x.fillRect(0,0,Z,Z);
var u=Z/(N+2),mid=N/2,h=N*.13,dk="#0A0F1A";x.fillStyle=dk;
for(var r=0;r<N;r++)for(var q=0;q<N;q++){if((r<7&&q<7)||(r<7&&q>=N-7)||(r>=N-7&&q<7))continue;if(Math.abs(r+.5-mid)<h&&Math.abs(q+.5-mid)<h)continue;if(m.isDark(r,q)){x.beginPath();x.arc(u*(q+1.5),u*(r+1.5),u*.46,0,6.2832);x.fill()}}
[[0,0],[0,N-7],[N-7,0]].forEach(function(p){var X=u*(p[1]+1),Y=u*(p[0]+1);x.fillStyle=dk;rr(x,X,Y,7*u,7*u,2.4*u);x.fillStyle="#fff";rr(x,X+u,Y+u,5*u,5*u,1.7*u);x.fillStyle=dk;rr(x,X+2*u,Y+2*u,3*u,3*u,1.2*u)});
var L=Z*.2,l=NL[currentNet]||["#555","?"],cx=Z/2-L/2;x.fillStyle="#fff";rr(x,cx-L*.12,cx-L*.12,L*1.24,L*1.24,L*.3);x.fillStyle=l[0];rr(x,cx,cx,L,L,L*.26);
x.fillStyle=currentNet==="bsc"?"#111":"#fff";x.font="900 "+L*.58+"px Arial";x.textAlign="center";x.textBaseline="middle";x.fillText(l[1],Z/2,Z/2+L*.03);
el.innerHTML="";el.appendChild(c)}
drawQR=function(){if(!addr)return;var n=NETWORKS[currentNet],w=toWei($("payAmount").value.trim()),t=w?"ethereum:"+addr+"@"+n.chainIdDec+"?value="+w:addr;sq($("qrcode"),t,236);var p=$("payLink");if(w){p.style.display="block";p.textContent=t}else p.style.display="none"};
drawReqQR=function(){if(!addr)return;var n=NETWORKS[currentNet],w=toWei($("reqAmt").value.trim());sq($("reqQR"),w?"ethereum:"+addr+"@"+n.chainIdDec+"?value="+w:addr,200)};
var _or=openReceive;openReceive=async function(){await _or.apply(this,arguments);upd();if(addr)drawQR()};
changeLang(lang);upd();
})();

/* ===== Part 1: fixed layout, 3-way theme, Settings hub, 6-box PIN, Back stack ===== */
(function(){
"use strict";
var sv=function(p){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+"</svg>"};
var AR=sv('<path d="M15 5l-7 7 7 7"/>'),CH=sv('<path d="M9 5l7 7-7 7"/>');
var IC={w:'<path d="M4 8a2 2 0 0 1 2-2h12v3M4 8v9a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2"/><path d="M16 14h2"/>',n:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',a:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',s:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',b:'<path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 20h4"/>',d:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',r:'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/>',i:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',x:'<path d="M5 4h3.5L19 20h-3.5zM19 4L5 20"/>',tg:'<path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L19 19z"/><path d="M9 13.5L21 4"/>'};
var L=function(k,d){return ls.get(k,d)};

/* ---- Theme: auto / dark / light ---- */
function applyTheme(){var m="dark",mq=false,l=false;document.documentElement.setAttribute("data-theme",l?"light":"dark");var c=document.querySelector("meta[name=theme-color]");if(c)c.content=l?"#f5f6f8":"#0A0F1A"}
try{matchMedia("(prefers-color-scheme: light)").addEventListener("change",applyTheme)}catch(e){}
applyTheme();

/* ---- Layout: only the token list scrolls ---- */
var sc=document.querySelector(".scroll"),ds=$("disclaimer");if(sc&&ds)sc.appendChild(ds);

/* ---- 6-box PIN ---- */
var pinHTML=function(id){return'<div class="pinw" onclick="$(\''+id+'\').focus()"><div class="pbs"><i></i><i></i><i></i><i></i><i></i><i></i></div><input id="'+id+'" class="pin-h" type="password" inputmode="numeric" maxlength="6" autocomplete="off" oninput="PB(this)"></div>'};
window.PB=function(el){var n=el.value.replace(/\D/g,"");el.value=n;var b=el.parentNode.querySelectorAll("i");for(var i=0;i<6;i++)b[i].className=i<n.length?"f":i===n.length?"c":"";if(n.length===6){var f=PB.h[el.id];setTimeout(function(){if(f)f(n);el.value="";PB(el)},150)}};PB.h={};
var lk=$("xtLock");if(lk){lk.innerHTML='<div class="lkic">'+sv('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')+'</div><div class="pt">Enter PIN</div>'+pinHTML("xtPin")+'<a class="forgot" onclick="XT.fp()">Forgot PIN?</a>';PB.h.xtPin=function(){XT.un()};
new MutationObserver(function(){if(lk.style.display==="flex")setTimeout(function(){$("xtPin").focus()},80)}).observe(lk,{attributes:true,attributeFilter:["style"]})}
var pa=document.createElement("div");pa.id="pinAsk";pa.className="shade";pa.innerHTML='<div class="panel"><div class="bkh"><button class="bkb" onclick="BK(this)" aria-label="Back">'+AR+'</button><div class="ttl" id="paT"></div></div><div style="padding:24px 0">'+pinHTML("paIn")+"</div></div>";
document.querySelector(".app").appendChild(pa);
function pinAsk(t,cb){$("paT").textContent=t;PB.h.paIn=function(v){pa.classList.remove("open");cb(v)};pa.classList.add("open");setTimeout(function(){$("paIn").focus()},120)}
var hasPin=function(){return!!L("xt_pin","")},chk=function(v){return btoa(v+"cp")===L("xt_pin","")};
function setPin(done){pinAsk("Enter new PIN",function(a){setTimeout(function(){pinAsk("Confirm PIN",function(b){if(a===b){ls.set("xt_pin",btoa(a+"cp"));toast("PIN saved");}else toast("PINs did not match");SB.r()})},200)})}

/* ---- Settings hub with its own Back steps ---- */
var stk=["root"],mins=function(){return L("xt_am",2)};
var R=function(i,l,v,c){return'<div class="sr" onclick="'+c+'"><span class="si">'+sv(IC[i])+'</span><span class="sl">'+l+'</span><span class="sv">'+(v||"")+"</span>"+CH+"</div>"};
var T=function(l,on,c){return'<div class="sr" onclick="'+c+'"><span class="sl">'+l+'</span><span class="sw'+(on?" on":"")+'"></span></div>'};
var O=function(l,on,c){return'<div class="sr" onclick="'+c+'"><span class="sl">'+l+'</span><span class="rd'+(on?" on":"")+'"></span></div>'};
var XL='<a class="xl" href="https://x.com/TazveraApp" target="_blank" rel="noopener" aria-label="X">'+sv(IC.x)+'</a><a class="xl" href="https://t.me/TazveraApp" target="_blank" rel="noopener" aria-label="Telegram">'+sv(IC.tg)+'</a><a class="xl" href="https://discord.gg/s2tjFdaCVN" target="_blank" rel="noopener" aria-label="Discord">'+sv('<path d="M8.5 8.2a12 12 0 0 1 7 0M7.6 16.4c2.9 1.2 5.9 1.2 8.8 0"/><path d="M8 7.5C6.2 8 5 9 5 9c-1.2 2.2-1.9 4.6-1.8 7.1 1.4 1.3 3 2 4.6 2.4l1-1.8M16 7.5c1.8.5 3 1.5 3 1.5 1.2 2.2 1.9 4.6 1.8 7.1-1.4 1.3-3 2-4.6 2.4l-1-1.8"/><circle cx="9.5" cy="12.8" r="1.1"/><circle cx="14.5" cy="12.8" r="1.1"/>')+'</a><a class="xl" href="https://tazvera.com" target="_blank" rel="noopener" aria-label="Website">'+sv(IC.n)+"</a>";
var PG={
root:["Settings",function(){var a=addr?addr.slice(0,6)+"…"+addr.slice(-4):"Not connected";return R("w","Wallet",a,"addr||connectWallet()")+R("n","Network",NETWORKS[currentNet].name,"XN.open()")+R("s","Security",hasPin()?"PIN on":"Off","SB.g('sec')")+R("b","Notifications","","SB.g('noti')")+R("d","Language & display","","SB.g('disp')")+R("r","Data & help","","SB.g('dat')")+R("i","About","","SB.g('abt')")+'<div class="xw">'+XL+"</div>"}],
app:["Appearance",function(){var m=L("theme","dark");return O("Automatic (follows phone)",m==="auto","SB.th('auto')")+O("Dark",m==="dark","SB.th('dark')")+O("Light",m==="light","SB.th('light')")}],
sec:["Security",function(){return R("s","Security checkup","","SC.open()")+(window.CPW&&CPW.has()?R("w","Recovery phrase (12 words)","","WS.show()")+R("w","Lock wallet","","CPW.lock();toast('Wallet locked');SB.r()"):"")+R("s","PIN lock",hasPin()?"On":"Off","SB.g('pin')")+'<div class="sr"><span class="sl">Auto-lock after</span><select onchange="ls.set(\'xt_am\',+this.value)">'+[1,2,5,10].map(function(x){return'<option value="'+x+'"'+(x==mins()?" selected":"")+">"+x+" min</option>"}).join("")+"</select></div>"+T("Blur screen in background",L("xt_bl",1),"SB.bl()")+'<div class="cap" style="padding:10px 4px">PIN protects this app on your phone. It does not replace your wallet password.</div>'}],
pin:["PIN lock",function(){return hasPin()?'<div class="sr" onclick="SB.chg()"><span class="sl">Change PIN</span>'+CH+'</div><div class="sr" onclick="SB.rm()"><span class="sl" style="color:var(--r)">Remove PIN</span></div>':'<div class="sr" onclick="SB.set()"><span class="sl">Set 6-digit PIN</span>'+CH+"</div>"}],
noti:["Notifications",function(){return T("Sound & voice alerts",soundOn,"toggleSound();SB.r()")+'<div class="sr" onclick="XT.go(\'al\')"><span class="sl">Price alarms</span>'+CH+'</div><div class="sr" onclick="XT.go(\'nt\')"><span class="sl">Notification centre</span>'+CH+"</div>"}],
disp:["Language & display",function(){return'<div class="sr"><span class="sl">Language</span><select onchange="changeLang(this.value)">'+[["en","English"],["hi","हिंदी"]].map(function(o){return'<option value="'+o[0]+'"'+(o[0]===lang?" selected":"")+">"+o[1]+"</option>"}).join("")+'</select></div><div class="sr"><span class="sl">Currency</span><select onchange="changeCurrency(this.value)">'+["INR","USD"].map(function(o){return'<option'+(o===cur?" selected":"")+">"+o+"</option>"}).join("")+"</select></div>"+T("Hide balance",hideBal,"togglePriv();SB.r()")+'<div class="sr"><span class="sl">Text size</span><span><button class="mini" onclick="XT.zm(-.1)">A−</button> <button class="mini" onclick="XT.zm(.1)">A+</button></span></div>'}],
dat:["Data & help",function(){return'<div class="sr" onclick="refreshAll()"><span class="sl">Refresh prices</span></div><div class="sr" onclick="testVoice()"><span class="sl">Test voice alert</span></div>'+(currentNet==="shardeum-testnet"?'<div class="sr" onclick="openFaucet()"><span class="sl">Testnet faucet</span></div>':"")+'<div class="sr" onclick="PC.run()"><span class="sl">Check SHM price sources</span></div><div id="pcout" class="cap" style="padding:8px 4px;text-align:left"></div><div class="sr" onclick="location.reload()"><span class="sl">Reload app</span></div>'}],
abt:["About",function(){var en=lang==="en",P=function(a,b){return'<div class="xt-o" style="text-align:left"><b>'+a+'</b><div style="color:var(--mut);margin-top:4px;line-height:1.5">'+b+"</div></div>"};
var T=en?{v:"Version 6 · Build 96 · Test version",i:"Tazvera is a simple wallet for everyday crypto payments. We are building it step by step, in the open.",h:"Our promises",a:["Your keys, your control","Your key stays on your phone, locked by your PIN. We never hold it."],b:["Honest by default","Right now this is a test version. We will not call it more than it is."],c:["No hidden fees","Network fees go to the network, not to Tazvera. We show them before you send."],d:["We tell you our mistakes","If something goes wrong, we will say so and fix it."],w:"What works today",wt:"A wallet on your phone, send and receive on Shardeum Testnet, free test TZT, and useful tools.",n:"Not yet",nt:"Real-money networks, Buy and Swap. We will open them only after proper security checks.",f:"Crypto is risky. Test coins have no value. Not financial advice."}:{v:"वर्शन 6 · बिल्ड 96 · टेस्ट वर्शन",i:"Tazvera रोज़मर्रा के क्रिप्टो भुगतान के लिए एक सरल वॉलेट है। हम इसे धीरे-धीरे, खुलकर बना रहे हैं।",h:"हमारे वादे",a:["आपकी चाबी, आपका नियंत्रण","आपकी चाबी सिर्फ़ आपके फ़ोन में PIN के ताले में रहती है। हम उसे कभी नहीं रखते।"],b:["जो है, वही बताएँगे","अभी यह टेस्ट वर्शन है। हम इसे जितना है उससे ज़्यादा नहीं बताएँगे।"],c:["कोई छिपी फ़ीस नहीं","नेटवर्क की फ़ीस नेटवर्क को जाती है, Tazvera को नहीं। भेजने से पहले हम उसे दिखाते हैं।"],d:["अपनी गलतियाँ बताएँगे","कुछ गलत हुआ तो हम बताएँगे और ठीक करेंगे।"],w:"आज क्या चलता है",wt:"फ़ोन में अपना वॉलेट, Shardeum Testnet पर भेजना और पाना, मुफ़्त टेस्ट TZT और काम के टूल।",n:"अभी नहीं",nt:"असली पैसे वाले नेटवर्क, Buy और Swap। ये सही सुरक्षा जाँच के बाद ही खोलेंगे।",f:"क्रिप्टो जोखिम भरा है। टेस्ट सिक्कों की कोई कीमत नहीं। वित्तीय सलाह नहीं।"};
return'<div style="text-align:center;padding:14px 6px"><div style="margin:0 auto 12px;width:104px;height:104px;border-radius:28px;background:#000;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,.25)"><img src="icon-192.png" alt="Tazvera" style="width:100%;height:100%;border-radius:28px;display:block"></div><b style="font-size:20px">Tazvera</b><div class="cap">'+T.v+'</div></div><p class="cap" style="text-align:left;line-height:1.6">'+T.i+'</p><div class="ttl" style="text-align:left;font-size:16px;margin:12px 0 4px">'+T.h+"</div>"+P(T.a[0],T.a[1])+P(T.b[0],T.b[1])+P(T.c[0],T.c[1])+P(T.d[0],T.d[1])+'<div class="ttl" style="text-align:left;font-size:16px;margin:14px 0 4px">'+T.w+"</div>"+P("",T.wt)+'<div class="ttl" style="text-align:left;font-size:16px;margin:14px 0 4px">'+T.n+"</div>"+P("",T.nt)+'<div class="xw">'+XL+'</div><div class="cap" style="margin-top:8px">'+T.f+"<br>© 2026 Tazvera</div><div class=\"cap\" style=\"margin-top:10px\"><a onclick=\"LG.open('p')\" style=\"color:var(--y);cursor:pointer\">"+(en?"Privacy policy":"गोपनीयता नीति")+"</a> · <a onclick=\"LG.open('t')\" style=\"color:var(--y);cursor:pointer\">"+(en?"Terms of use":"उपयोग की शर्तें")+"</a></div>"}]};
var SB=window.SB={r:function(){var p=PG[stk[stk.length-1]];$("stt").textContent=p[0];$("sbody").innerHTML=p[1]()},g:function(i){stk.push(i);SB.r()},back:function(){if(stk.length>1){stk.pop();SB.r();return true}return false},
th:function(m){ls.set("theme",m);applyTheme();SB.r()},bl:function(){ls.set("xt_bl",L("xt_bl",1)?0:1);SB.r()},
set:function(){setPin()},chg:function(){pinAsk("Enter current PIN",function(v){if(chk(v))setPin();else toast("Wrong PIN")})},rm:function(){pinAsk("Enter current PIN",function(v){if(chk(v)){ls.set("xt_pin","");toast("PIN removed");SB.r()}else toast("Wrong PIN")})}};
var sp=document.querySelector("#sheetSet .panel");sp.innerHTML='<div class="bkh"><button class="bkb" onclick="BK(this)" aria-label="Back">'+AR+'</button><div class="ttl" id="stt">Settings</div></div><div id="sbody"></div>';
openSettings=function(){stk=["root"];SB.r();$("sheetSet").classList.add("open")};

/* ---- Back buttons instead of Close ---- */
document.querySelectorAll(".shade .panel").forEach(function(p){if(p.querySelector(".bkh,.rc-h"))return;var t=p.querySelector(".ttl"),g=p.querySelector(".grab");if(g)g.remove();var h=document.createElement("div");h.className="bkh";h.innerHTML='<button class="bkb" onclick="BK(this)" aria-label="Back">'+AR+"</button>";if(t)h.appendChild(t);p.insertBefore(h,p.firstChild)});
document.querySelectorAll('.btn.ghost[onclick="closeAll()"]').forEach(function(b){b.remove()});
window.BK=function(b){BK.go(b.closest(".shade"))};
BK.go=function(s){if(!s)return;if(s.id==="sheetSet"&&SB.back())return;if(s.id==="sheetSend")stopScan();s.classList.remove("open")};
document.querySelectorAll(".shade").forEach(function(s){s.onclick=function(e){if(e.target===s)BK.go(s)}});

/* ---- Phone Back button = one step back ---- */
var ST=[],skip=0,pop=0;
var ob=new MutationObserver(function(ms){var n=0;ms.forEach(function(m){var e=m.target,o=e.classList.contains("open"),i=ST.indexOf(e);if(o&&i<0){ST.push(e);history.pushState({cp:1},"")}else if(!o&&i>=0){ST.splice(i,1);n++}});if(n&&!pop){skip=1;history.go(-n)}});
document.querySelectorAll(".shade").forEach(function(s){ob.observe(s,{attributes:true,attributeFilter:["class"]})});
window.addEventListener("popstate",function(){if(skip){skip=0;return}var t=ST[ST.length-1];if(!t)return;pop=1;var c=ST.length;BK.go(t);setTimeout(function(){pop=0;if(ST.length>=c&&ST.indexOf(t)>-1)history.pushState({cp:1},"")},0)});

/* ---- No WhatsApp: native share or copy ---- */
var sh=function(t){if(navigator.share)navigator.share({title:"Tazvera",text:t}).catch(function(){});else navigator.clipboard.writeText(t).then(function(){toast("Copied")})};
shareWhatsApp=function(){if(addr)sh(NETWORKS[currentNet].name+" address:\n"+addr)};
shareReqWA=function(){if(!addr)return;var n=NETWORKS[currentNet],a=$("reqAmt").value.trim(),t=$("reqNote").value.trim(),m="Tazvera payment request\n"+n.name+" · "+n.symbol+"\n";if(a)m+="Amount: "+a+" "+n.symbol+"\n";if(t)m+="Note: "+t+"\n";sh(m+"Address: "+addr)};
XT.fp=function(){if(confirm("Remove the PIN lock? Your wallet and funds are not affected.")){ls.set("xt_pin","");lk.style.display="none"}};(function(){var p=ls.get("xt_pin",""),ok=false;ok=(p==="v2");try{ok=ok||/^\d{6}cp$/.test(atob(p))}catch(e){}if(p&&!ok)ls.set("xt_pin","");if(lk)lk.style.display=ok?"flex":"none"})();
})();

/* ===== Part 1-C: logo, more networks, single Add-token entry ===== */
(function(){
var GL='<svg viewBox="0 0 512 512"><path d="M358.5 176A130 130 0 1 0 358.5 336" fill="none" stroke="#3B7BFF" stroke-width="64"/><circle cx="342" cy="256" r="34" fill="#3B7BFF"/></svg>';
document.querySelectorAll(".cmark").forEach(function(e){e.innerHTML=GL});
var sp=$("splash");if(sp){if(sessionStorage.getItem("cp_s"))sp.remove();else sessionStorage.setItem("cp_s","1")}
var X={polygon:{name:"Polygon",chainId:"0x89",chainIdDec:137,symbol:"POL",rpc:"https://polygon-rpc.com",explorer:"https://polygonscan.com"},base:{name:"Base",chainId:"0x2105",chainIdDec:8453,symbol:"ETH",rpc:"https://mainnet.base.org",explorer:"https://basescan.org"},optimism:{name:"Optimism",chainId:"0xa",chainIdDec:10,symbol:"ETH",rpc:"https://mainnet.optimism.io",explorer:"https://optimistic.etherscan.io"},arbitrum:{name:"Arbitrum One",chainId:"0xa4b1",chainIdDec:42161,symbol:"ETH",rpc:"https://arb1.arbitrum.io/rpc",explorer:"https://arbiscan.io"}};
Object.keys(X).forEach(function(k){NETWORKS[k]=X[k];var o=document.createElement("option");o.value=k;o.textContent=X[k].name;$("netSelect").appendChild(o)});
T.POL={bal:"0.0000",p:null};
var tb=$("btnTok");if(tb)tb.remove();
document.querySelector(".tabs").insertAdjacentHTML("beforeend",'<button class="addtok" aria-label="Add token" onclick="$(\'sheetTok\').classList.add(\'open\')"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>');
async function autoSym(){var a=$("tokAddr").value.trim();if(!/^0x[0-9a-fA-F]{40}$/.test(a)||!window.ethereum)return;try{var r=await ethereum.request({method:"eth_call",params:[{to:a,data:"0x95d89b41"},"latest"]}),h=r.slice(2),n=parseInt(h.slice(64,128),16),s=(h.slice(128,128+n*2).match(/../g)||[]).map(function(b){return String.fromCharCode(parseInt(b,16))}).join("");if(s&&!$("tokSym").value)$("tokSym").value=s}catch(e){}}
$("tokAddr").addEventListener("input",autoSym);
window.pasteTok=function(){navigator.clipboard.readText().then(function(t){$("tokAddr").value=t.trim();autoSym()}).catch(function(){toast("Paste manually")})};
window.saveTok=async function(){var a=$("tokAddr").value.trim(),s=($("tokSym").value||"").trim()||"TOKEN";if(!/^0x[0-9a-fA-F]{40}$/.test(a))return toast("Invalid contract address");var l=getCustoms();if(l.some(function(x){return x.addr.toLowerCase()===a.toLowerCase()}))return toast("Already added");if(!addr){await connectWallet();if(!addr)return}l.push({addr:a,symbol:s,time:Date.now()});ls.set("customTokens",l);buildList();await readCustomBalances();$("sheetTok").classList.remove("open");$("tokAddr").value="";$("tokSym").value="";toast(s+" added")};
})();

/* ===== Part 2: brand (blue/teal), splash only ===== */
(function(){var s=$("splash");if(!s||s.querySelector("svg"))return;s.innerHTML='<svg viewBox="0 0 512 512" width="150" height="150"><style>.tc{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:tzp .8s cubic-bezier(.2,1.4,.4,1) .1s forwards}.tk{transform-box:fill-box;transform-origin:center;opacity:0;animation:tzf .35s .75s forwards}.ts{transform-box:fill-box;transform-origin:top;transform:scaleY(0);animation:tzu .5s .95s ease-out forwards}@keyframes tzp{to{transform:scale(1)}}@keyframes tzf{to{opacity:1}}@keyframes tzu{to{transform:scaleY(1)}}</style><circle class="tc" cx="256" cy="256" r="236" fill="#FFD60A"/><circle class="tk" cx="256" cy="204" r="58" fill="#1C2230"/><path class="ts" d="M222 244H290L312 372H200Z" fill="#1C2230"/></svg><div class="sn" style="animation-delay:1.3s"><span style="color:#fff">tazvera</span></div>'})();

/* ===== Part 3: Services page (Binance-style grid) ===== */
(function(){
var P={send:'<path d="M7 17L17 7M9 7h8v8"/>',recv:'<path d="M17 7L7 17M15 17H7V9"/>',req:'<path d="M7 4h10a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1zM9 9h6M9 13h4"/>',tok:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',gas:'<path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M5 20h9M5 10h9M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/>',cv:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',csv:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',exp:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',al:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M5 4l-2 2M19 4l2 2"/>',sip:'<path d="M4 19V5M4 19h16M7 15l4-4 3 3 5-6"/>',emi:'<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',yld:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM10 21v-6h4v6"/>',frac:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',roi:'<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',comp:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',bs:'<circle cx="8" cy="12" r="4.5"/><circle cx="16" cy="12" r="4.5"/>',pl:'<path d="M4 17l5-5 4 4 7-8M15 8h5v5"/>',ra:'<path d="M5 21V5h9v16M14 10h5v11M8 9h3M8 13h3M8 17h3"/>',rr:'<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',ck:'<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',sc:'<path d="M6 21V4M6 5h11l-2 4 2 4H6"/>',ln:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19h15"/>',sec:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',qz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.1"/>',st:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',nt:'<path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 20h4"/>',tx:'<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'};
var ic=function(k){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+P[k]+"</svg>"};
var D=function(t,f){return function(){$("toolOut").textContent="";$("calcBox").style.display="none";$("sheetTools").classList.add("open");$("toolsTitle").textContent=t;f()}};
var C=function(k,t){return D(t,function(){showCalc(k)})},X=function(k){return function(){XT.go(k)}},H=function(f){return function(){closeAll();f()}};
var G=[["Crypto",[["Network fee","gas",function(){window.toolGas()}],["Price converter","cv",function(){window.toolConvert()}],["History CSV","csv",toolExport],["Block explorer","exp",openExplorer],["Price alarm","al",X("al")],["Address Book","user",function(){openBook()}]]],
["Calculators",[["SIP","sip",C("sip","SIP calculator")],["EMI","emi",C("emi","EMI calculator")],["Rental yield","yld",C("yield","Rental yield")],["Fractional","frac",C("frac","Fractional ownership")],["ROI","roi",C("roi","ROI calculator")],["Compound","comp",C("comp","Compound interest")],["Bill split","bs",X("bs")],["Profit / Loss","pl",X("pl")]]],
["RWA",[["My assets","ra",X("ra")],["Rent records","rr",X("rr")],["Docs checklist","ck",X("ck")],["Scam check","sc",X("sc")],["Learn RWA","ln",X("ln")],["Stablecoin guide","ln",function(){SG.open()}]]],
["Safety",[["Security tips","sec",X("sec")],["Crypto quiz","qz",X("qz")],["Daily streak","st",X("st")],["Notifications","nt",X("nt")],["History","tx",X("tx")],["Security checkup","sec",function(){SC.open()}]]],["Test",[["TZT faucet","drop",function(){FQ.open()}],["About TZT","ln",function(){HP.about()}]]],["Help",[["Help","qz",function(){HP.help()}],["Send feedback","nt",function(){FB.open()}],["Privacy policy","sec",function(){LG.open("p")}],["Terms of use","ln",function(){LG.open("t")}]]]];
function render(q){q=(q||"").toLowerCase();var h='<div class="svq"><input id="svqi" placeholder="Search services" autocomplete="off" oninput="SV.q(this.value)"></div>';if(!q)h+='<div class="svc-chips">'+G.map(function(g,i){return'<button onclick="SV.j('+i+')">'+g[0]+"</button>"}).join("")+"</div>";
G.forEach(function(g,gi){var t=g[1].filter(function(x){return x[0].toLowerCase().indexOf(q)>-1});if(!t.length)return;h+='<div class="svg-h" id="svg'+gi+'">'+g[0]+'</div><div class="svg-g">'+t.map(function(x){return'<button onclick="SV.go('+gi+","+g[1].indexOf(x)+')"><span class="svi">'+ic(x[1])+'</span><span class="svl">'+x[0]+"</span></button>"}).join("")+"</div>"});$("svcBody").innerHTML=h}
window.SV={q:function(v){render(v);var i=$("svqi");i.value=v;i.focus()},j:function(i){$("svg"+i).scrollIntoView({behavior:"smooth",block:"start"})},go:function(g,i){G[g][1][i][2]()}};
openTools=function(){render("");$("sheetSvc").classList.add("open")};
})();

/* ===== Part 4: assets (TZT), token send, scan icon, scrolling home ===== */
(function(){
var DEF={addr:"0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0",symbol:"TZT",chain:"shardeum-testnet",decimals:18};
var CPL='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#FFD60A"/><circle cx="50" cy="40" r="11.5" fill="#1C2230"/><path d="M43.5 48H56.5L61 73H39Z" fill="#1C2230"/></svg>';
window.CPLOGO=CPL;
var _g=getCustoms;getCustoms=function(){var l=_g();if(!l.some(function(x){return x.addr.toLowerCase()===DEF.addr.toLowerCase()}))l.unshift(Object.assign({},DEF));return l.filter(function(x){return!x.chain||x.chain===currentNet})};
var XA=window.XA={sel:null},nat=function(){return NETWORKS[currentNet].symbol};
function assets(){var a=[{s:nat(),n:1}];getCustoms().forEach(function(t){a.push({s:t.symbol||"TOKEN",t:t})});return a}
function cur(){var a=assets();for(var i=0;i<a.length;i++)if(a[i].s===XA.sel)return a[i];XA.sel=nat();return a[0]}
function alg(a){if(a.n){var u=LOGOS[a.s];return'<span class="nlg" style="background:#2B3A55">'+a.s[0]+(u?'<img src="'+u+'" alt="" onerror="this.remove()">':"")+"</span>"}if(a.s==="TZT"||a.s==="CPAY")return'<span class="nlg cpl">'+CPL+"</span>";return'<span class="nlg" style="background:#2B3A55">'+a.s[0]+"</span>"}
document.querySelectorAll("#sheetSend .xnc-slot,#sheetRecv .xnc-slot").forEach(function(s){var d=document.createElement("div");d.className="xas-slot";s.after(d)});
function upd2(){var c=cur(),n=NETWORKS[currentNet],s=function(i,v){var e=$(i);if(e)e.textContent=v};
document.querySelectorAll(".xas-slot").forEach(function(e){e.innerHTML='<div class="xnc" onclick="XA.open()">'+alg(c)+"<span>"+c.s+"</span></div>"});
s("sendTitle","Send "+c.s);s("sendUnit",c.s);s("recvTitle","Receive "+c.s);s("recvUnit",c.s);
s("recvCap","Only send "+c.s+" ("+n.name+") to this address. Other assets will be lost forever.");
var r=document.querySelector("#sheetSend .risk");if(r)r.textContent="Only send "+c.s+" on "+n.name+". Wrong token or network = permanent loss.";
var pa=$("payAmount");if(pa&&pa.parentNode)pa.parentNode.style.display=c.t?"none":""}
XA.open=function(){var cs=cur().s;$("xaList").innerHTML=assets().map(function(a){var b=a.n?(T[a.s]&&T[a.s].bal):a.t.bal;return'<div class="xni'+(a.s===cs?" on":"")+'" onclick="XA.pick(\''+a.s+'\')">'+alg(a)+"<div>"+a.s+"<small>"+(a.n?NETWORKS[currentNet].name+" · native":a.t.addr.slice(0,8)+"…"+a.t.addr.slice(-6))+'</small></div><span style="margin-left:auto;color:var(--mut)">'+(b!=null?b:"—")+"</span></div>"}).join("");$("xaSheet").classList.add("open")};
XA.pick=function(s){XA.sel=s;$("xaSheet").classList.remove("open");upd2();if($("sheetRecv").classList.contains("open"))drawQR()};
XA.tap=function(s){var a=assets().filter(function(x){return x.s===s})[0];if(!a){toast(s+": price only here")}else{XA.sel=s;openReceive()}};
XA.tok=function(){return cur().t||null};
var _cn=changeNetwork;changeNetwork=function(k){_cn(k);XA.sel=null;upd2()};
var _os=openSend;openSend=async function(){await _os.apply(this,arguments);upd2()};
var _or=openReceive;openReceive=async function(){await _or.apply(this,arguments);upd2();if(addr)drawQR()};
var _dq=drawQR;drawQR=function(){var e=$("payAmount"),v=e.value;if(XA.tok())e.value="";_dq();e.value=v};
var _ds=doSend;doSend=async function(){var t=XA.tok();if(!t)return _ds.apply(this,arguments);
var to=$("sendTo").value.trim(),amt=$("sendAmt").value.trim(),d=t.decimals||18,n=NETWORKS[currentNet];
if(!/^0x[0-9a-fA-F]{40}$/.test(to))return sendMsg("Invalid address");
if(!/^\d*\.?\d+$/.test(amt)||+amt<=0)return sendMsg("Invalid amount");
if(t.bal!=null&&+amt>+t.bal)return sendMsg("Insufficient "+t.symbol+" balance");
var p=amt.split("."),w=(BigInt(p[0]||"0")*10n**BigInt(d)+BigInt(((p[1]||"")+"0".repeat(d)).slice(0,d))).toString(16);
if(!confirm("Send "+amt+" "+t.symbol+" to\n"+to+"?"))return;
try{var c=await ethereum.request({method:"eth_chainId"});if(c!==n.chainId)return sendMsg("Wrong network");$("sendBtn").disabled=true;sendMsg("Confirm in wallet…");
var h=await ethereum.request({method:"eth_sendTransaction",params:[{from:addr,to:t.addr,data:"0xa9059cbb"+to.slice(2).toLowerCase().padStart(64,"0")+w.padStart(64,"0")}]});
sendMsg("Sent ✓ "+h.slice(0,12)+"…",true);logTx("out",amt,t.symbol,h);$("sendAmt").value="";setTimeout(readCustomBalances,6000);toast("Sent")}catch(e){sendMsg(e.code===4001?"Cancelled":(e.message||"Failed"))}
$("sendBtn").disabled=false};
/* scan icon (top right), shown only here */
var sb=$("soundBtn"),rb=document.createElement("div");rb.style.cssText="display:flex;gap:2px";sb.before(rb);rb.appendChild(sb);
rb.insertAdjacentHTML("beforeend",'<button class="snd" aria-label="Scan QR" onclick="homeScan()"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/></svg></button>');
window.homeScan=async function(){await openSend();if(addr)scanQR()};
/* balance, buttons and tabs scroll together with the token list */
var sc=document.querySelector(".scroll");[document.querySelector(".tabs"),document.querySelector(".acts"),document.querySelector(".hero")].forEach(function(e){if(e)sc.prepend(e)});
upd2();
})();

/* ===== Part 5: SHM price from several sources + price check ===== */
(function(){
var SRC=[["KuCoin",function(){return fetch("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SHM-USDT").then(function(r){return r.json()}).then(function(d){return+d.data.price})}],
["MEXC",function(){return fetch("https://api.mexc.com/api/v3/ticker/price?symbol=SHMUSDT").then(function(r){return r.json()}).then(function(d){return+d.price})}]];
var ok=function(x){return isFinite(x)&&x>0};
function med(a){a=a.slice().sort(function(x,y){return x-y});var m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2}
function all(){return Promise.all(SRC.map(function(s){return s[1]().then(function(v){return{n:s[0],v:v}}).catch(function(e){return{n:s[0],e:String(e&&e.message||e).slice(0,40)}})}))}
var last=0,_fp=fetchPrices;
fetchPrices=async function(){await _fp();if(Date.now()-last<60000)return;last=Date.now();
try{var r=await all(),v=r.filter(function(x){return ok(x.v)}).map(function(x){return x.v}),c=T.SHM.p;
if(v.length>=2||(v.length===1&&!c)){var m=med(v);T.SHM.p={usd:m,inr:m*fx,chg:(c&&c.chg)||0};lastOk=Date.now();paint()}}catch(e){}};
window.PC={run:async function(){var o=$("pcout");if(o)o.textContent="Checking…";var r=await all(),c=T.SHM.p;
if(o)o.innerHTML=r.map(function(x){return x.n+": "+(x.v!=null?"$"+x.v:"failed ("+x.e+")")}).join("<br>")+"<br>App shows: "+(c?"$"+c.usd:"—")}};
})();

/* ===== Part 6: per-network tokens, flat list, short history, MetaMask mobile link, server price ===== */
(function(){
var TZT="0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0".toLowerCase();
var DEFTOK=window.DEFTOK={"shardeum-testnet":[{addr:TZT,symbol:"TZT"},{addr:"0xeB24350E1117083d27ab0fef346D2d25f03E380a",symbol:"CPAY"}],
ethereum:[{addr:"0xdAC17F958D2ee523a2206206994597C13D831ec7",symbol:"USDT"},{addr:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",symbol:"USDC"},{addr:"0x6B175474E89094C44Da98b954EedeAC495271d0F",symbol:"DAI"}],
bsc:[{addr:"0x55d398326f99059fF775485246999027B3197955",symbol:"USDT"},{addr:"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",symbol:"USDC"}],
polygon:[{addr:"0xc2132D05D31c914a87C6611C10748AEb04B58e8F",symbol:"USDT"},{addr:"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",symbol:"USDC"}],
base:[{addr:"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",symbol:"USDC"}],
optimism:[{addr:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",symbol:"USDT"},{addr:"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",symbol:"USDC"}],
arbitrum:[{addr:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",symbol:"USDT"},{addr:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",symbol:"USDC"}]};
var TC={};
function raw(){return(ls.get("customTokens",[])||[]).map(function(x){return typeof x==="string"?{addr:x,symbol:"TOKEN"}:x}).filter(function(x){return x&&x.addr})}
getCustoms=function(){var seen={},out=[],mine=raw().filter(function(x){if(x.addr.toLowerCase()===TZT)return false;return!x.chain||x.chain===currentNet});
(DEFTOK[currentNet]||[]).concat(mine).forEach(function(t){var k=t.addr.toLowerCase();if(seen[k])return;seen[k]=1;var c=TC[currentNet+k]||{};out.push({addr:t.addr,symbol:t.symbol||"TOKEN",chain:currentNet,bal:c.bal,decimals:c.decimals||t.decimals||18})});return out};
readCustomBalances=async function(){if(!addr||!window.ethereum)return;var cid;try{cid=await ethereum.request({method:"eth_chainId"})}catch(e){return}
if(cid!==NETWORKS[currentNet].chainId){buildList();paint();return}
var l=getCustoms();for(var i=0;i<l.length;i++){var t=l[i];try{var r=await ethCall(t.addr,"0x70a08231"+addr.slice(2).toLowerCase().padStart(64,"0")),d=18;try{d=parseInt(await ethCall(t.addr,"0x313ce567"),16)||18}catch(e){}
TC[currentNet+t.addr.toLowerCase()]={bal:(Number(BigInt(r||"0x0"))/Math.pow(10,d)).toFixed(Math.min(6,d)),decimals:d}}catch(e){}}buildList();paint()};
window.saveTok=async function(){var a=$("tokAddr").value.trim(),s=($("tokSym").value||"").trim()||"TOKEN";if(!/^0x[0-9a-fA-F]{40}$/.test(a))return toast("Invalid contract address");
if(getCustoms().some(function(x){return x.addr.toLowerCase()===a.toLowerCase()}))return toast("Already added");if(!addr){await connectWallet();if(!addr)return}
var l=raw();l.push({addr:a,symbol:s,chain:currentNet,time:Date.now()});ls.set("customTokens",l);buildList();await readCustomBalances();$("sheetTok").classList.remove("open");$("tokAddr").value="";$("tokSym").value="";toast(s+" added")};
window.TOKB=function(s){var t=getCustoms().filter(function(x){return x.symbol===s})[0];return t&&t.bal!=null?fmt(+t.bal):null};
var _cn=changeNetwork;changeNetwork=function(k){_cn(k);buildList();paint();setTimeout(function(){readCustomBalances()},1500)};
/* history: 3 latest on Home, full list in History page */
renderTx=function(){var b=$("txHistory");if(!b)return;if(!txs.length){b.innerHTML='<div style="font-size:12px;color:var(--mut);text-align:center;padding:6px">No transactions yet</div>';return}
b.innerHTML=txs.slice(0,3).map(function(x){var d=new Date(x.time).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}),c=x.type==="in"?"var(--g)":"var(--r)";return'<div class="txi"><div><b>'+(x.type==="in"?"In":"Out")+" "+x.symbol+'</b><div style="color:var(--mut);font-size:10px">'+d+'</div></div><div style="color:'+c+';font-weight:800">'+(x.type==="in"?"+":"-")+x.amt+"</div></div>"}).join("")};
var va=document.querySelector(".txh span:last-child");if(va){va.textContent="View all";va.style.color="var(--y)";va.onclick=function(){XT.go("tx")}}
renderTx();
/* MetaMask on phone: open this app inside MetaMask browser */
var _cw=connectWallet;connectWallet=async function(){if(!window.ethereum&&/Android|iPhone|iPad/i.test(navigator.userAgent)){location.href="https://metamask.app.link/dapp/"+location.host+(location.pathname||"/");return}return _cw.apply(this,arguments)};
/* SHM price from our server (no browser blocking) */
var _fp=fetchPrices;fetchPrices=async function(){await _fp();try{var r=await fetch("/api/price");if(r.ok){var d=await r.json();if(d.usd>0){var c=T.SHM.p;T.SHM.p={usd:d.usd,inr:d.inr||d.usd*fx,chg:(c&&c.chg)||0};lastOk=Date.now();paint()}}}catch(e){}};
})();

/* ===== Part 7: all-network asset picker, Connect button in top bar, no Recent box ===== */
(function(){
var D=window.DEFTOK;
D.ethereum.push({addr:"0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",symbol:"SHIB"},{addr:"0x514910771AF9Ca656af840dff83E8264EcF986CA",symbol:"LINK"},{addr:"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",symbol:"WBTC"},{addr:"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",symbol:"UNI"},{addr:"0x6982508145454Ce325dDbE47a25d4ec3d2311933",symbol:"PEPE"});
D.bsc.push({addr:"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",symbol:"BTCB"},{addr:"0x2170Ed0880ac9A755fd29B2688956BD959F933F8",symbol:"ETH"},{addr:"0xbA2aE424d960c26247Dd6c32edC70B295c744C43",symbol:"DOGE"},{addr:"0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",symbol:"SHIB"},{addr:"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",symbol:"CAKE"},{addr:"0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",symbol:"XRP"});
function userTok(k){return(ls.get("customTokens",[])||[]).filter(function(x){return x&&x.addr&&x.chain===k&&x.addr.toLowerCase()!=="0xc75149e5c95a41b0a4c9e3378d5fc6aaac2cc5f0"})}
function logo(s){var u=LOGOS[s];return'<span class="nlg" style="background:#2B3A55">'+s[0]+(u?'<img src="'+u+'" alt="" onerror="this.remove()">':"")+"</span>"}
function rows(q){q=(q||"").toLowerCase();var cs=XA.sel,h="";Object.keys(NETWORKS).forEach(function(k){var n=NETWORKS[k],list=[{symbol:n.symbol,n:1}].concat(D[k]||[],userTok(k)),here=k===currentNet,
out=list.filter(function(t){return!q||t.symbol.toLowerCase().indexOf(q)>-1||n.name.toLowerCase().indexOf(q)>-1});if(!out.length)return;
h+='<div class="xnh">'+n.name+(k==="shardeum-testnet"?" · test":"")+"</div>"+out.map(function(t){var b="";if(here){if(t.n)b=T[t.symbol]&&T[t.symbol].bal;else{var c=getCustoms().filter(function(x){return x.addr.toLowerCase()===t.addr.toLowerCase()})[0];b=c&&c.bal}}
var on=here&&XA.sel===t.symbol;return'<div class="xni'+(on?" on":"")+'" onclick="XA.pickN(\''+k+"','"+t.symbol+'\')">'+((t.symbol==="TZT"||t.symbol==="CPAY")?'<span class="nlg cpl">'+(t.symbol==="TZT"?TZLOGO:CPLOGO)+"</span>":logo(t.symbol))+"<div>"+t.symbol+"<small>"+(t.n?"native coin":t.addr.slice(0,8)+"…"+t.addr.slice(-6))+'</small></div><span style="margin-left:auto;color:var(--mut)">'+(b!=null&&b!==""?b:"")+"</span></div>"}).join("")});
$("xaRows").innerHTML=h||'<div class="cap">No match</div>'}
XA.open=function(){$("xaList").innerHTML='<div class="svq"><input id="xaq" placeholder="Search token or network" autocomplete="off" oninput="XA.q(this.value)"></div><div id="xaRows"></div>';rows("");$("xaSheet").classList.add("open")};
XA.q=function(v){rows(v)};
XA.pickN=function(net,sym){if(net!==currentNet)changeNetwork(net);XA.pick(sym)};
/* Connect button next to the scan icon (same top row) */
var chip=$("chip"),top=document.querySelector(".top");if(chip&&top){top.insertBefore(chip,top.lastElementChild);var t=$("chipText");if(t&&!window.addr&&t.textContent==="MetaMask")t.textContent="Connect"}
})();

/* ===== Part 8: TZT faucet page (testnet) ===== */
(function(){
var CP="0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0";
function pad(a){return a.slice(2).toLowerCase().padStart(64,"0")}
window.FQ={
fa:function(){return ls.get("faucet","")||"0x02b9e35cd82E5c781097D2188B4334c2485438bC"},
open:function(){var t=$("sheetTools"),b=$("calcBox");$("toolOut").textContent="";$("toolsTitle").textContent="TZT faucet";b.style.display="block";t.classList.add("open");FQ.draw()},
draw:function(){var b=$("calcBox");if(currentNet!=="shardeum-testnet"){b.innerHTML='<p style="margin:6px 0">The faucet works on Shardeum Testnet only.</p><button class="btn" onclick="changeNetwork(\'shardeum-testnet\');FQ.draw()">Switch to Shardeum Testnet</button>';return}
b.innerHTML='<p style="margin:6px 0;text-align:left">Get <b>100 free test TZT</b> (no value) once every 24 hours.</p><input id="fqa" placeholder="Faucet contract address 0x…" value="'+FQ.fa()+'" spellcheck="false" style="width:100%;margin:6px 0;padding:12px;border-radius:12px;border:1px solid var(--ln);background:var(--bg);color:inherit;font-size:13px"><button class="btn ghost" onclick="FQ.save()">Save address</button><div id="fqi" class="cap" style="margin:8px 0"></div><button class="btn" onclick="FQ.claim()">Claim 100 TZT</button>';FQ.info()},
save:function(){var a=$("fqa").value.trim();if(!/^0x[0-9a-fA-F]{40}$/.test(a))return toast("Invalid address");ls.set("faucet",a);toast("Saved");FQ.info()},
info:async function(){var el=$("fqi"),a=FQ.fa();if(!el||!a||!window.ethereum)return;try{var r=await ethCall(CP,"0x70a08231"+pad(a));el.textContent="Faucet balance: "+fmt(Number(BigInt(r||"0x0"))/1e18)+" TZT"}catch(e){el.textContent=""}},
claim:async function(){var a=FQ.fa();if(!/^0x[0-9a-fA-F]{40}$/.test(a))return toast("Save the faucet address first");if(!addr){await connectWallet();if(!addr)return}
try{var c=await ethereum.request({method:"eth_chainId"});if(c!==NETWORKS["shardeum-testnet"].chainId)return toast("Switch wallet to Shardeum Testnet");
toast("Confirm in wallet…");var h=await ethereum.request({method:"eth_sendTransaction",params:[{from:addr,to:a.toLowerCase(),data:"0x4e71d92d"}]});toast("Claimed ✓ — balance updates soon");logTx("in","100","TZT",h);setTimeout(function(){readCustomBalances();FQ.info()},7000)}
catch(e){toast(e.code===4001?"Cancelled":"Not possible now (24h limit or faucet empty)")}}};
})();

/* ===== Part 10: in-app wallet screens (create / import / unlock / recovery phrase) ===== */
(function(){
function ph(id){return'<div class="pinw" onclick="$(\''+id+'\').focus()"><div class="pbs"><i></i><i></i><i></i><i></i><i></i><i></i></div><input id="'+id+'" class="pin-h" type="password" inputmode="numeric" maxlength="6" autocomplete="off" oninput="PB(this)"></div>'}
var B=function(h){$("wsBody").innerHTML=h},T=function(t){var e=document.querySelector("#sheetWallet .ttl");if(e)e.textContent=t},sh=function(o){$("sheetWallet").classList[o?"add":"remove"]("open")};
var busy=function(m){B('<div class="cap" style="padding:40px 0;text-align:center">'+m+"</div>")};
function ask(title,cb){T(title);B('<div style="padding:30px 0;text-align:center">'+ph("wsPin")+"</div>");PB.h.wsPin=cb;setTimeout(function(){var i=$("wsPin");if(i)i.focus()},150)}
function words(p){return'<div class="wsw">'+p.split(" ").map(function(w,i){return"<span><i>"+(i+1)+"</i>"+w+"</span>"}).join("")+"</div>"}
var WS=window.WS={
open:function(){T("Set up your wallet");B('<p class="cap" style="text-align:left">No MetaMask needed. Your wallet is stored only on this phone. This is a <b>test wallet</b> for Shardeum Testnet.</p><button class="btn" onclick="WS.c1()">Create new wallet</button><button class="btn ghost" onclick="WS.imp()">I already have 12 words</button>');sh(1)},
c1:function(){ask("Choose a 6-digit PIN",function(a){ask("Confirm PIN",function(b){if(a!==b){toast("PINs did not match");return WS.c1()}busy("Creating your wallet… (a few seconds)");CPW.create(a).then(function(p){WS.done(p)}).catch(function(){toast("Could not create wallet");WS.open()})})})},
imp:function(){T("Use your 12 words");B('<textarea id="wsT" rows="3" placeholder="word1 word2 … word12" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--ln);background:var(--bg);color:inherit;font-size:15px"></textarea><div class="cap" style="text-align:left;margin:8px 0">Only use a test wallet here. Never type the words of a wallet that holds real money.</div><button class="btn" onclick="WS.imp2()">Continue</button>')},
imp2:function(){var t=$("wsT").value;if(t.trim().split(/\s+/).length!==12)return toast("Enter exactly 12 words");ask("Choose a 6-digit PIN",function(a){ask("Confirm PIN",function(b){if(a!==b){toast("PINs did not match");return WS.imp()}busy("Saving…");CPW.imp(t,a).then(function(){sh(0);toast("Wallet ready");connectWallet()}).catch(function(){toast("Invalid 12 words");WS.imp()})})})},
done:function(p){T("Write down your 12 words");B('<div class="risk">Write these 12 words on paper, in order. Anyone with them can take your coins. If you lose them and your phone, the wallet cannot be recovered. Never share them or take a screenshot.</div>'+words(p)+'<label class="xt-o" style="display:block;margin:12px 0"><input type="checkbox" id="wsOk" style="width:auto;margin-right:8px">I have written them on paper</label><button class="btn" onclick="WS.fin()">Continue</button>')},
fin:function(){if(!$("wsOk").checked)return toast("Please write them down first");sh(0);toast("Wallet created");connectWallet()},
unlock:function(){return new Promise(function(res){sh(1);ask("Enter wallet PIN",function(p){busy("Unlocking…");CPW.unlock(p).then(function(){sh(0);res(true)}).catch(function(){toast("Wrong PIN");WS.unlock().then(res)})})})},
show:function(){sh(1);ask("Enter wallet PIN",function(p){busy("Checking…");CPW.phrase(p).then(function(ph){T("Your 12 words");B('<div class="risk">Do not share. Do not screenshot.</div>'+words(ph)+'<button class="btn ghost" onclick="WS.hide()">Done</button>')}).catch(function(){toast("Wrong PIN");sh(0)})})},
hide:function(){sh(0)}};
var _cw=connectWallet;connectWallet=async function(){var e=window.ethereum;if(e&&e.isCpWallet){if(!CPW.has()){WS.open();return}if(!CPW.unlocked()){var ok=await WS.unlock();if(!ok)return}}return _cw.apply(this,arguments)};
})();

/* ===== Part 12: show the network fee, check balance before sending ===== */
(function(){
var m=$("sendMsg"),el=document.createElement("div");el.id="sendFee";el.className="cap";el.style.cssText="text-align:left;margin:-2px 2px 8px";if(m)m.parentNode.insertBefore(el,m);
async function fee(){try{var g=await ethereum.request({method:"eth_gasPrice"});return Number(BigInt(g))*(XA.tok()?70000:21000)/1e18}catch(e){return null}}
async function show(){var f=await fee(),s=NETWORKS[currentNet].symbol,p=T[s]&&T[s].p,r=p&&f!=null?rate(p)*f:null;el.textContent=f==null?"":"Network fee: about "+(f>=10?f.toFixed(0):f.toFixed(2))+" "+s+(r?" ("+pfx()+(r<1?r.toFixed(2):fmt(r))+")":"")+". It goes to the network, not to Tazvera."}
var _os=openSend;openSend=async function(){await _os.apply(this,arguments);show()};
var _pk=XA.pick;XA.pick=function(s){_pk(s);show()};
var _ds=doSend;doSend=async function(){var f=await fee(),n=NETWORKS[currentNet].symbol,b=parseFloat((T[n]||{}).bal)||0,a=parseFloat($("sendAmt").value)||0;
if(f!=null){var need=XA.tok()?f:a+f;if(need>b)return sendMsg("Not enough "+n+". You need about "+need.toFixed(1)+" "+n+", including the network fee of about "+f.toFixed(1)+".")}
return _ds.apply(this,arguments)};
})();

/* ===== Part 13: clear faucet messages + fee-free "Get 100 TZT" (server pays the fee) ===== */
(function(){
var _d=FQ.draw;FQ.draw=function(){_d();var b=$("calcBox");if(currentNet==="shardeum-testnet")b.insertAdjacentHTML("afterbegin",'<button class="btn" style="margin-bottom:8px" onclick="FQ.air()">Get 100 TZT (free, no fee)</button><div class="cap" style="margin-bottom:12px">Or claim on the blockchain below. That needs SHM for the network fee.</div>')};
FQ.air=async function(){if(!addr){await connectWallet();if(!addr)return}toast("Sending…");
try{var r=await fetch("/api/airdrop?address="+addr),d=await r.json();if(d.ok){toast("Sent: 100 TZT");logTx("in","100","TZT",d.hash);setTimeout(readCustomBalances,8000)}else toast(d.error||"Not possible now",4000)}catch(e){toast("Network problem. Try again.")}};
var _c=FQ.claim;FQ.claim=async function(){var a=FQ.fa();if(/^0x[0-9a-fA-F]{40}$/.test(a)&&addr&&window.ethereum){try{
var g=await ethereum.request({method:"eth_estimateGas",params:[{from:addr,to:a.toLowerCase(),data:"0x4e71d92d"}]}),gp=await ethereum.request({method:"eth_gasPrice"}),f=Number(BigInt(g)*BigInt(gp))/1e18,b=parseFloat(T.SHM.bal)||0;
if(f>b)return toast("Not enough SHM for the fee. You need about "+f.toFixed(0)+" SHM, you have "+b.toFixed(0)+".",6000)}
catch(e){var m=String(e&&(e.message||e));if(/come back later/i.test(m))return toast("You already claimed in the last 24 hours.",4000);if(/empty/i.test(m))return toast("The faucet is empty.",4000)}}
return _c.apply(this,arguments)};
})();

/* ===== Part 16: Help page, About TZT page, "Forgot PIN" on wallet unlock ===== */
(function(){
var CP="0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0";
var Q={hi:[
["Tazvera क्या है?","एक सरल वॉलेट। अभी यह सिर्फ़ टेस्ट (Testnet) पर चलता है, यानी इसमें असली पैसे नहीं हैं। हम इसे सीखने और जाँचने के लिए चला रहे हैं।"],
["वॉलेट कैसे बनाएँ?","होम पर ऊपर \"Set up wallet\" दबाइए, फिर Create new wallet। 6 अंकों का PIN चुनिए और दिखने वाले 12 शब्द कागज़ पर लिख लीजिए।"],
["12 शब्द क्या हैं?","ये आपके वॉलेट की पक्की बैकअप चाबी हैं। इन्हें सिर्फ़ कागज़ पर लिखिए। किसी को मत बताइए, फोटो मत खींचिए। कोई \"सपोर्ट\" भी इन्हें कभी नहीं माँगेगा। ये और फ़ोन दोनों खो गए तो वॉलेट वापस नहीं मिलेगा।"],
["PIN भूल गया तो?","PIN वाली स्क्रीन के नीचे \"Forgot PIN\" दबाइए और अपने 12 शब्दों से वॉलेट वापस बनाइए। 12 शब्द नहीं हैं तो वॉलेट वापस नहीं मिल सकता।"],
["मुफ़्त TZT कैसे लें?","Home → Get TZT → \"Get 100 TZT (free, no fee)\" दबाइए। इसमें आपको कोई फ़ीस नहीं देनी पड़ती।"],
["TZT की कीमत क्या है?","कोई कीमत नहीं। यह सिर्फ़ टेस्ट टोकन है।"],
["फ़ीस (Network fee) क्या है?","ब्लॉकचेन पर हर लेनदेन के लिए नेटवर्क को थोड़ी फ़ीस देनी पड़ती है। यह नेटवर्क के सिक्के में लगती है (यहाँ SHM)। यह Tazvera को नहीं मिलती।"],
["भेजते समय क्या ध्यान रखें?","पता और नेटवर्क दो बार जाँचिए। गलत पते या गलत नेटवर्क पर भेजा सिक्का वापस नहीं आता।"],
["क्या मेरा पैसा सुरक्षित है?","आपकी चाबी सिर्फ़ आपके फ़ोन में PIN के ताले में रहती है, हम उसे नहीं रखते। फिर भी अभी असली पैसे इसमें मत रखिए, यह टेस्ट स्तर है।"],
["कौन से नेटवर्क चलते हैं?","ऐप का अपना वॉलेट अभी सिर्फ़ Shardeum Testnet पर चलता है। बाकी नेटवर्क के लिए MetaMask जोड़ सकते हैं।"],
["12 शब्द दोबारा कहाँ देखूँ?","Settings → Security → बैकअप शब्द (12) (PIN डालकर)। देखते समय आसपास कोई न हो।"]],
en:[
["What is Tazvera?","A simple wallet. For now it runs on a test network (Testnet), so it holds no real money. We run it to learn and test."],
["How do I create a wallet?","Tap \"Set up wallet\" at the top of Home, then Create new wallet. Choose a 6-digit PIN and write the 12 words on paper."],
["What are the 12 words?","They are your wallet's backup key. Write them on paper only. Never share them or take a photo. No \"support\" will ever ask for them. If you lose them and your phone, the wallet cannot be recovered."],
["I forgot my PIN","On the PIN screen tap \"Forgot PIN\" and restore the wallet with your 12 words. Without the 12 words the wallet cannot be recovered."],
["How do I get free TZT?","Home → Get TZT → \"Get 100 TZT (free, no fee)\". You pay no fee."],
["What is TZT worth?","Nothing. It is a test token only."],
["What is the network fee?","Every blockchain transaction needs a small fee paid to the network, in the network's own coin (SHM here). It does not go to Tazvera."],
["What should I check before sending?","Check the address and the network twice. Coins sent to a wrong address or network cannot be recovered."],
["Is my money safe?","Your key stays only on your phone, locked by your PIN. We do not keep it. Still, do not keep real money here yet. This is a test stage."],
["Which networks work?","The in-app wallet works on Shardeum Testnet only for now. You can connect MetaMask for other networks."],
["Where can I see my 12 words again?","Settings → Security → Backup words (12) (after entering your PIN). Make sure nobody is watching."]]};
function open(t,h){$("toolOut").textContent="";$("toolsTitle").textContent=t;var b=$("calcBox");b.style.display="block";$("sheetTools").classList.add("open");b.innerHTML=h}
function L(){return lang==="en"?"en":"hi"}
window.HP={
help:function(){var l=L();open(l==="en"?"Help":"मदद",Q[l].map(function(x){return'<details class="hq"><summary>'+x[0]+"</summary><p>"+x[1]+"</p></details>"}).join(""))},
about:function(){var l=L(),r=function(a,b){return'<div class="xt-o" style="display:flex;justify-content:space-between;gap:10px;text-align:left"><span style="color:var(--mut)">'+a+'</span><b style="text-align:right;word-break:break-all">'+b+"</b></div>"};var ex=NETWORKS["shardeum-testnet"].explorer+"/address/"+CP+"?tab=contract";
open("About TZT",r(l==="en"?"Name":"नाम","Tazvera Test (TZT)")+r(l==="en"?"Network":"नेटवर्क","Shardeum Testnet")+r("Decimals","18")+r(l==="en"?"Maximum supply":"अधिकतम सप्लाई","500,000,000")+r(l==="en"?"First minted":"शुरू में बने","1,000,000")+r(l==="en"?"Contract":"कॉन्ट्रैक्ट",CP.slice(0,10)+"…"+CP.slice(-8))+r(l==="en"?"Source code":"सोर्स कोड",l==="en"?"On the explorer":"एक्सप्लोरर पर")+'<button class="btn ghost" onclick="navigator.clipboard.writeText(\''+CP+'\');toast(\'Copied\')">'+(l==="en"?"Copy contract address":"कॉन्ट्रैक्ट पता कॉपी करें")+'</button><a class="btn ghost" style="display:block;text-decoration:none;text-align:center" target="_blank" rel="noopener" href="'+ex+'">'+(l==="en"?"Open on the explorer":"एक्सप्लोरर पर खोलें")+'</a><p class="cap" style="text-align:left">'+(l==="en"?"Test token with no monetary value. The owner can pause the token and can mint more up to the maximum supply. This is for testing only.":"टेस्ट टोकन, कोई कीमत नहीं। मालिक टोकन को रोक सकता है और अधिकतम सप्लाई तक और बना सकता है। यह सिर्फ़ जाँच के लिए है।")+"</p>")}};
var _u=WS.unlock;WS.unlock=function(){var p=_u(),b=$("wsBody");if(b&&!b.querySelector(".forgot"))b.insertAdjacentHTML("beforeend",'<a class="forgot" onclick="WS.forgot()">Forgot PIN? Restore with 12 words</a>');return p};
WS.forgot=function(){if(confirm("This removes the wallet from this phone. You can restore it only with your 12 words. Continue?")){CPW.remove();WS.open()}};
})();

/* ===== Part 18: security checkup, new-address warning, backup reminder, feedback ===== */
(function(){
var tx=function(e,h){return lang==="en"?e:h};
var KN=function(){return ls.get("known",[])};
var inapp=function(){return!!(window.CPW&&window.ethereum&&window.ethereum.isCpWallet)};
function page(t,h){$("toolOut").textContent="";$("toolsTitle").textContent=t;var b=$("calcBox");b.style.display="block";$("sheetTools").classList.add("open");b.innerHTML=h}
window.SC={
open:function(){SC.draw()},
draw:function(){var has=inapp()&&CPW.has(),ext=(!has&&typeof addr!=="undefined"&&!!addr),bk=!!ls.get("backup_ok",0),pin=!!ls.get("xt_pin","");
var row=function(ok,l,btns){return'<div class="xt-o" style="display:flex;gap:10px;align-items:center;text-align:left"><span style="color:var(--'+(ok?"g":"r")+');font-size:20px;width:22px">'+(ok?"✓":"✕")+'</span><span style="flex:1">'+l+"</span></div>"+(btns||"")};
var bt=function(l,f){return'<button class="btn ghost" style="margin-top:6px" onclick="'+f+'">'+l+"</button>"};
page(tx("Security checkup","सुरक्षा जाँच"),row(has||ext,tx("Wallet is set up","वॉलेट बना हुआ है"))+(ext?row(true,tx("Your keys stay in your wallet app (for example MetaMask). Keep that app's 12 words on paper.","आपकी चाबी आपके वॉलेट ऐप (जैसे MetaMask) में रहती है। उस ऐप के 12 शब्द कागज़ पर रखिए।")):row(bk,tx("12 words written on paper","12 शब्द कागज़ पर लिखे हैं"),bk?"":bt(tx("Show my 12 words","मेरे 12 शब्द दिखाओ"),"WS.show()")+bt(tx("I wrote them on paper","मैंने कागज़ पर लिख लिए"),"SC.mark()")))+row(pin,tx("App PIN lock is on","ऐप PIN लॉक चालू है"),pin?"":bt(tx("Turn on PIN lock","PIN लॉक चालू करें"),"closeAll();openSettings();SB.g('sec')"))+(has?row(!CPW.unlocked(),tx("Wallet is locked right now","वॉलेट अभी लॉक है"),CPW.unlocked()?bt(tx("Lock wallet now","वॉलेट अभी लॉक करें"),"CPW.lock();SC.draw()"):""):"")+'<p class="cap" style="text-align:left;margin-top:12px">'+tx("Tip: never share your 12 words or PIN with anyone. No support person will ask for them.","सुझाव: अपने 12 शब्द या PIN किसी को मत बताइए। कोई सपोर्ट वाला इन्हें कभी नहीं माँगेगा।")+"</p>")},
mark:function(){if(confirm(tx("Have you really written all 12 words on paper?","क्या आपने सच में 12 शब्द कागज़ पर लिख लिए हैं?"))){ls.set("backup_ok",1);SC.draw();bn()}}};
function bn(){var s=document.querySelector(".scroll"),b=$("bkBanner"),need=inapp()&&CPW.has()&&!ls.get("backup_ok",0);
if(!need){if(b)b.remove();return}if(b||!s)return;
s.insertAdjacentHTML("afterbegin",'<div id="bkBanner" onclick="SC.open()" style="margin:6px 0 4px;padding:12px 14px;border-radius:14px;background:rgba(240,80,110,.12);border:1px solid rgba(240,80,110,.4);font-weight:700;font-size:13px;text-align:left;cursor:pointer">'+tx("Write down your 12 words. Tap here.","अपने 12 शब्द कागज़ पर लिख लीजिए। यहाँ दबाइए।")+"</div>")}
setInterval(bn,3000);bn();
if(window.WS){var _f=WS.fin;WS.fin=function(){var ok=$("wsOk")&&$("wsOk").checked;_f();if(ok){ls.set("backup_ok",1);bn()}}}
if(window.CPW){var _i=CPW.imp;CPW.imp=function(){return _i.apply(this,arguments).then(function(r){ls.set("backup_ok",1);bn();return r})}}
/* warn before the first send to a new address */
var pend=null,_ds=doSend;doSend=async function(){var to=($("sendTo").value||"").trim().toLowerCase();
if(/^0x[0-9a-f]{40}$/.test(to)){
if(to==="0xc75149e5c95a41b0a4c9e3378d5fc6aaac2cc5f0"||to==="0x02b9e35cd82e5c781097d2188b4334c2485438bc")return sendMsg(tx("Do not send coins to a token or faucet address. They would be lost.","टोकन या Faucet के पते पर सिक्के मत भेजिए। वे खो जाएँगे।"));
if(addr&&to===addr.toLowerCase())return sendMsg(tx("This is your own address.","यह आपका अपना पता है।"));
if(KN().indexOf(to)<0){if(!confirm(tx("You are sending to this address for the first time. Check every letter:\n","आप इस पते पर पहली बार भेज रहे हैं। हर अक्षर ध्यान से जाँचिए:\n")+to+"\n\n"+tx("Continue?","आगे बढ़ें?")))return;pend=to}}
return _ds.apply(this,arguments)};
var _lt=logTx;logTx=function(t){if(t==="out"&&pend){var k=KN();k.push(pend);ls.set("known",k.slice(-200));pend=null}return _lt.apply(this,arguments)};
/* feedback */
window.FB={open:function(){page(tx("Send feedback","फीडबैक भेजें"),'<textarea id="fbT" rows="5" placeholder="'+tx("What went wrong, or what would you like?","क्या दिक्कत आई, या आपको क्या चाहिए?")+'" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--ln);background:var(--bg);color:inherit;font-size:15px"></textarea><p class="cap" style="text-align:left">'+tx("Never write your 12 words, PIN or keys here.","यहाँ अपने 12 शब्द, PIN या चाबी कभी मत लिखिए।")+'</p><button class="btn" onclick="FB.send()">'+tx("Copy and open X","कॉपी करें और X खोलें")+"</button>")},
send:function(){var t=($("fbT").value||"").trim();if(!t)return toast(tx("Write something first","पहले कुछ लिखिए"));var r=t+"\n\n— Tazvera v5 · "+NETWORKS[currentNet].name+" · "+lang;
navigator.clipboard.writeText(r).then(function(){toast(tx("Copied. Paste it in a message to us on X.","कॉपी हो गया। X पर हमें संदेश में चिपकाइए।"),4500)});window.open("https://x.com/TazveraApp","_blank")}};
})();

/* ===== Part 19: friendly error messages ===== */
(function(){
var tx=function(e,h){return lang==="en"?e:h};
function nice(m){m=String(m||"");if(/insufficient funds|INSUFFICIENT_FUNDS/i.test(m))return tx("Not enough coins to pay the network fee. Add a little more and try again.","नेटवर्क फ़ीस भरने के लिए सिक्के कम हैं। थोड़े और जोड़कर दोबारा कोशिश कीजिए।");
if(/user rejected|ACTION_REJECTED|denied/i.test(m))return tx("You cancelled the transaction.","आपने लेनदेन रद्द कर दिया।");
if(/network|timeout|fetch|SERVER_ERROR|could not coalesce/i.test(m)&&m.length>60)return tx("Network problem. Please try again in a moment.","नेटवर्क में दिक्कत है। थोड़ी देर बाद दोबारा कोशिश कीजिए।");
if(m.length>140)return tx("Could not send. Please check the details and try again.","भेजा नहीं जा सका। जानकारी जाँचकर दोबारा कोशिश कीजिए।");return m}
var _sm=sendMsg;sendMsg=function(t,ok){return _sm.call(this,ok?t:nice(t),ok)};
})();

/* ===== Part 20: Hindi everywhere (English + Hindi only), square QR scanner ===== */
(function(){
var E={"(starts with 0x). This is not your wallet address.": "(0x से शुरू)। यह आपका वॉलेट पता नहीं है।", "0x address": "0x पता", "0x recipient address": "0x पाने वाले का पता", "1. What does 'non-custodial' mean?": "1. 'नॉन-कस्टोडियल' का क्या मतलब है?", "App holds your keys": "ऐप आपकी चाबी अपने पास रखता है", "You hold your keys": "चाबी आपके पास रहती है", "Bank holds funds": "बैंक के पास पैसा रहता है", "100 free test TZT": "100 मुफ़्त टेस्ट TZT", "Get": "पाएँ", "(no value) once every 24 hours.": "(कोई कीमत नहीं) हर 24 घंटे में एक बार।", "= Real World Assets (property, gold, etc.) represented as digital tokens.": "= असली दुनिया की संपत्ति (ज़मीन, सोना आदि) जो डिजिटल टोकन के रूप में दिखाई जाती है।", "Above ≥": "ऊपर ≥", "Below ≤": "नीचे ≤", "Add": "जोड़ें", "Add alarm": "अलार्म जोड़ें", "Add token": "टोकन जोड़ें", "Address Book": "पतों की किताब", "Always verify documents and legality before investing.": "निवेश से पहले दस्तावेज़ और कानूनी स्थिति ज़रूर जाँचिए।", "Amount": "रकम", "Amount (optional)": "रकम (वैकल्पिक)", "Appearance": "रूप-रंग", "Asked to pay to a personal account": "निजी खाते में पैसे भेजने को कहा जाता है", "Asset name": "संपत्ति का नाम", "Auto": "अपने आप", "Auto-lock after": "इतनी देर बाद अपने आप लॉक", "Auto-lock minutes (now 2)": "अपने आप लॉक (मिनट, अभी 2)", "Automatic (follows phone)": "अपने आप (फ़ोन के हिसाब से)", "Back": "पीछे", "Backup (show data)": "बैकअप (डेटा दिखाएँ)", "Backup / restore data": "बैकअप / डेटा वापस लाएँ", "Benefits:": "फ़ायदे:", "Bill Split": "बिल बाँटें", "Bill split": "बिल बाँटें", "Block explorer": "ब्लॉक एक्सप्लोरर", "Blur screen in background": "पीछे जाने पर स्क्रीन धुँधली करें", "Blur: On": "धुँधलापन: चालू", "Buy price ₹ per coin": "ख़रीद कीमत ₹ प्रति सिक्का", "CALCULATORS (REAL MATH)": "कैलकुलेटर (असली गणित)", "TZT faucet": "TZT फ़ॉसेट", "CRYPTO": "क्रिप्टो", "Calculators": "कैलकुलेटर", "Check SHM price sources": "SHM कीमत के स्रोत जाँचें", "Choose a 6-digit PIN": "6 अंकों का PIN चुनिए", "Claim 100 TZT": "100 TZT लें (ब्लॉकचेन से)", "Clear all": "सब हटाएँ", "Clear all history": "पूरा इतिहास हटाएँ", "Compound": "चक्रवृद्धि", "Compound Interest": "चक्रवृद्धि ब्याज", "Connect": "कनेक्ट", "Continue": "आगे बढ़ें", "Contract": "कॉन्ट्रैक्ट", "Contract address 0x…": "कॉन्ट्रैक्ट पता 0x…", "Copy": "कॉपी", "Copy Request Link": "माँग की लिंक कॉपी करें", "Copy payment link": "भुगतान लिंक कॉपी करें", "Create new wallet": "नया वॉलेट बनाएँ", "Crypto": "क्रिप्टो", "Crypto Assets": "क्रिप्टो एसेट्स", "Crypto Quiz": "क्रिप्टो क्विज़", "Crypto quiz": "क्रिप्टो क्विज़", "Currency": "मुद्रा", "Daily Streak": "रोज़ की गिनती", "Daily streak": "रोज़ की गिनती", "Dark": "गहरा", "Data & help": "डेटा और मदद", "Docs Checklist": "दस्तावेज़ सूची", "Docs checklist": "दस्तावेज़ सूची", "EMI Calculator": "EMI कैलकुलेटर", "Enter PIN": "PIN डालिए", "Enter amount → show QR. Customer pays exactly this amount.": "रकम डालिए → QR दिखेगा। ग्राहक ठीक इतनी रकम देगा।", "Estimate network fee": "नेटवर्क फ़ीस का अंदाज़ा", "Export history CSV": "इतिहास CSV में निकालें", "Faucet contract address 0x…": "फ़ॉसेट कॉन्ट्रैक्ट पता 0x…", "Flat": "फ़्लैट", "Forgot PIN?": "PIN भूल गए?", "Forgot PIN? Restore with 12 words": "PIN भूल गए? 12 शब्दों से वापस लाएँ", "Fractional": "आंशिक", "Fractional Ownership": "आंशिक स्वामित्व", "Fractional ownership": "आंशिक स्वामित्व", "Get 100 TZT (free, no fee)": "100 TZT पाएँ (मुफ़्त, कोई फ़ीस नहीं)", "Gold token": "सोने का टोकन", "Help": "मदद", "Hide balance": "बैलेंस छिपाएँ", "History": "इतिहास", "History CSV": "इतिहास CSV", "History Search": "इतिहास खोजें", "Home": "होम", "I already have 12 words": "मेरे पास 12 शब्द पहले से हैं", "I have written them on paper": "मैंने इन्हें कागज़ पर लिख लिया है", "Language": "भाषा", "Language & display": "भाषा और दिखावट", "Learn RWA": "RWA सीखें", "Light": "हल्का", "Live Market Connected": "लाइव बाज़ार जुड़ा है", "Mainnet networks use real money. Test first on Testnet.": "मेननेट पर असली पैसा चलता है। पहले टेस्टनेट पर जाँचिए।", "Mainnet · real money": "मेननेट · असली पैसा", "My RWA Assets": "मेरी RWA संपत्तियाँ", "My assets": "मेरी संपत्तियाँ", "Name": "नाम", "Network": "नेटवर्क", "Network fee": "नेटवर्क फ़ीस", "New PIN (4-6 digits)": "नया PIN (4–6 अंक)", "No MetaMask needed. Your wallet is stored only on this phone. This is a": "MetaMask की ज़रूरत नहीं। आपका वॉलेट सिर्फ़ इसी फ़ोन में रहता है। यह एक", "test wallet": "टेस्ट वॉलेट", "for Shardeum Testnet.": "Shardeum Testnet के लिए।", "No alerts yet": "अभी कोई अलर्ट नहीं", "No contacts yet": "अभी कोई संपर्क नहीं", "No match": "कोई मेल नहीं", "No legal documents shown": "कोई कानूनी दस्तावेज़ नहीं दिखाया", "No rent or income proof": "किराए या आमदनी का कोई सबूत नहीं", "No transactions yet": "अभी कोई लेनदेन नहीं", "Not connected": "जुड़ा नहीं है", "Note (optional)": "नोट (वैकल्पिक)", "Notification centre": "सूचना केंद्र", "Notifications": "सूचनाएँ", "Off": "बंद", "On": "चालू", "One address works on all EVM networks (Ethereum, BNB, Polygon, Base…).": "एक ही पता सभी EVM नेटवर्क (Ethereum, BNB, Polygon, Base…) पर चलता है।", "Only send SHM (Shardeum Testnet) to this address. Other assets will be lost forever.": "इस पते पर सिर्फ़ SHM (Shardeum Testnet) भेजिए। दूसरी चीज़ें हमेशा के लिए खो जाएँगी।", "Only send SHM on Shardeum Testnet. Wrong token or network = permanent loss.": "सिर्फ़ Shardeum Testnet पर SHM भेजिए। गलत टोकन या नेटवर्क = हमेशा के लिए नुकसान।", "Only use a test wallet here. Never type the words of a wallet that holds real money.": "यहाँ सिर्फ़ टेस्ट वॉलेट इस्तेमाल कीजिए। असली पैसे वाले वॉलेट के शब्द कभी मत डालिए।", "Open block explorer": "ब्लॉक एक्सप्लोरर खोलें", "Or claim on the blockchain below. That needs SHM for the network fee.": "या नीचे से ब्लॉकचेन पर लीजिए। इसके लिए नेटवर्क फ़ीस के SHM चाहिए।", "Other": "दूसरा", "Owner or company can't be verified": "मालिक या कंपनी की पुष्टि नहीं हो सकती", "PIN lock": "PIN लॉक", "PIN protects this app on your phone. It does not replace your wallet password.": "PIN इस फ़ोन में ऐप को बचाता है। यह आपके वॉलेट के पासवर्ड की जगह नहीं लेता।", "Paste": "चिपकाएँ", "Paste the token": "टोकन चिपकाएँ", "Pay": "भुगतान", "Payment Request": "भुगतान की माँग", "People": "लोग", "Pressure to invest quickly": "जल्दी निवेश करने का दबाव", "Price Alarm": "कीमत अलार्म", "Price alarm": "कीमत अलार्म", "Price alarms": "कीमत अलार्म", "Price converter": "कीमत कन्वर्टर", "Price in USD": "USD में कीमत", "Profit / Loss": "लाभ / हानि", "Promises guaranteed / very high returns": "गारंटी / बहुत ज़्यादा मुनाफ़े का वादा", "Quantity": "मात्रा", "RWA tools": "RWA टूल", "Receive": "प्राप्त", "Recent": "हालिया", "Refresh prices": "कीमतें ताज़ा करें", "Reload app": "ऐप फिर से खोलें", "Remove PIN": "PIN हटाएँ", "Rent Records": "किराया रिकॉर्ड", "Rent records": "किराया रिकॉर्ड", "Rent ₹": "किराया ₹", "Rental Yield": "किराया यील्ड", "Rental yield": "किराया यील्ड", "Request": "अनुरोध", "Restore from box": "डिब्बे से वापस लाएँ", "Risks:": "जोखिम:", "SIP Calculator": "SIP कैलकुलेटर", "Safety": "सुरक्षा", "Save Contact": "संपर्क सेव करें", "Save address": "पता सेव करें", "Save auto-lock": "ऑटो-लॉक सेव करें", "Scam Check": "धोखा जाँच", "Scam check": "धोखा जाँच", "Scan QR": "QR स्कैन करें", "Search coin / in / out / hash": "सिक्का / आया / गया / हैश खोजें", "Search services": "सेवाएँ खोजें", "Search token or network": "टोकन या नेटवर्क खोजें", "Security": "सुरक्षा", "Security Tips": "सुरक्षा सुझाव", "Security tips": "सुरक्षा सुझाव", "Security checkup": "सुरक्षा जाँच", "Select Network": "नेटवर्क चुनिए", "Select asset": "सिक्का चुनिए", "Send": "भेजें", "Send feedback": "फीडबैक भेजें", "Services": "सेवाएँ", "Set 6-digit PIN": "6 अंकों का PIN लगाएँ", "Set PIN": "PIN लगाएँ", "Set up your wallet": "अपना वॉलेट बनाइए", "Settings": "सेटिंग्स", "Settings & Lock": "सेटिंग्स और लॉक", "Shardeum Testnet · test": "Shardeum Testnet · टेस्ट", "Share": "शेयर", "Share Request": "माँग शेयर करें", "Shop": "दुकान", "Sound & voice alerts": "आवाज़ और बोलकर सूचना", "Switch to the correct network in your wallet": "अपने वॉलेट में सही नेटवर्क चुनिए", "Symbol (e.g. USDT)": "चिह्न (जैसे USDT)", "Tenant name": "किरायेदार का नाम", "Test": "टेस्ट", "Test voice alert": "आवाज़ की जाँच", "Testnet faucet": "टेस्टनेट फ़ॉसेट", "Testnet · test coins": "टेस्टनेट · टेस्ट सिक्के", "Text size": "अक्षर का आकार", "The balance shows on Home when the token exists on the selected network.": "चुने हुए नेटवर्क पर टोकन होने पर बैलेंस होम में दिखता है।", "Tip %": "टिप %", "Title / 7-12 not verified": "टाइटल / 7-12 की पुष्टि नहीं", "Token contract not public": "टोकन का कॉन्ट्रैक्ट सार्वजनिक नहीं", "Tools": "टूल्स", "Total Balance": "कुल बैलेंस", "Total bill ₹": "कुल बिल ₹", "Total ₹0": "कुल ₹0", "Use your 12 words": "अपने 12 शब्द डालिए", "Value ₹": "मूल्य ₹", "View all": "सब देखें", "Wallet": "वॉलेट", "Write down your 12 words": "अपने 12 शब्द लिख लीजिए", "Write these 12 words on paper, in order. Anyone with them can take your coins. If you lose them and your phone, the wallet cannot be recovered. Never share them or take a screenshot.": "ये 12 शब्द क्रम से कागज़ पर लिखिए। जिसके पास ये होंगे वह आपके सिक्के ले सकता है। ये और फ़ोन दोनों खो गए तो वॉलेट वापस नहीं मिलेगा। किसी को न बताइए, स्क्रीनशॉट न लीजिए।", "contract address": "कॉन्ट्रैक्ट पता", "native coin": "मूल सिक्का", "word1 word2 … word12": "शब्द1 शब्द2 … शब्द12", "1 min": "1 मिनट", "2 min": "2 मिनट", "5 min": "5 मिनट", "10 min": "10 मिनट", "⏰ Price Alarm": "⏰ कीमत अलार्म", "☐ 7/12 extract (land)": "☐ 7/12 उतारा (ज़मीन)", "☐ Electricity & water bills": "☐ बिजली और पानी के बिल", "☐ Encumbrance certificate": "☐ बोझ-मुक्त प्रमाणपत्र", "☐ Owner ID & PAN": "☐ मालिक का पहचान पत्र और PAN", "☐ Property tax receipts": "☐ संपत्ति कर की रसीदें", "☐ Rent agreement": "☐ किराया करार", "☐ Sale / title deed": "☐ बिक्री / टाइटल दस्तावेज़", "☐ Society NOC": "☐ सोसाइटी NOC", "✨ More tools": "✨ और टूल", "✨ More tools & RWA": "✨ और टूल और RWA", "🌗 Light/Dark": "🌗 हल्का/गहरा", "🏠 My RWA Assets": "🏠 मेरी RWA संपत्तियाँ", "💹 Profit / Loss": "💹 लाभ / हानि", "📅 Rent Records": "📅 किराया रिकॉर्ड", "📋 Docs Checklist": "📋 दस्तावेज़ सूची", "📚 Learn RWA": "📚 RWA सीखें", "🔔 Notifications": "🔔 सूचनाएँ", "🔥 Daily Streak": "🔥 रोज़ की गिनती", "🚩 Scam Check": "🚩 धोखा जाँच", "🛡 Avoid unknown links and fake airdrops.": "🛡 अनजान लिंक और नकली एयरड्रॉप से बचिए।", "🛡 Check network and address before every send.": "🛡 हर बार भेजने से पहले नेटवर्क और पता जाँचिए।", "🛡 If it promises guaranteed profit, walk away.": "🛡 जो पक्के मुनाफ़े का वादा करे, उससे दूर रहिए।", "🛡 Never share seed phrase or private key — nobody from support will ask.": "🛡 सीड फ्रेज़ या प्राइवेट की कभी किसी को न दें। कोई सपोर्ट वाला नहीं माँगेगा।", "🛡 Security Tips": "🛡 सुरक्षा सुझाव", "🛡 Test with a small amount first.": "🛡 पहले छोटी रकम से जाँच कीजिए।", "🛡 Use a PIN and keep your phone updated.": "🛡 PIN लगाइए और फ़ोन अपडेट रखिए।", "🧠 Crypto Quiz": "🧠 क्रिप्टो क्विज़", "🧾 Bill Split": "🧾 बिल बाँटें", "Address copied": "पता कॉपी हो गया", "Already added": "पहले से जुड़ा है", "Already saved": "पहले से सेव है", "CSV downloaded": "CSV डाउनलोड हो गई", "Camera permission needed": "कैमरे की अनुमति चाहिए", "Clear history?": "इतिहास हटाएँ?", "Confirm in wallet…": "वॉलेट में पक्का कीजिए…", "Connect MetaMask first, then add token": "पहले MetaMask जोड़िए, फिर टोकन", "Copied": "कॉपी हो गया", "Could not create wallet": "वॉलेट नहीं बन सका", "Enter exactly 12 words": "ठीक 12 शब्द डालिए", "Invalid 12 words": "12 शब्द सही नहीं हैं", "Invalid address": "पता सही नहीं है", "Invalid amount": "रकम सही नहीं है", "Invalid contract address": "कॉन्ट्रैक्ट पता सही नहीं है", "Invalid contract address — need 0x + 40 hex characters": "कॉन्ट्रैक्ट पता सही नहीं है — 0x और 40 अक्षर चाहिए", "Mainnet: real money. Double-check before sending.": "मेननेट: असली पैसा। भेजने से पहले दो बार जाँचिए।", "Name + valid address": "नाम और सही पता", "Network problem. Try again.": "नेटवर्क में दिक्कत है। दोबारा कोशिश कीजिए।", "No address found": "कोई पता नहीं मिला", "PIN removed": "PIN हटा दिया", "PIN saved": "PIN सेव हो गया", "PINs did not match": "दोनों PIN मेल नहीं खाए", "Paste manually": "खुद चिपकाइए", "Payment link copied": "भुगतान लिंक कॉपी हुई", "Please write them down first": "पहले इन्हें लिख लीजिए", "QR scan not supported — paste address": "इस फ़ोन में QR स्कैन नहीं चलता — पता चिपकाइए", "Reading on-chain balance…": "ब्लॉकचेन से बैलेंस पढ़ रहे हैं…", "Refreshing…": "ताज़ा कर रहे हैं…", "Remove the PIN lock? Your wallet and funds are not affected.": "PIN लॉक हटाएँ? आपके वॉलेट और पैसे पर कोई असर नहीं।", "Request link copied": "माँग की लिंक कॉपी हुई", "Save the faucet address first": "पहले फ़ॉसेट का पता सेव कीजिए", "Saved": "सेव हो गया", "Sending…": "भेज रहे हैं…", "Sent": "भेज दिया", "Sent: 100 TZT": "भेजे गए: 100 TZT", "Switch wallet to Shardeum Testnet": "वॉलेट को Shardeum Testnet पर कीजिए", "The faucet is empty.": "फ़ॉसेट खाली है।", "This removes the wallet from this phone. You can restore it only with your 12 words. Continue?": "इससे वॉलेट इस फ़ोन से हट जाएगा। वह सिर्फ़ आपके 12 शब्दों से वापस आएगा। आगे बढ़ें?", "Wallet connected": "वॉलेट जुड़ गया", "Wallet created": "वॉलेट बन गया", "Wallet ready": "वॉलेट तैयार है", "Wrong PIN": "PIN गलत है", "Wrong network": "गलत नेटवर्क", "You already claimed in the last 24 hours.": "आपने पिछले 24 घंटे में ले लिया है।", "Install MetaMask": "MetaMask इंस्टॉल करें", "Insufficient balance": "बैलेंस कम है", "Claimed ✓ — balance updates soon": "मिल गया ✓ — बैलेंस जल्दी अपडेट होगा", "Scanned ✓": "स्कैन हो गया ✓", "About": "जानकारी", "About TZT": "TZT के बारे में", "Decimals": "दशमलव", "Export CSV": "CSV निकालें", "Land": "ज़मीन", "day(s) in a row — open the app daily!": "दिन लगातार — रोज़ ऐप खोलिए!", "legal rules, fake projects, low liquidity, price swings.": "कानूनी नियम, नकली प्रोजेक्ट, कम तरलता, कीमत में उतार-चढ़ाव।", "lets many people own small shares of one asset.": "जिसमें कई लोग एक संपत्ति के छोटे हिस्से के मालिक बन सकते हैं।", "small entry amount, easy records, transparent history.": "छोटी शुरुआती रकम, आसान रिकॉर्ड, साफ़ इतिहास।"};var RX=[["^Only send (\\S+) on (.+)\\. Wrong token or network = permanent loss\\.$", "सिर्फ़ $2 पर $1 भेजिए। गलत टोकन या नेटवर्क = हमेशा के लिए नुकसान।"], ["^Only send (\\S+) \\((.+)\\) to this address\\. Other assets will be lost forever\\.$", "इस पते पर सिर्फ़ $1 ($2) भेजिए। दूसरी चीज़ें हमेशा के लिए खो जाएँगी।"], ["^Receive (\\S+)$", "$1 पाएँ"], ["^Send (\\S+)$", "$1 भेजें"], ["^Network fee: about (.+?)\\. It goes to the network, not to Tazvera\\.$", "नेटवर्क फ़ीस: लगभग $1। यह नेटवर्क को जाती है, Tazvera को नहीं।"], ["^Not enough SHM for the fee\\. You need about (\\d+) SHM, you have (\\d+) SHM\\.$", "फ़ीस के लिए SHM कम हैं। लगभग $1 SHM चाहिए, आपके पास $2 हैं।"], ["^Not enough (\\S+)\\. You need about ([\\d.,]+) (\\S+), including the network fee of about ([\\d.,]+)\\.$", "$1 कम हैं। फ़ीस समेत लगभग $2 $3 चाहिए (फ़ीस लगभग $4)।"], ["^Not enough (\\S+)$", "$1 कम है"], ["^Insufficient (\\S+)$", "$1 कम है"], ["^Token added: (.+)$", "टोकन जुड़ा: $1"], ["^Sent ✓ (.+)$", "भेज दिया ✓ $1"], ["^(\\d+) red flag\\(s\\) — Lower risk, still verify$", "$1 लाल झंडे — कम जोखिम, फिर भी जाँचिए"], ["^(\\d+) day\\(s\\) in a row — open the app daily!$", "$1 दिन लगातार — रोज़ ऐप खोलिए!"]].map(function(x){return[new RegExp(x[0]),x[1]]});
window.__E=E;var orig=new WeakMap(),pend=0,obs;
function hiOf(s){if(E.hasOwnProperty(s))return E[s];for(var i=0;i<RX.length;i++){if(RX[i][0].test(s))return s.replace(RX[i][0],RX[i][1])}return null}
function one(n){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest("#splash,.bname"))return;var cur=n.nodeValue,o=orig.get(n);
if(lang==="hi"){var base=(o&&cur===o.hi)?o.en:cur,key=base.trim();if(!key||!/[A-Za-z]{2}/.test(key))return;var r=hiOf(key);if(r!==null){var out=base.replace(key,r);if(out!==cur){orig.set(n,{en:base,hi:out});n.nodeValue=out}}}
else if(o&&cur===o.hi){n.nodeValue=o.en;orig.delete(n)}}
var AT=["placeholder","title","aria-label"];
function attrs(el){AT.forEach(function(a){var v=el.getAttribute&&el.getAttribute(a);if(!v)return;var k="_o_"+a,o=el[k];
if(lang==="hi"){var base=(o&&v===o.hi)?o.en:v,r=hiOf(base.trim());if(r!==null&&r!==v){el[k]={en:base,hi:r};el.setAttribute(a,r)}}else if(o&&v===o.hi){el.setAttribute(a,o.en);el[k]=null}})}
function run(){pend=0;if(obs)obs.disconnect();try{var wk=document.createTreeWalker(document.body,4),n,L=[];while(n=wk.nextNode()){var p=n.parentNode;if(p&&!/^(SCRIPT|STYLE)$/.test(p.nodeName))L.push(n)}L.forEach(one);document.body.querySelectorAll("[placeholder],[title],[aria-label]").forEach(attrs)}catch(e){}
if(obs)obs.observe(document.body,{childList:true,subtree:true,characterData:true})}
function sched(){if(!pend){pend=1;setTimeout(run,40)}}
obs=new MutationObserver(sched);obs.observe(document.body,{childList:true,subtree:true,characterData:true});
var _cl=changeLang;changeLang=function(l){if(l!=="en"&&l!=="hi")l="hi";_cl(l);setTimeout(run,0)};
if(lang!=="en"&&lang!=="hi")changeLang("hi");
var _cf=window.confirm;window.confirm=function(m){var r=lang==="hi"?hiOf(String(m).trim()):null;return _cf.call(window,r||m)};
setTimeout(run,0);window.__hiRun=run;
})();

/* ===== Part 21: Privacy policy + Terms of use (Hindi / English) ===== */
(function(){
if(window.__E)Object.assign(window.__E,{"Privacy policy":"गोपनीयता नीति","Terms of use":"उपयोग की शर्तें"});
var tx=function(e,h){return lang==="en"?e:h};
var D={
p:{t:["Privacy policy","गोपनीयता नीति"],s:[
["What we collect","हम क्या इकट्ठा करते हैं","Nothing about you personally. Tazvera has no accounts. We do not ask for your name, phone number or email.","आपके बारे में कुछ भी निजी नहीं। Tazvera में कोई खाता नहीं बनता। हम आपका नाम, फ़ोन नंबर या ईमेल नहीं माँगते।"],
["Your wallet","आपका वॉलेट","Your wallet key is created on your phone and locked with your PIN. It is never sent to us. Your 12 words are shown only on your own screen.","आपके वॉलेट की चाबी आपके फ़ोन में बनती है और PIN से बंद रहती है। वह हमें कभी नहीं भेजी जाती। 12 शब्द सिर्फ़ आपकी अपनी स्क्रीन पर दिखते हैं।"],
["What the app contacts","ऐप किससे जुड़ता है","To work, the app talks to blockchain network nodes (to read balances and send transactions), price sources (through our server) and our hosting provider. These services may see your IP address and the public address you use. We do not sell any data.","चलने के लिए ऐप ब्लॉकचेन नेटवर्क के नोड (बैलेंस पढ़ने और लेनदेन भेजने के लिए), कीमत के स्रोत (हमारे सर्वर से) और हमारे होस्टिंग प्रदाता से जुड़ता है। ये सेवाएँ आपका IP पता और आपका सार्वजनिक पता देख सकती हैं। हम कोई जानकारी बेचते नहीं।"],
["Voice input","आवाज़ से भरना","If you use the microphone button, your browser's speech service (for example Google in Chrome) hears your voice and turns it into text. Tazvera does not record or store your voice.","माइक का बटन इस्तेमाल करने पर आपके ब्राउज़र की आवाज़-पहचान सेवा (जैसे Chrome में Google) आपकी आवाज़ सुनकर उसे लिखित में बदलती है। Tazvera आपकी आवाज़ रिकॉर्ड या सेव नहीं करता।"],["Stored on your phone","आपके फ़ोन में क्या रहता है","Your encrypted wallet, settings, history and contacts stay on your phone. Clearing browser data removes them. Only your 12 words can bring the wallet back.","आपका एन्क्रिप्टेड वॉलेट, सेटिंग, इतिहास और संपर्क आपके फ़ोन में रहते हैं। ब्राउज़र का डेटा साफ़ करने पर ये हट जाते हैं। वॉलेट सिर्फ़ 12 शब्दों से वापस आता है।"],
["Changes and contact","बदलाव और संपर्क","If this changes, we will update this page. Write to contact@tazvera.com or message us on Telegram (t.me/TazveraApp).","इसमें बदलाव हुआ तो हम यह पेज बदल देंगे। हमें contact@tazvera.com पर लिखिए या Telegram (t.me/TazveraApp) पर संदेश भेजिए।"]]},
t:{t:["Terms of use","उपयोग की शर्तें"],s:[
["This is a test version","यह टेस्ट वर्शन है","Tazvera is an early test version on a test network. Test coins like TZT have no money value.","Tazvera एक शुरुआती टेस्ट वर्शन है जो टेस्ट नेटवर्क पर चलता है। TZT जैसे टेस्ट सिक्कों की कोई कीमत नहीं।"],
["Not financial advice","वित्तीय सलाह नहीं","Nothing in the app is financial, legal or tax advice. Crypto is risky.","ऐप में कुछ भी वित्तीय, कानूनी या कर संबंधी सलाह नहीं है। क्रिप्टो जोखिम भरा है।"],
["You are in control","नियंत्रण आपके पास","You alone control your wallet. If you lose your 12 words and your phone, nobody can recover your wallet, including us.","आपका वॉलेट सिर्फ़ आपके नियंत्रण में है। 12 शब्द और फ़ोन दोनों खो गए तो कोई, हम भी, वॉलेट वापस नहीं ला सकते।"],
["Use at your own risk","अपनी ज़िम्मेदारी पर इस्तेमाल","The app is provided as it is, without promises. We try to keep it working, but it may have mistakes or stop at any time.","ऐप जैसा है वैसा दिया गया है, बिना किसी वादे के। हम इसे चालू रखने की कोशिश करते हैं, पर इसमें गलतियाँ हो सकती हैं या यह कभी भी बंद हो सकता है।"],
["Fair use","सही इस्तेमाल","Do not use the app to cheat, harm others or break the law. Free test coins may be limited or stopped to prevent misuse.","ऐप का इस्तेमाल धोखे, किसी को नुकसान पहुँचाने या कानून तोड़ने के लिए मत कीजिए। दुरुपयोग रोकने के लिए मुफ़्त टेस्ट सिक्के सीमित या बंद किए जा सकते हैं।"],
["Changes","बदलाव","We may update these terms. If you keep using the app, you accept the new terms.","हम ये शर्तें बदल सकते हैं। ऐप इस्तेमाल करते रहने का मतलब है कि आप नई शर्तें मानते हैं।"]]}};
window.LG={open:function(k){var d=D[k],h="";d.s.forEach(function(x){h+='<div class="xt-o" style="text-align:left"><b>'+tx(x[0],x[1])+'</b><div style="color:var(--mut);margin-top:4px;line-height:1.55">'+tx(x[2],x[3])+"</div></div>"});
h+='<p class="cap" style="text-align:left">'+tx("Last updated: 25 Oct 2026","अंतिम बदलाव: 25 अक्टूबर 2026")+"</p>";
$("toolOut").textContent="";$("toolsTitle").textContent=tx(d.t[0],d.t[1]);var b=$("calcBox");b.style.display="block";$("sheetTools").classList.add("open");b.innerHTML=h}};
})();

/* ===== Part 25: speak to fill the Send form (Hindi / English) ===== */
(function(){
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
var tx=function(e,h){return lang==="en"?e:h};
var H=("एक 1,दो 2,तीन 3,चार 4,पाँच 5,पांच 5,छह 6,छः 6,छे 6,सात 7,आठ 8,नौ 9,दस 10,ग्यारह 11,बारह 12,तेरह 13,चौदह 14,पंद्रह 15,पन्द्रह 15,सोलह 16,सत्रह 17,अठारह 18,उन्नीस 19,बीस 20,इक्कीस 21,बाईस 22,तेईस 23,चौबीस 24,पच्चीस 25,छब्बीस 26,सत्ताईस 27,अट्ठाईस 28,उनतीस 29,तीस 30,इकतीस 31,बत्तीस 32,तैंतीस 33,चौंतीस 34,पैंतीस 35,छत्तीस 36,सैंतीस 37,अड़तीस 38,उनतालीस 39,चालीस 40,इकतालीस 41,बयालीस 42,तैंतालीस 43,चौवालीस 44,पैंतालीस 45,छियालीस 46,सैंतालीस 47,अड़तालीस 48,उनचास 49,पचास 50,इक्यावन 51,बावन 52,तिरपन 53,चौवन 54,पचपन 55,छप्पन 56,सत्तावन 57,अट्ठावन 58,उनसठ 59,साठ 60,इकसठ 61,बासठ 62,तिरसठ 63,चौंसठ 64,पैंसठ 65,छियासठ 66,सड़सठ 67,अड़सठ 68,उनहत्तर 69,सत्तर 70,इकहत्तर 71,बहत्तर 72,तिहत्तर 73,चौहत्तर 74,पचहत्तर 75,छिहत्तर 76,सतहत्तर 77,अठहत्तर 78,उन्यासी 79,अस्सी 80,इक्यासी 81,बयासी 82,तिरासी 83,चौरासी 84,पचासी 85,छियासी 86,सत्तासी 87,अट्ठासी 88,नवासी 89,नब्बे 90,इक्यानवे 91,बानवे 92,तिरानवे 93,चौरानवे 94,पचानवे 95,छियानवे 96,सत्तानवे 97,अट्ठानवे 98,निन्यानवे 99,सौ 100,हज़ार 1000,हजार 1000,लाख 100000,डेढ़ 1.5,ढाई 2.5,"+
"one 1,two 2,three 3,four 4,five 5,six 6,seven 7,eight 8,nine 9,ten 10,eleven 11,twelve 12,fifteen 15,twenty 20,thirty 30,forty 40,fifty 50,sixty 60,seventy 70,eighty 80,ninety 90,hundred 100,thousand 1000").split(",").reduce(function(o,x){var p=x.split(" ");o[p[0]]=parseFloat(p[1]);return o},{});
var SYM={TZT:["tzt","t z t","cpay","c pay","सीपे","सी पे","सीपाय","सीपीएवाई","सी पी ए वाई","ताज़वेरा"],SHM:["shm","एसएचएम","एस एच एम","शम","शार्डियम","शर्डियम","shardeum"],ETH:["eth","ईथर","ईथरियम","ethereum","ether","ईटीएच"],BNB:["bnb","बीएनबी","बी एन बी","बाइनेंस","बिनेंस"],USDT:["usdt","यूएसडीटी","यू एस डी टी","टेदर","tether"],USDC:["usdc","यूएसडीसी"],BTC:["btc","बिटकॉइन","बिटकोइन","bitcoin","बीटीसी"],DOGE:["doge","डोज","डॉज","dogecoin"],SHIB:["shib","शिबा","शीबा","shiba"],DAI:["dai","डाई"],LINK:["link","लिंक","चेनलिंक"],XRP:["xrp","एक्सआरपी"],PEPE:["pepe","पेपे"],CAKE:["cake","केक"]};
function norm(s){return String(s||"").toLowerCase().replace(/[०-९]/g,function(d){return"०१२३४५६७८९".indexOf(d)}).replace(/(\d),(\d)/g,"$1$2").replace(/[।,!?.]+(?!\d)/g," ").replace(/\s+/g," ").trim()}
function amount(s){var m=s.match(/\d+(?:\.\d+)?/);if(m)return parseFloat(m[0]);
s=s.replace(/(भेज|कर|दे|पे|ट्रांसफर|send|pay)\s+दो/g,"$1 ");var t=s.split(" "),total=0,cur=0,found=false;
t.forEach(function(w){if(!H.hasOwnProperty(w))return;var v=H[w];found=true;if(v===100){cur=(cur||1)*100}else if(v===1000||v===100000){total+=(cur||1)*v;cur=0}else if(v===1.5||v===2.5){cur=v}else cur+=v});return found?total+cur:null}
function symbol(s){var best=null,pos=1e9;Object.keys(SYM).forEach(function(k){SYM[k].forEach(function(a){var i=s.indexOf(a);if(i>=0&&i<pos){pos=i;best=k}})});return best}
var DV={"क":"k","ख":"k","ग":"g","घ":"g","ङ":"n","च":"c","छ":"c","ज":"j","झ":"j","ञ":"n","ट":"t","ठ":"t","ड":"d","ढ":"d","ण":"n","त":"t","थ":"t","द":"d","ध":"d","न":"n","प":"p","फ":"p","ब":"b","भ":"b","म":"m","य":"","र":"r","ल":"l","व":"v","श":"s","ष":"s","स":"s","ह":"","ं":"n","ँ":"n","ज़":"j","फ़":"p","क़":"k","ख़":"k","ग़":"g","ड़":"d","ढ़":"d"};
function skel(t){t=String(t||"").toLowerCase().replace(/(sh|ch|kh|gh|th|dh|bh|ph|jh)/g,function(m){return m[0]}).replace(/f/g,"p").replace(/z/g,"j").replace(/q/g,"k").replace(/w/g,"v").replace(/x/g,"ks");
var o="";for(var i=0;i<t.length;i++){var c=t[i];if(DV.hasOwnProperty(c))o+=DV[c];else if(/[bcdgjklmnprstv]/.test(c))o+=c}return o.replace(/(.)\1+/g,"$1")}
function contact(s){var best=null,len=0,cs=(window.contacts||contacts||[]);cs.forEach(function(c){var n=norm(c.n);if(n&&s.indexOf(n)>=0&&n.length>len){best=c;len=n.length}});if(best)return best;
var toks=s.split(" ");cs.forEach(function(c){var k=skel(c.n);if(k.length<2)return;for(var i=0;i<toks.length;i++){if(skel(toks[i])===k||(toks[i+1]&&skel(toks[i]+toks[i+1])===k)){if(k.length>len){best=c;len=k.length}}}});return best}
function where(sym){if(sym===NETWORKS[currentNet].symbol)return{net:currentNet,sym:sym};if((DEFTOK[currentNet]||[]).some(function(t){return t.symbol===sym}))return{net:currentNet,sym:sym};
var ks=Object.keys(NETWORKS);for(var i=0;i<ks.length;i++){var k=ks[i];if(NETWORKS[k].symbol===sym||(DEFTOK[k]||[]).some(function(t){return t.symbol===sym}))return{net:k,sym:sym}}return null}
function parse(raw){var s=norm(raw);var bal=/(बैलेंस|balance|कितने पैसे|कितना पैसा)/.test(s)&&!/(भेज|send|pay|ट्रांसफर)/.test(s);
return{text:s,amount:amount(s),sym:symbol(s),contact:contact(s),balance:bal}}
function apply(r){var m=[];
if(r.sym){var w=where(r.sym);if(w){XA.pickN(w.net,w.sym)}else m.push(tx("That coin is not in the list.","यह सिक्का सूची में नहीं है।"))}
if(r.contact)$("sendTo").value=r.contact.a;if(r.amount!=null)$("sendAmt").value=r.amount;
var unit=($("sendUnit")&&$("sendUnit").textContent)||"";
if(r.amount==null)m.push(tx("I could not hear the amount.","रकम सुनाई नहीं दी।"));
if(!r.contact&&!/^0x[0-9a-fA-F]{40}$/.test($("sendTo").value.trim()))m.push(tx("Who to send to? Pick a saved contact, paste the address or scan the QR.","किसे भेजना है? सेव किया संपर्क चुनिए, पता चिपकाइए या QR स्कैन कीजिए।"));
var line=(r.amount!=null?r.amount+" "+unit:"")+(r.contact?" → "+r.contact.n:"");
sendMsg((line?tx("Heard: ","सुना: ")+line+". ":"")+(m.length?m.join(" "):tx("Please check everything, then press Send.","सब जाँचकर Send दबाइए।")),!m.length)}
function say(t){try{var u=new SpeechSynthesisUtterance(t);u.lang=lang==="en"?"en-IN":"hi-IN";speechSynthesis.speak(u)}catch(e){}}
var rec=null;
window.VC={parse:parse,apply:apply,
start:function(){var b=$("micBtn");if(!SR)return toast(tx("Voice is not supported in this browser","इस ब्राउज़र में आवाज़ नहीं चलती"));
if(rec){try{rec.stop()}catch(e){}return}
if(!ls.get("voice_ok",0)){if(!confirm(tx("Voice input uses your browser's speech service (for example Google in Chrome) to turn your voice into text. Tazvera does not record your voice. Continue?","आवाज़ से भरने के लिए आपके ब्राउज़र की आवाज़-पहचान सेवा (जैसे Chrome में Google) आपकी आवाज़ को लिखित में बदलती है। Tazvera आपकी आवाज़ रिकॉर्ड नहीं करता। आगे बढ़ें?")))return;ls.set("voice_ok",1)}
rec=new SR();rec.lang=lang==="en"?"en-IN":"hi-IN";rec.interimResults=false;rec.maxAlternatives=3;
b.classList.add("on");b.textContent=tx("Listening… tap to stop","सुन रहा हूँ… रोकने के लिए दबाइए");
rec.onresult=function(e){var alts=[].map.call(e.results[0],function(a){return a.transcript}),best=null;for(var i=0;i<alts.length;i++){var r=parse(alts[i]);if(r.balance){toast(tx("Balance: ","बैलेंस: ")+$("total").textContent,5000);say(tx("Your balance is ","आपका बैलेंस ")+$("total").textContent);return}if(!best||(best.amount==null&&r.amount!=null))best=r}apply(best)};
rec.onerror=function(e){var m=e.error==="not-allowed"?tx("Microphone permission needed","माइक की अनुमति चाहिए"):e.error==="no-speech"?tx("Nothing heard. Try again.","कुछ सुनाई नहीं दिया। दोबारा बोलिए।"):e.error==="network"?tx("Internet is needed for voice","आवाज़ के लिए इंटरनेट चाहिए"):tx("Could not listen. Try again.","सुन नहीं सका। दोबारा कोशिश कीजिए।");toast(m,4000)};
rec.onend=function(){rec=null;b.classList.remove("on");b.textContent=tx("🎙 Speak to fill","🎙 बोलकर भरें")};
try{rec.start()}catch(e){rec=null;b.classList.remove("on")}}};
function mount(){if(!SR||$("micBtn"))return;var t=$("sendTo");if(!t)return;t.parentNode.insertAdjacentHTML("beforebegin",'<button class="btn ghost" id="micBtn" onclick="VC.start()">'+tx("🎙 Speak to fill","🎙 बोलकर भरें")+'</button><div class="cap" id="micHint" style="margin:8px 0 12px;text-align:center">'+tx("Say: 10 TZT to Ramesh","बोलिए: 10 TZT रमेश को भेजो")+"</div>")}
mount();var _os=openSend;openSend=async function(){await _os.apply(this,arguments);mount();var b=$("micBtn");if(b&&!rec)b.textContent=tx("🎙 Speak to fill","🎙 बोलकर भरें");var h=$("micHint");if(h)h.textContent=tx("Say: 10 TZT to Ramesh","बोलिए: 10 TZT रमेश को भेजो")};
})();

/* ===== Part 26: QR scanner that works on every phone (camera + from photo) ===== */
(function(){
var tx=function(e,h){return lang==="en"?e:h};
var inApp=/; wv\)|FBAN|FBAV|Instagram|Snapchat|MicroMessenger/i.test(navigator.userAgent);
if(window.__E)Object.assign(window.__E,{"📷 Scan QR":"📷 QR स्कैन करें","🖼 QR from photo":"🖼 फ़ोटो से QR पढ़ें"});
var cv=document.createElement("canvas"),cx=cv.getContext("2d",{willReadFrequently:true});
function decodeSource(src,w0,h0){var w=Math.min(720,w0),h=Math.round(w*h0/w0);cv.width=w;cv.height=h;cx.drawImage(src,0,0,w,h);var d=cx.getImageData(0,0,w,h),r=window.jsQR&&jsQR(d.data,w,h,{inversionAttempts:"attemptBoth"});return r?r.data:null}
window.QRX={fromImage:function(img){return decodeSource(img,img.naturalWidth||img.width,img.naturalHeight||img.height)}};
var hint=function(){return inApp?" "+tx("Open this link in Chrome, not inside another app.","इस लिंक को दूसरे ऐप के अंदर नहीं, Chrome में खोलिए।"):""};
window.scanQR=async function(){
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){sendMsg(tx("Camera is not available here.","यहाँ कैमरा उपलब्ध नहीं है।")+hint()+" "+tx("Use 'QR from photo' or paste the address.","'फ़ोटो से QR पढ़ें' चुनिए या पता चिपकाइए।"));return}
try{stopScan();scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
var v=$("scanVid");v.srcObject=scanStream;v.setAttribute("playsinline","");v.muted=true;v.style.display="block";await v.play();scanning=true;
var det=("BarcodeDetector"in window)?new BarcodeDetector({formats:["qr_code"]}):null;
sendMsg(tx("Point the camera at the QR code.","कैमरा QR कोड की तरफ़ कीजिए।"),true);
(async function loop(){while(scanning){try{var t=null;if(det){var c=await det.detect(v);if(c.length)t=c[0].rawValue}else if(v.videoWidth)t=decodeSource(v,v.videoWidth,v.videoHeight);if(t){handleScan(t);return}}catch(e){}await new Promise(function(r){setTimeout(r,det?250:170)})}})();
}catch(e){stopScan();var n=e&&e.name,m=n==="NotAllowedError"||n==="SecurityError"?tx("Camera permission is off. Allow the camera for this site and try again.","कैमरे की अनुमति बंद है। इस साइट के लिए कैमरा चालू कीजिए और दोबारा कोशिश कीजिए।"):n==="NotFoundError"?tx("No camera found.","कैमरा नहीं मिला।"):n==="NotReadableError"?tx("The camera is being used by another app.","कैमरा दूसरे ऐप में चल रहा है।"):tx("Could not open the camera.","कैमरा खुल नहीं सका।");
sendMsg(m+hint()+" "+tx("You can also use 'QR from photo'.","आप 'फ़ोटो से QR पढ़ें' भी चुन सकते हैं।"))}};
window.homeScan=async function(){await openSend();scanQR()};
window.scanFile=function(inp){var f=inp.files&&inp.files[0];inp.value="";if(!f)return;var img=new Image(),u=URL.createObjectURL(f);img.onload=function(){var t=null;try{t=window.QRX.fromImage(img)}catch(e){}URL.revokeObjectURL(u);if(t)handleScan(t);else sendMsg(tx("No QR code found in the photo.","फ़ोटो में QR कोड नहीं मिला।"))};img.onerror=function(){sendMsg(tx("Could not read the photo.","फ़ोटो पढ़ी नहीं जा सकी।"))};img.src=u};
function mount(){if($("qrFile"))return;var b=document.querySelector('#sheetSend button[onclick="scanQR()"]');if(!b)return;b.insertAdjacentHTML("afterend",'<input type="file" id="qrFile" accept="image/*" style="display:none" onchange="scanFile(this)"><button class="btn ghost" onclick="$(\'qrFile\').click()">🖼 QR from photo</button>')}
mount();
})();

/* ===== Part 27: Address Book is reachable (Services tile + Send button) ===== */
(function(){
if(window.__E)Object.assign(window.__E,{"Address Book":"पतों की किताब","👥 Address book":"👥 पतों की किताब"});
function mount(){if($("bookBtn"))return;var h=$("micHint"),t=$("sendTo");if(!t)return;var html='<button class="btn ghost" id="bookBtn" onclick="openBook()">👥 Address book</button>';if(h)h.insertAdjacentHTML("afterend",html);else t.parentNode.insertAdjacentHTML("beforebegin",html)}
mount();var _os=openSend;openSend=async function(){await _os.apply(this,arguments);mount()};
})();

/* ===== Part 28: futuristic icon set (own design: diamonds, HUD arcs, chamfered shapes) ===== */
(function(){
document.body.insertAdjacentHTML("afterbegin",'<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="cpg" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22"><stop offset="0" style="stop-color:var(--ig1)"/><stop offset="1" style="stop-color:var(--ig2)"/></linearGradient></defs></svg>');
var IC={
home:'<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6 10v9.5h12V10"/><path d="M12 13.2l2.3 2.3L12 17.8 9.7 15.5z"/>',
svc:'<path d="M12 3.2l3 3-3 3-3-3z"/><path d="M17.8 9l3 3-3 3-3-3z"/><path d="M12 14.8l3 3-3 3-3-3z"/><path d="M6.2 9l3 3-3 3-3-3z"/>',
set:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8a9.2 9.2 0 0 1 8 4.6"/><path d="M21.2 12a9.2 9.2 0 0 1-4.6 8"/><path d="M12 21.2a9.2 9.2 0 0 1-8-4.6"/><path d="M2.8 12a9.2 9.2 0 0 1 4.6-8"/>',
send:'<path d="M7 17L17 7"/><path d="M10 7h7v7"/><path d="M4.8 12.2L12.2 4.8"/>',
recv:'<path d="M17 7L7 17"/><path d="M7 10v7h7"/><path d="M19.2 11.8L11.8 19.2"/>',
req:'<path d="M8 3.5h8l4.5 4.5v8L16 20.5H8L3.5 16V8z"/><path d="M8.5 10.5h7M8.5 14h4.5"/>',
scan:'<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M12 9.2l2.8 2.8L12 14.8 9.2 12z"/>',
plus:'<path d="M12 3.5l7.4 4.25v8.5L12 20.5l-7.4-4.25v-8.5z"/><path d="M12 8.6v6.8M8.6 12h6.8"/>'};
function put(sel,k){document.querySelectorAll(sel).forEach(function(s){s.innerHTML=IC[k];s.setAttribute("stroke-width","1.7")})}
put('nav.bn button[onclick^="goHome"] svg','home');put('nav.bn button[onclick^="openTools"] svg','svc');put('nav.bn button[onclick^="openSettings"] svg','set');
put('.act[onclick^="openSend"] svg','send');put('.act[onclick^="openReceive"] svg','recv');put('.act[onclick^="openRequest"] svg','req');
put('button[onclick^="homeScan"] svg','scan');put('.addtok svg','plus');
})();

/* ===== Part 29: Address Book opens above the Services page ===== */
(function(){var _ob=openBook;openBook=function(){var s=$("sheetSvc");if(s)s.classList.remove("open");return _ob.apply(this,arguments)}})();

/* ===== Part 33 (built on Part 32): recovery-phrase protection, PIN attempt limit, wallet auto-lock, fingerprint unlock, safer sending ===== */
(function(){
"use strict";
if(!window.CPW||!window.WS||!window.ethers)return;
var E=window.ethers;
var tx=function(e,h){return lang==="en"?e:h};
function bT(t){var e=document.querySelector("#sheetWallet .ttl");if(e)e.textContent=t}
function bB(h){$("wsBody").innerHTML=h}
function bSh(o){$("sheetWallet").classList[o?"add":"remove"]("open")}
function pinHTML(id){return'<div class="pinw" onclick="$(\''+id+'\').focus()"><div class="pbs"><i></i><i></i><i></i><i></i><i></i><i></i></div><input id="'+id+'" class="pin-h" type="password" inputmode="numeric" maxlength="6" autocomplete="off" oninput="PB(this)"></div>'}
function ask(title,cb,msg){bT(title);bB('<div style="padding:26px 0 8px;text-align:center">'+pinHTML("wsPin")+'</div><div id="wsMsg" style="min-height:22px;text-align:center;font-size:13.5px;font-weight:700;color:#ff8f8f;padding:0 10px">'+(msg||"")+'</div><div style="text-align:center;margin-top:6px"><a href="#" onclick="WSX.forgot();return false" style="font-size:13px;opacity:.85;text-decoration:underline;color:inherit">'+tx("Forgot PIN?","PIN भूल गए?")+'</a></div>');PB.h.wsPin=cb;setTimeout(function(){var i=$("wsPin");if(i)i.focus()},150)}
function busy(m){bB('<div class="cap" style="padding:40px 0;text-align:center">'+m+'</div>')}

/* ---------- wrong-PIN limiter (5 tries, then 30 s, 1 min, 5 min, 15 min, 1 h) ---------- */
var PF="cp3_pinfail",STEPS=[30,60,300,900,3600];
function pfGet(){try{return JSON.parse(localStorage.getItem(PF)||"{}")||{}}catch(e){return{}}}
function pfLeft(){return Math.max(0,(pfGet().until||0)-Date.now())}
function pfBad(){var o=pfGet();o.n=(o.n||0)+1;if(o.n>=5)o.until=Date.now()+STEPS[Math.min(o.n-5,STEPS.length-1)]*1000;try{localStorage.setItem(PF,JSON.stringify(o))}catch(e){}return o}
function pfOk(){try{localStorage.removeItem(PF)}catch(e){}}
function fmtWait(ms){var s=Math.ceil(ms/1000);return s>=60?Math.ceil(s/60)+" min":s+" s"}
function waitView(ms,retry){
  bT(tx("Too many wrong PINs","बहुत ज़्यादा गलत PIN"));
  bB('<div class="risk">'+tx("For your safety, please wait: ","आपकी सुरक्षा के लिए रुकिए: ")+'<b id="pfw">'+fmtWait(ms)+'</b></div>');
  var t=setInterval(function(){var e=$("pfw");if(!e){clearInterval(t);return}var l=pfLeft();if(l<=0){clearInterval(t);retry();return}e.textContent=fmtWait(l)},500);
}
function guarded(title,fn,onOk){
  (function step(msg){
    var left=pfLeft();if(left>0){waitView(left,step);return}
    ask(title,function(p){busy(tx("Checking…","जाँच रहे हैं…"));fn(p).then(function(r){pfOk();onOk(r,p)}).catch(function(){var o=pfBad();var m=o.n>=5?tx("Too many wrong PINs. Please wait.","बहुत गलत PIN। कृपया रुकिए।"):tx("Wrong PIN. "+(5-o.n)+" tries left.","गलत PIN। "+(5-o.n)+" मौके बचे।");toast(m,4000);step(m)})},msg);
  })();
}

/* ---------- 12 words: hidden until tapped, hides itself, no copy ---------- */
var WSX=window.WSX={t:null,left:0,cur:null,q:null};
WSX.rv=function(){var v=$("wsv");if(!v)return;v.classList.remove("veiled");WSX.left=30;clearInterval(WSX.t);WSX.tick();WSX.t=setInterval(WSX.tick,1000)};
WSX.tick=function(){if(!$("wsv")){clearInterval(WSX.t);return}if(WSX.left<=0){WSX.hd();return}var c=$("wsCd");if(c)c.textContent=tx("Hides in ","छिप जाएँगे ")+WSX.left+tx(" s"," सेकंड में");WSX.left--};
WSX.hd=function(){clearInterval(WSX.t);var v=$("wsv");if(v)v.classList.add("veiled");var c=$("wsCd");if(c)c.textContent=""};
document.addEventListener("visibilitychange",function(){if(document.hidden)WSX.hd()});
window.addEventListener("blur",function(){WSX.hd()});window.addEventListener("pagehide",function(){WSX.hd()});
["copy","cut","contextmenu","dragstart"].forEach(function(ev){document.addEventListener(ev,function(e){if($("wsv")&&$("wsBody")&&$("wsBody").contains($("wsv")))e.preventDefault()})});
function wordsHTML(p){return'<div class="wsv veiled" id="wsv"><div class="wsw">'+p.split(" ").map(function(w,i){return"<span><i>"+(i+1)+"</i>"+w+"</span>"}).join("")+'</div><div class="vl"><button class="btn" onclick="WSX.rv()">'+tx("Tap to show (30 s)","दिखाने के लिए दबाएँ (30 सेकंड)")+'</button></div></div><div class="cap" id="wsCd" style="min-height:20px;text-align:center"></div>'}
var RISK=function(){return'<div class="risk">'+tx("These 12 words are the real key to your wallet. If you lose your phone, they bring your coins back. Write them on paper, in order. No screenshot, no photo. Never tell anyone.","ये 12 शब्द आपके वॉलेट की असली चाबी हैं। फ़ोन खो जाए तो इन्हीं से सिक्के वापस आते हैं। इन्हें क्रम से कागज़ पर लिखिए। स्क्रीनशॉट या फ़ोटो नहीं। किसी को न बताइए।")+'</div>'};
WS.done=function(p){WSX.cur=p;bT(tx("Write down your 12 words","12 शब्द लिखिए"));
  bB(RISK()+wordsHTML(p)+'<div class="cap" style="text-align:left;margin:4px 0 8px">'+tx("Already took a screenshot? Delete it now and empty the Trash.","स्क्रीनशॉट ले लिया है? अभी डिलीट कीजिए और Trash भी खाली कीजिए।")+'</div><label class="xt-o" style="display:block;margin:12px 0"><input type="checkbox" id="wsOk" style="width:auto;margin-right:8px">'+tx("I have written them on paper","मैंने इन्हें कागज़ पर लिख लिया")+'</label><button class="btn" onclick="WS.fin()">'+tx("Continue","आगे बढ़ें")+'</button>');
};
WS.fin=function(){
  if(!$("wsOk")||!$("wsOk").checked)return toast(tx("Please write them down first","पहले इन्हें लिख लीजिए"));
  WSX.hd();var w=(WSX.cur||"").split(" ");
  if(w.length!==12){bSh(0);toast(tx("Wallet created","वॉलेट बन गया"));(window.AFTER37?AFTER37():connectWallet());return}
  var a=1+Math.floor(Math.random()*12),b;do{b=1+Math.floor(Math.random()*12)}while(b===a);if(b<a){var t=a;a=b;b=t}
  WSX.q=[a,b];bT(tx("Check your paper","अपना कागज़ जाँचिए"));
  bB('<div class="cap" style="text-align:left;margin-bottom:8px">'+tx("Type these words from your paper, to be sure you wrote them correctly.","कागज़ से ये शब्द लिखिए, ताकि पक्का हो कि आपने सही लिखे हैं।")+'</div><div class="inp"><input id="wsQ1" placeholder="'+tx("Word #","शब्द नंबर ")+a+'" autocomplete="off" autocapitalize="none"></div><div class="inp"><input id="wsQ2" placeholder="'+tx("Word #","शब्द नंबर ")+b+'" autocomplete="off" autocapitalize="none"></div><button class="btn" onclick="WSX.chk()">'+tx("Check","जाँचें")+'</button><button class="btn ghost" onclick="WS.done(WSX.cur)">'+tx("Show my words again","मेरे शब्द फिर दिखाइए")+'</button>');
};
WSX.chk=function(){var w=(WSX.cur||"").split(" "),a=WSX.q[0],b=WSX.q[1],x=($("wsQ1").value||"").trim().toLowerCase(),y=($("wsQ2").value||"").trim().toLowerCase();
  if(x===w[a-1]&&y===w[b-1]){WSX.cur=null;toast(tx("Wallet created","वॉलेट बन गया"));if(window.AFTER37)AFTER37();else{bSh(0);connectWallet()}}else toast(tx("Not matching. Check your paper.","मेल नहीं खाया। अपना कागज़ देखिए।"),4000)};
WS.show=function(){bSh(1);guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.phrase(p)},function(ph){bT(tx("Your 12 words","आपके 12 शब्द"));bB(RISK()+wordsHTML(ph)+'<button class="btn ghost" onclick="WS.hide()">'+tx("Done","हो गया")+'</button>')})};

/* ---------- fingerprint (WebAuthn + PRF). The PIN always keeps working. ---------- */
var BKS="cp3_bio_ks",BID="cp3_bio_id",BMD="cp3_bio_mode",enc=new TextEncoder(),SALT=enc.encode("Tazvera bio unlock v1 / wallet key");
function b64u(b){var s="";new Uint8Array(b).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var r=atob(s),u=new Uint8Array(r.length);for(var i=0;i<r.length;i++)u[i]=r.charCodeAt(i);return u}
function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")}
var BIO=window.BIO={_p:null,
  on:function(){try{return!!localStorage.getItem(BID)&&(!!localStorage.getItem(BKS)||localStorage.getItem(BMD)==="gate")}catch(e){return false}},
  full:function(){try{return!!(localStorage.getItem(BID)&&localStorage.getItem(BKS))}catch(e){return false}},
  ok:async function(){try{return!!(window.PublicKeyCredential&&navigator.credentials&&window.isSecureContext&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())}catch(e){return false}},
  prf:async function(id){var a=await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rpId:location.hostname,allowCredentials:[{type:"public-key",id:unb64u(id)}],userVerification:"required",timeout:60000,extensions:{prf:{eval:{first:SALT}}}}});
    var r=a&&a.getClientExtensionResults&&a.getClientExtensionResults().prf;if(!r||!r.results||!r.results.first)throw new Error("prf unsupported");return hex(r.results.first)},
  /* "full": fingerprint also unlocks the wallet key. "gate": fingerprint only opens the app screen (the wallet PIN is still asked when sending). */
  enable:async function(mnemonic){
    var cred=await navigator.credentials.create({publicKey:{rp:{name:"Tazvera",id:location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"tazvera-wallet",displayName:"Tazvera wallet"},challenge:crypto.getRandomValues(new Uint8Array(32)),pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"discouraged"},timeout:60000,attestation:"none",extensions:{prf:{}}}});
    var id=b64u(cred.rawId),ext=cred.getClientExtensionResults?cred.getClientExtensionResults():{};
    if(ext.prf&&ext.prf.enabled){try{var secret=await BIO.prf(id),w=E.Wallet.fromPhrase(mnemonic),js=await E.encryptKeystoreJson({address:w.address,privateKey:w.privateKey},secret,{scrypt:{N:16384}});localStorage.setItem(BID,id);localStorage.setItem(BKS,js);localStorage.removeItem(BMD);return"full"}catch(e){}}
    localStorage.setItem(BID,id);localStorage.removeItem(BKS);localStorage.setItem(BMD,"gate");return"gate"},
  unlock:function(){
    if(BIO._p)return BIO._p;
    BIO._p=(async function(){var id=localStorage.getItem(BID);if(!id)throw new Error("not enabled");
      if(BIO.full()){var secret=await BIO.prf(id);await CPW.unlockKs(localStorage.getItem(BKS),secret,CPW.address());return}
      await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rpId:location.hostname,allowCredentials:[{type:"public-key",id:unb64u(id)}],userVerification:"required",timeout:60000}})})().then(function(){BIO._p=null},function(e){BIO._p=null;throw e});
    return BIO._p},
  off:function(){["cp3_bio_ks","cp3_bio_id","cp3_bio_mode"].forEach(function(k){try{localStorage.removeItem(k)}catch(e){}})}
};
["create","imp","remove"].forEach(function(k){var f=CPW[k];CPW[k]=function(){BIO.off();return f.apply(this,arguments)}});

/* ---------- wallet unlock: fingerprint first (if on), PIN as fallback ---------- */
WS.unlock=function(){return new Promise(function(res){
  bSh(1);
  function pin(){guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.unlock(p)},function(r,pn){try{if(window.BIO&&BIO.on()&&!BIO.canWallet()&&BIO.vaultSave)BIO.vaultSave(pn).catch(function(){})}catch(e){}bSh(0);res(true)});
    window.__wsBio=bio}
  function bio(){BIO.unlock().then(function(){bSh(0);res(true)},function(){toast(tx("Fingerprint did not work. Use your PIN.","फिंगरप्रिंट नहीं चला। PIN डालिए।"),4000);pin()})}
  pin();
})};

/* ---------- fingerprint on/off in Settings > Security ---------- */
window.BIOUI={toggle:async function(){
  if(BIO.on()){if(confirm(tx("Turn off fingerprint?","फिंगरप्रिंट बंद करें?"))){BIO.off();toast(tx("Fingerprint is off","फिंगरप्रिंट बंद"));SB.r()}return}
  if(!await BIO.ok()){toast(tx("Fingerprint is not available on this phone or browser. Please use your PIN.","इस फ़ोन या ब्राउज़र में फिंगरप्रिंट उपलब्ध नहीं है। कृपया PIN इस्तेमाल करें।"),5500);return}
  bSh(1);guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.phrase(p)},function(mn,pn){
    busy(tx("Touch your fingerprint sensor…","फिंगरप्रिंट सेंसर पर उँगली रखिए…"));
    BIO.enable(mn,pn).then(function(mode){bSh(0);var pinOn=!!(typeof ls!=="undefined"&&ls.get("xt_pin",""));
      toast((mode==="full"||mode==="vault")?tx("Fingerprint is on. It opens the app and your wallet.","फिंगरप्रिंट चालू। यह ऐप और वॉलेट दोनों खोलेगा।"):(pinOn?tx("Fingerprint is on. It opens the app. Sending still asks for your wallet PIN.","फिंगरप्रिंट चालू। यह ऐप खोलेगा। भेजते समय वॉलेट PIN फिर भी माँगेगा।"):tx("Fingerprint is on. Now turn on PIN lock below, so the app has a lock to open.","फिंगरप्रिंट चालू। अब नीचे PIN lock चालू कीजिए, ताकि ऐप में खोलने के लिए लॉक रहे।")),8000);SB.r()},
    function(e){bSh(0);toast(tx("Fingerprint was cancelled. Your PIN still works.","फिंगरप्रिंट रद्द हुआ। PIN चलता रहेगा।"),5500)})});
}};
var _sbr=SB.r;SB.r=function(){_sbr.apply(this,arguments);try{
  if($("stt").textContent==="Security"&&window.CPW&&CPW.has()&&!$("bioRow")){
    $("sbody").insertAdjacentHTML("afterbegin",'<div class="sr" id="bioRow" onclick="BIOUI.toggle()"><span class="sl">'+(BIO.on()&&!BIO.canWallet()?tx("Open app with fingerprint or phone lock","फिंगरप्रिंट या फ़ोन-लॉक से ऐप खोलें"):tx("Unlock with fingerprint or phone lock","फिंगरप्रिंट या फ़ोन-लॉक से खोलें"))+' <small style="opacity:.7">(beta)</small></span><span class="sw'+(BIO.on()?" on":"")+'"></span></div>')}}catch(e){}};
/* fingerprint on the app lock screen too: one touch opens the app and the wallet */
(function(){var lk=$("xtLock");if(!lk)return;var auto=false;
  var b=document.createElement("button");b.id="xtBio";b.className="btn ghost";b.style.cssText="display:none;width:200px;margin-top:8px";b.onclick=function(){BIO.unlock().then(function(){lk.style.display="none";document.dispatchEvent(new Event("click"))},function(){toast(tx("Fingerprint did not work. Use your PIN.","फिंगरप्रिंट नहीं चला। PIN डालिए।"),4000)})};lk.appendChild(b);
  new MutationObserver(function(){if(lk.style.display==="flex"){b.textContent=tx("Use fingerprint","फिंगरप्रिंट इस्तेमाल करें");b.style.display="none";auto=true;}else auto=false}).observe(lk,{attributes:true,attributeFilter:["style"]});
})();

/* ---------- wallet locks itself: after 60 s in the background or 5 minutes idle ---------- */
var hid=0,act=Date.now();
["click","touchstart","keydown"].forEach(function(ev){document.addEventListener(ev,function(){act=Date.now()},{passive:true})});
function lockWallet(){if(CPW.has()&&CPW.unlocked())CPW.lock()}
document.addEventListener("visibilitychange",function(){if(document.hidden)hid=Date.now();else{if(hid&&Date.now()-hid>60000)lockWallet();hid=0}});
setInterval(function(){if(Date.now()-act>300000)lockWallet()},15000);
var PR=window.ethereum;if(PR&&PR.isCpWallet){var _rq=PR.request.bind(PR);PR.request=async function(a){if(a&&a.method==="eth_sendTransaction"){if(window.__wu){try{await window.__wu}catch(e){}}if(!CPW.unlocked()){var ok=await WS.unlock();if(!ok)throw{code:4001,message:"Cancelled"}}}return _rq(a)}}

/* ---------- safer sending ---------- */
var _dsD=doSend;doSend=async function(){
  var t=window.XA&&XA.tok&&XA.tok();
  if(t){try{var d=parseInt(await ethereum.request({method:"eth_call",params:[{to:t.addr,data:"0x313ce567"},"latest"]}),16);
    if(!(d>=0&&d<=36)||d!==(t.decimals||18)){try{readCustomBalances()}catch(e){}return sendMsg(tx("Checking this token's details. Please try again in a few seconds.","इस टोकन की जानकारी जाँच रहे हैं। कुछ सेकंड बाद फिर कोशिश कीजिए।"))}}
    catch(e){return sendMsg(tx("Could not check this token. Please try again.","इस टोकन की जाँच नहीं हो सकी। फिर कोशिश कीजिए।"))}}
  return _dsD.apply(this,arguments)};
function realBanner(){var r=document.querySelector("#sheetSend .risk"),n=NETWORKS[currentNet];if(!r||!n)return;
  if(!/testnet|sepolia/.test(currentNet)){r.textContent=tx("REAL MONEY on "+n.name+". Check the address and amount in your wallet before you confirm. Sent coins cannot be returned. This app is still a test version.","असली पैसा: "+n.name+"। Confirm करने से पहले अपने वॉलेट में पता और रकम जाँचिए। भेजे गए सिक्के वापस नहीं आते। यह ऐप अभी टेस्ट वर्शन है।");r.classList.add("real")}else r.classList.remove("real")}
var _os32=openSend;openSend=async function(){await _os32.apply(this,arguments);realBanner()};
if(window.XA&&XA.pick){var _pk32=XA.pick;XA.pick=function(){_pk32.apply(this,arguments);realBanner()}}

window.WSH={ask:ask,busy:busy,guarded:guarded,bT:bT,bB:bB,bSh:bSh};
/* ---------- no wallet PIN at app start; it is asked when you send ---------- */
var lazy=false,_un33=WS.unlock;WS.unlock=function(){if(lazy)return Promise.resolve(true);return _un33.apply(this,arguments)};
var _c33=connectWallet;connectWallet=async function(){lazy=true;try{return await _c33.apply(this,arguments)}finally{lazy=false}};
})();

/* ===== Part 34: the app's own PIN keypad, with a fingerprint key ===== */
(function(){
"use strict";
var tx=function(e,h){return lang==="en"?e:h};
var FP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5a8.5 8.5 0 0 0-8.5 8.5v1"/><path d="M12 6.8a5.2 5.2 0 0 0-5.2 5.2v2.3a4.2 4.2 0 0 0 .7 2.3"/><path d="M12 10a2 2 0 0 0-2 2v2.2a6 6 0 0 0 1.6 4"/><path d="M15 12v1.6a8.4 8.4 0 0 1-1.4 4.5"/><path d="M18.2 11.4V13a11 11 0 0 1-1.7 5.8"/><path d="M20.5 12A8.5 8.5 0 0 0 15.2 4.2"/></svg>';
var BS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5H9l-6 7 6 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M13 9.5l4 5M17 9.5l-4 5"/></svg>';
function showFp(id){return!!(window.CPW&&CPW.has())}
function refresh(){document.querySelectorAll(".kp").forEach(function(kp){var b=kp.querySelector(".fp");if(b)b.style.visibility=showFp(kp.getAttribute("data-for"))?"visible":"hidden"})}
function fp(id){
  if(!BIO.on()){var om=tx("Fingerprint is off. After you open the app, turn it on in Settings > Security.","फिंगरप्रिंट बंद है। ऐप खुलने के बाद Settings > Security में चालू कीजिए।");if(id==="xtPin"&&window.lockMsg)lockMsg(om);else toast(om,5000);return}
  if(id==="xtPin"){var b=$("xtBio");if(b&&b.onclick)b.onclick();return}
  if(id==="wsPin"){if(BIO.canWallet()&&window.__wsBio)window.__wsBio();else toast(tx("Fingerprint cannot open the wallet here. Please enter your PIN.","यहाँ फिंगरप्रिंट वॉलेट नहीं खोल सकता। कृपया PIN डालिए।"),5000);return}
  toast(tx("Fingerprint is already on.","फिंगरप्रिंट पहले से चालू है।"),3000)}
function inject(){
  document.querySelectorAll(".pinw").forEach(function(w){
    var inp=w.querySelector(".pin-h");if(!inp)return;var n=w.nextElementSibling;if(n&&n.classList.contains("kp"))return;
    inp.setAttribute("inputmode","none");inp.readOnly=true;
    var kp=document.createElement("div");kp.className="kp";kp.setAttribute("data-for",inp.id);
    kp.innerHTML=["1","2","3","4","5","6","7","8","9","fp","0","bs"].map(function(k){
      return k==="fp"?'<button type="button" class="pk fp" aria-label="Fingerprint">'+FP+'</button>':k==="bs"?'<button type="button" class="pk bs" aria-label="Delete">'+BS+'</button>':'<button type="button" class="pk" data-k="'+k+'">'+k+'</button>'}).join("");
    w.insertAdjacentElement("afterend",kp);
    kp.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;e.preventDefault();
      if(b.classList.contains("fp")){fp(inp.id);return}
      if(b.classList.contains("bs")){inp.value=inp.value.slice(0,-1);PB(inp);return}
      if(inp.value.length<6){inp.value+=b.getAttribute("data-k");PB(inp)}});
    refresh()})
}
new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
var lk=$("xtLock");if(lk)new MutationObserver(refresh).observe(lk,{attributes:true,attributeFilter:["style"]});
setInterval(refresh,1500);inject();
function activeInp(){var l=$("xtLock");if(l&&l.style.display==="flex")return $("xtPin");var pa=$("pinAsk");if(pa&&pa.classList.contains("open"))return $("paIn");var sw=$("sheetWallet");if(sw&&sw.classList.contains("open"))return $("wsPin");return null}
document.addEventListener("keydown",function(e){var inp=activeInp();if(!inp)return;
  if(/^\d$/.test(e.key)){e.preventDefault();if(inp.value.length<6){inp.value+=e.key;PB(inp)}}
  else if(e.key==="Backspace"){e.preventDefault();inp.value=inp.value.slice(0,-1);PB(inp)}},true);
})();

/* ===== Part 35: "Lock app now" button in Security, so the lock screen (and its fingerprint key) can be seen at once ===== */
(function(){
"use strict";
if(!window.SB)return;
var tx=function(e,h){return lang==="en"?e:h};
window.LOCKNOW=function(){
  if(!(typeof ls!=="undefined"&&ls.get("xt_pin",""))){toast(tx("First turn on PIN lock below.","पहले नीचे PIN lock चालू कीजिए।"),4500);return}
  var lk=$("xtLock");if(!lk)return;lk.style.display="flex";var i=$("xtPin");if(i){i.value="";try{PB(i)}catch(e){}}
};
var _r=SB.r;SB.r=function(){_r.apply(this,arguments);try{
  var b=$("bioRow");if(b&&!$("lockNowRow")){
    var pin=!!(typeof ls!=="undefined"&&ls.get("xt_pin",""));
    b.insertAdjacentHTML("afterend",'<div class="sr" id="lockNowRow" onclick="LOCKNOW()"><span class="sl">'+tx("Lock app now","ऐप अभी लॉक करें")+'</span><span style="opacity:.65;font-size:12.5px">'+(pin?tx("PIN lock is on","PIN lock चालू है"):tx("Turn on PIN lock first","पहले PIN lock चालू कीजिए"))+'</span></div>')}
}catch(e){}};
})();

/* ===== Part 36: fingerprint key works everywhere; on phones without the secure feature the fingerprint releases your PIN from a protected store in the phone ===== */
(function(){
"use strict";
if(!window.BIO||!window.CPW)return;
var tx=function(e,h){return lang==="en"?e:h};
var VK="cp3_bio_vault";
function b64u(b){var s="";new Uint8Array(b).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var r=atob(s),u=new Uint8Array(r.length);for(var i=0;i<r.length;i++)u[i]=r.charCodeAt(i);return u}
function idb(){return new Promise(function(res,rej){var r=indexedDB.open("cp3_vault",1);r.onupgradeneeded=function(){r.result.createObjectStore("k")};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
function idbPut(key){return idb().then(function(db){return new Promise(function(res,rej){var t=db.transaction("k","readwrite");t.objectStore("k").put(key,"k");t.oncomplete=function(){res()};t.onerror=function(){rej(t.error)}})})}
function idbGet(){return idb().then(function(db){return new Promise(function(res,rej){var q=db.transaction("k","readonly").objectStore("k").get("k");q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}})})}
function idbDel(){return idb().then(function(db){return new Promise(function(res){var t=db.transaction("k","readwrite");t.objectStore("k").delete("k");t.oncomplete=function(){res()};t.onerror=function(){res()}})})}
BIO.hasVault=function(){try{return!!localStorage.getItem(VK)}catch(e){return false}};
BIO.canWallet=function(){return BIO.full()||BIO.hasVault()};
BIO.vaultSave=async function(pin){
  var key=await crypto.subtle.generateKey({name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  var iv=crypto.getRandomValues(new Uint8Array(12)),ct=await crypto.subtle.encrypt({name:"AES-GCM",iv:iv},key,new TextEncoder().encode(pin));
  await idbPut(key);localStorage.setItem(VK,JSON.stringify({iv:b64u(iv),ct:b64u(ct)}))};
BIO.vaultOpen=async function(){
  var v=JSON.parse(localStorage.getItem(VK)||"null");if(!v)throw new Error("no vault");var key=await idbGet();if(!key)throw new Error("no key");
  return new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64u(v.iv)},key,unb64u(v.ct)))};
BIO.dropVault=function(){try{localStorage.removeItem(VK)}catch(e){}try{idbDel()}catch(e){}};
var _en=BIO.enable;
BIO.enable=async function(mnemonic,pin){var mode=await _en.call(BIO,mnemonic);if(mode==="gate"&&pin){try{await BIO.vaultSave(pin);return"vault"}catch(e){BIO.dropVault()}}return mode};
var _un=BIO.unlock;
BIO.unlock=function(){
  if(BIO._p)return BIO._p;
  if(BIO.full()||!BIO.hasVault())return _un.call(BIO);
  BIO._p=(async function(){
    var id=localStorage.getItem("cp3_bio_id");if(!id)throw new Error("not enabled");
    await navigator.credentials.get({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rpId:location.hostname,allowCredentials:[{type:"public-key",id:unb64u(id)}],userVerification:"required",timeout:60000}});
    var pin=await BIO.vaultOpen();try{await CPW.unlock(pin)}catch(e){BIO.dropVault();throw e}
  })().then(function(){BIO._p=null},function(e){BIO._p=null;throw e});
  return BIO._p};
var _off=BIO.off;BIO.off=function(){_off.call(BIO);BIO.dropVault()};
})();

/* ===== Part 37: app lock starts with the account, fingerprint step, messages visible on the lock screen, wrong-PIN limit on the app PIN ===== */
(function(){
"use strict";
if(!window.CPW||!window.WS||!window.BIO||!window.WSH)return;
var tx=function(e,h){return lang==="en"?e:h};
var H=window.WSH,A37={};window.A37=A37;
function wt(ms){var s=Math.ceil(ms/1000);return s>=60?Math.ceil(s/60)+(lang==="en"?" min":" मिनट"):s+(lang==="en"?" s":" सेकंड")}
/* ---- a message line inside the lock screen (the normal toast hides behind it) ---- */
var lk=$("xtLock");
if(lk&&!$("xtMsg")){var mg=document.createElement("div");mg.id="xtMsg";mg.style.cssText="min-height:20px;font-size:13.5px;font-weight:700;text-align:center;color:#ff8f8f;padding:2px 10px;max-width:300px";lk.insertBefore(mg,lk.lastElementChild)}
window.lockMsg=function(t){var e=$("xtMsg");if(e)e.textContent=t||""};
/* ---- wrong-PIN limit for the app PIN (5 tries, then 30 s, 1 min, 5 min, 15 min, 1 h) ---- */
var AF="cp3_apppinfail",ST=[30,60,300,900,3600];
function afGet(){try{return JSON.parse(localStorage.getItem(AF)||"{}")||{}}catch(e){return{}}}
function afLeft(){return Math.max(0,(afGet().until||0)-Date.now())}
function afBad(){var o=afGet();o.n=(o.n||0)+1;if(o.n>=5)o.until=Date.now()+ST[Math.min(o.n-5,ST.length-1)]*1000;try{localStorage.setItem(AF,JSON.stringify(o))}catch(e){}return o}
function afOk(){try{localStorage.removeItem(AF)}catch(e){}}
XT.un=function(){
  var inp=$("xtPin"),v=inp?inp.value:"",l=afLeft();
  if(l>0){lockMsg(tx("Too many wrong PINs. Please wait ","बहुत ज़्यादा गलत PIN। रुकिए: ")+wt(l));return}
  if(btoa(v+"cp")===ls.get("xt_pin","")){afOk();lockMsg("");lk.style.display="none";document.dispatchEvent(new Event("click"))}
  else{var o=afBad();lockMsg(o.n>=5?tx("Too many wrong PINs. Please wait ","बहुत ज़्यादा गलत PIN। रुकिए: ")+wt(afLeft()):tx("Wrong PIN. "+(5-o.n)+" tries left.","गलत PIN। "+(5-o.n)+" मौके बचे।"))}
};
/* ---- remember the PIN and the 12 words only for the next few seconds after an account is made ---- */
var _cc=CPW.create;CPW.create=function(pin){return _cc.apply(this,arguments).then(function(p){window.__acct={pin:pin,mn:p,fresh:true};return p})};
var _ci=CPW.imp;CPW.imp=function(t,pin){return _ci.apply(this,arguments).then(function(r){window.__acct={pin:pin,mn:String(t).trim().toLowerCase().split(/\s+/).join(" "),fresh:true};return r})};
var realConnect=connectWallet;
connectWallet=async function(){if(window.__acct&&window.__acct.fresh){window.AFTER37();return}return realConnect.apply(this,arguments)};
function finish(msg,noConnect){window.__acct=null;H.bSh(0);if(msg)toast(msg,5000);if(!noConnect){try{realConnect()}catch(e){}}}
/* ---- after an account is made (new wallet, or 12 words imported): app lock on with the same PIN, then offer the fingerprint ---- */
window.AFTER37=async function(noConnect){
  var a=window.__acct;if(!a||!a.pin){finish("",noConnect);return}
  a.fresh=false;
  try{await A41.setPin(a.pin);if(ls.get("xt_am",null)===null)ls.set("xt_am",1)}catch(e){}
  var can=false;try{can=await BIO.ok()}catch(e){}
  if(!can){finish(tx("Wallet ready. The app lock is on with your PIN.","वॉलेट तैयार। आपके PIN से ऐप-लॉक चालू है।"),noConnect);return}
  A37.nc=!!noConnect;H.bSh(1);H.bT(tx("Protect your wallet","अपना वॉलेट सुरक्षित करें"));
  H.bB('<div class="cap" style="text-align:left;line-height:1.55;margin:2px 0 14px">'+tx("Your PIN now also locks this app. When you open it again, or the phone screen locks, it asks for the PIN. Turn on fingerprint, and one touch is enough.","आपका PIN अब इस ऐप को भी लॉक करेगा। ऐप दोबारा खोलने पर या फ़ोन की स्क्रीन बंद होने के बाद यह PIN माँगेगा। फिंगरप्रिंट चालू कर लें तो एक उँगली काफ़ी है।")+'</div><button class="btn" onclick="A37.on()">'+tx("Turn on fingerprint","फिंगरप्रिंट चालू करें")+'</button><button class="btn ghost" onclick="A37.skip()">'+tx("Not now","अभी नहीं")+'</button>')
};
A37.on=function(){var a=window.__acct;if(!a){finish("",A37.nc);return}
  H.busy(tx("Touch your fingerprint sensor…","फिंगरप्रिंट सेंसर पर उँगली रखिए…"));
  BIO.enable(a.mn,a.pin).then(function(mode){finish((mode==="full"||mode==="vault")?tx("Fingerprint is on. It opens the app and your wallet.","फिंगरप्रिंट चालू। यह ऐप और वॉलेट दोनों खोलेगा।"):tx("Fingerprint is on. It opens the app.","फिंगरप्रिंट चालू। यह ऐप खोलेगा।"),A37.nc)},
  function(){finish(tx("Fingerprint was not turned on. You can do it later in Settings > Security.","फिंगरप्रिंट चालू नहीं हुआ। बाद में Settings > Security में कर सकते हैं।"),A37.nc)})};
A37.skip=function(){finish(tx("App lock is on with your PIN.","आपके PIN से ऐप-लॉक चालू है।"),A37.nc)};
/* ---- an account that already exists: ask once (again after 7 days if the answer is "Not now") ---- */
window.EXIST37=function(){
  try{if(!CPW.has()||ls.get("xt_pin",""))return;var f=+(localStorage.getItem("cp3_setup37")||0);if(f&&Date.now()-f<604800000)return;
    var l=$("xtLock");if(l&&l.style.display==="flex")return;var sw=$("sheetWallet");if(sw&&sw.classList.contains("open"))return}catch(e){return}
  H.bSh(1);H.bT(tx("Protect your app","अपना ऐप सुरक्षित करें"));
  H.bB('<div class="cap" style="text-align:left;line-height:1.55;margin:2px 0 14px">'+tx("Use your wallet PIN to lock the app too, and turn on fingerprint. Then the app asks for the PIN or fingerprint every time you come back.","अपने वॉलेट PIN से ऐप को भी लॉक करें और फिंगरप्रिंट चालू करें। फिर ऐप में हर बार वापस आने पर PIN या फिंगरप्रिंट माँगेगा।")+'</div><button class="btn" onclick="A37.setup()">'+tx("Set up now","अभी चालू करें")+'</button><button class="btn ghost" onclick="A37.later()">'+tx("Not now","अभी नहीं")+'</button>')};
A37.setup=function(){H.guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.phrase(p)},function(mn,pin){window.__acct={pin:pin,mn:mn,fresh:false};window.AFTER37(true)})};
A37.later=function(){try{localStorage.setItem("cp3_setup37",String(Date.now()))}catch(e){}H.bSh(0)};
setTimeout(window.EXIST37,3500);
})();

/* ===== Part 38: screens open on top of Settings, Lock now, forgot-PIN way out, old fingerprint upgrades itself, Tazvera Helper ===== */
(function(){
"use strict";
if(!window.CPW||!window.WSH||!window.SB)return;
var tx=function(e,h){return lang==="en"?e:h};
var H=window.WSH,A38=window.A38={};
/* ---- styles (inside this file, so only script.js needs uploading) ---- */
var st=document.createElement("style");
st.textContent='#sheetSet{z-index:90!important}#sheetWallet{z-index:110!important}'
+'#hbBtn{position:fixed;right:14px;bottom:100px;width:38px;height:34px;padding:0;border:1px solid var(--ln);border-radius:12px;background:var(--glass);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:grid;place-items:center;z-index:125;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;box-shadow:0 3px 12px rgba(0,0,0,.28)}#hbBtn::before{content:"";position:absolute;inset:-8px}#hbBtn:active{cursor:grabbing}#hbBtn svg{width:26px;height:26px;pointer-events:none}'
+'#hbTip{position:fixed;z-index:126;max-width:190px;background:var(--glass);border:1px solid var(--ln);color:inherit;padding:8px 11px;border-radius:12px;font-size:12.5px;font-weight:700;line-height:1.4;box-shadow:0 6px 20px rgba(0,0,0,.35);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}@keyframes hbp{0%{box-shadow:0 0 0 0 rgba(45,212,191,.7)}100%{box-shadow:0 0 0 16px rgba(45,212,191,0)}}#hbBtn.pulse{animation:hbp 1.4s ease-out infinite}#hbBack{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:149;display:none}'
+'#hbPanel{position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:420px;height:74vh;z-index:150;display:none;flex-direction:column;background:var(--sf,#12161c);color:inherit;border-radius:24px 24px 0 0;border:1px solid var(--ln,#22345C);box-shadow:0 -10px 40px rgba(0,0,0,.45)}'
+'#hbPanel.open,#hbBack.open{display:flex}#hbBack.open{display:block}'
+'.hbh{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--ln,#22345C)}.hbh svg{width:30px;height:30px;flex:none}.hbh b{font-size:16px}.hbh small{display:block;opacity:.7;font-size:12px}.hbh button{margin-left:auto;background:none;border:0;color:inherit;font-size:26px;line-height:1;cursor:pointer;padding:4px 8px}'
+'#hbMsgs{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:10px}'
+'.hbm{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.5;white-space:pre-line;word-wrap:break-word}.hbm.b{align-self:flex-start;background:var(--bg,#0B1222);border:1px solid var(--ln,#22345C)}.hbm.u{align-self:flex-end;background:linear-gradient(135deg,#3F7DFF,#2B5BE6);color:#fff}.hbm a{color:#6FA0FF;text-decoration:underline}'
+'#hbChips{display:flex;flex-wrap:wrap;gap:7px;padding:6px 14px 8px;max-height:112px;overflow-y:auto}#hbChips button{border:1px solid var(--ln,#22345C);background:var(--bg,#0B1222);color:inherit;border-radius:999px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer}'
+'.hbi{display:flex;gap:8px;padding:8px 12px 14px}.hbi input{flex:1;padding:12px 14px;border-radius:14px;border:1px solid var(--ln,#22345C);background:var(--bg,#0B1222);color:inherit;font-size:15px;min-width:0}.hbi button{border:0;border-radius:14px;padding:0 18px;background:linear-gradient(135deg,#3F7DFF,#2B5BE6);color:#fff;font-weight:700;font-size:14px;cursor:pointer}';
document.head.appendChild(st);
/* ---- Lock now: locks the wallet and shows the lock screen; the separate Lock wallet row is hidden ---- */
window.LOCKNOW=function(){
  try{CPW.lock()}catch(e){}
  var has=(typeof ls!=="undefined")&&ls.get("xt_pin","");
  if(!has){toast(tx("Wallet locked. The PIN is asked when you send.","वॉलेट लॉक हो गया। भेजते समय PIN माँगेगा।"),4500);try{SB.r()}catch(e){}return}
  var lk=$("xtLock");if(lk){lk.style.display="flex";var i=$("xtPin");if(i){i.value="";try{PB(i)}catch(e){}}}
};
A38.samePin=function(){H.bSh(1);H.guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.phrase(p)},function(mn,pin){A41.setPin(pin).then(function(){H.bSh(0);toast(tx("Done. The app lock now uses your wallet PIN.","हो गया। अब ऐप-लॉक वॉलेट वाला PIN ही इस्तेमाल करेगा।"),5000)})})};
var _r38=SB.r;SB.r=function(){_r38.apply(this,arguments);try{
  var b=$("sbody");if(!b)return;
  b.querySelectorAll(".sr").forEach(function(r){var oc=r.getAttribute("onclick")||"";if(oc.indexOf("CPW.lock()")>-1)r.style.display="none"});
  var ln=$("lockNowRow");
  if(ln){var sl=ln.querySelector(".sl");if(sl)sl.textContent=tx("Lock now (app and wallet)","अभी लॉक करें (ऐप और वॉलेट)");
    if(!$("samePinRow")&&(typeof ls!=="undefined")&&ls.get("xt_pin","")&&CPW.has())ln.insertAdjacentHTML("afterend",'<div class="sr" id="samePinRow" onclick="A38.samePin()"><span class="sl">'+tx("Use my wallet PIN for app lock","ऐप-लॉक के लिए वॉलेट वाला PIN इस्तेमाल करें")+'</span></div>')}
  if($("stt")&&$("stt").textContent==="Settings"&&!$("hbRow"))b.insertAdjacentHTML("afterbegin",'<div class="sr" id="hbRow" onclick="HB.open()"><span class="sl">'+tx("Ask Tazvera Helper","Tazvera सहायक से पूछें")+'</span></div>');
}catch(e){}};
/* ---- forgot the wallet PIN: the only way is the 12 words ---- */
WSX.forgot=function(){H.bT(tx("Forgot your PIN?","PIN भूल गए?"));
  H.bB('<div class="risk">'+tx("The PIN cannot be reset without your 12 words. If you have them on paper, you can make the wallet again with a new PIN. First the wallet is removed from this phone. Your coins stay on the network and come back with the same 12 words. Without the 12 words the wallet cannot be recovered.","12 शब्दों के बिना PIN बदला नहीं जा सकता। अगर वे कागज़ पर हैं, तो उनसे वॉलेट नए PIN के साथ दोबारा बना सकते हैं। पहले यह वॉलेट इस फ़ोन से हट जाता है। आपके सिक्के नेटवर्क पर ही रहते हैं और वही 12 शब्द डालने पर वापस आ जाते हैं। 12 शब्द न हों तो वॉलेट वापस नहीं आ सकता।")+'</div><label class="xt-o" style="display:block;margin:12px 0"><input type="checkbox" id="fgOk" style="width:auto;margin-right:8px">'+tx("I have my 12 words on paper","मेरे पास 12 शब्द कागज़ पर हैं")+'</label><button class="btn" onclick="WSX.forgot2()">'+tx("Make the wallet again from my 12 words","12 शब्दों से वॉलेट दोबारा बनाएँ")+'</button><button class="btn ghost" onclick="WSX.forgot3()">'+tx("Back","वापस")+'</button>')};
WSX.forgot2=function(){var c=$("fgOk");if(!c||!c.checked)return toast(tx("Please tick the box first","पहले डिब्बे पर निशान लगाइए"));try{CPW.remove();if(window.BIO)BIO.off();ls.set("xt_pin","")}catch(e){}window.__acct=null;WS.imp()};
WSX.forgot3=function(){H.bSh(0)};
/* ---- auto-lock: older accounts had 10 minutes; once, make it 2 ---- */
try{if(!localStorage.getItem("cp3_am38")){localStorage.setItem("cp3_am38","1");if(+ls.get("xt_am",10)===10)ls.set("xt_am",2)}}catch(e){}
/* ---- Tazvera Helper: ready-made answers in 4 languages, free, nothing is sent anywhere ---- */
var ROBOT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="6" width="15" height="13" rx="4.4"/><path d="M2.7 11 V14.6 M21.3 11 V14.6"/><circle cx="9.1" cy="12" r="1.9" fill="#5EEAD4" stroke="none"/><circle cx="14.9" cy="12" r="1.9" fill="#5EEAD4" stroke="none"/><circle cx="9.6" cy="11.4" r=".55" fill="#fff" stroke="none"/><circle cx="15.4" cy="11.4" r=".55" fill="#fff" stroke="none"/><path d="M8.8 15.9 Q12 18.4 15.2 15.9" stroke="#5EEAD4" stroke-width="1.9"/></svg>';
var TG="https://t.me/TazveraApp";
var LG=["hi","en","mr","gu"],LN={en:"English",hi:"हिंदी",mr:"मराठी",gu:"ગુજરાતી"},VL={en:"en-IN",hi:"hi-IN",mr:"mr-IN",gu:"gu-IN"};
var UI={
 en:{t:"Tazvera Helper",s:"",g:"Hello! I am the Tazvera Helper. I give ready-made answers about the app. Choose a question below or type your own. Tip: tap the speaker under an answer to hear it.",ph:"Type your question",sd:"Send",u:"I do not know this one. Please ask on Telegram:",nv:"This phone has no voice for this language."},
 hi:{t:"Tazvera सहायक",s:"",g:"नमस्ते! मैं Tazvera सहायक हूँ। मैं ऐप के बारे में तैयार जवाब देता हूँ। नीचे से सवाल चुनिए या अपना लिखिए। सुझाव: जवाब के नीचे 🔊 दबाकर सुन भी सकते हैं।",ph:"अपना सवाल लिखिए",sd:"भेजें",u:"यह मुझे नहीं आता। कृपया Telegram पर पूछिए:",nv:"इस फ़ोन में इस भाषा की आवाज़ नहीं है।"},
 mr:{t:"Tazvera सहाय्यक",s:"",g:"नमस्कार! मी Tazvera सहाय्यक आहे. मी अ‍ॅपबद्दल तयार उत्तरे देतो. खालून प्रश्न निवडा किंवा तुमचा स्वतःचा लिहा. सूचना: उत्तराखालील 🔊 दाबून ऐकताही येते.",ph:"तुमचा प्रश्न लिहा",sd:"पाठवा",u:"हे मला माहीत नाही. कृपया Telegram वर विचारा:",nv:"या फोनमध्ये या भाषेचा आवाज नाही."},
 gu:{t:"Tazvera સહાયક",s:"",g:"નમસ્તે! હું Tazvera સહાયક છું. હું એપ વિશે તૈયાર જવાબો આપું છું. નીચેથી પ્રશ્ન પસંદ કરો અથવા તમારો લખો. સૂચન: જવાબની નીચે 🔊 દબાવીને સાંભળી પણ શકાય.",ph:"તમારો પ્રશ્ન લખો",sd:"મોકલો",u:"આ મને ખબર નથી. કૃપા કરીને Telegram પર પૂછો:",nv:"આ ફોનમાં આ ભાષાનો અવાજ નથી."}
};
var T=[
{n:1,k:["your name","who are you","what can you do","what do you do","hello","hi","hey","namaste","नमस्ते","नमस्कार","નમસ્તે","तुम्हारा नाम","आपका नाम","तुम कौन","आप कौन","क्या कर सकते","क्या कर सकता","तुमचे नाव","तुझे नाव","तू कोण","तुम्ही कोण","काय करू शकता","તમારું નામ","તમારુ નામ","તમારું નામ શું","નામ શું છે","તમે કોણ","શું કરી શકો","tumhara naam","aapka naam","tum kaun","aap kaun","kya kar sakte"],
 q:{en:"",hi:"",mr:"",gu:""},
 a:{en:"I am the Tazvera Helper, a small helper inside the app. I am not a real AI. I give ready-made answers about the PIN, the 12 words, free test TZT, sending, scanning, safety and more. Tap a question below or type your own.",
    hi:"मैं Tazvera सहायक हूँ, ऐप के अंदर का छोटा सहायक। मैं असली AI नहीं हूँ। मैं PIN, 12 शब्द, मुफ़्त टेस्ट TZT, भेजना, स्कैन, सुरक्षा और बाकी चीज़ों के तैयार जवाब देता हूँ। नीचे से सवाल चुनिए या अपना लिखिए।",
    mr:"मी Tazvera सहाय्यक आहे, अ‍ॅपमधला छोटा सहाय्यक. मी खरा AI नाही. मी PIN, 12 शब्द, मोफत टेस्ट TZT, पाठवणे, स्कॅन, सुरक्षा आणि इतर गोष्टींची तयार उत्तरे देतो. खालून प्रश्न निवडा किंवा तुमचा स्वतःचा लिहा.",
    gu:"હું Tazvera સહાયક છું, એપની અંદરનો નાનો સહાયક. હું અસલી AI નથી. હું PIN, 12 શબ્દો, મફત ટેસ્ટ TZT, મોકલવું, સ્કેન, સુરક્ષા અને બીજી બાબતોના તૈયાર જવાબો આપું છું. નીચેથી પ્રશ્ન પસંદ કરો અથવા તમારો લખો."}},
{n:1,k:["thanks","thank you","thx","धन्यवाद","शुक्रिया","आभार","આભાર","dhanyavad","shukriya"],
 q:{en:"",hi:"",mr:"",gu:""},
 a:{en:"You are welcome! Ask me anything about the app.",hi:"आपका स्वागत है! ऐप के बारे में कुछ भी पूछिए।",mr:"तुमचे स्वागत आहे! अ‍ॅपबद्दल काहीही विचारा.",gu:"તમારું સ્વાગત છે! એપ વિશે કંઈ પણ પૂછો."}},
{k:["pin","पिन","પિન","password","पासवर्ड","પાસવર્ડ","keypad","कीबोर्ड","કીબોર્ડ","kaise dal","कैसे डाल","कसा टाक","કેવી રીતે નાખ"],
 q:{en:"How do I enter the PIN?",hi:"PIN कैसे डालें?",mr:"PIN कसा टाकायचा?",gu:"PIN કેવી રીતે નાખવો?"},
 a:{en:"When you make an account, choose a 6-digit PIN and type it again. The app shows its own number keypad. One PIN locks the whole app and the wallet.",
    hi:"खाता बनाते समय 6 अंकों का PIN चुनिए और उसे दोबारा डालिए। ऐप का अपना नंबर कीबोर्ड खुलता है। एक ही PIN पूरे ऐप और वॉलेट को बंद रखता है।",
    mr:"खाते तयार करताना 6 अंकी PIN निवडा आणि तो पुन्हा टाका. अ‍ॅपचा स्वतःचा नंबर कीबोर्ड उघडतो. एकच PIN संपूर्ण अ‍ॅप आणि वॉलेट बंद ठेवतो.",
    gu:"એકાઉન્ટ બનાવતી વખતે 6 અંકનો PIN પસંદ કરો અને તેને ફરી નાખો. એપનું પોતાનું નંબર કીબોર્ડ ખુલે છે. એક જ PIN આખી એપ અને વોલેટને બંધ રાખે છે."}},
{k:["forgot","bhul","bhool","भूल","reset","change pin","pin badal","बदल","विसर","विसरल","ભૂલી","ભૂલ્યો","રીસેટ"],
 q:{en:"I forgot my PIN",hi:"PIN भूल गया",mr:"PIN विसरलो",gu:"PIN ભૂલી ગયો"},
 a:{en:"On the PIN screen tap 'Forgot PIN?'. If you have your 12 words on paper, you can make the wallet again with a new PIN. Without the 12 words the wallet cannot be recovered.",
    hi:"PIN वाली स्क्रीन पर 'PIN भूल गए?' दबाइए। अगर 12 शब्द कागज़ पर हैं तो उनसे वॉलेट नए PIN के साथ दोबारा बन जाएगा। 12 शब्द न हों तो वॉलेट वापस नहीं आ सकता।",
    mr:"PIN स्क्रीनवर 'PIN विसरलात?' दाबा. 12 शब्द कागदावर असतील तर त्यांच्यापासून नवीन PIN सह वॉलेट पुन्हा तयार होईल. 12 शब्द नसतील तर वॉलेट परत मिळू शकत नाही.",
    gu:"PIN સ્ક્રીન પર 'PIN ભૂલી ગયા?' દબાવો. જો 12 શબ્દો કાગળ પર હોય તો તેમનાથી નવા PIN સાથે વોલેટ ફરી બની જશે. 12 શબ્દો ન હોય તો વોલેટ પાછું મળી શકતું નથી."}},
{k:["finger","fingerprint","फिंगर","उँगली","ungli","biometric","touch","बोट","ફિંગર","આંગળી"],
 q:{en:"How to turn on fingerprint?",hi:"फिंगरप्रिंट कैसे चालू करें?",mr:"फिंगरप्रिंट कसे सुरू करू?",gu:"ફિંગરપ્રિન્ટ કેવી રીતે ચાલુ કરું?"},
 a:{en:"1. Open Settings > Security.\n2. Tap 'Open with fingerprint'.\n3. Enter your wallet PIN.\n4. Touch the fingerprint sensor.\nYour fingerprint (or screen lock) must already be saved in the phone's own Settings. This is for the test wallet only.",
    hi:"1. Settings > Security खोलिए।\n2. 'उँगली से खोलें' दबाइए।\n3. वॉलेट PIN डालिए।\n4. फिंगरप्रिंट सेंसर पर उँगली रखिए।\nफ़ोन की अपनी Settings में आपकी उँगली (या स्क्रीन-लॉक) पहले से दर्ज होनी चाहिए। यह सिर्फ़ टेस्ट वॉलेट के लिए है।",
    mr:"1. Settings > Security उघडा.\n2. 'बोटाने उघडा' दाबा.\n3. वॉलेट PIN टाका.\n4. फिंगरप्रिंट सेन्सरवर बोट ठेवा.\nफोनच्या स्वतःच्या Settings मध्ये तुमचे बोट (किंवा स्क्रीन-लॉक) आधीच नोंदलेले असावे. हे फक्त टेस्ट वॉलेटसाठी आहे.",
    gu:"1. Settings > Security ખોલો.\n2. 'આંગળીથી ખોલો' દબાવો.\n3. વોલેટ PIN નાખો.\n4. ફિંગરપ્રિન્ટ સેન્સર પર આંગળી મૂકો.\nફોનની પોતાની Settings માં તમારી આંગળી (અથવા સ્ક્રીન-લૉક) પહેલેથી સેવ હોવી જોઈએ. આ ફક્ત ટેસ્ટ વોલેટ માટે છે."}},
{k:["12","words","shabd","शब्द","શબ્દ","recovery","phrase","seed","backup","बैकअप","बॅकअप","બેકઅપ","૧૨"],
 q:{en:"Where are my 12 words?",hi:"मेरे 12 शब्द कहाँ हैं?",mr:"माझे 12 शब्द कुठे आहेत?",gu:"મારા 12 શબ્દો ક્યાં છે?"},
 a:{en:"Settings > Security > Backup words (12). Enter the PIN, then tap to show the words for 30 seconds. Write them on paper in order. No screenshot, no photo, and never tell anyone. Nobody from Tazvera will ever ask for them.",
    hi:"Settings > Security > बैकअप शब्द (12)। PIN डालिए, फिर दबाने पर 30 सेकंड तक शब्द दिखेंगे। उन्हें क्रम से कागज़ पर लिखिए। स्क्रीनशॉट या फ़ोटो नहीं, और किसी को न बताइए। Tazvera से कोई भी इन्हें कभी नहीं माँगेगा।",
    mr:"Settings > Security > बॅकअप शब्द (12). PIN टाका, मग दाबल्यावर 30 सेकंद शब्द दिसतील. ते क्रमाने कागदावर लिहा. स्क्रीनशॉट किंवा फोटो नाही, आणि कोणालाही सांगू नका. Tazvera कडून कोणीही ते कधीच मागणार नाही.",
    gu:"Settings > Security > બેકઅપ શબ્દો (12). PIN નાખો, પછી દબાવવાથી 30 સેકન્ડ સુધી શબ્દો દેખાશે. તેને ક્રમ પ્રમાણે કાગળ પર લખો. સ્ક્રીનશોટ કે ફોટો નહીં, અને કોઈને કહેશો નહીં. Tazvera તરફથી કોઈ પણ તે ક્યારેય માગશે નહીં."}},
{k:["tzt","cpay","faucet","free","मुफ़्त","मुफ्त","मोफत","મફત","test coin","टेस्ट सिक्के","टेस्ट नाणी","ટેસ્ટ સિક્કા","claim","coin kaise","token kaise"],
 q:{en:"How do I get test TZT?",hi:"टेस्ट TZT कैसे लूँ?",mr:"टेस्ट TZT कसे मिळवू?",gu:"ટેસ્ટ TZT કેવી રીતે મળે?"},
 a:{en:"Home > Get TZT > Claim. It is free and we pay the network fee, so you do not need SHM first. These are test coins with no value.",
    hi:"Home > Get TZT > Claim। यह मुफ़्त है और नेटवर्क फ़ीस हम भरते हैं, इसलिए पहले SHM की ज़रूरत नहीं। ये टेस्ट सिक्के हैं, इनकी कोई कीमत नहीं।",
    mr:"Home > Get TZT > Claim. हे मोफत आहे आणि नेटवर्क फी आम्ही भरतो, त्यामुळे आधी SHM ची गरज नाही. ही टेस्ट नाणी आहेत, त्यांची कोणतीही किंमत नाही.",
    gu:"Home > Get TZT > Claim. આ મફત છે અને નેટવર્ક ફી અમે ભરીએ છીએ, તેથી પહેલા SHM ની જરૂર નથી. આ ટેસ્ટ સિક્કા છે, તેની કોઈ કિંમત નથી."}},
{k:["send","bhej","भेज","transfer","payment","pay kaise","पाठव","મોકલ"],
 q:{en:"How do I send?",hi:"कैसे भेजूँ?",mr:"कसे पाठवू?",gu:"કેવી રીતે મોકલું?"},
 a:{en:"1. Home > Send.\n2. Check the coin at the top (tap it to change).\n3. Type the address, or use the Paste or Scan icons inside the address box.\n4. Type the amount (or MAX) and tap Send.\n5. Check the address and fee on the Confirm page, then tap Send now and enter your PIN.\nYou press Send yourself every time. Only send on Shardeum Testnet.",hi:"1. Home > Send।\n2. ऊपर सिक्का देखिए (बदलना हो तो उसे दबाइए)।\n3. पता लिखिए, या पता-डिब्बे के अंदर Paste या Scan के निशान दबाइए।\n4. रकम लिखिए (या MAX) और Send दबाइए।\n5. Confirm पन्ने पर पता और फ़ीस जाँचिए, फिर Send now दबाकर PIN डालिए।\nSend हर बार आप ख़ुद दबाते हैं। सिर्फ़ Shardeum Testnet पर भेजिए।",mr:"1. Home > Send.\n2. वर नाणे पाहा (बदलायचे असल्यास ते दाबा).\n3. पत्ता लिहा, किंवा पत्ता-पेटीतील Paste किंवा Scan चिन्ह दाबा.\n4. रक्कम लिहा (किंवा MAX) आणि Send दाबा.\n5. Confirm पानावर पत्ता आणि फी तपासा, मग Send now दाबून PIN टाका.\nSend प्रत्येक वेळी तुम्हीच दाबता. फक्त Shardeum Testnet वर पाठवा.",gu:"1. Home > Send.\n2. ઉપર સિક્કો જુઓ (બદલવો હોય તો તેને દબાવો).\n3. સરનામું લખો, અથવા સરનામા-બોક્સની અંદર Paste કે Scan નિશાન દબાવો.\n4. રકમ લખો (અથવા MAX) અને Send દબાવો.\n5. Confirm પાન પર સરનામું અને ફી તપાસો, પછી Send now દબાવી PIN નાખો.\nSend દરેક વખતે તમે જાતે દબાવો છો. ફક્ત Shardeum Testnet પર મોકલો."},go:"send",gn:"Send"},
{k:["receive","पाना","address","पता","पत्ता","સરનામું","qr","scan","स्कैन","स्कॅन","સ્કેન"],
 q:{en:"QR scan and my address",hi:"QR स्कैन और मेरा पता",mr:"QR स्कॅन आणि माझा पत्ता",gu:"QR સ્કેન અને મારું સરનામું"},
 a:{en:"To receive: Home > Receive shows your address and QR. To scan: tap the scan icon at the top right of Home, or Send > scan QR. You can also read a QR from a photo. Open the app in Chrome.",
    hi:"पाने के लिए: Home > Receive में आपका पता और QR दिखता है। स्कैन के लिए: Home के ऊपर दाईं तरफ़ स्कैन का निशान, या Send > QR स्कैन। फ़ोटो से भी QR पढ़ सकते हैं। ऐप Chrome में खोलिए।",
    mr:"मिळवण्यासाठी: Home > Receive मध्ये तुमचा पत्ता आणि QR दिसतो. स्कॅनसाठी: Home च्या वर उजवीकडे स्कॅन चिन्ह, किंवा Send > QR स्कॅन. फोटोवरूनही QR वाचता येतो. अ‍ॅप Chrome मध्ये उघडा.",
    gu:"મેળવવા માટે: Home > Receive માં તમારું સરનામું અને QR દેખાય છે. સ્કેન માટે: Home ની ઉપર જમણી બાજુ સ્કેન નિશાન, અથવા Send > QR સ્કેન. ફોટોમાંથી પણ QR વાંચી શકાય છે. એપ Chrome માં ખોલો."}},
{k:["real","असली","खरे","खरी","અસલી","paisa","पैसा","पैसे","પૈસા","money","rupee","rs","value","कीमत","किंमत","કિંમત","price"],
 q:{en:"Is this real money?",hi:"क्या यह असली पैसा है?",mr:"हे खरे पैसे आहेत का?",gu:"શું આ અસલી પૈસા છે?"},
 a:{en:"No. This is a test version on Shardeum Testnet. Test coins have no value. Please do not put real money or real coins in it, and do not use these 12 words in another wallet.",
    hi:"नहीं। यह Shardeum Testnet पर टेस्ट वर्शन है। टेस्ट सिक्कों की कोई कीमत नहीं। इसमें असली पैसा या असली सिक्के मत डालिए, और ये 12 शब्द किसी दूसरे वॉलेट में इस्तेमाल मत कीजिए।",
    mr:"नाही. ही Shardeum Testnet वरील टेस्ट आवृत्ती आहे. टेस्ट नाण्यांची कोणतीही किंमत नाही. यात खरे पैसे किंवा खरी नाणी टाकू नका, आणि हे 12 शब्द दुसऱ्या वॉलेटमध्ये वापरू नका.",
    gu:"ના. આ Shardeum Testnet પરનું ટેસ્ટ વર્ઝન છે. ટેસ્ટ સિક્કાની કોઈ કિંમત નથી. તેમાં અસલી પૈસા કે અસલી સિક્કા ન નાખો, અને આ 12 શબ્દો બીજા વોલેટમાં વાપરશો નહીં."}},
{k:["safe","surakshit","सुरक्षित","સુરક્ષિત","सुरक्षा","સુરક્ષા","hack","scam","fraud","फसवणूक","છેતરપિંડી","trust","भरोसा","विश्वास","ભરોસો"],
 q:{en:"Is it safe?",hi:"क्या यह सुरक्षित है?",mr:"हे सुरक्षित आहे का?",gu:"શું આ સુરક્ષિત છે?"},
 a:{en:"Your key stays on your phone, locked by your PIN. We never see it. Never share your PIN or 12 words. Nobody from Tazvera will DM you first or ask for money. It is still an early test version.",
    hi:"आपकी चाबी आपके फ़ोन में, आपके PIN से बंद रहती है। हम उसे कभी नहीं देखते। PIN और 12 शब्द किसी को न बताइए। Tazvera से कोई पहले संदेश नहीं भेजेगा और पैसा नहीं माँगेगा। यह अभी शुरुआती टेस्ट वर्शन है।",
    mr:"तुमची चावी तुमच्या फोनमध्ये, तुमच्या PIN ने बंद राहते. आम्ही ती कधीच पाहत नाही. PIN आणि 12 शब्द कोणालाही सांगू नका. Tazvera कडून कोणीही आधी मेसेज करणार नाही किंवा पैसे मागणार नाही. ही अजून सुरुवातीची टेस्ट आवृत्ती आहे.",
    gu:"તમારી ચાવી તમારા ફોનમાં, તમારા PIN થી બંધ રહે છે. અમે તેને ક્યારેય જોતા નથી. PIN અને 12 શબ્દો કોઈને કહેશો નહીં. Tazvera તરફથી કોઈ પહેલા મેસેજ નહીં કરે કે પૈસા નહીં માગે. આ હજી શરૂઆતનું ટેસ્ટ વર્ઝન છે."}},
{k:["lock","लॉक","લૉક","લોક","unlock","अनलॉक","auto","band","बंद"],
 q:{en:"Lock and auto-lock",hi:"लॉक और ऑटो-लॉक",mr:"लॉक आणि ऑटो-लॉक",gu:"લૉક અને ઓટો-લૉક"},
 a:{en:"Settings > Security: turn on 'PIN lock' so the app asks for your PIN when you open it. 'Auto-lock after' sets how long it waits, and 'Ask PIN for every send' asks before each send.",
    hi:"Settings > Security: 'PIN lock' चालू कीजिए, तो ऐप खोलते ही PIN माँगेगा। 'Auto-lock after' से तय करें कितनी देर बाद ताला लगे, और 'Ask PIN for every send' हर भेजने से पहले PIN माँगता है।",
    mr:"Settings > Security: 'PIN lock' चालू करा, म्हणजे अ‍ॅप उघडताच PIN विचारेल. 'Auto-lock after' मध्ये किती वेळाने लॉक व्हावे ते ठरवा, आणि 'Ask PIN for every send' प्रत्येक पाठवण्याआधी PIN विचारते.",
    gu:"Settings > Security: 'PIN lock' ચાલુ કરો, એટલે એપ ખોલતાં જ PIN માંગશે. 'Auto-lock after' માં નક્કી કરો કેટલા સમય પછી લૉક થાય, અને 'Ask PIN for every send' દરેક મોકલતા પહેલા PIN માંગે છે."}},
{k:["hindi","हिंदी","હિંદી","language","भाषा","ભાષા","english","अंग्रेज़ी","अंग्रेजी","मराठी","ગુજરાતી","gujarati","marathi"],
 q:{en:"Change language",hi:"भाषा बदलें",mr:"भाषा बदला",gu:"ભાષા બદલો"},
 a:{en:"Settings > Language & display: choose Hindi or English for the app. In this chat, use the language buttons at the top.",
    hi:"Settings > Language & display में हिंदी या English चुनिए। इस चैट में ऊपर के भाषा वाले बटन इस्तेमाल कीजिए।",
    mr:"Settings > Language & display मध्ये हिंदी किंवा English निवडा. या चॅटमध्ये वरील भाषेची बटणे वापरा.",
    gu:"Settings > Language & display માં હિંદી અથવા English પસંદ કરો. આ ચેટમાં ઉપરના ભાષા બટનો વાપરો."}},
{k:["voice","bol","बोल","आवाज़","आवाज","અવાજ","બોલ","speak","mic"],
 q:{en:"Speak to fill",hi:"बोलकर भरना",mr:"बोलून भरणे",gu:"બોલીને ભરવું"},
 a:{en:"Send > 'Speak to fill'. Say the amount and a saved name, like '10 TZT to Ramesh'. The app only fills the form. You press Send yourself. It needs the microphone and internet, it works in Hindi and English for now, and it is experimental.",
    hi:"Send > 'Speak to fill'। रकम और सहेजा हुआ नाम बोलिए, जैसे '10 TZT रमेश को भेजो'। ऐप सिर्फ़ फ़ॉर्म भरता है, Send आप खुद दबाते हैं। इसके लिए माइक और इंटरनेट चाहिए, अभी हिंदी और अंग्रेज़ी में चलता है, और यह प्रयोगात्मक है।",
    mr:"Send > 'Speak to fill'. रक्कम आणि सेव्ह केलेले नाव बोला, जसे '10 TZT रमेशला पाठवा'. अ‍ॅप फक्त फॉर्म भरते, Send तुम्हीच दाबता. यासाठी मायक्रोफोन आणि इंटरनेट लागते, सध्या हिंदी आणि इंग्रजीत चालते, आणि हे प्रायोगिक आहे.",
    gu:"Send > 'Speak to fill'. રકમ અને સેવ કરેલું નામ બોલો, જેમ કે '10 TZT રમેશને મોકલો'. એપ ફક્ત ફોર્મ ભરે છે, Send તમે જાતે દબાવો છો. આ માટે માઇક્રોફોન અને ઇન્ટરનેટ જોઈએ, હાલમાં હિંદી અને અંગ્રેજીમાં ચાલે છે, અને આ પ્રાયોગિક છે."}},
{k:["contact","address book","naam save","नाम सहेज","नाम सेव्ह","नाव सेव्ह","नाव जतन","નામ સેવ","નામ સાચવ","save a name","save name","friend","दोस्त","मित्र","મિત્ર","संपर्क","સંપર્ક","पता किताब"],
 q:{en:"Save a contact",hi:"नाम सहेजना",mr:"नाव सेव्ह करणे",gu:"નામ સેવ કરવું"},
 a:{en:"Services > Crypto > Address Book, or the 'Address book' button on the Send screen. Save a name with the address, then you can pick it when sending.",
    hi:"Services > Crypto > Address Book, या Send स्क्रीन का 'Address book' बटन। नाम के साथ पता सहेजिए, फिर भेजते समय उसे चुन सकते हैं।",
    mr:"Services > Crypto > Address Book, किंवा Send स्क्रीनवरील 'Address book' बटण. नावासह पत्ता सेव्ह करा, मग पाठवताना ते निवडता येते.",
    gu:"Services > Crypto > Address Book, અથવા Send સ્ક્રીન પરનું 'Address book' બટન. નામ સાથે સરનામું સેવ કરો, પછી મોકલતી વખતે તે પસંદ કરી શકાય."}},
{k:["not working","काम नहीं","nahi chal","नहीं चल","चालत नाही","ચાલતું નથી","error","problem","dikkat","दिक्कत","समस्या","अडचण","સમસ્યા","મુશ્કેલી","samasya","stuck","hang","blank","खाली","button"],
 q:{en:"Something is not working",hi:"कुछ काम नहीं कर रहा",mr:"काही चालत नाही",gu:"કંઈક ચાલતું નથી"},
 a:{en:"Try this: 1. Close Chrome fully and open the app again. 2. Settings > About: check the Build number. 3. Still stuck? Send a screenshot on Telegram and we will look at it.",
    hi:"यह कीजिए: 1. Chrome पूरी तरह बंद करके ऐप दोबारा खोलिए। 2. Settings > About में Build नंबर देखिए। 3. फिर भी न चले तो Telegram पर स्क्रीनशॉट भेजिए, हम देखेंगे।",
    mr:"हे करून पाहा: 1. Chrome पूर्ण बंद करून अ‍ॅप पुन्हा उघडा. 2. Settings > About मध्ये Build क्रमांक पाहा. 3. तरीही अडले तर Telegram वर स्क्रीनशॉट पाठवा, आम्ही पाहू.",
    gu:"આ કરી જુઓ: 1. Chrome પૂરું બંધ કરી એપ ફરી ખોલો. 2. Settings > About માં Build નંબર જુઓ. 3. છતાં અટકે તો Telegram પર સ્ક્રીનશોટ મોકલો, અમે જોઈશું."}},
{"n": 1, "k": ["create wallet", "new wallet", "naya wallet", "नया वॉलेट", "वॉलेट बना", "wallet bana", "नवीन वॉलेट", "વોલેટ બનાવ", "make wallet", "open account", "खाता"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "1. Tap 'Main wallet' at the top left (or the first screen).\n2. Tap 'Create new wallet'.\n3. Write the 12 words on paper, in order.\n4. Choose a 6-digit PIN.\nDone. Your wallet lives only on this phone.", "hi": "1. ऊपर बाईं ओर 'Main wallet' दबाइए (या पहली स्क्रीन पर)।\n2. 'Create new wallet' दबाइए।\n3. 12 शब्द क्रम से काग़ज़ पर लिखिए।\n4. 6 अंकों का PIN चुनिए।\nहो गया। आपका वॉलेट सिर्फ़ इसी फ़ोन में रहता है।", "mr": "1. वर डावीकडे 'Main wallet' दाबा (किंवा पहिल्या स्क्रीनवर).\n2. 'Create new wallet' दाबा.\n3. 12 शब्द क्रमाने कागदावर लिहा.\n4. 6 अंकी PIN निवडा.\nझाले. तुमचे वॉलेट फक्त याच फोनमध्ये राहते.", "gu": "1. ઉપર ડાબી બાજુ 'Main wallet' દબાવો (અથવા પહેલી સ્ક્રીન પર).\n2. 'Create new wallet' દબાવો.\n3. 12 શબ્દો ક્રમમાં કાગળ પર લખો.\n4. 6 અંકનો PIN પસંદ કરો.\nથઈ ગયું. તમારું વોલેટ ફક્ત આ ફોનમાં રહે છે."}, "go": "wallet", "gn": "Main wallet"},
{"n": 1, "k": ["import", "restore", "old wallet", "पुराना वॉलेट", "वापस लाना", "wapas", "जुना वॉलेट", "પાછું લાવ", "already have", "new phone", "नया फ़ोन", "नया फोन", "नवीन फोन", "નવો ફોન"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "1. Tap 'Main wallet' at the top left.\n2. Tap 'I already have 12 words'.\n3. Type the 12 words in order (suggestions appear after 2 letters), or tap 'Paste all 12'.\n4. Choose a PIN.\nThe same wallet and coins come back.", "hi": "1. ऊपर बाईं ओर 'Main wallet' दबाइए।\n2. 'I already have 12 words' दबाइए।\n3. 12 शब्द क्रम से लिखिए (2 अक्षर के बाद सुझाव आते हैं), या 'Paste all 12' दबाइए।\n4. PIN चुनिए।\nवही वॉलेट और सिक्के वापस आ जाते हैं।", "mr": "1. वर डावीकडे 'Main wallet' दाबा.\n2. 'I already have 12 words' दाबा.\n3. 12 शब्द क्रमाने लिहा (2 अक्षरांनंतर सूचना येतात), किंवा 'Paste all 12' दाबा.\n4. PIN निवडा.\nतेच वॉलेट आणि नाणी परत येतात.", "gu": "1. ઉપર ડાબી બાજુ 'Main wallet' દબાવો.\n2. 'I already have 12 words' દબાવો.\n3. 12 શબ્દો ક્રમમાં લખો (2 અક્ષર પછી સૂચનો આવે છે), અથવા 'Paste all 12' દબાવો.\n4. PIN પસંદ કરો.\nએ જ વોલેટ અને સિક્કા પાછા આવે છે."}, "go": "wallet", "gn": "Main wallet"},
{"n": 1, "k": ["main wallet", "मेन वॉलेट", "main walet", "मुख्य वॉलेट"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "'Main wallet' at the top left of Home is your wallet. Tap it to see your wallet, or to create or bring back a wallet.", "hi": "Home पर ऊपर बाईं ओर 'Main wallet' आपका वॉलेट है। इसे दबाकर अपना वॉलेट देखिए, या नया बनाइए / पुराना वापस लाइए।", "mr": "Home वर वर डावीकडे 'Main wallet' म्हणजे तुमचे वॉलेट. ते दाबून तुमचे वॉलेट पाहा, किंवा नवीन तयार करा / जुने परत आणा.", "gu": "Home પર ઉપર ડાબી બાજુ 'Main wallet' તમારું વોલેટ છે. તેને દબાવીને તમારું વોલેટ જુઓ, અથવા નવું બનાવો / જૂનું પાછું લાવો."}, "go": "wallet", "gn": "Main wallet"},
{"n": 1, "k": ["my address", "मेरा पता", "mera pata", "माझा पत्ता", "મારું સરનામું", "wallet address", "copy address", "पता कॉपी", "receive", "पाना", "पैसे मंगा", "मिळवा", "મેળવ"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Home > Receive. Choose the coin. Your QR code and address appear. Tap Copy to copy the address, or Share to send it on WhatsApp.", "hi": "Home > Receive। सिक्का चुनिए। आपका QR और पता दिखेगा। पता कॉपी करने के लिए Copy, WhatsApp पर भेजने के लिए Share दबाइए।", "mr": "Home > Receive. नाणे निवडा. तुमचा QR आणि पत्ता दिसेल. पत्ता कॉपी करायला Copy, WhatsApp वर पाठवायला Share दाबा.", "gu": "Home > Receive. સિક્કો પસંદ કરો. તમારો QR અને સરનામું દેખાશે. સરનામું કૉપી કરવા Copy, WhatsApp પર મોકલવા Share દબાવો."}, "go": "receive", "gn": "Receive"},
{"n": 1, "k": ["request", "माँग", "मांग", "mang", "payment request", "bill", "दुकान", "shop", "customer", "ग्राहक", "ગ્રાહક"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Home > Request. Type the amount (and a note if you like). A QR appears. The customer scans it and pays exactly that amount. You can also share the request link.", "hi": "Home > Request। रकम लिखिए (चाहें तो नोट भी)। QR बन जाएगा। ग्राहक उसे स्कैन करके ठीक उतनी ही रकम भेजेगा। माँग का लिंक भी भेज सकते हैं।", "mr": "Home > Request. रक्कम लिहा (हवी तर नोंदही). QR तयार होईल. ग्राहक तो स्कॅन करून नेमकी तेवढीच रक्कम पाठवेल. मागणीची लिंकही पाठवू शकता.", "gu": "Home > Request. રકમ લખો (ઈચ્છો તો નોંધ પણ). QR બનશે. ગ્રાહક તેને સ્કેન કરીને બરાબર એટલી જ રકમ મોકલશે. માંગની લિંક પણ મોકલી શકો."}, "go": "request", "gn": "Request"},
{"n": 1, "k": ["fee", "gas", "फ़ीस", "फीस", "fees", "शुल्क", "फी", "ફી", "why shm", "shm kyu", "shm क्यों"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Every send needs a small network fee, paid in SHM (Shardeum's own coin). So even to send TZT you need a little SHM. The fee is shown before you send. Getting free TZT from the faucet needs no SHM.", "hi": "हर भेजने पर थोड़ी नेटवर्क फ़ीस लगती है, जो SHM (Shardeum का अपना सिक्का) में कटती है। इसलिए TZT भेजने के लिए भी थोड़ा SHM चाहिए। फ़ीस भेजने से पहले दिखती है। Faucet से मुफ़्त TZT लेने में SHM नहीं लगता।", "mr": "प्रत्येक पाठवण्यावर थोडी नेटवर्क फी लागते, जी SHM (Shardeum चे स्वतःचे नाणे) मध्ये कापली जाते. म्हणून TZT पाठवायलाही थोडे SHM हवे. फी पाठवण्याआधी दिसते. Faucet मधून मोफत TZT घ्यायला SHM लागत नाही.", "gu": "દરેક મોકલવા પર થોડી નેટવર્ક ફી લાગે છે, જે SHM (Shardeum નો પોતાનો સિક્કો) માં કપાય છે. તેથી TZT મોકલવા માટે પણ થોડું SHM જોઈએ. ફી મોકલતા પહેલા દેખાય છે. Faucet માંથી મફત TZT લેવામાં SHM નથી લાગતું."}},
{"n": 1, "k": ["shm", "shardeum", "शार्डियम", "get shm", "test shm"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "SHM is the coin of the Shardeum network. Here it is test SHM with no value. It pays the network fee. To get test SHM, use Shardeum's official faucet, or ask on our Telegram.", "hi": "SHM, Shardeum नेटवर्क का सिक्का है। यहाँ यह टेस्ट SHM है, इसकी कोई कीमत नहीं। इससे नेटवर्क फ़ीस भरी जाती है। टेस्ट SHM के लिए Shardeum का आधिकारिक faucet इस्तेमाल कीजिए, या हमारे Telegram पर पूछिए।", "mr": "SHM हे Shardeum नेटवर्कचे नाणे आहे. इथे ते टेस्ट SHM आहे, त्याची किंमत नाही. यातून नेटवर्क फी भरली जाते. टेस्ट SHM साठी Shardeum चा अधिकृत faucet वापरा, किंवा आमच्या Telegram वर विचारा.", "gu": "SHM એ Shardeum નેટવર્કનો સિક્કો છે. અહીં તે ટેસ્ટ SHM છે, તેની કોઈ કિંમત નથી. તેનાથી નેટવર્ક ફી ભરાય છે. ટેસ્ટ SHM માટે Shardeum નો સત્તાવાર faucet વાપરો, અથવા અમારા Telegram પર પૂછો."}},
{"n": 1, "k": ["what is tzt", "tzt kya", "tzt क्या", "tazvera test", "tzt म्हणजे", "tzt શું"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "TZT (Tazvera Test) is our test token on Shardeum Testnet. It is for trying the app and has no value. You can get it free: Home > Get TZT.", "hi": "TZT (Tazvera Test) Shardeum Testnet पर हमारा टेस्ट टोकन है। यह ऐप आज़माने के लिए है, इसकी कोई कीमत नहीं। मुफ़्त मिलता है: Home > Get TZT।", "mr": "TZT (Tazvera Test) हे Shardeum Testnet वरील आमचे टेस्ट टोकन आहे. हे अ‍ॅप वापरून पाहण्यासाठी आहे, त्याची किंमत नाही. मोफत मिळते: Home > Get TZT.", "gu": "TZT (Tazvera Test) એ Shardeum Testnet પરનું અમારું ટેસ્ટ ટોકન છે. તે એપ અજમાવવા માટે છે, તેની કોઈ કિંમત નથી. મફત મળે છે: Home > Get TZT."}, "go": "tools", "gn": "Services"},
{"n": 1, "k": ["cpay", "cryptopay", "crypto pay", "पुराना सिक्का", "old coin", "old token"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "CPAY (CryptoPay Test) is our old test token from before the name Tazvera. It is kept in the list as a memory and is shown faded. Use TZT instead.", "hi": "CPAY (CryptoPay Test) Tazvera नाम से पहले का हमारा पुराना टेस्ट टोकन है। याद के लिए सूची में धुँधला रखा है। अब TZT इस्तेमाल कीजिए।", "mr": "CPAY (CryptoPay Test) हे Tazvera नावाआधीचे आमचे जुने टेस्ट टोकन आहे. आठवण म्हणून यादीत फिकट ठेवले आहे. आता TZT वापरा.", "gu": "CPAY (CryptoPay Test) એ Tazvera નામ પહેલાનું અમારું જૂનું ટેસ્ટ ટોકન છે. યાદ માટે યાદીમાં ઝાંખું રાખ્યું છે. હવે TZT વાપરો."}},
{"n": 1, "k": ["price only", "btc", "bitcoin", "eth", "bnb", "usdt", "बिटकॉइन", "rate", "भाव"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "BTC, ETH, BNB and USDT show live prices only ('price only'). This test wallet cannot hold or send them yet.", "hi": "BTC, ETH, BNB और USDT सिर्फ़ ताज़ा भाव दिखाते हैं ('price only')। यह टेस्ट वॉलेट अभी इन्हें रख या भेज नहीं सकता।", "mr": "BTC, ETH, BNB आणि USDT फक्त ताजा भाव दाखवतात ('price only'). हे टेस्ट वॉलेट अजून ते ठेवू किंवा पाठवू शकत नाही.", "gu": "BTC, ETH, BNB અને USDT ફક્ત તાજો ભાવ બતાવે છે ('price only'). આ ટેસ્ટ વોલેટ હજી તેને રાખી કે મોકલી શકતું નથી."}},
{"n": 1, "k": ["add token", "add coin", "new coin", "सिक्का जोड़", "टोकन जोड़", "token jod", "नाणे जोड", "સિક્કો ઉમેર", "custom token", "contract"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "On Home, tap the + next to 'Crypto Assets'. Paste the token's contract address. Only add tokens you trust; anyone can make a fake token with any name.", "hi": "Home पर 'Crypto Assets' के पास + दबाइए। टोकन का contract पता चिपकाइए। सिर्फ़ भरोसेमंद टोकन जोड़िए; कोई भी किसी भी नाम से नक़ली टोकन बना सकता है।", "mr": "Home वर 'Crypto Assets' जवळ + दाबा. टोकनचा contract पत्ता चिकटवा. फक्त विश्वासू टोकन जोडा; कोणीही कोणत्याही नावाने बनावट टोकन बनवू शकतो.", "gu": "Home પર 'Crypto Assets' પાસે + દબાવો. ટોકનનું contract સરનામું ચોંટાડો. ફક્ત ભરોસાપાત્ર ટોકન ઉમેરો; કોઈ પણ કોઈ પણ નામે નકલી ટોકન બનાવી શકે છે."}},
{"n": 1, "k": ["network", "नेटवर्क", "नेटवर्क बदल", "change network", "chain", "mainnet", "testnet"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Tap the network name under your balance on Home (or Settings > Network) and choose. For testing, stay on Shardeum Testnet. Sending on the wrong network can lose coins forever.", "hi": "Home पर बैलेंस के नीचे नेटवर्क का नाम दबाइए (या Settings > Network) और चुनिए। आज़माने के लिए Shardeum Testnet पर ही रहिए। ग़लत नेटवर्क पर भेजने से सिक्के हमेशा के लिए जा सकते हैं।", "mr": "Home वर शिल्लकीखाली नेटवर्कचे नाव दाबा (किंवा Settings > Network) आणि निवडा. वापरून पाहण्यासाठी Shardeum Testnet वरच राहा. चुकीच्या नेटवर्कवर पाठवल्यास नाणी कायमची जाऊ शकतात.", "gu": "Home પર બેલેન્સ નીચે નેટવર્કનું નામ દબાવો (અથવા Settings > Network) અને પસંદ કરો. અજમાવવા માટે Shardeum Testnet પર જ રહો. ખોટા નેટવર્ક પર મોકલવાથી સિક્કા કાયમ માટે જઈ શકે છે."}, "go": "network", "gn": "Network"},
{"n": 1, "k": ["balance", "बैलेंस", "शिल्लक", "બેલેન્સ", "not showing", "नहीं दिख", "dikh nahi", "दिसत नाही", "zero", "0 shm", "refresh"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Wait a few seconds; the balance updates by itself. Check that the network under your balance is Shardeum Testnet. Still wrong? Settings > Data & help > Refresh prices, or close and reopen the app.", "hi": "कुछ सेकंड रुकिए, बैलेंस अपने-आप ताज़ा होता है। देखिए बैलेंस के नीचे नेटवर्क Shardeum Testnet है। फिर भी ग़लत? Settings > Data & help > Refresh prices, या ऐप बंद करके फिर खोलिए।", "mr": "काही सेकंद थांबा, शिल्लक आपोआप अद्ययावत होते. शिल्लकीखालील नेटवर्क Shardeum Testnet आहे का पाहा. तरीही चुकीचे? Settings > Data & help > Refresh prices, किंवा अ‍ॅप बंद करून पुन्हा उघडा.", "gu": "થોડી સેકન્ડ રાહ જુઓ, બેલેન્સ જાતે અપડેટ થાય છે. બેલેન્સ નીચે નેટવર્ક Shardeum Testnet છે કે નહીં જુઓ. છતાં ખોટું? Settings > Data & help > Refresh prices, અથવા એપ બંધ કરી ફરી ખોલો."}},
{"n": 1, "k": ["failed", "fail", "pending", "अटक", "atak", "stuck", "नहीं गया", "nahi gaya", "गेले नाही", "ગયું નથી", "transaction"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "If a send fails, your coins stay with you. Common reasons: not enough SHM for the fee, a wrong address, or a slow network. Check the address, keep a little SHM, and try again after a minute.", "hi": "भेजना असफल हो तो सिक्के आपके पास ही रहते हैं। आम कारण: फ़ीस के लिए SHM कम, पता ग़लत, या नेटवर्क धीमा। पता जाँचिए, थोड़ा SHM रखिए और एक मिनट बाद फिर कोशिश कीजिए।", "mr": "पाठवणे अयशस्वी झाले तर नाणी तुमच्याकडेच राहतात. नेहमीची कारणे: फीसाठी SHM कमी, चुकीचा पत्ता, किंवा नेटवर्क धीमे. पत्ता तपासा, थोडे SHM ठेवा आणि एका मिनिटाने पुन्हा प्रयत्न करा.", "gu": "મોકલવું નિષ્ફળ જાય તો સિક્કા તમારી પાસે જ રહે છે. સામાન્ય કારણો: ફી માટે SHM ઓછું, ખોટું સરનામું, અથવા ધીમું નેટવર્ક. સરનામું તપાસો, થોડું SHM રાખો અને એક મિનિટ પછી ફરી પ્રયાસ કરો."}},
{"n": 1, "k": ["explorer", "history", "इतिहास", "itihas", "इतिहास", "history csv", "check transaction", "लेन-देन", "len den", "व्यवहार", "વ્યવહાર"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "To check a transaction: Services > Block explorer, then search your address. Every send and receive is listed there. Services > History shows your transactions here, and can save them as a file.", "hi": "लेन-देन देखने के लिए: Services > Block explorer, फिर अपना पता खोजिए। हर भेजना-पाना वहाँ दिखता है। Services > History में आपके लेन-देन दिखते हैं, और फ़ाइल में भी सहेज सकते हैं।", "mr": "व्यवहार पाहण्यासाठी: Services > Block explorer, मग तुमचा पत्ता शोधा. प्रत्येक पाठवणे-मिळवणे तिथे दिसते. Services > History मध्ये तुमचे व्यवहार दिसतात, आणि फाइलमध्येही जतन करता येतात.", "gu": "વ્યવહાર જોવા માટે: Services > Block explorer, પછી તમારું સરનામું શોધો. દરેક મોકલવું-મેળવવું ત્યાં દેખાય છે. Services > History માં તમારા વ્યવહાર દેખાય છે, અને ફાઇલમાં પણ સાચવી શકાય."}, "go": "tools", "gn": "Services"},
{"n": 1, "k": ["max", "मैक्स", "पूरा बैलेंस", "full balance", "sab bhej", "सगळे"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "On the amount step of Send, tap MAX to fill in your whole balance of that coin. Check the amount before you press Send.", "hi": "Send में रकम वाले क़दम पर MAX दबाइए, उस सिक्के का पूरा बैलेंस भर जाएगा। Send दबाने से पहले रकम जाँच लीजिए।", "mr": "Send मध्ये रकमेच्या पायरीवर MAX दाबा, त्या नाण्याची संपूर्ण शिल्लक भरली जाईल. Send दाबण्याआधी रक्कम तपासा.", "gu": "Send માં રકમના પગલે MAX દબાવો, તે સિક્કાનું આખું બેલેન્સ ભરાઈ જશે. Send દબાવતા પહેલા રકમ તપાસો."}, "go": "send", "gn": "Send"},
{"n": 1, "k": ["buy", "sell", "खरीद", "ख़रीद", "बेच", "kharid", "bech", "विकत", "विक", "ખરીદ", "વેચ", "upi"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Buy / Sell is not available in this test version. It will come later, after the app moves to the real network and passes full checks.", "hi": "इस टेस्ट वर्शन में Buy / Sell अभी नहीं है। ऐप असली नेटवर्क पर जाने और पूरी जाँच के बाद आएगा।", "mr": "या टेस्ट आवृत्तीत Buy / Sell अजून नाही. अ‍ॅप खऱ्या नेटवर्कवर गेल्यावर आणि पूर्ण तपासणीनंतर येईल.", "gu": "આ ટેસ્ટ વર્ઝનમાં Buy / Sell હજી નથી. એપ અસલી નેટવર્ક પર જાય અને પૂરી તપાસ પછી આવશે."}},
{"n": 1, "k": ["when mainnet", "kab", "कब", "केव्हा", "ક્યારે", "launch", "real network", "असली नेटवर्क", "play store", "प्ले स्टोर"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Tazvera is in testing on Shardeum Testnet. The real network and the Play Store come only after full checks. There is no fixed date yet; follow our Telegram and X for news.", "hi": "Tazvera अभी Shardeum Testnet पर जाँच में है। असली नेटवर्क और Play Store पूरी जाँच के बाद ही आएँगे। अभी कोई तय तारीख़ नहीं; ख़बर के लिए हमारा Telegram और X देखते रहिए।", "mr": "Tazvera सध्या Shardeum Testnet वर तपासणीत आहे. खरे नेटवर्क आणि Play Store पूर्ण तपासणीनंतरच येतील. अजून ठरलेली तारीख नाही; बातम्यांसाठी आमचे Telegram आणि X पाहत राहा.", "gu": "Tazvera હાલ Shardeum Testnet પર તપાસમાં છે. અસલી નેટવર્ક અને Play Store પૂરી તપાસ પછી જ આવશે. હજી કોઈ નક્કી તારીખ નથી; સમાચાર માટે અમારું Telegram અને X જોતા રહો."}},
{"n": 1, "k": ["theme", "dark", "light", "काला", "सफ़ेद", "सफेद", "डार्क", "लाइट", "રંગ", "night"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Settings > Language & display > Theme. Choose Light, Dark, or Auto (follows your phone).", "hi": "Settings > Language & display > Theme। Light (सफ़ेद), Dark (काला) या Auto (फ़ोन के हिसाब से) चुनिए।", "mr": "Settings > Language & display > Theme. Light (पांढरा), Dark (काळा) किंवा Auto (फोनप्रमाणे) निवडा.", "gu": "Settings > Language & display > Theme. Light (સફેદ), Dark (કાળો) અથવા Auto (ફોન મુજબ) પસંદ કરો."}, "go": "disp", "gn": "Settings"},
{"n": 1, "k": ["hide balance", "छिपा", "chhupa", "chupa", "लपव", "છુપાવ", "eye", "आँख", "डोळा", "આંખ"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Tap the eye next to your balance on Home. The amounts change to ••••. Tap again to show them.", "hi": "Home पर बैलेंस के बगल वाली आँख दबाइए। रकम •••• बन जाएगी। फिर दबाएँ तो दिखेगी।", "mr": "Home वर शिल्लकीशेजारी डोळा दाबा. रक्कम •••• होईल. पुन्हा दाबल्यावर दिसेल.", "gu": "Home પર બેલેન્સ બાજુની આંખ દબાવો. રકમ •••• થઈ જશે. ફરી દબાવો તો દેખાશે."}},
{"n": 1, "k": ["currency", "rupee", "dollar", "रुपया", "रुपये", "डॉलर", "inr", "usd", "चलन"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Settings > Language & display > Currency. Choose INR (₹) or USD ($).", "hi": "Settings > Language & display > Currency। INR (₹) या USD ($) चुनिए।", "mr": "Settings > Language & display > Currency. INR (₹) किंवा USD ($) निवडा.", "gu": "Settings > Language & display > Currency. INR (₹) અથવા USD ($) પસંદ કરો."}, "go": "disp", "gn": "Settings"},
{"n": 1, "k": ["text size", "font", "अक्षर बड़े", "बड़ा", "मोठे अक्षर", "અક્ષર મોટા", "zoom", "small text"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Settings > Language & display > Text size. Tap A+ for bigger text, A− for smaller.", "hi": "Settings > Language & display > Text size। बड़े अक्षर के लिए A+, छोटे के लिए A− दबाइए।", "mr": "Settings > Language & display > Text size. मोठ्या अक्षरांसाठी A+, लहानसाठी A− दाबा.", "gu": "Settings > Language & display > Text size. મોટા અક્ષર માટે A+, નાના માટે A− દબાવો."}, "go": "disp", "gn": "Settings"},
{"n": 1, "k": ["alarm", "alert", "अलार्म", "price alarm", "सूचना", "notification", "नोटिफिकेशन"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Services > Price alarm: set a price and the app tells you when a coin reaches it. Notification settings are in Settings > Notifications.", "hi": "Services > Price alarm: भाव तय कीजिए, सिक्का उस भाव पर पहुँचते ही ऐप बताएगा। सूचना की सेटिंग Settings > Notifications में है।", "mr": "Services > Price alarm: भाव ठरवा, नाणे त्या भावावर पोहोचताच अ‍ॅप सांगेल. सूचनांची सेटिंग Settings > Notifications मध्ये आहे.", "gu": "Services > Price alarm: ભાવ નક્કી કરો, સિક્કો તે ભાવે પહોંચતા જ એપ જણાવશે. સૂચનાની સેટિંગ Settings > Notifications માં છે."}, "go": "tools", "gn": "Services"},
{"n": 1, "k": ["lost phone", "phone kho", "फ़ोन खो", "फोन खो", "चोरी", "chori", "हरवला", "ફોન ખોવા", "stolen", "phone toot", "फोन टूट"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "If your phone is lost, your coins are safe as long as you have the 12 words. On a new phone open the app, tap 'I already have 12 words', type them and set a new PIN. Without the 12 words nobody can bring the wallet back.", "hi": "फ़ोन खो जाए तो भी, अगर 12 शब्द आपके पास हैं, तो सिक्के सुरक्षित हैं। नए फ़ोन में ऐप खोलिए, 'I already have 12 words' दबाइए, शब्द डालिए और नया PIN बनाइए। 12 शब्दों के बिना कोई भी वॉलेट वापस नहीं ला सकता।", "mr": "फोन हरवला तरी, 12 शब्द तुमच्याकडे असतील तर नाणी सुरक्षित आहेत. नवीन फोनमध्ये अ‍ॅप उघडा, 'I already have 12 words' दाबा, शब्द टाका आणि नवीन PIN बनवा. 12 शब्दांशिवाय कोणीही वॉलेट परत आणू शकत नाही.", "gu": "ફોન ખોવાય તો પણ, જો 12 શબ્દો તમારી પાસે હોય તો સિક્કા સુરક્ષિત છે. નવા ફોનમાં એપ ખોલો, 'I already have 12 words' દબાવો, શબ્દો નાખો અને નવો PIN બનાવો. 12 શબ્દો વગર કોઈ પણ વોલેટ પાછું લાવી શકતું નથી."}},
{"n": 1, "k": ["self custody", "who controls", "कौन संभाल", "company recover", "support recover", "वापस नहीं", "क्यों नहीं ला", "non custodial", "तुमचे पैसे कोण"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Tazvera never holds your keys or coins. They live only on your phone, protected by your PIN and your 12 words. That is why no one, not even the Tazvera team, can open or recover your wallet for you.", "hi": "Tazvera कभी आपकी चाबी या सिक्के अपने पास नहीं रखता। वे सिर्फ़ आपके फ़ोन में, आपके PIN और 12 शब्दों से सुरक्षित रहते हैं। इसीलिए कोई भी, Tazvera टीम भी, आपका वॉलेट खोल या वापस नहीं ला सकती।", "mr": "Tazvera कधीही तुमची चावी किंवा नाणी स्वतःकडे ठेवत नाही. ती फक्त तुमच्या फोनमध्ये, तुमच्या PIN आणि 12 शब्दांनी सुरक्षित असतात. म्हणूनच कोणीही, Tazvera टीमसुद्धा, तुमचे वॉलेट उघडू किंवा परत आणू शकत नाही.", "gu": "Tazvera ક્યારેય તમારી ચાવી કે સિક્કા પોતાની પાસે રાખતું નથી. તે ફક્ત તમારા ફોનમાં, તમારા PIN અને 12 શબ્દોથી સુરક્ષિત રહે છે. એટલે જ કોઈ પણ, Tazvera ટીમ પણ, તમારું વોલેટ ખોલી કે પાછું લાવી શકતી નથી."}},
{"n": 1, "k": ["scam", "fraud", "धोखा", "dhokha", "fake", "नक़ली", "नकली", "बनावट", "support", "सपोर्ट", "customer care", "helpline", "dm", "फसव", "છેતર"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Tazvera will never ask for your 12 words, PIN or OTP, and never messages you first. Anyone who asks is a scammer. Official places only: tazvera.com, app.tazvera.com, X @TazveraApp, Telegram t.me/TazveraApp. A token named CRYPTOPAY on Solana is not ours.", "hi": "Tazvera कभी आपके 12 शब्द, PIN या OTP नहीं माँगेगा, और कभी पहले संदेश नहीं भेजेगा। जो माँगे वह धोखेबाज़ है। आधिकारिक जगहें सिर्फ़: tazvera.com, app.tazvera.com, X @TazveraApp, Telegram t.me/TazveraApp। Solana पर CRYPTOPAY नाम का टोकन हमारा नहीं है।", "mr": "Tazvera कधीही तुमचे 12 शब्द, PIN किंवा OTP मागणार नाही, आणि कधीही आधी संदेश पाठवणार नाही. जो मागेल तो फसवणूक करणारा आहे. अधिकृत ठिकाणे फक्त: tazvera.com, app.tazvera.com, X @TazveraApp, Telegram t.me/TazveraApp. Solana वरील CRYPTOPAY नावाचे टोकन आमचे नाही.", "gu": "Tazvera ક્યારેય તમારા 12 શબ્દો, PIN કે OTP માંગશે નહીં, અને ક્યારેય પહેલા સંદેશ મોકલશે નહીં. જે માંગે તે છેતરપિંડી કરનાર છે. સત્તાવાર જગ્યાઓ ફક્ત: tazvera.com, app.tazvera.com, X @TazveraApp, Telegram t.me/TazveraApp. Solana પર CRYPTOPAY નામનું ટોકન અમારું નથી."}},
{"n": 1, "k": ["screenshot", "स्क्रीनशॉट", "photo of words", "फोटो", "स्क्रीनशॉट", "સ્ક્રીનશોટ"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Never take a screenshot or photo of your 12 words. Photos get copied to the cloud and can be stolen. Write the words on paper and keep it safe at home.", "hi": "अपने 12 शब्दों का स्क्रीनशॉट या फ़ोटो कभी मत लीजिए। फ़ोटो क्लाउड में चली जाती है और चोरी हो सकती है। शब्द काग़ज़ पर लिखकर घर में सुरक्षित रखिए।", "mr": "तुमच्या 12 शब्दांचा स्क्रीनशॉट किंवा फोटो कधीही घेऊ नका. फोटो क्लाउडमध्ये जातात आणि चोरीला जाऊ शकतात. शब्द कागदावर लिहून घरी सुरक्षित ठेवा.", "gu": "તમારા 12 શબ્દોનો સ્ક્રીનશોટ કે ફોટો ક્યારેય ન લો. ફોટા ક્લાઉડમાં જાય છે અને ચોરાઈ શકે છે. શબ્દો કાગળ પર લખીને ઘરે સુરક્ષિત રાખો."}},
{"n": 1, "k": ["lock wallet", "wallet lock", "लॉक", "lock now", "बंद करो", "बंद करा"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Settings > Security > PIN lock asks for your PIN every time you open the app. \"Auto-lock after\" locks it by itself after a few minutes, and \"Ask PIN for every send\" asks before each send.", "hi": "Settings > Security > PIN lock चालू करने पर ऐप खोलते ही PIN माँगता है। \"Auto-lock after\" कुछ मिनट बाद अपने-आप ताला लगाता है, और \"Ask PIN for every send\" हर भेजने से पहले PIN माँगता है।", "mr": "Settings > Security > PIN lock चालू केल्यावर अ‍ॅप उघडताच PIN विचारते. \"Auto-lock after\" काही मिनिटांनी आपोआप लॉक करते, आणि \"Ask PIN for every send\" प्रत्येक पाठवण्याआधी PIN विचारते.", "gu": "Settings > Security > PIN lock ચાલુ કરવાથી એપ ખોલતાં જ PIN માંગે છે. \"Auto-lock after\" થોડી મિનિટ પછી જાતે લૉક કરે છે, અને \"Ask PIN for every send\" દરેક મોકલતા પહેલા PIN માંગે છે."}, "go": "sec", "gn": "Security"},
{"n": 1, "k": ["services", "tools", "calculator", "कैलकुलेटर", "टूल", "sip", "emi", "converter"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Services has extra tools: network fee, price converter, block explorer, price alarm, address book profit / loss and bill split, plus safety tips and help.", "hi": "Services में अतिरिक्त टूल हैं: नेटवर्क फ़ीस, भाव बदलने वाला कैलकुलेटर, block explorer, price alarm, address book, लाभ / हानि और बिल बाँटना, साथ में सुरक्षा सुझाव और मदद।", "mr": "Services मध्ये जादा साधने आहेत: नेटवर्क फी, भाव रूपांतर, block explorer, price alarm, address book, नफा / तोटा आणि बिल वाटणी, सोबत सुरक्षा टिप्स आणि मदत.", "gu": "Services માં વધારાના સાધનો છે: નેટવર્ક ફી, ભાવ કન્વર્ટર, block explorer, price alarm, address book, નફો / નુકસાન અને બિલ વહેંચણી, સાથે સુરક્ષા ટીપ્સ અને મદદ."}, "go": "tools", "gn": "Services"},
{"n": 1, "k": ["contact", "telegram", "discord", "डिस्कॉर्ड", "टेलीग्राम", "twitter", "x.com", "help", "मदद", "संपर्क", "મદદ", "community"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Talk to us on Telegram: t.me/TazveraApp or Discord: discord.gg/s2tjFdaCVN. News on X: @TazveraApp. Never share your 12 words or PIN with anyone, even there.", "hi": "हमसे Telegram (t.me/TazveraApp) या Discord (discord.gg/s2tjFdaCVN) पर बात कीजिए। ख़बरें X पर: @TazveraApp। वहाँ भी किसी को अपने 12 शब्द या PIN कभी मत बताइए।", "mr": "आमच्याशी Telegram (t.me/TazveraApp) किंवा Discord (discord.gg/s2tjFdaCVN) वर बोला. बातम्या X वर: @TazveraApp. तिथेही कोणालाही तुमचे 12 शब्द किंवा PIN कधीही सांगू नका.", "gu": "અમારી સાથે Telegram (t.me/TazveraApp) અથવા Discord (discord.gg/s2tjFdaCVN) પર વાત કરો. સમાચાર X પર: @TazveraApp. ત્યાં પણ કોઈને તમારા 12 શબ્દો કે PIN ક્યારેય ન કહો."}},
{"n": 1, "k": ["wrong address", "गलत पता", "ग़लत पता", "chuk", "चुकीचा पत्ता", "ખોટું સરનામું", "wrong network", "गलत नेटवर्क", "return", "वापस मिल", "परत"], "q": {"en": "", "hi": "", "mr": "", "gu": ""}, "a": {"en": "Coins sent cannot be pulled back. Before sending, check the first and last 4 letters of the address. Sending to a wrong address or wrong network usually means the coins are lost.", "hi": "भेजे हुए सिक्के वापस नहीं खींचे जा सकते। भेजने से पहले पते के पहले और आख़िरी 4 अक्षर मिलाइए। ग़लत पते या ग़लत नेटवर्क पर भेजने का मतलब अक्सर सिक्के खो जाना है।", "mr": "पाठवलेली नाणी परत ओढता येत नाहीत. पाठवण्याआधी पत्त्याची पहिली आणि शेवटची 4 अक्षरे जुळवा. चुकीच्या पत्त्यावर किंवा नेटवर्कवर पाठवल्यास नाणी बहुधा हरवतात.", "gu": "મોકલેલા સિક્કા પાછા ખેંચી શકાતા નથી. મોકલતા પહેલા સરનામાના પહેલા અને છેલ્લા 4 અક્ષર મેળવો. ખોટા સરનામે કે ખોટા નેટવર્ક પર મોકલવાથી સિક્કા મોટે ભાગે ખોવાય છે."}}
];
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
function norm(s){return String(s).toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu," ")}
function find(t){var n=" "+norm(t)+" ",best=null,sc=0;T.forEach(function(x){var s=0;x.k.forEach(function(w){var lw=w.toLowerCase(),hit=(/^[a-z0-9]+$/.test(lw)&&lw.length<=4)?n.indexOf(" "+lw+" ")>-1:n.indexOf(lw)>-1;if(hit)s+=(w.length>3?2:1)});if(s>sc){sc=s;best=x}});return sc>0?best:null}
/* which language did the person write in? */
function detect(t){
  if(/[\u0A80-\u0AFF]/.test(t))return"gu";
  if(/[\u0900-\u097F]/.test(t)){
    var mr=(t.match(/(आहे|आहेत|नाही|कसे|कसा|कशी|काय|माझ[ेाी]?|मला|तुम्ही|तुमच|तुम्हाला|तुझ|करा|टाक|पाठव|विसर|करू|कुठे|मोफत|हवे|नको|नाव|आपण|आणि|मी )/g)||[]).length;
    var hi=(t.match(/(क्या|है|हैं|नहीं|कैसे|कैसा|मेरा|मेरे|मेरी|तुम्हारा|तुम्हारे|आपका|आपके|कीजिए|करो|करें|सकते|सकता|कौन|और|को |का |की |में |से |पर )/g)||[]).length;
    return mr>hi?"mr":"hi"}
  var n=" "+t.toLowerCase()+" ";
  if(/\b(kaise|kaisa|kya|mera|meri|mere|nahi|nahin|hai|karo|dale|dalna|daalna|kahan|kaha|bhul|bhool|chalu|batao|bhejo|kaam|kijiye|kare|tum|aap|naam)\b/.test(n))return"hi";
  if(/[a-z]{3}/.test(n))return"en";
  return null}
var HBL=lang==="hi"?"hi":"en";try{var nl=String(navigator.language||"").slice(0,2).toLowerCase();if(LG.indexOf(nl)>-1)HBL=nl;var sv=localStorage.getItem("cp3_hbl");if(LG.indexOf(sv)>-1)HBL=sv}catch(e){}
function plain(s){return String(s).replace(/\s*>\s*/g,", ")}
function speak(txt,l){
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){toast(UI[l].nv,3500);return}
  var code=VL[l],vs=speechSynthesis.getVoices()||[],v=null;
  for(var i=0;i<vs.length;i++){var vl=String(vs[i].lang||"").replace("_","-").toLowerCase();if(vl.indexOf(code.slice(0,2))===0){v=vs[i];if(vl===code.toLowerCase())break}}
  if(!v&&vs.length){toast(UI[l].nv,3500);return}
  try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(plain(txt));u.lang=code;if(v)u.voice=v;u.rate=.95;speechSynthesis.speak(u)}catch(e){toast(UI[l].nv,3500)}}
function add(who,html,l,pt){var m=$("hbMsgs");if(!m)return;var d=document.createElement("div");d.className="hbm "+who;d.innerHTML=html+(who==="b"&&l?'<button class="hbs" data-l="'+l+'" aria-label="Listen">🔊</button>':"");if(pt)d.setAttribute("data-t",pt);m.appendChild(d);m.scrollTop=m.scrollHeight}
function answer(x){var t=x.a[HBL]||x.a.hi||x.a.en;var g="";if(x.go){var N=x.gn||"";var L={en:"Open "+N,hi:N+" खोलें",mr:N+" उघडा",gu:N+" ખોલો"}[HBL]||("Open "+N);g='<button class="hbgo" data-go="'+x.go+'">'+esc(L)+'</button>'}add("b",esc(t)+g,HBL,t)}
function setLg(l){HBL=l;try{localStorage.setItem("cp3_hbl",l)}catch(e){}
  var u=UI[l];if($("hbT"))$("hbT").textContent="Tazvera Helper";if($("hbS"))$("hbS").textContent=u.s;if($("hbIn"))$("hbIn").placeholder=u.ph;if($("hbSend"))$("hbSend").textContent=u.sd;
  var c=$("hbChips");if(c){c.innerHTML="";T.forEach(function(x){if(x.n)return;var b=document.createElement("button");b.textContent=x.q[l];b.onclick=function(){add("u",esc(x.q[l]));answer(x)};c.appendChild(b)})}}
var built=false;
function build(){if(built)return;built=true;
  var st2=document.createElement("style");st2.textContent="#hbLg{display:flex;gap:6px;padding:8px 14px 0;flex-wrap:wrap}#hbLg button{border:1px solid var(--ln,#22345C);background:var(--bg,#0B1222);color:inherit;border-radius:999px;padding:6px 12px;font-size:12.5px;font-weight:700;cursor:pointer}#hbLg button.on{background:linear-gradient(135deg,#3F7DFF,#2B5BE6);color:#fff;border-color:transparent}.hbs{display:block;margin-top:6px;border:1px solid var(--ln,#22345C);background:transparent;color:inherit;border-radius:999px;padding:3px 10px;font-size:14px;cursor:pointer}";document.head.appendChild(st2);
  var bk=document.createElement("div");bk.id="hbBack";bk.onclick=function(){HB.close()};document.body.appendChild(bk);
  var p=document.createElement("div");p.id="hbPanel";
  p.innerHTML='<div class="hbh">'+ROBOT+'<div><b id="hbT"></b><small id="hbS"></small></div><button onclick="HB.close()" aria-label="Close">×</button></div><div id="hbMsgs"></div><div id="hbChips"></div><div class="hbi"><input id="hbIn" autocomplete="off"><button id="hbSend" onclick="HB.send()"></button></div>';
  document.body.appendChild(p);
  $("hbIn").addEventListener("keydown",function(e){if(e.key==="Enter")HB.send()});
  $("hbMsgs").addEventListener("click",function(e){var b=e.target.closest(".hbs");if(b){var m=b.parentNode;speak(m.getAttribute("data-t")||m.textContent,b.getAttribute("data-l"))}});
  setLg(HBL);add("b",esc(({hi:"नमस्ते! ऐप के बारे में कुछ भी पूछिए।",en:"Hi! Ask me anything about the app.",mr:"नमस्कार! अ‍ॅपबद्दल काहीही विचारा.",gu:"નમસ્તે! એપ વિશે કંઈ પણ પૂછો."})[HBL]||"Hi! Ask me anything about the app."))}
window.HB={
  open:function(){build();$("hbBack").classList.add("open");$("hbPanel").classList.add("open")},
  close:function(){var a=$("hbBack"),b=$("hbPanel");if(a)a.classList.remove("open");if(b)b.classList.remove("open");try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}},
  send:function(){var i=$("hbIn");if(!i)return;var v=i.value.trim();if(!v)return;i.value="";var dl=detect(v);if(dl&&dl!==HBL)setLg(dl);add("u",esc(v));var x=find(v);
    if(x)answer(x);else{var u=UI[HBL].u;add("b",esc(u)+' <a href="'+TG+'" target="_blank" rel="noopener">'+TG.replace("https://","")+'</a>',HBL,u)}},
  lang:function(l){build();setLg(l)}
};
var btn=document.createElement("button");btn.id="hbBtn";btn.setAttribute("aria-label","Helper");btn.innerHTML=ROBOT;document.body.appendChild(btn);
/* the helper always starts in the bottom-right corner; moving it is only for the moment, it goes back to the corner next time */
(function(){
 var mem=null,dragging=false,moved=false,sx=0,sy=0,ox=0,oy=0,pid=null;
 function col(){var a=$("app"),r=a?a.getBoundingClientRect():null;if(!r||r.width<50)return{l:0,w:window.innerWidth};return{l:r.left,w:r.width}}
 function clamp(x,y){var c=col(),w=btn.offsetWidth||38,h=btn.offsetHeight||34,H=window.innerHeight;return{x:Math.min(Math.max(c.l+4,x),Math.max(c.l+4,c.l+c.w-w-4)),y:Math.min(Math.max(4,y),Math.max(4,H-h-4))}}
 function put(x,y){var q=clamp(x,y);btn.style.left=q.x+"px";btn.style.top=q.y+"px";btn.style.right="auto";btn.style.bottom="auto";return q}
 function corner(){var c=col(),w=btn.offsetWidth||38,h=btn.offsetHeight||34,n=document.querySelector("nav.bn"),r=n?n.getBoundingClientRect():null,y=(r&&r.height>10)?r.top+(r.height-h)/2:window.innerHeight-100-h;put(c.l+c.w-w-14,y)}
 function place(){if(mem)put(mem.x,mem.y);else corner()}
 btn.addEventListener("pointerdown",function(e){pid=e.pointerId;dragging=true;moved=false;sx=e.clientX;sy=e.clientY;var r=btn.getBoundingClientRect();ox=r.left;oy=r.top;try{btn.setPointerCapture(pid)}catch(x){}});
 btn.addEventListener("pointermove",function(e){if(!dragging||e.pointerId!==pid)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.abs(dx)+Math.abs(dy)<8)return;moved=true;e.preventDefault();put(ox+dx,oy+dy)});
 btn.addEventListener("pointerup",function(e){if(!dragging||e.pointerId!==pid)return;dragging=false;try{btn.releasePointerCapture(pid)}catch(x){}if(moved){var r=btn.getBoundingClientRect();mem={x:r.left,y:r.top}}else HB.open()});
 btn.addEventListener("pointercancel",function(){dragging=false});
 btn.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();HB.open()}});
 window.addEventListener("resize",place);
 document.addEventListener("visibilitychange",function(){if(!document.hidden){mem=null;corner()}});
 window.addEventListener("pageshow",function(){mem=null;corner()});
 try{localStorage.removeItem("cp3_hbpos2");localStorage.removeItem("cp3_hbpos")}catch(e){}
 place();setTimeout(place,600);setTimeout(place,1800);
 try{if(!localStorage.getItem("cp3_hbseen")){localStorage.setItem("cp3_hbseen","1");btn.classList.add("pulse");
   var tp=document.createElement("div");tp.id="hbTip";tp.textContent=tx("Need help? Tap me. You can move me for a while; I come back to this corner.","मदद चाहिए? मुझे दबाइए। कुछ देर के लिए मुझे खिसका सकते हैं, मैं फिर इसी कोने में आ जाऊँगा।");document.body.appendChild(tp);
   var r=btn.getBoundingClientRect();tp.style.bottom=(window.innerHeight-r.top+10)+"px";tp.style.right=Math.max(8,window.innerWidth-r.right)+"px";
   var gone=function(){if(tp.parentNode)tp.parentNode.removeChild(tp);btn.classList.remove("pulse")};setTimeout(gone,9000);btn.addEventListener("pointerdown",gone,{once:true})}}catch(e){}
 setInterval(function(){var sw=$("sheetWallet");btn.style.display=(sw&&sw.classList.contains("open"))?"none":""},600);
})();
})();


/* ===== Part 39: no automatic phone prompt (our PIN keypad stays), honest wording, a hint under the keypad ===== */
(function(){
"use strict";
if(!window.BIO)return;
var tx=function(e,h){return lang==="en"?e:h};
var lk=$("xtLock");if(!lk)return;
var ht=document.createElement("div");ht.id="xtHint";ht.style.cssText="min-height:16px;font-size:12px;text-align:center;opacity:.7;padding:0 12px;max-width:300px";
var anchor=$("xtMsg");if(anchor&&anchor.parentNode===lk)lk.insertBefore(ht,anchor);else lk.insertBefore(ht,lk.lastElementChild);
function upd(){if(lk.style.display==="flex"&&BIO.on())ht.textContent=tx("Fingerprint key: uses your phone's fingerprint or screen lock.","उँगली वाली कुंजी: फ़ोन का फिंगरप्रिंट या स्क्रीन-लॉक इस्तेमाल करती है।");else ht.textContent=""}
new MutationObserver(upd).observe(lk,{attributes:true,attributeFilter:["style"]});upd();
})();

/* ===== Part 41: one PIN for everything, simple Security page, strong PIN storage, no lock bypass, 1-word backup check ===== */
(function(){
"use strict";
if(!window.CPW||!window.WSH||!window.XT||!window.SB||!window.BIO)return;
var tx=function(e,h){return lang==="en"?e:h};
var H=window.WSH,A41=window.A41={},enc=new TextEncoder();
var st=document.createElement("style");st.textContent="#sheetWallet.fromlock{z-index:1000!important}#splash{z-index:1001!important}";document.head.appendChild(st);
function b64(b){var s="";new Uint8Array(b).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s)}
function unb64(s){var r=atob(s),u=new Uint8Array(r.length);for(var i=0;i<r.length;i++)u[i]=r.charCodeAt(i);return u}
/* ---- the app PIN is stored only as a salted slow hash (PBKDF2), never as the PIN itself ---- */
async function hash(pin,sB,it){var salt=sB?unb64(sB):crypto.getRandomValues(new Uint8Array(16)),n=it||150000;
  var key=await crypto.subtle.importKey("raw",enc.encode(String(pin)),"PBKDF2",false,["deriveBits"]);
  var bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:salt,iterations:n},key,256);
  return{s:b64(salt),h:b64(bits),it:n}}
A41.setPin=async function(pin){var v=await hash(pin);localStorage.setItem("cp3_pinv",JSON.stringify(v));ls.set("xt_pin","v2")};
A41.check=async function(pin){var v;try{v=JSON.parse(localStorage.getItem("cp3_pinv")||"null")}catch(e){v=null}if(!v)return null;
  var r=await hash(pin,v.s,v.it),a=r.h,b=v.h,d=a.length^b.length;for(var i=0;i<Math.min(a.length,b.length);i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0};
/* ---- wrong-PIN waiting time (same rule as before) ---- */
var AF="cp3_apppinfail",ST=[30,60,300,900,3600];
function afGet(){try{return JSON.parse(localStorage.getItem(AF)||"{}")||{}}catch(e){return{}}}
function afLeft(){return Math.max(0,(afGet().until||0)-Date.now())}
function afBad(){var o=afGet();o.n=(o.n||0)+1;if(o.n>=5)o.until=Date.now()+ST[Math.min(o.n-5,ST.length-1)]*1000;try{localStorage.setItem(AF,JSON.stringify(o))}catch(e){}return o}
function afOk(){try{localStorage.removeItem(AF)}catch(e){}}
function wt(ms){var s=Math.ceil(ms/1000);return s>=60?Math.ceil(s/60)+(lang==="en"?" min":" मिनट"):s+(lang==="en"?" s":" सेकंड")}
/* ---- the lock screen: one PIN opens the app AND the wallet ---- */
var lk=$("xtLock"),busy=false;
XT.un=async function(){
  var inp=$("xtPin"),v=inp?inp.value:"";if(busy||!lk)return;
  var l=afLeft();if(l>0){lockMsg(tx("Too many wrong PINs. Please wait ","बहुत ज़्यादा गलत PIN। रुकिए: ")+wt(l));return}
  busy=true;
  try{
    var ok=await A41.check(v),mig=false;
    if(ok===null){var lg=ls.get("xt_pin","");ok=!!lg&&lg!=="v2"&&btoa(v+"cp")===lg;mig=ok}
    if(ok){afOk();if(mig){try{await A41.setPin(v)}catch(e){}}
      lockMsg("");lk.style.display="none";document.dispatchEvent(new Event("click"));
      if(CPW.has()&&!CPW.unlocked()){window.__wu=CPW.unlock(v).then(function(){window.__wu=null},function(){window.__wu=null;A41.mismatch()})}
    }else{var o=afBad();lockMsg(o.n>=5?tx("Too many wrong PINs. Please wait ","बहुत ज़्यादा गलत PIN। रुकिए: ")+wt(afLeft()):tx("Wrong PIN. "+(5-o.n)+" tries left.","गलत PIN। "+(5-o.n)+" मौके बचे।"))}
  }finally{busy=false}
};
if(lk)new MutationObserver(function(){if(lk.style.display==="flex"){try{if(CPW.has()&&CPW.unlocked())CPW.lock()}catch(e){}}}).observe(lk,{attributes:true,attributeFilter:["style"]});
/* ---- an older account whose app PIN and wallet PIN differ: ask once to make them one ---- */
A41.mismatch=function(){try{if(sessionStorage.getItem("cp3_mm"))return;sessionStorage.setItem("cp3_mm","1")}catch(e){}
  setTimeout(function(){H.bSh(1);H.bT(tx("Two different PINs","दो अलग PIN हैं"));
    H.bB('<div class="cap" style="text-align:left;line-height:1.55;margin:2px 0 14px">'+tx("Your app PIN and your wallet PIN are different. Enter your wallet PIN once and both become the same.","आपके ऐप का PIN और वॉलेट का PIN अलग हैं। वॉलेट वाला PIN एक बार डालिए, तो दोनों एक हो जाएँगे।")+'</div><button class="btn" onclick="A41.merge()">'+tx("Make them one","एक कर दें")+'</button><button class="btn ghost" onclick="WSH.bSh(0)">'+tx("Later","बाद में")+'</button>')},900)};
A41.merge=function(){H.guarded(tx("Enter wallet PIN","वॉलेट PIN डालिए"),function(p){return CPW.unlock(p)},function(r,pin){A41.setPin(pin).then(function(){H.bSh(0);toast(tx("Done. One PIN for everything.","हो गया। अब एक ही PIN।"),4000)})})};
/* ---- "Forgot PIN?" on the lock screen no longer removes the lock; the only way is the 12 words ---- */
XT.fp=function(){var sw=$("sheetWallet");if(sw)sw.classList.add("fromlock");H.bSh(1);WSX.forgot()};
var _f2=WSX.forgot2;WSX.forgot2=function(){var c=$("fgOk");if(!c||!c.checked)return _f2();try{localStorage.removeItem("cp3_pinv");if(lk)lk.style.display="none"}catch(e){}return _f2()};
var sw=$("sheetWallet");
if(sw)new MutationObserver(function(){if(!sw.classList.contains("open")){if(sw.classList.contains("fromlock"))sw.classList.remove("fromlock");var b=$("wsBody");if(b&&b.querySelector("#wsv")){b.innerHTML="";WSX.cur=null}}}).observe(sw,{attributes:true,attributeFilter:["class"]});
/* ---- backup check: one word, simple text ---- */
WS.fin=function(){
  if(!$("wsOk")||!$("wsOk").checked)return toast(tx("Please write them down first","पहले इन्हें लिख लीजिए"));
  WSX.hd();var w=(WSX.cur||"").split(" ");
  if(w.length!==12){H.bSh(0);toast(tx("Wallet created","वॉलेट बन गया"));(window.AFTER37?AFTER37():connectWallet());return}
  var a=1+Math.floor(Math.random()*12);WSX.q=[a];H.bT(tx("Check your paper","अपना कागज़ जाँचिए"));
  H.bB('<div class="cap" style="text-align:left;margin-bottom:10px">'+tx("Look at your paper and type word number "+a+".","अपने कागज़ में देखिए और शब्द नंबर "+a+" लिखिए।")+'</div><div class="inp"><input id="wsQ1" placeholder="'+tx("Word #","शब्द नंबर ")+a+'" autocomplete="off" autocapitalize="none"></div><button class="btn" onclick="WSX.chk()">'+tx("Check","जाँचें")+'</button><button class="btn ghost" onclick="WS.done(WSX.cur)">'+tx("Show my words again","मेरे शब्द फिर दिखाइए")+'</button>')};
WSX.chk=function(){var w=(WSX.cur||"").split(" "),a=(WSX.q||[1])[0],i=$("wsQ1"),x=((i&&i.value)||"").trim().toLowerCase();
  if(x&&x===w[a-1]){WSX.cur=null;toast(tx("Wallet created","वॉलेट बन गया"));if(window.AFTER37)AFTER37();else{H.bSh(0);connectWallet()}}else toast(tx("Not matching. Check your paper.","मेल नहीं खाया। अपना कागज़ देखिए।"),4000)};
/* ---- the Security page: only what an ordinary person needs ---- */
var _r41=SB.r;SB.r=function(){_r41.apply(this,arguments);try{
  var b=$("sbody"),bio=$("bioRow");if(!b||!bio)return;
  var hide=function(sel){b.querySelectorAll(sel).forEach(function(r){r.style.display="none"})};
  hide("#samePinRow");hide('[onclick*="SC.open"]');hide('[onclick*="CPW.lock"]');hide('[onclick*="SB.g(\'pin\')"]');hide('[onclick*="SB.bl"]');
  var t=bio.querySelector(".sl");if(t)t.textContent=tx("Open with fingerprint","उँगली से खोलें");
  var ln=$("lockNowRow");if(ln){var l1=ln.querySelector(".sl");if(l1)l1.textContent=tx("Lock now","अभी लॉक करें");ln.querySelectorAll("span").forEach(function(e,i){if(i>0)e.textContent=""})}
  var w=b.querySelector('[onclick*="WS.show"]');if(w){var l2=w.querySelector(".sl");if(l2)l2.textContent=tx("Backup words (12)","बैकअप शब्द (12)")}
  var sel=b.querySelector("select");if(sel&&sel.parentNode){var l3=sel.parentNode.querySelector(".sl")||sel.parentNode.firstElementChild;if(l3&&l3!==sel)l3.textContent=tx("Lock automatically after","इतनी देर बाद अपने आप लॉक")}
  b.querySelectorAll(".cap").forEach(function(c){if(/PIN protects|PIN इस फ़ोन/.test(c.textContent))c.textContent=tx("One PIN locks the whole app.","एक ही PIN पूरे ऐप को बंद रखता है।")})
}catch(e){}};
/* ---- quiet inside protections ---- */
try{ls.set("xt_bl",1)}catch(e){}
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){})}catch(e){}
if(window.__E)Object.assign(window.__E,{"Get 100 TZT (free, no fee)":"100 TZT पाएँ (मुफ़्त, कोई फ़ीस नहीं)","SIP calculator":"SIP कैलकुलेटर","EMI calculator":"EMI कैलकुलेटर","ROI calculator":"ROI कैलकुलेटर","Compound interest":"चक्रवृद्धि ब्याज","Could not fetch fee":"फ़ीस नहीं मिल सकी"});
})();

/* ===== Part 42: warning on an unofficial address, Hindi for the new Airdrop answers ===== */
(function(){
"use strict";
var tx=function(e,h){return lang==="en"?e:h};
var OK=["app.tazvera.com","cryptopay-app.vercel.app","cryptoapp-zeta-rust.vercel.app","localhost","127.0.0.1",""];
if(OK.indexOf(location.hostname)<0){
  var b=document.createElement("div");b.id="fakeBar";
  b.style.cssText="position:fixed;left:0;right:0;top:0;z-index:2000;background:#b3001b;color:#fff;padding:12px 14px;font-size:14px;font-weight:800;line-height:1.45;text-align:center";
  b.innerHTML=tx("WARNING: this is NOT the official Tazvera address. Do not enter your PIN or your 12 words here. The real app is: ","चेतावनी: यह Tazvera का असली पता नहीं है। यहाँ अपना PIN या 12 शब्द मत डालिए। असली ऐप: ")+"<b>app.tazvera.com</b>";
  document.body.appendChild(b)
}
if(window.__E)Object.assign(window.__E,{
 "Please wait a few seconds and try again.":"कुछ सेकंड रुककर फिर कोशिश कीजिए।",
 "Many testers today. Please try again tomorrow.":"आज बहुत टेस्टर आ चुके हैं। कल फिर कोशिश कीजिए।",
 "You already got TZT in the last 24 hours":"आपको पिछले 24 घंटों में TZT मिल चुका है",
 "Too many requests from this network today. Please try again tomorrow.":"आज इस नेटवर्क से बहुत अनुरोध आ चुके हैं। कल फिर कोशिश कीजिए।",
 "The test faucet is resting. Please try again tomorrow.":"टेस्ट Faucet अभी आराम कर रहा है। कल फिर कोशिश कीजिए।",
 "You already have TZT":"आपके पास पहले से TZT है",
 "Not allowed":"अनुमति नहीं है"});
})();

/* ===== Part 46: Stablecoin guide (Hindi, English, Marathi, Gujarati) ===== */
(function(){
"use strict";
var NM={en:"Stablecoin guide",hi:"स्टेबलकॉइन गाइड",mr:"स्टेबलकॉइन मार्गदर्शक",gu:"સ્ટેબલકોઇન માર્ગદર્શિકા"};
var DOC={
en:[["What is a stablecoin?","A coin built to stay near the price of a currency, usually the US dollar. One coin is about $1. Examples: USDT and USDC."],
["Why people use it","To send value quickly, to hold something steadier than BTC or ETH, and to pay across borders."],
["It is not risk-free","The price can slip below $1. The company behind it can freeze coins or fail. Rules and taxes differ by country, so check the current rules for India."],
["Mistake number 1: wrong network","The same coin exists on many networks (Ethereum, BNB Chain, Tron, Polygon and more). Sender and receiver must use the SAME network. A wrong network can mean the coins are lost for good."],
["Before you send","1. Ask the receiver which network.\n2. Copy the address and check its first 4 and last 4 characters.\n3. Send a very small test amount first.\n4. Only then send the rest."],
["Scams to avoid","Guaranteed returns. \"Double your USDT\". Anyone asking for your PIN, OTP or 12 words. Fake support, fake apps, fake websites. A \"fee\" to release your money."],
["In Tazvera today","Tazvera is a test version on Shardeum Testnet. USDT here shows a price only. Please do not use real money. We will show clear network warnings before any real stablecoin support."]],
hi:[["स्टेबलकॉइन क्या है?","ऐसा सिक्का जिसका भाव किसी मुद्रा के पास टिका रहता है, आमतौर पर अमेरिकी डॉलर। एक सिक्का लगभग $1 का। उदाहरण: USDT और USDC।"],
["लोग इसे क्यों इस्तेमाल करते हैं","पैसा तेज़ी से भेजने के लिए, BTC या ETH से ज़्यादा स्थिर चीज़ रखने के लिए, और दूसरे देशों में भुगतान के लिए।"],
["इसमें भी जोखिम है","भाव $1 से नीचे फिसल सकता है। इसे चलाने वाली कंपनी सिक्के रोक सकती है या डूब सकती है। नियम और कर देश के हिसाब से अलग हैं, इसलिए भारत के ताज़ा नियम जाँच लीजिए।"],
["सबसे बड़ी गलती: गलत नेटवर्क","एक ही सिक्का कई नेटवर्कों पर होता है (Ethereum, BNB Chain, Tron, Polygon आदि)। भेजने और पाने वाले का नेटवर्क एक ही होना चाहिए। गलत नेटवर्क पर भेजा तो सिक्के हमेशा के लिए खो सकते हैं।"],
["भेजने से पहले","1. पाने वाले से पूछिए कि कौन सा नेटवर्क।\n2. पता कॉपी करके उसके पहले और आख़िरी 4 अक्षर मिलाइए।\n3. पहले बहुत छोटी रकम का टेस्ट भेजिए।\n4. तभी बाकी भेजिए।"],
["इन ठगियों से बचिए","पक्के मुनाफ़े का वादा। \"USDT दोगुना करो\"। कोई आपसे PIN, OTP या 12 शब्द माँगे। नकली सहायता, नकली ऐप, नकली वेबसाइट। पैसा छुड़ाने के नाम पर \"फ़ीस\"।"],
["आज Tazvera में","Tazvera Shardeum Testnet पर टेस्ट वर्शन है। यहाँ USDT सिर्फ़ भाव दिखाता है। असली पैसा मत डालिए। असली स्टेबलकॉइन का सहारा आने से पहले हम नेटवर्क की साफ़ चेतावनी दिखाएँगे।"]],
mr:[["स्टेबलकॉइन म्हणजे काय?","ज्याचा भाव एखाद्या चलनाच्या जवळ टिकून राहतो असे नाणे, सहसा अमेरिकन डॉलर. एक नाणे साधारण $1 चे. उदाहरणे: USDT आणि USDC."],
["लोक ते का वापरतात","पैसे पटकन पाठवण्यासाठी, BTC किंवा ETH पेक्षा जास्त स्थिर काहीतरी ठेवण्यासाठी, आणि दुसऱ्या देशांत पैसे देण्यासाठी."],
["यातही धोका आहे","भाव $1 पेक्षा खाली घसरू शकतो. ते चालवणारी कंपनी नाणी गोठवू शकते किंवा बुडू शकते. नियम आणि कर देशानुसार वेगळे असतात, म्हणून भारताचे ताजे नियम तपासा."],
["सर्वात मोठी चूक: चुकीचे नेटवर्क","एकच नाणे अनेक नेटवर्कवर असते (Ethereum, BNB Chain, Tron, Polygon इत्यादी). पाठवणाऱ्याचे आणि घेणाऱ्याचे नेटवर्क एकच हवे. चुकीच्या नेटवर्कवर पाठवले तर नाणी कायमची हरवू शकतात."],
["पाठवण्यापूर्वी","1. घेणाऱ्याला कोणते नेटवर्क ते विचारा.\n2. पत्ता कॉपी करून त्याची पहिली आणि शेवटची 4 अक्षरे जुळवा.\n3. आधी खूप छोटी रक्कम टेस्ट म्हणून पाठवा.\n4. मगच बाकी पाठवा."],
["या फसवणुकींपासून सावध राहा","खात्रीशीर नफ्याचे वचन. \"USDT दुप्पट करा\". कोणी PIN, OTP किंवा 12 शब्द मागणे. बनावट सहाय्य, बनावट अ‍ॅप, बनावट वेबसाइट. पैसे सोडवण्यासाठी \"फी\"."],
["आज Tazvera मध्ये","Tazvera ही Shardeum Testnet वरील टेस्ट आवृत्ती आहे. येथे USDT फक्त भाव दाखवतो. खरे पैसे टाकू नका. खऱ्या स्टेबलकॉइनचा आधार येण्यापूर्वी आम्ही नेटवर्कची स्पष्ट सूचना दाखवू."]],
gu:[["સ્ટેબલકોઇન શું છે?","એવો સિક્કો જેનો ભાવ કોઈ ચલણની નજીક ટકેલો રહે, સામાન્ય રીતે અમેરિકી ડૉલર. એક સિક્કો લગભગ $1 નો. ઉદાહરણ: USDT અને USDC."],
["લોકો તેનો ઉપયોગ કેમ કરે છે","પૈસા ઝડપથી મોકલવા માટે, BTC કે ETH કરતાં વધુ સ્થિર કંઈક રાખવા માટે, અને બીજા દેશોમાં ચૂકવણી માટે."],
["તેમાં પણ જોખમ છે","ભાવ $1 થી નીચે ઘટી શકે છે. તેને ચલાવતી કંપની સિક્કા અટકાવી શકે અથવા ડૂબી શકે. નિયમો અને કર દેશ પ્રમાણે જુદા છે, તેથી ભારતના તાજા નિયમો તપાસો."],
["સૌથી મોટી ભૂલ: ખોટું નેટવર્ક","એક જ સિક્કો ઘણા નેટવર્ક પર હોય છે (Ethereum, BNB Chain, Tron, Polygon વગેરે). મોકલનાર અને મેળવનારનું નેટવર્ક એક જ હોવું જોઈએ. ખોટા નેટવર્ક પર મોકલશો તો સિક્કા હંમેશ માટે ખોવાઈ શકે છે."],
["મોકલતા પહેલાં","1. મેળવનારને પૂછો કે કયું નેટવર્ક.\n2. સરનામું કૉપી કરી તેના પહેલા અને છેલ્લા 4 અક્ષરો મેળવો.\n3. પહેલા ખૂબ નાની રકમ ટેસ્ટ તરીકે મોકલો.\n4. પછી જ બાકીની મોકલો."],
["આ છેતરપિંડીથી બચો","ખાતરીબંધ નફાનું વચન. \"USDT બમણું કરો\". કોઈ PIN, OTP કે 12 શબ્દો માગે. નકલી સહાય, નકલી એપ, નકલી વેબસાઇટ. પૈસા છોડાવવા માટે \"ફી\"."],
["આજે Tazvera માં","Tazvera Shardeum Testnet પરનું ટેસ્ટ વર્ઝન છે. અહીં USDT ફક્ત ભાવ બતાવે છે. અસલી પૈસા ન નાખશો. અસલી સ્ટેબલકોઇન સપોર્ટ આવે તે પહેલાં અમે નેટવર્કની સ્પષ્ટ ચેતવણી બતાવીશું."]]
};
var FT={en:"Educational only. Not financial, tax or legal advice.",hi:"सिर्फ़ सीखने के लिए। वित्तीय, कर या क़ानूनी सलाह नहीं।",mr:"फक्त शिकण्यासाठी. आर्थिक, कर किंवा कायदेशीर सल्ला नाही.",gu:"ફક્ત શીખવા માટે. નાણાકીય, કર કે કાનૂની સલાહ નથી."};
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
function pick(){try{var sv=localStorage.getItem("cp3_sgl");if(DOC[sv])return sv;var n=String(navigator.language||"").slice(0,2).toLowerCase();if(n==="mr"||n==="gu")return n}catch(e){}return(typeof lang!=="undefined"&&lang==="hi")?"hi":"en"}
function show(l){
  var t=$("xtT"),b=$("xtB"),sh=$("xtSheet");if(!t||!b||!sh)return;
  t.textContent="💱 "+NM[l];
  b.innerHTML=DOC[l].map(function(c){return'<div class="xt-o"><b>'+esc(c[0])+'</b><br>'+esc(c[1]).replace(/\n/g,"<br>")+"</div>"}).join("")
   +'<div class="cap" style="margin-top:12px;text-align:center;font-size:12px">'+esc(FT[l])+'</div>'
   +'<div class="cap" style="margin-top:10px;text-align:center;font-size:13px">'+["hi","en","mr","gu"].map(function(k){var n={hi:"हिंदी",en:"English",mr:"मराठी",gu:"ગુજરાતી"}[k];return k===l?"<b>"+n+"</b>":'<a href="#" onclick="SG.l(\''+k+'\');return false">'+n+"</a>"}).join(" · ")+"</div>";
  sh.classList.add("open")}
window.SG={open:function(){show(pick())},l:function(k){try{localStorage.setItem("cp3_sgl",k)}catch(e){}show(k)}};
if(window.__E)Object.assign(window.__E,{"Stablecoin guide":"स्टेबलकॉइन गाइड"});
})();

/* ===== Part 49: Buy / Sell page (honest "not yet" page) ===== */
(function(){
"use strict";
var NM={en:"Buy & Sell",hi:"खरीद और बिक्री",mr:"खरेदी आणि विक्री",gu:"ખરીદી અને વેચાણ"};
var DOC={
en:[["Not available yet","Tazvera cannot buy or sell coins yet. Buying and selling needs a licensed partner, security checks and legal advice. We will not show a fake Buy button."],
["How it will work","A licensed partner company opens its own page. You do the KYC and the payment there. The coins arrive in your Tazvera address. Your keys stay on your phone, and your money never passes through Tazvera."],
["What has to happen first","1. Security review of the app.\n2. Legal and tax advice.\n3. A licensed partner for India.\n4. Real-money networks, opened with small limits."],
["Until then","This is a test version. Do not put real money in it. If you want to buy coins now, use only a registered exchange app, from its official website or the Play Store. Never buy from strangers or from agents on WhatsApp or Telegram."]],
hi:[["अभी उपलब्ध नहीं","Tazvera से अभी सिक्के खरीदे या बेचे नहीं जा सकते। इसके लिए लाइसेंस वाला साझेदार, सुरक्षा जाँच और क़ानूनी सलाह चाहिए। हम नकली Buy बटन नहीं दिखाएँगे।"],
["यह कैसे चलेगा","लाइसेंस वाली साझेदार कंपनी का अपना पन्ना खुलेगा। KYC और भुगतान वहीं होंगे। सिक्के आपके Tazvera पते पर आएँगे। आपकी चाबी आपके फ़ोन में रहेगी, और आपका पैसा Tazvera से होकर नहीं गुज़रेगा।"],
["पहले क्या होना ज़रूरी है","1. ऐप की सुरक्षा जाँच।\n2. क़ानूनी और कर की सलाह।\n3. भारत के लिए लाइसेंस वाला साझेदार।\n4. असली पैसे वाले नेटवर्क, छोटी सीमा के साथ।"],
["तब तक","यह टेस्ट वर्शन है। इसमें असली पैसा मत डालिए। अभी सिक्के खरीदने हों तो सिर्फ़ पंजीकृत एक्सचेंज का ऐप, उसकी असली साइट या Play Store से। अनजान लोगों या WhatsApp और Telegram के एजेंटों से कभी नहीं।"]],
mr:[["अजून उपलब्ध नाही","Tazvera वरून अजून नाणी खरेदी किंवा विक्री करता येत नाहीत. त्यासाठी परवानाधारक भागीदार, सुरक्षा तपासणी आणि कायदेशीर सल्ला लागतो. आम्ही बनावट Buy बटण दाखवणार नाही."],
["हे कसे चालेल","परवानाधारक भागीदार कंपनीचे स्वतःचे पान उघडेल. KYC आणि पेमेंट तिथेच होईल. नाणी तुमच्या Tazvera पत्त्यावर येतील. तुमची चावी तुमच्या फोनमध्येच राहील, आणि तुमचे पैसे Tazvera मधून जाणार नाहीत."],
["आधी काय व्हायला हवे","1. अ‍ॅपची सुरक्षा तपासणी.\n2. कायदेशीर आणि कर सल्ला.\n3. भारतासाठी परवानाधारक भागीदार.\n4. खऱ्या पैशाचे नेटवर्क, लहान मर्यादेसह."],
["तोपर्यंत","ही टेस्ट आवृत्ती आहे. यात खरे पैसे टाकू नका. आत्ता नाणी घ्यायची असतील तर फक्त नोंदणीकृत एक्सचेंजचे अ‍ॅप, त्याच्या खऱ्या साइटवरून किंवा Play Store वरून. अनोळखी लोकांकडून किंवा WhatsApp आणि Telegram वरील एजंटकडून कधीही नाही."]],
gu:[["હજી ઉપલબ્ધ નથી","Tazvera માંથી હજી સિક્કા ખરીદી કે વેચી શકાતા નથી. તેના માટે લાઇસન્સવાળો ભાગીદાર, સુરક્ષા તપાસ અને કાનૂની સલાહ જોઈએ. અમે નકલી Buy બટન બતાવીશું નહીં."],
["આ કેવી રીતે ચાલશે","લાઇસન્સવાળી ભાગીદાર કંપનીનું પોતાનું પેજ ખુલશે. KYC અને ચુકવણી ત્યાં જ થશે. સિક્કા તમારા Tazvera સરનામે આવશે. તમારી ચાવી તમારા ફોનમાં જ રહેશે, અને તમારા પૈસા Tazvera માંથી પસાર થશે નહીં."],
["પહેલાં શું થવું જરૂરી છે","1. એપની સુરક્ષા તપાસ.\n2. કાનૂની અને કર સલાહ.\n3. ભારત માટે લાઇસન્સવાળો ભાગીદાર.\n4. અસલી પૈસાવાળા નેટવર્ક, નાની મર્યાદા સાથે."],
["ત્યાં સુધી","આ ટેસ્ટ વર્ઝન છે. તેમાં અસલી પૈસા ન નાખશો. હમણાં સિક્કા ખરીદવા હોય તો ફક્ત નોંધાયેલ એક્સચેંજની એપ, તેની અસલી સાઇટ કે Play Store પરથી. અજાણ્યા લોકો કે WhatsApp અને Telegram ના એજન્ટ પાસેથી ક્યારેય નહીં."]]
};
var UP={en:"Updates: ",hi:"ताज़ा खबर: ",mr:"ताज्या बातम्या: ",gu:"તાજા સમાચાર: "};
var LBL={en:"Buy / Sell",hi:"खरीद / बिक्री"};
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
function pick(){try{var sv=localStorage.getItem("cp3_sgl");if(DOC[sv])return sv;var n=String(navigator.language||"").slice(0,2).toLowerCase();if(n==="mr"||n==="gu")return n}catch(e){}return(typeof lang!=="undefined"&&lang==="hi")?"hi":"en"}
function show(l){
  var t=$("xtT"),b=$("xtB"),sh=$("xtSheet");if(!t||!b||!sh)return;
  t.textContent="🛒 "+NM[l];
  b.innerHTML=DOC[l].map(function(c){return'<div class="xt-o"><b>'+esc(c[0])+'</b><br>'+esc(c[1]).replace(/\n/g,"<br>")+"</div>"}).join("")
   +'<div class="cap" style="margin-top:12px;text-align:center;font-size:13px">'+esc(UP[l])+'<a href="https://t.me/TazveraApp" target="_blank" rel="noopener">t.me/TazveraApp</a></div>'
   +'<div class="cap" style="margin-top:10px;text-align:center;font-size:13px">'+["hi","en","mr","gu"].map(function(k){var n={hi:"हिंदी",en:"English",mr:"मराठी",gu:"ગુજરાતી"}[k];return k===l?"<b>"+n+"</b>":'<a href="#" onclick="BS.l(\''+k+'\');return false">'+n+"</a>"}).join(" · ")+"</div>";
  sh.classList.add("open")}
window.BS={open:function(){show(pick())},l:function(k){try{localStorage.setItem("cp3_sgl",k)}catch(e){}show(k)}};
var lk=document.createElement("style");lk.textContent="#xtB a{color:var(--y);font-weight:700;text-decoration:underline}";document.head.appendChild(lk);
var row=document.querySelector(".acts");
if(row&&!$("btnBS")){var b=document.createElement("button");b.className="act";b.setAttribute("onclick","BS.open()");
  b.innerHTML='<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h11M15 5l3 3-3 3M17 16H6M9 13l-3 3 3 3"/></svg></span><b id="btnBS"></b>';row.appendChild(b)}
function upd(){var e=$("btnBS");if(e)e.textContent=(typeof lang!=="undefined"&&lang==="hi")?LBL.hi:LBL.en}
if(typeof changeLang==="function"){var _cl=changeLang;window.changeLang=changeLang=function(){var r=_cl.apply(this,arguments);upd();return r}}
upd();
})();

/* ===== Build 51/52: confirm before sending ===== */
(function(){ try{
  var tx=function(e,h){return (typeof lang!=="undefined"&&lang==="en")?e:h};
  var esc=function(x){return String(x).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};

  /* ---- 1) Estimated network fee (read-only) ---- */
  function feeInfo(isTok){
    var job=(async function(){
      var h=await ethereum.request({method:"eth_gasPrice"});
      var gp=BigInt(h); if(gp<=0n) return null;
      var gas=BigInt(isTok?70000:21000);
      var v=Number(gp*gas)/1e18;
      var sym=(NETWORKS[currentNet]&&NETWORKS[currentNet].symbol)||"";
      var t=v>=100?v.toFixed(0):v>=1?v.toFixed(2):v.toFixed(5);
      return t+" "+sym;
    })();
    var to=new Promise(function(r){setTimeout(function(){r(null)},2500)});
    return Promise.race([job.catch(function(){return null}),to]);
  }

  /* ---- 2) Confirmation card ---- */
  function confirmSend(o){
    return new Promise(function(res){
      var ov=document.createElement("div"); ov.className="b51-ov";
      var a=o.to, big=a.slice(0,6)+" … "+a.slice(-6);
      var badge=o.real?'<span class="b51-bd real">'+tx("REAL MONEY","असली पैसा")+'</span>':'<span class="b51-bd test">'+tx("TEST","टेस्ट")+'</span>';
      var nm=(NETWORKS[currentNet]&&NETWORKS[currentNet].name)||"";
      ov.innerHTML=
        '<div class="b51-card" role="dialog" aria-modal="true">'+
          '<div class="b51-ttl">'+tx("Check before you send","भेजने से पहले जाँचिए")+'</div>'+
          '<div class="b51-row"><small>'+tx("To","किसे")+'</small><div class="b51-big">'+esc(big)+'</div><div class="b51-full">'+esc(a)+'</div></div>'+
          '<div class="b51-row"><small>'+tx("Amount","रकम")+'</small><div class="b51-amt">'+esc(o.amt)+' <span>'+esc(o.unit)+'</span></div></div>'+
          '<div class="b51-row two"><div><small>'+tx("Network","नेटवर्क")+'</small><div>'+esc(nm)+' '+badge+'</div></div>'+
          '<div><small>'+tx("Network fee (about)","नेटवर्क फ़ीस (लगभग)")+'</small><div>'+(o.fee?esc(o.fee):tx("shown in your wallet","वॉलेट में दिखेगी"))+'</div></div></div>'+
          '<div class="b51-warn">'+tx("Once sent, it cannot be taken back. Check every letter of the address.","भेजने के बाद यह वापस नहीं होगा। पते का एक-एक अक्षर जाँच लीजिए।")+'</div>'+
          (o.real?'<label class="b51-chk"><input type="checkbox" id="b51ok"> '+tx("I checked the address and amount","मैंने पता और रकम जाँच ली है")+'</label>':'')+
          '<div class="b51-btns"><button class="b51-no" id="b51no">'+tx("Cancel","रद्द करें")+'</button><button class="b51-go" id="b51go"'+(o.real?' disabled':'')+'>'+tx("Yes, send","हाँ, भेजें")+'</button></div>'+
        '</div>';
      document.body.appendChild(ov);
      function done(v){if(ov.parentNode)ov.parentNode.removeChild(ov);res(v)}
      var go=ov.querySelector("#b51go"), no=ov.querySelector("#b51no"), ck=ov.querySelector("#b51ok");
      if(ck)ck.onchange=function(){go.disabled=!ck.checked};
      go.onclick=function(){if(!go.disabled)done(true)};
      no.onclick=function(){done(false)};
      ov.onclick=function(e){if(e.target===ov)done(false)};
    });
  }

  /* ---- 3) Wrap Send ---- */
  var _p=doSend, busy=false, pass=false;
  doSend=async function(){
    if(pass){pass=false;return _p.apply(this,arguments)}
    if(busy)return;
    var to=(($("sendTo")||{}).value||"").trim();
    var amt=parseFloat(($("sendAmt")||{}).value);
    if(!/^0x[0-9a-fA-F]{40}$/.test(to)||!(amt>0))return _p.apply(this,arguments);
    busy=true; var ok=false;
    try{
      var t=window.XA&&XA.tok&&XA.tok();
      var unit=((($("sendUnit")||{}).textContent)||"").trim();
      var fee=await feeInfo(!!t);
      ok=await confirmSend({to:to,amt:$("sendAmt").value,unit:unit,fee:fee,real:!/testnet|sepolia/.test(currentNet)});
    }finally{busy=false}
    if(!ok)return;
    pass=true;
    try{return await _p.apply(this,arguments)}finally{pass=false}
  };

}catch(e){try{console.error("Build51",e)}catch(_){}}})();


/* ===== Build 53: own icon for every Services tile, clearer free-TZT messages ===== */
(function(){ try{
  var tx=function(e,h){return (typeof lang!=="undefined"&&lang==="en")?e:h};

  /* ---- free TZT: say clearly, in plain words, what happened ---- */
  function human(m){
    m=String(m||"");
    if(/already got TZT|last 24 hours/i.test(m))return tx("You already got TZT in the last 24 hours. Please try again tomorrow.","आपको पिछले 24 घंटे में TZT मिल चुका है। कल फिर कोशिश कीजिए।");
    if(/already have/i.test(m)||/plenty/i.test(m))return tx("You already hold plenty of TZT.","आपके पास पहले से काफ़ी TZT है।");
    if(/Many testers/i.test(m))return tx("Many testers today. Please try again tomorrow.","आज बहुत टेस्टर आए। कल फिर कोशिश कीजिए।");
    if(/Too many requests/i.test(m))return tx("Too many requests from this network today. Try again tomorrow.","इस नेटवर्क से आज बहुत माँगें आईं। कल फिर कोशिश कीजिए।");
    if(/resting/i.test(m))return tx("The test faucet is refilling. Please try again tomorrow.","टेस्ट सिक्कों का भंडार अभी भर रहा है। कल फिर कोशिश कीजिए।");
    if(/wait a few seconds/i.test(m))return tx("Please wait a few seconds and press again.","कुछ सेकंड रुककर फिर दबाइए।");
    if(/not set up/i.test(m))return tx("The free faucet is not set up yet.","मुफ़्त वाला भंडार अभी तैयार नहीं है।");
    return tx("Not possible right now: ","अभी नहीं हो पाया: ")+m;
  }
  function say(t,k){
    var b=document.getElementById("calcBox"); if(!b)return;
    var d=document.getElementById("b53air");
    if(!d){d=document.createElement("div");d.id="b53air";var c=b.querySelector(".cap");if(c&&c.parentNode)c.parentNode.insertBefore(d,c.nextSibling);else b.insertBefore(d,b.firstChild)}
    d.className="b53msg "+k; d.textContent=t;
  }
  if(typeof FQ!=="undefined"&&FQ){
    var _d=FQ.draw;
    FQ.draw=function(){var r=_d.apply(this,arguments);try{var d=document.getElementById("b53air");if(d&&d.parentNode)d.parentNode.removeChild(d)}catch(e){}return r};
    FQ.air=async function(){
      if(!addr){await connectWallet();if(!addr)return}
      say(tx("Sending 100 TZT…","100 TZT भेज रहा हूँ…"),"info");
      try{
        var r=await fetch("/api/airdrop?address="+addr),d=await r.json();
        if(d.ok){say(tx("Sent: 100 TZT. It will show in a few seconds.","100 TZT भेज दिए। कुछ सेकंड में दिखेंगे।"),"ok");logTx("in","100","TZT",d.hash);setTimeout(readCustomBalances,8000)}
        else say(human(d.error),"err");
      }catch(e){say(tx("Network problem. Please try again.","नेटवर्क की दिक्कत। फिर कोशिश कीजिए।"),"err")}
    };
  }
}catch(e){try{console.error("Build53",e)}catch(_){}}})();


/* ===== Build 54: our own two-tone icons (white or dark line + one yellow part) ===== */
(function(){ try{
  var IC={
   fee:['<path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M5 20h9M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/>','<path d="M8 8.5h3"/>'],
   conv:['<path d="M5 8h13M15 5l3 3-3 3"/>','<path d="M19 16H6M9 13l-3 3 3 3"/>'],
   csv:['<path d="M5 19h14M7 15v4M17 15v4"/>','<path d="M12 4v10M8.5 10.5L12 14l3.5-3.5"/>'],
   expl:['<circle cx="11" cy="12" r="8"/><path d="M3 12h16M11 4c3 3 3 13 0 16M11 4c-3 3-3 13 0 16"/>','<circle cx="18.5" cy="6" r="2.2" fill="currentColor" stroke="none"/>'],
   bell:['<path d="M6 17h12M8 17v-5a4 4 0 0 1 8 0v5M10.5 20h3"/>','<path d="M4 7l2-2M20 7l-2-2"/>'],
   book:['<rect x="5" y="3.5" width="13" height="17" rx="2.5"/><path d="M8 17c.8-2 2-3 3.5-3s2.7 1 3.5 3"/>','<circle cx="11.5" cy="9.5" r="2.4" fill="currentColor" stroke="none"/>'],
   sip:['<path d="M4 4v16h16"/>','<path d="M7.5 15l4-4 3 3 4.5-6"/>'],
   emi:['<path d="M6 10v7M10 10v7M14 10v7M18 10v7M4 19h16"/>','<path d="M4 10l8-5 8 5"/>'],
   home:['<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>','<path d="M10 21v-5h4v5"/>'],
   pie:['<circle cx="12" cy="12" r="8"/>','<path d="M12 12V4a8 8 0 0 1 8 8z" fill="currentColor" stroke="none"/>'],
   roi:['<path d="M18 6L6 18"/>','<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>'],
   comp:['<path d="M4 12l8 4 8-4M4 16l8 4 8-4"/>','<path d="M12 4l8 4-8 4-8-4z"/>'],
   split:['<circle cx="9" cy="12" r="5.5"/>','<circle cx="15" cy="12" r="5.5"/>'],
   pl:['<path d="M4 20h16"/>','<path d="M5 15l5-5 3 3 6-6M15 7h4v4"/>'],
   assets:['<path d="M6 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16M3 21h18M15 10h3a1 1 0 0 1 1 1v10"/>','<path d="M9 8h2M9 12h2M9 16h2"/>'],
   cal:['<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16"/>','<path d="M8 3v4M16 3v4"/>'],
   check:['<path d="M10 7h9M10 12h9M10 17h9"/>','<path d="M4.5 7l1.3 1.3L8 6M4.5 12l1.3 1.3L8 11M4.5 17l1.3 1.3L8 16"/>'],
   flag:['<path d="M6 21V4"/>','<path d="M6 5h11l-2.5 3.5L17 12H6"/>'],
   learn:['<path d="M5 5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2z"/>','<path d="M15 3v6l-2-1.4L11 9V3"/>'],
   coins:['<path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>','<ellipse cx="12" cy="6" rx="7" ry="3" fill="currentColor" stroke="none"/>'],
   tips:['<path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.4 1-1.9A6 6 0 0 0 12 3z"/>','<path d="M9.5 18.5h5M10.5 21h3"/>'],
   quiz:['<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3"/>','<path d="M12 13v4M9 20h6"/>'],
   fire:['<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>','<path d="M12 18a2 2 0 0 0 2-2c0-1-1-1.5-2-3-1 1.5-2 2-2 3a2 2 0 0 0 2 2z"/>'],
   hist:['<path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"/>','<path d="M12 8v4l3 2"/>'],
   shield:['<path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z"/>','<path d="M8.8 12l2.4 2.4 4-4.6"/>'],
   drop:['<path d="M12 3.5c3.5 4 6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 2.5-6 6-10z"/>','<path d="M9.5 14.5a2.7 2.7 0 0 0 2.5 2.5"/>'],
   info:['<circle cx="12" cy="12" r="9"/>','<path d="M12 11v5"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/>'],
   ring:['<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2"/>','<circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>'],
   chat:['<path d="M4 5h16v11H9l-5 4z"/>','<path d="M8 9.5h8M8 12.5h5"/>'],
   lock:['<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>','<circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>'],
   doc:['<path d="M7 3h7l4 4v14H7zM14 3v4h4"/>','<path d="M9.5 14l2 2 3.5-4"/>'],
   wallet:['<path d="M4 7a2 2 0 0 1 2-2h11v4M4 7v11a2 2 0 0 0 2 2h13V9H6a2 2 0 0 1-2-2z"/>','<circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none"/>'],
   net:['<path d="M12 9.6V5.8M9.9 13.2L6.6 15.6M14.1 13.2l3.3 2.4"/>','<circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><circle cx="12" cy="4" r="1.8"/><circle cx="5.2" cy="17" r="1.8"/><circle cx="18.8" cy="17" r="1.8"/>'],
   theme:['<circle cx="12" cy="12" r="8"/>','<path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>'],
   lang:['<path d="M4 6h9M8.5 4v2M6 6c0 4 3 7 7 8M11 6c0 3-2 6-6 8"/>','<path d="M13 20l4-9 4 9M14.5 17h5"/>'],
   svc:['<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>','<rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor" stroke="none"/>'],
   set:['<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/>','<circle cx="15" cy="7" r="2.3" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="2.3" fill="currentColor" stroke="none"/>'],
   robot:['<rect x="5" y="8" width="14" height="11" rx="3.5"/>','<path d="M12 8V5M10 5h4"/><circle cx="9.5" cy="13.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="13.5" r="1.2" fill="currentColor" stroke="none"/>']
  };
  var SVC=[["fee","conv","csv","expl","bell","book"],["sip","emi","home","pie","roi","comp","split","pl"],["assets","cal","check","flag","learn","coins"],["tips","quiz","fire","bell","hist","shield"],["drop","info"],["ring","chat","lock","doc"]];
  var SETK={"XN.open":"net","connectWallet":"wallet","'app'":"theme","'sec'":"shield","'noti'":"bell","'disp'":"lang","'dat'":"ring","'abt'":"info"};
  function mk(svg,k,sw){var d=IC[k];if(!d||!svg)return;svg.setAttribute("class","tt");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("fill","none");svg.removeAttribute("stroke");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");svg.setAttribute("stroke-width",sw||"1.7");svg.setAttribute("data-t",k);svg.innerHTML='<g class="m" stroke="currentColor">'+d[0]+'</g><g class="y" stroke="currentColor">'+d[1]+'</g>'}
  var busy=false;
  function apply(){ if(busy)return; busy=true; try{
    document.querySelectorAll("#sheetSvc .svg-g button").forEach(function(b){var m=/SV\.go\((\d+),\s*(\d+)\)/.exec(b.getAttribute("onclick")||"");if(!m)return;var k=(SVC[+m[1]]||[])[+m[2]];var s=b.querySelector(".svi svg");if(k&&s&&s.getAttribute("data-t")!==k)mk(s,k)});
    document.querySelectorAll("#sheetSet .sr").forEach(function(r){var oc=r.getAttribute("onclick")||"";var s=r.querySelector(".si svg");if(!s)return;var k=null;for(var p in SETK){if(oc.indexOf(p)>-1){k=SETK[p];break}}if(k&&s.getAttribute("data-t")!==k)mk(s,k)});
    var nb=document.querySelectorAll("nav.bn button");["home","svc","set"].forEach(function(k,i){var b=nb[i];if(!b)return;var s=b.querySelector("i svg");if(s&&s.getAttribute("data-t")!==k)mk(s,k,"1.8")});
    var FACE='<rect x="14" y="26" width="72" height="54" rx="15" fill="#FFD60A"/><ellipse cx="37" cy="51" rx="5.2" ry="7" fill="#1C2230"/><ellipse cx="63" cy="51" rx="5.2" ry="7" fill="#1C2230"/><path d="M40 66Q50 73 60 66" fill="none" stroke="#1C2230" stroke-width="4.5" stroke-linecap="round"/><path d="M50 26V16" stroke="#FFD60A" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="13" r="4.5" fill="#FFD60A"/>';function face(sv){if(!sv||sv.getAttribute("data-t")==="face")return;sv.setAttribute("class","face");sv.setAttribute("viewBox","0 0 100 100");sv.setAttribute("fill","none");sv.removeAttribute("stroke");sv.removeAttribute("stroke-width");sv.setAttribute("data-t","face");sv.innerHTML=FACE}var hb=document.getElementById("hbBtn");if(hb)face(hb.querySelector("svg"));var hh=document.querySelector("#hbPanel .hbh svg");face(hh);
    var hr=document.getElementById("hbRow");if(hr&&!hr.querySelector(".si")){var sp=document.createElement("span");sp.className="si";sp.innerHTML="<svg></svg>";hr.insertBefore(sp,hr.firstChild);mk(sp.firstChild,"robot")}
    var ch=document.querySelector("#sheetSvc .svc-chips");if(ch&&!ch.querySelector("button.on")&&ch.firstElementChild)ch.firstElementChild.classList.add("on");
  }catch(e){} busy=false}
  ["sheetSvc","sheetSet"].forEach(function(id){var h=document.getElementById(id);if(h){try{new MutationObserver(apply).observe(h,{childList:true,subtree:true})}catch(e){}}});
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".svc-chips button");if(b){var p=b.parentNode;[].forEach.call(p.children,function(x){x.classList.remove("on")});b.classList.add("on")}});
  apply(); setTimeout(apply,800); setTimeout(apply,2000);
}catch(e){try{console.error("Build54",e)}catch(_){}}})();


/* ===== Build 55: in-app wallet stays on the test network ===== */
(function(){ try{
  function fix(){try{if(window.ethereum&&window.ethereum.isCpWallet&&typeof currentNet!=="undefined"&&!/testnet|sepolia/.test(currentNet)&&!(currentNet==="shardeum"&&localStorage.getItem("cp3_mainnet_beta")==="1")&&typeof changeNetwork==="function"){changeNetwork("shardeum-testnet")}}catch(e){}}
  setTimeout(fix,1200);setTimeout(fix,3000);
}catch(e){try{console.error("Build55",e)}catch(_){}}})();


/* ===== Build 59 (step 1): remove leftover emoji from page titles and tip rows ===== */
(function(){ try{
  var RE=/^[\s\u200d\ufe0f]*(?:[\u2190-\u2bff\u3030\u303d\u3297\u3299]|[\ud83c-\ud83e][\udc00-\udfff]|\ufe0f)+[\s\u200d\ufe0f]*/;
  var busy=false;
  function clean(){ if(busy)return; busy=true; try{
    document.querySelectorAll(".shade .ttl, .shade .xt-o").forEach(function(e){
      if(e.classList.contains("xt-o")&&e.querySelector("input,button,svg,span[style*='font-size:20px']"))return;
      var n=e.firstChild; if(n&&n.nodeType===3&&RE.test(n.nodeValue)){n.nodeValue=n.nodeValue.replace(RE,"")}
    });
  }catch(e){} busy=false}
  var mo=new MutationObserver(clean);
  document.querySelectorAll(".shade").forEach(function(h){try{mo.observe(h,{childList:true,subtree:true,characterData:true})}catch(e){}});
  clean();
}catch(e){try{console.error("Build57",e)}catch(_){}}})();

/* ===== Build 59: clear Send (address first, then amount), tidy Receive and Request, small network-fee card, real price converter, helper face ===== */
(function(){ try{
var $=function(i){return document.getElementById(i)};
var tx=function(e,h){return (typeof lang!=="undefined"&&lang==="en")?e:h};
var ADDR=/^0x[0-9a-fA-F]{40}$/;
var S58=window.S58={};
function ic(p,z){return '<svg viewBox="0 0 24 24" width="'+(z||22)+'" height="'+(z||22)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var I_PASTE='<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>';
var I_SCAN='<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>';
var I_BOOK='<rect x="5" y="3.5" width="13" height="17" rx="2.5"/><circle cx="11.5" cy="9.5" r="2.2"/><path d="M8 17c.8-2 2-3 3.5-3s2.7 1 3.5 3"/>';
function short(a){return a?a.slice(0,6)+"…"+a.slice(-4):""}
function tokNow(){try{return (window.XA&&XA.tok)?XA.tok():null}catch(e){return null}}
function symNow(){var t=tokNow();return t?t.symbol:NETWORKS[currentNet].symbol}

/* ---------- SEND ---------- */
function buildSend(){
 var pn=document.querySelector("#sheetSend .panel"),st=$("sendTo"),sa=$("sendAmt");
 if(!pn||!st||!sa||$("s58send"))return;
 var addrBox=st.parentNode,amtBox=sa.parentNode;
 var w=document.createElement("div");w.id="s58send";
 var row=document.createElement("div");row.className="s58row";
 var a=pn.querySelector(".xnc-slot"),b=pn.querySelector(".xas-slot");if(a)row.appendChild(a);if(b)row.appendChild(b);
 w.appendChild(row);
 var s1=document.createElement("div");s1.id="s58s1";
 s1.innerHTML='<div class="s58q" id="s58q1"></div><div id="s58vslot"></div><div id="s58aslot"></div><div class="s58hint" id="s58hint"></div>'+
  '<div class="s58three"><button type="button" onclick="S58.paste()">'+ic(I_PASTE)+'<span id="s58l1"></span></button><button type="button" onclick="S58.scan()">'+ic(I_SCAN)+'<span id="s58l2"></span></button><button type="button" onclick="S58.book()">'+ic(I_BOOK)+'<span id="s58l3"></span></button></div>'+
  '<div id="s58recent"></div><button type="button" class="btn s58off" id="s58next" onclick="S58.next()"></button>';
 var s2=document.createElement("div");s2.id="s58s2";s2.style.display="none";
 s2.innerHTML='<div class="s58to"><span id="s58to"></span><u onclick="S58.go(1)" id="s58chg"></u></div><div class="s58q" id="s58q2"></div><div id="s58mslot"></div><div class="s58maxrow"><button type="button" class="s58max" onclick="S58.max()" id="s58maxb">MAX</button></div><div id="s58fslot"></div><div id="s58gslot"></div><div id="s58bslot"></div>';
 w.appendChild(s1);w.appendChild(s2);
 var bk=pn.querySelector(".bkh");if(bk)bk.after(w);else pn.prepend(w);
 var vid=$("scanVid");if(vid)$("s58vslot").appendChild(vid);
 addrBox.classList.add("s58addr");$("s58aslot").appendChild(addrBox);
 amtBox.classList.add("s58amt");$("s58mslot").appendChild(amtBox);
 var fee=$("sendFee");if(fee)$("s58fslot").appendChild(fee);
 var msg=$("sendMsg");if(msg)$("s58gslot").appendChild(msg);
 var sb=$("sendBtn");if(sb)$("s58bslot").appendChild(sb);
 st.addEventListener("input",S58.sync);
 pn.addEventListener("click",function(e){var x=e.target.closest&&e.target.closest(".bkb");if(x&&$("s58s2").style.display!=="none"){e.stopPropagation();e.preventDefault();S58.go(1)}},true);
 S58.text();
}
S58.text=function(){
 var set=function(i,v){var e=$(i);if(e)e.textContent=v};
 set("s58q1",tx("Who do you want to send to?","किसे भेजना है?"));
 set("s58l1",tx("Paste","चिपकाएँ"));set("s58l2",tx("Scan","स्कैन करें"));set("s58l3",tx("Address book","पतों की किताब"));
 set("s58next",tx("Next","आगे"));set("s58chg",tx("Change","बदलें"));
 set("s58q2",tx("How much?","कितना भेजना है?"));
 var st=$("sendTo");if(st)st.placeholder=tx("Type or paste the address (0x...)","यहाँ पता डालिए (0x...)");
 var sa=$("sendAmt");if(sa)sa.placeholder="0";
 var sb=$("sendBtn");if(sb)sb.textContent=tx("Send "+symNow(),symNow()+" भेजें");
};
S58.sync=function(){
 var st=$("sendTo");if(!st)return;var v=st.value.trim(),ok=ADDR.test(v),nx=$("s58next");
 if(nx){nx.classList.toggle("s58off",!ok)}
 var h=$("s58hint");if(h)h.textContent=(v&&!ok)?tx("An address starts with 0x and has 42 characters.","पता 0x से शुरू होता है और 42 अक्षर का होता है।"):"";
};
S58.go=function(n){
 var s1=$("s58s1"),s2=$("s58s2");if(!s1||!s2)return;
 if(n===2){var v=$("sendTo").value.trim();if(!ADDR.test(v))return S58.sync();
  $("s58to").textContent=short(v)+" ✓";s1.style.display="none";s2.style.display="block";S58.text();
  var sa=$("sendAmt");try{sa.dispatchEvent(new Event("input"))}catch(e){} setTimeout(function(){try{sa.focus()}catch(e){}},200)}
 else{s2.style.display="none";s1.style.display="block";S58.sync()}
};
S58.next=function(){S58.go(2)};
S58.paste=async function(){
 try{var t=await navigator.clipboard.readText();var m=(t||"").match(/0x[0-9a-fA-F]{40}/);
  if(m){$("sendTo").value=m[0];S58.sync();toast(tx("Pasted","चिपका दिया"))}else toast(tx("No address copied yet","कॉपी किया हुआ पता नहीं मिला"),3000)}
 catch(e){toast(tx("Press and hold the box, then tap Paste","डिब्बे को देर तक दबाइए, फिर चिपकाएँ चुनिए"),4000);try{$("sendTo").focus()}catch(_){}}
};
S58.scan=function(){try{scanQR()}catch(e){}};
S58.book=function(){try{openBook()}catch(e){}};
S58.max=async function(){
 var t=tokNow(),sa=$("sendAmt"),v=0;
 if(t){v=parseFloat(t.bal)||0}
 else{var n=NETWORKS[currentNet],bal=parseFloat(T[n.symbol].bal)||0,fee=0;try{var g=await ethereum.request({method:"eth_gasPrice"});fee=Number(BigInt(g))*21000/1e18}catch(e){}
  v=Math.max(0,bal-fee*1.25)}
 sa.value=v>0?String(Math.floor(v*1e6)/1e6):"0";try{sa.dispatchEvent(new Event("input"))}catch(e){}
};
S58.recent=function(){
 var b=$("s58recent");if(!b)return;var c=(typeof contacts!=="undefined"&&contacts)?contacts.slice(0,3):[];
 if(!c.length){b.innerHTML="";return}
 b.innerHTML='<div class="s58sub">'+tx("From your address book","पतों की किताब से")+'</div>'+c.map(function(x,i){return '<div class="s58rc" onclick="S58.pickC('+i+')"><i>'+String(x.n||"?").slice(0,1).toUpperCase()+'</i><div><b>'+String(x.n||"").replace(/</g,"&lt;")+'</b><small>'+short(x.a)+'</small></div></div>'}).join("");
};
S58.pickC=function(i){var c=contacts[i];if(!c)return;$("sendTo").value=c.a;S58.sync();S58.go(2)};
var _os58=window.openSend;
window.openSend=async function(){
 buildSend();
 await _os58.apply(this,arguments);
 S58.text();S58.recent();S58.sync();
 var v=($("sendTo")||{value:""}).value.trim();
 S58.go(ADDR.test(v)?2:1);
};
/* after a QR scan fills the address, go to the amount step */
setInterval(function(){var sh=$("sheetSend");if(!sh||!sh.classList.contains("open"))return;var m=$("sendMsg"),s1=$("s58s1");
 if(m&&s1&&s1.style.display!=="none"&&/Scanned/i.test(m.textContent||"")&&ADDR.test($("sendTo").value.trim())){m.textContent="";S58.go(2)}
 S58.sync()},600);

/* ---------- RECEIVE ---------- */
function buildRecv(){
 var pn=document.querySelector("#sheetRecv .panel");if(!pn||pn.querySelector(".s58row"))return;
 var a=pn.querySelector(".xnc-slot"),b=pn.querySelector(".xas-slot");if(!a)return;
 var row=document.createElement("div");row.className="s58row";var h=pn.querySelector(".rc-h");
 if(h)h.after(row);else pn.prepend(row);row.appendChild(a);if(b)row.appendChild(b);
}
var _or58=window.openReceive;
if(_or58)window.openReceive=async function(){buildRecv();return _or58.apply(this,arguments)};

/* ---------- REQUEST (with a coin chooser) ---------- */
function buildReq(){
 var pn=document.querySelector("#sheetReq .panel");if(!pn||pn.querySelector(".s58row"))return;
 var row=document.createElement("div");row.className="s58row";row.innerHTML='<div class="xnc-slot"></div><div class="xas-slot"></div>';
 var bk=pn.querySelector(".bkh");if(bk)bk.after(row);else pn.prepend(row);
 var cap=pn.querySelector(".cap");if(cap)cap.style.display="none";
}
S58.syncChips=function(){
 var s=document.querySelector("#sheetSend .xnc-slot"),a=document.querySelector("#sheetSend .xas-slot");
 document.querySelectorAll("#sheetReq .xnc-slot").forEach(function(e){if(s)e.innerHTML=s.innerHTML});
 document.querySelectorAll("#sheetReq .xas-slot").forEach(function(e){if(a)e.innerHTML=a.innerHTML});
 var u=$("reqUnit");if(u)u.textContent=symNow();
 var b=$("sendBtn");if(b&&$("s58s2"))S58.text();
};
function toUnits(amt,d){var p=String(amt).split(".");return (BigInt(p[0]||"0")*10n**BigInt(d)+BigInt(((p[1]||"")+"0".repeat(d)).slice(0,d))).toString()}
function reqText(){
 var n=NETWORKS[currentNet],t=tokNow(),amt=$("reqAmt").value.trim(),ok=/^\d*\.?\d+$/.test(amt)&&+amt>0;
 if(t){return ok?("ethereum:"+t.addr+"@"+n.chainIdDec+"/transfer?address="+addr+"&uint256="+toUnits(amt,t.decimals||18)):addr}
 var wei=toWei(amt);return wei?("ethereum:"+addr+"@"+n.chainIdDec+"?value="+wei):addr;
}
window.drawReqQR=function(){if(!addr)return;var box=$("reqQR");if(!box)return;box.innerHTML="";var u=$("reqUnit");if(u)u.textContent=symNow();
 if(typeof QRCode!=="undefined")new QRCode(box,{text:reqText(),width:180,height:180,colorDark:"#000",colorLight:"#fff",correctLevel:QRCode.CorrectLevel.H})};
window.copyReqLink=function(){if(!addr)return;navigator.clipboard.writeText(reqText()).then(function(){toast(tx("Request link copied","माँग की लिंक कॉपी हुई"))})};
window.shareReqWA=function(){if(!addr)return;var n=NETWORKS[currentNet],sym=symNow(),amt=$("reqAmt").value.trim(),note=$("reqNote").value.trim();
 var m="Tazvera payment request\n"+n.name+" · "+sym+"\n"+(amt?("Amount: "+amt+" "+sym+"\n"):"")+(note?("Note: "+note+"\n"):"")+"Address: "+addr;
 window.open("https://wa.me/?text="+encodeURIComponent(m),"_blank")};
var _oq58=window.openRequest;
if(_oq58)window.openRequest=async function(){buildReq();await _oq58.apply(this,arguments);S58.syncChips();window.drawReqQR()};
if(window.XA&&XA.pick){var _xp=XA.pick;XA.pick=function(){var r=_xp.apply(this,arguments);S58.syncChips();var q=$("sheetReq");if(q&&q.classList.contains("open"))window.drawReqQR();return r}}

/* token must not change by itself when the same network is tapped again */
var _cn58=window.changeNetwork;
if(_cn58)window.changeNetwork=function(k){var same=(k===currentNet),keep=window.XA&&XA.sel;_cn58.apply(this,arguments);
 if(same&&keep){try{XA.sel=keep;XA.pick(keep)}catch(e){}}
 else{document.querySelectorAll(".xas-slot .xnc").forEach(function(e){e.classList.remove("s58f");void e.offsetWidth;e.classList.add("s58f")})}
 S58.syncChips();S58.text()};

/* ---------- small cards and full pages made on demand ---------- */
function shade(id,cls,html){var e=$(id);if(e)return e;e=document.createElement("div");e.className="shade";e.id=id;e.setAttribute("onclick","if(event.target===this)this.classList.remove('open')");e.innerHTML='<div class="panel '+cls+'">'+html+'</div>';document.body.appendChild(e);return e}
S58.close=function(id){var e=$(id);if(e)e.classList.remove("open")};
var _ca58=window.closeAll;
window.closeAll=function(){var r=_ca58.apply(this,arguments);["s58fee","s58conv","s58pick"].forEach(function(i){S58.close(i)});return r};

/* network fee: a small card, not a whole empty page */
S58.fee=async function(){
 var sh=shade("s58fee","s58sm",'<div class="grab"></div><div class="s58st" id="s58ft"></div><div class="s58fv" id="s58fv">…</div><div class="s58fi" id="s58fi"></div><div class="s58fn" id="s58fn"></div><button class="btn" onclick="S58.close(\'s58fee\')" id="s58fok"></button>');
 $("s58ft").textContent=tx("Network fee","नेटवर्क फ़ीस");$("s58fn").textContent=tx("This fee goes to the network, not to Tazvera.","यह फ़ीस नेटवर्क को जाती है, Tazvera को नहीं।");$("s58fok").textContent=tx("OK","ठीक है");$("s58fi").textContent="";$("s58fv").className="s58fv";$("s58fv").textContent="…";
 sh.classList.add("open");
 try{var n=NETWORKS[currentNet];
  var r=await fetch(n.rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_gasPrice",params:[]})});
  var d=await r.json();var fe=parseInt(d.result,16)*21000/1e18;
  $("s58fv").textContent="≈ "+(fe>=1?fe.toFixed(2):fe>=0.0001?fe.toFixed(6):fe.toPrecision(3))+" "+n.symbol;
  var p=T[n.symbol]&&T[n.symbol].p;if(p&&p.inr){var inr=fe*p.inr;$("s58fi").textContent=tx("about ","लगभग ")+"₹"+(inr>=0.01?inr.toFixed(2):inr.toPrecision(2))}
 }catch(e){$("s58fv").className="s58fv err";$("s58fv").textContent=tx("Could not load the fee right now","फ़ीस अभी नहीं मिल पाई, थोड़ी देर बाद देखिए")}
};
window.toolGas=function(){var st=$("sheetTools");if(st)st.classList.remove("open");S58.fee()};

/* price converter: two clear boxes */
var CC=[{c:"INR",n:["Indian rupee","भारतीय रुपया"],col:"#F59E0B",g:"₹"},{c:"USD",n:["US dollar","अमेरिकी डॉलर"],col:"#26A17B",g:"$"},
 {c:"SHM",n:["Shardeum","Shardeum"],col:"#3B4BFF",g:"S"},{c:"BTC",n:["Bitcoin","Bitcoin"],col:"#F7931A",g:"₿"},{c:"ETH",n:["Ethereum","Ethereum"],col:"#627EEA",g:"Ξ"},
 {c:"USDT",n:["Tether","Tether"],col:"#26A17B",g:"₮"},{c:"BNB",n:["BNB","BNB"],col:"#F3BA2F",g:"B"}];
var CV={A:"USD",B:"INR"};
function ccOf(c){for(var i=0;i<CC.length;i++)if(CC[i].c===c)return CC[i];return CC[0]}
function dot(c){var o=ccOf(c),u=(typeof LOGOS!=="undefined"&&LOGOS[c])?'<img src="'+LOGOS[c]+'" alt="" onerror="this.remove()">':"";return '<span class="nlg" style="background:'+o.col+'">'+o.g+u+'</span>'}
function inrOf(c){if(c==="INR")return 1;if(c==="USD")return (typeof fx!=="undefined"&&fx)?fx:null;var p=T[c]&&T[c].p;if(!p)return null;if(p.inr)return p.inr;if(p.usd&&typeof fx!=="undefined")return p.usd*fx;return null}
function fN(x){if(!isFinite(x))return"—";var a=Math.abs(x);if(a>=1000)return x.toLocaleString("en-IN",{maximumFractionDigits:2});if(a>=1)return x.toLocaleString("en-IN",{maximumFractionDigits:4});if(a>=0.01)return x.toLocaleString("en-IN",{maximumFractionDigits:6});return String(Number(x.toPrecision(3)))}
S58.conv=function(){
 var sh=shade("s58conv","s58pg",
  '<div class="bkh"><button class="bkb" onclick="S58.close(\'s58conv\')" aria-label="Back"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button><div class="ttl" id="cvT"></div></div>'+
  '<div class="s58lab" id="cvL1"></div><div class="s58box"><input id="cvA" type="number" inputmode="decimal" step="any" value="1" oninput="S58.cv()"><button type="button" class="s58cc" onclick="S58.pick(\'A\')" id="cvAb"></button></div>'+
  '<div class="s58swap"><button type="button" onclick="S58.swap()" aria-label="Swap">⇅</button></div>'+
  '<div class="s58lab" id="cvL2"></div><div class="s58box res"><div class="s58out" id="cvB">0</div><button type="button" class="s58cc" onclick="S58.pick(\'B\')" id="cvBb"></button></div>'+
  '<div class="s58rate" id="cvRate"></div><div class="s58lab" id="cvL3" style="margin-top:26px"></div><div class="s58quick" id="cvQ"></div><div class="s58note" id="cvN"></div>');
 var st=$("sheetTools");if(st)st.classList.remove("open");
 $("cvT").textContent=tx("Price converter","कीमत कन्वर्टर");$("cvL1").textContent=tx("From","से");$("cvL2").textContent=tx("To","में");$("cvL3").textContent=tx("Quick pairs","जल्दी चुनें");
 $("cvN").textContent=tx("Prices are for information only.","भाव सिर्फ़ जानकारी के लिए है।");
 var q=[["SHM","INR"],["BTC","INR"],["ETH","INR"],["USDT","INR"]];
 $("cvQ").innerHTML=q.map(function(x,i){return '<span onclick="S58.quick('+i+')">'+x[0]+' → ₹</span>'}).join("");
 S58.quickList=q;
 try{if(typeof fetchPrices==="function")fetchPrices()}catch(e){}
 S58.cv(true);sh.classList.add("open");
 setTimeout(function(){S58.cv()},1500);
};
S58.cv=function(){
 var A=$("cvA");if(!A)return;
 $("cvAb").innerHTML=dot(CV.A)+'<b>'+CV.A+'</b><i>⌄</i>';$("cvBb").innerHTML=dot(CV.B)+'<b>'+CV.B+'</b><i>⌄</i>';
 var a=parseFloat(A.value),ra=inrOf(CV.A),rb=inrOf(CV.B),r=$("cvRate"),o=$("cvB");
 if(!ra||!rb){o.textContent="—";r.textContent=tx("Loading prices…","भाव लोड हो रहा है…");return}
 var unit=ra/rb;r.textContent="1 "+CV.A+" = "+fN(unit)+" "+CV.B+" · "+tx("latest price","अभी का भाव");
 o.textContent=(isFinite(a)&&a>0)?fN(a*unit):"—";
};
S58.swap=function(){var t=CV.A;CV.A=CV.B;CV.B=t;var o=$("cvB").textContent.replace(/,/g,"");if(o&&o!=="—")$("cvA").value=o;S58.cv()};
S58.quick=function(i){var p=S58.quickList[i];CV.A=p[0];CV.B=p[1];$("cvA").value=1;S58.cv()};
S58.pick=function(w){
 S58.pw=w;var sh=shade("s58pick","s58sm s58tall",'<div class="grab"></div><div class="s58st" id="pkT"></div><div id="pkL"></div>');
 $("pkT").textContent=tx("Choose","चुनिए");
 $("pkL").innerHTML=CC.map(function(o){var nm=tx(o.n[0],o.n[1]);return '<div class="s58li" onclick="S58.setCC(\''+o.c+'\')">'+dot(o.c)+'<div><b>'+o.c+'</b><small>'+nm+'</small></div></div>'}).join("")+
  '<div class="s58li dis">'+'<span class="nlg" style="background:#8D98B0">C</span><div><b>TZT</b><small>'+tx("No price (test coin)","भाव नहीं (टेस्ट सिक्का)")+'</small></div></div>';
 sh.classList.add("open");
};
S58.setCC=function(c){CV[S58.pw]=c;S58.close("s58pick");S58.cv()};
window.toolConvert=function(){S58.conv()};

/* helper: yellow face in the panel header too */
function face(sv){if(!sv||sv.getAttribute("data-t")==="face")return;sv.setAttribute("class","face");sv.setAttribute("viewBox","0 0 100 100");sv.setAttribute("fill","none");sv.removeAttribute("stroke");sv.removeAttribute("stroke-width");sv.setAttribute("data-t","face");
 sv.innerHTML='<rect x="14" y="26" width="72" height="54" rx="15" fill="#FFD60A"/><ellipse cx="37" cy="51" rx="5.2" ry="7" fill="#1C2230"/><ellipse cx="63" cy="51" rx="5.2" ry="7" fill="#1C2230"/><path d="M40 66Q50 73 60 66" fill="none" stroke="#1C2230" stroke-width="4.5" stroke-linecap="round"/><path d="M50 26V16" stroke="#FFD60A" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="13" r="4.5" fill="#FFD60A"/>'}
if(window.HB&&HB.open){var _ho=HB.open;HB.open=function(){var r=_ho.apply(this,arguments);var s=document.querySelector("#hbPanel .hbh svg");face(s);return r}}

/* old saved "light" or "auto" choice becomes dark */
try{document.documentElement.setAttribute("data-theme","dark")}catch(e){}
buildSend();buildRecv();buildReq();
}catch(e){try{console.error("Build58",e)}catch(_){}}})();

/* ===== Build 59: pick the COIN first (its network is shown with it); clean coin list; one clear coin chip ===== */
(function(){ try{
var $=function(i){return document.getElementById(i)};
var tx=function(e,h){return (typeof lang!=="undefined"&&lang==="en")?e:h};
var S59=window.S59={};
/* no meme coins in the default list */
Object.keys(DEFTOK).forEach(function(k){DEFTOK[k]=DEFTOK[k].filter(function(t){return t.symbol!=="SHIB"&&t.symbol!=="PEPE"})});
var NATIVE={"shardeum-testnet":"Shardeum","ethereum":"Ethereum","bsc":"BNB","polygon":"Polygon","base":"Ether","optimism":"Ether","arbitrum":"Ether"};
var NAMES={TZT:"Tazvera Test token",CPAY:"CryptoPay Test (old)",USDT:"Tether",USDC:"USD Coin",DAI:"Dai",LINK:"Chainlink",WBTC:"Wrapped Bitcoin",UNI:"Uniswap",BTCB:"Bitcoin (BEP-20)",CAKE:"PancakeSwap",XRP:"Binance-Peg XRP",DOGE:"Binance-Peg Dogecoin"};
var NCOL={"shardeum-testnet":"#3B4BFF","ethereum":"#627EEA","bsc":"#F3BA2F","polygon":"#8247E5","base":"#0052FF","optimism":"#FF0420","arbitrum":"#28A0F0"};
var NL={"shardeum-testnet":"S","ethereum":"E","bsc":"B","polygon":"P","base":"B","optimism":"O","arbitrum":"A"};
function nameOf(k,t){if(t.n)return NATIVE[k]||t.symbol;if(k==="bsc"&&t.symbol==="ETH")return "Binance-Peg ETH";return NAMES[t.symbol]||t.symbol}
function userTok(k){return(ls.get("customTokens",[])||[]).filter(function(x){return x&&x.addr&&x.chain===k&&x.addr.toLowerCase()!=="0xc75149e5c95a41b0a4c9e3378d5fc6aaac2cc5f0"})}
function logo(sym,k){var u=(typeof LOGOS!=="undefined")?LOGOS[sym]:null;
 var inner=(sym==="TZT"||sym==="CPAY")?'<span class="nlg cpl">'+(sym==="TZT"?TZLOGO:CPLOGO)+'</span>':'<span class="nlg" style="background:#2B3A55">'+sym[0]+(u?'<img src="'+u+'" alt="" onerror="this.remove()">':'')+'</span>';
 return '<span class="s59lg">'+inner+'<i class="s59bd" style="background:'+(NCOL[k]||"#555")+'">'+(NL[k]||"")+'</i></span>'}
S59.rows=function(q){
 q=(q||"").toLowerCase();var keys=Object.keys(NETWORKS).sort(function(a,b){return (a===currentNet?0:1)-(b===currentNet?0:1)}),h="";
 keys.forEach(function(k){var n=NETWORKS[k];
  [{symbol:n.symbol,n:1}].concat(DEFTOK[k]||[],userTok(k)).forEach(function(t){
   var nm=nameOf(k,t),hay=(t.symbol+" "+nm+" "+n.name).toLowerCase();if(q&&hay.indexOf(q)<0)return;
   var here=k===currentNet,b="";
   if(here){if(t.n){b=T[t.symbol]&&T[t.symbol].bal}else{var c=getCustoms().filter(function(x){return x.addr.toLowerCase()===t.addr.toLowerCase()})[0];b=c&&c.bal}}
   var on=here&&((XA.tok&&XA.tok())?(XA.tok().symbol===t.symbol&&!t.n):(!!t.n));
   h+='<div class="s59r'+(on?" on":"")+'" onclick="XA.pickN(\''+k+"','"+t.symbol+'\')">'+logo(t.symbol,k)+'<div class="s59m"><b>'+t.symbol+'</b><small>'+nm+' · '+n.name+(k==="shardeum-testnet"?" ("+tx("test","टेस्ट")+")":"")+'</small></div><span class="s59b">'+(b!=null&&b!==""&&here?b:"")+'</span></div>'})});
 var el=$("xaRows");if(el)el.innerHTML=h||'<div class="cap">'+tx("Nothing found","कुछ नहीं मिला")+'</div>'};
XA.open=function(){
 $("xaList").innerHTML='<div class="svq"><input id="xaq" placeholder="'+tx("Search coin or network","सिक्का या नेटवर्क खोजें")+'" autocomplete="off" oninput="XA.q(this.value)"></div><div id="xaRows"></div><div class="s59n">'+tx("The network is written with every coin, so a wrong-network mistake is hard.","हर सिक्के के साथ उसका नेटवर्क लिखा है, इसलिए गलत नेटवर्क की गलती मुश्किल है।")+'</div>';
 S59.rows("");$("xaSheet").classList.add("open")};
XA.q=function(v){S59.rows(v)};
/* one coin chip (coin + network) in Send, Receive and Request */
S59.paint=function(){
 var k=currentNet,n=NETWORKS[k],t=(XA.tok&&XA.tok())||null,sym=t?t.symbol:n.symbol,nm=t?nameOf(k,{symbol:sym}):nameOf(k,{n:1,symbol:n.symbol});
 document.querySelectorAll(".s59c").forEach(function(e){e.innerHTML=logo(sym,k)+'<span class="s59tx"><b>'+sym+'</b><small>'+nm+' · '+n.name+'</small></span><i class="s59ch"></i>'});
 S59.note()};
S59.note=function(){
 var e=$("s59note");if(!e)return;var k=currentNet,n=NETWORKS[k],t=(XA.tok&&XA.tok())||null,sym=t?t.symbol:n.symbol;
 var s=tx("You are sending "+sym+" on "+n.name+". The receiver must use the same network.","आप "+n.name+" पर "+sym+" भेज रहे हैं। पाने वाले का नेटवर्क यही होना चाहिए।");
 if(k==="bsc"&&t&&t.symbol==="ETH")s=tx("This is Binance-Peg ETH on BNB Chain, not ETH on Ethereum. The receiver must use BNB Chain.","यह BNB चेन का ETH (Binance-Peg) है, Ethereum का असली ETH नहीं। पाने वाले को BNB चेन पर ही चाहिए।");
 e.textContent=s};
["#sheetSend","#sheetRecv","#sheetReq"].forEach(function(id){var row=document.querySelector(id+" .s58row");if(!row)return;if(!row.querySelector(".s59c")){var c=document.createElement("div");c.className="s59c";c.setAttribute("onclick","XA.open()");row.appendChild(c)}});
var s2=$("s58s2");if(s2&&!$("s59note")){var q=$("s58q2");var d=document.createElement("div");d.className="s59w";d.id="s59note";if(q)q.before(d);else s2.prepend(d)}
var _pk=XA.pick;XA.pick=function(){var r=_pk.apply(this,arguments);S59.paint();return r};
var _cn=window.changeNetwork;window.changeNetwork=function(){var r=_cn.apply(this,arguments);S59.paint();return r};
["openSend","openReceive","openRequest"].forEach(function(f){var o=window[f];if(o)window[f]=async function(){var r=await o.apply(this,arguments);S59.paint();return r}});
S59.paint();
/* S58.go(2) shows the safety line too */
if(window.S58){var _g=S58.go;S58.go=function(n){var r=_g.apply(this,arguments);S59.paint();return r}}
}catch(e){try{console.error("Build59",e)}catch(_){}}})();

/* ===== Build 60: 12-word restore page with 12 numbered boxes, word suggestions and spelling check ===== */
(function(){ try{
var $=function(i){return document.getElementById(i)};
var tx=function(e,h){return (typeof lang!=="undefined"&&lang==="en")?e:h};
var W60=window.W60={},WL=null;
function wl(){if(WL)return WL;var l=ethers.wordlists.en,a=[];for(var i=0;i<2048;i++)a.push(l.getWord(i));WL=a;return a}
function isW(w){return wl().indexOf(w)>=0}
function vals(){var a=[];for(var i=1;i<=12;i++){var e=$("w60_"+i);a.push(e?e.value.trim().toLowerCase():"")}return a}
function paint(cur){
 var a=vals(),ok=0;
 for(var i=1;i<=12;i++){var e=$("w60_"+i),p=e&&e.parentNode;if(!p)continue;var v=a[i-1];
  var good=v&&isW(v),bad=v&&v.length>=3&&!wl().some(function(w){return w.indexOf(v)===0});
  p.classList.toggle("ok",!!good);p.classList.toggle("bad",!!bad);p.classList.toggle("cur",i===cur);if(good)ok++}
 var ta=$("wsT");if(ta)ta.value=a.join(" ");
 var btn=document.querySelector("#w60g ~ button.btn"),h=$("w60h"),full=ok===12,valid=false;
 if(full){try{valid=ethers.Mnemonic.isValidMnemonic(a.join(" "))}catch(e){valid=false}}
 if(btn)btn.classList.toggle("s58off",!(full&&valid));
 if(h)h.textContent=full?(valid?tx("All 12 words look right. Continue.","12 शब्द सही हैं। आगे बढ़िए।"):tx("Every word is real, but the order or one word is wrong. Check the paper.","हर शब्द असली है, पर क्रम या कोई एक शब्द गलत है। काग़ज़ से मिलाइए।")):(ok+" / 12 "+tx("words done","शब्द पूरे"));
 if(h)h.style.color=(full&&!valid)?"#FF7A85":"";
}
function sugg(i){
 var e=$("w60_"+i),s=$("w60s");if(!e||!s)return;var v=e.value.trim().toLowerCase();
 if(v.length<2||isW(v)&&wl().filter(function(w){return w.indexOf(v)===0}).length===1){s.innerHTML="";return}
 var l=wl().filter(function(w){return w.indexOf(v)===0}).slice(0,5);
 s.innerHTML=l.map(function(w){return '<span class="w60c" onmousedown="event.preventDefault()" onclick="W60.pick('+i+',\''+w+'\')">'+w+'</span>'}).join("")||'<span class="w60x">'+tx("No such word","ऐसा कोई शब्द नहीं")+'</span>';
}
W60.pick=function(i,w){var e=$("w60_"+i);e.value=w;$("w60s").innerHTML="";W60.next(i)};
W60.next=function(i){var n=$("w60_"+Math.min(12,i+1));if(n){n.focus()}paint(Math.min(12,i+1))};
W60.fill=function(i,words){
 var k=i;words.forEach(function(w){if(k<=12){$("w60_"+k).value=w;k++}});
 var f=$("w60_"+Math.min(12,k));if(f)f.focus();paint(Math.min(12,k));$("w60s").innerHTML=""};
W60.in=function(i){
 var e=$("w60_"+i),v=e.value;
 if(/[\s,;\n]/.test(v.trim())){var ws=v.toLowerCase().split(/[^a-z]+/).filter(Boolean);W60.fill(i,ws);return}
 e.value=v.toLowerCase().replace(/[^a-z]/g,"");
 var l=wl().filter(function(w){return w.indexOf(e.value)===0});
 if(/\s$/.test(v)&&e.value&&(isW(e.value)||l.length===1)){e.value=isW(e.value)?e.value:l[0];W60.next(i);return}
 paint(i);sugg(i)};
W60.k=function(ev,i){
 var e=$("w60_"+i);
 if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();var v=e.value.trim().toLowerCase(),l=wl().filter(function(w){return w.indexOf(v)===0});
  if(v&&(isW(v)||l.length>=1)){e.value=isW(v)?v:l[0];$("w60s").innerHTML="";W60.next(i)}}
 else if(ev.key==="Backspace"&&!e.value&&i>1){ev.preventDefault();$("w60_"+(i-1)).focus()}};
W60.f=function(i){paint(i);sugg(i)};
W60.paste=async function(){try{var t=await navigator.clipboard.readText();var ws=(t||"").toLowerCase().split(/[^a-z]+/).filter(Boolean);if(ws.length){W60.fill(1,ws.slice(0,12))}else toast(tx("Nothing copied yet","कॉपी किया हुआ कुछ नहीं मिला"))}catch(e){toast(tx("Allow paste, or paste in the first box","चिपकाने की इजाज़त दें, या पहले डिब्बे में चिपकाइए"),4000)}};
W60.clear=function(){for(var i=1;i<=12;i++)$("w60_"+i).value="";$("w60s").innerHTML="";paint(1);$("w60_1").focus()};
var _imp=WS.imp;
WS.imp=function(){
 _imp.apply(this,arguments);
 var ta=$("wsT");if(!ta||$("w60g"))return;
 ta.style.display="none";
 var g="";for(var i=1;i<=12;i++)g+='<div class="w60"><i>'+i+'</i><input id="w60_'+i+'" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" oninput="W60.in('+i+')" onfocus="W60.f('+i+')" onkeydown="W60.k(event,'+i+')"></div>';
 var box=document.createElement("div");box.id="w60g";
 box.innerHTML='<div class="w60q">'+tx("Type each word. After 2 letters, tap the word you meant.","हर शब्द लिखिए। 2 अक्षर के बाद आपका शब्द नीचे दिखेगा, उसे दबाइए।")+'</div><div class="w60grid">'+g+'</div><div class="w60s" id="w60s"></div><div class="w60h" id="w60h"></div><div class="w60r"><button type="button" onclick="W60.paste()">'+tx("Paste all 12","12 शब्द चिपकाएँ")+'</button><button type="button" onclick="W60.clear()">'+tx("Clear","मिटाएँ")+'</button></div>';
 ta.before(box);
 var btn=document.querySelector("#w60g ~ button.btn");if(btn)btn.classList.add("s58off");
 paint(1);setTimeout(function(){var f=$("w60_1");if(f)f.focus()},250);
};
}catch(e){try{console.error("Build60",e)}catch(_){}}})();
/* Build 60: keep the old CPAY visible (muted), with its own name */
try{window.TOKNAMES=window.TOKNAMES||{};window.TOKNAMES.CPAY="CryptoPay Test (old)"}catch(e){}

/* Build 61: Tazvera new look (light/dark, Poppins, navy, grey circles, real logo) */
(function(){try{
var CSS61="html[data-theme=light]{--k-bg:#FFFFFF;--k-pan:#F2F3F5;--k-tx:#0B1D3A;--k-mut:#6B7280;--k-ac:#0B1D3A;--k-y:#0B1D3A;--k-ony:#FFFFFF;--k-sh:none;--k-lbl:#6B7280;--k-box:#F2F3F5;--bg:#FFFFFF;--sf:#FFFFFF;--card:#F2F3F5;--panel:#FFFFFF;--ln:#E3E5E8;--mut:#6B7280;--y:#0B1D3A;--yg:transparent;--z1:#FFFFFF;--z2:#F2F3F5;--zt:#0B1D3A;--zm:#6B7280;--zl:#E3E5E8;--zb:#0B1D3A;--zbt:#FFFFFF;--zr:#C0392B;--zg:#16A34A;color-scheme:light}\nhtml[data-theme=dark]{--k-bg:#000000;--k-pan:#1C1C1E;--k-tx:#FFFFFF;--k-mut:#9A9A9A;--k-ac:#FFFFFF;--k-y:#FFFFFF;--k-ony:#0B1D3A;--k-sh:none;--k-lbl:#9A9A9A;--k-box:#1C1C1E;--bg:#000000;--sf:#000000;--card:#1C1C1E;--panel:#0E0E10;--ln:#2A2A2C;--mut:#9A9A9A;--y:#FFFFFF;--yg:transparent;--z1:#000000;--z2:#1C1C1E;--zt:#FFFFFF;--zm:#9A9A9A;--zl:#2C2C2E;--zb:#FFFFFF;--zbt:#0B1D3A;--zr:#F0506E;--zg:#37DE64;color-scheme:dark}\nhtml body,html body button,html body input,html body select,html body textarea{font-family:'Poppins',system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Devanagari',sans-serif!important}\nhtml,html body,html body .app,html body #app{background:var(--z1)!important;color:var(--zt)!important}\nhtml body #app .top,html body #app header{background:var(--z1)!important;box-shadow:none!important;border:0!important}\nhtml body #app select.pill{background:var(--z2)!important;color:var(--zt)!important;border:0!important;box-shadow:none!important;font-weight:500!important}\nhtml body #app #chip{background:var(--z2)!important;color:var(--zt)!important;border:0!important;box-shadow:none!important;font-weight:500!important}\nhtml body #app #chip svg{color:var(--zt)!important;stroke:currentColor}\nhtml body #app .snd{background:transparent!important;color:var(--zt)!important;border:0!important;box-shadow:none!important}\nhtml body #app .hero{background:transparent!important;border:0!important;box-shadow:none!important;padding-left:4px!important;padding-right:4px!important}\nhtml body #app .hero::before,html body #app .hero::after{display:none!important}\nhtml body #app .hero .lbl{color:var(--zm)!important;font-weight:500!important;letter-spacing:0!important;text-transform:none!important;font-size:13px!important}\nhtml body #app .hero .total{color:var(--zt)!important;font-weight:600!important;-webkit-text-fill-color:currentColor!important;background:none!important;text-shadow:none!important}\nhtml body #app .hero .feed{display:inline-flex!important;align-items:center;gap:6px;background:var(--z2)!important;color:var(--zm)!important;border-radius:8px!important;padding:3px 9px!important;font-size:11px!important;font-weight:500!important;border:0!important}\nhtml body #app .hero .feed .dot{background:var(--zm)!important;box-shadow:none!important;width:6px!important;height:6px!important}\nhtml body #app .acts{background:transparent!important;border:0!important;box-shadow:none!important}\nhtml body #app .act{background:transparent!important;border:0!important;box-shadow:none!important}\nhtml body #app .act span{width:52px!important;height:52px!important;border-radius:50%!important;background:var(--z2)!important;border:0!important;box-shadow:none!important;color:var(--zt)!important}\nhtml body #app .act span svg{color:var(--zt)!important;stroke:currentColor!important;width:22px!important;height:22px!important}\nhtml body #app .act b{color:var(--zt)!important;font-weight:500!important;font-size:12px!important}\nhtml body #app .tabs{background:transparent!important;border:0!important}\nhtml body #app .tabs b{color:var(--zt)!important;font-weight:600!important;-webkit-text-fill-color:currentColor!important;background:none!important}\nhtml body #app .tabs b::after{display:none!important}\nhtml body #app .addtok{background:var(--z2)!important;color:var(--zt)!important;border:0!important;box-shadow:none!important}\nhtml body #app #list .row{background:transparent!important;border:0!important;box-shadow:none!important}\nhtml body #app #list .row .ic{background:var(--z2)!important;color:var(--zt)!important;box-shadow:none!important;border:0!important;font-weight:600!important}\nhtml body #app #list .sym,html body #app #list .amt{color:var(--zt)!important;font-weight:600!important}\nhtml body #app #list .sub{color:var(--zm)!important;font-weight:400!important}\nhtml body #app .disc{background:transparent!important;color:var(--zm)!important;border:0!important;box-shadow:none!important}\nhtml body #app nav.bn{background:var(--z1)!important;border:0!important;border-top:1px solid var(--zl)!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;left:0!important;right:0!important;bottom:0!important;margin:0!important;width:auto!important;padding-right:68px!important}\nhtml body #app nav.bn button{color:var(--zm)!important;background:transparent!important;box-shadow:none!important}\nhtml body #app nav.bn button span{font-weight:500!important;color:inherit!important}\nhtml body #app nav.bn button.a{color:var(--zt)!important}\nhtml body #app nav.bn button svg *{stroke:currentColor!important}\nhtml body #app nav.bn button svg [fill]:not([fill=none]){fill:currentColor!important}\nhtml body #hbBtn#hbBtn#hbBtn{background:var(--zb)!important;border-radius:50%!important;box-shadow:0 4px 14px rgba(11,29,58,.18)!important;border:0!important;width:50px!important;height:50px!important;padding:7px!important;animation:none!important}\nhtml body #hbBtn svg rect,html body #hbBtn svg circle{fill:var(--zbt)!important}\nhtml body #hbBtn svg ellipse{fill:var(--zb)!important}\nhtml body #hbBtn svg path{stroke:var(--zbt)!important}\nhtml body #hbBtn svg path[d^=\"M40\"]{stroke:var(--zb)!important}\nhtml body #hbTip#hbTip#hbTip{background:var(--zt)!important;color:var(--z1)!important;border:0!important;font-weight:500!important}\nhtml body #app .shade{background:var(--z1)!important}\nhtml body #app .panel{background:var(--z1)!important;color:var(--zt)!important;border:0!important;box-shadow:none!important}\nhtml body #app .panel .ttl{color:var(--zt)!important;font-weight:600!important}\nhtml body #app .btn{background:var(--zb)!important;color:var(--zbt)!important;border:0!important;box-shadow:none!important;font-weight:600!important;border-radius:12px!important;-webkit-text-fill-color:currentColor!important}\nhtml body #app .btn.ghost,html body #app .btn.sec,html body #app .btn.alt{background:transparent!important;color:var(--zt)!important;border:1px solid var(--zl)!important}\nhtml body #app .inp,html body #app input[type=text],html body #app input[type=number],html body #app input:not([type]),html body #app textarea{border-color:var(--zl)!important;box-shadow:none!important}\nhtml body #app .inp{background:var(--z1)!important;border:1px solid var(--zl)!important;border-radius:12px!important}\nhtml body #app .inp input{background:transparent!important;color:var(--zt)!important;border:0!important}\nhtml body #app .inp:focus-within{border-color:var(--zt)!important}\nhtml body .toast{background:var(--zt)!important;color:var(--z1)!important}\nhtml body #app .grab{background:var(--zl)!important}\n#splash{background:#000!important}\nhtml body #app svg.tt .y,html body #app svg.tt .m,html body #app nav.bn svg g{color:inherit!important}html body #app .inp:has(#sendTo),html body #app #sendTo.s58big,html body #app .s58to{border:1.5px solid var(--zt)!important}html body #app #sendTo{color:var(--zt)!important}html body #app .s59w,html body #app #s59note{background:var(--z2)!important;color:var(--zm)!important;border:0!important}html body #app .s58max{background:var(--z2)!important;color:var(--zt)!important;border:0!important}html body #app .s59c{background:var(--z2)!important;border:0!important}";
function put(){var s=document.getElementById("b61s");if(!s){s=document.createElement("style");s.id="b61s";s.textContent=CSS61}document.head.appendChild(s)}
var mq=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;
function want(){var m="light";try{m=localStorage.getItem("tz_theme")||"light"}catch(e){}if(m==="auto")return mq&&mq.matches?"dark":"light";return m==="dark"?"dark":"light"}
function theme(){var h=document.documentElement,t=want();if(h.getAttribute("data-theme")!==t)h.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"#000000":"#FFFFFF")}
put();theme();
try{new MutationObserver(function(){theme()}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]})}catch(e){}
if(mq){try{mq.addEventListener("change",theme)}catch(e){try{mq.addListener(theme)}catch(_){}}}
setTimeout(put,1500);setTimeout(put,4000);
}catch(e){try{console.error("Build61",e)}catch(_){}}})();

/* Build 61b: TZT shows the new Tazvera logo */
(function(){try{
function fix(){var L=document.getElementById("list");if(!L)return;L.querySelectorAll(".row").forEach(function(r){var y=r.querySelector(".sym");if(!y||y.textContent.trim()!=="TZT")return;var ic=r.querySelector(".ic");if(ic&&!ic.querySelector("img.tz61")){ic.innerHTML='<img class="tz61" src="icon-192.png" alt="" style="width:100%;height:100%;border-radius:50%;display:block">';ic.style.background="#000"}})}
fix();var L=document.getElementById("list");if(L){try{new MutationObserver(fix).observe(L,{childList:true,subtree:true})}catch(e){}}
setInterval(fix,3000);
}catch(e){try{console.error("Build61b",e)}catch(_){}}})();

/* Build 62: Send page like the design: Paste and Scan inside the address box */
(function(){try{
var st=document.createElement("style");st.id="b62s";
st.textContent='html body #app .s58three{display:none!important}'+
'html body #app .s58addr{position:relative!important;border:1.5px solid var(--zt)!important;border-radius:12px!important;padding-right:92px!important;min-height:52px}'+
'html body #app .s58addr input{font-size:14px!important}'+
'html body #app .b62i{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:flex;gap:2px}'+
'html body #app .b62i button{width:40px;height:40px;border:0;background:transparent;color:var(--zt);display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;padding:0}'+
'html body #app .b62i button:active{background:var(--z2)}'+
'html body #app .b62i svg{width:22px;height:22px}'+
'html body #app .b62bk{display:flex;width:max-content;align-items:center;gap:6px;margin:10px 2px 4px;font-size:13px;font-weight:500;color:var(--zt);cursor:pointer}'+
'html body #app .b62bk svg{width:18px;height:18px}'+
'html body #app .s58q{font-size:14px!important;font-weight:500!important;color:var(--zm)!important;text-align:left!important;margin:16px 2px 8px!important;line-height:1.3!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2000);
var P='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>';
var Q='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M7 12h10"/></svg>';
var B='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3.2"/><path d="M6 19c1-3 3.4-4.5 6-4.5s5 1.5 6 4.5"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>';
function go(){var a=document.querySelector("#app .s58addr");if(!a||a.querySelector(".b62i"))return;
 var w=document.createElement("div");w.className="b62i";
 w.innerHTML='<button type="button" aria-label="Paste">'+P+'</button><button type="button" aria-label="Scan">'+Q+'</button>';
 var bt=w.querySelectorAll("button");
 bt[0].onclick=function(e){e.preventDefault();try{S58.paste()}catch(_){}};
 bt[1].onclick=function(e){e.preventDefault();try{S58.scan()}catch(_){}};
 a.appendChild(w);
 var slot=document.getElementById("s58aslot");
 if(slot&&!document.querySelector("#app .b62bk")){var k=document.createElement("div");k.className="b62bk";k.innerHTML=B+'<span>Address book</span>';k.onclick=function(){try{S58.book()}catch(_){}};slot.after(k)}}
go();setInterval(go,1200);
}catch(e){try{console.error("Build62",e)}catch(_){}}})();

/* Build 63: Theme choice in Settings > Language & display, cleaner home */
(function(){try{
window.TZTH=function(v){try{localStorage.setItem("tz_theme",v)}catch(e){}var h=document.documentElement;h.setAttribute("data-theme",h.getAttribute("data-theme")==="dark"?"light":"dark");};
function row(){var t=document.getElementById("stt"),b=document.getElementById("sbody");if(!t||!b)return;
 var tt=(t.textContent||"").trim();if(!/Language|भाषा/.test(tt))return;if(b.querySelector(".tz-th"))return;
 var m="light";try{m=localStorage.getItem("tz_theme")||"light"}catch(e){}
 var d=document.createElement("div");d.className="sr tz-th";
 d.innerHTML='<span class="sl">Theme</span><select onchange="TZTH(this.value)">'+[["light","Light"],["dark","Dark"],["auto","Auto (phone)"]].map(function(o){return'<option value="'+o[0]+'"'+(o[0]===m?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select>';
 b.insertBefore(d,b.firstChild)}
setInterval(row,700);
var st=document.createElement("style");st.textContent='html body #app .disc{display:none!important}html body #app .nlg.cpl img{width:100%;height:100%;border-radius:50%}';document.head.appendChild(st);
}catch(e){try{console.error("Build63",e)}catch(_){}}})();

/* Build 63b: AI helper = only the robot face, no circle behind */
(function(){try{var st=document.createElement("style");st.id="b63b";
st.textContent='html body #hbBtn#hbBtn#hbBtn#hbBtn{background:transparent!important;box-shadow:none!important;border:0!important;width:56px!important;height:56px!important;padding:0!important;animation:none!important}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg{width:100%!important;height:100%!important;filter:drop-shadow(0 3px 6px rgba(11,29,58,.25))}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg rect,html body #hbBtn#hbBtn#hbBtn#hbBtn svg circle{fill:var(--zb)!important}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg ellipse{fill:var(--zbt)!important}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg path{stroke:var(--zb)!important}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg path[d^="M40"]{stroke:var(--zbt)!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2500);
}catch(e){}})();

/* Build 64: smaller robot with bouncing antenna, helper robot colours, "Main wallet", eye, network tag, helper open-buttons */
(function(){try{
var st=document.createElement("style");st.id="b64s";
st.textContent=
'html body #hbBtn#hbBtn#hbBtn#hbBtn{width:44px!important;height:44px!important}'+
'#hbBtn svg path[d^="M50 26"],#hbBtn svg circle,#hbPanel .hbh svg path[d^="M50 26"],#hbPanel .hbh svg circle{transform-box:view-box;transform-origin:50px 26px;animation:tzAnt 1.7s ease-in-out infinite}'+
'@keyframes tzAnt{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(-18deg)}70%{transform:rotate(14deg)}78%{transform:rotate(-9deg)}86%{transform:rotate(5deg)}93%{transform:rotate(-2deg)}}'+
'html body #hbPanel .hbh svg rect,html body #hbPanel .hbh svg circle{fill:var(--zb)!important}'+
'html body #hbPanel .hbh svg ellipse{fill:var(--zbt)!important}'+
'html body #hbPanel .hbh svg path{stroke:var(--zb)!important}'+
'html body #hbPanel .hbh svg path[d^="M40"]{stroke:var(--zbt)!important}'+
'html body #hbPanel{background:var(--z1)!important;color:var(--zt)!important}'+
'html body #hbPanel .hbgo{display:block;margin-top:8px;border:0;background:var(--zb);color:var(--zbt);border-radius:10px;padding:7px 12px;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit}'+
'html body #hbPanel .hbm{white-space:pre-line}'+
'html body #app .top .sels,html body #app #chip{display:none!important}'+
'html body #app .b64w{display:inline-flex;align-items:center;gap:6px;background:var(--z2);color:var(--zt);border:0;border-radius:18px;padding:7px 12px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;margin-right:auto}'+
'html body #app .b64w svg{width:14px;height:14px}'+
'html body #app .b64eye{border:0;background:transparent;color:var(--zm);padding:4px;margin-left:8px;cursor:pointer;display:inline-flex;vertical-align:middle}'+
'html body #app .b64eye svg{width:20px;height:20px}'+
'html body #app .hero #feed#feed{display:none!important}'+
'html body #app .b64net{display:inline-flex;align-items:center;gap:4px;background:var(--z2);color:var(--zm);border:0;border-radius:8px;padding:4px 9px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;margin-top:6px}'+
'html body #app .b64net svg{width:12px;height:12px}'+
'html body #app .b64tot{display:flex;align-items:center}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2500);
var CHV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
var EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var EYEX='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
function hasW(){try{return (window.CPW&&CPW.has())||(typeof addr!=="undefined"&&!!addr)}catch(e){return false}}
function ui(){
 var top=document.querySelector("#app .top");if(!top)return;
 var w=top.querySelector(".b64w");
 if(!w){w=document.createElement("button");w.type="button";w.className="b64w";w.onclick=function(){try{connectWallet()}catch(e){}};top.insertBefore(w,top.firstChild)}
 var lbl=hasW()?"Main wallet":"Set up wallet";if(w.getAttribute("data-l")!==lbl){w.setAttribute("data-l",lbl);w.innerHTML='<span>'+lbl+'</span>'+CHV}
 var tot=document.getElementById("total");
 if(tot&&!document.querySelector("#app .b64eye")){var wr=document.createElement("div");wr.className="b64tot";tot.parentNode.insertBefore(wr,tot);wr.appendChild(tot);var e=document.createElement("button");e.type="button";e.className="b64eye";e.setAttribute("aria-label","Hide balance");e.onclick=function(){try{togglePriv()}catch(_){}setTimeout(ui,50)};wr.appendChild(e)}
 var eb=document.querySelector("#app .b64eye");if(eb){var hid=false;try{hid=!!hideBal}catch(_){}var h=hid?EYEX:EYE;if(eb.getAttribute("data-h")!==String(hid)){eb.setAttribute("data-h",String(hid));eb.innerHTML=h}}
 var hero=document.querySelector("#app .hero");
 if(hero){var nb=hero.querySelector(".b64net");if(!nb){nb=document.createElement("button");nb.type="button";nb.className="b64net";nb.onclick=function(){try{XN.open()}catch(e){}};hero.appendChild(nb)}
  var nm="";try{nm=NETWORKS[currentNet].name}catch(e){}if(nb.getAttribute("data-n")!==nm){nb.setAttribute("data-n",nm);nb.innerHTML='<span>'+nm+'</span>'+CHV}}
}
ui();setInterval(ui,800);
var GO={wallet:function(){connectWallet()},receive:function(){openReceive()},request:function(){openRequest()},send:function(){openSend()},tools:function(){openTools()},network:function(){XN.open()},disp:function(){openSettings();SB.g("disp")},sec:function(){openSettings();SB.g("sec")}};
document.addEventListener("click",function(ev){var b=ev.target&&ev.target.closest?ev.target.closest(".hbgo"):null;if(!b)return;var k=b.getAttribute("data-go");try{HB.close()}catch(e){}try{if(GO[k])GO[k]()}catch(e){}},true);
}catch(e){try{console.error("Build64",e)}catch(_){}}})();

/* Build 65: soft navy + green accents, straight Send/Receive arrows */
(function(){try{
var st=document.createElement("style");st.id="b65s";
st.textContent=
'html[data-theme=light]{--zb:#16335F;--zc:#16335F;--zcl:#B8C6DC;--zg1:#E6F7EC;--zg2:#00875A;--zgb:#00A86B}'+
'html[data-theme=dark]{--zc:#1C3B6B;--zcl:#B8C6DC;--zg1:#1F5532;--zg2:#4BE37A;--zgb:#37DE64}'+
'html body #app .hero.hero{background:var(--zc)!important;color:#fff!important;border-radius:18px!important;padding:16px 16px 14px!important;margin:6px 14px 4px!important}'+
'html body #app .hero.hero .lbl{color:var(--zcl)!important}'+
'html body #app .hero.hero .total{color:#fff!important}'+
'html body #app .hero.hero .b64eye{color:var(--zcl)!important}'+
'html body #app .hero.hero .b64net{background:rgba(255,255,255,.14)!important;color:#fff!important}'+
'html body #app .hero.hero .b64net::before{content:"";width:7px;height:7px;border-radius:50%;background:#37DE64;margin-right:3px}'+
'html body #app .acts .act span{background:var(--zg1)!important;color:var(--zg2)!important}'+
'html body #app .acts .act span svg{color:var(--zg2)!important}'+
'html body #app nav.bn button.a{position:relative}'+
'html body #app nav.bn button.a::after{content:"";position:absolute;left:50%;bottom:2px;width:18px;height:3px;border-radius:2px;background:var(--zgb);transform:translateX(-50%)}'+
'html body #hbBtn#hbBtn#hbBtn#hbBtn svg circle,html body #hbPanel .hbh svg circle{fill:var(--zgb)!important}'+
'html body #app #s58aslot .s58addr.s58addr:focus-within{border-color:var(--zgb)!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2600);setTimeout(function(){document.head.appendChild(st)},4500);
var UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
var DN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
function ar(){[["btnSend",UP,"u"],["btnRecv",DN,"d"]].forEach(function(x){var b=document.getElementById(x[0]);if(!b)return;var bt=b.closest("button");if(!bt)return;var sp=bt.querySelector("span");if(sp&&sp.getAttribute("data-a")!==x[2]){sp.setAttribute("data-a",x[2]);sp.innerHTML=x[1]}})}
ar();setInterval(ar,1000);
}catch(e){try{console.error("Build65",e)}catch(_){}}})();

/* Build 66: Send on one page, confirm page, green Sent page; eye/arrow colour fix */
(function(){try{
var $=function(i){return document.getElementById(i)};
var ADDR=/^0x[0-9a-fA-F]{40}$/;
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function sh(a){return a?a.slice(0,6)+"…"+a.slice(-4):""}
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function sym(){try{var t=(window.XA&&XA.tok)?XA.tok():null;return t?t.symbol:NETWORKS[currentNet].symbol}catch(e){return ""}}
var st=document.createElement("style");st.id="b66s";
st.textContent=
'html body #app #sheetSend #s58next,html body #app #sheetSend .s58to{display:none!important}'+
'html body #app #sheetSend #s58s2{display:block!important}'+
'html body #app .hero.hero .b64eye,html body #app .hero.hero .b64eye svg{color:#C9D3E3!important;stroke:#C9D3E3!important}'+
'html body #app .hero.hero .b64net svg,html body #app .hero.hero .b64net svg *{color:#fff!important;stroke:#fff!important}'+
'#b66cf,#b66ok{position:fixed;inset:0;margin:0 auto;max-width:420px;z-index:400;background:var(--z1);color:var(--zt);display:flex;flex-direction:column;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-sizing:border-box;font-family:Poppins,system-ui,sans-serif}'+
'#b66cf .h{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:600}'+
'#b66cf .h button{width:40px;height:40px;border-radius:50%;border:0;background:var(--z2);color:var(--zt);font-size:20px;cursor:pointer}'+
'#b66cf .big{text-align:center;margin:28px 0 6px;font-size:30px;font-weight:600}'+
'#b66cf .sub{text-align:center;font-size:13px;color:var(--zm)}'+
'#b66cf .tb{background:var(--z2);border-radius:14px;padding:4px 14px;margin-top:22px}'+
'#b66cf .tr{display:flex;justify-content:space-between;gap:12px;font-size:14px;padding:12px 0;border-bottom:1px solid var(--zl)}'+
'#b66cf .tr:last-child{border-bottom:0}'+
'#b66cf .tr span:first-child{color:var(--zm)}#b66cf .tr span:last-child{font-weight:500;text-align:right;word-break:break-all}'+
'#b66cf .wn{font-size:12px;color:var(--zm);text-align:center;margin-top:14px;line-height:1.5}'+
'#b66cf .go,#b66ok .go{margin-top:auto;border:0;border-radius:12px;padding:15px;font-size:16px;font-weight:600;background:var(--zb);color:var(--zbt);cursor:pointer;font-family:inherit;width:100%}'+
'#b66cf .cn{border:0;background:transparent;color:var(--zt);font-size:14px;font-weight:500;padding:12px;margin-top:6px;cursor:pointer;font-family:inherit}'+
'#b66ok .mid{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center}'+
'#b66ok .tk{width:84px;height:84px;border-radius:50%;background:#22C55E;display:flex;align-items:center;justify-content:center;animation:b66p .55s cubic-bezier(.2,.9,.3,1.4) both}'+
'#b66ok .tk svg{width:46px;height:46px}'+
'@keyframes b66p{from{transform:scale(0)}to{transform:scale(1)}}'+
'#b66ok .t1{font-size:24px;font-weight:600;margin-top:6px}#b66ok .t2{font-size:14px;color:var(--zm)}'+
'#b66ok a{font-size:14px;font-weight:500;color:var(--zt);text-decoration:underline;margin-top:6px}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2600);setTimeout(function(){document.head.appendChild(st)},4600);
/* one page: both steps always shown */
function onePage(){if(!window.S58||S58.__b66)return;var og=S58.go;S58.__b66=1;
 S58.go=function(n){var s1=$("s58s1"),s2=$("s58s2");if(!s1||!s2)return og.apply(this,arguments);s1.style.display="block";s2.style.display="block";try{S58.text()}catch(e){}try{$("sendAmt").dispatchEvent(new Event("input"))}catch(e){}}}
onePage();setInterval(onePage,1500);
/* let the back button close the page */
document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("#sheetSend .bkb"):null;if(b){var s2=$("s58s2");if(s2)s2.style.display="none"}},true);
/* confirm page */
var pass=false;
function feeTxt(){var f=$("sendFee");var t=f?(f.textContent||"").trim():"";return t||tx("Small, paid in SHM","थोड़ी, SHM में")}
function confirmShow(to,amt,sy){
 var old=$("b66cf");if(old)old.remove();
 var n="";try{n=NETWORKS[currentNet].name}catch(e){}
 var d=document.createElement("div");d.id="b66cf";
 d.innerHTML='<div class="h"><button type="button" aria-label="Back">‹</button>'+esc(tx("Confirm","पक्का करें"))+'</div>'+
 '<div class="big">− '+esc(amt)+' '+esc(sy)+'</div><div class="sub">'+esc(n)+'</div>'+
 '<div class="tb"><div class="tr"><span>'+esc(tx("To","किसे"))+'</span><span>'+esc(sh(to))+'</span></div>'+
 '<div class="tr"><span>'+esc(tx("Network fee","नेटवर्क फ़ीस"))+'</span><span>'+esc(feeTxt())+'</span></div>'+
 '<div class="tr"><span>'+esc(tx("Total","कुल"))+'</span><span>'+esc(amt)+' '+esc(sy)+' + '+esc(tx("fee","फ़ीस"))+'</span></div></div>'+
 '<div class="wn">'+esc(tx("Check the address. Sent coins cannot be returned.","पता जाँच लीजिए। भेजे हुए सिक्के वापस नहीं आते।"))+'</div>'+
 '<button type="button" class="go">'+esc(tx("Send now","अभी भेजें"))+'</button><button type="button" class="cn">'+esc(tx("Cancel","रद्द करें"))+'</button>';
 (document.getElementById("app")||document.body).appendChild(d);
 var close=function(){d.remove()};
 d.querySelector(".h button").onclick=close;d.querySelector(".cn").onclick=close;
 d.querySelector(".go").onclick=function(){close();pass=true;var b=$("sendBtn");if(b)b.click();setTimeout(function(){pass=false},500)};
}
document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("#sendBtn"):null;if(!b)return;if(pass)return;
 var to=($("sendTo")||{}).value||"",amt=(($("sendAmt")||{}).value||"").trim();to=to.trim();
 if(!ADDR.test(to)||!(parseFloat(amt)>0))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();confirmShow(to,amt,sym())},true);
/* green Sent page after a real send */
function okShow(amt,sy,hash){
 var old=$("b66ok");if(old)old.remove();
 var to=(($("sendTo")||{}).value||"").trim();var ex="";try{ex=NETWORKS[currentNet].explorer}catch(e){}
 var d=document.createElement("div");d.id="b66ok";
 d.innerHTML='<div class="mid"><div class="tk"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'+
 '<div class="t1">'+esc(tx("Sent","भेज दिया"))+'</div><div class="t2">'+esc(amt)+' '+esc(sy)+(to?' → '+esc(sh(to)):'')+'</div>'+
 (ex&&hash?'<a href="'+esc(ex+"/tx/"+hash)+'" target="_blank" rel="noopener">'+esc(tx("View on explorer","Explorer पर देखें"))+'</a>':'')+'</div>'+
 '<button type="button" class="go">'+esc(tx("Done","ठीक है"))+'</button>';
 (document.getElementById("app")||document.body).appendChild(d);
 d.querySelector(".go").onclick=function(){d.remove();try{closeAll()}catch(e){}};
}
if(typeof window.logTx==="function"&&!window.logTx.__b66){var _lt=window.logTx;window.logTx=function(type,amt,symbol,hash){var r=_lt.apply(this,arguments);try{if(type==="out"&&hash)okShow(amt,symbol,hash)}catch(e){}return r};window.logTx.__b66=1}
}catch(e){try{console.error("Build66",e)}catch(_){}}})();

/* Build 68: new-wallet pages like the design: welcome, PIN, secret words, quick check */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var st=document.createElement("style");st.id="b68s";
st.textContent=
'#sheetWallet .b68st{display:flex;gap:5px;margin:2px 4px 16px}#sheetWallet .b68st span{flex:1;height:4px;border-radius:2px;background:var(--zl)}#sheetWallet .b68st span.on{background:var(--zt)}'+
'#sheetWallet .b68sub{font-size:13px;color:var(--zm);line-height:1.5;margin:0 4px 14px;text-align:left}'+
/* welcome */
'#sheetWallet .panel.b68-wel .ttl{visibility:hidden}'+
'#sheetWallet .panel.b68-wel #wsBody{display:flex;flex-direction:column;min-height:calc(100dvh - 110px)}'+
'#sheetWallet .b68hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:20px 0}'+
'#sheetWallet .b68hero .tile{width:92px;height:92px;border-radius:24px;background:#000;overflow:hidden}#sheetWallet .b68hero .tile img{width:100%;height:100%;display:block}'+
'#sheetWallet .b68hero .nm{font-family:"Russo One",Poppins,sans-serif;font-size:28px;letter-spacing:3px;color:var(--zt)}'+
'#sheetWallet .b68hero .tg{font-size:14px;color:var(--zm)}'+
'#sheetWallet .panel.b68-wel #wsBody>.cap{order:9;text-align:center!important;font-size:12px;margin-top:10px}'+
'#sheetWallet .panel.b68-wel #wsBody .btn{margin-top:10px}'+
/* PIN */
'#sheetWallet .pbs{gap:14px!important;justify-content:center}'+
'html body #sheetWallet .pbs i{width:14px!important;height:14px!important;border-radius:50%!important;border:1.5px solid var(--zt)!important;background:transparent!important;box-shadow:none!important}'+
'html body #sheetWallet .pbs i.f{background:var(--zt)!important}html body #sheetWallet .pbs i.f::after{display:none!important}'+
'html body #sheetWallet .pbs i.c{border-color:var(--zgb,#00A86B)!important;box-shadow:none!important}'+
'html body #sheetWallet .kp .pk{border:0!important;background:transparent!important;box-shadow:none!important;font-size:26px!important;font-weight:500!important;color:var(--zt)!important;height:62px!important;border-radius:50%!important}'+
'html body #sheetWallet .kp .pk:active{background:var(--z2)!important}'+
'html body #sheetWallet .kp .pk svg{color:var(--zt)!important;stroke:currentColor!important}'+
/* words */
'#sheetWallet .panel.b68-wds .risk,#sheetWallet .panel.b68-wds label.xt-o,#sheetWallet .panel.b68-wds #wsBody>.cap:not(#wsCd){display:none!important}'+
'html body #sheetWallet .wsw{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}'+
'html body #sheetWallet .wsw span{border:1px solid var(--zl)!important;background:transparent!important;border-radius:10px!important;padding:10px!important;font-size:14px!important;font-weight:500!important;color:var(--zt)!important;display:flex!important;gap:8px;align-items:center}'+
'html body #sheetWallet .wsw span i{font-style:normal;color:var(--zm)!important;font-size:12px;min-width:16px;background:none!important}'+
'html body #sheetWallet .vl .btn{background:transparent!important;color:var(--zt)!important;border:0!important;box-shadow:none!important;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:14px!important}'+
'#sheetWallet .b68wn{display:flex;gap:8px;background:var(--z2);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--zt);line-height:1.5;margin:12px 0}'+
'#sheetWallet .b68wn svg{width:18px;height:18px;flex-shrink:0;color:var(--zt)}'+
/* quick check */
'#sheetWallet .panel.b68-ck #wsBody>*:not(.b68ckw){display:none!important}'+
'#sheetWallet .b68q{font-size:14px;font-weight:500;margin:16px 4px 8px;color:var(--zt)}'+
'#sheetWallet .b68ch{display:flex;flex-wrap:wrap;gap:8px;margin:0 4px}'+
'#sheetWallet .b68ch button{border:1px solid var(--zl);background:transparent;color:var(--zt);border-radius:20px;padding:8px 16px;font-size:14px;font-family:inherit;cursor:pointer}'+
'#sheetWallet .b68ch button.ok{background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+
'#sheetWallet .b68ch button.no{border-color:#E5484D;color:#E5484D;animation:b68sh .3s}'+
'@keyframes b68sh{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}'+
'#sheetWallet .b68msg{min-height:20px;font-size:13px;color:#E5484D;margin:12px 4px 0}'+
'#sheetWallet .b68ckw .btn[disabled]{opacity:.35}'+
'#sheetWallet .b68lnk{display:block;text-align:center;margin-top:12px;font-size:14px;font-weight:500;color:var(--zt);cursor:pointer;background:none;border:0;width:100%;font-family:inherit}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2600);
var EYE='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var SHD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><rect x="9.5" y="10.5" width="5" height="4.5" rx="1"/><path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5"/></svg>';
function steps(pn,n){var b=pn.querySelector(".b68st");if(!b){b=document.createElement("div");b.className="b68st";b.innerHTML="<span></span><span></span><span></span>";var h=pn.querySelector(".bkh");if(h)h.after(b);else pn.prepend(b)}
 b.querySelectorAll("span").forEach(function(x,i){x.className=i<n?"on":""})}
function noSteps(pn){var b=pn.querySelector(".b68st");if(b)b.remove()}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function run(){
 var sh=$("sheetWallet");if(!sh||!sh.classList.contains("open"))return;var pn=sh.querySelector(".panel"),b=$("wsBody"),tt=pn&&pn.querySelector(".ttl");if(!pn||!b)return;
 var mode=b.querySelector('button[onclick="WS.c1()"]')?"wel":b.querySelector(".pinw")?"pin":($("wsv")&&$("wsOk"))?"wds":$("wsQ1")?"ck":"";
 ["wel","pin","wds","ck"].forEach(function(m){pn.classList.toggle("b68-"+m,m===mode)});
 if(mode==="wel"){noSteps(pn);
  if(!b.querySelector(".b68hero")){var h=document.createElement("div");h.className="b68hero";h.innerHTML='<div class="tile"><img src="icon-192.png" alt=""></div><div class="nm">TAZVERA</div><div class="tg">'+esc(tx("Your keys. Your crypto.","आपकी चाबी। आपका पैसा।"))+'</div>';b.prepend(h)}
  var g=b.querySelector('button[onclick="WS.imp()"]');if(g&&!g.__b68){g.__b68=1;g.textContent=tx("I already have a wallet","मेरे पास पहले से वॉलेट है")}
 } else if(mode==="pin"){var t=(tt&&tt.textContent)||"";if(/Choose|Confirm|PIN चुन|पक्का/i.test(t))steps(pn,1);else noSteps(pn)}
 else if(mode==="wds"){steps(pn,2);
  if(tt&&tt.getAttribute("data-b68")!=="w"){tt.setAttribute("data-b68","w");tt.textContent=tx("Your secret 12 words","आपके गुप्त 12 शब्द")}
  if(!b.querySelector(".b68sub")){var s=document.createElement("div");s.className="b68sub";s.textContent=tx("Write them on paper, in order. They are the only way to get your wallet back.","इन्हें क्रम से काग़ज़ पर लिखिए। वॉलेट वापस लाने का यही एक तरीक़ा है।");b.prepend(s)}
  var v=$("wsv");if(v&&!b.querySelector(".b68wn")){var w=document.createElement("div");w.className="b68wn";w.innerHTML=SHD+'<span>'+esc(tx("Never share these words. Tazvera will never ask for them. No screenshots.","ये शब्द कभी किसी को मत बताइए। Tazvera कभी नहीं माँगेगा। स्क्रीनशॉट मत लीजिए।"))+'</span>';var cd=$("wsCd");(cd||v).after(w)}
  var vb=b.querySelector(".vl .btn");if(vb&&!vb.__b68){vb.__b68=1;vb.innerHTML=EYE+'<span>'+esc(tx("Tap to show","दिखाने के लिए दबाइए"))+'</span>'}
  var cb=b.querySelector('button.btn[onclick="WS.fin()"]');if(cb&&!cb.__b68){cb.__b68=1;cb.textContent=tx("I wrote them down","मैंने लिख लिए");cb.addEventListener("click",function(){var o=$("wsOk");if(o)o.checked=true},true)}
 } else if(mode==="ck"){steps(pn,3);
  if(tt&&tt.getAttribute("data-b68")!=="c"){tt.setAttribute("data-b68","c");tt.textContent=tx("Quick check","छोटी जाँच")}
  if(!b.querySelector(".b68ckw"))build(b);
 } else noSteps(pn);
}
function build(b){
 var w=(window.WSX&&WSX.cur||"").split(" ");if(w.length!==12)return;var q=[(WSX.q||[1])[0]];while(q.length<3){var c=1+Math.floor(Math.random()*12);if(q.indexOf(c)<0)q.push(c)}q.sort(function(x,y){return x-y});
 var box=document.createElement("div");box.className="b68ckw";var done={};
 var h='<div class="b68sub">'+esc(tx("Pick the right words to make sure you saved them.","सही शब्द चुनिए, ताकि पक्का हो कि आपने लिख लिए।"))+'</div>';
 q.forEach(function(n){var right=w[n-1],others=shuffle(w.filter(function(x,i){return i!==n-1&&x!==right})).slice(0,2),opts=shuffle([right].concat(others));
  h+='<div class="b68q">'+esc(tx("Word #","शब्द नंबर "))+n+'</div><div class="b68ch" data-n="'+n+'">'+opts.map(function(o){return'<button type="button" data-w="'+esc(o)+'">'+esc(o)+'</button>'}).join("")+'</div>'});
 h+='<div class="b68msg"></div><button type="button" class="btn b68go" disabled>'+esc(tx("Continue","आगे"))+'</button><button type="button" class="b68lnk">'+esc(tx("Show my words again","मेरे शब्द फिर दिखाइए"))+'</button>';
 box.innerHTML=h;b.appendChild(box);
 var msg=box.querySelector(".b68msg"),go=box.querySelector(".b68go");
 box.querySelectorAll(".b68ch").forEach(function(row){var n=+row.getAttribute("data-n");row.querySelectorAll("button").forEach(function(bt){bt.onclick=function(){
  row.querySelectorAll("button").forEach(function(x){x.classList.remove("ok","no")});
  if(bt.getAttribute("data-w")===w[n-1]){bt.classList.add("ok");done[n]=1;msg.textContent=""}else{bt.classList.add("no");delete done[n];msg.textContent=tx("Not right. Look at your paper again.","सही नहीं है। अपना काग़ज़ फिर देखिए।")}
  go.disabled=Object.keys(done).length!==3}})});
 go.onclick=function(){if(Object.keys(done).length!==3)return;var a=$("wsQ1"),b2=$("wsQ2");if(a)a.value=w[WSX.q[0]-1];if(b2&&WSX.q[1])b2.value=w[WSX.q[1]-1];try{localStorage.setItem("cp3_backup_ok","1")}catch(e){}try{WSX.chk()}catch(e){}setTimeout(function(){var k=document.getElementById("bkBanner");if(k)k.remove()},600)};
 box.querySelector(".b68lnk").onclick=function(){try{WS.done(WSX.cur)}catch(e){}};
}
setInterval(run,250);
}catch(e){try{console.error("Build68",e)}catch(_){}}})();

/* Build 68b: show the welcome page by itself to a new user (no wallet yet), once per visit */
(function(){try{setTimeout(function(){try{
 var has=(window.CPW&&CPW.has&&CPW.has());var a="";try{a=addr||""}catch(e){}
 if(has||a)return;if(sessionStorage.getItem("tz_wel"))return;sessionStorage.setItem("tz_wel","1");
 if(window.WS&&WS.open)WS.open();
}catch(e){}},3400)}catch(e){}})();

/* Build 69: new AI helper face (hexagon like the logo, blinking eyes, bouncing antenna) */
(function(){try{
var st=document.createElement("style");st.id="b69s";
var P=['html body #hbBtn#hbBtn#hbBtn#hbBtn svg','html body #hbPanel#hbPanel .hbh svg'];
function R(sel,body){return P.map(function(p){return p+" "+sel}).join(",")+"{"+body+"}"}
st.textContent=
'html[data-theme=light]{--rb:#16335F;--re:#37DE64;--rm:#FFFFFF;--rs:#16335F;--rc:#00A86B}'+
'html[data-theme=dark]{--rb:#FFFFFF;--re:#16335F;--rm:#00A86B;--rs:#FFFFFF;--rc:#37DE64}'+
P.join(",")+'{overflow:visible!important}'+
R(".f69b","fill:var(--rb)!important;stroke:none!important")+
R(".f69e","fill:var(--re)!important;stroke:none!important;transform-box:fill-box;transform-origin:center;animation:f69bl 4s infinite!important")+
R(".f69m","fill:none!important;stroke:var(--rm)!important")+
R(".f69s","stroke:var(--rs)!important;fill:none!important;animation:none!important")+
R(".f69c","fill:var(--rc)!important;stroke:none!important;animation:none!important")+
R(".f69a","transform-box:view-box;transform-origin:50px 24px;animation:f69wb 1.7s ease-in-out infinite")+
'@keyframes f69bl{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}'+
'@keyframes f69wb{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(-16deg)}72%{transform:rotate(12deg)}82%{transform:rotate(-6deg)}91%{transform:rotate(3deg)}}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2700);setTimeout(function(){document.head.appendChild(st)},5000);
var F='<g class="f69a"><path class="f69s" d="M50 24V11" stroke-width="4" stroke-linecap="round"/><circle class="f69c" cx="50" cy="9" r="5.5"/></g>'+
'<path class="f69b" d="M30 24H70L88 42V74Q88 86 76 86H24Q12 86 12 74V42Z"/>'+
'<ellipse class="f69e" cx="38" cy="57" rx="5.5" ry="7"/><ellipse class="f69e" cx="62" cy="57" rx="5.5" ry="7"/>'+
'<path class="f69m" d="M42 73Q50 79 58 73" stroke-width="4.5" stroke-linecap="round"/>';
function put(sv){if(!sv||sv.querySelector(".f69b"))return;sv.setAttribute("viewBox","0 0 100 100");sv.setAttribute("fill","none");sv.removeAttribute("stroke");sv.removeAttribute("stroke-width");sv.setAttribute("data-t","face");sv.innerHTML=F}
function go(){var b=document.getElementById("hbBtn");if(b)put(b.querySelector("svg"));put(document.querySelector("#hbPanel .hbh svg"))}
go();setInterval(go,800);
}catch(e){try{console.error("Build69",e)}catch(_){}}})();

/* Build 70: home page cleanup: same number style, your coins vs market prices, Get TZT button, plain + button, room above the menu */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var st=document.createElement("style");st.id="b70s";
st.textContent=
'html body #app #list{display:flex!important;flex-direction:column}'+
'html body #app #list .row.b70m{order:50}'+
'html body #app #list #b70h{order:49;font-size:12px;font-weight:600;letter-spacing:.4px;color:var(--zm);padding:16px 4px 4px;text-transform:uppercase}'+
'html body #app #list .row:not(.b70m) .rt .sub{display:none!important}'+
'html body #app #list .row.b70m .mid .sub,html body #app #list .row.b70m .rt .amt,html body #app #list .row.b70m .rt .sub{display:none!important}'+
'html body #app #list .row.b70m .rt .b70p{display:block;font-weight:600;color:var(--zt);font-size:15px;text-align:right}'+
'html body #app #list .row.b70m .rt .b70c{display:block;font-size:12px;text-align:right;margin-top:2px}'+
'html body #app .scroll{padding-bottom:120px!important}'+
'html body #app .addtok.addtok{border-radius:50%!important;width:36px!important;height:36px!important;display:inline-flex!important;align-items:center;justify-content:center}'+
'html body #app .addtok svg{width:18px;height:18px}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2700);
var PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
var DROP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/></svg>';
var MK=["USDT","BTC","ETH","BNB","SOL","XRP","USDC","MATIC","POL"];
function fmtN(t){var x=String(t).replace(/,/g,"").trim();if(!/^-?\d+(\.\d+)?$/.test(x))return null;var n=parseFloat(x);if(n===0)return"0";
 if(Math.abs(n)>=1)return n.toLocaleString("en-IN",{maximumFractionDigits:2});return n.toLocaleString("en-IN",{maximumFractionDigits:4})}
function run(){
 var L=$("list");if(!L)return;var nat="";try{nat=NETWORKS[currentNet].symbol}catch(e){}
 var any=false;
 L.querySelectorAll(".row").forEach(function(r){var y=r.querySelector(".sym");if(!y)return;var sym=y.textContent.trim();
  var a=r.querySelector(".rt .amt"),isM=MK.indexOf(sym)>-1&&sym!==nat&&a&&a.textContent.trim()==="—";
  r.classList.toggle("b70m",isM);
  if(isM){any=true;var s=r.querySelector(".mid .sub"),rt=r.querySelector(".rt");if(s&&rt){var p=rt.querySelector(".b70p"),c=rt.querySelector(".b70c");if(!p){p=document.createElement("span");p.className="b70p";rt.appendChild(p)}if(!c){c=document.createElement("span");c.className="b70c";rt.appendChild(c)}
   var sp=s.querySelector("span"),pt=(s.childNodes[0]&&s.childNodes[0].nodeType===3)?s.childNodes[0].textContent.trim():s.textContent.trim();
   if(p.textContent!==pt)p.textContent=pt;var ch=sp?sp.outerHTML:"";if(c.innerHTML!==ch)c.innerHTML=ch}}
  else if(a){var f=fmtN(a.textContent);if(f!==null&&a.textContent!==f)a.textContent=f}
 });
 var h=$("b70h");if(any&&!h){h=document.createElement("div");h.id="b70h";L.appendChild(h)}if(h){h.style.display=any?"":"none";var tx=en()?"Market prices":"बाज़ार भाव";if(h.textContent!==tx)h.textContent=tx}
 var bs=$("btnBS");if(bs){var bt=bs.closest("button");var lb=currentNet==="shardeum-testnet"?(en()?"Get TZT":"TZT लें"):currentNet==="shardeum"?(en()?"Add SHM":"SHM जोड़ें"):(en()?"Test coins":"टेस्ट सिक्के");if(bs.textContent!==lb)bs.textContent=lb;
  if(bt&&!bt.__b70){bt.__b70=1;bt.removeAttribute("onclick");bt.onclick=function(){var k=currentNet;if(k==="shardeum"){try{alert(en()?"To add real SHM: buy SHM on an exchange (for example KuCoin), then send it to your Tazvera address from Receive.":"असली SHM जोड़ने के लिए: किसी एक्सचेंज (जैसे KuCoin) से SHM ख़रीदिए, फिर Receive वाले अपने Tazvera पते पर भेजिए।");openReceive()}catch(e){}return}if(k==="bsc-testnet")return void window.open("https://www.bnbchain.org/en/testnet-faucet","_blank","noopener");if(k==="sepolia")return void window.open("https://cloud.google.com/application/web3/faucet/ethereum/sepolia","_blank","noopener");try{FQ.open()}catch(e){}}}
  var sp2=bt&&bt.querySelector("span");if(sp2&&sp2.getAttribute("data-a")!=="g"){sp2.setAttribute("data-a","g");sp2.innerHTML=DROP}}
 var ad=document.querySelector("#app .addtok");if(ad&&ad.getAttribute("data-p")!=="1"){ad.setAttribute("data-p","1");ad.innerHTML=PLUS}
}
run();setInterval(run,700);
}catch(e){try{console.error("Build70",e)}catch(_){}}})();

/* Build 71: SHM in Market prices, tap a price to open the converter, bolder button names */
(function(){try{
var $=function(i){return document.getElementById(i)};
var st=document.createElement("style");st.id="b71s";
st.textContent='html body #app #list #b70h{order:47!important}html body #app #list .row.b71s{order:48}'+
'html body #app .acts .act.act b{font-weight:600!important;font-size:13px!important}'+
'html body #app #list .row.b71s .rt .b70p{display:block;font-weight:600;color:var(--zt);font-size:15px;text-align:right}'+
'html body #app #list .row.b71s .rt .b70c{display:block;font-size:12px;text-align:right;margin-top:2px}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2800);
function fP(x){var a=Math.abs(x);if(a>=1000)return x.toLocaleString("en-IN",{maximumFractionDigits:2});if(a>=1)return x.toLocaleString("en-IN",{maximumFractionDigits:2});if(a>=0.01)return x.toLocaleString("en-IN",{maximumFractionDigits:4});return String(Number(x.toPrecision(3)))}
var QI={SHM:0,BTC:1,ETH:2,USDT:3};
function openConv(sym){try{S58.conv();if(QI[sym]!=null)setTimeout(function(){try{S58.quick(QI[sym])}catch(e){}},60)}catch(e){}}
function run(){
 var L=$("list");if(!L)return;var p=null;try{p=(typeof T!=="undefined"&&T.SHM&&T.SHM.p)?T.SHM.p:null}catch(e){}
 var r=$("b71shm");
 if(p&&p.inr>0){
  if(!r){r=document.createElement("div");r.id="b71shm";r.className="row b71s";var src=L.querySelector('.row .ic img[alt="SHM"]');
   r.innerHTML='<div class="ic">'+(src?'<img src="'+src.getAttribute("src")+'" alt="SHM">':'S')+'</div><div class="mid"><div class="sym">SHM</div></div><div class="rt"><span class="b70p"></span><span class="b70c"></span></div>';
   r.onclick=function(){openConv("SHM")};L.appendChild(r)}
  var pt="₹"+fP(p.inr),c=+(p.chg||0),ch='<span style="color:'+(c>=0?"var(--zg,#16A34A)":"var(--zr,#DC2626)")+'">'+(c>=0?"+":"")+c.toFixed(2)+'%</span>';
  var a=r.querySelector(".b70p"),b=r.querySelector(".b70c");if(a.textContent!==pt)a.textContent=pt;if(b.innerHTML!==ch)b.innerHTML=ch;
  if(!r.parentNode||r.parentNode!==L)L.appendChild(r);r.style.display="";
 } else if(r) r.style.display="none";
 L.querySelectorAll(".row.b70m").forEach(function(x){if(x.__b71)return;x.__b71=1;var y=x.querySelector(".sym");var sym=y?y.textContent.trim():"";
  x.addEventListener("click",function(e){e.stopPropagation();e.preventDefault();openConv(sym)},true)});
}
run();setInterval(run,800);
}catch(e){try{console.error("Build71",e)}catch(_){}}})();

/* Build 72: Price converter in Tazvera colours, darker and bolder text */
(function(){try{
var st=document.createElement("style");st.id="b72s";var P="html body #s58conv#s58conv ";
st.textContent=
'html[data-theme=light]{--cvl:#3A4556;--cvb:#DCE1E8;--cvg:#E9F8EF;--cvgb:#CBEBD6;--cvn:#EAF0F8;--cvgt:#00754E;--cvnt:#16335F}'+
'html[data-theme=dark]{--cvl:#C3CAD6;--cvb:#2C2C2E;--cvg:#14301F;--cvgb:#1F5532;--cvn:#18263D;--cvgt:#5BE38A;--cvnt:#C9D7EE}'+
P+'.s58lab{color:var(--cvl)!important;font-weight:600!important;font-size:14px!important}'+
P+'.s58box{background:var(--z1)!important;border:1px solid var(--cvb)!important;box-shadow:none!important;border-radius:16px!important}'+
P+'.s58box.res{background:var(--cvg)!important;border-color:var(--cvgb)!important}'+
P+'.s58box input,'+P+'.s58out{color:var(--zt)!important;font-weight:600!important;background:transparent!important}'+
P+'.s58cc{background:var(--cvn)!important;color:var(--cvnt)!important;border:0!important;box-shadow:none!important;font-weight:600!important}'+
P+'.s58box.res .s58cc{background:var(--z1)!important}'+
P+'.s58cc b,'+P+'.s58cc i{color:inherit!important;font-weight:600!important}'+
P+'.s58swap button{background:var(--zb)!important;color:var(--zbt)!important;border:3px solid var(--z1)!important;box-shadow:none!important;font-weight:700!important}'+
P+'.s58rate{color:var(--cvl)!important;font-weight:500!important;font-size:14px!important}'+
P+'.s58quick span{border:0!important;box-shadow:none!important;font-weight:600!important;background:var(--cvg)!important;color:var(--cvgt)!important}'+
P+'.s58quick span:nth-child(even){background:var(--cvn)!important;color:var(--cvnt)!important}'+
P+'.s58note{color:var(--cvl)!important;font-weight:500!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},2900);
}catch(e){}})();

/* Build 73: Receive page in Tazvera style */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var P="html body #app #sheetRecv#sheetRecv ";
var st=document.createElement("style");st.id="b73s";
st.textContent=
P+'.s59c{background:var(--cvn)!important;border:0!important}'+P+'.s59c b{color:var(--cvnt)!important;font-weight:600!important}'+P+'.s59c small{color:var(--cvl)!important;font-weight:500!important}'+
P+'.qrbox{background:#fff!important;border:1px solid var(--cvb)!important;border-radius:22px!important;padding:14px!important;box-shadow:0 8px 24px rgba(11,29,58,.08)!important;width:max-content!important;margin:16px auto 0!important}'+
P+'.b73cap{text-align:center;font-size:13px;font-weight:600;color:var(--cvl);margin:10px 0 0}'+
P+'#addrBox,'+P+'.cap,'+P+'#recvCap,'+P+'.xwarn>svg{display:none!important}'+
P+'.b73ad{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--cvn);color:var(--cvnt);border-radius:14px;padding:12px 14px;margin-top:14px;font-weight:600;font-size:15px;cursor:pointer;font-family:ui-monospace,Menlo,monospace}'+
P+'.b73ad svg{width:20px;height:20px;flex-shrink:0;color:var(--cvnt)!important}'+P+'.b73ad svg *{stroke:currentColor!important}'+
P+'.xwarn{background:var(--cvg)!important;border:0!important;color:var(--zt)!important;border-radius:14px!important;display:flex!important;gap:10px;align-items:flex-start;padding:12px 14px!important;margin-top:12px!important}'+
P+'.b73w{font-size:13.5px;line-height:1.5;font-weight:500;color:var(--zt)}'+P+'.b73w b{font-weight:600}'+
P+'.b73wi{color:var(--zgb,#00A86B)!important;flex-shrink:0;display:flex}'+P+'.xwarn .b73wi svg{color:var(--zgb,#00A86B)!important;stroke:var(--zgb,#00A86B)!important;display:block!important}'+P+'.xwarn .b73wi svg *{stroke:var(--zgb,#00A86B)!important}'+P+'.b73wi svg{width:18px;height:18px}'+
P+'.xbtns{display:flex!important;gap:10px!important;margin-top:16px!important}'+
P+'.xbtns button{flex:1!important;flex-direction:row!important;gap:8px!important;height:auto!important;min-height:0!important;padding:14px 10px!important;border-radius:14px!important;font-weight:600!important;font-size:15px!important;box-shadow:none!important}'+
P+'.xbtns button:first-child{background:var(--zb)!important;color:var(--zbt)!important;border:0!important}'+
P+'.xbtns button:last-child{background:transparent!important;color:var(--zt)!important;border:1px solid var(--cvb)!important}'+
P+'.xbtns button svg{width:18px!important;height:18px!important;color:inherit!important;stroke:currentColor!important}'+
P+'.xbtns button span{color:inherit!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3000);
var CP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
var IN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></svg>';
function run(){
 var sh=$("sheetRecv");if(!sh||!sh.classList.contains("open"))return;
 var q=sh.querySelector(".qrbox"),ab=$("addrBox");if(!q||!ab)return;
 var c=sh.querySelector(".b73cap");if(!c){c=document.createElement("div");c.className="b73cap";q.after(c)}var ct=en()?"Scan to pay me":"मुझे पैसे भेजने के लिए स्कैन करें";if(c.textContent!==ct)c.textContent=ct;
 var a=(ab.textContent||"").trim(),d=sh.querySelector(".b73ad");if(!d){d=document.createElement("div");d.className="b73ad";d.onclick=function(){try{copyAddress()}catch(e){}};c.after(d)}
 var sa=a.length>16?a.slice(0,6)+"…"+a.slice(-6):a;if(d.getAttribute("data-a")!==a){d.setAttribute("data-a",a);d.innerHTML='<span>'+sa+'</span>'+CP}
 var w=sh.querySelector(".xwarn");if(w){var n="";try{n=NETWORKS[currentNet].name}catch(e){}var t=en()?'Send only <b>'+n+'</b> coins here. Coins from other networks will be lost.':'यहाँ सिर्फ़ <b>'+n+'</b> के सिक्के भेजें। दूसरे नेटवर्क के सिक्के खो जाएँगे।';
  var s2=w.querySelector(".b73w");if(!s2){var ic=document.createElement("span");ic.className="b73wi";ic.innerHTML=IN;w.prepend(ic);s2=document.createElement("span");s2.className="b73w";w.appendChild(s2)}if(s2.innerHTML!==t)s2.innerHTML=t}
 var cb=$("copyBtn");if(cb){var lt=en()?"Copy address":"पता कॉपी करें";if(cb.textContent!==lt&&!/✓|Copied|कॉपी हो/.test(cb.textContent))cb.textContent=lt}
}
setInterval(run,400);
}catch(e){try{console.error("Build73",e)}catch(_){}}})();

/* Build 74: Request page in Tazvera style + right coin logo in the middle of QR codes */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var P="html body #app #sheetReq#sheetReq ";
var st=document.createElement("style");st.id="b74s";
st.textContent=
P+'.s59c{background:var(--cvn)!important;border:0!important}'+P+'.s59c b{color:var(--cvnt)!important;font-weight:600!important}'+P+'.s59c small{color:var(--cvl)!important;font-weight:500!important}'+
P+'.inp{background:var(--z1)!important;border:1px solid var(--cvb)!important;border-radius:16px!important;box-shadow:none!important}'+
P+'.inp:focus-within{border-color:var(--zgb,#00A86B)!important}'+
P+'#reqAmt{font-size:24px!important;font-weight:600!important;color:var(--zt)!important}'+P+'#reqUnit{color:var(--cvnt)!important;font-weight:600!important}'+
P+'#reqNote{font-size:15px!important;font-weight:500!important;color:var(--zt)!important}'+
P+'.qrbox{position:relative!important;background:#fff!important;border:1px solid var(--cvb)!important;border-radius:22px!important;padding:14px!important;box-shadow:0 8px 24px rgba(11,29,58,.08)!important;width:max-content!important;margin:16px auto 0!important}'+
P+'.b74cap{text-align:center;font-size:13px;font-weight:600;color:var(--cvl);margin:10px 0 0}'+P+'.b74cap b{color:var(--zt);font-weight:600}'+
P+'#reqAddr{display:none!important}'+
P+'.b74ad{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--cvn);color:var(--cvnt);border-radius:14px;padding:12px 14px;margin-top:14px;font-weight:600;font-size:15px;cursor:pointer;font-family:ui-monospace,Menlo,monospace}'+
P+'.b74ad svg{width:20px;height:20px;flex-shrink:0;color:var(--cvnt)!important}'+P+'.b74ad svg *{stroke:currentColor!important}'+
P+'.b74bt{display:flex;gap:10px;margin-top:16px}'+P+'.b74bt .btn{flex:1;margin:0!important;padding:14px 10px!important;border-radius:14px!important;font-size:15px!important;font-weight:600!important;min-height:0!important;height:auto!important}'+
P+'.b74bt .btn:not(.ghost){background:var(--zb)!important;color:var(--zbt)!important;border:0!important}'+
P+'.b74bt .btn.ghost{background:transparent!important;color:var(--zt)!important;border:1px solid var(--cvb)!important}'+
P+'.b74bt .btn svg,'+P+'.b74bt .btn i{display:none!important}'+
'html body #app .qrbox .b74lg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:12px;background:#fff;padding:4px;box-sizing:content-box;pointer-events:none}'+
'html body #app .qrbox .b74lg img{display:block;width:100%;height:100%;border-radius:9px;object-fit:cover}'+
'html body #app #sheetRecv .qrbox{position:relative!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3100);
var CP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
function tok(){try{return window.XA&&XA.tok?XA.tok():null}catch(e){return null}}
function logoSrc(sh){var t=tok();if(t&&t.symbol==="TZT")return"icon-192.png";var im=sh.querySelector(".s59c .s59lg img");return im?im.getAttribute("src"):""}
function overlay(sh,always){var q=sh.querySelector(".qrbox");if(!q)return;var c=q.querySelector("canvas,img:not(.b74i)");var t=tok();
 var want=always||(t&&t.symbol);var o=q.querySelector(".b74lg");
 if(!want||!c){if(o)o.remove();return}
 var src=logoSrc(sh);if(!src){if(o)o.remove();return}
 var w=(c.offsetWidth||200)*0.2;if(!o){o=document.createElement("div");o.className="b74lg";o.innerHTML='<img class="b74i" alt="">';q.appendChild(o)}
 o.style.width=o.style.height=w+"px";var i=o.querySelector("img");if(i.getAttribute("src")!==src)i.setAttribute("src",src)}
function req(){
 var sh=$("sheetReq");if(!sh||!sh.classList.contains("open"))return;
 var tt=sh.querySelector(".ttl");var tl=en()?"Payment request":"पैसे की माँग";if(tt&&tt.textContent!==tl)tt.textContent=tl;
 var q=sh.querySelector(".qrbox"),ra=$("reqAddr");if(!q||!ra)return;
 var amt=(($("reqAmt")||{}).value||"").trim(),sym=(($("reqUnit")||{}).textContent||"").trim();
 var cap=sh.querySelector(".b74cap");if(!cap){cap=document.createElement("div");cap.className="b74cap";q.after(cap)}
 var ct=(+amt>0)?(en()?'Scan to pay <b>'+amt+' '+sym+'</b>':'<b>'+amt+' '+sym+'</b> भेजने के लिए स्कैन करें'):(en()?"Scan to pay me":"मुझे पैसे भेजने के लिए स्कैन करें");if(cap.innerHTML!==ct)cap.innerHTML=ct;
 var a=(ra.textContent||"").trim(),d=sh.querySelector(".b74ad");if(!d){d=document.createElement("div");d.className="b74ad";d.onclick=function(){try{navigator.clipboard.writeText(addr).then(function(){toast(en()?"Address copied":"पता कॉपी हुआ")})}catch(e){}};cap.after(d)}
 if(d.getAttribute("data-a")!==a){d.setAttribute("data-a",a);d.innerHTML='<span>'+(a.length>16?a.slice(0,6)+"…"+a.slice(-6):a)+'</span>'+CP}
 var b1=sh.querySelector('.btn[onclick="copyReqLink()"]'),b2=sh.querySelector('.btn[onclick="shareReqWA()"]');
 if(b1&&b2){var w=sh.querySelector(".b74bt");if(!w){w=document.createElement("div");w.className="b74bt";d.after(w)}if(b1.parentNode!==w){w.appendChild(b1);w.appendChild(b2)}
  var l1=en()?"Copy request link":"माँग की लिंक कॉपी करें",l2=en()?"Share":"भेजें";if(b1.textContent!==l1&&!/✓/.test(b1.textContent))b1.textContent=l1;if(b2.textContent!==l2)b2.textContent=l2}
 overlay(sh,true);
}
function rec(){var sh=$("sheetRecv");if(!sh||!sh.classList.contains("open"))return;overlay(sh,false)}
setInterval(function(){req();rec()},400);
}catch(e){try{console.error("Build74",e)}catch(_){}}})();

/* Build 75: one steady SHM price from real exchanges (KuCoin, MEXC, Gate via our server); no CoinGecko for SHM */
(function(){try{
var G=null,busy=false,lastRun=0;
function med(a){a=a.slice().sort(function(x,y){return x-y});var m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2}
function j(u){return fetch(u,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
async function shm(){
 if(busy)return;busy=true;
 try{
  var usd=[],fxv=null,chg=null;
  var R=await Promise.allSettled([
   j("/api/price").then(function(d){if(d&&d.usd>0){usd.push(+d.usd);if(d.inr>0)fxv=d.inr/d.usd}}),
   j("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SHM-USDT").then(function(d){var v=+d.data.price;if(v>0)usd.push(v)}),
   j("https://api.mexc.com/api/v3/ticker/price?symbol=SHMUSDT").then(function(d){var v=+d.price;if(v>0)usd.push(v)}),
   j("https://api.kucoin.com/api/v1/market/stats?symbol=SHM-USDT").then(function(d){var c=parseFloat(d.data.changeRate);if(isFinite(c))chg=c*100})
  ]);
  if(!usd.length)return;
  var m=med(usd),ok=usd.filter(function(v){return Math.abs(v-m)/m<=0.3});if(ok.length)m=med(ok);
  var f=fxv||((typeof fx!=="undefined"&&fx>0)?fx:null);if(!f)return;
  G={usd:m,inr:m*f,chg:chg!=null?chg:((G&&G.chg)||0),src:"exchanges"};
  T.SHM.p={usd:G.usd,inr:G.inr,chg:G.chg};try{paint()}catch(e){}
 }catch(e){}finally{busy=false;lastRun=Date.now()}
}
var _fp=fetchPrices;
fetchPrices=async function(){try{await _fp.apply(this,arguments)}catch(e){}if(G){T.SHM.p={usd:G.usd,inr:G.inr,chg:G.chg}}if(Date.now()-lastRun>45000)shm()};
/* guard: if any older code writes a very different SHM price, put the exchange price back */
setInterval(function(){try{if(!G)return;var p=T.SHM.p;if(!p||!(p.inr>0)||Math.abs(p.inr-G.inr)/G.inr>0.3){T.SHM.p={usd:G.usd,inr:G.inr,chg:G.chg};try{paint()}catch(e){}}}catch(e){}},1500);
setTimeout(shm,1200);setInterval(shm,60000);
}catch(e){try{console.error("Build75",e)}catch(_){}}})();

/* Build 77: Services page regrouped: wallet tools on top, groups (Calculators, RWA, Safety, Help) open inside; faucet removed here */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var P="html body #app #sheetSvc#sheetSvc ";
var st=document.createElement("style");st.id="b77s";
st.textContent=
P+'#svcBody.b77on>.svc-chips,'+P+'#svcBody.b77on>.svg-h,'+P+'#svcBody.b77on>.svg-g{display:none!important}'+
P+'button[onclick="SV.go(4,0)"]{display:none!important}'+
P+'.svq input{border:1px solid var(--cvb)!important;background:var(--z1)!important;border-radius:14px!important;box-shadow:none!important;color:var(--zt)!important;font-weight:500!important}'+
P+'#b77{padding:2px 2px 30px}'+P+'.b77h{font-size:15px;font-weight:600;color:var(--cvl);margin:14px 4px 10px}'+
P+'.b77g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 8px}'+
P+'.b77t{display:flex;flex-direction:column;align-items:center;gap:8px;background:none;border:0;cursor:pointer;font-family:inherit;color:var(--zt);font-size:13px;font-weight:600;text-align:center;padding:0}'+
P+'.b77i{width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center}'+P+'.b77i svg{width:24px;height:24px}'+P+'.b77i svg *{stroke:currentColor!important}'+
P+'.b77i.g{background:var(--cvg);color:var(--cvgt)}'+P+'.b77i.n{background:var(--cvn);color:var(--cvnt)}'+
P+'.b77r{display:flex;align-items:center;gap:14px;width:100%;border:0;border-radius:18px;padding:14px;margin-bottom:10px;cursor:pointer;font-family:inherit;text-align:left;color:var(--zt)}'+
P+'.b77r.g{background:var(--cvg)}'+P+'.b77r.n{background:var(--cvn)}'+
P+'.b77r .b77i{width:44px;height:44px;border-radius:13px;background:var(--z1);flex-shrink:0}'+P+'.b77r.g .b77i{color:var(--cvgt)}'+P+'.b77r.n .b77i{color:var(--cvnt)}'+
P+'.b77r b{display:block;font-size:16px;font-weight:600}'+P+'.b77r small{display:block;font-size:13px;color:var(--cvl);font-weight:500;margin-top:2px}'+
P+'.b77r em{margin-left:auto;font-style:normal;font-size:22px;color:var(--cvl)}'+
P+'.b77l{display:flex;align-items:center;gap:14px;width:100%;background:none;border:0;border-bottom:1px solid var(--cvb);padding:12px 4px;cursor:pointer;font-family:inherit;color:var(--zt);font-size:16px;font-weight:600;text-align:left}'+
P+'.b77l .b77i{width:42px;height:42px;border-radius:12px}'+P+'.b77l em{margin-left:auto;font-style:normal;font-size:22px;color:var(--cvl)}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3200);
var GI={1:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/></svg>',
2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/></svg>',
3:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
5:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7M12 17h.01"/></svg>'};
var GN={1:["Calculators","कैलकुलेटर"],2:["RWA","RWA"],3:["Safety","सुरक्षा"],5:["Help","मदद"]};
var sub=null,oldT="";
var B78I={"0-0": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M13 3L5 14h6l-1 7 8-11h-6z\"/></svg>", "0-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 7h11l-3-3M17 17H6l3 3\"/></svg>", "0-2": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4v11M7 10l5 5 5-5M5 20h14\"/></svg>", "0-3": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"6\"/><path d=\"M20 20l-4.5-4.5\"/></svg>", "0-4": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z\"/><path d=\"M10 20.5a2 2 0 0 0 4 0\"/></svg>", "0-5": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"9\" r=\"3.5\"/><path d=\"M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5\"/></svg>", "1-0": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 17l5-5 4 4 7-7\"/><path d=\"M15 9h5v5\"/></svg>", "1-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 10l8-5 8 5M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18\"/></svg>", "1-2": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 21V9l8-5 8 5v12\"/><path d=\"M12 11v6M10 13h3a1 1 0 0 1 0 2h-2a1 1 0 0 0 0 2h3\"/></svg>", "1-3": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3a9 9 0 1 0 9 9h-9z\"/><path d=\"M15 3.5A9 9 0 0 1 20.5 9H15z\"/></svg>", "1-4": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 5L5 19\"/><circle cx=\"7\" cy=\"7\" r=\"2.5\"/><circle cx=\"17\" cy=\"17\" r=\"2.5\"/></svg>", "1-5": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l9 5-9 5-9-5z\"/><path d=\"M3 13l9 5 9-5\"/></svg>", "1-6": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20c.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17 14c2.2 0 3.6 1.2 4 3.5\"/></svg>", "1-7": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 19h16\"/><path d=\"M6 15l4-4 3 3 5-6\"/></svg>", "2-0": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 21V9l8-5 8 5v12M9 21v-6h6v6\"/></svg>", "2-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 8h6M9 12h6M9 16h4\"/></svg>", "2-2": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 5h10M9 12h10M9 19h10\"/><path d=\"M4 5l1 1 2-2M4 12l1 1 2-2M4 19l1 1 2-2\"/></svg>", "2-3": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M12 8v5M12 16v.5\"/></svg>", "2-4": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2z\"/><path d=\"M20 6a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z\"/></svg>", "2-5": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M14.5 9.5a2.5 2 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2a2.5 2 0 0 1-2.5-1.5M12 6.5V8M12 16v1.5\"/></svg>", "3-0": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9.5 12h5M12 9.5v5\"/></svg>", "3-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 18h6M10 21h4\"/><path d=\"M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z\"/></svg>", "3-2": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 4h8v5a4 4 0 0 1-8 0z\"/><path d=\"M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8\"/></svg>", "3-3": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.7-2.6 1.5-3.5C9.8 9 11 9 12 3z\"/><path d=\"M12 21v-2\"/></svg>", "3-4": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z\"/><path d=\"M10 20.5a2 2 0 0 0 4 0\"/></svg>", "3-5": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7.5V12l3 2\"/></svg>", "5-0": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 16.5v.5\"/></svg>", "5-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h16v11H9l-5 4z\"/><path d=\"M8 9h8M8 12h5\"/></svg>", "5-2": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"10\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/></svg>", "5-3": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 3h7l4 4v14H7z\"/><path d=\"M14 3v4h4M10 12h5M10 16h5\"/></svg>", "4-1": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5M12 8v.5\"/></svg>"};function items(g){var b=$("svcBody");if(!b)return[];return Array.prototype.map.call(b.querySelectorAll('button[onclick^="SV.go('+g+',"]'),function(x){var m=x.getAttribute("onclick").match(/SV\.go\((\d+),(\d+)\)/);var l=x.querySelector(".svl"),i=x.querySelector(".svi");var lb=l?l.textContent.trim():"";if(lb==="Address Book")lb="Address book";if(lb==="History CSV")lb="History";if(lb==="इतिहास CSV")lb="इतिहास";var k=m[1]+"-"+m[2];return{g:+m[1],i:+m[2],label:lb,icon:B78I[k]||(i?i.innerHTML:"")}})}
function groupItems(g){var a=items(g);if(g===3)a=a.filter(function(x){return !/^(Daily streak|रोज़ की गिनती|History|इतिहास|Crypto quiz|क्रिप्टो क्विज़)$/i.test(x.label)});if(g===5)a=a.concat(items(4).filter(function(x){return x.i!==0})).concat(items(2).filter(function(x){return x.i===5}));return a}
function go(x){try{SV.go(x.g,x.i)}catch(e){}}
function main(box){sub=null;var w=items(0).concat(items(1).filter(function(x){return x.i===7||x.i===6})),h='<div class="b77h">'+(en()?"Wallet tools":"वॉलेट टूल")+'</div><div class="b77g">';
 w.forEach(function(x,k){h+='<button type="button" class="b77t" data-g="'+x.g+'" data-i="'+x.i+'"><span class="b77i '+(k%2?"n":"g")+'">'+x.icon+'</span>'+x.label+'</button>'});
 h+='</div><div class="b77h" style="margin-top:22px">'+(en()?"More tools":"और टूल")+'</div>';
 [3,5].forEach(function(g,k){var a=groupItems(g);if(!a.length)return;var names=a.slice(0,3).map(function(x){return x.label}).join(", ");var more=a.length>3?(en()?" and "+(a.length-3)+" more":" और "+(a.length-3)+" अन्य"):"";
  h+='<button type="button" class="b77r '+(k%2?"g":"n")+'" data-sub="'+g+'"><span class="b77i">'+GI[g]+'</span><span><b>'+GN[g][en()?0:1]+'</b><small>'+names+more+'</small></span><em>›</em></button>'});
 box.innerHTML=h;
 box.querySelectorAll(".b77t").forEach(function(b){b.onclick=function(){go({g:+b.getAttribute("data-g"),i:+b.getAttribute("data-i")})}});
 box.querySelectorAll(".b77r").forEach(function(b){b.onclick=function(){open(box,+b.getAttribute("data-sub"))}});
 var tt=document.querySelector("#sheetSvc .ttl");if(tt&&oldT)tt.textContent=oldT}
function open(box,g){sub=g;var a=groupItems(g),h="";a.forEach(function(x,k){h+='<button type="button" class="b77l" data-g="'+x.g+'" data-i="'+x.i+'"><span class="b77i '+(k%2?"n":"g")+'">'+x.icon+'</span>'+x.label+'<em>›</em></button>'});
 box.innerHTML=h;box.querySelectorAll(".b77l").forEach(function(b){b.onclick=function(){go({g:+b.getAttribute("data-g"),i:+b.getAttribute("data-i")})}});
 var tt=document.querySelector("#sheetSvc .ttl");if(tt){if(!oldT)oldT=tt.textContent;tt.textContent=GN[g][en()?0:1]}
 var pn=document.querySelector("#sheetSvc .panel");if(pn)pn.scrollTop=0}
document.addEventListener("click",function(e){var bk=e.target&&e.target.closest?e.target.closest("#sheetSvc .bkb"):null;if(!bk||sub===null)return;var box=$("b77");if(!box)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();main(box)},true);
function run(){var sh=$("sheetSvc"),b=$("svcBody");if(!sh||!b)return;if(!sh.classList.contains("open")){if(sub!==null){var bx=$("b77");if(bx)main(bx)}return}
 var q=$("svqi"),qs=q&&q.value.trim();b.classList.toggle("b77on",!qs);
 var box=$("b77");if(!box){box=document.createElement("div");box.id="b77";var sq=b.querySelector(".svq");if(sq)sq.after(box);else b.prepend(box);var tt=document.querySelector("#sheetSvc .ttl");if(tt)oldT=tt.textContent;main(box)}
 box.style.display=qs?"none":""}
setInterval(run,300);
}catch(e){try{console.error("Build77",e)}catch(_){}}})();

/* Build 78: Services in one calm colour with one icon family */
(function(){try{var P="html body #app #sheetSvc#sheetSvc ";var st=document.createElement("style");st.id="b78s";
st.textContent='html[data-theme=light]{--svt:#F1F4F8;--svi:#16335F;--svb:#E3E7EE}html[data-theme=dark]{--svt:#1C1F26;--svi:#E6ECF5;--svb:#2C2C2E}'+
P+'.b77i.g,'+P+'.b77i.n{background:var(--svt)!important;color:var(--svi)!important}'+
P+'.b77r.g,'+P+'.b77r.n{background:transparent!important;border:1px solid var(--svb)!important}'+
P+'.b77r .b77i,'+P+'.b77r.g .b77i,'+P+'.b77r.n .b77i{background:var(--svt)!important;color:var(--svi)!important}'+
P+'.b77i svg{stroke-width:1.8!important}'+P+'.b77h{text-align:left!important;color:var(--cvl)!important}'+
P+'.b77l{border-bottom-color:var(--svb)!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3300);}catch(e){}})();

/* Build 79: Price converter in the same calm colour as Services */
(function(){try{var P="html body #s58conv#s58conv#s58conv ";var st=document.createElement("style");st.id="b79s";
st.textContent=
P+'.s58box.res{background:var(--svt)!important;border:1px solid var(--svt)!important}'+
P+'.s58cc,'+P+'.s58box.res .s58cc{background:var(--svt)!important;color:var(--svi)!important}'+
P+'.s58box.res .s58cc{background:var(--z1)!important}'+
P+'.s58quick span,'+P+'.s58quick span:nth-child(even){background:var(--svt)!important;color:var(--svi)!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3400);}catch(e){}})();

/* Build 80: Network fee page redesigned (SHM send + token send, rupee estimate, test network note) */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
var P="html body #s58fee#s58fee ";
var st=document.createElement("style");st.id="b80s";
st.textContent=
P+'.panel{padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))!important}'+
P+'.b80t{text-align:center;font-size:18px;font-weight:600;color:var(--zt);margin-top:4px}'+
P+'.b80c{display:flex;justify-content:center;margin-top:8px}'+P+'.b80c span{display:inline-flex;align-items:center;gap:6px;background:var(--svt);color:var(--svi);border-radius:14px;padding:5px 12px;font-size:13px;font-weight:600}'+P+'.b80c i{width:8px;height:8px;border-radius:50%;background:#22C55E}'+
P+'.b80r{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px 14px;margin-top:12px}'+
P+'.b80r .ic{width:42px;height:42px;border-radius:12px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;flex-shrink:0}'+P+'.b80r .ic svg{width:20px;height:20px}'+P+'.b80r .ic svg *{stroke:currentColor!important}'+
P+'.b80r b{display:block;font-size:15px;font-weight:600;color:var(--zt)}'+P+'.b80r small{display:block;font-size:12.5px;color:var(--cvl);font-weight:500}'+
P+'.b80r .v{margin-left:auto;text-align:right}'+P+'.b80r .v b{font-size:16px}'+
P+'.b80n{display:flex;gap:10px;background:var(--svt);border-radius:14px;padding:12px 14px;margin-top:12px;font-size:13px;line-height:1.55;color:var(--zt);font-weight:500}'+P+'.b80n .i{color:var(--zgb,#00A86B);flex-shrink:0;font-weight:700}'+
P+'.b80e{font-size:13px;color:var(--cvl);line-height:1.6;margin-top:12px;font-weight:500}'+
P+'.b80u{text-align:center;font-size:12px;color:var(--cvl);margin-top:10px}'+
P+'.b80ok{width:100%;margin-top:14px;border:0;border-radius:14px;padding:14px;background:var(--zb);color:var(--zbt);font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}'+
P+'.b80err{color:#DC2626}'+'html body:has(#s58fee.open) #hbBtn#hbBtn{display:none!important}'+P+'.b80r .ic{box-shadow:none!important;border:0!important}'+P+'.s58st,'+P+'.s58fv,'+P+'.s58fi,'+P+'.s58fn,'+P+'#s58fok{display:none!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3500);
var UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
var TK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 9h6M12 9v7"/></svg>';
function fm(x){return x>=100?x.toFixed(0):x>=1?x.toFixed(x>=10?0:2):x>=0.0001?x.toFixed(5):x.toPrecision(3)}
function rs(x){return "₹"+(x>=1?x.toFixed(2):x>=0.01?x.toFixed(2):x.toPrecision(2))}
var _f=S58.fee;
S58.fee=async function(){
 try{_f.apply(this,arguments)}catch(e){}
 var sh=$("s58fee");if(!sh)return;var pn=sh.querySelector(".panel")||sh;
 var n=NETWORKS[currentNet],sym=n.symbol,test=/test/i.test(n.name||"")||/test/i.test(currentNet);
 var ow=pn.querySelector(".b80w");if(ow)ow.remove();var W=document.createElement("div");W.className="b80w";pn.appendChild(W);
 W.innerHTML='<div class="b80t">'+tx("Network fee","नेटवर्क फ़ीस")+'</div><div class="b80c"><span><i></i>'+n.name+'</span></div>'+
 '<div class="b80r"><span class="ic">'+UP+'</span><span><b>'+tx("Send "+sym,sym+" भेजना")+'</b><small>'+tx("Coin transfer","सिक्का भेजना")+'</small></span><span class="v"><b id="b80a">…</b><small id="b80ai"></small></span></div>'+
 '<div class="b80r"><span class="ic">'+TK+'</span><span><b>'+tx("Send a token","टोकन भेजना")+'</b><small>'+tx("TZT and others","TZT और दूसरे")+'</small></span><span class="v"><b id="b80b">…</b><small id="b80bi"></small></span></div>'+
 (test?'<div class="b80n"><span class="i">ⓘ</span><span>'+tx("You are on a <b>test network</b>. Test "+sym+" has no value, so sending costs you nothing real. ₹ shows what it would cost on the real network.","आप <b>टेस्ट नेटवर्क</b> पर हैं। टेस्ट "+sym+" की कोई क़ीमत नहीं, इसलिए असल में कुछ ख़र्च नहीं होता। ₹ बताता है कि असली नेटवर्क पर कितना लगता।")+'</span></div>':'')+
 '<div class="b80e">'+tx("The fee goes to the network that records your transaction, not to Tazvera. It is always paid in "+sym+", so keep a little "+sym+" even when you send a token.","फ़ीस उस नेटवर्क को जाती है जो आपका लेन-देन दर्ज करता है, Tazvera को नहीं। यह हमेशा "+sym+" में कटती है, इसलिए टोकन भेजते समय भी थोड़ा "+sym+" रखिए।")+'</div>'+
 '<div class="b80u" id="b80u">'+tx("Loading…","लोड हो रहा है…")+'</div><button type="button" class="b80ok">'+tx("OK","ठीक है")+'</button>';
 W.querySelector(".b80ok").onclick=function(){try{S58.close("s58fee")}catch(e){sh.classList.remove("open")}};
 try{var r=await fetch(n.rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_gasPrice",params:[]})});var d=await r.json();var gp=parseInt(d.result,16);if(!(gp>0))throw 0;
  var a=gp*21000/1e18,b=gp*40000/1e18,p=(T[sym]&&T[sym].p)?T[sym].p.inr:null;
  $("b80a").textContent="≈ "+fm(a)+" "+sym;$("b80b").textContent="≈ "+fm(b)+" "+sym;
  if(p>0){$("b80ai").textContent="≈ "+rs(a*p);$("b80bi").textContent="≈ "+rs(b*p)}
  $("b80u").textContent=tx("Updated just now · changes with network traffic","अभी अपडेट हुआ · नेटवर्क की भीड़ से बदलती है");
 }catch(e){["b80a","b80b"].forEach(function(i){var x=$(i);if(x){x.textContent="—"}});var u=$("b80u");if(u){u.className="b80u b80err";u.textContent=tx("Could not load the fee right now. Try again in a moment.","फ़ीस अभी नहीं मिल पाई, थोड़ी देर बाद देखिए।")}}
};
}catch(e){try{console.error("Build80",e)}catch(_){}}})();

/* Build 81: PIN screens in Tazvera style + "Ask PIN for every send" (on by default) */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var st=document.createElement("style");st.id="b81s";
var L='html body #xtLock#xtLock',A='html body #pinAsk#pinAsk',W='html body #sheetWallet#sheetWallet';
st.textContent=
L+'{background:var(--z1)!important;color:var(--zt)!important}'+
L+' .lkic{width:76px!important;height:76px!important;border-radius:20px!important;background:#000!important;overflow:hidden;padding:0!important;box-shadow:none!important;border:0!important}'+
L+' .lkic img{width:100%;height:100%;display:block}'+L+' .lkic svg{display:none!important}'+
L+' .pt{color:var(--zt)!important;font-weight:600!important;font-size:20px!important;margin-top:14px!important}'+
[L,A,W].map(function(p){return p+' .pbs{gap:16px!important;justify-content:center;margin:22px 0 26px!important}'+
 p+' .pbs i{width:14px!important;height:14px!important;border-radius:50%!important;border:1.5px solid var(--zt)!important;background:transparent!important;box-shadow:none!important}'+
 p+' .pbs i.f{background:var(--zt)!important}'+p+' .pbs i.f::after{display:none!important}'+p+' .pbs i.c{border-color:var(--zgb,#00A86B)!important}'+
 p+' .kp .pk{border:0!important;background:transparent!important;box-shadow:none!important;font-size:28px!important;font-weight:500!important;color:var(--zt)!important;height:64px!important;border-radius:50%!important}'+
 p+' .kp .pk:active{background:var(--svt)!important}'+p+' .kp .pk svg{color:var(--zt)!important;stroke:currentColor!important}'+
 p+'.b81bad .pbs i{border-color:#DC2626!important;background:transparent!important}'+p+'.b81bad .pbs{animation:b81sh .4s}'}).join("")+
'@keyframes b81sh{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}'+
L+' .forgot{color:var(--cvl,#3A4556)!important;font-weight:500!important;font-size:14px!important;text-decoration:underline}'+
L+' #xtMsg{color:#DC2626!important;font-weight:600!important}'+L+' #xtHint{color:var(--cvl)!important;opacity:1!important}'+
A+' .panel{background:var(--z1)!important}'+
'html body #app #sbody .b81row{display:flex;align-items:center;justify-content:space-between;gap:12px}'+
'html body #app #sbody .b81sw{width:46px;height:26px;border-radius:13px;background:var(--svb,#DCE1E8);position:relative;flex-shrink:0;border:0;cursor:pointer}'+
'html body #app #sbody .b81sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}'+
'html body #app #sbody .b81sw.on{background:var(--zgb,#00A86B)}html body #app #sbody .b81sw.on::after{left:23px}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3600);
/* logo on the lock screen */
function logo(){var k=document.querySelector("#xtLock .lkic");if(k&&!k.querySelector("img")){var i=document.createElement("img");i.src="icon-192.png";i.alt="";k.appendChild(i)}}
setInterval(logo,1000);logo();
/* wrong PIN: red dots + shake */
function bad(el){if(!el)return;el.classList.remove("b81bad");void el.offsetWidth;el.classList.add("b81bad");setTimeout(function(){el.classList.remove("b81bad")},900)}
var mg=$("xtMsg");if(mg)new MutationObserver(function(){if(/wrong|गलत|ग़लत/i.test(mg.textContent))bad($("xtLock"))}).observe(mg,{childList:true,characterData:true,subtree:true});
var tt=$("toast");if(tt)new MutationObserver(function(){if(/wrong pin|गलत pin|ग़लत pin/i.test(tt.textContent)){bad($("pinAsk"));bad($("sheetWallet"))}}).observe(tt,{childList:true,characterData:true,subtree:true});
/* ask PIN for every send (in-app wallet only) */
function every(){try{return localStorage.getItem("tz_pinsend")!=="0"}catch(e){return true}}
var PR=window.ethereum;if(PR&&PR.isCpWallet&&!PR.__b81){PR.__b81=1;var _r=PR.request.bind(PR);PR.request=async function(a){if(a&&a.method==="eth_sendTransaction"&&every()){try{if(window.CPW&&CPW.has()&&CPW.unlocked())CPW.lock()}catch(e){}}return _r(a)}}
/* switch in Settings > Security */
window.TZPS=function(b){var on=!every();try{localStorage.setItem("tz_pinsend",on?"1":"0")}catch(e){}b.classList.toggle("on",on)};
function row(){var t=$("stt"),b=$("sbody");if(!t||!b)return;if(!/Security|सुरक्षा/.test(t.textContent||""))return;if(b.querySelector(".b81r"))return;
 var d=document.createElement("div");d.className="sr b81r";d.innerHTML='<span class="b81row" style="width:100%"><span class="sl">'+(en()?"Ask PIN for every send":"हर बार भेजने पर PIN माँगें")+'</span><button type="button" class="b81sw'+(every()?" on":"")+'" aria-label="toggle" onclick="TZPS(this)"></button></span>';
 b.insertBefore(d,b.firstChild)}
setInterval(row,700);
}catch(e){try{console.error("Build81",e)}catch(_){}}})();

/* Build 82: bigger PIN dots, soft rounded key buttons, clean navy delete key */
(function(){try{var st=document.createElement("style");st.id="b82s";
var S=['html body #xtLock#xtLock','html body #pinAsk#pinAsk','html body #sheetWallet#sheetWallet'];
st.textContent=S.map(function(p){return p+' .pbs{gap:20px!important}'+p+' .pbs i{width:20px!important;height:20px!important;border-width:2px!important}'+
p+' .kp{gap:12px 14px!important}'+p+' .kp .pk{background:var(--svt)!important;border-radius:18px!important;height:62px!important}'+
p+' .kp .pk.fp[style*="hidden"]{background:transparent!important}'+p+' .kp .pk:active{background:var(--svb)!important}'+
p+' .kp .pk.bs svg{width:28px!important;height:28px!important;color:var(--zt)!important}'+p+' .kp .pk.bs svg *{stroke:currentColor!important;fill:none!important}'}).join("");
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3700);
var BS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>';
function fix(){document.querySelectorAll(".kp .pk.bs").forEach(function(b){if(b.getAttribute("data-b82")!=="1"){b.setAttribute("data-b82","1");b.innerHTML=BS}})}
fix();setInterval(fix,800);
}catch(e){}})();

/* Build 83: Price alarm page redesigned (coin buttons, price now, up/down, rupees, alarm cards) */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
var P="html body #xtSheet#xtSheet ";
var st=document.createElement("style");st.id="b83s";
st.textContent=
P+'.b83 .lb{font-size:14px;font-weight:600;color:var(--cvl);margin:16px 2px 8px}'+
P+'.b83 .cs{display:flex;gap:8px;flex-wrap:wrap}'+
P+'.b83 .cs button{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:20px;padding:6px 12px 6px 6px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer}'+
P+'.b83 .cs button.on{background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+
P+'.b83 .cs img,'+P+'.b83 .cs .lt{width:24px;height:24px;border-radius:50%;object-fit:cover;background:var(--svt);display:inline-flex;align-items:center;justify-content:center;font-size:11px}'+
P+'.b83 .now{background:var(--svt);border-radius:16px;padding:14px;margin-top:14px;display:flex;justify-content:space-between;align-items:center}'+
P+'.b83 .now small{color:var(--cvl);font-weight:500;font-size:13px}'+P+'.b83 .now b{font-size:20px;font-weight:600;color:var(--zt)}'+P+'.b83 .now em{display:block;font-style:normal;font-size:12px;color:var(--cvl);text-align:right}'+
P+'.b83 .dr{display:flex;gap:10px}'+P+'.b83 .dr button{flex:1;border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:14px;padding:13px 8px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}'+
P+'.b83 .dr button.on{background:var(--svt);border-color:var(--zt)}'+
P+'.b83 .in{display:flex;align-items:center;border:1px solid var(--svb);border-radius:14px;padding:4px 14px;background:var(--z1)}'+P+'.b83 .in:focus-within{border-color:var(--zgb,#00A86B)}'+
P+'.b83 .in span{font-size:20px;font-weight:600;color:var(--cvl)}'+P+'.b83 .in input{flex:1;border:0!important;background:transparent!important;font-size:20px;font-weight:600;color:var(--zt);padding:10px 8px;outline:0;box-shadow:none!important;font-family:inherit}'+
P+'.b83 .hint{font-size:12.5px;color:var(--cvl);margin:6px 2px 0;font-weight:500}'+
P+'.b83 .add{width:100%;margin-top:16px;border:0;border-radius:14px;padding:15px;background:var(--zb);color:var(--zbt);font-size:16px;font-weight:600;font-family:inherit;cursor:pointer}'+
P+'.b83 .al{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px 14px;margin-top:10px}'+
P+'.b83 .al .ic{width:40px;height:40px;border-radius:12px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0}'+
P+'.b83 .al b{display:block;font-size:15px;font-weight:600;color:var(--zt)}'+P+'.b83 .al small{font-size:12.5px;color:var(--cvl);font-weight:500}'+
P+'.b83 .al .x{margin-left:auto;border:0;background:var(--svt);color:var(--zt);width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer}'+
P+'.b83 .done{color:var(--zgb,#00A86B)!important;font-weight:600!important}'+
P+'.b83 .nt{background:var(--svt);border-radius:14px;padding:12px 14px;margin-top:16px;font-size:13px;line-height:1.55;color:var(--zt);font-weight:500}'+
P+'.b83 .em{text-align:center;color:var(--cvl);font-size:13.5px;padding:12px 0}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3800);
var COINS=["SHM","BTC","ETH","USDT","BNB"],sel="SHM",dir="a";
function pr(s){try{return T[s]&&T[s].p?T[s].p:null}catch(e){return null}}
function rs(x){if(!(x>0))return "—";return "₹"+(x>=1000?x.toLocaleString("en-IN",{maximumFractionDigits:0}):x>=1?x.toLocaleString("en-IN",{maximumFractionDigits:2}):String(Number(x.toPrecision(3))))}
function us(x){return "$"+(x>=1?x.toLocaleString("en-US",{maximumFractionDigits:2}):String(Number(x.toPrecision(3))))}
function logo(s){var i=document.querySelector('#list .row .ic img[alt="'+s+'"]');return i?'<img src="'+i.getAttribute("src")+'" alt="">':'<span class="lt">'+s[0]+'</span>'}
function render(){var B=$("xtB");if(!B)return;var t=$("xtT");if(t)t.textContent=tx("Price alarm","कीमत अलार्म");
 var p=pr(sel),list=[];try{list=ls.get("xt_al",[])}catch(e){}
 var h='<div class="b83"><div class="lb">'+tx("Coin","सिक्का")+'</div><div class="cs">'+COINS.map(function(c){return'<button type="button" data-c="'+c+'" class="'+(c===sel?"on":"")+'">'+logo(c)+c+'</button>'}).join("")+'</div>'+
 '<div class="now"><small>'+tx("Price now","अभी का भाव")+'</small><span><b>'+(p?rs(p.inr):"—")+'</b><em>'+(p?us(p.usd):"")+'</em></span></div>'+
 '<div class="lb">'+tx("Alert me when the price","भाव कब बताऊँ")+'</div><div class="dr"><button type="button" data-d="a" class="'+(dir==="a"?"on":"")+'">↑ '+tx("Goes above","ऊपर जाए")+'</button><button type="button" data-d="b" class="'+(dir==="b"?"on":"")+'">↓ '+tx("Goes below","नीचे जाए")+'</button></div>'+
 '<div class="lb">'+tx("Price in rupees","रुपये में भाव")+'</div><div class="in"><span>₹</span><input id="b83p" type="number" inputmode="decimal" placeholder="0"></div><div class="hint" id="b83h"></div>'+
 '<button type="button" class="add">'+tx("Add alarm","अलार्म लगाएँ")+'</button>'+
 '<div class="lb" style="margin-top:22px">'+tx("Your alarms","आपके अलार्म")+'</div>'+
 (list.length?list.map(function(a,i){var fx=(pr(a.s)&&pr(a.s).usd>0)?pr(a.s).inr/pr(a.s).usd:null;var shown=a.pi?rs(a.pi):(fx?rs(a.p*fx):us(a.p));
  return'<div class="al"><span class="ic">'+(a.d==="a"?"↑":"↓")+'</span><span><b>'+a.s+' '+(a.d==="a"?tx("above","से ऊपर"):tx("below","से नीचे"))+' '+shown+'</b><small class="'+(a.x?"done":"")+'">'+(a.x?tx("✓ Reached","✓ पहुँच गया"):tx("Waiting","इंतज़ार में"))+'</small></span><button type="button" class="x" data-i="'+i+'" aria-label="Delete">✕</button></div>'}).join(""):'<div class="em">'+tx("No alarms yet","अभी कोई अलार्म नहीं")+'</div>')+
 '<div class="nt">ⓘ '+tx("The alarm checks the price while Tazvera is open. Allow notifications to hear it even in another tab.","Tazvera खुला रहने पर अलार्म भाव देखता रहता है। दूसरे टैब में भी सुनने के लिए सूचना (notification) की अनुमति दीजिए।")+'</div></div>';
 B.innerHTML=h;
 B.querySelectorAll(".cs button").forEach(function(b){b.onclick=function(){sel=b.getAttribute("data-c");render()}});
 B.querySelectorAll(".dr button").forEach(function(b){b.onclick=function(){dir=b.getAttribute("data-d");B.querySelectorAll(".dr button").forEach(function(x){x.classList.toggle("on",x===b)})}});
 var inp=$("b83p");inp.oninput=function(){var v=parseFloat(inp.value),q=pr(sel),hh=$("b83h");if(q&&v>0&&q.inr>0){var d=(v-q.inr)/q.inr*100;hh.textContent=(d>=0?"+":"")+d.toFixed(1)+"% "+tx("from now","अभी से")}else hh.textContent=""};
 B.querySelector(".add").onclick=function(){var v=parseFloat(inp.value),q=pr(sel);if(!(v>0)){try{toast(tx("Enter a price","भाव लिखिए"))}catch(e){}return}
  if(!q||!(q.inr>0)||!(q.usd>0)){try{toast(tx("Price not loaded yet. Try again in a moment.","भाव अभी नहीं आया, थोड़ी देर बाद"))}catch(e){}return}
  var usd=v*q.usd/q.inr;try{Notification&&Notification.permission==="default"&&Notification.requestPermission()}catch(e){}
  XT.ad("al",{s:sel,d:dir,p:usd,pi:v})};
 B.querySelectorAll(".al .x").forEach(function(b){b.onclick=function(){XT.dl("al",+b.getAttribute("data-i"))}});
}
if(window.XT&&XT.go&&!XT.__b83){XT.__b83=1;var og=XT.go;XT.go=function(n){og.apply(this,arguments);if(n==="al"){try{render()}catch(e){}}}}
}catch(e){try{console.error("Build83",e)}catch(_){}}})();

/* Build 84: Address book redesigned (contact cards first, add form with paste/scan, duplicate check) */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return"&#"+c.charCodeAt(0)+";"})}
var P="html body #app #sheetBook#sheetBook ";
var st=document.createElement("style");st.id="b84s";
st.textContent=
P+'.panel>.btn.ghost[onclick="closeAll()"]{display:none!important}'+
P+'#b84q{width:100%;border:1px solid var(--svb);border-radius:14px;padding:12px 14px;font-size:15px;background:var(--z1);color:var(--zt);font-family:inherit;margin:6px 0 4px;box-sizing:border-box}'+
P+'.b84c{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px 12px;margin-top:10px;cursor:pointer}'+
P+'.b84c .av{width:42px;height:42px;border-radius:50%;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600;flex-shrink:0}'+
P+'.b84c .nm{flex:1;min-width:0}'+P+'.b84c b{display:block;font-size:15px;font-weight:600;color:var(--zt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+P+'.b84c small{font-size:12.5px;color:var(--cvl);font-weight:500;font-family:ui-monospace,Menlo,monospace}'+
P+'.b84c .sd{border:0;background:var(--zb);color:var(--zbt);border-radius:12px;padding:8px 14px;font-weight:600;font-size:13px;font-family:inherit;cursor:pointer}'+
P+'.b84c .dl{border:0;background:var(--svt);color:var(--zt);width:34px;height:34px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0}'+
P+'.b84e{text-align:center;color:var(--cvl);font-size:14px;line-height:1.6;padding:22px 10px;font-weight:500}'+
P+'.b84e .ei{width:56px;height:56px;border-radius:18px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;margin:0 auto 10px}'+P+'.b84e svg{width:26px;height:26px}'+
P+'.b84add{width:100%;margin-top:16px;border:1px dashed var(--svb);background:transparent;color:var(--zt);border-radius:14px;padding:14px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}'+
P+'#b84f{display:none;border:1px solid var(--svb);border-radius:18px;padding:14px;margin-top:14px}'+P+'#b84f.on{display:block}'+
P+'#b84f .lb{font-size:13px;font-weight:600;color:var(--cvl);margin:0 2px 6px;text-align:left}'+P+'#b84m{text-align:left}'+
P+'#b84f .inp{position:relative;border:1px solid var(--svb)!important;border-radius:14px!important;background:var(--z1)!important;margin-bottom:12px!important}'+
P+'#b84f .inp input{color:var(--zt)!important;font-weight:500!important}'+P+'#b84f .inp:focus-within{border-color:var(--zgb,#00A86B)!important}'+
P+'#b84f .ai{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:flex;gap:2px}'+P+'#b84f .ai button{width:38px;height:38px;border:0;background:transparent;color:var(--zt);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center}'+P+'#b84f .ai svg{width:21px;height:21px}'+
P+'#bookAddr{padding-right:88px!important;font-family:ui-monospace,Menlo,monospace!important;font-size:13px!important}'+
P+'#b84m{min-height:18px;font-size:13px;font-weight:600;color:#DC2626;margin:-4px 2px 8px}'+
P+'#b84f .btn{background:var(--zb)!important;color:var(--zbt)!important;border:0!important;border-radius:14px!important;font-weight:600!important;margin:0!important;width:100%}'+
P+'#b84v{width:100%;border-radius:14px;margin-bottom:10px;display:none;background:#000}'+
P+'.b84n{font-size:12.5px;color:var(--cvl);text-align:center;margin-top:14px;font-weight:500}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},3900);
var PA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>';
var SC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M7 12h10"/></svg>';
var BK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/></svg>';
var stream=null,scanning=false;
function stop(){scanning=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}var v=$("b84v");if(v)v.style.display="none"}
async function scan(){var m=$("b84m");if(!("BarcodeDetector" in window)){m.textContent=tx("Scanning is not supported here. Please paste the address.","यहाँ स्कैन नहीं होता, पता चिपकाइए।");return}
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});var v=$("b84v");v.srcObject=stream;v.style.display="block";await v.play();var d=new BarcodeDetector({formats:["qr_code"]});scanning=true;
  while(scanning){try{var r=await d.detect(v);if(r.length){var a=(r[0].rawValue.match(/0x[0-9a-fA-F]{40}/)||[])[0];stop();if(a){$("bookAddr").value=a;m.textContent=""}else m.textContent=tx("No address in this QR","इस QR में पता नहीं");break}}catch(e){}await new Promise(function(r){setTimeout(r,300)})}
 }catch(e){m.textContent=tx("Camera permission needed","कैमरा की अनुमति चाहिए");stop()}}
function build(){var sh=$("sheetBook");if(!sh||sh.__b84)return;var pn=sh.querySelector(".panel");if(!pn)return;sh.__b84=1;
 var tt=pn.querySelector(".ttl");if(tt)tt.textContent=tx("Address book","पता-पुस्तिका");
 var n=$("bookName"),a=$("bookAddr"),sv=pn.querySelector('.btn[onclick="saveContact()"]'),L=$("bookList");if(!n||!a||!sv||!L)return;
 var q=document.createElement("input");q.id="b84q";q.placeholder=tx("Search contacts","संपर्क खोजें");q.style.display="none";q.oninput=function(){renderBook()};
 var ab=document.createElement("button");ab.type="button";ab.className="b84add";ab.textContent="+ "+tx("Add contact","संपर्क जोड़ें");
 var F=document.createElement("div");F.id="b84f";
 var l1=document.createElement("div");l1.className="lb";l1.textContent=tx("Name","नाम");
 var l2=document.createElement("div");l2.className="lb";l2.textContent=tx("Address","पता");
 var v=document.createElement("video");v.id="b84v";v.setAttribute("playsinline","");v.muted=true;
 var msg=document.createElement("div");msg.id="b84m";
 var nt=document.createElement("div");nt.className="b84n";nt.textContent=tx("Contacts are saved only on this phone.","संपर्क सिर्फ़ इसी फ़ोन में सेव होते हैं।");
 pn.insertBefore(q,n.parentNode);pn.insertBefore(L,n.parentNode);pn.insertBefore(ab,n.parentNode);pn.insertBefore(F,n.parentNode);
 F.appendChild(l1);F.appendChild(n.parentNode);F.appendChild(l2);F.appendChild(v);F.appendChild(a.parentNode);F.appendChild(msg);F.appendChild(sv);F.after(nt);
 n.placeholder=tx("e.g. Ramesh","जैसे रमेश");a.placeholder="0x…";sv.textContent=tx("Save","सेव करें");
 var ai=document.createElement("span");ai.className="ai";ai.innerHTML='<button type="button" aria-label="Paste">'+PA+'</button><button type="button" aria-label="Scan">'+SC+'</button>';a.parentNode.appendChild(ai);
 var bt=ai.querySelectorAll("button");bt[0].onclick=async function(){try{var t=await navigator.clipboard.readText();var m=(t.match(/0x[0-9a-fA-F]{40}/)||[])[0];if(m){a.value=m;msg.textContent=""}else msg.textContent=tx("No address in the copied text","कॉपी किए हुए में पता नहीं")}catch(e){msg.textContent=tx("Allow paste, or type the address","चिपकाने की अनुमति दीजिए या पता लिखिए")}};
 bt[1].onclick=function(){scan()};
 ab.onclick=function(){F.classList.toggle("on");ab.style.display=F.classList.contains("on")?"none":"";if(F.classList.contains("on"))n.focus()};
}
window.renderBook=renderBook=function(){build();var L=$("bookList");if(!L)return;var c=[];try{c=contacts}catch(e){}
 var q=$("b84q");if(q)q.style.display=c.length>6?"":"none";var f=(q&&q.value||"").toLowerCase().trim();
 if(!c.length){L.innerHTML='<div class="b84e"><div class="ei">'+BK+'</div>'+tx("No contacts yet. Save the addresses you send to often.","अभी कोई संपर्क नहीं। जिन्हें बार-बार भेजते हैं, उनके पते यहाँ सेव कीजिए।")+'</div>';return}
 var h="";c.forEach(function(x,i){if(f&&x.n.toLowerCase().indexOf(f)<0&&x.a.toLowerCase().indexOf(f)<0)return;
  h+='<div class="b84c" data-i="'+i+'"><span class="av">'+esc((x.n||"?").trim().charAt(0).toUpperCase())+'</span><span class="nm"><b>'+esc(x.n)+'</b><small>'+x.a.slice(0,6)+'…'+x.a.slice(-6)+'</small></span><button type="button" class="sd" data-s="'+i+'">'+tx("Send","भेजें")+'</button><button type="button" class="dl" data-d="'+i+'" aria-label="Delete">✕</button></div>'});
 L.innerHTML=h||'<div class="b84e">'+tx("No match","कोई मेल नहीं")+'</div>';
 L.querySelectorAll(".b84c").forEach(function(r){r.onclick=function(e){if(e.target.closest("button"))return;var x=contacts[+r.getAttribute("data-i")];try{navigator.clipboard.writeText(x.a).then(function(){toast(tx("Address copied","पता कॉपी हुआ"))})}catch(_){}}});
 L.querySelectorAll(".sd").forEach(function(b){b.onclick=function(){useContact(+b.getAttribute("data-s"))}});
 L.querySelectorAll(".dl").forEach(function(b){b.onclick=function(){var x=contacts[+b.getAttribute("data-d")];if(confirm(tx("Delete "+x.n+"?",x.n+" को हटाएँ?")))delContact(+b.getAttribute("data-d"))}});
};
var _sv=saveContact;window.saveContact=saveContact=function(){var a=($("bookAddr").value||"").trim(),n=($("bookName").value||"").trim(),m=$("b84m");
 if(!n){m.textContent=tx("Enter a name","नाम लिखिए");return}
 if(!/^0x[0-9a-fA-F]{40}$/.test(a)){m.textContent=tx("This address is not valid. It starts with 0x and has 42 characters.","यह पता सही नहीं। यह 0x से शुरू होकर 42 अक्षरों का होता है।");return}
 try{if(contacts.some(function(c){return c.a.toLowerCase()===a.toLowerCase()})){m.textContent=tx("This address is already saved","यह पता पहले से सेव है");return}}catch(e){}
 m.textContent="";stop();_sv();$("bookName").value="";$("bookAddr").value="";var F=$("b84f");if(F){F.classList.remove("on");var ab=document.querySelector("#sheetBook .b84add");if(ab)ab.style.display=""}renderBook()};
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#sheetBook .bkb"))stop()},true);
}catch(e){try{console.error("Build84",e)}catch(_){}}})();

/* Build 85: History page (list of your transactions, filters, open in explorer, download CSV); explorer needs a wallet */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return"&#"+c.charCodeAt(0)+";"})}
var st=document.createElement("style");st.id="b85s";var P="#b85h ";
st.textContent='#b85h{position:fixed;inset:0;margin:0 auto;max-width:420px;z-index:350;background:var(--z1);color:var(--zt);display:none;flex-direction:column;font-family:Poppins,system-ui,sans-serif}#b85h.on{display:flex}'+
P+'.hd{display:flex;align-items:center;gap:12px;padding:16px 16px 8px;padding-top:calc(16px + env(safe-area-inset-top,0px))}'+P+'.hd button{width:40px;height:40px;border-radius:50%;border:0;background:var(--svt);color:var(--zt);font-size:20px;cursor:pointer}'+P+'.hd b{flex:1;text-align:center;font-size:18px;font-weight:600;margin-right:40px}'+
P+'.fl{display:flex;gap:8px;padding:8px 16px}'+P+'.fl button{border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:18px;padding:7px 14px;font-weight:600;font-size:13.5px;font-family:inherit;cursor:pointer}'+P+'.fl button.on{background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+
P+'.ls{flex:1;overflow:auto;padding:4px 16px 16px}'+
P+'.it{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px;margin-top:10px;cursor:pointer}'+
P+'.it .hic{width:42px;height:42px;border-radius:12px;background:var(--svt);display:flex;align-items:center;justify-content:center;flex-shrink:0}'+P+'.it .hic svg{width:20px;height:20px}'+
P+'.it .hic.o{color:var(--svi)}'+P+'.it .hic.i{color:var(--zgb,#00A86B)}'+
P+'.it b{display:block;font-size:15px;font-weight:600}'+P+'.it small{display:block;font-size:12.5px;color:var(--cvl);font-weight:500}'+
P+'.it .am{margin-left:auto;text-align:right;font-weight:600;font-size:15px;white-space:nowrap}'+P+'.it .am.i{color:var(--zgb,#00A86B)}'+P+'.it .am small{font-family:ui-monospace,Menlo,monospace;font-size:11.5px}'+
P+'.em{text-align:center;color:var(--cvl);font-size:14px;padding:40px 10px;font-weight:500;line-height:1.6}'+
P+'.ft{padding:12px 16px calc(16px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--svb)}'+
P+'.nt{font-size:12.5px;color:var(--cvl);text-align:center;margin-bottom:10px;line-height:1.5;font-weight:500}'+
P+'.dl{width:100%;border:1px solid var(--svb);background:transparent;color:var(--zt);border-radius:14px;padding:13px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}'+
'html body:has(#b85h.on) #hbBtn#hbBtn{display:none!important}';
document.head.appendChild(st);
var UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',DN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
var flt="all";
function when(t){try{var d=new Date(t);return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"})+", "+d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}catch(e){return""}}
function render(){var W=$("b85h");var L=W.querySelector(".ls");var a=[];try{a=(txs||[]).slice()}catch(e){}
 a.sort(function(x,y){return(y.time||0)-(x.time||0)});if(flt!=="all")a=a.filter(function(x){return flt==="out"?x.type==="out":x.type!=="out"});
 if(!a.length){L.innerHTML='<div class="em">'+tx("No transactions yet","अभी कोई लेन-देन नहीं")+'</div>';return}
 L.innerHTML=a.map(function(x){var o=x.type==="out";return'<div class="it" data-h="'+esc(x.hash||"")+'"><span class="hic '+(o?"o":"i")+'">'+(o?UP:DN)+'</span><span><b>'+(o?tx("Sent","भेजा"):tx("Received","आया"))+'</b><small>'+when(x.time)+'</small></span><span class="am '+(o?"":"i")+'">'+(o?"− ":"+ ")+esc(x.amt)+' '+esc(x.symbol)+(x.hash?'<small>'+esc(String(x.hash).slice(0,6))+'…'+esc(String(x.hash).slice(-4))+'</small>':'')+'</span></div>'}).join("");
 L.querySelectorAll(".it").forEach(function(r){r.onclick=function(){var h=r.getAttribute("data-h");if(!h)return;try{window.open(NETWORKS[currentNet].explorer+"/tx/"+h,"_blank","noopener")}catch(e){}}})}
function open(){var W=$("b85h");if(!W){W=document.createElement("div");W.id="b85h";
 W.innerHTML='<div class="hd"><button type="button" aria-label="Back">‹</button><b></b></div><div class="fl"></div><div class="ls"></div><div class="ft"><div class="nt"></div><button type="button" class="dl"></button></div>';
 document.body.appendChild(W);W.querySelector(".hd button").onclick=function(){W.classList.remove("on")};W.querySelector(".dl").onclick=function(){try{toolExport()}catch(e){}}}
 W.querySelector(".hd b").textContent=tx("History","इतिहास");
 W.querySelector(".fl").innerHTML=[["all",tx("All","सब")],["out",tx("Sent","भेजे")],["in",tx("Received","आए")]].map(function(f){return'<button type="button" data-f="'+f[0]+'" class="'+(f[0]===flt?"on":"")+'">'+f[1]+'</button>'}).join("");
 W.querySelectorAll(".fl button").forEach(function(b){b.onclick=function(){flt=b.getAttribute("data-f");W.querySelectorAll(".fl button").forEach(function(x){x.classList.toggle("on",x===b)});render()}});
 W.querySelector(".nt").textContent=tx("Shows transactions made with Tazvera on this phone. For the full history, open Block explorer.","इस फ़ोन पर Tazvera से हुए लेन-देन। पूरा इतिहास Block explorer पर।");
 W.querySelector(".dl").textContent=tx("Download CSV","CSV डाउनलोड करें");
 render();W.classList.add("on")}
window.TZHIST=open;
document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest('.b77t[data-g="0"][data-i="2"],button[onclick="SV.go(0,2)"],.b77t[data-g="0"][data-i="3"],button[onclick="SV.go(0,3)"]'):null;if(!t)return;
 var ex=/data-i="3"|SV\.go\(0,3\)/.test(t.outerHTML.slice(0,120));
 if(ex){var a="";try{a=addr||""}catch(_){}if(a)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{toast(tx("Create or open a wallet first","पहले वॉलेट बनाइए या खोलिए"))}catch(_){}return}
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open()},true);
}catch(e){try{console.error("Build85",e)}catch(_){}}})();

/* Build 86: focus Services: Profit/Loss and Bill split in Wallet tools; calculators and RWA hidden (kept in code) */
(function(){try{var st=document.createElement("style");st.id="b86s";var P='html body #app #sheetSvc#sheetSvc ';
st.textContent=[0,1,2,3,4,5].map(function(i){return P+'button[onclick="SV.go(1,'+i+')"]'}).concat([0,1,2,3,4].map(function(i){return P+'button[onclick="SV.go(2,'+i+')"]'})).join(",")+'{display:none!important}';
document.head.appendChild(st);}catch(e){}})();

(function(){try{setInterval(function(){var b=document.getElementById("svcBody");if(!b)return;b.querySelectorAll(".svg-h").forEach(function(h){var t=(h.textContent||"").trim();if(/^(Calculators|कैलकुलेटर|RWA)$/i.test(t)){h.style.display="none";var n=h.nextElementSibling;if(n&&n.classList.contains("svg-g"))n.style.display="none"}})},500)}catch(e){}})();

/* Build 87: Bill split + Profit/Loss redesigned; Crypto quiz and price-source check hidden from users */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function rs(x){if(!isFinite(x))return"—";var a=Math.abs(x);return(x<0?"−":"")+"₹"+(a>=1?a.toLocaleString("en-IN",{maximumFractionDigits:2}):a>0?String(Number(a.toPrecision(3))):"0")}
var P="html body #xtSheet#xtSheet ";
var st=document.createElement("style");st.id="b87s";
st.textContent=
P+'.b87 .lb{font-size:14px;font-weight:600;color:var(--cvl);margin:16px 2px 8px}'+
P+'.b87 .in{display:flex;align-items:center;border:1px solid var(--svb);border-radius:14px;padding:4px 14px;background:var(--z1)}'+P+'.b87 .in:focus-within{border-color:var(--zgb,#00A86B)}'+
P+'.b87 .in span{font-size:20px;font-weight:600;color:var(--cvl)}'+P+'.b87 .in input{flex:1;border:0!important;background:transparent!important;font-size:20px;font-weight:600;color:var(--zt);padding:10px 8px;outline:0;box-shadow:none!important;font-family:inherit;min-width:0}'+
P+'.b87 .stp{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--svb);border-radius:14px;padding:6px}'+P+'.b87 .stp button{width:46px;height:46px;border-radius:12px;border:0;background:var(--svt);color:var(--zt);font-size:24px;font-weight:600;cursor:pointer}'+P+'.b87 .stp b{font-size:22px;font-weight:600;color:var(--zt)}'+
P+'.b87 .ch{display:flex;gap:8px;flex-wrap:wrap}'+P+'.b87 .ch button{border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:18px;padding:8px 16px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer}'+P+'.b87 .ch button.on{background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+
P+'.b87 .ch img,'+P+'.b87 .ch .lt{width:22px;height:22px;border-radius:50%;vertical-align:middle;margin:-3px 6px 0 -6px;object-fit:cover;display:inline-flex;align-items:center;justify-content:center;background:var(--svt);font-size:10px}'+
P+'.b87 .res{background:var(--svt);border-radius:18px;padding:18px;margin-top:18px;text-align:center}'+P+'.b87 .res small{display:block;color:var(--cvl);font-weight:500;font-size:13.5px}'+P+'.b87 .res b{display:block;font-size:32px;font-weight:600;color:var(--zt);margin-top:4px}'+P+'.b87 .res em{display:block;font-style:normal;color:var(--cvl);font-size:13px;margin-top:4px}'+
P+'.b87 .go{width:100%;margin-top:14px;border:0;border-radius:14px;padding:15px;background:var(--zb);color:var(--zbt);font-size:16px;font-weight:600;font-family:inherit;cursor:pointer}'+
P+'.b87 .sum{display:grid;grid-template-columns:1fr 1fr;gap:10px;background:var(--svt);border-radius:18px;padding:16px;margin-top:6px}'+P+'.b87 .sum small{display:block;color:var(--cvl);font-weight:500;font-size:12.5px}'+P+'.b87 .sum b{font-size:17px;font-weight:600;color:var(--zt)}'+
P+'.b87 .sum .pl{grid-column:1/-1;border-top:1px solid var(--svb);padding-top:10px}'+P+'.b87 .sum .pl b{font-size:22px}'+
P+'.b87 .up{color:var(--zgb,#16A34A)!important}'+P+'.b87 .dn{color:#DC2626!important}'+
P+'.b87 .row2{display:flex;gap:10px}'+P+'.b87 .row2>div{flex:1;min-width:0}'+
P+'.b87 .it{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px;margin-top:10px}'+
P+'.b87 .it .av{width:40px;height:40px;border-radius:12px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;overflow:hidden}'+P+'.b87 .it .av img{width:100%;height:100%;object-fit:cover}'+
P+'.b87 .it b{display:block;font-size:15px;font-weight:600;color:var(--zt)}'+P+'.b87 .it small{display:block;font-size:12.5px;color:var(--cvl);font-weight:500}'+
P+'.b87 .it .v{margin-left:auto;text-align:right}'+P+'.b87 .it .x{border:0;background:var(--svt);color:var(--zt);width:32px;height:32px;border-radius:50%;cursor:pointer;margin-left:6px;flex-shrink:0}'+
P+'.b87 .nt{background:var(--svt);border-radius:14px;padding:12px 14px;margin-top:16px;font-size:13px;line-height:1.55;color:var(--zt);font-weight:500}'+
P+'.b87 .em{text-align:center;color:var(--cvl);font-size:13.5px;padding:12px 0}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4000);
function logo(s){var i=document.querySelector('#list .row .ic img[alt="'+s+'"]');return i?'<img src="'+i.getAttribute("src")+'" alt="">':'<span class="lt">'+s[0]+'</span>'}
function pr(s){try{return T[s]&&T[s].p?T[s].p:null}catch(e){return null}}
/* ---- Bill split ---- */
var bsP=2,bsT=0;
function bs(){var B=$("xtB");$("xtT").textContent=tx("Bill split","बिल बाँटें");
 B.innerHTML='<div class="b87"><div class="lb">'+tx("Total bill","कुल बिल")+'</div><div class="in"><span>₹</span><input id="b87t" type="number" inputmode="decimal" placeholder="0"></div>'+
 '<div class="lb">'+tx("People","कितने लोग")+'</div><div class="stp"><button type="button" data-p="-1">−</button><b id="b87p">'+bsP+'</b><button type="button" data-p="1">+</button></div>'+
 '<div class="lb">'+tx("Tip","टिप")+'</div><div class="ch">'+[0,5,10,15].map(function(t){return'<button type="button" data-t="'+t+'" class="'+(t===bsT?"on":"")+'">'+t+'%</button>'}).join("")+'</div>'+
 '<div class="res"><small>'+tx("Each person pays","हर व्यक्ति देगा")+'</small><b id="b87r">₹0</b><em id="b87e"></em></div>'+
 '<button type="button" class="go">'+tx("Share","भेजें")+'</button></div>';
 var t=$("b87t");function calc(){var v=parseFloat(t.value)||0,tot=v*(1+bsT/100),e=bsP?tot/bsP:0;$("b87p").textContent=bsP;$("b87r").textContent=rs(Math.round(e*100)/100);$("b87e").textContent=v>0?tx("Total with tip ","टिप के साथ कुल ")+rs(Math.round(tot*100)/100):"";return{v:v,tot:tot,e:e}}
 t.oninput=calc;B.querySelectorAll(".stp button").forEach(function(b){b.onclick=function(){bsP=Math.max(1,Math.min(50,bsP+ +b.getAttribute("data-p")));calc()}});
 B.querySelectorAll(".ch button").forEach(function(b){b.onclick=function(){bsT=+b.getAttribute("data-t");B.querySelectorAll(".ch button").forEach(function(x){x.classList.toggle("on",x===b)});calc()}});
 B.querySelector(".go").onclick=function(){var c=calc();if(!(c.v>0)){try{toast(tx("Enter the bill amount","बिल की रकम लिखिए"))}catch(e){}return}var a="";try{a=addr||""}catch(e){}
  var m=tx("Bill "+rs(c.tot)+" split between "+bsP+" = "+rs(Math.round(c.e*100)/100)+" each.","बिल "+rs(c.tot)+", "+bsP+" लोग = हर एक "+rs(Math.round(c.e*100)/100)+"।")+(a?"\n"+tx("Pay me on Tazvera: ","मुझे Tazvera पर भेजिए: ")+a:"");
  if(navigator.share){navigator.share({text:m}).catch(function(){})}else window.open("https://wa.me/?text="+encodeURIComponent(m),"_blank")};
 calc()}
/* ---- Profit / Loss ---- */
var plS="SHM";
function pl(){var B=$("xtB");$("xtT").textContent=tx("Profit / Loss","लाभ / हानि");var L=[];try{L=ls.get("xt_pl",[])}catch(e){}
 var inv=0,cur=0,ok=true;L.forEach(function(x){inv+=x.q*x.b;var p=pr(x.s);if(p&&p.inr>0)cur+=x.q*p.inr;else ok=false});var d=cur-inv,pc=inv>0?d/inv*100:0;
 var h='<div class="b87">'+(L.length?'<div class="sum"><div><small>'+tx("Invested","लगाया")+'</small><b>'+rs(inv)+'</b></div><div><small>'+tx("Value now","अभी की क़ीमत")+'</small><b>'+(ok?rs(cur):"—")+'</b></div><div class="pl"><small>'+tx("Profit / Loss","लाभ / हानि")+'</small><b class="'+(d>=0?"up":"dn")+'">'+(ok?(d>=0?"+":"")+rs(d)+" ("+(d>=0?"+":"")+pc.toFixed(1)+"%)":"—")+'</b></div></div>':'')+
 '<div class="lb">'+tx("Add a purchase","ख़रीद जोड़ें")+'</div><div class="ch">'+["SHM","BTC","ETH","USDT","BNB"].map(function(c){return'<button type="button" data-c="'+c+'" class="'+(c===plS?"on":"")+'">'+logo(c)+c+'</button>'}).join("")+'</div>'+
 '<div class="row2" style="margin-top:12px"><div><div class="lb" style="margin-top:0">'+tx("Quantity","कितने सिक्के")+'</div><div class="in"><input id="b87q" type="number" inputmode="decimal" placeholder="0"></div></div><div><div class="lb" style="margin-top:0">'+tx("Buy price (per coin)","ख़रीद भाव (एक का)")+'</div><div class="in"><span>₹</span><input id="b87b" type="number" inputmode="decimal" placeholder="0"></div></div></div>'+
 '<button type="button" class="go">'+tx("Add","जोड़ें")+'</button><div class="lb" style="margin-top:22px">'+tx("Your purchases","आपकी ख़रीद")+'</div>'+
 (L.length?L.map(function(x,i){var p=pr(x.s),cv=p&&p.inr>0?x.q*p.inr:null,dd=cv!=null?cv-x.q*x.b:null;return'<div class="it"><span class="av">'+logo(x.s)+'</span><span><b>'+x.s+'</b><small>'+x.q+' × '+rs(x.b)+'</small></span><span class="v"><b>'+(cv!=null?rs(cv):"—")+'</b><small class="'+(dd==null?"":dd>=0?"up":"dn")+'">'+(dd==null?tx("price n/a","भाव नहीं"):(dd>=0?"+":"")+rs(dd))+'</small></span><button type="button" class="x" data-i="'+i+'" aria-label="Delete">✕</button></div>'}).join(""):'<div class="em">'+tx("No purchases yet","अभी कोई ख़रीद नहीं")+'</div>')+
 '<div class="nt">ⓘ '+tx("Uses the latest market price. For your own tracking only, not advice.","बाज़ार के ताज़ा भाव से हिसाब। सिर्फ़ आपकी जानकारी के लिए, सलाह नहीं।")+'</div></div>';
 B.innerHTML=h;
 B.querySelectorAll(".ch button").forEach(function(b){b.onclick=function(){plS=b.getAttribute("data-c");B.querySelectorAll(".ch button").forEach(function(x){x.classList.toggle("on",x===b)})}});
 B.querySelector(".go").onclick=function(){var q=parseFloat($("b87q").value),b=parseFloat($("b87b").value);if(!(q>0)||!(b>0)){try{toast(tx("Enter quantity and buy price","मात्रा और ख़रीद भाव लिखिए"))}catch(e){}return}XT.ad("pl",{s:plS,q:q,b:b})};
 B.querySelectorAll(".it .x").forEach(function(b){b.onclick=function(){XT.dl("pl",+b.getAttribute("data-i"))}})}
if(window.XT&&XT.go&&!XT.__b87){XT.__b87=1;var og=XT.go;XT.go=function(n){og.apply(this,arguments);try{if(n==="bs")bs();else if(n==="pl")pl()}catch(e){}}}
/* hide Crypto quiz in search, and the price-source checker in Settings */
setInterval(function(){var b=document.getElementById("svcBody");if(b)b.querySelectorAll(".svg-g button").forEach(function(x){var l=x.querySelector(".svl");if(l&&/^(Crypto quiz|क्रिप्टो क्विज़|Daily streak|रोज़ की गिनती)$/i.test(l.textContent.trim()))x.style.display="none"});
 var sb=document.getElementById("sbody");if(sb){sb.querySelectorAll("button,.sr,div").forEach(function(x){if(x.children.length<3&&/Check SHM price sources|SHM भाव के स्रोत/i.test(x.textContent||"")&&x.id!=="sbody"){x.style.display="none"}});var pc=document.getElementById("pcout");if(pc)pc.style.display="none"}},700);
}catch(e){try{console.error("Build87",e)}catch(_){}}})();

/* Build 88: Safety pages: Security checkup (score + fix buttons), Security tips cards, Notifications list */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return"&#"+c.charCodeAt(0)+";"})}
var st=document.createElement("style");st.id="b88s";var O="#b88 ",X="html body #xtSheet#xtSheet ";
st.textContent='#b88{position:fixed;inset:0;margin:0 auto;max-width:420px;z-index:350;background:var(--z1);color:var(--zt);display:none;flex-direction:column;font-family:Poppins,system-ui,sans-serif}#b88.on{display:flex}'+
O+'.hd{display:flex;align-items:center;gap:12px;padding:16px;padding-top:calc(16px + env(safe-area-inset-top,0px))}'+O+'.hd button{width:40px;height:40px;border-radius:50%;border:0;background:var(--svt);color:var(--zt);font-size:20px;cursor:pointer}'+O+'.hd b{flex:1;text-align:center;font-size:18px;font-weight:600;margin-right:40px}'+
O+'.bd{flex:1;overflow:auto;padding:0 16px calc(20px + env(safe-area-inset-bottom,0px))}'+
O+'.sc{background:var(--svt);border-radius:20px;padding:18px;display:flex;align-items:center;gap:16px}'+O+'.ring{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0}'+
O+'.sc b{display:block;font-size:17px;font-weight:600}'+O+'.sc small{display:block;font-size:13px;color:var(--cvl);font-weight:500;margin-top:2px}'+
O+'.it{display:flex;align-items:center;gap:12px;border:1px solid var(--svb);border-radius:16px;padding:12px;margin-top:10px}'+
O+'.mk{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;color:#fff}'+O+'.mk.ok{background:var(--zgb,#00A86B)}'+O+'.mk.no{background:#F59E0B}'+O+'.mk.op{background:var(--svt);color:var(--cvl)}'+
O+'.it b{display:block;font-size:15px;font-weight:600}'+O+'.it small{display:block;font-size:12.5px;color:var(--cvl);font-weight:500}'+
O+'.it .fx{margin-left:auto;border:0;background:var(--zb);color:var(--zbt);border-radius:12px;padding:8px 12px;font-weight:600;font-size:13px;font-family:inherit;cursor:pointer;white-space:nowrap}'+
O+'.nt{background:var(--svt);border-radius:14px;padding:12px 14px;margin-top:16px;font-size:13px;line-height:1.55;font-weight:500}'+
X+'.b88t .tp{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--svb);border-radius:16px;padding:14px;margin-top:10px;text-align:left}'+X+'.b88t .ti{width:40px;height:40px;border-radius:12px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;flex-shrink:0}'+X+'.b88t .ti svg{width:20px;height:20px}'+X+'.b88t .ti svg *{stroke:currentColor!important}'+
X+'.b88t b{display:block;font-size:15px;font-weight:600;color:var(--zt)}'+X+'.b88t small{display:block;font-size:13px;color:var(--cvl);font-weight:500;line-height:1.5;margin-top:2px}'+
X+'.b88n .it{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--svb);border-radius:16px;padding:12px;margin-top:10px;text-align:left}'+X+'.b88n .ti{width:38px;height:38px;border-radius:12px;background:var(--svt);color:var(--svi);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:17px}'+
X+'.b88n b{display:block;font-size:14.5px;font-weight:600;color:var(--zt);line-height:1.45}'+X+'.b88n small{display:block;font-size:12px;color:var(--cvl);font-weight:500;margin-top:2px}'+
X+'.b88n .em{text-align:center;color:var(--cvl);font-size:14px;padding:30px 10px;font-weight:500}'+X+'.b88n .cl{width:100%;margin-top:16px;border:1px solid var(--svb);background:transparent;color:var(--zt);border-radius:14px;padding:13px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}'+
'html body:has(#b88.on) #hbBtn#hbBtn{display:none!important}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4100);
function g(k,d){try{return ls.get(k,d)}catch(e){return d}}
function state(){var has=false,ext=false;try{has=!!(window.CPW&&CPW.has())}catch(e){}try{ext=!has&&!!addr}catch(e){}
 var bio=false;try{bio=!!localStorage.getItem("cp3_bio_ks")}catch(e){}
 var ps=true;try{ps=localStorage.getItem("tz_pinsend")!=="0"}catch(e){}
 var am=+g("xt_am",2)||2;
 return[{k:"w",ok:has||ext,l:tx("Wallet set up","वॉलेट बना हुआ"),d:has?tx("Tazvera wallet on this phone","इस फ़ोन में Tazvera वॉलेट"):ext?tx("Connected through MetaMask","MetaMask से जुड़ा"):tx("No wallet yet","अभी वॉलेट नहीं"),fx:tx("Set up","बनाइए"),f:function(){go();try{connectWallet()}catch(e){}}},
 {k:"b",ok:!has||!!g("backup_ok",0),l:tx("12 words written on paper","12 शब्द काग़ज़ पर लिखे"),d:!has?tx("Not needed for MetaMask","MetaMask के लिए ज़रूरी नहीं"):tx("The only way to recover your wallet","वॉलेट वापस लाने का एक ही तरीक़ा"),fx:tx("Do it","अभी करें"),f:function(){go();try{SC.mark()}catch(e){}}},
 {k:"l",ok:!!g("xt_pin",""),l:tx("App lock (PIN on open)","ऐप ताला (खोलते समय PIN)"),d:tx("Stops others from opening Tazvera","दूसरे लोग Tazvera न खोल पाएँ"),fx:tx("Turn on","चालू करें"),f:function(){go();try{openSettings();SB.g("sec")}catch(e){}}},
 {k:"p",ok:ps,l:tx("PIN for every send","हर भेजने पर PIN"),d:tx("Like a UPI PIN","UPI PIN की तरह"),fx:tx("Turn on","चालू करें"),f:function(){try{localStorage.setItem("tz_pinsend","1")}catch(e){}draw()}},
 {k:"a",ok:am<=5,l:tx("Auto-lock in 5 minutes or less","5 मिनट या कम में अपने-आप ताला"),d:tx("Now: ","अभी: ")+am+tx(" min"," मिनट"),fx:tx("Change","बदलें"),f:function(){go();try{openSettings();SB.g("sec")}catch(e){}}},
 {k:"f",opt:true,ok:bio,l:tx("Fingerprint unlock","अंगूठे से खोलना"),d:tx("Optional, faster and safe","वैकल्पिक, तेज़ और सुरक्षित"),fx:tx("Set up","लगाएँ"),f:function(){go();try{openSettings();SB.g("sec")}catch(e){}}}]}
function go(){var w=$("b88");if(w)w.classList.remove("on")}
function draw(){var w=$("b88");if(!w){w=document.createElement("div");w.id="b88";w.innerHTML='<div class="hd"><button type="button" aria-label="Back">‹</button><b></b></div><div class="bd"></div>';document.body.appendChild(w);w.querySelector(".hd button").onclick=go}
 w.querySelector(".hd b").textContent=tx("Security checkup","सुरक्षा जाँच");
 var S=state(),req=S.filter(function(x){return!x.opt}),done=req.filter(function(x){return x.ok}).length,all=req.length,full=done===all;
 var col=full?"var(--zgb,#00A86B)":done>=all-1?"#F59E0B":"#DC2626";
 var h='<div class="sc"><span class="ring" style="border:5px solid '+col+';color:'+col+'">'+done+'/'+all+'</span><span><b>'+(full?tx("You are well protected","आप अच्छे से सुरक्षित हैं"):tx(done+" of "+all+" done",all+" में से "+done+" पूरे"))+'</b><small>'+(full?tx("Keep your 12 words safe on paper.","अपने 12 शब्द काग़ज़ पर सुरक्षित रखिए।"):tx("Finish the steps below to protect your wallet.","नीचे के क़दम पूरे करके वॉलेट को सुरक्षित कीजिए।"))+'</small></span></div>';
 S.forEach(function(x,i){h+='<div class="it"><span class="mk '+(x.ok?"ok":x.opt?"op":"no")+'">'+(x.ok?"✓":x.opt?"·":"!")+'</span><span><b>'+x.l+'</b><small>'+x.d+'</small></span>'+(x.ok?'':'<button type="button" class="fx" data-i="'+i+'">'+x.fx+'</button>')+'</div>'});
 h+='<div class="nt">ⓘ '+tx("Tazvera never asks for your 12 words or PIN. Anyone who asks is a scammer.","Tazvera कभी आपके 12 शब्द या PIN नहीं माँगता। जो माँगे, वह धोखेबाज़ है।")+'</div>';
 var B=w.querySelector(".bd");B.innerHTML=h;B.querySelectorAll(".fx").forEach(function(b){b.onclick=function(){S[+b.getAttribute("data-i")].f()}});w.classList.add("on")}
if(window.SC){SC.draw=function(){try{closeAll()}catch(e){}draw()};SC.open=function(){try{closeAll()}catch(e){}draw()}}
/* Security tips + Notifications inside the tools sheet */
var IC={k:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',c:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M4 4l16 16"/>',u:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/><path d="M18 4l3 3M21 4l-3 3"/>',a:'<path d="M4 12h16M14 6l6 6-6 6"/>',s:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/>',l:'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',p:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'};
function sv(k){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+IC[k]+'</svg>'}
function tips(){$("xtT").textContent=tx("Security tips","सुरक्षा सुझाव");var T2=[
 ["k",tx("Never share your 12 words","12 शब्द कभी किसी को मत बताइए"),tx("Not to friends, not to 'support'. Whoever has them owns your coins.","न दोस्तों को, न 'सपोर्ट' को। जिसके पास ये हैं, सिक्के उसी के।")],
 ["c",tx("No screenshots or photos of your words","शब्दों का स्क्रीनशॉट या फ़ोटो नहीं"),tx("Write them on paper and keep it safe at home.","काग़ज़ पर लिखकर घर में सुरक्षित रखिए।")],
 ["u",tx("Beware of fake support","नक़ली सपोर्ट से सावधान"),tx("Tazvera never messages you first or asks for your PIN.","Tazvera कभी पहले संदेश नहीं भेजता, न PIN माँगता है।")],
 ["a",tx("Check the address before sending","भेजने से पहले पता जाँचिए"),tx("Match the first and last 4 characters. Sent coins cannot come back.","पहले और आख़िरी 4 अक्षर मिलाइए। भेजे सिक्के वापस नहीं आते।")],
 ["s",tx("Test with a small amount first","पहले छोटी रकम से जाँचिए"),tx("For a new address, send a little and confirm it arrived.","नए पते पर पहले थोड़ा भेजकर देखिए कि पहुँचा।")],
 ["l",tx("Avoid unknown links and free airdrops","अनजान लिंक और 'मुफ़्त' airdrop से बचिए"),tx("If it promises guaranteed profit, it is a scam.","जो पक्के मुनाफ़े का वादा करे, वह धोखा है।")],
 ["p",tx("Lock and update your phone","फ़ोन पर ताला और अपडेट"),tx("Turn on app lock and keep your phone software updated.","ऐप ताला चालू रखिए और फ़ोन अपडेट रखिए।")]];
 $("xtB").innerHTML='<div class="b88t">'+T2.map(function(x){return'<div class="tp"><span class="ti">'+sv(x[0])+'</span><span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></div>'}).join("")+'</div>'}
function nots(){$("xtT").textContent=tx("Notifications","सूचनाएँ");var L=g("xt_nt",[]);
 var h='<div class="b88n">'+(L.length?L.slice().reverse().map(function(n){var t="";try{t=new Date(n.t).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}catch(e){}return'<div class="it"><span class="ti">🔔</span><span><b>'+esc(n.m)+'</b><small>'+t+'</small></span></div>'}).join("")+'<button type="button" class="cl">'+tx("Clear all","सब मिटाएँ")+'</button>':'<div class="em">'+tx("No alerts yet. Price alarms will show here.","अभी कोई सूचना नहीं। कीमत अलार्म यहाँ दिखेंगे।")+'</div>')+'</div>';
 $("xtB").innerHTML=h;var c=$("xtB").querySelector(".cl");if(c)c.onclick=function(){if(confirm(tx("Clear all notifications?","सारी सूचनाएँ मिटाएँ?")))XT.cl("nt")}}
if(window.XT&&XT.go&&!XT.__b88){XT.__b88=1;var og=XT.go;XT.go=function(n){og.apply(this,arguments);try{if(n==="sec")tips();else if(n==="nt")nots()}catch(e){}}}
}catch(e){try{console.error("Build88",e)}catch(_){}}})();

/* Build 89: Help group: clean cards, help contacts, feedback by Email/Telegram/Discord/X, About TZT copy + explorer */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
var P="html body #app #sheetTools#sheetTools ";
var st=document.createElement("style");st.id="b89s";
st.textContent=
P+'details.hq{border:1px solid var(--svb)!important;border-radius:16px!important;padding:0!important;margin-top:10px!important;background:var(--z1)!important;text-align:left;overflow:hidden}'+
P+'details.hq summary{list-style:none;cursor:pointer;padding:14px 44px 14px 14px;font-weight:600;font-size:15px;color:var(--zt);position:relative}'+P+'details.hq summary::-webkit-details-marker{display:none}'+
P+'details.hq summary::after{content:"+";position:absolute;right:14px;top:10px;font-size:22px;color:var(--svi)}'+P+'details.hq[open] summary::after{content:"−"}'+
P+'details.hq p{margin:0!important;padding:0 14px 14px!important;color:var(--cvl)!important;font-size:14px!important;line-height:1.6!important;font-weight:500}'+
P+'#calcBox .xt-o{border:1px solid var(--svb)!important;border-radius:16px!important;background:var(--z1)!important;padding:14px!important;margin-top:10px!important;box-shadow:none!important}'+
P+'#calcBox .xt-o b{color:var(--zt)!important;font-weight:600!important}'+P+'#calcBox .xt-o div{color:var(--cvl)!important;font-weight:500}'+
P+'.b89h{margin-top:18px;border-top:1px solid var(--svb);padding-top:14px;text-align:left}'+P+'.b89h .lb{font-size:13.5px;font-weight:600;color:var(--cvl);margin-bottom:10px}'+
P+'.b89g{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+P+'.b89g a,'+P+'.b89g button{display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:14px;padding:12px 8px;font-weight:600;font-size:14px;font-family:inherit;text-decoration:none;cursor:pointer}'+
P+'.b89g .pri{grid-column:1/-1;background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+
P+'.b89g svg{width:18px;height:18px;flex-shrink:0}'+
P+'#fbT{border:1px solid var(--svb)!important;border-radius:16px!important;background:var(--z1)!important;font-family:inherit}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4200);
var I={m:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>',
t:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/></svg>',
d:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7.5C6.2 8 5 9 5 9c-1.2 2.2-1.9 4.6-1.8 7.1 1.4 1.3 3 2 4.6 2.4l1-1.8M16 7.5c1.8.5 3 1.5 3 1.5 1.2 2.2 1.9 4.6 1.8 7.1-1.4 1.3-3 2-4.6 2.4l-1-1.8M8.5 8.2a12 12 0 0 1 7 0"/><circle cx="9.5" cy="12.8" r="1"/><circle cx="14.5" cy="12.8" r="1"/></svg>',
x:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" transform="scale(.75) translate(4 4)"/></svg>',
b:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/></svg>',
c:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
e:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>'};
function box(){return $("calcBox")}
function contacts(){return'<a href="mailto:contact@tazvera.com">'+I.m+'Email</a><a href="https://t.me/TazveraApp" target="_blank" rel="noopener">'+I.t+'Telegram</a><a href="https://discord.gg/s2tjFdaCVN" target="_blank" rel="noopener">'+I.d+'Discord</a><a href="https://x.com/TazveraApp" target="_blank" rel="noopener">'+I.x+'X</a>'}
if(window.HP){var _h=HP.help;HP.help=function(){_h.apply(this,arguments);var b=box();if(!b)return;var d=document.createElement("div");d.className="b89h";
 d.innerHTML='<div class="lb">'+tx("Still need help?","और मदद चाहिए?")+'</div><div class="b89g"><button type="button" class="pri">'+I.b+tx("Ask the AI helper","AI सहायक से पूछिए")+'</button>'+contacts()+'</div>';b.appendChild(d);
 d.querySelector(".pri").onclick=function(){try{closeAll()}catch(e){}setTimeout(function(){var hb=$("hbBtn");if(hb)hb.click()},200)}};
 var _a=HP.about;HP.about=function(){_a.apply(this,arguments);var b=box();if(!b)return;var CPa="0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0";
  b.querySelectorAll(".xt-o").forEach(function(r){var sp=r.querySelector("span");if(sp&&/First minted|पहली बार/i.test(sp.textContent))sp.textContent=tx("Created so far","अब तक बने")});
  b.querySelectorAll(".xt-o").forEach(function(r){var sp=r.querySelector("span"),bb=r.querySelector("b");if(sp&&bb&&/Source code|सोर्स कोड/i.test(sp.textContent))bb.textContent=tx("Verified ✓","Verified ✓")});
  var d=document.createElement("div");d.className="b89h";d.innerHTML='<div class="lb" style="font-weight:500">ⓘ '+tx("The contract is verified on the Shardeum Explorer. TZT is a test token with no value.","कॉन्ट्रैक्ट Shardeum Explorer पर verified है। TZT टेस्ट टोकन है, इसकी कोई क़ीमत नहीं।")+'</div>';b.appendChild(d)}}
if(window.FB){var _f=FB.open;FB.open=function(){_f.apply(this,arguments);var b=box();if(!b)return;var old=b.querySelector('.btn[onclick="FB.send()"]');if(!old)return;
 var d=document.createElement("div");d.className="b89h";d.style.borderTop="0";d.style.paddingTop="0";
 d.innerHTML='<div class="lb">'+tx("Send it by","किससे भेजें")+'</div><div class="b89g"><button type="button" data-w="m" class="pri">'+I.m+tx("Email us","ईमेल भेजें")+'</button><button type="button" data-w="t">'+I.t+'Telegram</button><button type="button" data-w="d">'+I.d+'Discord</button><button type="button" data-w="x" style="grid-column:1/-1">'+I.x+'X</button></div>';
 old.replaceWith(d);
 d.querySelectorAll("button").forEach(function(btn){btn.onclick=function(){var t=(($("fbT")||{}).value||"").trim();if(!t){try{toast(tx("Write something first","पहले कुछ लिखिए"))}catch(e){}return}
  var r=(window.__fbMeta?window.__fbMeta():"")+t+"\n\n— Tazvera · "+(function(){try{return NETWORKS[currentNet].name}catch(e){return""}})()+" · "+(en()?"en":"hi");var w=btn.getAttribute("data-w");
  if(w==="m"){location.href="mailto:contact@tazvera.com?subject="+encodeURIComponent("Tazvera feedback")+"&body="+encodeURIComponent(r);return}
  try{navigator.clipboard.writeText(r)}catch(e){}try{toast(tx("Copied. Paste it in your message to us.","कॉपी हो गया। हमें संदेश में चिपकाइए।"),4500)}catch(e){}
  window.open(w==="t"?"https://t.me/TazveraApp":w==="d"?"https://discord.gg/s2tjFdaCVN":"https://x.com/TazveraApp","_blank","noopener")}})}}
}catch(e){try{console.error("Build89",e)}catch(_){}}})();

/* Build 90: Help (search, topics, groups), Feedback (rating + type), About TZT (header + stats), Privacy/Terms (summary) */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
var P="html body #app #sheetTools#sheetTools ";
var st=document.createElement("style");st.id="b90s";
st.textContent=
P+'.b90hero{background:var(--zc,#16335F);color:#fff;border-radius:20px;padding:16px;text-align:left}'+P+'.b90hero b{display:block;font-size:18px;font-weight:600}'+P+'.b90hero small{color:#C9D5E8;font-size:13px;font-weight:500}'+
P+'.b90hero input{width:100%;margin-top:12px;border:0;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;background:#fff;color:#0B1D3A;box-sizing:border-box}'+
P+'.b90ch{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}'+P+'.b90ch button{border:0;background:var(--svt);color:var(--svi);border-radius:16px;padding:7px 14px;font-weight:600;font-size:13.5px;font-family:inherit;cursor:pointer}'+P+'.b90ch button.on{background:var(--zb);color:var(--zbt)}'+
P+'.b90gh{font-size:14px;font-weight:600;color:var(--cvl);margin:18px 2px 2px;text-align:left}'+
P+'.b90em{text-align:center;color:var(--cvl);font-size:14px;padding:16px;font-weight:500}'+
P+'.b90rt{display:flex;justify-content:space-between;gap:8px;margin:6px 0 4px}'+P+'.b90rt button{flex:1;height:56px;border-radius:16px;border:1px solid var(--svb);background:var(--z1);font-size:26px;cursor:pointer}'+P+'.b90rt button.on{background:var(--zb);border-color:var(--zb)}'+
P+'.b90l{font-size:14px;font-weight:600;color:var(--cvl);margin:14px 2px 8px;text-align:left}'+
P+'.b90tk{text-align:center;padding:6px 0 4px}'+P+'.b90tk .lg{width:84px;height:84px;border-radius:22px;background:#000;margin:0 auto;overflow:hidden}'+P+'.b90tk .lg img{width:100%;height:100%;display:block}'+
P+'.b90tk b{display:block;font-size:19px;font-weight:600;color:var(--zt);margin-top:10px}'+P+'.b90tk small{display:inline-flex;align-items:center;gap:6px;background:var(--svt);color:var(--svi);border-radius:14px;padding:4px 12px;font-size:13px;font-weight:600;margin-top:6px}'+P+'.b90tk small i{width:7px;height:7px;border-radius:50%;background:#22C55E}'+
P+'.b90st{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}'+P+'.b90st div{background:var(--svt);border-radius:16px;padding:12px;text-align:left}'+P+'.b90st small{display:block;font-size:12.5px;color:var(--cvl);font-weight:500}'+P+'.b90st b{font-size:17px;font-weight:600;color:var(--zt)}'+
P+'.b90ca{border:1px solid var(--svb);border-radius:16px;padding:14px;margin-top:12px;text-align:left}'+P+'.b90ca small{font-size:12.5px;color:var(--cvl);font-weight:600}'+P+'.b90ca code{display:block;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:var(--zt);word-break:break-all;margin:6px 0 12px}'+
P+'.b90ca .r{display:flex;gap:8px}'+P+'.b90ca .r a,'+P+'.b90ca .r button{flex:1;border:1px solid var(--svb);background:var(--z1);color:var(--zt);border-radius:12px;padding:11px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none}'+P+'.b90ca .r button{background:var(--zb);color:var(--zbt);border-color:var(--zb)}'+P+'.b90ca .r a{color:var(--zt)!important}'+
P+'.b90wn{background:#FFF7E6;color:#7A4B00;border-radius:14px;padding:12px 14px;margin-top:12px;font-size:13px;line-height:1.5;font-weight:500;text-align:left}'+
'html[data-theme=dark] '+P+'.b90wn{background:#2A2210;color:#F5C76B}'+
P+'.b90sum{background:var(--svt);border-radius:18px;padding:14px;text-align:left;margin-bottom:6px}'+P+'.b90sum b{display:block;font-size:15px;font-weight:600;color:var(--zt);margin-bottom:6px}'+
P+'.b90sum div{display:flex;gap:8px;font-size:13.5px;line-height:1.5;color:var(--zt);font-weight:500;margin-top:4px}'+P+'.b90sum i{font-style:normal;color:var(--zgb,#00A86B);font-weight:700}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4300);
function box(){return $("calcBox")}
/* Help */
var GR=[["w",tx("Wallet","वॉलेट"),/wallet|PIN|12 words|words|वॉलेट|शब्द|PIN/i],["s",tx("Send","भेजना"),/fee|send|network|address|फ़ीस|फीस|भेज|नेटवर्क|पता/i],["f",tx("Safety","सुरक्षा"),/safe|scam|risk|सुरक्षित|धोखा|जोखिम/i],["t","TZT",/TZT|faucet|test/i]];
if(window.HP){var _h=HP.help;HP.help=function(){_h.apply(this,arguments);var b=box();if(!b)return;var D=Array.prototype.slice.call(b.querySelectorAll("details.hq"));if(!D.length)return;
 var more=b.querySelector(".b89h");
 var hero=document.createElement("div");hero.className="b90hero";hero.innerHTML='<b>'+tx("How can we help?","हम कैसे मदद करें?")+'</b><small>'+tx("Answers in Hindi and English","हिंदी और English में जवाब")+'</small><input type="search" placeholder="'+tx("Search help","मदद में खोजें")+'">';
 var ch=document.createElement("div");ch.className="b90ch";ch.innerHTML=GR.map(function(g){return'<button type="button" data-g="'+g[0]+'">'+g[1]+'</button>'}).join("");
 var groups={};D.forEach(function(d){var t=d.textContent;var g=GR.filter(function(x){return x[2].test(d.querySelector("summary").textContent)})[0]||GR.filter(function(x){return x[2].test(t)})[0];var k=g?g[0]:"o";(groups[k]=groups[k]||[]).push(d)});
 var wrap=document.createElement("div");
 GR.concat([["o",tx("More","और")]]).forEach(function(g){if(!groups[g[0]])return;var h=document.createElement("div");h.className="b90gh";h.textContent=g[1];h.setAttribute("data-g",g[0]);wrap.appendChild(h);groups[g[0]].forEach(function(d){d.setAttribute("data-g",g[0]);wrap.appendChild(d)})});
 var em=document.createElement("div");em.className="b90em";em.style.display="none";em.textContent=tx("No answer found. Ask the AI helper below.","जवाब नहीं मिला। नीचे AI सहायक से पूछिए।");
 b.insertBefore(hero,b.firstChild);hero.after(ch);ch.after(wrap);wrap.after(em);if(more)em.after(more);
 var sel="";function flt(){var q=hero.querySelector("input").value.toLowerCase().trim(),n=0;wrap.querySelectorAll("details.hq").forEach(function(d){var ok=(!sel||d.getAttribute("data-g")===sel)&&(!q||d.textContent.toLowerCase().indexOf(q)>-1);d.style.display=ok?"":"none";if(ok)n++;if(q&&ok)d.open=true});
  wrap.querySelectorAll(".b90gh").forEach(function(h){var any=Array.prototype.some.call(wrap.querySelectorAll('details.hq[data-g="'+h.getAttribute("data-g")+'"]'),function(d){return d.style.display!=="none"});h.style.display=any?"":"none"});em.style.display=n?"none":""}
 hero.querySelector("input").oninput=flt;ch.querySelectorAll("button").forEach(function(btn){btn.onclick=function(){sel=sel===btn.getAttribute("data-g")?"":btn.getAttribute("data-g");ch.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x.getAttribute("data-g")===sel)});flt()}})};
/* About TZT */
 var _a=HP.about;HP.about=function(){_a.apply(this,arguments);var b=box();if(!b)return;var CPa="0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0",ex="https://explorer-mezame.shardeum.org/address/"+CPa;
  b.innerHTML='<div class="b90tk"><div class="lg"><img src="icon-192.png" alt="TZT"></div><b>Tazvera Test (TZT)</b><small><i></i>Shardeum Testnet</small></div>'+
  '<div class="b90st"><div><small>'+tx("Created so far","अब तक बने")+'</small><b>1,000,000</b></div><div><small>'+tx("Maximum limit","अधिकतम सीमा")+'</small><b>500,000,000</b></div><div><small>Decimals</small><b>18</b></div><div><small>'+tx("Value","क़ीमत")+'</small><b>'+tx("Test only","सिर्फ़ टेस्ट")+'</b></div></div>'+
  '<div class="b90ca"><small>'+tx("Contract address","कॉन्ट्रैक्ट पता")+'</small><code>'+CPa+'</code><div class="r"><button type="button">'+tx("Copy","कॉपी")+'</button><a href="'+ex+'" target="_blank" rel="noopener">'+tx("Explorer","Explorer")+'</a></div></div>'+
  '<div class="b90wn">⚠ '+tx("Verified on the Shardeum Explorer ✓. TZT is a test token with no value. The owner can pause it and mint more up to the limit.","Shardeum Explorer पर verified ✓। TZT टेस्ट टोकन है, इसकी कोई क़ीमत नहीं। मालिक इसे रोक सकता है और सीमा तक और बना सकता है।")+'</div>';
  b.querySelector(".b90ca button").onclick=function(){try{navigator.clipboard.writeText(CPa).then(function(){toast(tx("Address copied","पता कॉपी हुआ"))})}catch(e){}}}}
/* Feedback: rating + type */
var fbR="",fbT2="";window.__fbMeta=function(){var a=[];if(fbR)a.push(tx("Rating: ","रेटिंग: ")+fbR);if(fbT2)a.push(tx("Type: ","प्रकार: ")+fbT2);return a.length?"["+a.join(" · ")+"]\n":""};
if(window.FB){var _f=FB.open;FB.open=function(){fbR="";fbT2="";_f.apply(this,arguments);var b=box(),ta=$("fbT");if(!b||!ta)return;
 var d=document.createElement("div");d.innerHTML='<div class="b90l" style="margin-top:2px">'+tx("How is Tazvera so far?","अब तक Tazvera कैसा लगा?")+'</div><div class="b90rt">'+["😞","😐","🙂","😍"].map(function(e){return'<button type="button" data-r="'+e+'">'+e+'</button>'}).join("")+'</div><div class="b90l">'+tx("About","किस बारे में")+'</div><div class="b90ch" style="margin-top:0">'+[["Problem","दिक़्क़त"],["Idea","सुझाव"],["Question","सवाल"]].map(function(x){return'<button type="button" data-t="'+x[0]+'">'+tx(x[0],x[1])+'</button>'}).join("")+'</div><div class="b90l">'+tx("Your message","आपका संदेश")+'</div>';
 ta.before(d);ta.placeholder=tx("Tell us what happened…","बताइए क्या हुआ…");
 d.querySelectorAll(".b90rt button").forEach(function(x){x.onclick=function(){fbR=x.getAttribute("data-r");d.querySelectorAll(".b90rt button").forEach(function(y){y.classList.toggle("on",y===x)})}});
 d.querySelectorAll(".b90ch button").forEach(function(x){x.onclick=function(){fbT2=x.getAttribute("data-t");d.querySelectorAll(".b90ch button").forEach(function(y){y.classList.toggle("on",y===x)})}})}}
/* Privacy / Terms summary */
if(window.LG){var _l=LG.open;LG.open=function(k){_l.apply(this,arguments);var b=box();if(!b)return;var S=k==="p"?[tx("In short","संक्षेप में"),[tx("We do not collect your personal data. No accounts.","हम आपका निजी डेटा नहीं लेते। कोई खाता नहीं।"),tx("Your wallet key stays on your phone, locked by your PIN.","आपकी वॉलेट चाबी आपके फ़ोन में, PIN के ताले में।"),tx("Only your 12 words can bring your wallet back.","सिर्फ़ आपके 12 शब्द वॉलेट वापस ला सकते हैं।")]]:[tx("In short","संक्षेप में"),[tx("This is a test version. Test coins have no value.","यह टेस्ट वर्शन है। टेस्ट सिक्कों की कोई क़ीमत नहीं।"),tx("Nothing here is financial advice.","यहाँ कुछ भी वित्तीय सलाह नहीं।"),tx("You alone control your wallet and your 12 words.","आपका वॉलेट और 12 शब्द सिर्फ़ आपके नियंत्रण में।")]];
 var d=document.createElement("div");d.className="b90sum";d.innerHTML='<b>'+S[0]+'</b>'+S[1].map(function(x){return'<div><i>✓</i><span>'+x+'</span></div>'}).join("");b.insertBefore(d,b.firstChild)}}
}catch(e){try{console.error("Build90",e)}catch(_){}}})();

/* Build 91: Settings redesigned: wallet card, calm row cards, one icon family, clean switches and selects */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
var P="html body #app #sbody#sbody ";
var st=document.createElement("style");st.id="b91s";
st.textContent=
P+'.sr{border:1px solid var(--svb)!important;border-radius:16px!important;padding:12px 14px!important;margin:0 0 10px!important;background:var(--z1)!important;box-shadow:none!important;min-height:0!important;display:flex!important;align-items:center;gap:12px}'+
P+'.sr .si{width:40px!important;height:40px!important;border-radius:12px!important;background:var(--svt)!important;color:var(--svi)!important;display:flex!important;align-items:center;justify-content:center;flex-shrink:0;box-shadow:none!important;border:0!important}'+
P+'.sr .si:has(.b91i) svg:not(.b91i){display:none!important}'+P+'.sr .si svg{width:20px!important;height:20px!important;color:var(--svi)!important}'+P+'.sr .si svg *{stroke:currentColor!important;fill:none!important}'+
P+'.sr .sl{font-size:15px!important;font-weight:600!important;color:var(--zt)!important;flex:1}'+P+'.sr .sv{font-size:13.5px!important;font-weight:500!important;color:var(--cvl)!important}'+
P+'.sr>svg{width:18px;height:18px;color:var(--cvl)!important;flex-shrink:0}'+
P+'.sr select{border:1px solid var(--svb)!important;border-radius:12px!important;background:var(--z1)!important;color:var(--zt)!important;padding:8px 10px!important;font-weight:600!important;font-size:14px!important;font-family:inherit!important;box-shadow:none!important}'+
P+'.sw{width:46px!important;height:26px!important;border-radius:13px!important;background:var(--svb)!important;position:relative!important;flex-shrink:0;border:0!important;box-shadow:none!important}'+
P+'.sw::after{content:""!important;position:absolute!important;top:3px!important;left:3px!important;width:20px!important;height:20px!important;border-radius:50%!important;background:#fff!important;transition:left .15s;box-shadow:none!important}'+
P+'.sw.on{background:var(--zgb,#00A86B)!important}'+P+'.sw.on::after{left:23px!important}'+
P+'.mini{border:1px solid var(--svb)!important;background:var(--z1)!important;color:var(--zt)!important;border-radius:10px!important;padding:6px 12px!important;font-weight:600!important;box-shadow:none!important}'+
P+'.cap{color:var(--cvl)!important;font-weight:500!important}'+
P+'.xw{display:flex;justify-content:center;gap:12px;margin-top:16px}'+P+'.xw .xl{width:44px!important;height:44px!important;border-radius:50%!important;background:var(--svt)!important;color:var(--svi)!important;display:flex!important;align-items:center;justify-content:center;border:0!important;box-shadow:none!important}'+
P+'.xw .xl svg{color:var(--svi)!important;stroke:currentColor}'+
P+'.sr[onclick="addr||connectWallet()"],'+P+'.sr.b91x{display:none!important}'+
P+'.b91w{background:var(--zc,#16335F);color:#fff;border-radius:20px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:14px}'+
P+'.b91w .lg{width:48px;height:48px;border-radius:14px;background:#000;overflow:hidden;flex-shrink:0}'+P+'.b91w .lg img{width:100%;height:100%;display:block}'+
P+'.b91w>span{text-align:left}'+P+'.b91w b{display:block;font-size:16px;font-weight:600}'+P+'.b91w small{display:flex;align-items:center;gap:6px;font-size:13px;color:#C9D5E8;font-family:ui-monospace,Menlo,monospace;margin-top:2px}'+
P+'.b91w .ac{margin-left:auto;display:flex;gap:8px}'+P+'.b91w .ac button{border:0;background:rgba(255,255,255,.14);color:#fff;border-radius:12px;padding:9px 12px;font-weight:600;font-size:13px;font-family:inherit;cursor:pointer}'+
P+'.b91w .nt{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.14);border-radius:10px;padding:2px 8px;font-size:11.5px;color:#fff;font-family:Poppins,sans-serif;margin-top:6px}'+P+'.b91w .nt i{width:6px;height:6px;border-radius:50%;background:#37DE64}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4400);
function sv(d){return'<svg class="b91i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'}
var IC=[[/HB\.open/,'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>'],
[/XN\.open/,'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'],
[/SB\.g\('sec'\)/,'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'],
[/SB\.g\('noti'\)/,'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'],
[/SB\.g\('disp'\)/,'<path d="M4 5h8M8 3v2M6 5c0 4 3 7 6 8M10 5c0 4-3 7-6 8"/><path d="M13 21l4-9 4 9M14.5 18h5"/>'],
[/SB\.g\('dat'\)/,'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>'],
[/SB\.g\('abt'\)/,'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>'],
[/SC\.open/,'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
[/SB\.g\('pin'\)/,'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>']];
function run(){var b=$("sbody");if(!b)return;
 b.querySelectorAll(".sr[onclick]").forEach(function(r){var o=r.getAttribute("onclick")||"";var si=r.querySelector(".si");if(!si||si.querySelector(".b91i"))return;for(var i=0;i<IC.length;i++){if(IC[i][0].test(o)){si.insertAdjacentHTML("beforeend",sv(IC[i][1]));break}}});
 b.querySelectorAll(".sr").forEach(function(r){if(/Check SHM price sources|Test voice alert|SHM भाव के स्रोत|आवाज़ अलर्ट जाँच/i.test(r.textContent||""))r.classList.add("b91x")});
 var t=$("stt"),root=b.querySelector("#hbRow");
 if(root&&!b.querySelector(".b91w")){var a="";try{a=addr||""}catch(e){}var n="";try{n=NETWORKS[currentNet].name}catch(e){}
  var w=document.createElement("div");w.className="b91w";
  w.innerHTML='<span class="lg"><img src="icon-192.png" alt=""></span><span><b>'+(a?"Main wallet":tx("No wallet yet","अभी वॉलेट नहीं"))+'</b>'+(a?'<small>'+a.slice(0,6)+'…'+a.slice(-4)+'</small>':'')+'<span class="nt"><i></i>'+n+'</span></span><span class="ac">'+(a?'<button type="button" data-a="c">'+tx("Copy","कॉपी")+'</button>':'<button type="button" data-a="s">'+tx("Set up","बनाइए")+'</button>')+'</span>';
  b.insertBefore(w,b.firstChild);var bt=w.querySelector("button");bt.onclick=function(){if(bt.getAttribute("data-a")==="c"){try{navigator.clipboard.writeText(a).then(function(){toast(tx("Address copied","पता कॉपी हुआ"))})}catch(e){}}else{try{connectWallet()}catch(e){}}}}
}
setInterval(run,400);
}catch(e){try{console.error("Build91",e)}catch(_){}}})();

/* Build 92: AI helper question buttons in one sliding line */
(function(){try{var st=document.createElement("style");st.id="b92s";
st.textContent='html body #hbChips#hbChips{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;max-height:none!important;padding:6px 14px 10px!important;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity}'+
'html body #hbChips#hbChips::-webkit-scrollbar{display:none}html body #hbChips#hbChips button{flex:0 0 auto!important;white-space:nowrap!important;scroll-snap-align:start}';
document.head.appendChild(st);setTimeout(function(){document.head.appendChild(st)},4500);}catch(e){}})();

/* Build 93: BNB Testnet and Ethereum Sepolia (test networks) for the in-app wallet and MetaMask */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
var X={"bsc-testnet":{name:"BNB Testnet",chainId:"0x61",chainIdDec:97,symbol:"tBNB",rpc:"https://data-seed-prebsc-1-s1.bnbchain.org:8545",explorer:"https://testnet.bscscan.com"},
sepolia:{name:"Sepolia",chainId:"0xaa36a7",chainIdDec:11155111,symbol:"SepoliaETH",rpc:"https://ethereum-sepolia-rpc.publicnode.com",explorer:"https://sepolia.etherscan.io"}};
Object.keys(X).forEach(function(k){if(NETWORKS[k])return;NETWORKS[k]=X[k];var s=$("netSelect");if(s){var o=document.createElement("option");o.value=k;o.textContent=X[k].name;s.appendChild(o)}});
try{if(!T.tBNB)T.tBNB={bal:"0.0000",p:null};if(!T.SepoliaETH)T.SepoliaETH={bal:"0.0000",p:null}}catch(e){}
try{if(window.LOGOS){LOGOS.tBNB=LOGOS.tBNB||LOGOS.BNB;LOGOS.SepoliaETH=LOGOS.SepoliaETH||LOGOS.ETH}}catch(e){}
/* always sign on the network the app shows */
var PR=window.ethereum;if(PR&&PR.isCpWallet&&!PR.__b93){PR.__b93=1;var _r=PR.request.bind(PR);PR.request=async function(a){if(a&&a.method==="eth_sendTransaction"){var n=NETWORKS[currentNet];await _r({method:"wallet_switchEthereumChain",params:[{chainId:n.chainId}]})}return _r(a)}}
function sync(){try{if(window.ethereum&&window.ethereum.isCpWallet&&/testnet|sepolia/.test(currentNet))window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:NETWORKS[currentNet].chainId}]}).catch(function(){})}catch(e){}}
var last="";setInterval(function(){try{if(currentNet!==last){last=currentNet;sync()}}catch(e){}},700);
/* network picker: test networks first, then real-money networks */
if(window.XN&&!XN.__b93){XN.__b93=1;var _o=XN.open;XN.open=function(){_o.apply(this,arguments);var L=$("xnList");if(!L)return;var it=Array.prototype.slice.call(L.querySelectorAll(".xni"));
 var tst=it.filter(function(e){return/testnet|sepolia/.test(e.getAttribute("onclick")||"")}),real=it.filter(function(e){return tst.indexOf(e)<0});
 function h(t){var d=document.createElement("div");d.className="b93h";d.textContent=t;return d}
 L.innerHTML="";L.appendChild(h(en()?"Test networks · free test coins":"टेस्ट नेटवर्क · मुफ़्त टेस्ट सिक्के"));tst.forEach(function(e){L.appendChild(e)});L.appendChild(h(en()?"Real networks · real money (MetaMask)":"असली नेटवर्क · असली पैसा (MetaMask)"));real.forEach(function(e){L.appendChild(e)})}}
var st=document.createElement("style");st.textContent='#xnList .b93h{font-size:13px;font-weight:600;color:var(--cvl,#3A4556);margin:14px 4px 6px;text-align:left}#xnList .b93h:first-child{margin-top:4px}';document.head.appendChild(st);
}catch(e){try{console.error("Build93",e)}catch(_){}}})();

/* Build 93b: on BNB Testnet / Sepolia show the right coin in place of SHM and hide Shardeum-only tokens */
(function(){try{var IMG={"bsc-testnet":"BNB",sepolia:"ETH"};
setInterval(function(){try{var L=document.getElementById("list");if(!L)return;var k=currentNet,o=IMG[k],r=L.querySelector('.row[onclick="XA.tap(\'SHM\')"]');
 L.querySelectorAll('.row').forEach(function(x){var y=x.querySelector(".sym");if(!y)return;var sy=y.textContent.trim();if(sy==="TZT"||sy==="CPAY")x.style.display=k==="shardeum-testnet"?"":"none"});
 if(!r)return;var y=r.querySelector(".sym"),am=r.querySelector(".rt .amt"),sb=r.querySelector(".mid .sub"),im=r.querySelector(".ic img");
 if(o){var nat=NETWORKS[k].symbol,b=(T[nat]&&T[nat].bal)||"0";if(y.textContent!==nat)y.textContent=nat;var f=parseFloat(String(b).replace(/,/g,""))||0;var t=f.toLocaleString("en-IN",{maximumFractionDigits:4});if(am.textContent!==t)am.textContent=t;var st=(typeof lang!=="undefined"&&lang!=="en")?"टेस्ट सिक्का":"Test coin";if(sb&&sb.textContent!==st)sb.textContent=st;if(im&&LOGOS[o]&&im.getAttribute("src")!==LOGOS[o])im.setAttribute("src",LOGOS[o])}
 else if(y.textContent!=="SHM"){y.textContent="SHM";if(im&&LOGOS.SHM)im.setAttribute("src",LOGOS.SHM)}
}catch(e){}},700)}catch(e){}})();

/* Build 94: GitHub (open source) link in Settings and About */
(function(){try{var GH="https://github.com/tazvera/tazvera-wallet";
var SV='<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 20.86c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.62-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"/></svg>';
setInterval(function(){var b=document.getElementById("sbody");if(!b)return;
 b.querySelectorAll('a[href*="discord.gg"]').forEach(function(d){var p=d.parentNode;if(!p||p.querySelector('a[href="'+GH+'"]'))return;var g=d.cloneNode(true);g.href=GH;g.setAttribute("aria-label","GitHub");
  if(g.querySelector("svg")&&!(g.textContent||"").trim()){g.innerHTML=SV}else{var sv=g.querySelector("svg");if(sv)sv.outerHTML=SV;var walker=document.createTreeWalker(g,NodeFilter.SHOW_TEXT);var n;while(n=walker.nextNode()){if(/Discord/i.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/Discord/i,"GitHub")}}
  d.after(g)})},800);
}catch(e){}})();

/* Build 95: hidden Mainnet beta, real-money confirm, "Test my 12 words", clear error messages */
(function(){try{
var $=function(i){return document.getElementById(i)};
function en(){try{return lang==="en"}catch(e){return true}}
function tx(e,h){return en()?e:h}
function beta(){try{return localStorage.getItem("cp3_mainnet_beta")==="1"}catch(e){return false}}
var st=document.createElement("style");st.id="b95s";
st.textContent='#b95chk{display:flex;gap:10px;align-items:flex-start;background:#FEF2F2;color:#7F1D1D;border:1px solid #FCA5A5;border-radius:14px;padding:12px 14px;margin-top:14px;font-size:14px;font-weight:600;line-height:1.45;text-align:left;cursor:pointer}#b95chk input{width:20px;height:20px;margin-top:1px;flex-shrink:0}'+
'html[data-theme=dark] #b95chk{background:#2A1212;color:#FCA5A5;border-color:#7F1D1D}#b95big{color:#B91C1C;font-size:13px;font-weight:600;text-align:center;margin-top:10px}'+
'#b66cf .go[disabled]{opacity:.45;cursor:not-allowed}'+
'#b95w{position:fixed;inset:0;margin:0 auto;max-width:420px;z-index:420;background:var(--z1);color:var(--zt);display:none;flex-direction:column;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-sizing:border-box;font-family:Poppins,system-ui,sans-serif}#b95w.on{display:flex}'+
'#b95w .h{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:600}#b95w .h button{width:40px;height:40px;border-radius:50%;border:0;background:var(--svt);color:var(--zt);font-size:20px;cursor:pointer}'+
'#b95w p{font-size:14px;line-height:1.6;color:var(--cvl);font-weight:500}#b95w textarea{width:100%;min-height:120px;border:1px solid var(--svb);border-radius:14px;padding:12px;font-size:16px;font-family:inherit;background:var(--z1);color:var(--zt);box-sizing:border-box}'+
'#b95w .go{margin-top:14px;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:600;background:var(--zb);color:var(--zbt);cursor:pointer;font-family:inherit}#b95w .r{margin-top:14px;border-radius:14px;padding:14px;font-size:15px;font-weight:600;line-height:1.5;display:none}'+
'#b95w .r.ok{display:block;background:#E9F8EF;color:#065F46}#b95w .r.no{display:block;background:#FEF2F2;color:#991B1B}';
document.head.appendChild(st);
/* 1. hidden switch: tap the Build line in About 7 times */
var taps=0,tt=0;
document.addEventListener("click",function(e){var b=$("sbody");if(!b||!e.target||!b.contains(e.target))return;var t=(e.target.textContent||"");if(!/Build \d+|बिल्ड \d+/.test(t)||t.length>80)return;var now=Date.now();if(now-tt>3000)taps=0;tt=now;taps++;if(taps<7)return;taps=0;toggle()},true);
async function toggle(){var on=beta();
 if(!on){if(!confirm(tx("Turn on Mainnet beta? Shardeum Mainnet uses REAL money. Only for testing with very small amounts.","Mainnet beta चालू करें? Shardeum Mainnet पर असली पैसा होता है। सिर्फ़ बहुत छोटी रकम से जाँच के लिए।")))return;
  try{if(window.CPW&&CPW.has()){CPW.lock();await WS.unlock()}}catch(e){return}
  try{localStorage.setItem("cp3_mainnet_beta","1")}catch(e){}toast(tx("Mainnet beta is ON. Choose Shardeum Mainnet in Network.","Mainnet beta चालू। Network में Shardeum Mainnet चुनिए।"),5000)}
 else{if(!confirm(tx("Turn off Mainnet beta?","Mainnet beta बंद करें?")))return;try{localStorage.removeItem("cp3_mainnet_beta")}catch(e){}try{if(currentNet==="shardeum")changeNetwork("shardeum-testnet")}catch(e){}toast(tx("Mainnet beta is OFF.","Mainnet beta बंद।"))}}
/* 2. real-money confirm on Shardeum Mainnet */
setInterval(function(){var c=$("b66cf");if(!c||c.style.display==="none"||!c.offsetParent&&getComputedStyle(c).position!=="fixed")return;var go=c.querySelector(".go");if(!go)return;
 var real=false;try{real=!/testnet|sepolia/.test(currentNet)}catch(e){}
 var k=$("b95chk");if(!real){if(k)k.remove();var g=$("b95big");if(g)g.remove();go.disabled=false;return}
 if(!k){k=document.createElement("label");k.id="b95chk";k.innerHTML='<input type="checkbox"><span>'+tx("REAL MONEY. I checked the address and the amount. Sent coins cannot come back.","असली पैसा। मैंने पता और रकम जाँच ली है। भेजे सिक्के वापस नहीं आते।")+'</span>';go.before(k);go.disabled=true;k.querySelector("input").onchange=function(){go.disabled=!this.checked};
  try{var bg=c.querySelector(".big"),n=parseFloat((bg&&bg.textContent||"").replace(/,/g,"")),sy=NETWORKS[currentNet].symbol,p=T[sy]&&T[sy].p?T[sy].p.inr:0;if(n*p>500){var w=document.createElement("div");w.id="b95big";w.textContent=tx("Large amount for a beta: about ₹"+Math.round(n*p)+". Consider a smaller test first.","बीटा के लिए बड़ी रकम: लगभग ₹"+Math.round(n*p)+"। पहले छोटी रकम से जाँचिए।");k.after(w)}}catch(e){}}
},400);
/* 3. Test my 12 words (checks only, changes nothing) */
function words(){var w=$("b95w");if(!w){w=document.createElement("div");w.id="b95w";
 w.innerHTML='<div class="h"><button type="button" aria-label="Back">‹</button><span></span></div><p class="d"></p><textarea autocomplete="off" autocapitalize="off" spellcheck="false"></textarea><button type="button" class="go"></button><div class="r"></div>';document.body.appendChild(w);
 w.querySelector(".h button").onclick=function(){w.querySelector("textarea").value="";w.querySelector(".r").className="r";w.classList.remove("on")};
 w.querySelector(".go").onclick=function(){var ta=w.querySelector("textarea"),r=w.querySelector(".r"),ph=ta.value.trim().toLowerCase().replace(/\s+/g," ");ta.value="";
  try{var a=ethers.Wallet.fromPhrase(ph).address;var mine=CPW.address();if(a.toLowerCase()===String(mine).toLowerCase()){r.className="r ok";r.textContent=tx("✓ Correct. These 12 words will bring back this wallet. Keep the paper safe.","✓ सही हैं। इन्हीं 12 शब्दों से यह वॉलेट वापस आएगा। काग़ज़ सुरक्षित रखिए।")}else{r.className="r no";r.textContent=tx("These words make a different wallet. Check the spelling and order.","ये शब्द किसी दूसरे वॉलेट के हैं। स्पेलिंग और क्रम जाँचिए।")}}
  catch(e){r.className="r no";r.textContent=tx("Not valid. Check each word and the order (12 words, small letters).","सही नहीं। हर शब्द और क्रम जाँचिए (12 शब्द, छोटे अक्षर)।")}}}
 w.querySelector(".h span").textContent=tx("Test my 12 words","मेरे 12 शब्द जाँचें");
 w.querySelector(".d").textContent=tx("Type your 12 words from your paper, with spaces. Tazvera only checks them on this phone and does not save or send them.","काग़ज़ से अपने 12 शब्द खाली जगह के साथ लिखिए। Tazvera सिर्फ़ इसी फ़ोन पर जाँचता है, न सेव करता है न कहीं भेजता है।");
 w.querySelector(".go").textContent=tx("Check","जाँचें");w.querySelector(".r").className="r";w.classList.add("on")}
window.TZWORDS=words;
setInterval(function(){var t=$("stt"),b=$("sbody");if(!t||!b||!/Security|सुरक्षा/.test(t.textContent||""))return;if(b.querySelector(".b95r")||!(window.CPW&&CPW.has()))return;
 var d=document.createElement("div");d.className="sr b95r";d.setAttribute("onclick","TZWORDS()");d.innerHTML='<span class="sl">'+tx("Test my 12 words","मेरे 12 शब्द जाँचें")+'</span><span class="sv">›</span>';var f=b.querySelector(".b81r");if(f)f.after(d);else b.insertBefore(d,b.firstChild)},700);
/* show coins when the rupee price is not loaded yet on a real network */
setInterval(function(){try{if(/testnet|sepolia/.test(currentNet))return;var sy=NETWORKS[currentNet].symbol,t=T[sy],el=$("total");if(!el||!t||(t.p&&t.p.inr>0)||hideBal)return;var v=parseFloat(String(t.bal||"0").replace(/,/g,""))||0,txt=v.toLocaleString("en-IN",{maximumFractionDigits:4})+" "+sy;if(el.textContent!==txt)el.textContent=txt}catch(e){}},800);
/* red strip on top while on a real-money network */
(function(){var c=document.createElement("style");c.textContent='#b95bar{position:sticky;top:0;z-index:60;background:#B91C1C;color:#fff;text-align:center;font:600 13px Poppins,system-ui,sans-serif;padding:7px 10px;letter-spacing:.3px}';document.head.appendChild(c)})();
setInterval(function(){try{var real=!/testnet|sepolia/.test(currentNet),bar=$("b95bar"),app=$("app");if(!app)return;if(real){if(!bar){bar=document.createElement("div");bar.id="b95bar";app.insertBefore(bar,app.firstChild)}var t=tx("REAL MONEY · ","असली पैसा · ")+NETWORKS[currentNet].name+(currentNet==="shardeum"?" (beta)":"");if(bar.textContent!==t)bar.textContent=t}else if(bar)bar.remove()}catch(e){}},700);
/* 4. clear error messages */
if(typeof toast==="function"&&!window.__b95t){window.__b95t=1;var _t=toast;window.toast=toast=function(m){var s=String(m||"");
 if(/insufficient funds/i.test(s))m=tx("Not enough SHM to pay the network fee.","नेटवर्क फ़ीस के लिए SHM कम है।");
 else if(/timeout|network error|failed to fetch|could not detect network/i.test(s))m=tx("The network is slow right now. Please try again in a moment.","नेटवर्क अभी धीमा है, थोड़ी देर बाद फिर कोशिश कीजिए।");
 else if(/invalid address|bad address checksum/i.test(s))m=tx("This address is not valid.","यह पता सही नहीं है।");
 return _t.apply(this,[m].concat([].slice.call(arguments,1)))}}
}catch(e){try{console.error("Build95",e)}catch(_){}}})();
