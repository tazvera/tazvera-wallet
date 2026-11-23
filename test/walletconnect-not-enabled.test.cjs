"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
test("WalletConnect SDK is not loaded until its reviewed integration is ready",()=>{
 const html=read("index.html");
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(x=>x[1]);
 assert.equal(scripts.some(s=>/reown|sign-client|walletkit/i.test(s)),false,
  "do not ship an unreviewed WalletConnect SDK");
 assert.equal(scripts.filter(s=>/walletconnect/i.test(s)).every(s=>s==="app/walletconnect/config.js"||s==="app/walletconnect/policy.js"),true,
  "only the local metadata and fail-closed policy files may load before integration");
});
test("wallet does not inject a global Ethereum provider for arbitrary websites",()=>{
 for(const file of ["wallet.js","app/browser/browser.js"]){
  const src=read(file);
  assert.equal(/window\.ethereum\s*=|Object\.defineProperty\s*\(\s*window\s*,\s*["']ethereum["']/.test(src),false,
   file+" must not expose an unreviewed DApp provider");
 }
});
test("WalletConnect config is metadata only and does not create a session client",()=>{
 const cfg=read("app/walletconnect/config.js");
 assert.match(cfg,/WC_PROJECT_ID/);
 assert.doesNotMatch(cfg,/SignClient|WalletKit|Web3Wallet|\.init\s*\(/);
});
