/* Tazvera wallet · api/market.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
const guard = require("../lib/guard");
/* Market prices for the Explore screen (BTC, ETH, BNB, USDT in ₹ and $, with 24h change).

   Why this file exists: the app used to call CoinGecko straight from the phone. That sent every
   user's IP to CoinGecko and hit their per-IP free limit, which in India is a real problem because
   hundreds of users can share one carrier IP — the Explore screen then showed "—" for every coin.
   Now the call happens here, once per 5 minutes, shared by everybody, and the user's IP stays home. */

const IDS = "bitcoin,ethereum,binancecoin,tether";
const URL = "https://api.coingecko.com/api/v3/simple/price?ids=" + IDS + "&vs_currencies=inr,usd&include_24hr_change=true";

module.exports = async function handler(req, res) {
  if (!guard.originOk(req)) { res.status(403).json({ error: "not_allowed" }); return; }
  if (!(await guard.check(req, res, "market", { perIp: 60, windowSec: 600, daily: Number(process.env.MARKET_DAILY_MAX) || 20000 }))) return;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
  try {
    const r = await fetch(URL, { signal: AbortSignal.timeout(7000), headers: { Accept: "application/json" } });
    if (!r.ok) { res.status(502).json({ error: "upstream" }); return; }
    const j = await r.json();
    const out = {};
    for (const id of IDS.split(",")) {
      const row = j && j[id];
      if (row && Number.isFinite(+row.usd)) out[id] = { inr: +row.inr || null, usd: +row.usd, usd_24h_change: Number.isFinite(+row.usd_24h_change) ? +row.usd_24h_change : null };
    }
    if (!Object.keys(out).length) { res.status(502).json({ error: "no_data" }); return; }
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: "upstream" });
  }
};
