#!/usr/bin/env node
/* Tazvera wallet · test/run.js
   A dependency-free test runner. It loads the real app files into a small sandbox and
   checks the parts that decide money: amount parsing, fee maths, the Shield address
   checks, the backup password rules and the translation table. It also runs a static
   audit of the repository (references, CSP, inline handlers, key parity).

   Run it with:  node test/run.js
   Exit code 0 = everything passed. Non-zero = something is broken, and it says what. */

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
let pass = 0, fail = 0, failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; return; }
  fail++; failures.push(name + (detail ? "  → " + detail : ""));
}
function eq(name, got, want) {
  ok(name, Object.is(got, want) || String(got) === String(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}

/* ------------------------------------------------------------------ sandbox */
function makeContext() {
  const store = {};
  const el = () => ({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    appendChild() {}, remove() {}, setAttribute() {}, getAttribute: () => null,
    querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
    insertAdjacentHTML() {}, focus() {}, select() {}, after() {}, value: "", innerHTML: "", textContent: ""
  });
  const ctx = {
    console, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    Promise, Math, Date, JSON, BigInt, Number, String, Object, Array, RegExp, Error,
    Uint8Array, TextEncoder: global.TextEncoder, URLSearchParams, Intl,
  };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  ctx.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
  ctx.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  ctx.navigator = { onLine: true, language: "en-IN" };
  ctx.location = { hostname: "localhost", protocol: "https:", search: "" };
  ctx.document = {
    documentElement: { setAttribute() {}, lang: "en" },
    body: { appendChild() {}, classList: { add() {}, remove() {} } },
    createElement: el, getElementById: () => null, querySelector: () => null,
    querySelectorAll: () => [], addEventListener() {}, hidden: false,
  };
  ctx.fetch = () => Promise.reject(new Error("offline in tests"));
  ctx.matchMedia = () => ({ matches: false });
  ctx.addEventListener = () => {};
  ctx.removeEventListener = () => {};
  ctx.dispatchEvent = () => true;
  ctx.scrollTo = () => {};
  ctx.open = () => null;
  /* stand-ins for the two ethers helpers the amount code needs. Kept deliberately small:
     the tests check Tazvera's own logic, not ethers itself. */
  ctx.ethers = {
    parseUnits: (v, d) => {
      const [i, f = ""] = String(v).split(".");
      if (f.length > d) throw new Error("too many decimals");
      return BigInt((i || "0") + f.padEnd(d, "0"));
    },
    formatUnits: (w, d) => {
      const s = w.toString().padStart(d + 1, "0");
      const i = s.slice(0, s.length - d), f = s.slice(s.length - d).replace(/0+$/, "");
      return f ? `${i}.${f}` : i;
    },
    getAddress: a => a,
  };
  vm.createContext(ctx);
  return ctx;
}

/* load only the files that define pure logic; UI and boot files are skipped */
const FILES = [
  "app/browser/networks/networks.js", "app/js/00-config.js", "app/js/01-i18n.js", "app/js/02-core.js", "app/js/10-send.js",
  "app/js/20-faucet-security.js", "app/js/22-wallets-help-backup.js",
  "app/js/26-v8-trust.js", "app/js/28-backup.js", "app/js/features/pin-change-wallets.js", "app/browser/browser.js", "app/browser/signing/signing.js", "app/browser/sites/connected-sites.js",
];
const ctx = makeContext();
/* a few files wrap a function that another file defines (createFlow lives in 13-lock-onboarding,
   welHTML in 30-render-boot). Those two files boot the UI, so we stub the names instead. */
for (const name of ["createFlow", "importFlow", "welHTML", "homeHTML", "lockScreen", "pinScreen",
                    "bkSheet", "wSheet", "wSwitch", "doSend", "go", "openConfirm", "shield",
                    "pinPad2", "askPin", "newPinFlow", "checkNet", "render", "load"])
  ctx[name] = function () {};
const loaded = [];
for (const f of FILES) {
  try {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
    loaded.push(f);
  } catch (e) {
    ok("load " + f, false, e.message);
  }
}

/* ------------------------------------------------------------------ 1. amounts */
const amtWei = ctx.amtWei, exactAmt = ctx.exactAmt;
ok("amtWei exists", typeof amtWei === "function");
if (typeof amtWei === "function") {
  eq("1 SHM in wei", amtWei("1", 18).toString(), "1000000000000000000");
  eq("0.5 SHM in wei", amtWei("0.5", 18).toString(), "500000000000000000");
  eq("leading dot .5", amtWei(".5", 18).toString(), "500000000000000000");
  eq("18 decimals exactly", amtWei("0.000000000000000001", 18).toString(), "1");
  eq("19 decimals is refused", amtWei("0.0000000000000000001", 18), null);
  eq("letters refused", amtWei("1a", 18), null);
  eq("empty refused", amtWei("", 18), null);
  eq("zero refused", amtWei("0", 18), null);
  eq("negative refused", amtWei("-1", 18), null);
  eq("spaces around are fine", amtWei(" 2 ", 18).toString(), "2000000000000000000");
  eq("6-decimal token", amtWei("1.123456", 6).toString(), "1123456");
  eq("7 decimals on a 6-decimal token refused", amtWei("1.1234567", 6), null);
}

if (typeof exactAmt === "function") {
  eq("exactAmt keeps the number", exactAmt("1234.5").replace(/\u200f|\u200e/g, "").includes("1,234"), true, exactAmt("1234.5"));
  eq("exactAmt drops trailing zeros", exactAmt("1.500").includes("1.5"), true, exactAmt("1.500"));
}

/* ------------------------------------------------------------------ 2. Shield */
const shield = ctx.shield;
if (typeof shield === "function") {
  ctx.S.snd.to = "0x0000000000000000000000000000000000000000";
  eq("burn address is blocked", shield().lvl, "bad");
  ctx.S.snd.to = "0x000000000000000000000000000000000000dEaD";
  eq("dead address is blocked", shield().lvl, "bad");
  ctx.S.snd.to = "0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73";
  eq("token contract is blocked", shield().lvl, "bad");
  ctx.S.snd.to = ctx.S.addr || "0x1111111111111111111111111111111111111111";
  ctx.S.addr = ctx.S.snd.to;
  eq("own address warns", shield().lvl, "warn");
  ctx.S.snd.to = "0x2222222222222222222222222222222222222222";
  eq("unknown address warns", shield().lvl, "warn");
}

/* ------------------------------------------------------------------ 3. backup password */
const wbkLevel = ctx.wbkLevel, wbkWhy = ctx.wbkWhy;
if (typeof wbkLevel === "function") {
  eq("short password refused", wbkLevel("abc"), 0);
  eq("digits only refused", wbkLevel("1234567890"), 0);
  eq("password containing the PIN refused", wbkLevel("123456abcd", "123456"), 0);
  ok("long mixed password accepted", wbkLevel("Kite-River-92") >= 2, "level " + wbkLevel("Kite-River-92"));
  ok("14+ mixed is strong", wbkLevel("Kite-River-92-X") === 3, "level " + wbkLevel("Kite-River-92-X"));
}
if (typeof wbkWhy === "function") {
  eq("mismatch is reported", wbkWhy("Kite-River-92", "Kite-River-93", ""), ctx.t("wbkSame"));
  eq("matching passwords pass", wbkWhy("Kite-River-92", "Kite-River-92", ""), "");
}

/* ------------------------------------------------------------------ 4. translations */
const L = ctx.L;
if (L) {
  const en = Object.keys(L.en), hi = L.hi ? Object.keys(L.hi) : [];
  const missingHi = en.filter(k => !(k in L.hi));
  eq("every English key has a Hindi key", missingHi.length, 0, missingHi.slice(0, 5).join(", "));
  eq("English and Hindi key counts match", en.length, hi.length);
  const emptyEn = en.filter(k => !String(L.en[k]).trim());
  eq("no empty English strings", emptyEn.length, 0, emptyEn.slice(0, 5).join(", "));
}

/* collect the translation keys from EVERY app file, not only the ones loaded above:
   many files add their strings with Object.assign(L.en, {...}) at the top. */
function assignBlocks(src) {
  const out = [];
  const re = /Object\.assign\(\s*L\.(en|hi)\s*,\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let i = re.lastIndex, depth = 1;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === '"' || c === "'") { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === "\\") i++; i++; } i++; continue; }
      if (c === "{") depth++; else if (c === "}") depth--;
      i++;
    }
    out.push({ lang: m[1], body: src.slice(re.lastIndex, i - 1) });
  }
  return out;
}
for (const [file, src] of walk(path.join(ROOT, "app")).map(f => [f, fs.readFileSync(f, "utf8")])) {
  for (const b of assignBlocks(src)) {
    try { vm.runInContext("Object.assign(L." + b.lang + ",{" + b.body + "})", ctx); }
    catch (e) { ok("read strings from " + path.basename(file), false, e.message); }
  }
}

