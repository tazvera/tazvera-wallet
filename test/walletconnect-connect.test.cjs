/* Tazvera wallet · WalletConnect step 1 (connection only) — static checks.
   Run with: node --test test/walletconnect-connect.test.cjs
   These checks make sure step 1 stays small: the big bundle is never in index.html,
   it is loaded only from the dApps screen, the feature stays behind a flag that is
   off by default, and no signing or request code has crept in. */
"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

const connect = read("app/walletconnect/connect.js");
const index = read("index.html");
const sw = read("sw.js");
const dapps = read("app/browser/dapps/dapps.js");

test("the WalletKit bundle is not in index.html (loads only from the dApps screen)", () => {
  assert.ok(!index.includes("tazvera-walletkit.js"), "bundle must not be a script tag in index.html");
});

test("connect.js is loaded by index.html, after config.js", () => {
  const cfg = index.indexOf("app/walletconnect/config.js");
  const con = index.indexOf("app/walletconnect/connect.js");
  assert.ok(cfg > -1 && con > cfg, "connect.js must come after config.js");
});

test("the service worker precaches connect.js but not the bundle", () => {
  assert.ok(sw.includes('"/app/walletconnect/connect.js"'), "connect.js must be in the precache list");
  assert.ok(!sw.includes("tazvera-walletkit.js"), "bundle must not be precached until it is needed");
});

test("the feature flag is off by default", () => {
  assert.match(connect, /function wcOn\(\)\s*\{[^}]*tz_wc_on[^}]*===\s*"1"/, "wcOn must be true only when tz_wc_on === \"1\"");
});

test("the dApps screen starts the connection and shows the status line", () => {
  assert.match(dapps, /function dappsHTML\(\)\{\s*wcStart\(\);/, "dappsHTML must call wcStart()");
  assert.ok(dapps.includes("wcStatusHTML()"), "dappsHTML must render wcStatusHTML()");
});

test("connection step has no signing, request or key code", () => {
  const banned = [
    "eth_sign", "personal_sign", "eth_sendTransaction", "sendTransaction",
    "respondSessionRequest", "approveProposal",
    "signTypedData", "privateKey", "fromPhrase", "mnemonic", "seed",
  ];
  for (const word of banned) {
    assert.ok(!connect.includes(word), `connect.js must not contain "${word}" in step 1`);
  }
  assert.ok(!/session_request/.test(connect), "connect.js must not handle session requests");
});

test("the status labels are the agreed three Hindi lines", () => {
  assert.ok(connect.includes("जुड़ रहा है"), "connecting label");
  assert.ok(connect.includes("जुड़ गया"), "connected label");
  assert.ok(connect.includes("नहीं जुड़ा"), "failed label");
});

test("the status line has an accessible live region", () => {
  assert.ok(connect.includes('role="status"') && connect.includes('aria-live="polite"'));
});

test("the CSP does not allow WalletConnect telemetry (pulse)", () => {
  assert.ok(!index.includes("pulse.walletconnect"), "telemetry host must not be in the CSP (privacy: no user data leaves the phone)");
});

/* ---- step 2: session approval, tested with the real connect.js in a sandbox ---- */
const vm = require("vm");
function loadConnect(extra) {
  const calls = { reject: [], approve: [], sheets: 0, toasts: [] };
  const store = {};
  const ctx = Object.assign({
    console, Promise, Date, Math, JSON, String, Object, Array, Number, Error,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) } },
    L: { en: {}, hi: {} }, t: k => k, esc: x => String(x),
    beta: () => false, toast: m => calls.toasts.push(m), sheet: () => { calls.sheets++ }, closeSheet() {},
    $: () => ({ onclick: null }), document: { getElementById: () => null },
    CPW: { unlocked: () => true, address: () => "0x1111111111111111111111111111111111111111" },
  }, extra || {});
  vm.createContext(ctx);
  vm.runInContext(connect, ctx);
  // connect.js declares WC_KIT itself, so the stub is attached after it loads
  ctx.WC_KIT = {
    rejectSession: a => { calls.reject.push(a) },
    approveSession: a => { calls.approve.push(a); return Promise.resolve() },
  };
  return { ctx, calls };
}
const ADDR = "0x1111111111111111111111111111111111111111";
test("a BSC proposal gets an approval with only BSC, the address, and no methods", () => {
  const { ctx } = loadConnect();
  const ns = ctx.wcBuildNamespaces({ requiredNamespaces: { eip155: { chains: ["eip155:56"] } } }, ADDR);
  assert.equal(JSON.stringify(ns), JSON.stringify({ eip155: { chains: ["eip155:56"], accounts: ["eip155:56:" + ADDR], methods: [], events: [] } }));
});

test("unknown chains are dropped; if nothing usable is left the result is null", () => {
  const { ctx } = loadConnect();
  assert.equal(ctx.wcBuildNamespaces({ requiredNamespaces: { eip155: { chains: ["eip155:999"] } } }, ADDR), null);
});

test("Shardeum Mainnet is offered only when mainnet is switched on", () => {
  const off = loadConnect({ beta: () => false }).ctx;
  assert.equal(off.wcBuildNamespaces({ requiredNamespaces: { eip155: { chains: ["eip155:8118"] } } }, ADDR), null);
  const on = loadConnect({ beta: () => true }).ctx;
  assert.ok(on.wcBuildNamespaces({ requiredNamespaces: { eip155: { chains: ["eip155:8118"] } } }, ADDR));
});

test("a proposal while the wallet is locked is rejected, not shown", () => {
  const { ctx, calls } = loadConnect({ CPW: { unlocked: () => false, address: () => ADDR } });
  ctx.wcOnProposal({ id: 7, params: { id: 7, requiredNamespaces: { eip155: { chains: ["eip155:56"] } } } });
  assert.equal(calls.reject.length, 1);
  assert.equal(calls.reject[0].id, 7);
  assert.equal(calls.sheets, 0);
});

test("a proposal while unlocked opens the approval sheet and rejects on request", () => {
  const { ctx, calls } = loadConnect();
  ctx.wcOnProposal({ id: 9, params: { id: 9, proposer: { metadata: { name: "Demo", url: "https://demo.example" } }, requiredNamespaces: { eip155: { chains: ["eip155:56"] } } } });
  assert.equal(calls.sheets, 1);
  assert.equal(calls.approve.length, 0, "nothing is approved until the user taps Connect");
});
