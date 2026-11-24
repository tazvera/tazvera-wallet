import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "www");
const excluded = new Set([
  ".git", ".github", "android", "node_modules", "www", "test",
  "scripts", "api", "package.json", "package-lock.json",
  "capacitor.config.json"
]);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  fs.cpSync(path.join(root, entry.name), path.join(out, entry.name), {
    recursive: true,
    dereference: false
  });
}

if (!fs.existsSync(path.join(out, "index.html")) ||
    !fs.existsSync(path.join(out, "wallet.js")) ||
    !fs.existsSync(path.join(out, "ethers.min.js"))) {
  throw new Error("Android web bundle is incomplete: required wallet files are missing.");
}

console.log("Prepared Tazvera web assets in www/");
