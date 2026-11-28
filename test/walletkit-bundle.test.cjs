"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

// The WalletKit bundle is minified, so nobody can read it to review it. Its hash and size are the guard.
// They come from the CI build (walletkit-build workflow, run 46122802494). Changing the file means
// reviewing it again and updating these two values in the same PR.
const BUNDLE = path.resolve(__dirname, "..", "app/walletconnect/tazvera-walletkit.js");
const EXPECTED_SHA256 = "6b77137edccf8df154271c365a4d7a737e80da38fd73a79b80551ee1ab0bcb36";
const EXPECTED_BYTES = 845974;

test("walletkit bundle matches the CI-built hash and size", () => {
  const data = fs.readFileSync(BUNDLE);
  const sha = crypto.createHash("sha256").update(data).digest("hex");
  assert.equal(data.length, EXPECTED_BYTES, "walletkit bundle changed — review it before merging");
  assert.equal(sha, EXPECTED_SHA256, "walletkit bundle changed — review it before merging");
});
