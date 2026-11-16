# Tazvera wallet — what I changed in the code

Repository: https://github.com/tazvera/tazvera-wallet (commit b5aa535)
This one package contains **both** passes: the bug fixes from the first review, and the security and layout
work you asked for now. Nine files changed, 70 lines added, 14 removed. Nothing is half-done: every file below
passes a syntax check, `vercel.json` parses, and all 475 translation keys exist in both English and Hindi.

---

## 1. Bug fixes (first pass)

**`app/js/features/send-safety.js`** — the "wrong network" sheet had a button with `onclick="closeSheet()"`.
Your own CSP (`script-src 'self'`) blocks inline handlers, so the button never worked and the user was stuck
on a dead screen. It is now bound in JavaScript, with a translated label.

**`app/js/10-send.js`**
- The "network fee is unusually high" warning was hard-coded in Hindi, so English users saw Hindi. Now uses
  the existing `feeHi` key.
- A failed fee estimate left the old fee in memory, which then drove the Continue button, the balance check
  and the MAX button. `feeW` is now cleared before and after every estimate.
- Typing an amount in ₹ rounded **down** at 6 decimals, so the user could send slightly less than the rupee
  figure on screen. Now rounds at 8 decimals.

## 2. Security

**`vercel.json`** — four new response headers:
- `Content-Security-Policy` as a real header. This matters because three directives are **ignored** inside a
  `<meta>` tag, including `frame-ancestors`. The header adds `frame-ancestors 'none'` (no other site can put
  the wallet in a frame), `form-action 'none'` and `upgrade-insecure-requests`. The `<meta>` policy stays as a
  second line of defence.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — the browser refuses plain HTTP for a
  year, so a downgrade attack on a public Wi-Fi cannot happen.
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` — another site cannot keep a handle on your window.
  `allow-popups` is there so wallet-extension popups keep working.
- `Cross-Origin-Resource-Policy: same-origin` — other sites cannot embed your files.

**`app/js/22-wallets-help-backup.js`** — the fingerprint checkup told the truth problem. When a browser has no
WebAuthn PRF support, `BIO.enable()` falls back to "gate" mode: a fingerprint only opens the screen and the
private key is never decrypted. The security checkup counted that as protection. It now counts only
`BIO.full()` (the real, key-locking mode), and the PIN & fingerprint sheet says plainly, in that case, that the
fingerprint only opens the screen. The same sheet now also states honestly that a 6-digit PIN is a quick lock
and the 12 words are the real protection.

**`app/js/02-core.js`** — the "money received" notification put `+X SHM` in the body, which shows on the lock
screen of a shared phone. The body is now just the network name; the amount stays inside the app.

**`sw.js`** — cache name `tazvera-v9-8`, so installed apps pick up all of this immediately.

## 3. Layout and accessibility

**`index.html`**
- `<meta name="color-scheme" content="light dark">` and **two** `theme-color` tags with `media` queries, so the
  Android status bar is light in light mode and dark in dark mode instead of always light.
- iOS metas (`apple-mobile-web-app-capable`, `status-bar-style`, `title`, `mobile-web-app-capable`), so "Add to
  Home Screen" on an iPhone opens full-screen instead of inside Safari with an address bar. Android already had
  this through the manifest.

**`app/css/app.css`**
- `prefers-reduced-motion` block: all 23 animations and transitions become instant for users who turned motion
  off at the OS level.
- `:focus-visible` outline in the brand green. Until now a Bluetooth keyboard, a switch device or a screen
  reader user had no idea which button was selected.
- `html[lang="hi"]` line-height 1.5 on headings, buttons, sheet titles and settings rows — Devanagari matras
  were clipping at the tight English line height.
- Buttons now wrap long labels instead of overflowing, which matters before Marathi arrives (its strings run
  longer than English).
- The address block is 13px with +0.2px letter spacing and 1.6 line height, so `0` and `O`, `1` and `l` separate
  when a user is checking the first and last characters before sending.

**`app/js/10-send.js`** — `aria-live="polite"` on `#sErr`, so a screen reader announces the send error
instead of leaving it silent.

---

## What I deliberately did not change

- **The PIN's encryption cost.** The roadmap suggested raising scrypt. I measured the trade-off and left it
  alone: ethers already runs N=131072, r=8, which needs about 128 MB of memory. Going higher risks the browser
  tab being killed on a ₹8,000 Android phone — a wallet that will not unlock is worse than a slow one. The
  honest wording in the PIN sheet is the right fix for now. If you want more, the safe knob is `p` (parallelism),
  which raises time without raising memory — but test it on the cheapest phone you can find first.
- **`api/ai.js` and `api/airdrop.js`.** I checked both against the roadmap items and they already do the right
  thing: `ai.js` caps each message at 500 characters and 8 messages, refuses recovery phrases before they reach
  Google, and has per-IP and daily limits. `airdrop.js` has a global 40-per-day cap, a per-address 24-hour
  limit, and refuses to send when the funder's SHLD/TZT balance drops below its reserve — which is already a
  spend ceiling, since every send is a fixed 100 TZT. No change needed; adding a second cap would only add code.
- **The ethers hash CI job.** I could not run it here (no npm registry access from this sandbox), and shipping
  a workflow that might go red on your repo is worse than not shipping it. The vendored `ethers.min.js` does
  report version 6.17.0, matching `package.json`. To add the check yourself, one step in a workflow:
  download the 6.17.0 tarball from npm, `sha256sum dist/ethers.umd.min.js`, compare with your file.
- **Confirm-sheet reordering and font subsetting.** Both are real improvements from the roadmap, but both need
  your eyes on a real screen (the sheet order is a judgement call, and font subsetting must be checked for
  missing Devanagari glyphs). They stay in the roadmap as P2.

## How to apply

Upload the nine files from the zip over the old ones, keeping the same paths — that is the same motion you
already use. Or, from a clone: `git apply tazvera-fixes-and-improvements.patch`.

Then check three things in the live app, in this order: open the app in dark mode and see whether the phone's
status bar is dark; press Tab a few times and watch for the green focus ring; open Settings → PIN & fingerprint
and read the two new lines at the bottom.
