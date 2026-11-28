"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),ui=fs.readFileSync(path.join(root,"app/browser/dapps/dapps.js"),"utf8"),catalog=JSON.parse(fs.readFileSync(path.join(root,"app/browser/dapps/catalog.json"),"utf8"));
test("dApps is a separate discovery screen with one header and one search",()=>{
 assert.match(ui,/<h1>dApps<\/h1>/);assert.match(ui,/data-chain-toggle="1"/);assert.match(ui,/id="tzDappSearch"/);
 assert.doesNotMatch(ui,/Tazvera dApps|tz-browser-toolbar|data-dapp-back|data-dapp-forward|tz-browser-address/);
 assert.match(ui,/BOOKMARKS/);assert.match(ui,/FEATURED/);assert.match(ui,/POPULAR/);
});
test("catalogue icons have 96x96 SVG assets or safe letter fallback",()=>{
 assert.equal(catalog.items.find(x=>x.id==="pancake").iconFile,"app/browser/dapps/icons/pancake.svg");
 assert.equal(catalog.items.find(x=>x.id==="oneinch").iconFile,"app/browser/dapps/icons/oneinch.svg");
 for(const x of catalog.items)assert.ok(x.icon&&x.icon.mark.length>0);
 for(const f of ["pancake.svg","oneinch.svg"]){const svg=fs.readFileSync(path.join(root,"app/browser/dapps/icons",f),"utf8");assert.match(svg,/width="96" height="96"/)}
 assert.match(ui,/tz-dapp-fallback/);assert.match(ui,/addEventListener\("error"/);
});
test("address search offers an Open row and Enter opens the browser",()=>{
 assert.match(ui,/function dappIsAddress/);assert.match(ui,/Open '\+esc\(url\)/);assert.match(ui,/e\.target\.id!=="tzDappSearchForm"/);
 assert.match(ui,/S\.tab="brw";S\.dappChainPickerOpen=false;brwOpen\(u\)/);
});
test("chain selector persists all, BNB and Shardeum selections",()=>{
 assert.ok(ui.includes('lss("dappSelectedChain",t.getAttribute("data-chain-select"))'));
 assert.match(ui,/data-chain-select=/);assert.match(ui,/role="dialog" aria-modal="true"/);
});
test("mobile and desktop dApps styles are independently loaded and motion is accessible",()=>{
 const index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
 assert.match(index,/dapps-mobile\.css/);assert.match(index,/dapps-desktop\.css/);assert.doesNotMatch(index,/dapps-catalog\.css/);
 for(const f of ["dapps-mobile.css","dapps-desktop.css"]){const css=fs.readFileSync(path.join(root,"app/features/browser",f),"utf8");assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/translateY\(8px\)/);assert.match(css,/scale\(\.97\)/)}
 assert.match(sw,/dapps\/icons\/pancake\.svg/);assert.match(sw,/dapps-desktop\.css/);
});
test("unsafe protocols are rejected by the existing browser URL gate",()=>{
 const browser=fs.readFileSync(path.join(root,"app/browser/browser.js"),"utf8");
 assert.match(browser,/u\.protocol!=="http:"/);assert.match(browser,/u\.protocol!=="https:"/);
});
