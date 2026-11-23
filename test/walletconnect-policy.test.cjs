"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const ctx={Object,Array,String,RegExp,Set,globalThis:null};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname,"..","app/walletconnect/policy.js"),"utf8"),ctx);
const P=ctx.TazveraWCPolicy;
const good={params:{requiredNamespaces:{eip155:{chains:["eip155:56"],methods:["eth_accounts","eth_sendTransaction","personal_sign"],events:["accountsChanged","chainChanged"]}}}};
test("accepts only a BNB Chain proposal with supported methods and events",()=>{
 assert.equal(P.validateProposal(good).ok,true);
});
test("rejects other chains and mixed-chain proposals",()=>{
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{...good.params.requiredNamespaces.eip155,chains:["eip155:1"]}}}}).reason,"unsupported_chain");
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{...good.params.requiredNamespaces.eip155,chains:["eip155:56","eip155:1"]}}}}).reason,"unsupported_chain");
});
test("rejects unknown namespaces, methods and events",()=>{
 assert.equal(P.validateProposal({params:{requiredNamespaces:{solana:{}}}}).reason,"unsupported_namespace");
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{chains:["eip155:56"],methods:["eth_sign"],events:[]}}}}).reason,"unsupported_method");
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{chains:["eip155:56"],methods:["eth_accounts"],events:["message"]}}}}).reason,"unsupported_event");
});
test("requires exact chain and allowlisted method for each request",()=>{
 assert.equal(P.validateRequest({chainId:"eip155:56",method:"eth_call"}).ok,true);
 assert.equal(P.validateRequest({chainId:"eip155:1",method:"eth_call"}).reason,"unsupported_chain");
 assert.equal(P.validateRequest({chainId:"eip155:56",method:"wallet_addEthereumChain"}).reason,"unsupported_method");
});
test("marks signing and sending methods as requiring a fresh user approval",()=>{
 for(const method of ["eth_sendTransaction","personal_sign","eth_signTypedData_v4"])
   assert.equal(P.validateRequest({chainId:"eip155:56",method}).requiresUserApproval,true);
 assert.equal(P.validateRequest({chainId:"eip155:56",method:"eth_accounts"}).requiresUserApproval,false);
});
test("accepts only a single BNB Chain account in a session",()=>{
 assert.equal(P.validateSession({namespaces:{eip155:{chains:["eip155:56"],methods:["eth_accounts"],events:["accountsChanged"],accounts:["eip155:56:0x1111111111111111111111111111111111111111"]}}}).ok,true);
 assert.equal(P.validateSession({namespaces:{eip155:{chains:["eip155:1"],methods:["eth_accounts"],events:[],accounts:["eip155:1:0x1111111111111111111111111111111111111111"]}}}).reason,"unsupported_chain");
 assert.equal(P.validateSession({namespaces:{eip155:{chains:["eip155:56"],methods:["eth_accounts"],events:[],accounts:["eip155:56:not-an-address"]}}}).reason,"invalid_account");
});
test("fails closed on missing or malformed proposal, request and session data",()=>{
 assert.equal(P.validateProposal(null).ok,false);
 assert.equal(P.validateRequest(null).ok,false);
 assert.equal(P.validateSession(null).ok,false);
});
