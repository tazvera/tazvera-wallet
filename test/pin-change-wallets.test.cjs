"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("app/js/features/pin-change-wallets.js","utf8");
function setup(wallets,activeId,currentKeystore,failAddress){
 const state={list:wallets.map(x=>({...x})),keystore:currentKeystore,saved:0,unlockedWith:null};
 const ctx={
  L:{en:{},hi:{}},Object,String,Error,Promise,
  raw:(k,d)=>k==="cp3_inapp_keystore"?state.keystore:d,
  rawSet:(k,v)=>{if(k==="cp3_inapp_keystore")state.keystore=v},
  wList:()=>state.list.map(x=>({...x})),
  wActive:()=>state.list.find(x=>x.id===activeId),
  wSave:list=>{state.saved++;state.list=list.map(x=>({...x}))},
  CPW:{unlock:async pin=>{state.unlockedWith=pin},lock:()=>{state.unlockedWith=null}},
  ethers:{Wallet:{fromEncryptedJson:async(json,pin)=>{
   const m=/^enc:([^:]+):([^:]+)$/.exec(json||"");
   if(!m||m[2]!==pin||m[1]===failAddress)throw new Error("decrypt failed");
   return{address:m[1],encrypt:async next=>"enc:"+m[1]+":"+next};
  }}}
 };
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return{ctx,state};
}
test("all wallets are re-encrypted before one atomic save",async()=>{
 const{ctx,state}=setup([
  {id:"a",addr:"0xactive",ks:"enc:0xactive:old"},
  {id:"b",addr:"0xsecond",ks:"enc:0xsecond:old"}
 ],"a","enc:0xactive:new");
 assert.equal(await ctx.pinRelockAll("old","new","enc:0xactive:old"),0);
 assert.equal(state.saved,1);
 assert.equal(state.list[0].ks,"enc:0xactive:new");
 assert.equal(state.list[1].ks,"enc:0xsecond:new");
});
test("one wallet failure cancels the whole migration and restores active keystore",async()=>{
 const original=[
  {id:"a",addr:"0xactive",ks:"enc:0xactive:old"},
  {id:"b",addr:"0xsecond",ks:"enc:0xsecond:old"},
  {id:"c",addr:"0xthird",ks:"enc:0xthird:old"}
 ];
 const{ctx,state}=setup(original,"a","enc:0xactive:new","0xthird");
 await assert.rejects(ctx.pinRelockAll("old","new","enc:0xactive:old"),/PIN change cancelled/);
 assert.equal(state.saved,0,"no partial wallet list must be saved");
 assert.deepEqual(state.list,original,"all stored wallet keystores remain unchanged");
 assert.equal(state.keystore,"enc:0xactive:old","active keystore is rolled back");
 assert.equal(state.unlockedWith,"old","active wallet is restored using the old PIN");
});
test("active wallet address mismatch aborts without saving",async()=>{
 const{ctx,state}=setup([
  {id:"a",addr:"0xexpected",ks:"enc:0xexpected:old"}
 ],"a","enc:0xother:new");
 await assert.rejects(ctx.pinRelockAll("old","new","enc:0xexpected:old"),/PIN change cancelled/);
 assert.equal(state.saved,0);
 assert.equal(state.keystore,"enc:0xexpected:old");
});
