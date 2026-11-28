"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8"),ui=read("app/browser/dapps/dapps.js"),catalog=JSON.parse(read("app/browser/dapps/catalog.json"));
test("dApps is the first app screen and has working chain/address controls",()=>{
 const config=read("app/js/00-config.js");assert.match(config,/tab:"dapps"/);
 assert.match(ui,/<h1>dApps<\/h1>/);assert.match(ui,/data-chain-toggle="1"/);assert.match(ui,/id="tzDappSearch"/);
 assert.match(ui,/data-chain-select=/);assert.match(ui,/lss\("dappSelectedChain"/);assert.match(ui,/data-dapp-address=/);assert.match(ui,/brwLaunch\(u\)/);
});
test("catalog references only real repository logo assets; missing official marks remain initials",()=>{
 const map={pancake:"pancakeswap.finance.png",oneinch:"app.1inch.io.png",venus:"venus.io.png","shardeum-dashboard":"dashboard.shardeum.org.png"};
 for(const x of catalog.items){if(map[x.id]){assert.equal(x.iconFile,"app/browser/layout/logos/"+map[x.id]);assert.ok(fs.existsSync(path.join(root,x.iconFile)))}else assert.equal(x.iconFile,undefined)}
 for(const p of ["app/browser/layout/logos/app.uniswap.org.png","app/browser/layout/logos/curve.fi.png","app/browser/layout/logos/bscscan.com.png","app/browser/layout/logos/etherscan.io.png","app/browser/layout/logos/opensea.io.png","app/browser/layout/logos/aave.com.png"])assert.ok(fs.existsSync(path.join(root,p)));
 assert.match(ui,/tz-dapp-mark/);assert.match(ui,/tz-dapp-logo/);assert.match(ui,/addEventListener\("load"/);assert.match(ui,/addEventListener\("error"/);
});
test("desktop sidebar and mobile bottom bar use stable nav class and required order",()=>{
 const core=read("app/js/02-core.js"),mobile=read("app/layout/mobile.css"),desktop=read("app/features/nav/nav-desktop.css"),app=read("app/css/app.css");
 assert.match(core,/<nav class="nav">/);assert.doesNotMatch(core,/<nav class="nav n[0-9]+">/);
 const order=['tb("home"','tb("dapps"','tb("exp"','tb("helpc"','data-notif="1"','data-scan="1"','data-tab="set"','data-ai="1"'];let last=-1;
 for(const token of order){const i=core.indexOf(token);assert.ok(i>last,"nav order: "+token);last=i}
 assert.match(desktop,/@media \(min-width: 900px\)/);assert.match(desktop,/\.nav\s*\{/);assert.doesNotMatch(desktop,/\.nav\.n3/);
 assert.match(mobile,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);assert.match(mobile,/\.nav \.nv-extra,.nav \.nv-ai\{display:none/);
 assert.match(mobile,/\.nav \.nv span/);assert.match(app,/\.nav \.nv\.on/);
});
test("logo initials remain until load succeeds and missing images restore initials",()=>{
 for(const f of ["app/features/browser/dapps-mobile.css","app/features/browser/dapps-desktop.css"]){const css=read(f);assert.match(css,/\.tz-dapp-mark \.tz-dapp-logo/);assert.match(css,/\.tz-dapp-mark\.has-logo \.tz-dapp-logo\{opacity:1\}/);assert.match(css,/\.tz-dapp-mark\.has-logo \.tz-dapp-fallback\{display:none\}/);assert.match(css,/object-fit:contain/);assert.match(css,/height:40px/);assert.match(css,/min-height:56px/);assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/translateY\(8px\)/);assert.match(css,/scale\(\.97\)/);assert.match(css,/animation-delay:30ms/)}
});
test("mobile and desktop dApps styles remain separately loaded and compact",()=>{
 const m=read("app/features/browser/dapps-mobile.css"),d=read("app/features/browser/dapps-desktop.css"),index=read("index.html"),sw=read("sw.js");
 assert.match(index,/dapps-mobile\.css/);assert.match(index,/dapps-desktop\.css/);assert.match(d,/@media\(min-width:900px\)/);
 assert.match(m,/padding:6px 20px 40px/);assert.match(m,/height:72px/);assert.match(m,/font:500 16px\/1.2/);assert.match(m,/font:400 12px/);assert.match(sw,/tazvera-v9-100/);
});
test("false connected status, legacy browser toolbar and old Pancake domain stay absent",()=>{
 const browser=read("app/browser/browser.js");assert.match(browser,/pancake\.xyz/);assert.doesNotMatch(browser,/pancakeswap\.finance|brwtb|Wallet connected/);assert.match(browser,/Wallet not connected/);
});
test("Explore contains tools and market prices, not the old Browser shortcut",()=>assert.doesNotMatch(read("app/js/24-explore.js"),/brwrow|Browser/));
