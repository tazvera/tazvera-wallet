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

test("Open and browser toolbar actions remain disabled in this data-only layer", () => {
  assert.match(ui, /class="tz-open-inert"[^>]*disabled/);
  assert.match(ui, /class="tz-browser-toolbar"/);
  assert.match(ui, /brwOpen=function\(\)\{ toast/);
});
