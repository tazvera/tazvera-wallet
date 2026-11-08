// Tazvera free test-coin server (Shardeum Testnet). Sends 100 TZT to a new tester; the server pays the network fee.
// Needs the environment variable AIRDROP_KEY (the airdrop wallet's private key, kept only in Vercel).
const ethers = require("ethers");

const RPC = "https://api-mezame.shardeum.org";
const CHAIN_ID = 8119;
const TOKEN = "0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0";   // Tazvera Test (TZT)
const AMOUNT = "100";            // TZT per person
const MIN_TOKEN = "100";         // keep at least this much TZT in the airdrop wallet
const MIN_SHM = 200;             // keep at least this much SHM for fees (one send costs about 60 SHM)
const DAY = 24 * 60 * 60 * 1000;
const PER_IP = 3;                // sends per network (IP) per day
const GLOBAL_MAX = 40;           // sends per day, in total

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)"
];

const addrHit = new Map();   // address -> time of last send
const ipHits = new Map();    // ip -> [times]
let allHits = [];            // times of all sends

function clientIp(req) {
  const h = (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "";
  return String(h).split(",")[0].trim() || (req.socket && req.socket.remoteAddress) || "unknown";
}
function recent(list, now) { return (list || []).filter(t => now - t < DAY); }

function allow(now, key, ip) {
  const last = addrHit.get(key);
  if (last && now - last < DAY) return ["You already got TZT in the last 24 hours. Please try again tomorrow.", 429];
  if (recent(ipHits.get(ip), now).length >= PER_IP) return ["Too many requests from this network today. Try again tomorrow.", 429];
  allHits = recent(allHits, now);
  if (allHits.length >= GLOBAL_MAX) return ["Many testers today. Please try again tomorrow.", 429];
  return null;
}
function take(now, key, ip) {
  addrHit.set(key, now);
  ipHits.set(ip, recent(ipHits.get(ip), now).concat(now));
  allHits.push(now);
}
function give(key, ip, now) {   // undo exactly this request's entries, when the send did not happen
  if (addrHit.get(key) === now) addrHit.delete(key);
  const l = recent(ipHits.get(ip), now), i = l.lastIndexOf(now); if (i >= 0) l.splice(i, 1); ipHits.set(ip, l);
  const j = allHits.lastIndexOf(now); if (j >= 0) allHits.splice(j, 1);
}

const chain = {
  async info(to) {
    const provider = new ethers.JsonRpcProvider(RPC, CHAIN_ID);
    const wallet = new ethers.Wallet(process.env.AIRDROP_KEY, provider);
    const token = new ethers.Contract(TOKEN, ABI, wallet);
    const [tzt, shm, recv] = await Promise.all([
      token.balanceOf(wallet.address),
      provider.getBalance(wallet.address),
      token.balanceOf(to)
    ]);
    return { token, tzt, shm: Number(ethers.formatEther(shm)), recv };
  },
  async send(c, to) {
    const tx = await c.token.transfer(to, ethers.parseUnits(AMOUNT, 18), { gasLimit: 120000 });
    return tx.hash;
  }
};

async function handler(req, res) {
  const now = Date.now();
  let key = "", ip = "", taken = false;
  try {
    res.setHeader("Cache-Control", "no-store");
    const sf = req.headers && req.headers["sec-fetch-site"];
    if (sf && sf !== "same-origin" && sf !== "none") return res.status(403).json({ error: "Not allowed" });
    const to = String((req.query && req.query.address) || "");
    if (!ethers.isAddress(to)) return res.status(400).json({ error: "Invalid address" });
    if (!process.env.AIRDROP_KEY) return res.status(500).json({ error: "Airdrop is not set up yet" });
    key = to.toLowerCase(); ip = clientIp(req);
    const no = allow(now, key, ip);
    if (no) return res.status(no[1]).json({ error: no[0] });
    take(now, key, ip); taken = true;
    const c = await handler._chain.info(to);
    const amount = ethers.parseUnits(AMOUNT, 18);
    if (c.tzt < ethers.parseUnits(MIN_TOKEN, 18) + amount || c.shm < MIN_SHM) {
      give(key, ip, now);
      return res.status(503).json({ error: "The test faucet is resting. Please try again tomorrow." });
    }
    if (c.recv >= amount) {
      give(key, ip, now);
      return res.status(429).json({ error: "You already have plenty of TZT" });
    }
    const hash = await handler._chain.send(c, to);
    return res.status(200).json({ ok: true, hash });
  } catch (e) {
    if (taken) give(key, ip, now);
    console.error("[airdrop] " + String(e && (e.shortMessage || e.message) || e).slice(0, 200));
    return res.status(500).json({ error: "Could not send test coins right now. Please try again later." });
  }
}
handler._chain = chain;   // replaced only in tests
module.exports = handler;