/* every t("key") used in the app must exist */
const usedKeys = new Set();
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.js$/.test(e.name) && !/min\.js$|jsqr|qrcode/.test(e.name)) out.push(p);
  }
  return out;
}
for (const f of walk(path.join(ROOT, "app"))) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(/\bt\(\s*"([A-Za-z_$][\w$]*)"\s*\)/g)) usedKeys.add(m[1]);
}
const missingKeys = [...usedKeys].filter(k => L && !(k in L.en));
eq("every t() key used in the app is defined", missingKeys.length, 0, missingKeys.slice(0, 6).join(", "));

/* ------------------------------------------------------------------ 5. static audit */
const appHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const webHtml = fs.readFileSync(path.join(ROOT, "web/index.html"), "utf8");
const appJs = walk(path.join(ROOT, "app")).map(f => [f, fs.readFileSync(f, "utf8")]);
const allApp = appHtml + appJs.map(x => x[1]).join("\n") + fs.readFileSync(path.join(ROOT, "wallet.js"), "utf8");

ok("app page has a Content-Security-Policy", /Content-Security-Policy/i.test(appHtml));
ok("app CSP forbids inline script", /script-src 'self'(?!\s*'unsafe-inline')/.test(appHtml));
const allCode = allApp.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
eq("no inline onclick/onchange in the app", (allCode.match(/\son(?:click|change|submit)="/g) || []).length, 0);
eq("no eval in the app", (allApp.match(/\beval\s*\(|new Function\s*\(/g) || []).length, 0);
eq("no third-party script tags", (appHtml.match(/<script[^>]+src="https?:/g) || []).length, 0);

const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const hdrNames = vercel.headers[0].headers.map(h => h.key.toLowerCase());
for (const need of ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy"])
  ok("vercel.json sends " + need, hdrNames.includes(need));

const webVercel = JSON.parse(fs.readFileSync(path.join(ROOT, "web/vercel.json"), "utf8"));
const webHdr = webVercel.headers[0].headers.map(h => h.key.toLowerCase());
for (const need of ["content-security-policy", "strict-transport-security"])
  ok("web/vercel.json sends " + need, webHdr.includes(need));

/* every local file the pages ask for must exist */
function missingRefs(html, base) {
  const out = [];
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const r = m[1];
    if (/^(https?:|data:|#|mailto:)/.test(r)) continue;
    if (!fs.existsSync(path.join(base, r.split("?")[0]))) out.push(r);
  }
  return out;
}
eq("app page references only files that exist", missingRefs(appHtml, ROOT).length, 0, missingRefs(appHtml, ROOT).join(", "));
eq("web page references only files that exist", missingRefs(webHtml, path.join(ROOT, "web")).length, 0, missingRefs(webHtml, path.join(ROOT, "web")).join(", "));

/* the app's scripts must be loaded in dependency order: config, i18n, core before the rest */
const order = [...appHtml.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const idx = f => order.indexOf(f);
ok("app/js/00-config.js loads before 01-i18n.js", idx("app/js/00-config.js") < idx("app/js/01-i18n.js"));
ok("app/js/02-core.js loads before 10-send.js", idx("app/js/02-core.js") < idx("app/js/10-send.js"));
ok("features/send-safety.js loads after 10-send.js", idx("app/js/features/send-safety.js") > idx("app/js/10-send.js"));
ok("features/strong-lock.js loads after 13-lock-onboarding.js", idx("app/js/features/strong-lock.js") > idx("app/js/13-lock-onboarding.js"));

/* the service worker must cache every app script, or offline breaks silently */
const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
const core = JSON.parse((sw.match(/var CORE = (\[[\s\S]*?\]);/) || [])[1] || "[]");
const notCached = order.filter(f => !core.includes("/" + f));
eq("service worker caches every script the page loads", notCached.length, 0, notCached.join(", "));

/* the landing page must not go back to inlining megabytes */
const webKB = Math.round(Buffer.byteLength(webHtml) / 1024);
ok("landing page stays under 150 KB", webKB < 150, webKB + " KB");
eq("landing page has no inlined images", (webHtml.match(/data:image/g) || []).length, 0);
eq("landing page has no inlined fonts", (webHtml.match(/data:font/g) || []).length, 0);

/* ------------------------------------------------------------------ 6. Explore prices */
/* Explore reads mk.<coin>[currency] and mk.<coin>[currency + "_24h_change"].
   Prices are a median of KuCoin / MEXC / Gate, changes are their average, CoinGecko is the fallback. */
const marketFile = path.join(ROOT, "api/market.js");
if (fs.existsSync(marketFile)) {
  const m = require(marketFile);
  ok("api/market.js exports its helpers for testing",
     typeof m._shape === "function" && typeof m._median === "function" && typeof m._avg === "function");

  eq("median of three", m._median([3, 1, 2]), 2);
  eq("median of four", m._median([4, 1, 3, 2]), 2.5);
  eq("median ignores zero and junk", m._median([0, null, "x", 5, 5, 5]), 5);
  eq("median of nothing is null", m._median([]), null);

  eq("average of changes", m._avg([1, 2]), 1.5);
  eq("average ignores nonsense", m._avg([1, null, "x", 999999, 3]), 2);
  eq("average of nothing is null", m._avg([]), null);

  const ku = { bitcoin: { usd: 100, chg: 2 }, ethereum: { usd: 10, chg: -1 } };
  const mx = { bitcoin: { usd: 102, chg: 4 }, ethereum: { usd: 10.4, chg: -3 } };
  const ga = { bitcoin: { usd: 98, chg: 3 } };
  const cg = { tether: { inr: 93.8, usd: 1, usd_24h_change: 0.02, inr_24h_change: 0.03 } };
  const out = m._shape([ku, mx, ga], cg, 88);

  eq("bitcoin price is the median of three exchanges", out.bitcoin.usd, 100);
  eq("bitcoin change is the average of three", out.bitcoin.usd_24h_change, 3);
  eq("rupee price comes from the FX rate", out.bitcoin.inr, 8800);
  eq("rupee percentage is filled in", out.bitcoin.inr_24h_change, 3);
  eq("ethereum uses the two exchanges that answered", out.ethereum.usd, 10.2);
  eq("ethereum change averages the two", out.ethereum.usd_24h_change, -2);
  eq("a coin only CoinGecko had is kept", out.tether.usd, 1);
  eq("its percentage still arrives", out.tether.inr_24h_change, 0.03);
  eq("every coin carries both percentages",
     Object.values(out).every(c => typeof c.inr_24h_change === "number" && typeof c.usd_24h_change === "number"), true);
  eq("no exchange and no CoinGecko means the row is dropped", m._shape([{}, {}], {}, 88).dogecoin, undefined);
}

/* ------------------------------------------------------------------ 7. five checks we were missing */
/* Taken from a second review's suite: QR parsing, the assistant refusing recovery phrases, the
   server guard's origin check, the quiz data, and a scan for secrets in the source. */
function grabFn(file, name) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  const start = src.indexOf("function " + name + "(");
  if (start < 0) throw new Error(name + " not found in " + file);
  let i = src.indexOf("{", start), depth = 0, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(start, i);
}
function runAlone(parts, extra) {
  const c = vm.createContext(Object.assign({ console, URLSearchParams }, extra || {}));
  vm.runInContext(parts.join("\n"), c);
  return c;
}

/* --- QR codes: what the scanner accepts --- */
try {
  const qr = runAlone(
    [grabFn("app/js/11-scan.js", "qrWei"), grabFn("app/js/11-scan.js", "qrAmt"), grabFn("app/js/11-scan.js", "parseQR")],
    { N: () => ({ tzt: "0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0", tzv: "0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73" }), t: k => k,
      ethers: { formatUnits: (w, d) => { w = BigInt(w); d = d || 18; const x = w.toString().padStart(d + 1, "0");
        const i = x.slice(0, x.length - d), fr = x.slice(x.length - d).replace(/0+$/, ""); return fr ? i + "." + fr : i; } } });
  const A = "0x1234567890abcdef1234567890abcdef12345678";
  eq("QR: a plain address is read", qr.parseQR(A) && qr.parseQR(A).to, A);
  eq("QR: a private key is not an address", qr.parseQR("0x" + "ab".repeat(32)), null);
  eq("QR: text with an address inside is refused", qr.parseQR("hello " + A + " world"), null);
  ok("QR: an ethereum: link is understood", !!(qr.parseQR("ethereum:" + A + "@8118?value=2.5e18")));
} catch (e) { ok("QR tests ran", false, e.message) }

/* --- scanning a QR must replace the amount and token on the send screen --- */
try {
  const TZT = "0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0";
  const A = "0x1234567890abcdef1234567890abcdef12345678";
  const mk = () => ({ snd: { to: "", amt: "500", tok: "tzt" } });
  const st = mk();
  const q = runAlone([grabFn("app/js/11-scan.js", "useQR")],
    { S: st, N: () => ({ tzt: TZT, tzv: "0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73" }), toast() {}, render() {}, estFee() {} });
  q.useQR({ to: A, tok: "", token: "", amt: "" });
  eq("QR without amount clears the old amount", st.snd.amt, "");
  eq("QR without token goes back to native, not the old token", st.snd.tok, "native");
  eq("QR destination is set", st.snd.to, A);

  const st2 = mk();
  const q2 = runAlone([grabFn("app/js/11-scan.js", "useQR")],
    { S: st2, N: () => ({ tzt: TZT, tzv: "0x4cC2d29b65E6a2cd788a144a81e5e99bd892dE73" }), toast() {}, render() {}, estFee() {} });
  q2.useQR({ to: A, tok: "", token: "", amt: "2.5" });
  eq("QR with an amount sets it", st2.snd.amt, "2.5");
} catch (e) { ok("QR send-screen tests ran", false, e.message) }

/* --- the assistant must refuse anything that looks like a secret --- */
try {
  const twelve = "abandon ability able about above absent absorb abstract absurd abuse access accident";
  const BIP = {}; twelve.split(" ").forEach(w => { BIP[w] = 1 });
  const ai = runAlone([grabFn("app/js/27-ai.js", "nearSeed"), grabFn("app/js/27-ai.js", "aiSecret")], { BIP });
  eq("assistant: 12 recovery words are blocked", ai.aiSecret(twelve), true);
  eq("assistant: a 64-character key is blocked", ai.aiSecret("0x" + "ab".repeat(32)), true);
  eq("assistant: a long Hinglish question is allowed", ai.aiSecret("mera wallet kaise banaye aur paise kaise bheje mujhe samajh nahi aata please batao jaldi"), false);
} catch (e) { ok("assistant tests ran", false, e.message) }

/* --- the server guard: only our own app may call the paid endpoints --- */
try {
  const guard = require(path.join(ROOT, "lib/guard.js"));
  const mk = (m, h) => ({ method: m, headers: h, socket: { remoteAddress: "9.9.9.9" } });
  eq("guard: a script with no browser headers is refused", guard.originOk(mk("POST", { host: "app.tazvera.com" })), false);
  eq("guard: another website is refused", guard.originOk(mk("POST", { host: "app.tazvera.com", "sec-fetch-site": "cross-site" })), false);
  eq("guard: our own app is allowed", guard.originOk(mk("POST", { host: "app.tazvera.com", "sec-fetch-site": "same-origin" })), true);
} catch (e) { ok("guard tests ran", false, e.message) }

/* --- the quiz: ten questions, both languages, a valid answer each --- */
try {
  const src = fs.readFileSync(path.join(ROOT, "app/js/features/quiz.js"), "utf8");
  const a = src.indexOf("var QZ=["), b = src.indexOf("];", a) + 2;
  const QZ = runAlone([src.slice(a, b)]).QZ;
  eq("quiz: ten questions", QZ.length, 10);
  ok("quiz: every question has 3 options, a valid answer and both languages",
     QZ.every(q => ["en", "hi"].every(l => q[l] && q[l][0] && q[l][1].length === 3 && q[l][2] >= 0 && q[l][2] <= 2 && q[l][3])));
} catch (e) { ok("quiz tests ran", false, e.message) }

/* --- no secrets committed to the source --- */
try {
  const bad = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (["node_modules", ".git", "contracts"].includes(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (e.name === ".env") { bad.push(p); continue; }
      if (!/\.(js|json|html|md|yml|txt)$/.test(e.name)) continue;
      if (/ethers\.min\.js|jsqr\.js|qrcode\.min\.js|package-lock/.test(e.name)) continue;
      const t = fs.readFileSync(p, "utf8");
      if (/AIza[0-9A-Za-z_-]{30,}/.test(t) || /(private ?key|PRIVATE_KEY)\s*[:=]\s*["']?0x[0-9a-fA-F]{64}/.test(t)) bad.push(p);
    }
  })(ROOT);
  ok("no private key, Google key or .env file in the source", bad.length === 0, bad.join(", "));
} catch (e) { ok("secret scan ran", false, e.message) }

/* ------------------------------------------------------------------ report */
console.log(`\n${pass} passed, ${fail} failed  (${loaded.length}/${FILES.length} modules loaded)\n`);
if (fail) {
  console.log("FAILURES");
  for (const f of failures) console.log("  ✗ " + f);
  console.log("");
  process.exit(1);
}
console.log("All good.\n");
