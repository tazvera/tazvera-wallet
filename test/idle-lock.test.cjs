"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
let now=1_800_000_000_000;
let intervalFn=null,locks=0,closes=0,cancels=0;
const handlers={};
const session=new Map([["v2_unl","1"],["v2_act","1"]]);
const ctx={
 Date:class extends Date{static now(){return now}},
 S:{mode:"inapp",addr:"0xabc"},
 document:{hidden:false,addEventListener:(name,fn)=>{(handlers[name]||(handlers[name]=[])).push(fn)},
  getElementById:id=>(ctx.SIGN_OPEN&&id==="sgNo")?{click(){cancels++}}:null},
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
test("an open sheet locks the wallet after 2 minutes without a touch",()=>{
 ctx.S.mode="inapp";ctx.S.addr="0xabc";ctx.SLOCK=true;session.set("v2_unl","1");
 const l0=locks,c0=closes;
 now+=60_000;intervalFn();assert.equal(locks,l0,"one minute: the sheet stays open");
 now+=61_000;intervalFn();assert.equal(locks,l0+2,"after 2 minutes: the wallet locks (CPW.lock + lock screen)");
 assert.equal(closes,c0+1,"and the sheet closes");
 assert.equal(session.has("v2_unl"),false);
});

test("a signing sheet is rejected through its Reject button, then the wallet locks",()=>{
 ctx.S.mode="inapp";ctx.S.addr="0xabc";ctx.SLOCK=true;ctx.SIGN_OPEN=true;session.set("v2_unl","1");
 const l0=locks;
 now+=121_000;intervalFn();
 assert.equal(cancels,1,"the pending signing request is rejected");
 assert.equal(locks,l0+2,"the wallet locks (CPW.lock + lock screen)");
 ctx.SIGN_OPEN=false;
});

test("a PIN sheet only locks; nothing is rejected",()=>{
 ctx.S.mode="inapp";ctx.S.addr="0xabc";ctx.SLOCK=true;ctx.SIGN_OPEN=false;session.set("v2_unl","1");
 const c0=cancels;const l0=locks;
 now+=121_000;intervalFn();
 assert.equal(cancels,c0);
 assert.equal(locks,l0+2);
});

test("non-wallet sessions are not relocked",()=>{
 ctx.SLOCK=false;ctx.S.mode="mm";const l0=locks;now+=10*60_000;intervalFn();assert.equal(locks,l0);
});
