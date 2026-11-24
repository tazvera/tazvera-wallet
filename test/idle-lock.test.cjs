"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
let now=1_800_000_000_000;
let intervalFn=null,locks=0,closes=0;
const handlers={};
const session=new Map([["v2_unl","1"],["v2_act","1"]]);
const ctx={
 Date:class extends Date{static now(){return now}},
 S:{mode:"inapp",addr:"0xabc"},
 document:{hidden:false,addEventListener:(name,fn)=>{(handlers[name]||(handlers[name]=[])).push(fn)}},
 sessionStorage:{getItem:k=>session.get(k)||null,removeItem:k=>session.delete(k)},
 setInterval:fn=>{intervalFn=fn;return 1},
 amin:()=>5,CPW:{lock:()=>{locks++}},
 closeSheet:()=>{closes++},lockScreen:()=>{locks++}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("app/js/features/idle-lock.js","utf8"),ctx);
function fire(name){(handlers[name]||[]).forEach(fn=>fn())}
test("idle wallet locks immediately when a hidden app resumes after timeout",()=>{
 ctx.document.hidden=true;now+=5*60_000+1;fire("visibilitychange");
 assert.equal(locks,0,"hidden transition itself does not force an early lock");
 ctx.document.hidden=false;fire("visibilitychange");
 assert.equal(locks,2,"resume locks the wallet and opens the lock screen");
 assert.equal(closes,1);
 assert.equal(session.has("v2_unl"),false);
 assert.equal(session.has("v2_act"),false);
});
test("locked sheet and non-wallet sessions are not relocked",()=>{
 ctx.S.mode="inapp";ctx.S.addr="0xabc";ctx.SLOCK=true;session.set("v2_unl","1");
 now+=10*60_000;intervalFn();assert.equal(locks,2);
 ctx.SLOCK=false;ctx.S.mode="mm";intervalFn();assert.equal(locks,2);
});
