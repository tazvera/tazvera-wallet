"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const address="0x1111111111111111111111111111111111111111";
const recipient="0x2222222222222222222222222222222222222222";
let sends=0;
const fakeWallet={address,connect(){return{sendTransaction:async tx=>{sends++;return{hash:"0xabc"}}}}};
let gasNow={gp:1n,est:21000n}; // what the RPC quotes right now; tests change it
class FakeProvider{async send(method){if(method==="eth_gasPrice")return "0x"+gasNow.gp.toString(16);throw new Error("unexpected RPC")}async estimateGas(){return gasNow.est}}
const store={};
const ctx={console,Date,Promise,Math,JSON,String,Object,Array,RegExp,Error,BigInt,Number,
 localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},
 ethers:{JsonRpcProvider:FakeProvider,Wallet:{fromEncryptedJson:async()=>fakeWallet},getAddress:x=>x}};
ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname,"..","wallet.js"),"utf8"),ctx);
const tx={from:address,to:recipient,value:"0x01",data:"0x"};
// The fee the confirmation screen showed: gas price 1, limit 21000 + 20% (what the fake RPC quotes below).
const screenGas={gasPrice:"1",gasLimit:"25200"};
async function send(payload=tx){return ctx.tazveraProvider.request({method:"eth_sendTransaction",params:[payload]})}
function hasMessage(s){return e=>String(e&&e.message||e).includes(s)}
test("unapproved direct transaction is rejected",async()=>{await ctx.CPW.unlockKs("{}", "pw",address);await assert.rejects(send(),hasMessage("fresh approval"));assert.equal(sends,0)});
test("approval is bound to exact transaction and consumed once",async()=>{
 ctx.CPW.approveTransaction(tx,screenGas);
 await assert.rejects(send({...tx,value:"0x02"}),hasMessage("fresh approval"));
 assert.equal(sends,0);
 ctx.CPW.approveTransaction(tx,screenGas);
 assert.equal(await send(),"0xabc");
 assert.equal(sends,1);
 await assert.rejects(send(),hasMessage("fresh approval"));
 assert.equal(sends,1);
});
test("approval cannot survive wallet lock",async()=>{
 ctx.CPW.approveTransaction(tx,screenGas);
 const permit=ctx.CPW; // expiry is checked against the real clock
 // Locking the wallet clears any outstanding approval before another request.
 ctx.CPW.lock();
 await assert.rejects(send(),hasMessage("Wallet is locked"));
 await ctx.CPW.unlockKs("{}", "pw",address);
 ctx.CPW.approveTransaction(tx,screenGas);
 ctx.CPW.lock();
 await ctx.CPW.unlockKs("{}", "pw",address);
 await assert.rejects(send(),hasMessage("fresh approval"));
 assert.equal(sends,1);
});
test("approval details reject mismatched sender and malformed destination",async()=>{
 await ctx.CPW.unlockKs("{}", "pw",address);
 await assert.rejects(Promise.resolve().then(()=>ctx.CPW.approveTransaction({...tx,from:recipient},screenGas)),hasMessage("Invalid transaction"));
 await assert.rejects(Promise.resolve().then(()=>ctx.CPW.approveTransaction({...tx,to:"not-an-address"},screenGas)),hasMessage("Invalid transaction"));
});

test("approval expires after its short validity window",async()=>{
 await ctx.CPW.unlockKs("{}", "pw",address);
 ctx.CPW.approveTransaction(tx,screenGas);
 const now=Date.now;
 try {
   Date.now=()=>now()+31000;
   await assert.rejects(send(),hasMessage("fresh approval"));
 } finally { Date.now=now; }
 assert.equal(sends,1);
});

test("the approved fee is the one on screen: a different price at send time is refused",async()=>{
 await ctx.CPW.unlockKs("{}", "pw",address);
 // The RPC already quotes 2 while the screen still shows 1. Approval must use the screen's 1, not fetch its own.
 gasNow={gp:2n,est:21000n};
 ctx.CPW.approveTransaction(tx,screenGas);
 const before=sends;
 try {
   await assert.rejects(send(),hasMessage("Approve the transaction again"));
   assert.equal(sends,before);
   // the screen now shows the new price; approving that sends
   ctx.CPW.approveTransaction(tx,{gasPrice:"2",gasLimit:"25200"});
   assert.equal(await send(),"0xabc");
   assert.equal(sends,before+1);
 } finally { gasNow={gp:1n,est:21000n}; }
});

test("a different gas limit at send time is refused",async()=>{
 await ctx.CPW.unlockKs("{}", "pw",address);
 gasNow={gp:1n,est:21000n};
 ctx.CPW.approveTransaction(tx,screenGas);
 gasNow={gp:1n,est:30000n}; // estimate went up after the screen showed 25200
 const before=sends;
 try {
   await assert.rejects(send(),hasMessage("Approve the transaction again"));
   assert.equal(sends,before);
 } finally { gasNow={gp:1n,est:21000n}; }
});

test("approval without fee details is refused",async()=>{
 await ctx.CPW.unlockKs("{}", "pw",address);
 assert.throws(()=>ctx.CPW.approveTransaction(tx),hasMessage("Fee details are missing"));
 assert.throws(()=>ctx.CPW.approveTransaction(tx,{gasPrice:"0",gasLimit:"25200"}),hasMessage("Fee details are missing"));
});
