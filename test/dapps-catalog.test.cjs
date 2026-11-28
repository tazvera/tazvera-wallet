"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8"),ui=read("app/browser/dapps/dapps.js"),catalog=JSON.parse(read("app/browser/dapps/catalog.json"));
test("dApps is in the second nav slot and has working chain/address controls",()=>{
 const config=read("app/js/00-config.js");assert.match(config,/tab:"home"/);
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
 assert.match(mobile,/\.nav \.nv span/);assert.match(app,/\.nav \.nv\.on/);assert.match(app,/\.aifab\{bottom:calc\(94px/);
});
test("logo initials remain until load succeeds and missing images restore initials",()=>{
 for(const f of ["app/features/browser/dapps-mobile.css","app/features/browser/dapps-desktop.css"]){const css=read(f);assert.match(css,/\.tz-dapp-mark \.tz-dapp-logo/);assert.match(css,/\.tz-dapp-mark\.has-logo \.tz-dapp-logo\{opacity:1\}/);assert.match(css,/\.tz-dapp-mark\.has-logo \.tz-dapp-fallback\{display:none\}/);assert.match(css,/object-fit:contain/);assert.match(css,/height:40px/);assert.match(css,/min-height:56px/);assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/translateY\(8px\)/);assert.match(css,/scale\(\.97\)/);assert.match(css,/animation-delay:30ms/)}
});
test("mobile and desktop dApps styles remain separately loaded and compact",()=>{
 const m=read("app/features/browser/dapps-mobile.css"),d=read("app/features/browser/dapps-desktop.css"),index=read("index.html"),sw=read("sw.js");
 assert.match(index,/dapps-mobile\.css/);assert.match(index,/dapps-desktop\.css/);assert.match(d,/@media\(min-width:900px\)/);
 assert.match(m,/padding:6px 20px 40px/);assert.match(m,/height:72px/);assert.match(m,/font:500 16px\/1.2/);assert.match(m,/font:400 12px/);assert.match(sw,/tazvera-v9-104/);
});
test("false connected status, legacy browser toolbar and old Pancake domain stay absent",()=>{
 const browser=read("app/browser/browser.js");assert.match(browser,/pancake\.xyz/);assert.doesNotMatch(browser,/pancakeswap\.finance|brwtb|Wallet connected/);assert.match(browser,/Wallet not connected/);
});
test("Explore contains tools and market prices, not the old Browser shortcut",()=>assert.doesNotMatch(read("app/js/24-explore.js"),/brwrow|Browser/));

test("dApp rows and the WalletConnect status line are not selectable text, and each state has its own colour", () => {
  const css = fs.readFileSync(path.join(__dirname, "..", "app/css/app.css"), "utf8");
  assert.match(css, /button,\[role="button"\],\[data-dapp-open\],\.tz-dapp-row\{-webkit-user-select:none;user-select:none/);
  assert.match(css, /\.tz-wc-status\{[^}]*color:#7d848c/);
  assert.match(css, /\.tz-wc-status\[data-state="connected"\]\{color:#1f9d55\}/);
  assert.match(css, /\.tz-wc-status\[data-state="failed"\]\{color:#d64545\}/);
});

test("the three named dApps are in the catalog as verified, with a domain and a network", () => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "app/browser/dapps/catalog.json"), "utf8"));
  for (const id of ["pancake", "venus", "oneinch"]) {
    const x = data.items.find(i => i.id === id);
    assert.ok(x, id + " is listed");
    assert.equal(x.domainVerified, true, id + " domain verified");
    assert.match(x.domain, /^[a-z0-9.-]+\.[a-z]{2,}$/i, id + " has a valid domain");
    assert.ok(x.networks.length > 0, id + " has a network");
  }
});

test("the network picker is a small popover: icon-only button, no dialog, no dimmed page, closes on Escape and outside click", () => {
  const js = fs.readFileSync(path.join(__dirname, "..", "app/browser/dapps/dapps.js"), "utf8");
  const mob = fs.readFileSync(path.join(__dirname, "..", "app/features/browser/dapps-mobile.css"), "utf8");
  const desk = fs.readFileSync(path.join(__dirname, "..", "app/features/browser/dapps-desktop.css"), "utf8");
  assert.ok(!/tz-chain-backdrop|aria-modal="true"/.test(js.slice(js.indexOf("function dappChainPicker"), js.indexOf("function dappChainPicker") + 600)), "no full-screen sheet markup");
  assert.match(js, /aria-haspopup="listbox"/);
  assert.match(js, /role="listbox"/);
  assert.match(js, /aria-label="'\+esc\(chainName\(chain\)\)\+'"/, "trigger has the network name for screen readers");
  assert.match(js, /chainIcon\(chain,24\)/, "trigger shows the chain icon at 24px");
  assert.match(js, /chainIcon\(v,20\)/, "list rows show the icon at 20px");
  assert.match(js, /aria-selected=/);
  assert.match(js, /logos\/chains\//, "chain logos come from logos/chains/");
  assert.match(js, /e\.key==="Escape"/);
  assert.match(js, /closest\(["']\.tz-chain-wrap["']\)/, "outside click closes via the wrapper");
  for (const css of [mob, desk]) {
    assert.match(css, /\.scr\.tab-brw \.tz-chain-pop\{[^}]*width:200px/);
    assert.match(css, /\.scr\.tab-brw \.tz-chain-opt\{[^}]*height:40px/);
  }
});

const vm = require("node:vm");
test("chain icon order: local file, then the default (BNB: CoinGecko; Shardeum: app/img/shm.png), then the letter", () => {
  const js = fs.readFileSync(path.join(__dirname, "..", "app/browser/dapps/dapps.js"), "utf8");
  const mob = fs.readFileSync(path.join(__dirname, "..", "app/features/browser/dapps-mobile.css"), "utf8");
  const desk = fs.readFileSync(path.join(__dirname, "..", "app/features/browser/dapps-desktop.css"), "utf8");
  const grab = name => { const a = js.indexOf("function " + name + "("); let i = js.indexOf("{", a), d = 0; for (; i < js.length; i++) { if (js[i] === "{") d++; else if (js[i] === "}") { d--; if (d === 0) break } } return js.slice(a, i + 1) };
  const src = ["var CHAIN_LOGO={};", grab("chainName"), grab("chainLogoSources"), grab("chainLogoCheck"), grab("chainIcon")].join("\n");
  const BNB_CG = "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png";
  function sandbox(available) {
    const tried = [];
    const ctx = {
      CG: { BNB: BNB_CG }, SHMLOGO: "app/img/shm.png", esc: x => String(x), render() {}, console,
      Image: function () { const im = {}; Object.defineProperty(im, "src", { set(u) { tried.push(u); if (available.indexOf(u) >= 0) { im.onload && im.onload() } else { im.onerror && im.onerror() } } }); return im },
    };
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return { ctx, tried };
  }
  // nothing loads: letters, and each chain tried its sources in order
  let r = sandbox([]);
  assert.match(r.ctx.chainIcon("bsc", 24), /tz-chain-letter/);
  assert.match(r.ctx.chainIcon("bsc", 24), />B</);
  assert.match(r.ctx.chainIcon("shardeum", 24), />S</);
  assert.deepEqual(r.tried, ["app/browser/layout/logos/chains/bnb-chain.svg", BNB_CG, "app/browser/layout/logos/chains/shardeum.svg", "app/img/shm.png"]);
  // a local file added later wins over CoinGecko
  r = sandbox(["app/browser/layout/logos/chains/bnb-chain.svg", BNB_CG]);
  assert.match(r.ctx.chainIcon("bsc", 24), /background-image:url\(app\/browser\/layout\/logos\/chains\/bnb-chain\.svg\)/);
  // no local file: CoinGecko's BNB icon
  r = sandbox([BNB_CG]);
  assert.match(r.ctx.chainIcon("bsc", 24), /background-image:url\(https:\/\/assets\.coingecko\.com\/coins\/images\/825\/small\/bnb-icon2_2x\.png\)/);
  // Shardeum uses the file already in the repo
  r = sandbox(["app/img/shm.png"]);
  assert.match(r.ctx.chainIcon("shardeum", 24), /background-image:url\(app\/img\/shm\.png\)/);
  // each file is checked once, however often the icon is drawn
  r = sandbox([]);
  r.ctx.chainIcon("bsc", 24); r.ctx.chainIcon("bsc", 24);
  assert.equal(r.tried.length, 2);
  // no dimming layer left
  assert.equal(/tz-chain-backdrop/.test(js) || /tz-chain-backdrop/.test(mob) || /tz-chain-backdrop/.test(desk), false, "no backdrop left");
});
