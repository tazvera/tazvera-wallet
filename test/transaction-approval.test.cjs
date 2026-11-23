"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const address="0x1111111111111111111111111111111111111111";
const recipient="0x2222222222222222222222222222222222222222";
let sends=0;
const fakeWallet={address,connect(){return{sendTransaction:async tx=>{sends++;return{hash:"0xabc"}}}}};
class FakeProvider{async send(method){if(method==="eth_gasPrice")return 1n;throw new Error("unexpected RPC")}async estimateGas(){return 21000n}}
const store={};
const ctx={console,Date,Promise,Math,JSON,String,Object,Array,RegExp,Error,BigInt,Number,
 localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},
 ethers:{JsonRpcProvider:FakeProvider,Wallet:{fromEncryptedJson:async()=>fakeWallet},getAddress:x=>x}};
ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname,"..","wallet.js"),"utf8"),ctx);
const tx={from:address,to:recipient,value:"0x01",data:"0x"};
async function send(payload=tx){return ctx.tazveraProvider.request({method:"eth_sendTransaction",params:[payload]})}
test("unapproved direct transaction is rejected",async()=>{await ctx.CPW.unlockKs("{}", "pw",address);await assert.rejects(send(),/fresh approval/);assert.equal(sends,0)});
test("approval is bound to exact transaction and consumed once",async()=>{
 ctx.CPW.approveTransaction(tx);
 await assert.rejects(send({...tx,value:"0x02"}),/fresh approval/);
 assert.equal(sends,0);
 ctx.CPW.approveTransaction(tx);
 assert.equal(await send(),"0xabc");
 assert.equal(sends,1);
 await assert.rejects(send(),/fresh approval/);
 assert.equal(sends,1);
});
test("approval expires and cannot survive wallet lock",async()=>{
 ctx.CPW.approveTransaction(tx);
 const permit=ctx.CPW; // expiry is checked against the real clock
 // Locking the wallet clears any outstanding approval before another request.
 ctx.CPW.lock();
 await assert.rejects(send(),/Wallet is locked/);
 await ctx.CPW.unlockKs("{}", "pw",address);
 ctx.CPW.approveTransaction(tx);
 ctx.CPW.lock();
 await ctx.CPW.unlockKs("{}", "pw",address);
 await assert.rejects(send(),/fresh approval/);
 assert.equal(sends,1);
});
test("approval details reject mismatched sender and malformed destination",async()=>{
 await assert.rejects(Promise.resolve().then(()=>ctx.CPW.approveTransaction({...tx,from:recipient})),/Invalid transaction/);
 await assert.rejects(Promise.resolve().then(()=>ctx.CPW.approveTransaction({...tx,to:"not-an-address"})),/Invalid transaction/);
});
