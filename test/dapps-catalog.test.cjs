"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),ui=fs.readFileSync(path.join(root,"app/browser/dapps/dapps.js"),"utf8"),catalog=JSON.parse(fs.readFileSync(path.join(root,"app/browser/dapps/catalog.json"),"utf8"));
test("dApps uses one compact header, a list-first layout and a working chain selector",()=>{
 assert.match(ui,/<h1>dApps<\/h1>/);assert.match(ui,/data-chain-toggle="1"/);assert.match(ui,/id="tzDappSearch"/);
 assert.doesNotMatch(ui,/Tazvera dApps|tz-browser-toolbar|data-dapp-back|data-dapp-forward|BOOKMARKS|FEATURED|POPULAR/);
 assert.match(ui,/ALL DAPPS/);
});
test("all verified domains use safe letter fallbacks unless official images are verified",()=>{
 assert.equal(catalog.items.length,6);for(const x of catalog.items)assert.ok(x.icon&&x.icon.mark.length>0);
 assert.match(ui,/var file=""/);assert.match(ui,/tz-dapp-fallback/);assert.match(ui,/addEventListener\("load"/);assert.match(ui,/addEventListener\("error"/);
});
test("address search offers a direct open row and Enter opens it",()=>{
 assert.match(ui,/function dappIsAddress/);assert.match(ui,/Open '\+esc\(url\)/);assert.match(ui,/brwLaunch\(u\)/);
});
test("chain selector persists All, BNB Chain and Shardeum",()=>{
 assert.ok(ui.includes('lss("dappSelectedChain",t.getAttribute("data-chain-select"))'));assert.match(ui,/data-chain-select=/);assert.match(ui,/role="dialog" aria-modal="true"/);
});
test("responsive dApps styles remain independently loaded and motion is accessible",()=>{
 const index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
 assert.match(index,/dapps-mobile\.css/);assert.match(index,/dapps-desktop\.css/);
 for(const f of ["dapps-mobile.css","dapps-desktop.css"]){const css=fs.readFileSync(path.join(root,"app/features/browser",f),"utf8");assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/translateY\(8px\)/);assert.match(css,/scale\(\.97\)/);assert.match(css,/height:72px/);assert.match(css,/object-fit:contain/)}
 assert.match(sw,/dapps-desktop\.css/);
});
test("no false connected status, legacy toolbar or old Pancake domain remains",()=>{
 const browser=fs.readFileSync(path.join(root,"app/browser/browser.js"),"utf8");
 assert.match(browser,/pancake\.xyz/);assert.doesNotMatch(browser,/pancakeswap\.finance|brwtb|Wallet connected/);
 assert.match(browser,/Wallet not connected/);assert.match(browser,/वॉलेट किसी site से जुड़ा नहीं है/);
});
test("dApps is the initial and first nav tab; Explore has no Browser shortcut",()=>{
 const config=fs.readFileSync(path.join(root,"app/js/00-config.js"),"utf8"),core=fs.readFileSync(path.join(root,"app/js/02-core.js"),"utf8"),explore=fs.readFileSync(path.join(root,"app/js/24-explore.js"),"utf8");
 assert.match(config,/tab:"dapps"/);assert.ok(core.indexOf('tb("dapps"')<core.indexOf('tb("home"'));assert.doesNotMatch(explore,/brwrow/);
});
