"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const ctx={Object,Array,String,RegExp,Set,globalThis:null};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(require("node:path").join(__dirname,"..","app/walletconnect/policy.js"),"utf8"),ctx);
const P=ctx.TazveraWCPolicy;
function proposal(chain){return {params:{requiredNamespaces:{eip155:{chains:[chain],methods:["eth_accounts","eth_sendTransaction","personal_sign"],events:["accountsChanged","chainChanged"]}}}}}
function session(chain){return {namespaces:{eip155:{chains:[chain],methods:["eth_accounts"],events:["accountsChanged"],accounts:[chain+":0x1111111111111111111111111111111111111111"]}}}}
test("allows BNB Chain and Shardeum Mainnet proposals with supported methods/events",()=>{
 for(const chain of ["eip155:56","eip155:8118"])assert.equal(P.validateProposal(proposal(chain)).ok,true);
});
test("rejects unsupported, duplicate and mixed-chain proposals",()=>{
 for(const chains of [["eip155:1"],["eip155:56","eip155:8118"],["eip155:8118","eip155:8118"]]){
  assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{...proposal("eip155:56").params.requiredNamespaces.eip155,chains}}}}).reason,"unsupported_chain");
 }
});
test("rejects unknown namespaces, methods and events",()=>{
 assert.equal(P.validateProposal({params:{requiredNamespaces:{solana:{}}}}).reason,"unsupported_namespace");
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{chains:["eip155:8118"],methods:["eth_sign"],events:[]}}}}).reason,"unsupported_method");
 assert.equal(P.validateProposal({params:{requiredNamespaces:{eip155:{chains:["eip155:8118"],methods:["eth_accounts"],events:["message"]}}}}).reason,"unsupported_event");
});
test("validates requests separately for BNB and Shardeum",()=>{
 for(const chain of ["eip155:56","eip155:8118"])assert.equal(P.validateRequest({chainId:chain,method:"eth_call"}).ok,true);
 assert.equal(P.validateRequest({chainId:"eip155:1",method:"eth_call"}).reason,"unsupported_chain");
 assert.equal(P.validateRequest({chainId:"eip155:8118",method:"wallet_addEthereumChain"}).reason,"unsupported_method");
});
test("requires fresh user approval for every signing or sending method",()=>{
 for(const chain of ["eip155:56","eip155:8118"])for(const method of ["eth_sendTransaction","personal_sign","eth_signTypedData_v4"])
  assert.equal(P.validateRequest({chainId:chain,method}).requiresUserApproval,true);
 assert.equal(P.validateRequest({chainId:"eip155:8118",method:"eth_accounts"}).requiresUserApproval,false);
});
test("accepts exactly one correctly formatted account for each supported chain",()=>{
 for(const chain of ["eip155:56","eip155:8118"])assert.equal(P.validateSession(session(chain)).ok,true);
 assert.equal(P.validateSession(session("eip155:1")).reason,"unsupported_chain");
 const bad=session("eip155:8118");bad.namespaces.eip155.accounts=["eip155:56:0x1111111111111111111111111111111111111111"];
 assert.equal(P.validateSession(bad).reason,"invalid_account");
 const malformed=session("eip155:8118");malformed.namespaces.eip155.accounts=["eip155:8118:not-an-address"];
 assert.equal(P.validateSession(malformed).reason,"invalid_account");
});
test("fails closed on missing or malformed proposal, request and session data",()=>{
 assert.equal(P.validateProposal(null).ok,false);
 assert.equal(P.validateRequest(null).ok,false);
 assert.equal(P.validateSession(null).ok,false);
});
