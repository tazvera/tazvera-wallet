#!/usr/bin/env node
"use strict";

/* Focused regression tests for the existing wrong-PIN throttle.
   Run by CI alongside test/run.js. These tests do not claim the browser's
   localStorage counter is tamper-proof; clearing site data can reset it. */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

let now = 1_800_000_000_000;
const store = new Map();
const messages = {
  en: { pinBad: "Wrong PIN" },
  hi: { pinBad: "गलत PIN" }
};
let unlockCalls = 0;
let storageThrows = false;
const ctx = {
  Date: class extends Date {
    static now() { return now; }
  },
  Math, JSON, Promise, Error, String, Object,
  localStorage: {
    getItem: k => { if (storageThrows) throw new Error("storage unavailable"); return store.has(k) ? store.get(k) : null; },
    setItem: (k, v) => { if (storageThrows) throw new Error("storage unavailable"); store.set(k, String(v)); },
    removeItem: k => { if (storageThrows) throw new Error("storage unavailable"); store.delete(k); }
  },
  S: { lang: "en" },
  L: messages,
  window: {},
  CPW: {
    unlock: async pin => {
      unlockCalls++;
      if (pin !== "correct") throw new Error("invalid password");
      return true;
    },
    phrase: async pin => {
      if (pin !== "correct") throw new Error("invalid password");
      return "test phrase";
    }
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

  const callsAtLock = unlockCalls;
  await assert.rejects(ctx.CPW.unlock("correct"), /pin-wait/);
  assert.equal(unlockCalls, callsAtLock, "locked attempts must not reach decryption");
  assert.equal(ctx.pinWait(), 30_000, "blocked attempt must not extend the active wait");

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
  assert.equal(store.has("tz_pinfail"), false, "successful unlock removes persisted failure state");

  storageThrows = true;
  for (let i = 0; i < 5; i++) await assert.rejects(ctx.CPW.unlock("wrong"));
  assert.equal(ctx.pinWait(), 30_000, "session-memory throttle still activates when browser storage is unavailable");
  const callsBeforeStorageLock = unlockCalls;
  await assert.rejects(ctx.CPW.unlock("correct"), /pin-wait/);
  assert.equal(unlockCalls, callsBeforeStorageLock, "storage failure must not bypass the active session lock");

  storageThrows = false;
  store.set("tz_pinfail", JSON.stringify({ n: Number.MAX_SAFE_INTEGER, u: 0 }));
  ctx.pinFail();
  assert.equal(JSON.parse(store.get("tz_pinfail")).n, 8, "tampered oversized counters are capped at the maximum backoff step");
  assert.equal(ctx.pinWait(), 900_000, "counter tampering cannot overflow the backoff schedule");

  console.log("PIN throttle tests: escalation, storage fallback and counter bounds passed");
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
