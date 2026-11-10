/* Tazvera wallet · app/js/features/bottom-bar-assistant-icon.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Bottom bar (Home · Learn · Explore) and the movable assistant icon. / नीचे की पट्टी और खिसकने वाला AI आइकॉन। */
/* ----- bottom bar: Home · Scan · Explore, and the assistant in the corner ----- */
Object.assign(L.en,{navScan:"Scan",navLearn:"Learn",aiFab:"Tazvera Assistant"});
Object.assign(L.hi,{navScan:"स्कैन",navLearn:"सीखें",aiFab:"Tazvera सहायक"});

/* ----- the assistant icon can be moved with a finger; it sticks to the nearest side and stays there ----- */
(function(){var KEY="tz_aipos",drag=null,justMoved=0;
 function saved(){try{var p=JSON.parse(localStorage.getItem(KEY)||"null");if(p&&(p.s==="l"||p.s==="r")&&typeof p.y==="number")return p}catch(e){}return null}
 function place(f){var p=saved();if(!p)return;var h=window.innerHeight,y=Math.min(Math.max(p.y,70),h-60),edge="max(6px, calc(50% - 214px))";
  f.style.setProperty("top",y+"px","important");f.style.setProperty("bottom","auto","important");f.style.setProperty("left",p.s==="l"?edge:"auto","important");f.style.setProperty("right",p.s==="r"?edge:"auto","important")}
 new MutationObserver(function(){var f=document.querySelector(".aifab");if(f&&!f._pl){f._pl=1;place(f)}}).observe(document.getElementById("app"),{childList:true,subtree:false});
 document.addEventListener("pointerdown",function(e){var f=e.target.closest(".aifab");if(!f)return;var r=f.getBoundingClientRect();drag={f:f,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,moved:false};try{f.setPointerCapture(e.pointerId)}catch(x){}});
 document.addEventListener("pointermove",function(e){if(!drag)return;var f=drag.f;if(!drag.moved&&Math.abs(e.clientX-drag.x0)+Math.abs(e.clientY-drag.y0)<8)return;drag.moved=true;f.classList.add("drag");
  var w=window.innerWidth,h=window.innerHeight,x=Math.min(Math.max(e.clientX-drag.dx,4),w-52),y=Math.min(Math.max(e.clientY-drag.dy,60),h-56);
  f.style.setProperty("left",x+"px","important");f.style.setProperty("top",y+"px","important");f.style.setProperty("right","auto","important");f.style.setProperty("bottom","auto","important");e.preventDefault()},{passive:false});
 function end(){if(!drag)return;var f=drag.f,m=drag.moved;drag=null;f.classList.remove("drag");if(!m)return;justMoved=Date.now();
  var r=f.getBoundingClientRect(),side=(r.left+r.width/2)<window.innerWidth/2?"l":"r";try{localStorage.setItem(KEY,JSON.stringify({s:side,y:Math.round(r.top)}))}catch(x){}
  f.style.removeProperty("left");f.style.removeProperty("right");f.style.removeProperty("top");f.style.removeProperty("bottom");place(f)}
 document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
 document.addEventListener("click",function(e){if(e.target.closest(".aifab")&&Date.now()-justMoved<400){e.stopImmediatePropagation();e.preventDefault()}},true);
})();
