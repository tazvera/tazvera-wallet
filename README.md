# Tazvera Wallet

**A simple, self-custody crypto wallet for everyday payments, in Hindi and English.**

Your keys stay on your phone, locked by your PIN. No MetaMask needed. Built in the open by a solo founder from India.

- App: https://app.tazvera.com
- Website: https://tazvera.com
- X: [@TazveraApp](https://x.com/TazveraApp) · Telegram: [t.me/TazveraApp](https://t.me/TazveraApp) · Discord: [discord.gg/s2tjFdaCVN](https://discord.gg/s2tjFdaCVN)

> ⚠️ **Test version.** Tazvera runs on test networks only (Shardeum Testnet, BNB Testnet, Ethereum Sepolia). Test coins have no value. Nothing here is financial advice.

---

## What it does

- Create or import a wallet inside the app (12 words, encrypted with a 6-digit PIN)
- Send, receive and request coins, with QR codes and a confirm screen before every send
- PIN for every send, app lock, auto-lock and fingerprint unlock
- Market prices, price converter, price alarms, history, address book
- Built-in helper with ready-made answers in English, Hindi, Marathi and Gujarati
- Free **TZT** test token faucet on Shardeum Testnet

## Project structure

| Path | What it is |
|------|------------|
| `index.html` | The app page (installable web app) |
| `script.js` | App logic and UI. It grew in small "build" layers appended at the end, so it is long; careful refactoring is welcome |
| `style.css` | Base styles |
| `wallet.js` | In-app wallet: key encryption with the PIN, signing, test-network switching. Real-money networks are blocked here on purpose |
| `ethers.min.js`, `qrcode.min.js`, `jsqr.js` | Libraries (ethers v6, QR create, QR scan) |
| `logos.js` | Coin logos |
| `api/price.js` | Serverless function: SHM price from exchanges (KuCoin, MEXC, Gate) |
| `api/airdrop.js` | Serverless function: TZT faucet that pays the fee for the user |
| `web/` | The tazvera.com website (separate deployment) |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png` | Web app manifest and icons |
| `deploy-note.txt` | Small file used to trigger a redeploy |

Hosting: [Vercel](https://vercel.com). The app and the website are two Vercel projects deployed from this repository (the website uses `web/` as its root directory).

## Run it on your computer

No build step. It is plain HTML, CSS and JavaScript.

```bash
git clone https://github.com/tazvera/tazvera-wallet.git
cd tazvera-wallet
npx serve .
```

Then open the address it prints (for example `http://localhost:3000`).

Notes:
- The `api/` functions only run on Vercel (or with `vercel dev`). Without them, the app still works, but the SHM price and the free TZT faucet may not load.
- Use a **new test wallet** while developing. Never use a wallet that holds real money.

## Contracts (Shardeum Testnet, chain ID 8119)

| Name | Address |
|------|---------|
| TZT test token | `0xc75149e5C95a41b0a4c9E3378D5fc6aAAc2CC5F0` |
| TZT faucet | `0x02b9e35cd82E5c781097D2188B4334c2485438bC` |
| Airdrop | `0x623A0E7628f281236D1d81ca1aceeCedcC30443e` |

The TZT token and faucet contracts are verified on the Shardeum Explorer ✓ (MIT license).

## How to help

All help is welcome, big or small.

1. **Report a bug or idea:** open an [Issue](https://github.com/tazvera/tazvera-wallet/issues). Screenshots and steps to repeat it help a lot.
2. **Fix something:** fork the repo, make a small focused change, and open a Pull Request that explains what you changed and how you tested it.
3. **Good first areas:** cleaning up `script.js`, accessibility, translations (Hindi, Marathi, Gujarati), tests, and security review of `wallet.js`.

Please keep in mind:
- Keep pull requests small and about one thing.
- Do not add tracking, ads or third-party scripts.
- Never commit private keys, seed phrases, API keys or passwords.
- Anything that touches keys, signing or sending (`wallet.js`, send flow) gets extra careful review.

## Security

Found a security problem? Please **do not** open a public Issue. Email **contact@tazvera.com** with the details.

The Tazvera team will **never** ask for your 12 words, PIN, passwords or money. Anyone who does is a scammer.

## License

The code is released under the [MIT License](LICENSE).

The **Tazvera** name and the green T logo are not covered by this license. Please do not use them to present another app or token as Tazvera.

## Maintainer

Dattu Sonawane, founder ([@dattusonawane](https://x.com/dattusonawane))
