"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "app/browser/dapps/catalog.json"), "utf8"));
const ui = fs.readFileSync(path.join(root, "app/browser/dapps/dapps.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

test("Explore Browser card opens the dApps screen while legacy browser remains separate", () => {
  const explore = fs.readFileSync(path.join(root, "app/js/24-explore.js"), "utf8");
  const renderBoot = fs.readFileSync(path.join(root, "app/js/30-render-boot.js"), "utf8");
  assert.match(explore, /class="brwrow" data-tab="dapps"/);
  assert.match(renderBoot, /dapps:dappsHTML/);
  assert.match(renderBoot, /brw:browserHTML/);
  assert.match(ui, /function dappsHTML\(\)/);
  assert.match(ui, /data-tab="exp" aria-label="Back to Explore"/);
});

test("dApps catalogue is limited to BNB Chain and Shardeum", () => {
  assert.equal(catalog.schemaVersion, 1);
  assert.ok(catalog.items.length >= 5);
  const visible = catalog.items.filter(x => x.walletConnectSupport === "confirmed");
  assert.equal(visible.length, 3);
  assert.ok(visible.every(x => x.networks.every(n => n === "bsc")));
  for (const item of catalog.items) {
    assert.ok(item.networks.length > 0);
    assert.ok(item.networks.every(n => ["bsc", "shardeum"].includes(n)), item.id);
    assert.match(item.domain, /^[a-z0-9.-]+\.[a-z]{2,}$/i);
    assert.equal(typeof item.domainVerified, "boolean");
    assert.match(item.domainVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.domainVerificationSource.length > 0);
    assert.ok(item.verification.sourceUrls.length > 0);
    assert.equal(item.securityAudit, "not-verified");
    assert.equal(item.verification.checkedBy, "ChatGPT-assisted official-source review");
    assert.equal(item.verification.checkedAt, "2026-11-28");
    assert.ok(["confirmed", "unconfirmed"].includes(item.walletConnectSupport));
  }
});

test("only confirmed apps are bookmarked and all icons are self-generated", () => {
  assert.equal(catalog.items.filter(x => x.bookmark).length, 3);
  assert.ok(catalog.items.filter(x => x.walletConnectSupport === "unconfirmed").every(x => !x.bookmark && !x.featured && !x.popular));
  for (const item of catalog.items) {
    assert.match(item.icon.color, /^#[0-9a-f]{6}$/i);
    assert.ok(["circle", "rounded-square"].includes(item.icon.shape));
    assert.ok(item.icon.mark.length > 0 && item.icon.mark.length <= 2);
    assert.equal("image" in item.icon, false);
    assert.equal("logo" in item, false);
  }
  assert.doesNotMatch(ui, /<img\b|background-image\s*:/i);
  assert.doesNotMatch(ui, /\bstyle\s*=/i);
  assert.doesNotMatch(ui, /window\.open|TazveraBrowser\.open|signSheet|@walletconnect|WalletConnectProvider|WalletConnectModal/i);
});

test("catalogue JSON and UI are loaded from the same origin and cached offline", () => {
  assert.match(ui, /fetch\("\/app\/browser\/dapps\/catalog\.json"/);
  assert.match(ui, /x\.walletConnectSupport==="confirmed"/);
  assert.match(ui, /function dappDomainStatus\(x\)/);
  assert.match(ui, /Domain not verified/);
  assert.match(index, /app\/browser\/dapps\/dapps\.js/);
  assert.match(serviceWorker, /\/app\/browser\/dapps\/catalog\.json/);
  assert.match(serviceWorker, /\/app\/browser\/dapps\/dapps\.js/);
});

test("dApp entries, Open buttons and bookmarks open the catalog domain without wallet signing", () => {
  assert.match(ui, /data-dapp-open=/);
  assert.match(ui, /function dappOpenById\(id\)/);
  assert.match(ui, /brwOpen\(item\.domain\)/);
  assert.match(ui, /class="tz-open-inert" type="button" data-dapp-open=/);
  assert.match(ui, /class="tz-bookmark" data-dapp-open=/);
  const dappsCss=fs.readFileSync(path.join(root,"app/features/browser/dapps-catalog.css"),"utf8");
  assert.match(dappsCss, /user-select:none/);
  assert.match(dappsCss, /min-height:340px/);
  assert.doesNotMatch(ui, /signSheet|@walletconnect|WalletConnectProvider|WalletConnectModal/i);
  const vm=require("node:vm"), opened=[], messages=[];
  const sandbox={toast:m=>messages.push(m),brwOpen:u=>opened.push(u),document:{addEventListener(){}},S:{}};
  vm.createContext(sandbox); vm.runInContext(ui,sandbox);
  sandbox.TAZVERA_DAPPS=[{id:"pancake",domain:"pancake.xyz"}];
  vm.runInContext('dappOpenById("pancake")',sandbox);
  vm.runInContext('dappOpenById("missing")',sandbox);
  sandbox.TAZVERA_DAPPS[0].domain="javascript:alert(1)";
  vm.runInContext('dappOpenById("pancake")',sandbox);
  assert.deepEqual(opened,["pancake.xyz"]);
  assert.deepEqual(messages,["Invalid dApp URL.","Invalid dApp URL."]);
});

test("dApps address and toolbar controls are wired",()=>{
  assert.match(ui,/id="tzDappAddressForm"/);assert.match(ui,/id="tzDappAddress"/);
  for(const attr of ["back","forward","tabs","bookmark","menu"])assert.match(ui,new RegExp("data-dapp-"+attr+"="));
  assert.match(ui,/brwBack\(\)/);assert.match(ui,/brwForward\(\)/);assert.match(ui,/brwOpen\(shortcut\?shortcut\.url:value\)/);
  assert.doesNotMatch(ui,/WalletConnectProvider|WalletConnectModal|signSheet/i);
});
test("browser URL normalization and app history",()=>{
  const vm=require("node:vm"),opened=[],messages=[],browser=fs.readFileSync(path.join(root,"app/browser/browser.js"),"utf8");
  const sandbox={S:{brw:{url:"",hist:[],idx:-1}},URL,toast:m=>messages.push(m),t:k=>k,render:()=>{},window:{TazveraBrowser:{open:u=>opened.push(u)},open:u=>opened.push(u)},console};
  sandbox.window.window=sandbox.window;vm.createContext(sandbox);vm.runInContext(browser,sandbox);
  vm.runInContext('brwOpen("pancakeswap.finance/swap?foo=1")',sandbox);vm.runInContext('brwOpen("trx.forsage.io")',sandbox);
  vm.runInContext('brwBack()',sandbox);vm.runInContext('brwForward()',sandbox);vm.runInContext('brwOpen("javascript:alert(1)")',sandbox);
  assert.deepEqual(opened,["https://pancakeswap.finance/swap?foo=1","https://trx.forsage.io/","https://pancakeswap.finance/swap?foo=1","https://trx.forsage.io/"]);
  assert.deepEqual(messages,["brwBad"]);assert.equal(sandbox.S.brw.url,"https://trx.forsage.io/");
});
test("legacy browser opener remains separate and rejects invalid URLs", () => {
  const vm = require("node:vm");
  const browser = fs.readFileSync(path.join(root, "app/browser/browser.js"), "utf8");
  const calls = { toast: [], bridgeOpen: [], windowOpen: [], render: 0 };
  const sandbox = {
    S: { brw: { url: "", hist: [], idx: -1 }, tab: "dapps" },
    toast: (m) => calls.toast.push(m),
    render: () => { calls.render++; },
    t: (k) => k,
    esc: (v) => String(v),
    document: { addEventListener() {}, getElementById() { return null; }, querySelector() { return null; } },
    window: {
      TazveraBrowser: { open: (u) => calls.bridgeOpen.push(u) },
      open: (u) => calls.windowOpen.push(u)
    },
    console
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(browser + "\n" + ui, sandbox);

  vm.runInContext('brwOpen("javascript:alert(1)")', sandbox);

  assert.deepEqual(calls.toast, ["brwBad"]);
  assert.deepEqual(calls.bridgeOpen, []);
  assert.deepEqual(calls.windowOpen, []);
  assert.equal(sandbox.S.brw.hist.length, 0);
  assert.equal(sandbox.S.brw.url, "");
  assert.equal(calls.render, 0);
});

test("dApps chain selector filters all sections and persists selection",()=>{
  assert.match(ui,/data-chain-toggle="1"/);
  assert.match(ui,/data-chain-select=/);
  assert.match(ui,/lss\("dappSelectedChain",target\.getAttribute\("data-chain-select"\)\)/);
  assert.match(ui,/function dappSelectedChain\(\)/);
  assert.match(ui,/x\.networks\.indexOf\(selectedChain\)>=0/);
  assert.match(ui,/function dappChainCount\(chain\)/);
  assert.match(ui,/dappChainPicker\(\)/);
  assert.match(ui,/role="dialog" aria-modal="true"/);
  const css=fs.readFileSync(path.join(root,"app/features/browser/dapps-catalog.css"),"utf8");
  assert.match(css,/\.tz-chain-backdrop/);
  assert.match(css,/align-items:flex-end/);
});
