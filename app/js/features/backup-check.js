/* Tazvera wallet · app/js/features/backup-check.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* 12-word backup is tracked for every wallet. / हर वॉलेट का बैकअप अलग से। */
/* ----- 12-word backup is checked for EVERY wallet, not just the first one ----- */
function bkMark(a){if(a)rawSet("tz_bk_"+String(a).toLowerCase(),"1")}
function bkDone(a){a=String(a||"").toLowerCase();if(!a)return false;if(raw("tz_bk_"+a,"")==="1")return true;
 try{var l=wList();if(ls("backup_ok",0)&&l.length&&String(l[0].addr).toLowerCase()===a)return true}catch(e){}return false}
