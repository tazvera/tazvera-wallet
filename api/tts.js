/* Tazvera wallet · api/tts.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
const guard = require("../lib/guard");
/* Server-side proxy for speech (Google Cloud Text-to-Speech) used by the "Tazvera Sahayyak" bot.
   The language is worked out from the text itself: English (en-IN), Hindi (hi-IN), Marathi (mr-IN) and the other
   Indian scripts (Bengali, Gujarati, Punjabi, Tamil, Telugu, Kannada, Malayalam, Odia) when Google has a voice for them.

   Rules this file follows:
   - The Google Cloud key lives ONLY in the Vercel environment variable TTS_API_KEY. Never in app/ files, never in Git.
   - If the key is missing the voice switches itself off (503); the bot keeps working as text.
   - Only plain text from the bot's own answer is spoken. Short, rate-limited, nothing stored.
   - The voice name is looked up from Google's own list for that language at run time, so no guessed voice names:
     best available of Neural2, WaveNet, Standard, in that order, for FEMALE (default) or MALE.
   - Nothing from Google's error text is shown to users.

   Environment variable:  TTS_API_KEY   (Google Cloud key, restricted to the Text-to-Speech API) */

const KEY = function () { return process.env.TTS_API_KEY || ""; };
const MAX_LEN = 600;
const ORDER = ["Neural2", "Wavenet", "Standard"];
const vcache = {}; /* language code -> { list, at } */
const SCRIPTS = [["bn-IN", /[\u0980-\u09FF]/g], ["pa-IN", /[\u0A00-\u0A7F]/g], ["gu-IN", /[\u0A80-\u0AFF]/g], ["or-IN", /[\u0B00-\u0B7F]/g], ["ta-IN", /[\u0B80-\u0BFF]/g], ["te-IN", /[\u0C00-\u0C7F]/g], ["kn-IN", /[\u0C80-\u0CFF]/g], ["ml-IN", /[\u0D00-\u0D7F]/g]];
const MR = /(^|[\s,.;:!?।(])(आहे|आहेत|नाही|आणि|तुम्ही|तुमचा|तुमची|तुमचे|तुमच्या|मला|करा|कसे|काय|मी|होतो|असेल)(?=$|[\s,.;:!?।)])/g;
const HI = /(^|[\s,.;:!?।(])(है|हैं|नहीं|और|आप|आपका|आपकी|करें|में|कृपया|मैं|क्या|यह|कैसे|होता)(?=$|[\s,.;:!?।)])/g;
/* language code from the text: script first, then Marathi vs Hindi by common words (Marathi wins a tie) */
function detect(t) {
  const dev = (t.match(/[\u0900-\u097F]/g) || []).length, lat = (t.match(/[A-Za-z]/g) || []).length;
  let best = null, bn = 0;
  for (const [code, re] of SCRIPTS) { const n = (t.match(re) || []).length; if (n > bn) { bn = n; best = code; } }
  if (bn > dev && bn > 0) return best;
  if (dev > 0 && dev >= lat / 2) return (t.match(HI) || []).length > (t.match(MR) || []).length ? "hi-IN" : "mr-IN";
  return "en-IN";
}

function send(res, status, obj) { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(obj)); }
const hits = new Map();
function limited(ip, max, win) {
  const now = Date.now(), a = (hits.get(ip) || []).filter(function (x) { return now - x < win; });
  if (a.length >= max) { hits.set(ip, a); return true; }
  a.push(now); hits.set(ip, a);
  if (hits.size > 5000) { for (const [k, v] of hits) { if (!v.length || now - v[v.length - 1] > win) hits.delete(k); } }
  return false;
}
function clientIp(req) {
  const x = String((req.headers && req.headers["x-forwarded-for"]) || "").split(",")[0].trim();
  return x || (req.socket && req.socket.remoteAddress) || "";
}
async function gfetch(url, init) {
  const ac = new AbortController(), tm = setTimeout(function () { ac.abort(); }, 15000);
  try {
    const r = await fetch(url, Object.assign({}, init, { signal: ac.signal, headers: Object.assign({ "X-Goog-Api-Key": KEY() }, (init && init.headers) || {}) }));
    if (!r.ok) {
      let why = ""; try { why = (await r.text()).replace(/\s+/g, " ").slice(0, 300); } catch (e) { /* ignore */ }
      console.error("[tts] Google HTTP " + r.status + " " + why); /* server log only */
      return null;
    }
    return await r.json();
  } catch (e) { console.error("[tts] request failed: " + String(e && e.message || e).slice(0, 200)); return null; } finally { clearTimeout(tm); }
}
/* pick a voice for the gender from Google's own mr-IN list */
function pick(list, gender, lang) {
  const mine = list.filter(function (v) { return v && typeof v.name === "string" && v.name.indexOf(lang + "-") === 0 && v.ssmlGender === gender; });
  for (const t of ORDER) {
    const m = mine.filter(function (v) { return v.name.indexOf("-" + t + "-") > 0; }).sort(function (a, b) { return a.name < b.name ? -1 : 1; })[0];
    if (m) return m.name;
  }
  return null;
}
async function voiceFor(gender, lang) {
  const c = vcache[lang];
  if (!c || Date.now() - c.at > 6 * 3600 * 1000) {
    const j = await gfetch("https://texttospeech.googleapis.com/v1/voices?languageCode=" + lang, { method: "GET" });
    if (!j || !Array.isArray(j.voices)) return c ? pick(c.list, gender, lang) || pick(c.list, gender === "MALE" ? "FEMALE" : "MALE", lang) : false; /* false = Google could not be asked */
    vcache[lang] = { list: j.voices, at: Date.now() };
  }
  const l = vcache[lang].list;
  return pick(l, gender, lang) || pick(l, gender === "MALE" ? "FEMALE" : "MALE", lang);
}
function clean(s) { /* plain speakable text: no markdown marks, no links */
  return String(s || "").replace(/https?:\/\/\S+/g, " ").replace(/[*_`#>~|]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_LEN);
}

module.exports = async function handler(req, res) {
  /* Only our own app may use this (stops other websites from spending our free Google quota). */
  if (!guard.originOk(req)) { res.statusCode = 403; res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify({ error: "not_allowed" })); }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method === "GET") return send(res, 200, { enabled: !!KEY() });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!KEY()) return send(res, 503, { error: "not_configured" });
  if (!(await guard.check(req, res, "tts", { perIp: 15, windowSec: 600, daily: Number(process.env.TTS_DAILY_MAX) || 800 }))) return;
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  b = b && typeof b === "object" ? b : {};
  const text = clean(b.text), gender = b.gender === "MALE" ? "MALE" : "FEMALE";
  if (!text) return send(res, 400, { error: "bad_request" });
  const lang = detect(text);
  const name = await voiceFor(gender, lang);
  if (name === false) return send(res, 502, { error: "upstream" });
  if (!name) return send(res, 422, { error: "no_voice", lang: lang });
  const j = await gfetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text: text }, voice: { languageCode: lang, name: name }, audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 } })
  });
  if (!j || typeof j.audioContent !== "string" || !/^[A-Za-z0-9+/=]+$/.test(j.audioContent)) return send(res, 502, { error: "upstream" });
  return send(res, 200, { audio: j.audioContent, voice: name, lang: lang });
};
module.exports._pick = pick; module.exports._clean = clean; module.exports._detect = detect; /* for tests */
