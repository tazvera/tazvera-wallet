/* Tazvera wallet · app/js/features/backup-check.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* 12-word backup is tracked for every wallet. / हर वॉलेट का बैकअप अलग से। */
/* ----- 12-word backup is checked for EVERY wallet, not just the first one ----- */
function bkMark(a){if(a)rawSet("tz_bk_"+String(a).toLowerCase(),"1")}
function bkDone(a){a=String(a||"").toLowerCase();if(!a)return false;if(raw("tz_bk_"+a,"")==="1")return true;
 try{var l=wList();if(ls("backup_ok",0)&&l.length&&String(l[0].addr).toLowerCase()===a)return true}catch(e){}return false}

/* The 12 words and the backup FILE are two different safety nets, so they are tracked separately.
   Most people who lose money never made either one, so the checkup counts both. */
function wbkMark(a){if(a)rawSet("tz_wbf_"+String(a).toLowerCase(),"1")}
function wbkFileDone(a){a=String(a||"").toLowerCase();if(!a)return false;return raw("tz_wbf_"+a,"")==="1"}
