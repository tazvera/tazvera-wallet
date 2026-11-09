/* Tazvera wallet · api/chart.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Price history for the in-app chart, from public exchange candles (KuCoin, then Gate as backup).
   Cached by Vercel for 5 minutes, so many users share one upstream call. No user data is involved. */
const PAIRS = { SHM: ["SHM-USDT", "SHM_USDT"], BTC: ["BTC-USDT", "BTC_USDT"], ETH: ["ETH-USDT", "ETH_USDT"], BNB: ["BNB-USDT", "BNB_USDT"] };
const PLAN = { 1: { ku: "15min", gate: "15m", sec: 900 }, 7: { ku: "1hour", gate: "1h", sec: 3600 }, 30: { ku: "4hour", gate: "4h", sec: 14400 } };

async function getJson(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(7000), headers: { "Accept": "application/json" } });
  if (!r.ok) throw new Error("http " + r.status);
  return r.json();
}
function clean(points) {
  const p = points.filter(x => Number.isFinite(x[0]) && Number.isFinite(x[1]) && x[1] > 0).sort((a, b) => a[0] - b[0]);
  return p.length >= 2 ? p : null;
}
async function kucoin(pair, plan, from, to) {
  const j = await getJson("https://api.kucoin.com/api/v1/market/candles?type=" + plan.ku + "&symbol=" + pair + "&startAt=" + from + "&endAt=" + to);
  /* rows: [time(s), open, close, high, low, volume, turnover] */
  return clean((j && Array.isArray(j.data) ? j.data : []).map(r => [Number(r[0]) * 1000, Number(r[2])]));
}
async function gate(pair, plan, from, to) {
  const j = await getJson("https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair=" + pair + "&interval=" + plan.gate + "&from=" + from + "&to=" + to);
  /* rows: [time(s), quote volume, close, high, low, open, base volume, closed] */
  return clean((Array.isArray(j) ? j : []).map(r => [Number(r[0]) * 1000, Number(r[2])]));
}
let fx = { v: null, t: 0 };
async function usdInr() {
  if (fx.v && Date.now() - fx.t < 3600000) return fx.v;
  try { const j = await getJson("https://open.er-api.com/v6/latest/USD"); const v = Number(j && j.rates && j.rates.INR); if (v > 0) fx = { v: v, t: Date.now() }; } catch (e) { /* keep old */ }
  return fx.v;
}

module.exports = async function handler(req, res) {
  const q = req.query || {};
  const sym = String(q.sym || "").toUpperCase(), days = Number(q.days), cur = q.cur === "usd" ? "usd" : "inr";
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!(sym === "USDT" || PAIRS[sym]) || !PLAN[days]) { res.status(400).json({ error: "bad_request" }); return; }
  const plan = PLAN[days], to = Math.floor(Date.now() / 1000), from = to - days * 86400;
  let pts = null;
  if (sym === "USDT") {
    /* USDT is a dollar coin: a flat line at 1 USD */
    pts = []; for (let t = from; t <= to; t += plan.sec) pts.push([t * 1000, 1]);
  } else {
    try { pts = await kucoin(PAIRS[sym][0], plan, from, to); } catch (e) { pts = null; }
    if (!pts) { try { pts = await gate(PAIRS[sym][1], plan, from, to); } catch (e) { pts = null; } }
  }
  if (!pts) { res.status(502).json({ error: "no_data" }); return; }
  if (cur === "inr") {
    const r = await usdInr();
    if (!r) { res.status(502).json({ error: "no_fx" }); return; }
    pts = pts.map(x => [x[0], x[1] * r]);
  }
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.status(200).json({ prices: pts, source: sym === "USDT" ? "fixed" : "exchange" });
};
