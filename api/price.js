// Vercel serverless function: SHM price (median of several exchanges) + 24h change + USD->INR
const guard = require("../lib/guard");
module.exports = async function handler(req, res) {
  /* Only our own app may use this, with limits per IP and per day (stops abuse of the exchange calls). */
  if (!guard.originOk(req)) { res.status(403).json({ error: "not_allowed" }); return; }
  if (!(await guard.check(req, res, "price", { perIp: 60, windowSec: 600, daily: Number(process.env.PRICE_DAILY_MAX) || 20000 }))) return;
  const get = async (url, pick) => {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
      return pick(await r.json());
    } catch (e) { return null; }
  };
  const [a, b, gate, fx, kuStats] = await Promise.all([
    get("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SHM-USDT", d => +d.data.price),
    get("https://api.mexc.com/api/v3/ticker/price?symbol=SHMUSDT", d => +d.price),
    get("https://api.gateio.ws/api/v4/spot/tickers?currency_pair=SHM_USDT", d => ({ last: +d[0].last, chg: +d[0].change_percentage })),
    get("https://open.er-api.com/v6/latest/USD", d => +d.rates.INR),
    get("https://api.kucoin.com/api/v1/market/stats?symbol=SHM-USDT", d => +d.data.changeRate * 100),
  ]);
  const c = gate && gate.last;
  const v = [a, b, c].filter(x => x > 0).sort((x, y) => x - y);
  if (!v.length) { res.status(502).json({ error: "no price available" }); return; }
  const m = v.length % 2 ? v[v.length >> 1] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  // 24h change in percent: average of the exchanges that report it
  const ch = [kuStats, gate && gate.chg].filter(x => typeof x === "number" && isFinite(x) && Math.abs(x) < 1000);
  const chg = ch.length ? Math.round((ch.reduce((s, x) => s + x, 0) / ch.length) * 100) / 100 : null;
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  res.status(200).json({ usd: m, inr: fx > 0 ? m * fx : null, chg, sources: v.length, time: Date.now() });
};
