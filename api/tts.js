/* Tazvera wallet · api/tts.js · MIT License · https://github.com/tazvera/tazvera-wallet */
"use strict";
/* Server-side proxy for Marathi speech (Google Cloud Text-to-Speech) used by the "Tazvera Sahayyak" bot.

   Rules this file follows:
   - The Google Cloud key lives ONLY in the Vercel environment variable TTS_API_KEY. Never in app/ files, never in Git.
   - If the key is missing the voice switches itself off (503); the bot keeps working as text.
   - Only plain text from the bot's own answer is spoken. Short, rate-limited, nothing stored.
   - The voice name is looked up from Google's own list (mr-IN) at run time, so no guessed voice names:
     best available of Neural2, WaveNet, Standard, in that order, for FEMALE (default) or MALE.
   - Nothing from Google's error text is shown to users.

   Environment variable:  TTS_API_KEY   (Google Cloud key, restricted to the Text-to-Speech API) */

const KEY = function () { return process.env.TTS_API_KEY || ""; };
const MAX_LEN = 600;
const ORDER = ["Neural2", "Wavenet", "Standard"];
let voices = null, voicesAt = 0;

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
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; } finally { clearTimeout(tm); }
}
/* pick a voice for the gender from Google's own mr-IN list */
function pick(list, gender) {
  const mine = list.filter(function (v) { return v && typeof v.name === "string" && /^mr-IN-/.test(v.name) && v.ssmlGender === gender; });
  for (const t of ORDER) {
    const m = mine.filter(function (v) { return v.name.indexOf("-" + t + "-") > 0; }).sort(function (a, b) { return a.name < b.name ? -1 : 1; })[0];
    if (m) return m.name;
  }
  return null;
}
async function voiceFor(gender) {
  if (!voices || Date.now() - voicesAt > 6 * 3600 * 1000) {
    const j = await gfetch("https://texttospeech.googleapis.com/v1/voices?languageCode=mr-IN", { method: "GET" });
    if (!j || !Array.isArray(j.voices)) return null;
    voices = j.voices; voicesAt = Date.now();
  }
  return pick(voices, gender) || pick(voices, gender === "MALE" ? "FEMALE" : "MALE");
}
function clean(s) { /* plain speakable text: no markdown marks, no links */
  return String(s || "").replace(/https?:\/\/\S+/g, " ").replace(/[*_`#>~|]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_LEN);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method === "GET") return send(res, 200, { enabled: !!KEY() });
  if (req.method !== "POST") return send(res, 405, { error: "method" });
  if (!KEY()) return send(res, 503, { error: "not_configured" });
  if (limited(clientIp(req), 15, 600000)) return send(res, 429, { error: "slow_down" });
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  b = b && typeof b === "object" ? b : {};
  const text = clean(b.text), gender = b.gender === "MALE" ? "MALE" : "FEMALE";
  if (!text) return send(res, 400, { error: "bad_request" });
  const name = await voiceFor(gender);
  if (!name) return send(res, 502, { error: "no_voice" });
  const j = await gfetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text: text }, voice: { languageCode: "mr-IN", name: name }, audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 } })
  });
  if (!j || typeof j.audioContent !== "string" || !/^[A-Za-z0-9+/=]+$/.test(j.audioContent)) return send(res, 502, { error: "upstream" });
  return send(res, 200, { audio: j.audioContent, voice: name });
};
module.exports._pick = pick; module.exports._clean = clean; /* for tests */
