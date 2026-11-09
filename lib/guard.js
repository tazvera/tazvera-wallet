/* Tazvera wallet · lib/guard.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Shared protection for the paid endpoints (api/ai.js, api/tts.js).

   1. originOk(req): a browser request must come from our own site. A request without any browser headers
      (curl, scripts) is refused. NOTE: this is only a speed bump, anyone can fake an Origin header.
   2. check(req, res, name, opts): the REAL protection. It counts requests per IP and per day.
      - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL + KV_REST_API_TOKEN) are set, the counts
        are kept in Redis, so every Vercel instance shares them.
      - If Redis is missing or down, it falls back to this instance's memory (weaker, but never blocks real users).
   The daily budget stops one attacker from burning the whole Google quota/credit in a day. */

const mem = new Map(); /* key -> {n, exp} */

function memIncr(key, ttlSec) {
  const now = Date.now(), e = mem.get(key);
  if (e && e.exp > now) { e.n++; return e.n; }
  mem.set(key, { n: 1, exp: now + ttlSec * 1000 });
  if (mem.size > 20000) { for (const [k, v] of mem) { if (v.exp <= now) mem.delete(k); } }
  return 1;
}

function redisConf() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
  return /^https:\/\//.test(url) && token ? { url: url.replace(/\/+$/, ""), token: token } : null;
}

/* returns the new count, or null if Redis could not be used */
async function redisIncr(key, ttlSec) {
  const c = redisConf(); if (!c) return null;
  const ac = new AbortController(), tm = setTimeout(function () { ac.abort(); }, 1500);
  try {
    const r = await fetch(c.url + "/pipeline", {
      method: "POST", signal: ac.signal,
      headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(ttlSec), "NX"]])
    });
    if (!r.ok) return null;
    const j = await r.json();
    const n = j && j[0] && Number(j[0].result);
    return Number.isFinite(n) ? n : null;
  } catch (e) { return null; } finally { clearTimeout(tm); }
}

async function incr(key, ttlSec) {
  const n = await redisIncr(key, ttlSec);
  return n === null ? memIncr(key, ttlSec) : n;
}

function clientIp(req) {
  /* On Vercel, X-Forwarded-For is set by Vercel itself and is not forwarded from the outside. If you put another proxy
     (for example Cloudflare) in front, this must be changed, or every user will look like one IP. */
  const x = String((req.headers && req.headers["x-forwarded-for"]) || "").split(",")[0].trim();
  return x || (req.socket && req.socket.remoteAddress) || "unknown";
}

function hostOf(u) { try { return new URL(String(u)).host.toLowerCase(); } catch (e) { return ""; } }

/* true if the request looks like it comes from a page of our own site */
function originOk(req) {
  const h = (req && req.headers) || {};
  const host = String(h.host || h["x-forwarded-host"] || "").toLowerCase();
  const sfs = h["sec-fetch-site"];
  if (sfs) return sfs === "same-origin" || (sfs === "none" && req.method === "GET");
  /* GET only says whether the bot is on, nothing is spent */
  if (req.method === "GET") return true;
  /* old browsers without Sec-Fetch headers still send Origin (POST) or Referer */
  const o = hostOf(h.origin) || hostOf(h.referer);
  return !!o && !!host && o === host;
}

function deny(res, status, error) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify({ error: error }));
  return false;
}

/* opts: { perIp, windowSec, daily }  -> true if the request may go on; otherwise the answer was already sent */
async function check(req, res, name, opts) {
  const ip = clientIp(req), win = opts.windowSec || 600;
  const bucket = Math.floor(Date.now() / (win * 1000));
  const n = await incr("tz:" + name + ":ip:" + ip + ":" + bucket, win * 2);
  if (n > opts.perIp) return deny(res, 429, "slow_down");
  if (opts.daily > 0) {
    const day = new Date().toISOString().slice(0, 10);
    const d = await incr("tz:" + name + ":day:" + day, 172800);
    if (d > opts.daily) return deny(res, 503, "busy");
  }
  return true;
}

module.exports = { originOk, check, clientIp, _mem: mem, _redisConf: redisConf };
