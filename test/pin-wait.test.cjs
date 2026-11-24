#!/usr/bin/env node
"use strict";

/* Client-side throttle regression tests. Clearing ALL site data or editing browser
   storage can still reset a client-side lockout; this only mirrors local/session state. */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

let now = 1_800_000_000_000;
const store = new Map();
const session = new Map();
const messages = { en: { pinBad: "Wrong PIN" }, hi: { pinBad: "गलत PIN" } };
let unlockCalls = 0;
let storageThrows = false;
let sessionThrows = false;
const makeStorage = map => ({
  getItem: k => { if (map === store && storageThrows || map === session && sessionThrows) throw new Error("storage unavailable"); return map.has(k) ? map.get(k) : null; },
  setItem: (k, v) => { if (map === store && storageThrows || map === session && sessionThrows) throw new Error("storage unavailable"); map.set(k, String(v)); },
  removeItem: k => { if (map === store && storageThrows || map === session && sessionThrows) throw new Error("storage unavailable"); map.delete(k); }
});
const ctx = {
  Date: class extends Date { static now() { return now; } },
  Math, JSON, Promise, Error, String, Object,
  localStorage: makeStorage(store),
  sessionStorage: makeStorage(session),
  S: { lang: "en" }, L: messages, window: {},
  CPW: {
    unlock: async pin => { unlockCalls++; if (pin !== "correct") throw new Error("invalid password"); return true; },
    phrase: async pin => { if (pin !== "correct") throw new Error("invalid password"); return "test phrase"; }
  }
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("app/js/features/pin-wait.js", "utf8"), ctx);

(async () => {
  for (let i = 0; i < 4; i++) {
    await assert.rejects(ctx.CPW.unlock("wrong"));
    assert.equal(ctx.pinWait(), 0, "first four failures should not lock");
  }
  await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 30_000, "fifth failure starts 30-second wait");
  assert.ok(session.has("tz_pinfail"), "lockout is mirrored to sessionStorage");

  /* Clearing only localStorage must not reset this tab's session throttle. */
  store.delete("tz_pinfail");
  ctx.PINMEM = { n: 0, u: 0 };
  assert.equal(ctx.pinWait(), 30_000, "sessionStorage preserves lockout after localStorage entry is removed");

  const callsAtLock = unlockCalls;
  await assert.rejects(ctx.CPW.unlock("correct"), /pin-wait/);
  assert.equal(unlockCalls, callsAtLock, "locked attempts must not reach decryption");
  assert.equal(ctx.pinWait(), 30_000, "blocked attempts must not extend the active wait");

  now += 30_001;
  await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 60_000, "sixth failure starts 60-second wait");
  now += 60_001;
  await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 300_000, "seventh failure starts 5-minute wait");
  now += 300_001;
  await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 900_000, "eighth failure starts 15-minute wait");

  now += 900_001;
  await ctx.CPW.unlock("correct");
  assert.equal(ctx.pinWait(), 0, "successful unlock clears the failure counter");
  assert.equal(store.has("tz_pinfail"), false);
  assert.equal(session.has("tz_pinfail"), false);

  store.set("tz_pinfail", JSON.stringify({ n: Number.MAX_SAFE_INTEGER, u: 0 }));
  ctx.pinFail();
  assert.equal(JSON.parse(store.get("tz_pinfail")).n, 8, "oversized counters are capped");
  assert.equal(ctx.pinWait(), 900_000, "counter values cannot overflow the backoff schedule");

  ctx.pinOk();
  storageThrows = true;
  sessionThrows = true;
  for (let i = 0; i < 5; i++) await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 30_000, "in-memory throttle activates when both browser stores are unavailable");
  const callsBeforeStorageLock = unlockCalls;
  await assert.rejects(ctx.CPW.unlock("correct"), /pin-wait/);
  assert.equal(unlockCalls, callsBeforeStorageLock, "storage failure must not bypass the active session lock");

  console.log("PIN throttle tests: escalation, local/session mirror, storage fallback and bounds passed");
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
