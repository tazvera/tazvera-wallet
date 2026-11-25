// Checks the device-key helpers (seal/unseal and the non-extractable rule) with Node's WebCrypto.
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

function loadDeviceKey() {
  const src = fs.readFileSync(__dirname + "/../app/js/features/device-key.js", "utf8");
  const ctx = { crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, Uint8Array, console };
  vm.createContext(ctx);
  vm.runInContext(src + ";this.DeviceKey=DeviceKey;", ctx);
  return ctx.DeviceKey;
}

test("seal then unseal returns the same text", async () => {
  const DK = loadDeviceKey();
  const key = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const box = await DK.seal(key, "keystore-json-example");
  assert.strictEqual(await DK.unseal(key, box), "keystore-json-example");
});

test("a different key cannot open the box", async () => {
  const DK = loadDeviceKey();
  const k1 = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const k2 = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const box = await DK.seal(k1, "secret");
  await assert.rejects(DK.unseal(k2, box));
});

test("changed data is rejected", async () => {
  const DK = loadDeviceKey();
  const key = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const box = await DK.seal(key, "secret");
  const ct = DK._un64(box.ct); ct[0] ^= 1; box.ct = DK._b64(ct);
  await assert.rejects(DK.unseal(key, box));
});

test("the key cannot be exported (page code cannot read its bytes)", async () => {
  const key = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  await assert.rejects(webcrypto.subtle.exportKey("raw", key));
});

test("a wrong box version is refused", async () => {
  const DK = loadDeviceKey();
  const key = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  await assert.rejects(DK.unseal(key, { v: 2, iv: "", ct: "" }));
});
