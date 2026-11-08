# Contributing to Tazvera

Thank you for helping! Tazvera is a free, open-source, self-custody crypto wallet in Hindi and English, made for first-time crypto users in India. **App:** https://app.tazvera.com · **Website:** https://tazvera.com

## Why contribute

- **Public proof of your work:** every merged pull request stays on your GitHub profile. Recruiters look at GitHub.
- **A real, live product:** a wallet used on a real blockchain, not a classroom project. Something real to talk about in interviews.
- **Learn Web3 the safe way:** keys, signing, transactions, scam protection, testing.
- **Real code review:** every pull request gets feedback before it is merged.
- **A thank-you:** your name in the credits, a public thank-you from the founder on X/LinkedIn, and (for "TZV reward" issues) a thank-you in TZV. A certificate of contribution on request.

## Start in 5 steps

1. Pick an issue labelled **good first issue**: https://github.com/tazvera/tazvera-wallet/contribute
2. Comment "I would like to work on this" so others know.
3. **Fork** the repository and make your change on a new branch.
4. Test it in your browser: open `index.html` with any small local server (for example `npx serve .`), create a **test wallet**, and use **test networks only**.
5. Open a **pull request** that says which issue it solves (`Fixes #12`), with a screenshot if the screen changed.

Every pull request is reviewed before it is merged.

## Where things are

| Folder / file | What it is |
|---|---|
| `index.html`, `app/js/`, `app/css/` | The wallet app (files load in number order: `00-config.js` → `30-render-boot.js`) |
| `app/js/01-i18n.js` | All English and Hindi text |
| `wallet.js` | The in-app wallet engine (keys stay on the phone, locked by the PIN) |
| `api/` | Small server functions (price, assistant, test-coin faucet) |
| `web/` | The website tazvera.com |
| `contracts/` | TZV token and lock contracts (deployed; cannot be changed) |

## Rules

- **Test networks only.** Never use real money or real wallets while testing.
- Never commit keys, passwords or 12-word phrases.
- Keep text in **both** English and Hindi (`L.en` and `L.hi`).
- Security problems: report privately, see [SECURITY.md](SECURITY.md).

## About the TZV thank-you

Merged pull requests for issues labelled **TZV reward** receive a thank-you in **TZV**, Tazvera's own token, from the developer reward pool. TZV is **not for sale and has no market price**; it is a thank-you and a record of your contribution, not a salary. 

---

**हिंदी में:** असली फ़ायदा: आपका काम GitHub प्रोफ़ाइल पर हमेशा दिखेगा, असली प्रोजेक्ट का अनुभव, Web3 सीखना, और हर PR पर समीक्षा। "good first issue" वाला काम चुनिए, fork करके बदलाव कीजिए, सिर्फ़ टेस्ट नेटवर्क पर जाँचिए, और pull request भेजिए। स्वीकार होने पर TZV इनाम (धन्यवाद का टोकन) और प्रमाणपत्र।
