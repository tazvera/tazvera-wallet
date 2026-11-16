/* Tazvera wallet · api/market.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
const guard = require("../lib/guard");
/* Market prices for the Explore screen: BTC, ETH, BNB, USDT in ₹ and $, with the 24h change.

   The price is a MEDIAN of several exchanges (KuCoin, MEXC, Gate), the same way api/price.js does it for
   SHM, so one exchange having a bad minute cannot move the number. The 24h change is the AVERAGE of the
   changes those exchanges report, again like api/price.js. CoinGecko is kept only as a fallback for a coin
   that none of the exchanges answered for (USDT is the usual one), so no row ever loses its price.

   Why this file exists at all: the app used to call CoinGecko straight from the phone. That sent every
   user's IP to CoinGecko and hit their per-IP free limit — in India hundreds of users can share one
   carrier IP, and the Explore screen then showed "—" for every coin. Now the calls happen here, once per
   five minutes, shared by everybody.

   The response shape must stay flat per coin, with a 24h change for BOTH currencies, because the app reads
   mk.bitcoin[currency] and mk.bitcoin[currency + "_24h_change"]. */

const COINS = [
  { id: "bitcoin", ku: "BTC-USDT", mx: "BTCUSDT", gate: "BTC_USDT" },
  { id: "ethereum", ku: "ETH-USDT", mx: "ETHUSDT", gate: "ETH_USDT" },
  { id: "binancecoin", ku: "BNB-USDT", mx: "BNBUSDT", gate: "BNB_USDT" },
  { id: "tether", ku: "USDT-USDC", mx: "USDTUSDC", gate: "USDT_USDC" },
];
const CG_URL = "https://api.coingecko.com/api/v3/simple/price?ids=" + COINS.map(c => c.id).join(",") + "&vs_currencies=inr,usd&include_24hr_change=true";

async function getJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("http " + r.status);
  return r.json();
}
/* +null is 0 and +"" is 0, which would quietly turn a missing price into a zero price.
   Only a real finite number is accepted. */
function num(v) {
  if (v === null || v === undefined || v === "" || typeof v === "boolean") return null;
  const n = +v;
  return Number.isFinite(n) ? n : null;
}

/* median of the prices that arrived; null when nothing arrived */
function median(list) {
  const v = list.map(num).filter(x => x !== null && x > 0).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
/* average of the 24h changes that arrived, ignoring obvious garbage; null when nothing arrived */
function avg(list) {
  const v = list.map(num).filter(x => x !== null && Number.isFinite(x) && Math.abs(x) < 1000);
  if (!v.length) return null;
  return Math.round((v.reduce((s, x) => s + x, 0) / v.length) * 100) / 100;
}

/* ---- one call per exchange, all in parallel; a failed exchange just contributes nothing ---- */
async function fromKucoin() {
  const out = {};
  try {
    const j = await getJson("https://api.kucoin.com/api/v1/market/allTickers");
    for (const t of (j && j.data && j.data.ticker) || []) {
      for (const c of COINS) if (t.symbol === c.ku) out[c.id] = { usd: num(t.last), chg: num(t.changeRate) === null ? null : num(t.changeRate) * 100 };
    }
  } catch (e) { /* ignore */ }
  return out;
}
async function fromMexc() {
  const out = {};
  try {
    const q = encodeURIComponent(JSON.stringify(COINS.map(c => c.mx)));
    const j = await getJson("https://api.mexc.com/api/v3/ticker/24hr?symbols=" + q);
    for (const t of Array.isArray(j) ? j : []) {
      const c = COINS.find(x => x.mx === t.symbol);
      if (c) out[c.id] = { usd: num(t.lastPrice), chg: num(t.priceChangePercent) };
    }
  } catch (e) { /* ignore */ }
  return out;
}
async function fromGate() {
  const out = {};
  await Promise.all(COINS.map(async c => {
    try {
      const j = await getJson("https://api.gateio.ws/api/v4/spot/tickers?currency_pair=" + c.gate);
      const t = Array.isArray(j) ? j[0] : null;
      if (t) out[c.id] = { usd: num(t.last), chg: num(t.change_percentage) };
    } catch (e) { /* ignore */ }
  }));
  return out;
}
let fx = { v: null, t: 0 };
async function usdInr() {
  if (fx.v && Date.now() - fx.t < 3600000) return fx.v;
  try { const j = await getJson("https://open.er-api.com/v6/latest/USD"); const v = num(j && j.rates && j.rates.INR); if (v > 0) fx = { v: v, t: Date.now() }; } catch (e) { /* keep the old rate */ }
  return fx.v;
}
async function fromCoinGecko() {
  try { return (await getJson(CG_URL)) || {}; } catch (e) { return {}; }
}

/* build the answer: exchange median first, CoinGecko only where an exchange said nothing */
function shape(sources, cg, rate) {
  const out = {};
  for (const c of COINS) {
    const got = sources.map(s => s[c.id]).filter(Boolean);
    const cgRow = cg && cg[c.id];
    const usd = median(got.map(x => x.usd)) !== null ? median(got.map(x => x.usd))
      : (cgRow ? num(cgRow.usd) : null);
    if (usd === null) continue;
    const ex = avg(got.map(x => x.chg));
    const cgUsd = cgRow ? num(cgRow.usd_24h_change) : null;
    const cgInr = cgRow ? num(cgRow.inr_24h_change) : null;
    const inr = rate ? Math.round(usd * rate * 100) / 100 : (cgRow ? num(cgRow.inr) : null);
    out[c.id] = {
      inr: inr,
      usd: usd,
      /* the exchanges report their change against the dollar, so it is the honest figure for both
         currencies; CoinGecko's own per-currency figure is used only where no exchange answered */
      inr_24h_change: ex !== null ? ex : (cgInr !== null ? cgInr : cgUsd),
      usd_24h_change: ex !== null ? ex : (cgUsd !== null ? cgUsd : cgInr),
    };
  }
  return out;
}

module.exports = async function handler(req, res) {
  if (!guard.originOk(req)) { res.status(403).json({ error: "not_allowed" }); return; }
  if (!(await guard.check(req, res, "market", { perIp: 60, windowSec: 600, daily: Number(process.env.MARKET_DAILY_MAX) || 20000 }))) return;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
  const [ku, mx, ga, cg, rate] = await Promise.all([fromKucoin(), fromMexc(), fromGate(), fromCoinGecko(), usdInr()]);
  const out = shape([ku, mx, ga], cg, rate);
  if (!Object.keys(out).length) { res.status(502).json({ error: "no_data" }); return; }
  res.status(200).json(out);
};

module.exports._shape = shape;   /* for tests */
module.exports._median = median;
module.exports._avg = avg;
